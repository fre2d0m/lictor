import { App, Configuration, Inject, MidwayWebRouterService } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { AuthMiddleware } from './middleware/auth.middleware';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { AuthGuard } from './guard/auth.guard';
import * as staticFile from '@midwayjs/static-file';
import * as crossDomain from '@midwayjs/cross-domain';
import * as ws from '@midwayjs/ws';
import * as codeDye from '@midwayjs/code-dye';

@Configuration({
    imports: [
        koa,
        validate,
        staticFile,
        crossDomain,
        ws,
        {
            component: info,
            enabledEnvironment: ['local'],
        },
        {
            component: codeDye,
            enabledEnvironment: ['local'],
        },
    ],
    importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
    @App()
    app: koa.Application;
    @Inject()
    webRouterService: MidwayWebRouterService;

    async onReady() {
        // add middleware
        this.app.useMiddleware([AuthMiddleware]);
        // add filter
        this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
        this.app.useGuard(AuthGuard);
        // Web 路由
        const routes = await this.webRouterService.getFlattenRouterTable();
        this.app.getLogger().info(routes.map(v => v.url));
    }
}
