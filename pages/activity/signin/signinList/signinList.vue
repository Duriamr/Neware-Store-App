<template>
	<view class="signinList">
		<view class="my_header" style="background-image: url(/static/activity/signin/background.png);">
			<view class="status"></view>
			<view class="header">
				<image class="icon" src="/static/goods/back.png" @tap.stop="$back" />
			</view>
			<view class="infor_content">
				<view class="left">
					<image :src="imgUrl"/>
					<view class="infor">
						<text class="infor_id">ID：{{id}}</text>
						<view class="infor_allDay">
							<text>累计签到</text>
							<text class="allDay">{{allDay}}</text>
							<text class="text">天</text>
						</view>
					</view>
				</view>
				
				<view class="right">
					<text class="ranking">{{ranking}}</text>
					<text>名</text>
				</view>
			</view>
		</view>
		
		<scroll-view class="scroll" scroll-y="true">
			<view class="signin_ul">
				<view class="signin_list" v-for="(item, index) in signinList" :key="index">
					<view class="left">
						<view class="no" v-if="item.no == 1">
							<image src="/static/activity/signin/gold.png" />
						</view>
						<view class="no" v-if="item.no == 2">
							<image src="/static/activity/signin/silver.png" />
						</view>
						<view class="no" v-if="item.no == 3">
							<image src="/static/activity/signin/copper.png" />
						</view>
						<view class="no" v-if="item.no > 3">
							{{item.no}}
						</view>
						<image class="avatarImg" :src="item.headImage" v-if="item.headImage !=null && item.headImage !=''"/>
						<image class="avatarImg" src="/static/my/avatar.png" v-if="item.headImage ==null || item.headImage ==''"/>
						<text>{{item.userId}}</text>
					</view>
					
					<view class="right">
						<text class="text">累计签到</text>
						<text class="count">{{item.singInCount}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:'',
				
				imgUrl:'',
				id:'',
				allDay:'',
				ranking:'',
				
				signinList:[],
				
			};
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getLoadData()
		},
		methods:{
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/appsignin/ranking', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.imgUrl = res.data.data.headImage
							this.id = res.data.data.userId
							this.allDay = res.data.data.count
							this.ranking = res.data.data.ranking
							this.signinList = res.data.data.singInRankingDtos
						}else if(res.data.code == 401){
							this.$to401()
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
	@import "./signinList.scss"
</style>
