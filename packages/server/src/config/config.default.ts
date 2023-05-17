import { MidwayConfig } from '@midwayjs/core';

export default {
    // use for cookie sign key, should change to your own and keep security
    keys: '1683785708944_9294',
    koa: {
        port: 7001,
    },
    staticFile: {
        dirs: {
            default: {
                prefix: '/',
                dir: 'public',
                alias: {
                    '/': '/index.html',
                },
            },
        },
    },
    cors: {
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'.split(','),
        // 设置 Access-Control-Allow-Origin 的值，【默认值】会获取请求头上的 origin
        origin: '*',
        // 设置 Access-Control-Allow-Headers 的值，【默认值】会获取请求头上的 Access-Control-Request-Headers
        allowHeaders: '*',
        credentials: true,
        // 是否在执行报错的时候，把跨域的 header 信息写入到 error 对的 headers 属性中，【默认值】false
        keepHeadersOnError: true,
    },
    codeDye: {
        matchQueryKey: 'dye',
    },
    redis: {
        client: {
            port: process.env.REDISPORT || 6379, // Redis port
            host: process.env.REDISHOST || '127.0.0.1', // Redis host
            password: process.env.REDISPASSWORD || '123456',
            db: 0,
        },
    },
    sequelize: {
        dataSource: {
            default: {
                database: process.env.MYSQLDATABASE || 'lictor',
                username: process.env.MYSQLUSER || 'root',
                password: process.env.MYSQLPASSWORD || 'root',
                host: process.env.MYSQLHOST || '127.0.0.1',
                port: process.env.MYSQLPORT || 3306,
                encrypt: false,
                dialect: 'mysql',
                define: { charset: 'utf8' },
                timezone: '+08:00',
                entities: ['entity'],
                // 本地的时候，可以通过 sync: true 直接 createTable
                sync: false,
            },
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET || '1684143813382',
        expiresIn: '2d', // https://github.com/vercel/ms
    },
} as MidwayConfig;
