<template>
	<view>
		<view class="guess_content" v-if="guessList.length > 0">
			<!-- 猜你喜欢title -->
			<view class="guess_title">
				<view class="dot_small"></view>
				<view class="dot_big"></view>
				<text class="text">猜你喜欢</text>
				<view class="dot_big"></view>
				<view class="dot_small"></view>
			</view>
			
			<!-- 猜你喜欢区 -->
			<view class="guess">
				<view class="guess_list" v-for="(item, index) in guessList" :key="index" @tap="$toGoods(item.id)">
					<image class="image" :src="item.imgUrl"/>
					<view class="list_bot">
						<text class="title">{{item.productName}}</text>
<!-- 						<text class="subTitle" :class="item.sellingPoints == null ? ' title_placeholder' : ''">{{item.sellingPoints}}</text> -->
						<view class="bot" v-if="item.salePrice>=0">
							<text class="currency">￥</text>
							<text class="price">{{item.salePrice}}</text>
						</view>
						<view class="bot" v-if="item.salePrice<0">
							<text class="price">价格请联系客服</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'guess',
		data() {
			return {
				guessList:[]
			};
		},
		created() {
			this.getGuessData()
		},
		methods:{
			getGuessData(){
				uni.request({
				    url: this.$url+'/api/product/like', 
					method: "GET",
				    
				    success: (res) => {
						this.guessList = res.data.data
				    }
				});
			},
		}
	}
</script>

<style lang="scss">
	.guess_content{
		width: 100%;
		box-sizing: border-box;
		padding: 0 24upx;
		display: flex;
		flex-direction: column;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:#111111;
	}
	.guess_title{
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 32upx 0;
		.dot_small{
			width:10upx;
			height:10upx;
			background:rgba(248,181,0,1);
			border-radius:2upx;
			margin: 0 8upx;
		}
		.dot_big{
			width:12upx;
			height:12upx;
			background:rgba(248,181,0,1);
			border-radius:2upx;
			margin: 0 8upx;
		}
		.text{
			font-size:36upx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);;
			line-height:36upx;
			margin: 0 8upx;
		}
	}
	.guess{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.guess_list{
			width: 49%;
			background-color: #FFFFFF;
			border-radius: 16upx;
			padding-bottom: 24upx;
			margin-bottom: 14upx;
			display: flex;
			flex-direction: column;
			.image{
				width:100%;
				height:344upx;
				border-radius:16upx 16upx 0 0;
				margin-bottom: 16upx;
			}
			.list_bot{
				width: 100%;
				display: flex;
				flex-direction: column;
				.title{
					max-width: 296upx;
					font-size:28upx;
					height: 78upx;
					color:rgba(51,51,51,1);
					line-height:40upx;
					margin-left: 24upx;
					margin-bottom: 16upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.subTitle{
					max-width: 296upx;
					height: 24upx;
					font-size:24upx;
					color:rgba(179,179,179,1);
					line-height:24upx;
					margin-left: 24upx;
					margin-bottom: 8upx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.bot{
					font-family:DINAlternate-Bold,DINAlternate;
					font-weight:bold;
					color:rgba(247,92,80,1);
					margin-left: 24upx;
					.currency{
						font-size:20upx;
						line-height:20upx;
					}
					.price{
						font-size:32upx;
						line-height:32upx;
					}
				}
			}
			
		}
	}
</style>
