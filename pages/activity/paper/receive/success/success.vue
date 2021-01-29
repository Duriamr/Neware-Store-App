<template>
	<view class="successfulRegistration_warp">
		<view class="content">
			<view class="top">
				<image src="/static/activity/registration/check.png" class='check'/>
				<view class='signupSuccess'>提交成功！</view>
			</view>
			<view class="center">
				请添加新威工作人员微信号：xinweiyanxuan，
			</view>
			<view class="center">
				备注“论文评选+姓名+学校”加入第一届新威学术论文奖
			</view>
			<view class="center">
				专属交流群，了解奖金派发进度及更多评选细则
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
			 
		 }
	 },
	 methods:{
		 
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
