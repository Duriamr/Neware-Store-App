<template>
	<view class="warp">
		<image :src="item"  mode="widthFix" v-for="(item,index) in productimage" :key='index'/>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				productimage:[],
			}
		},
		onLoad(option) {
			this.getProductimage(option)
		},
		
		methods:{
			getProductimage(option){
				uni.request({
					url:this.$url+'/api/campaignnew/productimage?campaignId='+option.cid+'&productId='+option.pid,
					method:'get',
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.productimage = res.data.data
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp{
		width: 100%;
		image{
			width: 100%;
		}
	}
</style>
