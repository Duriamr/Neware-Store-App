<template>
	<view class="evaluate_content">
		<view class="evaluate_header">
			<view class="status"></view>
			<view class='header'>
				<image class="back" @tap.stop='handlegobanck' src="/static/goods/back_black.png"></image>
				<view class="title">发表评价</view>
				<text class='evaluate' @tap.stop="postComments">发布</text>
			</view>
		</view>
		<view class="product_info">
			<view class="top">
				<image :src="productInfo.imgUrl"></image>
				<view class="product_title">
					<view class="product_name">{{productInfo.productName}}</view>
					<view class="product_specifications" v-if= "productInfo.skuSpce && productInfo.skuSpce.length > 0">
						<text v-for="(item,indexs) in productInfo.skuSpce" :key='indexs' >
							{{item.value}} 
							<text v-if="indexs != productInfo.skuSpce.length - 1">
								/
							</text>
						</text>
					</view>
				</view>
			</view>
			<view class="product_evalute">	
				<text class="commodity_evaluation">商品评价</text>
					<text>
						<image v-for="(item,index) in arr" :key="index" class="select"
						@click="handleSelect(item,index)"
						:src="releaseContent.rating > index ?select : no_select"
						></image>
					</text>
					<text class="commodity_goods">{{arrTitle[releaseContent.rating]}}</text>
			</view>
		</view>
		<view class="comment_area">
			<view class="textarea">
				<textarea  :adjust-position='false' v-model="releaseContent.content" placeholder="分享您的使用感受，可以帮助更多想买的人" maxlength='500' />
				<view class='number'>
					<text>{{releaseContent.content.length}}/500</text>
				</view>
				<view class="upload_ul">
					<view class="upload_list" v-for='(item,index) in releaseContent.image' :key='"img"+index'  @tap.stop="$previewImg(index,releaseContent.image)">
						<image class='upImg' :src="item"  mode="aspectFill" ref='imgNode'/>
						<image class="cancel" src="/static/studyEnjoy/cancel.png" @tap.stop="cancelImg(index)"/>	
					</view>
					
					<view class="upload_list" v-if="releaseContent.image.length < 9">
						<image class="upImg" src="/static/studyEnjoy/add.png" @tap.stop='uploadImg(imgUpNum)'/>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productInfo:'', // 商品信息
				token:uni.getStorageSync('token'),
				imgUpNum:9,
				imgLens:0,
				handleReleaseBind:true,
				releaseContent:{
					content:"",
					image:[],
					rating:5,  // 评论分数
					productId:'',
					orderId:'',
				},
				arrTitle:['','非常差','差','一般','好','非常好'],  // 评论名称 
				arr:[0,1,2,3,4],
				flag:true,
				no_select:'/static/order/comment/no_select.png',  // 未选中
				select:'/static/order/comment/select.png',     // 选中
				evaluateListLeng:'',
				arrNode:[],
			}
		},
		watch:{
			imgLens:function(val){
				this.imgUpNum = 9 - val
			}
		},
		onLoad(option) { 
			this.productInfo = JSON.parse(option.product)
			this.releaseContent.productId = this.productInfo.productId
			this.releaseContent.orderId = this.productInfo.orderId
			this.evaluateListLeng = this.productInfo.evaluateListLeng
		},
		
		methods: {
			//  返回
			handlegobanck(){
				uni.navigateBack()
			},
			//  切换星星
			handleSelect(index){
			    this.releaseContent.rating =  index+1
			},
			//  上传图片
			uploadImg(number){
				let that = this
				uni.chooseImage({
					count:number,
					sizeType:['original'],
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
								return
							}
							that.flag = false
							uni.uploadFile({
								url: that.$url+'/api/productcomment/upload-image',
								filePath: tempFilePaths[i],
								name: 'File',
								success: (uploadFileRes) => {
									that.releaseContent.image.push(JSON.parse(uploadFileRes.data).data)
									that.imgLens = that.releaseContent.image.length
									uni.hideLoading()
									i++
									getImg()
									if(i == tempFilePaths.length){
										that.flag = true
										uni.showToast({
											icon: 'success',
											title: "上传成功",
										})
									}
								}
							});
						}
				    }
				});
			},
			
			// 删除图片
			cancelImg(index){
				this.releaseContent.image.splice(index,1)
				this.imgLens = this.releaseContent.image.length
			},
			
			//  发表评论
			postComments(){
				if(this.handleReleaseBind){
					if(!this.flag) {
						uni.showToast({icon: 'none',title: "正在上传图片",})
						return false
					}
					this.handleReleaseBind = false
					uni.showLoading({
					    title: '正在发布'
					});
					uni.request({
					    url: this.$url+'/api/productcomment/add', //仅为示例，并非真实接口地址。
					    data: this.releaseContent,	
						method:'POST',
					    header: {
							Authorization:'Bearer '+this.token
					    },
					    success: (res) => {
							uni.hideLoading()
							if(res.data.code == 200 && res.data.success){
								uni.showToast({
								    title: "评价成功"
								});
								this.handleReleaseBind = true
								setTimeout(() =>{
									this.$back()
								},500)
								this.$store.commit('EvaluationList',true)
							}else{
								this.handleReleaseBind = true
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
	@import './comment.scss' 

</style>
