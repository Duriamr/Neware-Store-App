<template>
	<view class="lottery_content">
		<image class="header" src="/static/activity/lottery/lottery/phone/header.png" mode="widthFix" />
		<view class="main" v-if="!pages">
			<image :src="mainImg1" mode="widthFix" />
			<view class="btn" @tap.stop="getLuckyID">
				获取幸运抽奖码
			</view>
		</view>
		<view class="main" v-if="pages">
			<image :src="mainImg2" mode="widthFix" />
			<text>{{luckyID}}</text>
			<view class="tips">
				活动主办方新威，主办方在法律规定的范围内拥有解释权
			</view>
		</view>
		
		<image class="round1" src="/static/activity/lottery/lottery/phone/round_1.png" mode="widthFix" v-if="!pages" />
		<image class="round2" src="/static/activity/lottery/lottery/phone/round_2.png" mode="widthFix" v-if="pages" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				id:Number,
				
				//背景图区
				pages:0,
				mainImg1:'',
				mainImg2:'',
				
				luckyID:''
			};
		},
		onLoad(options) {
			this.id = options.id
			
			this.getLoadData()
			this.getStatus()
		},
		methods:{
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/rafflev2/raffle?id='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.mainImg1 = res.data.data.top
							this.mainImg2 = res.data.data.down
						}
					}
				});
			},
			getStatus(){
				uni.request({
				    url: this.$url+'/api/rafflev2/rafflestatus?id='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success: (res) => {
						if(res.data.success&&res.data.code == 200){
							if(res.data.data!=''&&res.data.data!=null&&res.data.data!=undefined){
								this.luckyID = res.data.data
								this.pages = 1
							}else{
								this.pages = 0
							}
						}else{
							this.pages = 0
						}
					}
				});
			},
			getLuckyID(){
				uni.request({
				    url: this.$url+'/api/rafflev2/getlucky?id='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.luckyID = res.data.data
							this.pages = 1
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "./phone.scss";
</style>
