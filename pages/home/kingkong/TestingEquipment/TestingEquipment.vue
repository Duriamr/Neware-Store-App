<template>
	<view class="em_content">
		<view v-if="bannerList && bannerList.length > 0">
			<image class="banner_img" :src="bannerList[0].url"  mode="widthFix"/>
		</view>
		<view class="warp">
			<view class="content" v-for="(item,index) in equipmentList" :key='index'>
				<view class="classTitle">
					<view class="ct_1"></view>
					<view class="ct_2"></view>
					<view class="ct_3"></view>
					<view class="name">
						{{item.name}}
					</view>
					<view class="ct_3"></view>
					<view class="ct_2"></view>
					<view class="ct_1"></view>
				</view>
				
				<view class="ranking">
					<view class="rk_list" v-for="(item, index) in item.products" :key="index" @tap.stop="$toGoods(item.productId)">
						<image class="list_img" :src="item.mainImgUrl" />
						<view class="list_right">
							<view class="top">
								<view class="title">
									{{item.productName}}
								</view>
								<view class="subTitle" :class="item.sellingPoints == null ? ' title_placeholder' : ''">
									{{item.sellingPoints}}
								</view>
							</view>
							<view class="bot">
								<view class="bot_left" v-if="item.salePrice>=0">
									<text class="currency">￥</text>
									<text class="price">{{item.salePrice}}</text>
								</view>
								<view class="bot_left" v-if="item.salePrice<0">
									<text class="price">价格请联系客服</text>
								</view>
							</view>
						</view>
					</view>
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
				bannerList:[],
				equipmentList:[],
				loginType:false,
				once:false
			};
		},
		onLoad() {
			this.getLoadData()
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getUser();
			this.once = false;
		},
		methods:{
			getUser(){
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success == true&&res.data.code == 200){
							this.loginType = true
						}else{
							this.loginType = false
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getLoadData(){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/testingequipment/banner', 
					method: "GET",
				    
				    success: (res) => {
						this.bannerList = res.data.data;
				    },
				});
				
				uni.request({
				    url: this.$url+'/api/testingequipment/multi', 
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading()
						this.equipmentList = res.data.data
				    },
					fail: (err) => {
						uni.showNavigationBarLoading();
						this.$requestFail()
					}
				});
			},
			toConfirmation(item){
				if(!this.loginType){
					uni.showToast({
					    icon: 'none',
					    position: 'bottom',
					    title: '请登录'
					});
					setTimeout(()=>{
						uni.navigateTo({
							url:"/pages/my/login/login"
						})
					},1000)
					return;
				}else{
					if(this.once){
						return;
					}
					this.once = true
					uni.showLoading({
						title:'订单创建中'
					});
					setTimeout(()=>{
						uni.hideLoading();
						item.quantity = item.moq
						item.id = item.productId
						item.productImage = [
							{
								url:item.mainImgUrl
							}
						]
						uni.setStorage({
							key:'buylist',
							data:item,
							success: () => {
								uni.navigateTo({
									url:'/pages/order/orderNow'
								})
							}
						})
					},1000)
					
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "../kingkong.scss";
	@import "./TestingEquipment.scss";
	scroll-view{
		box-sizing: border-box;
		height: 100upx;
		margin-bottom: 20upx;
		background:rgba(255,255,255,1);
	}
	.wuc-tab {
		white-space: nowrap;
	}
	.wuc-tab-item {
		box-sizing: border-box;
		height: 100upx;
		display: inline-block;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(102,102,102,1);
		line-height: 90upx;
		// margin-right: 40upx;
		// padding:0 24upx;
	}
	.wuc-tab-item:first-child{
		margin-left:0upx ;
	}
	.wuc-tab-item.cur {
		// border-bottom: 6upx solid rgba(17,17,17,1);
		text{
			padding-bottom: 24upx;
			border-bottom: 6upx solid rgba(17,17,17,1);
		}
	}
	
	.wuc-tab.fixed {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 1024;
		box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
	}
	
	.flex {
		display: flex;
	}
	.text-center {
		text-align: center;
	}
	.flex-sub {
		flex: 1;
	}
	.bg-white{
		background-color: #ffffff;
	}
	.text-xw {
		color:rgba(51,51,51,1);
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
	}
</style>