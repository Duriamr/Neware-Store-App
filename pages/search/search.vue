<template>
	<view class="search_content">
		<view class="search_header">
			<view class="status"></view>
			<view class="header">
				<image class="back" src="/static/goods/back_black.png" @tap.stop="$back"></image>
				<view class="input">
					<!-- #ifdef APP-PLUS -->  
					<image class="voice" src="/static/search/voice.png" @tap.stop="startRecognize" />
					<!-- #endif --> 
					<!-- #ifndef APP-PLUS -->  
					<image class="voice" src="/static/search/search.png" />
					<!-- #endif --> 
					<input v-model="searchText" focus  :placeholder="placeholder" confirm-type="search" :adjust-position='false'  @confirm="searchStart">
					<image class="cancel" src="/static/studyEnjoy/cancel.png" v-if='cancelShow' @touchend.prevent="cancel" />
				</view>
				<view class="searchBtn" @tap.stop="searchStart">搜索</view>
			</view>
		</view>
		<!-- 头部占位 -->
		<view class="header_placeholder"></view>
		
		
		<view class="tab_ul" v-if="searchShow">
			<view class="tab_list" :class="tabIndex==index?'active':''" v-for="(item, index) in tabList" :key="'tabList'+index" @tap.stop="tab(index)">
				{{item.value}}
			</view>
		</view>
		<view class="tabList_placeholder" v-if="searchShow"></view>
		
		<view class="history" v-if="historyList.length > 0 && !searchShow">
			<view class="modular_title">
				<view class="title">
					搜索记录
				</view>
				<image src="/static/search/delete.png" @tap.stop="delHistory" />
			</view>
			
			<view class="history_ul">
				<view class="history_list" v-for="(item, index) in historyList" :key="'history'+index" @tap.stop="clickItem(item)">
					{{item}}
				</view>
			</view>
		</view>
		
		<view class="hot" v-if="hotList.length > 0 && !searchShow">
			<view class="modular_title">
				<view class="title">
					热门搜索
				</view>
				<image src="/static/search/fire.png" />
			</view>
			
			<view class="hot_ul">
				<view class="hot_list" v-for="(item, index) in hotList" :key="'hotList'+index" @tap.stop="clickItem(item.value)">
					<text :class="index%2 == 0 ? 'text0' : 'text1'">{{item.value}}</text>
					<image src="/static/search/hot.png" mode="widthFix" v-if="item.hot" />
				</view>
				<view class="hot_list" v-for="(item, index) in hotList2||[]" :key="'hotList2'+index" @tap.stop="clickItem(item.value)">
					<text :class="index%2 == 0 ? 'text0' : 'text1'">{{item.value}}</text>
					<image src="/static/search/hot.png" mode="widthFix" v-if="item.hot" />
				</view>
			</view>
		</view>
		
		<swiper :current="tabIndex" class="swiper"  duration="600" @change="swiperChange" v-if="searchShow">
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
					<view class="search_ul" v-if="tabIndex==0">
						<empty marginTop="272upx" src="/static/expect/not_Search.png" text="没有找到相关结果" v-if="emptyShow" />
						
						<view class="module_content" v-if="searchGoods.length > 0">
							<view class="header">
								商品
							</view>
							<nw-goods-search v-for="(item, index) in searchGoods" :key="'searchGoods'+index" :item="item" />
							<view class="footer" @tap.stop="tab(1)">
								<view class="left">
									<image src="/static/search/search_y.png" />
									<text>查看更多商品</text>
								</view>
								<image src="/static/public/go_yellow.png" />
							</view>
						</view>
						
						<view class="module_content" v-if="searchVideo.length > 0">
							<view class="header">
								设备解说
							</view>
							<nw-article-item v-for="(item, index) in searchVideo" :key="'searchVideo'+index" :item="item" />
							<view class="footer" @tap.stop="tab(2)">
								<view class="left">
									<image src="/static/search/search_y.png" />
									<text>查看更多设备解说</text>
								</view>
								<image src="/static/public/go_yellow.png" />
							</view>
						</view>
						
						<view class="module_content" v-if="searchLearning.length > 0">
							<view class="header">
								学术博览
							</view>
							<nw-article-item v-for="(item, index) in searchLearning" :key="'searchLearning'+index" :item="item" />
							<view class="footer" @tap.stop="tab(3)">
								<view class="left">
									<image src="/static/search/search_y.png" />
									<text>查看更多学术博览</text>
								</view>
								<image src="/static/public/go_yellow.png" />
							</view>
						</view>
						
						<view class="module_content" v-if="searchQA&&searchQA.length > 0">
							<view class="header">
								基础解答
							</view>
							<view class="content" style="padding-top: 20upx;">
								<uni-collapse v-for="(item, index) in searchQA" :key="'searchQA'+index">
									<uni-collapse-item :title="item.lable+' '+item.question" showAnimation>
										<view class="A_text">{{item.answer}}</view>
									</uni-collapse-item>
								</uni-collapse>
							</view>
							<view class="footer" style="border-top: 1upx solid #F5F5F5;" @tap.stop="tab(4)">
								<view class="left">
									<image src="/static/search/search_y.png" />
									<text>查看更多基础解答</text>
								</view>
								<image src="/static/public/go_yellow.png" />
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
					<view class="search_ul"  v-if="tabIndex==1">
						<empty marginTop="272upx" src="/static/expect/not_Search.png" text="没有找到相关结果" v-if="!goodsList.length" />
						<nw-goods-search v-for="(item, index) in goodsList" :key="'goodsList'+index" :item="item" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
					<view class="search_ul"  v-if="tabIndex==2">
						<empty marginTop="272upx" src="/static/expect/not_Search.png" text="没有找到相关结果" v-if="!video.length" />
						
						<nw-article-item v-for="(item, index) in video" :key="'video'+index" :item="item" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
					<view class="search_ul"  v-if="tabIndex==3">
						<empty marginTop="272upx" src="/static/expect/not_Search.png" text="没有找到相关结果" v-if="!learning.length" />
						
						<nw-article-item v-for="(item, index) in learning" :key="'learning'+index" :item="item" />
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
					<view class="search_ul"  v-if="tabIndex==4">
						<empty marginTop="272upx" src="/static/expect/not_Search.png" text="没有找到相关结果" v-if="!qa || qa.length <= 0" />
						
						<view class="content" v-if="qa.length" style="padding-top: 20upx;">
							<uni-collapse v-for="(item, index) in qa" :key="'qa'+index">
								<uni-collapse-item :title="item.lable+' '+item.question" showAnimation>
									<view class="A_text">{{item.answer}}</view>
								</uni-collapse-item>
							</uni-collapse>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse';
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item';
	import nwGoodsSearch from '@/components/nw-goods/nw-goods-search';
	import nwArticleItem from '@/components/nw-article/nw-article-item';
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			nwGoodsSearch,
			nwArticleItem,
			empty
		},
		data() {
			return {
				oid : uni.getStorageSync('onlyID'),
				
				idx:0,
				placeholder:"",
				cancelShow:false,
				
				tabList:[],
				tabIndex:0,
				
				hotList:[],
				hotList2:[],
				historyList:uni.getStorageSync('search_cache'),
				
				searchText:"",
				searchShow:false,
				
				searchQA:[],
				searchVideo:[],
				searchLearning:[],
				searchGoods:[],
				emptyShow:false,
				qa:[],
				video:[],
				learning:[],
				goodsList:[],
				
				focus:false
			};
		},
		onLoad(options) {
			// this.focus = false
			// setTimeout(()=>{
			// 	this.focus = true
			// },1000)
			this.getTabList()
			this.getHotList();
			this.getPlaceholder();
			if(options.type=='auto'){
				this.searchText = options.text
				this.searchStart()
			}
		},
		watch:{
			searchText(val){
				if(val.length > 0 ){
					this.cancelShow = true
				}else{
					this.cancelShow = false
					this.searchShow = false
					this.searchQA = []
					this.searchVideo = []
					this.searchLearning = []
					this.searchGoods = []
					this.qa = []
					this.video = []
					this.learning = []
					this.goodsList = []
				}
			},
			searchQA:function(val){
				if(val == null){
					this.searchQA = []
				}
				if(!this.searchQA.length&&!this.searchVideo.length&&!this.searchLearning.length&&!this.searchGoods.length){
					this.emptyShow = true
				}else{
					this.emptyShow = false
				}
			},
			searchVideo:function(val){
				if(val == null){
					this.searchVideo = []
				}
				if(!this.searchQA.length&&!this.searchVideo.length&&!this.searchLearning.length&&!this.searchGoods.length){
					this.emptyShow = true
				}else{
					this.emptyShow = false
				}
			},
			searchLearning:function(val){
				if(val == null){
					this.searchLearning = []
				}
				if(!this.searchQA.length&&!this.searchVideo.length&&!this.searchLearning.length&&!this.searchGoods.length){
					this.emptyShow = true
				}else{
					this.emptyShow = false
				}
			},
			searchGoods:function(val){
				if(val == null){
					this.searchGoods = []
				}
				if(!this.searchQA &&!this.searchQA.length&&!this.searchVideo.length&&!this.searchLearning.length&&!this.searchGoods.length){
					this.emptyShow = true
				}else{
					this.emptyShow = false
				}
			},
		},
		methods:{
			swiperChange(e){
				this.tabIndex = e.target.current;
			},
			tab(key){
				this.tabIndex = key
			},
			getTabList(){
				uni.request({
				    url: this.$url+'/api/articlev2/articlesearchtype', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							// this.tabList = res.data.data;
							let tabList = [{
								value:"全部"
							},
							{
								value:"商品"
							},
							{
								value:"设备解说"
							},
							{
								value:"学术博览"
							},
							{
								value:"基础解答"
							}]
							this.tabList = tabList
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getHotList(){
				uni.request({
				    url: this.$url+'/api/articlev2/hotwords?type=0', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.hotList = res.data.data
						}
				    }
				});
				uni.request({
				    url: this.$url+'/api/articlev2/hotwords?type=1', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.hotList2 = res.data.data||[]
						}
				    }
				});
			},
			setHistoryList(){
				if(typeof(this.searchText)=='object'){
					this.searchText = JSON.stringify(this.searchText).replace('[','').replace('"','').replace('"','').replace(']','')
				}
				uni.getStorage({
					key:'search_cache',
					success:(res)=>{
						let list = res.data;
						for(let i=0; i<list.length; i++){
							if(list[i] == this.searchText){
								list.splice(i,1)
								list.unshift(this.searchText);
								this.historyList = list;
								uni.setStorageSync('search_cache', this.historyList);
								return false
							}
						}
						if(list.length > 7){
							list.pop();
							list.unshift(this.searchText);
						}else{
							list.unshift(this.searchText);
						}
						this.historyList = list;
						uni.setStorageSync('search_cache', this.historyList);
					},
					fail:()=> {
						this.historyList = [];
						this.historyList.push(this.searchText);
						uni.setStorageSync('search_cache', this.historyList);
					}
				})
			},
			getPlaceholder(){
				uni.request({
				    url: this.$url+'/api/tag/default', 
					method: "GET",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.placeholder = res.data.data;
						}
				    }
				});
			},
			cancel(){
				this.searchShow = false
				this.searchText = ''
				this.searchQA = []
				this.searchVideo = []
				this.searchLearning = []
				this.searchGoods = []
				this.qa = []
				this.video = []
				this.learning = []
				this.goodsList = []
			},
			searchStart(){
				if(this.searchText==''||this.searchText==null||this.searchText==undefined){
					// uni.showToast({title: '请输入关键字',icon: 'none',});
					// return false
					this.searchText = this.placeholder
				}
				uni.showLoading({
					title: '正在搜索'
				})
				uni.request({
				    url: this.$url+'/api/articlev2/articlesearch', 
					method: "POST",
					data:{
						"articleSearchType": 0,
						"keyWord": this.searchText,
						"isHome":true
					},
					
				    success: (res) => {
						uni.hideLoading();
						uni.hideKeyboard()
						if(res.data.success&&res.data.code == 200){
							this.searchQA = res.data.data.equipmentQADtos||[]
							this.searchVideo = res.data.data.articleShortVideoDtos
							this.searchLearning = res.data.data.articleShortLearningDtos
							this.searchShow = true
						}
				    },
					fail: (err) => {
						uni.hideLoading();
						uni.hideKeyboard()
						this.$requestFail()
					}
				});
				this.getGoods(this.searchText)
				this.getQa(null,this.searchText);
				this.getVideo('默认排序',this.searchText);
				this.getLearning('推荐',this.searchText);
				setTimeout(() => {
					this.setHistoryList()
				},300)
			},
			getQa(type, keyWord){
				uni.request({
				    url: this.$url+'/api/equipmentmanual/equipmentaq', 
					method: "POST",
					data:{
						"questionType": type,
						"keyWord": keyWord,
						"pageIndex": 1,
						"pageSize": 999
					},
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.qa = res.data.data.items
						}
				    }
				});
			},
			getVideo(type, keyWord){
				uni.request({
				    url: this.$url+'/api/articlev2/equipmentvideo', 
					method: "POST",
					data:{
						"label": type,
						"keyWord": keyWord,
						"pageIndex": 1,
						"pageSize": 999
					},
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.video = res.data.data.items
						}
				    }
				});
			},
			getLearning(type, keyWord,Search){
				uni.request({
				    url: this.$url+'/api/articlev2/learning', 
					method: "POST",
					data:{
						"label": type,
						"keyWord": keyWord,
						"pageIndex": 1,
						"pageSize": 999
					},
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.learning = res.data.data.items
						}
				    }
				});
			},
			getGoods(keyWord){
				uni.request({
				    url: this.$url+'/api/product/search?tagName='+keyWord+'&pageIndex=1&pageSize=50&userId='+this.oid, 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.searchGoods = []
							let len = res.data.data.length
							if(len==1){
								this.searchGoods = res.data.data
							}else if(len==2||len==3){
								for(let i=0;i<len;i++){
									this.searchGoods.push(res.data.data[i])
								}
							}else if(len>3){
								for(let i=0;i<3;i++){
									this.searchGoods.push(res.data.data[i])
								}
							}
							this.goodsList = res.data.data
						}
				    }
				});
			},
			
			clickItem(item){
				this.searchText = item;
				this.searchStart();
			},
			delHistory(){
				this.historyList = [];
				uni.setStorageSync('search_cache', []);
			},
			
			//  语音搜索
			startRecognize(){
				this.searchText = ''
				let options = {};
				options.engine = 'baidu';  //讯飞:iFly,百度:'baidu'
				options.punctuation = false; // 是否需要标点符号 
				options.timeout = 10 * 1000;
				plus.speech.startRecognize(options,(text)=>{
					this.searchText = text;
					if(this.searchText){
						this.searchStart();
					}
				});
			},
			
			toArticle(id){
				uni.navigateTo({
					url:"/pages/studyEnjoy/article/article?id="+id
				})
			},
		},	
	}
</script>

<style lang="scss">
	@import "./search.scss";
</style>
