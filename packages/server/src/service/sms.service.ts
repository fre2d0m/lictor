import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import { Inject, Provide } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { SmsValidation } from '../interface';
import { randomUUID } from 'crypto';
import { RAW_CONFIGS } from '../utils/constant';
import { ConfigService } from './config.service';

const {
    SMS_ALIYUN_ACCESS_ID,
    SMS_VALIDATION_TEMPLATE_PRODUCT,
    SMS_VALIDATION_TEMPLATE_SIGNATURE,
    SMS_ALIYUN_ACCESS_SECRET,
    SMS_VALIDATION_TEMPLATE_CODE,
} = RAW_CONFIGS;

@Provide()
export class SmsService {
    @Inject()
    redisService: RedisService;
    @Inject()
    configService: ConfigService;

    private readonly KEY_SMS_VALIDATION_PREFIX = 'sms.validation';

    private async prepareSmsConfig() {
        return await this.configService.buildConfigurationReader([
            SMS_ALIYUN_ACCESS_ID,
            SMS_VALIDATION_TEMPLATE_PRODUCT,
            SMS_VALIDATION_TEMPLATE_SIGNATURE,
            SMS_ALIYUN_ACCESS_SECRET,
            SMS_VALIDATION_TEMPLATE_CODE,
        ]);
    }

    async sendValidateCode(receiver: string): Promise<SmsValidation> {
        const token = randomUUID();
        const code = 10000 + Math.floor(Math.random() * 899999);
        await this.redisService.set(
            `${this.KEY_SMS_VALIDATION_PREFIX}.${token}`,
            JSON.stringify({
                code,
                receiver,
            }),
            'EX',
            600
        );
        return {
            token,
            code,
        };
    }

    /**
     * Valid code is correct
     * @param receiver
     * @param code valid code
     * @param token validation context token
     *
     */
    async validate(receiver: string, code: number, token: string): Promise<void> {
        const data = await this.redisService.get(`${this.KEY_SMS_VALIDATION_PREFIX}.${token}`);
        if (!data) {
            throw new Error('Incorrect verification code.');
        }
        const { code: validCode, receiver: validReceiver } = JSON.parse(data);
        if (code !== validCode || receiver !== validReceiver) {
            throw new Error('Incorrect verification code.');
        }
    }

    async send(receiver: string, code: number): Promise<void> {
        const config = await this.prepareSmsConfig();
        const smsConfig = new $OpenApi.Config({
            accessKeyId: config.read(SMS_ALIYUN_ACCESS_ID),
            accessKeySecret: config.read(SMS_ALIYUN_ACCESS_SECRET),
            endpoint: 'dysmsapi.aliyuncs.com',
        });
        const client = new Dysmsapi20170525(smsConfig);
        const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
            phoneNumbers: receiver,
            signName: config.read(SMS_VALIDATION_TEMPLATE_SIGNATURE),
            templateCode: config.read(SMS_VALIDATION_TEMPLATE_CODE),
            templateParam: `{"code":"${code}","product":"${config.read(SMS_VALIDATION_TEMPLATE_PRODUCT)}}"}`,
        });
        const runtime = new $Util.RuntimeOptions({});
        try {
            await client.sendSmsWithOptions(sendSmsRequest, runtime);
        } catch (error) {
            Util.assertAsString(error.message);
        }
    }
}
