<template>
	<view class="evaluationlistWarp">
		<view class="evaluateList" v-if="evaluateList && evaluateList.length > 0">
			<view v-for="(item,index) in evaluateList" :key='index' class="evaluate" @tap="$toGoods(item.productId)">
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
				<view class="evaluatedStatus" v-if="item.isComment">
					<text>已评价</text>
				</view>
				<view class="evaluateStatus" v-else @tap.stop='goToevaluate(item)'>
					<text>评价</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				token:'',
				orderInfo:{
					orderId:'',
					pageIndex:1,
					pageSize:10,
				},
				evaluateList:[],
				num:1
			}
		},
		onLoad(option) {
			this.token = uni.getStorageSync('token');
			this.orderInfo.orderId = option.orderId
			// this.getEvaluList()
		},
		onShow() {
			this.evaluateList = []
			this.getEvaluList()
			// if(this.$store.state.evaluationlist){
			// 	this.orderInfo.pageIndex = 1
			// 	this.getEvaluList()
			// 	this.$store.commit("EvaluationList",false)
			// }
		},
		onHide() {
		},
		onReachBottom(){
			uni.showLoading({
			    title: '加载更多'
			});
			this.orderInfo.pageIndex++
			this.getEvaluList()
		},
		methods:{
			//  去评价
			goToevaluate(item){
				const obj = {
					productName:item.productName,
					productId:item.productId,
					imgUrl:item.imgUrl,
					skuSpce:item.skuSpce,
					orderId:this.orderInfo.orderId,
					evaluateListLeng:this.evaluateList.length
				}
				uni.navigateTo({
					url:'/pages/evaluate/comment/comment?product='+JSON.stringify(obj),
				})
			},
		
			//  获取评价列表
			getEvaluList(){
				uni.request({
					url:this.$url+'/api/productcomment/ordercomment',
					method:'POST',
					header:{
						Authorization:'Bearer '+this.token
					},
					data:this.orderInfo,
					success:(res) =>{
						uni.hideLoading()
						if(res.data.code == 200 && res.data.success){
							if(res.data.data.items && res.data.data.items.length > 0){
								this.evaluateList = this.evaluateList.concat(res.data.data.items)
							}else{
								uni.showToast({
									icon: 'none',
									title: "已经加载全部",
								})
							}
						}
					},
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import './orderEvaluate.scss'
</style>
