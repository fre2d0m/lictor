import { LLMModel } from '../interface';
import { Application } from '@midwayjs/koa';
import { ConfigService } from '../service/config.service';
// TODO provide the config reader soon
export default async (): Promise<LLMModel[]> => {
    const models: LLMModel[] = [];
    models.push((await import('./chatgpt-40-openai')).default());
    models.push((await import('./chatgpt-35-openai')).default());
    console.log(models);
    return models;
};

class LLMsRegistry {
    private readonly models: LLMModel[] = [];
    private app: Application;

    async initialize(app: Application) {
        this.app = app;
        this.models.push((await import('./chatgpt-40-openai')).default());
        this.models.push((await import('./chatgpt-35-openai')).default());
    }

    getModels() {
        return this.models;
    }

    async get(id: string, isTakeConfig = false) {
        const model = this.models.find(plugin => plugin.id === id);
        let config = {};
        if (isTakeConfig) {
            const configService = await this.app.getApplicationContext().getAsync(ConfigService);
            const reader = await configService.buildConfigurationReader(model.configuration, `llm-${model.id}`);
            config = reader.configs;
        }
        return { model, config };
    }
}

export const registry = new LLMsRegistry();
