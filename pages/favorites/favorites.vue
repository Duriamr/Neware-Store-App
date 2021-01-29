<template>
	<view class="favorites_content">
		<view class="favorites_header">
			<view class="status"></view>
			<view class='header'>
				<image class="back" src="/static/public/back/back_black.png" @tap.stop="$back" />
				<view class="header_list" :class="headerIndex == 0 ? 'active' : ''" @tap.stop="tabHeader(0)">
					<text>商品收藏</text>
				</view>
				<view class="header_list" :class="headerIndex == 1 ? 'active' : ''" @tap.stop="tabHeader(1)">
					<text>文章收藏</text>
				</view>
				<view class="header_list" :class="headerIndex == 2 ? 'active' : ''" @tap.stop="tabHeader(2)">
					<text>动态收藏</text>
				</view>
			</view>
			<view class="label_bar" v-if="headerIndex == 1">
				<view class="label_list" :class="labelIndex == 0 ? 'active' : ''" @tap.stop="tabLabel(0)">
					<text>全部</text>
				</view>
				<view class="label_list" :class="labelIndex == 1 ? 'active' : ''" @tap.stop="tabLabel(1)">
					<text>设备解说</text>
				</view>
				<view class="label_list" :class="labelIndex == 2 ? 'active' : ''" @tap.stop="tabLabel(2)">
					<text>学术博览</text>
				</view>
			</view>
		</view>
		<view class="header_placeholder" v-if="headerIndex != 1"></view>
		<view class="header_placeholder" v-if="headerIndex == 1" style="height: 196rpx;"></view>
		
		<view class="ul" v-if="!headerIndex">
			<empty marginTop="272upx" src="/static/expect/no_Article.png" text="您还没有收藏商品" v-if="!goodsArr.length" />
			<view class="slide" v-for="(item, index) in goodsArr" :key="'goodsArr'+index" >
				<view class="main" :class="[theGoodsIndex==index?'open':oldGoodsIndex==index?'close':'']" @touchstart="touchStart(0,index,$event)" @touchmove="touchMove(0,index,$event)" @touchend="touchEnd(0,index,$event)">
					<nw-goods-search :item="item" v-if="item.isInvalid" />
					<view class="goods_list_invalid" v-if="!item.isInvalid">
						<image :src="item.imgUrl" />
						<view class="right">
							<view class="top">
								<text class="title">{{item.productName}}</text>
							</view>
							
							<view class="bot">
								<text>失效</text>
							</view>
						</view>
					</view>
				</view>
				<view class="delete" @tap.stop="cancelFavor(item.id,index)">
					<text>取消收藏</text>
				</view>
			</view>
		</view>
		<view class="ul" v-if="headerIndex==1">
			<empty marginTop="272upx" src="/static/expect/no_Article.png" :text="labelIndex==1?'您还没有收藏设备解说':labelIndex==2?'您还没有收藏学术博览':'您还没有收藏文章'" v-if="!articleArr.length" />
			<view class="slide" v-for="(item, index) in articleArr" :key="'articleArr'+index" >
				<view class="main" :class="[theArticleIndex==index?'open':oldArticleIndex==index?'close':'']" @touchstart="touchStart(1,index,$event)" @touchmove="touchMove(1,index,$event)" @touchend="touchEnd(1,index,$event)">
					<nw-article-item :item="item" v-if="item.isInvalid" />
					<view class="video_content_invalid" v-if="!item.isInvalid">
						<view class="video_list" v-if="item.url != ''">
							<view class="left">
								<view class="title">
									{{item.title}}
								</view>
								<view class="bot">
									<text>失效</text>
								</view>
							</view>
							<view class="right" :style="{backgroundImage: 'url('+ item.url +')'}">
								<view class="mask"></view>
							</view>
							<view class="float" v-if="item.label != ''">
								{{item.label}}
							</view>
						</view>
						
						<view class="video_list_noImg" v-if="item.url == ''" @tap.stop="toArticle(item.id)">
							<view class="title">
								{{item.title}}
							</view>
							<view class="bot">
								<text>失效</text>
							</view>
						</view>
					</view>
				</view>
				<view class="delete" @tap.stop="cancelFavor(item.id,index)">
					<text>取消收藏</text>
				</view>
			</view>
			
		</view>
		<view class="ul" v-if="headerIndex==2">
			<empty marginTop="272upx" src="/static/expect/no_Article.png" text="您还没有收藏动态" v-if="!circleArr.length" />
			<block v-for="(item,index) in circleArr" :key="'circleArr'+index">
				<circle-item 
				type="recommend" v-if="item.isInvalid" 
				:item="item"
				:oid="oid" 
				:token="token" 
				borderBottom="16upx solid #F5F5F5" 
				@addFollow="addFollow(item.authorId)"
				@cancelFollow="cancelFollow(item.authorId)" 
				@deleteArticle="deleteArticle(item.id,index)" 
				@cancelFavor="cancelFavor(item.id,index)" 
				@addPoint="addPoint(item.id,index)" 
				@cancelPoint="cancelPoint(item.id,index)" 
				@showExtend="showExtend(index)" 
				@hideExtend="hideExtend()" 
				@showComment="toCircle(item.id,item.customerType)" 
				@showShare="toCircle(item.id,item.customerType)"
				@addVote="addVote" />
				
				<view class="circle_list_invalid" v-if="!item.isInvalid">
					<view class="left">
						<image src="/static/public/focus.png" />
						<text>抱歉，此状态已被作者删除。</text>
					</view>
					<view class="right" @tap.stop="cancelFavor(item.id,index)">
						<text>删除</text>
					</view>
				</view>
			</block>	
			
		</view>
	</view>
</template>

<script>
	import nwGoodsSearch from '@/components/nw-goods/nw-goods-search';
	import nwArticleItem from '@/components/nw-article/nw-article-item';
	import circleItem from '@/components/nw-circle-item/nw-circle-item';
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {
			nwGoodsSearch,
			nwArticleItem,
			circleItem,
			empty
		},
		data() {
			return {
				headerIndex:0,
				labelIndex:0,
				
				token:uni.getStorageSync('token'),
				oid:uni.getStorageSync('onlyID'),
				
				goodsArr:[],
				articleArr:[],
				circleArr:[],
				
				//控制滑动效果
				theGoodsIndex:null,
				oldGoodsIndex:null,
				theArticleIndex:null,
				oldArticleIndex:null,
				isStop:false,
			};
		},
		onLoad() {
			if(this.oid == ''){
				this.oid = 0
			}
			this.getFavor()
		},
		methods:{
			tabHeader(index){
				this.headerIndex = index
				this.getFavor()
			},
			tabLabel(index){
				this.labelIndex = index
				this.getFavor()
			},
			getFavor(){
				this.oldGoodsIndex = this.theGoodsIndex = null;
				this.oldArticleIndex = this.theArticleIndex = null;
				uni.showLoading()
				uni.request({
				    url: this.$url+'/api/collection/usercollection', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"collType": this.headerIndex,
						"articleType": this.labelIndex,
						"pageIndex": 1,
						"pageSize": 999,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							if(!this.headerIndex){
								if(res.data.data.coolectionProducts==null){
									this.goodsArr = []
									return false
								}
								this.goodsArr = res.data.data.coolectionProducts
								console.log(this.goodsArr)
							}else if(this.headerIndex==1){
								if(res.data.data.coolectionArticels==null){
									this.articleArr = []
									return false
								}
								this.articleArr = res.data.data.coolectionArticels
							}else if(this.headerIndex==2){
								if(res.data.data.coolectionCommunityArticles==null){
									this.circleArr = []
									return false
								}
								for(let i=0; i<res.data.data.coolectionCommunityArticles.length; i++){
									res.data.data.coolectionCommunityArticles[i].extend = false
								}
								this.circleArr = res.data.data.coolectionCommunityArticles
							}
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			showExtend(index){
				this.circleArr[index].extend = !this.circleArr[index].extend
				for(let i=0; i<this.circleArr.length; i++){
					if(i != index){
						this.circleArr[i].extend = false
					}
				}
			},
			hideExtend(){
				for(let i=0; i<this.circleArr.length; i++){
					this.circleArr[i].extend = false
				}
			},
			addFollow(authorId){
				this.hideExtend()
				uni.request({
				    url: this.$url+'/api/scientificresearch/addfollow?followId='+authorId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.getFavor()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			cancelFollow(authorId){
				this.hideExtend()
				uni.showModal({
					title: '提示',
					content: '是否取消关注？',
					confirmColor: '#F8B500',
					success: (res)=>{
						if(res.confirm) {
							uni.request({
							    url: this.$url+'/api/scientificresearch/cancelfollow?followId='+authorId, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									if(res.data.success&&res.data.code == 200){
										this.getFavor()
									}else{
										uni.showToast({
											icon: 'none',
											position: 'bottom',
											title: res.data.message
										});
									}
							    },
								fail: (err) => {
									this.$requestFail()
								}
							});
						}
					}
				});
			},
			deleteArticle(articleId,index){
				this.hideExtend()
				uni.showModal({
					title: '警告',
					content: '是否删除此条？',
					confirmColor: '#F8B500',
					success: (res)=>{
						if(res.confirm) {
							uni.showLoading({title: '正在删除'});
							uni.request({
							    url: this.$url+'/api/scientificresearch/deletearticle?articleId='+articleId, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										this.circleArr.splice(index,1);
									}else{
										uni.showToast({
											icon: 'none',
											position: 'bottom',
											title: res.data.message
										});
									}
							    },
								fail: (err) => {
									uni.hideLoading()
									this.$requestFail()
								}
							});
						}
					}
				});
			},
			addPoint(articleId,index){
				this.hideExtend()
				this.circleArr[index].pointNumber++
				this.circleArr[index].isPoint = true
				uni.request({
				    url: this.$url+'/api/article/add-point?id='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			cancelPoint(articleId,index){
				this.hideExtend()
				this.circleArr[index].pointNumber--
				this.circleArr[index].isPoint = false
				uni.request({
				    url: this.$url+'/api/article/cancel-point?id='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			addVote(articleId,articleVoteId,optionId){
				uni.showLoading()
				uni.request({
				    url: this.$url+'/api/scientificresearch/articlevote', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"articleVoteId": articleVoteId,
						"optionId": optionId
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.request({
							    url: this.$url+'/api/scientificresearch/votearticle', 
								header:{
									Authorization:'Bearer '+this.token
								},
								data:{
									"articleId": articleId
								},
								method: "POST",
							    
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										for(let i=0; i<this.circleArr.length; i++){
											if(this.circleArr[i].id==articleId){
												this.circleArr[i].articleVoteDto = res.data.data
												break
											}
										}
									}
							    },
								fail: (err) => {
									uni.hideLoading()
								}
							});
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			toCircle(articleId,type){
				this.hideExtend()
				if(type){
					uni.navigateTo({
						url:"/pages/studyEnjoy/circle/circle?id="+articleId
					})
				}else{
					uni.navigateTo({
						url:"/pages/studyEnjoy/article/article?id="+articleId
					})
				}
			},
			//控制左滑删除效果-begin
			touchStart(type,index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				if(!type){
					this.oldGoodsIndex = this.theGoodsIndex;
					this.theGoodsIndex = null;
				}else{
					this.oldArticleIndex = this.theArticleIndex;
					this.theArticleIndex = null;
				}
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(type,index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				if(!type){
					if(moveX<0){
						this.theGoodsIndex = index;
						this.isStop = true;
					}else if(moveX>0){
						if(this.theGoodsIndex!=null&&this.oldGoodsIndex==this.theGoodsIndex){
							this.oldGoodsIndex = index;
							this.theGoodsIndex = null;
							this.isStop = true;
							setTimeout(()=>{
								this.oldGoodsIndex = null;
							},150)
						}
					}
				}else{
					if(moveX<0){
						this.theArticleIndex = index;
						this.isStop = true;
					}else if(moveX>0){
						if(this.theArticleIndex!=null&&this.oldArticleIndex==this.theArticleIndex){
							this.oldArticleIndex = index;
							this.theArticleIndex = null;
							this.isStop = true;
							setTimeout(()=>{
								this.oldArticleIndex = null;
							},150)
						}
					}
				}
				
			},
			touchEnd(type,index,$event){
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end
			cancelFavor(id,index){
				if(!this.headerIndex){
					this.oldGoodsIndex = this.theGoodsIndex = null;
					this.goodsArr.splice(index,1)
					uni.request({
					    url: this.$url+'/api/collection/productdelete?productId='+id, 
						header:{
							Authorization:'Bearer '+this.token
						},
						method: "POST",
					    
						fail: (err) => {
							this.$requestFail()
						}
					});
				}else{
					if(this.headerIndex==1){
						this.oldArticleIndex = this.theArticleIndex = null;
						this.articleArr.splice(index,1)
					}else if(this.headerIndex==2){
						this.hideExtend()
						this.circleArr.splice(index,1)
					}
					uni.request({
					    url: this.$url+'/api/collection/articledelete?articleId='+id, 
						header:{
							Authorization:'Bearer '+this.token
						},
						method: "POST",
					    
						fail: (err) => {
							this.$requestFail()
						}
					});
				}
			},
			toCirclePage(authorId){
				this.hideExtend()
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/circlePage/circlePage?authorId="+authorId
				})
			},
			toTopic(publishingTypeId){
				this.hideExtend()
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/topic/topic?publishingTypeId="+publishingTypeId
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./favorites.scss";
	.goods_list_invalid{
		width: 750upx;
		box-sizing: border-box;
		padding: 0upx 24upx;
		background:#FFFFFF;
		display: flex;
		align-items: center;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		image{
			width: 248upx;
			height: 248upx;
			border-radius: 8upx;
			margin-right: 24upx;
		}
		.right{
			width: calc(100% - 272upx);
			height: 282upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 32upx 0;
			border-bottom: 1upx solid #F5F5F5;
			.top{
				display: flex;
				flex-direction: column;
				.title{
					width: 100%;
					font-size:28upx;
					color: #B3B3B3;
					line-height:34upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
			.bot{
				width: 96rpx;
				height: 48rpx;
				background: #E5E5E5;
				border-radius: 28rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 24rpx;
			}
		}
	}
	.video_content_invalid{
		width: 750upx;
		background: #FFFFFF;
		.video_list{
			width: calc(100% - 64rpx);
			box-sizing: border-box;
			padding: 32rpx 0;
			margin: 0 32rpx;
			border-bottom: 1rpx solid #F5F5F5;
			display: flex;
			justify-content: space-between;
			position: relative;
			font-size:32rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:#B3B3B3;
			line-height:38rpx;
			.left{
				width: 446rpx;
				height:160rpx;
				box-sizing: border-box;
				padding: 8rpx 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
					width: 100%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
			.right{
				width:216rpx;
				height:160rpx;
				border-radius:16rpx;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				.mask{
					width:100%;
					height:100%;
					border-radius:16rpx;
					background:rgba(0,0,0,0.05);
				}
			}
			
		}
		.video_list_noImg{
			width: 100%;
			box-sizing: border-box;
			padding: 32rpx;
			border-bottom: 1rpx solid #F5F5F5;
			display: flex;
			flex-direction: column;
			font-size:32rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:#B3B3B3;
			line-height:38rpx;
			.title{
				width: 100%;
				margin-bottom: 44rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
		.float{
			font-size:24rpx;
			color:rgba(51,51,51,1);
			line-height:24rpx;
			background-color: #FFFFFF;
			border-radius:4rpx;
			padding: 6rpx 8rpx;
			position: absolute;
			top: 48rpx;
			right: 16rpx;
			z-index: 9;
		}
		.bot{
			width: 96rpx;
			height: 48rpx;
			background: #E5E5E5;
			border-radius: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 24rpx;
		}
	}
	.circle_list_invalid{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 750rpx;
		height: 92rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 0 32rpx;
		margin-bottom: 16rpx;
		.left{
			display: flex;
			align-items: center;
			image{
				width: 28rpx;
				height: 28rpx;
				margin-right: 8rpx;
			}
			text{
				font-size: 28rpx;
				color: #666666;
				line-height: 28rpx;
			}
		}
		.right{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 96rpx;
			height: 48rpx;
			border-radius: 30rpx;
			border: 1rpx solid #E5E5E5;
			font-size: 24rpx;
			color: #B3B3B3;
			line-height: 24rpx;
		}
	}
</style>
