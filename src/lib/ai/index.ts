
import { AIProvider, AIService } from "./types";
import { ProxyProvider } from "./providers/ProxyProvider";
import { OllamaProvider } from "./providers/OllamaProvider";
import { Logger } from "../../services/logger";

class AIFactory {
    private static instance: AIService | null = null;

    private static readonly VALID_PROVIDERS = new Set<AIProvider>(['gemini', 'ollama', 'openrouter', 'deepseek']);
    private static currentProvider: AIProvider = (() => {
        const stored = localStorage.getItem('profitspatrol_ai_provider');
        if (stored && AIFactory.VALID_PROVIDERS.has(stored as AIProvider)) {
            return stored as AIProvider;
        }
        return (import.meta.env.VITE_AI_PROVIDER as AIProvider) || 'gemini';
    })();

    static setProvider(provider: AIProvider) {
        this.currentProvider = provider;
        localStorage.setItem('profitspatrol_ai_provider', provider);
        this.instance = null; // Reset instance to force recreation
    }

    static getService(): AIService {
        if (this.instance) return this.instance;

        const provider = this.currentProvider;

        switch (provider) {
            case 'ollama':
                Logger.info('AIFactory: Initializing provider', { provider: 'ollama' });
                this.instance = new OllamaProvider(import.meta.env.VITE_OLLAMA_MODEL || 'llama3');
                break;
            case 'openrouter':
                Logger.info('AIFactory: Initializing provider (Proxy)', { provider: 'openrouter' });
                this.instance = new ProxyProvider(
                    'openrouter',
                    import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-3.5-turbo'
                );
                break;
            case 'deepseek':
                Logger.info('AIFactory: Initializing provider (Proxy)', { provider: 'deepseek' });
                this.instance = new ProxyProvider(
                    'deepseek',
                    import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat'
                );
                break;
            case 'gemini':
            default:
                Logger.info('AIFactory: Initializing provider (Proxy)', { provider: 'gemini' });
                this.instance = new ProxyProvider(
                    'gemini',
                    import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'
                );
                break;
        }

        return this.instance!;
    }
}

export const getAIService = () => AIFactory.getService();
export const setAIProvider = (provider: AIProvider) => AIFactory.setProvider(provider);
