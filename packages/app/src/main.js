import './assets/main.css';
import 'ant-design-vue/dist/antd.css';
import Antd from "ant-design-vue";

import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
//添加router
import indexPromise from './router/index.js';
import {createRouter, createWebHistory} from 'vue-router';

const app = createApp(App);

const index = await indexPromise;

//初始化Router
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), routes: index
});

app.use(createPinia());
app.use(router);
app.use(Antd)
app.mount('#app');
