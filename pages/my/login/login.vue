<template>
	<view class="login_content">
		<view class="login_header">
			<view class="status"></view>
			<view class="header">
				<image src="/static/login/x.png" v-if="page==0" @tap.stop='$back' />
				<image src="/static/login/back.png" v-if="page==1" @tap.stop="tabPage(0)" />
				<image src="/static/login/back.png" v-if="page==2" @tap.stop="tabPage(0)" />
				<image src="/static/login/x.png" style="margin-left: 16upx;" v-if="page==2" @tap.stop='$back' />
				<image src="/static/login/back.png" v-if="page==3" @tap.stop="tabPage(0)" />
			</view>
		</view>
		<!-- 头部占位 -->
		<view class="header_placeholder"></view>
		
		<view class="main" v-if="page==0">
			<view class="title">欢迎登录新威研选</view>
			<view class="input_phone" :style="{'borderBottom': phoneInpBor}">
				<text class="areaCode">+86</text>
				<input v-model="phone" type="number" placeholder="请输入手机号" maxlength="11" :focus="phoneFocus" @focus="phoneInpFc" @blur="phoneInpBl" />
				<image src="/static/login/x_p.png" v-if="phoneXshow" @tap.stop="phoneClear" />
			</view>
			<view class="tips" v-if="!tipShow0">未验证的手机号登录将自动注册</view>
			<view class="tips" v-if="tipShow0" style="color: #F75C50;">请输入正确号码格式</view>
			<view class="btn gray" v-if="btnShow0 == 0">
				获取验证码
			</view>
			<view class="btn orange" v-if="btnShow0 == 1" @tap.stop="sendCode(page)">
				获取验证码
			</view>
			<view class="btn orange" v-if="btnShow0 == 2">
				<view class="loader" style="margin-right: 16upx;"></view>发送中
			</view>
			
			<view class="others">
				<view class="other" @tap.stop="tabPage(2)">账号密码登录</view>
				<view class="other" @tap.stop="aurora" v-if="oneShow">本机号码一键登录</view>
			</view>
			
			
			<view class="botBox">
				<view class="otherBtn">
				<block v-if="otherOff">
					<view class="others_title">
						<view class="line"></view>
						<view class="text">其他登录方式</view>
					</view>
					<!-- #ifndef MP-WEIXIN -->
					<view class="others_ul">
						<image class="others_list" src="/static/login/wx.png" mode="widthFix" @tap.stop="loginOther(1)" />
						<image class="others_list" src="/static/login/qq.png" mode="widthFix" @tap.stop="loginOther(2)" />
						<image class="others_list" src="/static/login/apple.png" mode="widthFix" v-if="ios" @tap.stop="loginOther(3)" />
					</view>
					<!-- #endif --> 
					<!-- #ifdef MP-WEIXIN -->
					<view class="others_ul" style="justify-content: center;">
						<button class="wxBtn" open-type="getUserInfo" @getuserinfo="loginMP_WX">微信登录</button>
					</view>
					<!-- #endif --> 
				</block>
				</view>
				<view class="footer">
					<image src="/static/login/yes.png" v-if="yes" @tap.stop="TapYes" />
					<image src="/static/login/no.png" v-if="!yes" @tap.stop="TapYes" />
					<view class="p">
						登录并同意<text @tap="toAgree(1)">《用户服务协议》</text><text @tap="toAgree(0)">《用户隐私协议》</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="main" v-if="page==1">
			<text class="title">请输入验证码</text>
			<view class="tips" >验证码已通过短信发送至{{phoneCanonical}}</view>
			<validcode class="verCode" ref="code" :inpFocus="codeFocus" @inpnt="getCode" @finish="finish" ></validcode>
			<view class="countDown" v-if="!tipShow1">
				重新发送{{countDown}}
			</view>
			<view class="countDown" v-if="tipShow1" style="color: #F8B500;" @tap.stop="sendCode(page)">
				获取验证码
			</view>
			<!-- <view class="btn gray" v-if="btnShow1 == 0">
				登录
			</view>
			<view class="btn orange" v-if="btnShow1 == 1" @tap.stop="loginCode">
				登录
			</view>
			<view class="btn orange" v-if="btnShow1 == 2">
				<view class="loader" style="margin-right: 16upx;"></view>登录中
			</view> -->
		</view>
		
		<view class="main" v-if="page==2">
			<text class="title">账号密码登录</text>
			<view class="input_phone" :style="{'borderBottom': phoneInpBor}">
				<text class="areaCode">+86</text>
				<input v-model="phone" type="number" placeholder="请输入手机号" maxlength="11" :focus="phoneFocus" @focus="phoneInpFc" @blur="phoneInpBl" />
				<image src="/static/login/x_p.png" v-if="phoneXshow" @tap.stop="phoneClear" />
			</view>
			<view class="input_pass" :style="{'borderBottom': passInpBor}">
				<input v-model="password" :password="passOff" placeholder="请输入密码" maxlength="20" :focus="passFocus" @focus="passInpFc" @blur="passInpBl" />
				
				<view class="right">
				<image src="/static/login/x_p.png" v-if="passXshow" style="margin-right: 40upx;" @tap.stop="passClear" />
				<image src="/static/login/nolook.png" v-if="passOff" @tap.stop="TapPassOff" />
				<image src="/static/login/look.png" v-if="!passOff" @tap.stop="TapPassOff" />
				<text class="areaCode" @tap.stop="toForget">忘记密码？</text>
				</view>
			</view>
			<view class="btn gray" v-if="btnShow2 == 0">
				登录
			</view>
			<view class="btn orange" v-if="btnShow2 == 1" @tap.stop="loginPass()">
				登录
			</view>
			<view class="btn orange" v-if="btnShow2 == 2">
				<view class="loader" style="margin-right: 16upx;"></view>登录中
			</view>
		</view>
		
		<view class="main" v-if="page==3">
			<view class="title">关联手机号</view>
			<view class="tips">欢迎加入我们！即刻关联手机 解锁更多功能 畅享科研福利</view>
			<view class="input_phone" :style="{'borderBottom': phoneInpBor}">
				<text class="areaCode">+86</text>
				<input v-model="phone" type="number" placeholder="请输入手机号" maxlength="11" :focus="phoneFocus" @focus="phoneInpFc" @blur="phoneInpBl" />
				<image src="/static/login/x_p.png" v-if="phoneXshow" @tap.stop="phoneClear" />
			</view>
			<view class="tips" v-if="tipShow3" style="color: #F75C50;">请输入正确号码格式</view>
			
			<view class="btn gray" v-if="btnShow3 == 0">
				获取验证码
			</view>
			<view class="btn orange" v-if="btnShow3 == 1" @tap.stop="sendCode(page)">
				获取验证码
			</view>
			<view class="btn orange" v-if="btnShow3 == 2">
				<view class="loader" style="margin-right: 16upx;"></view>发送中
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS  
	const jv = uni.requireNativePlugin('JG-JVerification');
	// #endif
	import validcode from '../../../components/validCode/validCode.vue'
	export default {
		components:{validcode},
		data() {
			return {
				page:0,
				
				btnShow0:0,
					tipShow0:false,
					yes:true,
				phone:'',
					phoneCanonical:'',
					phoneFocus:false,
					phoneXshow:false,
					phoneInpBor:'2upx solid #F5F5F5',
					
				btnShow1:0,
					countDown:'',
					tipShow1:true,
				verCode:'',
					codeType:'login',
					codeFocus:true,
					
				btnShow2:0,
				password:'',
					passFocus:false,
					passOff:true,
					passXshow:false,
					passInpBor:'2upx solid #F5F5F5',
					
				btnShow3:0,
				bindInfo:{
					"platform": 0,
					"openId": "",
					"nickName": "",
					"gender": 0,
					"city": "",
					"province": "",
					"country":"",
					"avatarUrl": ""
				},
					
				userInfo:{},
					gender:0,
					otherOff:false,
					ios:false,
					iosVersion:0,
					
				oneShow:false,
				
				fromId:''
			};
		},
		onLoad(options) {
			if(options.fromId){
				this.fromId = options.fromId
			}
			// #ifdef APP-PLUS
			uni.getSystemInfo({
				success: (res) => {
					this.iosVersion = parseInt(res.system.split(".")[0])
					if(res.platform == "ios" || res.platform == "IOS"){
						this.ios = true
						this.funOtherOff()
					}else{
						this.otherOff = true
					}
				}
			})
			
			this.aurora()
			// #endif
		},
		watch:{
			phone:function(val){
				if(val!=NaN&&val!=''&&val!=null&&val!=undefined){
					this.phoneXshow = true
				}else{
					this.phoneXshow = false
				}
				if(val.length == 11){
					let one = val.substr(0,3)
					let two = val.substr(3,4)
					let thr = val.substr(7,4)
					this.phoneCanonical = `+86 ${one} ${two} ${thr}`
					if(RegExp(/^(13\d|14[5-9]|15[0-35-9]|166|17[0-8]|18\d|19[1-18-9])\d{8}$/).test(val)){
						this.btnShow0 = this.btnShow3 = 1
						this.tipShow0 = this.tipShow3 = false
					}else{
						this.btnShow0 = this.btnShow3 = 0
						this.tipShow0 = this.tipShow3 = true
					}
				}else{
					this.btnShow0 = this.btnShow3 = 0
					this.tipShow0 = this.tipShow3 = false
				}
				if(val.length == 11&&this.password.length > 0){
					this.btnShow2 = 1
				}else{
					this.btnShow2 = 0
				}
			},
			verCode:function(val){
				if(val.length == 6){
					this.btnShow1 = 1
				}else{
					this.btnShow1 = 0
				}
			},
			password:function(val){
				if(val!=NaN&&val!=''&&val!=null&&val!=undefined){
					this.passXshow = true
				}else{
					this.passXshow = false
				}
				if(val.length > 0&&this.phone.length == 11){
					this.btnShow2 = 1
				}else{
					this.btnShow2 = 0
				}
			},
		},
		methods:{
			tabPage(index,codeType){
				if(this.page == 1){
					uni.showModal({
					    title: '返回将中断登录，确定返回？',
					    success: (res) => {
					        if (res.confirm) {
					            this.page = index
					        }
					    }
					});
				}else{
					this.page = index
					if(index == 1){
						this.codeFocus = false
						setTimeout(()=>{
							this.codeFocus = true
						},100)
					}
					if(codeType){
						this.codeType = codeType
					}else{
						this.codeType = 'login'
					}
				}
				
			},
			
			phoneInpFc(){
				// this.phoneInpBor = '2upx solid #F8B500'
				// if(this.phone!=NaN&&this.phone!=''&&this.phone!=null&&this.phone!=undefined){
				// 	this.phoneXshow = true
				// }else{
				// 	this.phoneXshow = false
				// }
			},
			phoneInpBl(){
				// this.phoneInpBor = '2upx solid #F5F5F5'
			},
			phoneClear(){
				this.phoneFocus = false
				this.phone = ''
				setTimeout(()=>{
					this.phoneFocus = true
				},100)
			},
			
			passInpFc(){
				// this.passInpBor = '2upx solid #F8B500'
				// if(this.password!=NaN&&this.password!=''&&this.password!=null&&this.password!=undefined){
				// 	this.passXshow = true
				// }else{
				// 	this.passXshow = false
				// }
			},
			passInpBl(){
				// this.passInpBor = '2upx solid #F5F5F5'
			},
			passClear(){
				this.passFocus = false
				this.password = ''
				setTimeout(()=>{
					this.passFocus = true
				},100)
			},
			TapPassOff(){
				this.passFocus = false
				this.passOff = !this.passOff
				setTimeout(()=>{
					this.passFocus = true
				},100)
			},
			
			toAgree(type){
				if(type){
					uni.navigateTo({
						url:"/pages/agreement/registrationAgreement"
					})
				}else{
					uni.navigateTo({
						url:"/pages/agreement/privacyAgreement"
					})
				}
			},
			TapYes(){
				this.yes = !this.yes
			},
			sendCode(page){
				if(!this.yes){
					uni.showToast({
					    title: '请阅读并同意下方协议',
					    icon:'none',
						position:'center',
					});
					return false
				}
				if(page==0){
					this.btnShow0 = 2
				}else if(page==1){
					uni.showLoading({title:'发送中'})
				}else if(page==3){
					this.btnShow3 = 2
				}
				uni.request({
				    url: this.$url+'/api/appuser/v1/phone-code', 
				 	method: "POST",
				     data:{
				 		"phone": this.phone,
				 		"messageTemplate": 2,
				 		"signKey": this.$signKey
				 	},
				    success: (res) => {
						if(page==1){
							uni.hideLoading()
						}
						if(res.data.success&&res.data.code == 200){
							let codeTime = new Date().getTime()
							uni.setStorageSync('codeTime',codeTime);
							this.tipShow1 = false
							if(page==0){
								this.tabPage(1)
							}else if(page==1){
								this.$refs.code.clear()
								this.verCode = ''
							}else if(page==3){
								this.tabPage(1,'bind')
							}
							this.getCountDown()
						}else{
							uni.showToast({
							    icon: 'none',
								position:'center',
							    title: res.data.message
							});
						}
						if(page==0){
							this.btnShow0 = 1
						}else if(page==3){
							this.btnShow3 = 1
						}
				    },
					fail: (err) => {
						if(page==0){
							this.btnShow0 = 1
						}else if(page==1){
							uni.hideLoading()
						}else if(page==3){
							this.btnShow3 = 1
						}
						this.$requestFail()
					}
				});
			},
			getCountDown(){
				let codeTime = uni.getStorageSync('codeTime');
				let nowTime
				let timeoutID = setInterval(()=>{
					nowTime = new Date().getTime()
					let timeDiff = nowTime - codeTime
					if(timeDiff >= 60000){
						this.tipShow1 = true
						this.countDown = ''
						clearInterval(timeoutID)
					}else{
						this.tipShow1 = false
						let timeRem = 60000 - timeDiff
						this.countDown = Math.floor(timeRem/1000)+'S'
					}
				},1000)
			},
			getCode(val) {
				this.verCode = val
			},
			finish(val){
				this.verCode = val
				if(this.codeType == 'login'){
					this.loginCode()
				}else if(this.codeType == 'bind'){
					this.bindPhone()
				}
			},
			loginCode(){
				this.btnShow1 = 2
				uni.request({
				    url: this.$url+'/api/appuser/login-phone?phone='+this.phone+'&verifyCode='+this.verCode+'&fromUserUniqueId='+this.fromId,
					method: "POST",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.setStorage({
								key: 'token',
								data: res.data.data.access_Token,
								success: (ret) => {
									uni.hideKeyboard()
									uni.showToast({title: "登录成功",})
									let tok = res.data.data.access_Token
									this.setUser(tok)
									this.duration(0,tok)
									setTimeout(()=>{
										uni.navigateBack()
									},1000)
								}
							});
						}else{
							uni.showToast({
								icon: 'none',
								position:'center',
								title: res.data.message
							})
						}
						this.btnShow1 = 1
				    },
					fail: (err) => {
						this.btnShow1 = 1
						this.$requestFail()
					}
				});
			},
			
			loginPass(){
				this.btnShow2 = 2
				uni.request({
					url: this.$url+'/api/appuser/login', 
					data: {
						"phone": this.phone,
						"password": this.password,
					},
					method: "POST",
					success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.setStorage({
								key: 'token',
								data: res.data.data.access_Token,
								success: (ret) => {
									uni.showToast({title: "登录成功",})
									let tok = res.data.data.access_Token
									this.setUser(tok)
									this.duration(0,tok)
									setTimeout(()=>{
										uni.navigateBack()
									},1000)
								}
							});
						}else{
							uni.showToast({
								icon: 'none',
								position:'center',
								title: res.data.message
							})
						}
						this.btnShow2 = 1
					},
					fail: (err) => {
						this.btnShow2 = 1
						this.$requestFail()
					}
				});
			},
			
			funOtherOff(){
				uni.request({
				    url: this.$url+'/api/appuser/loginswitch?platform=2', 
					method: "GET",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.otherOff = res.data.data;
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			loginOther(platformId){
				if(!this.yes){
					uni.showToast({
					    title: '请阅读并同意下方协议',
					    icon:'none',
						position:'center',
					});
					return false
				}
				if(platformId==3&&this.iosVersion < 13){
					uni.showToast({
					    title: '请更新至iOS13及以上版本',
					    icon:'none',
						position:'center',
					});
					return false
				}
				let platform = '';
				switch(platformId){
					case 1:
						platform = 'weixin'
						break;
					case 2:
						platform = 'qq'
						break;
					case 3:
						platform = 'apple'
						break;
				}
				uni.login({
				    provider: platform,
				    success: (loginRes) => {
						 uni.getUserInfo({
						      provider: platform,
						      success: (infoRes) => {
								if(infoRes.errMsg.split(":")[1] == "ok"){
									if(platformId!=3){
										if(infoRes.userInfo.gender == "男"){
											infoRes.userInfo.genderNum = 0
										}else if(infoRes.userInfo.gender == "女"){
											infoRes.userInfo.genderNum = 1
										}else if(infoRes.userInfo.gender == 1 || 2){
											infoRes.userInfo.genderNum = infoRes.userInfo.gender - 1
										}
									}
									this.userInfo = infoRes.userInfo
									uni.showLoading({title:'正在验证',});
									uni.request({
									    url: this.$url+'/api/appuser/login-other?platform='+platformId+'&openId='+this.userInfo.openId, 
										method: "GET",
									    
									    success: (res) => {
											uni.hideLoading()
											if(res.data.success&&res.data.code == 200){
												if(res.data.data.isFristLogin){
													uni.showToast({
														icon: 'none',
														title: "请绑定手机号",
													})
													setTimeout(() => {
														let bindInfo
														if(platformId!=3){
															bindInfo = {
																"platform": platformId,
																"openId": this.userInfo.openId,
																"nickName": this.userInfo.nickName,
																"gender": this.userInfo.genderNum,
																"city": this.userInfo.city,
																"province": this.userInfo.province,
																"country":"",
																"avatarUrl": this.userInfo.avatarUrl
															}
														}else{
															bindInfo = {
																"platform": platformId,
																"openId": this.userInfo.openId,
																"nickName": this.userInfo.fullName.familyName+this.userInfo.fullName.giveName,
																"gender": 0,
																"city": this.userInfo.city,
																"province": this.userInfo.province,
																"country":"",
																"avatarUrl": this.userInfo.avatarUrl
															}
														}
														this.bindInfo = bindInfo
														this.tabPage(3)
													},1000)
												}else{
													uni.setStorage({
														key: 'token',
														data: res.data.data.token,
														success: (ret) => {
															uni.showToast({title: "登录成功",})
															let tok = res.data.data.token
															this.setUser(tok)
															this.duration(0,tok)
															setTimeout(()=>{
																uni.navigateBack()
															},1000)
														}
													});
												}
											}else{
												uni.showToast({
													icon: 'none',
													position:'center',
													title: res.data.message
												})
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
				    }
				});
			},
			bindPhone(){
				this.btnShow1 = 2
				uni.request({
				    url: this.$url+'/api/appuser/regsiter-other?verifyCode='+this.verCode,
					data: {
						"platform": Number(this.bindInfo.platform),
						"phone": this.phone,
						"openId": this.bindInfo.openId,
						"nickName": this.bindInfo.nickName,
						"gender": this.bindInfo.gender,
						"city": this.bindInfo.city,
						"province": this.bindInfo.province,
						"country":this.bindInfo.country,
						"avatarUrl": this.bindInfo.avatarUrl
					},
					method: "POST",
					
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.setStorage({
								key: 'token',
								data: res.data.data.access_Token,
								success: (ret) => {
									uni.hideKeyboard()
									uni.showToast({title: "登录成功",})
									let tok = res.data.data.access_Token
									this.setUser(tok)
									this.duration(0,tok)
									setTimeout(()=>{
										uni.navigateBack()
									},1000)
								}
							});
						}else{
							uni.showToast({
								icon: 'none',
								position:'center',
								title: res.data.message
							})
						}
						this.btnShow1 = 1
				    },
					fail: (err) => {
						this.btnShow1 = 1
						this.$requestFail()
					}
				});
			},
			
			toForget(){
				uni.navigateTo({
					url:"/pages/my/login/password/forget"
				})
			},
			setUser(token){
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.setStorageSync('myAvatar', res.data.data.headImg);
						uni.setStorageSync('onlyID', res.data.data.userId);
						uni.setStorageSync('myID', res.data.data.userUniqueId);
						uni.setStorageSync('myNickname', res.data.data.nickname);
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			duration(type,token){
				uni.request({
				    url: this.$url+'/api/appuser/signin-duration', 
					header:{
						Authorization:'Bearer '+token
					},
					data:{
						"type": type
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							if(!type){
								console.log('Timing Begins')
							}else{
								console.log('Timer End')
							}
						}
				    },
				});
			},
			// #ifdef MP-WEIXIN
			loginMP_WX(e) {
				if(!this.yes){
					uni.showToast({
					    title: '请阅读并同意下方协议',
					    icon:'none',
						position:'center',
					});
					return false
				}
				wx.canIUse('button.open-type.getUserInfo')
				this.userInfo = e.detail.userInfo
				wx.login({
				  success: (loginRes) =>{
					uni.request({
						url:this.$url+'/api/appuser/wechat-applet?code='+loginRes.code,
						method:"GET",
						success: (res) => {
							this.userInfo.openId = res.data.data.openid
							if(e.detail.userInfo.gender == 1 || 2){
								this.userInfo.genderNum = e.detail.userInfo.gender - 1
							}
							uni.showLoading({title:'正在验证',});
							uni.request({
							    url: this.$url+'/api/appuser/login-other?platform=0'+'&openId='+this.openId, 
								method: "GET",
							    
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										if(res.data.data.isFristLogin){
											uni.showToast({
												icon: 'none',
												title: "请绑定手机号",
											})
											setTimeout(() => {
												let bindInfo = {
													"platform": 0,
													"openId": this.userInfo.openId,
													"nickName":this.userInfo.nickName,
													"gender": this.userInfo.genderNum,
													"city": this.userInfo.city,
													"province": this.userInfo.province,
													"country":"",
													"avatarUrl": this.userInfo.avatarUrl
												}
												this.bindInfo = bindInfo
												this.tabPage(3)
											},1000)
										}else{
											uni.setStorage({
												key: 'token',
												data: res.data.data.token,
												success: (ret) => {
													uni.showToast({title: "登录成功",})
													let tok = res.data.data.token
													this.setUser(tok)
													this.duration(0,tok)
													setTimeout(()=>{
														uni.navigateBack()
													},1000)
												}
											});
										}
									}else{
										uni.showToast({
											icon: 'none',
											position:'center',
											title: res.data.message
										})
									}
								},
								fail: (err) => {
									this.$requestFail()
								}
							});
						},
						fail: (err) => {
							this.$requestFail()
						}
					})
				  }
				});
			},
			// #endif
			aurora(){
				jv.checkVerifyEnable(res=>{
					this.oneShow = res.enable
				})
				const screenWidth = uni.getSystemInfoSync().screenWidth
				let vwidth = screenWidth / 2 - 50
				const platform = uni.getSystemInfoSync().platform
				if(platform == 'ios'){
					jv.setCustomUIWithConfigiOS({
						shouldAutorotate:false,
						
						navColor:0xFFFFFFFF,
						navText:[' ',0xFFFFFFFF,28],
						navReturnImg:'static/login/x_one.png',
						
						logoImg:'static/login/logo.png',
						logoWidth:224,
						logoHeight:28,
						
						logBtnText:'本机号码一键登录',
						logBtnTextColor:0xFFFFFFFF,
						logBtnImgs:['static/login/bg.png','static/login/bg_no.png','static/login/bg.png'],
						
						numberColor:0xFF333333,
						numberSize:24,
						
						uncheckedImg:'static/login/no_one.png',
						checkedImg:'static/login/yes_one.png',
						privacyState:true,
						
						privacyTextFontSize:11,
						appPrivacyColor:[0xff999999,0xFF333333],
						privacyShowBookSymbol:true,
						
						sloganTextColor:0xFF999999,
						
						addCustomViews:[{
							type:'button',
							width:100,
							height:28,
							top:330,
							left:vwidth,
							title:'其他方式登录',
							textColor:0xFF000000,
							id:'other',
							textFont:14,
							isFinish:true
						}]
					});
				}else{
					jv.setCustomUIWithConfigAndroid({
						setVirtualButtonTransparent:true,
						
						setNavColor:0xFFFFFFFF,
						setNavText:' ',
						setNavTextColor:0xFF333333,
						setNavHidden:true,
						
						setLogoHidden:true,
						
						setNumberColor:0xFF333333,
						setNumberSize:24,
						
						setLogBtnText:'本机号码一键登录',
						setLogBtnTextColor:0xFFFFFFFF,
						setLogBtnTextSize:18,
						
						setAppPrivacyColor:[0xff999999,0xFF333333],
						setPrivacyState:true,
						setPrivacyTextSize:11,
						setPrivacyWithBookTitleMark:true,
						
						setSloganTextColor:0xFF999999,
						
						addCustomViews:[
							{
								finishFlag:true,
								type:'text',
								id:'other',
								width:84,
								height:28,
								margins:[0,300,0,0],
								align:14,
								text:'其他方式登录',
								textColor:0xFF000000,
								textSize:14
							},
							{
								type:'image',
								id:'logo',
								width:224,
								height:28,
								margins:[0,85,0,0],
								align:14,
								bgImgPath:'static/login/logo.png',
							},
							{
								finishFlag:true,
								type:'image',
								id:'x',
								width:24,
								height:24,
								margins:[12,19,0,0],
								align:9,
								bgImgPath:'static/login/x_one.png',
							}
						]
					});
				};
				jv.getToken(3000,res=>{
					if(res.code == 2000 || res.code == 2001){
						jv.loginAuth(
							{
								autoFinish:false,
								timeout:5000,
								animationFlag:true
							},res=>{
								// 结果监听
								if(res.code == 6000){
									uni.showLoading({title: '验证中'});
									uni.request({
									    url: this.$url+'/api/appuser/login-phone-token',
										data:{
											'token':res.content
										},
										method: "POST",
									    
									    success: (res) => {
											uni.hideLoading()
											if(res.data.success&&res.data.code == 200){
												uni.setStorage({
													key: 'token',
													data: res.data.data.access_Token,
													success: (ret) => {
														uni.showToast({title: "登录成功",})
														let tok = res.data.data.access_Token
														this.setUser(tok)
														this.duration(0,tok)
														setTimeout(()=>{
															jv.dismissLoginAuth(true, res=>{})
															uni.navigateBack()
														},100)
													}
												});
											}else{
												jv.dismissLoginAuth(true, res=>{})
												setTimeout(()=>{
													uni.showToast({
														icon: 'none',
														position:'center',
														title: res.data.message
													})
												},100)
											}
									    },
										fail: (err) => {
											jv.dismissLoginAuth(true, res=>{})
											this.$requestFail()
										}
									});
								}
							},event=>{
								// 事件监听
								console.log(event)
							}
						)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "./login.scss"
</style>
