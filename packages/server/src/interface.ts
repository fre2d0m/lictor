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
    /**
     * The name is used to identify the configuration
     */
    name: string;
    /**
     * The label is displayed in the UI
     */
    label: string;
    description?: string;
    /**
     * The default value when the configuration is not set
     */
    defaultValue?: any;
    /**
     * If the configuration is sensitive, it will be hidden in the UI
     */
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
 *      - Directly output to conversation (realized)
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
     * Depends on the type of language model.
     */
    dependsOn: 'text-to-text' | 'text-to-image';
    /**
     * Prepare prompts according to the user input.
     * @param userInput - User input prompts.
     * @returns Prepared prompts.
     */
    preparePrompts: (userInput: Prompt[]) => Prompt[];
    /**
     * The plugin can decide, depending on its characteristics, whether to output directly or buffer it for separate processing.
     * @param completions - Parsed plain text of the streaming response.
     * @param agent - Plugin agent.
     * @returns A promise that resolves when handling completion is finished.
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
