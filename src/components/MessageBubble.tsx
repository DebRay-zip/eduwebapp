
import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
      }`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>
      
      <div className={`max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-lg ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white' 
            : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          {message.imageUrl && (
            <div className="mt-3">
              <img 
                src={message.imageUrl} 
                alt="Generated image" 
                className="max-w-full h-auto rounded-lg border border-white/20"
                onError={(e) => {
                  console.error('Failed to load image:', message.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
