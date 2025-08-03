
import React from 'react';
import ChatInterface from '../components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Agent Chat
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Connect with powerful AI models like Gemini and experience intelligent conversations
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
