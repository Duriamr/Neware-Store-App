<template>
	<view class="expect_content">
		<image src="/static/expect/expect.png" mode="widthFix" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.expect_content{
		height: 100vh;
		display: flex;
		align-items: center;
		image{
			width: 100%;
			position: relative;
			bottom: 100upx;
		}
	}
</style>
