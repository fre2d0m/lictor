import { App, Controller, Get, Inject, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { Application } from '@midwayjs/ws';

@Controller('/api')
export class APIController {
    @Inject()
    ctx: Context;

    @App()
    app: Context;

    @Inject()
    userService: UserService;
    @App('webSocket')
    wsApp: Application;
    @Get('/get_user')
    async getUser(@Query('uid') uid) {
        return {};
    }
}
