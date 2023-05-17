import { Configuration } from '../interface';

export const RAW_CONFIGS: { [key: string]: Configuration } = {
    SMS_ALIYUN_ACCESS_ID: {
        name: 'smsAliyunId',
        label: 'Aliyun Access ID',
    },
    SMS_ALIYUN_ACCESS_SECRET: {
        name: 'smsAliyunSecret',
        label: 'Aliyun Access Secret',
    },
    SMS_VALIDATION_TEMPLATE_CODE: {
        name: 'smsValidationTemplateCode',
        label: 'SMS Template',
    },
    SMS_VALIDATION_TEMPLATE_SIGNATURE: {
        name: 'smsValidationTemplateSignature',
        label: 'SMS Signature',
    },
    SMS_VALIDATION_TEMPLATE_PRODUCT: {
        name: 'smsValidationTemplateProduct',
        label: 'Product Name',
    },
};

export const CHAT_ERRORS = {};
