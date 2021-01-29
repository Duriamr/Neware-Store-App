export default function downNASA(){
	const platform = uni.getSystemInfoSync().platform
	if(platform == 'ios'){
		window.open('https://apps.apple.com/cn/app/id1489450445')
	}else{
		window.open('https://shop.neware.com.cn/GoStore/')
	}
}