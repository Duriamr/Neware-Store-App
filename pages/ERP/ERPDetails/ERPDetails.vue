<template>
	<view class="eD_content">
		<view class="header">
			<view class="type">
				<view class="left">
					<view class="top">
						<text>{{!infoData.cur_status?'已提交':infoData.cur_status==1?'待发货':infoData.cur_status==2?'已发货':infoData.cur_status==3?'已完成':''}}</text>
					</view>
				</view>
				
				<image :src="!infoData.cur_status?'/static/order/orderDetails/0.png':infoData.cur_status==1?'/static/order/orderDetails/3.png':infoData.cur_status==2?'/static/order/orderDetails/4.png':infoData.cur_status==3?'/static/order/orderDetails/5_2.png':''" mode="widthFix" />
			</view>
			<view class="float_placeholder"></view>
		</view>
		
		<image class="progress" :src="!infoData.cur_status?'/static/ERP/ERPDetails/0.png':infoData.cur_status==1?'/static/ERP/ERPDetails/1.png':infoData.cur_status==2?'/static/ERP/ERPDetails/2.png':infoData.cur_status==3?'/static/ERP/ERPDetails/3.png':''" mode="widthFix" />
		
		<view class="goods">
			<view class="title">
				<text>商品明细</text>
			</view>
			<view class="goods_ul">
				<view class="goods_list" v-for="(item,index) in infoData.wfa_eshop_oqutdetails" :key="index">
					<view class="top">
						<text class="left">{{item.item_code}}</text>
						<text class="right">X{{item.item_qty}}</text>
					</view>
					<view class="bot">
						<text>{{item.item_desc}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="infor">
			<view class="title">
				<text>订单信息</text>
			</view>
			<view class="infor_ul">
				<view class="infor_list">
					<view class="left">
						客户名称：
					</view>
					<view class="right">
						{{infoData.card_name}}
					</view>
				</view>
				<view class="infor_list">
					<view class="left">
						客户代码：
					</view>
					<view class="right">
						{{infoData.card_code}}
					</view>
				</view>
				<view class="infor_list">
					<view class="left">
						合同编号：
					</view>
					<view class="right">
						{{infoData.order_entry!=null&&infoData.order_entry!=''?'SE-'+infoData.order_entry:'暂无'}}
					</view>
				</view>
				<view class="infor_list">
					<view class="left">
						提交时间：
					</view>
					<view class="right">
						{{infoData.first_createdate}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="footer_placeholder"></view>
		<view class="eD_footer">
			<view class="footer" @touchmove.stop.prevent>
				<view class="btns">
					<!-- <view class="btn btn1">
						我要催单
					</view> -->
					
					<view class="btn btn2" @tap.stop="toProgress()">
						进度详情
					</view>
				</view>
			</view>
			<view class="safety"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:"",
				documentId:0,
				infoData:{
					card_code:"",//客户编号
					card_name:"",//客户名称
					
					cur_status:0,//0已提交 1待交货 2已交货 3已完成
					first_createdate:"",//创建时间
					
					order_phase:null,//提交进度
					order_lastdate:'',//提交时间
					job_id:0,//审批流编号
					quotation_entry:0,//报价单编号
					order_entry:0,//合同编号
					
					wfa_eshop_Logs:[],//物流明细
					
					shipping_phase:null,//交货进度
					shipping_lastdate:'',//交货时间
					
					complete_phase:null,//完成进度
					complete_lastdate:'',//完成时间
					
					wfa_eshop_canceledstatuss:[],//
					wfa_eshop_oqutdetails:[]//物料明细
				},
			};
		},
		onLoad(option) {
			this.documentId = option.documentId
			this.token = uni.getStorageSync('token');
			this.getLoadData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getLoadData();
		},
		methods:{
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/ordererp/orderdetailerp?documentId='+this.documentId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							this.infoData = JSON.parse(res.data.data).result
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
							uni.navigateBack();
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			urge(){
				
			},
			toProgress(){
				uni.navigateTo({
					url:'/pages/ERP/ERPDetails/progress/progress?documentId='+this.documentId
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./ERPDetails.scss"
</style>
