import { App, ILogger, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import LLMs from '../llms';
import { Context } from '@midwayjs/koa';
import { LctConversationChannelEntity, LctConversationEntity } from '../entity/Models';
import * as crypto from 'crypto';
import { nanoid } from 'nanoid';

@Provide()
@Scope(ScopeEnum.Singleton)
export class ChatService {
    @Inject()
    redisService: RedisService;
    @App()
    app: Context;
    @Inject()
    ctx: Context;
    @Inject()
    logger: ILogger;

    async getLLMModels(type: string) {
        const models = await LLMs();
        return models.filter(model => !type || model.type === type);
    }

    async createConversation(modelId: string, pluginId: string) {
        const creatorUid = '1';
        const conversation = await LctConversationEntity.create({
            id: crypto.randomUUID(),
            creatorUid,
            modelId,
            pluginId,
            createdAt: new Date(),
        });
        this.logger.info('The new conversation was created by %s', creatorUid);
        return conversation;
    }

    async createConversationChannel(cid: string, type: string) {
        const creatorUid = '1';
        const conversation = await LctConversationEntity.findByPk(cid);
        if (!conversation) {
            throw new Error('The conversation info does not exist!');
        }
        const channel = await LctConversationChannelEntity.create({
            id: crypto.randomUUID(),
            conversationId: conversation.id,
            type,
            state: 'Activated',
            accessKey: nanoid(32),
            creatorUid: conversation.creatorUid,
            createdAt: new Date(),
        });
        this.logger.info('The new conversation channel was created by %s', creatorUid);
        const nonce = nanoid(8);
        const timestamp = Date.now();
        const plaintext = [channel.accessKey, nonce, timestamp, channel.id].sort().join('');
        const hash = crypto.createHash('sha256').update(plaintext).digest('hex');
        return {
            id: channel.id,
            accessKey: channel.accessKey,
            nonce,
            timestamp,
            signature: hash,
        };
    }
}
