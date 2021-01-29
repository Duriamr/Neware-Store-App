<template>
	<view class="my_content">
		<view class="my_header">
			<view class="status"></view>
			<view class="header">
				<image class="icon" src="/static/public/setting.png"  @tap.stop="toSetting"/>
				<image class="icon" src="/static/public/message/message.png" @tap.stop="toNotice" />
			</view>
			<view class="infor_content" v-if="!loginType">
				<image src="/static/my/avatar.png" @tap.stop="$toLogin" />
				<view class="infor"  @tap.stop="$toLogin">
					<text class="infor_name">未登录</text>
				</view>
			</view>
			<view class="infor_content"  v-if="loginType">
				<image :src="imgUrl" @tap.stop="toMyPage('/pages/studyEnjoy/circle/circlePage/circlePage?authorId='+oid)" />
				<view class="infor" @tap.stop="toMyPage('/pages/studyEnjoy/circle/circlePage/circlePage?authorId='+oid)">
					<text class="infor_name">{{nickname}}</text>
					<text class="infor_id">ID：{{id}}</text>
				</view>
			</view>
		</view>
		
		<view class="kingkong">
			<view class="module_title">
				<view>
					我的订单
				</view>
				<view class="right" @tap="toMyPage('/pages/order/myOrder/myOrder?idx=0')">
					<view>
						全部订单
					</view>
					<image src="/static/my/go.png" />
				</view>
			</view>
			<view class="kingkong_ul">
				<view class="kingkong_list" @tap="toMyPage('/pages/order/myOrder/myOrder?idx=1')">
					<image class="kingkong_icon" src="/static/my/kingkong/check.png"/>
					<view class="badge" v-if="reviewLength > 0">
						{{reviewLength}}
					</view>
					<text>已提交</text>
				</view>
				
				<view class="kingkong_list" @tap="toMyPage('/pages/order/myOrder/myOrder?idx=2')">
					<view class="badge" v-if="paymentLength > 0">
						{{paymentLength}}
					</view>
					<image class="kingkong_icon" src="/static/my/kingkong/bepaid.png" />
					<text>待付款</text>
				</view>
				
				<view class="kingkong_list" @tap="toMyPage('/pages/order/myOrder/myOrder?idx=3')">
					<image class="kingkong_icon" src="/static/my/kingkong/receipt.png" />
					<view class="badge" v-if="shipLength > 0 ||receiptLength > 0">
						{{shipLength + receiptLength}}
					</view>
					<text>待收货</text>
				</view>
				
				<view class="kingkong_list" @tap="toMyPage('/pages/evaluate/myEvaluate/myEvaluate')">
					<view class="badge" v-if="evaluateLength > 0">
						{{evaluateLength}}
					</view>
					<image class="kingkong_icon" src="/static/my/kingkong/eva.png" />
					<text>待评价</text>
				</view>
			</view>
		</view>
		
		<view class="banner" v-if="bannerArr.length">
			<swiper autoplay="true" :duration="500" :circular="true">
				<swiper-item v-for="(item, index) in bannerArr" :key="index" @tap.stop="toPath(item)">
					<image :src="item.url"/>
				</swiper-item>
			</swiper>
		</view>
		
		
		<view class="main" :style="{top:bannerArr.length?'-84rpx':'-104rpx'}">
			<view class="module_title">
				<view>
					常用功能
				</view>
			</view>
			<view class="main_ul">
				<view class="main_list"  v-for="(item, index) in mainList" :key="index" @tap="toMyPage(item.url)">
					<image :src="item.imgUrl" />
					<text>{{item.name}}</text>
				</view>
				<view class="main_list" @tap="toService">
					<image src="/static/my/main/service.png" />
					<text>在线客服</text>
				</view>
				<view class="main_list" @tap="toMyPage('/pages/ERP/myERP/myERP')">
					<image src="/static/my/main/ERP.png" />
					<text>订单进度</text>
				</view>
				<!-- #ifdef APP-PLUS -->    
				<view class="main_list" @tap="showShare">
					<image src="/static/my/main/share.png" />
					<text>分享APP</text>
				</view>
				<!-- #endif --> 
			</view>
		</view>
		
		<view class="share" :class="shareShow" @touchmove.stop.prevent @tap.stop="hideShare">
			<view class="layer" @tap.stop>
				<view class="share_content">
					<view class="title">
						分享
					</view>
					<view class="shareUl">
						<view class="shareList" @tap.stop="$shareWX(shareObj)">
							<image src="/static/public/share/wx.png" />
							<view class="shareName">
								微信好友
							</view>
						</view>
						<view class="shareList" @tap.stop="$sharePYQ(shareObj)">
							<image src="/static/public/share/pyq.png" />
							<view class="shareName">
								朋友圈
							</view>
						</view>
						<!-- <view class="shareList" @tap.stop="$shareQQ(shareObj)">
							<image src="/static/public/share/qq.png" />
							<view class="shareName">
								QQ
							</view>
						</view> -->
						<view class="shareList" @tap.stop="$shareCopy(shareObj)">
							<image src="/static/public/share/copy.png" />
							<view class="shareName">
								复制链接
							</view>
						</view>
						<view class="shareList" @tap.stop="showShareImg()">
							<image src="/static/public/share/img.png" />
							<view class="shareName">
								生成图片
							</view>
						</view>
					</view>
				</view>
				<view class="share_btn" @tap.stop="hideShare">
					取消
				</view>
			</view>
		</view>
		
		
		<view class="shareImgPopup" v-if="shareImgShow" @tap.stop="hideShareImg">
			<view class="x">
				<image src="/static/x.png" />
			</view>
			
			<view class="shareImg" style="background-image: url(../../../static/my/poster.png);">
				<view class="info">
					<view class="left"></view>
					
					<image class="qr" :src="QRcodeUrl" mode="widthFix"/>
					<image class="logo" src="/static/logo.png"/>
				</view>
			</view>
			<canvas class="canvas" canvas-id="myCanvas"></canvas>
			
			<view class="btn" @tap.stop="createShareImg">
				<image src="/static/my/dow.png" />
				<text>保存图片</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '@/components/image-tools/index.js'
	export default {
		data() {
			return {
				loginType:false,
				token:"",
				imgUrl:"",
				oid:"",
				id: "",
				nickname: "",
				
				cartBadge:"",
				
				paymentLength:0,//1
				reviewLength:0,//2
				shipLength:0,//3
				receiptLength:0,//4
				evaluateLength:0, //评价个数
				mainList:[],
				
				//分享区
				shareShow:'',
				shareObj:{
					title:'新威研选',
					summary: '一个专属科研人的App【科研无忧 采购无虑】全品类实验设备、仪器、耗材，一站式购齐',
					href:'https://shop.neware.com.cn/GoStore',
					imageUrl:'https://file.neware.com.cn/share/share.png',
				},
				
				//海报区
				shareImgShow:false,
				QRcodeUrl:'',
				
				bannerArr:[]
			}
		},
		onLoad() {
			this.getLoadData();
			this.getBanner()
		},
		onShow(){
			this.token = uni.getStorageSync('token');
			this.imgUrl = uni.getStorageSync('myAvatar');
			this.oid = uni.getStorageSync('onlyID');
			this.id = uni.getStorageSync('myID');
			if(this.id != null && this.id != "" && this.id != undefined){
				let QRLink = 'https://shop.neware.com.cn/GoStore/#/pages/invite?id='+this.id
				this.getQR(QRLink)
			}else{
				this.getQR('https://shop.neware.com.cn/GoStore')
			}
			this.nickname = uni.getStorageSync('myNickname');
			this.$getCartBadge();
			this.getKingKongBadge();
			this.getCommentCount()
		},
		watch:{
			token:function(val){
				if(val != null && val != "" && val != undefined){
					this.loginType = true
				}else{
					this.loginType = false
				}
			},
			nickname:function(val){
				if(val == null || val == "" || val == undefined){
					this.nickname = '新威用户'
				}
			},
			shareImgShow:function(val){
				if(val == true){
					uni.hideTabBar();
				}else{
					uni.showTabBar();
				}
			}
		},
		methods: {
			getQR(path){
				uni.request({
					url: this.$url+'/api/app/QRCode',
					data:{
						"url": path,
						"pixel": 10
					},
					method: "POST",
					
					success:(res) =>{
						this.QRcodeUrl = res.data
					}
				})
			},
			getCommentCount(){
				uni.request({
					url: this.$url+'/api/productcomment/commentcount',
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success:(res) =>{
						if(res.data.code == 200 && res.data.success){
							this.evaluateLength = res.data.data
						}else{
							this.evaluateLength = 0
						}
					}
				})
				
			},
			getKingKongBadge(){
				uni.request({
				    url: this.$url+'/api/order/get-status?orderStatusEnum=1', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
						let list = [];
						list = res.data.data;
						this.paymentLength = list.length	
						}else{
							this.paymentLength = 0
						}
				    },
				});
				uni.request({
				    url: this.$url+'/api/order/get-status?orderStatusEnum=2', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
						let list = [];
						list = res.data.data;
						this.reviewLength = list.length	
						}else{
							this.reviewLength = 0
						}
				    },
				});
				uni.request({
				    url: this.$url+'/api/order/get-status?orderStatusEnum=3', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
						let list = [];
						list = res.data.data;
						this.shipLength = list.length	
						}else{
							this.shipLength = 0
						}
				    }
				});
				uni.request({
				    url: this.$url+'/api/order/get-status?orderStatusEnum=4', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
						let list = [];
						list = res.data.data;
						this.receiptLength = list.length	
						}else{
							this.receiptLength = 0
						}
				    },
				});
			},
			getLoadData(){
				let mainList = [
					{
						imgUrl:'/static/my/main/collection.png',
						name:'我的收藏',
						url:'/pages/favorites/favorites'
					},
					{
						imgUrl:'/static/my/main/address.png',
						name:'地址管理',
						url:'/pages/order/address/address'
					},
					{
						imgUrl:'/static/my/main/paper.png',
						name:'我的论文',
						url:'/pages/activity/paper/paperList/paperList'
					},
					{
						imgUrl:'/static/my/main/signin.png',
						name:'每日签到',
						url:'/pages/activity/signin/signin'
					},
					// {
					// 	imgUrl:'/static/my/main/answer.png',
					// 	name:'答题抽奖',
					// 	url:''
					// },
					// {
					// 	imgUrl:'/static/my/main/task.png',
					// 	name:'任务中心',
					// 	url:''
					// },
					// {
					// 	imgUrl:'/static/my/main/ERP.png',
					// 	name:'订单进度',
					// 	url:'/pages/ERP/myERP/myERP'
					// },
				];
				this.mainList = mainList;
			},
			toSetting(){
				uni.navigateTo({
					url:'/pages/my/setting/setting'
				})
			},
			toNotice(){
				uni.navigateTo({
					url:"/pages/notice/notice"
				})
			},
			toMyPage(page){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading();
						if(res.data.success&&res.data.code == 200){
							uni.navigateTo({
								url:page
							})
						}else if(res.data.code == 401){
							this.loginType = false
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						uni.hideNavigationBarLoading();
						this.$requestFail()
					}
				});
			},
			toService(){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading();
						if(res.data.success&&res.data.code == 200){
							uni.navigateTo({
								url:'/pages/browser/serviceBrowser?page=my&nickName='+res.data.data.nickname+'&clientId='+res.data.data.userUniqueId
							})
						}else if(res.data.code == 401){
							this.loginType = false
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						uni.hideNavigationBarLoading();
						this.$requestFail()
					}
				});
			},

			showShare(){
				uni.hideTabBar();
				this.shareShow = 'show';
			},
			hideShare(){
				this.shareShow = 'hide';
				setTimeout(() => {
					this.shareShow = 'none';
					uni.showTabBar();
				}, 200);
			},
			showShareImg(){
				this.shareShow = 'none'
				this.shareImgShow = true
			},
			hideShareImg(){
				this.shareImgShow = false
			},
			createShareImg(){
				uni.showLoading({
					title:'正在保存',
				});
				let canvas = uni.createCanvasContext('myCanvas')
				canvas.drawImage('/static/my/poster.png',0,0,750,1334)
				canvas.drawImage(this.QRcodeUrl,502,1074,192,192)
				canvas.drawImage('/static/logo.png',579,1150,40,40)
				canvas.draw(false,() =>{
					uni.canvasToTempFilePath({
						destWidth:750,
						destHeigh:1334,
						fileType:1,
						fileType:'jpg',
						canvasId: 'myCanvas',
						success: (res) => {
							uni.saveImageToPhotosAlbum({
								filePath:res.tempFilePath,
								success: () => {
									uni.hideLoading()
									uni.showToast({
										title: "保存成功",
									})
									setTimeout(() => {
										this.shareImgShow = false
									},1000)
								}
							})
					  } 
					})
				})
			},
			
			getBanner(){
				uni.request({
				    url: this.$url+'/api/appuser/banner', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.bannerArr = res.data.data
						}
				    },
				});
			},
			toPath(item){
				uni.navigateTo({
					url:item.linkUrl
				})
				uni.request({
					url:this.$url+'/api/home/banner-hits?id='+item.id,
					method:'post'
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./my.scss"
</style>
