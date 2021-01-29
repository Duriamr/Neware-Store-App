<template>
	<view class="progress_content">
		<view class="status_box">
			<view class="top">
				<text class="title">{{!infoData.cur_status?'已提交':infoData.cur_status==1?'待发货':infoData.cur_status==2?'已发货':infoData.cur_status==3?'已完成':''}}</text>
				<text class="subTiele">{{!infoData.cur_status?'业务经理正在生成合同…':infoData.cur_status==1?'货物正在出厂品质检测，检验完则发货':infoData.cur_status==2?'商品已发出，请耐心等待':infoData.cur_status==3?'订单已完成，感谢您的信任':''}}</text>
			</view>
			<view class="bot">
				<text>合同编号：{{infoData.order_entry!=null&&infoData.order_entry!=''?'SE-'+	infoData.order_entry:'暂无'}}</text>
				<!-- <view class="btn" v-if="infoData.cur_status<=1">
					我要催单
				</view> -->
			</view>
		</view>
		
		<view class="progress_box">
			<view class="progress_list" v-if="infoData.cur_status==3">
				<image class="icon" src="/static/ERP/ERPDetails/progress/3.png" />
				<text class="title">完成</text>
			</view>
			
			<view class="progress_list" v-if="infoData.cur_status>=2">
				<image class="icon" :src="infoData.cur_status==2?'/static/ERP/ERPDetails/progress/2.png':'/static/ERP/ERPDetails/progress/2_g.png'" />
				<text class="title">查看物流</text>
				<view class="main" v-for="(item,index) in infoData.wfa_eshop_Logs" :key="index">
					<view class="logistics_box">
						<text class="name">{{item.coName}}</text>
						<text class="exp">{{item.expNum}}</text>
						<text class="look" @tap.stop="toLogistics(item.expNum)">查看物流</text>
					</view>
					<text class="time">{{item.createDate}}</text>
				</view>
			</view>
			
			<view class="progress_list" v-if="infoData.cur_status>=1">
				<image class="icon" :src="infoData.cur_status==1?'/static/ERP/ERPDetails/progress/1.png':'/static/ERP/ERPDetails/progress/1_g.png'" />
				<text class="title">交货阶段</text>
				<view class="main">
					<view class="progressBar_box">
						<view class="progressBar">
							<view class="speed" :style="{width:infoData.shipping_status/4*100+'%'}"></view>
						</view>
						<text>{{infoData.shipping_status}}/4</text>
					</view>
					<text class="time">{{infoData.shipping_lastdate}}</text>
				</view>
			</view>
			
			<view class="progress_list">
				<image class="icon" :src="infoData.cur_status==0?'/static/ERP/ERPDetails/progress/0.png':'/static/ERP/ERPDetails/progress/0_g.png'" />
				<text class="title">提交订单</text>
				<view class="main">
					<view class="progressBar_box">
						<view class="progressBar">
							<view class="speed" :style="{width:infoData.order_status/4*100+'%'}"></view>
						</view>
						<text>{{infoData.order_status}}/4</text>
					</view>
					
					<text class="text" v-if="infoData.job_id!=null">审核编号：{{infoData.job_id}}</text>
					<text class="text" v-if="infoData.order_status>=3&&infoData.quotation_entry!=null">销售编号：QL-{{infoData.quotation_entry}}</text>
					<text class="text" v-if="infoData.order_status==4">合同编号：SE-{{infoData.order_entry}}</text>
					<text class="time">{{infoData.order_lastdate}}</text>
				</view>
			</view>
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
					order_status:0,
					order_lastdate:'',//提交时间
					job_id:null,//审批编号
					quotation_entry:null,//报价单编号
					order_entry:null,//合同编号
					
					wfa_eshop_Logs:[],//物流明细
					
					shipping_phase:null,//交货进度
					shipping_status:0,
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
							if(this.infoData.order_phase=='0000'){
								this.infoData.order_status = 0
							}else if(this.infoData.order_phase=='1000'){
								this.infoData.order_status = 1
							}else if(this.infoData.order_phase=='1100'){
								this.infoData.order_status = 2
							}else if(this.infoData.order_phase=='1110'){
								this.infoData.order_status = 3
							}else if(this.infoData.order_phase=='1111'){
								this.infoData.order_status = 4
							}
							if(this.infoData.shipping_phase=='0000'){
								this.infoData.shipping_status = 0
							}else if(this.infoData.shipping_phase=='1000'){
								this.infoData.shipping_status = 1
							}else if(this.infoData.shipping_phase=='1100'){
								this.infoData.shipping_status = 2
							}else if(this.infoData.shipping_phase=='1110'){
								this.infoData.shipping_status = 3
							}else if(this.infoData.shipping_phase=='1111'){
								this.infoData.shipping_status = 4
							}
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
			toLogistics(exNum){
				uni.navigateTo({
					url:'/pages/ERP/ERPDetails/logistics/logistics?exNum='+exNum
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: #F5F5F5 !important;
	}
	@import "./progress.scss"
</style>
