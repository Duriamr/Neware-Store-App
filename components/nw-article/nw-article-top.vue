<template>
	<view>
		<view class="topping" @tap="toArticle(item.id)">
			<view class="image">
				<image :src="item.url" mode="aspectFill" />
				<view class="mask"></view>
			</view>
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
			<view class="float" v-if="item.label != ''">
				{{item.label}}
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

<style lang="scss">
	.topping{
		width: calc(100% - 64rpx);
		box-sizing: border-box;
		padding-bottom: 32rpx;
		margin: 0 32rpx;
		border-bottom: 1upx solid #F5F5F5;
		position: relative;
		font-size:32upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:32upx;
		.image{
			position: relative;
			image{
				width: 100%;
				height: 280upx;
				border-radius:16upx;
			}
			.mask{
				position: absolute;
				top: 0;
				left: 0;
				width:100%;
				height:100%;
				border-radius:16upx;
				background:rgba(0,0,0,0.05);
			}
		}
		.title{
			width: 100%;
			color:rgba(51,51,51,1);
			line-height:38upx;
			margin: 24upx 0;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}
	.TVP{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-size:24upx;
		color:rgba(179,179,179,1);
		line-height:24upx;
		.time{
			margin-right: 16upx;
		}
		.spot{
			width:4upx;
			height:4upx;
			background:rgba(153,153,153,1);
			margin: 0 16upx;
		}
	}
	.float{
		font-size:24upx;
		color:rgba(51,51,51,1);
		line-height:24upx;
		background-color: #FFFFFF;
		border-radius:4upx;
		padding: 6upx 8upx;
		position: absolute;
		top: 16upx;
		right: 16upx;
		z-index: 9;
	}
</style>
