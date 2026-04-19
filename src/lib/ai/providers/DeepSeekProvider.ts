
import { AIService, ChatMessage, GenerationConfig, AIProvider } from "../types";
import { Logger } from "../../../services/logger";

export class DeepSeekProvider implements AIService {
    id: AIProvider = 'deepseek';
    name = 'DeepSeek (Direct)';
    private baseUrl = 'https://api.deepseek.com'; // Standard DeepSeek Endpoint
    private apiKey: string;
    private modelName: string;

    constructor(apiKey: string, model: string = 'deepseek-chat') {
        this.apiKey = apiKey;
        this.modelName = model;
    }

    private async callApi(endpoint: string, body: any): Promise<any> {
        if (!this.apiKey) {
            throw new Error("DeepSeek API Key missing. Set VITE_DEEPSEEK_API_KEY.");
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`DeepSeek Error (${response.status}): ${err}`);
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
            Logger.error('DeepSeekProvider: generateText failed', e);
            return "Error calling DeepSeek. Check your API Key.";
        }
    }

    async chat(history: ChatMessage[], message: string, systemPrompt?: string): Promise<string> {
        try {
            const messages = [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                ...history.map(h => ({
                    role: h.role === 'model' ? 'assistant' : h.role,
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
            Logger.error('DeepSeekProvider: chat failed', e);
            return "Error calling DeepSeek.";
        }
    }

    async generateJson<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T | null> {
        try {
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
            Logger.error('DeepSeekProvider: generateJson failed', e);
            return null;
        }
    }
}
