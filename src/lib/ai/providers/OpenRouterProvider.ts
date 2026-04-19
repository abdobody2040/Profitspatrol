
import { AIService, ChatMessage, GenerationConfig, AIProvider } from "../types";
import { Logger } from "../../../services/logger";

export class OpenRouterProvider implements AIService {
    id: AIProvider = 'openrouter';
    name = 'OpenRouter (Gateway)';
    private baseUrl = 'https://openrouter.ai/api/v1';
    private apiKey: string;
    // Default to a solid all-rounder, but OpenRouter allows anything
    private modelName: string;

    constructor(apiKey: string, model: string = 'openai/gpt-3.5-turbo') {
        this.apiKey = apiKey;
        this.modelName = model;
    }

    private async callApi(endpoint: string, body: any): Promise<any> {
        if (!this.apiKey) {
            throw new Error("OpenRouter API Key missing. Set VITE_OPENROUTER_API_KEY.");
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.origin, // Required by OpenRouter
                'X-Title': 'Profits Patrol'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenRouter Error (${response.status}): ${err}`);
        }

        return await response.json();
    }

    async generateText(prompt: string, systemPrompt?: string, config?: GenerationConfig): Promise<string> {
        try {
            const data = await this.callApi('/chat/completions', {
                model: this.modelName,
                messages: [
                    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                    { role: 'user', content: prompt }
                ],
                temperature: config?.temperature,
                max_tokens: config?.maxOutputTokens
            });
            return data.choices[0]?.message?.content || "";
        } catch (e) {
            Logger.error('OpenRouterProvider: generateText failed', e);
            return "Error calling OpenRouter.";
        }
    }

    async chat(history: ChatMessage[], message: string, systemPrompt?: string): Promise<string> {
        try {
            const messages = [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                ...history.map(h => ({
                    role: h.role === 'model' ? 'assistant' : h.role, // Map 'model' -> 'assistant'
                    content: h.parts[0].text
                })),
                { role: 'user', content: message }
            ];

            const data = await this.callApi('/chat/completions', {
                model: this.modelName,
                messages: messages
            });

            return data.choices[0]?.message?.content || "";
        } catch (e) {
            Logger.error('OpenRouterProvider: chat failed', e);
            return "Error calling OpenRouter Chat.";
        }
    }

    async generateJson<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T | null> {
        try {
            // OpenRouter/OpenAI support response_format: { type: "json_object" }
            const data = await this.callApi('/chat/completions', {
                model: this.modelName,
                messages: [
                    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                    { role: 'user', content: prompt + "\n\nRESPONSE MUST BE VALID JSON." }
                ],
                response_format: { type: "json_object" }
            });

            const text = data.choices[0]?.message?.content;
            if (text) return JSON.parse(text) as T;
            return null;
        } catch (e) {
            Logger.error('OpenRouterProvider: generateJson failed', e);
            return null;
        }
    }
}
