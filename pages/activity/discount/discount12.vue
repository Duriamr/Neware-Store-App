<template>
	<view class="warp">
		<view class="discount">
			<view class="header" style="height: 1034upx;">
				<image :src="item" v-for="(item,index) in topImageList" :key='index'  class="headerImg"/>
				<text class="activityrules" @tap.stop='searchRule'>活动规则</text>
			</view>
			<view class="content">
				<!-- 锚点列表 -->
				<view class="anchorPointList">
					<image class="item" :src="item" v-for="(item,index) in herfList" :key="'1'+index" @tap.stop="anchorjump(index)"/>
				</view>
				<!-- 实验礼包 -->
				<view class="giftPack" v-if='giftPackList &&  giftPackList.products && giftPackList.products.length > 0'>
					<view 
					class="prodcutList"
					v-for="(item,index) in giftPackList.products" :key="'2'+index"
					:style="{backgroundImage: 'url(' +item.mainImgUrl+')',backgroundSize:'100% 100%'}"
					@tap.stop='rushPurchase(true,item)'
					>
						<text :class="item.status == 4 || item.status == 5?'active':'btn'" 
						 @tap.stop='rushPurchase(true,item)'
						>{{['立即抢购','继续邀请','助力成功','助力失败','已抢光','活动结束','活动未开始'][item.status]}}></text>
					</view>
				</view>
				<!-- 爆款 -->
				<view class="hotMoney" v-if="hotMoneyList">
					<image :src="hotMoneyList.imageUrl" class="hotMoneyImg"/>
					<view class="prodcutList" v-if="hotMoneyList.products && hotMoneyList.products.length > 0">
						<view class="productItem" v-for="(item,index) in hotMoneyList.products" :key="'3'+index">
							<image :src="item.mainImgUrl" class="productTop" @tap.stop='searchProductDetaile(item)'/>
							<view  class="productBtm"  @tap.stop='rushPurchase(true,item)'>
								<view class="price">
									<text class="originalprice">原价: ￥{{item.price}}</text>
									<text class="number">2件(400套)仅:￥</text>
									<text class="discountPrice">{{item.discountPrice}}</text>
								</view>
								<text :class="item.status == 4 || item.status == 5?'active':'btn'" 
								>{{['立即抢购','继续邀请','助力成功','助力失败','已抢光','活动结束','立即抢购'][item.status]}} ></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 科研助力 -->
				<view class="help" v-if="helpList">
					<image :src="helpList.imageUrl" class="hotMoneyImg"/>
					<view class="prodcutList" v-if="helpList.products && helpList.products.length > 0">
						<view class="productItem" v-for="(item,index) in helpList.products" :key="'4'+index">
							<image :src="item.mainImgUrl" class="productTop" @tap.stop='searchProductDetaile(item)'/>
							<view  class="productBtm"  @tap.stop='rushPurchase(false,item,1)'>
								<view class="productSku" v-if='item.number'>
									<view>{{item.name}}</view>
									<view>（{{item.number}}</view>
								</view>
								<view class="productSku" v-else style="line-height: 64upx;">
									<view>{{item.name}}</view>
								</view>
								<view class="price">
									<text class="originalprice">￥{{item.price}}</text>
									<text class="helpNumber">邀{{item.helpNumber}}名好友仅需 ￥</text>
									<text class="discountPrice">{{item.discountPrice}}</text>
								</view>
								<text :class="item.status == 4 || item.status == 5 ?'active':'btn'"
								>{{['立即抢购','继续邀请','助力成功','助力失败','已抢光','活动结束','立即抢购'][item.status]}} ></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 呼朋唤友 -->
				<view class="hupeng" v-if="hupengList">
					<image :src="hupengList.imageUrl" class="hotMoneyImg"/>
				
					<view  class="prodcutList"  v-if="hupengList.products && hupengList.products.length > 0">
						<!-- 第一件商品 -->
						<view style="margin-bottom: 22upx;" class="oneProductItem" v-for="(item,index) in hupengList.products.slice(0,1)" :key="'5'+index">
							<image :src="item.mainImgUrl" class="productTop" @tap.stop='searchProductDetaile(item)'/>
							<view  class="productBtm" style="padding: 0 32upx;" @tap.stop='rushPurchase(false,item,2)'>
								<view class="price">
									<text class="originalprice">￥{{item.price}}</text>
									<text class="number">邀{{item.helpNumber}}名好友仅需:￥</text>
									<text class="discountPrice">{{item.discountPrice}}</text>
								</view>
								<text :class="item.status == 4 || item.status == 5 ?'active':'btn'"
								>{{['立即抢购','继续邀请','助力成功','助力失败','已抢光','活动结束','立即抢购'][item.status]}} ></text>
							</view>
						</view>
						<view  class="productItem" v-for="(item,index) in hupengList.products.slice(1,hupengList.products.length)" :key="'6'+index">
							<image :src="item.mainImgUrl" class="productTop" @tap.stop='searchProductDetaile(item)'/>
							<view  class="productBtm"  @tap.stop='rushPurchase(false,item,2)'>
								<view class="productSku" v-if='item.number'>
									<view>{{item.name}}</view>
									<view>（{{item.number}}</view>
								</view>
								<view class="productSku" v-else style="line-height: 64upx;">
									<view>{{item.name}}</view>
								</view>
								<view class="price">
									<text class="originalprice">￥{{item.price}}</text>
									<text class="helpNumber">邀{{item.helpNumber}}名好友仅需 ￥</text>
									<text class="discountPrice">{{item.discountPrice}}</text>
								</view>
								<text :class="item.status == 4 || item.status == 5?'active':'btn'"
								>{{['立即抢购','继续邀请','助力成功','助力失败','已抢光','活动结束','立即抢购'][item.status]}} ></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 9.9包邮 -->
				<view class="hupeng freeshipping" v-if="freeShipping">
					<image :src="freeShipping.imageUrl" class="hotMoneyImg"/>
					<view  class="prodcutList"  v-if="freeShipping.products && freeShipping.products.length > 0">
						<!-- 第一件商品 -->
						<view class="oneProductItem" v-for="(item,index) in freeShipping.products.slice(0,1)" :key="'7'+index">
							<image :src="item.mainImgUrl" class="productTop" @tap.stop='searchProductDetaile(item)'/>
							<view  class="productBtm" style="justify-content: space-between;padding: 0 49upx;"  @tap.stop='rushPurchase(true,item)'>
								<text class="originalprice" style="margin-top: 27upx;">￥{{item.price}}</text>
								<view class="price">
									<text class="number">仅￥</text>
									<text class="discountPrice">{{item.discountPrice}}</text>
								</view>
								<text :class="item.status == 4 || item.status == 5 ?'active':'btn'"
								>{{['立即抢购','继续邀请','助力成功','助力失败','已抢光','活动结束','立即抢购'][item.status]}} ></text>
							</view>
						</view>
						<view style="margin-top: 25upx;" class="productItem" v-for="(item,index) in freeShipping.products.slice(1,freeShipping.products.length)" :key="'8'+index">
							<image :src="item.mainImgUrl" class="productTop" @tap.stop='searchProductDetaile(item)'/>
							<view  class="productBtm"  @tap.stop='rushPurchase(true,item)'>
								<view class="productSku">
									<view>{{item.productName}}</view>
								</view>
								<view class="price">
									<text class="originalprice">￥{{item.price}}</text>
									<text class="helpNumber">仅￥</text>
									<text class="discountPrice">{{item.discountPrice}}</text>
								</view>
								<text :class="item.status == 4 || item.status == 5?'active':'btn'"
								>{{['立即抢购','继续邀请','助力成功','助力失败','已抢光','活动结束','立即抢购'][item.status]}} ></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 热销电解液 -->
				<view class="help electrolyte" v-if="hotSellingElectrolyte">
					<image :src="hotSellingElectrolyte.imageUrl" class="hotMoneyImg"/>
					<view class="prodcutList" v-if="hotSellingElectrolyte.products && hotSellingElectrolyte.products.length > 0">
						<view class="productItem" v-for="(item,index) in hotSellingElectrolyte.products" :key="'9'+index">
							<image :src="item.mainImgUrl" class="productTop" @tap.stop='searchProductDetaile(item)'/>
							<view  class="productBtm"  @tap.stop='rushPurchase(true,item)'>
								<view class="productSku" v-if='item.number'>
									<view>{{item.name}}</view>
									<view>（{{item.number}}</view>
								</view>
								<view class="productSku" v-else style="line-height: 64upx;">
									<view>{{item.name}}</view>
								</view>
								<view class="price">
									<text class="originalprice">￥{{item.price}}</text>
									<text class="helpNumber">两件仅 ￥</text>
									<text class="discountPrice">{{item.discountPrice}}</text>
								</view>
								<text :class="item.status == 4 || item.status == 5?'active':'btn'"
								>{{['立即抢购','继续邀请','助力成功','助力失败','已抢光','活动结束','立即抢购'][item.status]}} ></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="footer" v-if="downImageList && downImageList.length > 0">
				<image :src="item" v-for="(item,index) in downImageList" :key='index' mode="widthFix" width='100%' class="footerImg"/>
			</view>
		</view>
		
		<!-- 分享 -->
		<!-- #ifdef APP-PLUS -->  
		<share :shareShow='shareShow' :shareObj='shareObj' @hideShare='$hideShare()'></share>
		<!-- #endif --> 
		<!-- #ifdef H5 -->
		<h5Footer />
		<!-- #endif --> 
	</view>
</template>

<script>
	import share from '@/components/nw-share/nw-share';
	import h5Footer from '@/components/nw-h5-footer/nw-h5-footer';
	export default{
		components:{
			share,
			h5Footer
		},
		data(){
			return{
				userId:uni.getStorageSync('onlyID')||0,
				topImageList:[],  // 顶部图片  
				downImageList:[], // 底部图片
				ruleUrl:'', // 规则链接
				herfList:[
					'https://file.neware.com.cn/posters/bb7d4e9cd60d475e8552489259998fc3.png',
					'https://file.neware.com.cn/posters/c0d06f8900074ddfafc8f4ff97b498eb.png',
					'https://file.neware.com.cn/posters/363acf28d87240a3a15fab984e9269cc.png',
					'https://file.neware.com.cn/posters/1deb9b3554464ae0a1c5318275c23b77.png',
					'https://file.neware.com.cn/posters/b18bd4cd1d83448bb45309046826a53d.png',
					'https://file.neware.com.cn/posters/8430234e671c4f98ad38f78c90ba5139.png',
				],  // 跳转列表
				giftPackList:"",  // 实验礼包
				hotMoneyList:"", // 爆款
				helpList:'', // 科研助力
				hupengList:'', //呼朋唤友
				freeShipping:'', // 9.9包邮
				hotSellingElectrolyte:'', //热销电解液
				anchorlist: [
					{top:0},
					{top:0},
					{top:0},
					{top:0},
					{top:0},
					{top:0},
				],
				isStart:'', // 活动是否开始
				
				//分享区
				shareShow:'',
				shareObj:{
					title:'研选双12×年终盛典',
					summary:'精选23款实验材料低至0元！全场包邮！',
					href:this.$h5Url+'/pages/activity/discount/discount12',
					imageUrl:'https://file.neware.com.cn/activityzone/70dea222ad8e4749b9d57dcc7dba77cf.jpg',
				}
			}
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.$showShare()
			}
		},
		onShow() {
			this.userId = uni.getStorageSync('onlyID')||0
			this.getActivity()
		},
	
		//下拉刷新
		onPullDownRefresh() {
			this.getActivity()
		},
	
		methods:{
			// 获取活动数据
			getActivity(){
				uni.request({
					url:this.$url+'/api/campaignnew/twelvecampaign?userId='+this.userId,
					method:'get',
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							this.topImageList = res.data.data.topImageList
							this.downImageList =  res.data.data.downImageList
							this.ruleUrl = res.data.data.rule
							if(res.data.data.campaignNewDetailDtos && res.data.data.campaignNewDetailDtos.length > 0){
								uni.stopPullDownRefresh()
								res.data.data.campaignNewDetailDtos.forEach(item =>{
									switch(item.type){
										case 3:
											this.giftPackList = item
										break;
										case 4:
											this.hotMoneyList = item
										break;
										case 5:
											this.helpList = item
										break;
										case 6:
											this.hupengList = item
										break;
										case 7:
											this.freeShipping = item
										break;
										case 8:
											this.hotSellingElectrolyte = item
										break;
									}
								})
								this.helpList.products.forEach(item =>{
									item.name = item.productName.split('（')[0]
									item.number = item.productName.split('（')[1] 
								})
								this.hupengList.products.forEach(item =>{
									item.name = item.productName.split('（')[0]
									item.number = item.productName.split('（')[1] 
								})
								this.hotSellingElectrolyte.products.forEach(item =>{
									item.name = item.productName.split('（')[0]
									item.number = item.productName.split('（')[1] 
								})
									
							}
						}
					}
				})
			},
			// 查看规则
			searchRule(){
				uni.navigateTo({ 
					url:`/pages/browser/browser?src=${this.ruleUrl}`
				})
			},
			// 查看详情图
			searchProductDetaile(data){
				uni.navigateTo({
					url:'/pages/activity/discount/productDetaile/productDetaile?cid='+data.campaignId+'&pid='+data.productId
				})
			},
			// 前去下单
			async rushPurchase(bol,data,type){
				if(data.status == 4){
					uni.showToast({
						title:'已抢光',
						icon:'none',
						position:'center'
					})
					return false
				}
				/*  true 非助力 false 助力 */
				uni.request({
					url:this.$url+'/api/campaignnew/campaigstatus?campaignId='+data.campaignId,
					method:'get',
					success: (res) => {
						if(res.data.code == 200 && res.data.success){
							if(res.data.data){
								if(bol){
									// #ifdef H5
										this.$downNASA()
										return false
									// #endif  
									if(!uni.getStorageSync('token')){
										this.$to401()
										return  false
									}
									let num = 0
									uni.navigateTo({
										url:'/pages/activity/discount/order/order?helpId='+num+'&cid='+data.campaignId+'&pid='+data.productId+'&data='+JSON.stringify(data)
									})
								}else{
									uni.navigateTo({
										url:`/pages/activity/discount/helpdetails/helpdetails?productId=${data.productId}&campaignId=${data.campaignId}&type=${type}`
									})
								}
							}else{
								if(data.status == 5){
									uni.showToast({
										title:'活动已结束',
										icon:'none',
										position:'center'
									})
								}else if(data.status == 6){
									uni.showToast({
										title:'活动未开始',
										icon:'none',
										position:'center'
									})
								}
							}
						}else if(res.data.code == 401){
							this.$to401()
						}
					}
				})
			
			},
			
		
			
			// 锚点跳转
			async anchorjump(index){
				 this.getAnchorJump()
				let indextop = this.anchorlist[index].top
				uni.pageScrollTo({scrollTop: indextop,duration: 100});
			},
			getAnchorJump(){
				let giftPack = uni.createSelectorQuery().select(".giftPack");
				giftPack.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[0].top = data.top - headerHeight - statusbarHeight;
				}).exec();
				
				let hotMoney = uni.createSelectorQuery().select(".hotMoney");
				hotMoney.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[1].top = data.top - headerHeight - statusbarHeight - uni.upx2px(48) + 25;
				}).exec();
				
				let help = uni.createSelectorQuery().select(".help");
				help.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[2].top = data.top - headerHeight - statusbarHeight - uni.upx2px(48) + 25;
					
				}).exec();
				
				let hupeng = uni.createSelectorQuery().select(".hupeng");
				hupeng.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[3].top = data.top - headerHeight - statusbarHeight - uni.upx2px(48) + 25;
					
				}).exec();
				
				let freeshipping = uni.createSelectorQuery().select(".freeshipping");
				freeshipping.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[4].top = data.top - headerHeight - statusbarHeight - uni.upx2px(48) + 25;
					
				}).exec();
				
				let electrolyte = uni.createSelectorQuery().select(".electrolyte");
				electrolyte.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
						statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(88);
					this.anchorlist[5].top = data.top - headerHeight - statusbarHeight - uni.upx2px(48) + 25;
				}).exec();
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import './discount12.scss'
</style>
