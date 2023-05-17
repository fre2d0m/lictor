<template>
    <main>
        <Lictor @handleSendMessage="handleSendMessage" :increments="state.increments"
                @visibilityChange="handleVisibilityChange"/>
    </main>
</template>

<script>
import Lictor from '../components/ChatPanel.vue';

export default {
    name: 'Lictor',
    page: {
        title: 'Lictor',
        route: '/',
    },
};
</script>
<script setup>
import {reactive, watch} from "vue";

const state = reactive({
    increments: {},
    message: '',
    panelVisibility: false,
});

function handleVisibilityChange(visibility) {
    console.log('visibility', visibility);
}

function handleSendMessage(message) {
    //接收提问
    console.log('message', message);
    getReply(message);
}

async function getReply(message) {
//todo 获取回复,回复格式为{"state":"typing","content":{"type":"text","value":"信息"},code:200}
    let i = 0;
    let content = '';
    //mock每隔1s发送一条消息，消息内容为i+1，i从0开始
    const timer = setInterval(() => {
        i++;
        content = i;
        state.increments = {
            code: 200, "state": "typing", "content": {"type": "text", "value": i}
        };
        if (i === 5) {
            clearInterval(timer);
            state.increments = {
                code: 200, state: 'completed'
            };
        }
    }, 1000);
//				接收websocket消息
// 			const ws = new WebSocket('ws://localhost:8080');
// 			ws.onopen = function () {
// 				console.log('open');
// 				ws.send('something');
// 			};
// 			ws.onmessage = function (evt) {
// 				console.log('message', evt.data);
// 				ws.close();
// 			};
// 			ws.onclose = function () {
// 				console.log('close');
// 			};
// 			ws.onerror = function (evt) {
// 				console.log('error', evt);
// 			};
}
</script>


