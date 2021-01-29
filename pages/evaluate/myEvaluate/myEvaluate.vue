<template>
	<view>
		<view v-if="ordercommentList && ordercommentList.length > 0"  class="evaluationlistWarp">
			<view class="evaluateList" >
				<view v-for="(item,index) in ordercommentList" :key='index' class="evaluate" @tap="$toGoods(item.productId)">
					<view class="evaluateItem">
						<image :src="item.imgUrl"></image>
						<view class="content">
							<view class="evaluateTop">
								<text class="productName">{{item.productName}}</text>
								<text class="price">¥{{item.price}}</text>
							</view>
							<view class="evaluateBot">
								<view class="SKU" v-if="item.skuSpce && item.skuSpce.length > 0">
									<text v-for="(data,indexs) in item.skuSpce" :key='indexs'>
										{{data.value}}
										<text v-if='indexs != item.skuSpce.length-1'>/</text>
									</text>
								</view>
								<view v-else>
								</view>
								<text class="quantity">x{{item.quantity}}</text>
							</view>
						</view>
					</view>
					<view class="evaluateStatus" @tap.stop='goToevaluate(item)'>
						<text>评价</text>
					</view>
				</view>
			</view>
		</view>
		<empty marginTop="200upx" src="/static/expect/not_Order.png" text="暂无相关订单可以评价" btnShow btnText="去逛逛" @btn="toSort()" v-else />
	</view>
</template>

<script>
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {empty},
		data() {
			return {
				ordercomment:{
					pageIndex:1,
					pageSize:10,
					orderId:0
				},
				falg:false,
				ordercommentList:[],
				token:uni.getStorageSync('token'),
			};
		},
		onShow() {
			this.ordercommentList = []
			this.ordercomment.pageIndex = 1
			this.getOrderComment()
		},
		onHide(){
			this.falg = false
		},
		onReachBottom(){
			this.falg = true
			uni.showLoading({
			    title: '加载更多'
			});
			this.ordercomment.pageIndex++
			this.getOrderComment()
		},
		methods:{
			//  去逛逛
			toSort(){
				uni.switchTab({
				    url: '/pages/tabBar/sort/sort'
				});
			},
			
			//获取列表
			getOrderComment(){
				uni.request({
					url:this.$url+'/api/productcomment/ordercomment',
					method:'POST',
					data:this.ordercomment,
					header:{
						Authorization:'Bearer '+this.token
					},
					success:(res) =>{
						uni.hideLoading()
						if(res.data.code == 200 && res.data.success){
							if(res.data.data.items && res.data.data.items.length > 0){
								this.ordercommentList = this.ordercommentList.concat(res.data.data.items)
							}else{
								if(this.falg){
									uni.showToast({
										icon: 'none',
										title: "已经加载全部",
									})
								}
							}
						}
					},
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				})
			},
			
			//  去评价
			goToevaluate(item){
				const obj = {
					productName:item.productName,
					productId:item.productId,
					imgUrl:item.imgUrl,
					skuSpce:item.skuSpce,
					orderId:item.orderId,
					evaluateListLeng:this.ordercommentList.length
				}
				uni.navigateTo({
					url:'/pages/evaluate/comment/comment?product='+JSON.stringify(obj),
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background:rgba(245,245,245,1);
		height: 100%;
	}
	.evaluationlistWarp{
		background:rgba(245,245,245,1);
		height: 100%;
		padding: 20upx;
		box-sizing: border-box;
		.evaluateList{
			height: 100%;
			width: 100%;
			.evaluate{
				margin-bottom: 20upx;
				padding: 20upx;
				box-sizing: border-box;
				background:rgba(255,255,255,1);
				border-radius:16upx;
				.evaluateItem{
					display: flex;
					image{
						width:160upx;
						height:160upx;
						margin-right: 20upx;
					}
					.content{
						.evaluateTop{
							margin-bottom: 20upx;
							display: flex;
							justify-content: space-between;
							.productName{
								display: inline-block;
								font-size:28upx;
								font-family:PingFangSC-Regular,PingFang SC;
								font-weight:400;
								color:rgba(51,51,51,1);
								width: 314upx;
								 text-overflow: -o-ellipsis-lastline;
								  overflow: hidden;
								  text-overflow: ellipsis;
								  display: -webkit-box;
								  -webkit-line-clamp: 2;
								  line-clamp: 2;
								  -webkit-box-orient: vertical;
							}
							.price{
								margin-left: 68upx;
								font-size:28upx;
								font-family:DINAlternate-Bold,DINAlternate;
								font-weight:bold;
								color:rgba(51,51,51,1);
							}
						}
						.evaluateBot{
							display: flex;
							justify-content: space-between;
							font-size:24upx;
							font-family:PingFangSC-Regular,PingFang SC;
							font-weight:400;
							color:rgba(179,179,179,1);
						}
					}
				}
				.evaluatedStatus{
					text-align: right;
					font-size:28upx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(179,179,179,1);
				}
				.evaluateStatus{
					text-align: right;
					text{
						display: inline-block;
						width:160upx;
						height:48upx;
						text-align: center;
						line-height: 48upx;
						border-radius:30upx;
						border:1upx solid rgba(248,181,0,1);
						font-size:28upx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:rgba(248,181,0,1);
					}
				}
			}
		}
	}
</style>
