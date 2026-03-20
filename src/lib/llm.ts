import { openai, OPENAI_MODEL } from "./openai";
import { ollama, OLLAMA_MODEL } from "./ollama";
import { getGeminiClient, GEMINI_MODEL } from "./gemini";

export type LLMProvider = "gemini" | "ollama" | "openai";

export const SYSTEM_PROMPTS = {
  roast: process.env.SYSTEM_PROMPT_ROAST || `You are an expert code reviewer with a sarcastic, brutally honest personality. Your mission is to roast terrible code while being technically accurate. Be witty, mean, and educational. Make developers laugh while they cry.

IMPORTANT: When you identify code issues (critical or warning severity), you MUST provide specific diff suggestions showing exactly what code to remove (marked as "removed") and what code to add instead (marked as "added"). Include context lines when helpful. NEVER leave the diff section empty when there are code problems to fix.`,

  honest: process.env.SYSTEM_PROMPT_HONEST || `You are a constructive code reviewer helping developers improve. Provide honest, actionable feedback with empathy. Focus on teaching, not insulting.

IMPORTANT: When you identify code issues (critical or warning severity), you MUST provide specific diff suggestions showing exactly what code to remove (marked as "removed") and what code to add instead (marked as "added"). Include context lines when helpful. NEVER leave the diff section empty when there are code problems to fix.`,
};

let cachedProvider: LLMProvider | null = null;

export async function detectProvider(): Promise<LLMProvider> {
  if (cachedProvider) return cachedProvider;

  const configuredProvider = process.env.LLM_PROVIDER;

  if (configuredProvider === "gemini") {
    try {
      const gemini = getGeminiClient();
      const available = await gemini.isAvailable();
      if (available) {
        cachedProvider = "gemini";
        return "gemini";
      }
    } catch {
      console.warn("Gemini configured but not available");
    }
  }

  if (configuredProvider === "ollama") {
    const available = await ollama.isAvailable();
    if (available) {
      cachedProvider = "ollama";
      return "ollama";
    }
  }

  if (configuredProvider === "openai") {
    cachedProvider = "openai";
    return "openai";
  }

  try {
    const gemini = getGeminiClient();
    const geminiAvailable = await gemini.isAvailable();
    if (geminiAvailable) {
      cachedProvider = "gemini";
      return "gemini";
    }
  } catch {
    console.warn("Gemini not available, trying Ollama...");
  }

  const ollamaAvailable = await ollama.isAvailable();
  if (ollamaAvailable) {
    cachedProvider = "ollama";
    return "ollama";
  }

  cachedProvider = "openai";
  return "openai";
}

export async function getLLMClient() {
  const provider = await detectProvider();

  if (provider === "gemini") {
    return getGeminiClient();
  }

  if (provider === "ollama") {
    return ollama;
  }

  return openai;
}

export async function getModel(): Promise<string> {
  const provider = await detectProvider();

  if (provider === "gemini") return GEMINI_MODEL;
  if (provider === "ollama") return OLLAMA_MODEL;
  return OPENAI_MODEL;
}

export { OPENAI_MODEL, GEMINI_MODEL, OLLAMA_MODEL };
