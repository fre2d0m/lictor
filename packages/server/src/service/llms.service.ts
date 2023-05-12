import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { IUserOptions } from '../interface';
import { RedisService } from '@midwayjs/redis';

@Provide()
@Scope(ScopeEnum.Singleton)
export class LLMsService {
    @Inject()
    redisService: RedisService;

    async getUser(options: IUserOptions) {
        /*
        // 简单设置
    await this.redisService.set('foo', 'bar');

    // 设置过期时间，单位秒
    await this.redisService.set('foo', 'bar', 'EX', 10);

    // 获取数据
    const result = await this.redisService.get('foo');
         */
        return {
            uid: options.uid,
            username: 'mockedName',
            phone: '12345678901',
            email: 'xxx.xxx@xxx.com',
        };
    }
}
