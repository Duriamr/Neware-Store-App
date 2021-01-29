<template>
	<view class="live_content">
		<image class="live" :src="item" mode="widthFix" lazy-load="true" v-for="(item,index) in bgList" :key="'bgList'+index" />
		
		<view class="form" v-if="!liveShow">
			<view class="tips">* 所填资料只作为参会签到作用</view>
			<view class="input_ul">
				<view class="input_list">
					<view class="name">
						个人姓名<text>*</text>
					</view>
					<input v-model="name" type="text" placeholder="请输入您的姓名" :focus="nameFocus" maxlength="10" @blur="blur(name)" />
				</view>
				
				<view class="input_list">
					<view class="name">
						手机号码<text>*</text>
					</view>
					<input v-model="phone" type="number" placeholder="请输入手机号码" :focus="phoneFocus" :disabled="phoneDisabled" maxlength="11" @blur="blur(phone)" />
				</view>
				
				<view class="input_list">
					<view class="name">
						单位名称<text>*</text>
					</view>
					<input v-model="school" type="text" :focus="schoolFocus" placeholder="请填写您的真实信息" @blur="blur(school)" />
				</view>
			</view>
			
			<view class="tips2">为助力疫情防控，我承诺所填信息真实有效</view>
			<image class="btn" src="/static/activity/live/btn.png" mode="widthFix" @tap.stop="toEnterLive" />
		</view>
		<view class="form success" v-if="liveShow">
			<image class="success_img" src="/static/activity/live/success.png" mode="widthFix" />
			<text class="success_title">签到成功！</text>
			<text class="success_welcome">欢迎您！{{name}}</text>
			<text class="success_tips">请凭此页面进入会场</text>
			<text class="success_link" @tap.stop="toRule">点击查看《参会指南》</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				id:0,
				
				bgList:[],
				liveShow:false,//是否报名
				enterShow:false,//显示报名
				
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
			this.name = uni.getStorageSync(`signupName${this.id}`)
			this.getBgList()
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getSignup();
			this.getUser();
			this.LiveOneTap = false;
		},
		methods:{
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
							this.liveShow = res.data.data
						}
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
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			
			//报名
			toEnterLive(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
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
				        title: '单位名称不能为空'
				    });
				    return false;
				}
				this.EnterOneTap = true
				uni.showLoading({
				    title: '正在签到'
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
							uni.showToast({
								icon: 'success',
								position: 'center',
								title: '签到成功！'
							});
							uni.setStorageSync(`signupName${this.id}`,this.name);
							this.liveShow = true
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
			toRule(){
				uni.navigateTo({
					url:"/pages/browser/browser?src=https://shop.neware.com.cn/rule/#/pages/rule/signup"
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./live.scss";
</style>
