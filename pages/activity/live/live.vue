<template>
	<view class="live_content">
		<image class="live" :src="item" mode="widthFix" lazy-load="true" v-for="(item,index) in bgList" :key="'bgList'+index" />
		
		<!-- #ifndef H5 -->
		<block v-if="!liveShow">
			<view class="footer_placeholder"></view>
			<view class="footer" @tap.stop="showEnter">
				点 击 报 名
			</view>
		</block>
		
		<block v-if="liveShow">
			<view class="footer_placeholder" style="height: 176upx;"></view>
			<view class="footer" style="background-color:#F75C50;bottom:88upx" @tap.stop="toLive">
				观 看 直 播
			</view>
			<view class="footer" @tap.stop="copyLive" v-if="liveShow">
				电脑浏览器观看(点击复制链接)
			</view>
		</block>
		<!-- #endif -->  
		
		<view class="enter_content" v-if="enterShow" @touchmove.stop.prevent @tap.stop="hideEnter">
			<view class="enter" @tap.stop>
				<image class="x" src="/static/x.png" @tap.stop="hideEnter" />
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
		
		<!-- #ifdef H5 -->
		<h5Footer />
		<!-- #endif -->  
		
		<!-- #ifdef APP-PLUS -->
		<share :shareShow="shareShow" :shareObj="shareObj" @hideShare="$hideShare()" />
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
				token:uni.getStorageSync('token'),
				id:0,
				
				bgList:[],
				liveShow:false,//是否报名
				enterShow:false,//显示报名
				
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
				
				//分享区
				shareShow:'',
				shareObj:{},

				//点击区
				EnterOneTap:false,
				LiveOneTap:false,
			};
		},
		onLoad(options) {
			this.id = options.id
			this.getBgList()
			this.getShare()
		},
		onShow() {
			this.hideEnter();
			this.token = uni.getStorageSync('token');
			this.getSignup();
			this.getUser();
			this.LiveOneTap = false;
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.showShare()
			}
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
			getShare(){
				uni.request({
				    url: this.$url+'/api/live/shareinfo?promotionalActivityId='+this.id, 
					method: "GET",
				    
				    success: (res) => {
						this.shareObj = {
							title:res.data.data.title,
							summary:res.data.data.shareContent,
							href:this.$h5Url+'/pages/activity/live/live?id='+this.id,
							imageUrl:res.data.data.shareImg,
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
							this.loginType = true
							this.phone = res.data.data.phone
							if(this.phone != "" && this.phone != null && this.phone != undefined){
								this.phoneDisabled = true
							}else{
								this.phoneDisabled = false
							}
						}else{
							this.loginType = false
						}
				    }
				});
			},
			
			
			//显示报名
			showEnter(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
				this.shareShow = 'none';
				if(this.loginType){
					this.enterShow = true
				}else{
					this.$to401()
				}
			},
			//隐藏报名
			hideEnter(){
				this.enterShow = false
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
							uni.showToast({
								icon: 'success',
								position: 'center',
								title: '报名成功！'
							});
							setTimeout(() => {
								this.toLive();
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
			
			toLive(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
				if(this.LiveOneTap){
					return false;
				}
				this.LiveOneTap = true
				uni.request({
				    url: this.$url+'/api/live/watchlivev2?promotionalActivityId='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.setStorageSync('liveUrl', res.data.data);
							uni.navigateTo({
								url:"/pages/browser/liveBrowser"
							})
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							this.LiveOneTap = false
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
			copyLive(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
				uni.showLoading({
				    title: '正在获取链接'
				});
				uni.request({
				    url: this.$url+'/api/live/watchlivev2?promotionalActivityId='+this.id, 
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
				this.hideEnter();
				this.shareShow = 'show';
			},
		}
	}
</script>

<style lang="scss">
	@import "./live.scss";
</style>
