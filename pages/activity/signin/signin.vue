<template>
	<view class="signin_content">
		<view class="top">
			<view class="signinList" @tap.stop="toList">
				<text class="list_text">签到排名</text>
				<text class="list_num">50+</text>
			</view>
			<view class="num">{{allDay}}</view>
			<view class="text">累计签到（天）</view>
			
			<view class="progress">
				<image class="big" src="/static/activity/signin/big.png" />
				
				<view class="progress_bar" :style="{background:barBg}">
					<view class="progress_bar_content" :style="{background:barBg}">
						<view class="progress_bar_main" :style="{width:barWidth}"></view>
					</view>
					<view class="day" style="left:143upx;">
						<text>7天</text>
						<image class="small" src="/static/activity/signin/small.png" />
						<view class="dot"></view>
					</view>
					<view class="day" style="left:317upx;">
						<text>14天</text>
						<image class="small" src="/static/activity/signin/small.png" />
						<view class="dot"></view>
					</view>
					<view class="day" style="right: 0upx;">
						<text>21天</text>
						<image class="small" src="/static/activity/signin/small.png" />
						<view class="dot"></view>
					</view>
				</view>
			</view>
			
			<view class="btn" v-if="!singDay" @tap.stop="add">
				立即签到
			</view>
			<view class="btn" v-if="singDay" style="background: rgba(247,92,80,0.4);">
				今日已签到
			</view>
		</view>
		
		<view class="bot" v-if="product.length>0">
			<view class="modular_title">
				<view class="left" style="display: flex;">
					<view>
						兑换专区
					</view>
					<view style="font-size:24upx;color:#666666;" v-if='describe'>
						{{describe}}
					</view>
				</view>
				<view class="right" @tap.stop="toRecord">
					<text>兑换记录</text>
					<image src="/static/activity/signin/carrow.png" mode="widthFix" />
				</view>
			</view>
			
			<view class="product_ul">
				<view class="product_list" v-for="(item, index) in product" :key="index">
					<view class="left" @tap.stop="toGoods(item)">
						<image class="productImg" :src="item.mainImgUrl" />
						<text>{{item.productName}}</text>
					</view>
					
					<view class="right">
						<view class="r_top">
							<view class="dot"></view>
							<text>进度</text>
							<text style="color: #F75C50;">{{day}}/{{item.point}}</text>
						</view>
						<view class="r_bot" style="background:rgba(229,229,229,1);color:rgba(255,255,255,1);"
						 v-if="item.status == 3 || item.productId == 674  || item.productId == 23   || item.productId == 1083    || item.productId == 1112 ">礼品已兑完</view>
						<view v-else>
							<view class="r_bot" style="background:rgba(247,92,80,0.1);color:rgba(247,92,80,1);" v-if="item.status == 0" @tap.stop="toAddress(item.productId)">
								立即领取
							</view>
							<view class="r_bot" style="background:rgba(229,229,229,1);color:rgba(255,255,255,1);" v-if="item.status == 1">
								未完成
							</view>
							<view class="r_bot" style="background:rgba(229,229,229,1);color:rgba(255,255,255,1);" v-if="item.status == 2" @tap.stop="toRecord">
								已领取
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<text class="tips">
			温馨提示：
			签到以累计形式计算，不做拆分，单个礼品在21天周期内只可领取一次。
			点击“立即领取”成功兑换礼品后，签到进度条即清零回至起点，累计签到天数不变。
		</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:"",
				
				allDay:0,
				day:0,
				singDay:false,
				barWidth:"0%",
				barBg:"rgba(255,255,255,1)",
				describe:'',
				product:[]
			};
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getDay();
			this.getProduct();
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.toRule()
			}
		},
		watch:{
			day:function(val){
				this.barWidth = Number(this.day / 21 * 100).toFixed(2)+"%";
				if(val >= 21){
					this.barBg = "rgba(247,92,80,1)";
				}else{
					this.barBg = "rgba(255,255,255,1)";
				}
			}
		},
		methods:{
			toGoods(item){
				if(item.productId == 674  || item.productId == 23   || item.productId == 1083    || item.productId == 1112){
					return false
				}else{
					uni.navigateTo({
						url:"/pages/sort/goods/goods?goodsId="+item.productId,
					})
				}
			},
			getDay(){
				uni.request({
				    url: this.$url+'/api/appsignin/query',
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.singDay = res.data.data.singDay
							this.allDay = res.data.data.count
							this.day = res.data.data.point
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getProduct(){
				uni.request({
				    url: this.$url+'/api/appsignin/exchange?type=4',
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.product = res.data.data
							if(res.data.data && res.data.data.length > 0){
								this.describe = res.data.data[0].describe
							}
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			add(){
				uni.request({
				    url: this.$url+'/api/appsignin/add',
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.getDay();
							this.getProduct();
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			toList(){
				uni.navigateTo({
					url:"/pages/activity/signin/signinList/signinList"
				})
			},
			toAddress(productId){
				uni.navigateTo({
					url:"/pages/activity/signin/sigAddress/sigAddress?productId="+productId
				})
			},
			toRecord(){
				uni.navigateTo({
					url:"/pages/activity/signin/sigRecord/sigRecord"
				})
			},
			toRule(){
				uni.navigateTo({
					url:"/pages/browser/browser?src=https://shop.neware.com.cn/rule/#/pages/rule/sigRule"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./signin.scss"
</style>