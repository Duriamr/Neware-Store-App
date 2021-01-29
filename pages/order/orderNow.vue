<template>
	<view>
		<view class="order_content">
			<!-- 收货地址 -->
			<view class="address" @tap="selectAddress">
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
				<view class="goods_list" v-for="(item,index) in buylist" :key="index">
					<image :src="item.skuImg" />
					<view class="right">
						<view class="top">
							<text class="title" v-html="item.productName"></text>
							<text class="format" v-if="item.skuSpce.length != 0">
								<block>
								<text v-for="(item2, index2) in item.skuSpce" :key="'sku'+index2" v-if="index2 != item.skuSpce.length-1">{{item2.name}}/</text>
								<text v-for="(item2, index2) in item.skuSpce" :key="'sku'+index2" v-if="index2 == item.skuSpce.length-1">{{item2.name}}</text>
								</block>
							</text>
						</view>
						<view class="bot">
							<view class="price">
								<text class="currency">
									￥
								</text>
								<text class="money">
									{{item.salePrice}}
								</text>
							</view>
							<view class="quantity">
								x{{item.quantity}}
							</view>
						</view>
					</view>
				</view>
				
				<view class="input">
					<text class="left">客户代码</text>
					<image src="/static/order/question.png" @tap.stop="question(3)" />
					<view class="mask" v-if="isExplain == 3">
						<view class="triangle"></view>
						<view class="main">
							请咨询您的销售经理，没有销售经理请咨询研选客服
						</view>
					</view>
					<input v-model="customerNo" type="text" placeholder="请输入客户代码" maxlength="7" />
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
			
			<view class="pay_ul">
				<view class="pay_list" @tap.stop="tabPayType(1)" v-if="Number(sumPrice) < Number(paymaxamount)">
					<view class="left">
						<text>线上支付</text>
						<image src="/static/order/question.png" @tap.stop="question(1)"/>
						<view class="mask" v-if="isExplain == 1">
							<view class="triangle"></view>
							<view class="main">
								支持支付宝或微信在线为此订单付款交易
							</view>
						</view>
					</view>
					<view class="right">
						<image src="/static/order/noPay.png" v-if="payType != 1" />
						<image src="/static/order/pay.png" v-if="payType == 1" />
					</view>
				</view>
				
				<view class="pay_list" @tap.stop="tabPayType(2)">
					<view class="left">
						<text>线下结算</text>
						<image src="/static/order/question.png" @tap.stop="question(2)"/>
						<view class="mask" v-if="isExplain == 2">
							<view class="triangle"></view>
							<view class="main ">
								仅支持下单完成后，销售经理与您进行线下流程交易
							</view>
						</view>
					</view>
					<view class="right">
						<image src="/static/order/noPay.png" v-if="payType != 2" />
						<image src="/static/order/pay.png" v-if="payType == 2" />
					</view>
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
				isExplain:'',
				paymaxamount:'',
				token:uni.getStorageSync('token'),
				address:'',
				addresShow:false,
				
				buylist:[],		//订单列表
				goodsPrice:0.0,	//商品合计价格
				sumPrice:0.0,	//用户付款价格
				freight:0.00,	//运费
				remark:'',		//备注
				customerNo:'',  //客户代码
				int:0,			//抵扣积分
				deduction:0,	//抵扣价格
				platform:4,
				
				once:false,//多次点击控制
				pay:false,
				
				payType:0
			};
		},
		onLoad() {
			this.getPaymaxamount()
			this.getBuylist();
			
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
			this.address = uni.getStorageSync('selectAddress');
			this.getDeAddress();
			this.getCustomerNo();
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
					if(this.buylist.length!=0&&this.payType!=0){
						this.pay = true;
					}else{
						this.pay = false;
					}
				}else{
					this.addresShow = false;
					this.pay = false;
				}
			},
			buylist:{
				handler:function(val){
					if(val.length!=0&&this.address!=''&&this.payType!=0){
						this.pay = true;
					}else{
						this.pay = false;
					}
				},
				deep: true
			},
			payType:function(val){
				if(val!=0&&this.address!=''&&this.buylist.length!=0){
					this.pay = true;
				}else{
					this.pay = false;
				}
			}
		},watch:{
			address:function (val) {
				if(val != ''){
					this.addresShow = true
					if(this.buylist.length!=0&&this.payType!=0&&this.customerNo!=''){
						this.pay = true;
					}else{
						this.pay = false;
					}
				}else{
					this.addresShow = false;
					this.pay = false;
				}
			},
			buylist:{
				handler:function(val){
					if(val.length!=0&&this.address!=''&&this.payType!=0&&this.customerNo!=''){
						this.pay = true;
					}else{
						this.pay = false;
					}
				},
				deep: true
			},
			payType:function(val){
				if(val!=0&&this.address!=''&&this.buylist.length!=0&&this.customerNo!=''){
					this.pay = true;
				}else{
					this.pay = false;
				}
			},
			customerNo:function(val){
				if(val!=''&&this.address!=''&&this.buylist.length!=0&&this.payType!=0){
					this.pay = true;
				}else{
					this.pay = false;
				}
			}
		},
		methods: {
			//  是否显示说明
			question(num){
				if(this.isExplain != num){
					this.isExplain = num
					setTimeout(()=>{
						this.isExplain  = NaN
					},1500)
				}else{
					this.isExplain  = NaN
				}
			},
			// 获取支付最大金额
			getPaymaxamount(){
				uni.request({
				    url: this.$url+'/api/basics/paymaxamount', 
					header:{
						Authorization:'Bearer '+this.token
					},
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							 this.paymaxamount = res.data.data
						}
					}
				})
			},
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
						this.goodsPrice = this.goodsPrice + (this.buylist[0].quantity*this.buylist[0].salePrice);
						// this.deduction = this.int/100;
						this.sumPrice = this.goodsPrice-this.deduction+this.freight;
					}
				});
			},
			
			clearOrder(){
				uni.removeStorageSync('selectAddress');
				this.address = "";
				uni.removeStorageSync('buylist');
				this.buylist = [];
			},
			toPay(){
				if(this.once){
					return false;
				}
				let isOnlinePay
				uni.showModal({
					title: '是否确定提交订单？',
					confirmColor: '#F8B500',
					success: (res) => {
						if(res.confirm){
							this.customerNo = this.customerNo.replace(/\s+/g,"")  // 去空格
							if(this.customerNo.length <= 6){
								if(!RegExp(/^[Cc]{1}[0-9]{5}$/).test(this.customerNo)){
									uni.showToast({
										title:'请输入正确的客户代码 如：C88888',
										icon:'none',
									});
									return false;
								}
							}else{
								if(!RegExp(/^[Cc]{1}[0-9]{5}[Ss]{1}$/).test(this.customerNo)){
									uni.showToast({
										title:'请输入正确的售后代码 如：C88888S',
										icon:'none',
									});
									return false;
								}
							}
							if(this.payType == 1){
								isOnlinePay = true
							}else if(this.payType == 2){
								isOnlinePay = false
							}else{
								uni.showToast({
									title:'请填选择支付方式',
									icon:'none',
									});
								return false;
							}
							this.once = true
							uni.showLoading({title:'正在提交订单...'})
							uni.request({
								url: this.$url+'/api/v2/order/buynow', 
								header:{
									Authorization:'Bearer '+this.token
								},
								data: {
									"quantity": this.buylist[0].quantity,
									"productId": this.buylist[0].id,
									"sku":this.buylist[0].sku,
									"customerNo": this.customerNo,
									"productName": this.buylist[0].productName,
									"platform": this.platform,
									"amount": this.goodsPrice.toFixed(2),
									"finalAmount": this.sumPrice.toFixed(2),
									"price": this.buylist[0].salePrice,
									"payMent": 0,
									"deliveryAddressId": this.address.id,
									"buyerRemark": this.remark,
									"isOnlinePay":isOnlinePay
								},
								method: "POST",
								
								success: (res) => {
									uni.hideLoading();
									if(res.data.success&&res.data.code == 200){
										let orderId = res.data.data
										uni.showToast({title: "订单提交成功"})
										setTimeout(() => {
											if(isOnlinePay){
												uni.redirectTo({
													url:"/pages/order/pay/pay?orderId="+orderId
												})
											}else{
												uni.redirectTo({
													url:"/pages/order/orderOver/orderOver?orderId="+orderId+"&type=1"
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
			
			tabPayType(index){
				this.payType = index
			},
			
			selectAddress(){
				uni.navigateTo({
					url:'/pages/order/address/address?type=select'
				})
			},
			getCustomerNo(){
				uni.request({
				    url: this.$url+'/api/v2/order/getcustomerno', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							 this.customerNo = res.data.data
						}
					}
				})
			},
			showTips(){
				if(this.address == ''||this.address == null||this.address == undefined){
					uni.showToast({icon: 'none',title: '请选择收货地址'});
					return false
				}
				if(this.customerNo == ''||this.customerNo == null||this.customerNo == undefined){
					uni.showToast({icon: 'none',title: '请填写客户代码'});
					return false
				}
				if(this.payType == ''||this.payType == null||this.payType == undefined){
					uni.showToast({icon: 'none',title: '请选择支付方式'});
					return false
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "./order.scss"
</style>

