
import { AIService, ChatMessage, GenerationConfig, AIProvider } from "../types";
import { Logger } from "../../../services/logger";

export class OllamaProvider implements AIService {
    id: AIProvider = 'ollama';
    name = 'Ollama (Local)';
    private baseUrl = 'http://localhost:11434/api';
    private modelName = 'llama3'; // Default, can be configurable

    constructor(model: string = 'llama3') {
        this.modelName = model;
    }

    async generateText(prompt: string, systemPrompt?: string, config?: GenerationConfig): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.modelName,
                    prompt: prompt,
                    system: systemPrompt,
                    stream: false,
                    temperature: config?.temperature,
                    options: {
                        num_predict: config?.maxOutputTokens
                    }
                })
            });
            const data = await response.json();
            return data.response;
        } catch (e) {
            Logger.error('OllamaProvider: generateText failed', e);
            return "Error connecting to Local AI. Is Ollama running?";
        }
    }

    async chat(history: ChatMessage[], message: string, systemPrompt?: string): Promise<string> {
        try {
            // Convert history to Ollama format
            const messages = [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                ...history.map(h => ({ role: h.role, content: h.parts[0].text })),
                { role: 'user', content: message }
            ];

            const response = await fetch(`${this.baseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.modelName,
                    messages: messages,
                    stream: false
                })
            });
            const data = await response.json();
            return data.message?.content || "";
        } catch (e) {
            Logger.error('OllamaProvider: chat failed', e);
            return "Error connecting to Local AI. Is Ollama running?";
        }
    }

    async generateJson<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T | null> {
        try {
            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.modelName,
                    prompt: prompt,
                    system: systemPrompt + " RESPONSE MUST BE VALID JSON.",
                    format: "json", // Ollama native JSON mode
                    stream: false
                })
            });
            const data = await response.json();
            return JSON.parse(data.response);
        } catch (e) {
            Logger.error('OllamaProvider: generateJson failed', e);
            return null;
        }
    }
}
