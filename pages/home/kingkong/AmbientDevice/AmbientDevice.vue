<template>
	<view>
		<image class="ad_header" :src="headerImg" mode="widthFix" />
		<view class="ad_content">
			<view class="classTitle">
				<view class="ct_left"></view>
				<view class="name">
					{{topList.name}}
				</view>
				<view class="ct_right"></view>
			</view>
			
			<view class="ranking">
				<view class="rk_list" v-for="(item, index) in topList.products" :key="index">
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
							<view class="bot_top" v-if="item.salePrice>=0">
								<text class="currency">￥</text>
								<text class="price">{{item.salePrice}}</text>
							</view>
							<view class="bot_top" v-if="item.salePrice<0">
								<text class="price">价格请联系客服</text>
							</view>
							<view class="bot_bot" @tap="$toGoods(item.productId)">
								立即查看
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="classTitle">
				<view class="ct_left"></view>
				<view class="name">
					{{botList.name}}
				</view>
				<view class="ct_right"></view>
			</view>
			
			<view class="flow">
				<view class="flow_list" v-for="(item, index) in botList.products" :key="index">
					<image class="list_img" :src="item.mainImgUrl" />
					<view class="list_bot">
						<view class="top">
							<view class="title">
								{{item.productName}}
							</view>
							<view class="subTitle" :class="item.sellingPoints == null ? ' title_placeholder' : ''">
								{{item.sellingPoints}}
							</view>
						</view>
						<view class="bot">
							<view class="bot_top" v-if="item.salePrice>=0">
								<text class="currency">￥</text>
								<text class="price">{{item.salePrice}}</text>
							</view>
							<view class="bot_top" v-if="item.salePrice<0">
								<text class="price">价格请联系客服</text>
							</view>
							<view class="bot_bot" @tap="$toGoods(item.productId)">
								立即查看
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
				headerImg:'',
				topList:{},
				botList:{},
			};
		},
		onLoad() {
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/ambientdevice/banner', 
					method: "GET",
				    
				    success: (res) => {
						this.headerImg = res.data.data[0].url;
				    },
				});
				
				uni.request({
				    url: this.$url+'/api/ambientdevice/multi', 
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
		}
	}
</script>

<style lang="scss">
	@import "./AmbientDevice.scss"
</style>
