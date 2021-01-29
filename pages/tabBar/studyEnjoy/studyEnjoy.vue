<template>
	<view class="se_content">
		<view class="guide_content" @touchmove.stop.prevent v-if="guideShow">
			<view class="kingkong">
				<view class="kingkong_list"></view>
				<view class="kingkong_list">
					<block v-if="guideShow==1">
						<image class="guide_img" src="/static/studyEnjoy/guide/1/icon.png" />
						<image class="guide_text text1" src="/static/studyEnjoy/guide/1/text.png" mode="widthFix" />
					</block>
				</view>
				<view class="kingkong_list">
					<block v-if="guideShow==2">
						<image class="guide_img" src="/static/studyEnjoy/guide/2/icon.png" />
						<image class="guide_text text2" src="/static/studyEnjoy/guide/2/text.png" mode="widthFix" />
					</block>
				</view>
				<view class="kingkong_list">
					<block v-if="guideShow==3">
						<image class="guide_img" src="/static/studyEnjoy/guide/3/icon.png" />
						<image class="guide_text text3" src="/static/studyEnjoy/guide/3/text.png" mode="widthFix" />
					</block>
				</view>
			</view>
			<view class="btn" v-if="guideShow==1" @tap.stop="tabGuideShow(2)"><text>下一步</text></view>
			<view class="btn" v-if="guideShow==2" @tap.stop="tabGuideShow(3)"><text>下一步</text></view>
			<view class="btn" v-if="guideShow==3" @tap.stop="tabGuideShow(0)"><text>我知道啦</text></view>
		</view>
		<view class="se_header" @touchmove.stop.prevent>
			<view class="status"></view>
			<view class="header">
				<view class="search" @tap.stop="$toPath('/pages/search/search')">
					<image src="/static/search/search.png" />
					<text>晒图有礼</text>
				</view>
				<view class="message" @tap.stop="$toPath('/pages/notice/message/message')">
					<image src="/static/public/message/message_black.png" />
					<view class="badge" v-if="$store.state.messageLen>0&&$store.state.messageLen<99">
						{{$store.state.messageLen}}
					</view>
					<view class="badge" v-if="$store.state.messageLen>99">
						99+
					</view>
				</view>
			</view>
		</view>
		<view class="header_placeholder"></view>
		
		<view class="hot">
			<view class="title">
				<text>热搜</text>
			</view>
			
			<scroll-view class="scroll" scroll-x>
				<image src="/static/search/fire.png" />
				<view class="hot_list" v-for="(item, index) in hotArr" :key="'hot'+index" @tap.stop="$toPath('/pages/search/search?type=auto&text='+item.value)">
					<view class="hot_item">
						
						<text>{{item.value}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
		
		<image class="banner" :src="item.url" mode="widthFix" v-for="(item, index) in bannerArr" :key="'banner'+index" v-if="index==0" @tap.stop="$toPath(item.linkUrl)" />
		
		<view class="kingkong">
			<view class="kingkong_list" @tap.stop="$toPath('/pages/studyEnjoy/QaVaL/QaV?index=0')">
				<image src="/static/studyEnjoy/kingkong/QA.png" />
				<text>基础问答</text>
			</view>
			<view class="kingkong_list" @tap.stop="$toPath('/pages/studyEnjoy/QaVaL/QaV?index=1')">
				<image src="/static/studyEnjoy/kingkong/video.png" />
				<text>设备解说</text>
			</view>
			<view class="kingkong_list" @tap.stop="$toPath('/pages/studyEnjoy/QaVaL/Learning')">
				<image src="/static/studyEnjoy/kingkong/learning.png" />
				<text>学术博览</text>
			</view>
			<view class="kingkong_list" @tap.stop="$toPath('/pages/activity/paper/all/all')">
				<image src="/static/studyEnjoy/kingkong/paper.png" />
				<text>论文评选</text>
			</view>
		</view>
		
		<view class="circle">
			<view class="header_content">
				<view class="header">
					<text :class="!circleIdx ? 'active':''" @tap.stop="tabCircleIdx(0)">推荐</text>
					<text :class="circleIdx ? 'active':''" @tap.stop="tabCircleIdx(1)">关注</text>
				</view>
			</view>
			<view class="circle_ul re" v-if="!circleIdx">
				
				<view class="recommend" v-if="toppingShow">
					推荐
				</view>
				<view class="topping" v-if="toppingShow" @tap.stop="cancelTopping()">
					<image src="/static/login/x.png" />
				</view>
				
				<circleItem v-for="(item,index) in reArr" :key="'re'+index" 
				type="recommend"
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
				<view class="baseline" v-if="reBaseShow">
					—— 已经到底啦 ——
				</view>
			</view>
			
			<view class="circle_ul" v-if="circleIdx">
				<empty marginTop="200upx" src="/static/expect/no_Article.png" text="你有点高冷~暂未关注其他人" v-if="flArr.length <= 0" />
				<circleItem v-for="(item,index) in flArr" :key="'fl'+index"
				type="follow"
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
				<view class="baseline" v-if="flBaseShow">
					—— 已经到底啦 ——
				</view>
			</view>
		</view>
		
		<image class="release" src="/static/studyEnjoy/circle/floatImg.png" @tap.stop="toRelease"/>
		
		<view class="input_content" v-if="inputShow" @touchmove.stop.prevent @tap.stop="cancelComment()">
			<view class="input_main" :style="{'bottom':commentBottom}" @tap.stop>
				<input class="input" v-model="commentText" type="text" placeholder="就差你的评论..." :focus="inputShow" :adjust-position="false" @focus="focus($event)" @blur="blur()" @confirm="addComment()" confirm-type="send" maxlength="500" />
				<view class="send" @tap.stop="addComment()">
					发送
				</view>
			</view>
		</view>
		
		<!-- #ifdef APP-PLUS -->
		<share :shareShow="shareShow" :shareObj="shareObj" @hideShare="hideShare()" />
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
				cartBadge:'',
				
				login:false,
				token:'',
				oid:'',
				nickname:'',
				
				bannerArr:[],
				hotArr:[],
				
				circleIdx:0,
				
				reArr:[],
				rePageIndex:1,
				reBaseShow:false,
				
				flArr:[],
				flPageIndex:1,
				flBaseShow:false,
				
				inputShow:false,
				commentText:'',
				commentBottom:'0',
				i:NaN,
				articleId:NaN,
				
				//分享区
				shareShow:'',
				shareObj:{},
				
				toppingShow:false,
				
				scrollTop:0,
				
				guideShow:false
			};
		},
		onLoad() {
			this.getHotArr()
			this.getBannerArr()
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
			this.$getCartBadge()
			if(this.$store.state.circle){
				uni.startPullDownRefresh()
				this.$store.commit("changeCircle",false)
				this.$store.commit("changeTopic",false)
				this.$store.commit("changeCirclePage",false)
				this.$store.commit("changeCircleDetails",false)
			}else if(this.$store.state.topic){
				uni.startPullDownRefresh()
				this.$store.commit("changeCircle",false)
				this.$store.commit("changeTopic",false)
				this.$store.commit("changeCirclePage",false)
				this.$store.commit("changeCircleDetails",false)
			}else if(this.$store.state.circlePage){
				uni.startPullDownRefresh()
				this.$store.commit("changeCircle",false)
				this.$store.commit("changeTopic",false)
				this.$store.commit("changeCirclePage",false)
				this.$store.commit("changeCircleDetails",false)
			}else if(this.$store.state.circleDetails){
				uni.startPullDownRefresh()
				this.$store.commit("changeCircle",false)
				this.$store.commit("changeTopic",false)
				this.$store.commit("changeCirclePage",false)
				this.$store.commit("changeCircleDetails",false)
			}
		},
		onPullDownRefresh(){
			this.getReArr()
			if(this.token!=''&&this.token!=null&&this.token!=undefined){
				this.getFlArr()
			}
		},
		onReachBottom(){
			if(!this.circleIdx){
				if(this.reArr.length > 0){
					this.addReArr()
				}
			}else{
				if(this.flArr.length > 0){
					this.addFlArr()
				}
			}
		},
		onPageScroll(e){
			this.scrollTop = e.scrollTop
			this.hideExtend()
		},
		watch:{
			token(val){
				if(val!=''&&val!=null&&val!=undefined){
					this.getFlArr()
				}
			},
			oid(val){
				if(val!==''&&val!=null&&val!=undefined){
					this.getReArr()
				}
			},
		},
		methods:{
			getHotArr(){
				uni.request({
				    url: this.$url+'/api/articlev2/hotwords?type=1', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.hotArr = res.data.data
						}
				    }
				});
			},
			getBannerArr(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/scientbanner', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.bannerArr = res.data.data
							if(this.$isArray(this.bannerArr)&&this.bannerArr!=[]){
								let guide = uni.getStorageSync('se_guide')
								if(!guide){
									this.guideShow = 1
								}else{
									this.guideShow = false
								}
							}
						}
				    }
				});
			},
			tabGuideShow(type){
				if(!type){
					this.guideShow = false
					uni.setStorageSync('se_guide', true);
				}else{
					this.guideShow = type
				}
			},
			tabCircleIdx(idx){
				this.hideExtend()
				if(idx&&!this.login){
					this.$to401()
					return false
				}
				this.circleIdx = idx
			},
			cancelTopping(){
				let noCircleTopArr = uni.getStorageSync('noCircleTopAr')
				if(!Array.isArray(noCircleTopArr)){
					noCircleTopArr = []
				}
				noCircleTopArr.push(this.reArr[0].id)
				uni.setStorageSync('noCircleTopAr',noCircleTopArr)
				this.toppingShow = false
				this.reArr.shift()
			},
			getReArr(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/community', 
					data:{
						"appuser": this.oid,
						"pageIndex": 1,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							for(let i=0; i<res.data.data.items.length; i++){
								res.data.data.items[i].extend = false
							}
							this.reArr = res.data.data.items
							this.rePageIndex = 1
							this.reBaseShow = false
							if(this.reArr[0].topping){
								let noCircleTopArr = uni.getStorageSync('noCircleTopAr')
								if(Array.isArray(noCircleTopArr)){
									for(let i=0;i<noCircleTopArr.length;i++){
										if(noCircleTopArr[i] == this.reArr[0].id){
											this.toppingShow = false
											this.reArr.shift()
											return
										}
									}
								}else{
									uni.setStorageSync('noCircleTopAr',[])
								}
								this.toppingShow = true
							}else{
								this.toppingShow = false
							}
						}
				    },
					fail: (err) => {
						uni.stopPullDownRefresh()
						this.toppingShow = false
						this.$requestFail()
					}
				});
			},
			addReArr(){
				uni.showLoading({ title: '加载更多'});
				uni.request({
				    url: this.$url+'/api/scientificresearch/community', 
					data:{
						"appuser": this.oid,
						"pageIndex": ++this.rePageIndex,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data.items.length > 0 && res.data.data.items != null){
								for(let i=0; i<res.data.data.items.length; i++){
									res.data.data.items[i].extend = false
									this.reArr.push(res.data.data.items[i])
								}
								this.reBaseShow = false
							}else if(res.data.data.items.length == 0){
								this.rePageIndex--
								this.reBaseShow = true
							}
						}
				    },
					fail: (err) => {
						uni.hideLoading()
						this.$requestFail()
					}
				});
			},
			
			getFlArr(){
				uni.request({
				    url: this.$url+'/api/scientificresearch/communityfollow', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"pageIndex": 1,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							for(let i=0; i<res.data.data.items.length; i++){
								res.data.data.items[i].extend = false
							}
							this.flArr = res.data.data.items
							this.flPageIndex = 1
							this.flBaseShow = false
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			addFlArr(){
				uni.showLoading({title: '加载更多'});
				uni.request({
				    url: this.$url+'/api/scientificresearch/communityfollow', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"pageIndex": ++this.flPageIndex,
						"pageSize":10,
					},
					method: "POST",
				    
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data.items.length > 0 && res.data.data.items != null){
								for(let i=0; i<res.data.data.items.length; i++){
									res.data.data.items[i].extend = false
									this.flArr.push(res.data.data.items[i])
								}
								this.flBaseShow = false
							}else if(res.data.data.items.length == 0){
								this.flPageIndex--
								this.flBaseShow = true
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
					this.reArr[index].extend = !this.reArr[index].extend
					for(let i=0; i<this.reArr.length; i++){
						if(i != index){
							this.reArr[i].extend = false
						}
					}
				}else{
					this.flArr[index].extend = !this.flArr[index].extend
					for(let i=0; i<this.flArr.length; i++){
						if(i != index){
							this.flArr[i].extend = false
						}
					}
				}
			},
			hideExtend(){
				for(let i=0; i<this.reArr.length; i++){
					this.reArr[i].extend = false
				}
				for(let i=0; i<this.flArr.length; i++){
					this.flArr[i].extend = false
				}
			},
			addFollow(authorId){
				this.hideExtend()
				for(let i=0;i<this.reArr.length;i++){
					if(this.reArr[i].authorId == authorId){
						this.reArr[i].isFollow = true
					}
				}
				uni.request({
				    url: this.$url+'/api/scientificresearch/addfollow?followId='+authorId, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							// uni.startPullDownRefresh()
							this.getFlArr()
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
							for(let i=0;i<this.reArr.length;i++){
								if(this.reArr[i].authorId == authorId){
									this.reArr[i].isFollow = false
								}
							}
							uni.request({
							    url: this.$url+'/api/scientificresearch/cancelfollow?followId='+authorId, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									if(res.data.success&&res.data.code == 200){
										this.getFlArr()
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
										this.reArr.splice(index,1);
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
					this.reArr[index].collectionNumber++
					this.reArr[index].isCollection = true
				}else{
					this.flArr[index].collectionNumber++
					this.flArr[index].isCollection = true
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
								for(let i=0; i<this.flArr.length; i++){
									if(this.flArr[i].id == this.reArr[index].id){
										this.flArr[i].collectionNumber++
										this.flArr[i].isCollection = true
										break
									}
								}
							}else{
								for(let i=0; i<this.reArr.length; i++){
									if(this.reArr[i].id == this.flArr[index].id){
										this.reArr[i].collectionNumber++
										this.reArr[i].isCollection = true
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
						this.$requestFail()
					}
				});
			},
			cancelFavor(articleId,index){
				this.hideExtend()
				if(!this.circleIdx){
					this.reArr[index].collectionNumber--
					this.reArr[index].isCollection = false
				}else{
					this.flArr[index].collectionNumber--
					this.flArr[index].isCollection = false
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
								for(let i=0; i<this.flArr.length; i++){
									if(this.flArr[i].id == this.reArr[index].id){
										this.flArr[i].collectionNumber--
										this.flArr[i].isCollection = false
										break
									}
								}
							}else{
								for(let i=0; i<this.reArr.length; i++){
									if(this.reArr[i].id == this.flArr[index].id){
										this.reArr[i].collectionNumber--
										this.reArr[i].isCollection = false
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
					this.reArr[index].pointNumber++
					this.reArr[index].isPoint = true
				}else{
					this.flArr[index].pointNumber++
					this.flArr[index].isPoint = true
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
								for(let i=0; i<this.flArr.length; i++){
									if(this.flArr[i].id == this.reArr[index].id){
										this.flArr[i].pointNumber++
										this.flArr[i].isPoint = true
										break
									}
								}
							}else{
								for(let i=0; i<this.reArr.length; i++){
									if(this.reArr[i].id == this.flArr[index].id){
										this.reArr[i].pointNumber++
										this.reArr[i].isPoint = true
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
						this.$requestFail()
					}
				});
			},
			cancelPoint(articleId,index){
				this.hideExtend()
				if(!this.circleIdx){
					this.reArr[index].pointNumber--
					this.reArr[index].isPoint = false
				}else{
					this.flArr[index].pointNumber--
					this.flArr[index].isPoint = false
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
								for(let i=0; i<this.flArr.length; i++){
									if(this.flArr[i].id == this.reArr[index].id){
										this.flArr[i].pointNumber--
										this.flArr[i].isPoint = false
										break
									}
								}
							}else{
								for(let i=0; i<this.reArr.length; i++){
									if(this.reArr[i].id == this.flArr[index].id){
										this.reArr[i].pointNumber--
										this.reArr[i].isPoint = false
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
					if(this.reArr[i].commentText!=null&&this.reArr[i].commentText!=''&&this.reArr[i].commentText!=undefined){
						this.commentText = this.reArr[i].commentText
					}
				}else{
					if(this.flArr[i].commentText!=null&&this.flArr[i].commentText!=''&&this.flArr[i].commentText != undefined){
						this.commentText = this.flArr[i].commentText
					}
				}
				this.inputShow = true
			},
			cancelComment(){
				this.inputShow = false
				if(!this.circleIdx){
					this.reArr[this.i].commentText = this.commentText
					for(let i=0; i<this.flArr.length; i++){
						if(this.flArr[i].id == this.reArr[this.i].id){
							this.flArr[i].commentText = this.reArr[this.i].commentText
							break
						}
					}
				}else{
					this.flArr[this.i].commentText = this.commentText
					for(let i=0; i<this.reArr.length; i++){
						if(this.reArr[i].id == this.flArr[this.i].id){
							this.reArr[i].commentText = this.flArr[this.i].commentText
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
								this.reArr[this.i].commentCount++
								this.reArr[this.i].commentText = ''
								if(this.reArr[this.i].articleCommentResponseDtos == null){
									this.reArr[this.i].articleCommentResponseDtos = []
								}
								this.reArr[this.i].articleCommentResponseDtos.push(articleCommentResponseDto)
								for(let i=0; i<this.flArr.length; i++){
									if(this.flArr[i].id == this.reArr[this.i].id){
										this.flArr[i] = this.reArr[this.i]
										break
									}
								}
							}else{
								this.flArr[this.i].commentCount++
								this.flArr[this.i].commentText = ''
								if(this.flArr[this.i].articleCommentResponseDtos == null){
									this.flArr[this.i].articleCommentResponseDtos = []
								}
								this.flArr[this.i].articleCommentResponseDtos.push(articleCommentResponseDto)
								for(let i=0; i<this.reArr.length; i++){
									if(this.reArr[i].id == this.flArr[this.i].id){
										this.reArr[i] = this.flArr[this.i]
										break
									}
								}
							}
						}
						else if(res.data.code == 401){
							this.$to401()
						}
						else{
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
				uni.hideTabBar()
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
				uni.showTabBar()
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
										for(let i=0; i<this.reArr.length; i++){
											if(this.reArr[i].id==articleId){
												this.reArr[i].articleVoteDto = res.data.data
												break
											}
										}
										for(let i=0; i<this.flArr.length; i++){
											if(this.flArr[i].id==articleId){
												this.flArr[i].articleVoteDto = res.data.data
												break
											}
										}
									}
							    },
								fail: (err) => {
									uni.hideLoading()
								}
							});
						}
						else if(res.data.code == 401){
							this.$to401()
						}
						else{
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
			
			showShare(shareImg,articleId,customerType,content,title){
				uni.hideTabBar()
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
			hideShare(){
				this.shareShow = 'hide';
				setTimeout(() => {
					this.shareShow = 'none';
					uni.showTabBar()
				}, 200);
			},
			toRelease(){
				this.hideExtend()
				if(!this.login){
					this.$to401()
					return false
				}
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/release/release"
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./studyEnjoy.scss";
</style>
