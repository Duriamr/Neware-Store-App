<template>
	<view class="wantBuy">
		<view class="product">
			<view class="productName">
				<text class="text">产品名称</text>
				<input v-model="purchaseInfo.productName" placeholder="请输入您想要的产品名称"  :adjust-position='false'>
			</view>
			<view class="productName">
				<text class="text">预算区间</text>
				<view class="price">
					<input v-model="purchaseInfo.minPrice" type="number" placeholder="最低价格"  :adjust-position='false'>
					<text class="septum">-</text>
					<input v-model="purchaseInfo.maxPrice" type="number"  placeholder="最高价格"  :adjust-position='false'>
					<text class="yuan">元</text>
				</view>
			</view>
			<view class="productName">
				<text class="text">需求描述</text>
				<input v-model="purchaseInfo.demandDescribe" placeholder="请简单描述产品需求"  :adjust-position='false'>
			</view>
			<view class="productName">
				<text class="text">方案通知</text>
				<view class="schemenotice">
					<text v-for="(item,index) in schemenoticeList"
					 :key='index'
					  @tap='selectOptions(index)' 
					  :class="purchaseInfo.contactType ==index+1?'select active':'select'"
					  >
						{{item}}
					</text>
				</view>
			</view>
		</view>
		<view class="product contactprogram">
			<view class="productName">
				<text class="text">联系人</text>
				<input v-model="purchaseInfo.name" placeholder="请填写您的真实姓名"  :adjust-position='false'>
			</view>
			<view class="productName">
				<text class="text">手机号码</text>
				<input v-model="purchaseInfo.phone" maxlength="11" type="number"  placeholder="请填写您的手机号码">
			</view>
			<view class="productName">
				<text class="text">电子邮箱</text>
				<input v-model="purchaseInfo.email" placeholder="请填写您的电子邮箱" >
			</view>
			<view class="productName">
				<text class="text">单位名称</text>
				<input v-model="purchaseInfo.organization" placeholder="请填写单位或学校名称">
			</view>
		</view>
		<view class="product contactprogram">
			<view class="productName">
				<text class="text">我是</text>
				<view class="schemenotice">
					<text v-for="(item,index) in tasktype"
					 :key='index'
					  @tap='selecttasktype(index)' 
					  :class="purchaseInfo.userType ==index+1?'select active':'select'"
					  >
						{{item}}
					</text>
				</view>
			</view>
		</view>
		<view class="btn" @tap='submit'>
			提交需求
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				schemenoticeList:['电话通知','邮箱通知'],
				tasktype:['使用者','采购者'],
				purchaseInfo:{
					productName:'',  //商品名称
					minPrice:'',
					maxPrice:'',
					demandDescribe:'',  //需求描述（商品描述
					contactType:1,  //联系方式 1：电话,2:邮箱
					name:'',  //  联系人
					phone:'',
					email:'',
					organization:'',  //单位名称 
					userType:1,   //用户类型：1：使用者 2：采购者
				},
				token:uni.getStorageSync('token')
			}
		},
		
		methods:{
			selectOptions(index){
				this.purchaseInfo.contactType = index+1
			},
			selecttasktype(index){
				this.purchaseInfo.userType = index+1
			},
			//  提交
			submit(){
				if(this.purchaseInfo.phone && !(/^1[3456789]\d{9}$/.test(this.purchaseInfo.phone))){
					uni.showToast({icon: 'none',  position: 'center',title:'手机号格式错误'});
					return false
				}
				if(!this.purchaseInfo.productName){
					uni.showToast({icon: 'none',  position: 'center',title:'请填写产品名称'});
					return false
				}else if(!this.purchaseInfo.demandDescribe){
					uni.showToast({icon: 'none',  position: 'center',title:'请填写需求描叙'});
					return false
				}else if(!this.purchaseInfo.name){
					uni.showToast({icon: 'none',  position: 'center',title:'请填写真实姓名'});
					return false
				}else if(this.purchaseInfo.contactType == 1 && !this.purchaseInfo.phone){
						uni.showToast({icon: 'none',  position: 'center',title:'请填写手机号码'});
						return false
				}else if(this.purchaseInfo.contactType == 2 && !this.purchaseInfo.email){
						uni.showToast({icon: 'none',  position: 'center',title:'请填写电子邮箱'});
						return false
				}else if(!this.purchaseInfo.organization){
					uni.showToast({icon: 'none',  position: 'center',title:'请填写单位名称'});
					return false
				}else if(this.purchaseInfo.minPrice != ''|| this.purchaseInfo.maxPrice !=''){
					if(Number(this.purchaseInfo.minPrice) >= Number(this.purchaseInfo.maxPrice)){
						uni.showToast({icon: 'none',  position: 'center',title:'请填写合理的预算区间'});
						return false
					}
				}
				uni.showLoading({
				    title: '正在提交'
				});
				this.request()
			},
			
			request(){
				const obj = {
					productName:this.purchaseInfo.productName,  //商品名称
					minPrice:this.purchaseInfo.minPrice||0,
					maxPrice:this.purchaseInfo.maxPrice||0,
					demandDescribe:this.purchaseInfo.demandDescribe,  //需求描述（商品描述
					contactType:this.purchaseInfo.contactType,  //联系方式 1：电话,2:邮箱
					name:this.purchaseInfo.name,  //  联系人
					phone:this.purchaseInfo.phone,
					email:this.purchaseInfo.email,
					organization:this.purchaseInfo.organization,  //单位名称 
					userType:this.purchaseInfo.userType,   //用户类型：1：使用者 2：采购者
				}
				uni.request({
					url:this.$url+"/api/app/userpurchase",
					method:'post',
					header:{
						Authorization:'Bearer '+this.token
					},
					data:obj,
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							uni.hideLoading()
							uni.redirectTo({
								url:'/pages/sort/wantBuy/successfulpurchase'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './wantBuy.scss'
</style>
