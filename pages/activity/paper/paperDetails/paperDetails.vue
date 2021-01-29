<template>
	<view class="details_content">
		<view class="module">
			<view class="module_title">
				基本信息
			</view>
			<view class="list_ul">
				<view class="list" v-for="(item,index) in list1" :key="'list1'+index">
					<text class="title">{{item.title}}</text>
					<text class="value">{{item.model}}</text>
				</view>
			</view>
		</view>
		
		<view class="module">
			<view class="module_title">
				论文信息
			</view>
			<view class="list_ul">
				<view class="list" v-for="(item,index) in list2" :key="'list2'+index">
					<text class="title">{{item.title}}</text>
					<text class="value">{{item.model}}</text>
				</view>
				<view class="list">
					<text class="title">电子版</text>
					<text class="value" style="color: #F8B500;">{{pdfUrl}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				id:'',
				page:1,
				list1:[{
					title:'申请人',
					model:'',
				},
				{
					title:'性别',
					model:'',
				},
				{
					title:'最高学历',
					model:'',
				},
				{
					title:'学校/研究所',
					model:'',
				},
				{
					title:'院系',
					placeholder:'请输入院系完整名称',
					model:'',
				},
				{
					title:'导师（课题组）',
					model:'',
				},
				{
					title:'邮箱',
					model:'',
				},
				{
					title:'手机',
					model:'',
				},
				{
					title:'QQ',
					model:'',
				},
				{
					title:'微信',
					model:'',
				}],
				list2:[{
					title:'发表文章题目',
					model:'',
				},
				{
					title:'发表期刊名称',
					model:'',
				},
				{
					title:'期号',
					model:'',
				},
				{
					title:'IF',
					model:'',
				},
				{
					title:'第一作者',
					model:'',
				},
				{
					title:'发表年份',
					model:'',
				},
				{
					title:'发刊网址',
					model:'',
				}],
				pdfUrl:'',
			};
		},
		onLoad(options) {
			this.id = options.id;
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/paper/get?Id='+this.id, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.list1[0].model = res.data.data.applicantUser;
							if(res.data.data.gender == 1){
								this.list1[1].model = '男';
							}else if(es.data.data.gender == 2){
								this.list1[1].model = '女';
							}else{
								this.list1[1].model = '男';
							}
							this.list1[2].model = res.data.data.education;
							this.list1[3].model = res.data.data.organization;
							this.list1[4].model = res.data.data.collegesDepartment;
							this.list1[5].model = res.data.data.tutorTopic;
							this.list1[6].model = res.data.data.email;
							this.list1[7].model = res.data.data.phone;
							this.list1[8].model = res.data.data.qq;
							this.list1[9].model = res.data.data.weChat;
							this.list2[0].model = res.data.data.articleTitle;
							this.list2[1].model = res.data.data.periodicalName;
							this.list2[2].model = res.data.data.lssueNumber;
							this.list2[3].model = res.data.data.if;
							this.list2[4].model = res.data.data.firstAuthor;
							this.list2[5].model = res.data.data.pushDate;
							this.list2[6].model = res.data.data.issueUrl;
							this.pdfUrl = res.data.data.paperPdfUrl.split("pdf/")[1]
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
		}
	}
</script>

<style lang="scss">
	@import "./paperDetails.scss";
</style>
