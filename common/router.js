function toPath(path){
	uni.navigateTo({
		url:path
	})
}

function back(path){
	uni.navigateBack()
}

function toHome(){
	uni.switchTab({
		url:"/pages/tabBar/home/home"
	})
}

function toGoods(id){
	uni.navigateTo({
		url:"/pages/sort/goods/goods?goodsId="+id,
	})
}

function toLogin(){
	uni.navigateTo({
		url:"/pages/my/login/login"
	})
}
function to401(){
	// #ifdef H5
	this.$downNASA();
	return false;
	// #endif  
	uni.showToast({
	    icon: 'none',
	    position: 'bottom',
	    title: '请登录'
	});
	setTimeout(()=>{
		uni.navigateTo({
			url:"/pages/my/login/login"
		})
	},1000)
}

export {toPath,back,toHome,toGoods,toLogin,to401}