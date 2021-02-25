<template>
	<view class="liveDetails_contact">
		<view class="video_box">
			<view class="status"></view>
			<template v-if="detail.status==2">
				<template v-if="!detail.playBackUrl">
					<image class="image" :src="detail.guideImageUrl"></image>
					<view class="img_mask">
						<view class="title">
							<text>直播已结束</text>
						</view>
						<view class="title" style="margin-top: 26rpx;">
							<text>回放及课件将在24小时内上传</text>
						</view>
					</view>
				</template>
				<template v-if="detail.playBackUrl">
					<template v-if="!isLogin">
						<image class="image" :src="detail.guideImageUrl"></image>
						<view class="img_mask" @tap.stop="$to401()">
							<image class="play" src="/static/goods/play.png"></image>
						</view>
					</template>
					<template v-if="isLogin">
						<video class="video" :src="detail.playBackUrl" :poster="detail.guideImageUrl" controls object-fit="cover" @play="playbacknumber()"></video>
					</template>
				</template>
			</template>
			<template v-else>
				<image class="image" :src="detail.guideImageUrl"></image>
				<view class="img_mask">
					<template v-if="detail.status==0">
						<view class="title">
							<text>直播正在进行中</text>
							<image src="/static/studyEnjoy/live/live.png"></image>
						</view>
						<view class="btn" v-if="!isSignup" @tap.stop="showSignup()">
							<text>立即报名</text>
						</view>
						<view class="btn" v-if="isSignup" @tap.stop="toLive()">
							<text>立即观看</text>
						</view>
					</template>
					
					<template v-else-if="detail.status==1">
						<view class="title">
							<text>距开播还剩</text>
						</view>
						<view class="time">
							<view class="time_box">{{dd}}</view>
							<text>天</text>
							<view class="time_box">{{hh}}</view>
							<text>时</text>
							<view class="time_box">{{mm}}</view>
							<text>分</text>
							<view class="time_box">{{ss}}</view>
							<text>秒</text>
						</view>
					</template>
				</view>
			</template>
		</view>
		
		<view class="info_box">
			<view class="top">
				<text class="title">{{detail.name}}</text>
				<text v-if="detail.status==2">{{detail.playBackNumber}}次播放</text>
				<text v-else>{{detail.virtualPeopleNumber}}人报名</text>
			</view>
			<text class="details">{{detail.description}}</text>
		</view>
		
		
		<view class="more_box">
			<view class="box_list" v-if="detail.pptUrl" @tap.stop="lookPdf()">
				<text class="titie">课件</text>
				<text style="color: #F75C50;">{{detail.pdfName}}</text>
			</view>
			<view class="box_list">
				<text class="titie">时间</text>
				<text>{{detail.dateTime}}</text>
			</view>
		</view>
		
		<view class="teacher_box">
			<view class="title">主讲老师</view>
			<view class="info">
				<image :src="detail.lecturerHeadImgUrl"></image>
				<text>{{detail.lecturerName}}</text>
			</view>
			<text class="details">{{detail.lecturerDescription}}</text>
		</view>
		
		<view class="course_box">
			<view class="title">课程详情</view>
			<image :src="item" mode="widthFix" v-for="(item,index) in detail.detailImageUrls" :key="index"></image>
		</view>
		
		<!-- #ifndef H5 -->
		<template v-if="detail.status!=2">
			<view class="footer_placeholder"></view>
			<view class="liveDetails_footer">
				<view class="footer">
					<view class="btn_big" v-if="!isSignup" @tap.stop="showSignup()">
						<text>立即报名</text>
					</view>
					
					<template v-if="isSignup">
						<template v-if="detail.status==0">
							<view class="copy_box" @tap.stop="copyLive()">
								<image src="/static/studyEnjoy/live/copy.png"></image>
								<text>复制链接</text>
							</view>
							<view class="btn_small"  @tap.stop="toLive()">
								<text>立即观看</text>
							</view>
						</template>
						<template v-if="detail.status==1">
							<view class="copy_box" @tap.stop="noLive()">
								<image src="/static/studyEnjoy/live/copy.png"></image>
								<text>复制链接</text>
							</view>
							<view class="btn_small" style="background: #B3B3B3;" @tap.stop="noLive()">
								<text>立即观看</text>
							</view>
						</template>
					</template>
				</view>
				<view class="safety"></view>
			</view>
		</template>
		<!-- #endif --> 
		
		<view class="signup_content" v-if="signupShow" @touchmove.stop.prevent @tap.stop="hideSignup()">
			<view class="signup" @tap.stop>
				<image class="x" src="/static/x.png" @tap.stop="hideSignup()" />
				<view class="title">立即报名</view>
				
				<view class="input_ul">
					<view class="input_list">
						<input v-model="name" type="text" placeholder="请输入姓名" :focus="nameFocus" maxlength="10" @blur="blur(name)" />
					</view>
					<view class="input_list">
						<input v-model="phone" type="number" placeholder="请输入手机号码" :focus="phoneFocus" :disabled="phoneDisabled" maxlength="11" @blur="blur(phone)" style="color: #999;" />
					</view>
					<view class="input_list">
						<input v-model="school" type="text" :focus="schoolFocus" placeholder="请填写高校/企业机构名称" @blur="blur(school)" />
					</view>
					
					<!-- <view class="radio_ul">
						<view class="radio_list" @tap.stop="tabUserType(1)">
							<view class="radio" :class="appUserType == 1 ? 'radioY' : ' '">
								<view class="spot"></view>
							</view>
							<text>学生</text>
						</view>
						
						<view class="radio_list" @tap.stop="tabUserType(2)">
							<view class="radio" :class="appUserType == 2 ? 'radioY' : ' '">
								<view class="spot"></view>
							</view>
							<text>老师</text>
						</view>
						
						<view class="radio_list" @tap.stop="tabUserType(3)">
							<view class="radio" :class="appUserType == 3 ? 'radioY' : ' '">
								<view class="spot"></view>
							</view>
							<text>企业</text>
						</view>
					</view> -->
				</view>
				
				<view class="btn" @tap.stop="toSignupLive()">
					提交
				</view>
			</view>
		</view>
		
		<!-- #ifdef H5 -->
		<h5Footer />
		<!-- #endif -->  
		
		<!-- #ifdef APP-PLUS -->
		<view class="guide_content" @touchmove.stop.prevent v-if="guideShow">
			<view class="btn" @tap.stop="hideGuideShow()">
				<text>我知道啦</text>
			</view>
			<image class="text" src="/static/studyEnjoy/live/text.png" mode="widthFix"></image>
			<image class="icon" src="/static/studyEnjoy/live/icon.png" mode="widthFix"></image>
		</view>
		
		<share :shareShow="shareShow" :shareObj="shareObj" @hideShare="$hideShare()"/>
		<!-- #endif --> 
	</view>
</template>

<script>
	import share from '@/components/nw-share/nw-share';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default {
		components: {share,h5Footer},
		data() {
			return {
				token:"",
				isLogin:false,//是否登录
				isSignup:false,//是否报名
				
				id:"",
				detail:{
					"status": "",//状态
					"startDateTime": "",//开始时间
					"startTimeStamp":"",//开始时间戳
					
					"guideImageUrl": "",//视频背景图
					"playBackUrl": "",//回放路径
					
					"name": "",//标题
					"playBackNumber": "",//播放人数
					"virtualPeopleNumber": "",//报名人数
					"description": "",//简介
					
					"pptUrl": "",//PPT路径
					"pdfName":"",
					"dateTime": "",//展示时间
					
					"lecturerHeadImgUrl": "",//老师头像
					"lecturerName": "",//老师名字
					"lecturerDescription": "",//老师简介
					
					"detailImageUrls": [],//课件详情图
					
					"shareImg": "",//分享图片
					"shareContent": "",//分享内容
				},
				
				//点击区
				signupOneTap:false,
				liveOneTap:false,
				videoOneTap:false,
				
				signupShow:false,//显示报名
				//报名区
				name:'',
				nameFocus:false,
				phone:'',
				phoneFocus:false,
				phoneDisabled:false,
				school:'',
				schoolFocus:false,
				appUserType:0,
				
				//分享区
				shareShow:'',
				shareObj:{},
				
				dd:"0",
				hh:"00",
				mm:"00",
				ss:"00",
				timeoutID:'',
				
				guideShow:false,
			};
		},
		onLoad(options){
			this.id = options.id
			this.getLiveDetail()
		},
		onShow() {
			this.hideSignup();
			this.token = uni.getStorageSync('token');
			this.getSignup();
			this.getUser()
			this.liveOneTap = false;
		},
		onUnload() {
			clearInterval(this.timeoutID)
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.showShare()
			}
		},
		methods:{
			getLiveDetail(){
				uni.showLoading()
				uni.request({
				    url: this.$url+'/api/liveuser/livedetail?id='+this.id, 
					method: "GET",
					
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							this.detail = res.data.data
							if(this.detail.pptUrl){
								let arr = this.detail.pptUrl.split("/")
								this.detail.pdfName = arr[arr.length-1]
							}
							if(this.detail.status==1){
								this.setCountDown(this.detail.startTimeStamp)
							}
							let title = this.detail.name
							if(title.length>10){
								title = title.substr(0,9)+'...'
							}
							uni.setNavigationBarTitle({
								title:title
							})
							this.shareObj = {
								title:this.detail.name,
								summary:this.detail.shareContent,
								href:this.$h5Url+'/pages/studyEnjoy/live/liveDetails/liveDetails?id='+this.id,
								imageUrl:this.detail.shareImg,
							}
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			setCountDown(startTime){
				const endTime = Number(startTime)
				this.getCountDown(endTime)
				this.timeoutID = setInterval(()=>{
					this.getCountDown(endTime)
				},1000)
			},
			getCountDown(endTime) {
				let nowTime = new Date().getTime()
				if(nowTime >= endTime){
					this.dd = '0'
					this.mm = '00'
					this.ss = '00'
					this.hh = '00'
					this.detail.status = 0
					clearInterval(this.timeoutID)
				}else{
					let timeDiff =  parseInt((endTime - nowTime) / 1000)
					let dd = parseInt(timeDiff / 60 / 60 / 24);
					let hh = parseInt(timeDiff / 60 / 60 % 24);
					let mm = parseInt(timeDiff / 60 % 60)
					let ss = parseInt(timeDiff % 60)
					this.dd = dd
					this.mm = mm>=10?mm:`0${mm}`
					this.ss = ss>=10?ss:`0${ss}`
					this.hh = hh>=10?hh:`0${hh}`
				}
			},
			//是否已报名
			getSignup(){
				uni.request({
				    url: this.$url+'/api/liveuser/issignup?id='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.isSignup = res.data.data
							this.getGuideShow()
						}
				    }
				});
			},
			getGuideShow(){
				if(this.isSignup&&this.detail.status!=2){
					let guide = uni.getStorageSync('live_guide')
					if(!guide){
						this.guideShow = true
					}else{
						this.guideShow = false
					}
				}
			},
			hideGuideShow(){
				this.guideShow = false
				uni.setStorageSync('live_guide',true);
			},
			getUser(){
				uni.request({
				    url: this.$url+'/api/liveuser/liveuserinfo', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.isLogin = true
							this.name = res.data.data.name
							this.school = res.data.data.institutionName
							this.phone = res.data.data.phone
							if(this.phone != "" && this.phone != null && this.phone != undefined){
								this.phoneDisabled = true
							}else{
								this.phoneDisabled = false
							}
						}else{
							this.isLogin = false
						}
				    }
				});
			},
			
			//显示报名
			showSignup(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
				this.shareShow = 'none';
				if(this.isLogin){
					this.signupShow = true
				}else{
					this.$to401()
				}
			},
			//隐藏报名
			hideSignup(){
				this.signupShow = false
			},
			//报名
			toSignupLive(){
				if(this.signupOneTap){
					return false;
				}
				if(this.name == "") {
					this.nameFocus = true,
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '姓名不能为空'
				    });
				    return false;
				}
				if(this.phone == "") {
					this.phoneFocus = true,
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '号码不能为空'
				    });
				    return false;
				}
				if(!RegExp(/^(13\d|14[5-9]|15[0-35-9]|166|17[0-8]|18\d|19[1-18-9])\d{8}$/).test(this.phone)){
					this.phoneFocus = true,
					uni.showToast({
						title:'请输入正确号码格式',
						icon:'none',
						position: 'bottom',
					});
					return false;
				}
				if(this.school == "") {
					this.schoolFocus = true,
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '机构名称不能为空'
				    });
				    return false;
				}
				this.signupOneTap = true
				uni.showLoading({
				    title: '正在报名'
				});
				uni.request({
				    url: this.$url+'/api/liveuser/signup', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"id":this.id,
						"name": this.name,
						"phone": this.phone,
						"institutionName": this.school,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							this.hideSignup()
							uni.showToast({
								icon: 'success',
								position: 'cSignup',
								title: '报名成功！'
							});
							this.isSignup = true
							this.detail.virtualPeopleNumber++
							this.getGuideShow()
							// setTimeout(() => {
							// 	this.toLive();
							// },500)
						}else if(res.data.code == 401){
							this.signupOneTap = false
							this.$to401()
						}else{
							this.signupOneTap = false
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
			},
			
			toLive(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
				if(this.liveOneTap){
					return false;
				}
				this.liveOneTap = true
				uni.showLoading();
				uni.request({
				    url: this.$url+'/api/liveuser/watchlive?id='+this.id,  
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							uni.setStorageSync('liveUrl', res.data.data);
							uni.navigateTo({
								url:"/pages/browser/liveBrowser"
							})
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							this.liveOneTap = false
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
			},
			noLive(){
				uni.showToast({
					icon: 'none',
					title: '直播还未开始'
				});
			},
			copyLive(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
				uni.showLoading({
				    title: '正在获取链接'
				});
				uni.request({
				    url: this.$url+'/api/liveuser/watchlive?id='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							uni.setClipboardData({
								data:res.data.data,
								success: (res) => {
									
								},
								fail: (err) => {
									uni.showToast({
									    icon: 'none',
									    position: 'bottom',
									    title: '发生错误请重试'
									});
								}
							})
						}else if(res.data.code == 401){
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
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			
			blur(model){
				if(model == 'name'){
					this.nameFocus = false
				}else if(model == 'phone'){
					this.phoneFocus = false
				}else if(model == 'school'){
					this.schoolFocus = false
				}
			},
			
			//分享
			showShare(){
				this.hideSignup();
				this.shareShow = 'show';
			},
			
			lookPdf(){
				// #ifndef APP-PLUS
				this.$downNASA();
				return false;
				// #endif
				uni.getSystemInfo({
					success: (res) => {
						if(res.platform == 'ios'){
							uni.navigateTo({
								url:'/pages/browser/browser?src='+this.detail.pptUrl
							})
						}else{
							uni.showLoading({
							    title: '正在打开...'
							});
							uni.downloadFile({
								url: this.detail.pptUrl,
								success:(res) => {
									uni.openDocument({
										filePath: res.tempFilePath,
										success:(res)=>{
											uni.hideLoading()
										}
									});
								},
								fail:()=>{
									uni.hideLoading()
									uni.showToast({
									    icon: 'none',
										position: 'bottom',
									    title: '打开失败'
									});
								}
							});
						}
					}
				})
			},
			playbacknumber(){
				if(this.videoOneTap){
					return false
				}
				this.videoOneTap = true
				uni.request({
				    url: this.$url+'/api/liveuser/playbacknumber?id='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success: (res) => {
						console.log(res.data)
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	@import './liveDetails.scss'
</style>