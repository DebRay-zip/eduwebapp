
import React from 'react';
import { User, Bot, GraduationCap } from 'lucide-react';
import { Message } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-300' 
          : 'bg-gradient-to-br from-green-600 to-green-700 border-green-400'
      }`}>
        {isUser ? (
          <GraduationCap size={18} className="text-white" />
        ) : (
          <Bot size={18} className="text-white" />
        )}
      </div>
      
      <div className={`max-w-[75%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-4 rounded-xl shadow-lg border-2 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900' 
            : 'bg-white border-amber-200 text-green-800'
        }`}>
          {/* Message type indicator */}
          {message.isImageGeneration && (
            <div className="text-xs font-semibold mb-2 px-2 py-1 rounded-full inline-block bg-purple-100 text-purple-700">
              🎨 Visual Learning
            </div>
          )}
          
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          
          {message.imageUrl && (
            <div className="mt-4 p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <img 
                src={message.imageUrl} 
                alt="Educational content"
                className="max-w-full h-auto rounded-lg shadow-md border border-purple-300"
                onError={(e) => {
                  console.error('Failed to load image:', message.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs text-purple-600 mt-2 text-center font-medium">
                📚 Educational Visual Content
              </p>
            </div>
          )}
          
        </div>
        
        <div className={`text-xs mt-2 flex items-center gap-2 ${
          isUser ? 'justify-end text-blue-600' : 'justify-start text-green-600'
        }`}>
          <span>{isUser ? '👨‍🎓 Student' : '👩‍🏫 Teacher'}</span>
          <span>•</span>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
