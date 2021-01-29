<template>
	<view class="em_content" :style="{background:bannerList[0].color||'#DCE1FA' }" v-if='bannerList && bannerList.length > 0'>
	  <image :src="bannerList[0].url"  mode="widthFix" />
		<view class="warp">
			<view class="classTitle">
				<view class="left">
					<view class="line"></view>
					<view class="radio" :style="{backgroundColor:bannerList[0].color?bannerList[0].color:'#8997F9' }"></view>
				</view>
				<view class="name" :style="{color:bannerList[0].color||'#8997F9' }">
					{{topList.name}}
				</view>
				<view class="right">
					<view class="radio" :style="{backgroundColor:bannerList[0].color||'#8997F9' }"></view>
					<view class="line"></view>
				</view>
			</view>
			
			<view class="grid">
				<view class="grid_list" v-for="(item, index) in ( topList.products || []).slice(0,1)" :key="index">
					<image :src="item.mainImgUrl" @tap="$toGoods(item.productId)" />
					<view class='productDetaile'>
						<view>
							<text class="title">{{item.productName}}</text>
							<view class="bot" v-if="item.salePrice>=0">
								<text class="currency">￥</text>
								<text class="price">{{item.salePrice}}</text>
							</view>
							<view class="bot" v-if="item.salePrice<0">
								<text class="price">价格请联系客服</text>
							</view>
						</view>
						<view class='clickLook' @tap="$toGoods(item.productId)">
							点击查看
						</view>
					</view>
				</view>
			</view>
			
			<view v-if="botList && botList.length >0 " class="productList">
				<view v-for="(item,index) in (botList||[]).slice(1)" :key='index' class="products">
					<view class="classTitle">
					<view class="left">
						<view class="line"></view>
						<view class="radio" :style="{backgroundColor:bannerList[0].color||'#8997F9' }"></view>
					</view>
					<view class="name"  :style="{color:bannerList[0].color||'#8997F9' }">
						{{item.name}}
					</view>
					<view class="right">
						<view class="radio" :style="{backgroundColor:bannerList[0].color||'#8997F9' }"></view>
						<view class="line"></view>
					</view>
					</view>
			
					<view v-for="(data,index) in item.products" :key='index' class='prodcutItem' @tap="$toGoods(data.productId)">
						<img :src="data.mainImgUrl" alt="">
						<view class='productDetaile'>
							<view class='name'>{{data.productName}}</view>
							<view v-if="data.sellingPoints" class="sellingPoints">{{data.sellingPoints}}</view>
							<view v-else class="sellingPoints">
								
							</view>
							<view class='money'>
								<view class="bot" v-if="data.salePrice>=0">
									<text class="currency">￥</text>
									<text class="price">{{data.salePrice}}</text>
								</view>
								<view class="bot" v-if="data.salePrice<0">
									<text class="price">价格请联系客服</text>
								</view>
								<text class="clickLook"  @tap="$toGoods(data.productId)">点击查看</text>
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
				tabList:[],
				tabCur:0,
				topList:{},
				botList:[],
			};
		},
		onLoad() {
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/experiment/banner', 
					method: "GET",
				    
				    success: (res) => {
						this.bannerList = res.data.data;
						// uni.setNavigationBarColor({
						// 	frontColor: '#ffffff',
						// 	backgroundColor:this.bannerList[0] &&this.bannerList[0].color||'#DCE1FA',
						// })
				    },
				});
				
				uni.request({
				    url: this.$url+'/api/experiment/multi', 
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading()
						this.topList = res.data.data[0]   // 第一个数组
						this.botList = res.data.data // 除了第一个
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
			},
		}
	}
</script>

<style lang="scss">
	@import "../kingkong.scss";
	@import "./ExperimentMaterial.scss";
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