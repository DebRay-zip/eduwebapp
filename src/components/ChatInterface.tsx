import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Settings, Loader2, BookOpen, PenTool, Image, Lightbulb, Calculator, Globe, Microscope, Palette, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MessageBubble from './MessageBubble';
import ApiKeyModal from './ApiKeyModal';
import InteractiveSuggestions from './InteractiveSuggestions';
import TypingIndicator from './TypingIndicator';
import { ImageGenerationService } from '../services/imageGeneration';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
  isImageGeneration?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyAQTZ59qjaSdtmlR6Ft33BrPWQ4kb6zUtY');
  const [googleCloudApiKey, setGoogleCloudApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<string>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('classroom-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('classroom-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

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
        setCurrentSubject(subject);
        return subject;
      }
    }
    return 'general';
  };

  const quickActions = [
    { icon: Calculator, label: 'Math Help', prompt: 'Help me solve a math problem' },
    { icon: Microscope, label: 'Science', prompt: 'Explain a science concept' },
    { icon: Globe, label: 'Geography', prompt: 'Teach me about world geography' },
    { icon: BookOpen, label: 'Literature', prompt: 'Analyze a piece of literature' },
    { icon: Palette, label: 'Art History', prompt: 'Tell me about famous artists' },
    { icon: Music, label: 'Music Theory', prompt: 'Explain music theory basics' },
  ];

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const isImageGenerationRequest = (message: string) => {
    const trimmedMessage = message.trim();
    return trimmedMessage.startsWith('image/');
  };

  const extractImagePrompt = (message: string) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.startsWith('image/')) {
      return trimmedMessage.slice(6).trim();
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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setIsTyping(true);
    
    if (isImageGenerationRequest(inputMessage)) {
      const imagePrompt = extractImagePrompt(inputMessage);
      if (!imagePrompt) {
        toast({
          title: 'Error',
          description: 'Please provide a prompt for image generation',
          variant: 'destructive',
        });
        setIsTyping(false);
        return;
      }
      setInputMessage('');
      await generateImage(imagePrompt);
      setIsTyping(false);
      return;
    }

    if (!apiKey) {
      setShowApiModal(true);
      setIsTyping(false);
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

    // Detect subject for future suggestions
    detectSubject(inputMessage);

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
      setIsTyping(false);
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
    setCurrentSubject('general');
    localStorage.removeItem('classroom-chat-messages');
    toast({
      title: 'Board cleared',
      description: 'All messages have been erased from the chalkboard.',
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
              Your Interactive AI Teacher
            </p>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.prompt)}
              className="flex items-center gap-2 px-3 py-2 bg-amber-100/20 rounded-lg backdrop-blur-sm hover:bg-amber-100/30 transition-colors"
            >
              <action.icon className="text-amber-200" size={16} />
              <span className="text-amber-200 text-sm">{action.label}</span>
            </button>
          ))}
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
              <span className="px-2 py-1 bg-green-100 rounded-full">
                📚 {currentSubject === 'general' ? 'Ready to Learn' : `Studying ${currentSubject}`}
              </span>
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
                Ready to explore, learn, and discover? Click a suggestion or ask me anything!
              </p>
              
              <InteractiveSuggestions 
                currentSubject={currentSubject}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {/* Interactive suggestions after messages */}
              {messages.length > 0 && !isLoading && !isTyping && (
                <div className="mt-6">
                  <InteractiveSuggestions 
                    currentSubject={currentSubject}
                    onSuggestionClick={handleSuggestionClick}
                    compact={true}
                  />
                </div>
              )}
            </>
          )}
          
          {(isLoading || isTyping) && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area with classroom styling */}
        <div className="p-4 border-t-2 border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your teacher a question or request a diagram 📝"
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
            💡 Tip: Click suggestions above or use quick actions for instant help! Use "image/" to generate educational images.
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
