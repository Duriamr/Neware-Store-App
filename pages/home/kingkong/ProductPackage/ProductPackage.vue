<template>
	<view>
		<image class="pp_header" :src="headerImg" mode="widthFix" />
		<view class="pp_content">
			<view class="ranking">
				<view class="rk_list" v-for="(item, index) in topList" :key="index">
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
							
							<view class="bot_right">
								<text @tap="$toGoods(item.productId)">点击查看</text>
								<image class="bot_img" src="/static/home/kingkong/ProductPackage/go.png" mode="widthFix" @tap="$toGoods(item.productId)"/>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="classTitle">
				<view class="ct_left"></view>
				<view class="name">
					{{name}}
				</view>
				<view class="ct_right"></view>
			</view>
			
			<view class="ranking">
				<view class="rk_list" v-for="(item, index) in botList" :key="index">
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
							<view class="bot_left">
								<text class="currency">￥</text>
								<text class="money">{{item.salePrice}}</text>
							</view>
							
							<view class="bot_right">
								<text @tap="$toGoods(item.productId)">点击查看</text>
								<image class="bot_img" src="/static/home/kingkong/ProductPackage/go.png" mode="widthFix" @tap="$toGoods(item.productId)"/>
							</view>
						</view>
					</view>
					<view class="vertical vertical_left"></view>
					<view class="vertical vertical_right"></view>
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
				topList:[],
				name:'',
				botList:[],
			};
		},
		onLoad() {
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/productpackage/banner', 
					method: "GET",
				    
				    success: (res) => {
						this.headerImg = res.data.data[0].url;
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
				
				uni.request({
				    url: this.$url+'/api/productpackage/multi', 
					method: "GET",
				    
				    success: (res) => {
						this.name = res.data.data[0].name
						let topList = [
							res.data.data[0].products[0]
						]
						let botList = []
						for(let i = 1;i < res.data.data[0].products.length;i++){
							botList.push(res.data.data[0].products[i])
						}
						this.topList = topList
						this.botList = botList
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "./ProductPackage.scss"
</style>
