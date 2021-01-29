<template>
	<view>
		<view class="noLogin_content">
			<view class="noLogin">
				<view class="text">
					{{text}}
				</view>
				<view class="btn" @tap.stop="$toLogin">
					立即登录
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		name: 'noLogin',
		data() {
			return {
				text:''
			};
		},
		created() {
			this.getText()
		},
		methods:{
			getText(){
				uni.request({
				    url: this.$url+'/api/app/tips', 
					method: "GET",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.text = res.data.data;
						}else{
							this.text = '马上登录 尽享更多科研热门资讯'
						}
				    }
				});
			},
		}
	}
</script>

<style lang="scss">
	.noLogin_content{
		width: 100%;
		box-sizing: border-box;
		padding: 0 24upx;
		font-size: 28upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 28upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		position: fixed;
		bottom: 66upx;
		/* #ifdef H5*/    
		bottom: 164upx;   
		/* #endif */   
		.noLogin{
			width: 100%;
			height: 84upx;
			box-sizing: border-box;
			padding: 0 12upx 0 40upx;
			background: rgba(51, 51, 51, 0.7);
			border-radius: 42upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.text{
				width: 480upx;
				font-size: 28upx;
				line-height: 28upx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.btn{
				width: 168upx;
				height: 60upx;
				background: #F8B500;
				border-radius: 30upx;
				font-size: 24upx;
				line-height: 24upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	
</style>
