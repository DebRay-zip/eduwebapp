
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
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          taskType: "authentication",
          apiKey: this.apiKey
        },
        {
          taskType: "imageInference",
          taskUUID: crypto.randomUUID(),
          positivePrompt: params.prompt,
          width: params.width || 512,
          height: params.height || 512,
          model: params.model || "runware:100@1",
          numberResults: 1,
          outputFormat: "WEBP"
        }
      ])
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    const imageResult = data.data.find((item: any) => item.taskType === 'imageInference');
    
    if (!imageResult || !imageResult.imageURL) {
      throw new Error('No image generated');
    }

    return {
      imageURL: imageResult.imageURL,
      prompt: params.prompt
    };
  }
}
