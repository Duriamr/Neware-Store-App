export default function listenPush(type){
	// console.log(plus.push.getClientInfo());
	plus.push.setAutoNotification(true);
	plus.push.addEventListener("click", (msg) => {
		plus.push.clear();
	    if (msg.payload != '' && msg.payload != null && msg.payload != undefined) { //如果透传消息带参数
			if(type == 'show'){
				uni.navigateTo({
					url:msg.payload,
					success: () => {
						return false
					}
				})
				return false
			}else if(type == 'launch'){
				uni.switchTab({
					url:"/pages/tabBar/home/home",
					success: () => {
						uni.navigateTo({
							url:msg.payload,
							success: () => {
								return false
							}
						})
						return false
					}
				})
			}
	    }  
	})  
	// plus.push.addEventListener("receive", function(msg) {  
	//     // iphone 在已打开APP的情况下,通知栏不会弹出消息框,此时需要本地创建一条通知  
	//     console.log(msg);  
	//     if (msg.hasOwnProperty('type') && msg.type != 'click') {  
	//         COMM.createLocalMsg({  
	//             title: msg.title,  
	//             content: msg.content,  
	//             payload: msg.payload  
	//         })  
	//     }  
	
	// })  
}