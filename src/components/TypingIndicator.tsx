
import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 bg-gradient-to-br from-green-600 to-green-700 border-green-400">
        <Bot size={18} className="text-white" />
      </div>
      
      <div className="max-w-[75%]">
        <div className="inline-block p-4 rounded-xl shadow-lg border-2 bg-white border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-green-700 font-medium">Teacher is thinking</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-1">
            📚 Preparing your personalized lesson...
          </p>
        </div>
        
        <div className="text-xs mt-2 flex items-center gap-2 justify-start text-green-600">
          <span>👩‍🏫 Teacher</span>
          <span>•</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
