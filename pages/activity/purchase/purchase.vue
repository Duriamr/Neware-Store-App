<template>
	<view>
		<image class="header" :src="item" mode="widthFix" v-for="(item, index) in header"  :key="'header-'+index" />
		<view class="purchase_content">
			<image class="centre" :src="item" mode="widthFix" v-for="(item, index) in centre"  :key="'centre-'+index" />
			<view class="product" :style="{backgroundImage: 'url('+ item +')'}" v-for="(item, index) in main" :key="'main-'+index">
				
				<view class="productList" v-for="(item2, index2) in product" :key="'product-'+index2">
					<view class="left">
						<view class="productTitle" v-html="item2.productName"></view>
					</view>
					
					
					<view class="right">
						<view class="input" >
							<input v-model="item2.model" type="number" placeholder="输入购买数量" @blur="QlBlur(index2,$event)" />
						</view>
						<view>台</view>
					</view>

				</view>
				
				<view class="total">
					共计：<view class="text">{{sum}}</view>台
				</view>
				
				<view class="title">
					请选择您要的赠品规格
				</view>
				<view class="subTitle">
					304纽扣电池壳四件套（含正负极、漏斗弹片、垫片）
				</view>
				
				<view class="productGroup">
					<view class="list" v-for="(item2, index2) in productGroup" :key="'productGroup-'+index2" @tap="spotProductGroup(index2)">
						<image :src="item2.mainImgUrl" mode="widthFix" />
						<view class="bot">
							<view class="radio">
								<view :class="index2 == productGroupCurrent ? 'spot' : ' '"></view>
							</view>
							<view>{{item2.productName}}</view>
						</view>
					</view>
				</view>
				
				<image class="button" src="/static/activity/purchase/button.png" mode="widthFix" @tap="Confirmation(index)" />
			</view>
			
			<view class="tell">
				*如想要采购其他毫安设备，请联系您的销售经理
			</view>
			
			<image class="foot" :src="item" mode="widthFix" v-for="(item, index) in foot"  :key="'foot-'+index" />
			
			<view class="law" style="margin-bottom: 50upx;">
				在法律允许的最大范围内，深圳市新威尔电子有限公司拥有解释权
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
				token:uni.getStorageSync('token'),
				//图片区
				header:[],
				centre:[],
				foot:[],
				main:[],
				
				product:[],
				selected:[],
				sum:0,
				productGroup:[],
				productGroupCurrent:0,
				
				loginType:false,
				
				once:false,
				
				//分享区
				shareShow:'',
				shareObj:{
					title:'科研人专享•采购有礼',
					summary:'采购即送400套纽扣电池壳！助力科研！速来→',
					href:this.$h5Url+'/pages/activity/purchase/purchase',
					imageUrl:'https://file.neware.com.cn/share/share.png',
				}
			};
		},
		onLoad() {
			this.getLoadData()
		},
		onShow() {
			this.token = uni.getStorageSync('token');
			this.getUser();
			this.once = false;
		},
		onNavigationBarButtonTap(val){
			if (val.index == 0) {
				this.$showShare()
			}
		},
		methods:{
			getUser(){
				uni.request({
				    url: this.$url+'/api/appuser/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							this.loginType = true
						}else{
							this.loginType = false
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			getLoadData(){
				uni.request({
				    url: this.$url+'/api/campaign/infov2', 
					method: "GET",
				    
				    success: (res) => {
						this.header = res.data.data.imageUrls.header;
						this.centre = res.data.data.imageUrls.centre;
						this.main.push(res.data.data.productCampaignInfoDtos[0].imgUrl.mainImgUrl)
						this.foot = res.data.data.imageUrls.foot;
						for(let i=0; i<res.data.data.productCampaignInfoDtos.length; i++){
							res.data.data.productCampaignInfoDtos[i].quantity = 0
							res.data.data.productCampaignInfoDtos[i].model = ''
						};
						this.product = res.data.data.productCampaignInfoDtos;
						this.productGroup = res.data.data.productGroupInfoDtos
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			QlBlur(index,e){
				if(e.detail.value == '' || e.detail.value == 0){
					this.product[index].model = ''
					this.product[index].quantity = 0
				}else{
					this.product[index].model = this.product[index].quantity = Math.round(Math.abs(e.detail.value))
				}
				this.selected = []
				this.sum = 0
				for(let j=0; j<this.product.length; j++){
					if(this.product[j].quantity != 0){
						this.selected.push({
							imgUrl:this.product[j].imgUrl.productImgUrl,
							productName:this.product[j].productName,
							price:this.product[j].price,
							quantity:this.product[j].quantity,
							productId:this.product[j].productId
						})
					}
					this.sum += this.product[j].quantity
				}
			},
			spotProductGroup(index){
				this.productGroupCurrent = index
			},
			Confirmation(index){
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif
				if(this.once){
					return false;
				}
				if(this.loginType){
					let p = this.productGroupCurrent
					let giveQuantity = 0
					if(this.selected.length === 0){
						uni.showToast({
							title:'请选择设备',
							icon:'none',
							position:'center'
						});
						return false
					}else if(this.sum < 5){
						uni.showToast({
							title:'最小采购量为5台',
							icon:'none',
							position:'center'
						});
						return false
					}
					giveQuantity = Math.floor(this.sum / 5) * 200
					this.once = true
					uni.showLoading({
						title:'订单创建中'
					});
					setTimeout(()=>{
						uni.hideLoading();
						let group = {
							imgUrl:this.productGroup[p].mainImgUrl,
							productName:this.productGroup[p].productName,
							price:0,
							quantity:giveQuantity,
							giveProductId:this.productGroup[p].productId,
							sku:'',
							skuSpce:[]
						}
						let buylist = []
						for(let q=0; q<this.selected.length; q++){
							this.selected[q].sku = ''
							this.selected[q].skuSpce = []
							buylist.push(this.selected[q])
						}
						buylist.push(group)
						uni.setStorage({
							key:'buylist',
							data:buylist,
							success: () => {
								uni.navigateTo({
									url:'/pages/order/order?type=purchase'
								})
							}
						})
					},1000)
				}else{
					this.$to401()
				}
			},
		},
		
	}
</script>

<style lang="scss">
	@import "./purchase.scss"
</style>
