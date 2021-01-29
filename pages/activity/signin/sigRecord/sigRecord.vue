<template>
	<view class="sigRecord">
		<empty marginTop="328upx" src="/static/expect/not_Order.png" text="您还没有兑换任何礼品哦" v-if="recordList.length <= 0" />
		<view class="record_ul" v-if="recordList.length > 0">
			<view class="record_list" v-for="(item,index) in recordList" :key="index">
				<view class="left">
					<image :src="item.productImage" />
					<view class="info">
						<view class="title">{{item.productName}}</view>
						<view>{{item.exchangeDate}}</view>
					</view>
				</view>
				<view class="right" v-if="item.trackingNumber == null || item.trackingNumber == ''">
					<view>等待发货</view>
				</view>
				<view class="right" v-if="item.trackingNumber != null && item.trackingNumber != ''" @tap="toLogistics(item.trackingNumber, item.expressName, item.productImage)">
					<view>查看物流</view>
					<image src="/static/activity/signin/carrow.png" mode="widthFix" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {empty},
		data() {
			return {
				token:'',
				recordList:[]
			};
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/appsignin/exchangerecord?type=4', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.recordList = res.data.data
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			toLogistics(exNum,exName,productImage){
				uni.navigateTo({
					url:"/pages/activity/signin/sigRecord/sigLogistics?exNum="+exNum+"&exName="+exName+"&imgUrl="+productImage
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background:rgba(245,245,245,1);
	}
	image{
		display: block;
	}
	.record_ul{
		margin-top: 20upx;
		width: 100%;
		min-height: calc(100vh - 20upx);
		/* #ifdef H5*/
		min-height: calc(100vh - 20upx - 88upx);
		/* #endif */ 
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 24upx;
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:#B3B3B3;
		line-height:24upx;
		.record_list{
			width: 100%;
			padding: 24upx 0;
			border-bottom: 1upx solid #F5F5F5;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left{
				display: flex;
				align-items: center;
				image{
					width: 112upx;
					height: 112upx;
					margin-right: 16upx;
				}
				.info{
					display: flex;
					flex-direction: column;
					.title{
						font-size:28upx;
						color:rgba(51,51,51,1);
						line-height:28upx;
						margin-bottom: 16upx;
					}
				}
			}
			.right{
				display: flex;
				align-items: center;
				image{
					width: 10upx;
					margin-left: 4upx;
				}
			}
		}
	}
</style>
