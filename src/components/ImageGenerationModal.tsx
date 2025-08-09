
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
}

const ImageGenerationModal = ({ isOpen, onClose, onGenerate }: ImageGenerationModalProps) => {
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt for image generation',
        variant: 'destructive',
      });
      return;
    }

    onGenerate(prompt);
    setPrompt('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="text-purple-400" size={20} />
            AI Image Generation
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Generate images using AI with Pollinations.ai - completely free, no API key required!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt" className="text-white">
              Image Prompt
            </Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="bg-slate-800 border-slate-600 text-white mt-1"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
            <h4 className="font-medium text-white mb-2">About Pollinations.ai:</h4>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Completely free to use</li>
              <li>No API key or registration required</li>
              <li>Powered by open-source AI models</li>
              <li>High-quality image generation</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              Generate Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationModal;
