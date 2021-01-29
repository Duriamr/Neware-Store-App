<template>
	<view class="video_content">
		<view class="video_list" v-if="item.url != ''" @tap.stop="toArticle(item.id)">
			<view class="left">
				<view class="title">
					{{item.title}}
				</view>
				<view class="TVP">
					<view class="time">
						{{item.createTime}}
					</view>
					<view>
						{{item.pageViews}}&#8194;浏览
					</view>
					<view class="spot"></view>
					<view>
						{{item.pointNumber}}&#8194;点赞
					</view>
				</view>
			</view>
			<view class="right" :style="{backgroundImage: 'url('+ item.url +')'}">
				<view class="mask"></view>
			</view>
			<view class="float" v-if="item.label != ''">
				{{item.label}}
			</view>
		</view>
		
		<view class="video_list_noImg" v-if="item.url == ''" @tap.stop="toArticle(item.id)">
			<view class="title">
				{{item.title}}
			</view>
			<view class="TVP">
				<view>
					{{item.pageViews}}&#8194;浏览
				</view>
				<view class="spot"></view>
				<view>
					{{item.pointNumber}}&#8194;点赞
				</view>
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
		},
		methods:{
			toArticle(id){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif  
				uni.navigateTo({
					url:"/pages/studyEnjoy/article/article?id="+id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.video_content{
		width: 750upx;
		background: #FFFFFF;
		.video_list{
			width: calc(100% - 64rpx);
			box-sizing: border-box;
			padding: 32rpx 0;
			margin: 0 32rpx;
			border-bottom: 1rpx solid #F5F5F5;
			display: flex;
			justify-content: space-between;
			position: relative;
			font-size:32rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			line-height:38rpx;
			.left{
				width: 446rpx;
				height:160rpx;
				box-sizing: border-box;
				padding: 8rpx 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
					width: 100%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
			.right{
				width:216rpx;
				height:160rpx;
				border-radius:16rpx;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				.mask{
					width:100%;
					height:100%;
					border-radius:16rpx;
					background:rgba(0,0,0,0.05);
				}
			}
			
		}
		.video_list_noImg{
			width: 100%;
			box-sizing: border-box;
			padding: 32rpx;
			border-bottom: 1rpx solid #F5F5F5;
			display: flex;
			flex-direction: column;
			font-size:32rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			line-height:38rpx;
			.title{
				width: 100%;
				margin-bottom: 44rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
		.float{
			font-size:24rpx;
			color:rgba(51,51,51,1);
			line-height:24rpx;
			background-color: #FFFFFF;
			border-radius:4rpx;
			padding: 6rpx 8rpx;
			position: absolute;
			top: 48rpx;
			right: 16rpx;
			z-index: 9;
		}
		.TVP{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			font-size:24rpx;
			color:rgba(179,179,179,1);
			line-height:24rpx;
			.time{
				margin-right: 16rpx;
			}
			.spot{
				width:4rpx;
				height:4rpx;
				background:rgba(153,153,153,1);
				margin: 0 16rpx;
			}
		}
	}
</style>
