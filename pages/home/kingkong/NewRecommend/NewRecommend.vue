<template>
	<view class="nr_content" >
		<view class="nr_header" v-if='bannerList && bannerList.length > 0'>
			<image :src="bannerList[0].url" mode="widthFix">
		</view> 
		<view class="linkage" :style="{background:bannerList[0] && bannerList[0].color||'#91D6EF'}">
			<scroll-view class="navList wuc-tab text-center wuc-tab-item" scroll-with-animation scroll-x  :scroll-into-view='viewId'>
				<div class="flex text-center ">
					<div class=" flex-sub" :class="index === tabCur ? 'text-xw':''" v-for="(item,index) in tabList" :key="index" @tap="tabChange(index)" :id="'swiper'+index">
						<text>{{item}}</text>
					</div>
				</div>
			</scroll-view>
			
			<swiper :current="tabCur" class="swiper" duration="100" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">
				<swiper-item class="item" v-for="(item, index) in botList" :key="index">
					<scroll-view class="scroll" scroll-y="true">
					<view class="ranking">
						<view class="bigbox">
							<view class="ranking_list" v-for="(item2, index2) in item.products" :key="index2" @click="$toGoods(item2.productId)">
								<image class="list_img" :src="item2.mainImgUrl" />
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
		onReady() {
		
		},
		methods:{
			getLoadData(){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/newrecommend/banner', 
					method: "GET",
				    
				    success: (res) => {
						this.bannerList = res.data.data;
						// uni.setNavigationBarColor({
						// 	frontColor: '#ffffff',
						// 	backgroundColor:this.bannerList[0] &&this.bannerList[0].color||'#80D0EC',
						// })
				    },
				});
				
				uni.request({
				    url: this.$url+'/api/newrecommend/multi', 
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading()
						let tabList = []
						let botList = []
						for(let i = 0;i < res.data.data.length;i++){
							tabList.push(res.data.data[i].name)
							botList.push(res.data.data[i])
						}
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
				this.viewId = 'swiper'+current
			},
		}
	}
</script>

<style lang="scss">
	@import "../kingkong.scss";
	@import "./NewRecommend.scss";
	.navList{
		margin-bottom: 38upx;
	}
	.swiper{
		box-sizing: border-box;
		height: 36upx;
		margin-bottom: 20upx;
	}
	.wuc-tab {
		white-space: nowrap;
	}
	.wuc-tab-item {
		box-sizing: border-box;
		height: 40upx;
		display: inline-block;
		line-height: 40+upx;
		font-size:32upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(255,255,255,0.8);
		text-shadow:0px 0px 8upx rgba(91,164,195,1);
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
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:600;
		color:rgba(255,255,255,1);
		text-shadow:0px 0px 8upx rgba(91,164,195,1);
	}
</style>