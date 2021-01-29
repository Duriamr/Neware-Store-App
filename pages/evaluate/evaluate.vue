<template>
	<view class="eva_content">
		<view class="line"></view>
		<view class="queryType" v-if="false">
			<view 
			:class="selectNuber == index ?'title active':'title'"
		     v-for="(item,index) in queryType"
		    :key='index'
		    @tap.stop='handleTab(index)'
			  >
				<text style="margin-right:10upx;">{{item.key}}</text>
				<text>{{item.value}}</text>
			</view>
		</view>
		<view class="commentWarp" v-if='productCommentInfo && productCommentInfo.length > 0'>
			<view v-for='(item,index) in productCommentInfo' :key='index' class ="commentList">
				<image :src="item.headImage" class="eva_top_img" />
				<view class="eva_main">
					<view class="eva_top">
						<view class="eva_top_right">
							<text class="uesrname">{{item.nickName}}</text>
							<text class="date">{{item.createTime.slice(0,-8)}}</text>
						</view>
					</view>
					<view class="eva_bot">
						<view class="comment">
							<view  v-if="item.content.length > 80">
								<text v-if="!item.showText">
									{{item.content.slice(0,80)}}
								</text>
								<text v-else>
									{{item.content}}
								</text>
								<text style="margin: 0 0 0 10upx;"  v-if="!item.showText">...</text>
								<text class="open" @click="item.showText = !item.showText" style="margin-left: 10upx;"> {{item.showText?'收起':'展开'}}</text>
							</view>
							<text v-else>
								{{item.content}}
							</text>
						</view>
						<view class="comment_img">
							<view class="comment_item" v-for="(items,indexs) in item.image">
								<image @click="$previewImg(indexs,item.image)" mode="aspectFill"  class="comment_item_img" :src="items"/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="center" v-else>
			<image src="/static/goods/evaluate.png"></image>
			<view>
				该商品还没有评价
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				falg:false,
				showText:false,
				selectNuber:0,
				queryType:[],
				productCommentQuery:{
					  queryType: 0,
					  productId: '',
					  pageIndex: 1,
					  pageSize:10,
				},
				token:uni.getStorageSync('token'),
				productCommentInfo:[],   // 商品评论信息
			};
		},
		onLoad(option) {
			this.productCommentQuery.productId = option.goodsId
			this.getAllComment()
			this.getCommentType()
		},
		onHide() {
			this.falg = false
		},
		 //下拉刷新
		onPullDownRefresh() {
			this.productCommentQuery.pageIndex = 1
			this.productCommentInfo = []
			this.getAllComment()
		},
		onReachBottom(){
			this.falg = true
			uni.showLoading({
			    title: '加载更多'
			});
			this.productCommentQuery.pageIndex++
			this.getAllComment()
		},
		methods:{
			//  获取评论类型
			getCommentType(){
				uni.request({
					url:this.$url+'/api/productcomment/commenttype?productId='+this.productCommentQuery.productId,
					method:'GET',
					header:{
						Authorization:'Bearer '+this.token
					},
					success:(res)=> {
						if(res.data.code == 200 && res.data.success){
							this.queryType = res.data.data
						}
					},
					fail: (err) => {
						this.$requestFail()
					}
				})
			},
			//  切换查看评论条件
			handleTab(index){
				this.productCommentInfo = []
				this.productCommentQuery.queryType = index
				this.productCommentQuery.pageIndex = 1
				this.selectNuber = index
				this.getAllComment()
			},
			
			//  获取所有评论
			getAllComment(){
				uni.request({
					url:this.$url+'/api/productcomment/allcomment',
					data:this.productCommentQuery,
					method:'POST',
					header:{
						Authorization:'Bearer '+this.token
					},
					success:(res)=> {
						if(res.data.code == 200 && res.data.success){
							if(res.data.data.items && res.data.data.items.length >0 ){
								res.data.data.items.forEach(item =>{
									item.showText = false
								})
								this.productCommentInfo = this.productCommentInfo .concat(res.data.data.items)
								uni.hideLoading()
								 //停止下拉样式
								uni.stopPullDownRefresh()
								//隐藏标题读取
								 uni.hideNavigationBarLoading()
							}else{
								if(this.falg){
									uni.showToast({icon: 'none',title: "已经加载全部",})
								}
							}
						}
					},
					fail: (err) => {
						this.$requestFail()
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import './evaluate.scss'
</style>
