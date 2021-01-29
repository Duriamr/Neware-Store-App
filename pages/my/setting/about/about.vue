<template>
	<view class="about_content">
		<image src="/static/logo.png" class="logo" mode="widthFix"/>
		<text class="name">新威研选</text>
		<view class="list">
			<view class="inside">
				<text class="text">客服热线</text>
				<text>{{phone}}</text>
			</view>
		</view>
		<view class="list">
			<view class="inside">
				<text class="text">客服邮箱</text>
				<text>{{eMall}}</text>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->  
		<view class="list">
			<view class="inside">
				<text class="text">当前版本</text>
				<text>{{version}}</text>
			</view>
		</view>
		
		<view class="list">
			<view class="inside inside2">
				<text class="text">版本更新</text>
				<view class="right">
					<text v-if="!update">无新版本</text>
					<view class="nv" @tap="downNASA" v-if="update">新版本V&#8197;{{newVersion}}</view>
					<image src="/static/public/go_grey.png" @tap="downNASA" v-if="update" />
				</view>
			</view>
		</view>
		<!-- #endif -->   
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone:"800-830-8866",
				eMall:"service@neware.com.cn",
				version:"",
				versionCode:0,
				newVersion:"",
				update:false
			};
		},
		onLoad() {
			// #ifdef APP-PLUS   
			this.version = plus.runtime.version
			uni.getSystemInfo({
				success: (res) => {
					if(res.platform == 'ios'){
						this.getVsersion(2);
					}else{
						this.getVsersion(1);
					}
				}
			})
			// #endif 
		},
		methods:{
			// #ifdef APP-PLUS 
			getVsersion(platform){
				this.versionCode = plus.runtime.versionCode
				uni.request({
				    url: this.$url+'/api/basics/app-vsersion?platform='+platform, 
					method: "GET",
				    
				    success: (res) => {
						if( Number(res.data.data.versionCode) > Number(this.versionCode) ){
							this.newVersion = res.data.data.version;
							this.update = true;
						}
				    }
				});
			},
			downNASA(){
				const platform = uni.getSystemInfoSync().platform
				if(platform == 'ios'){
					plus.runtime.openURL('https://apps.apple.com/cn/app/id1489450445')
				}else{
					plus.runtime.openURL('https://shop.neware.com.cn/GoStore/')
				}
			},
			// #endif 
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.about_content{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color: #333333;
		line-height:28upx;
		.logo{
			width:128upx;
			border-radius:24upx;
			margin-top: 112upx;
			border-radius:32upx;
		}
		.name{
			font-size:24upx;
			color:#B3B3B3;
			line-height:24upx;
			margin: 16upx 0 120upx 0;
		}
		.list{
			width:100%;
			background:#FFFFFF;
			box-sizing: border-box;
			padding: 0 24upx;
			.inside,
			.inside2{
				width: 100%;
				height: 88upx;
				border-bottom: 1upx solid #F5F5F5;
				display: flex;
				align-items: center;
				.text{
					font-family:PingFangSC-Light,PingFang SC;
					font-weight:300;
					color:rgba(102,102,102,1);
					margin-right: 24upx;
				}
			}
			.inside2{
				border-bottom: none;
				justify-content: space-between;
				.right{
					display: flex;
					align-items: center;
					.nv{
						color:rgba(248,181,0,1);
					}
					image{
						width: 32upx;
						height: 32upx;
					}
				}
			}
		}
	}
</style>
