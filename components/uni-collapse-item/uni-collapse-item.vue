<template>
	<view class="uni-collapse-cell">
		<view class="uni-collapse-cell__title" @click="onClick">
			<view class="Q_content">
				<view class="Q">Q：</view>
				<text class="uni-collapse-cell__title-text">{{ title }}</text>
			</view>
			 <view :class="{ 'uni-collapse-cell__title-arrow-active': isOpen, 'uni-collapse-cell--animation': showAnimation === true }" class="uni-collapse-cell__title-arrow">
			 	<image class="arrow" src="/static/studyEnjoy/arrow.png" />
			 </view>
		</view>
		
		
		<view :class="{'uni-collapse-cell__content--hide':!isOpen}" class="uni-collapse-cell__content">
			<view :class="{ 'uni-collapse-cell--animation': showAnimation === true }" class="uni-collapse-cell__wrapper" :style="{'transform':isOpen?'translateY(0)':'translateY(-50%)','-webkit-transform':isOpen?'translateY(0)':'translateY(-50%)'}">
				
				<view class="A_content">
					<view class="A">A：</view>
					<view class="right">
						<slot />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniCollapseItem',
		components: {
			uniIcons
		},
		props: {
			title: {
				// 列表标题
				type: String,
				default: ''
			},
			name: {
				// 唯一标识符
				type: [Number, String],
				default: 0
			},
			disabled: {
				// 是否禁用
				type: Boolean,
				default: false
			},
			showAnimation: {
				// 是否显示动画
				type: Boolean,
				default: false
			},
			open: {
				// 是否展开
				type: Boolean,
				default: false
			},
			thumb: {
				// 缩略图
				type: String,
				default: ''
			}
		},
		data() {
			return {
				isOpen: false
			}
		},
		watch: {
			open(val) {
				this.isOpen = val
			}
		},
		inject: ['collapse'],
		created() {
			this.isOpen = this.open
			this.nameSync = this.name ? this.name : this.collapse.childrens.length
			this.collapse.childrens.push(this)
			if (String(this.collapse.accordion) === 'true') {
				if (this.isOpen) {
					let lastEl = this.collapse.childrens[this.collapse.childrens.length - 2]
					if (lastEl) {
						this.collapse.childrens[this.collapse.childrens.length - 2].isOpen = false
					}
				}
			}
		},
		methods: {
			onClick() {
				if (this.disabled) {
					return
				}
				if (String(this.collapse.accordion) === 'true') {
					this.collapse.childrens.forEach(vm => {
						if (vm === this) {
							return
						}
						vm.isOpen = false
					})
				}
				this.isOpen = !this.isOpen
				this.collapse.onChange && this.collapse.onChange()
				this.$forceUpdate()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/uni.scss';

	.uni-collapse-cell {
		flex-direction: column;
		width: 100%;
		background:rgba(245,245,245,1);
		border-radius:8upx;
		margin-bottom: 24upx;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		line-height:28upx;
	}

	.arrow{
		width: 16upx;
		height: 16upx;
	}
	
	.uni-collapse-cell--animation {
		// transition: transform 0.3s ease;
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: ease;
	}

	.uni-collapse-cell__title {
		width: 100%;
		box-sizing: border-box;
		padding: 26upx 26upx 26upx 20upx;
		// position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-collapse-cell__title-arrow {
		transform: rotate(0deg);
		transform-origin: center center;
	}

	.uni-collapse-cell__title-arrow-active {
		transform: rotate(180deg);
	}
	
	.Q_content{
		display: flex;
		align-items: flex-start;
		.Q{
			width: 58upx;
			font-size:28upx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(112,28,221,1);
			line-height:38upx;
		}
	}
	
	.uni-collapse-cell__title-text {
		width:512upx;
		color:rgba(51,51,51,1);
		line-height:38upx;
	}

	.A_content{
		width: 100%;
		box-sizing: border-box;
		padding: 0upx 26upx 0upx 20upx;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		.A{
			width: 58upx;
			padding-top: 26upx;
			font-size:28upx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(248,181,0,1);
			line-height:38upx;
		}
		.right{
			width: calc(100% - 58upx);
			padding: 26upx 0upx;
			border-top: 1upx solid #E5E5E5;
		}
	}
	
	.uni-collapse-cell__content {
		overflow: hidden;
	}

	.uni-collapse-cell__wrapper {
		display: flex;
		flex-direction: column;
	}

	.uni-collapse-cell__content--hide {
		height: 0px;
		line-height: 0px;
	}
</style>
