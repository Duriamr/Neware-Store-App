<template>
	<view>
		<image :src="item.image" v-for="(item,index) in poster.posterImage" :key='index' mode="widthFix"></image>
		
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
		data(){
			return{
				id:'',
				poster:{
					posterImage:[]
				},
				
				//分享区
				shareShow:'',
				shareObj:{},
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getposter()
		},
	
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.$showShare()
			}
		},
		methods:{
			getposter(id){
				uni.request({
					url:this.$url+'/api/poster/get?id='+this.id ,
					method:'get',
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.poster = res.data.data
							this.poster.posterImage.sort((a,b)=>{ return a.sort-b.sort})
							uni.setNavigationBarTitle({
							　　title:this.poster.name
							})
							this.shareObj = {
								title:this.poster.name,
								summary:this.poster.shareWord,
								href:this.$h5Url+'/pages/activity/poster/poster?id='+this.id,
								imageUrl:this.poster.shareImg,
							}
						}
					}
				})
			},
		}
	}
</script>

<style  lang="scss">
	image{
		width: 100%;
		display: block;
	}
</style>
