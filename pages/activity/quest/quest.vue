<template>
	<view class="quest_content">
		<view class="tips_content">
			<view class="tips">为提供更好的服务！新威研选App诚邀您参与本次问卷 调查，本次问卷调查面向科研院校/企业实验室等人群， 请根据您的实际情况填写。</view>
			<view class="red" v-if="raffleId">有礼彩蛋：完成此问卷后可免费参与抽奖一次</view>
		</view>
		
		<view class="quest_ul">
			<view class="quest_list" :id="'list'+index" v-for="(item,index) in questList" :key="index">
				<view class="title">
					<text class="red" v-if="item.isRequired">*</text>{{item.title}}<!-- <text class="grey">{{item.questionType==1?'（单选）':item.questionType==2?'（多选）':item.questionType==3?'（问答）':item.questionType==4?'（填空）':''}}</text> -->
				</view>
				<view class="options_ul" v-if="item.questionType==1">
					<view class="options_list" v-for="(item2,index2) in item.questionsOptions" :key="'list'+index2">
						<view class="line" @tap.stop="singleOption(index,index2)">
							<text>{{item2.itemOption}}</text>
							<image :src="item2.select?'/static/activity/registration/selectradio.png':'/static/activity/registration/noselectradio.png'" />
						</view>
						<textarea v-model="item2.textarea" placeholder="请输入您的回答" v-if="item2.optionType&&item2.select" />
					</view>
				</view>
				<view class="options_ul" v-if="item.questionType==2">
					<view class="options_list" v-for="(item2,index2) in item.questionsOptions" :key="'list'+index2">
						<view class="line" @tap.stop="multipleOption(index,index2)">
							<text>{{item2.itemOption}}</text>
							<image :src="item2.select?'/static/activity/registration/selectradio.png':'/static/activity/registration/noselectradio.png'" />
						</view>
						<textarea v-model="item2.textarea" placeholder="请输入您的回答" v-if="item2.optionType&&item2.select" />
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn_content">
			<view class="btn" @tap.stop="submit">
				提交问卷
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				id:0,//活动ID
				raffleId:0,//抽奖ID
				questionnaireId:0,//问卷ID
				
				questList:[]
			};
		},
		onLoad(options) {
			this.id = options.id
			this.getQuestList()
		},
		methods:{
			getQuestList(){
				uni.request({
				    url: this.$url+'/api/questionnaire/getquestionnaire?id='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							for(let i=0;i<res.data.data.examinationQuestionDto.length;i++){
								res.data.data.examinationQuestionDto[i].select = false
								for(let j=0;j<res.data.data.examinationQuestionDto[i].questionsOptions.length;j++){
									res.data.data.examinationQuestionDto[i].questionsOptions[j].select = false
									res.data.data.examinationQuestionDto[i].questionsOptions[j].textarea = ''
									
								}
							}
							this.questList = res.data.data.examinationQuestionDto
							this.raffleId = res.data.data.raffleId
							this.questionnaireId = res.data.data.questionnaireId
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
			},
			singleOption(i,j){
				for(let x=0;x<this.questList[i].questionsOptions.length;x++){
					if(x!=j){
						this.questList[i].questionsOptions[x].select = false
					}
				}
				this.questList[i].questionsOptions[j].select = !this.questList[i].questionsOptions[j].select
				for(let y=0;y<this.questList[i].questionsOptions.length;y++){
					if(this.questList[i].questionsOptions[y].select){
						this.questList[i].select = true
						break
					}else{
						this.questList[i].select = false
					}
				}
			},
			multipleOption(i,j){
				this.questList[i].questionsOptions[j].select = !this.questList[i].questionsOptions[j].select
				for(let y=0;y<this.questList[i].questionsOptions.length;y++){
					if(this.questList[i].questionsOptions[y].select){
						this.questList[i].select = true
						break
					}else{
						this.questList[i].select = false
					}
				}
			},
			submit(){
				let answerDtos = []
				for(let i=0;i<this.questList.length;i++){
					if(!this.questList[i].select&&this.questList[i].isRequired){
						uni.createSelectorQuery().in(this).select('#list'+i).boundingClientRect(data => {
							uni.pageScrollTo({
							    scrollTop: data.top,
							    duration: 300
							});
						}).exec();
						uni.showToast({
						    title: '还没填写完成哦',
							icon:'none',
							position:'center'
						});
						return false
					}
					if(this.questList[i].select){
						let answerDto = {
							"questionsId": this.questList[i].id,
							"optionId": [],
							"customAnswer": ""
						}
						for(let j=0;j<this.questList[i].questionsOptions.length;j++){
							if(this.questList[i].questionsOptions[j].select){
								answerDto.optionId.push(this.questList[i].questionsOptions[j].id)
								if(this.questList[i].questionsOptions[j].optionType){
									if(this.questList[i].questionsOptions[j].textarea==''||this.questList[i].questionsOptions[j].textarea==null||this.questList[i].questionsOptions[j].textarea==undefined){
										uni.createSelectorQuery().in(this).select('#list'+i).boundingClientRect(data => {
											uni.pageScrollTo({
											    scrollTop: data.top,
											    duration: 300
											});
										}).exec();
										uni.showToast({
										    title: '还没填写完成哦!',
											icon:'none',
											position:'center'
										});
										return false
									}
									answerDto.customAnswer = this.questList[i].questionsOptions[j].textarea
								}
							}
						}
						answerDtos.push(answerDto)
					}
				}
				uni.showLoading({title: '提交中'});
				uni.request({
				    url: this.$url+'/api/questionnaire/answer', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"questionnaireId":this.questionnaireId,
						"answerDtos":answerDtos
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							uni.showToast({
							    title: '提交成功',
							});
							if(this.raffleId){
								uni.redirectTo({
									url:"/pages/browser/browser2?src="+this.$url+"/lottery/#/pages/nineLattice/quest&id="+this.raffleId
								})
							}
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
			}
		}
	}
</script>

<style lang="scss">
	@import './quest.scss'
</style>
