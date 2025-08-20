
import React from 'react';
import ChatInterface from '../components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      {/* Classroom-style header pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4 border-4 border-amber-300">
            <span className="text-4xl">🏫</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 bg-clip-text text-transparent font-serif">
            AI Learning Academy
          </h1>
          <p className="text-xl md:text-2xl text-green-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Step into your personalized classroom where AI meets education. 
            <br className="hidden md:block" />
            <span className="text-amber-700">Learn, explore, and discover with your virtual teacher! 📚✨</span>
          </p>
          
          {/* Educational badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="px-4 py-2 bg-blue-100 rounded-full border-2 border-blue-300 shadow-sm">
              <span className="text-blue-700 font-medium text-sm">🎨 Visual Learning</span>
            </div>
            <div className="px-4 py-2 bg-purple-100 rounded-full border-2 border-purple-300 shadow-sm">
              <span className="text-purple-700 font-medium text-sm">🎬 Interactive Videos</span>
            </div>
            <div className="px-4 py-2 bg-green-100 rounded-full border-2 border-green-300 shadow-sm">
              <span className="text-green-700 font-medium text-sm">💬 Smart Tutoring</span>
            </div>
            <div className="px-4 py-2 bg-orange-100 rounded-full border-2 border-orange-300 shadow-sm">
              <span className="text-orange-700 font-medium text-sm">📈 Adaptive Learning</span>
            </div>
          </div>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
