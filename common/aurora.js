export default function aurora(){
	const jv = uni.requireNativePlugin('JG-JVerification');
	jv.init({
		timeout:3000,
		isProduction:false,
	},res=>{
		console.log(res)
	});
	jv.checkVerifyEnable(res=>{
		console.log(res)
	})
	jv.preLogin(3000,res=>{
		console.log(res)
	});
}