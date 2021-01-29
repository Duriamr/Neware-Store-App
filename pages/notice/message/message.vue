<template>
	<view class="message_content">
		<view class="message_ul">
			<block>
				<view class="message_list" v-for="(item,index) in messageList" :key="index" @tap.stop="toCircle(item.Url)" v-if="!item.ReplyShow">
					<image class="headImg" :src="item.HeadImage" />
					<view class="main_1">
						<view class="left">
							<text class="uesr">{{item.SendUser}}</text>
							<text class="content">{{item.Content}}</text>
							<text class="time">{{item.time}}</text>
						</view>
						<view class="right">
							<image :src="item.Image" v-if="item.ImageShow" />
							<text v-if="!item.ImageShow" >{{item.Title}}</text>
						</view>
					</view>
				</view>
				
				<view class="message_list" v-for="(item,index) in messageList" :key="index" @tap.stop="toCircle(item.Url)" v-if="item.ReplyShow">
					<image class="headImg" :src="item.HeadImage" />
					<view class="main_2">
						<view class="top">
							<view class="left">
								<text class="uesr">{{item.SendUser}}</text>
								<text class="content">{{item.Content}}</text>
							</view>
							<view class="right">
								<image :src="item.Image" v-if="item.ImageShow" />
								<text v-if="!item.ImageShow" >{{item.Title}}</text>
							</view>
						</view>
						<view class="bot">
							<view class="tips">评论 @{{nickname}}</view>
							<view class="reply">{{item.ReplyContent}}</view>
						</view>
						<text class="time">{{item.time}}</text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname : uni.getStorageSync('myNickname'),
				messageList:[],
			};
		},
		onLoad() {
			this.messageList = uni.getStorageSync('messageList');
			if(this.messageList==''||this.messageList==null||this.messageList==undefined){
				this.messageList = []
				return
			}
			uni.removeStorageSync('messageList');
			this.$store.commit('changeMessageLen',0)
			uni.removeTabBarBadge({index:2})
			// #ifdef APP-PLUS  
			plus.runtime.setBadgeNumber(0)
			// #endif  
			this.getMessDate()
		},
		methods:{
			toCircle(articleId){
				if(articleId==''||articleId==null||articleId==undefined){
					return false
				}
				uni.redirectTo({
					url:"/pages/studyEnjoy/circle/circle?id="+articleId
				})
			},
			getMessDate(){
				let nowDate = new Date()
				for(let i=0; i<this.messageList.length; i++){
					if(this.messageList[i].ReplyContent!=''&&this.messageList[i].ReplyContent!=null&&this.messageList[i].ReplyContent!=undefined){
						this.messageList[i].ReplyShow = true
					}else{
						this.messageList[i].ReplyShow = false
					}
					if(this.messageList[i].Image!=''&&this.messageList[i].Image!=null&&this.messageList[i].Image!=undefined){
						this.messageList[i].ImageShow = true
					}else{
						this.messageList[i].ImageShow = false
					}
					let messDate = new Date(Number(this.messageList[i].CreateTime))
					let y = messDate.getFullYear(); 
				    let m = messDate.getMonth() + 1;
				    m = m < 10 ? '0' + m : m; 
				    let d = messDate.getDate(); 
				    d = d < 10 ? ('0' + d) : d; 
					let messTime = nowDate.getTime() - messDate.getTime()
					if(nowDate.getFullYear() == y){
						if(nowDate.getMonth()+1==m){
							if(nowDate.getDate()==d){
								if(messTime < 60000){
									this.messageList[i].time = '刚刚'
								}else if(messTime >= 60000&&messTime < 3600000){
									this.messageList[i].time = Math.floor(messTime/60000)+'分钟前'
								}else if(messTime >= 3600000&&messTime < 86400000){
									this.messageList[i].time = Math.floor(messTime/3600000)+'小时前'
								}
							}else if(nowDate.getDate()-d == 1){
								this.messageList[i].time = '昨天'
							}else{
								this.messageList[i].time = d+'号';
							}
						}else{
							this.messageList[i].time = m+'-'+d;
						}
					}else{
						this.messageList[i].time = y+'-'+m+'-'+d;
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "./message.scss";
</style>
