export default function getCartBadge(){
	uni.request({
		url: this.$url+'/api/shoppingcart/get', 
		header:{
			Authorization:'Bearer '+this.token
		},
		method: "GET",
		
		success: (res) => {
			if(res.data.success&&res.data.code == 200){
				let cartBadge = 0
				for(let i=0;i < res.data.data.length;i++){
					cartBadge += res.data.data[i].quantity
				}
				this.cartBadge = cartBadge
				if(this.cartBadge > 0){
					uni.setTabBarBadge({
						index:3,
						text:String(this.cartBadge)
					})
				}else{
					uni.removeTabBarBadge({
						index:3
					})
				}
			}else{
				uni.removeTabBarBadge({
					index:3
				})
			}
		}
	});
}