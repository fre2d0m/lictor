<template>
    <main>
								<ChatPanel />
				</main>
</template>

<script>
import { defineComponent } from 'vue';
import ChatPanel from '../components/ChatPanel.vue';

export default defineComponent({
				name: 'Lictor',
				page: {
								title: 'Lictor',
								route: '/',
				},
				components: {
								ChatPanel,
				},
});

</script>


