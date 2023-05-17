import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'lct_conversation_audit_record',
    timestamps: false,
    indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
        },
    ],
})
export class LctConversationAuditRecordEntity extends Model {
    @Column({
        autoIncrement: true,
        type: DataType.BIGINT,
        allowNull: false,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING(36),
        allowNull: false,
        field: 'conversation_id',
    })
    conversation_id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    tokens: number;
    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at',
    })
    createdAt: Date;
    @Column({
        type: DataType.STRING(128),
        allowNull: false,
        field: 'client_id',
    })
    clientId: string;
}

@Table({
    tableName: 'lct_user',
    timestamps: false,
    indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
        },
    ],
})
export class LctUserEntity extends Model {
    @Column({
        type: DataType.STRING(36),
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING(32),
        allowNull: true,
    })
    nickname: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        field: 'phone_number',
    })
    phoneNumber: string;

    @Column({
        type: DataType.ENUM('Activated', 'Deactivated'),
        allowNull: false,
        defaultValue: 'Deactivated',
    })
    state: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    remark: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
        field: 'allow_scopes',
    })
    allowScopes: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
        field: 'expiration_date',
    })
    expirationDate: string;
    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at',
    })
    createdAt: Date;
}

@Table({
    tableName: 'lct_conversation_channel',
    timestamps: false,
    indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
        },
    ],
})
export class LctConversationChannelEntity extends Model {
    @Column({
        type: DataType.STRING(36),
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING(36),
        allowNull: false,
        field: 'conversation_id',
    })
    conversationId: string;

    @Column({
        type: DataType.ENUM('Widget', 'DingTalk'),
        allowNull: false,
        comment: '可扩展Editor Enhance/CLI',
    })
    type: number;

    @Column({
        type: DataType.ENUM('Activated', 'Deactivated'),
        allowNull: false,
    })
    state: number;

    @Column({
        type: DataType.STRING(64),
        allowNull: false,
        field: 'access_key',
    })
    accessKey: string;

    @Column({
        type: DataType.STRING(128),
        field: 'origin',
    })
    origin: string;

    @Column({
        type: DataType.STRING(36),
        allowNull: false,
        field: 'creator_uid',
    })
    creatorUid: string;
    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at',
    })
    createdAt: Date;
}

@Table({
    tableName: 'lct_conversation',
    timestamps: false,
    indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
        },
    ],
})
export class LctConversationEntity extends Model {
    @Column({
        type: DataType.STRING(36),
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        field: 'plugin_id',
    })
    pluginId: string;

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        field: 'model_id',
    })
    modelId: string;

    @Column({
        type: DataType.STRING(36),
        allowNull: false,
        field: 'creator_uid',
    })
    creatorUid: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at',
    })
    createdAt: Date;
}
