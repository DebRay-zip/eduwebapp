
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
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
  onGenerate: (prompt: string) => void;
}

const ImageGenerationModal = ({ isOpen, onClose, apiKey, onSave, onGenerate }: ImageGenerationModalProps) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();

  const handleSaveKey = () => {
    if (!tempKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive',
      });
      return;
    }

    onSave(tempKey.trim());
    toast({
      title: 'Success',
      description: 'Image API key saved successfully!',
    });
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt for image generation',
        variant: 'destructive',
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please set your API key first',
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
            Generate images using AI. Enter your Runware API key and describe what you want to create.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="imageApiKey" className="text-white">
              Runware API Key
            </Label>
            <Input
              id="imageApiKey"
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Enter your Runware API key..."
              className="bg-slate-800 border-slate-600 text-white mt-1"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent border-slate-600 text-blue-400 hover:bg-slate-700"
              onClick={() => window.open('https://runware.ai/', '_blank')}
            >
              <ExternalLink size={14} className="mr-1" />
              Get API Key
            </Button>
          </div>

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
            />
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
            <h4 className="font-medium text-white mb-2">How to get your API key:</h4>
            <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
              <li>Visit Runware.ai</li>
              <li>Create an account or sign in</li>
              <li>Go to your dashboard</li>
              <li>Find the API keys section</li>
              <li>Copy your API key and paste it above</li>
            </ol>
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
              onClick={handleSaveKey}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Save API Key
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || !apiKey}
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
