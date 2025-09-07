import { customProvider } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const qwenProvider = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL,
  apiKey: process.env.QWEN_API_KEY,
});

export const modelProviders = customProvider({
  languageModels: {
    copywriter: qwenProvider('qwen-plus-latest'),
  },
});
