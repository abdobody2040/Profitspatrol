
import { AIProvider, AIService } from "./types";
import { GeminiProvider } from "./providers/GeminiProvider";
import { OllamaProvider } from "./providers/OllamaProvider";
import { OpenRouterProvider } from "./providers/OpenRouterProvider";
import { DeepSeekProvider } from "./providers/DeepSeekProvider";
import { Logger } from "../../services/logger";

class AIFactory {
    private static instance: AIService | null = null;

    // ✅ SECURITY FIX: Validate the localStorage provider value against a known allowlist.
    // Without this, any string written to localStorage (e.g. via XSS or DevTools) would be
    // accepted as a valid `AIProvider` due to the blind `as AIProvider` TypeScript cast,
    // potentially redirecting all AI calls to an attacker-controlled endpoint.
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

        // Determine Provider priority: 
        // 1. Runtime state/Storage (currentProvider)
        // 2. Env Var (VITE_AI_PROVIDER) - handled in initialization of currentProvider
        // 3. Default (Gemini)

        const provider = this.currentProvider;

        switch (provider) {
            case 'ollama':
                // ✅ SECURITY FIX: console.log of active AI provider leaks stack info in prod
                Logger.info('AIFactory: Initializing provider', { provider: 'ollama' });
                this.instance = new OllamaProvider(import.meta.env.VITE_OLLAMA_MODEL || 'llama3');
                break;
            case 'openrouter':
                Logger.info('AIFactory: Initializing provider', { provider: 'openrouter' });
                // Default to standard GPT-3.5 or user choice
                this.instance = new OpenRouterProvider(
                    import.meta.env.VITE_OPENROUTER_API_KEY || '',
                    import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-3.5-turbo'
                );
                break;
            case 'deepseek':
                Logger.info('AIFactory: Initializing provider', { provider: 'deepseek' });
                this.instance = new DeepSeekProvider(
                    import.meta.env.VITE_DEEPSEEK_API_KEY || '',
                    import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat'
                );
                break;
            case 'gemini':
            default:
                Logger.info('AIFactory: Initializing provider', { provider: 'gemini' });
                this.instance = new GeminiProvider(import.meta.env.VITE_API_KEY || '');
                break;
        }

        return this.instance!;
    }
}

export const getAIService = () => AIFactory.getService();
export const setAIProvider = (provider: AIProvider) => AIFactory.setProvider(provider);
