interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaChatCompletion {
  model: string;
  created_at: string;
  message: {
    role: "assistant";
    content: string;
  };
  done: boolean;
}

export class OllamaClient {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl?: string, model?: string) {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.model = model || process.env.OLLAMA_MODEL || "codellama";
  }

  async createChatCompletion(params: {
    model?: string;
    messages: OllamaMessage[];
    temperature?: number;
    max_tokens?: number;
    response_format?: { type: "json_object" };
  }): Promise<{ choices: Array<{ message: { content: string } }> }> {
    const model = params.model || this.model;
    
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        stream: false,
        options: {
          temperature: params.temperature ?? 0.7,
          num_predict: params.max_tokens ?? 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data: OllamaChatCompletion = await response.json();

    return {
      choices: [
        {
          message: {
            content: data.message.content,
          },
        },
      ],
    };
  }

  get chat() {
    return {
      completions: {
        create: (params: Parameters<OllamaClient["createChatCompletion"]>[0]) => 
          this.createChatCompletion(params),
      },
    };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ollama = new OllamaClient();
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "codellama";
