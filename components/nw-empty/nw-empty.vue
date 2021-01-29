<template>
	<view>
		<view class="empty" :style="{marginTop: marginTop}">
			<image :src="src" mode="widthFix" />
			<text>{{text}}</text>
			<view class="btn" v-if="btnShow" @tap.stop="btn()">
				{{btnText}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'empty',
		props:{
			src:String,
			text:String,
			marginTop:{
				type: String,
				default: '0'
			},
			btnShow:{
				type: Boolean,
				default: false
			},
			btnText:{
				type: String,
				default: ''
			},
		},
		methods:{
			btn(){
				this.$emit("btn");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.empty{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(179,179,179,1);
		line-height:28upx;
		image{
			width:220upx;
			margin-bottom: 8upx;
		}
		text{
			margin-bottom: 32upx;
		}
		.btn{
			height:60upx;
			padding: 0 40upx;
			border-radius:30upx;
			border:2upx solid #999999;
			color:rgba(102,102,102,1);
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 32upx;
		}
	}
</style>
