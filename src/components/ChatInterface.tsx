import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Settings, Loader2, BookOpen, PenTool, Video, Image } from 'lucide-react';
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
  const [googleCloudApiKey, setGoogleCloudApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectEducationLevel = (prompt: string): 'elementary' | 'middle' | 'high' | 'college' | 'adult' => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('elementary') || lowerPrompt.includes('kids') || lowerPrompt.includes('children')) return 'elementary';
    if (lowerPrompt.includes('middle school') || lowerPrompt.includes('junior high')) return 'middle';
    if (lowerPrompt.includes('high school') || lowerPrompt.includes('teenager')) return 'high';
    if (lowerPrompt.includes('college') || lowerPrompt.includes('university') || lowerPrompt.includes('undergraduate')) return 'college';
    return 'adult';
  };

  const detectImageType = (prompt: string): 'diagram' | 'illustration' | 'infographic' | 'chart' | 'concept' => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('diagram') || lowerPrompt.includes('flowchart')) return 'diagram';
    if (lowerPrompt.includes('infographic') || lowerPrompt.includes('statistics')) return 'infographic';
    if (lowerPrompt.includes('chart') || lowerPrompt.includes('graph') || lowerPrompt.includes('data')) return 'chart';
    if (lowerPrompt.includes('concept') || lowerPrompt.includes('abstract')) return 'concept';
    return 'illustration';
  };

  const detectSubject = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    const subjects = ['math', 'science', 'history', 'english', 'art', 'music', 'physics', 'chemistry', 'biology', 'geography', 'literature', 'computer science', 'programming'];
    
    for (const subject of subjects) {
      if (lowerPrompt.includes(subject)) {
        return subject;
      }
    }
    return 'general';
  };

  const isImageGenerationRequest = (message: string) => {
    const lowerMessage = message.toLowerCase().trim();
    return lowerMessage.startsWith('/image ') || 
           lowerMessage.startsWith('generate image:') || 
           lowerMessage.startsWith('create image:') ||
           lowerMessage.startsWith('make image:') ||
           lowerMessage.startsWith('diagram of ') ||
           lowerMessage.startsWith('illustration of ') ||
           lowerMessage.startsWith('infographic about ');
  };

  const isVideoGenerationRequest = (message: string) => {
    const lowerMessage = message.toLowerCase().trim();
    return lowerMessage.startsWith('/video ') || 
           lowerMessage.startsWith('learn about ') ||
           lowerMessage.startsWith('teach me about ') ||
           lowerMessage.startsWith('explain ') ||
           lowerMessage.startsWith('create video:') ||
           lowerMessage.startsWith('generate video:') ||
           lowerMessage.startsWith('tutorial on ') ||
           lowerMessage.startsWith('lesson about ');
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
      content: `Generate educational image: ${prompt}`,
      role: 'user',
      timestamp: new Date(),
      isImageGeneration: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const imageService = new ImageGenerationService();
      
      const educationLevel = detectEducationLevel(prompt);
      const imageType = detectImageType(prompt);
      
      const result = await imageService.generateImage({ 
        prompt,
        educationLevel,
        imageType
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Generated educational ${imageType} for: ${prompt}`,
        role: 'assistant',
        timestamp: new Date(),
        imageUrl: result.imageURL,
        isImageGeneration: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast({
        title: 'Educational image generated',
        description: 'Your educational image has been created successfully!',
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate educational image. Please try again.',
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
      
      const educationLevel = detectEducationLevel(prompt);
      const subject = detectSubject(prompt);
      
      const result = await videoService.generateVideo({ 
        prompt,
        apiKey: googleCloudApiKey || undefined,
        educationLevel,
        subject
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Generated educational video about: ${prompt} (${educationLevel} level)${!googleCloudApiKey ? ' (using free service)' : ' (using Google Veo)'}`,
        role: 'assistant',
        timestamp: new Date(),
        videoUrl: result.videoURL,
        isVideoGeneration: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast({
        title: 'Educational video generated',
        description: 'Your educational video has been created successfully!',
      });
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate educational video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
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
    <div className="max-w-5xl mx-auto">
      {/* Classroom Header with chalkboard feel */}
      <div className="mb-6 p-6 bg-gradient-to-r from-green-800 to-green-900 rounded-lg shadow-lg border-4 border-amber-600">
        <div className="flex items-center justify-center gap-4 text-center">
          <div className="p-3 bg-amber-100 rounded-full shadow-md">
            <BookOpen className="text-green-800" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-100 mb-2 font-serif">
              🍎 Virtual Classroom Assistant
            </h1>
            <p className="text-amber-200 text-lg">
              Your AI Teacher for Interactive Learning
            </p>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100/20 rounded-lg backdrop-blur-sm">
            <Image className="text-amber-200" size={16} />
            <span className="text-amber-200 text-sm">Visual Learning</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100/20 rounded-lg backdrop-blur-sm">
            <Video className="text-amber-200" size={16} />
            <span className="text-amber-200 text-sm">Video Lessons</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100/20 rounded-lg backdrop-blur-sm">
            <PenTool className="text-amber-200" size={16} />
            <span className="text-amber-200 text-sm">Interactive Chat</span>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-xl">
        {/* Header with classroom controls */}
        <div className="flex items-center justify-between p-4 border-b-2 border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-700 rounded-full">
              <Bot className="text-amber-100" size={20} />
            </div>
            <h2 className="text-xl font-bold text-green-800 font-serif">Teacher AI</h2>
            <div className="hidden sm:flex items-center gap-2 text-sm text-green-700">
              <span className="px-2 py-1 bg-green-100 rounded-full">📚 Ready to Learn</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiModal(true)}
              className="text-green-700 hover:bg-amber-200/50 border border-amber-300"
            >
              <Settings size={16} />
              <span className="hidden sm:inline ml-1">Settings</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-green-700 hover:bg-amber-200/50 border border-amber-300"
            >
              Clear Board
            </Button>
          </div>
        </div>

        {/* Main chat area with classroom styling */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-amber-25 to-orange-25">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-6 bg-white rounded-full shadow-lg mb-4 border-4 border-amber-300">
                <BookOpen className="text-green-700" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-3 font-serif">Welcome to Class! 🎓</h3>
              <p className="text-green-700 text-lg mb-4 max-w-md">
                Ready to explore, learn, and discover? Ask me anything!
              </p>
              
              {/* Educational prompts in classroom style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 w-full max-w-2xl">
                <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="text-blue-600" size={20} />
                    <span className="font-semibold text-blue-800">Visual Learning</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Create educational diagrams and illustrations</p>
                  <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700">
                    "diagram of photosynthesis"
                  </code>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="text-purple-600" size={20} />
                    <span className="font-semibold text-purple-800">Video Lessons</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Generate educational video content</p>
                  <code className="text-xs bg-purple-50 px-2 py-1 rounded text-purple-700">
                    "teach me about algebra"
                  </code>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-green-500 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <PenTool className="text-green-600" size={20} />
                    <span className="font-semibold text-green-800">Interactive Discussion</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Ask questions about any educational topic</p>
                  <div className="flex flex-wrap gap-2">
                    <code className="text-xs bg-green-50 px-2 py-1 rounded text-green-700">
                      "How does gravity work?"
                    </code>
                    <code className="text-xs bg-green-50 px-2 py-1 rounded text-green-700">
                      "Explain Shakespeare"
                    </code>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          {isLoading && (
            <div className="flex items-center justify-center gap-3 p-4 bg-white/80 rounded-lg shadow-md border border-amber-200">
              <Loader2 className="animate-spin text-green-600" size={20} />
              <span className="text-green-700 font-medium">Teacher is preparing your lesson...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area with classroom styling */}
        <div className="p-4 border-t-2 border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your teacher a question, request a diagram, or say 'teach me about...' 📝"
              className="flex-1 bg-white border-2 border-amber-300 text-green-800 placeholder:text-green-600/70 focus:border-green-500 focus:ring-green-500 rounded-lg text-base py-3"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg shadow-md border border-green-800 font-medium"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Send size={18} />
                  <span className="hidden sm:inline ml-2">Ask</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-green-600 mt-2 text-center">
            💡 Tip: Content automatically adapts to different education levels
          </p>
        </div>
      </Card>

      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
        googleCloudApiKey={googleCloudApiKey}
        onSaveGoogleCloud={setGoogleCloudApiKey}
      />
    </div>
  );
};

export default ChatInterface;
