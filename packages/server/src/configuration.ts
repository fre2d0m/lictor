import { App, Configuration, Inject, MidwayWebRouterService } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import { join } from 'path';
import { AuthMiddleware } from './middleware/auth.middleware';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import * as staticFile from '@midwayjs/static-file';
import * as crossDomain from '@midwayjs/cross-domain';
import * as ws from '@midwayjs/ws';
import * as codeDye from '@midwayjs/code-dye';
import * as redis from '@midwayjs/redis';
import * as sequelize from '@midwayjs/sequelize';
import * as captcha from '@midwayjs/captcha';
import * as jwt from '@midwayjs/jwt';
import { WrapMiddleware } from './middleware/wrap.middleware';
import { registry } from './plugin/agent';
import { registry as llmsRegistry } from './llms';

@Configuration({
    imports: [koa, validate, staticFile, redis, crossDomain, sequelize, ws, captcha, codeDye, jwt],
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
        this.app.useMiddleware([WrapMiddleware]);
        // add filter
        this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
        await registry.initialize(this.app);
        await llmsRegistry.initialize(this.app);
        // Web 路由
        // const routes = await this.webRouterService.getFlattenRouterTable();
        // this.app.getLogger().info(routes.map(v => v.url));
    }
}
