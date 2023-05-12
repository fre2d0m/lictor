import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { IUserOptions } from '../interface';

@Provide()
@Scope(ScopeEnum.Singleton)
export class LLMsService {
    async getUser(options: IUserOptions) {
        return {
            uid: options.uid,
            username: 'mockedName',
            phone: '12345678901',
            email: 'xxx.xxx@xxx.com',
        };
    }
}
