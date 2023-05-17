import { IMiddleware, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            console.log('in auth');
            // 判断下有没有校验信息
            // if (!ctx.headers['authorization']) {
            //     throw new httpError.UnauthorizedError();
            // }
            // // 从 header 上获取校验信息
            // const parts = ctx.get('authorization').trim().split(' ');
            //
            // if (parts.length !== 2) {
            //     throw new httpError.UnauthorizedError();
            // }
            //
            // const [scheme, token] = parts;
            //
            // if (/^Bearer$/i.test(scheme)) {
            //     try {
            //         //jwt.verify方法验证token是否有效
            //         await jwtService.verify(token, {
            //             complete: true,
            //         });
            //     } catch (error) {
            //         //token过期 生成新的token
            //         const newToken = getToken(user);
            //         //将新token放入Authorization中返回给前端
            //         ctx.set('Authorization', newToken);
            //     }
            //     await next();
            // }
            await next();
        };
    }

    // 配置忽略鉴权的路由地址
    public match(ctx: Context): boolean {
        const ignore = ctx.path.indexOf('/api/admin/login') !== -1;
        return !ignore;
    }

    static getName(): string {
        return 'jwt';
    }
}
