import { Provide } from '@midwayjs/core';
import { IUserOptions } from '../interface';

@Provide()
export class AccountService {
    async getUser(options: IUserOptions) {
        return {
            uid: options.uid,
            username: 'mockedName',
            phone: '12345678901',
            email: 'xxx.xxx@xxx.com',
        };
    }
}
