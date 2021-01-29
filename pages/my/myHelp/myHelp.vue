<template>
	<view class="myHelp_content">
		<view class="nav">
			<view class="nav_list" v-for="(item,index) in tabList" :key="index" :data-index="index" :class="{active:index==idx}" @tap="tabChange(index)">
				{{item}}
			</view>
		</view>
		
		<swiper :current="idx" class="swiper" duration="600" @change="swiperChange">
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
					
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
					
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
						
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view class="scroll" scroll-y="true">
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				
				idx:0,
				tabList:["全部", "进行中", "助力成功", "助力失败"]
			};
		},
		onLoad(option) {
			this.idx = option.idx;
			if(this.idx==''||this.idx==NaN||this.idx==null||this.idx==undefined){
				this.idx = 0
			}
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			
		},
		methods:{
			tabChange(index) {
				this.idx = index;
			},
			swiperChange(e) {
			    let { current } = e.target;
			    this.idx = current;
			},
		}
	}
</script>

<style lang="scss">
	@import "./myHelp.scss";
</style>
