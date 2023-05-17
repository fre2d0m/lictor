import { App, ILogger, Inject, OnWSConnection, OnWSDisConnection, OnWSMessage, WSController } from '@midwayjs/core';
import { Application as WsApplication, Context as WsContext } from '@midwayjs/ws';
import * as http from 'http';
import { JwtService } from '@midwayjs/jwt';
import { LctConversationChannelEntity, LctConversationEntity } from '../entity/Models';
import * as crypto from 'crypto';
import * as querystring from 'node:querystring';
import { minimatch } from 'minimatch';
import { CompletionState, Prompt } from '../interface';
import { PluginAgent } from '../plugin/agent';
import { Application, Context } from '@midwayjs/koa';

@WSController()
export class ChatSocketHandler {
    @Inject()
    ctx: WsContext;
    @Inject()
    jwtService: JwtService;
    @Inject()
    logger: ILogger;
    @App('webSocket')
    wsApp: WsApplication;
    @App()
    app: Application;

    private async validateConnectionByJWT(jwtToken: string) {
        try {
            await this.jwtService.verify(jwtToken, {
                complete: true,
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    @OnWSConnection()
    async handleConnection(socket: Context, request: http.IncomingMessage) {
        const authorization = request.headers.authorization;
        const url = new URL(`ws://${request.headers.host}${request.url}`);
        const query = querystring.parse(url.search.substring(1));
        const { channelId, nonce, signature, timestamp, clientId } = query;
        let conversationId;
        if (authorization) {
            const jwtToken = authorization.split(' ')[1];
            if (!(await this.validateConnectionByJWT(jwtToken))) {
                return socket.close(4001, 'Invalid token');
            }
            conversationId = query.conversationId;
        } else {
            const origin = request.headers.origin;

            const channel = await LctConversationChannelEntity.findByPk(<string>channelId);
            if (!channel) {
                return socket.close(4001, 'Invalid channel.');
            }
            if (channel.origin && !minimatch(origin, channel.origin)) {
                return socket.close(4001, 'Unauthorized access source.');
            }
            if (!clientId) {
                return socket.close(4001, 'Client Id is require.');
            }
            const plaintext = [channel.accessKey, nonce, timestamp, channelId].sort().join('');
            const hash = crypto.createHash('sha256').update(plaintext).digest('hex');
            if (hash.toLowerCase() !== (<string>signature).toLowerCase()) {
                return socket.close(4001, 'Signature verification failed.');
            }
            conversationId = channel.conversationId;
            socket.setAttr('clientId', clientId);
        }
        const conversation = await LctConversationEntity.findByPk(<string>conversationId);
        const agent = new PluginAgent();
        agent.on('stateChanged', (state: CompletionState) => {
            this.ctx.send(JSON.stringify(state));
        });
        await agent.initialize(conversation.pluginId, conversation.modelId);
        socket.setAttr('agent', agent);
        this.logger.info('A new client %s conversation %s connection was established.', clientId, conversation.id);
    }

    @OnWSMessage('message')
    async handleMessage(data) {
        try {
            const message: Prompt[] = JSON.parse(data);
            this.logger.info('Received %j', message);
            const agent: PluginAgent = this.ctx.getAttr('agent');
            await agent.completion(message);
        } catch (e) {
            // ignore json error
            if (e instanceof SyntaxError) {
                return;
            }
            this.logger.error('Internal error', e);
        }
    }

    @OnWSDisConnection()
    async handleDisconnect(errorCode: number) {
        console.log('disconnect ', errorCode);
        // abort the responding conversation pipeline
    }
}
