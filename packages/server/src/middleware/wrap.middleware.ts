import { IMiddleware, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class WrapMiddleware implements IMiddleware<Context, NextFunction> {
    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            const result = await next();
            if (result === null) {
                ctx.status = 200;
            }
            return {
                code: 0,
                message: 'ok',
                data: result,
            };
        };
    }

    public match(ctx: Context): boolean {
        return ctx.path.indexOf('/api/') !== -1;
    }

    static getName(): string {
        return 'wrap';
    }
}
