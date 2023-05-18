import { LLMModel, Prompt } from '../interface';
import { EventEmitter } from 'events';
import { Configuration, OpenAIApi } from 'openai';
import { ChatCompletionRequestMessage } from 'openai/dist/api';
import ChatCompletionParser from './chat-streaming-completion-parser';

const model = 'gpt-3.5-turbo';
export default (): LLMModel => {
    return {
        id: 'chatgpt-35-openai',
        type: 'text-to-text',
        name: 'GPT-3.5 Turbo',
        icon: 'https://cdn.openai.com/research-covers/chatbots.png',
        provider: 'OpenAI',
        capabilities: {
            reasoning: 60,
            speed: 100,
            conciseness: 40,
        },
        configuration: [
            { name: 'apiKey', label: 'OPENAI_API_KEY', sensitive: true },
            {
                name: 'endpoint',
                label: 'API_ENDPOINT',
                defaultValue: 'https://api.openai.com',
                description: 'e.g. https://domainname',
            },
        ],
        async generate(prompts: Prompt[], config: any): Promise<EventEmitter> {
            const parser = new ChatCompletionParser();
            const configuration = new Configuration({
                apiKey: config.apiKey,
                basePath: `${config.endpoint}/v1`,
            });
            const openai = new OpenAIApi(configuration);
            try {
                const completion = await openai.createChatCompletion(
                    {
                        model,
                        messages: <ChatCompletionRequestMessage[]>prompts,
                        temperature: 1,
                        stream: true,
                    },
                    { responseType: 'stream' }
                );
                // @ts-ignore
                completion.data.on('data', data => {
                    parser.write(data);
                });
            } catch (e) {
                if (e.response) {
                    e.response.data.on('data', data => {
                        const {
                            error: { type, code, message },
                        } = JSON.parse(data.toString());
                        parser.emit('error', { type, code, message: message });
                    });
                } else {
                    parser.emit('error', { type: 'internal_error', code: 'unknown', message: e.message });
                }
            }
            return parser;
        },
    };
};
