<template>
				<div :class="['chat-bubble', props.message.type]">
								<div class="content">
												<p :style="{color: props.message.status === 0 && props.message.type === 'received' ? '#FF8F6B' : '#fff'}">
																{{ props.message.content }}
												</p>
								</div>
								<img src="@/assets/images/icon-refresh.svg" alt="" class="icon-refresh"
													v-if="props.message.type === 'received' && props.message.status === 0" @click="handleRefresh()">
				</div>
</template>

<script setup>

import {defineProps,defineEmits} from 'vue';

const props = defineProps({
				message: {
								type: Object,
								required: true,
				},
});
const emits = defineEmits(['refresh']);
const handleRefresh = () => {
//				发送消息给父组件
				emits('refresh',  props.message);

}


</script>

<style lang="less" scoped>
.chat-bubble {
				display: flex;
				padding: 8px 24px;
				border-radius: 18px;
}

.received {
				justify-content: flex-start;

				& .icon-refresh {
								margin-left: 9px;
								cursor: pointer;
				}
}

.sent {
				justify-content: flex-start;
				flex-direction: row-reverse;

				& .icon-refresh {
								margin-right: 9px;
								cursor: pointer;
				}
}


.avatar {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 40px;
				height: 40px;
				margin-right: 8px;
				margin-left: 8px;
}

.avatar img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
}

.content {
				display: flex;
				align-items: center;
				max-width: 90%;
				padding: 8px 14px;
				border-radius: 4px;
				font-weight: 400;
				font-size: 14px;
				line-height: 26px;
				color: #FFFFFF;
				min-height: 42px;

				& > p {
								margin-bottom: 0;
				}
}

.sent .content {
				border-radius: 18px 18px 0 18px;
				background: #2491FF;
				backdrop-filter: blur(21.3751px);
}

.received .content {
				background: rgba(53, 58, 73, 0.3);
				backdrop-filter: blur(21.3751px);
				border-radius: 18px 18px 18px 0;
}
</style>
