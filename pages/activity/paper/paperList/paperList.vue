<template>
	<view class="list_content">
		<empty marginTop="200upx" src="/static/expect/not_Order.png" v-if="paperList.length <= 0" />
		<view class="paper_ul" v-for="(item,index) in paperList" :key="index">
			<view class="module_title">
				<text class="session">{{item.session}}</text>
				<text class="type" v-if="item.type==2" style="color: #B3B3B3;">{{item.typeName}}</text>
				<text class="type" v-else style="color: #F75C50;">{{item.typeName}}</text>
			</view>
			<view class="list_ul">
				<view class="list" v-for="(item2,index2) in item.paperReviewShortDtos" :key="'list'+index2" @tap.stop=toPaperDetails(item2.id) >
					<view class="periodicalName">
						{{item2.periodicalName}}
					</view>
					<view class="bot">
						<text>第一作者：{{item2.applicantUser}}</text>
						
						<text v-if="item.type==0||item.type==1">参赛编号：{{item2.randomCode}}</text>
						<block v-if="item.type==2">
							<text v-if="!item2.status" style="color: #B3B3B3;">{{item2.statusName}}</text>
							<text v-else style="color: #F8B500;">{{item2.statusName}}</text>
						</block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {empty},
		data() {
			return {
				token:uni.getStorageSync('token'),
				paperList:[],
			};
		},
		onLoad() {
			this.getPaperList();
		},
		methods:{
			getPaperList(){
				uni.request({
				    url: this.$url+'/api/paper/multiv2', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.paperList = res.data.data
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
			toPaperDetails(id){
				uni.navigateTo({
					url:'/pages/activity/paper/paperDetails/paperDetails?id='+id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./paperList.scss";
</style>
