<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:'',
				src: '',
				webviewStyles: {
					progress: {
						color: '#F8B500'
					}
				}
			};
		},
		onLoad(option) {
			this.token = uni.getStorageSync('token');
			this.src = option.src+'?token='+this.token
		}
	}
</script>

<style lang="scss">

</style>
