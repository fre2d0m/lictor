import { Plugin, Prompt } from '../../interface';
import { PluginAgent } from '../agent';

export default (): Plugin => {
    // prepare plugin context in conversation
    return {
        id: 'maestro-berry-grower',
        version: '20230512',
        name: '浆果种植专家',
        icon: './icon.svg',
        description: '我是来自Agromind的浆果种植专家，有什么可以帮到你？',
        dependsOn: 'text-to-text',
        category: 'Maestro',
        preparePrompts(userInput: Prompt[]): Prompt[] {
            return [
                {
                    role: 'system',
                    content:
                        'You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. ',
                },
                ...userInput,
            ];
        },
        async handleCompletion(completions: string, agent: PluginAgent) {
            if (completions) {
                // agent.waitFor();
                agent.send(completions);
            }
        },
    };
};
