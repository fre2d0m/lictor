import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    /**
     * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
     * @default 'dist'
     */
    outDir: "dist",
    build: {
        publicPath:"/",
        assetsDir: "assets",
        cssCodeSplit: true,
        terserOptions: {
            compress: {
                drop_console: true,  //打包时删除console
                drop_debugger: true, //打包时删除 debugger
                pure_funcs: ["console.log"] //移除console
            },
            output: {
                // 去掉注释内容
                comments: true,
            },
        }
    },
    // 反向代理
    server: {
        // host: "0.0.0.0",
        port: "3002",
        // 是否自动在浏览器打开
        open: true,
        proxy: {
            // 选项写法
            "/api": {
                target: "http://localhost:3001",
            }
        },
    },
});
