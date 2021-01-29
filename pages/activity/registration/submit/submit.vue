<template>
	<view class="submitRegistration_conten">
		<view class="release_header">
			<view class="status"></view>
			<view class='header'>
				<image class="back" src="/static/goods/back_black.png" @tap.stop="back"></image>
				<view class="title">
					{{activityList.formTitle}}
				</view>
			</view>
		</view>
	<view class="content">
		<view class="title">
			{{activityList.formDescribe}}
		</view>
		<view class="form" v-if='activityList.activityFieldDtos && activityList.activityFieldDtos.length > 0'>
			 <view class="uni-form-item uni-column" v-for="(item,index) in activityList.activityFieldDtos" :key='index'>
				 <!-- input输入框 -->
				<view class="input" v-if="item.fieldType =='string'||item.fieldType =='int'">
					<view class="detailes">
						<image class='fivepointedstar' src="/static/activity/registration/fivepointedstar.png" v-if="item.isRequired" />
						<image class='fivepointedstar' src='' v-else />
					</view>
					<view class="text">{{item.name}}</view>
					<input
					 :type="item.fieldType =='string'?'text':'number'"
					 class="uni-input"
					  :placeholder=item.explain 
					  :adjust-position='false'
					   :maxlength='item.maxLength'
					   v-model="item.title"
					   />
				</view>
				
				<!-- 单选按钮 -->
				<view class="radio" v-if="item.fieldType =='bool'">
					<view class="detailes">
						<image class='fivepointedstar' src="/static/activity/registration/fivepointedstar.png" v-if="item.isRequired">
						<image class='fivepointedstar' src='' v-else>
						{{item.name}}
					</view>
					<view class="radio_form">
						<view class="radio_item" v-for="(data,index) in JSON.parse(item.option)" :key='index'>
							<image :src='item.selectNum == data.key ?selectImg:NoselectImg'  @tap='handleSelect(data,item)'>
							<text class="text">{{data.value}}</text>
						</view>
					</view>
				</view>
				
				<!--  上传图片 -->
				<view class='unloadImg' v-if="item.fieldType =='file'">
					<view class="titleUpload">
						<image class='fivepointedstar' src="/static/activity/registration/fivepointedstar.png" v-if="item.isRequired">
						<image class='fivepointedstar' src=''  v-else>
						{{item.name}}
					</view>
					<view class="describe">
						<image class='fivepointedstar' src=''>
						{{item.explain}}</view>
					<view @tap.stop='unploadImg(item)' v-if="!item.title">
						<image class='unpImg' src="/static/activity/registration/uploadImg.png" alt="">
					</view>
					<view class="upload_list" v-else>
						<image class='upImg' :src='item.title'  mode="aspectFill" @tap.stop="previewImg(item.title)"/>
						<image class="cancel" src="/static/studyEnjoy/cancel.png" @tap.stop="item.title=''"/>	
					</view>
				</view>
			</view>
			<view class='reminder'>
				{{activityList.formTip}}
			</view>
		</view>
		<view class='submit' @tap.stop='handlerequired' v-if="!flagSubmit">
			提交
		</view>
		 <button class='submitConfrim'  :loading="loading" v-else @tap.stop='handleSubmit' >{{loading?'':title}}</button>
	</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			loading:false,
			selectImg:'/static/activity/registration/selectradio.png',  // 未选中图标
			NoselectImg:'/static/activity/registration/noselectradio.png',  //选中图标
			token:uni.getStorageSync('token'),
			radioArr:['能','否'],
			avatarImg:'',
			flag:false,
			activityList:{},
			info:{},
			flagSubmit:false,
			title:'提交'
		}
	},
	onLoad(options) {
		this.id = options.id
		if(uni.getStorageSync('activityList'+this.id)){
			this.activityList = uni.getStorageSync('activityList'+this.id)
		}else{
			this.getFormData()
		}
	},
	watch:{
		'activityList.activityFieldDtos':{
			handler(value){
				this.flagSubmit = value.filter(item => item.isRequired).every(data =>{
					return data.title || typeof data.title == 'number'
				})
			},
			deep:true
		},
	},
	methods:{
		// 校验
		handlerequired(){
			// 校验必填项数据
			let arrisRequired = JSON.parse(JSON.stringify(this.activityList.activityFieldDtos))
			arrisRequired.reverse().forEach(item =>{
				if(item.isRequired && !item.title){
					uni.showToast({icon: 'none',title: item.name + '不能为空',})
				}
			})
		},
		
		// 提交
		handleSubmit(){
			if(this.loading) return
			this.loading = true
			// 保存的数据
			let obj = {
				promotionalActivityId:this.id
			}
			this.activityList.activityFieldDtos.forEach(item =>{
				obj[item.field] = item.title
			})
			
			uni.request({
				url:this.$url +'/api/live/signuptrain',
				method:'post',
				data:obj,
				header:{
					Authorization:'Bearer ' + this.token
				},
				success:(res)=> {
					this.loading = false
					if(!res.data.success || !res.data.data){
						uni.showToast({icon: 'none',title:res.data.message})
					}else{
						uni.removeStorageSync('activityList'+this.id)
						uni.redirectTo({
							url:'/pages/activity/registration/success/success?id='+this.id
						})
					}
				},
				fail: (err) => {
					this.$requestFail()
				}
			})
		},
		getFormData(){
			uni.request({
				url:this.$url+'/api/live/train?promotionalActivityId='+this.id,
				method:'get',
				header:{
					Authorization:'Bearer '+this.token
				},
				success:(res)=> {
					if(res.data.success && res.data.code == 200 ){
						res.data.data.activityFieldDtos.forEach(item =>{
							item.title = ''
							item.selectNum = null  // 选中的下标
						})
						this.activityList = res.data.data
					}
				},
				fail: (err) => {
					this.$requestFail()
				}
			})
		},
		//  切换单选框
		handleSelect(data,item){
			item.selectNum = data.key
			item.title = item.selectNum
		},
		
		// 上传图片
		unploadImg(item){
				uni.chooseImage({
					count:1,
					sizeType:['original'],
				    success: (chooseImageRes) => {
				        let tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading({
							title:'正在上传',
						});
						uni.uploadFile({
							url: this.$url+'/api/live/upload-image',
							filePath: tempFilePaths[0],
							name: 'File',
							success: (uploadFileRes) => {
								item.title = JSON.parse(uploadFileRes.data).data
								this.flag = true
								uni.hideLoading()
								uni.showToast({
									icon: 'success',
									title: "上传成功",
								})
							}
						});
				    }
				});
		},
		
		// 查看图片
		previewImg(avatarImg){
			uni.previewImage({
				current:0,
				urls:[avatarImg]
			})
		},
		
		back(){
			uni.showModal({
				content:'您的报名信息还未提交,\r\n请确定是否返回？',
				confirmText:'取消',
				cancelText:'确定',
				color:'#333333',
				cancelColor:'#333333',
				confirmColor:'#F8B500',
				success:(res) => {
					 if (res.cancel) {
						uni.setStorageSync('activityList'+this.id, this.activityList)
						uni.navigateBack()
						//  存缓存退后台清除
						this.$store.commit('SetCommitactivityList','activityList'+this.id)
					}
				},
			})
		},
		
		
	}
}
</script>

<style lang="scss">
	@import './submit.scss'
</style>
