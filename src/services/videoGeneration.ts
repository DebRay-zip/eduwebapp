
interface GenerateVideoParams {
  prompt: string;
  duration?: number;
  style?: string;
  apiKey?: string;
  educationLevel?: 'elementary' | 'middle' | 'high' | 'college' | 'adult';
  subject?: string;
}

interface GeneratedVideo {
  videoURL: string;
  prompt: string;
  status: 'generating' | 'completed' | 'failed';
  taskId?: string;
}

export class VideoGenerationService {
  async generateVideo(params: GenerateVideoParams): Promise<GeneratedVideo> {
    const duration = params.duration || 10;
    const style = params.style || 'educational';
    const educationLevel = params.educationLevel || 'adult';
    const subject = params.subject || 'general';
    
    // Create educational-focused prompt
    const educationalPrompt = this.createEducationalPrompt(params.prompt, educationLevel, subject, style);
    
    // If API key is provided, try Google Veo first
    if (params.apiKey && params.apiKey.trim()) {
      try {
        const response = await fetch(`https://aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/veo-001:predict`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${params.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{
              prompt: educationalPrompt,
              parameters: {
                duration: duration,
                style: 'educational',
                quality: 'standard',
                educational_focus: true,
                target_audience: educationLevel
              }
            }]
          }),
        });

        if (!response.ok) {
          throw new Error(`Veo API request failed: ${response.status}`);
        }

        const data = await response.json();
        const videoURL = data.predictions?.[0]?.videoUri || `https://video.pollinations.ai/prompt/${encodeURIComponent(educationalPrompt)}?duration=${duration}&style=educational&format=mp4`;

        return {
          videoURL,
          prompt: params.prompt,
          status: 'completed'
        };
      } catch (error) {
        console.error('Error generating video with Veo, falling back to free service:', error);
        // Fall through to free service
      }
    }

    // Use free service (Pollinations.ai) as default or fallback
    const encodedPrompt = encodeURIComponent(educationalPrompt);
    const videoURL = `https://video.pollinations.ai/prompt/${encodedPrompt}?duration=${duration}&style=educational&format=mp4`;

    return {
      videoURL,
      prompt: params.prompt,
      status: 'completed'
    };
  }

  private createEducationalPrompt(topic: string, level: string, subject: string, style: string): string {
    const levelDescriptions = {
      elementary: 'simple language, colorful visuals, basic concepts',
      middle: 'clear explanations, engaging examples, foundational knowledge',
      high: 'detailed analysis, real-world applications, critical thinking',
      college: 'advanced concepts, research-based, analytical depth',
      adult: 'practical applications, professional context, comprehensive overview'
    };

    const styleEnhancements = {
      educational: 'step-by-step explanation with visual aids',
      tutorial: 'hands-on demonstration with clear instructions',
      documentary: 'informative narration with supporting evidence',
      presentation: 'structured slides with key points highlighted'
    };

    return `Create an educational video about "${topic}" for ${level} level students. 
    Use ${levelDescriptions[level as keyof typeof levelDescriptions]}. 
    Focus on ${subject} subject matter with ${styleEnhancements[style as keyof typeof styleEnhancements] || 'clear educational content'}. 
    Include visual demonstrations, key concepts highlighted, and ensure content is engaging and informative for learning purposes.`;
  }
}
