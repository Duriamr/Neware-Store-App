<template>
	<view class="et_content">
		<view class="et_header" v-if='bannerList && bannerList.length > 0'>
			<image :src="bannerList[0].url" mode="widthFix"></image>
		</view>
		<view class="ranking">
			<view class="rk_list" v-for="(item, index) in topList.products" :key="index">
				<image class="NoN" :src="'/static/home/kingkong/EquipmentTop/No'+item.sort+'.png'" mode="widthFix" />
				<image class="list_img" :src="item.mainImgUrl"  @tap.stop="$toGoods(item.productId)"/>
				<view class="list_right">
					<view class="top">
						<view class="title"  @tap.stop="$toGoods(item.productId)">
							{{item.productName}}
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
						<view class="goShopCart"  @tap.stop="$toGoods(item.productId)">
							立即购买
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="bigbox">
			<view class="classTitle">
				<view class="ct_left"></view>
				<view class="name">
					{{botList.name}}
				</view>
				<view class="ct_right"></view>
			</view>
	
		
		<view class="flow">
			<view class="flow_list" v-for="(item, index) in botList.products" :key="index">
				<image class="list_img" :src="item.mainImgUrl" @tap="$toGoods(item.productId)" />
				<view class="list_bot">
					<view class="top">
						<view class="title" @tap="$toGoods(item.productId)">
							{{item.productName}}
						</view>
						<view class="subTitle" :class="item.sellingPoints == null ? ' title_placeholder' : ''" @tap="$toGoods(item.productId)">
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
</template>

<script>
	export default {
		data() {
			return {
				token:"",
				loginType:false,
				bannerList:[],
				topList:{},
				botList:{}
			};
		},
		onLoad() {
			this.getLoadData()
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getUser();
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
						if(res.data.success&&res.data.code == 200){
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
				    url: this.$url+'/api/equipmenttop/banner', 
					method: "GET",
				    
				    success: (res) => {
						this.bannerList = res.data.data;
						if(this.bannerList[0] && this.bannerList[0].color){
							uni.setNavigationBarColor({
								frontColor: '#ffffff',
								backgroundColor:this.bannerList[0].color||'',
							})
						}
				    }
				});
				
				uni.request({
				    url: this.$url+'/api/equipmenttop/multi', 
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading()
						this.topList = res.data.data[0]
						this.botList = res.data.data[1]
				    },
					fail: (err) => {
						uni.hideNavigationBarLoading()
						this.$requestFail()
					}
				});
			},
			joinCart(item){
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
					uni.request({
					    url: this.$url+'/api/shoppingcart/add', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data: {
						    "productId": item.productId,
							"quantity": item.moq,
							"price": item.salePrice
						},
						method: "POST",
					    
					    success: (res) => {
							if(res.data.success&&res.data.code == 200){
								uni.showToast({
									title: "已加入购物车",
									});
								return;
							}else{
								uni.showToast({
									position: 'bottom',
								    title: res.data.message
								});
								if(res.data.code == 401){
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
								};
								return ;
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
	@import "../kingkong.scss";
	@import "./EquipmentTop.scss";
</style>
