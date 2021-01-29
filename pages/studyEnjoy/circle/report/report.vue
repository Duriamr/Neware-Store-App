<template>
	<view class="report_content">
		<view class="report_header">
			<view class="status"></view>
			<view class='header'>
				<image class="back" src="/static/goods/back_black.png" @tap.stop='$back'></image>
				<text class='report'>举报</text>
				<text class='submit' @tap.stop='handleSubmit'>提交</text>
			</view>
		</view>
		<view class="header_placeholder"></view>
		
		<view class="content">
			
			<view class="reportType">
				<view class='title'>所属分类</view>
				<view class='reportType_ul'>
					<view class="reportType_list" :class="item == complaintsDto.type ? 'active':''" v-for="(item,index) in complaintstypeList" :key='index' @tap.stop='handleIndex(item)'>
						{{item}}
					</view>
				</view>
			</view>
			
			<view class="reportMain">
				<view class='title'>举报描述</view>
				<textarea v-model="complaintsDto.content" placeholder="请详细描述您举报原因..." maxlength='1000'/>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				
				complaintstypeList:[],
				complaintsDto:{
					articleId:'',   // 举报的文章Id
					type:'',
					content:'',
				},
			};
		},
		onLoad(options) {
			this.complaintsDto.articleId = options.articleId
			this.getInreportType()
		},
		methods:{
			// 选中举报类型
			handleIndex(data){
				this.complaintsDto.type = data 
			},
			
			// 获取举报类型
			getInreportType(){
				uni.request({
					url:this.$url+'/api/scientificresearch/complaintstype',
					method:'GET',
					header:{
						Authorization:'Bearer '+this.token
					},
					success:(res) =>{
						if(res.data.code == 200 && res.data.success){
							this.complaintstypeList = res.data.data
							this.complaintsDto.type = res.data.data[0]
						}
					},
					fail: (err) => {
						this.$requestFail()
					}
				})
			},
			
			//  提交
			handleSubmit(){
				if(!this.complaintsDto.content) return uni.showToast({	icon: 'none',title: "内容不能为空",})	
				uni.showLoading({
				    title: '正在提交'
				});
				uni.request({
					url:this.$url+'/api/scientificresearch/addcomplaints',
					method:'POST',
					header:{
						Authorization:'Bearer '+this.token
					},
					data:this.complaintsDto,
					success: (res) => {
						uni.hideLoading()
						if(res.data.success && res.data.code == 200 ){
							if(!res.data.data){
								uni.showToast({
									icon:'none',
									position:'bottom',
								    title: res.data.message
								});
							}else{
								uni.showToast({
								    title: "举报成功"
								});
							}
							setTimeout(()=>{
								uni.navigateBack()
							},500)
						}
					},
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./report.scss";
</style>
