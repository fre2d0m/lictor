import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import { Provide } from '@midwayjs/core';

@Provide()
export class SmsService {
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    private createClient(accessKeyId: string, accessKeySecret: string): Dysmsapi20170525 {
        const config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // 访问的域名
        config.endpoint = 'dysmsapi.aliyuncs.com';
        return new Dysmsapi20170525(config);
    }

    async main(args: string[]): Promise<void> {
        // 工程代码泄露可能会导致AccessKey泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
        const client = this.createClient('accessKeyId', 'accessKeySecret');
        const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
            phoneNumbers: '18610298409',
            signName: '东方智感',
            templateCode: 'SMS_6325578',
            templateParam: '{"code":"234561","product":"Lictor"}',
        });
        const runtime = new $Util.RuntimeOptions({});
        try {
            // 复制代码运行请自行打印 API 的返回值
            await client.sendSmsWithOptions(sendSmsRequest, runtime);
        } catch (error) {
            // 如有需要，请打印 error
            Util.assertAsString(error.message);
        }
    }
}
