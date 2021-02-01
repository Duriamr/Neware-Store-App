<script>
	let token = uni.getStorageSync('token');
	export default {
		onLaunch: function() {
			if(token!=''&&token!=null&&token!=undefined){
				uni.request({ 
				    url: this.$url+'/api/appuser/get',
					header:{
						Authorization:'Bearer '+token
					},
					method: "GET",
				    success: (res) => {
						if(res.data.success&&res.data.code == 200){
							uni.setStorageSync('myAvatar', res.data.data.headImg);
							uni.setStorageSync('onlyID', res.data.data.userId);
							uni.setStorageSync('myID', res.data.data.userUniqueId);
							uni.setStorageSync('myNickname', res.data.data.nickname);
						}else{
							uni.removeStorageSync('token');
							uni.removeStorageSync('myAvatar');
							uni.removeStorageSync('onlyID');
							uni.removeStorageSync('myID');
							uni.removeStorageSync('myNickname');
							uni.removeStorageSync('messageList');
						}
				    }
				});
			}else{
				uni.removeStorageSync('myAvatar');
				uni.removeStorageSync('onlyID');
				uni.removeStorageSync('myID');
				uni.removeStorageSync('myNickname');
				uni.removeStorageSync('messageList');
			}
			// #ifdef APP-PLUS  
			plus.runtime.setBadgeNumber(0)
			this.$aurora()
			this.$pushType = 'launch'
			if(this.$pushType == 'launch'){
				this.$listenPush(this.$pushType);
			}
			// #endif  
		},
		onShow: function() {
			uni.request({
			    url: this.$url+'/api/appuser/signin-duration', 
				header:{
					Authorization:'Bearer '+token
				},
				data:{
					"type": 0
				},
				method: "POST",
			    
			    success: (res) => {
					if(res.data.success&&res.data.code == 200){
						console.log('Timing Begins')
					}
			    }
			});
			// let myID = uni.getStorageSync('myID')
			// if(myID != ''){
			// 	this.$goEasy.connect({
			// 		userId: myID,
			// 	    onSuccess: function () {  //连接成功
			// 	        console.log("GoEasy successfully") //连接成功
			// 	    },
			// 	    onFailed: function (error) { //连接失败
			// 	        console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
			// 	    },
			// 	    onProgress:function(attempts) { //连接或自动重连中
			// 	        console.log("GoEasy is connecting", attempts);    
			// 	    }
			// 	});
			// 	this.$goEasy.subscribe({
			// 	    channel: "App",//替换为您自己的channel
			// 	    onMessage: function (message) {
			// 	        console.log("Channel:" + message.channel + " content:" + message.content);
			// 	    },
			// 	    onSuccess: function () {
			// 	        console.log("Channel订阅成功。");
			// 	    },
			// 	    onFailed: function (error) {
			// 	        console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
			// 	    }
			// 	});
			// 	this.$goEasy.subscribePresence({
			// 		channel: "App",
			// 		onPresence: function(presenceEvents){
			// 			console.log(presenceEvents);
			// 		}
			// 	});
			// 	this.$goEasy.hereNow({
			// 	        channels: ["App"],
			// 	        includeUsers: true, //可选项，是否返回用户列表，默认false
			// 	        distinct: true //可选项，相同userId的客户端，列表中只保留一个，默认false
			// 	    },function(response) {
			// 	        console.log(response);//json格式的response           
			// 	    });
					
			// 	this.$goEasy.hereNowByUserIds({
			// 		userIds: [myID]
			// 	},function(response) {
			// 		console.log(response)
			// 	});

			// }else{
			// 	this.$goEasy.connect({
			// 	    onSuccess: function () {  //连接成功
			// 	        console.log("GoEasy successfully") //连接成功
			// 	    },
			// 	    onFailed: function (error) { //连接失败
			// 	        console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
			// 	    },
			// 	    onProgress:function(attempts) { //连接或自动重连中
			// 	        console.log("GoEasy is connecting", attempts);    
			// 	    }
			// 	});
			// }
			
			// #ifdef APP-PLUS  
			let UserUniqueId = uni.getStorageSync('myID')
			if(UserUniqueId!=''&&UserUniqueId!=null&&UserUniqueId!=undefined){
				uni.connectSocket({
				    url: this.$wss+'/app/websocket?UserUniqueId='+UserUniqueId,
					complete: (res) => {
						
					}
				});
				uni.onSocketOpen((res) => {
					// console.log('WebSocket连接已打开');
				});
				uni.onSocketError((err) => {
					// console.log('WebSocket连接打开失败');
				});
				uni.onSocketMessage((mes) => {
					// console.log('收到服务器内容');
					console.log(mes)
					if(typeof(JSON.parse(mes.data))=='number'){
						return false
					}
					let messageList = uni.getStorageSync('messageList');
					if(messageList==''||messageList==null||messageList==undefined){
						messageList = []
					}
					
					let message = JSON.parse(mes.data)
					messageList.unshift(message)
					uni.setStorageSync('messageList',messageList);
					this.$store.commit('changeMessageLen',messageList.length)
					// plus.runtime.setBadgeNumber(messageList.length)
					uni.setTabBarBadge({
						index:2,
						text:String(messageList.length)
					})
					let payload = '/pages/notice/message/message'
					if(message.Content!="赞了我"&&message.Content!="关注了我"){
						if(message.ReplyContent!=''&&message.ReplyContent!=null&&message.ReplyContent!=undefined){
							plus.push.createMessage(message.SendUser+'回复了我',payload)
						}else{
							plus.push.createMessage(message.SendUser+'评论了我',payload)
						}
					}else{
						plus.push.createMessage(message.SendUser+message.Content,payload)
					}
				});
				uni.onSocketClose((res) => {
					// console.log('WebSocket连接已关闭');
				});
			}
			if(this.$pushType == 'show'){
				this.$listenPush(this.$pushType);
			}
			// #endif  
		},
		onHide: function() {
			this.$pushType = 'show'
			uni.request({
			    url: this.$url+'/api/appuser/signin-duration', 
				header:{
					Authorization:'Bearer '+token
				},
				data:{
					"type": 1
				},
				method: "POST",
			    
			    success: (res) => {
					if(res.data.success&&res.data.code == 200){
						console.log('Timer End')
					}
			    }
			});
			// this.$goEasy.disconnect({
			// 	onSuccess: function(){
			// 		console.log("GoEasy disconnect successfully.")
			// 	},
			// 	onFailed: function(error){
			// 		console.log("Failed to disconnect GoEasy, code:"+error.code+ ",error:"+error.content);
			// 	}
			// });
			// #ifdef APP-PLUS  
			uni.closeSocket({
				success: () => {
					// console.log('WebSocket连接关闭');
				}
			});
			// #endif 
			
			//  清除活动报名缓存
			if(this.$store.state.activityList && this.$store.state.activityList.length > 0){
				this.$store.state.activityList.forEach(item =>{
					uni.removeStorageSync(item)
				})
			}
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
</style>
