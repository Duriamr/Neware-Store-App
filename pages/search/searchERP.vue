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
					<input v-model="searchText" focus :placeholder="placeholder" confirm-type="search" :adjust-position='false'  @confirm="searchStart">
					<image class="cancel" src="/static/studyEnjoy/cancel.png" v-if='cancelShow' @touchend.prevent="cancel" />
				</view>
				<view class="searchBtn" @tap.stop="searchStart">搜索</view>
			</view>
		</view>
		<!-- 头部占位 -->
		<view class="header_placeholder"></view>
		
		
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
		
		<view class="myERP_ul" v-if="searchShow">
			<empty marginTop="15vh" src="/static/expect/not_Search.png" text="没有找到相关结果" v-if="searchArr.length <= 0" />
			<erpItem class="erpItem" v-for="(item,index) in searchArr" :key="index" 
			:item="item" 
			:index="index" />
		</view>
		
	</view>
</template>

<script>
	import erpItem from '@/components/nw-erp-item/nw-erp-item';
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {erpItem,empty},
		data() {
			return {
				token:"",
				
				placeholder:"",
				cancelShow:false,
				
				
				historyList:uni.getStorageSync('searchERP_cache'),
				
				searchText:"",
				searchShow:false,
				searchArr:[],
				
			};
		},
		onShow() {
			this.token = uni.getStorageSync('token');
		},
		watch:{
			searchText(val){
				if(val.length > 0 ){
					this.cancelShow = true
				}else{
					this.cancelShow = false
					this.searchShow = false
					this.searchArr = []
				}
			},
		},
		methods:{
			setHistoryList(){
				if(typeof(this.searchText)=='object'){
					this.searchText = JSON.stringify(this.searchText).replace('[','').replace('"','').replace('"','').replace(']','')
				}
				uni.getStorage({
					key:'searchERP_cache',
					success:(res)=>{
						let list = res.data;
						for(let i=0; i<list.length; i++){
							if(list[i] == this.searchText){
								list.splice(i,1)
								list.unshift(this.searchText);
								this.historyList = list;
								uni.setStorageSync('searchERP_cache', this.historyList);
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
						uni.setStorageSync('searchERP_cache', this.historyList);
					},
					fail:()=> {
						this.historyList = [];
						this.historyList.push(this.searchText);
						uni.setStorageSync('searchERP_cache', this.historyList);
					}
				})
			},
			cancel(){
				this.searchShow = false
				this.searchText = ''
				this.searchArr = []
			},
			searchStart(){
				if(this.searchText==''||this.searchText==null||this.searchText==undefined){
					uni.showToast({title: '请输入关键字',icon: 'none',});
					return false
					// this.searchText = this.placeholder
				}
				uni.showLoading({
					title: '正在搜索'
				})
				uni.request({
				    url: this.$url+'/api/ordererp/ordererp', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"page": 1,
						"pageSize": 999,
						"key": this.searchText,
						"qryStatus": null,
					},
					method: "POST",
					
				    success: (res) => {
						uni.hideLoading();
						uni.hideKeyboard()
						if(res.data.success&&res.data.code == 200){
							this.searchArr = JSON.parse(res.data.data).data.data
							this.searchShow = true
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
						uni.hideLoading();
						uni.hideKeyboard()
						this.$requestFail()
					}
				});
				setTimeout(() => {
					this.setHistoryList()
				},300)
			},
			
			clickItem(item){
				this.searchText = item;
				this.searchStart();
			},
			
			delHistory(){
				this.historyList = [];
				uni.setStorageSync('searchERP_cache', []);
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
			
		},	
	}
</script>

<style lang="scss">
	@import "./search.scss";
	page{
		background: #F5F5F5;
	}
	.myERP_ul{
		width: 100%;
		box-sizing: border-box;
		padding: 0 16upx;
	}
	.erpItem{
		&:first-of-type{
			margin-top: 20upx;
		}
	}
</style>
