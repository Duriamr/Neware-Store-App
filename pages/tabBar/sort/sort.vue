<template>
	<view class="sort_content">
		<view v-if='isShow' class="wantBuy" :style="{height:pageHeight+'px'}">
			<view class="image">
				<image src="/static/tabBar/popup.png" class="image"/>
				<text class="text" @tap.stop='wantBuy'>填写需求</text>
				<image src="/static/tabBar/close.png" class="close" @tap.stop="cancelwantBuy"/>
			</view>
		</view>
		<!-- 头部 -->
		<view class="sort_header">
			<view class="status"></view>
			<view class="header">
				<view class="searchIpt" @tap="toSearch">
					<image class="search" src="/static/search/search.png" />
					<text>{{search}}</text>
				</view>
				<image class="message" src="/static/tabBar/bg.png" @tap.stop="iswantBuy" />
			</view>
		</view>
		<view class="main_content">
			<view class="left">
				<!-- <scroll-view class="scroll" scroll-y="true"> -->
					<view class="ul">
						<view class="item" v-for="(item,index) in leftArray" :key="index" :data-index="index" @tap="leftTap(index,item.id)"
						>
							<text :class="{'active':index==leftIndex}" >{{item.categoryName}}</text>
						</view>
					</view>
			    <!-- </scroll-view> -->
			</view>
			<view class="main">
				<swiper class="swiper" 
					:current="leftIndex" 
					@change="swiperChange"
					 vertical="true" 
					 duration="0">
					<swiper-item v-for="(item,index) in leftArray" :key="'leftArray'+index">
						<scroll-view class="scroll" scroll-y="true" :scroll-into-view="scrollInto" lower-threshold="5" @scrolltolower="scrolltolower">
							<view class="item" :id="'item-'+index">
								<view class="item_img">
									<image :src="mainArray.imgUrl" @tap.stop="$toPath(mainArray.linkUrl)" mode="widthFix" lazy-load />
								</view>
								<view class="item_ul">
								<view class="item_title">
									{{mainArray.categoryName}}
								</view>
									<view class="item_li" v-for="(item2,index2) in mainArray.products" :key="'mainArray1'+index2" @tap="$toGoods(item2.id)">
										<image :src="item2.imgUrl" lazy-load />
										<text>{{item2.productName}}</text>
									</view>
									<view class="item_li" v-for="(item2,index2) in mainArray.childNode" :key="'mainArray2'+index2" @click="toSort2(mainArray.id,item2,index2)">
										<image :src="item2.imgUrl" lazy-load />
										<text>{{item2.categoryName}}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:false,
				pageHeight:'',
				search:"",
				leftArray:[],
				mainArray:[],
				leftIndex:0,
				oneId:0,
				scrollInto:'',
				token:'',
				
				cartBadge:''
			}
		},
		onLoad(){
			this.pageHeight = uni.getSystemInfoSync().screenHeight
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.$getCartBadge()
			this.getLeftIndex();
			this.getLeftData();
		},
		onHide(){
			this.clearLeftIndex()
		},
		onUnload(){
			this.clearLeftIndex()
		},
		onBackPress(){
			this.clearLeftIndex()
		},
		methods: {
			getLeftIndex(){
				try {
					this.leftIndex = uni.getStorageSync('left');
				} catch (e) {
					this.leftIndex = 0;
				}
			},
			clearLeftIndex(){
				uni.setStorage({
				    key: 'left',
				    data: this.leftIndex,
				});
			},
			getLeftData(){
				uni.request({
					url: this.$url+'/api/productcategory/multi', 
					method: "GET",
					
					success: (res) => {
						this.leftArray = res.data.data;
						if(this.leftIndex == ''){
							this.leftIndex = 0
						}
						let i = this.leftIndex;
						this.oneId = this.leftArray[i].id;
						this.getMainData();
					},
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getMainData(){
				uni.showNavigationBarLoading()
				uni.request({
					url: this.$url+'/api/productcategory/multi-level?categoryId='+this.oneId, 
					method: "GET",
					
					success: (res) => {
						uni.hideNavigationBarLoading()
						// if(res.data.data[0].)
						console.log(res.data.data)
						this.mainArray = res.data.data[0];
					},
					fail: (err) => {
						uni.hideNavigationBarLoading()
						this.$requestFail()
					}
				});
			},
			/* 左侧导航点击 */
			leftTap(index,id){
				this.leftIndex=Number(index);
				this.mainArray = [];
				this.oneId = id
				this.getMainData();
				this.scrollInto=`item-${index}`;
			},
			/* 轮播图切换 */
			swiperChange(e){
				let index=e.detail.current;
				this.leftIndex=Number(index);
				this.mainArray = [];
				this.oneId = this.leftArray[index].id
				this.getMainData();
				this.scrollInto=`item-${index}`;
			},
			scrolltolower(){
				let index=this.leftIndex + 1
				this.leftIndex=index
				this.mainArray = [];
				this.oneId = this.leftArray[index].id
				this.getMainData();
				this.scrollInto=`item-${index}`;
			},
			toSort2(oneId,item,index){
				if(item.childNode!=null&&item.childNode.length>0){
					uni.navigateTo({
						url:"/pages/sort/sort2/sort3?sortId="+item.id+"&index=0"
					})
				}else{
					uni.navigateTo({
						url:"/pages/sort/sort2/sort2?sortId="+oneId+"&index="+index
					})
				}
			},
			toSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			iswantBuy(){
				this.isShow = true
				uni.hideTabBar({
					animation: true
				})
			},
			//  取消弹窗
			cancelwantBuy(){
				this.isShow = false
				uni.showTabBar({
					animation: true
				})
			},
			wantBuy(){
				if(!uni.getStorageSync('token')){
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
				}else{
					this.cancelwantBuy()
					uni.navigateTo({
						url:'/pages/sort/wantBuy/wantBuy'
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "./sort.scss"
</style>
