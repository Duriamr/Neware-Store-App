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
		onLoad(option){
			// #ifdef APP-PLUS   
			let ssil = uni.getSystemInfoSync();
			if(ssil.platform == 'android'){
				plus.screen.unlockOrientation();
			}
			// #endif  
			this.src = uni.getStorageSync('liveUrl');
		},
		onUnload() {
			// #ifdef APP-PLUS
			let ssiu = uni.getSystemInfoSync();
			if(ssiu.platform == 'android'){
				plus.screen.lockOrientation('portrait-primary');
			}
			// #endif  
		}
	}
</script>

<style lang="scss">

</style>