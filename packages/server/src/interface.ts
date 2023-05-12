import { EventEmitter } from 'events';
import { ChatCompletionRequestMessage } from 'openai/dist/api';

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
    uid: number;
}

export interface LLMsConfiguration {
    name: string;
    label: string;
    description?: string;
}

export type Prompt = string | Array<ChatCompletionRequestMessage>;

export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface LLMsError {
    type: string;
    code: string;
    message?: string;
}

export interface LLMsModel {
    id: string;
    name: string;
    provider: string;
    type: 'text-to-text' | 'text-to-image' | 'image-to-text' | 'audio-to-text';
    capabilities: { [key: string]: number };
    configuration: LLMsConfiguration[];
    generate: (prompts: Prompt, config: any) => Promise<EventEmitter>;
}
