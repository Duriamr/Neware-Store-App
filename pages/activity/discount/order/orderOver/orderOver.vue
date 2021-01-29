<template>
	<view class="oO_content">
		<view style="background: linear-gradient(135deg, #FF4A4A 0%, #FF6E37 100%);">
			
		<view class="oO_header">
			<view class="status"></view>
			<view class='header'>
				<image class="back" src="/static/goods/back.png" @tap.stop="$back"></image>
				{{header}}
			</view>
		</view>
		<view class="header_placeholder"></view>
		
		<view class="main">
			<image :src="type==1||type==3?yes:type==0||type==2?no:''" />
			<view class="title">
				{{title}}
			</view>
			
			<view class="subTitle">
				{{subTitle}}
			</view>
			
			<view class="btns">
				<view class="btn" @tap="toOrderDetails">
					查看订单
				</view>
				<view class="btn btn2" @tap="$toHome()" v-if="type==1||type==3">
					返回首页
				</view>
				<view class="btn btn2" @tap="toPay()" v-if="type==2">
					重新支付
				</view>
				<view class="btn btn2" @tap="$back()" v-if="type==0">
					重新提交
				</view>
			</view>
			
			<view class="tips" v-if="tipShow">
				温馨提示：审核通过后将会以线下方式进行支付跟发货
			</view>
		</view>
		</view>
		<help />
	</view>
</template>

<script>
	import help from '@/components/nw-help/nw-help';
	export default {
		components: {help},
		data() {
			return {
				orderId:'',
				type:'',//0.线下失败 1.线下成功 2.线上失败 3.线上成功
				header:'',
				title:'',
				subTitle:'',
				tipShow:false,
				
				yes:'/static/order/yes.png',
				no:'/static/order/no.png'
			};
		},
		onLoad(options) {
			this.orderId = options.orderId
			this.type = options.type
		},
		watch:{
			type:function(val){
				if(val == 0){
					this.header = '订单提交失败'
					this.title = '订单提交失败'
					this.subTitle = '抱歉，请重新提交'
					this.tipShow = true
				}else if(val == 1){
					this.header = '订单提交成功'
					this.title = '订单已提交后台审核'
					this.subTitle = '工作人员将会尽快为您审核'
					this.tipShow = true
				}else if(val == 2){
					this.header = '订单支付失败'
					this.title = '订单支付失败'
					this.subTitle = '该订单会为您保留30分钟(从下该订单时间算起)，如超时后未支 付，系统会自动为您关闭该订单。如需帮助，请联系商城客服。'
					this.tipShow = false
				}else if(val == 3){
					this.header = '订单支付成功'
					this.title = '订单支付成功'
					this.subTitle = ''
					this.tipShow = false
				}
			}
		},
		methods:{
			toOrderDetails(){
				uni.redirectTo({
					url:'/pages/order/orderDetails/orderDetails?orderId='+this.orderId
				})
			},
			toPay(){
				uni.redirectTo({
					url:"/pages/order/pay/pay?orderId="+this.orderId
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F5F5F5;
	}
	.oO_content{
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color:rgba(255,255,255,1);
		.main_bot{
			width: 100%;
			background:rgba(248,181,0,1);
			padding-bottom: 40upx;
			font-size:24upx;
			line-height:24upx;
			text{
				margin-left: 24upx;
			}
		}
	}
	.oO_header{
		width: 100%;
		position: fixed;
		z-index: 10;
		top: 0;
		background: linear-gradient(135deg, #FF4A4A 0%, #FF6E37 100%);
		.header{
			width: 100%;
			height: 88upx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36upx;
			line-height: 36upx;
			.back{
				position: absolute;
				left: 16upx;
				width: 48upx;
				height: 48upx;
			}
		}
	}
	.main{
		width: 100%;
		background: rgba(255,255,255,0);
		padding: 48upx 0;
		border-radius:0px 0px 16upx 16upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		image{
			width:96upx;
			height:96upx;
		}
		.title{
			font-size:36upx;
			line-height:36upx;
			margin: 24upx 0 16upx;
		}
		.subTitle{
			height: 90upx;
			padding: 0 24upx;
			font-size:24upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			line-height:30upx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			overflow: hidden;
			margin-bottom: 18upx;
		}
		.btns{
			display: flex;
			justify-content: center;
			align-items: center;
			.btn{
				width:280upx;
				height:76upx;
				border-radius:38upx;
				font-size:28upx;
				line-height:28upx;
				display: flex;
				justify-content: center;
				align-items: center;
				border:2upx solid rgba(255,255,255,1)
			}
			.btn2{
				margin-left: 48upx;
				background:rgba(255,255,255,1);
				color:#F75C50;
			}
		}
		.tips{
			width: 100%;
			box-sizing: border-box;
			margin-top: 32upx;
			padding-left: 24upx;
			font-size:24upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			line-height:24upx;
		}
	}
</style>
