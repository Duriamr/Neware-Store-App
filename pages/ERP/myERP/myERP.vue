<template>
	<view class="myERP_content">
		<view class="nav">
			<view class="nav_list" v-for="(item,index) in tabList" :key="index" :data-index="index" :class="{active:index==idx}" @tap="tabChange(index)">
				{{item}}
			</view>
		</view>
		
		<swiper :current="idx" class="swiper" duration="600" @change="swiperChange">
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData()">
					<view class="myERP_ul">
						<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="allList.length <= 0" />
						<erpItem v-for="(item,index) in allList" :key="'all'+index" 
						:item="item" 
						:index="index" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData(0)">
					<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有已提交订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="zeroList.length <= 0" />
					<view class="myERP_ul">
						<erpItem v-for="(item,index) in zeroList" :key="'all'+index"
						:item="item" 
						:index="index" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData(1)">
					<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有代发货订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="oneList.length <= 0" />
					<view class="myERP_ul">
						<erpItem v-for="(item,index) in oneList" :key="'all'+index"
						:item="item" 
						:index="index" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData(2)">
					<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有待发货订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="twoList.length <= 0" />
					<view class="myERP_ul">
						<erpItem v-for="(item,index) in twoList" :key="'all'+index"
						:item="item" 
						:index="index" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true" @scrolltolower="addData(3)">
					<empty marginTop="15vh" src="/static/expect/not_Order.png" text="您还没有已完成订单哦" btnShow btnText="去逛逛" @btn="$toHome()" v-if="threeList.length <= 0" />
					<view class="myERP_ul">
						<erpItem v-for="(item,index) in threeList" :key="'all'+index"
						:item="item" 
						:index="index" />
					</view>
				</scroll-view>
			</swiper-item>
			
		</swiper>
	</view>
</template>

<script>
	import erpItem from '@/components/nw-erp-item/nw-erp-item';
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {erpItem,empty},
		data() {
			return {
				token:'',
				
				idx:0,
				allList:[],//null
				zeroList:[],//0
				oneList:[],//1
				twoList:[],//2
				threeList:[],//3
				tabList:["全部", "已提交", "待发货", "已发货", "已完成"],
				
				pageIndexAll:1,
				pageIndex0:1,
				pageIndex1:1,
				pageIndex2:1,
				pageIndex3:1
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
		onNavigationBarButtonTap(val){
			if(val.index == 0){
				if(this.token!=''&&this.token!=null&&this.token!=undefined){
					this.$toPath('/pages/search/searchERP')
				}else{
					this.$toLogin
				}
			}
		},
		methods:{
			tabChange(index) {
				this.idx = index;
			},
			swiperChange(e) {
			    this.idx = e.target.current;
			},
			getShowData(){
				uni.request({
				    url: this.$url+'/api/ordererp/ordererp', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"page": 1,
						"pageSize": 10,
						"key": null,
						"qryStatus": null,
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.allList = JSON.parse(res.data.data).data.data
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
				    url: this.$url+'/api/ordererp/ordererp',
				    header:{
				    	Authorization:'Bearer '+this.token
				    },
				    data:{
				    	"page": 1,
				    	"pageSize": 10,
				    	"key": null,
				    	"qryStatus": 0,
				    },
				    method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.zeroList = JSON.parse(res.data.data).data.data
						}
				    },
				});
				uni.request({
				    url: this.$url+'/api/ordererp/ordererp',
				    header:{
				    	Authorization:'Bearer '+this.token
				    },
				    data:{
				    	"page": 1,
				    	"pageSize": 10,
				    	"key": null,
				    	"qryStatus": 1,
				    },
				    method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.oneList = JSON.parse(res.data.data).data.data
						}
				    },
				});
				uni.request({
				    url: this.$url+'/api/ordererp/ordererp',
				    header:{
				    	Authorization:'Bearer '+this.token
				    },
				    data:{
				    	"page": 1,
				    	"pageSize": 10,
				    	"key": null,
				    	"qryStatus": 2,
				    },
				    method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.twoList = JSON.parse(res.data.data).data.data
						}
				    },
				});
				uni.request({
				    url: this.$url+'/api/ordererp/ordererp',
				    header:{
				    	Authorization:'Bearer '+this.token
				    },
				    data:{
				    	"page": 1,
				    	"pageSize": 10,
				    	"key": null,
				    	"qryStatus": 3,
				    },
				    method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.threeList = JSON.parse(res.data.data).data.data
						}
				    },
				});
			},
			addData(type){
				uni.showLoading({title: '加载更多'});
				if(type==0){
					uni.request({
					    url: this.$url+'/api/ordererp/ordererp', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"page": ++this.pageIndex0,
							"pageSize": 10,
							"key": null,
							"qryStatus": 0,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = JSON.parse(res.data.data).data.data;
								if(list.length > 0){
									for(let i = 0; i < list.length; i++){
										this.zeroList.push(list[i])
									 }
								}else if(list.length == 0){
									this.pageIndex0--
								}
							}else if(res.data.code == 401){
								this.$to401()
							}else{
								this.pageIndex0--
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
				}else if(type==1){
					uni.request({
					    url: this.$url+'/api/ordererp/ordererp', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"page": ++this.pageIndex1,
							"pageSize": 10,
							"key": null,
							"qryStatus": 1,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = JSON.parse(res.data.data).data.data;
								if(list.length > 0){
									for(let i = 0; i < list.length; i++){
										this.oneList.push(list[i])
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
					    url: this.$url+'/api/ordererp/ordererp', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"page": ++this.pageIndex2,
							"pageSize": 10,
							"key": null,
							"qryStatus": 2,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = JSON.parse(res.data.data).data.data;
								if(list.length > 0){
									for(let i = 0; i < list.length; i++){
										this.twoList.push(list[i])
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
					    url: this.$url+'/api/ordererp/ordererp', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"page": ++this.pageIndex3,
							"pageSize": 10,
							"key": null,
							"qryStatus": 3,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = JSON.parse(res.data.data).data.data;
								if(list.length > 0){
									for(let i = 0; i < list.length; i++){
										this.threeList.push(list[i])
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
				}else{
					uni.request({
					    url: this.$url+'/api/ordererp/ordererp', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"page": ++this.pageIndexAll,
							"pageSize": 10,
							"key": null,
							"qryStatus": null,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading()
							if(res.data.success&&res.data.code == 200){
								let list = [];
								list = JSON.parse(res.data.data).data.data;
								if(list.length > 0){
									for(let i = 0; i < list.length; i++){
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
		}
	}
</script>

<style lang="scss">
	@import "./myERP.scss";
</style>
