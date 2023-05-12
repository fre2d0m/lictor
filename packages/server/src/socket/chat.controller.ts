import { Inject, OnWSConnection, OnWSDisConnection, OnWSMessage, WSController } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import * as http from 'http';

@WSController()
export class HelloSocketHandler {
    @Inject()
    ctx: Context;

    @OnWSConnection()
    async handleConnection(socket: Context, request: http.IncomingMessage) {
        console.log(`namespace / got a connection ${this.ctx.readyState}`);
    }

    @OnWSMessage('message')
    async handleMessage(data) {
        this.ctx.send('adfasdf');
        return { name: 'harry', result: parseInt(data) + 5 };
    }

    @OnWSDisConnection()
    async handleDisconnect(errorCode: number) {
        console.log('disconnect ', errorCode);
    }
}
