<template>
	<view class="circleDetails_content">
		<view class="line"></view>
		<image class="toTop" src="/static/studyEnjoy/circle/top.png" @tap.stop="scrollTo()" v-if="scrollShow" />
		<view class="circle_list">
			<view class="info">
				<view class="left" @tap.stop="toCirclePage(articleInfo.authorId)">
					<view class="avatar">
						<image class="avatar_img" :src="articleInfo.authorImage" />
						<image class="admin" src="/static/studyEnjoy/circle/admin.png" v-if="articleInfo.isAdmin" />
					</view>
					<view class="left_main">
						<view class="name">{{articleInfo.authorName}}</view>
						<view class="time">{{articleInfo.createTime}}</view>
					</view>
				</view>
				<view class="right">
					<view class="look" v-if="oid != articleInfo.authorId&&!articleInfo.isFollow" @tap.stop="addFollow()">
						<text>关注</text>
					</view>
					<view class="nolook" v-if="oid != articleInfo.authorId&&articleInfo.isFollow" @tap.stop="cancelFollow()">
						<text>已关注</text>
					</view>
					<image class="extend" src="/static/studyEnjoy/extend.png" @tap.stop="showExtend()" />
				</view>
			</view>
			
			<view class="extend_info" v-if="articleInfo.extend">
				<image class="arrow" mode="widthFix" src="/static/public/arrow/up.png" @tap.stop="showExtend()" />
				<view class="info_ul" >
					<view class="info_list" v-if="oid!=articleInfo.authorId" @tap.stop = "toReport(articleId)">
						举报此条
					</view>
					<view class="info_list" v-if="oid==articleInfo.authorId" @tap.stop="deleteArticle()">
						删除此条
					</view>
				</view>
			</view>
			
			<textarea class="text" v-model="articleInfo.content" disabled auto-height v-if="articleInfo.content!=''&&articleInfo.content!=null&&articleInfo.content!=undefined" />
			
			<view class="image_ul">
				<image 
				:src="img" 
				mode="widthFix" 
				v-for="(img,index) in articleInfo.avatarImg" 
				:key="'img'+index" 
				@tap.stop = "$previewImg(index,articleInfo.avatarImg)"
				 />
			</view>
			
			<view class="topic_content" v-if="articleInfo.lable!=null&&articleInfo.lable!=''">
				<view class="topic" @tap.stop="toTopic(articleInfo.publishingTypeId)">
					<view class="dot"></view>
					<text>{{articleInfo.lable}}</text>
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
		
		<!-- #ifndef H5 -->
		<view class="input_placeholder"></view>
		<view class="input_content" :style="{'height':commentHeight}" @touchmove.stop.prevent @tap.stop="cancelComment()">
			<view class="input_main" :style="{'bottom':commentBottom}" @tap.stop>
				<input class="input" v-model="commentText" type="text" :placeholder="commentPlaceholder" :focus="inputShow" :adjust-position="false" @focus="focus" @blur="blur" @confirm="addComment()" confirm-type="send" maxlength="500" />
				<view class="send" @tap.stop="addComment()">
					发送
				</view>
			</view>
		</view>
		<!-- #endif -->  
		
		<!-- #ifdef H5 -->
		<h5Footer />
		<!-- #endif -->    
		
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
					commentText:'',
					publishingTypeId:0,
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
		onPullDownRefresh(){
			this.getArticle()
		},
		onPageScroll(e) {
			this.scrollShow = e.scrollTop > 800 ? true : false;
			this.hideExtend()
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
								    title: '动态已删除'
								});
								setTimeout(()=>{
									uni.navigateBack()
								},1000)
								return false
							}
							res.data.data.extend = false
							res.data.data.commentText = ''
							this.articleInfo = res.data.data
							this.shareObj = {
								title:"@"+this.nickname+"发现了有意思的动态！",
								summary:this.articleInfo.content,
								href:this.$h5Url+"/pages/studyEnjoy/circle/circle?id="+this.articleId,
								imageUrl:this.articleInfo.authorImage,
							}
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
			showExtend(index){
				this.articleInfo.extend = !this.articleInfo.extend
			},
			hideExtend(){
				this.articleInfo.extend = false
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
							this.articleInfo.isFollow = true
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeTopic",true)
							this.$store.commit("changeCirclePage",true)
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
										this.articleInfo.isFollow = false
										this.$store.commit("changeCircle",true)
										this.$store.commit("changeTopic",true)
										this.$store.commit("changeCirclePage",true)
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
			deleteArticle(){
				this.hideExtend()
				uni.showModal({
					title: '警告',
					content: '是否删除此条？',
					confirmColor: '#F8B500',
					success: (res)=>{
						if(res.confirm) {
							uni.showLoading({title: '正在删除'});
							uni.request({
							    url: this.$url+'/api/scientificresearch/deletearticle?articleId='+this.articleId, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									uni.hideLoading()
									if(res.data.success&&res.data.code == 200){
										uni.showToast({ title: '删除成功'});
										this.$store.commit("changeCircle",true)
										this.$store.commit("changeTopic",true)
										this.$store.commit("changeCirclePage",true)
										setTimeout(()=>{
											uni.navigateBack()
										},1000)
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
			addFavor(){
				this.hideExtend()
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
				this.hideExtend()
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
				this.hideExtend()
				if(!this.login){
					this.$to401()
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
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			cancelPoint(){
				this.hideExtend()
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
							this.$to401()
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			showComment(type,i,j,commentId,userId){
				this.hideExtend()
				if(!this.login){
					this.$to401()
					return false
				}
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif  
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
			
			toTopic(publishingTypeId){
				this.hideExtend()
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/topic/topic?publishingTypeId="+publishingTypeId
				})
			},
			toCirclePage(authorId){
				this.hideExtend()
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif 
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/circlePage/circlePage?authorId="+authorId
				})
			},
			
			toReport(articleId){
				this.hideExtend()
				if(this.token==''||this.token==null||this.token==undefined){
					this.$to401()
					return false
				}
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/report/report?articleId="+articleId
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./circle.scss";
</style>
