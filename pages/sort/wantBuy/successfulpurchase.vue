<template>
	<view class="successfulpurchase">
		<image src='/static/tabBar/success.png' class="success"></image>
		<view class="submit">提交成功</view>
		<view class="contact">金牌客服员会尽快与您取得联系</view>
		<view class="btn" @tap='goback'>关闭</view>
	</view>
</template>

<script>
export default{
	methods:{
		goback(){
			uni.switchTab({
				url:'/pages/tabBar/sort/sort'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.successfulpurchase{
	width: 100%;
	height: 100%;
	padding-top: calc(88upx + var(--status-bar-height));
	box-sizing: border-box;
	overflow: hidden;
	background-color: #FFFFFF;
	text-align: center;
	.success{
		margin-top: 96upx;
		width: 144upx;
		height: 144upx;
	}
	.submit{
		margin-top: 48upx;
		font-size: 36upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
	}
	.contact{
		margin-top: 16upx;
		font-size: 24upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
	}
	.btn{
		width: 560upx;
		height: 76upx;
		text-align: center;
		line-height: 76upx;
		background: #F8B500;
		border-radius: 38upx;
		font-size: 28upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		margin: 112upx auto;
	}
}
</style>
