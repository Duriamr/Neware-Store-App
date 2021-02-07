<template>
	<view class="QaVaL_content">
		<view class="QaV_header" @touchmove.stop.prevent>
			<view class="status"></view>
			<view class="header">
				<image class="back" src="/static/public/back/back_black.png" mode="widthFix" @tap="$back" />
				<view class="header_list" :class="headerIndex == 0 ? 'active' : ''" @tap="tabHeader(0)">
					基础解答
				</view>
				<view class="header_list" :class="headerIndex == 1 ? 'active' : ''" @tap="tabHeader(1)">
					设备解说
				</view>
			</view>
		</view>
		<view class="header_placeholder"></view>
		
		<view v-if="!headerIndex">
			<view class="search_content">
				<uni-search-bar class="search" :radius="100" bgColor="rgba(245,245,245,1)" @confirm="searchStart(0)" @focus="focus(0,$event)" @input="input(0,$event)" @cancel="cancel(0)"></uni-search-bar>
			</view>
			
			<view class="label label_QaV" v-if="!qaSearchShow">
				<scroll-view class="scroll" :scroll-x="true" scroll-left="0">
					<view class="label_list" :class="qaIndex == index ? 'active' : ''" v-for="(item, index) in qaType" :key="'qaType'+index" @tap="tabQaIndex(index)">
						{{item.value}}
					</view>
				</scroll-view>
			</view>
			
			<view class="content" v-if="!qaSearchShow">
				<uni-collapse v-for="(item, index) in qa" :key="'qa'+index">
				    <uni-collapse-item :title="item.lable+' '+item.question" showAnimation>
						<view class="A_text">{{item.answer}}</view>
				    </uni-collapse-item>
				</uni-collapse>
				<view class="baseline">
					-&#8197; 我是有底线的&#8197; -
				</view>
			</view>
			
			<view class="content" v-if="qaSearchShow">
				<uni-collapse v-for="(item, index) in qaSearch" :key="'qaSearch'+index">
				    <uni-collapse-item :title="item.lable+' '+item.question" showAnimation>
						<view class="A_text">{{item.answer}}</view>
				    </uni-collapse-item>
				</uni-collapse>
			</view>
		</view>
		
		<view v-if="headerIndex">
			<view class="search_content">
				<uni-search-bar class="search" :radius="100" bgColor="rgba(245,245,245,1)" @confirm="searchStart(1)" @focus="focus(1,$event)" @input="input(1,$event)" @cancel="cancel(1)"></uni-search-bar>
			</view>
			
			<view class="label label_QaV" v-if="!videoSearchShow">
				<scroll-view class="scroll" :scroll-x="true" scroll-left="0">
					<view class="label_list" :class="videoIndex == item ? 'active' : ''" v-for="(item, index) in videoType" :key="'videoType'+index" @tap="tabVideoIndex(item)">
						{{item}}
					</view>
				</scroll-view>
			</view>
			
			<view v-if="!videoSearchShow">
				<nw-article-top v-for="(item, index) in videoTop" :key="'videoTop'+index" :item="item" />

				<nw-article-item v-for="(item, index) in video" :key="'video'+index" :item="item" />

				<view class="baseline">
					-&#8197; 我是有底线的&#8197; -
				</view>
			</view>
			
			<view v-if="videoSearchShow">
				<nw-article-item v-for="(item, index) in videoSearch" :key="'videoSearch'+index" :item="item" />
			</view>
		</view>
		
		<!-- #ifdef H5 -->
		<h5Footer :salserNo='salserNo' />
		<!-- #endif -->   
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar';
	import uniCollapse from '@/components/uni-collapse/uni-collapse';
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item';
	import nwArticleTop from '@/components/nw-article/nw-article-top';
	import nwArticleItem from '@/components/nw-article/nw-article-item';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default {
		components: {
			uniSearchBar,
			uniCollapse,
			uniCollapseItem,
			nwArticleTop,
			nwArticleItem,
			h5Footer
		},
		data() {
			return {
				salserNo:'',
				headerIndex:0,
				
				qa:[],
				qaType:[],
				qaIndex:NaN,
				qaSearch:[],
				qaSearchText:'',
				qaSearchShow:false,
				
				video:[],
				videoTop:[],
				videoTopImageUrl:'',
				videoType:[],
				videoIndex:'',
				videoIndexOne:'默认排序',
				videoSearch:[],
				videoSearchText:'',
				videoSearchShow:false,
			};
		},
		onLoad(option) {
			if(option.salserNo){
				this.salserNo = option.salserNo
			}
			this.headerIndex = parseInt(option.index)
			
			this.getQaType();
			this.getVideoType();
			this.getTopImage();
		},
		onShow() {
			this.getVideo(this.videoIndex,'',0);
		},
		watch:{
			qaIndex:function(val){
				this.getQa(val,'',0);
			},
			videoIndex:function(val){
				this.getVideo(val,'',0);
			}
		},
		methods:{
			tabHeader(index){
				this.headerIndex = index
			},
			focus(type,e){
				if(!type){
					this.qaSearchShow = true
				}else if(type){
					this.videoSearchShow = true
				}
			},
			input(type,e){
				if(!type){
					this.qaSearchText = e.value
				}else if(type){
					this.videoSearchText = e.value
				}
			},
			searchStart(type){
				if(!type){
					if (this.qaSearchText == '') {
						uni.showToast({
							title: '请输入关键字',
							icon: 'none',
							duration: 1000
						});
					}else{
						uni.showLoading({
							title: '正在搜索'
						})
						this.getQa(null,this.qaSearchText,1);
					}
				}else if(type){
					if (this.videoSearchText == '') {
						uni.showToast({
							title: '请输入关键字',
							icon: 'none',
							duration: 1000
						});
					}else{
						uni.showLoading({
							title: '正在搜索'
						})
						this.getVideo(this.videoIndexOne,this.videoSearchText,1);
					}
				}
			},
			cancel(type){
				if(!type){
					this.qaSearchText = '';
					this.qaSearch = [];
					this.qaSearchShow = false;
				}else if(type){
					this.videoSearchText = '';
					this.videoSearch = [];
					this.videoSearchShow = false;
				}
			},
			
			getQaType(){
				uni.request({
				    url: this.$url+'/api/equipmentmanual/equipmentqatype', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.qaType = res.data.data
							this.qaIndex = 0
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			tabQaIndex(index){
				this.qaIndex = index
			},
			getQa(type, keyWord,Search){
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
						if(Search){
							uni.hideLoading();
						}
						if(res.data.success&&res.data.code == 200){
							if(!Search){
								this.qa = res.data.data.items
							}else if(Search){
								this.qaSearch = res.data.data.items
								this.qaSearchShow = true
							}
						}
				    },
					fail: (err) => {
						if(Search){
							uni.hideLoading();
						}
						this.$requestFail()
					}
				});
			},
			
			getVideoType(){
				uni.request({
				    url: this.$url+'/api/articlev2/equipmentvideolabel', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.videoType = res.data.data
							this.videoIndex = res.data.data[0]
							this.videoIndexOne = res.data.data[0]
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			tabVideoIndex(index){
				this.videoIndex = index
			},
			getVideo(type, keyWord,Search){
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
						if(Search){
							uni.hideLoading();
						}
						if(res.data.success&&res.data.code == 200){
							if(!Search){
								this.video = res.data.data.items
								this.videoTop = []
								this.videoTop.push(res.data.data.items[0])
								this.video.shift()
							}else if(Search){
								this.videoSearch = res.data.data.items
								this.videoSearchShow = true
							}
						}
				    },
					fail: (err) => {
						if(Search){
							uni.hideLoading();
						}
						this.$requestFail()
					}
				});
			},
			getTopImage(){
				uni.request({
				    url: this.$url+'/api/articlev2/topimage', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.videoTopImageUrl = res.data.data.videoTopImageUrls[0]
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			toArticle(id){
				uni.navigateTo({
					url:"/pages/studyEnjoy/article/article?id="+id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "./QaVaL.scss";
</style>
