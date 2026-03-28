
import { GoogleGenAI, Type } from "@google/genai";
import { AIService, ChatMessage, GenerationConfig, AIProvider } from "../types";
import { Logger } from "../../../services/logger";

export class GeminiProvider implements AIService {
    id: AIProvider = 'gemini';
    name = 'Google Gemini (Cloud)';
    private client: GoogleGenAI | null = null;
    // ✅ SECURITY FIX: Make model configurable via env var with a stable production fallback.
    // The previous hardcoded 'gemini-2.5-flash' is a preview model that may be removed without notice,
    // causing silent AI failures across the entire platform.
    private modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-001';

    constructor(apiKey: string) {
        if (apiKey) {
            try {
                this.client = new GoogleGenAI({ apiKey });
            } catch (e) {
                // ✅ SECURITY FIX: Raw SDK init errors may contain API key fragments
                Logger.error('GeminiProvider: Failed to initialize Google GenAI client', e);
            }
        }
    }

    private getModel() {
        if (!this.client) throw new Error("Gemini API Key missing");
        return this.client.models;
    }

    async generateText(prompt: string, systemPrompt?: string, config?: GenerationConfig): Promise<string> {
        if (!this.client) return "Gemini not configured.";
        try {
            const response = await this.getModel().generateContent({
                model: this.modelName,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    // ✅ SECURITY FIX: Use native systemInstruction field instead of injecting
                    // the system prompt as a user-role message. The previous pattern allowed
                    // a crafted user prompt to override or augment the system instruction
                    // because the model saw it as user-controllable input.
                    systemInstruction: systemPrompt,
                    temperature: config?.temperature,
                    maxOutputTokens: config?.maxOutputTokens,
                }
            });
            return response.text || "";
        } catch (e) {
            Logger.error('GeminiProvider: generateText failed', e);
            return "Error calling Gemini.";
        }
    }

    async chat(history: ChatMessage[], message: string, systemPrompt?: string): Promise<string> {
        if (!this.client) return "Gemini not configured.";
        try {
            const chat = this.client.chats.create({
                model: this.modelName,
                config: {
                    systemInstruction: systemPrompt
                },
                history: history.map(h => ({
                    role: h.role as 'user' | 'model',
                    parts: h.parts
                }))
            });

            const response = await chat.sendMessage({ message });
            return response.text || "";
        } catch (e) {
            Logger.error('GeminiProvider: chat failed', e);
            return "Error calling Gemini Chat.";
        }
    }

    async generateJson<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T | null> {
        if (!this.client) return null;
        try {
            const response = await this.getModel().generateContent({
                model: this.modelName,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    systemInstruction: systemPrompt,  // ✅ Same fix: native field
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            if (response.text) {
                return JSON.parse(response.text) as T;
            }
            return null;
        } catch (e) {
            Logger.error('GeminiProvider: generateJson failed', e);
            return null;
        }
    }
}
