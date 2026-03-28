
export type AIProvider = 'gemini' | 'ollama' | 'openai' | 'openrouter' | 'deepseek';

export interface ChatMessage {
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
}

export interface GenerationConfig {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
    responseSchema?: any; // For structured outputs
}

export interface AIService {
    id: AIProvider;
    name: string;

    // Core Text Generation
    generateText(prompt: string, systemPrompt?: string, config?: GenerationConfig): Promise<string>;

    // Chat with History
    chat(history: ChatMessage[], message: string, systemPrompt?: string): Promise<string>;

    // Structured Data Extraction (JSON)
    generateJson<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T | null>;
}
