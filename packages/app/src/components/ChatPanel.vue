<template>
				<div class="main">
								<div class="chat-panel" :style="panelStyles">
												<div class="chat-panel-header">
																<img src="@/assets/images/icon-close.svg" alt=""
																					@click="() => {state.panelDisplay = 'none';visibilityChange(false)}">
												</div>
												<div class="chat-history">
																<ChatBubble v-for="message in state.messages" :key="message.id" :message="message"
																												@refresh="handleRefresh"/>
																<div ref="messagesEnd" class="messages-end"></div>
												</div>
												<ChatInput @send-message="handleSendMessage" :status="state.responseStatus"/>
								</div>
								<img src="@/assets/images/icon-ai-logo.png" alt="" class="btn-ai" @click="handleOpenPanel">
				</div>
</template>

<script setup>
import {reactive, onUpdated, computed, watch, defineEmits} from 'vue';
import ChatBubble from './ChatBubble.vue';
import ChatInput from './ChatInput.vue';
import {openDB} from 'idb';

const emits = defineEmits(['handle-send-message', 'visibility-change']);
const props = defineProps({
				increments: {
								type: Object,
				},
				panelVisibility: {
								type: Boolean,
								default: false,
				},
});

const state = reactive({
				messages: [],
				panelDisplay: 'none',
				latestMessage: '',
				responseFlag: false,
				responseStatus: false,

});
const time = "0.6s"

const panelStyles = computed(() => ({
				borderWidth: state.panelDisplay === "flex" ? '1px' : '0',
				"-webkit-transition": `width ${time} ease-out, height ${time} ease-out, transform ${time} ease-out`, /* Safari */
				transition: `width ${time} ease-out, height ${time} ease-out,transform ${time} ease-out`,
				transformOrigin: "375px 40px",
				transform: state.panelDisplay === "flex" ? 'scale(1)' : 'scale(0)',
}));

onUpdated(() => {
				const messagesEnd = document.querySelector('.messages-end');
				messagesEnd.scrollIntoView();
});
watch(() => state.panelDisplay, (newVal) => {
				setTimeout(() => {
								const messagesEnd = document.querySelector('.messages-end');
								messagesEnd.scrollIntoView();
				}, 100);
});
//监听props.increments的变化，当有新消息加入时,调取getResponse方法
watch(() => props.increments, (newVal) => {
				if (newVal) {
								console.log('newVal', newVal);
								getResponse(newVal);
				}
});

async function initDataBase() {
				await createDatabase();
				const db = await openDB('chatDatabase', 1);
				const tx = db.transaction('messages', 'readonly');
				const messageStore = tx.objectStore('messages');
				const messagesFromDB = await messageStore.getAll();
				state.messages = messagesFromDB;
}

initDataBase();

async function createDatabase() {
				const db = await openDB('chatDatabase', 1, {
								upgrade(db) {
												if (!db.objectStoreNames.contains('messages')) {
																const messageStore = db.createObjectStore('messages', {keyPath: 'id', autoIncrement: true});
																messageStore.createIndex('timestamp', 'timestamp');
												}
								},
				});
				return db;
}


const handleSendMessage = async (message) => {
				state.responseStatus = true;
				state.latestMessage = message;
				// 打开名为 `chatDatabase` 的数据库
				const db = await createDatabase();
				// 将消息存储到名为 `messages` 的对象存储中
				const tx = db.transaction('messages', 'readwrite');
				const messageStore = tx.objectStore('messages');
				const id = new Date().getTime();
				state.messages.push({id, type: 'sent', content: message, timestamp: id, role: 'user', status: 'sent'});
				//将消息存储到 IndexedDB 中
				messageStore.add({
								id: id,
								type: 'sent',
								content: message,
								timestamp: new Date().getTime(),
								role: 'user',
								status: 'sent',
				});
				//发送消息(发送的消息具有6条上下文)
				let historyMessages = state.messages.slice(-6).filter(item => item.status !== 'error').map(item => item)
				const contextMessages = [];
				historyMessages.forEach(item => {
								contextMessages.push({
												role: item.role,
												content: item.content,
								});
				});
				emits('handle-send-message', contextMessages);

				// //初始化response
				state.messages.push({
								id: new Date().getTime(),
								type: 'received',
								content: '',
								role: 'assistant',
								status: 'received'
				});
};

async function getResponse() {
				//todo error handling
				// if (props.increments.code !== 200) {
				// 				if (props.increments.code === 429) {
				// 								state.messages.push({
				// 												id: new Date().getTime(),
				// 												type: 'received',
				// 												content: '请求过于频繁，请稍后再试。',
				// 												status: 'error'
				// 								});
				// 								return;
				// 				}
				// 				if (props.increments.code === 500) {
				// 								state.messages.push({
				// 												id: new Date().getTime(),
				// 												type: 'received',
				// 												content: '服务器错误，请稍后再试。',
				// 												status: 'error'
				// 								});
				// 								return;
				// 				}
				// 				state.messages.push({id: new Date().getTime(), type: 'received', content: 'error', status: 'error'});
				// 				return;
				// }
				state.responseFlag = props.increments.state;
				//AI专家初始化
				const db = await createDatabase();
				const tx = db.transaction('messages', 'readwrite');
				const messageStore = tx.objectStore('messages');
				const messagesFromDB = await messageStore.getAll();
				const id = new Date().getTime();
				if (state.responseFlag === 'intro' && messagesFromDB.length === 0) {
								if (props.increments.content.type === 'object') {
												state.messages[state.messages.length - 1].content += props.increments.content.value.plugin.description;
												//将消息存储到 IndexedDB 中
												messageStore.add({
																id: id,
																type: 'received',
																content: '我是你的专属农事专家,通过了解你农场的所有信息为你提供种植建议。',
																timestamp: id,
																status: 1
												});
								}
				}
				//消息回复完成后将openai输出存入IndexedDB
				if (state.responseFlag === 'completed') {
								state.responseStatus = false;
								//将消息存储到 IndexedDB 中(过滤错误信息)
								if (state.messages[state.messages.length - 1].status !== 0) {
												messageStore.add({
																id: id,
																type: 'received',
																content: state.messages[state.messages.length - 1].content,
																timestamp: id,
																role: 'assistant',
																status: 'received',
												});
								}
								return
				}

				//打字机效果输出

				if (props.increments.content.type === 'text') {
								state.messages[state.messages.length - 1].content += props.increments.content.value;
				}
				//滚动到底部
				const messagesEnd = document.querySelector('.messages-end');
				messagesEnd.scrollIntoView();
}


async function handleOpenPanel() {
				state.panelDisplay = 'flex';
				visibilityChange(true);
}

async function handleRefresh() {
				//将最新发送的一条type为sent的消息再次发送
				handleSendMessage(state.latestMessage)
}

function visibilityChange(visibility) {
				//监听panel变化
				emits('visibility-change', visibility);
}

</script>

<style scoped lang="less">
::-webkit-scrollbar {
				background-color: transparent;
				width: 6px;
				height: 5px;
}

::-webkit-scrollbar-button {
				display: none
}

::-webkit-scrollbar-track {
				background-color: transparent;
}

::-webkit-scrollbar-track-piece {
				display: none
}

::-webkit-scrollbar-thumb {
				background-color: #ABB0D4;
				border-radius: 4px;
}

::-webkit-scrollbar-corner {
				display: none
}

::-webkit-resizer {
				display: none
}

.main {
				width: 418px;
				min-height: 525px;
				position: relative;
				display: flex;
}

.chat-panel {
				width: 418px;
				min-height: 525px;
				transform: rotate(0deg);
				transform-origin: center;
				display: flex;
				flex-direction: column;
				position: relative;
				background: rgba(1, 4, 24, 0.9);
				backdrop-filter: blur(16px);
				/* Note: backdrop-filter has minimal browser support */
				border-radius: 16px;
				overflow: hidden;
				border: 1px solid rgba(255, 255, 255, 0.26);

				& .chat-panel-header {
								position: absolute;
								width: 100%;
								display: flex;
								justify-content: space-between;
								align-items: center;
								height: 73px;
								padding: 0 24px 0 27px;
								top: 0;
								left: 0;
								background: rgba(1, 4, 24, 0.9);
								backdrop-filter: blur(16px);
								border-bottom: 1px solid rgba(124, 124, 124, 0.2);
								z-index: 999;

								& > img:nth-child(1) {
												cursor: pointer;
								}

								& > img:nth-child(2) {
												width: 34px;
												height: auto;
								}
				}

				& .chat-history {
								display: flex;
								flex-direction: column;
								overflow-y: scroll;
								height: 354px;
								background: rgba(1, 4, 24, 0.9);
								backdrop-filter: blur(16px);
								padding-bottom: 12px;
								margin-top: 73px;
								padding-top: 12px;
				}
}

.btn-ai {
				position: absolute;
				right: 24px;
				top: 20px;
				width: 34px;
				height: auto;
				cursor: pointer;
				z-index: 99999;
}

</style>
