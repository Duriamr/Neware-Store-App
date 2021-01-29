<template>
	<view class="sigSuccess">
		<image src="/static/order/orderDetails/logistics/logistics_3.png" mode="widthFix" />
		<view class="title">信息已提交</view>
		<text>工作人员将会尽快为您发货</text>
		<view class="btn" @tap="$back">
			返回上一页
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
	}
</script>

<style lang="scss">
	page{
		background: #F5F5F5;
	}
	.sigSuccess{
		width: 100%;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(51,51,51,1);
		border-radius:0px 0px 16upx 16upx;
		image{
			width: 96upx;
			margin: 48upx 0 24upx;
		}
		.title{
			font-size:36upx;
			line-height:36upx;
			margin-bottom: 16upx;
		}
		text{
			font-size:24upx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			line-height:24upx;
			margin-bottom: 56upx;
		}
		.btn{
			width:280upx;
			height:76upx;
			background:rgba(248,181,0,1);
			border-radius:38upx;
			font-size:28upx;
			color:rgba(255,255,255,1);
			line-height:28upx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 120upx;
		}
	}
</style>
