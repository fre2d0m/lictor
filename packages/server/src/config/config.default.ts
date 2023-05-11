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
                dir: '../public',
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
} as MidwayConfig;
