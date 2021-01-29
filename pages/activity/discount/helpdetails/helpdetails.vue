<template>
	<view>
		<view class="helpdetails" v-if="helpdetails">
			<!-- 公告 -->
			<view class="notice" v-if="noticeList && noticeList.length > 0">
				<image src="/static/activity/discount/lapa.png">
				<swiper class="banner" :autoplay="true" :duration="1000" :interval='2000' :circular="true" :vertical="true">
					<swiper-item class="banner_list" v-for="(item, index) in noticeList" :key="index" @touchmove.stop>
						<text>{{item}}</text>
					</swiper-item>
				</swiper>
			</view>
			<!--商品信息  -->
			<view class="helpProduct" v-if="helpdetails&&helpdetails.campaigProduct" @tap.stop='goTogoods'>
				<image :src="helpdetails.campaigProduct.mainImgUrl" class="left" />
				<view class="right">
					<view class="productDetale">
						<view class="productName">{{helpdetails.campaigProduct.productName}}</view>
						<text class="helpNumber">{{helpdetails.campaigProduct.helpNumber}}人助力</text>
					</view>
					<view class="money">
						<text class="discountPrice">￥{{helpdetails.campaigProduct.discountPrice}}</text>
						<text class="price">￥原价{{helpdetails.campaigProduct.price}}</text>
					</view>
				</view> 
				<image class="tipImg" :src="successImg" v-if='helpdetails.status == 7 || helpdetails.status == 6||helpdetails.status == 8|| helpdetails.status == 2'/> 
				<image  class="tipImg" :src="errImg" v-if='helpdetails.status == 3'/> 
			</view>
			<!--发起助力  -->
			<view class="addHelp">
				<view style="display: flex;justify-content:center ;" v-if="userLenth && userLenth.length > 0">
					<view class="imageAdd userImg" v-if="helpdetails.helpUserImage.length <= 5">
						<view v-for="(item,index) in helpdetails.helpUserImage" :key='index'>
							<image :src="item.image"  class="image" />
							<view class="iphone">{{item.phone}}</view>
						</view> 
					</view>
					<view class="imageAdd userImg AllImage" v-else>
						<view class="imgList dis">
							<image class="image" :src="item.image" v-for="(item,index) in helpdetails.helpUserImage.slice(0,6)" :key='index'/>
						<text class="ellipsis" @tap="isShow=true">...</text>
						</view>
					</view>
				</view>
				<view style="display: flex;justify-content:center ;" v-else>
					<view class="imageAdd" v-if="helpArr && helpArr.length <= 5">
						<image src="/static/activity/discount/add.png" v-for="(item,index) in helpArr" :key='index' />
					</view>
					<view class="imageAdd AllImage" v-else> 
						<view class="imgList">
							<image :style="{zIndex:index+1}"  class="image" src="/static/activity/discount/add.png" v-for="(item,index) in helpArr.slice(0,4)" :key='index'>
						</view>
						<view class="ellipsis">...</view>
						<image src="/static/activity/discount/add.png"/>
					</view>
				</view>
				<!-- 发起 -->
				 <view class="text" v-if='helpdetails.status == 0'>
					 邀请{{helpArr.length}}位{{helpdetails.rule == 1 ?'新':''}}用户助力，即可{{helpdetails.campaigProduct.discountPrice}}元领取商品
				 </view>
				 <!-- 继续发起 -->
				  <view class="text1" v-if='flag && (helpdetails.status ==0 || helpdetails.status == 1 )'>
					  还差<span class='num'>
					  {{userLenth && userLenth.length >0?helpdetails.campaigProduct.helpNumber - userLenth.length:helpdetails.campaigProduct.helpNumber}}
					  </span>位{{helpdetails.rule == 1 ?'新':''}}朋友助力,<span class='timer'>{{h}}:{{m}}:{{s}}</span>后助力失效
				  </view> 
				  <!-- 助力成功 -->
				   <view class="text1" v-if='flag && helpdetails.status == 2'>
					  助力成功,请在<span class='timer'>{{h}}:{{m}}:{{s}}</span>内下单领取
				   </view>
				   <view class="text1" v-if='flag && helpdetails.status == 8'>
						下单成功,请在<span class='timer'>{{h}}:{{m}}:{{s}}</span>内付款
				   </view>
				   <!-- 查看订单 -->
				    <view class="text"  v-if='helpdetails.status == 7'>恭喜您领取成功，商品将会在15个工作日内发出</view>
					<!-- 商品失效 -->
					<view  class="text" v-if="helpdetails.status == 6 || helpdetails.status == 3">
						<!-- 助力成功 时间超时 -->
						<text v-if="helpdetails.status == 6">好遗憾！超时未领取(╥﹏╥)，商品已失效啦</text>
						<!-- 助力失败 时间超时 -->
						<text v-if="helpdetails.status == 3">好可惜，差一点就成功啦~</text>
					</view>
				 <view class="help"  v-if='userId != helpdetails.userId &&  helpdetails.userId != 0' @tap.stop='$downNASA()'> 
					 我也发起助力
				 </view>
				 <view class="help" @tap.stop='invitehelp' v-else>
				 	{{['发起助力','继续邀请','立即下单','重新发起助力','已抢光','活动结束','重新发起助力','查看订单','去付款'][helpdetails.status]}}
				 </view>
			</view> 
			<!--规则  -->
			<view class="ruleMode">
				<image :src="helpStatusImg1" v-if='helpdetails.status == 0'/>
				<image :src="helpStatusImg2" v-if='helpdetails.status == 1 || helpdetails.status == 3'/>
				<image :src="helpStatusImg3" v-if='helpdetails.status == 2 || helpdetails.status == 6 || helpdetails.status == 8'/>
				<image :src="helpStatusImg4" v-if='helpdetails.status == 7'/>
				<text class="rule" @tap.stop='handleRule'>规则</text>
			</view>
		</view>
		<!-- 更多商品 -->
		
		<!-- 分享 -->
		<view  class="shareApp" :class="shareShow" @touchmove.stop.prevent @tap.stop="$hideShare">
			<view class="layer" @tap.stop>
				<view class="share_content">
					<view class="title">
						分享
					</view>
					<view class="shareUl" style="display: flex;justify-content: space-between;">
						<view class="shareList" @tap.stop="shareWX">
							<image src="/static/public/share/wx.png" />
							<view class="shareName">
								微信好友
							</view>
						</view>
						<view class="shareList" @tap.stop="sharePYQ">
							<image src="/static/public/share/pyq.png" />
							<view class="shareName">
								朋友圈
							</view>
						</view>
						<view class="shareList" @tap.stop="shareCopy">
							<image src="/static/public/share/copy.png" />
							<view class="shareName">
								复制链接
							</view>
						</view>
					</view>
				</view>
				<view class="share_btn" @tap.stop="$hideShare">
					取消
				</view>
			</view>
		</view>
		<!-- 用户信息 -->
		<view class="mask" v-if="isShow" @touchmove.stop.prevent @tap="isShow=false">
			<view class="center">
				<image class="cancle" src="/static/activity/discount/cancel.png" @tap.stop="isShow=false"></image>
				<view class="title">助力好友</view>
				<scroll-view  scroll-y class="userInfo" style="height: 548upx;">
					<view class="bigbox">
						<view class="usrList" v-for="(item,index) in helpdetails.helpUserImage.filter(item => item.appUserId)" :key='index'>
							<image :src="item.image" class="userImage" />
							<view class="iphone">{{item.phone}}</view>
						</view> 
					</view>
				</scroll-view>
			</view>
		</view>
		 <!-- 活动结束 -->
		 <view class="mask" v-if="overMask || campStatus " @touchmove.stop.prevent>
		 	<view  class="oldUser" :style="{backgroundImage: 'url(' +overImg+')',backgroundSize:'100% 100%'}">
		 	<view class="mehelp" @tap='downApp'>发现更多活动</view>
		 	</view>
		 </view>
		<help :productId='productId' :campaignId='campaignId' ref='helpData' />
	</view>
</template>

<script>
	import help from '@/components/nw-help/nw-help';
	export default{
		components:{help},
		data(){
			return{
				userLenth:'',
				helpdetails:'',
				helpArr:[],
				helpStatusImg1:'/static/activity/discount/1.png',
				helpStatusImg2:'/static/activity/discount/2.png',
				helpStatusImg3:'/static/activity/discount/3.png',
				helpStatusImg4:'/static/activity/discount/4.png',
				overImg:'https://file.neware.com.cn/activity/hdjszl.png',
				startImg:'https://file.neware.com.cn/activity/hdjszl1.png',
				successImg:'/static/activity/discount/success.png',
				errImg:'/static/activity/discount/err.png',
				addImg:'/static/activity/discount/add.png',
				overMask:false,
				token:uni.getStorageSync('token'),
				noticeList:[], // 公告列表
				isShow:'', //助力弹窗
				flag:true,
				userId:uni.getStorageSync('onlyID')||0,
				h:'00',
				m:'00',
				s:'00',
				timer:null,
				fromId:uni.getStorageSync('myID'), // 分享的id
				sharConten:'',
				timeId:null,
				campStatus:'',  // 0 进行中  1 开始前  2已结束
				type:'',
				typeTile:'',
				
				shareShow:'',
			}
		},
		
		onLoad(option) {
			this.productId = option.productId
			this.campaignId = option.campaignId
			this.type = option.type
			this.gethelpDetaile()
			this.getsuccessreceive()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.gethelpDetaile()
			this.$refs['helpData'].getHelpData()
		},
		onHide() {
			clearInterval(this.timer)
		},
		onShow() {
			if(this.type == 1 ){ 		// 1 五人助力  2 15人助力
				this.typeTile = '助我8折拿!'
			}else if(this.type == 2 ){ 		// 1 五人助力  2 15人助力
				this.typeTile = '助我79.9元拿!'
			}
			this.gethelpDetaile()
			this.token = uni.getStorageSync('token')
			this.userId = uni.getStorageSync('onlyID')||0
		},
		
		methods:{
			gethelpDetaile(){
				this.helpdetails = ''
				this.flag = true
				uni.request({
					url:this.$url+'/api/campaignnew/gethelpdetail',
					method:'post',
					data:{
						productId:this.productId,
						campaignId:this.campaignId,
						userId:this.userId,
					},
					success: (res) => {
						//停止下拉样式 
						uni.stopPullDownRefresh()
						if(res.data.code == 200 && res.data.success){
							this.campStatus = res.data.data.campStatus
							if(res.data.data.campStatus == 1 ){
								this.overImg = 'https://file.neware.com.cn/activity/hdjszl1.png'
							}else{
								this.overImg = 'https://file.neware.com.cn/activity/hdjszl.png'
							}
							this.helpdetails = res.data.data
							this.helpArr.length = this.helpdetails.campaigProduct.helpNumber
							this.userLenth = JSON.parse(JSON.stringify(this.helpdetails.helpUserImage))
							this.getUser()
							if(
							res.data.data.expirationTime - new Date().getTime() > 0 &&
							(this.helpdetails.status == 0
							||this.helpdetails.status == 1
							||this.helpdetails.status == 2
							||this.helpdetails.status == 8)
							){
								this.timeDown(res.data.data.expirationTime)
								this.timer = setInterval(()=>{
									if(this.flag){
										this.timeDown(res.data.data.expirationTime)
									}
								},1000)	
							}else{
								this.flag = false
								clearInterval(this.timer)
							}
							if(res.data.data.status == 5){
								this.overMask = true
								clearInterval(this.timer)
							}
						}
					}
				})
			},
			downApp(){
				this.$downNASA()
			},
			getUser(){
				let arr = []
				if(this.helpArr.length <= 5){
					if(this.helpdetails.helpUserImage && this.helpdetails.helpUserImage.length < this.helpArr.length  ){
						
						arr.length = this.helpArr.length - this.helpdetails.helpUserImage.length
						for(var i = 0 ;i <arr.length;i++ ){
							this.helpdetails.helpUserImage.push({
								iphone:'',
								image:this.addImg
							})
						}
					}
				}else{
					if(this.helpdetails.helpUserImage.length <= 6){
						arr.length = this.helpArr.length - this.helpdetails.helpUserImage.length
						for(var i = 0 ;i < arr.length ;i++ ){
							this.helpdetails.helpUserImage.push({
								iphone:'',
								image:this.addImg
							})
						}
					}
				}
			},
			
			// 倒计时
			timeDown(entTime) {
				const nowTime = new Date();
				let leftTime = parseInt((entTime - nowTime.getTime()) / 1000);
				let h = this.formate(parseInt(leftTime / (60 * 60)));
				let m = this.formate(parseInt(leftTime / 60 % 60));
				let s = this.formate(parseInt(leftTime % 60));
				if (leftTime <= 0) {
					this.flag = false;
					clearInterval(this.timer)
					this.gethelpDetaile()
				}
				this.h=h
				this.m=m
				this.s=s
			},
			formate(time) {
				if (time >= 10) {
						return time
					} else {
					return `0${time}`
				}
			},
			 // 获取领取成功人数
			 getsuccessreceive(){
				uni.request({
					url:this.$url+'/api/campaignnew/getsuccessreceive',
					method:'get',
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.noticeList = res.data.data
						}
					}
				}) 
			 },
			// 发起
			getlaunchhelp(){
				uni.request({
					url:this.$url+"/api/campaignnew/launchhelp",
					method:'post',
					data:{
					  campaignId:this.helpdetails.campaigProduct.campaignId,
					  productId: this.helpdetails.campaigProduct.productId,
					},
					header:{
						Authorization:'Bearer '+this.token
					},
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.gethelpDetaile()
						}else{
							uni.showToast({
							    icon: 'none',
							    position: 'bottom',
							    title: res.data.message
							});
						}
					}
				})
			},
			
			// 邀请助力
			invitehelp(){
				// #ifdef H5
					this.$downNASA()
					return false
				// #endif  
				if(!uni.getStorageSync('token')){
					this.$to401()
				}else{
					if(this.helpdetails.status == 0 || this.helpdetails.status == 1 ||this.helpdetails.status == 3 || this.helpdetails.status == 6){
						this.getSharConten()
						if(this.helpdetails.status == 0 || this.helpdetails.status == 3 || this.helpdetails.status == 6){
							this.getlaunchhelp()
						}
					}else if(this.helpdetails.status == 2){
						uni.navigateTo({
							url:'/pages/activity/discount/order/order?helpId='+this.helpdetails.helpId+'&data='+JSON.stringify(this.helpdetails.campaigProduct)
						})
					}else if(this.helpdetails.status == 7 || this.helpdetails.status == 8){
						/* 查看订单 */
						uni.navigateTo({
							url:'/pages/order/orderDetails/orderDetails?orderId='+this.helpdetails.orderId
						})
					}
				}
			},
			
			//  获取分享内容
			getSharConten(){
				uni.request({
					url:this.$url+'/api/campaignnew/getcampaigshare?id='+this.helpdetails.campaigProduct.productId+'&cId='+this.helpdetails.campaigProduct.campaignId,
					method:'get',
					header:{
						Authorization:'Bearer '+this.token
					},
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.sharConten = res.data.data
							this.shareShow = 'show'
						}else if(res.data.code == 401){
							this.$to401()
						}
					}
				})
			},
			
			// 微信
			shareWX(){
				uni.share({
				    provider: "weixin",
					type: 0,
					scene: "WXSceneSession",
					title:`就差你帮我啦~${this.helpdetails.campaigProduct.productName.replace(/\（[^\）]*\）/g,"")},`+this.typeTile,
				    summary:this.sharConten.shareDescribe,
					href:this.$h5Url+`/pages/activity/discount/helpdetailsh5/helpdetailsh5?p=${this.helpdetails.campaigProduct.productId}&c=${this.helpdetails.campaigProduct.campaignId}&h=${this.helpdetails.helpId}&f=${this.fromId}`,
					imageUrl:this.sharConten.shareImage,
				    success: (res) => {
				        this.$hideShare()
				    },
					fail: (err) => {
						uni.showToast({
						    icon: 'none',
						    position: 'bottom',
						    title: '发生错误请重试'
						});
					}
				});
			},
			
			// 朋友圈 
			sharePYQ(){
				uni.share({
				    provider: "weixin",
					type: 0,
					scene: "WXSenceTimeline",
					title:`就差你帮我啦~${this.helpdetails.campaigProduct.productName.replace(/\（[^\）]*\）/g,"")},`+this.typeTile,
				    summary:this.sharConten.shareDescribe,
					href:this.$h5Url+`/pages/activity/discount/helpdetailsh5/helpdetailsh5?p=${this.helpdetails.campaigProduct.productId}&c=${this.helpdetails.campaigProduct.campaignId}&h=${this.helpdetails.helpId}&f=${this.fromId}`,
					imageUrl:this.sharConten.shareImage,
				    success: (res) => {
				        this.$hideShare()
				    },
				    fail: (err) => {
				    	uni.showToast({
				    	    icon: 'none',
				    	    position: 'bottom',
				    	    title: '发生错误请重试'
				    	});
				    }
				});
			},
			
			// 复制链接
			shareCopy(){
				uni.setClipboardData({
					data:this.sharConten.shareWords.replace('链接', this.$h5Url+`/pages/activity/discount/helpdetailsh5/helpdetailsh5?p=${this.helpdetails.campaigProduct.productId}&c=${this.helpdetails.campaigProduct.campaignId}&h=${this.helpdetails.helpId}&f=${this.fromId}`
					),
					success: (res) => {
						this.$hideShare()
					},
					fail: (err) => {
						uni.showToast({
						    icon: 'none',
						    position: 'bottom',
						    title: '发生错误请重试'
						});
					}
				})
			},
			
			//跳转商品
			goTogoods(){
				 uni.navigateTo({
				 	url:'/pages/activity/discount/productDetaile/productDetaile?cid='+this.helpdetails.campaigProduct.campaignId+'&pid='+this.helpdetails.campaigProduct.productId
				 })
			},
			// 查看规则
			handleRule(){
				uni.request({
					url:this.$url+'/api/campaignnew/getrule?campaignId='+this.helpdetails.campaigProduct.campaignId,
					method:'get',
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							// #ifdef H5
								window.location.href = res.data.data
							// #endif  
							 // #ifdef  APP-PLUS  
								uni.navigateTo({
									url:`/pages/browser/browser?src=`+res.data.data
								})
							 // #endif 
							
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import './helpdetails.scss'
</style>
