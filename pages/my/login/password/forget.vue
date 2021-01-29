<template>
	<view class="login_content">
		<view class="main">
			<view class="input_phone" :style="{'borderBottom': phoneInpBor}">
				<text class="areaCode">+86</text>
				<input v-model="phone" type="number" placeholder="请输入手机号" maxlength="11" :focus="phoneFocus" @focus="phoneInpFc" @blur="phoneInpBl" />
				<image src="/static/login/x_p.png" v-if="phoneXshow" @tap.stop="phoneClear" />
			</view>
			<view class="input_pass" :style="{'borderBottom': passInpBor}">
				<input v-model="verCode" type="number" placeholder="请输入验证码" maxlength="6" :focus="passFocus" @focus="passInpFc" @blur="passInpBl" />
				
				<view class="right">
				<image src="/static/login/x_p.png" v-if="passXshow" @tap.stop="passClear" />
				<text class="areaCode" v-if="tipShow1&&!areaShow" style="color: #B3B3B3;">获取验证码</text>
				<text class="areaCode" v-if="tipShow1&&areaShow" style="color:#F8B500;" @tap.stop="sendCode">获取验证码</text>
				<view class="areaCode" v-if="!tipShow1" style="color: #B3B3B3;">
					重新发送{{countDown}}
				</view>
				</view>
			</view>
			<view class="tips" v-if="tipShow" style="color: #F75C50;">请输入正确号码格式</view>
			<view class="btn gray" v-if="btnShow == 0">
				下一步
			</view>
			<view class="btn orange" v-if="btnShow == 1" @tap.stop="verifyCode">
				下一步
			</view>
			<view class="btn orange" v-if="btnShow == 2">
				<view class="loader"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				btnShow:0,
				tipShow:false,
				tipShow1:true,
				countDown:'',
				areaShow:false,
				phone:'',
					phoneFocus:true,
					phoneXshow:false,
					phoneInpBor:'2upx solid #F5F5F5',
				verCode:'',
					passFocus:false,
					passXshow:false,
					passInpBor:'2upx solid #F5F5F5',
			};
		},
		onLoad() {
			this.getCountDown()
		},
		watch:{
			phone:function(val){
				if(val!=NaN&&val!=''&&val!=null&&val!=undefined){
					this.phoneXshow = true
				}else{
					this.phoneXshow = false
				}
				if(val.length == 11){
					if(RegExp(/^(13\d|14[5-9]|15[0-35-9]|166|17[0-8]|18\d|19[1-18-9])\d{8}$/).test(val)){
						this.tipShow =  false
						this.areaShow = true
					}else{
						this.tipShow = true
						this.areaShow = false
					}
				}else{
					this.tipShow =  false
					this.areaShow = false
				}
				if(val.length == 11&&this.verCode.length == 6&&!this.tipShow){
					this.btnShow = 1
				}else{
					this.btnShow = 0
				}
			},
			verCode:function(val){
				if(val!=NaN&&val!=''&&val!=null&&val!=undefined){
					this.passXshow = true
				}else{
					this.passXshow = false
				}
				if(val.length == 6&&this.phone.length == 11&&!this.tipShow){
					this.btnShow = 1
				}else{
					this.btnShow = 0
				}
			},
		},
		methods:{
			phoneInpFc(){
				// this.phoneInpBor = '2upx solid #F8B500'
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
			},
			passInpBl(){
				// this.passInpBor = '2upx solid #F5F5F5'
			},
			passClear(){
				this.passFocus = false
				this.verCode = ''
				setTimeout(()=>{
					this.passFocus = true
				},100)
			},
			sendCode(){
				uni.request({
				    url: this.$url+'/api/appuser/v1/phone-code', 
				 	method: "POST",
				     data:{
				 		"phone": this.phone,
				 		"messageTemplate": 1,
				 		"signKey": this.$signKey
				 	},
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							let codeTime = new Date().getTime()
							uni.setStorageSync('codeTime',codeTime);
							this.tipShow1 = false
							this.getCountDown('send')
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
			getCountDown(type){
				let codeTime = uni.getStorageSync('codeTime');
				let nowTime = new Date().getTime()
				let timeDiff = nowTime - codeTime
				if(timeDiff >= 60000){
					this.tipShow1 = true
					this.countDown = ''
				}else{
					this.tipShow1 = false
					let timeRem = 60000 - timeDiff
					this.countDown = Math.floor(timeRem/1000)+'S'
					if(type=="send"){
						this.countDown = Math.floor(timeRem/1000) - 1 +'S'
					}
				}
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
			verifyCode(){
				this.btnShow = 2
				uni.request({
				    url: this.$url+'/api/appuser/v1/verifyCode', 
				 	method: "POST",
				     data:{
				 		"phone": this.phone,
				 		"verifyCode": this.verCode,
				 		"signKey": this.$signKey
				 	},
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.redirectTo({
								url:"/pages/my/login/password/change?type=forget&phone="+this.phone+"&verCode="+this.verCode
							})
						}else{
							uni.showToast({
							    icon: 'none',
								position: 'bottom',
							    title: res.data.message
							});
						}
						this.btnShow = 1
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "../login.scss";
	.main{
		padding: 232upx 48upx 0;
	}
	.input_pass{
		.areaCode{
			width: 200upx !important;
		}
	}
</style>
