<template>
	<view class="live_content">
		<view class="live_list">
			<view class="list_left">
				<text class="left_title">{{item.name}}</text>
				<view class="left_bot">
					<text>{{item.lecturerName}}</text>
					<text class="time" v-if="item.status==1">{{item.startDateTime}}</text>
				</view>
			</view>
			<view class="list_right">
				<view class="img_box">
					<image class="image" :src="item.guideImageUrl"></image>
					<view class="liveing" v-if="item.status==0">
						<image src="/static/studyEnjoy/live/live.png"></image>
						<text>LIVE</text>
					</view>
				</view>
				<text v-if="item.status==2">{{item.playBackNumber}}人播放</text>
				<text v-else>{{item.virtualPeopleNumber}}人报名</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			item:Object,
		}
	}
</script>

<style lang="scss">
	.live_content{
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		line-height: 24rpx;
		
		width: 750rpx;
		box-sizing: border-box;
		padding: 0 32rpx;
		background-color: #FFFFFF;
	}
	.live_list{
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 240rpx;
		box-sizing: border-box;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F5F5F5;
		.list_left{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 418rpx;
			height: 100%;
			.left_title{
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				line-height: 38rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.left_bot{
				display: flex;
				flex-direction: column;
				.time{
					margin-top: 16rpx;
				}
			}
		}
		.list_right{
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			justify-content: space-between;
			width: 236rpx;
			height: 100%;
			.img_box{
				position: relative;
				width: 236rpx;
				height: 144rpx;
				border-radius: 4px;
				overflow: hidden;
				.image{
					width: 100%;
					height: 100%;
				}
				.liveing{
					position: absolute;
					top: 0;
					left: 0;
					display: flex;
					align-items: center;
					width: 102rpx;
					height: 32rpx;
					background: linear-gradient(315deg, #FC9900 0%, #F8B500 100%);
					border-radius: 0 0 8rpx 0;
					image{
						margin: 0 6rpx 0 14rpx;
						width: 21rpx;
						height: 20rpx;
					}
					text{
						font-size: 22rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 22rpx;
					}
				}
			}
		}
	}
</style>
