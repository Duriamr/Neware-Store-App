<template>
	<view class="home_content" :style="{backgroundColor:bgColor}">
		<!-- 头部 -->
		<view class="home_header">
			<view class="status" :style="{backgroundColor:titleNViewBackground}"></view>
			<view class="header" :style="{backgroundColor:titleNViewBackground}">
				<image class="logo" src="/static/home/logo.gif" mode="widthFix" />
				<view class="searchIpt" @tap="toSearch">
					<image class="search" src="/static/search/search.png" />
					<text>{{search}}</text>
				</view>
				<view class="message">
					<image src="/static/public/message/message.png" @tap.stop="toNotice" />
					<view class="badge" v-if="$store.state.messageLen>0&&$store.state.messageLen<99">
						{{$store.state.messageLen}}
					</view>
					<view class="badge" v-if="$store.state.messageLen>99">
						99+
					</view>
				</view>
				<!-- #ifndef H5-->    
				<view class="message">
					<image src="/static/public/qrcode.png" @tap.stop="$scanCode" />
					
				</view>
				<!-- #endif -->   
			</view>
		</view>
		<!-- 头部占位 -->
		<view class="header_placeholder"></view>
		<!-- 轮播区 -->
		<view class="banner_content" :style="{backgroundColor:titleNViewBackground}">
			<swiper class="banner" :autoplay="autoOff" :duration="500" :circular="true" @change="swiperChange">
				<swiper-item v-for="(item, index) in bannerList" :key="index" @tap.stop="toPath(item)">
					<image class="banner_img" :src="item.url"/>
				</swiper-item>
			</swiper>
			<view class="dots">
				<block v-for="(item,index) in bannerList" :key="index">
					<view class="dot" :class="index == swiperCurrent ? ' active' : ''"></view>
				</block>
			</view>
		</view>
		<!--主体 -->
		<view class="main_content">
			<!-- 金刚区 -->
			<view class="kingkong">
				<uni-grid :column="5" :show-border="false" :square="true">
					<uni-grid-item class="kingkong_list" v-for="(item, index) in kingkongList" :key="index" >
						<image :src="item.imgUrl" @tap="toKingkongPage(item)"/>
						<text @tap="toKingkongPage(item)">{{item.name}}</text>
					</uni-grid-item>
				</uni-grid>
			</view>
			<!-- 通告 -->
			<view class="bulletin" v-if="bulletinList.length > 0">
				<view class="left">
					<image src="/static/home/bulletin.png" mode="widthFix" />
					<swiper class="banner" :autoplay="true" :duration="1000" :circular="true" :vertical="true">
						<swiper-item class="banner_list" v-for="(item, index) in bulletinList" :key="index" @touchmove.stop>
							<text>{{item.content}}</text>
							<text class="right" @tap.stop="$toPath(item.url)" v-if="item.url">查看更多</text>
						</swiper-item>
					</swiper>
				</view>
				<!-- <view class="right">
					查看更多
				</view> -->
			</view>
			<!-- 异形 -->
			<view class="activity"  v-if="activity.length > 0">
				<image v-for="(item, index) in activity" :key="index" :src="item.url" mode="widthFix" @tap.stop="toPath(item)"/>
			</view>
			
			<!-- 瓷片区 -->
			<view class="porcelain" v-if="porcelainList.length > 0">
				<view class="top">
					<view class="porcelain_list" v-for="(item, index) in porcelainList" :key="'por'+index" v-if="index<2" @tap.stop="$toPath(item.linkUrl)">
						<view class="list_top">
							<view class="title">{{item.title}}</view>
							<view class="subTitle">{{item.label}}</view>
						</view>
						<view class="list_bot">
							<view class="bot_list" v-for="(item2, index2) in item.porcelainAreaProduct" :key="'item2'+index+index2" v-if="index2<2">
								<image :src="item2.productImageUrl" />
								<text>{{item2.name}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="mid">
					<view class="porcelain_list" v-for="(item, index) in porcelainList" :key="'por'+index" v-if="index>=2&&index<6" @tap.stop="$toPath(item.linkUrl)">
						<view class="title">{{item.title}}</view>
						<view class="list_bot" v-for="(item2, index2) in item.porcelainAreaProduct" :key="'item2'+index+index2" v-if="index2<1">
							<image :src="item2.productImageUrl" />
							<text>{{item2.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="porcelain_bot">
				<view class="left">
					<view class="title">人气推荐</view>
					<view class="subTitle">大家都在看</view>
				</view>
				<view class="right">
					<image :src="item.imgUrl" v-for="(item, index) in hotList" :key="'hot'+index" v-if="index<4" @tap.stop="$toGoods(item.id)" />
				</view>
			</view>
			
			<!-- 新鲜好物区 -->
			<!-- <view class="fresh" v-if="freshList.length > 0">
				<view class="hgroup">
					<text class="hgroup_left">新鲜好物</text>
				</view>
				<view class="main">
					<scroll-view class="scroll" :scroll-x="true" scroll-left="0">
						<view class="fresh_list" v-for="(item, index) in freshList" :key="index" @tap="$toGoods(item.id)">
							<view class="fresh_item">
								<image :src="item.imgUrl"/>
								<text class="title">{{item.productName}}</text>
								<view class="bot">
									<text class="currency">￥</text>
									<text class="price">{{item.salePrice}}</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view> -->
		</view>
		
		<guess />
		<noLogin v-if="noLoginShow" />
		<image v-if="questID" class="floatImg" src="/static/home/quest.gif" mode="widthFix" @tap.stop="toQuest"/>
		
		<view class="mask" @touchmove.stop.prevent @tap.stop.prevent v-if="maskShow">
			<view class="upgrade" v-if="upgradeShow&&!activityShow">
				<image src="/static/home/upgrade.png" mode="widthFix" />
				<view class="header">
					<text class="title">发现新版本</text>
					<text class="version">V{{version}}</text>
				</view>
				<text class="content">{{verlog}}</text>
				<view class="btn" @tap.stop="downNASA">
					立即升级
				</view>
			</view>
			<image class="x" src="/static/x.png" @tap.stop="hideMask" v-if="upgradeShow&&!isCompel&&!activityShow" />
			
			
			<image class="activity" :src="maskImg" mode="widthFix" @tap.stop="toMaskPath(maskLink)" v-if="activityShow&&!upgradeShow" />
			<image class="x" src="/static/x.png" @tap.stop="hideMask" v-if="activityShow&&!upgradeShow"/>
		</view>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid";
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item";
	import guess from '@/components/nw-guess/nw-guess';
	import noLogin from '@/components/nw-noLogin/nw-noLogin';
	export default {
		components: {uniGrid,uniGridItem,guess,noLogin},
		data() {
			return {
				token:uni.getStorageSync('token'),
				bgColor:"#F5F5F5",//背景色
				
				//导航栏
				titleNViewBackground: "",//导航栏颜色
				autoOff:true,//轮播图开关
				swiperCurrent: 0,//轮播点
				search:"",//搜索关键词
				
				//数据
				bannerList: [],//轮播图
				kingkongList: [],//金刚区
				bulletinList: [],//快报
				activity:[],//活动banner
				porcelainList:[],//瓷片区
				hotList:[],//人气推荐区
				freshList:[],//新鲜好物区
				
				cartBadge:"",//购物车Badge
				
				noLoginShow:false,//显示立即登录
				
				maskShow:false,
				activityShow:false,
				maskImg:'',
				maskLink:'',
				
				upgradeShow:false,
				versionCode:0,//版本号
				version:"",
				verlog:"",
				isCompel:0,
				
				questID:0,//问卷活动ID
			};
		},
		onLoad() {
			// #ifdef APP-PLUS
			uni.getSystemInfo({
				success: (res) => {
					if(res.platform == 'ios'){
						this.getVsersion(2);
					}else{
						this.getVsersion(1);
					}
				}
			})
			// #endif
		},
		onShow() {
			this.autoOff = true;
			this.token = uni.getStorageSync('token');
			if(this.token!=''&&this.token!=NaN&&this.token!=null&&this.token!=undefined){
				this.noLoginShow = false
			}else{
				this.noLoginShow = true
			}
			// // #ifdef APP-PLUS 
			// setTimeout(() => {
			// 	let args= plus.runtime.arguments;  
			// 	if(args){
			// 		let type = args.split("?")[1].split("&")[0]
			// 		let value = args.split("?")[1].split("&")[1]
			// 		if(type == 'scheme' && this.token == ''){
			// 			uni.setStorageSync('token',value)
			// 			this.token = uni.getStorageSync('token');
			// 		}
			// 	}  
			// },10); 
			// // #endif
			this.getLoadData();
			this.getSearch();
			this.getKingkong();
			this.getBulletin();
			this.getPorcelain();
			this.getHot();
			this.$getCartBadge()
			this.getQuest()
		},
		onHide(){
			this.swiperOff();
		},
		onUnload(){
			this.swiperOff();
		},
		onPageScroll(e){
			this.setAutoOff(e);
		},
		watch:{
			token(val){
				if(val!=''&&val!=NaN&&val!=null&&val!=undefined&&!this.upgradeShow){
					this.getMask()
				}
			}
		},
		methods:{
			//跳转 / banner点击量
			toPath(item){
				if(item.linkUrl.startsWith('/pages/activity/yearSignin/yearSignin')){
					// #ifndef H5
					this.getYearSignin(item.linkUrl)
					// #endif
					return false
				}
				this.$toPath(item.linkUrl)
				uni.request({
					url:this.$url+'/api/home/banner-hits?id='+item.id,
					method:'POST'
				})
			},
			getMask(){
				uni.request({
				    url: this.$url+'/api/app/apppopup', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200&&res.data.data != null&&res.data.data.imageUrl != ''){
							this.maskImg = res.data.data.imageUrl
							this.maskLink = res.data.data.linkUrl
							if(res.data.data.isCache){
								let cache = uni.getStorageSync('maskCache'+res.data.data.id)
								if(cache==''||cache==null||cache==undefined||cache==false){
									this.activityShow = true
									this.showMask()
									uni.setStorageSync('maskCache'+res.data.data.id,'o')
								}
							}else{
								this.activityShow = true
								this.showMask()
								uni.setStorageSync('maskCache'+res.data.data.id,'o')
							}
						}
				    }
				});
			},
			showMask(){
				uni.hideTabBar();
				this.maskShow = true
			},
			hideMask(){
				this.maskShow = false
				this.upgradeShow = false
				this.activityShow = false
				uni.showTabBar()
			},
			toMaskPath(path){
				this.hideMask()
				uni.navigateTo({
					url:path
				})
			},
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/home/banner-multi', 
					method: "GET",
				    
				    success: (res) => {
						console.log(res.data)
						for(let i=0; i<res.data.data.length; i++){
							if(res.data.data[i].region == 1){
								this.titleNViewBackground = res.data.data[i].bannerImg[0].color;
								this.bannerList = res.data.data[i].bannerImg;
								this.bgColor = res.data.data[i].bgColor
							}else if(res.data.data[i].region == 2){
								this.activity[0] = res.data.data[i].bannerImg[0];
							}
						}
						// #ifdef MP 
						uni.setNavigationBarColor({
							frontColor:'#ffffff',
							backgroundColor:this.titleNViewBackground,
						})
						// #endif 
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getSearch(){
				uni.request({
				    url: this.$url+'/api/tag/default', 
					method: "GET",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.search = res.data.data;
						}
				    }
				});
			},
			getKingkong(){
				uni.request({
				    url: this.$url+'/api/home/mainmodule-multi', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.kingkongList = res.data.data
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getBulletin(){
				uni.request({
				    url: this.$url+'/api/notice/multi', 
					method: "GET",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.bulletinList = res.data.data;
						}
				    }
				});
			},
			getPorcelain(){
				uni.request({
				    url: this.$url+'/api/porcelainarea/multiv2', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.porcelainList = res.data.data
						}
				    }
				});
			},
			getHot(){
				uni.request({
				    url: this.$url+'/api/product/peoplerecommend', 
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.hotList = res.data.data
						}
				    }
				});
			},
			getQuest(){
				uni.request({
				    url: this.$url+'/api/questionnaire/questionnaireid', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.questID = res.data.data
						}
				    }
				});
			},
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = e.detail.current;
				this.titleNViewBackground = this.bannerList[index].color;
				// #ifdef MP 
				setTimeout(()=>{
					uni.setNavigationBarColor({
						frontColor:'#ffffff',
						backgroundColor:this.titleNViewBackground,
						animation:{
							duration:500,
							timingFunc:'easeOut'
						}
					})
				},0)
				// #endif 
			},
			setAutoOff(e){
				if(e.scrollTop > 50){
					this.autoOff = false;
				}else{
					this.autoOff = true;
				}
			},
			swiperOff(){
				this.autoOff = false;
			},
			toSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			toKingkongPage(item){
				if(item.url == null || item.url == ''){
					uni.switchTab({
					    url: '/pages/tabBar/sort/sort'
					});
				}else if(item.url.startsWith('sort')){
					uni.setStorage({
					    key: 'left',
					    data: item.url.charAt(item.url.length-1),
					    success: (ret) => {
							uni.switchTab({
							    url: '/pages/tabBar/sort/sort'
							});
					    }
					});
				}else if(item.url.startsWith('/pages/')){
					uni.navigateTo({
					    url: item.url
					});
				}else{
					uni.navigateTo({
					    url: '/pages/home/kingkong/'+item.url+'/'+item.url
					});
				}
				// 调用点击率接口
				if(item.url){
					uni.request({
						url:this.$url+'/api/home/mainmodule-hits?id='+item.id,
						method: "post",
					})
				}
			},
			toNotice(){
				uni.navigateTo({
					url:"/pages/notice/notice"
				})
			},
			toSignin(){
				uni.navigateTo({
					url:"/pages/activity/signin/signin"
				})
			},
			toQuest(){
				uni.navigateTo({
					url:"/pages/activity/quest/quest?id="+this.questID
				})
			},
			getYearSignin(path){
				uni.request({
					url: this.$url+'/api/annualmeeting/allowlive',
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success: (res) => {
						if(res.data.success&&res.data.code == 200){
							if(res.data.data!=null){
								this.issignin(path)
							}
						}else if(res.data.code == 401){
							this.$to401()
						}
					}
				})
			},
			issignin(path){
				uni.request({
					url: this.$url+'/api/annualmeeting/issignin?id='+this.parseUrl(path).rid,
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
					success: (res) => {
						if(res.data.data){
							this.$toPath('/pages/activity/live/live?id='+this.parseUrl(path).pid)
						}else{
							this.$toPath(path)
						}
					}
				})
			},
			// #ifdef APP-PLUS
			getVsersion(platform){
				this.versionCode = plus.runtime.versionCode
				let appid = plus.runtime.appid
				uni.request({
				    url: this.$url+'/api/basics/app-vsersion?platform='+platform, 
					method: "GET",
				    success: (res) => {
						if( Number(res.data.data.versionCode) > Number(this.versionCode) && this.$url == "https://shop.neware.com.cn" && appid!='HBuilder'){
							this.version = res.data.data.version
							this.verlog = res.data.data.log
							this.isCompel = res.data.data.isCompel
							this.upgradeShow = true
							this.showMask()
						}else{
							this.getMask()
						}
				    }
				});
			},
			downNASA(){
				const platform = uni.getSystemInfoSync().platform
				if(platform == 'ios'){
					plus.runtime.openURL('https://apps.apple.com/cn/app/id1489450445')
				}else{
					plus.runtime.openURL('https://shop.neware.com.cn/GoStore/')
				}
			},
			// #endif 
			parseUrl(query){
				const reg = /([^?=&]+)[=\s]([^=&?]+)/g
				const obj = {}
				while (reg.exec(query)) {
				obj[RegExp.$1] = RegExp.$2;
				}
				return obj;
			}
		},
	}
</script>

<style lang="scss">
	@import "./home.scss";
</style>
