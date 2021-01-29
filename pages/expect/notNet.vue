<template>
	<view class="notNet_content">
		<empty id="empty" src="/static/expect/not_Network.png" text="哎呀！网络开小差了" btnShow btnText="重新加载" @btn="getNet()" />
	</view>
</template>

<script>
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {empty},
		data() {
			return {
				
			};
		},
		onBackPress() {
			this.$failOff = false
		},
		methods:{
			getNet(){
				uni.showLoading({title:'加载中'})
				uni.request({
					url: this.$url+'/api/app/tips', 
					method: "GET",
					
					success: (res) => {
						uni.hideLoading()
						uni.navigateBack()
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title:'未连接到网络，请重试',
							icon:'none',
							position:'center'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	#empty{
		margin-top: 468upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: calc(468upx + var(--status-bar-height));
		/*  #endif  */
	}
</style>
