<template>
	<view class="circlePage_content">
		
		<view class="fixed_header" :style="{opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex}">
			<view class="status"></view>
			<view class="header">
				<!-- #ifndef H5 -->
				<image class="back" src="/static/public/back/back_black.png" mode="widthFix" @tap.stop="$back" />
				<!-- #endif --> 
				<text class="name">#{{topicInfo.name}}</text>
				<view class="btn" @tap.stop="toRelease">参与话题</view>
				<!-- #ifdef APP-PLUS -->
				<image class="share" src="/static/studyEnjoy/share.png" mode="widthFix" @tap.stop="showShare(0)" />
				<!-- #endif --> 
			</view>
		</view>
		
		<view class="circlePage_header" :style="{opacity: beforeHeaderOpacity}">
			<view class="glass" :style="{backgroundImage: 'url('+ topicInfo.imageUrl +')'}"></view>
			<view class="noGlass">
				<view class="status"></view>
				<view class="header">
					<!-- #ifndef H5 -->
					<image class="back" src="/static/public/back/back_white.png" mode="widthFix" @tap.stop="$back" />
					<!-- #endif --> 
					<!-- #ifdef APP-PLUS -->
					<image class="share" src="/static/studyEnjoy/share_w.png" mode="widthFix" @tap.stop="showShare(0)" />
					<!-- #endif --> 
				</view>
				<view class="infor_content">
					<image class="image" :src="topicInfo.imageUrl" @tap.stop="previewImg(0,[topicInfo.imageUrl])" />
					<view class="infor">
						<text class="infor_name">#{{topicInfo.name}}</text>
					</view>
					<image class="btn" src="/static/studyEnjoy/circle/btn.png" mode="widthFix" @tap.stop="toRelease"/>
				</view>
				<view class="dynamic">
					<view class="dynamic_ul">
						<image :src="item" v-for="(item, index) in dynamicImage" :key="'dynamic'+index" v-if="index < 3" />
					</view>
					<text>共{{totalCount}}条动态</text>
				</view>
				<view class="content">
					{{topicInfo.content}}
				</view>
			</view>
		</view>
		
		<view class="main_content">
			<view class="nav" :style="{borderRadius:navRadius}">
				<view class="nav_list" :class="circleIdx == 0 ? 'active' : ''" @tap="tabCircleIdx(0)">
					热点
				</view>
				<view class="nav_list" :class="circleIdx == 1 ? 'active' : ''" @tap="tabCircleIdx(1)">
					最新
				</view>
			</view>
			
			<view class="circle_content">
				<view class="circle_ul" v-if="!circleIdx">
					<circleItem v-for="(item,index) in hotArr" :key="'hot'+index"
					type="recommend"
					:item="item" 
					:oid="oid" 
					:token="token" 
					@addFollow="addFollow(item.authorId)" 
					@cancelFollow="cancelFollow(item.authorId)" 
					@deleteArticle="deleteArticle(item.id)" 
					@addFavor="addFavor(item.id,index)"
					@cancelFavor="cancelFavor(item.id,index)" 
					@addPoint="addPoint(item.id,index)" 
					@cancelPoint="cancelPoint(item.id,index)" 
					@showExtend="showExtend(index)" 
					@hideExtend="hideExtend()" 
					@showComment="showComment(item.id,index)" 
					@showShare="showShare(item.authorImage,item.id,item.customerType,item.content,item.title)"
					@addVote="addVote" />
					
					<view class="baseline" v-if="hotBaseShow">
						—— 已经到底啦 ——
					</view>
				</view>
				
				<view class="circle_ul" v-if="circleIdx">
					<circleItem v-for="(item,index) in nowArr" :key="'now'+index"
					type="recommend"
					:item="item" 
					:oid="oid" 
					:token="token" 
					@addFollow="addFollow(item.authorId)" 
					@cancelFollow="cancelFollow(item.authorId)" 
					@deleteArticle="deleteArticle(item.id)" 
					@addFavor="addFavor(item.id,index)"
					@cancelFavor="cancelFavor(item.id,index)" 
					@addPoint="addPoint(item.id,index)" 
					@cancelPoint="cancelPoint(item.id,index)" 
					@showExtend="showExtend(index)" 
					@hideExtend="hideExtend()" 
					@showComment="showComment(item.id,index)" 
					@showShare="showShare(item.authorImage,item.id,item.customerType,item.content,item.title)"
					@addVote="addVote" />
					
					<view class="baseline" v-if="nowBaseShow">
						—— 已经到底啦 ——
					</view>
				</view>
			</view>
		</view>
		
		<view class="input_content" v-if="inputShow" @touchmove.stop.prevent @tap.stop="cancelComment(circleIdx)">
			<view class="input_main" :style="{'bottom':commentBottom}" @tap.stop>
				<input class="input" v-model="commentText" type="text" placeholder="就差你的评论..." :focus="inputShow" :adjust-position="false" @focus="focus" @blur="blur" @confirm="addComment(circleIdx)" confirm-type="send" maxlength="500" />
				<view class="send" @tap.stop="addComment(circleIdx)">
					发送
				</view>
			</view>
		</view>
		
		<!-- #ifdef H5 -->
		<h5Footer />
		<!-- #endif --> 
		
		<!-- #ifdef APP-PLUS -->
		<share :shareShow="shareShow" :shareObj="shareObj" @hideShare="$hideShare()" />
		<!-- #endif --> 
	</view>
</template>

<script>
	import circleItem from '@/components/nw-circle-item/nw-circle-item';
	import share from '@/components/nw-share/nw-share';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default {
		components: {circleItem,share,h5Footer},
		data() {
			return {
				afterHeaderzIndex: -1,//层级
				beforeHeaderOpacity: 1,//不透明度
				afterHeaderOpacity: 0,//不透明度
				navRadius:'16upx 16upx 0 0',
				
				publishingTypeId:0,
				topicInfo:{
					id:'',
					imageUrl:'',
					name:'',
					content:''
				},
				dynamicImage:[],
				totalCount:0,
				
				login:false,
				token:'',
				oid:'',
				nickname:'',
				
				circleIdx:0,
				
				hotArr:[],
				hotPageIndex:1,
				hotBaseShow:false,
				
				nowArr:[],
				nowPageIndex:1,
				nowBaseShow:false,
				
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
			this.publishingTypeId = options.publishingTypeId
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
			if(this.$store.state.topic){
				uni.startPullDownRefresh()
				this.$store.commit("changeTopic",false)
			}
		},
		onPullDownRefresh(){
			this.getTopic()
			this.getHotArr()
			this.getNowArr()
		},
		onReachBottom(){
			if(!this.circleIdx){
				if(this.hotArr.length > 0){
					this.addHotArr()
				}
			}else{
				if(this.nowArr.length > 0){
					this.addNowArr()
				}
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
			this.navRadius = e.scrollTop > 100 ? '0 0 0 0' : '16upx 16upx 0 0'
			
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
			tabCircleIdx(index){
				this.hideExtend()
				this.circleIdx = index
			},
			getTopic(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/conversation', 
					data:{
						"appuser": this.oid,
						"publishingTypeId": this.publishingTypeId,
						"type": 0,
						"pageIndex": 1,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							this.topicInfo = res.data.data.topic
							this.dynamicImage = res.data.data.dynamicImage
							this.totalCount = res.data.data.totalCount
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						uni.stopPullDownRefresh()
						this.$requestFail()
					}
				});
			},
			getHotArr(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/conversation', 
					data:{
						"appuser": this.oid,
						"publishingTypeId": this.publishingTypeId,
						"type": 0,
						"pageIndex": 1,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							for(let i=0; i<res.data.data.communityArticleDto.length; i++){
								res.data.data.communityArticleDto[i].extend = false
							}
							this.hotArr = res.data.data.communityArticleDto
							this.hotPageIndex = 1
							this.hotBaseShow = false
						}
				    },
					fail: (err) => {
						uni.stopPullDownRefresh()
						this.$requestFail()
					}
				});
			},
			addHotArr(){
				uni.showLoading({ title: '加载更多'});
				uni.request({
					url: this.$url+'/api/scientificresearch/conversation',
					data:{
						"appuser": this.oid,
						"publishingTypeId": this.publishingTypeId,
						"type": 0,
						"pageIndex": ++this.hotPageIndex,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data.communityArticleDto.length > 0 && res.data.data.communityArticleDto != null){
								for(let i=0; i<res.data.data.communityArticleDto.length; i++){
									res.data.data.communityArticleDto[i].extend = false
									this.hotArr.push(res.data.data.communityArticleDto[i])
								}
								this.hotBaseShow = false
							}else if(res.data.data.communityArticleDto.length == 0){
								this.hotPageIndex--
								this.hotBaseShow = true
							}
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			getNowArr(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/conversation', 
					data:{
						"appuser": this.oid,
						"publishingTypeId": this.publishingTypeId,
						"type": 1,
						"pageIndex": 1,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							for(let i=0; i<res.data.data.communityArticleDto.length; i++){
								res.data.data.communityArticleDto[i].extend = false
							}
							this.nowArr = res.data.data.communityArticleDto
							this.nowPageIndex = 1
							this.nowBaseShow = false
						}
				    },
					fail: (err) => {
						uni.stopPullDownRefresh()
						this.$requestFail()
					}
				});
			},
			addNowArr(){
				uni.showLoading({ title: '加载更多'});
				uni.request({
					url: this.$url+'/api/scientificresearch/conversation',
					data:{
						"appuser": this.oid,
						"publishingTypeId": this.publishingTypeId,
						"type": 1,
						"pageIndex": ++this.nowPageIndex,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data.communityArticleDto.length > 0 && res.data.data.communityArticleDto != null){
								for(let i=0; i<res.data.data.communityArticleDto.length; i++){
									res.data.data.communityArticleDto[i].extend = false
									this.nowArr.push(res.data.data.communityArticleDto[i])
								}
								this.nowBaseShow = false
							}else if(res.data.data.communityArticleDto.length == 0){
								this.nowPageIndex--
								this.nowBaseShow = true
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
				if(!this.circleIdx){
					this.hotArr[index].extend = !this.hotArr[index].extend
					for(let i=0; i<this.hotArr.length; i++){
						if(i != index){
							this.hotArr[i].extend = false
						}
					}
				}else{
					this.nowArr[index].extend = !this.nowArr[index].extend
					for(let i=0; i<this.nowArr.length; i++){
						if(i != index){
							this.nowArr[i].extend = false
						}
					}
				}
			},
			hideExtend(){
				for(let i=0; i<this.hotArr.length; i++){
					this.hotArr[i].extend = false
				}
				for(let i=0; i<this.nowArr.length; i++){
					this.nowArr[i].extend = false
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
							this.$store.commit("changeCirclePage",true)
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
										this.$store.commit("changeCirclePage",true)
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
			deleteArticle(articleId){
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
										uni.startPullDownRefresh()
										this.$store.commit("changeCircle",true)
										this.$store.commit("changeCirclePage",true)
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
				if(!this.circleIdx){
					this.hotArr[index].collectionNumber++
					this.hotArr[index].isCollection = true
				}else{
					this.nowArr[index].collectionNumber++
					this.nowArr[index].isCollection = true
				}
				uni.showToast({title:'收藏成功'})
				uni.request({
				    url: this.$url+'/api/collection/articleadd?articleId='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							if(!this.circleIdx){
								for(let i=0; i<this.nowArr.length; i++){
									if(this.nowArr[i].id == this.hotArr[index].id){
										this.nowArr[i].collectionNumber++
										this.nowArr[i].isCollection = true
										break
									}
								}
							}else{
								for(let i=0; i<this.hotArr.length; i++){
									if(this.hotArr[i].id == this.nowArr[index].id){
										this.hotArr[i].collectionNumber++
										this.hotArr[i].isCollection = true
										break
									}
								}
							}
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeCirclePage",true)
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
				if(!this.circleIdx){
					this.hotArr[index].collectionNumber--
					this.hotArr[index].isCollection = false
				}else{
					this.nowArr[index].collectionNumber--
					this.nowArr[index].isCollection = false
				}
				uni.request({
				    url: this.$url+'/api/collection/articledelete?articleId='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							if(!this.circleIdx){
								for(let i=0; i<this.nowArr.length; i++){
									if(this.nowArr[i].id == this.hotArr[index].id){
										this.nowArr[i].collectionNumber--
										this.nowArr[i].isCollection = false
										break
									}
								}
							}else{
								for(let i=0; i<this.hotArr.length; i++){
									if(this.hotArr[i].id == this.nowArr[index].id){
										this.hotArr[i].collectionNumber--
										this.hotArr[i].isCollection = false
										break
									}
								}
							}
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeCirclePage",true)
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
				if(!this.circleIdx){
					this.hotArr[index].pointNumber++
					this.hotArr[index].isPoint = true
				}else{
					this.nowArr[index].pointNumber++
					this.nowArr[index].isPoint = true
				}
				uni.request({
				    url: this.$url+'/api/article/add-point?id='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							if(!this.circleIdx){
								for(let i=0; i<this.nowArr.length; i++){
									if(this.nowArr[i].id == this.hotArr[index].id){
										this.nowArr[i].pointNumber++
										this.nowArr[i].isPoint = true
										break
									}
								}
							}else{
								for(let i=0; i<this.hotArr.length; i++){
									if(this.hotArr[i].id == this.nowArr[index].id){
										this.hotArr[i].pointNumber++
										this.hotArr[i].isPoint = true
										break
									}
								}
							}
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeCirclePage",true)
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
				if(!this.circleIdx){
					this.hotArr[index].pointNumber--
					this.hotArr[index].isPoint = false
				}else{
					this.nowArr[index].pointNumber--
					this.nowArr[index].isPoint = false
				}
				uni.request({
				    url: this.$url+'/api/article/cancel-point?id='+articleId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							if(!this.circleIdx){
								for(let i=0; i<this.nowArr.length; i++){
									if(this.nowArr[i].id == this.hotArr[index].id){
										this.nowArr[i].pointNumber--
										this.nowArr[i].isPoint = false
										break
									}
								}
							}else{
								for(let i=0; i<this.hotArr.length; i++){
									if(this.hotArr[i].id == this.nowArr[index].id){
										this.hotArr[i].pointNumber--
										this.hotArr[i].isPoint = false
										break
									}
								}
							}
							this.$store.commit("changeCircle",true)
							this.$store.commit("changeCirclePage",true)
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
				if(!this.circleIdx){
					if(this.hotArr[i].commentText!=null&&this.hotArr[i].commentText!=''&&this.hotArr[i].commentText!=undefined){
						this.commentText = this.hotArr[i].commentText
					}
				}else{
					if(this.nowArr[i].commentText!=null&&this.nowArr[i].commentText!=''&&this.nowArr[i].commentText != undefined){
						this.commentText = this.nowArr[i].commentText
					}
				}
				this.inputShow = true
			},
			cancelComment(){
				this.inputShow = false
				if(!this.circleIdx){
					this.hotArr[this.i].commentText = this.commentText
					for(let i=0; i<this.nowArr.length; i++){
						if(this.nowArr[i].id == this.hotArr[this.i].id){
							this.nowArr[i].commentText = this.hotArr[this.i].commentText
							break
						}
					}
				}else{
					this.nowArr[this.i].commentText = this.commentText
					for(let i=0; i<this.hotArr.length; i++){
						if(this.hotArr[i].id == this.nowArr[this.i].id){
							this.hotArr[i].commentText = this.nowArr[this.i].commentText
							break
						}
					}
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
							if(!this.circleIdx){
								this.hotArr[this.i].commentCount++
								this.hotArr[this.i].commentText = ''
								if(this.hotArr[this.i].articleCommentResponseDtos == null){
									this.hotArr[this.i].articleCommentResponseDtos = []
								}
								this.hotArr[this.i].articleCommentResponseDtos.push(articleCommentResponseDto)
								for(let i=0; i<this.nowArr.length; i++){
									if(this.nowArr[i].id == this.hotArr[this.i].id){
										this.nowArr[i] = this.hotArr[this.i]
										break
									}
								}
							}else{
								this.nowArr[this.i].commentCount++
								this.nowArr[this.i].commentText = ''
								if(this.nowArr[this.i].articleCommentResponseDtos == null){
									this.nowArr[this.i].articleCommentResponseDtos = []
								}
								this.nowArr[this.i].articleCommentResponseDtos.push(articleCommentResponseDto)
								for(let i=0; i<this.hotArr.length; i++){
									if(this.hotArr[i].id == this.nowArr[this.i].id){
										this.hotArr[i] = this.nowArr[this.i]
										break
									}
								}
							}
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
							this.$store.commit("changeCirclePage",true)
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
										for(let i=0; i<this.hotArr.length; i++){
											if(this.hotArr[i].id==articleId){
												this.hotArr[i].articleVoteDto = res.data.data
												break
											}
										}
										for(let i=0; i<this.nowArr.length; i++){
											if(this.nowArr[i].id==articleId){
												this.nowArr[i].articleVoteDto = res.data.data
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
			showShare(shareType,shareImg,articleId,customerType,content,title){
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
				if(shareType){
					this.shareObj = {
						title:"@"+this.nickname+tt,
						summary:shareSummary,
						href:shareUrl+articleId,
						imageUrl:shareImg,
					}
				}else{
					this.shareObj = {
						title:"@"+this.nickname+"邀请你参与话题！",
						summary: this.topicInfo.content,
						href:this.$h5Url+"/pages/studyEnjoy/circle/topic/topic?publishingTypeId="+this.publishingTypeId,
						imageUrl:this.topicInfo.imageUrl,
					}
				}
				this.shareShow = 'show';
			},
			
			toRelease(){
				this.hideExtend()
				if(!this.login){
					this.$to401()
					return false
				}
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/release/release?type=topic&topicName="+this.topicInfo.name+"&topicId="+this.publishingTypeId
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./topic.scss";
</style>
