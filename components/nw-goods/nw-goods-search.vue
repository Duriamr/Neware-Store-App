<template>
	<view>
		<view class="goods_list" @tap.stop="$toGoods(item.id)">
			<image :src="item.imgUrl" />
			<view class="right">
				<view class="top">
					<text class="title">{{item.productName}}</text>
					<text class="subTitle" :class="item.sellingPoints == null ? ' title_placeholder' : ''">{{item.sellingPoints}}</text>
				</view>
				
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
	}
</script>

<style lang="scss" scoped>
	.goods_list{
		width: 750upx;
		box-sizing: border-box;
		padding: 0upx 24upx;
		background:#FFFFFF;
		display: flex;
		align-items: center;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		image{
			width: 248upx;
			height: 248upx;
			border-radius: 8upx;
			margin-right: 24upx;
		}
		.right{
			width: calc(100% - 272upx);
			height: 282upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 32upx 0;
			border-bottom: 1upx solid #F5F5F5;
			.top{
				display: flex;
				flex-direction: column;
				.title{
					width: 100%;
					font-size:28upx;
					color:rgba(51,51,51,1);
					line-height:34upx;
					margin-bottom: 16upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.subTitle{
					width: 100%;
					height: 24upx;
					font-size:24upx;
					color: #B3B3B3;
					line-height:24upx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
			.bot{
				font-family:DINAlternate-Bold,DINAlternate;
				font-weight:bold;
				color:rgba(247,92,80,1);
				.currency{
					font-size:24upx;
					line-height:24upx;
				}
				.price{
					font-size:32upx;
					line-height:32upx;
				}
			}
		}
	}
</style>
