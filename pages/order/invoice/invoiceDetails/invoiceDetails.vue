<template>
	<view class="id_content">
		<image :src="data.status?'/static/order/invoice/invoiceDetails_03.png':orderStatus?'/static/order/invoice/invoiceDetails_02.png':'/static/order/invoice/invoiceDetails_01.png'" mode="widthFix" />
		
		<view class="data_ul">
			<view class="data_list">
				<text class="title">发票金额：</text>
				<text>¥{{data.taxAmount}}</text>
			</view>
			<view class="data_list">
				<text class="title">发票类型：</text>
				<text>{{data.invoiceType?'电子普通发票':'纸制普通发票'}}</text>
			</view>
			<view class="data_list">
				<text class="title">发票抬头：</text>
				<text>{{data.name}}</text>
			</view>
			<view class="data_list" v-if="data.invoiceTitle==2">
				<text class="title">税号：</text>
				<text>{{data.taxNo}}</text>
			</view>
			<view class="data_list">
				<text class="title">发票内容：</text>
				<text>商品明细</text>
			</view>
			<view class="data_list">
				<text class="title">手机号码：</text>
				<text>{{data.receivePhone}}</text>
			</view>
			<view class="data_list">
				<text class="title">电子邮箱：</text>
				<text>{{data.receiveEmail}}</text>
			</view>
			<view class="data_list">
				<text class="title">申请时间：</text>
				<text>{{data.createTime}}</text>
			</view>
			<view class="data_list" v-if="data.status">
				<text class="title">开票时间：</text>
				<text>{{data.completeTime}}</text>
			</view>
		</view>
		
		<view class="tips">
			<text>发票须知：</text>
			<text>1.开票金额为用户实际支付金额(不含礼品卡、优惠券)；</text>
			<text>2.填写开票信息后将会在确定收货后的7个工作日内会将电子发票 发送到对应的手机号码或邮箱里。（注：开票明细只根据购买明细 开票）；</text>
			<text> 3.单笔订单只支持开具一种发票类型，如需增值税专用发票请联系 客服处理</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:'',
				orderStatus:0,
				orderId:'',
				data: {
				    "id": 0,
				    "taxAmount": 0,
				    "invoiceType": 1,
				    "invoiceTitle": 0,
				    "name": "",
				    "taxNo": "",
				    "receivePhone": "",
				    "receiveEmail": "",
				    "receiveAddress": "",
				    "status": 0,
				    "createTime": "",
				    "completeTime": ""
				}
			};
		},
		onLoad(options) {
			this.orderStatus = Number(options.status)
			this.orderId = options.orderId
		},
		onShow(){
			this.token = uni.getStorageSync('token');
			this.getInvoice(this.orderId)
		},
		methods:{
			getInvoice(orderId){
				uni.request({
					url: this.$url+'/api/invoice/get?orderId='+orderId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				
					success: (res) => {
						if(res.data.success&& res.data.code == 200){
							this.data = res.data.data
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
					},
					fail: (err) => {
						this.$requestFail()
					},
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: #F5F5F5;
	}
	.id_content{
		font-size: 28upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 28upx;
		
		box-sizing: border-box;
		padding: 20upx;
	}
	image{
		width: 100%;
		margin-bottom: 20upx;
	}
	.data_ul{
		width: 100%;
		background: #FFFFFF;
		border-radius: 16upx;
		box-sizing: border-box;
		padding: 32upx;
		margin-bottom: 20upx;
		.data_list{
			width: 100%;
			display: flex;
			align-items: center;
			margin-bottom: 40upx;
			.title{
				width: 150upx;
				color: #B3B3B3;
			}
			&:last-of-type{
				margin-bottom: 0;
			}
		}
	}
	.tips{
		width: 100%;
		box-sizing: border-box;
		font-size: 24upx;
		color: #B3B3B3;
		line-height: 34upx;
		margin-top: 20upx;
		display: flex;
		flex-direction: column;
	}
</style>
