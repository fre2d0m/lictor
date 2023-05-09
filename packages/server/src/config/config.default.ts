import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core';

export default (appInfo: MidwayAppInfo) => {
    return {
    // use for cookie sign key, should change to your own and keep security
        keys: appInfo.name + '_1683623077964_7504',
        egg: {
            port: 7001,
        },
    // security: {
    //   csrf: false,
    // },
    } as MidwayConfig;
};
