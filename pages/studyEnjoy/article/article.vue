<template>
	<view class="article_content">
		<view class="line"></view>
		<image class="toTop" src="/static/studyEnjoy/circle/top.png" @tap.stop="scrollTo()" v-if="scrollShow" />
		<view class="article_list">
			<view class="article_title">{{articleInfo.title}}</view>
			<view class="info">
				<view class="left">
					<view class="avatar">
						<image class="avatar_img" :src="articleInfo.authorImage" />
						<image class="admin" src="/static/studyEnjoy/circle/admin.png" v-if="articleInfo.isAdmin" />
					</view>
					<view class="left_main">
						<view class="name">{{articleInfo.authorName}}</view>
					</view>
				</view>
			</view>
			
			<view class="top">
				<view class="time">{{articleInfo.createTime}}</view>
				<view class="right">
					<view class="btn">
						<image class="icon" src="/static/studyEnjoy/circle/look.png" />
						<text>{{articleInfo.pageViews}}</text>
					</view>
				</view>
			</view>
			
			<parser class="richText" selectable="true" :html="articleInfo.content" />
			
			<view class="vote" v-if="articleInfo.articleVoteDto!=null&&articleInfo.articleVoteDto!={}&&$isObject(articleInfo.articleVoteDto)">
				<view class="vote_title">
					<text>{{articleInfo.articleVoteDto.title}}</text>
				</view>
				<view class="vote_ul" v-if="!articleInfo.articleVoteDto.isVote">
					<block v-for="(item2,index2) in articleInfo.articleVoteDto.voteOptions" :key="'vote'+index2">
						<view class="vote_list1" @tap.stop="addVote(item2.id)" >
							<text>{{item2.title}}</text>
						</view>
					</block>
				</view>
				<view class="vote_ul" v-if="articleInfo.articleVoteDto.isVote">
					<block v-for="(item2,index2) in articleInfo.articleVoteDto.voteOptions" :key="'vote'+index2">
						<view class="vote_list2" v-if="!item2.isVote" @tap.stop="addVote(item2.id)">
							<view class="proportion" :style="{width:item2.proportion*100+'%'}"></view>
							<view class="main">
								<view class="left">
									<text>{{item2.title}}</text>
								</view>
								<view class="right">
									<text>{{item2.optionNumber}}票</text>
								</view>
							</view>
						</view>
						<view class="vote_list2 acitve" v-if="item2.isVote">
							<view class="proportion" :style="{width:item2.proportion*100+'%'}"></view>
							<view class="main">
								<view class="left">
									<text>{{item2.title}}</text>
									<image src="/static/studyEnjoy/circle/yes.png" />
								</view>
								<view class="right">
									<text>{{item2.optionNumber}}票</text>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="vote_bot">
					{{articleInfo.articleVoteDto.describe}}
				</view>
			</view>
			
			<view class="link_box" v-if="articleInfo.link!=''&&articleInfo.link!=null&&articleInfo.link!=undefined">
				<text class="link_title">{{articleInfo.softName}}下载链接：</text>
				<!-- #ifdef H5 --> 
				<a class="link" :href="articleInfo.link">
					{{articleInfo.link}}
				</a>
				<!-- #endif --> 
				<!-- #ifndef H5 -->
				<navigator class="link" :url="articleInfo.link">
					{{articleInfo.link}}
				</navigator>
				<!-- #endif --> 
				<text class="ps">*该软件只适配电脑端，复制链接到电脑浏览器打开并下载安装</text>
				<view class="btn_box">
					<text class="btn" @tap.stop="setCopy()">复制链接</text>
				</view>
			</view>
			
			<view class="bot">
				<view class="left" >
					<!-- #ifdef APP-PLUS --> 
					<view class="btn" @tap.stop="$showShare()">
						<image class="icon" src="/static/studyEnjoy/circle/share.png" />
						<text>分享</text>
					</view>
					<!-- #endif --> 
				</view>
				<view class="right">
					<view class="btn" @tap.stop="showComment('comment')">
						<image class="icon" src="/static/studyEnjoy/circle/comment.png" />
						<text>{{articleInfo.commentCount}}</text>
					</view>
					
					<view class="btn">
						<image class="icon" src="/static/studyEnjoy/circle/favor.png" v-if="!articleInfo.isCollection" @tap.stop="addFavor()" />
						<image class="icon" src="/static/studyEnjoy/circle/favor_selected.png" v-if="articleInfo.isCollection" @tap.stop="cancelFavor()" />
						<text>{{articleInfo.collectionNumber}}</text>
					</view>
					
					<view class="btn">
						<image class="icon" src="/static/studyEnjoy/circle/point.png" v-if="!articleInfo.isPoint" @tap.stop="addPoint()" />
						<image class="icon" src="/static/studyEnjoy/circle/point_selected.png" v-if="articleInfo.isPoint" @tap.stop="cancelPoint()" />
						<text>{{articleInfo.pointNumber}}</text>
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="comment">
			<view class="title">
				全部评论({{articleInfo.commentCount}})
			</view>
			<empty marginTop="50upx" src="/static/expect/no_Article.png" text="暂无评论" v-if="commentArr.length <= 0" />
			
			<view class="comment_ul">
				<view class="comment_list" v-for="(item,index) in commentArr" :key="'comment'+index">
					<view class="avatar" @tap.stop="toCirclePage(item.fromUserId)">
						<image class="avatar_img" :src="item.headImage" />
						<image class="admin" src="/static/studyEnjoy/circle/admin.png" v-if="item.isAdmin" />
					</view>
					<view class="right" @tap.stop="showComment('reply1',index,NaN,item.id,item.fromUserId)">
						<view class="name">{{item.fromNickName}}</view>
						<view class="content">{{item.content}}</view>
						<view class="comment2_ul" v-if="item.articleReplyResponseDtos.length != 0">
							<view class="comment2_list" v-for="(item2,index2) in item.articleReplyResponseDtos" :key="'comment2'+index2" @tap.stop="showComment('reply2',index,index2,item2.id,item2.fromUserId)">
								<text class="name" >{{item2.fromNickName}}</text><text v-if="item2.toNickName != '' && item2.toNickName != null && item2.fromUserId != item2.toUserId">回复</text><text class="name" v-if="item2.toNickName != '' && item2.toNickName != null && item2.fromUserId != item2.toUserId">{{item2.toNickName}}</text>：{{item2.content}}
							</view>
						</view>
						<view class="time">{{item.contentDate}}</view>
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="delete_content" v-if="deleteShow" @tap.stop="cancelDelete()">
			<view class="delete">
				<view class="list" @tap.stop="deleteComment()">
					删除
				</view>
				<view class="list" @tap.stop="cancelDelete()">
					取消
				</view>
			</view>
		</view>
		
		<view class="input_placeholder"></view>
		<view class="input_content" :style="{'height':commentHeight}" @touchmove.stop.prevent @tap.stop="cancelComment()">
			<view class="input_main" :style="{'bottom':commentBottom}" @tap.stop>
				<input class="input" v-model="commentText" type="text" :placeholder="commentPlaceholder" :focus="inputShow" :adjust-position="false" @focus="focus" @blur="blur" @confirm="addComment()" confirm-type="send" maxlength="500" />
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
	import parser from "@/components/jyf-parser/jyf-parser";
	import empty from '@/components/nw-empty/nw-empty';
	import share from '@/components/nw-share/nw-share';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default {
		components: {parser,empty,share,h5Footer},
		data() {
			return {
				articleId:0,
				articleInfo:{
					authorId:0,
					authorImage:'',
					authorName:'',
					createTime:'',
					isFollow:false,
					arrow:false,
					id:0,
					content:'',
					avatarImg:[],
					lable:'',
					commentCount:0,
					isCollection:false,
					collectionNumber:0,
					isPoint:false,
					pointNumber:0,
					pageViews:0,
					commentText:'',
					publishingTypeId:0,
					link:'',
					softName:''
				},
				commentArr:[],
				pageIndex:1,
				
				login:false,
				token:'',
				oid:'',
				nickname:'',
				
				deleteShow:false,
				deleteId:NaN,
				scrollShow:false,
				
				inputShow:false,
				commentText:'',
				commentBottom:'0',
				commentHeight:'110upx',
				commentPlaceholder:'就差你的评论...',
				type:'comment',
				i:NaN,
				j:NaN,
				
				addViewOff:false,
				
				//分享区
				shareShow:'',
				shareObj:{},
			};
		},
		onLoad(options) {
			this.articleId = options.id
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
			this.nickname = uni.getStorageSync('myNickname');
			if(this.nickname==''||this.nickname==null||this.nickname==undefined){
				this.nickname = '新威用户'
			}
			if(this.$store.state.circleDetails){
				uni.startPullDownRefresh()
				this.$store.commit("changeCircleDetails",false)
			}
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.$showShare()
			}
		},
		onPullDownRefresh(){
			this.getArticle()
		},
		onPageScroll(e) {
			this.scrollShow = e.scrollTop > 800 ? true : false;
		},
		onReachBottom(){
			if(this.commentArr.length > 0){
				this.addCommentArr()
			}
		},
		watch:{
			oid(val){
				if(val!==''&&val!=null&&val!=undefined){
					uni.startPullDownRefresh()
				}
			},
		},
		methods:{
			getArticle(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/allcomment', 
					data:{
						"articleId": this.articleId,
						"userId": this.oid,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data == null){
								uni.showToast({
								    icon: 'none',
								    position: 'bottom',
								    title: '文章已删除'
								});
								setTimeout(()=>{
									uni.navigateBack()
								},1000)
								return false
							}
							res.data.data.commentText = ''
							this.articleInfo = res.data.data
							this.shareObj = {
								title:"@"+this.nickname+"发现了有意思的文章！",
								summary:this.articleInfo.title,
								href:this.$h5Url+"/pages/studyEnjoy/article/article?id="+this.articleId,
								imageUrl:this.articleInfo.authorImage,
							}
							this.addView()
							this.getCommentArr()
						}else{
							uni.showToast({
							    icon: 'none',
							    position: 'bottom',
							    title: '获取失败，请检查网络'
							});
							setTimeout(()=>{
								uni.navigateBack()
							},1000)
						}
				    },
					fail: (err) => {
						uni.stopPullDownRefresh()
						this.$requestFail()
					}
				});
			},
			getCommentArr(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/commentinfo', 
					data:{
						"articleId": this.articleId,
						"pageIndex": 1,
						"pageSize": 20
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.commentArr = res.data.data
							for(let p = 1;p<this.pageIndex;p++){
								uni.request({
								    url: this.$url+'/api/scientificresearch/commentinfo', 
									data:{
										"articleId": this.articleId,
										"pageIndex": p,
										"pageSize": 20,
									},
									method: "POST",
								    
								    success: (res) => {
										uni.hideLoading()
										if(res.data.success&&res.data.code == 200){
											if(res.data.data.length > 0 && res.data.data != null){
												for(let i=0; i<res.data.data.length; i++){
													this.commentArr.push(res.data.data[i])
												}
											}
										}
								    },
								});
							}
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			addCommentArr(){
				uni.showLoading({title: '加载更多'});
				uni.request({
				    url: this.$url+'/api/scientificresearch/commentinfo', 
					data:{
						"articleId": this.articleId,
						"pageIndex": ++this.pageIndex,
						"pageSize": 20,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data.length > 0 && res.data.data != null){
								for(let i=0; i<res.data.data.length; i++){
									this.commentArr.push(res.data.data[i])
								}
							}else if(res.data.data.length == 0){
								this.pageIndex--
								uni.showToast({
									title:'到底了',
									icon:'none',
									position:'bottom'
								})
							}
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			addFavor(){
				if(!this.login){
					this.$to401()
					return false
				}
				this.articleInfo.collectionNumber++
				this.articleInfo.isCollection = true
				uni.showToast({title:'收藏成功'})
				uni.request({
				    url: this.$url+'/api/collection/articleadd?articleId='+this.articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCirclePage",true)
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			cancelFavor(){
				this.articleInfo.collectionNumber--
				this.articleInfo.isCollection = false
				uni.request({
				    url: this.$url+'/api/collection/articledelete?articleId='+this.articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCirclePage",true)
						}else if(res.data.code == 401){
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			addPoint(){
				if(!this.login){
					this.to401()
					return false
				}
				this.articleInfo.pointNumber++
				this.articleInfo.isPoint = true
				uni.request({
				    url: this.$url+'/api/article/add-point?id='+this.articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCirclePage",true)
						}else if(res.data.code == 401){
							this.to401()
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
			cancelPoint(){
				this.articleInfo.pointNumber--
				this.articleInfo.isPoint = false
				uni.request({
				    url: this.$url+'/api/article/cancel-point?id='+this.articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCirclePage",true)
						}else if(res.data.code == 401){
							this.to401()
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
			showComment(type,i,j,commentId,userId){
				if(!this.login){
					this.to401()
					return false
				}
				this.type = type
				this.commentText = ''
				if(this.type == 'comment'){
					if(this.articleInfo.commentText != ''){
						this.commentText = this.articleInfo.commentText
					}
				}else if(this.type == 'reply1'){
					this.i = i
					if(this.oid == userId){
						this.deleteId = commentId
						this.commentText = ''
						this.deleteShow = true
						return false
					}
					if(this.commentArr[i].commentText!=null&&this.commentArr[i].commentText!=''&&this.commentArr[i].commentText!=undefined){
						this.commentText = this.commentArr[i].commentText
					}
				}else if(this.type == 'reply2'){
					this.i = i
					this.j = j
					if(this.oid == userId){
						this.deleteId = commentId
						this.commentText = ''
						this.deleteShow = true
						return false
					}
					if(this.commentArr[i].articleReplyResponseDtos[j].commentText != null && this.commentArr[i].articleReplyResponseDtos[j].commentText != '' && this.commentArr[i].articleReplyResponseDtos[j].commentText != undefined){
						this.commentText = this.commentArr[i].articleReplyResponseDtos[j].commentText
					}
				}
				this.inputShow = true
			},
			cancelComment(){
				this.inputShow = false
				if(this.type == 'comment'){
					this.articleInfo.commentText = this.commentText
				}else if(this.type == 'reply1'){
					this.commentArr[this.i].commentText = this.commentText
				}else if(this.type == 'reply2'){
					this.commentArr[this.i].articleReplyResponseDtos[this.j].commentText = this.commentText
				}
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
				if(this.type == 'comment'){
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
							if(res.data.success&&res.data.code == 200){
								this.getCommentArr()
								this.commentText = ''
								this.type == 'comment'
								this.$store.commit("changeCircle",true)
								this.$store.commit("changeTopic",true)
								this.$store.commit("changeCirclePage",true)
							}else if(res.data.code == 401){
								this.to401()
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
				}else if(this.type == 'reply1'){
					uni.request({
					    url: this.$url+'/api/scientificresearch/articlereply', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"articleCommentId": this.commentArr[this.i].id,
							"replyId": 0,
							"toUserId": this.commentArr[this.i].fromUserId,
							"content": this.commentText
						},
						method: "POST",
					    
					    success: (res) => {
							if(res.data.success&&res.data.code == 200){
								this.getCommentArr()
								this.commentText = ''
								this.type == 'comment'
								this.$store.commit("changeCircle",true)
								this.$store.commit("changeTopic",true)
								this.$store.commit("changeCirclePage",true)
							}else if(res.data.code == 401){
								this.to401()
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
				}else if(this.type == 'reply2'){
					uni.request({
					    url: this.$url+'/api/scientificresearch/articlereply', 
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"articleCommentId": this.commentArr[this.i].id,
							"replyId": this.commentArr[this.i].articleReplyResponseDtos[this.j].id,
							"toUserId": this.commentArr[this.i].articleReplyResponseDtos[this.j].fromUserId,
							"content": this.commentText
						},
						method: "POST",
					    
					    success: (res) => {
							if(res.data.success&&res.data.code == 200){
								this.getCommentArr()
								this.commentText = ''
								this.type == 'comment'
								this.$store.commit("changeCircle",true)
								this.$store.commit("changeTopic",true)
								this.$store.commit("changeCirclePage",true)
							}else if(res.data.code == 401){
								this.to401()
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
			},
			cancelDelete(){
				this.type = 'comment'
				this.deleteShow = false
			},
			deleteComment(){
				this.deleteShow = false
				if(this.type == 'reply1'){
					uni.request({
					    url: this.$url+'/api/scientificresearch/deletecomment',
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"commentId": this.deleteId,
							"type": 0
						},
						method: "POST",
					    
					    success: (res) => {
							this.type = 'comment'
							if(res.data.success&&res.data.code == 200){
								this.articleInfo.commentCount--
								this.commentArr.splice(this.i,1)
								this.$store.commit("changeCircle",true)
								this.$store.commit("changeTopic",true)
								this.$store.commit("changeCirclePage",true)
							}else if(res.data.code == 401){
								this.to401()
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
					})
				}else if(this.type == 'reply2'){
					uni.request({
					    url: this.$url+'/api/scientificresearch/deletecomment',
						header:{
							Authorization:'Bearer '+this.token
						},
						data:{
							"commentId": this.deleteId,
							"type": 1
						},
						method: "POST",
					    
					    success: (res) => {
							this.type = 'comment'
							if(res.data.success&&res.data.code == 200){
								this.articleInfo.commentCount--
								this.commentArr[this.i].articleReplyResponseDtos.splice(this.j,1)
								this.$store.commit("changeCircle",true)
								this.$store.commit("changeTopic",true)
								this.$store.commit("changeCirclePage",true)
							}else if(res.data.code == 401){
								this.to401()
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
					})
				}
				
			},
			focus(event){
				if(this.type == 'comment'){
					this.showComment(this.type)
				}else if(this.type == 'reply1'){
					this.commentPlaceholder = '评论@'+this.commentArr[this.i].fromNickName
					this.showComment(this.type,this.i)
				}else if(this.type == 'reply2'){
					this.commentPlaceholder = '回复@'+this.commentArr[this.i].articleReplyResponseDtos[this.j].fromNickName
					this.showComment(this.type,this.i,this.j)
				}
				this.commentBottom = event.detail.height +'px'
				this.commentHeight = '100vh'
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
				this.commentPlaceholder = '就差你的评论'
				this.commentBottom = '0px'
				this.commentHeight = '110upx'
			},
			
			scrollTo(){
				uni.pageScrollTo({
				    scrollTop: 0,
				    duration: 300
				});
			},
			
			toCirclePage(authorId){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif 
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/circlePage/circlePage?authorId="+authorId
				})
			},
			
			addView(){
				if(this.addViewOff){
					return false
				}
				uni.request({
					url: this.$url+'/api/article/add-view?id='+this.articleId, 
					method: "GET",
					
					success: (res) => {
						this.addViewOff = true
						this.articleInfo.pageViews++
					}
				});
			},
			addVote(optionId){
				// if(this.articleInfo.articleVoteDto.isEnd){
				// 	return false
				// }
				// if(this.articleInfo.articleVoteDto.userVoteNumber>=this.articleInfo.articleVoteDto.maxSelectNumber){
				// 	return false
				// }
				uni.showLoading()
				uni.request({
				    url: this.$url+'/api/scientificresearch/articlevote', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"articleVoteId": this.articleInfo.articleVoteDto.id,
						"optionId": optionId
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCirclePage",true)
							uni.request({
							    url: this.$url+'/api/scientificresearch/votearticle', 
								header:{
									Authorization:'Bearer '+this.token
								},
								data:{
									"articleId": this.articleId
								},
								method: "POST",
							    
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										this.articleInfo.articleVoteDto = res.data.data
									}
							    },
								fail: (err) => {
									uni.hideLoading()
								}
							});
						}else if(res.data.code == 401){
							this.to401()
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
			setCopy(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif  
				uni.setClipboardData({
					data:this.articleInfo.link
				}) 
			},
			to401(){
				uni.showToast({
				    icon: 'none',
				    position: 'bottom',
				    title: '请登录'
				});
				setTimeout(()=>{
					uni.navigateTo({
						url:"/pages/my/login/login"
					})
				},1000)
			}
		}
	}
</script>

<style lang="scss">
	@import "./article.scss";
</style>
