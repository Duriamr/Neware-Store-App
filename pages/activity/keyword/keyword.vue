<template>
	<view class="kewWord">
		<view class="header">
			<image src="https://file.neware.com.cn/promotionalactivity/type/444cd30f27f04fc095ec12ba9390f316.png"  mode="widthFix"></image>
			<image src="http://file.neware.com.cn/banner/活动页@1.5x_02.png"  mode="widthFix"></image>
		</view>
		<view class="contentRight">
			<view class="right" v-if="topImage && topImage.length > 0">
				<image class="center" :src="topImage[0].imageUrl"></image>
				<view class="imageList">
					<image :src="item.imageUrl" v-for="(item,index) in topImage.slice(1,topImage.length)" :key='index' mode="widthFix" @tap.stop='toUrl(item)'>
					</image>
				</view>
				<view class="footerTxt">
					*剩下11场直播请点击研享-学术博览内的视频即可回看
				</view>
			</view>
		</view>
		<view class="contentCenter">
			<view>时间无法倒流，但知识可以恶补</view>
			<view>诗歌趁年华，学习趁现在！</view>                 
		</view>
		<view class="contentLeft">
			<view class="right" v-if='dowImage && dowImage.length > 0'>
				<view class="center">
					<image class="centerImge" :src="dowImage[0].imageUrl"  mode="widthFix"></image>
					<image class="imageList":src="item.imageUrl" v-for="(item,index) in dowImage.slice(1,topImage.length)" :key='index' mode="widthFix" @tap.stop='toUrl(item)'>
					</image>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="text">一切过往，皆为序章</view>
			<view class="text">让我们一起来看看</view>
			<view class="bold">你的2021年度关键词</view>
			<image src="/static/activity/keyword/button.png" class="btn" @tap.stop='downImge'></image>
			<view class="text">收好你的年度关键词</view>
			<view class="text">让我们一起踏入2021</view>
			<view class="text">研选陪伴每一位科研人，不忘初心</view> 
			<view class="text">共同进步，潜心成长</view>
		</view>
		
		<!-- 分享图片 -->
		<view class="share" :class="isShow" @touchmove.stop.prevent @tap.stop="hideShare">
			<view class="mask">
				<image :src="sharImg" :class="isShowImg?'sharImg active':'sharImg'" mode="widthFix"></image>
			</view>
			<view class="layer" @tap.stop>
				<view class="share_content">
					<view class="title">
						分享
					</view>
					<view class="shareUl">
						<view class="shareList" @tap.stop="shareWX">
							<image src="/static/public/share/wx.png" />
							<view class="shareName">
								微信好友
							</view>
						</view>
						<view class="shareList" @tap.stop="sharePYQ">
							<image src="/static/public/share/pyq.png" />
							<view class="shareName">
								朋友圈
							</view>
						</view>
						<view class="shareList" @tap.stop="saveImg">
							<image src="/static/activity/keyword/shar.png" />
							<view class="shareName">
								保存图片
							</view>
						</view>
					</view>
				</view>
				<view class="share_btn" @tap.stop="hideShare">
					取消
				</view>
			</view>
		</view>
		<!-- 分享 -->
		<!-- #ifdef APP-PLUS -->  
		<share :shareShow='shareShow' :shareObj='shareObj' @hideShare='$hideShare()'></share>
		<!-- #endif --> 
		<!-- #ifdef H5 -->
		<h5Footer />
		<!-- #endif --> 
	</view>
</template>

<script>
	import share from '@/components/nw-share/nw-share';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default{
		components:{
			share,
			h5Footer
		},
		data(){
			return{
				isShowImg:false,
				sharImg:'', // 分享图片
				token:'',
				isShow:'',
				shareShow:'',
				shareObj:{
					title:'科研人！快来看你的年度关键词',
					summary:'让我们一起踏入2021，不忘初心，共同进步，潜心成长',
					href:this.$h5Url+'/pages/activity/keyword/keyword',
					imageUrl:'https://file.neware.com.cn/promotionalactivity/type/3877b3f14f724fc8ab53ff30c7b34a0c.jpg',
				},
				topImage:[],
				dowImage:[],
			}
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.$showShare()
			}
		},
		onLoad() {
			this.getyearcampaign()
		},
		
		onShow() {
			this.token = uni.getStorageSync('token')
		},
		
		methods:{
			//  跳转
			toUrl(item){
				if(item.url){
					uni.navigateTo({
						url:item.url
					})
				}
			},
			// 获取内容
			getyearcampaign(){
				uni.request({
					url:this.$url+'/api/yearcampaign/getyearcampaign',
					method:'get',
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.topImage = res.data.data.topImage
							this.dowImage = res.data.data.dowImage
						}else{
							uni.showToast({
							    icon: 'none',
							    position: 'center',
							    title: res.data.message
							});
						}
					}
				})
			},
			
			
			//  点击下载
			downImge(){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif  
				if(!uni.getStorageSync('token')){
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
				}else{
					this.isShow = 'show';
					this.getSharImg()
				}
			},
			
			//  获取分享图片
			getSharImg(){
				uni.request({
					url:this.$url+'/api/yearcampaign/getyearuser',
					method:'get',
					header:{
						Authorization:'Bearer '+this.token
					},
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.isShowImg = true
							this.sharImg = res.data.data
						}else{
							uni.showToast({
							    icon: 'none',
							    position: 'center',
							    title: res.data.message
							});
						}
					}
				})
			},
			
			hideShare(){
				this.isShowImg = false
				this.isShow = 'hide';
				setTimeout(() => {
					this.isShow = 'none';
				}, 200);
			},
			//  保存图片
			saveImg(){
				let that = this
				uni.showLoading({
					title:'正在保存',
				});
				uni.downloadFile({
					url:that.sharImg,
					success: res => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									that.hideShare()
									uni.hideLoading()
									uni.showToast({
									    icon: 'none',
									    title: '保存成功'
									});
								},
								fail: function() {
									uni.showToast({
									    icon: 'none',
									    title: '保存失败'
									});
								}
							});
						} 
					}
				});
			},
			//  分享图片
			shareWX(){
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 2,
				    imageUrl: this.sharImg,
				   complete: (res) => {
						this.hideShare()
					},
				});
			},
			//  分享朋友圈
			sharePYQ(){
				uni.share({
				    provider: "weixin",
				    scene: "WXSenceTimeline",
				    type: 2,
				    imageUrl: this.sharImg,
				   complete: (res) => {
						this.hideShare()
					},
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './keyword.scss'
</style>
