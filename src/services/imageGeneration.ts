
interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  model?: string;
  educationLevel?: 'elementary' | 'middle' | 'high' | 'college' | 'adult';
  imageType?: 'diagram' | 'illustration' | 'infographic' | 'chart' | 'concept';
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
    const educationLevel = params.educationLevel || 'adult';
    const imageType = params.imageType || 'illustration';
    
    // Create educational-focused prompt
    const educationalPrompt = this.createEducationalImagePrompt(params.prompt, educationLevel, imageType);
    
    // Use Pollinations.ai with improved URL structure
    const encodedPrompt = encodeURIComponent(educationalPrompt);
    
    // Try different Pollinations endpoints for better reliability
    const possibleUrls = [
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&nologo=true`,
      `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&model=${model}`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}`
    ];

    // Use the first URL as primary
    const imageURL = possibleUrls[0];

    // Add a small delay to ensure the image is generated
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      imageURL,
      prompt: params.prompt
    };
  }

  private createEducationalImagePrompt(topic: string, level: string, type: string): string {
    const levelStyles = {
      elementary: 'colorful, simple, cartoon-like, child-friendly, easy to understand',
      middle: 'clear, engaging, moderately detailed, age-appropriate, educational',
      high: 'detailed, realistic, scientifically accurate, professional, informative',
      college: 'technical, precise, academic quality, research-grade, comprehensive',
      adult: 'professional, clean, business-appropriate, informative, sophisticated'
    };

    const typeDescriptions = {
      diagram: 'clear technical diagram with labeled parts and connections',
      illustration: 'detailed educational illustration with visual clarity',
      infographic: 'informative infographic with data visualization elements',
      chart: 'clear chart or graph showing relationships and data points',
      concept: 'conceptual visualization explaining abstract ideas clearly'
    };

    const basePrompt = `Educational ${type} about "${topic}"`;
    const styleGuide = levelStyles[level as keyof typeof levelStyles];
    const typeGuide = typeDescriptions[type as keyof typeof typeDescriptions];

    return `${basePrompt}, ${styleGuide} style. Create a ${typeGuide}. Focus on clarity, accuracy, and educational value. Include relevant labels and visual elements that enhance learning. High quality, well-designed, educational content.`;
  }
}
