<template>
				<div class="dot-wrapper">
								<div class="dot dot1"></div>
								<div class="dot dot2"></div>
								<div class="dot dot3"></div>
				</div>
</template>

<script>
export default {
				name: "Progressing"
}
</script>

<style scoped>
.dot-wrapper{
				width: 22px;
				display: flex;
				align-items: center;
				justify-content: space-between;
}
.dot {
				display: inline-block;
				width: 4px;
				height: 4px;
				background-color: #2491FF;
				margin-right: 3px;
				opacity: 0;
				animation: blink 1s ease-in-out infinite;
}
.dot1 {
				animation-delay: 0s;
}
.dot2 {
				animation-delay: 0.3s;
}
.dot3 {
				animation-delay: 0.6s;
}
@keyframes blink {
				0% {
								opacity: 0;
				}
				50% {
								opacity: 1;
				}
				100% {
								opacity: 0;
				}
}
</style>
