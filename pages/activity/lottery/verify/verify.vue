<template>
	<view class="verify_content">
		<image class="prize_Img" :src="prizeImage" v-if="!status" />
		<view class="status_box" v-if="status">
			<block v-if="boxStatus">
				<image src="/static/activity/lottery/verify/success.png" />
				<text class="status_title">核销成功</text>
				<text>核销成功！<text style="color: #44D071;">{{time}}</text>秒后自动关闭此页面</text>
			</block>
			<block v-if="!boxStatus">
				<image src="/static/activity/lottery/verify/fail.png" />
				<text class="status_title">此码已核销</text>
				<text>此抽奖码已被核销，请核实信息！</text>
			</block>
		</view>
		<view class="prizeInfo_ul">
			<view class="prizeInfo_list">
				<text class="title">抽奖码：</text>
				<text class="main">{{userRaffleNo}}</text>
			</view>
			<view class="prizeInfo_list">
				<text class="title">奖项：</text>
				<text class="main">{{prizeLevelName}}</text>
			</view>
			<view class="prizeInfo_list">
				<text class="title">奖品：</text>
				<text class="main">{{prizeName}}</text>
			</view>
			
			<view class="prizeInfo_list">
				<text class="title">姓名：</text>
				<text class="main">{{userName}}</text>
			</view>
			<view class="prizeInfo_list">
				<text class="title">手机号：</text>
				<text class="main">{{phone}}</text>
			</view>
			
			<view class="prizeInfo_list">
				<text class="title">中奖时间：</text>
				<text class="main">{{prizeDate}}</text>
			</view>
			<view class="prizeInfo_list" v-if="status&&offDate!=''&&offDate!=null&&offDate!=undefined">
				<text class="title">核销时间：</text>
				<text class="main">{{offDate}}</text>
			</view>
		</view>
		<view class="btn" v-if="!status" @tap.stop="prizeoff">
			确认核销
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				"id": 0,
				"status": true,
				"boxStatus":false,
				
				"userRaffleNo": "",
				"prizeLevelName": "",
				"prizeName": "",
				
				"userName": "",
				"phone": "",
				
				"prizeDate": "",
				"offDate": "",
				
				"prizeImage": "",
				
				time:3,
				intervalID:'',
				once:false
			};
		},
		onLoad(option) {
			this.id = option.id
			this.getData()
		},
		methods:{
			getData(){
				uni.request({
					url: this.$url+'/api/rafflev2/userprizeoff?id='+this.id,
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success:(res) =>{
						if(res.data.code == 200 && res.data.success&&res.data.data!=null&&res.data.data!=''&&res.data.data!=undefined){
							this.status = res.data.data.status
							if(this.status){
								this.boxStatus = false
							}
							
							this.userRaffleNo = res.data.data.userRaffleNo
							this.prizeLevelName = res.data.data.prizeLevelName
							this.prizeName = res.data.data.prizeName
							
							this.userName = res.data.data.userName
							this.phone = res.data.data.phone
							
							this.prizeDate = res.data.data.prizeDate
							this.offDate = res.data.data.offDate
							
							this.prizeImage = res.data.data.prizeImage
						}else{
							uni.showToast({
								"title":"您没有此权限",
								"icon":"none",
								"position":"center"
							})
							setTimeout(()=>{
								this.$back()
							},1000)
						}
					}
				})
			},
			prizeoff(){
				if(this.once){
					uni.showToast({
						"title":"请勿重复点击",
						"icon":"none",
						"position":"center"
					})
				}
				this.once = true
				uni.showLoading({title:'正在核销'})
				uni.request({
					url: this.$url+'/api/rafflev2/prizeoff?id='+this.id,
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success:(res) =>{
						uni.hideLoading()
						if(res.data.code == 200 && res.data.success&&res.data.data){
							this.status = this.boxStatus = res.data.data.result
							this.offDate = res.data.data.offDate
							this.intervalID = setInterval(()=>{
								--this.time
								if(this.time == 0){
									clearInterval(this.intervalID)
									uni.switchTab({
										url:"/pages/tabBar/home/home",
										success: () => {
											this.$scanCode()
										}
									})
								}
							},1000)
						}else{
							this.once = false
							uni.showToast({
								"title":res.data.message,
								"icon":"none",
								"position":"center"
							})
						}
					},
					fail: () => {
						this.once = false
						this.$requestFail()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F2F3F5;
	}
	.verify_content{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 32upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 32upx;
	}
	.prize_Img{
		width: 560upx;
		height: 560upx;
	}
	.status_box{
		width: 560upx;
		height: 560upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		image{
			width: 228upx;
			height: 228upx;
			margin-bottom: 24upx;
		}
		.status_title{
			font-size: 48upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			line-height: 48upx;
			margin-bottom: 24upx;
		}
		.tips{
			font-size: 28upx;
			color: #999999;
			line-height: 28upx;
		}
	}
	.prizeInfo_ul{
		width: 702upx;
		background: #FFFFFF;
		border-radius: 8upx;
		box-sizing: border-box;
		padding: 64upx;
		.prizeInfo_list{
			display: flex;
			margin-top: 24upx;
			.title{
				width: 216upx;
				max-width: 216upx;
				color: #666666;
			}
			.main{
				width: calc(100% - 216upx);
			}
			&:first-of-type{
				margin-top: 0;
			}
			&:nth-of-type(4),
			&:nth-of-type(6){
				margin-top: 72upx;
			}
		}
	}
	.btn{
		width: 282upx;
		height: 80upx;
		background: #F9B50A;
		border-radius: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 28upx;
		margin: 96upx;
	}
</style>
