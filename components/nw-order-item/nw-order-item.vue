<template>
	<view>
		<view class="order_list" @tap.stop="toOrderDetails(item.id)">
			<view class="list_header">
				<view class="header_left">
					订单编号：{{item.orderNo}}
				</view>
				<view class="header_right" v-if="item.orderStatus == 1" style="color: #F75C50;">
					待付款
				</view>
				<view class="header_right" v-if="item.orderStatus == 2" style="color: #F75C50;">
					已提交
				</view>
				<view class="header_right" v-if="item.orderStatus == 3" style="color: #F75C50;">
					待发货
				</view>
				<view class="header_right" v-if="item.orderStatus == 4" style="color: #F75C50;">
					已发货
				</view>
				<view class="header_right" v-if="item.orderStatus == 5">
					交易完成
				</view>
				<view class="header_right" v-if="item.orderStatus == 6">
					交易关闭
				</view>
				<view class="header_right" v-if="item.orderStatus == 7">
					已取消
				</view>
			</view>
			<view class="list_li" v-for="(item2, index2) in item.orderDetails" :key="index2">
				<view class="left">
					<image :src="item2.imgUrl" />
					<view class="product">
						<text class="title">
							{{item2.productName}}
						</text>
						<text class="format" v-if="item2.skuSpce.length != 0">
							<block>
							<text v-for="(item3, index3) in item2.skuSpce" :key="'sku'+index3" v-if="index3 != item2.skuSpce.length-1">{{item3.value}}/</text>
							<text v-for="(item3, index3) in item2.skuSpce" :key="'sku'+index3" v-if="index3 == item2.skuSpce.length-1">{{item3.value}}</text>
							</block>
						</text>
					</view>
				</view>
				<view class="right">
					<view class="price">
						<text class="currency">
							￥
						</text>
						<text class="money">
							{{item2.price}}
						</text>
					</view>
					<text class="quantity">
						x{{item2.quantity}}
					</text>
				</view>
			</view>
			<view class="list_bot">
				<view class="bot1">
					共{{item.total}}件商品
				</view>
				<view class="bot2">
					订单金额：
				</view>
				<view class="bot3">
					￥{{item.amount}}
				</view>
			</view>
			<view class="list_btns">
				<view class="left" v-if="item.isCan">
					<text v-if="item.orderStatus == 3||item.orderStatus == 4||item.orderStatus == 5" @tap.stop="showExtend()">更多</text>
					
					<view class="extend_info" v-if="item.extend">
						<image class="arrow" mode="widthFix" src="/static/public/arrow/up.png" @tap.stop="showExtend()" />
						<view class="info_ul" >
							<view class="info_list" v-if="!item.isInvoiceYes" @tap.stop="$toPath('/pages/order/invoice/invoice?orderId='+item.id)">
								申请开票
							</view>
							<view class="info_list" v-if="item.isInvoiceYes&&item.orderStatus==3||item.isInvoiceYes&&item.orderStatus==4" @tap.stop="$toPath('/pages/order/invoice/invoiceDetails/invoiceDetails?status=0&orderId='+item.id)">
								查看发票
							</view>
							<view class="info_list" v-if="item.isInvoiceYes&&item.orderStatus==5" @tap.stop="$toPath('/pages/order/invoice/invoiceDetails/invoiceDetails?status=1&orderId='+item.id)">
								查看发票
							</view>
						</view>
					</view>
				</view>
				<view class="left" v-if="!item.isCan"></view>
				<view class="right">
					<view class="btn1" v-if="item.orderStatus == 1 || item.orderStatus == 2" @tap.stop="cancelOrder(item.id)">
						取消订单
					</view>
					<!-- <view class="btn1" v-if="item.orderStatus == 4">
						查看物流
					</view> -->
					<view class="btn1" v-if="item.orderStatus == 5 && !item.isComment" @tap.stop="againOrder(item.orderDetails,5)">
						再次购买
					</view>
					<view class="btn1" v-if="item.orderStatus == 6 || item.orderStatus == 7" @tap.stop="deleteOrder(item.id)">
						删除订单
					</view>
					
					
					<view class="btn2" v-if="item.orderStatus == 1" @tap.stop="toPay(item.id)">
						立即支付
					</view>
					<view class="btn2" v-if="item.orderStatus == 3" @tap.stop="remind(item.id)">
						提醒发货
					</view>
					<view class="btn2" v-if="item.orderStatus == 4" @tap.stop="confirmReceipt(item.id)">
						确认收货
					</view>
					
					<view class="btn2" v-if="item.orderStatus == 5 && !item.isComment" @tap.stop="toOrderEvaluate(item,item.orderDetails.length)">
						评价商品
					</view>
					<view class="btn2" v-if="item.orderStatus == 5 && item.isComment" @tap.stop="againOrder(item.orderDetails,5)">
						再次购买
					</view>
					<view class="btn2" v-if="item.orderStatus == 6 || item.orderStatus == 7" @tap.stop="againOrder(item.orderDetails,7)">
						重新购买
					</view>
				</view>
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
			item:Object,
		},
		methods:{
			toOrderDetails(orderId){
				uni.navigateTo({
					url:'/pages/order/orderDetails/orderDetails?orderId='+orderId
				})
			},
			confirmReceipt(){
				this.$emit("confirmReceipt")
			},
			cancelOrder(){
				this.$emit("cancelOrder")
			},
			deleteOrder(){
				this.$emit("deleteOrder")
			},
			showExtend(){
				this.$emit("showExtend")
			},
			hideExtend(){
				this.$emit("hideExtend")
			},
			againOrder(item,status){
				this.hideExtend()
				let content
				if(status == 5){
					content = '是否再次购买？'
				}else if(status == 7){
					content = '是否重新购买？'
				}
				uni.showModal({
					title: '提示',
					content: content,
					confirmColor: '#F8B500',
					success: (res)=>{
						if (res.confirm) {
							for (let i = 0; i < item.length; i++) {
								item[i].id = item[i].productId
							 }
							uni.setStorage({
								key:'buylist',
								data:item,
								success: () => {
									uni.navigateTo({
										url:'/pages/order/order?type=again'
									})
								}
							})
						}
					}
				});
			},
			remind(id){
				this.hideExtend()
				uni.showModal({
					title: '提示',
					content: '是否提醒发货？',
					confirmColor: '#F8B500',
					success: (res) => {
						if (res.confirm){
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: '已提醒发货'
							})
						}
					}
				})
			},
			toOrderEvaluate(item,length){
				if(length > 1){
					uni.navigateTo({
						url:'/pages/evaluate/orderEvaluate/orderEvaluate?orderId='+item.id
					})
				}else{
					const obj = {
						productName:item.orderDetails[0].productName,
						productId:item.orderDetails[0].productId,
						imgUrl:item.orderDetails[0].imgUrl,
						skuSpce:item.orderDetails[0].skuSpce||[],
						orderId:item.id,
						evaluateListLeng:1
					}
					uni.navigateTo({
						url:'/pages/evaluate/comment/comment?product='+JSON.stringify(obj),
					})
				}
				
			},
			toPay(id){
				uni.navigateTo({
					url:"/pages/order/pay/pay?orderId="+id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order_list{
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:#333333;
		line-height:28upx;
		
		width:100%;
		background:#FFFFFF;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 20upx 32upx;
		margin-bottom: 20upx;
		border-radius:16upx;
		.list_header{
			width: 100%;
			height: 68upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size:24upx;
			line-height:24upx;
			.header_left{
				color: #666666;
			}
			.header_right{
				color:#333333;
			}
		}
		.list_li{
			width: 100%;
			padding: 24upx 0;
			display: flex;
			justify-content: space-between;
			.left{
				height:100%;
				display: flex;
				image{
					width:128upx;
					height:128upx;
					border-radius:8upx;
				}
				.product{
					height:100%;
					display: flex;
					flex-direction: column;
					box-sizing: border-box;
					padding-top: 8upx;
					margin-left: 16upx;
					justify-content: space-between;
					.title{
						width: 392upx;
						line-height:34upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						margin-bottom: 12upx;
					}
					.format{
						width: 392upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						display: flex;
						align-items: center;
						text{
							color:#B3B3B3;
							overflow: hidden;
							line-height:34upx;
						}
					}
				}
			}
			.right{
				height: 128upx;
				display: flex;
				flex-direction: column;
				box-sizing: border-box;
				padding: 8upx 0;
				justify-content: space-between;
				align-items: flex-end;
				color:rgba(102,102,102,1);
				.quantity{
					font-size:24upx;
					line-height:24upx;
				}
			}
		}
		.list_bot{
			width: 100%;
			display: flex;
			align-items: flex-end;
			justify-content: flex-end;
			font-size:24upx;
			margin: 28upx 0 32upx;
			font-family:PingFangSC-Light,PingFang SC;
			font-weight:300;
			color:#666666;
			line-height:24upx;
			.bot2{
				margin-left: 16upx;
			}
			.bot3{
				font-size:28upx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:28upx;;
			}
		}
		.list_btns{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left{
				height: 28upx;
				color: #B3B3B3;
				position: relative;
				
				.extend_info{
					position: absolute;
					left: -20upx;
					top: 8upx;
					z-index: 2;
					width: 192upx;
					display: flex;
					flex-direction: column;
					.arrow{
						width: 104upx;
					}
					.info_ul{
						width: 100%;
						display: flex;
						flex-direction: column;
						box-shadow:0 0 24upx 0 rgba(0,0,0,0.08);
						background-color: #FFFFFF;
						border-radius:16upx;
						.info_list{
							width: 100%;
							height: 92upx;
							display: flex;
							justify-content: center;
							align-items: center;
							font-family:PingFangSC-Medium,PingFang SC;
							font-weight:500;
							color: #333333;
							text-shadow:0 0 24upx rgba(0,0,0,0.08);
							border-bottom: 1upx solid #F5F5F5;
							&:last-of-type{
								border-bottom: none;
							}
						}
					}
				}
			}
			.right{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.btn1,
				.btn2{
					color: #666666;
					padding: 16upx 24upx;
					margin-left: 16upx;
					border:1upx solid #666666;
					border-radius:32upx;
				}
				.btn2{
					color: #F8B500;
					border:1upx solid #F8B500;
				}
			}
		}
	}
</style>
