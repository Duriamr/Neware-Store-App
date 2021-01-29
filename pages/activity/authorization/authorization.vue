<template>
	<view class="authorization_content">
		<view class="center">
			<image src="/static/activity/authorization/computer.png"></image>
			<view class="title">授权登录论文评选报名表</view>
		</view>
		<view class="submit">
			<text @tap="handleSub" class="btn">登 录</text>
		</view>
		<view class="cancel">
			<text @tap="$back">取消登录</text>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				id:'',
				url:'',
				loading:true,
				token:uni.getStorageSync('token')
			}
		},
		onLoad(option) {
			this.url = JSON.parse(option.res).Url+'?uuid='+JSON.parse(option.res).UId
		},
		methods:{
			handleSub(){
				if(!uni.getStorageSync('token')){
					this.$to401()
					return false
				}
				uni.request({
					url:this.url,
					method:'get',
					header:{
						Authorization:'Bearer '+uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							uni.navigateBack()
							uni.showToast({
								title: res.data.message
							})
						}else{
							uni.showToast({
								icon:'none',
								title: res.data.message
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
@import  './authorization.scss'
</style>
