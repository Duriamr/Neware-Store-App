<template>
	<view class="live_content">
		<image class="live" :src="item" mode="widthFix" lazy-load="true" v-for="(item,index) in bgList" :key="'bgList'+index" />
		
		<!-- #ifndef H5 -->
		<block v-if="!liveShow">
			<view class="footer_placeholder"></view>
			<view class="footer" @tap.stop="showEnter()">
				{{buttontext}}
			</view>
		</block>
		
		<block v-if="liveShow">
			<view class="footer_placeholder"></view>
			<view class="footer" @tap.stop="copyLive()" v-if="liveShow">
				{{successbuttontext}}
			</view>
		</block>
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
	import share from '@/components/nw-share/nw-share';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default {
		components: {share,h5Footer},
		data() {
			return {
				flag:true,
				token:uni.getStorageSync('token'),
				id:0,
				title:'', // 导航标题
				bgList:[],
				liveShow:false,//是否报名
				enterShow:false,//显示报名
				
				loginType:false,
				
				//报名区
				name:'',
				nameFocus:false,
				phone:'',
				phoneFocus:false,
				phoneDisabled:false,
				school:'',
				schoolFocus:false,
				appUserType:0,
				
				//分享区
				shareShow:'',
				shareObj:{},
				
				//点击区
				EnterOneTap:false,
				LiveOneTap:false,
				encodeTitle:'',
				buttontext:'',
				successbuttontext:'',
			};
		},
		onLoad(options) {
			this.id = options.id
			this.title = options.title
			this.buttontext = options.buttontext,
			this.successbuttontext = options.successbuttontext,
			// #ifdef H5
			this.title = decodeURIComponent(this.title)
			// #endif
			this.encodeTitle = encodeURIComponent(this.title)
			this.getBgList()
			this.getShare()
			uni.setNavigationBarTitle({
				title:options.title
			});
		},
		onShow() {
			this.hideEnter();
			this.token = uni.getStorageSync('token');
			this.getSignup();
			this.LiveOneTap = false;
			this.storeOff = true
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.showShare()
			}
		},
		methods:{
			getBgList(){
				uni.request({
				    url: this.$url+`/api/live/introduceimagev2?promotionalActivityId=${this.id}`, 
					method: "GET",
				    success: (res) => {
						this.bgList = res.data.data
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getShare(){
				uni.request({
				    url: this.$url+'/api/live/shareinfo?promotionalActivityId='+this.id, 
					method: "GET",
				    success: (res) => {
						this.shareObj = {
							title:res.data.data.title,
							summary:res.data.data.shareContent,
							href:this.$h5Url+`/pages/activity/registration/registrationActivities?id=${this.id}&title=${this.encodeTitle}`,
							imageUrl:res.data.data.shareImg,
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			//是否已报名
			getSignup(){
				uni.request({
				    url: this.$url+'/api/live/issignupv2?promotionalActivityId='+this.id, 
					header:{
						Authorization:'Bearer '+ this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.liveShow = res.data.data
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			//显示报名
			showEnter(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
				this.shareObj = 'none';
				uni.getNetworkType({
				    success:(res)=> {
				      if(res.networkType == 'none'){
						  uni.showToast({
						    icon: 'none',
						  	title:"网络断开连接"
						  });
					  }else{
						  if(this.token){
						  	uni.navigateTo({
						  		url:"/pages/activity/registration/submit/submit?id="+this.id
						  	})
						  }else{
						  	this.$to401()
						  }
					  }
				    }
				});
			},
			//隐藏报名
			hideEnter(){
				this.enterShow = false
			},
			
			//  跳转报名成功页面
			copyLive(){
				uni.navigateTo({
					url:'/pages/activity/registration/success/success?id='+this.id
				})
			},
			
			//分享
			showShare(){
				this.hideEnter();
				this.shareObj = 'show';
			},
		}
	}
</script>

<style lang="scss">
	@import "./registrationActivities.scss";
</style>
