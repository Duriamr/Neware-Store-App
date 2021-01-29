export default function requestFail(){
	uni.hideNavigationBarLoading()
	uni.hideLoading()
	if(this.$failOff){
		return false
	}
	this.$failOff = true
	uni.navigateTo({
		url:"/pages/expect/notNet"
	})
	return false
}