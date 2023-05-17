import { EventEmitter } from 'events';
import { PluginAgent } from './plugin/agent';

export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface LLMError {
    type: string;
    code: string;
    message?: string;
}

export interface LLMModel {
    id: string;
    name: string;
    icon: string;
    provider: string;
    type: 'text-to-text' | 'text-to-image' | 'image-to-text' | 'audio-to-text';
    capabilities: { [key: string]: number };
    configuration: Configuration[];
    generate: (prompts: Prompt[], config: any) => Promise<EventEmitter>;
}

export interface User {
    id: string;
    nickname: string;
    phoneNumber: string;
    state: string;
    remark: string;
    allowScopes: string;
    createdAt: string;
    expirationDate: number[];
}

export interface SmsValidation {
    code: number;
    token: string;
}

export interface Configuration {
    name: string;
    label: string;
    description?: string;
    defaultValue?: any;
    sensitive?: boolean;
}

export type Prompt = {
    role: 'system' | 'assistant' | 'user';
    content: string;
    name?: string;
};

/**
 * Plugin service process:
 *  Publish plugin info to conversation --> Received User Inputs --> Prepare Prompts
 *  --> Invoke LLM and Wait for Completion --> Handle Completion (
 *      - Directly output to conversation
 *      - Schedule a task to process the completion and then output to conversation
 *      - Examine the completion use other plugin and then output to conversation
 *  ) --> Publish Completion --> End
 */
export interface Plugin {
    /**
     * The plugin id is used to identify the plugin
     */
    id: string;
    /**
     * The plugin latest updated version.
     */
    version: string;
    /**
     * The plugin category is used to classify the plugin, e.g. Narrator Maestro Coordinator
     */
    category: string;
    /**
     * The plugin name is displayed in the conversation
     */
    name: string;
    /**
     * The plugin icon is displayed in the conversation, It's a URL
     */
    icon: string;
    /**
     * The plugin description includes the plugin's capabilities, such as usage and announcements.
     */
    description: string;
    /**
     * Depends on what kind of language model
     */
    dependsOn: 'text-to-text' | 'text-to-image';
    /**
     * Prepare prompts according to the user input
     * @param userInput
     */
    preparePrompts: (userInput: Prompt[]) => Prompt[];
    /**
     * The plug-in can decide, depending on its characteristics, whether to output directly or buffer it for separate processing
     * @param completions parsed plain text of streaming response
     * @param agent
     */
    handleCompletion: (completions: string, agent: PluginAgent) => Promise<void>;
}

export interface CompletionState {
    state: 'init' | 'thinking' | 'typing' | 'error' | 'completed';
    content?: {
        type: 'text' | 'object';
        value: any;
    };
}
