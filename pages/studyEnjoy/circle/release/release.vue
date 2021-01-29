<template>
	<view class="release_content">
		<view class="release_header">
			<view class="status"></view>
			<view class='header'>
				<image class="back" src="/static/goods/back_black.png" @tap.stop="back"></image>
				<text class='release' @tap.stop="handleRelease">发布</text>
			</view>
		</view>
		<view class="header_placeholder"></view>
		
		<view class='content'>
			<view class="textarea">
				<textarea v-model="releaseContent.content" placeholder="分享你的科研趣生活，能获得更多赞哦~" maxlength='2000' />
				<view class='number'>
					<view class="voice" @tap.stop='startRecognize()'>
						<image mode="aspectFit" class="searchImg" src="/static/studyEnjoy/circle/releaseVoid.png"/>
						<text class="searchText">语音输入</text>
					</view>
					<text>{{releaseContent.content.length}}/2000</text>
				</view>
			</view>
			
			<view class="upload_ul">
				<view class="upload_list" v-for='(item,index) in releaseContent.avatarImg' :key='"img"+index'>
					<image class='upImg' :src="item" @tap.stop="$previewImg(index,releaseContent.avatarImg)" mode="aspectFill" />
					<image class="cancel" src="/static/studyEnjoy/cancel.png" @tap.stop="cancelImg(index)"/>	
				</view>
				
				<view class="upload_list" v-if="releaseContent.avatarImg.length < 9">
					<image class="upImg" src="/static/studyEnjoy/add.png" @tap.stop='uploadImg(imgUpNum)'/>
				</view>
			</view>
			
			<view class="labelType">
				<view class="publishing" :class="index == number ? 'active':''" v-for="(item,index) in publishingTypeList" :key='index' @tap="handleIndex(item,index)">
					<view class="dot"></view>
					<text>{{item.value}}</text>
				</view>
			</view>
		</view>
		
	</view>
</template>
<script>
	export default {
		data() {
			return {
				releaseContent:{
					type:0,      // 类型 0：草稿,1:发布
					content:'',   // 内容
					videoUrl:'',  // 视频地址
					avatarImg:[],  // 图片地址
					publishingTypeId:null // 发布动态类型Id
				},
				
				token:uni.getStorageSync('token'),
				
				imgUpNum:9,
				imgLens:0,
				publishingTypeList:[],
				number:null, // 标签选中的下标
				type:false,
				flag:true,
				flaglogin:true,
				
				handleReleaseBind:true
			};
		},
		onLoad(options) {
			if(options.type == 'topic'){
				this.type = true
				this.number = 0
				this.publishingTypeList.push({
					value:options.topicName,
					key:options.topicId
				})
				this.releaseContent.publishingTypeId = options.topicId
			}else{
				this.type = false
				this.getPubilsh()
				this.getDraft()
			}
		},
		watch:{
			imgLens:function(val){
				this.imgUpNum = 9 - val
			}
		},
		methods:{
			//  语音输入
			startRecognize(){
				let _this = this;
				let options = {};
				options.engine = 'baidu';  //讯飞:iFly,百度:'baidu'
				options.punctuation = false; // 是否需要标点符号 
				options.timeout = 10 * 3000;
				plus.speech.startRecognize(options, function(text) {
					if(typeof(text)=='object'){
						text = JSON.stringify(text).replace('[','').replace('"','').replace('"','').replace(']','')
					}
					_this.releaseContent.content =_this.releaseContent.content+text;
				});
			},
			// 获取草稿内容
			getDraft(){
				uni.request({
					url:this.$url+'/api/scientificresearch/articledraft',
					method:'GET',
					header:{
						Authorization:'Bearer '+this.token
					},
					success:(res) =>{
						if(res.data.success && res.data.code == 200 ){
							if(res.data.data != null ){
								this.releaseContent = res.data.data
								this.releaseContent.publishingTypeId = this.releaseContent.publishIngTypeId
								delete  this.releaseContent.publishIngTypeId
								if(typeof this.releaseContent.publishingTypeId == 'number'){
								  this.number = this.publishingTypeList.findIndex((item,index) => item.key == this.releaseContent.publishingTypeId)
								}
							}
						}
					},
					fail: (err) => {
						this.$requestFail()
					}
				})
			},
			
			//  删除用户草稿箱
			deleteDarft(){
				uni.request({
					url:this.$url+'/api/scientificresearch/deletedarft',
					method:'POST',
					header:{
						Authorization:'Bearer '+this.token
					},
				})
			},
			
			
			// 发布
			handleRelease(){
				if(this.handleReleaseBind) {
					if(!this.releaseContent.content && this.releaseContent.avatarImg == 0){
						uni.showToast({icon: 'none',title: "内容不能为空",})
						return false
					}
								
					if(!this.flag){
						uni.showToast({icon: 'none',title: "正在上传图片",})
						return false
					}
					this.handleReleaseBind = false
					this.handleCommon(1)
				}else{
					uni.showToast({icon: 'none',title: "请勿重复点击",})
					return false
				}
			},
				
			//  common
			handleCommon(num){
				this.releaseContent.type = num
				if(num == 1){
					uni.showLoading({
					    title: '正在发布'
					});
				}else{
					uni.showLoading({
					    title: '正在保存'
					});
				}
				uni.request({
					url:this.$url+'/api/scientificresearch/addarticle',	
					header:{
						Authorization:'Bearer '+this.token
					},
					data:this.releaseContent,
					method:'POST',
					
					success: (res) => {
						uni.hideLoading()
						if(res.data.code == 200 && res.data.success){
							if(num == 1){
								uni.showToast({
								    title: "发布成功"
								});
								this.$store.commit("changeCircle",true)
								this.$store.commit("changeTopic",true)
								this.$store.commit("changeCirclePage",true)
								this.$store.commit("changeCircleDetails",true)
								setTimeout(()=>{
									uni.navigateBack()
								},500)
							}else{
								uni.showToast({
								    title: "保存成功"
								});
							}
						}else if(res.data.code == 401){
							this.handleReleaseBind = true
							this.$to401()
						}else{
							this.handleReleaseBind = true
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
				})
			},
			//  选择标签
			handleIndex(item,index){
				if(index != this.number ){
					this.number = index
					this.releaseContent.publishingTypeId = item.key
				}else{
					if(!this.type){
						this.number = null
						this.releaseContent.publishingTypeId = null
					}
				}		
			},
			//   获取类型
			getPubilsh(){
				uni.request({
					url:this.$url+'/api/scientificresearch/publishingtype',
					header:{
						Authorization:'Bearer '+this.token
					},
					method:'GET',
					success: (res) => {
						if(res.data.success && res.data.code == 200){
							this.publishingTypeList = res.data.data
						}
					},
					fail: (err) => {
						this.$requestFail()
					}
				})
			},
			//  上传图片
			// uploadImg(number){
			// 	uni.chooseImage({
			// 		count:number,
			// 		sizeType:['original'],
			// 	    success: (chooseImageRes) => {
			// 	        let tempFilePaths = chooseImageRes.tempFilePaths;
			// 			uni.showLoading({
			// 				title:'正在上传',
			// 			});
			// 			this.flag = false
			// 			for(let i=0; i<tempFilePaths.length; i++){
			// 				this.flag = false
			// 				uni.uploadFile({
			// 				    url: this.$url+'/api/scientificresearch/upload?type=0',
			// 				    filePath: tempFilePaths[i],
			// 				    name: 'File',
			// 				    success: (uploadFileRes) => {
			// 						this.releaseContent.avatarImg.push(JSON.parse(uploadFileRes.data).data)
			// 						this.imgLens = this.releaseContent.avatarImg.length
			// 						if(i == tempFilePaths.length-1){
			// 							this.flag = true
			// 							uni.hideLoading()
			// 							uni.showToast({
			// 								icon: 'success',
			// 								title: "上传成功",
			// 							})
			// 						}
			// 				    }
			// 				});
			// 			}
			// 	    }
			// 	});
			// },
			
			
			uploadImg(number){
				let that = this
				uni.chooseImage({
					count:number,
					sizeType:['original'],
				    sourceType: ['album','camera'], //相册和拍照
				    success: (chooseImageRes) => {
				        let tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading({
							title:'正在上传',
						});
						that.flag = false
						let i = 0 
						getImg()   // 递归上传解决发布上传图片顺序错乱问题
						function getImg(){
							if(i >= tempFilePaths.length){
								that.flag = true
								uni.hideLoading()
								uni.showToast({
									icon: 'success',
									title: "上传成功",
								})
								return
							}
							that.flag = false
							uni.uploadFile({
								url: that.$url+'/api/scientificresearch/upload?type=0',
								filePath: tempFilePaths[i],
								name: 'File',
								success: (uploadFileRes) => {
									that.releaseContent.avatarImg.push(JSON.parse(uploadFileRes.data).data)
									that.imgLens = that.releaseContent.avatarImg.length
									i++
									getImg()
									if(i == tempFilePaths.length-1){
										
									}
								}
							});
						}
						
				    }
				});
			},
			
			
			//  删除图片
			cancelImg(index){
				this.releaseContent.avatarImg.splice(index,1)
				this.imgLens = this.releaseContent.avatarImg.length
			},
			
			back(){
				// 是否保存草稿
				if((this.releaseContent.content != '' || this.imgLens > 0) && !this.type ){
					uni.showModal({
						content:"是否保存为草稿,以便继续使用",
						cancelText:'不保存',
						confirmText:'保存',
						cancelColor:'#333333',
						confirmColor:'#F8B500',
						success:(res) => {
							if (res.confirm) {
								this.handleCommon(0)  //保存草稿箱
							}else if (res.cancel) {
								this.deleteDarft()   // 删除草稿箱
							}
							uni.navigateBack()
						},
					})
				}else{ 
					uni.navigateBack()
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "./release.scss";
</style>
