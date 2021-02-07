<template>
	<view>
		<view class="h5_footer">
			<view class="footer_left">
				<image class="footer_image" src="/static/public/floatImg.png" />
				<text class="footer_text">您的好友送您一份新人科研好礼</text>
			</view>
			<view class="footer_right" v-if="!salserNo" @tap.stop='$downNASA'>
				下载App领取
			</view>
			<view class="footer_right" v-if="salserNo" @tap.stop='downNASA'>
				下载App领取
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			salserNo:{
				type: String,
				default: ''
			},
		},
		methods:{
			downNASA(){
				window.open('https://shop.neware.com.cn/GoStore/#/pages/down?salserNo='+this.salserNo)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.h5_footer{
		width:750upx;
		height:128upx;
		background:rgba(0,0,0,0.49);
		box-shadow:0 -2upx 20upx 0upx rgba(0,0,0,0.05);
		position: fixed;
		z-index: 800;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 0 32upx 16upx 16upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(255,255,255,1);
		.footer_left{
			display: flex;
			align-items: center;
			.footer_image{
				width: 104upx;
				height: 90upx;
				margin-right: 4upx;
				position: relative;
				top:-10upx
			}
			.footer_text{
				width: 224upx;
				font-size:28upx;;
				line-height:34upx;
			}
		}
		.footer_right{
			width:174upx;
			height:60upx;
			border-radius:32upx;
			border:2upx solid rgba(255,255,255,1);
			font-size:24upx;
			line-height:24upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
