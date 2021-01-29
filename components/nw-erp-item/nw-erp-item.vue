<template>
	<view>
		<view class="ERP_list" @tap.stop="toERPDetails(item.document_id)">
			<view class="top">
				<text class="name">客户名称：{{item.card_name}}</text>
				<text v-if="!item.cur_status" class="red">已提交</text>
				<text v-if="item.cur_status==1" class="red">待发货</text>
				<text v-if="item.cur_status==2" class="red">已发货</text>
				<text v-if="item.cur_status==3">已提交</text>
			</view>
			<view class="goods_ul">
				<view class="goods_list" v-for="(item2,index2) in item.wfa_eshop_oqutdetails" :key="'all'+index+index2" v-if="index2<3">
					<text class="list_left">{{item2.item_code}}</text>
					<text class="list_right">X{{item2.item_qty}}</text>
				</view>
				<view class="goods_list" v-if="item.wfa_eshop_oqutdetails.length>=3">
					<text class="list_left">...</text>
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
			index:{
				type: Number,
				default: 0
			},
		},
		methods:{
			toERPDetails(documentId){
				uni.navigateTo({
					url:'/pages/ERP/ERPDetails/ERPDetails?documentId='+documentId
				})
			}
		}
	}
</script>

<style lang="scss">
	.ERP_list{
		width: 100%;
		background: #FFFFFF;
		border-radius: 16upx;
		box-sizing: border-box;
		padding: 24upx;
		margin-bottom: 16upx;
		.top{
			width: 100%;
			padding-bottom: 24upx;
			border-bottom: 1upx solid #F5F5F5;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.name{
				width: 460upx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.red{
				color: #F75C50;
			}
		}
		.goods_ul{
			width: 100%;
			font-size: 24upx;
			color: #666666;
			line-height: 24upx;
			.goods_list{
				width: 100%;
				height: 24upx;
				margin-top: 24upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.list_left{
					width: 560upx;
					height: 24upx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.list_right{
					height: 24upx;
					font-size: 24upx;
					color: #B3B3B3;
					line-height: 24upx;
				}
			}
		}
	}
</style>
