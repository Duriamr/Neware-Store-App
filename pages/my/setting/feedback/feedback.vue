<template>
	<view class="feedback_content">
		<view class="list">
			<view class="inside">
				<text>意见反馈</text>
				<view class="right">
					<picker mode="selector" :range="typeList" @change="showPicker">
						<view style="color: #B3B3B3;" v-if="index == 0">请选择</view>
						<view v-if="index > 0">{{typeList[index]}}</view>
					</picker>
					<image src="/static/public/go_grey.png" />
				</view>
			</view>
		</view>
		<view class="feedback">
			<view class="top" style="position: relative;">
				<textarea v-model="feedback" type="text" placeholder="请写下您对新威研选的使用感受，我们将认真听取您的意见，努力提供更优质的服务～" placeholder-style="font-size:28upx;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:#B3B3B3;line-height:40upx;" maxlength="100" @input="display"/>
				<view style="position: absolute;right: 0;bottom: 10px;">
					{{feedback.length}}/100
				</view>
			</view>
			<view class="bot">
				<view  class="imageList"  v-if="imgUrl && imgUrl.length >0 " v-for="(item,index) in imgUrl" :key='index'>
					<image :src="item"  @tap.stop="$previewImg(index,imgUrl)" mode="aspectFill" />
					<image class="cancel" src="/static/studyEnjoy/cancel.png" @tap.stop="cancelImg(index)"/>
				</view>
				<view class="left" @tap="addImg" v-if="imgUrl.length < 6 ">
					+
				</view>
			</view>
		</view>
		<view class="contact">
			<input v-model="contact" type="text" placeholder="手机邮箱/QQ（选填）" placeholder-style="font-size:28upx;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(179,179,179,1);line-height:28upx;" />
		</view>
		<button class="btn" @tap="contactus">提交</button>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '@/components/image-tools/index.js'
	
	export default {
		data() {
			return {
				typeList: ['请选择', '商品类型', '物流状况', '客户服务', '优惠活动', '产品体验', '产品功能', '其它'],
				index:0,
				feedback:"",
				number:0,
				contact:"",
				showImg:false,
				file:"",
				imgUrl:[],
				imgUpload:6,
				num:'',
			};
		},
		methods: {
			//  删除图片
			cancelImg(index){
				this.imgUrl.splice(index,1)
			},
			
			display(e){
				this.number = e.detail.cursor
			},
			addImg(){
				uni.showModal({
					title: '提示',
					content: '是否上传图片？',
					confirmColor: '#F8B500',
					success: (res) => {
						if (res.confirm){
							uni.chooseImage({
								count: 6-this.imgUrl.length,
								sizeType:['original'],
							    success: (res) => {
								    const tempFilePaths = res.tempFilePaths;
									uni.showLoading({
										title:'正在上传图片',
									});
									for(let i = 0 ; i < tempFilePaths.length ; i++){
										uni.uploadFile({
											url: this.$url+'/api/file/img-upload-contactusimg',
											filePath: tempFilePaths[i],
											name: 'file',
											// header:{
											// 	'Content-Type':'multipart/form-data'
											// },
											success: (uploadFileRes) => {
												 this.imgUrl.push(JSON.parse(uploadFileRes.data).data)
												 uni.hideLoading()
												 uni.showToast({
												 	icon: 'success',
												 	title: "上传成功",
												 })
											}
										});
										
										
									}
							    }
							});
						}
					}
				})
			},
			showPicker(e) {
				this.index = e.target.value
			},
			contactus(){
				if(this.index == 0){
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: "请选择意见类型"
					})
					return false
				}else if(this.number == 0){
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: "请填写意见"
					})
					return false
				}else{
					uni.request({
					    url: this.$url+'/api/contactus/add', 
					    data: {
							"content": this.feedback,
							"contact": this.contact,
							"feedbackType": this.index,
							"imgUrl": this.imgUrl,
					    },
						header:{
							Authorization:'Bearer '+this.token
						},
						method: "POST",
					    success: (res) => {
							if(res.data.success&&res.data.code == 200){
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: "反馈成功"
								})
								setTimeout(()=>{
									this.$toHome()
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
							this.$requestFail()
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.feedback_content{
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
			margin-bottom: 20upx;
			.inside{
				width: 100%;
				height: 88upx;
				border-bottom: 1upx solid #F5F5F5;
				display: flex;
				justify-content: space-between;
				align-items: center;
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
				}
			}
		}
		.feedback{
			width:100%;
			background:#FFFFFF;
			box-sizing: border-box;
			padding: 0 24upx;
			margin-bottom: 20upx;
			.top{
				width: 100%;
				height: 256upx;
				box-sizing: border-box;
				padding-top: 16upx;
				textarea{
					width: 100%;
					height: 100%;
				}
			}
			.bot{
				width: 100%;
				box-sizing: border-box;
				padding-bottom: 24upx;
				// display: flex;
				// justify-content: space-between;
				// align-items: flex-end;
				display: flex;
				flex-wrap: wrap;
				.left{
					width: 224upx;
					height: 224upx;
					display: flex;
					justify-content: center;
					align-items: center;
					background:#F5F5F5;
					font-size:60upx;
					font-weight:200;
					color: #E5E5E5;
				}
				.imageList{
					position: relative;
					margin-right: 15upx;
					margin-bottom: 15upx;
					width: 224upx;
					height: 224upx;
					image{
						width: 100%;
						height: 100%;
					}
					.cancel{
						width: 35upx;
						height: 35upx;
						padding-top: 10upx;
						padding-right: 10upx;
						position: absolute;
						right: 10upx;
						top: 0;
					}
				}
				.imageList:nth-child(3),
				.imageList:nth-child(6)
				{
					margin-right: 0;
				}
				
				.right{
					font-size:22upx;
					color:#B3B3B3;
					line-height:22upx;
				}
			}
		}
		.contact{
			width:100%;
			height:88upx;
			background:#FFFFFF;
			box-sizing: border-box;
			padding: 0 24upx;
			display: flex;
			align-items: center;
			input{
				width: 100%;
				height: 28upx;
			}
		}
		.btn{
			width:calc(100% - 48upx);
			height:76upx;
			background:#F8B500;
			border-radius:48upx;
			font-size:28upx;
			font-weight:500;
			color:rgba(255,255,255,1);
			line-height:76upx;
			position: fixed;
			bottom: 12upx;
		}
	}
</style>
