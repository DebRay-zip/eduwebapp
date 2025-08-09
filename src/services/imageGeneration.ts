
interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  model?: string;
}

interface GeneratedImage {
  imageURL: string;
  prompt: string;
}

export class ImageGenerationService {
  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    const width = params.width || 1024;
    const height = params.height || 1024;
    const model = params.model || 'flux';
    
    // Pollinations.ai uses a simple URL structure for image generation
    const encodedPrompt = encodeURIComponent(params.prompt);
    const imageURL = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&nologo=true`;

    // Since Pollinations returns the image directly, we just return the URL
    return {
      imageURL,
      prompt: params.prompt
    };
  }
}
