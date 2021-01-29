<template>
	<view class="oD_content">
		<view class="header">
			<view class="type">
				<view class="left">
					<view class="top" v-if="orderStatus == 1">
						待付款
					</view>
					<view class="top" v-if="orderStatus == 2">
						已提交
					</view>
					<view class="top" v-if="orderStatus == 3">
						待发货
					</view>
					<view class="top" v-if="orderStatus == 4">
						待收货
					</view>
					<view class="top" v-if="orderStatus == 5">
						交易完成
					</view>
					<view class="top" v-if="orderStatus == 6">
						交易关闭
					</view>
					<view class="top" v-if="orderStatus == 7">
						已取消
					</view>
					
					<view class="bot" v-if="orderStatus == 1">
						支付剩余时间：{{hh}}:{{mm}}:{{ss}}
					</view>
				</view>
				
				<image src="/static/order/orderDetails/1.png" mode="widthFix" v-if="orderStatus == 1" />
				<image src="/static/order/orderDetails/2.png" mode="widthFix" v-if="orderStatus == 2" />
				<image src="/static/order/orderDetails/3.png" mode="widthFix" v-if="orderStatus == 3" />
				<image src="/static/order/orderDetails/4.png" mode="widthFix" v-if="orderStatus == 4" />
				<image src="/static/order/orderDetails/5_1.png" mode="widthFix" v-if="orderStatus == 5 && !isComment" />
				<image src="/static/order/orderDetails/5_2.png" mode="widthFix" v-if="orderStatus == 5 && isComment" />
				<image src="/static/order/orderDetails/6.png" mode="widthFix" v-if="orderStatus == 6 || orderStatus == 7" />
			</view>
			<view class="float_placeholder"></view>
		</view>
		
		<view class="logistics" v-if="!logisticsTap && orderStatus == 4 || !logisticsTap && orderStatus == 5">
			<view class="left">
				<image src="/static/order/car.png" mode="widthFix"/>
				<view class="mid">
					<view class="top">
						{{logisticsInfo}}
					</view>
					<text class="bot" v-if="logisticsTime != ''">
						{{logisticsTime}}
					</text>
				</view>
			</view>
		</view>
		
		<view class="logistics" v-if="logisticsTap && orderStatus == 4 || logisticsTap && orderStatus == 5" @tap="toLogistics">
			<view class="left">
				<image src="/static/order/car.png" mode="widthFix"/>
				<view class="mid">
					<view class="top">
						{{logisticsInfo}}
					</view>
					<text class="bot" v-if="logisticsTime != ''">
						{{logisticsTime}}
					</text>
				</view>
			</view>
			<image class="rarrow" src="/static/public/go_grey.png" />
		</view>
		
		<view class="address">
			<image src="/static/order/addres.png" mode="widthFix" />
			<view class="right">
				<view class="top">
					<view class="name">
						{{infoData.receiverName}}
					</view>
					<view class="phone">
						{{infoData.phone}}
					</view>
				</view>
				<view class="site">
					{{infoData.address}}
				</view>
			</view>
		</view>
		
		<view class="goods">
			<view class="goods_list" v-for="(item,index) in goodList" :key="index" @tap.stop="$toGoods(item.productId)">
				<view class="left">
					<image :src="item.imgUrl" />
					<view class="mid">
						<view class="name">
							{{item.productName}}
						</view>
						<text class="format" v-if="item.skuSpce.length != 0">
							<block>
							<text v-for="(item2, index2) in item.skuSpce" :key="'sku'+index2" v-if="index2 != item.skuSpce.length-1">{{item2.value}}/</text>
							<text v-for="(item2, index2) in item.skuSpce" :key="'sku'+index2" v-if="index2 == item.skuSpce.length-1">{{item2.value}}</text>
							</block>
						</text>
					</view>
				</view>
				<view class="right">
					<view class="price">
						￥{{item.price}}
					</view>
					<view class="amount">
						x{{item.quantity}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="financial_ul">
			<view class="financial_list">
				<view class="left">
					商品金额
				</view>
				<view class="right">
					<text class="currency">￥</text>
					<text class="money">{{infoData.amount}}</text>
				</view>
			</view>
			<view class="financial_list">
				<view class="left">
					
				</view>
				<view class="right">
					<!-- 线下 -->
					<text class="text" v-if='!infoData.paymentType'>应付金额：</text>
					<!-- 线上 待付款 已取消 已关闭-->
					<text class="text" v-else-if='infoData.paymentType && (orderStatus == 1 || orderStatus ==6 || orderStatus == 7)'>订单金额：</text>
					<!-- 线上 排除以上 -->
					<text class="text" v-else>实付金额：</text>
					<text class="money">￥{{infoData.amount}}</text>
				</view>            
			</view>
		</view>
		
		<view class="infor">
			<view class="infor_ul">
				<view class="list">
					<view class="left">
						订单编号：
					</view>
					<!-- <view class="right">
						{{infoData.orderNo}}
					</view> -->
					<input v-model="infoData.orderNo" disabled="" />
					<!-- #ifndef H5 -->   
					<view class="copy" @tap="setCopy">
						复制
					</view>
					<!-- #endif -->    
				</view>
				<view class="list">
					<view class="left">
						提交时间：
					</view>
					<view class="right">
						{{infoData.createTime}}
					</view>
				</view>
				<view class="list">
					<view class="left">
						客户代码：
					</view>
					<view class="right">
						{{infoData.customerNo}}
					</view>
				</view>
				<view class="list" v-if='infoData.orderNsapNo'>
					<view class="left">
						合同编号：
					</view>
					<view class="right">
						{{infoData.orderNsapNo}}
					</view>
				</view>
				
				<view class="list">
					<view class="left">
						支付方式：
					</view>
					<!-- infoData.paymentType true  线上 false 线下 -->
					<view class="right" v-if="!infoData.paymentType">
						线下结算
					</view>
					<view class="right" v-else>
						<!-- 待付款 已关闭 -->
						<text v-if='orderStatus == 1 || orderStatus == 7 || orderStatus == 6'>线上支付</text>
						<text v-else>线上支付 - {{infoData.payMentPlatform == 1 ?'支付宝':'微信'}}支付</text>
					</view>
				</view>
				<view class="list">
					<view class="left">
						订单金额：
					</view>
					<view class="right">
						￥{{infoData.finalAmount}}
					</view>
				</view>
				<view class="list" v-if='infoData.paymentType && orderStatus != 1 && orderStatus != 7 && orderStatus != 6'>
					<view class="left">
						付款时间：
					</view>
					<view class="right">
						{{infoData.payDate}}
					</view>
				</view>
				<view class="list">
					<view class="left">
						买家备注：
					</view>
					<view class="right">
						{{infoData.buyerRemark}}
					</view>
				</view>
			</view>
			<view class="service">
				<image @tap.stop="toService" src="/static/order/orderDetails/service.png" mode="widthFix" />
				<text @tap.stop="toService">联系客服</text>
			</view>
		</view>
		
		<view class="footer_placeholder"></view>
		<view class="oD_footer">
			<view class="footer" @touchmove.stop.prevent>
				<view class="left" v-if="!infoData.isCan">
					<view class="l_left" v-if="orderStatus == 1">
						订单金额：
					</view>
					<view class="l_right" v-if="orderStatus == 1">
						<text class="currency">￥</text>
						<text class="money">{{infoData.finalAmount}}</text>
					</view>
				</view>
				<view class="left" v-if="infoData.isCan">
					<text v-if="orderStatus == 3||orderStatus == 4||orderStatus == 5" @tap.stop="showExtend()">更多</text>
					<view class="extend_info" v-if="extend">
						<view class="info_ul" >
							<view class="info_list" v-if="!infoData.isInvoiceYes" @tap.stop="toInvoice(infoData.id)">
								申请开票
							</view>
							<view class="info_list" v-if="infoData.isInvoiceYes&&orderStatus==3||infoData.isInvoiceYes&&orderStatus==4" @tap.stop="toInvoiceDetails(infoData.id,0)">
								查看发票
							</view>
							<view class="info_list" v-if="infoData.isInvoiceYes&&orderStatus==5" @tap.stop="toInvoiceDetails(infoData.id,1)">
								查看发票
							</view>
						</view>
						<image class="arrow" mode="widthFix" src="/static/public/arrow/down.png" @tap.stop="showExtend()" />
					</view>
				</view>
				<view class="btns">
					<view class="btn btn1" v-if="orderStatus == 1 || orderStatus == 2" @tap.stop="cancelOrder(orderId)">
						取消订单
					</view>
					<view class="btn btn1" v-if="orderStatus == 3 || orderStatus == 4 || orderStatus == 5" @tap.stop="showAfterSale">
						申请售后
					</view>
					<view class="btn btn1" v-if="logisticsTap && orderStatus == 4 || logisticsTap && orderStatus == 5" @tap.stop="toLogistics">
						查看物流
					</view>
					<view class="btn btn1" v-if="orderStatus == 5 && !isComment" @tap.stop="toAgain(goodList,5)">
						再次购买
					</view>
					<view class="btn btn1" v-if="orderStatus == 6 || orderStatus == 7" @tap.stop="deleteList(orderId)">
						删除订单
					</view>
					
					
					<view class="btn btn2" v-if="orderStatus == 1" @tap.stop="toPay(orderId)">
						立即支付
					</view>
					<view class="btn btn2" v-if="orderStatus == 3" @tap.stop="remind(orderId)">
						提醒发货
					</view>
					<view class="btn btn2" v-if="orderStatus == 4" @tap.stop="confirmReceipt(orderId)">
						确认收货
					</view>
					<view class="btn btn2" v-if="orderStatus == 5 && !isComment" @tap.stop="toOrderEvaluate()">
						评价商品
					</view>
					<view class="btn btn2" v-if="orderStatus == 5 && isComment" @tap.stop="toAgain(goodList,5)">
						再次购买
					</view>
					<view class="btn btn2" v-if="orderStatus == 6 || orderStatus == 7" @tap.stop="toAgain(goodList,7)">
						重新购买
					</view>
				</view>
			</view>
			<view class="safety"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:"",
				orderId:0,
				infoData:{},
				goodList:[],
				orderStatus:100,
				logisticsInfo:'暂无物流数据，请耐心等待',
				logisticsTime:'',
				logisticsTap:false,
				
				orderTime:'',
				hh:'00',
				mm:'00',   // 分
				ss:'00',  // 秒
				
				extend:false,
				isComment:false
			};
		},
		onLoad(option) {
			this.orderId = option.orderId
			this.token = uni.getStorageSync('token');
			this.getLoadData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getLoadData();
		},
		methods:{
			toOrderEvaluate(){
				this.hideExtend()
				uni.navigateTo({
					url:'/pages/evaluate/orderEvaluate/orderEvaluate?orderId='+this.orderId
				})
			},
			
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/order/get-info?orderId='+this.orderId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							this.infoData = res.data.data;
							this.goodList = res.data.data.orderDetails;
							this.orderStatus = res.data.data.orderStatus;
							if(this.orderStatus == 1){
								this.getPayInfo()
							}
							this.logisticsTime = res.data.data.createTime
							this.isComment = res.data.data.isComment
							if(this.orderStatus == 4 || this.orderStatus == 5){
								uni.request({
								    url: this.$url+'/api/logistics/info?orderNo='+this.infoData.orderNo, 
									header:{
										Authorization:'Bearer '+this.token
									},
									method: "GET",
								    
								    success: (res) => {
										if(res.data.success&&res.data.code == 200){
											this.logisticsInfo = res.data.data.logisticDetails[0].context
											this.logisticsTime = res.data.data.logisticDetails[0].time
											this.logisticsTap = true
										}
								    }
								});
							}
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
							uni.navigateBack();
						}
				    },
					fail: (err) => {
						uni.stopPullDownRefresh()
						this.$requestFail()
					}
				});
			},
			getPayInfo(){
				uni.request({
				    url: this.$url+'/api/v2/order/payinfo?id='+this.orderId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.orderTime = res.data.data.createTime
							this.getCountDown()
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position:'center',
								title: res.data.message
							})
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			getCountDown() {
				const endTime = Number(this.orderTime)
				let nowTime
				let timeoutID = setInterval(()=>{
					nowTime = new Date().getTime()
					if(nowTime >= endTime){
						this.mm = '00'
						this.ss = '00'
						this.hh = '00'
						this.timeOff = false
						clearInterval(timeoutID)
					}else{
						let timeDiff =  parseInt((endTime - nowTime) / 1000)
						let hh = parseInt(timeDiff / (60 * 60));
						let mm = parseInt(timeDiff / 60 % 60)
						let ss = parseInt(timeDiff % 60)
						this.mm = mm>=10?mm:`0${mm}`
						this.ss = ss>=10?ss:`0${ss}`
						this.hh = hh>=10?hh:`0${hh}`
						this.timeOff = true
					}
				},1000)
			},
			toPay(orderId){
				this.hideExtend()
				uni.navigateTo({
					url:"/pages/order/pay/pay?orderId="+orderId
				})
			},
			confirmReceipt(orderId){
				this.hideExtend()
				uni.showModal({
					title: '提示',
					content: '是否确认收货？',
					confirmColor: '#F8B500',
					success: (res)=>{
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							});
							uni.request({
								url: this.$url+'/api/order/confirm-receiving?orderId='+orderId, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
								
								success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										uni.showToast({
											icon: 'success',
											position: 'bottom',
											title: '成功确认收货'
										});
										this.getLoadData()
										return;
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
									uni.hideLoading()
									this.$requestFail()
								}
							});
						}
					}
				});
			},
			cancelOrder(orderId){
				this.hideExtend()
				uni.showModal({
					title: '提示',
					content: '是否取消订单？',
					confirmColor: '#F8B500',
					success: (res)=>{
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							});
							uni.request({
							    url: this.$url+'/api/order/cancel?orderId='+orderId+'&cancelOrderReason=0', 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										uni.showToast({
										    icon: 'success',
											position: 'bottom',
										    title: '成功取消订单'
										});
										this.getLoadData()
										return;
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
									uni.hideLoading()
									this.$requestFail()
								}
							});
						}
					}
				});
			},
			toAgain(item,status){
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
			deleteList(id){
				this.hideExtend()
				uni.showModal({
					title: '提示',
					content: '是否确认删除？',
					confirmColor: '#F8B500',
					success: (res) => {
						if (res.confirm){
							uni.request({
							    url: this.$url+'/api/order/delete?orderId='+id, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									if(res.data.success&&res.data.code == 200){
										uni.showToast({
											icon: 'none',
											position: 'bottom',
											title: '删除成功'
										})
										uni.navigateBack()
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
								}
							});
						}
					}
				})
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
						} else if (res.cancel) {
								
						}
					}
				})
			},
			toLogistics(){
				this.hideExtend()
				uni.navigateTo({
					url:'/pages/order/orderDetails/logistics/logistics?orderNo='+this.infoData.orderNo+'&imgUrl='+this.goodList[0].imgUrl+'&length='+this.goodList.length
				})
			},
			toService(){
				this.hideExtend()
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading();
						if(res.data.success&&res.data.code == 200){
							
							uni.navigateTo({
								url:"/pages/browser/serviceBrowser?page=order&nickName="+res.data.data.nickname+"&clientId="+res.data.data.userUniqueId+"&orderNo="+this.infoData.orderNo
							})
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
						uni.hideNavigationBarLoading();
						this.$requestFail()
					}
				});
			},
			showAfterSale(){
				this.hideExtend()
				uni.showModal({
					title:"申请售后",
					content:"如需售后服务，请联系您的专属销售经理",
					showCancel:false,
					confirmText	:"我知道了"
				})
			},
			showExtend(){
				this.extend = !this.extend
			},
			hideExtend(){
				this.extend = false
			},
			toInvoice(orderId){
				this.hideExtend()
				uni.navigateTo({
				    url: '/pages/order/invoice/invoice?orderId='+orderId
				});
			},
			toInvoiceDetails(orderId,status){
				this.hideExtend()
				uni.navigateTo({
				    url: '/pages/order/invoice/invoiceDetails/invoiceDetails?status='+status+'&orderId='+orderId
				});
			},
			// #ifndef H5 
			setCopy(){
				this.hideExtend()
				uni.setClipboardData({
					data:this.infoData.orderNo
				})
			},
			// #endif 
		}
	}
</script>

<style lang="scss">
	@import "./orderDetails.scss"
</style>
