<template>
	<view class="logistics_content">
		<view class="header">
			<view class="right">
				<view class="list" style="margin-bottom: 16upx;">
					<view class="r_left">
						配送企业
					</view>
					<view class="r_right">
						{{expressName}}
					</view>
				</view>
				<view class="list">
					<view class="r_left">
						快递单号
					</view>
					<view class="r_right">
						{{expressNum}}
					</view>
					<!-- #ifndef H5 -->   
					<view class="vertical"></view>
					<view class="copy" @tap="setCopy">
						复制
					</view>
					<!-- #endif -->   
				</view>
			</view>
		</view>
		
		<view class="info">
			<view class="status">
				<view class="left">
					<image src="/static/order/orderDetails/logistics/logistics_0.png" v-if="status == '0'" />
					<image src="/static/order/orderDetails/logistics/logistics_1.png" v-if="status == '1'" />
					<image src="/static/order/orderDetails/logistics/logistics_2.png" v-if="status == '2'" />
					<image src="/static/order/orderDetails/logistics/logistics_3.png" v-if="status == '3'" />
					<image src="/static/order/orderDetails/logistics/logistics_4.png" v-if="status == '4'" />
					<image src="/static/order/orderDetails/logistics/logistics_5.png" v-if="status == '5'" />
					<image src="/static/order/orderDetails/logistics/logistics_4.png" v-if="status == '6'" />
					<image src="/static/order/orderDetails/logistics/logistics_4.png" v-if="status == '14'" />
				</view>
				
				<view class="right">
					<text v-if="status == '0'">运输中</text>
					<text v-if="status == '1'">已揽件</text>
					<text v-if="status == '2'">疑难件</text>
					<text v-if="status == '3'">已签收</text>
					<text v-if="status == '4'">退签</text>
					<text v-if="status == '5'">派件中</text>
					<text v-if="status == '6'">退回</text>
					<text v-if="status == '14'">收件人拒签</text>
				</view>
			</view>
			
			<view class="infoUl">
				<view class="infoList" v-for="(item, index) in infoList" :key="index">
					<view class="dot"></view>
					<view class="dot_top"></view>
					<view class="context">
						{{item.context}}
					</view>
					<view class="time" v-if="item.time != ''">
						{{item.time}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:'',
				status:'',
				expressName:'',
				expressNum:'',
				infoList:[]
			};
		},
		onLoad(option) {
			this.expressNum = option.exNum
			this.token = uni.getStorageSync('token');
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.showLoading({
				    title: '信息加载中'
				});
				uni.request({
				    url: this.$url+'/api/logistics/info-number?number='+this.expressNum+'&expressName=0', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.hideLoading()
						this.status = res.data.data.status
						this.expressName = res.data.data.expressName
						this.expressNum = res.data.data.num
						this.infoList = res.data.data.logisticDetails
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			// #ifndef H5
			setCopy(){
				uni.setClipboardData({
					data:this.expressNum
				})
			},
			// #endif 
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	image{
		display: block;
	}
	.logistics_content{
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		box-sizing: border-box;
		padding: 20upx;
	}
	.header{
		width:100%;
		height:200upx;
		background:rgba(255,255,255,1);
		box-sizing: border-box;
		padding-left: 20upx;
		margin-bottom: 20upx;
		border-radius: 16upx;
		display: flex;
		align-items: center;
		.left{
			width:160upx;
			height:160upx;
			margin-right: 24upx;
			position: relative;
			.bot{
				width: 100%;
				height: 40upx;
				background:rgba(0,0,0,0.5);
				font-size:24upx;
				font-family:PingFangSC-Light,PingFang SC;
				font-weight:300;
				color:rgba(255,255,255,1);
				line-height:24upx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				bottom: 0;
			}
			image{
				width:100%;
				height:100%;
				border-radius:8upx 8upx 0 0;
			}
		}
		
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			.list{
				font-size:24upx;
				line-height:24upx;
				display: flex;
				align-items: center;
				.r_left{
					font-family:PingFangSC-Light,PingFang SC;
					font-weight:300;
					color:rgba(102,102,102,1);
					margin-right: 24upx;
				}
				.vertical{
					width:2upx;
					height:24upx;
					background-color: #E5E5E5;
					margin: 0 14upx;
				}
				.copy{
					font-family:PingFangSC-Light,PingFang SC;
					font-weight:300;
					color:rgba(248,181,0,1);
				}
			}
		}
	}
	.info{
		width:100%;
		background:rgba(255,255,255,1);
		box-sizing: border-box;
		padding: 34upx 20upx;
		border-radius: 16upx;
		display: flex;
		flex-direction: column;
		.status{
			height: 40upx;
			display: flex;
			align-items: center;
			.left{
				margin-right: 24upx;
				image{
					width: 40upx;
					height: 40upx;
					// z-index: 2;
				}
			}
			.right{
				font-size:32upx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				line-height:32upx;
			}
		}
		.infoUl{
			width: 100%;
			box-sizing: border-box;
			padding-left: 20upx;
			.infoList{
				width: 100%;
				box-sizing: border-box;
				padding: 56upx 0 0 46upx;
				border-left: 2upx solid #E5E5E5;
				font-size:28upx;
				color:rgba(179,179,179,1);
				line-height:36upx;
				position: relative;
				z-index: 1;
				.dot{
					width:16upx;
					height:16upx;
					background:rgba(229,229,229,1);
					border-radius: 100%;
					position: absolute;
					top: 66upx;
					left: -8upx;
				}
				.context{
					width: 100%;
				}
				.time{
					width: 100%;
					font-size:24upx;
					color:rgba(179,179,179,1);
					line-height:24upx;
					margin-top: 30upx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
			.infoList:last-of-type{
				padding: 56upx 0 0 46upx;
				border-left: 2upx solid #FFFFFF;
				.dot_top{
					width: 0upx;
					background-color: #2C405A;
					height: 66upx;
					border-left: 2upx solid #E5E5E5;
					position: absolute;
					top: 0upx;
					left:-2upx;
				}
			}
			.infoList:first-of-type{
				padding: 24upx 0 0 46upx;
				color:rgba(51,51,51,1);
				.dot,
				.dot_top{
					display: none;
				}
			}
		}
	}
</style>
