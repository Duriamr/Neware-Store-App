<template>
	<view class="sort2_content">
		<scroll-view class="wuc-tab text-center text-black bg-white" scroll-with-animation scroll-x :scroll-into-view="viewId">
		<div class="flex text-center">
			<div class="wuc-tab-item flex-sub" :class="index === tabCur ? 'text-xw' + ' cur':''" v-for="(item,index) in tabList" :key="'tabList'+index" @tap="tabChange(index)" :id="'vi'+index">
			  <text>{{item.categoryName}}</text>
			</div>
		</div>
		</scroll-view>
		<swiper :current="tabCur" class="swiper" duration="300" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">
			<swiper-item class="item" v-for="(item,index) in tabList" :key="'tabList2'+index">
				<scroll-view class="scroll" scroll-y="true">
					<view class="ul">
						<view class="lefeList">
							<view class="list" v-for="(item2, index2) in item.leftList" :key="'leftList'+index2" @tap="$toGoods(item2.id)">
								<image class="image" :src="item2.imgUrl" lazy-load />
								<view class="list_bot">
									<text class="title">{{item2.productName}}</text>
									<text class="subTitle" :class="item2.sellingPoints == null ? ' title_placeholder' : ''">{{item2.sellingPoints}}</text>
									<view class="bot" v-if="item2.salePrice>=0">
										<text class="currency">￥</text>
										<text class="price">{{item2.salePrice}}</text>
									</view>
									<view class="bot" v-if="item2.salePrice<0">
										<text class="price" >价格请联系客服</text>
									</view>
								</view>
							</view>
						</view>
						<view class="rightList">
							<view class="list" v-for="(item2, index2) in item.rightList" :key="'rightList'+index2" @tap="$toGoods(item2.id)">
								<image class="image" :src="item2.imgUrl" lazy-load />
								<view class="list_bot">
									<text class="title">{{item2.productName}}</text>
									<text class="subTitle" :class="item2.sellingPoints == null ? ' title_placeholder' : ''">{{item2.sellingPoints}}</text>
									<view class="bot" v-if="item2.salePrice>=0">
										<text class="currency">￥</text>
										<text class="price">{{item2.salePrice}}</text>
									</view>
									<view class="bot" v-if="item2.salePrice<0">
										<text class="price" >价格请联系客服</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				twoId:0,
				tabCur:0,
				sortObject:{},
				tabList:[],
				showChild:true,
				viewId:"",
			};
		},
		onLoad(option) {
			this.twoId = option.sortId;
			this.loadData();
			this.tabCur = parseInt(option.index);
		},
		methods: {
			tabChange(index) {
				this.tabCur = index;
			},
			swiperChange(e) {
			    let { current } = e.target;
			    this.tabCur = current;
				this.viewId = "vi" + current;
			},
			loadData(){
				uni.request({
					url: this.$url+'/api/productcategory/multi-level?categoryId='+this.twoId, 
					method: "GET",
					
					success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.setNavigationBarTitle({
								title:res.data.data[0].categoryName
							});
							if(res.data.data[0].childNode != null){
								this.tabList = res.data.data[0].childNode;
								for(let i=0; i<this.tabList.length; i++){
									let leftList = [];
									let rightList = [];
									for(let j=0; j<this.tabList[i].products.length; j++){
										if(j%2 == 0){
											leftList.push(this.tabList[i].products[j])
										} else {
											rightList.push(this.tabList[i].products[j])
										}
									}
									this.tabList[i].leftList = leftList
									this.tabList[i].rightList = rightList
								}
								this.viewId = "vi" + this.tabCur;
							}else if(res.data.data[0].childNode == null){
								this.showChild = false;
								this.tabList = res.data.data[0].products;
								for(let i=0; i<this.tabList.length; i++){
									let leftList = [];
									let rightList = [];
									for(let j=0; j<this.tabList[i].products.length; j++){
										if(j%2 == 0){
											leftList.push(this.tabList[i].products[j])
										} else {
											rightList.push(this.tabList[i].products[j])
										}
									}
									this.tabList[i].leftList = leftList
									this.tabList[i].rightList = rightList
								}
								this.viewId = "vi" + this.tabCur;
							}
							
						}else{
							uni.showToast({
							    icon: 'none',
								position: 'bottom',
							    title: '获取商品失败'
							});
							setTimeout(()=>{
								uni.navigateBack();
							},1000)
						}
					},
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
		},
	}
</script>

<style lang="scss">
	@import "./sort2.scss";
scroll-view{
	box-sizing: border-box;
}
.wuc-tab {
	height: 88upx;
	white-space: nowrap;
	padding: 0 24upx;
}
.wuc-tab-item {
	box-sizing: border-box;
	height: 88upx;
	display: inline-block;
	font-size:28upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	color:rgba(102,102,102,1);
	line-height: 88upx;
	margin-left: 64upx;
}
.wuc-tab-item:first-child{
	margin-left:0upx ;
}
// .wuc-tab-item.cur {
// 	border-bottom: 4upx solid;
// }

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
  color: #F8B500
}
</style>
