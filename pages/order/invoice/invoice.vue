<template>
	<view class="invoice_content">
		<view class="list" style="margin-top: 16upx;">
			<view class="main">
				<text class="title">发票类型</text>
				<view class="right">
					<view class="cell orange">
						电子发票
					</view>
				</view>
			</view>
		</view>
		<view class="tips">
			<text>电子发票即电子增值税发票，是税局认可的有效凭证，其法律效力、基本用途及使用规定同纸质发票。</text>
		</view>
		
		<view class="list" style="margin-top: 32upx;">
			<view class="main">
				<text class="title">发票抬头</text>
				<view class="right">
					<view class="cell" :class="!invoiceTitle?'orange':'grey'" @tap.stop="tabTitleType(0)">
						<text>个人</text>
					</view>
					<view class="cell" :class="invoiceTitle?'orange':'grey'" @tap.stop="tabTitleType(1)">
						
						<text>企业</text>
					</view>
				</view>
			</view>
		</view>
		<block v-if="!invoiceTitle">
		<view class="list">
			<view class="main">
				<text class="title">个人姓名</text>
				<view class="right">
					<input v-model="personalName" placeholder="请填写您的真实姓名" maxlength="4" />
				</view>
			</view>
		</view>
		</block>
		
		<block v-if="invoiceTitle">
		<view class="list" >
			<view class="main">
				<text class="title">企业名称</text>
				<view class="right">
					<input v-model="companyName" placeholder="请填写真实企业名称" @input="input" @focus="input" @blur="blur" />
				</view>
			</view>
			<view class="extend">
				<view class="ex_list" v-for="(item,index) in companyArr" :key="index" @tap.stop="select(item)">
					<text class="name">{{item.payerName}}</text>
					<text class="No">{{item.payerRegisterNo}}</text>
				</view>
			</view>
		</view>
		<view class="list" v-if="invoiceTitle">
			<view class="main">
				<text class="title">税号</text>
				<view class="right">
					<input v-model="taxNo" placeholder="请填写纳税人识别号" />
				</view>
			</view>
		</view>
		</block>
		<view class="list">
			<view class="main">
				<text class="title">发票内容</text>
				<view class="right">
					<input value="商品明细" disabled />
				</view>
			</view>
		</view>
		<view class="list">
			<view class="main">
				<text class="title">手机号码</text>
				<view class="right">
					<input v-model="phone" type="number" placeholder="请填写收票人手机号" maxlength="11" />
				</view>
			</view>
		</view>
		<view class="list">
			<view class="main">
				<text class="title">电子邮箱</text>
				<view class="right">
					<input v-model="eMail" placeholder="请填写收票人电子邮箱" />
				</view>
			</view>
		</view>
		
		<view class="tips">
			<text>发票须知：</text>
			<text>1.开票金额为用户实际支付金额(不含礼品卡、优惠券)；</text>
			<text>2.填写开票信息后将会在确定收货后的7个工作日内会将电子发票 发送到对应的手机号码或邮箱里。（注：开票明细只根据购买明细 开票）；</text>
			<text> 3.单笔订单只支持开具一种发票类型，如需增值税专用发票请联系 客服处理</text>
		</view>
		
		<view class="btn" @tap.stop="submit()" style="background: #F8B500;color: #FFFFFF;margin-top: 210upx;">
			提交申请
		</view>
		<view class="btn" @tap.stop="destroy()" style="margin-bottom: 30upx;">
			不开发票
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'edit',
				
				orderId:'',
				token:'',
				
				invoiceTitle:0,
				personalName:'',
				companyName:'',
				companyArr:[],
				// companyArrShow:false,
				taxNo:'',
				phone:'',
				eMail:''
			};
		},
		onLoad(options){
			let invoiceObj = uni.getStorageSync('invoiceObj');
			if(this.$isObject(invoiceObj)&&invoiceObj!={}){
				if(!invoiceObj.invoiceTitleType){
					this.invoiceTitle = 0
					this.personalName = invoiceObj.name
					this.phone = invoiceObj.receivePhone
					this.eMail = invoiceObj.receiveEmail
				}else{
					this.invoiceTitle = 1
					this.companyName = invoiceObj.name
					this.taxNo = invoiceObj.taxNo
					this.phone = invoiceObj.receivePhone
					this.eMail = invoiceObj.receiveEmail
				}
			}
			if(options.orderId!=''&&options.orderId!=null&&options.orderId!=undefined){
				this.orderId = options.orderId
				this.type = 'submit'
			}
		},
		onShow(){
			this.token = uni.getStorageSync('token');
		},
		methods:{
			tabTitleType(i){
				this.invoiceTitle = i
			},
			input(e){
				uni.request({
				    url: 'https://invoice-ua.taobao.com/title/searchUserTitle?pageSize=4&keyword='+e.detail.value,
					method: "GET",
				    
				    success: (res) => {
						if(res.data.result!=null){
							this.companyArr = res.data.result
						}else{
							this.companyArr = []
						}
				    }
				})
			},
			blur(){
				setTimeout(()=>{
					this.companyArr = []
				},50)
				
			},
			select(item){
				this.companyName = item.payerName
				this.taxNo = item.payerRegisterNo
			},
			submit(){
				if(!this.invoiceTitle){
					if(this.personalName == ''){
						uni.showToast({icon: 'none',title: '请填写您的真实姓名'});
						return false
					}else if(this.phone == ''){
						uni.showToast({icon: 'none',title: '请填写收票人手机号'});
						return false
					}else if(this.eMail == ''){
						uni.showToast({icon: 'none',title: '请填写收票人电子邮箱'});
						return false
					}
					if(this.type=='edit'){
						let invoiceObj = {
							invoiceType:1,
							invoiceTitleType:0,
							name:this.personalName,
							receivePhone:this.phone,
							receiveEmail:this.eMail
						}
						uni.setStorageSync('invoiceObj',invoiceObj)
						this.$back()
					}else if(this.type=='submit'){
						let invoiceObj = {
							invoiceType:1,
							invoiceTitle:1,
							name:this.personalName,
							receivePhone:this.phone,
							receiveEmail:this.eMail,
							orderId:this.orderId
						}
						this.addInvoice(invoiceObj)
					}
				}else{
					if(this.companyName == ''){
						uni.showToast({icon: 'none',title: '请填写真实企业名称'});
						return false
					}else if(this.taxNo == ''){
						uni.showToast({icon: 'none',title: '请填写纳税人识别号'});
						return false
					}else if(this.phone == ''){
						uni.showToast({icon: 'none',title: '请填写收票人手机号'});
						return false
					}else if(this.eMail == ''){
						uni.showToast({icon: 'none',title: '请填写收票人电子邮箱'});
						return false
					}
					if(this.type=='edit'){
						let invoiceObj = {
							invoiceType:1,
							invoiceTitleType:1,
							name:this.companyName,
							taxNo:this.taxNo,
							receivePhone:this.phone,
							receiveEmail:this.eMail
						}
						uni.setStorageSync('invoiceObj',invoiceObj)
						this.$back()
					}else if(this.type=='submit'){
						let invoiceObj = {
							invoiceType:1,
							invoiceTitle:2,
							name:this.companyName,
							taxNo:this.taxNo,
							receivePhone:this.phone,
							receiveEmail:this.eMail,
							orderId:this.orderId
						}
						this.addInvoice(invoiceObj)
					}
				}
			},
			destroy(){
				uni.removeStorageSync('invoiceObj')
				this.$back()
			},
			addInvoice(invoiceObj){
				uni.request({
					url: this.$url+'/api/invoice/add', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data: invoiceObj,
					method: "POST",
				
					success: (res) => {
						if(res.data.success&& res.data.code == 200){
							this.$back()
							uni.showToast({icon: 'none',title: '开票信息已提交'});
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
					},
					fail: (err) => {
						this.$requestFail()
					},
				});
			},
		},
	}
</script>

<style lang="scss">
	page{
		background: #F5F5F5;
	}
	.invoice_content{
		font-size: 28upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		line-height: 28upx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.list{
		width: 100%;
		height: 98upx;
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 0 24upx;
		position: relative;
		.main{
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			border-bottom: 1upx solid #F5F5F5;
			display: flex;
			align-items: center;
			.title{
				width: 120upx;
				font-family: PingFangSC-Light, PingFang SC;
				font-weight: 300;
				color: #666666;
				margin-right: 24upx;
			}
			.right{
				width: calc(100% - 120upx - 24upx);
				height: 100%;
				display: flex;
				align-items: center;
				.cell{
					width: 144upx;
					height: 60upx;
					box-sizing: border-box;
					border-radius: 8upx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 16upx;
					&.grey{
						background: #F5F5F5;
						color: #B3B3B3;
					}
					&.orange{
						background: rgba(248, 181, 0, 0.15);
						border: 2upx solid #F8B500;
						color: #F8B500;
					}
				}
				input{
					width: 100%;
					font-size: 30upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					line-height: 30upx;
				}
				.input-placeholder{
					font-size: 30upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #E5E5E5;
					line-height: 30upx;
				}
			}
		}
		.extend{
			position: absolute;
			top: 98upx;
			width: 702upx;
			background: #FFFFFF;
			box-shadow: 0 4upx 20upx 0 rgba(0, 0, 0, 0.1);
			border-radius: 16upx;
			display: flex;
			flex-direction: column;
			z-index: 2;
			.ex_list{
				width: 100%;
				box-sizing: border-box;
				padding: 0 32upx;
				margin-bottom: 32upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				color: #333333;
				.name{
					width: 100%;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					margin-bottom: 16upx;
				}
				.No{
					width: 100%;
					font-size: 24upx;
					color: #666666;
					line-height: 24upx;
				}
				&:first-of-type{
					margin-top: 32upx;
				}
			}
		}
	}
	.tips{
		width: 100%;
		box-sizing: border-box;
		padding: 0 24upx;
		font-size: 24upx;
		color: #B3B3B3;
		line-height: 34upx;
		margin-top: 20upx;
		display: flex;
		flex-direction: column;
	}
	.btn{
		width: 700upx;
		height: 76upx;
		border-radius: 38upx;
		border: 1upx solid #F8B500;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #F8B500;
		margin-top: 32upx;
	}
</style>
