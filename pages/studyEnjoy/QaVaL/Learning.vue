<template>
	<view class="QaVaL_content">
		<view class="search_content">
			<uni-search-bar class="search" :radius="100" bgColor="rgba(245,245,245,1)" @confirm="searchStart()" @focus="focus" @input="input" @cancel="cancel()"></uni-search-bar>
		</view>
		
		<view class="label label_Learning" v-if="!learningSearchShow">
			<scroll-view class="scroll" :scroll-x="true" scroll-left="0">
				<view class="label_list" :class="learningIndex == item ? 'active' : ''" v-for="(item, index) in learningType" :key="'learningType'+index" @tap="tabLearningIndex(item)">
					{{item}}
				</view>
			</scroll-view>
		</view>
		
		<view v-if="!learningSearchShow">
			<nw-article-top v-for="(item, index) in learningTop" :key="'learningTop'+index" :item="item" />

			<nw-article-item v-for="(item, index) in learning" :key="'learning'+index" :item="item" />
			
			<view class="baseline">
				-&#8197; 我是有底线的&#8197; -
			</view>
		</view>
		
		<view v-if="learningSearchShow">
			<nw-article-item v-for="(item, index) in learningSearch" :key="'learningSearch'+index" :item="item" />
		</view>
		
		<!-- #ifdef H5 -->
		<h5Footer :salserNo='salserNo' />
		<!-- #endif -->   
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar';
	import nwArticleTop from '@/components/nw-article/nw-article-top';
	import nwArticleItem from '@/components/nw-article/nw-article-item';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default {
		components: {
			uniSearchBar,
			nwArticleTop,
			nwArticleItem,
			h5Footer
		},
		data() {
			return {
				salserNo:'',
				learning:[],
				learningTop:[],
				learningTopImageUrl:'',
				learningType:[],
				learningIndex:'',
				learningIndexOne:'推荐',
				learningSearch:[],
				learningSearchText:'',
				learningSearchShow:false,
			};
		},
		onLoad(option) {
			if(option.salserNo){
				this.salserNo = option.salserNo
			}
			this.getLearningType();
			this.getTopImage();
		},
		onShow() {
			this.getLearning(this.learningIndex,'',0);
		},
		watch:{
			learningIndex:function(val){
				this.getLearning(val,'',0);
			}
		},
		methods:{
			focus(e){
				this.learningSearchShow = true
			},
			input(e){
				this.learningSearchText = e.value
			},
			searchStart(){
				if (this.learningSearchText == ''){
					uni.showToast({
						title: '请输入关键字',
						icon: 'none',
						duration: 1000
					});
				}else{
					uni.showLoading({
						title: '正在搜索'
					})
					this.getLearning(this.learningIndexOne,this.learningSearchText,1);
				}
			},
			cancel(){
				this.learningSearchText = '';
				this.learningSearch = [];
				this.learningSearchShow = false;
			},
			
			getLearningType(){
				uni.request({
				    url: this.$url+'/api/articlev2/equipmentlearninglabel', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.learningType = res.data.data
							this.learningIndex = res.data.data[0]
							this.learningIndexOne = res.data.data[0]
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			tabLearningIndex(index){
				this.learningIndex = index
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
						if(Search){
							uni.hideLoading();
						}
						if(res.data.success&&res.data.code == 200){
							if(!Search){
								this.learning = res.data.data.items
								this.learningTop = []
								this.learningTop.push(res.data.data.items[0])
								this.learning.shift()
							}else if(Search){
								this.learningSearch = res.data.data.items
								this.learningSearchShow = true
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
							this.learningTopImageUrl = res.data.data.learningTopImageUrl[0]
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
