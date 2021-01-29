export default function scanCode(){
	let token = uni.getStorageSync('token');
	uni.scanCode({
		success:  (res) => {
			let resultStr = res.result.toLowerCase()
			if(resultStr.substr(0,1) == '{'){
				let resultObj = JSON.parse(resultStr)
				if(resultObj.type == 1 ){
					//  跳转内部页面
					if(resultObj.islogin == 'false'){
						uni.navigateTo({url:resultObj.url})
					}else{
						if(token!=''&&token!=NaN&&token!=null&&token!=undefined){
							uni.navigateTo({url:resultObj.url})
						}else{
							this.$to401()
						}
					}
				}else if(resultObj.type == 2){
					//  跳转外部页面
					if(resultObj.islogin == 'false'){
						uni.navigateTo({
							url:"/pages/browser/browser?src="+resultObj.url
						})
					}else{
						if(token!=''&&token!=NaN&&token!=null&&token!=undefined){
							let ID = 1
							if(resultObj.id!=undefined&&resultObj.id!=''&&resultObj.id!=null){
								ID = resultObj.id
							}
							uni.navigateTo({
								url:"/pages/browser/browser2?src="+resultObj.url+"&id="+ID
							})
						}else{
							this.$to401()
						}
					}
				}else if(resultObj.type == 3 ){
					//  跳转授权页面
					uni.navigateTo({
						url:"/pages/activity/authorization/authorization?res="+res.result
					})
				}else if(resultObj.type == 4 ){
					let param = JSON.parse(resultObj.param)
					uni.request({
						url: this.$url+'/api/live/issignupv2?promotionalActivityId='+param.id, 
						header:{
							Authorization:'Bearer '+token
						},
						method: "GET",
						success: (res) => {
							if(res.data.success&&res.data.code == 200&&res.data.data){
								uni.request({
									url: this.$url+'/api/appuser/app-authorization?uuid='+resultObj.uid,
									header:{
										Authorization:'Bearer '+token
									},
									method: "GET",
									success: () => {
										uni.showToast({title: '扫码成功！'});
									}
								});
							}else{
								uni.navigateTo({
									url:"/pages/activity/live/offline?id="+param.id+"&uuid="+resultObj.uid
								}) 
							}
						},
						fail: (err) => {
							this.$requestFail()
						}
					});
					
				}
			}else {
				plus.runtime.openURL(res.result)
			}
		}
	});
}