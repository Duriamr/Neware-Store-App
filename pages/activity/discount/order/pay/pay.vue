<template>
	<view class="pay_content">
		
		<view class="pay_header">
			<view class="status"></view>
			<view class='header'>
				<image class="back" src="/static/goods/back_black.png" @tap.stop="back"></image>
				研选收银台
			</view>
		</view>
		<view class="header_placeholder"></view>
		
		<view class="main">
			
			<view class="money">
				<text class="currency">￥</text>
				<text class="price">{{integer}}</text>
				<text class="currency">.{{decimal}}</text>
			</view>
			
			<view class="timer">
				支付剩余时间：{{hh}}:{{mm}}:{{ss}}
			</view>
		</view>
		
		<view class="pay_method">
			<view class="title">支付方式</view>
			<view class="pay_ul">
				<view class="pay_list" v-for="(item,index) in payList" :key='index' @tap.stop='slectPay(item.payType,item.name)'>
					<image class="logo" :src="item.url" />
					<view class="right">
						<view>{{item.name}}</view>
						<image :src="selectNum==item.payType?slecet:noSlecet" />
					</view>
				</view>
			</view>
		</view>
		
		<view class="footer_placeholder"></view>
		<view class="pay_footer">
			<view class="footer">
				<view class="submit" v-if="submitShow" @tap.stop=goPay>
					<text>{{selectName}}支付</text>
					<text style="font-weight: 500;margin-left: 12upx;">￥{{price.toFixed(2)}}</text>
				</view>
				<view class="submit" v-if="!submitShow" style="background:#E5E5E5">
					<text>支付</text>
					<text style="font-weight: 500;margin-left: 12upx;">￥{{price.toFixed(2)}}</text>
				</view>
			</view>
			<view class="safety"></view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				token:uni.getStorageSync('token'),
				orderId:'',
				
				price:NaN,
				integer:'', // 整数
				decimal:'', //小数
				
				orderTime:'',
				hh:'00', //时
				mm:'00',   // 分
				ss:'00',  // 秒
				timeOff:false,
				
				submitShow:false,
				
				selectNum:null,
				selectName:'',
				noSlecet:'/static/order/noPay.png',  // 未选中
				slecet:'/static/order/pay.png',  //选中
				payList:[
					{
						url:'/static/order/alipay.png',
						name:'支付宝',
						payType:1,
						provider:'alipay'
					},
					{
						url:'/static/order/wx.png',
						name:'微信',
						payType:2,
						provider:'wxpay'
					}
				]
				
			}
		},
		onLoad(options) {
			this.orderId = options.orderId
			this.getPayInfo()
		},
		onShow() {
			
		},
		watch:{
			selectNum:function(val){
				if(val!=''&&val!=NaN&&val!=null&&val!=undefined&&this.timeOff){
					this.submitShow = true
				}else{
					this.submitShow = false
				}
			},
			timeOff:function(val){
				if(val&&this.selectNum!=''&&this.selectNum!=NaN&&this.selectNum!=null&&this.selectNum!=undefined){
					this.submitShow = true
				}else{
					this.submitShow = false
				}
			}
		},
		methods:{
			slectPay(payType,name){
				this.selectNum = payType
				this.selectName = name
			},
			
			back(){
				uni.showModal({
				    title: '确认要离开订单支付？',
				    content: '超过支付时效时订单将被取消，请尽快完成支付。',
					cancelText:'继续支付',
					confirmText:'确认离开',
					confirmColor:'#F8B500',
				    success: (res) => {
				        if (res.confirm) {
				            uni.navigateBack()
				        }
				    }
				})
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
							this.price = res.data.data.amount
							this.integer = this.price.toFixed(2).toString().split('.')[0]
							this.decimal = this.price.toFixed(2).toString().split('.')[1]
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
			
			goPay(){
				uni.request({
				    url: this.$url+'/api/v2/order/vocher',
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"orderId": this.orderId,
						"payType": this.selectNum
					},
					method: "POST",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.requestPayment({
								    provider: this.payList[this.selectNum - 1].provider,
								    orderInfo: res.data.data,
								    success: (res) => {
										uni.showToast({title: '支付成功'});
										this.paySuccess()
										setTimeout(() => {
											uni.redirectTo({
												url:"/pages/activity/discount/order/orderOver/orderOver?orderId="+this.orderId+"&type=3"
											})
										},1000)
								    },
								    fail: (err) => {
										uni.showToast({title: '支付失败',icon:'none'});
										setTimeout(() => {
											uni.redirectTo({
												url:"/pages/activity/discount/order/orderOver/orderOver?orderId="+this.orderId+"&type=2"
											})
										},1000)
								    }
								});
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
			paySuccess(){
				uni.request({
				    url: this.$url+'/api/v2/order/paymentsuccess',
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"orderId": this.orderId,
						"payType": this.selectNum
					},
					method: "POST",
				});
			},
		},
	}
</script>

<style lang="scss">
	@import '../../../../order/pay/pay.scss'
</style>
