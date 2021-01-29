<template>
    <view class="content">
        <view class="swiper">
            <swiper class="swiper-list" interval="5000" :autoplay="autoplay" :duration="duration" @change="swiperChange">
                <swiper-item v-for="(item, index) in swiperList" :key="index">
                    <view class="swiper-item">
                        <view class="swiper-item-img">
                            <image :src="item.imgUrl" mode="widthFix"></image>
                        </view>
                    </view>
                </swiper-item>
            </swiper>
            <view class="jumpover" @tap="popupShow" v-if="swiperCurrent+1 < swiperLength && btnShow == true">{{ jumpover }}</view>
            <view class="experience" @tap="popupShow" v-if="swiperCurrent+1 == swiperLength && btnShow == true">{{ experience }}</view>
        </view>
		
		<view class="popup" @touchmove.stop.prevent @tap.stop.prevent v-if="popup == true">
			<view class="iframe">
				<view class="top">
					<view class="title">
						服务协议和隐私协议
					</view>
					<view class="main">
						新威将依照以下约定向您提供本条款涉及的相关服务。请您使用新威服务前仔细阅读本条款。<br />我们将通过<span class="toAgree" @tap="toPrAgree">《用户隐私协议》</span>和<span class="toAgree" @tap="toReAgree">《用户服务协议》</span>收集、使用、储存和分享您的相关信息。
					</view>
				</view>
				<view class="btns">
					<view class="btn" @tap.stop = "popupHide">
						暂不使用
					</view>
					<view class="btn btn1" @tap.stop = "launchFlag">
						同意
					</view>
				</view>
			</view>
		</view>
		
		<view class="toast" :class=" toast" @touchmove.stop.prevent @tap.stop.prevent>
			<view class="toast_content">
				<image class="caveat" src="/static/public/caveat.png" mode="widthFix" />
				<view>
					需要获得您的同意后才可继
				</view>
				<view>
					续使用新威研选提供的服务
				</view>
			</view>
		</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            titleNViewBackground: '',
            swiperCurrent: 0,
            swiperLength: 0,
            swiperList: [
                {
                    imgUrl: '/static/star/guide/1.png',
                },
                {
                    imgUrl: '/static/star/guide/2.png',
                },
                {
                    imgUrl: '/static/star/guide/3.png',
                }
            ],
            autoplay: false,
            duration: 500,
            jumpover: '跳过',
            experience: '立即体验',
			popup:false,
			toast:'hide',
			btnShow:true
        };
    },
    onLoad() {
        this.swiperLength = this.swiperList.length;
        // this.titleNViewBackground = this.swiperList[0].bgColor;
    },
    methods: {
        //轮播图切换修改背景色
        swiperChange(e) {
            const index = e.detail.current;
            this.swiperCurrent = index;
            this.swiperLength = this.swiperList.length;
            // this.titleNViewBackground = this.swiperList[index].bgColor;
        },
		popupShow(){
			this.popup = true;
			this.btnShow = false;
		},
		popupHide(){
			this.popup = false;
			this.btnShow = true;
			this.toast = 'show';
			setTimeout(() => {
				this.toast = 'hide';
			}, 2000);
		},
        launchFlag() {
            /**
             * 向本地存储中设置launchFlag的值，即启动标识；
             */
            uni.setStorage({
                key: 'launchFlag1',
                data: true
            });
            // this.$toHome()
			uni.redirectTo({
				url:"./video"
			})
        },
		toReAgree(){
			uni.navigateTo({
				url:"/pages/agreement/registrationAgreement"
			})
		},
		toPrAgree(){
			uni.navigateTo({
				url:"/pages/agreement/privacyAgreement"
			})
		}
    }
};
</script>
<style lang="scss">
page,
.content {
    padding: 0;
    background-size: 100% auto;
	font-size:36upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	line-height:36upx;
}

.swiper{
	display: flex;
    flex-direction: column;
	align-items: center;
	justify-content: center;
    width: 100vw;
    height: 100vh;
    background: #FFFFFF;
}

.swiper-list {
    width: 100%;
    height: 100%;
}

.swiper-item {
    position: relative;
    display: flex;
    align-items: center;
	justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;
}

.swiper-item-img {
    width: 100%;
    height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.swiper-item-img image {
    width: 100%;
}

@-webkit-keyframes fadeIn {
	0% {
		opacity: 0; /*初始状态 透明度为0*/
	}
	50% {
		opacity: 0; /*中间状态 透明度为0.5*/
	}
	100% {
		opacity: 1; /*结尾状态 透明度为1*/
	}
}
@-webkit-keyframes fadeOut {
	0% {
		opacity: 1; /*初始状态 透明度为1*/
	}
	50% {
		opacity: 0.5; /*中间状态 透明度为0*/
	}
	100% {
		opacity: 0; /*结尾状态 透明度为0*/
	}
}
.jumpover {
	position: absolute;
	z-index: 999;
    right: 40upx;
    top: 55upx;
	/*  #ifdef  APP-PLUS  */
	top: calc(55upx + var(--status-bar-height));
	/*  #endif  */
	color:rgba(248,181,0,1);
}

.experience {
	position: absolute;
	z-index: 999;
    right: calc(50% - 140upx);
    bottom: 6vh;
	color:rgba(255,255,255,1);
	width:280upx;
	height:100upx;
	background:rgba(248,181,0,1);
	border-radius:50upx;
	display: flex;
	align-items: center;
	justify-content: center;
	// transition: 1s;
	-webkit-animation-name: fadeIn; /*动画名称*/
	-webkit-animation-duration: 1s; /*动画持续时间*/
	-webkit-animation-iteration-count: 1; /*动画次数*/
	-webkit-animation-delay: 0s; /*延迟时间*/
}
.popup{
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	z-index: 20;
	background-color: rgba(0,0,0,0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	-webkit-animation-name: fadeIn; /*动画名称*/
	-webkit-animation-duration: 1s; /*动画持续时间*/
	-webkit-animation-iteration-count: 1; /*动画次数*/
	-webkit-animation-delay: 0s; /*延迟时间*/
	.toAgree{
		color:#F8B500;
	}
	.iframe{
		width: calc(100% - 114upx);
		background-color: #FFFFFF;
		border-radius:16upx;
		.top{
			width: 100%;
			box-sizing: border-box;
			padding: 64upx 48upx 48upx 48upx;
			border-bottom: 1upx solid #E5E5E5;
			.title{
				display: flex;
				align-items: center;
				justify-content: center;
				font-size:36upx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:36upx;
				margin-bottom: 24upx;
			}
			.main{
				font-size:28upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:44upx;
			}
		}
		.btns{
			width: 100%;
			display: flex;
			align-items: center;
			height: 110upx;
			.btn{
				height: 110upx;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:36upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(102,102,102,1);
				line-height:36upx;
			}
			.btn1{
				box-sizing: border-box;
				border-left: 1upx solid #E5E5E5;
				color:rgba(248,181,0,1);
			}
		}
	}
}
.toast{
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	z-index: 20;
	display: none;
	&.show{
		display: flex;
		align-items: center;
		justify-content: center;
		-webkit-animation-name: fadeIn; /*动画名称*/
		-webkit-animation-duration: 1s; /*动画持续时间*/
		-webkit-animation-iteration-count: 1; /*动画次数*/
		-webkit-animation-delay: 0s; /*延迟时间*/
	}
	&.hide{
		display: none;
		-webkit-animation-name: fadeOut; /*动画名称*/
		-webkit-animation-duration: 1s; /*动画持续时间*/
		-webkit-animation-iteration-count: 1; /*动画次数*/
		-webkit-animation-delay: 0s; /*延迟时间*/
	}
	.toast_content{
		width: calc(100% - 250upx);
		background-color: rgba(0,0,0,0.5);
		border-radius:16upx;
		box-sizing: border-box;
		padding: 40upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:#FFFFFF;
		line-height:44upx;
		.caveat{
			width: 75upx;
			margin-bottom: 20upx;
		}
	}
}
</style>
