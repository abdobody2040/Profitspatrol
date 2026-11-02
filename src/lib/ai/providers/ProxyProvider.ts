import { AIService, ChatMessage, GenerationConfig, AIProvider } from "../types";
import { supabase } from "../../supabase";
import { Logger } from "../../../services/logger";

export class ProxyProvider implements AIService {
    id: AIProvider;
    name: string;
    private modelName: string;

    constructor(provider: AIProvider, model: string) {
        this.id = provider;
        this.name = `${provider} (via Proxy)`;
        this.modelName = model;
    }

    private async callProxy(body: any): Promise<any> {
        if (!supabase) throw new Error("Supabase client not initialized");

        const { data, error } = await supabase.functions.invoke('ai-proxy', {
            body: {
                provider: this.id,
                body: {
                    ...body,
                    model: this.modelName
                }
            }
        });

        if (error) {
            Logger.error(`ProxyProvider (${this.id}) failed:`, error);
            throw error;
        }

        return data;
    }

    async generateText(prompt: string, systemPrompt?: string, config?: GenerationConfig): Promise<string> {
        try {
            if (this.id === 'gemini') {
                const data = await this.callProxy({
                    contents: [
                        ...(systemPrompt ? [{ role: 'user', parts: [{ text: `SYSTEM: ${systemPrompt}` }] }] : []),
                        { role: 'user', parts: [{ text: prompt }] }
                    ],
                    generationConfig: {
                        temperature: config?.temperature,
                        maxOutputTokens: config?.maxOutputTokens
                    }
                });
                return data.candidates[0]?.content?.parts[0]?.text || "";
            } else {
                const data = await this.callProxy({
                    messages: [
                        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                        { role: 'user', content: prompt }
                    ],
                    temperature: config?.temperature,
                    max_tokens: config?.maxOutputTokens
                });
                return data.choices[0]?.message?.content || "";
            }
        } catch (e) {
            Logger.error(`ProxyProvider (${this.id}): generateText failed`, e);
            return "Error calling AI via Proxy.";
        }
    }

    async chat(history: ChatMessage[], message: string, systemPrompt?: string): Promise<string> {
        try {
            if (this.id === 'gemini') {
                const data = await this.callProxy({
                    contents: [
                        ...(systemPrompt ? [{ role: 'user', parts: [{ text: `SYSTEM: ${systemPrompt}` }] }] : []),
                        ...history,
                        { role: 'user', parts: [{ text: message }] }
                    ]
                });
                return data.candidates[0]?.content?.parts[0]?.text || "";
            } else {
                const messages = [
                    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                    ...history.map(h => ({
                        role: h.role === 'model' ? 'assistant' : h.role,
                        content: h.parts[0].text
                    })),
                    { role: 'user', content: message }
                ];
                const data = await this.callProxy({ messages });
                return data.choices[0]?.message?.content || "";
            }
        } catch (e) {
            Logger.error(`ProxyProvider (${this.id}): chat failed`, e);
            return "Error calling AI Chat via Proxy.";
        }
    }

    async generateJson<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T | null> {
        try {
            const text = await this.generateText(prompt + "\n\nRESPONSE MUST BE VALID JSON.", systemPrompt);
            if (text) {
                // Basic cleanup of markdown code blocks if present
                const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleanJson) as T;
            }
            return null;
        } catch (e) {
            Logger.error(`ProxyProvider (${this.id}): generateJson failed`, e);
            return null;
        }
    }
}
