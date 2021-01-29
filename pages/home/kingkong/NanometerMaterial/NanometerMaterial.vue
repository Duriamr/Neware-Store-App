<template>
	<view class="nr_content" >
		<view class="nr_header" v-if='bannerList && bannerList.length > 0'>
			<image :src="bannerList[0].url" mode="widthFix" />
		</view> 
		<scroll-view  class="wuc-tab text-center navList" scroll-with-animation scroll-x :scroll-into-view='viewId'>
			<div class="flex text-center ">
				<div class="wuc-tab-item flex-sub" :class="index === tabCur ? 'text-xw':''" v-for="(item,index) in tabList" :key="index" @tap="tabChange(index)" :id="'swiper'+index">
					<text>{{item}}</text>
				</div>
			</div>
		</scroll-view>
		<view class="linkage">
			<swiper :current="tabCur" class="swiper" duration="100" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">
				<swiper-item class="item" v-for="(item, index) in botList" :key="item.id">
					<scroll-view class="scroll" scroll-y>
					<view class="ranking">
						<view class="bigbox">
							<view class="ranking_list" v-for="(item2, index2) in item.products" :key="index2" @tap="$toGoods(item2.id)">
								<image class="list_img" :src="item2.imgUrl" />
								<view class="list_right">
									<view class="top">
										<view class="title">
											{{item2.productName}}
										</view>
										<view class="subTitle" :class="item2.sellingPoints == null ? ' title_placeholder' : ''">
											{{item2.sellingPoints}}
										</view>
									</view>
									<view class="bot">
										<view class="bot_top" v-if="item2.salePrice>=0">
											<text class="currency">￥</text>
											<text class="price">{{item2.salePrice}}</text>
										</view>
										<view class="bot_top" v-if="item2.salePrice<0">
											<text class="price">价格请联系客服</text>
										</view>
										<view class="clickLook" @tap="$toGoods(item2.id)">
											点击查看
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerList:[],
				tabList:[],
				tabCur:0,
				topList:{},
				botList:[],
				viewId:'',
			};
		},
		onLoad() {
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/nanometermaterial/banner', 
					method: "GET",
				    success: (res) => {
						this.bannerList = res.data.data;
				    },
				});
				
				uni.request({
				    url: this.$url+'/api/productcategory/multi-level?categoryId=15', 
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading()
						let tabList = []
						let botList = []
					
						res.data.data[0].childNode.forEach(item =>{
							if(item.products && item.products.length > 0){
								tabList.push(item.categoryName)
								botList.push(item)
							}
						})
						this.tabList = tabList
						this.botList = botList
				    },
					fail: (err) => {
						uni.hideNavigationBarLoading()
						this.$requestFail()
					}
				});
			},
			
			tabChange(index) {
				this.tabCur = index;
			},
			swiperChange(e) {
			    let { current } = e.target;
			    this.tabCur = current;
				this.viewId ='swiper'+current
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../kingkong.scss";
	@import "./NanometerMaterial.scss";
	.scroll{
		box-sizing: border-box;
		height: 36upx;
		margin-bottom: 24upx;
	}
	.wuc-tab {
		white-space: nowrap;
	}
	.wuc-tab-item {
		box-sizing: border-box;
		display: inline-block;
		font-size:32upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:500;
		color:rgba(87,87,87,0.8);
		margin-right: 32upx;
	}
	.wuc-tab-item:first-child{
		margin-left:0upx ;
	}
	.wuc-tab-item.cur {
		// border-bottom: 4upx solid;
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
		font-size:32upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:500;
		color:#333333;
	}
</style>