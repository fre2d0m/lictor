import { App, Controller, Get, Inject, Param, Post, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CaptchaService } from '@midwayjs/captcha';
import { JwtService } from '@midwayjs/jwt';
import { ChatService } from '../service/chat.service';

@Controller('/api')
export class APIController {
    @Inject()
    ctx: Context;

    @App()
    app: Context;

    @Inject()
    captchaService: CaptchaService;
    @Inject()
    jwtService: JwtService;
    @Inject()
    chatService: ChatService;

    @Post('/account/login')
    async login() {}

    @Get('/captcha/formula')
    async getFormulaCaptcha() {
        const { id, imageBase64 } = await this.captchaService.formula({ noise: 1 });
        return {
            id,
            imageBase64,
        };
    }

    @Post('/chat/conversation')
    async createConversation(@Query('model') modelId: string, @Query('plugin') pluginId: string) {
        const conversation = await this.chatService.createConversation(modelId, pluginId);
        return {
            id: conversation.id,
        };
    }

    @Get('/chat/conversation/:cid/channel')
    async createConversationChannel(@Param('cid') cid: string, @Query('type') type: string) {
        if (type !== 'widget') {
            throw new Error('Unsupported channel type: ' + type);
        }
        if (!cid) {
            throw new Error('Invalid conversation info!');
        }
        const { id, nonce, timestamp, signature } = await this.chatService.createConversationChannel(cid, type);
        const { hostname } = this.ctx.request;
        return {
            id: id,
            url: `wss://${hostname}/endpoint/v1/chat?channelId=${id}&nonce=${nonce}&timestamp=${timestamp}&signature=${signature}`,
        };
    }

    @Get('/chat/plugins')
    async getPlugins() {
        return {};
    }

    @Get('/chat/models')
    async getModels(@Query('type') type: string) {
        //type=text-to-text
        const models = await this.chatService.getLLMModels(type);
        return models.map(v => {
            return {
                id: v.id,
                name: v.name,
                type: v.type,
                icon: v.icon,
                capabilities: v.capabilities,
                provider: v.provider,
            };
        });
    }
}
