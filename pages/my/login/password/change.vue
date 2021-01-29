<template>
	<view class="login_content">
		<view class="main">
			<view class="input_pass" :style="{'borderBottom': passInpBor}">
				<input v-model="password1" :password="passOff1" placeholder="请输入6-20位新密码" maxlength="20" :focus="passFocus1" />
				
				<view class="right">
				<image src="/static/login/x_p.png" v-if="passXshow1" style="margin-right: 40upx;" @tap.stop="passClear(1)" />
				<image src="/static/login/nolook.png" v-if="passOff1" @tap.stop="TapPassOff(1)" />
				<image src="/static/login/look.png" v-if="!passOff1" @tap.stop="TapPassOff(1)" />
				</view>
			</view>
			
			<view class="input_pass" :style="{'borderBottom': passInpBor}">
				<input v-model="password2" :password="passOff2" placeholder="请再次输入新密码" maxlength="20" :focus="passFocus2" />
				
				<view class="right">
				<image src="/static/login/x_p.png" v-if="passXshow2" style="margin-right: 40upx;" @tap.stop="passClear(0)" />
				<image src="/static/login/nolook.png" v-if="passOff2" @tap.stop="TapPassOff(0)" />
				<image src="/static/login/look.png" v-if="!passOff2" @tap.stop="TapPassOff(0)" />
				</view>
			</view>
			<view class="tips" v-if="tipShow" style="color: #F75C50;">密码不一致</view>
			<view class="btn gray" v-if="btnShow == 0">
				修改密码
			</view>
			<view class="btn orange" v-if="btnShow == 1" @tap.stop="changePass">
				修改密码
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
				type:'change',
				token:'',
				
				phone:'',
				verCode:'',
				
				password1:'',
				passFocus1:true,
				passOff1:true,
				passXshow1:false,
				
				password2:'',
				passFocus2:false,
				passOff2:true,
				passXshow2:false,
				
				passInpBor:'2upx solid #F5F5F5',
				
				btnShow:0,
				tipShow:false
			};
		},
		onLoad(options){
			if(options.type){
				this.type = options.type
				if(this.type == 'forget'){
					this.phone = options.phone
					this.verCode = options.verCode
				}
			}else{
				this.type = 'change'
			}
		},
		onShow() {
			this.token = uni.getStorageSync('token');
		},
		watch:{
			password1:function(val){
				if(val!=NaN&&val!=''&&val!=null&&val!=undefined){
					this.passXshow1 = true
				}else{
					this.passXshow1 = false
				}
				if(val.length>=6&&this.password1==this.password2){
					this.btnShow = 1
				}else{
					this.btnShow = 0
				}
			},
			password2:function(val){
				if(val!=NaN&&val!=''&&val!=null&&val!=undefined){
					this.passXshow2 = true
				}else{
					this.passXshow2 = false
				}
				if(val.length>=6&&this.password1==this.password2){
					this.btnShow = 1
				}else{
					this.btnShow = 0
				}
				if(val.length>=this.password1.length&&this.password1!=this.password2){
					this.tipShow = true
				}else{
					this.tipShow = false
				}
			},
		},
		methods:{
			passClear(type){
				if(type){
					this.passFocus1 = false
					this.password1 = ''
					setTimeout(()=>{
						this.passFocus1 = true
					},100)
				}else{
					this.passFocus2 = false
					this.password2 = ''
					setTimeout(()=>{
						this.passFocus2 = true
					},100)
				}
			},
			TapPassOff(type){
				if(type){
					this.passFocus1 = false
					this.passOff1 = !this.passOff1
					setTimeout(()=>{
						this.passFocus1 = true
					},100)
				}else{
					this.passFocus2 = false
					this.passOff2 = !this.passOff2
					setTimeout(()=>{
						this.passFocus2 = true
					},100)
				}
			},
			changePass(){
				if (this.password1!=this.password2) {
				    uni.showToast({
				        icon: 'none',
				    	position: 'bottom',
				        title: '密码不一致！'
				    });
				    return false;
				}
				this.btnShow = 2
				if(this.type == 'change'){
					uni.request({
					    url: this.$url+'/api/appuser/modify-password?password='+this.password1, 
						header:{
							Authorization:'Bearer '+this.token
						},
						method: "POST",
					    
					    success: (res) => {
							if(res.data.success&&res.data.code == 200){
								uni.showToast({title: "修改成功"});
								setTimeout(()=>{
									uni.navigateBack()
								},1000)
								
							}else if(res.data.code == 401){
								this.$to401()
							}else{
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: res.data.message
								})
							}
							this.btnShow = 1	
					    },
						fail: (err) => {
							this.$requestFail()
						}
					});
				}else if(this.type == 'forget'){
					uni.request({
					    url: this.$url+'/api/appuser/reset-password?phone='+this.phone+'&password='+this.password1+'&verifyCode='+this.verCode, 
						method: "POST",
						
					    success: (res) => {
							if(res.data.success&&res.data.code == 200){
								uni.showToast({title: "修改成功"});
								setTimeout(()=>{
									uni.navigateBack()
								},1000)
							}else{
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: res.data.message
								})
							}
							this.btnShow = 1
					    },
						fail: (err) => {
							this.$requestFail()
						}
					});
				}
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
		input{
			width: 500upx;
		}
	}
</style>
