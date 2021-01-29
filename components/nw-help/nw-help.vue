<template>
	<view>
		<view class="help_content">
			<view class="help_box" v-if="helpList.length > 0">
				<view class="module_title">
					<image src="/static/activity/discount/left.png" />
					<text>更多助力好物</text>
					<image src="/static/activity/discount/right.png" />
				</view>
				
				<view class="help_ul">
					<view class="help_list" v-for="(item,index) in helpList" :key="index" @tap.stop='gotoDetaile(item)'>
						<image :src="item.mainImgUrl" />
						<view class="main">
							<view class="top">
								<view class="title">
									{{item.productName}}
								</view>
								<text class="people">
									{{item.helpNumber}}人助力
								</text>
							</view>
							
							<view class="bot">
								<view class="left">
									<text class="discountPrice">￥{{item.discountPrice}}</text>
									<text class="oncePrice">原价￥{{item.price}}</text>
								</view>
								<view class="btns" v-if="!item.status" @tap='gotoDetaile(item)'>
									立即抢
								</view>
								<view class="btns" v-if="item.status == 1" @tap='gotoDetaile(item)'>
									继续邀请
								</view>
								<view class="btns" v-if="item.status == 2 || item.status == 3" @tap='gotoDetaile(item)'>
									<view class="yes" v-if="item.status == 2">助力成功</view>
									<text class="no" v-if="item.status == 3">助力失败</text>
									查看详情
								</view>
								<view @tap.stop='handleOver' class="btns" style="background: #E5E5E5;color: #B3B3B3;" v-if="item.status == 4">
									已抢光
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'help',
		data() {
			return {
				helpList:[],
				userId:uni.getStorageSync('onlyID')||0,
			};
		},
		props:{
			'productId':{
				type:String,
				default: "0"
			},
			'campaignId':{
				type:String,
				default: "0"
			}
		},
		created() {
			this.getHelpData()
		},
		
		methods:{
			getHelpData(){
				uni.request({
				    url: this.$url+'/api/campaignnew/getmorehelpproduct', 
					data:{
						  "userId": this.userId,
						  "productId": this.productId,
						  "campaignId": this.campaignId
					},
					method: "POST",
				    
				    success: (res) => {
						this.helpList = res.data.data
				    },
					fail: () => {
						this.getHelpData()
					}
				});
			},
			//  去抢购
			gotoDetaile(item){
				if(item.status != 4){
					uni.navigateTo({
						url:`/pages/activity/discount/helpdetails/helpdetails?userId=${this.userId}&productId=${item.productId}&campaignId=${item.campaignId}`
					})
				}else{
					this.handleOver()
				}
			},
			/* 已抢光 */
			handleOver(){
				uni.showToast({
					title:'已抢光',
					icon:'none',
					position:'center'
				})
			},
			
			//跳转商品
			goTogoods(item){
				uni.navigateTo({
					url:"/pages/sort/goods/goods?goodsId="+item.productId,
				 })
			},
		}
	}
</script>

<style lang="scss" scoped>
	.help_content{
		width: 100%;
		box-sizing: border-box;
		padding: 0 16upx 16upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
	}
	.help_box{
		width: 100%;
		background: #FFFFFF;
		border-radius: 16upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.module_title{
			width: 100%;
			padding: 30upx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			text{
				font-size: 28upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #F75C50;
				line-height: 28upx;
				margin: 0 24upx;
			}
			image{
				width: 44upx;
				height: 16upx;
			}
		}
		.help_ul{
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			.help_list{
				width: 100%;
				box-sizing: border-box;
				padding: 24upx;
				border-bottom: 2upx solid #F5F5F5;
				display: flex;
				image{
					width: 192upx;
					height: 192upx;
					margin-right: 16upx;
				}
				.main{
					width: calc(100% - 192upx - 16upx);
					box-sizing: border-box;
					padding: 8upx 0;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.top{
						width: 100%;
						.title{
							width: 100%;
							font-size: 28upx;
							color: #333333;
							line-height: 34upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							margin-bottom: 16upx;
						}
						.people{
							display: inline-block;
							font-size: 24upx;
							color: #F75C50;
							height: 40upx;
							line-height: 40upx;
							padding: 0 12upx;
							box-sizing: border-box;
							background: rgba(247, 92, 80, 0.2);
							border-radius: 8upx;
						}
					}
					.bot{
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						.left{
							padding-bottom: 6upx;
							.discountPrice{
								font-size: 36upx;
								font-family: PingFangSC-Medium, PingFang SC;
								font-weight: 500;
								color: #F75C50;
								line-height: 36upx;
								margin-right: 8upx;
							}
							.oncePrice{
								font-size: 24upx;
								color: #B3B3B3;
								line-height: 24upx;
								text-decoration: line-through;
								position: relative;
								bottom: 2upx;
							}
						}
						
						.btns{
							width: 156upx;
							height: 60upx;
							background: linear-gradient(135deg, #FF4A4A 0%, #FF6E37 100%);
							border-radius: 30upx;
							font-size: 28upx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #FFFFFF;
							line-height: 28upx;
							display: flex;
							justify-content: center;
							align-items: center;
							
							position: relative;
							.yes,
							.no{
								font-size: 24upx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #F75C50;
								line-height: 24upx;
								
								position: absolute;
								top: -32upx;
								left: 30upx;
							}
							.no{
								color: #666666;
							}
						}
					}
				}
				
				&:last-of-type{
					border-bottom: none;
					border-radius: 0 0 16upx 16upx;
				}
			}
		}
	}
</style>
