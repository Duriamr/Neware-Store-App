<template>
	<view class="paper_content">
		<image class="paper" :src="item" mode="widthFix" lazy-load="true" v-for="(item,index) in bgList" :key="'bgList'+index" />
		
		<!-- #ifndef H5 -->
		<view class="footer_placeholder"></view>
		<view class="paper_footer">
			<view class="footer" v-if="type&&!lookShow" @tap.stop="toReceive">
				{{buttontext}}
			</view>
			<view class="footer" v-if="type&&lookShow" @tap.stop="lookReceive">
				{{successbuttontext}}
			</view>
			<view class="footer" v-if="!type" @tap.stop="setCopy">
				{{buttontext}}
			</view>
			<view class="safety"></view>
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
	import share from '@/components/nw-share/nw-share';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default {
		components: {share,h5Footer},
		data() {
			return {
				token:uni.getStorageSync('token'),
				
				bgList:[],
				
				type:0,
				id:0,
				title:'',
				buttontext:'',
				successbuttontext:'',
				pid:'',
				
				lookShow:false,
				
				shareShow:'',
				shareObj:{},
			};
		},
		onLoad(options) {
			if(options){
				this.type = Number(options.type)
				this.id = options.id
				this.title = decodeURIComponent(options.title)
				uni.setNavigationBarTitle({title: this.title})
				this.buttontext = decodeURIComponent(options.buttontext)
				this.successbuttontext = decodeURIComponent(options.successbuttontext)
				this.pid = options.pid
				this.shareObj = {
					title:"新威学术论文奖",
					summary: "优秀论文“砸过来”，万元奖金等你拿！",
					href:this.$h5Url+`/pages/activity/paper/paper?id=${this.id}&type=${this.type}&pid=${this.pid}&title=${encodeURIComponent(this.title)}&buttontext=${encodeURIComponent(this.buttontext)}&successbuttontext=${encodeURIComponent(this.successbuttontext)}`,
					imageUrl:'https://file.neware.com.cn/share/share.png',
				}
			}
			this.getBgList()
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			if(this.type){
				this.getPrizeStatus();
			}
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.$showShare()
			}
		},
		methods:{
			getBgList(){
				uni.request({
				    url: this.$url+'/api/live/introduceimagev2?promotionalActivityId='+this.id, 
					method: "GET",
				    
				    success: (res) => {
						this.bgList = res.data.data
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getPrizeStatus(){
				uni.request({
				    url: this.$url+'/api/paper/prizestatus', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data:{
						"promotionalActivityId":this.id
					},
					method: "POST",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.lookShow = res.data.data
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			toReceive(){
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.navigateTo({
								url:"/pages/activity/paper/receive/receive?type=edit&id="+this.id+"&pid="+this.pid+"&title="+this.title
							})
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
			lookReceive(){
				uni.navigateTo({
					url:"/pages/activity/paper/receive/receive?type=look&id="+this.id+"&title="+this.title
				})
			},
			setCopy(){
				uni.setClipboardData({
					data:'https://shop.neware.com.cn/paper/',
					fail: (err) => {
						uni.showToast({
						    icon: 'none',
						    position: 'bottom',
						    title: '发生错误请重试'
						});
					}
				}) 
			},
		}
	}
</script>

<style lang="scss">
	.paper_content{
		width: 100%;
		.paper{
			width: 100%;
			display: block
		}
	}
	
	.paper_footer{
		width: 100%;
		position: fixed;
		z-index: 10;
		bottom:0;
		background: #F8B500;
		.footer{
			width: 100%;
			height: 98upx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size:32upx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(255,255,255,1);
			line-height:32upx;
			letter-spacing:16upx
		}
	}
</style>
