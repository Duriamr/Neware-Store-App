<template>
	<view>
		<view class="order_content">
			<!-- 收货地址 -->
			<view class="address" @tap="$toPath('/pages/order/address/address?type=select')">
				<view class="no_addres" v-if="!addresShow">
					<view class="left">
						<image src="/static/order/addres.png" />
						<text>请选择收货地址</text>
					</view>
					<view class="right">
						<image src="/static/public/go_grey.png" />
					</view>
				</view>
				
				<view class="addres" v-if="addresShow">
					<view class="left">
						<image src="/static/order/addres.png" />
						<view class="info">
							<view class="top">
								<text>{{address.receiverName}}</text>
								<text>{{address.phone}}</text>
								<view class="default" v-if="address.default == true">
									默认
								</view>
							</view>
							<view class="bot">
								<text>{{address.province}}&#8194;{{address.city}}&#8194;{{address.area}}&#8194;{{address.detailedAddress}}</text>
							</view>
						</view>
					</view>
					
					<view class="right">
						<image src="/static/public/go_grey.png" />
					</view>
				</view>
			</view>
			
			<!-- 购买商品列表 -->
			<view class="goods">
				<view class="goods_list">
					<image :src="buylist.mainImgUrl"/>
					<view class="right">
						<view class="top">
							<text class="title" v-html="buylist.productName"></text>
						</view>
						<view class="bot">
							<view class="price">
								<text class="currency">
									￥
								</text>
								<text class="money">
									{{buylist.price}}
								</text>
							</view>
							<view class="quantity">
								x1
							</view>
						</view>
					</view>
				</view>
				
				<view class="input">
					<text class="left">备&#12288;&#12288;注</text>
					<input v-model="remark" type="text" placeholder="禁止输入非法字符, 例如：表情" />
				</view>
			</view>
			
			<view class="finance">
				<view class="fa_list">
					<view class="left">
						商品金额
					</view>
					<view class="right">
						￥{{goodsPrice|toFixed}}
					</view>
				</view>
			</view>
			
			<view class="invoice" v-if="isOnlinePay" @tap.stop="$toPath('/pages/order/invoice/invoice')">
				<view class="left">
					<text>申请开票</text>
				</view>
				<view class="right">
					<text>{{!invoiceOff?'不开发票':!invoiceObj.invoiceTitleType?'电子发票（个人）':'电子发票（企业）'}}</text>
					<image src="/static/public/go_grey.png" />
				</view>
			</view>
		</view>
		
		<view class="footer_placeholder"></view>
		<view class="order_footer">
			<view class="footer">
				<view class="price">
					<text>应付金额：</text>
					<text class="currency">￥</text>
					<text class="money">{{sumPrice|toFixed}}</text>
				</view>
				<view class="right" v-if="!pay" style="background: rgba(229,229,229,1);" @tap="showTips">
					提交订单
				</view>
				<view class="right" v-if="pay" @tap="toPay">
					提交订单
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
				helpId:'',
				token:'',
				address:'',
				addresShow:false,
				
				buylist:[],		//订单列表
				goodsPrice:0.0,	//商品合计价格
				sumPrice:0.0,	//用户付款价格
				freight:0.00,	//运费
				remark:'',		//备注
				int:0,			//抵扣积分
				deduction:0,	//抵扣价格
				platform:4,
				
				isOnlinePay:false,
				
				once:false,//多次点击控制
				pay:false,
				price:'',
				pid:0,
				cid:0,
				
				invoiceObj:'',
				invoiceOff:false
			};
		},
		onLoad(options) {
			this.buylist = JSON.parse(options.data)
			this.helpId = options.helpId
			this.goodsPrice = this.buylist.price
			this.sumPrice = this.buylist.discountPrice
			this.isOnlinePay = this.buylist.payType == 2 ?true:false
			this.pid = options.pid || 0
			this.cid = options.cid || 0
			
			// this.getBuylist();
			// 
			// #ifdef APP-PLUS
			if(uni.getSystemInfoSync().platform == 'ios'){
				this.platform = 2
			}else if(uni.getSystemInfoSync().platform == 'android'){
				this.platform = 1
			}
			// #endif 
			// #ifdef MP-WEIXIN
				this.platform = 3
			// #endif 
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.invoiceObj = uni.getStorageSync('invoiceObj');
			if(this.$isObject(this.invoiceObj)&&this.invoiceObj!={}){
				this.invoiceOff = true
			}else{
				this.invoiceOff = false
			}
			this.address = uni.getStorageSync('selectAddress');
			this.getDeAddress();
		},
		onUnload(){
			this.clearOrder();
		},
		onBackPress() {
			this.clearOrder();
		},
		filters: {
			toFixed:function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		watch:{
			address:function (val) {
				if(val != ''){
					this.addresShow = true
					this.pay = true;
				}else{
					this.addresShow = false;
					this.pay = false;
				}
			},
			// buylist:{
			// 	handler:function(val){
			// 		if(val.length!=0&&this.address!=''){
			// 			this.pay = true;
			// 		}else{
			// 			this.pay = false;
			// 		}
			// 	},
			// 	deep: true
			// },
		},
		methods: {
			getDeAddress(){
				if(this.address == ''){
					uni.request({
					    url: this.$url+'/api/delivery-address/get-default', 
						header:{
							Authorization:'Bearer '+this.token
						},
						method: "POST",
					    success: (res) => {
							if(res.data.success&& res.data.code == 200 && res.data.data != null){
							this.address = res.data.data;
							this.address.default = true
							}else{
								this.address = '';
							}
					    },
						fail: (err) => {
							this.$requestFail()
						}
					});	
				}
			},
			getBuylist(){
				uni.getStorage({
					key:'buylist',
					success: (ret) => {
						this.buylist[0] = ret.data;
						this.goodsPrice=0;
						//合计
						this.goodsPrice = this.buylist[0].salePrice;
						// this.deduction = this.int/100;
						this.sumPrice = this.goodsPrice-this.deduction+this.freight;
					},
					
				});
			},
			
			clearOrder(){
				uni.removeStorageSync('selectAddress');
				this.address = "";
				uni.removeStorageSync('buylist');
				this.buylist = [];
				uni.removeStorageSync('invoiceObj');
			},
			toPay(){
				if(this.once){
					return false;
				}
				uni.showModal({
					title: '是否确定提交订单？',
					confirmColor: '#F8B500',
					success: (res) => {
						if(res.confirm){
							if(this.address == "" || this.address == null){
								uni.showToast({
									title:'请选择地址',
									icon:'none',
								});
								return false;
							}
							this.once = true
							uni.showLoading({title:'正在提交订单...'})
							uni.request({
								url: this.$url+'/api/campaignnew/helpaddorder', 
								header:{
									Authorization:'Bearer '+this.token
								},
								data: {
									"helpId": this.helpId,
									"platform": this.platform,
									"deliveryAddressId": this.address.id,
									"buyerRemark": this.remark,
									"isOnlinePay":this.isOnlinePay,
									"cid":this.cid,
									"pid":this.pid
								},
								method: "POST",
								
								success: (res) => {
									uni.hideLoading();
									if(res.data.success&&res.data.code == 200){
										let orderId = res.data.data
										if(this.isOnlinePay&&this.invoiceOff){
											this.addInvoice(orderId)
										}
										uni.showToast({title: "订单提交成功"})
										setTimeout(() => {
											if(this.isOnlinePay){
												uni.redirectTo({
													url:"/pages/activity/discount/order/pay/pay?orderId="+orderId,
												})
											}else{
												uni.redirectTo({
													url:"/pages/activity/discount/order/orderOver/orderOver?orderId="+orderId+"&type=1"
												})
											}
											this.clearOrder()
										},1000)
									}else if(res.data.code == 401){
										this.$to401()
									}else{
										this.once = false
										uni.showToast({
											icon: 'none',
											position: 'bottom',
											title: res.data.message
										});
									}
								},
								fail: (err) => {
									uni.hideLoading();
									this.$requestFail()
								}
							});
						}
					}
				})
			},
			addInvoice(orderId){
				this.invoiceObj.orderId = orderId
				this.invoiceObj.invoiceTitle = this.invoiceObj.invoiceTitleType+1
				uni.request({
					url: this.$url+'/api/invoice/add', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data: this.invoiceObj,
					method: "POST",
				});
			},
			showTips(){
				if(this.address == ''||this.address == null||this.address == undefined){
					uni.showToast({icon: 'none',title: '请选择收货地址'});
					return false
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../../order/order.scss"
</style>

