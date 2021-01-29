<template>
	<view class="receive_content">
		<text class="tips">注：以下信息仅作为审核及领奖使用，请放心填写</text>
		<view class="input_ul" v-if="type!='look'">
			<view class="input_list" v-for="(item,index) in inputList" :key="index" v-if="!index">
				<view class="title">
					<text class="star">*</text>{{item.title}}
				</view>
				<view class="bot">
					<view class="input" :style="{border:item.border}">
						<input v-model="item.value" type="number" :placeholder="item.placeholder" :maxlength="item.maxlength" :focus="item.focus" @focus="focus(index)" @blur="blur(index)" @input="input" />
					</view>
					
					<view class="code_btn grey" style="background: #F5F5F5;color: #B3B3B3;" v-if="!codeType">
						获取验证码
					</view>
					<view class="code_btn" v-if="codeType==1" @tap.stop="sendCode(item.value)">
						获取验证码
					</view>
					<view class="code_btn" v-if="codeType==2">
						{{ss}}
					</view>
				</view>
			</view>
			
			<view class="input_list" v-for="(item,index) in inputList" :key="index" v-if="index">
				<view class="title">
					<text class="star">*</text>{{item.title}}
				</view>
				<view class="input" :style="{border:item.border}">
					<block>
						<input v-model="item.value" type="number" :placeholder="item.placeholder" :disabled="item.disabled" :maxlength="item.maxlength" :focus="item.focus" @focus="focus(index)" @blur="blur(index)" v-if="index==1 || index==6" />
						
						<input v-model="item.value" type='text' :placeholder="item.placeholder" :maxlength="item.maxlength" :focus="item.focus" @focus="focus(index)" @blur="blur(index)" v-else />
					</block>
					
				</view>
			</view>
		</view>
		<view class="input_ul" v-if="type=='look'">
			<view class="input_list" v-for="(item,index) in inputList" :key="index" v-if="index!=1">
				<view class="title">
					<text class="star">*</text>{{item.title}}
				</view>
				<view class="input" :style="{border:item.border}">
					<input v-model="item.value" type="text" :placeholder="item.placeholder" disabled />
				</view>
			</view>
		</view>
		
		<view class="image_ul">
			<view class="image_list">
				<view class="title">
					<text class="star">*</text>身份证照片正反面
				</view>
				<view class="images" v-if="type!='look'">
					<image :src="IDcardFace" mode="aspectFill" @tap.stop="camera(0)" />
					<image :src="IDcardBack" mode="aspectFill" @tap.stop="camera(1)" />
				</view>
				<view class="images" v-if="type=='look'">
					<image :src="IDcardFace" mode="aspectFill" @tap.stop="previewImg(0)" />
					<image :src="IDcardBack" mode="aspectFill" @tap.stop="previewImg(1)" />
				</view>
			</view>
			
			<view class="image_list">
				<view class="title">
					学生证/教师证（选填）
				</view>
				<image class="image" :src="IDteacher" mode="aspectFill" @tap.stop="chooseImage" v-if="type!='look'" />
				<image class="image" :src="IDteacher" mode="aspectFill" @tap.stop="previewImg(2)" v-if="type=='look'" />
			</view>
		</view>
		
		<view class="btn" v-if="!btnOff&&type!='look'" style="background: #E5E5E5;">
			提交
		</view>
		<view class="btn" v-if="btnOff&&type!='look'" @tap.stop="submit">
			提交
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				
				type:'edit',
				id:0,
				title:'',
				pid:'',
				
				codeType:0,
				ss:'0',
				
				btnOff:false,
				
				IDcardFace:'/static/activity/paper/IDcard_face.png',
				IDcardBack:'/static/activity/paper/IDcard_back.png',
				IDteacher:'/static/activity/paper/IDteacher.png',
				inputList:[
					{
						title:"联系电话（请输入与您报名时统一的号码）",
						value:"",
						placeholder:"请输入联系电话",
						border: "1px solid #E5E5E5",
						maxlength:11,
						focus:false
					},
					{
						title:"验证码",
						value:"",
						placeholder:"请输入验证码",
						border: "1px solid #E5E5E5",
						maxlength:6,
						focus:false,
						disabled:true
					},
					{
						title:"姓名",
						value:"",
						placeholder:"请输入身份证一致的姓名",
						border: "1px solid #E5E5E5",
						maxlength:5,
						focus:false
					},
					{
						title:"论文题目",
						value:"",
						placeholder:"请输入论文题目",
						border: "1px solid #E5E5E5",
						maxlength:300,
						focus:false
					},
					{
						title:"收货地址",
						value:"",
						placeholder:"请输入收货地址",
						border: "1px solid #E5E5E5",
						maxlength:300,
						focus:false
					},
					{
						title:"开户银行",
						value:"",
						placeholder:"请输入您的开户银行",
						border: "1px solid #E5E5E5",
						maxlength:140,
						focus:false
					},
					{
						title:"银行卡号（需提供与身份证一致的开户账号）",
						value:"",
						placeholder:"请仔细核对您的银行卡号",
						border: "1px solid #E5E5E5",
						maxlength:19,
						focus:false,
						disabled:false
					},
				],
				
			};
		},
		onLoad(options) {
			if(options){
				this.type = options.type
				this.id = options.id
				this.title = options.title
				this.pid = options.pid
				uni.setNavigationBarTitle({title: this.title});
			}
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			if(this.type=='look'){
				this.getInfo()
			}
		},
		onBackPress(e){
			if(this.type == 'look'){
				return false;
			}
			if(e.from === 'navigateBack'){
				return false;  
			}else{
				uni.showModal({
				    title: '您的领奖信息还未提交，\r\n请确定是否返回？',
					cancelText:'确定',
					confirmText:'取消',
				    success: (res) => {
				        if (res.cancel) {
							uni.navigateBack()
				        }
				    }
				});
				return true;
			}
		},
		watch:{
			inputList:{
				handler:function(){
					if(this.inputList[0].value.length==11
					&&this.inputList[1].value.length==6
					&&this.inputList[2].value!=''
					&&this.inputList[3].value!=''
					&&this.inputList[4].value!=''
					&&this.inputList[5].value!=''
					&&this.inputList[6].value.length>=16
					&&this.IDcardFace!=''
					&&this.IDcardFace!='/static/activity/paper/IDcard_face.png'
					&&this.IDcardBack!=''
					&&this.IDcardBack!='/static/activity/paper/IDcard_back.png'
					){
						this.btnOff = true
					}else{
						this.btnOff = false
					}
				},
				deep: true
			},
			IDcardFace:function(){
				if(this.inputList[0].value.length==11
				&&this.inputList[1].value.length==6
				&&this.inputList[2].value!=''
				&&this.inputList[3].value!=''
				&&this.inputList[4].value!=''
				&&this.inputList[5].value!=''
				&&this.inputList[6].value.length>=16
				&&this.IDcardFace!=''
				&&this.IDcardFace!='/static/activity/paper/IDcard_face.png'
				&&this.IDcardBack!=''
				&&this.IDcardBack!='/static/activity/paper/IDcard_back.png'
				){
					this.btnOff = true
				}else{
					this.btnOff = false
				}
			},
			IDcardBack:function(){
				if(this.inputList[0].value.length==11
				&&this.inputList[1].value.length==6
				&&this.inputList[2].value!=''
				&&this.inputList[3].value!=''
				&&this.inputList[4].value!=''
				&&this.inputList[5].value!=''
				&&this.inputList[6].value.length>=16
				&&this.IDcardFace!=''
				&&this.IDcardFace!='/static/activity/paper/IDcard_face.png'
				&&this.IDcardBack!=''
				&&this.IDcardBack!='/static/activity/paper/IDcard_back.png'
				){
					this.btnOff = true
				}else{
					this.btnOff = false
				}
			}
		},
		methods:{
			focus(i){
				this.inputList[i].border = "1px solid #F8B500"
			},
			blur(i){
				this.inputList[i].border = "1px solid #E5E5E5"
			},
			input(){
				if(this.codeType != 3){
					if(this.inputList[0].value.length==11){
						this.judge(this.inputList[0].value)
					}else{
						this.codeType = 0
					}
				}
			},
			judge(phone){
				uni.showLoading({title:"校验中"})
				uni.request({
				    url: this.$url+'/api/paper/prizesphonetatus?phone='+phone, 
					method: "GET",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							this.codeType = 1
							this.inputList[1].disabled = false
						}else{
							this.codeType = 0
							uni.showModal({
								title:"警告",
								content:res.data.message,
								showCancel:false,
								success:()=>{
									this.inputList[0].value=''
								}
							})
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			sendCode(phone){
				uni.showLoading({title:"发送中"})
				uni.request({
				    url: this.$url+'/api/appuser/v1/phone-code', 
				 	method: "POST",
				     data:{
				 		"phone": phone,
				 		"messageTemplate": 2,
				 		"signKey": this.$signKey
				 	},
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							let codeTime = new Date().getTime()
							uni.setStorageSync('codeTime',codeTime);
							this.codeType = 2
							this.ss = '59S'
							this.inputList[1].value = ''
							this.inputList[1].focus = false
							setTimeout(()=>{
								this.inputList[1].focus = true
							},100)
							this.getCountDown()
						}else{
							uni.showToast({
							    icon: 'none',
								position:'center',
							    title: res.data.message
							});
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			getCountDown(){
				let codeTime = uni.getStorageSync('codeTime');
				let nowTime
				let timeoutID = setInterval(()=>{
					nowTime = new Date().getTime()
					let timeDiff = nowTime - codeTime
					if(timeDiff >= 60000){
						if(this.inputList[0].value.length==11){
							this.judge(this.inputList[0].value)
						}else{
							this.codeType = 0
						}
						this.ss = ''
						clearInterval(timeoutID)
					}else{
						this.codeType = 2
						let timeRem = 60000 - timeDiff
						this.ss = Math.floor(timeRem/1000)+'S'
					}
				},1000)
			},
			camera(i){
				uni.chooseImage({
				    count: 1,
				    sourceType: ['camera'],
				    success: (chooseImageRes) => {
						let tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading()
						uni.uploadFile({
							url: this.$url+'/api/paper/upload-image',
							filePath: tempFilePaths[0],
							name: 'File',
							success: (uploadFileRes) => {
								uni.hideLoading()
								if(i){
									this.IDcardBack = JSON.parse(uploadFileRes.data).data
								}else{
									this.IDcardFace = JSON.parse(uploadFileRes.data).data
								}
							},
							fail: (err) => {
								uni.hideLoading()
								this.$requestFail()
							}
						});
				    }
				})
			},
			chooseImage(){
				uni.chooseImage({
				    count: 1,
				    success: (chooseImageRes) => {
						let tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading()
						uni.uploadFile({
							url: this.$url+'/api/paper/upload-image',
							filePath: tempFilePaths[0],
							name: 'File',
							success: (uploadFileRes) => {
								uni.hideLoading()
								this.IDteacher = JSON.parse(uploadFileRes.data).data
							},
							fail: (err) => {
								uni.hideLoading()
								this.$requestFail()
							}
						});
				    }
				})
			},
			previewImg(i){
				uni.previewImage({
					current:i,
					urls:[this.IDcardFace,this.IDcardBack,this.IDteacher]
				})
			},
			submit(){
				uni.showLoading({title:"正在提交"})
				let IDcard = [this.IDcardFace,this.IDcardBack] 
				let IDteacher
				if(this.IDteacher=='/static/activity/paper/IDteacher.png'){
					IDteacher = ''
				}else{
					IDteacher = this.IDteacher
				}
				uni.request({
				    url: this.$url+'/api/paper/addprize', 
					data: {
						"promotionalActivityId": this.id,
						"phone": this.inputList[0].value,
						"code": this.inputList[1].value,
						"userName": this.inputList[2].value,
						"articleTitle": this.inputList[3].value,
						"address": this.inputList[4].value,
						"bankName": this.inputList[5].value,
						"bankCardNo": this.inputList[6].value,
						"idCardImages": IDcard,
						"otherImages": IDteacher,
						"PaperActivityId": Number(this.pid),
					},
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
					
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							uni.showToast({icon: 'success',title: "提交成功",})
							setTimeout(()=>{
								uni.redirectTo({
									url:"/pages/activity/paper/receive/success/success"
								})
							},1000)
						}else if(res.data.code == 401){
							this.$to401()
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
			},
			getInfo(){
				uni.showLoading({title:"正在获取"})
				uni.request({
				    url: this.$url+'/api/paper/prizesinfo?pId='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							this.inputList[0].value = res.data.data.phone
							this.inputList[2].value = res.data.data.userName
							this.inputList[3].value = res.data.data.articleTitle
							this.inputList[4].value = res.data.data.address
							this.inputList[5].value = res.data.data.bankName
							this.inputList[6].value = res.data.data.bankCardNo
							this.IDcardFace = res.data.data.idCardImages[0]
							this.IDcardBack = res.data.data.idCardImages[1]
							this.IDteacher = res.data.data.otherImages
						}else if(res.data.code == 401){
							this.$to401()
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
			},
		}
	}
</script>

<style lang="scss">
	image{
		display: block;
		background: #F5F5F5;
	}
	.receive_content{
		font-size: 28upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 28upx;
		box-sizing: border-box;
		padding: 24upx 24upx 70upx;
		border-top: 2upx solid #E5E5E5;
		.tips{
			font-size: 24upx;
			color: #F75C50;
			line-height: 24upx;
		}
		.input_ul{
			margin-top: 24upx;
			.input_list{
				width: 100%;
				display: flex;
				flex-direction: column;
				margin-bottom: 32upx;
				.title{
					margin-bottom: 20upx;
					text{
						color: #F75C50;
						margin-right: 8upx;
						position: relative;
						top: 4upx;
					}
				}
				.input{
					width: 100%;
					height: 76upx;
					border-radius: 8upx;
					box-sizing: border-box;
					padding: 0 24upx;
					input{
						width: 100%;
						height: 100%;
						font-size: 28upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #333333;
						line-height: 28upx;
					}
					.input-placeholder{
						font-size: 28upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #B3B3B3;
						line-height: 28upx;
					}
				}
				.bot{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.input{
						width: 498upx;
					}
					.code_btn{
						width: 188upx;
						height: 76upx;
						background: #F8B500;
						border-radius: 8upx;
						color: #FFFFFF;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
		.image_ul{
			.image_list{
				width: 100%;
				display: flex;
				flex-direction: column;
				margin-bottom: 32upx;
				.title{
					margin-bottom: 20upx;
					.star{
						color: #F75C50;
						margin-right: 8upx;
						position: relative;
						top: 4upx;
					}
				}
				.images{
					width: 100%;
					display: flex;
					justify-content: space-between;
					image{
						width: 336upx;
						height: 232upx;
						border-radius: 8upx;
					}
				}
				.image{
					width: 100%;
					height: 360upx;
					border-radius: 8upx;
				}
			}
		}
		.btn{
			width: 702upx;
			height: 76upx;
			border-radius: 38upx;
			background: #F8B500;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
