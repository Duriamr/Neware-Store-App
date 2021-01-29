<template>
	<view class="live_content">
		<image class="live" :src="item" mode="widthFix" lazy-load="true" v-for="(item,index) in bgList" :key="'bgList'+index" />
		
		<view class="enter_content"  @touchmove.stop.prevent @tap.stop="hideEnter">
			<view class="enter" @tap.stop>
				<view class="title">立即报名</view>
				
				<view class="input_ul">
					<view class="input_list">
						<input v-model="name" type="text" placeholder="请输入姓名" :focus="nameFocus" maxlength="10" @blur="blur(name)" />
					</view>
					
					<view class="input_list">
						<input v-model="phone" type="number" placeholder="请输入手机号码" :focus="phoneFocus" :disabled="phoneDisabled" maxlength="11" @blur="blur(phone)" />
					</view>
					
					<view class="input_list">
						<input v-model="school" type="text" :focus="schoolFocus" placeholder="请填写高校/企业机构名称" @blur="blur(school)" />
					</view>
					
					<view class="radio_ul">
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
					</view>
				</view>
				
				<view class="btn" @tap.stop="toEnterLive">
					提交
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				id:0,
				uuid:'',
				
				bgList:[],
				
				loginType:false,
				
				//报名区
				name:'',
				nameFocus:false,
				phone:'',
				phoneFocus:false,
				phoneDisabled:false,
				school:'',
				schoolFocus:false,
				appUserType:0,
				
				
				//点击区
				EnterOneTap:false,
			};
		},
		onLoad(options) {
			this.id = options.id
			this.uuid = options.uuid
			this.getBgList()
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getUser();
		},
		methods:{
			tabUserType(index){
				this.appUserType = index
			},
			
			getBgList(){
				uni.request({
				    url: this.$url+'/api/live/introduceimagev2?promotionalActivityId='+this.id, 
					method: "GET",
				    
				    success: (res) => {
						this.bgList = res.data.data
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			getUser(){
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.phone = res.data.data.phone
							if(this.phone != "" && this.phone != null && this.phone != undefined){
								this.phoneDisabled = true
							}else{
								this.phoneDisabled = false
							}
							this.getSignup();
						}else{
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			//是否已报名
			getSignup(){
				uni.request({
				    url: this.$url+'/api/live/issignupv2?promotionalActivityId='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							 if(res.data.data){
								this.authorization()
							 }
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			//授权
			authorization(){
				uni.request({
				    url: this.$url+'/api/appuser/app-authorization?uuid='+this.uuid, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						this.$back()
				    }
				});
			},
			//报名
			toEnterLive(){
				if(this.EnterOneTap){
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
				if(this.appUserType == 0){
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: '请选择您的身份'
					});
					return false;
				}
				this.EnterOneTap = true
				uni.showLoading({
				    title: '正在报名'
				});
				uni.request({
				    url: this.$url+'/api/live/signupv2', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"promotionalActivityId":this.id,
						"name": this.name,
						"phone": this.phone,
						"institutionName": this.school,
						"appUserType": this.appUserType
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							uni.showToast({title: '报名成功！'});
							setTimeout(() => {
								this.authorization()
							},1000)
						}else if(res.data.code == 401){
							this.EnterOneTap = false
							this.$to401()
						}else{
							this.EnterOneTap = false
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
			
			
		}
	}
</script>

<style lang="scss">
	@import "./live.scss";
</style>
