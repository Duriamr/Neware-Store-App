<template>
	<view class="notice_content">
		<view class="notice_ul">
			<view class="notice_list" @tap.stop="toMessage">
				<view class="image">
					<image src="/static/notice/circle.png" />
					<view class="badge" v-if="$store.state.messageLen>0">
						{{$store.state.messageLen}}
					</view>
				</view>
				<view class="main">
					<view class="title">科研圈子</view>
					<view class="subTitle" v-if="$store.state.messageLen>0">新消息通知</view>
					<view class="subTitle" v-if="$store.state.messageLen==0">暂无消息通知</view>
					<view class="time">{{messageTime}}</view>
				</view>
			</view>
			
			<view class="notice_list" @tap.stop="toService">
				<view class="image">
					<image src="/static/notice/service.png" />
				</view>
				<view class="main">
					<view class="title">专属客服</view>
					<view class="subTitle">问题咨询/售前/一对一专属客服</view>
				</view>
			</view>
		</view>
		
		<guess />
	</view>
</template>

<script>
	import guess from '@/components/nw-guess/nw-guess';
	export default {
		components: {guess},
		data() {
			return {
				token:'',
				messageList:[],
				messageTime:''
			};
		},
		onShow() {
			this.getMessList()
			this.token = uni.getStorageSync('token');
		},
		methods:{
			getMessList(){
				this.messageList = uni.getStorageSync('messageList');
				if(this.messageList==''||this.messageList==null||this.messageList==undefined){
					this.messageList = []
				}
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
				if(this.messageList.length > 0){
					this.messageTime = this.messageList[0].time
				}else{
					this.messageTime = ''
				}
			},
			toMessage(){
				uni.navigateTo({
					url:"/pages/notice/message/message"
				})
			},
			toService(){
				uni.showNavigationBarLoading();
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading();
						if(res.data.success&&res.data.code == 200){
							
							uni.navigateTo({
								url:"/pages/browser/serviceBrowser?page=notice&nickName="+res.data.data.nickname+"&clientId="+res.data.data.userUniqueId
							})
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
							return false;
						}
				    },
					fail: (err) => {
						uni.hideNavigationBarLoading();
						this.$requestFail()
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.notice_content{
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
	}
	.notice_ul{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-top: 1upx solid #F5F5F5;
		.notice_list{
			width: 100%;
			box-sizing: border-box;
			padding: 32upx 24upx 0;
			background:rgba(255,255,255,1);
			display: flex;
			.image{
				width: 96upx;
				height: 96upx;
				margin-right: 24upx;
				position: relative;
				image{
					width: 100%;
					height: 100%;
				}
				.badge{
					position: absolute;
					top:-10upx;
					right:-12upx;
					background-color: #F75C50;
					color:#FFFFFF;
					min-width: 14upx;
					height: 22upx;
					z-index: 2;
					font-size:22upx;
					line-height:22upx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius:48upx;
					padding: 7upx 11upx;
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:500;
				}
			}
			.main{
				width: calc(100% - 120upx);
				height: 96upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding-bottom: 36upx;
				border-bottom: 1upx solid #F5F5F5;
				position: relative;
				.title{
					font-size:32upx;
					color:rgba(51,51,51,1);
					line-height:32upx;
					margin-bottom: 16upx;
				}
				.subTitle{
					font-size:28upx;
					color:rgba(179,179,179,1);
					line-height:28upx;
				}
				.time{
					position: absolute;
					top:16upx;
					right:0;
					font-size:24upx;
					color:rgba(179,179,179,1);
					line-height:24upx;
				}
			}
		}
	}
</style>
