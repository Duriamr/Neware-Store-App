<template>
	<view class="address_content">
		<view class="addres_main">
			<empty marginTop="200upx" src="/static/expect/not_Address.png" text="您还没有收货地址" v-if="addressList.length <= 0" />
		    <view class="addres_list" v-for="(item,index) in addressList" :key="index" @tap="select(item)">
				<!-- 收藏按钮 -->
				<view class="favorite" @tap.stop="setDefault(item.id)">
					<view class="icon">设为默认</view>
				</view>
				<!-- 删除按钮 -->
				<view class="delete" @tap.stop="deleteGoods(item.id)">
					<view class="icon">删除</view>
				</view>
				<!-- 商品 -->
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
					<view class="left">
						<view class="main">
							<view class="top">
								<text>{{item.receiverName}}</text>
								<text>{{item.phone}}</text>
								<view class="default" v-if="item.default == true">
									默认
								</view>
							</view>
							<view class="bot">
								<text>{{item.province}}&#8194;{{item.city}}&#8194;{{item.area}}&#8194;{{item.detailedAddress}}</text>
							</view>
						</view>
					</view>
					<view class="right">
						<image src="/static/public/edit.png" @tap.stop="edit(item)" />
					</view>
				</view>
			</view>
		</view>
		<view class="footer_placeholder"></view>
		<view class="footer">
			<view class="btn" @tap="add">
				新增收货地址
			</view>
		</view>
	</view>
</template>
<script>
	import empty from '@/components/nw-empty/nw-empty';
	export default {
		components: {empty},
		data() {
			return {
				token:uni.getStorageSync('token'),
				
				isSelect:false,
				addressList:[],
				//控制滑动效果
				theIndex:null,	
				oldIndex:null,
				isStop:false,
				
			};
		},
		onLoad(option) {
			if(option.type=='select'){
				this.isSelect = true;
			}
		},
		onShow(){
			this.token = uni.getStorageSync('token');
			this.getAddressList();
		},
		onBackPress(){
			if(this.addressList.length == 0){
				uni.removeStorageSync('selectAddress');
			}
		},
		methods:{
			getAddressList(){
				uni.request({
				    url: this.$url+'/api/delivery-address/useraddress-multi', 
					header:{
						Authorization:'Bearer '+this.token
					},
					method: "POST",
				    
				    success: (res) => {
						this.addressList = res.data.data
				    },
					fail: (err) => {
						this.$requestFail()
					}
				});
			},
			
			edit(item){
				uni.setStorage({
					key:'address',
					data:item,
					success() {
						uni.navigateTo({
							url:"/pages/order/address/addedit/addedit?type=edit"
						})
					}
				});
			},
			
			add(){
				if(this.addressList.length < 10){
					uni.navigateTo({
						url:"/pages/order/address/addedit/addedit?type=add"
					})
				}else{
					uni.showModal({
						title:'提示',
						content:'最多10个收货地址',
						showCancel:false,
						confirmColor: '#F8B500',
					})
				}
			},
			
			select(item){
				//是否需要返回地址(从订单确认页跳过来选收货地址)
				if(!this.isSelect){
					return false;
				}
				uni.setStorage({
					key:'selectAddress',
					data:item,
					success() {
						uni.navigateBack();
					}
				})
			},
			
			setDefault(id){
				uni.showModal({
					title: '提示',
					content: '是否设为默认地址',
					confirmColor: '#F8B500',
					success: (res)=>{
						if(res.confirm){
							uni.request({
							    url: this.$url+'/api/delivery-address/set-default-address?id='+id, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									uni.showToast({
									    icon: 'none',
										position: 'bottom',
									    title: '设置成功'
									});
									this.getAddressList();
							    },
								fail: (err) => {
									this.$requestFail()
								}
							});
						}else if(res.cancel){
							uni.showToast({
							    icon: 'none',
								position: 'bottom',
							    title: '已取消'
							});
						}
					}
				});
				this.oldIndex = null;
				this.theIndex = null;
			},
			deleteGoods(id){
				uni.showModal({
					title: '提示',
					content: '你将删除这个收货地址',
					confirmColor: '#F8B500',
					success: (res)=>{
						if(res.confirm){
							uni.request({
							    url: this.$url+'/api/delivery-address/delete?id='+id, 
								header:{
									Authorization:'Bearer '+this.token
								},
								method: "POST",
							    
							    success: (res) => {
									uni.showToast({
									    icon: 'none',
										position: 'bottom',
									    title: '删除成功'
									});
									this.getAddressList();
							    },
								fail: (err) => {
									this.$requestFail()
								}
							});
						}else if(res.cancel){
							uni.showToast({
							    icon: 'none',
								position: 'bottom',
							    title: '已取消'
							});
						}
					}
				});
				this.oldIndex = null;
				this.theIndex = null;
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

		}
	}
</script>

<style lang="scss">
	@import "./address.scss";
</style>