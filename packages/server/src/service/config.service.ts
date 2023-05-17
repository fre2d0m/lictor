import { Inject, Provide } from '@midwayjs/core';
import { RAW_CONFIGS } from '../utils/constant';
import { Configuration } from '../interface';
import { RedisService } from '@midwayjs/redis';
import LLMs from '../llms';

@Provide()
export class ConfigService {
    @Inject()
    redisService: RedisService;
    private readonly KEY_CONFIG_PREFIX = 'cfg';

    async getAllConfigurationGroups() {
        const {
            SMS_ALIYUN_ACCESS_ID,
            SMS_VALIDATION_TEMPLATE_PRODUCT,
            SMS_VALIDATION_TEMPLATE_SIGNATURE,
            SMS_ALIYUN_ACCESS_SECRET,
            SMS_VALIDATION_TEMPLATE_CODE,
        } = RAW_CONFIGS;
        const models = await LLMs();
        return [
            {
                name: 'General',
                items: [
                    // TODO Settings may be provided to apply icon, name, description, workflow integration, and so on
                ],
            },
            {
                name: 'LLM Credentials',
                items: [...models.map(v => v.configuration)],
            },
            {
                name: 'SMS',
                items: [
                    SMS_ALIYUN_ACCESS_ID,
                    SMS_ALIYUN_ACCESS_SECRET,
                    SMS_VALIDATION_TEMPLATE_CODE,
                    SMS_VALIDATION_TEMPLATE_SIGNATURE,
                    SMS_VALIDATION_TEMPLATE_PRODUCT,
                ],
            },
        ];
    }

    async buildConfigurationReader(configs: Configuration[], namespace = 'app') {
        const result: { [key: string]: any } = {};
        for (const cfg of configs) {
            const key = `${this.KEY_CONFIG_PREFIX}.${namespace}.${cfg.name}`;
            const value = await this.redisService.get(key);
            result[cfg.name] = value || cfg.defaultValue;
        }
        return new (class {
            configs: { [key: string]: string | number };

            constructor(props) {
                this.configs = props;
            }

            read(config: Configuration) {
                return this.configs[config.name];
            }
        })(result);
    }
}
