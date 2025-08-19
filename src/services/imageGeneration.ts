
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
    
    // Pollinations.ai uses a simple URL structure for image generation
    const encodedPrompt = encodeURIComponent(educationalPrompt);
    const imageURL = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&nologo=true&style=educational`;

    return {
      imageURL,
      prompt: params.prompt
    };
  }

  private createEducationalImagePrompt(topic: string, level: string, type: string): string {
    const levelStyles = {
      elementary: 'colorful, simple, cartoon-like, child-friendly',
      middle: 'clear, engaging, moderately detailed, age-appropriate',
      high: 'detailed, realistic, scientifically accurate, professional',
      college: 'technical, precise, academic quality, research-grade',
      adult: 'professional, clean, business-appropriate, informative'
    };

    const typeDescriptions = {
      diagram: 'technical diagram with labeled parts and clear connections',
      illustration: 'detailed illustration with educational focus',
      infographic: 'informative infographic with data visualization',
      chart: 'clear chart or graph showing relationships and data',
      concept: 'conceptual visualization explaining abstract ideas'
    };

    return `Educational ${type} about "${topic}" in ${levelStyles[level as keyof typeof levelStyles]} style. 
    Create a ${typeDescriptions[type as keyof typeof typeDescriptions]}. 
    Focus on clarity, accuracy, and educational value. Include relevant labels, annotations, and visual elements that enhance learning and understanding.`;
  }
}
