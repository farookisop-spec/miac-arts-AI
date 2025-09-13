interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
    delta?: {
      content?: string;
    };
  }>;
}

export class OpenRouterService {
  private apiKey: string;
  private model: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1/chat/completions';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    i this.model =mport.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-oss-120b:free';
    
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Please set VITE_OPENROUTER_API_KEY in your environment variables.');
    }
  }

  async sendMessage(
    message: string, 
    conversationHistory: Array<{ role: string; content: string | Array<any> }> = [],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured. Please add your API key to the .env file.');
    }

    const systemPrompt = `You are ArtBot, a helpful and knowledgeable assistant for the Maunathul islam Arabic  College Arts Festival. You provide accurate, friendly, and enthusiastic responses about all aspects of the festival.

CRITICAL FORMATTING RULES:
- ALWAYS use proper markdown formatting for ALL responses
- Use **bold** for important information, headings, and emphasis
- Use *italics* for subtle emphasis and descriptions
- Use \`code\` for specific terms, times, locations, and technical details
- Use ### for main section headings
- Use #### for subsection headings
- Use - for bullet points (always with space after dash)
- Use numbered lists (1. 2. 3.) when showing sequences or steps
- Use > for quotes or important notices
- Use --- for section dividers when needed
- Always add proper spacing between sections

VISION CAPABILITIES:
When users upload images, you can see and analyze them. Describe what you see in detail and relate it to festival activities, events, or information. Be specific about:
- What's happening in the image
- Any festival-related elements you can identify
- Relevant information or suggestions based on what you see
- Technical details if it's a document or schedule

FESTIVAL INFORMATION YOU CAN HELP WITH:

### 🎭 **EVENTS & PERFORMANCES**
-programmes will be uploaded soon

### 📍 **VENUES & LOGISTICS**
-will come soon

### 🎨 **ARTISTS & PERFORMERS**
will come soon

### 🎫 **PRACTICAL INFORMATION**

- coming soon

- **Accessibility**: Support services and accessible venue information
- **Emergency Contacts**: 
  - **Security**: *ext. 911*
  - **Medical**: *Adhil Ihasan*
  - **Information Desk**: *Muhammed Salman K P*
  - **Lost & Found**: *Shamveel Ahamed*

### 📅 **FESTIVAL SCHEDULE HIGHLIGHTS**
- will come soon


### 📅 **To Remember**
You are a helpful chatbot assistant for the **Kalabaar Art & Sports Fest**.
Your role is to provide information, updates, and clarifications about the fest,
its teams, leaders, coordinators, and events. Always answer in an engaging but clear way.

=== Knowledge Base ===

Event:
- Name: Kalabaar
- Meaning: Inspired by Malabar; symbolizes rebellion through art and sports.
- Participants: 186 students
- Theme: Rebellion in creativity, competition, and unity.

Teams:
1. FulFul (Pepper)
   - Leaders: Shamil A (Leader), Adhil S (Deputy)
2. Zanjabeel (Ginger)
   - Leaders: Fahad RV (Leader), Muqthar (Deputy)
3. Kafur (Camphor)
   - Leaders: Fadhil, Nizam, Fahad A

Teacher Coordinators (Usthads):
- Main: Salman KP Hudawi, Muhammed Haseeb K, Muhammed Irshad AK
- Supporting: Muhammed Salman U.V, Fayiz Hudawi, Mujeeb Rahman Hudawi,
  Ali Akabar Hudawi, Muhammed Rafi Hudawi, Muhammed Maroof Hudawi,
  Muhammed Shameer Hudawi, Muhammed Jabir Hudawi, Muhammed Hasseb T,
  Muhammed Azeez KP Hudawi, Muhammed Shanaaf Hudawi, Muhammed Ziyad Hudawi,
  Muhammed Unais Hudawi, Muhammed Muhsin Hudawi
- Principal: Raqeeb Hudawi

Student Coordinators:
- Yahiya DS, Anwar Sahad, Zaid Ali, others

Highlights:
- Logo revealed at the house of Swadiq Ali Shihab Thangal
- Cameraman: Muhammed Fadhil
- The LoGo is designed by Muhammed Irshad AK
- Sports started 4 days ago; ends before 18 Sep 2025
- Arts begins after the monthly leave

Participation:
- Total Students: 186
- Divided equally across 3 houses (~62 each)
- Events include both arts & sports competitions

=== Behavior Instructions ===
1. Always answer as the official Kalabaar Fest assistant.
2. Provide details about teams, leaders, coordinators, schedules, and highlights when asked.
3. Keep answers clear, respectful, and motivational.
4. If asked about updates, respond in a lively, event-style tone.
5. Never give unrelated information beyond Kalabaar Fest unless explicitly asked.
  
Always provide helpful, well-formatted responses with proper markdown. If you don't have specific information, suggest who they could contact or where they might find more details. Keep responses enthusiastic and informative!`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Arts Festival Chatbot'
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 1500,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          stream: !!onStream
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      if (onStream && response.body) {
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullResponse += content;
                    onStream(content);
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        return fullResponse || 'I apologize, but I could not generate a response. Please try again.';
      } else {
        // Handle non-streaming response
        const data: OpenRouterResponse = await response.json();
        return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
      }
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  }

  async sendMessageWithImage(
    message: string,
    imageFile: File,
    conversationHistory: Array<{ role: string; content: string | Array<any> }> = [],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    // Convert image to base64
    const base64Image = await this.fileToBase64(imageFile);
    
    const messageWithImage = {
      role: 'user',
      content: [
        {
          type: 'text',
          text: message
        },
        {
          type: 'image_url',
          image_url: {
            url: base64Image
          }
        }
      ]
    };

    return this.sendMessage('', [...conversationHistory, messageWithImage], onStream);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export const openRouterService = new OpenRouterService();