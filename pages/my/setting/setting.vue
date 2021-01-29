<template>
	<view class="setting_content">
		<view class="ul">
			<view class="list" @tap="toFeedback">
				<view class="inside">
					<text>意见反馈</text>
					<image src="/static/public/go_grey.png" />
				</view>
			</view>
			<view class="list" @tap="toAbout">
				<view class="inside">
					<text>关于我们</text>
					<image src="/static/public/go_grey.png" />
				</view>
			</view>
		</view>
		
		<view class="ul">
			<view class="list" @tap="toReAgree">
				<view class="inside">
					<text>用户服务协议</text>
					<image src="/static/public/go_grey.png" />
				</view>
			</view>
			<view class="list" @tap="toPrAgree">
				<view class="inside">
					<text>用户隐私协议</text>
					<image src="/static/public/go_grey.png" />
				</view>
			</view>
		</view>
		
		<view class="out" @tap="logout" v-if="loginType">
			退出登录
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:"",
				loginType:false,
			};
		},
		onShow(){
			this.token = uni.getStorageSync('token');
			// this.getUser();
		},
		watch:{
			token:function(val){
				if(val != null && val != "" && val != undefined){
					this.loginType = true
				}else{
					this.loginType = false
				}
			},
		},
		methods:{
			logout(){
				uni.showModal({
					title: '提示',
					content: '是否退出登录？',
					confirmColor: '#F8B500',
					success: (res)=>{
						if (res.confirm) {
							let tok = this.token
							this.duration(1,tok)
							uni.request({
							    url: this.$url+'/api/appuser/logout', 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "GET",
							    
							    success: (res) => {
									// if(res.data.success&&res.data.code == 200){
										uni.removeStorageSync('token');
										uni.removeStorageSync('myAvatar');
										uni.removeStorageSync('onlyID');
										uni.removeStorageSync('myID');
										uni.removeStorageSync('myNickname');
										uni.showToast({
										    icon: 'none',
											position: 'bottom',
										    title: "成功退出登录"
										});
										setTimeout(()=>{
											this.$toHome()
										},1000)
									// }
							    },
								fail: (err) => {
									this.$requestFail()
								}
							});
						} else if (res.cancel) {
							uni.showToast({
							    icon: 'none',
								position: 'bottom',
							    title: '已取消'
							});
						}	
					}
				});
			},
			toFeedback(){
				uni.navigateTo({
					url:'/pages/my/setting/feedback/feedback'
				})
			},
			toAbout(){
				uni.navigateTo({
					url:'/pages/my/setting/about/about'
				})
			},
			toReAgree(){
				uni.navigateTo({
					url:"/pages/agreement/registrationAgreement"
				})
			},
			toPrAgree(){
				uni.navigateTo({
					url:"/pages/agreement/privacyAgreement"
				})
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
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.setting_content{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:#111111;
		line-height:28upx;
		padding-top: 20upx;
		.ul{
			width: 100%;
			margin-bottom: 20upx;
			.list{
				width:100%;
				background:#FFFFFF;
				box-sizing: border-box;
				padding: 0 24upx;
				.inside{
					width: 100%;
					height: 88upx;
					border-bottom: 1upx solid #F5F5F5;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				image{
					width: 32upx;
					height: 32upx;
				}
			}
		}
		.out{
			width:100%;
			height:88upx;
			background:#FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			color:#666666;
		}
	}
</style>
