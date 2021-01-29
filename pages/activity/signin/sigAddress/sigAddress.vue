<template>
	<view>
		<view class="addaddress_content">
			<view class="main">
				<view class="row">
					<view class="left">
						收 货 人
					</view>
					<view class="right">
						<input class="input" placeholder="请输入收件人姓名" placeholder-class="input_pl" type="text" v-model="name" />
					</view>
				</view>
				<view class="row">
					<view class="left">
						手机号码
					</view>
					<view class="right">
						<input class="input" placeholder="请输入收件人电话号码" placeholder-class="input_pl" type="number" maxlength=11 v-model="phone" />
					</view>
				</view>
				<view class="row">
					<view class="left">
						所在地区
					</view>
					<view class="right" @tap="chooseCity">
						<input class="input" placeholder="请选择" placeholder-class="input_pl" type="text" v-model="region" disabled />
					</view>
				</view>
				<view class="row">
					<view class="left">
						详细地址
					</view>
					<view class="right">
						<textarea class="textarea" placeholder="街道、楼房号等"  placeholder-style="font-size:28upx; color:#E5E5E5; line-height:28upx;" auto-height="true" v-model="detailed" />
					</view>
				</view>
			</view>
		</view>
		
		<view class="addbtn" @tap=save>
			确认提交
		</view>
		
		<mpvue-city-picker themeColor="#F8B500" ref="mpvueCityPicker" :pickerValueDefault="cityValue" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				productId:'',
				name:'',
				phone:'',
				region:'',
				province: '',
				city: '',
				area: '',
				detailed:'',
				cityValue: [0, 0, 0],
				token:"",
			};
		},
		onLoad(option) {
			this.productId = option.productId
			this.token = uni.getStorageSync('token');
		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		methods: {
			chooseCity() {
				uni.hideKeyboard();
				this.$refs.mpvueCityPicker.show()
			},
			onCancel(e) {
				
			},
			onConfirm(e) {
				this.region = e.label;
				let region = e.label.split("-");
				this.province = region[0];
				this.city = region[1];
				this.area = region[2];
				// this.cityValue = e.value;
			},
			save(){
				uni.showModal({
					title: '提示',
					content: '是否确认提交地址？',
					confirmColor: '#F8B500',
					success: (res) => {
						if (res.confirm){
							if(!this.name){
								uni.showToast({
									title:'请输入收件人姓名',
									icon:'none',
									position: 'bottom',
								});
								return ;
							}
							if(!this.phone){
								uni.showToast({
									title:'请输入收件人电话号码',
									icon:'none',
									position: 'bottom',
								});
								return ;
							}
							if(!/^(13\d|14[5-9]|15[0-35-9]|166|17[0-8]|18\d|19[8-9])\d{8}$/.test(this.phone)){
								uni.showToast({
									title:'请输入正确号码格式',
									icon:'none',
									position: 'bottom',
								});
								return ;
							}
							if(!this.region){
								uni.showToast({
									title:'请选择所在地区',
									icon:'none',
									position: 'bottom',
								});
								return ;
							}
							if(!this.detailed){
								uni.showToast({
									title:'请选择收件地址',
									icon:'none',
									position: 'bottom',
								});
								return ;
							}
							uni.showLoading({
								title:'正在提交'
							})
							uni.request({
							    url: this.$url+'/api/appsignin/addexchange', 
								header:{
									Authorization:'Bearer '+this.token
								},
								data:{
									"promotionalActivityId": 4,
									"productId": this.productId,
									"receiverName": this.name,
									"phone": this.phone,
									"address": this.region+this.detailed
								},
								method: "POST",
							    
							    success: (res) => {
									uni.hideLoading();
									if(res.data.success&&res.data.code == 200){
										setTimeout(()=>{
											uni.redirectTo({
												url:"/pages/activity/signin/sigAddress/sigSuccess"
											});
										},500)
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
									uni.hideLoading();
									this.$requestFail()
								}
							});
					}
				},
				})
				
			}
		},
	};
</script>

<style lang="scss">
	@import "../../../order/address/addedit/addedit.scss";
	.addbtn{
		width:calc(100% - 48upx);
		height:76upx;
		margin: 120upx 24upx 0;
		background:rgba(248,181,0,1);
		font-size:28upx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(255,255,255,1);
		line-height:28upx;
		border-radius:38upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>