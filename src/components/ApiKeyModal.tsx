
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
import { ExternalLink, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
  googleCloudApiKey: string;
  onSaveGoogleCloud: (key: string) => void;
}

const ApiKeyModal = ({ isOpen, onClose, apiKey, onSave, googleCloudApiKey, onSaveGoogleCloud }: ApiKeyModalProps) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempGoogleCloudKey, setTempGoogleCloudKey] = useState(googleCloudApiKey);
  const { toast } = useToast();

  const handleSave = () => {
    if (!tempKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid Gemini API key',
        variant: 'destructive',
      });
      return;
    }

    onSave(tempKey.trim());
    onSaveGoogleCloud(tempGoogleCloudKey.trim());
    onClose();
    toast({
      title: 'Success',
      description: 'API keys saved successfully!',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="text-blue-400" size={20} />
            Configure API Keys
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Enter your API keys to unlock full functionality. Keys are stored locally and never shared.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="apiKey" className="text-white">
              Gemini API Key (Required for chat)
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="bg-slate-800 border-slate-600 text-white mt-1"
            />
          </div>

          <div>
            <Label htmlFor="googleCloudKey" className="text-white">
              Google Cloud API Key (Optional - for Veo video generation)
            </Label>
            <Input
              id="googleCloudKey"
              type="password"
              value={tempGoogleCloudKey}
              onChange={(e) => setTempGoogleCloudKey(e.target.value)}
              placeholder="Enter your Google Cloud API key..."
              className="bg-slate-800 border-slate-600 text-white mt-1"
            />
            <p className="text-xs text-slate-400 mt-1">
              Leave empty to use free video generation service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
              <h4 className="font-medium text-white mb-2">Gemini API Key:</h4>
              <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                <li>Visit Google AI Studio</li>
                <li>Sign in with your Google account</li>
                <li>Create a new API key</li>
                <li>Copy and paste it above</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 bg-transparent border-slate-600 text-blue-400 hover:bg-slate-700"
                onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
              >
                <ExternalLink size={14} className="mr-1" />
                Get Gemini Key
              </Button>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
              <h4 className="font-medium text-white mb-2">Google Cloud API Key:</h4>
              <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                <li>Visit Google Cloud Console</li>
                <li>Enable Vertex AI API</li>
                <li>Create credentials</li>
                <li>Copy and paste it above</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 bg-transparent border-slate-600 text-blue-400 hover:bg-slate-700"
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                <ExternalLink size={14} className="mr-1" />
                Get Cloud Key
              </Button>
            </div>
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
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Save API Keys
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
