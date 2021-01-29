<template>
	<view>
		<view class="share" :class="shareShow" @touchmove.stop.prevent @tap.stop="hideShare">
			<view class="layer" @tap.stop>
				<view class="share_content">
					<view class="title">
						分享
					</view>
					<view class="shareUl">
						<view class="shareList" @tap.stop="$shareWX(shareObj)">
							<image src="/static/public/share/wx.png" />
							<view class="shareName">
								微信好友
							</view>
						</view>
						<view class="shareList" @tap.stop="$sharePYQ(shareObj)">
							<image src="/static/public/share/pyq.png" />
							<view class="shareName">
								朋友圈
							</view>
						</view>
						<!-- <view class="shareList" @tap.stop="$shareQQ(shareObj)">
							<image src="/static/public/share/qq.png" />
							<view class="shareName">
								QQ
							</view>
						</view> -->
						<view class="shareList" @tap.stop="$shareCopy(shareObj)">
							<image src="/static/public/share/copy.png" />
							<view class="shareName">
								复制链接
							</view>
						</view>
					</view>
				</view>
				<view class="share_btn" @tap.stop="hideShare">
					取消
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'share',
		data() {
			return {
				
			};
		},
		props:{
			shareObj:Object,
			shareShow:{
				type: String,
				default: ""
			}
		},
		methods:{
			hideShare() {
				this.$emit("hideShare");
			},
			// shareWX(obj){
			// 	uni.share({
			// 		provider: "weixin",
			// 		type: 0,
			// 		scene: "WXSceneSession",
			// 		title:obj.title,
			// 		summary:obj.summary,
			// 		href:obj.href,
			// 		imageUrl:obj.imageUrl,
			// 		complete: (res) => {
			// 			this.hideShare()
			// 		},
			// 		fail: (err) => {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				position: 'bottom',
			// 				title: '发生错误请重试'
			// 			});
			// 		}
			// 	});
			// },
			// sharePYQ(obj){
			// 	uni.share({
			// 		provider: "weixin",
			// 		type: 0,
			// 		scene: "WXSenceTimeline",
			// 		title:obj.title,
			// 		summary:obj.summary,
			// 		href:obj.href,
			// 		imageUrl:obj.imageUrl,
			// 		complete: (res) => {
			// 			this.hideShare()
			// 		},
			// 		fail: (err) => {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				position: 'bottom',
			// 				title: '发生错误请重试'
			// 			});
			// 		}
			// 	});
			// },
			// shareQQ(obj){
			// 	uni.share({
			// 		provider: "qq",
			// 		type: 0,
			// 		title:obj.title,
			// 		summary:obj.summary,
			// 		href:obj.href,
			// 		imageUrl:obj.imageUrl,
			// 		complete: (res) => {
			// 			this.hideShare()
			// 		},
			// 		fail: (err) => {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				position: 'bottom',
			// 				title: '发生错误请重试'
			// 			});
			// 		}
			// 	})
			// },
			// shareCopy(obj){
			// 	uni.setClipboardData({
			// 		data:obj.href,
			// 		complete: (res) => {
			// 			this.hideShare()
			// 		},
			// 		fail: (err) => {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				position: 'bottom',
			// 				title: '发生错误请重试'
			// 			});
			// 		}
			// 	})
			// },
		}
	}
</script>

<style lang="scss" scoped>
	.share{
		width: 100vw;
		height: 100vh;
		position: fixed;
		bottom: 0;
		z-index: 1000;
		background-color: rgba(0,0,0,0.5);
		display: none;
		.layer{
			width: 100%;
			position: fixed;
			bottom: 0;
			box-sizing: border-box;
			padding: 0;
			border-radius: 24upx 24upx 0 0;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			.share_content{
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				box-sizing: border-box;
				padding: 0 38upx;
				.title{
					height: 124upx;
					font-size:36upx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(17,17,17,1);
					line-height:36upx;
					display: flex;
					align-items: center;
				}
				.shareUl{
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					margin-bottom: 32upx;
					.shareList{
						width: 25%;
						display: flex;
						flex-direction: column;
						align-items: center;
						image{
							margin: 16upx 0;
							width: 80upx;
							height: 80upx;
						}
						.shareName{
							font-size:28upx;
							font-family:PingFangSC-Regular,PingFang SC;
							font-weight:400;
							color:rgba(102,102,102,1);
							line-height:28upx;
							margin-bottom: 16upx;
						}
					}
				}
			}
			.share_btn{
				width: 100%;
				height: 98upx;
				border-top: 1upx solid #E5E5E5;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:28upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(102,102,102,1);
				line-height:28upx;
			}
		}
		&.show {
			display: block;
			animation: showPopup 0.2s linear both;
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			display: block;
			animation: hidePopup 0.2s linear both;
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
	}
	@keyframes showLayer {
		0% {
			transform: translateY(100%);
		}
		100% {
			transform: translateY(0);
		}
	}
	@keyframes hideLayer {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(100%);
		}
	}
	@keyframes showPopup {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hidePopup {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
