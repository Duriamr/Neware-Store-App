function showShare(){
	this.shareShow = 'show';
};
function hideShare(){
	this.shareShow = 'hide';
	setTimeout(() => {
		this.shareShow = 'none';
	}, 200);
};
function shareWX(obj){
	uni.share({
		provider: "weixin",
		type: 0,
		scene: "WXSceneSession",
		title:obj.title,
		summary:obj.summary,
		href:obj.href,
		imageUrl:obj.imageUrl,
		complete: (res) => {
			this.hideShare()
		},
		fail: (err) => {
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '发生错误请重试'
			});
		}
	});
};
function sharePYQ(obj){
	uni.share({
		provider: "weixin",
		type: 0,
		scene: "WXSenceTimeline",
		title:obj.title,
		summary:obj.summary,
		href:obj.href,
		imageUrl:obj.imageUrl,
		complete: (res) => {
			this.hideShare()
		},
		fail: (err) => {
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '发生错误请重试'
			});
		}
	});
};
function shareQQ(obj){
	uni.share({
		provider: "qq",
		type: 0,
		title:obj.title,
		summary:obj.summary,
		href:obj.href,
		imageUrl:obj.imageUrl,
		complete: (res) => {
			this.hideShare()
		},
		fail: (err) => {
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '发生错误请重试'
			});
		}
	})
};
function shareCopy(obj){
	uni.setClipboardData({
		data:obj.href,
		complete: (res) => {
			this.hideShare()
		},
		fail: (err) => {
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '发生错误请重试'
			});
		}
	})
};
			
export {showShare,hideShare,shareWX,sharePYQ,shareQQ,shareCopy}