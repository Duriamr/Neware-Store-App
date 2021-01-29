<template>
	<view class="warp">
		<view>
			<image class="head" src="/static/activity/discount/sharimg.png" mode="widthFix"></image>
			<view class="helpdetails" v-if="helpdetails">
			
				<!--商品信息  -->
				<view class="bor" style="border-radius: 16upx;">
					<view class="userInfo">
						<image class="userImage" :src="helpdetails.needHelpUserImage"></image>
						<view class="detaile">
							<view>我在新威研选发现了一件好物,</view>
							<view>帮我助力{{helpdetails.campaigProduct.discountPrice}}元拿吧！</view>
						</view>
					</view>
					<view class="helpProduct" v-if="helpdetails&&helpdetails.campaigProduct" @tap.stop='goTogoods'>
						<image :src="helpdetails.campaigProduct.mainImgUrl" class="left" />
						<view class="right">
							<view class="productDetale">
								<view class="productName">{{helpdetails.campaigProduct.productName}}</view>
								<text class="helpNumber">{{helpdetails.campaigProduct.helpNumber}}人助力</text>
							</view>
							<view class="money">
								<text class="discountPrice">￥{{helpdetails.campaigProduct.discountPrice.toFixed(2)}}</text>
								<text class="price">￥原价{{helpdetails.campaigProduct.price.toFixed(2)}}</text>
							</view>
							<image class="tipImg" :src="successImg" v-if='helpdetails.status == 7 ||helpdetails.status == 6|| helpdetails.status == 8 ||helpdetails.status == 2'/>
							<image  class="tipImg" :src="errImg" v-if='helpdetails.status == 3'/> 
						</view>
					</view>
					<!--发起助力  -->
					<view class="addHelp">
						<view style="display: flex;justify-content:center ;" v-if="userLength && userLength.length > 0">
							<view class="imageAdd userImg" v-if="helpdetails.helpUserImage.length <= 5">
								<view v-for="(item,index) in helpdetails.helpUserImage" :key='index'>
									<image :src="item.image"  />
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
									<image :style="{zIndex:index+1}"  class="image" src="/static/activity/discount/add.png" v-for="(item,index) in helpArr.slice(0,4)" :key='index' />
								</view>
								<view class="ellipsis">...</view>
								<image src="/static/activity/discount/add.png" />
							</view>
						</view> 
						<!-- 助力成功 -->
						<view>
							<view class="text1 text2" v-if='hashelped == -1 && (helpdetails.status ==2 ||helpdetails.status ==6|| helpdetails.status == 7)'>助力已完成！你的好意我心领了～</view>
							<view class="text1" v-if='flag && (helpdetails.status ==0 || helpdetails.status == 1 )'>
								还差<span class='num'>
								{{userLength &&userLength.length > 0 ?helpdetails.campaigProduct.helpNumber-userLength.length : helpdetails.campaigProduct.helpNumber}}
								</span>位{{helpdetails.rule == 1 ?'新':''}}朋友助力,<span class='timer'>{{h}}:{{m}}:{{s}}</span>后助力失效
							</view>
							
							<view class="text1 text2" v-if='hashelped != -1'>
								<view>感谢您贡献的洪荒之力！</view>
								<view>你也可以{{helpdetails.campaigProduct.discountPrice.toFixed(2) }}元领，快去发起助力吧</view>
							</view>
							<view class="text1 text3" v-if="hepStatus == 1">
								<view>助力失败了~</view>
								<view>（该商品仅限新朋友帮忙助力）</view>
							</view> 
							<view class="text1 text3"  v-if="hepStatus ==2">
								<view>助力失败了~</view>
								<view>（您的助力值已达上限）</view>
							</view> 
							<view class="text1 text3" v-if='helpdetails.status ==3' >助力已失效～</view>
						</view> 
						 <view v-if='flag &&  hashelped == -1 && helpdetails.status !=6 && helpdetails.status != 7 && helpdetails.status != 2&& helpdetails.status != 8 &&isShowBtn'>
							 <view :class="helpImg?'text':'text scal'" @tap.stop='handleHelp'>
							 		帮TA助力
							 </view>
							 <view class="help" @tap='downApp'>
							 		我也要发起助力
							 </view>
						 </view>
						<!--  倒计时结束 -->
						<view :class="helpImg?'text':'text scal'" v-else @tap='downApp'>
								我也要发起助力
						</view>
					</view> 
				</view>
				<!--规则  -->
				<view class="ruleMode">
					<image src="/static/activity/discount/0.png"/>
					<text class="rule" @tap.stop='handleRule'>规则</text>
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
		 
		<!-- 老用户弹窗和助力上线 -->
		<view class="mask" v-if="oldMask" @touchmove.stop.prevent  @tap="oldMask=false;helpImg='';isShowBtn=''">
			<view  class="oldUser" :style="{backgroundImage: 'url(' +helpImg+ ')',backgroundSize:'cover'}">
				<image class="cancle" src="/static/activity/discount/cancel.png" @tap.stop="oldMask=false;helpImg='';isShowBtn=''"></image>
				<view class="mehelp" @tap='downApp'>我也要发起助力</view>
			</view>
		</view>
		<!-- 助力成功 -->
		<view class="mask" v-if="successMak" @touchmove.stop.prevent  @tap="successMak=false;helpImg='';isShowBtn=''">
			<view  class="successUser" :style="{backgroundImage: 'url(' +helpImg+ ')',backgroundSize:'cover'}">
				<image class="cancle" src="/static/activity/discount/cancel.png" @tap.stop="successMak=false;helpImg='';isShowBtn=''"></image>
				<view class="successText">
					<view >感谢您贡献的洪荒之力！</view>
					<view  v-if='helpdetails.campaigProduct'>
						你也可以{{helpdetails.campaigProduct.discountPrice.toFixed(2) }}元领，快去发起助力吧~</view>
				</view>
				<view class="mehelp" @tap='downApp'>我也要发起助力</view>
			</view>
		</view>
		<!-- 活动结束 -->
		<view class="mask" v-if="overMask" @touchmove.stop.prevent>
			<view  class="oldUser" :style="{backgroundImage: 'url(' +overImg+ ')',backgroundSize:'cover'}">
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
				userLength:'',
				isShow:false,
				bombShare:'',
				helpdetails:'',
				helpArr:[],
				helpId:'',
				productId:'',
				campaignId:'',
				userId:uni.getStorageSync('onlyID')+''||"0",
				fromId:'',
				token:'',
				flag:true,
				h:'00',
				m:'00',
				s:'00',
				timer:null,
				oldMask:false,  // 老用户弹窗
				successMak:false, //助力成功弹窗
				overMask:false, // 活动结束
				helpImg:'',
				overImg:'https://file.neware.com.cn/activity/hdjszl.png',
				hepStatus:'',  //  0:助力成功，1：仅限新朋友助力，2：助力已达上限，3：活动结束
				hashelped:-1, //   -1 没有主力过
				iShowMe:false,   // true 式自己
				successImg:'/static/activity/discount/success.png',
				errImg:'/static/activity/discount/err.png',
				addImg:'/static/activity/discount/add.png',
				isShowBtn:1,  // 点击帮他助力隐藏按钮
			}
		},
		
		onLoad(option) {
			this.productId = option.p
			this.campaignId = option.c
			this.helpId =  option.h
			this.fromId = option.f
			// this.gethelpDetaile()
		},
		onShow(){
			this.token = uni.getStorageSync('token')
			this.userId = uni.getStorageSync('onlyID')||0
			if(this.productId&&this.campaignId&&this.helpId){
				this.gethelpDetaile()
			}
		},
		//下拉刷新
		async onPullDownRefresh() {
			await this.gethelpDetaile()
			this.$refs['helpData'].getHelpData()
		},
		onHide() {
			clearInterval(this.timer)
		},
		watch:{
			hepStatus(val){
				if(val){
					this.helpdetails.status = 100   // 排除
					this.isShowBtn = ''
				}
			}
		},
		methods:{
			gethelpDetaile(){
				this.helpdetails=''
				this.flag = true
				uni.request({
					url:this.$url+`/api/campaignnew/gethelpdetail1?productId=${this.productId}&campaignId=${this.campaignId}&userId=${this.userId}&helpId=${this.helpId}`,
					method:'get',
					header:{
						'Content-Type':'application/json'
					},
					// data:{
					// 	productId:this.productId,
					// 	campaignId:this.campaignId,
					// 	userId:this.userId,
					// 	helpId:this.helpId 
					// },
					success: (res) => {
						//停止下拉样式 
						uni.stopPullDownRefresh()
						if(res.data.code == 200 && res.data.success){
							if(res.data.data.status == 5){  // 活动结束
								this.overMask = true
								clearInterval(this.timer)
							}else{
								this.helpdetails = res.data.data
								this.userLength = JSON.parse(JSON.stringify(this.helpdetails.helpUserImage))
								if( res.data.data.campaigProduct &&  res.data.data.campaigProduct.helpNumber){
									this.helpArr.length = res.data.data.campaigProduct.helpNumber
								}
								this.getUser()
								if(res.data.data.helpUserImage && res.data.data.helpUserImage.length > 0){
									/* 已经助力过 */
									this.hashelped = res.data.data.helpUserImage.findIndex(item =>{
										return item.appUserId == this.userId
									})
								}
								
								// 排除自己
								if(this.userId ==  this.helpdetails.userId){
									uni.navigateTo({
										url:`/pages/activity/discount/helpdetails/helpdetails?userId=${this.userId}&productId=${this.productId}&campaignId=${this.campaignId}`
									})
									clearInterval(this.timer)
								}
								/* 当结束时间大于当前时间 */
								if(res.data.data.expirationTime - new Date().getTime() > 0){
									this.timeDown(res.data.data.expirationTime)
									this.timer = setInterval(()=>{
										if(this.flag){
											this.timeDown(res.data.data.expirationTime)
										}
									},1000)	
								}else{
									this.flag = false
								}
							}
						}
					},
					fail: (res) => {
						this.gethelpDetaile()
					}
				})
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
					if(leftTime == 0){
						this.gethelpDetaile()
					}
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
			
			// 查看规则
			handleRule(){
				uni.request({
					url:this.$url+'/api/campaignnew/getrule?campaignId='+this.helpdetails.campaigProduct.campaignId,
					method:'get',
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							window.location.href = res.data.data
						}
					}
				})
			},
			
			downApp(){
				this.$downNASA()
			},
				
			//跳转商品
			 goTogoods(){
				 uni.navigateTo({
				 	url:'/pages/activity/discount/productDetaile/productDetaile?cid='+this.helpdetails.campaigProduct.campaignId+'&pid='+this.helpdetails.campaigProduct.productId
				 })
			 },
	

			// 帮助助力
			handleHelp(){
				if(!uni.getStorageSync('token')){ 
					uni.navigateTo({
						url:"/pages/my/login/login?fromId="+this.fromId
					})
				}else{
					uni.request({
						url:this.$url+`/api/campaignnew/friendshelp?helpId=${this.helpId}`,
						method:'post',
						header:{
							Authorization:'Bearer '+ this.token
						},
						success: (res) => {
							if(res.data.code == 200 && res.data.success){
								this.isShowBtn = ''
								this.flag = false
								clearInterval(this.timer)
								if(res.data.data == 1 ){
									//  老用户
									this.oldMask = true
								}else if(res.data.data == 2){
									//  助力上线
									this.oldMask = true
								}else if(res.data.data == 3){
									//  活动结束 
									this.overMask = true
								}else{
									//  助力成功
									this.successMak = true
								}
								this.hepStatus = res.data.data
								this.helpImg = res.data.message
								this.gethelpDetaile()
							}else{
								//  接口问题
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: res.data.message
								}); 
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import './helpdetailsh5.scss'
</style>
