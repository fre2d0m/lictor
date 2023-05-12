import { LLMsModel, Prompt } from '../interface';
import { Context } from '@midwayjs/koa';
import { EventEmitter } from 'events';
import { Configuration, OpenAIApi } from 'openai';
import { ChatCompletionRequestMessage } from 'openai/dist/api';

const model = 'gpt-3.5-turbo';

/*
     // normalized by \n
     data: {"id":"chatcmpl-74ngsQubvtgjT1nlzoYUKNDPb5HkO","object":"chat.completion.chunk","created":1681378678,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" "},"index":0,"finish_reason":null}]}

     // incorrect json format, because it is not a complete json object, and it is split by \n, so we need to buffer it, and wait for the next line.
     data: {"id":"chatcmpl-74ngsQubvtgjT1nlzoYUKNDPb5HkO","object":"chat.comple
        tion.chunk","created":1681378678,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" "},"index":0,"finish_reason":null}]}
     ```
     data: [DONE]
 */
class ChatCompletionParser extends EventEmitter {
    write(fragment: string) {
        const lines = fragment
            .toString()
            .split('\n')
            .filter(line => line.trim() !== '');
        for (const line of lines) {
            const message = line.replace(/^data: /, '');
            if (message === '[DONE]') {
                this.emit('done');
                return; // Stream finished
            }
            try {
                const parsed = JSON.parse(message);
                this.emit('message', parsed);
            } catch (error) {
                console.error('Could not JSON parse stream message', message, error);
            }
        }
    }
}

//export default
export default (app: Context): LLMsModel => {
    return {
        id: 'chatgpt-4-openai',
        type: 'text-to-text',
        name: 'ChatGPT-4',
        provider: 'OpenAI',
        capabilities: {
            reasoning: 0,
            speed: 0,
            conciseness: 0,
        },
        configuration: [
            { name: 'apiKey', label: 'OPENAI_API_KEY' },
            { name: 'endpoint', label: 'API_ENDPOINT', description: 'e.g. https://domainname' },
        ],
        async generate(prompts: Prompt, config: any): Promise<EventEmitter> {
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
                        temperature: 0.5,
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
