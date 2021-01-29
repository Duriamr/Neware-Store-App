<template>
	<view class="successfulRegistration_warp">
		<view class="content">
			<view class="top">
				<image src="/static/activity/registration/check.png" class='check'/>
				<view class='signupSuccess'>报名成功！</view>
			</view>
			<view class="center">
				{{signtrainresult}}
			</view>
			<view class="btn">
				<text class="copy" @tap="copyWx">复制小威微信号</text>
				<text class="goback" @tap="$toHome()">返回首页</text>
			</view>
			<view class="Qrcode">
				<image src="/static/activity/registration/appQR.png" @tap='previewImg'></image>
				<view class="text">
					<text>新威研选-小威 微信号</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
 export default{
	 data(){
		 return{
			 token:uni.getStorageSync('token'),
			 signtrainresult:'',
		 }
	 },
	 onLoad(options) {
	 	this.getsigntrainresult(options.id)
	 },
	 methods:{
		 getsigntrainresult(id){
			 uni.request({
			 	url:this.$url +'/api/live/signtrainresult?promotionalActivityId='+id,
				method:'get',
				header:{
					Authorization:'Bearer ' + this.token
				},
				success:(res) =>{
					if(res.data.code == 200 && res.data.success){
						this.signtrainresult = res.data.data
					}
				},
				fail: (err) => {
					this.$requestFail()
				}
			 })
		 },
		 
		 //  复制微信号
		 copyWx(){
			uni.setClipboardData({
				data:'xinweiyanxuan',
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
		 },
		 
		 // 查看图片
		 previewImg(){
		 	uni.previewImage({
		 		current:0,
		 		urls:['/static/activity/registration/appQR.png']
		 	})
		 },
	 }
 }
</script>

<style lang="scss">
	@import './success.scss'
</style>
