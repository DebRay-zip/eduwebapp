import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Settings, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MessageBubble from './MessageBubble';
import ApiKeyModal from './ApiKeyModal';
import { ImageGenerationService } from '../services/imageGeneration';
import { VideoGenerationService } from '../services/videoGeneration';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
  videoUrl?: string;
  isImageGeneration?: boolean;
  isVideoGeneration?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyAQTZ59qjaSdtmlR6Ft33BrPWQ4kb6zUtY');
  const [showApiModal, setShowApiModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isImageGenerationRequest = (message: string) => {
    const lowerMessage = message.toLowerCase().trim();
    return lowerMessage.startsWith('/image ') || 
           lowerMessage.startsWith('generate image:') || 
           lowerMessage.startsWith('create image:') ||
           lowerMessage.startsWith('make image:');
  };

  const isVideoGenerationRequest = (message: string) => {
    const lowerMessage = message.toLowerCase().trim();
    return lowerMessage.startsWith('/video ') || 
           lowerMessage.startsWith('learn about ') ||
           lowerMessage.startsWith('teach me about ') ||
           lowerMessage.startsWith('explain ') ||
           lowerMessage.startsWith('create video:') ||
           lowerMessage.startsWith('generate video:');
  };

  const extractImagePrompt = (message: string) => {
    const lowerMessage = message.toLowerCase().trim();
    if (lowerMessage.startsWith('/image ')) {
      return message.slice(7).trim();
    } else if (lowerMessage.startsWith('generate image:')) {
      return message.slice(15).trim();
    } else if (lowerMessage.startsWith('create image:')) {
      return message.slice(13).trim();
    } else if (lowerMessage.startsWith('make image:')) {
      return message.slice(11).trim();
    }
    return message;
  };

  const extractVideoPrompt = (message: string) => {
    const lowerMessage = message.toLowerCase().trim();
    if (lowerMessage.startsWith('/video ')) {
      return message.slice(7).trim();
    } else if (lowerMessage.startsWith('learn about ')) {
      return message.slice(12).trim();
    } else if (lowerMessage.startsWith('teach me about ')) {
      return message.slice(15).trim();
    } else if (lowerMessage.startsWith('explain ')) {
      return message.slice(8).trim();
    } else if (lowerMessage.startsWith('create video:')) {
      return message.slice(13).trim();
    } else if (lowerMessage.startsWith('generate video:')) {
      return message.slice(15).trim();
    }
    return message;
  };

  const generateImage = async (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Generate image: ${prompt}`,
      role: 'user',
      timestamp: new Date(),
      isImageGeneration: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const imageService = new ImageGenerationService();
      const result = await imageService.generateImage({ prompt });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Generated image for: ${prompt}`,
        role: 'assistant',
        timestamp: new Date(),
        imageUrl: result.imageURL,
        isImageGeneration: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast({
        title: 'Image generated',
        description: 'Your image has been generated successfully!',
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateVideo = async (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Generate educational video: ${prompt}`,
      role: 'user',
      timestamp: new Date(),
      isVideoGeneration: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const videoService = new VideoGenerationService();
      const result = await videoService.generateVideo({ prompt });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Generated educational video about: ${prompt}`,
        role: 'assistant',
        timestamp: new Date(),
        videoUrl: result.videoURL,
        isVideoGeneration: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast({
        title: 'Video generated',
        description: 'Your educational video has been generated successfully!',
      });
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Check if this is a video generation request
    if (isVideoGenerationRequest(inputMessage)) {
      const videoPrompt = extractVideoPrompt(inputMessage);
      if (!videoPrompt) {
        toast({
          title: 'Error',
          description: 'Please provide a topic for video generation',
          variant: 'destructive',
        });
        return;
      }
      setInputMessage('');
      await generateVideo(videoPrompt);
      return;
    }

    // Check if this is an image generation request
    if (isImageGenerationRequest(inputMessage)) {
      const imagePrompt = extractImagePrompt(inputMessage);
      if (!imagePrompt) {
        toast({
          title: 'Error',
          description: 'Please provide a prompt for image generation',
          variant: 'destructive',
        });
        return;
      }
      setInputMessage('');
      await generateImage(imagePrompt);
      return;
    }

    // Regular chat message
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: inputMessage
            }]
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API');
      }

      const data = await response.json();
      const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from AI. Please check your API key and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: 'Chat cleared',
      description: 'All messages have been removed.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <Bot className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiModal(true)}
              className="text-white hover:bg-white/10"
            >
              <Settings size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-white hover:bg-white/10"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="text-blue-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-slate-300">Ask me anything! I'm powered by Google's Gemini AI.</p>
              <div className="text-slate-400 text-sm mt-2 space-y-1">
                <p>Generate images: <span className="font-mono">/image [your prompt]</span></p>
                <p>Learn topics: <span className="font-mono">learn about [topic]</span> or <span className="font-mono">/video [topic]</span></p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-300">
              <Loader2 className="animate-spin" size={16} />
              <span>AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/20">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message, '/image [prompt]' for images, or 'learn about [topic]' for videos..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </div>
      </Card>

      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
      />
    </div>
  );
};

export default ChatInterface;
