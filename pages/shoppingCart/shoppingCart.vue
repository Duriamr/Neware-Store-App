<template>
	<view class="cart_content">
	<!-- #ifdef APP-PLUS || H5 -->
		<view class="cart_header" @touchmove.stop.prevent>
			<view class="status"></view>
			<view class="header">
				<image class="back" src="/static/goods/back_black.png" @tap="$back"/>
				<view>
					购物车
				</view>
				<text v-if="edit == false && onList.length != 0" @tap.stop="showEdit">编辑</text>
				<text v-if="edit == true && onList.length != 0" @tap.stop="hideEdit">完成</text>
			</view>
		</view>
		<view class="header_placeholder"></view>
	<!-- #endif -->
		<!-- 商品列表 -->	
		<view class="goods_ul">
			<empty marginTop="50upx" src="/static/expect/not_ShoppingCart.png" text="购物车竟然是空的" btnShow btnText="去逛逛" @btn="$toHome()" v-if="goodsList.length <= 0" />
			<view class="all_list" v-for="(row,index) in goodsList" :key="index" >
            <view class="goods_list" v-if="row.isInvalid" >
				<!-- 收藏按钮 -->
				<view class="favorite" @tap.stop="toExpect">
					<view class="icon">移入收藏</view>
				</view>
				<!-- 删除按钮 -->
				<view class="delete" @tap.stop="deleteShow(row.id)">
					<view class="icon">删除</view>
				</view>
				<!-- 商品 -->
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
					<!-- checkbox -->
					<view class="checkbox-box" @tap.stop="selected(index)">
						<view class="checkbox" :class="[row.selected?'on':'']"></view>
					</view>
					<!-- 商品信息 -->
					<view class="goods-info">
						<view class="goods_img">
							<image class="img" :src="row.imgUrl" @tap.stop="$toGoods(row.productId)" />
						</view>
						<view class="info">
							<view class="title" @tap.stop="$toGoods(row.productId)">{{row.productName}}</view>
							
							<view class="spec" @tap.stop="getGoods(row.productId,row.quantity,row.id,index)" v-if="row.skuSpce.length != 0">
								<text class="spec_ul">{{row.spec}}</text>
								<image src="/static/shoppingCart/rarrow.png" mode="widthFix" />
							</view>
							
							<view class="price-number">
								<view class="left">
									<text class="currency">￥</text>
									<text class="price">{{row.price}}</text>
								</view>
								<view class="number">
									<image class="sub" src="/static/shoppingCart/sub_no.png" v-if="row.quantity <= row.moq" />
									<image class="sub" src="/static/shoppingCart/sub.png" @tap.stop="sub(index,row.id)" v-if="row.quantity > row.moq" />
									<view class="input" @tap.stop="discard">
										<input type="number" v-model="row.quantity"  @input="sum($event,index)" @blur="inpbl(index,row.id,row.quantity,row.moq)" />
									</view>
									<image class="add" src="/static/shoppingCart/add.png" @tap.stop="add(index,row.id)" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="goods_list" v-if="!row.isInvalid">
				<!-- 收藏按钮 -->
				<view class="favorite" @tap.stop="toExpect">
					<view class="icon">移入收藏</view>
				</view>
				<!-- 删除按钮 -->
				<view class="delete" @tap.stop="deleteShow(row.id)">
					<view class="icon">删除</view>
				</view>
				<!-- 商品 -->
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
					<!-- checkbox -->
					<view class="checkbox-box">
						<view class="off_checkbox" :class="[row.selected?'on':'']"></view>
					</view>
					<!-- 商品信息 -->
					<view class="goods-info">
						<view class="goods_img" :style="{backgroundImage: 'url('+ row.imgUrl +')'}">
							<image class="off" src="/static/shoppingCart/Off.png" mode="widthFix" />
						</view>
						<view class="info">
							<view class="off_title">{{row.productName}}</view>
							<view class="spec" v-if="row.skuSpce.length != 0">
								<text class="spec_ul">{{row.spec}}</text>
								<image src="/static/shoppingCart/rarrow.png" mode="widthFix" />
							</view>
							<view class="price-number">
								<view class="off_left">
									<text class="currency">￥</text>
									<text class="price">{{row.price}}</text>
								</view>
								<view class="number">
									<image class="sub" src="/static/shoppingCart/sub_no.png" />
									<view class="input" @tap.stop="discard">
										<input class="off_input" type="number" v-model="row.quantity" disabled />
									</view>
									<image class="add" src="/static/shoppingCart/add_no.png" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			</view>
        </view>
		
		<guess />
		
		<view class="footer_placeholder" v-if="onList.length != 0"></view>
		<view class="cart_footer" v-if="onList.length != 0">
			<view class="footer">
				<view class="checkbox-box" @tap.stop="allSelect">
					<view class="checkbox" :class="[isAllselected?'on':'']"></view>
					<view class="text">全选</view>
				</view>
				<view class="settlement" v-if="edit == false">
					<view class="sum">
						<view class="total">
							合计：
						</view>
						<view class="currency">
							￥
							</view>
						<view class="money">
						{{sumPrice}}
						</view>
						</view>
					<view class="btn" @tap.stop="toConfirmation">结算({{selectedList.length}})</view>
				</view>
				<view class="btns" v-if="edit == true">
					<!-- <view class="favorite" @tap.stop="toExpect">移入收藏</view> -->
					<view class="delete" @tap.stop="deleteListShow">删除</view>
				</view>
			</view>
			<view class="safety"></view>
		</view>
		
		
		<!--选择规格弹窗-->
		<view class="format" :class="bombFormat" @touchmove.stop.prevent @tap.stop="hideFormat">
			<view class="layer" @tap.stop>
				<view class="cancel" @tap.stop="hideFormat">
					<image src="/static/goods/x.png" />
				</view>
				<view class="layer_content">
					<view class="layer_info">
						<image class="info_img" :src="formatImg" @tap.stop="lookFormatImg(formatImg)" />
						<view class="info_text">
							<view class="money">
								<text class="currency">￥</text>
								<text class="price">{{formatPrice}}</text>
							</view>
							<text class="info_title">{{warning}}</text>
						</view>
					</view>
					
					<scroll-view scroll-y="true" >
						
						<view class="format_box" v-for="(item, index) in productSkuData.specsList" :key="'format'+index">
							<view class="box_title">
								{{item.name}}
							</view>
							
							<view class="format_ul">
								<view class="format_list" :class="item.index == index2 ? 'active':''" v-for="(item2, index2) in item.options" :key="'format_list'+index2" @tap.stop="tabFormat(index,index2)">
									{{item2.name}}
								</view>
							</view>
						</view>
						
						<view class="quantity">
							<view>数量</view>
							
							<view class="number">
								<image class="sub" src="/static/shoppingCart/sub_no.png" v-if="this.quantity <= this.productInfo.moq" />
								<image class="sub" src="/static/shoppingCart/sub.png" @tap.stop="subFormat()" v-if="this.quantity > this.productInfo.moq" />
								
								<view class="input">
									<input type="number" v-model="quantity"  @blur="inpbl()" />
								</view>
							
								<image class="add" src="/static/shoppingCart/add.png" @tap.stop="addFormat()" />
							</view>
						</view>
					</scroll-view>
					
				</view>
				<view class="layer_btns" v-if="formatType == 1">
					<view class="layer_btn" style="background-color: #F75C50;" @tap.stop="modifyFormat">
						确认
					</view>
				</view>
				<view class="layer_btns" v-if="formatType == 2" @tap.stop="hideFormat">
					<view class="layer_btn" style="background-color: #B3B3B3;">
						已售罄
					</view>
				</view>
				<view class="layer_btns" v-if="formatType == 0" @tap.stop="hideFormat">
					<view class="layer_btn" style="background-color: #B3B3B3;">
						暂不销售
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import guess from '@/components/nw-guess/nw-guess';
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {guess,empty},
		data() {
			return {
				token:uni.getStorageSync('token'),
				
				goodsList:[],
				selectedList:[],
				onList:[],
				
				sumPrice:'0.00',
				
				isAllselected:false,
				
				
				//控制滑动效果
				theIndex:null,	
				oldIndex:null,
				isStop:false,
				
				edit:false,
				
				footerbottom:"0upx",
				
				bombFormat:"",//规格弹窗控制开关动画
				productInfo:{},
				quantity:1,
				//规格区
				formatImg:"",//规格图片
				formatPrice:0,//规格价格
				warning:'请选择',//提示
				productSkuData:{
					specsList:[]//规格
				},
				productSkuDtos:[],//所有sku
				relatedProduct:[],//关联商品
				skuArr:[],//sku数组
				skuStr:'',//sku
				formatType:1,
				
				shoppingId:0,
			}
		},
		onLoad() {
			//兼容H5下结算条位置
			// #ifdef H5
				this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight+'px';
			// #endif
		},
		onShow() {
			this.theIndex = null;
			this.oldIndex = null;
			this.token = uni.getStorageSync('token');
			this.getShoppingCart();
			this.hideEdit();
		},
		onBackPress(e){
			if(this.bombFormat==='show'){
				this.hideFormat()
				return true;
			}
		},
		watch:{
			goodsList: function(val){
				let onList = []
				if(this.goodsList.length > 0){
					let len = this.goodsList.length
					for(let i=0; i<len; i++){
						if(this.goodsList[i].isInvalid){
							onList.push(this.goodsList[i])
						}
					}
				}
				this.onList = onList;
			},
			skuStr:function(val){
				if(this.productSkuDtos.length == 0){
					this.formatImg = this.productImage[0]
					this.formatPrice = this.productInfo.salePrice
					this.quantity = parseInt(this.productInfo.cartQuantity)
					this.formatType = 0
					return false
				}
				for(let i=0; i<this.productSkuDtos.length; i++){
					if(val == this.productSkuDtos[i].sku){
						this.formatImg = this.productSkuDtos[i].skuImg
						this.formatPrice = this.productSkuDtos[i].salePrice
						this.quantity = parseInt(this.productInfo.cartQuantity)
						if(this.quantity < parseInt(this.productSkuDtos[i].moq)){
							this.quantity = parseInt(this.productSkuDtos[i].moq)
						}
						if(parseInt(this.productSkuDtos[i].inventory) >= parseInt(this.productSkuDtos[i].moq)){
							this.formatType = 1
						}else{
							this.formatType = 2
						}
						break;
					}else{
						this.formatImg = this.productInfo.productImage[0]
						this.formatPrice = this.productInfo.salePrice
						this.quantity = parseInt(this.productInfo.cartQuantity)
						this.formatType = 0
					}
				}
			}
		},
		methods: {
			getShoppingCart(){
				uni.request({
				    url: this.$url+'/api/shoppingcart/get', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "GET",
				    
				    success: (res) => {
						this.isAllselected = false;
						this.sumPrice = "0.00";
						this.selectedList = [];
						if(res.data.success&&res.data.code == 200){
							this.goodsList = res.data.data
							for(let j=0; j< this.goodsList.length;j++){
								if(this.goodsList[j].quantity < this.goodsList[j].moq){
									this.goodsList[j].quantity = this.goodsList[j].moq
								}
								this.goodsList[j].spec = ''
								for(let i=0; i< this.goodsList[j].skuSpce.length;i++){
									if(i+1!=this.goodsList[j].skuSpce.length){
										this.goodsList[j].spec += this.goodsList[j].skuSpce[i].value + '/'
									}else{
										this.goodsList[j].spec += this.goodsList[j].skuSpce[i].value
									}
								}
							}
							let TabBarBadge = 0;
							for(let i=0;i < res.data.data.length;i++){
								TabBarBadge += res.data.data[i].quantity
							}
							this.TabBarBadge = TabBarBadge;
							if(this.TabBarBadge <= 0){
								uni.removeTabBarBadge({
									index:3,
								})
								return;
							}else{
								uni.setTabBarBadge({
									index:3,
									text:String(this.TabBarBadge)
								})
							}
						}else{
							this.goodsList = [];
							uni.removeTabBarBadge({
								index:3,
							})
						}
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			//控制左滑删除效果-begin
			touchStart(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			touchEnd(index,$event){
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end
			
			
			//跳转确认订单页面
			toConfirmation(){
				let tmpList=[];
				let len = this.goodsList.length;
				for(let i=0;i<len;i++){
					if(this.goodsList[i].selected) {
						tmpList.push(this.goodsList[i]);
					}
				}
				if(tmpList.length<1){
					uni.showToast({
						title:'请选择商品结算',
						icon:'none'
					});
					return ;
				}
				uni.setStorage({
					key:'buylist',
					data:tmpList,
					success: () => {
						uni.navigateTo({
							url:'/pages/order/order'
						})
					}
				})
			},
			deleteShow(id){
				this.deleteGoods(id)
			},
			deleteListShow(){
				let tmpList=[];
				let len = this.goodsList.length;
				for(let i=0;i<len;i++){
					if(this.goodsList[i].selected) {
						tmpList.push(this.goodsList[i]);
					}
				}
				if(tmpList.length<1){
					uni.showToast({
						title:'请选择商品',
						icon:'none'
					});
					return ;
				}
				uni.showModal({
					title: '提示',
					content: '是否确认删除？',
					confirmColor: '#F8B500',
					success: (res) => {
						if (res.confirm){
							this.deleteList()
						}
					}
				})
				
			},
			//删除商品
			deleteGoods(id){
				let len = this.goodsList.length;
				for(let i=0;i<len;i++){
					if(id==this.goodsList[i].id){
						uni.request({
						    url: this.$url+'/api/shoppingcart/delete?ids='+id, 
							header:{
								Authorization:'Bearer '+this.token
							},
							method: "POST",
						    
						    success: (res) => {
								
						    }
						});
						this.goodsList.splice(i, 1);
						break;
					}
				}
				this.selectedList.splice(this.selectedList.indexOf(id), 1);
				this.sum();
				this.oldIndex = null;
				this.theIndex = null;
			},
			// 删除商品s
			deleteList(){
				let len = this.selectedList.length;
				while (this.selectedList.length>0)
				{
					this.deleteGoods(this.selectedList[0]);
				}
				this.selectedList = [];
				this.isAllselected = this.selectedList.length == this.goodsList.length && this.goodsList.length>0;
				this.sum();
				this.hideEdit();
			},
			// 选中商品
			selected(index){
				this.goodsList[index].selected = this.goodsList[index].selected?false:true;
				let i = this.selectedList.indexOf(this.goodsList[index].id);
				i>-1?this.selectedList.splice(i, 1):this.selectedList.push(this.goodsList[index].id);
				this.isAllselected = this.selectedList.length == this.onList.length;
				this.sum();
			},
			//全选
			allSelect(){
				let len = this.goodsList.length;
				let arr = [];
				for(let i=0;i<len;i++){
					if(this.goodsList[i].isInvalid){
						this.goodsList[i].selected = this.isAllselected? false : true;
						arr.push(this.goodsList[i].id);
					}
				}
				this.selectedList = this.isAllselected?[]:arr;
				this.isAllselected = this.isAllselected||this.goodsList.length==0?false : true;
				this.sum();
			},
			// 减少数量
			sub(index,id){
				if(this.goodsList[index].quantity<=1){
					return;
				}
				--this.goodsList[index].quantity;
				uni.request({
				    url: this.$url+'/api/shoppingcart/modify?id='+id+'&quantity='+this.goodsList[index].quantity, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						
				    }
				});
				this.sum();
			},
			// 增加数量
			add(index,id){
				++this.goodsList[index].quantity;
				uni.request({
				    url: this.$url+'/api/shoppingcart/modify?id='+id+'&quantity='+this.goodsList[index].quantity, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						
				    }
				});
				this.sum();
			},
			
			inpbl(index,id,quantity,moq){
				this.goodsList[index].quantity = parseInt(this.goodsList[index].quantity)
				if(quantity < moq){
					uni.showToast({
						title:'本商品最小起订量为'+moq,
						icon:'none',
						position:'center'
					});
					this.goodsList[index].quantity = parseInt(moq)
					this.sum();
					return false;
				}
				uni.request({
				    url: this.$url+'/api/shoppingcart/modify?id='+id+'&quantity='+this.goodsList[index].quantity, 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						
				    }
				});
			},
			// 合计
			sum(e,index){
				this.sumPrice=0;
				let len = this.goodsList.length;
				for(let i=0;i<len;i++){
					if(this.goodsList[i].selected) {
						if(e && i==index){
							this.sumPrice = this.sumPrice + (e.detail.value*this.goodsList[i].price);
						}else{
							this.sumPrice = this.sumPrice + (this.goodsList[i].quantity*this.goodsList[i].price);
						}
					}
				}
				this.sumPrice = this.sumPrice.toFixed(2);
			},
			
			showEdit(){
				this.edit = true
			},
			hideEdit(){
				this.edit = false
			},
			
			discard() {
				//丢弃
			},
			
			getGoods(productId,quantity,shoppingId,goodi){
				this.shoppingId = shoppingId
				uni.request({
				    url: this.$url+'/api/product/get?productId='+productId, 
					method: "GET",
				    
				    success: (res) => {
						uni.hideNavigationBarLoading()
						if(res.data.success&&res.data.code == 200){
							if(res.data.data.productSkuData == null || res.data.data.productSkuData == ''){
								res.data.data.productSkuData = {
									specsList:[]
								}
							}
							if(res.data.data.productSkuDtos == null || res.data.data.productSkuDtos == ''){
								res.data.data.productSkuDtos = []
							}
							this.warning = '请选择'
							this.skuArr = []
							if(res.data.data.productSkuData.specsList.length > 0){
								for(let i=0; i<res.data.data.productSkuData.specsList.length; i++){
									for(let j=0;j<this.goodsList[goodi].skuSpce.length; j++){
										if(res.data.data.productSkuData.specsList[i].name===this.goodsList[goodi].skuSpce[j].name){
											for(let x=0;x<res.data.data.productSkuData.specsList[i].options.length; x++){
												if(res.data.data.productSkuData.specsList[i].options[x].name===this.goodsList[goodi].skuSpce[j].value){
													res.data.data.productSkuData.specsList[i].index = x
													this.skuArr.push(res.data.data.productSkuData.specsList[i].code+'-'+res.data.data.productSkuData.specsList[i].options[x].code)
												}
											}
										}
									}
									
									// res.data.data.productSkuData.specsList[i].index = 0
									// this.skuArr.push(res.data.data.productSkuData.specsList[i].code+'-'+res.data.data.productSkuData.specsList[i].options[0].code)
									this.warning = this.warning+res.data.data.productSkuData.specsList[i].name
								}
							}
							res.data.data.cartQuantity = quantity
							this.productInfo = res.data.data;
							this.productSkuData = res.data.data.productSkuData
							this.productSkuDtos = res.data.data.productSkuDtos
							this.skuStr = this.productInfo.productCode +'-'+ this.skuArr.join('-')
							this.showFormat()
						}
				    },
					fail: (err) => {
						uni.hideNavigationBarLoading()
						this.$requestFail()
					}
				});
			},
			tabFormat(i,j){
				this.productSkuData.specsList[i].index = j
				this.skuArr[i] = this.productSkuData.specsList[i].code+'-'+this.productSkuData.specsList[i].options[j].code
				this.skuStr = this.productInfo.productCode +'-'+ this.skuArr.join('-')
			},
			//规格弹窗
			showFormat() {
				uni.hideTabBar();
				this.bombFormat = 'show';
			},
			//关闭规格弹窗
			hideFormat() {
				this.bombFormat = 'hide';
				setTimeout(() => {
					this.bombFormat = 'none';
					uni.showTabBar();
				}, 200);
			},
			subFormat(){
				if(this.quantity<=1){
					return;
				}
				this.quantity--;
			},
			
			addFormat(){
				this.quantity++;
			},
			modifyFormat(){
				uni.showLoading({title:'正在修改'})
				uni.request({
				    url: this.$url+'/api/shoppingcart/updateshoppingcart', 
					header:{
						Authorization:'Bearer '+this.token
					},
					data: {
						"shoppingCartDetailId": this.shoppingId,
						"quantity": this.quantity,
						"sku": this.skuStr
				    },
					method: "POST",
				    success: (res) => {
						uni.hideLoading();
						if(res.data.success&&res.data.code == 200){
							uni.showToast({title: "修改成功"})
							this.getShoppingCart()
							this.hideFormat()
						}
						else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
						}
				    },
					fail: (err) => {
						uni.hideLoading();
						this.$requestFail()
					}
				});
			},
			lookFormatImg(img){
				let imgs = [img]
				this.$previewImg(0,imgs)
			}
		}
	}
</script>

<style lang="scss">
	@import "../tabBar/shoppingCart/shoppingCart.scss";
	.footer_placeholder{
		height: 126upx;
	}
</style>