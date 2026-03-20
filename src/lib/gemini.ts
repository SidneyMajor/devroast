import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY || "";
    if (!key) {
      throw new Error("GEMINI_API_KEY not configured");
    }
    this.genAI = new GoogleGenerativeAI(key);
    this.model = model || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  get chat() {
    return {
      completions: {
        create: async (params: {
          model?: string;
          messages: Array<{ role: string; content: string }>;
          temperature?: number;
          max_tokens?: number;
          response_format?: { type: "json_object" };
        }) => {
          const modelName = params.model || this.model;
          
          const model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: params.temperature ?? 0.7,
              maxOutputTokens: params.max_tokens ?? 8192,
              responseMimeType: "application/json",
            },
          });

          const systemPrompt = params.messages.find(m => m.role === "system")?.content || "";
          const conversationHistory = params.messages.filter(m => m.role !== "system");

          const promptText = conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n");

          const fullPrompt = systemPrompt 
            ? `${systemPrompt}\n\n${promptText}`
            : promptText;

          const result = await model.generateContent(fullPrompt);
          const response = result.response;
          const text = response.text();

          return {
            choices: [
              {
                message: {
                  content: text,
                },
              },
            ],
          };
        },
      },
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!process.env.GEMINI_API_KEY) return false;
    
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      await model.generateContent("test");
      return true;
    } catch {
      return false;
    }
  }
}

let geminiInstance: GeminiClient | null = null;

export function getGeminiClient(): GeminiClient {
  if (!geminiInstance) {
    geminiInstance = new GeminiClient();
  }
  return geminiInstance;
}

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
