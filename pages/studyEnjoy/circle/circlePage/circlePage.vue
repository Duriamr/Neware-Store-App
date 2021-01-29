<template>
	<view class="circlePage_content">
		
		<view class="fixed_header" :style="{opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex}">
			<view class="status"></view>
			<view class="header">
				<image class="back" src="/static/public/back/back_black.png" mode="widthFix" @tap="$back" />
				<view class="avatar">
					<image class="avatar_img" :src="authorInfo.headImage" />
					<image class="admin" src="/static/studyEnjoy/circle/admin.png" v-if="authorInfo.isAdmin" />
				</view>
				<text class="name">{{authorInfo.userName}}</text>
				
				<view class="look" v-if="isOthers && !authorInfo.isFollow" @tap.stop="addFollow(authorId)">
					<text>关注</text>
				</view>
				<view class="nolook" v-if="isOthers && authorInfo.isFollow" @tap.stop="cancelFollow(authorId)">
					<text>已关注</text>
				</view>
			</view>
		</view>
		
		<view class="circlePage_header" :style="{opacity: beforeHeaderOpacity}">
			<view class="glass" :style="{backgroundImage: 'url('+ authorInfo.headImage +')'}"></view>
			<view class="noGlass">
				<view class="status"></view>
				<view class="header">
					<image class="back" src="/static/public/back/back_black.png" mode="widthFix" @tap="$back" />
				</view>
				<view class="infor_content">
					<view class="avatar" @tap.stop="previewImg(0,[authorInfo.headImage])">
						<image class="avatar_img" :src="authorInfo.headImage" />
						<image class="admin" src="/static/studyEnjoy/circle/admin.png" v-if="authorInfo.isAdmin" />
					</view>
					<view class="infor">
						<text>{{authorInfo.userName}}</text>
					</view>
					
					<view class="look" v-if="isOthers&&!authorInfo.isFollow" @tap.stop="addFollow(authorId)">
						关注
					</view>
					<view class="nolook" v-if="isOthers&&authorInfo.isFollow" @tap.stop="cancelFollow(authorId)">
						已关注
					</view>
				</view>
				<view class="kingkong">
					<view class="kingkong_ul">
						<view class="kingkong_list">
							<view class="top">{{authorInfo.fabulous}}</view>
							<view class="bot">获赞</view>
						</view>
						<view class="kingkong_list" @tap.stop="toCircleFriend('follow')">
							<view class="top">{{authorInfo.follow}}</view>
							<view class="bot">关注</view>
						</view>
						<view class="kingkong_list" @tap.stop="toCircleFriend('fans')">
							<view class="top">{{authorInfo.fans}}</view>
							<view class="bot">粉丝</view>
						</view>
						<view class="kingkong_list">
							<view class="top">{{authorInfo.totalCount}}</view>
							<view class="bot">动态</view>
						</view>
					</view>
					<view class="line_ul">
						<view class="line_list"></view>
						<view class="line_list"></view>
						<view class="line_list"></view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="main_content">
			<view class="circle_ul">
				<empty marginTop="300upx" src="/static/expect/no_Article.png" text="暂无动态" v-if="ccArr.length <= 0" />
				<circleItem v-for="(item,index) in ccArr" :key="'cc'+index"
				type="personal"
				:item="item" 
				:oid="oid" 
				:token="token" 
				@addFollow="addFollow(item.authorId)"
				@cancelFollow="cancelFollow(item.authorId)" 
				@deleteArticle="deleteArticle(item.id,index)" 
				@addFavor="addFavor(item.id,index)"
				@cancelFavor="cancelFavor(item.id,index)" 
				@addPoint="addPoint(item.id,index)" 
				@cancelPoint="cancelPoint(item.id,index)" 
				@showExtend="showExtend(index)" 
				@hideExtend="hideExtend()" 
				@showComment="showComment(item.id,index)" 
				@showShare="showShare(item.authorImage,item.id,item.customerType,item.content,item.title)"
				@addVote="addVote" />
			</view>
			<view class="baseline" v-if="baseShow">
				—— 已经到底啦 ——
			</view>
		</view>
		
		<view class="input_content" v-if="inputShow" @touchmove.stop.prevent @tap.stop="cancelComment()">
			<view class="input_main" :style="{'bottom':commentBottom}" @tap.stop>
				<input class="input" v-model="commentText" type="text" placeholder="就差你的评论..." :focus="inputShow" :adjust-position="false" @focus="focus" @blur="blur" @confirm="addComment()" confirm-type="send" maxlength="500" />
				<view class="send" @tap.stop="addComment()">
					发送
				</view>
			</view>
		</view>
		
		<!-- #ifdef APP-PLUS -->
		<share :shareShow="shareShow" :shareObj="shareObj" @hideShare="$hideShare()" />
		<!-- #endif --> 
	</view>
</template>

<script>
	import circleItem from '@/components/nw-circle-item/nw-circle-item';
	import share from '@/components/nw-share/nw-share';
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {circleItem,share,empty},
		data() {
			return {
				afterHeaderzIndex: -1,//层级
				beforeHeaderOpacity: 1,//不透明度
				afterHeaderOpacity: 0,//不透明度
				
				authorId:0,
				authorInfo:{
					headImage:'',
					userName:'',
					fabulous:0,//获赞
					follow:0,//关注
					fans:0,//粉丝
					totalCount:0,//总动态
					trends:0,//当页动态
					isFollow:false
				},
				
				isOthers:false,
				login:false,
				token:'',
				oid:'',
				nickname:'',
				
				ccArr:[],
				pageIndex:1,
				baseShow:false,
				
				inputShow:false,
				commentText:'',
				commentBottom:'0',
				i:NaN,
				articleId:NaN,
				
				//分享区
				shareShow:'',
				shareObj:{},
			};
		},
		onLoad(options) {
			this.authorId = options.authorId
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			if(this.token!=''&&this.token!=null&&this.token!=undefined){
				this.login = true
			}else{
				this.login = false
			}
			this.oid = uni.getStorageSync('onlyID');
			if(this.oid == ''){
				this.oid = 0
			}
			if(this.authorId == this.oid){
				this.isOthers = false
			}else{
				this.isOthers = true
			}
			this.nickname = uni.getStorageSync('myNickname');
			if(this.nickname==''||this.nickname==null||this.nickname==undefined){
				this.nickname = '新威用户'
			}
			if(this.$store.state.circlePage){
				uni.startPullDownRefresh()
				this.$store.commit("changeCirclePage",false)
			}
		},
		onPullDownRefresh(){
			this.getAuthor()
		},
		onReachBottom(){
			if(this.ccArr.length > 0){
				this.addCcArr()
			}
		},
		onPageScroll(e) {
			//导航栏渐变
			let tmpY = 150;
			e.scrollTop = e.scrollTop > tmpY ? 150 : e.scrollTop;
			this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
			this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
			
			//切换层级
			this.afterHeaderzIndex = e.scrollTop > 100 ? 5 : -1;
			
			this.hideExtend()
		},
		watch:{
			oid(val){
				if(val!==''&&val!=null&&val!=undefined){
					uni.startPullDownRefresh()
				}
			},
		},
		methods:{
			getAuthor(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/communitymy', 
					data:{
						"appuser": this.authorId,
						"isOthers": this.isOthers,
						"userId": this.oid,
						"pageIndex": 1,
						"pageSize": 5,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							for(let i=0; i<res.data.data.communityArticleDtos.length; i++){
								res.data.data.communityArticleDtos[i].extend = false
							}
							this.authorInfo = res.data.data
							this.ccArr = res.data.data.communityArticleDtos
							this.pageIndex = 1
							this.baseShow = false
						}
				    },
					fail: (err) => {
						uni.stopPullDownRefresh()
						this.$requestFail()
					}
				});
			},
			addCcArr(){
				uni.showLoading({title: '加载更多'});
				uni.request({
				    url: this.$url+'/api/scientificresearch/communitymy', 
					data:{
						"appuser": this.authorId,
						"isOthers": this.isOthers,
						"userId": this.oid,
						"pageIndex": ++this.pageIndex,
						"pageSize": 5,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data.communityArticleDtos.length > 0 && res.data.data.communityArticleDtos != null){
								for(let i=0; i<res.data.data.communityArticleDtos.length; i++){
									res.data.data.communityArticleDtos[i].extend = false
									this.ccArr.push(res.data.data.communityArticleDtos[i])
								}
								this.baseShow = false
							}else if(res.data.data.communityArticleDtos.length == 0){
								this.pageIndex--
								this.baseShow = true
							}
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			
			showExtend(index){
				this.ccArr[index].extend = !this.ccArr[index].extend
				for(let i=0; i<this.ccArr.length; i++){
					if(i != index){
						this.ccArr[i].extend = false
					}
				}
			},
			hideExtend(){
				for(let i=0; i<this.ccArr.length; i++){
					this.ccArr[i].extend = false
				}
			},
			addFollow(authorId){
				this.hideExtend()
				uni.request({
				    url: this.$url+'/api/scientificresearch/addfollow?followId='+authorId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.startPullDownRefresh()
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCircleDetails",true)
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			cancelFollow(authorId){
				this.hideExtend()
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
										uni.startPullDownRefresh()
										this.$store.commit("changeCircle",true)
										this.$store.commit("changeTopic",true)
										this.$store.commit("changeCircleDetails",true)
									}else if(res.data.code == 401){
										this.$to401()
									}else{
										uni.showToast({
											icon: 'none',
											position: 'bottom',
											title: res.data.message
										});
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
			deleteArticle(articleId,index){
				this.hideExtend()
				uni.showModal({
					title: '警告',
					content: '是否删除此条？',
					confirmColor: '#F8B500',
					success: (res)=>{
						if(res.confirm) {
							uni.showLoading({title: '正在删除'});
							uni.request({
							    url: this.$url+'/api/scientificresearch/deletearticle?articleId='+articleId, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										this.ccArr.splice(index,1);
										this.$store.commit("changeCircle",true)
										this.$store.commit("changeTopic",true)
										this.$store.commit("changeCircleDetails",true)
									}else if(res.data.code == 401){
										this.$to401()
									}else{
										uni.showToast({
											icon: 'none',
											position: 'bottom',
											title: res.data.message
										});
									}
							    },
								fail: (err) => {
									uni.hideLoading()
									this.$requestFail()
								}
							});
						}
					}
				});
			},
			addFavor(articleId,index){
				this.hideExtend()
				if(!this.login){
					this.$to401()
					return false
				}
				this.ccArr[index].collectionNumber++
				this.ccArr[index].isCollection = true
				uni.showToast({title:'收藏成功'})
				uni.request({
				    url: this.$url+'/api/collection/articleadd?articleId='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCircleDetails",true)
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			cancelFavor(articleId,index){
				this.hideExtend()
				this.ccArr[index].collectionNumber--
				this.ccArr[index].isCollection = false
				uni.request({
				    url: this.$url+'/api/collection/articledelete?articleId='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCircleDetails",true)
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			addPoint(articleId,index){
				this.hideExtend()
				if(!this.login){
					this.$to401()
					return false
				}
				this.authorInfo.fabulous++
				this.ccArr[index].pointNumber++
				this.ccArr[index].isPoint = true
				uni.request({
				    url: this.$url+'/api/article/add-point?id='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCircleDetails",true)
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			cancelPoint(articleId,index){
				this.hideExtend()
				this.authorInfo.fabulous--
				this.ccArr[index].pointNumber--
				this.ccArr[index].isPoint = false
				uni.request({
				    url: this.$url+'/api/article/cancel-point?id='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCircleDetails",true)
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			showComment(articleId,i){
				this.hideExtend()
				if(!this.login){
					this.$to401()
					return false
				}
				this.i = i
				this.articleId = articleId
				this.commentText = ''
				if(this.ccArr[i].commentText!=null&&this.ccArr[i].commentText!=''&&this.ccArr[i].commentText!=undefined){
					this.commentText = this.ccArr[i].commentText
				}
				this.inputShow = true
			},
			cancelComment(){
				this.inputShow = false
				this.ccArr[this.i].commentText = this.commentText
			},
			addComment(){
				if(this.commentText == ''){
					uni.showModal({
						title: '评论不可为空',
						showCancel:false,
						confirmColor: '#F8B500',
					})
					return false
				}
				this.cancelComment()
				uni.showLoading()
				uni.request({
				    url: this.$url+'/api/scientificresearch/articlecomment', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"articleId": this.articleId,
						"content": this.commentText
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							uni.showToast();
							let articleCommentResponseDto = {
								content:this.commentText,
								fromNickName:this.nickname,
								fromUserId:this.oid
							}
							this.ccArr[this.i].commentCount++
							this.ccArr[this.i].commentText = ''
							if(this.ccArr[this.i].articleCommentResponseDtos == null){
								this.ccArr[this.i].articleCommentResponseDtos = []
							}
							this.ccArr[this.i].articleCommentResponseDtos.push(articleCommentResponseDto)
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCircleDetails",true)
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			focus(event){
				this.commentBottom = event.detail.height +'px'
				// #ifdef APP-PLUS 
				uni.getSystemInfo({
					success: (res) => {
						if(res.platform == 'android'){
							uni.onKeyboardHeightChange(res => {
							this.commentBottom = res.height +'px'
							})
						}
					}
				})
				// #endif 
			},
			blur(){	
				this.commentBottom = '0px'
			},
			addVote(articleId,articleVoteId,optionId){
				uni.showLoading()
				uni.request({
				    url: this.$url+'/api/scientificresearch/articlevote', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"articleVoteId": articleVoteId,
						"optionId": optionId
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCircleDetails",true)
							uni.request({
							    url: this.$url+'/api/scientificresearch/votearticle', 
								header:{
									Authorization:'Bearer '+this.token
								},
								data:{
									"articleId": articleId
								},
								method: "POST",
							    
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										for(let i=0; i<this.ccArr.length; i++){
											if(this.ccArr[i].id==articleId){
												this.ccArr[i].articleVoteDto = res.data.data
												break
											}
										}
									}
							    },
								fail: (err) => {
									uni.hideLoading()
								}
							});
						}else if(res.data.code == 401){
							this.$to401()
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			
			toCircleFriend(type){
				if(!this.isOthers && type == 'fans'){
					uni.navigateTo({
						url:"/pages/studyEnjoy/circle/circleFriend/circleFriend?type=myFans&authorId="+this.authorId+"&authorName="+this.authorInfo.userName
					})
				}else if(!this.isOthers && type == 'follow'){
					uni.navigateTo({
						url:"/pages/studyEnjoy/circle/circleFriend/circleFriend?type=myFollow&authorId="+this.authorId+"&authorName="+this.authorInfo.userName
					})
				}else if(this.isOthers && type == 'fans'){
					uni.navigateTo({
						url:"/pages/studyEnjoy/circle/circleFriend/circleFriend?type=othersFans&authorId="+this.authorId+"&authorName="+this.authorInfo.userName
					})
				}else if(this.isOthers && type == 'follow'){
					uni.navigateTo({
						url:"/pages/studyEnjoy/circle/circleFriend/circleFriend?type=othersFollow&authorId="+this.authorId+"&authorName="+this.authorInfo.userName
					})
				}
			},
			
			showShare(shareImg,articleId,customerType,content,title){
				let shareUrl = ""
				let shareSummary = ""
				let tt = ""
				if(customerType){
					shareUrl = this.$h5Url+"/pages/studyEnjoy/circle/circle?id="
					shareSummary = content
					tt = "发现了有意思的动态！"
				}else{
					shareUrl = this.$h5Url+"/pages/studyEnjoy/article/article?id="
					shareSummary = title
					tt = "发现了有意思的文章！"
				}
				this.shareObj = {
					title:"@"+this.nickname+tt,
					summary:shareSummary,
					href:shareUrl+articleId,
					imageUrl:shareImg,
				}
				this.shareShow = 'show';
			},
			previewImg(index,imgs){
				if(this.isOthers){
					uni.previewImage({
						current:index,
						urls:imgs
					})
				}else{
					uni.navigateTo({
						url:'/pages/my/user/user'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "./circlePage.scss";
</style>
