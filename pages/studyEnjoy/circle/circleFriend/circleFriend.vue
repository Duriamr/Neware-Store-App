<template>
	<view class="circleFriend_content">
		<empty src="/static/expect/no_Article.png" :text="emptyText" v-if="arr.length <= 0" />
		<view class="ul" v-else>
			<view class="list" v-for="(item, index) in arr" :key="index">
				<view class="left" @tap.stop="toCirclePage(item.id)">
					<image :src="item.headImage" />
					<view class="name">{{item.userName}}</view>
				</view>
				
				<view v-if="oid != item.id">
					<view class="look" v-if="!item.isFollow" @tap.stop="addFollow(item.id,index)">
						<text>关注</text>
					</view>
					<view class="nolook" v-if="item.isFollow" @tap.stop="cancelFollow(item.id,index)">
						<text>已关注</text>
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
				type:'',
				arr:[],
				
				emptyText:'',
				
				token:uni.getStorageSync('token'),
				oid:uni.getStorageSync('onlyID'),
				
				authorId:0,
				authorName:'Ta'
			};
		},
		onLoad(options) {
			this.type = options.type
			this.authorId = options.authorId
			if(options.authorName!=''&&options.authorName!=null&&options.authorName!=undefined){
				this.authorName = options.authorName
			}
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.oid = uni.getStorageSync('onlyID');
			if(this.oid == ''){
				this.oid = 0
			}
			if(this.type == 'myFans'){
				uni.setNavigationBarTitle({
					title:'我的粉丝'
				});
				this.getMyFans()
				this.emptyText = '新手上路，还没人关注你哦'
			}else if(this.type == 'myFollow'){
				uni.setNavigationBarTitle({
					title:'我的关注'
				});
				this.getMyfollow()
				this.emptyText = '你有点高冷~暂未关注其他人'
			}else if(this.type == 'othersFans'){
				uni.setNavigationBarTitle({
					title:this.authorName+'的粉丝'
				});
				this.getOthersFans()
				this.emptyText = '新手上路，关注TA吧'
			}else if(this.type == 'othersFollow'){
				uni.setNavigationBarTitle({
					title:this.authorName+'的关注'
				});
				this.getOthersfollow()
				this.emptyText = 'Ta有点高冷~暂未关注其他人'
			}
		},
		methods:{
			getMyFans(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/fans', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"pageIndex": 1,
						"pageSize": 9999,
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.arr = res.data.data.items
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getMyfollow(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/follow', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"pageIndex": 1,
						"pageSize": 9999,
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.arr = res.data.data.items
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getOthersFans(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/othersfans', 
					data:{
						"othersAppuser": this.authorId,
						"appUserId": this.oid,
						"pageIndex": 1,
						"pageSize": 9999,
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.arr = res.data.data.items
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getOthersfollow(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/othersfollow', 
					data:{
						"othersAppuser": this.authorId,
						"appUserId": this.oid,
						"pageIndex": 1,
						"pageSize": 9999,
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.arr = res.data.data.items
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			addFollow(authorId,i){
				uni.request({
				    url: this.$url+'/api/scientificresearch/addfollow?followId='+authorId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCirclePage",true)
							this.$store.commit("changeCircleDetails",true)
							this.arr[i].isFollow = true
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			cancelFollow(authorId,i){
				uni.showModal({
					title: '提示',
					content: '是否取消关注？',
					confirmColor: '#F8B500',
					success: (res)=>{
						if(res.confirm) {
							uni.request({
							    url: this.$url+'/api/scientificresearch/cancelfollow?followId='+authorId, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									if(res.data.success&&res.data.code == 200){
										this.$store.commit("changeCircle",true)
										this.$store.commit("changeTopic",true)
										this.$store.commit("changeCirclePage",true)
										this.$store.commit("changeCircleDetails",true)
										this.arr[i].isFollow = false
									}else if(res.data.code == 401){
										this.$to401()
									}
							    },
								fail: (err) => {
									this.$requestFail()
								}
							});
						}
					}
				});
			},
			
			toCirclePage(authorId){
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/circlePage/circlePage?authorId="+authorId
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.circleFriend_content{
		width: 100%;
		min-height: 100vh;
		/*  #ifdef  H5  */
		min-height: calc(100vh - 88upx);
		/*  #endif  */
		font-size:28upx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(51,51,51,1);
		line-height:28upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.ul{
			width: 100%;
			min-height: 100vh;
			/*  #ifdef  H5  */
			min-height: calc(100vh - 88upx);
			/*  #endif  */
			display: flex;
			flex-direction: column;
			align-items: center;
			.list{
				width: 100%;
				height: 128upx;
				background-color: #FFFFFF;
				box-sizing: border-box;
				padding: 0 24upx;
				border-top: 1upx solid #F5F5F5;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left{
					display: flex;
					align-items: center;
					image{
						width:80upx;
						height:80upx;
						border-radius: 100%;
						margin-right: 24upx;
						background-image: url(/static/my/avatar.png);
						background-size: 100% 100%;
						background-repeat: no-repeat;
					}
				}
				.look,
				.nolook{
					width: 112upx;
					height: 56upx;
					border-radius: 28upx;
					background: linear-gradient(315deg, #FC9900 0%, #F8B500 100%);
					font-size:24upx;
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:500;
					color: #FFFFFF;
					line-height:24upx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.nolook{
					background: #E5E5E5;
				}
			}
		}
	}
</style>
