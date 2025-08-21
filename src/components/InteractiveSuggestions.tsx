
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calculator, Microscope, Globe, BookOpen, Palette, Music, Brain, Lightbulb, Zap, Star } from 'lucide-react';

interface InteractiveSuggestionsProps {
  currentSubject: string;
  onSuggestionClick: (suggestion: string) => void;
  compact?: boolean;
}

const InteractiveSuggestions = ({ currentSubject, onSuggestionClick, compact = false }: InteractiveSuggestionsProps) => {
  const getSubjectSuggestions = (subject: string) => {
    const suggestions = {
      math: [
        { icon: Calculator, text: "Solve this algebra equation", prompt: "Help me solve: 2x + 5 = 15" },
        { icon: Brain, text: "Explain calculus basics", prompt: "Explain the basics of calculus in simple terms" },
        { icon: Zap, text: "Quick math quiz", prompt: "Give me a fun math quiz appropriate for my level" },
      ],
      science: [
        { icon: Microscope, text: "How photosynthesis works", prompt: "Explain how photosynthesis works with a diagram" },
        { icon: Lightbulb, text: "Fun science experiment", prompt: "Suggest a safe science experiment I can do at home" },
        { icon: Star, text: "Solar system facts", prompt: "Tell me fascinating facts about our solar system" },
      ],
      history: [
        { icon: BookOpen, text: "Ancient civilizations", prompt: "Tell me about ancient Egyptian civilization" },
        { icon: Globe, text: "World War timeline", prompt: "Create a timeline of major World War II events" },
        { icon: Star, text: "Historical figures", prompt: "Tell me about influential historical figures" },
      ],
      art: [
        { icon: Palette, text: "Famous artists", prompt: "Tell me about Leonardo da Vinci's artistic techniques" },
        { icon: Lightbulb, text: "Art movements", prompt: "Explain the Renaissance art movement" },
        { icon: Brain, text: "Color theory", prompt: "Teach me about color theory in art" },
      ],
      music: [
        { icon: Music, text: "Music theory basics", prompt: "Explain basic music theory concepts" },
        { icon: Star, text: "Famous composers", prompt: "Tell me about classical music composers" },
        { icon: Zap, text: "Instrument families", prompt: "Explain the different families of musical instruments" },
      ],
      general: [
        { icon: Calculator, text: "Math problem solving", prompt: "Help me with a math problem" },
        { icon: Microscope, text: "Science concepts", prompt: "Explain a science concept" },
        { icon: Globe, text: "World geography", prompt: "Teach me about world geography" },
        { icon: BookOpen, text: "Literature analysis", prompt: "Help me analyze a poem or story" },
        { icon: Palette, text: "Art history", prompt: "Tell me about famous artists" },
        { icon: Music, text: "Music education", prompt: "Teach me about music theory" },
      ]
    };

    return suggestions[subject as keyof typeof suggestions] || suggestions.general;
  };

  const suggestions = getSubjectSuggestions(currentSubject);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-green-700 font-medium mb-2 w-full text-center">
          💡 Try asking about:
        </span>
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className="bg-white/80 border-amber-300 text-green-700 hover:bg-amber-50 hover:border-green-400 text-xs"
          >
            <suggestion.icon size={14} className="mr-1" />
            {suggestion.text}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <div className="md:col-span-3 text-center mb-2">
        <h4 className="text-lg font-semibold text-green-800 mb-2">
          🌟 Interactive Learning Suggestions
        </h4>
        <p className="text-sm text-green-600">
          Click any card below to start learning!
        </p>
      </div>
      
      {suggestions.map((suggestion, index) => (
        <Card
          key={index}
          className="p-4 bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border-2 border-amber-200 hover:border-green-300 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          onClick={() => onSuggestionClick(suggestion.prompt)}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
              <suggestion.icon className="text-green-600" size={20} />
            </div>
            <span className="font-semibold text-green-800 text-sm">
              {suggestion.text}
            </span>
          </div>
          <p className="text-xs text-green-600 italic">
            "{suggestion.prompt}"
          </p>
          <div className="flex justify-end mt-2">
            <span className="text-xs text-amber-600 font-medium">
              Click to try →
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InteractiveSuggestions;
