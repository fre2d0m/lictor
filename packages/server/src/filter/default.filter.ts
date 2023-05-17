import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
    async catch(err: Error, ctx: Context) {
        // TODO Errors need classification
        return {
            code: 1,
            message: err.message,
        };
    }
}
