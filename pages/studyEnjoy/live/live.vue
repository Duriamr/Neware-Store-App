<template>
	<view class="live_contact">
		<view class="live_ul">
			<nw-live-item v-for="(item,index) in liveArr" :key="index" 
			:item="item" />
			<text class="baseline" v-if="baselineShow">- 我是有底线的 -</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageIndex:1,
				pageSize:10,
				baselineShow:false,
				
				liveArr:[],
			};
		},
		onLoad() {
			uni.startPullDownRefresh()
		},
		onPullDownRefresh(){
			this.getLiveArr()
		},
		onReachBottom(){
			this.addLiveArr()
		},
		onNavigationBarButtonTap(e){
			if(e.index==0){
				this.$toPath('/pages/search/searchLive')
			}
		},
		methods:{
			getLiveArr(){
				uni.request({
				    url: this.$url+'/api/liveuser/live', 
					data:{
						"keyWord": "",
						"pageIndex": 1,
						"pageSize": this.pageSize,
					},
					method: "POST",
					
				    success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.success&&res.data.code == 200){
							this.liveArr = res.data.data.items
							this.pageIndex = 1
							this.baselineShow = false
						}
				    },
					fail: (err) => {
						uni.stopPullDownRefresh()
						this.$requestFail()
					}
				});
			},
			addLiveArr(){
				uni.showLoading({ title: '加载更多'});
				uni.request({
				    url: this.$url+'/api/liveuser/live', 
					data:{
						"keyWord": "",
						"pageIndex": ++this.pageIndex,
						"pageSize": this.pageSize,
					},
					method: "POST",
					
				    success: (res) => {
						uni.hideLoading()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data.items.length > 0 && res.data.data.items != null){
								this.baselineShow = false
								for(let item of res.data.data.items){
									this.liveArr.push(item)
								}
							}else{
								this.pageIndex--
								this.baselineShow = true
							}
						}
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "./live.scss";
</style>
