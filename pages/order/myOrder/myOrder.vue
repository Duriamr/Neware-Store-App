<template>
	<view class="myOrder_content">
		<view class="nav">
			<view class="nav_list" v-for="(item,index) in tabList" :key="index" :data-index="index" :class="{active:index==idx}" @tap="tabChange(index)">
				{{item}}
			</view>
		</view>
		
		<swiper :current="idx" class="swiper" duration="600" @change="swiperChange">
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData()">
					<view class="myOrder_ul">
						<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="allList.length <= 0" />
						
						<orderItem v-for="(item,index) in allList" :key="index" 
						:item="item" 
						@confirmReceipt="confirmReceipt(item.id)" 
						@cancelOrder="cancelOrder(item.id)" 
						@deleteOrder="deleteOrder(item.id)"
						@showExtend="showExtend(index)" 
						@hideExtend="hideExtend()" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData(2)">
					<view class="myOrder_ul">
						<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有已提交订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="reviewList.length <= 0" />
						
						<orderItem v-for="(item,index) in reviewList" :key="index"
						:item="item" 
						@confirmReceipt="confirmReceipt(item.id)" 
						@cancelOrder="cancelOrder(item.id)" 
						@deleteOrder="deleteOrder(item.id)"
						@showExtend="showExtend(index)" 
						@hideExtend="hideExtend()" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData(1)">
					<view class="myOrder_ul">
						<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有待付款订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="paymentList.length <= 0" />
						
						<orderItem v-for="(item,index) in paymentList" :key="index"
						:item="item" 
						@confirmReceipt="confirmReceipt(item.id)" 
						@cancelOrder="cancelOrder(item.id)" 
						@deleteOrder="deleteOrder(item.id)"
						@showExtend="showExtend(index)" 
						@hideExtend="hideExtend()" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData(3)">
					<view class="myOrder_ul">
						<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有待收货订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="shipList.length <= 0" />
						
						<orderItem v-for="(item,index) in shipList" :key="index"
						:item="item" 
						@confirmReceipt="confirmReceipt(item.id)" 
						@cancelOrder="cancelOrder(item.id)" 
						@deleteOrder="deleteOrder(item.id)"
						@showExtend="showExtend(index)" 
						@hideExtend="hideExtend()" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData(5)">
					<view class="myOrder_ul">
						<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有已完成订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="accomplishList.length <= 0" />
						<orderItem v-for="(item,index) in accomplishList" :key="index"
						:item="item" 
						@confirmReceipt="confirmReceipt(item.id)" 
						@cancelOrder="cancelOrder(item.id)" 
						@deleteOrder="deleteOrder(item.id)"
						@showExtend="showExtend(index)" 
						@hideExtend="hideExtend()" />
					</view>
				</scroll-view>
			</swiper-item>
			
		</swiper>
	</view>
</template>

<script>
	import orderItem from '@/components/nw-order-item/nw-order-item';
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {orderItem,empty},
		data() {
			return {
				token:'',
				
				idx:0,
				allList:[],
				paymentList:[],//1
				reviewList:[],//2
				shipList:[],//3
				accomplishList:[],//5
				tabList:["全部", "已提交", "待付款", "待收货", "已完成"],
				
				pageIndexAll:1,
				pageIndex1:1,
				pageIndex2:1,
				pageIndex3:1,
				pageIndex5:1
			};
		},
		onLoad(option) {
			this.idx = option.idx;
			if(this.idx==''||this.idx==NaN||this.idx==null||this.idx==undefined){
				this.idx = 0
			}
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getShowData();
		},
		methods:{
			tabChange(index) {
				this.idx = index;
			},
			swiperChange(e) {
			    this.idx = e.target.current;
			},
			showExtend(index){
				if(this.idx == 0){
					this.allList[index].extend = !this.allList[index].extend
					for(let i=0; i<this.allList.length; i++){
						if(i != index){
							this.allList[i].extend = false
						}
					}
				}
				if(this.idx == 1){
					this.reviewList[index].extend = !this.reviewList[index].extend
					for(let i=0; i<this.reviewList.length; i++){
						if(i != index){
							this.reviewList[i].extend = false
						}
					}
				}
				if(this.idx == 2){
					this.paymentList[index].extend = !this.paymentList[index].extend
					for(let i=0; i<this.paymentList.length; i++){
						if(i != index){
							this.paymentList[i].extend = false
						}
					}
				}
				if(this.idx == 3){
					this.shipList[index].extend = !this.shipList[index].extend
					for(let i=0; i<this.shipList.length; i++){
						if(i != index){
							this.shipList[i].extend = false
						}
					}
				}
				if(this.idx == 5){
					this.accomplishList[index].extend = !this.accomplishList[index].extend
					for(let i=0; i<this.accomplishList.length; i++){
						if(i != index){
							this.accomplishList[i].extend = false
						}
					}
				}
			},
			hideExtend(){
				for(let i=0; i<this.allList.length; i++){
					this.allList[i].extend = false
				}
				for(let i=0; i<this.paymentList.length; i++){
					this.paymentList[i].extend = false
				}
				for(let i=0; i<this.reviewList.length; i++){
					this.reviewList[i].extend = false
				}
				for(let i=0; i<this.shipList.length; i++){
					this.shipList[i].extend = false
				}
				for(let i=0; i<this.accomplishList.length; i++){
					this.accomplishList[i].extend = false
				}
			},
			getShowData(){
				uni.request({
				    url: this.$url+'/api/order/query', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"orderStatusEnum": null,
						"pageIndex": 1,
						"pageSize": 10,
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							let list = [];
							list = res.data.data.items;
							for(let i = 0; i < list.length; i++){
								list[i].extend = false
								let total = 0;
								for(let j = 0; j < list[i].orderDetails.length; j++){
									total += list[i].orderDetails[j].quantity;
								}
								list[i].total = total
							}
							this.allList = list
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
				uni.request({
				    url: this.$url+'/api/order/query',
				    header:{
				    	Authorization:'Bearer '+this.token
				    },
				    data:{
				    	"orderStatusEnum": 1,
				    	"pageIndex": 1,
				    	"pageSize": 10,
				    },
				    method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							let list = [];
							list = res.data.data.items;
							for(let i = 0; i < list.length; i++){
								list[i].extend = false
								let total = 0;
								for(let j = 0; j < list[i].orderDetails.length; j++){
									total += list[i].orderDetails[j].quantity;
								}
								list[i].total = total
							}
							this.paymentList = list
						}
				    },
				});
				uni.request({
				    url: this.$url+'/api/order/query',
				    header:{
				    	Authorization:'Bearer '+this.token
				    },
				    data:{
				    	"orderStatusEnum": 2,
				    	"pageIndex": 1,
				    	"pageSize": 10,
				    },
				    method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							let list = [];
							list = res.data.data.items;
							for(let i = 0; i < list.length; i++){
								list[i].extend = false
								let total = 0;
								for(let j = 0; j < list[i].orderDetails.length; j++){
									total += list[i].orderDetails[j].quantity;
								}
								list[i].total = total
							}
							this.reviewList = list
						}
				    },
				});
				uni.request({
				    url: this.$url+'/api/order/query',
				    header:{
				    	Authorization:'Bearer '+this.token
				    },
				    data:{
				    	"orderStatusEnum": 3,
				    	"pageIndex": 1,
				    	"pageSize": 10,
				    },
				    method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							let list = [];
							list = res.data.data.items;
							for(let i = 0; i < list.length; i++){
								list[i].extend = false
								let total = 0;
								for(let j = 0; j < list[i].orderDetails.length; j++){
									total += list[i].orderDetails[j].quantity;
								}
								list[i].total = total
							}
							this.shipList = list
						}
				    },
				});
				uni.request({
				    url: this.$url+'/api/order/query',
				    header:{
				    	Authorization:'Bearer '+this.token
				    },
				    data:{
				    	"orderStatusEnum": 5,
				    	"pageIndex": 1,
				    	"pageSize": 10,
				    },
				    method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							let list = [];
							list = res.data.data.items;
							for(let i = 0; i < list.length; i++){
								list[i].extend = false
								let total = 0;
								for(let j = 0; j < list[i].orderDetails.length; j++){
									total += list[i].orderDetails[j].quantity;
								}
								list[i].total = total
							}
							this.accomplishList = list
						}
				    },
				});
			},
			addData(type){
				uni.showLoading({title: '加载更多'});
				if(type==1){
					uni.request({
					    url: this.$url+'/api/order/query', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"orderStatusEnum": 1,
							"pageIndex": ++this.pageIndex1,
							"pageSize": 10,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = res.data.data.items;
								if(list.length > 0 && list != null){
									for(let i = 0; i < list.length; i++){
										list[i].extend = false
										let total = 0;
										for (let j = 0; j < list[i].orderDetails.length; j++){
											total += list[i].orderDetails[j].quantity
										}
										list[i].total = total
										this.paymentList.push(list[i])
									 }
								}else if(list.length == 0){
									this.pageIndex1--
								}
							}else if(res.data.code == 401){
								this.$to401()
							}else{
								this.pageIndex1--
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
				}else if(type==2){
					uni.request({
					    url: this.$url+'/api/order/query', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"orderStatusEnum": 2,
							"pageIndex": ++this.pageIndex2,
							"pageSize": 10,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = res.data.data.items;
								if(list.length > 0 && list != null){
									for(let i = 0; i < list.length; i++){
										list[i].extend = false
										let total = 0;
										for (let j = 0; j < list[i].orderDetails.length; j++){
											total += list[i].orderDetails[j].quantity
										}
										list[i].total = total
										this.reviewList.push(list[i])
									 }
								}else if(list.length == 0){
									this.pageIndex2--
								}
							}else if(res.data.code == 401){
								this.$to401()
							}else{
								this.pageIndex2--
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
				}else if(type==3){
					uni.request({
					    url: this.$url+'/api/order/query', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"orderStatusEnum": 3,
							"pageIndex": ++this.pageIndex3,
							"pageSize": 10,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = res.data.data.items;
								if(list.length > 0 && list != null){
									for(let i = 0; i < list.length; i++){
										list[i].extend = false
										let total = 0;
										for (let j = 0; j < list[i].orderDetails.length; j++){
											total += list[i].orderDetails[j].quantity
										}
										list[i].total = total
										this.shipList.push(list[i])
									 }
								}else if(list.length == 0){
									this.pageIndex3--
								}
							}else if(res.data.code == 401){
								this.$to401()
							}else{
								this.pageIndex3--
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
				}else if(type==5){
					uni.request({
					    url: this.$url+'/api/order/query', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"orderStatusEnum": 5,
							"pageIndex": ++this.pageIndex5,
							"pageSize": 10,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = res.data.data.items;
								if(list.length > 0 && list != null){
									for(let i = 0; i < list.length; i++){
										list[i].extend = false
										let total = 0;
										for (let j = 0; j < list[i].orderDetails.length; j++){
											total += list[i].orderDetails[j].quantity
										}
										list[i].total = total
										this.accomplishList.push(list[i])
									 }
								}else if(list.length == 0){
									this.pageIndex5--
								}
							}else if(res.data.code == 401){
								this.$to401()
							}else{
								this.pageIndex5--
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
				else{
					uni.request({
					    url: this.$url+'/api/order/query', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"orderStatusEnum": null,
							"pageIndex": ++this.pageIndexAll,
							"pageSize": 10,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = res.data.data.items;
								if(list.length > 0 && list != null){
									for(let i = 0; i < list.length; i++){
										list[i].extend = false
										let total = 0;
										for (let j = 0; j < list[i].orderDetails.length; j++){
											total += list[i].orderDetails[j].quantity
										}
										list[i].total = total
										this.allList.push(list[i])
									 }
								}else if(list.length == 0){
									this.pageIndexAll--
								}
							}else if(res.data.code == 401){
								this.$to401()
							}else{
								this.pageIndexAll--
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
										this.getShowData();
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
										this.getShowData();
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
			deleteOrder(id){
				this.hideExtend()
				uni.showModal({
					title: '提示',
					content: '是否确认删除？',
					confirmColor: '#F8B500',
					success: (res) => {
						if(res.confirm){
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
										this.getShowData();
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
		}
	}
</script>

<style lang="scss">
	@import "./myOrder.scss";
</style>
