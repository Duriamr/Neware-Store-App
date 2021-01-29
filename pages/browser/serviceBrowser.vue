<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				webviewStyles: {
					progress: {
						color: '#F8B500'
					}
				}
			};
		},
		onLoad(option) {
			if(option.page == 'goods'){
				let fromUrl = this.$h5Url+'/pages/sort/goods/goods?goodsId'+option.goodsId
				let cardUrl = this.$h5Url+'/pages/sort/goods/goods?goodsId'+encodeURIComponent(encodeURIComponent("="))+option.goodsId
				if(option.right2 == null){
					option.right2 = ' '
				}
				let cardInfo = {
					"left":{
						"url":option.imgUrl
					},
					"right1":{
						"text":option.right1,
						"color":"#111111",
						"fontSize":18
					},
					"right2":{
						"text":option.right2,
						"color":"#666666",
						"fontSize":14
					},
					"right3":{
						"text":"￥"+option.right3,
						"color":"#F75C50",
						"fontSize":14
					},
					"url":cardUrl
				}
				let otherParams = {
					"nickName":option.nickName,
					"cardInfo":cardInfo
				}
				let customField = {
					"用户ID":option.clientId
				}
				this.src = 'https://webchat.7moor.com/wapchat.html?accessId=c7a57c90-b9b2-11ea-abda-a564c48d53ea&fromUrl='+fromUrl+'&urlTitle=商品详情页&otherParams='+JSON.stringify(otherParams)+'&clientId='+option.clientId+'&customField='+JSON.stringify(customField)
			}else if(option.page == 'notice'){
				let otherParams = {
					"nickName":option.nickName,
				}
				let customField = {
					"用户ID":option.clientId
				}
				this.src = 'https://webchat.7moor.com/wapchat.html?accessId=c7a57c90-b9b2-11ea-abda-a564c48d53ea&urlTitle=消息通知页&otherParams='+JSON.stringify(otherParams)+'&clientId='+option.clientId+'&customField='+JSON.stringify(customField)
			}else if(option.page == 'my'){
				let otherParams = {
					"nickName":option.nickName,
				}
				let customField = {
					"用户ID":option.clientId
				}
				this.src = 'https://webchat.7moor.com/wapchat.html?accessId=c7a57c90-b9b2-11ea-abda-a564c48d53ea&urlTitle=个人中心页&otherParams='+JSON.stringify(otherParams)+'&clientId='+option.clientId+'&customField='+JSON.stringify(customField)
			}else if(option.page == 'order'){
				let otherParams = {
					"nickName":option.nickName,
				}
				let customField = {
					"用户ID":option.clientId,
					"订单编号":option.orderNo
				}
				this.src = 'https://webchat.7moor.com/wapchat.html?accessId=c7a57c90-b9b2-11ea-abda-a564c48d53ea&urlTitle=订单详情页&otherParams='+JSON.stringify(otherParams)+'&clientId='+option.clientId+'&customField='+JSON.stringify(customField)
			}
		}
	}
</script>

<style lang="scss">

</style>
