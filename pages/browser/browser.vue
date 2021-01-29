<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				webviewStyles: {
					progress: {
						color: '#F8B500'
					}
				}
			};
		},
		onLoad(option) {
			this.src = option.src
		}
	}
</script>

<style lang="scss">

</style>
