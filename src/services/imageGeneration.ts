
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
  private imageCounter = 0;

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    const width = params.width || 1024;
    const height = params.height || 1024;
    const educationLevel = params.educationLevel || 'adult';
    const imageType = params.imageType || 'illustration';
    
    // Create educational-focused prompt
    const educationalPrompt = this.createEducationalImagePrompt(params.prompt, educationLevel, imageType);
    
    // Generate unique filename
    this.imageCounter++;
    const timestamp = Date.now();
    const filename = `educational-${imageType}-${timestamp}-${this.imageCounter}.jpg`;
    const targetPath = `src/assets/generated/${filename}`;
    
    try {
      // Use Lovable's native image generation
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: educationalPrompt,
          width,
          height,
          model: 'flux.schnell',
          target_path: targetPath
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await response.json();
      
      return {
        imageURL: `/${targetPath}`,
        prompt: params.prompt
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate educational image');
    }
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
