<template>
  <view class="warp">
	<view class="discount">
		<view class="header" v-if="topImageList && topImageList.length > 0">
			<image :src="topImageList[0]" mode="widthFix" width='100%'></image>
			<text class="activityrules" @tap.stop="handleRule">活动规则</text>
		</view>
		<view class="middle">
			<image class="rightT show" :src="rightTop" width=100% mode="widthFix"/>
			<image class="rightB show" :src="rightBot" width=100% mode="widthFix"/>
			<image class="leftT show" :src="leftTop" width=100% mode="widthFix"/>
			<image class="leftB show" :src="leftBot" width=100% mode="widthFix"/>
			<image class="bj" :src="middleBackgroundImage" width=100% mode="widthFix"/>
			<view class="specialarea">
				<image :src="item" key='index' v-for="(item,index) in middleImageList" :key='index' @tap.stop="anchorjump(index)">
			</view>
		</view>
		<view class="content" v-if="campaignNewDetailDtos && campaignNewDetailDtos.length > 0">
		    <!--活动一 -->
			<view v-if="exclusiveNewePople" id='specialareaOne' class="specialareaOne">
				<image :src='exclusiveNewePople.imageUrl' mode="widthFix"></image>
				<view class="time">活动时间：{{exclusiveNewePople.date}}</view>
				<view v-if="exclusiveNewePople.products && exclusiveNewePople.products.length > 0">
					<view class="exclusiveNewePople" v-for="(item,index) in exclusiveNewePople.products" :key='index' @tap.stop="gotoHelp(item)">
						<view class="left">
							<image :src="item.mainImgUrl" mode="widthFix"></image>
						</view>
						<view class="right">
							<view class="detale">{{item.productName}}</view>
							<view>
								<view class="price">
									<view class="monny">
										<view class="originalprice">￥{{item.price.toFixed(2)}}</view>
										<view class="num">邀{{item.helpNumber}}名{{exclusiveNewePople.type==1?'新人':'好友'}}</view>
									</view>
									<view class="discountPrice">￥{{item.discountPrice}}</view>
								</view>
								<view :class="item.status == 4|| item.status == 5?' activi1':'btn'"  @tap.stop="gotoHelp(item)">
									{{['立即抢','继续邀请','助力成功','助力失败','已抢光','活动结束'][item.status]}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 活动二 -->
			<view v-if="friendsHelp" class="friendsHelp" id='friendsHelp'>
				<image :src='friendsHelp.imageUrl' mode="widthFix"></image>
				<view class="time">活动时间：{{friendsHelp.date}}</view>
				<view class="productName">{{friendsHelp.products[0].productName}}</view>
				<view class="product">
					<view class="productImg" :style="{backgroundImage: 'url(' +item.mainImgUrl + ')',backgroundSize:'contain'}" v-for="(item,index) in friendsHelp.products" :key='index'  @tap.stop="gotoHelp(item)">
							<view class="searchDetaile">
								<view class="monny">
									<view class="originalprice">￥{{item.price.toFixed(2)}}</view>
									<view class="num">邀{{item.helpNumber}}名{{friendsHelp.type==1?'新人':'好友'}}</view>
								</view>
								<view class="discountPrice">
									<text style="font-size: 1upx;">￥</text>
									{{item.discountPrice}}</view>
								<view :class="item.status == 4|| item.status == 5?' activi2':'btn'" @tap.stop="gotoHelp(item)">
									{{['立即抢','继续邀请','助力成功','助力失败','已抢光','活动结束'][item.status]}}
								</view>
							</view>
						</view>
					</view>
				</view>
			<!-- 活动三 -->
			<view v-if="rushPurchase" class="rushPurchase">
				<image :src='rushPurchase.imageUrl' mode="widthFix"></image>
				<view class="time">活动时间：{{rushPurchase.date}}</view>
				<view class="product">
					<!--前两个商品-->
					<view class="productImg" :style="{backgroundImage: 'url(' +item.mainImgUrl + ')',backgroundSize:'contain'}" v-for="(item,index) in rushPurchase.products.slice(0,2)" :key='index'  @tap.stop="gotoHelp(item)">
							<view class="searchDetaile">
								<view class="monny">
									<view class="originalprice">￥{{item.price.toFixed(2)}}</view>
									<view class="num">邀{{item.helpNumber}}名{{rushPurchase.type==1?'新人':'好友'}}</view>
								</view>
								<view class="discountPrice">
									<text style="font-size: 1upx;">￥</text>
									{{item.discountPrice}}</view>
							<view :class="item.status == 4|| item.status == 5?' activi2':'btn'" @tap.stop="gotoHelp(item)">
								{{['立即抢','继续邀请','助力成功','助力失败','已抢光','活动结束'][item.status]}}
								</view>
							</view>
						</view>
					<!--非前两个商品-->
					
				</view>
				<!--非两个商品-->
				<view class="productBot">
					<view  v-if="rushPurchase1 && rushPurchase1.length > 0">
						<view 
						 v-for="(item,index) in rushPurchase1" 
						 :key='index'
						  @tap.stop="gotoHelp(item)"
						 >
							<!--  偶数 -->
							<view class="oddnumber exclusiveNewePople" v-if="index%2 ==0">
								<view class="left">
									<image :src="item.mainImgUrl" mode="widthFix"></image>
								</view>
								<view class="right">
									<view class="detale">{{item.productName}}</view>
									<view>
										<view class="price">
											<view class="monny">
												<view class="originalprice">￥{{item.price.toFixed(2)}}</view>
												<view class="num">邀{{item.helpNumber}}名{{rushPurchase.type==1?'新人':'好友'}}</view>
											</view>
											<view class="discountPrice">￥{{item.discountPrice}}</view>
										</view>
										<view :class="item.status == 4|| item.status == 5?' activi1':'btn'" @tap.stop="gotoHelp(item)">
											{{['立即抢','继续邀请','助力成功','助力失败','已抢光','活动结束'][item.status]}}
										</view>
									</view>
								</view>
							</view>
							<!--  奇数 -->
							<view class="evennumbers exclusiveNewePople" v-else>
								<view class="right" style="margin-right: 30upx;">
									<view class="detale">{{item.productName}}</view>
									<view>
										<view class="price">
											<view class="monny">
												<view class="originalprice">￥{{item.price.toFixed(2)}}</view>
												<view class="num">邀{{item.helpNumber}}名{{rushPurchase.type==1?'新人':'好友'}}</view>
											</view>
											<view class="discountPrice">￥{{item.discountPrice}}</view>
										</view>
										<view :class="item.status == 4 || item.status == 5?' activi1':'btn'" @tap.stop="gotoHelp(item)">
											{{['立即抢','继续邀请','助力成功','助力失败','已抢光','活动结束'][item.status]}}
										</view>
									</view>
								</view>
								<view class="left" style="margin-right: 0;">
									<image :src="item.mainImgUrl" mode="widthFix"></image>
								</view>
								
							</view>
						</view>
					</view>
				</view>
			</view>
			<!--  四五六 -->
			<view >
				 <image :src="item" v-for="(item,index) in downImageList" :key='index' mode="widthFix" style="width:100%"  :class="'item'+index"></image>
			</view>
		 </view>
		</view>
		
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
				topImageList:[], // 上面图
				leftImage:'', // 专区左边图
				rightImage:'', // 专区右边图
				middleBackgroundImage:'', // 专区背景
				downImageList:[], // 下面图
				middleImageList:[], // 专区图
				campaignNewDetailDtos:[], // 商品信息
				userId:uni.getStorageSync('onlyID')||0,
				rushPurchase:[],// 0元抢购  0
				exclusiveNewePople:[],// 新人专享  1
				friendsHelp:[],// 好友助力  2
				rushPurchase1:[], 
				leftTop:'',
				leftBot:'',
				rightTop:'',
				rightBot:'',
				ruleurl:'',
				anchorlist: [
					{top:0},
					{top:0},
					{top:0},
					{top:0},
					{top:0},
					{top:0},
				],
				
				//分享区
				shareShow:'',
				shareObj:{
					title:"科研界的双11来啦",
					summary: "6重好礼低至0元！扣电壳仅需0.1元/50套！活动正在进行中，手慢无！",
					href:this.$h5Url+'/pages/activity/discount/discount11',
					imageUrl:'http://file.neware.com.cn/banner/share.png',
				},
			};
		},
		
		onShow() {
		  this.getcampaign()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getcampaign()
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.$showShare()
			}
		},
		methods:{
			//  获取列表
			getcampaign(){
				this.rushPurchase1 = []
				uni.request({
					url:this.$url+'/api/campaignnew/getcampaign?userId='+this.userId,
					method:'get',
					success: (res) => {
						if(res.data.success && res.data.code == 200){
							uni.stopPullDownRefresh()
							this.ruleurl = res.data.data.rule
							this.topImageList = res.data.data.topImageList||[]
							this.leftTop = res.data.data.leftImage1
							this.leftBot = res.data.data.leftImage2
							this.rightTop = res.data.data.rightImage1
							this.rightBot = res.data.data.rightImage2
							this.middleBackgroundImage = res.data.data.middleBackgroundImage||[]
							this.middleImageList = res.data.data.middleImageList||[]
							this.campaignNewDetailDtos = res.data.data.campaignNewDetailDtos||[]
							this.downImageList =  res.data.data.downImageList||[]
							if( res.data.data.campaignNewDetailDtos &&  res.data.data.campaignNewDetailDtos.length >0 ){
								res.data.data.campaignNewDetailDtos.forEach(item =>{
									if(item.type == 0){
										this.rushPurchase = item
										item.products.map((item,index) =>{
											if(index !== 0 && index !== 1){
												this.rushPurchase1.push(item)
											}
										})
									}else if(item.type == 1){
										this.exclusiveNewePople = item
									}else if(item.type == 2){
										this.friendsHelp = item
									}
								})
							}
							setTimeout(()=>{
								this.getAnchorJump()
							},300)
						}
					}
				})
			},
			//  查看规则
			handleRule(){
				uni.navigateTo({
					url:`/pages/browser/browser?src=${this.ruleurl}`
				})
			},
			
			getAnchorJump(){
				let specialareaOne = uni.createSelectorQuery().select(".specialareaOne");
				specialareaOne.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[0].top = data.top - headerHeight - statusbarHeight + uni.upx2px(48);
					
				}).exec();
				
				let friendsHelp = uni.createSelectorQuery().select(".friendsHelp");
				friendsHelp.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[1].top = data.top - headerHeight - statusbarHeight + uni.upx2px(48);
					
				}).exec();
				
				let rushPurchase = uni.createSelectorQuery().select(".rushPurchase");
				rushPurchase.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[2].top = data.top - headerHeight - statusbarHeight + uni.upx2px(48);
					
				}).exec();
				
				let item0 = uni.createSelectorQuery().select(".item0");
				item0.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[3].top = data.top - headerHeight - statusbarHeight + uni.upx2px(48);
					
				}).exec();
				
				let item1 = uni.createSelectorQuery().select(".item1");
				item1.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[4].top = data.top - headerHeight - statusbarHeight + uni.upx2px(48);
					
				}).exec();
				
				let item2 = uni.createSelectorQuery().select(".item2");
				item2.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[5].top = data.top - headerHeight - statusbarHeight + uni.upx2px(48);
					
				}).exec();
				
			},
			//  锚点跳转
			anchorjump(index){
				let indextop = this.anchorlist[index].top
				uni.pageScrollTo({scrollTop: indextop,duration: 100});
			},
			
			// 前去助力
			gotoHelp(item){
				if(item.status == 4){
					uni.showToast({
						title:'已抢光',
						icon:'none',
						position:'center'
					})
				}else if(item.status == 5){
					uni.showToast({
						title:'活动已结束',
						icon:'none',
						position:'center'
					})
				}else{
					uni.navigateTo({
						url:`/pages/activity/discount/helpdetails/helpdetails?productId=${item.productId}&campaignId=${item.campaignId}`
					})
				}
				
			},
		},
		
	}
</script>

<style lang="scss">
@import './discount11.scss'
</style>
