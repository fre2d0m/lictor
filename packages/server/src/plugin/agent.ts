import { Plugin, Prompt } from '../interface';
import { registry as llmsRegistry } from '../llms';
import { EventEmitter } from 'events';
import { Application } from '@midwayjs/koa';

/**
 * In Agent Scope:
 *  1. list all plugins
 *  2. create a plugin instance(carrying prompt, may be some knowledge will be used or modify prompt)
 *  3. invoke a plugin use instance
 *  4. provide a trigger register base on cronjob
 *  5. count the token usage of prompt and completion
 *  6. invoke the trigger callback(Carrying conversation context)
 * In Plugin Scope:
 *  1. maestro plugin
 *  2. narrator plugin
 *  3. coordinator plugin
 */
class PluginRegistry {
    private readonly plugins: Plugin[] = [];

    async initialize(app: Application) {
        this.plugins.push((await import('./builtin/narrator')).default());
    }

    getPlugins() {
        return this.plugins;
    }

    get(id: string) {
        return this.plugins.find(plugin => plugin.id === id);
    }
}

export const registry = new PluginRegistry();

export class PluginAgent extends EventEmitter {
    plugin: Plugin;
    modelSuite: any;

    constructor() {
        super();
    }

    getRegistry() {
        return registry;
    }

    async initialize(pluginId: string, modelId: string) {
        this.plugin = this.getRegistry().get(pluginId);
        this.modelSuite = await llmsRegistry.get(modelId, true);
        this.emit('stateChanged', {
            state: 'intro',
            content: {
                type: 'object',
                value: {
                    plugin: {
                        name: this.plugin.name,
                        version: this.plugin.version,
                        icon: this.plugin.icon,
                        description: this.plugin.description,
                        category: this.plugin.category,
                    },
                    model: {
                        name: this.modelSuite.model.name,
                        icon: this.modelSuite.model.icon,
                        provider: this.modelSuite.model.provider,
                    },
                },
            },
        });
    }

    async completion(userInput: Prompt[]) {
        const finalPrompt = this.plugin.preparePrompts(userInput);
        this.emit('stateChanged', {
            state: 'thinking',
        });
        const { model, config } = this.modelSuite;
        const listener = await model.generate(finalPrompt, config);
        listener.on('message', message => {
            this.plugin.handleCompletion(message.choices[0].delta?.content, this);
        });
        listener.on('error', error => {
            this.emit('stateChanged', {
                state: 'error',
                content: {
                    type: 'object',
                    value: { message: error.message },
                },
            });
        });
        listener.on('done', () => {
            this.emit('stateChanged', {
                state: 'completed',
            });
        });
    }

    send(finalCompletion: string) {
        this.emit('stateChanged', {
            state: 'typing',
            content: {
                type: 'text',
                value: finalCompletion,
            },
        });
    }
}
