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
				<!-- <view class="row">
					<view class="left">
						邮政编码
					</view>
					<view class="right">
						<input class="input" placeholder="请输入邮政编码" placeholder-class="input_pl" type="number" v-model="poscode" />
					</view>
				</view> -->
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
			
			<!-- 粘贴文本 识别地址 -->
			<view class='distinguish'>
			    <textarea class="tex" placeholder="粘贴文本，自动识别收件人信息 如：广东省深圳市福田区上梅林卓越城3栋15楼，张三，188****8888"  v-model="form" />
			</view>
			<view class="def">
				<text class="left">设为默认收货地址</text>
				<view class="right">
					<switch color="#F8B500" :checked="isDefault" @change=isDefaultChange />
				</view>
			</view>
		</view>
		
		<view class="footer_placeholder"></view>
		<view class="footer" @tap="save">
			<view class="btn">
				保存
			</view>
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
				form1:'',
				form:'',
				token:uni.getStorageSync('token'),
				
				type:'',
				id:'',
				name:'',
				phone:'',
				poscode:'',
				region:'',
				province: '',
				city: '',
				area: '',
				detailed:'',
				isDefault:false,
				cityValue: [0, 0, 0],
				flag:'',
				result:'',
			};
		},
		watch:{
			form(val){
				 val = val.replace(/\s+/g,"")  // 去空格
				if(val.length > 6){
					if(!this.result) {
						this.result = this.debounce(this.commomAddress,1000);
					}
					this.result();
					// this.commomAddress()
				}
			}
		},
		
		onLoad(option) {
			this.type = option.type;
			if(option.type=='edit'){
				uni.setNavigationBarTitle({title: '修改收货地址'});
				this.getAddress()
			}
		},
		onShow() {
			//  智能识别地址控制
			this.distinguish()
			this.token = uni.getStorageSync('token');
		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		methods: {
			debounce(fn, wait) {    
			    var timeout = null;    
			    return function() {
			        if(timeout !== null)   clearTimeout(timeout);        
			        timeout = setTimeout(fn, wait);    
			    }
			},
			//  控制条用地址识别的接口 true 快宝  false 顺丰
			distinguish(){
				uni.request({
					url:this.$url+'/api/logistics/addressstatus',
					method:'get',
					header:{
						Authorization:'Bearer '+this.token
					},
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.flag = res.data.data
						}
					}
				})
			},
		
			// 智能识别地址
			commomAddress(){
				uni.showLoading({
				    title: '地址解析中'
				});
				if(this.flag ){
					//  快宝
					uni.request({
					    url: this.$url+'/api/logistics/get-address?address='+this.form, 
						header:{
							Authorization:'Bearer '+this.token
						},
						success:(res)=> {
							if(res.data.code == 200 && res.data.success){
								uni.hideLoading()
								this.phone = res.data.data.phone
								this.name = res.data.data.name
								this.detailed = res.data.data.detail
								this.province = res.data.data.provinceName;
								this.city =res.data.data.cityName;
								this.area = res.data.data.countyName;
								if(res.data.data.provinceName||res.data.data.cityName|| res.data.data.countyName){
									this.region = res.data.data.provinceName+"-"+res.data.data.cityName+"-"+res.data.data.countyName;
								}else{
									this.region = ''
								}
								//  清空数据
								this.form = ''
							}else{
								uni.hideLoading()
							}
						}
					})
				}else{
					// 顺丰接口
					uni.request({
						url:'https://ucmp.sf-express.com/cx-wechat-order/order/address/intelAddressResolution',
						method:'post',
						header:{
							'content-type':"application/x-www-form-urlencoded; charset=UTF-8",
						},
						data:{
							address:this.form
						},
						success:(res)=> {
							if(res.statusCode == 200 ){
								uni.hideLoading()
								this.phone = res.data.obj.telephone
								this.name = res.data.obj.personalName
								this.detailed = res.data.obj.site
								this.province = res.data.obj.province||'';
								this.city =res.data.obj.city||'';
								this.area = res.data.obj.area||'';
								if(res.data.obj.province||res.data.obj.city|| res.data.obj.area){
									this.region = this.province+"-"+this.city+"-"+this.area
								}else{
									this.region = ''
								}
								//  清空数据
								this.form = ''
							}else{
								uni.hideLoading()
							}
						}
					})
				}
				
			},
			getAddress(){
				uni.getStorage({
					key:'address',
					success: (ret) => {
						this.id = ret.data.id;
						this.name = ret.data.receiverName;
						this.phone = ret.data.phone;
						this.poscode = ret.data.poscode;
						this.region = ret.data.province+"-"+ret.data.city+"-"+ret.data.area;
						this.province = ret.data.province;
						this.city = ret.data.city;
						this.area = ret.data.area;
						this.detailed = ret.data.detailedAddress;
						this.isDefault = ret.data.default;
						// this.cityValue = ret.data.value;
					}
				})
			},
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
			isDefaultChange(e){
				this.isDefault = e.detail.value;
			},
			save(){
				if(!this.name){
					uni.showToast({
						title:'请输入收件人姓名',
						icon:'none',
						position: 'bottom',
					});
					return false;
				}
				if(!this.phone){
					uni.showToast({
						title:'请输入收件人电话号码',
						icon:'none',
						position: 'bottom',
					});
					return false;
				}
				if(!/^(13\d|14[5-9]|15[0-35-9]|166|17[0-8]|18\d|19[1-18-9])\d{8}$/.test(this.phone)){
					uni.showToast({
						title:'请输入正确号码格式',
						icon:'none',
						position: 'bottom',
					});
					return false;
				}
				if(!this.region){
					uni.showToast({
						title:'请选择所在地区',
						icon:'none',
						position: 'bottom',
					});
					return false;
				}
				if(!this.detailed){
					uni.showToast({
						title:'请选择收件地址',
						icon:'none',
						position: 'bottom',
					});
					return false;
				}
				uni.showLoading({title:'正在提交'})
				if(this.type=='edit'){
					uni.request({
					    url: this.$url+'/api/delivery-address/edit', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"id": this.id,
							"receiverName": this.name,
							"phone": this.phone,
							"province": this.province,
							"city": this.city,
							"area": this.area,
							"street": "null",
							"detailedAddress": this.detailed,
							"type": 0,
							"default": this.isDefault,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading();
							if(res.data.success&&res.data.code == 200){
								uni.showToast({title: "修改成功"})
								let selectAddress = uni.getStorageSync('selectAddress');
								if(selectAddress.id == this.id){
									let item = {
										"id": this.id,
										"receiverName": this.name,
										"phone": this.phone,
										"province": this.province,
										"city": this.city,
										"area": this.area,
										"street": "null",
										"detailedAddress": this.detailed,
										"type": 0,
										"default": this.isDefault,
									}
									uni.setStorageSync('selectAddress',item)
								}
								uni.navigateBack();
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
							uni.hideLoading()
							this.$requestFail()
						}
					});
				}else if(this.type=='add'){
					uni.request({
					    url: this.$url+'/api/delivery-address/add', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"receiverName": this.name,
							"phone": this.phone,
							"province": this.province,
							"city": this.city,
							"area": this.area,
							"street": "null",
							"detailedAddress": this.detailed,
							"type": 0,
							"default": this.isDefault,
						},
						method: "POST",
					    
					    success: (res) => {
							uni.hideLoading();
							if(res.data.success&&res.data.code == 200){
								uni.showToast({title: "保存成功"})
								uni.navigateBack();
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
							uni.hideLoading()
							this.$requestFail()
						}
					});
				}
			},
		},
	};
</script>

<style lang="scss">
	@import "./addedit.scss"
</style>