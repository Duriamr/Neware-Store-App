<template>
	<view>
		<view class="user_content" v-if="show == true">
			<view class="list">
				<view class="inside head">
					<view class="left">
						<text>头像</text>
					</view>
					<view class="right" style="width: 540upx; display: flex; justify-content:flex-end;" @tap.stop = "chooseImage">
						<image class="headPortrait" :src="imgUrl" v-if="file.length < 1" @tap.stop = "chooseImage"/>
						<image class="headPortrait" :src="file" v-else @tap.stop = "chooseImage"/>
						<image src="/static/public/go_grey.png" />
					</view>
				</view>
			</view>
			<view class="list">
				<view class="inside">
					<view class="left">
						<text>用户ID</text>
						<input v-model="id" type="text" disabled/>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="inside">
					<view class="left">
						<text>用户名称</text>
						<input v-model="userName" type="text" />
					</view>
				</view>
			</view>
			<view class="list">
				<view class="inside">
					<view class="left">
						<text>昵称</text>
						<input v-model="nickname" type="text" placeholder="请输入您的昵称" />
					</view>
				</view>
			</view>
			<view class="list">
				<view class="inside">
					<view class="left">
						<text>性别</text>
						 <picker @change="bindPickerChange" :value="index" :range="genders">
							<view class="placeholder" v-if="hideGender == false">
								请选择性别
							</view>
							<view v-if="hideGender == true">{{gender}}</view>
						</picker>
					</view>
					<view class="right">
						<image src="/static/public/go_grey.png" />
					</view>
				</view>
			</view>
			<view class="list">
				<view class="inside">
					<view class="left left1">
						<text>生日</text>
						<picker mode="date" :value="birthday" @change="bindDateChange">
							<view class="placeholder" v-if="hideBirthday == false">
								请选择生日
							</view>
							<view v-if="hideBirthday == true">{{birthday}}</view>
						</picker>
					</view>
					<view class="right">
						<image src="/static/public/go_grey.png" />
					</view>
				</view>
			</view>
			<view class="list">
				<view class="inside">
					<view class="left">
						<text>城市</text>
						<input v-model="region" type="text" placeholder="请选择城市" @tap="chooseCity" disabled />
					</view>
					<view class="right">
						<image src="/static/public/go_grey.png" />
					</view>
				</view>
			</view>
			<view class="list">
				<view class="inside">
					<view class="left">
						<text>邮箱</text>
						<input v-model="email" type="text" placeholder="请输入您的邮箱" />
					</view>
				</view>
			</view>
			<!-- <view class="list">
				<view class="inside">
					<view class="left">
						<text>学员或机构</text>
						<input v-model="type" type="text" placeholder="待完善（个人用户无需填写）" placeholder-style="font-size:28upx;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:#E5E5E5;line-height:28upx;" disabled />
					</view>
					<view class="right">
						<text>{{status}}</text>
						<image src="/static/public/go_grey.png" />
					</view>
				</view>
			</view> -->
			<view class="change" @tap="toChange">
				<text>密码设置</text>
				<image src="/static/public/go_grey.png" />
			</view>
			
			<button class="btn" @tap="save">保存</button>
			
			<mpvue-city-picker themeColor="#007aff" ref="mpvueCityPicker" :pickerValueDefault="cityValue" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		</view>
		<view>
			<kps-image-cutter @ok="onok" @cancel="oncancle" :url="path" :fixed="true" :width="300" :height="300"></kps-image-cutter>
		</view>
		
		<view class="toast" :class=" toast" @touchmove.stop.prevent @tap.stop.prevent>
			<view class="toast_content">
				<image class="caveat" src="/static/public/caveat.png" mode="widthFix" />
				<view>
					H5网页端暂不提供头像上传功能
				</view>
				<view>
					请使用《新威研选》APP上传头像
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
	export default {
		components: {
			mpvueCityPicker,
			kpsImageCutter
		},
		data() {
			const currentDate = this.getDate({
				format: true,
				})
			return {
				userName:'',
				id: "",
				nickname: "",
				index:0,
				genders:['男', '女'],
				gender: "",
				hideGender:false,
				birthday: currentDate,
				hideBirthday:false,
				region: "",
				province: '',
				city: '',
				area: '',
				cityValue: [0, 0, 0],
				email: "",
				type: "",
				status:"",
				path: "",
				file:"",
				imgUrl: "",
				show:true,
				token:"",
				toast:'hide',
			};
		},
		onLoad() {
			this.token = uni.getStorageSync('token');
			this.getUser();
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
		watch:{
			birthday:function(val){
				if(val != null && val != "" && val != undefined){
					this.hideBirthday = true;
				}else{
					this.birthday = ''
					this.hideBirthday = false;
				}
			},
			nickname:function(val){
				if(val == null || val == undefined){
					this.nickname = ''
				}
			},
		},
		methods:{
			getUser(){
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.imgUrl = res.data.data.headImg
							this.id = res.data.data.userUniqueId
							this.nickname = res.data.data.nickname;
							this.index = res.data.data.gender;
							this.userName = res.data.data.userName
							this.gender = this.genders[this.index];
							if(this.gender.length > 0){
								this.hideGender = true;
							};
							this.birthday = res.data.data.birthday;
							
							this.region = res.data.data.province+'-'+res.data.data.city+'-'+res.data.data.area
							if(res.data.data.province == null || undefined || ''){
								this.region = ''
							}
							if(res.data.data.city == null || undefined || ''){
								this.region = ''
							}
							if(res.data.data.area == null || undefined || ''){
								this.region = ''
							}
							this.email = res.data.data.email;
						}else{
							uni.showToast({
							    icon: 'none',
							    position: 'bottom',
							    title: '获取用户资料失败，请重新登录'
							});
							setTimeout(()=>{
								uni.navigateTo({
									url:"/pages/my/login/login"
								})
							},1000)
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			chooseImage() {
				// #ifndef H5
				uni.chooseImage({
					count: 1,
					sizeType:['original'],
				    success: (res) => {
				        this.path = res.tempFilePaths[0];
				    }
				});
			    // #endif
				// #ifdef H5
				this.toast = 'show';
				setTimeout(() => {
					this.toast = 'hide';
				}, 2000);
				 // #endif
			},
			onok(ev) {
				this.file = ev.path;
				// pathToBase64(plus.io.convertLocalFileSystemURL(ev.path))
				// 	.then(base64 => {
				// 		this.file = base64;
				// 	 })
				// 	 .catch(error => {
						
				// 	 });
				
			    this.path = "";
				uni.showLoading({
					title:'正在上传头像',
				});
				uni.uploadFile({
					url: this.$url+'/api/file/img-upload-headimg',
					filePath: this.file,
					name: 'file',
					header:{
						'Authorization':'Bearer '+this.token,
						'Content-Type':'multipart/form-data'
					},
					success: (uploadFileRes) => {
						 this.imgUrl = JSON.parse(uploadFileRes.data).data
						 uni.hideLoading()
						 uni.showToast({
						 	icon: 'success',
						 	title: "上传成功",
						 })
					}
				});
			},
			oncancle() {
			    // path设置为空，隐藏控件
			    this.path = "";
			},
			bindPickerChange(e) {
				this.index = e.target.value;
				this.gender = this.genders[this.index];
				this.hideGender = true;
			},
			bindDateChange(e) {
				this.birthday = e.target.value;
				this.hideBirthday = true;
			},
			toChange(){
				uni.navigateTo({
					url:'/pages/my/login/password/change'
				})
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
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
			save(){
				if (this.gender == "") {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '请选择性别'
				    });
				    return false;
				}
				if (this.email == "") {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '请输入邮箱'
				    });
				    return false;
				}
				// if(!RegExp(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).test(this.email)){
				// 	uni.showToast({
				// 		title:'请输入正确邮箱格式',
				// 		icon:'none',
				// 		position: 'bottom',
				// 	});
				// 	return false;
				// }
				uni.showModal({
					title: '提示',
					content: '是否确认保存？',
					confirmColor: '#F8B500',
					success: (res) => {
						if (res.confirm){
							uni.showLoading({
								title:'正在保存',
							});
							uni.request({
							    url: this.$url+'/api/appuser/improve', 
								data: {
									"headImg":this.imgUrl,
									"nickname": this.nickname,
									"gender":this.index,
									"birthday":this.birthday,
									"province":this.province,
									"city":this.city,
									"area":this.area,
									"email": this.email,
									'userName':this.userName
								},
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
								
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										uni.showToast({
											icon: 'success',
											title: "保存成功",
										})
										uni.setStorageSync('myAvatar', this.imgUrl);
										uni.setStorageSync('myNickname', this.nickname);
										setTimeout(()=>{
											uni.navigateBack()
										},1000)
									}else{
										uni.showToast({
											icon: 'none',
											position: 'bottom',
											title: res.data.message
										})
									}
							    },
								fail: (err) => {
									uni.hideLoading()
									this.$requestFail()
								}
							});
						} else if (res.cancel) {
								
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0; /*初始状态 透明度为0*/
		}
		50% {
			opacity: 0; /*中间状态 透明度为0.5*/
		}
		100% {
			opacity: 1; /*结尾状态 透明度为1*/
		}
	}
	@-webkit-keyframes fadeOut {
		0% {
			opacity: 1; /*初始状态 透明度为1*/
		}
		50% {
			opacity: 0.5; /*中间状态 透明度为0*/
		}
		100% {
			opacity: 0; /*结尾状态 透明度为0*/
		}
	}
	page{
		background-color: #F5F5F5;
	}
	.user_content{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:#111111;
		line-height:28upx;
		padding-top: 20upx;
		.list{
			width:100%;
			background:#FFFFFF;
			box-sizing: border-box;
			padding: 0 24upx;
			.inside{
				width: 100%;
				height: 88upx;
				border-bottom: 1upx solid #F5F5F5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left{
					display: flex;
					align-items: center;
					text{
						width: 140upx;
						color: #666666;
						margin-right: 24upx;
					}
					input{
						width: 380upx;
					}
					.input-placeholder{
						font-size:28upx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:#E5E5E5;
						line-height:28upx;
					}
					picker{
						width: 380upx;;
						height: 88upx;
						view{
							line-height:88upx;
						}
						.placeholder{
							color:rgba(229,229,229,1);
						}
					}
				}
				.right{
					display: flex;
					align-items: center;
					font-size:24upx;
					color:#F8B500;
					line-height:24upx;
					image{
						width: 32upx;
						height: 32upx;
					}
					.headPortrait{
						width: 72upx;
						height: 72upx;
						border-radius:100%;
						background-image: url(/static/my/avatar.png);
						background-size: 100% 100%; 
						background-repeat: no-repeat;
					}
				}
			}
			.head{
				height: 112upx;
			}
		}
		.change{
			width:100%;
			height: 88upx;
			background:#FFFFFF;
			box-sizing: border-box;
			padding: 0 24upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30upx;
			text{
				width: 140upx;
				color: #666666;
			}
			image{
				width: 32upx;
				height: 32upx;
			}
		}
		.btn{
			width:calc(100% - 48upx);
			height:76upx;
			background:#F8B500;
			border-radius:48upx;
			border: 1upx solid rgba(255,255,255,0);;
			font-size:28upx;
			font-weight:500;
			color:rgba(255,255,255,1);
			line-height:76upx;
			position: fixed;
			bottom: 30upx;
		}
	}
	.toast{
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		z-index: 20;
		display: none;
		&.show{
			display: flex;
			align-items: center;
			justify-content: center;
			-webkit-animation-name: fadeIn; /*动画名称*/
			-webkit-animation-duration: 1s; /*动画持续时间*/
			-webkit-animation-iteration-count: 1; /*动画次数*/
			-webkit-animation-delay: 0s; /*延迟时间*/
		}
		&.hide{
			display: none;
			-webkit-animation-name: fadeOut; /*动画名称*/
			-webkit-animation-duration: 1s; /*动画持续时间*/
			-webkit-animation-iteration-count: 1; /*动画次数*/
			-webkit-animation-delay: 0s; /*延迟时间*/
		}
		.toast_content{
			width: calc(100% - 250upx);
			background-color: rgba(0,0,0,0.5);
			border-radius:16upx;
			box-sizing: border-box;
			padding: 40upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size:28upx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:#FFFFFF;
			line-height:44upx;
			.caveat{
				width: 75upx;
				margin-bottom: 20upx;
			}
		}
	}
</style>
