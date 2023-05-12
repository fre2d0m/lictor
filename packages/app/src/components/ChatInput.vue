<template>
				<div class="chat-input">
								<section>
												<a-textarea v-model:value="message" placeholder="请输入您的问题..." :bordered="false"
																								:rows="1" @pressEnter="handleKeydown"
																								autofocus class="textarea" :autoSize="true">
												</a-textarea>
												<div class="sec-btn">
																<img src="@/assets/images/icon-send.svg" alt="" @click=handleSend() class="icon-send" v-if="!props.status">
																<Progressing class="progressing" v-else></Progressing>
												</div>
								</section>
				</div>
</template>

<script setup>
import {defineEmits, onMounted, ref, watch} from 'vue';
import Progressing from "@/components/framework/Progressing.vue";

const emits = defineEmits(['send-message']);
const props = defineProps({
				status: {
								type: Boolean,
				},
});

const message = ref('');

async function handleSend() {
				if (message.value.trim() && !props.status) {
								emits('send-message', message.value.trim());
								message.value = '';
				}
}

async function handleKeydown(e) {
				if (e.keyCode === 13) {
								if (!props.status) {
												handleSend();
								}
								e.preventDefault();
				}
}

</script>

<style scoped lang="less">
.chat-input {
				padding: 20px 24px 28px;
				background: rgba(1, 4, 24, 0.9);
				backdrop-filter: blur(16px);
				border-top: 1px solid rgba(124, 124, 124, 0.2);

				& section {
								width: 100%;
								height: 100%;
								display: flex;
								align-items: center;
								justify-content: space-between;
								background: rgba(21, 24, 44, 0.8);
								border-radius: 6px;
								padding: 12px 0px;

								& .sec-btn {
												display: flex;
												height: 100%;
												align-items: flex-end;
												justify-content: center;
								}

								& .icon-send {
												margin-right: 22px;
												cursor: pointer;
								}
								& .progressing{
												margin-right: 12px;
												margin-bottom: 8px;
								}
				}

				:deep(textarea) {
								color: #fff;
								background: transparent;
								max-height: 60px !important;
								overflow-y: hidden;
								font-weight: 400;
								font-size: 14px;
								resize: none;
								height: 15px;
								line-height: 22px;
								border-radius: 6px;
								padding-left: 14px;
								padding-right: 14px;
								padding-top: 0;
								padding-bottom: 0;
				}

				:deep(textarea.ant-input) {
								min-height: 14px;
				}
}

</style>
