<template>
	<view class="all_content">
		<view class="all_header">
			<view class="status"></view>
			<view class='header'>
				<image class="back" src="/static/goods/back_black.png" @tap.stop="$back"></image>
				<text>论文评选</text>
				<image class="avatarImg" v-if="!login" src="/static/my/avatar_grey.png" @tap.stop="$toLogin" />
				<image class="avatarImg" v-if="login" :src="imgUrl" @tap.stop="toPaperList" />
			</view>
		</view>
		<view class="header_placeholder"></view>
		
		
		<view class="notice">
			<image src="/static/activity/paper/all/horn.png" mode="widthFix" />
			<text>{{notice}}</text>
		</view>
		
		<view class="judges_content">
			<view class="module_title">
				<text>历届评委</text>
				<view class="dots">
					<view class="dot" :class="index==swiperCurrent?'active':''" v-for="(item,index) in judgesList" :key="'dot'+index"></view>
				</view>
			</view>
			<swiper class="swiper" :current="swiperCurrent" circular @change="swiperChange">
				<swiper-item v-for="(item,index) in judgesList" :key="index">
					<view class="swiper-item" @tap.stop="swiperTap(index)">
						<view class="top">
							<image :src="item.headImageUrl" />
							<view class="info">
								<text class="name">{{item.name}}</text>
								<view class="info_bot">
									<text class="school">{{item.school}}</text>
									<text class="title">{{item.label}}</text>
								</view>
							</view>
						</view>
						
						<view class="bot">
							{{item.introduce}}
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="periods_content">
			<view class="module_title">
				<text>比赛进程</text>
			</view>
			<view class="periods_ul">
				<view class="periods_list" v-for="(item,index) in periodsList" :key="'periods'+index" @tap.stop="$toPath(item.url)">
					<image class="bg" :src="item.image" mode="widthFix" />
					<view class="bot">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">{{item.time}}</text>
						</view>
						<view class="right">
							<image :src="!item.status?'/static/activity/paper/all/type0.png':item.status==1?'/static/activity/paper/all/type1.png':item.status==2?'/static/activity/paper/all/type2.png':''" />
							<text v-if="!item.status">{{item.statusDescribe}}</text>
							<text v-if="item.status==1" style="background:#F8B500;">{{item.statusDescribe}}</text>
							<text v-if="item.status==2" style="background:#E5E5E5;color:#B3B3B3;">{{item.statusDescribe}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="judges_page" @tap.stop="hideBomb" v-if="bomb">
			<view class="layer" @tap.stop>
				<image class="x" src="/static/goods/x.png" @tap.stop="hideBomb" />
				<swiper class="swiper" :current="swiperCurrent2" circular @change="swiperChange2">
					<swiper-item v-for="(item,index) in judgesList2" :key="'layer1'+index">
						<image class="swiper-item" :class="index==swiperCurrent2?'active':''" :src="item.headImageUrl" mode="widthFix" @tap.stop="swiperTap2(index)" />
					</swiper-item>
				</swiper>
				
				<view class="info">
					<text class="name" @touchmove.stop.prevent>{{judgesList2[swiperCurrent2].name}}</text>
					<view class="info_bot" @touchmove.stop.prevent>
						<text class="school">{{judgesList2[swiperCurrent2].school}}</text>
						<text class="title">{{judgesList2[swiperCurrent2].label}}</text>
					</view>
					<textarea class="introduceDetails" disabled v-model="judgesList2[swiperCurrent2].introduceDetails" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:'',
				imgUrl:'',
				login:false,
				
				notice:'',
				
				judgesList:[],
				swiperCurrent:0,
				
				judgesList2:[],
				swiperCurrent2:0,
				
				periodsList:[],
				bomb:false,
			};
		},
		onLoad() {
			this.getNotice()
			this.getJudges()
			this.getPeriodsList()
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			if(this.token!=''&&this.token!=null&&this.token!=undefined){
				this.login = true
			}else{
				this.login = false
			}
			this.imgUrl = uni.getStorageSync('myAvatar');
		},
		onBackPress(e){
			if(this.bomb){
				this.hideBomb()
				return true;
			}
		},
		methods:{
			getNotice(){
				uni.request({
				    url: this.$url+'/api/papercentre/getnotice',
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.notice = res.data.data
						}
				    }
				});
			},
			getJudges(){
				uni.request({
				    url: this.$url+'/api/papercentre/judges',
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.judgesList = res.data.data
							this.swiperCurrent = 0
							if(this.judgesList.length>2){
								for(let i=0;i<this.judgesList.length;i++){
									this.judgesList2.push(this.judgesList[i])
								}
								for(let j=0;j<this.judgesList.length;j++){
									this.judgesList2.push(this.judgesList[j])
								}
							}else{
								this.judgesList2 = res.data.data
							}
							this.swiperCurrent2 = 0
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getPeriodsList(){
				uni.request({
				    url: this.$url+'/api/papercentre/paperactivity',
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							// for(let i=0;i<res.data.data.length;i++){
							// 	let starTime = res.data.data[i].startDateTime.split(' ')[0].replace(/-/g, "/")
							// 	let endTime = res.data.data[i].endDateTime.split(' ')[0].replace(/-/g, "/")
							// 	res.data.data[i].time = starTime+'-'+endTime
							// }
							this.periodsList = res.data.data
						}
				    }
				});
			},
			swiperChange(e){
				this.swiperCurrent = e.detail.current;
				this.swiperCurrent2 = e.detail.current;
			},
			swiperTap(index){
				this.swiperCurrent = index;
				this.showBomb()
			},
			swiperChange2(e){
				// let len = this.judgesList.length
				// if(e.detail.current >= len){
				// 	this.swiperCurrent = e.detail.current - len
				// }else{
				// 	this.swiperCurrent = e.detail.current;
				// }
				this.swiperCurrent2 = e.detail.current;
			},
			swiperTap2(index){
				// this.swiperCurrent = index;
				this.swiperCurrent2 = index;
			},
			showBomb() {
				this.bomb = true;
			},
			hideBomb() {
				this.bomb = false;
			},
			toPaperList(){
				uni.navigateTo({
					url:"/pages/activity/paper/paperList/paperList"
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./all.scss";
</style>
