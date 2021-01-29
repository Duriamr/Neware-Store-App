<template>
	<view class="na_content">
		<view class="na_header" v-if='bannerList && bannerList.length > 0'>
			<image :src="bannerList[0].url" mode="widthFix">
		</view>
		<view class="na_ul">
			<view class="na_list" v-for="(item, index) in naList" :key="index" >
				<view class="grid">
					<view class="grid_list" v-for="(item2, index2) in item.products" :key="index2" @tap="$toGoods(item2.productId)">
						<img :src="item2.mainImgUrl" alt="">
						<view class='productDetaile'>
							<view class='name'>{{item2.productName}}</view>
							<view v-if="item2.sellingPoints" class="sellingPoints">{{item2.sellingPoints}}</view>
							<view v-else class="sellingPoints">
							</view>
							<view class='money'>
								<view class="bot" v-if="item2.salePrice>=0">
									<text class="currency">￥</text>
									<text class="price">{{item2.salePrice}}</text>
								</view>
								<view class="bot" v-if="item2.salePrice<0">
									<text class="price">价格请联系客服</text>
								</view>
								<text class="clickLook" @tap="$toGoods(item2.productId)">马上带走</text>
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
				naList:[]
			};
		},
		onLoad() {
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/newarearound/banner', 
					method: "GET",
				    
				    success: (res) => {
						this.bannerList = res.data.data;
						// if(this.bannerList[0] && this.bannerList[0].color){
						// 	uni.setNavigationBarColor({
						// 		frontColor: '#ffffff',
						// 		backgroundColor:this.bannerList[0].color||'',
						// 	})
						// }
				    },
				});
				
				uni.request({
				    url: this.$url+'/api/newarearound/multi', 
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading()
						this.naList = res.data.data
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
	@import "../kingkong.scss";
	@import "./NewareAround.scss";
</style>
