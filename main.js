import Vue from 'vue';
import App from './App';
import store from './store'
Vue.prototype.$store = store

//接口
import {url,wss,h5Url} from '@/url.js'
Vue.prototype.$url = url
Vue.prototype.$wss = wss
Vue.prototype.$h5Url = h5Url

// 路由
import {toPath,back,toHome,toGoods,toLogin,to401} from '@/common/router.js'
Vue.prototype.$toPath = toPath
Vue.prototype.$back = back
Vue.prototype.$toHome = toHome
Vue.prototype.$toGoods = toGoods
Vue.prototype.$toLogin = toLogin
Vue.prototype.$to401 = to401

// 请求超时
import requestFail from '@/common/requestFail.js'
Vue.prototype.$requestFail = requestFail
Vue.prototype.$failOff = false

// 下载NASA
import downNASA from '@/common/downNASA.js'
Vue.prototype.$downNASA = downNASA

// 分享
import {showShare,hideShare,shareWX,sharePYQ,shareQQ,shareCopy} from '@/common/share.js'
Vue.prototype.$showShare = showShare
Vue.prototype.$hideShare = hideShare
Vue.prototype.$shareWX = shareWX
Vue.prototype.$sharePYQ = sharePYQ
Vue.prototype.$shareQQ = shareQQ
Vue.prototype.$shareCopy = shareCopy

// 监听推送
import listenPush from '@/common/listenPush.js'
Vue.prototype.$listenPush = listenPush
Vue.prototype.$pushType = 'show'

// 获取购物车badge
import getCartBadge from '@/common/getCartBadge.js'
Vue.prototype.$getCartBadge = getCartBadge


// 扫描二维码
import scanCode from '@/common/scanCode.js'
Vue.prototype.$scanCode = scanCode

// 查看图片
import previewImg from '@/common/previewImg.js'
Vue.prototype.$previewImg = previewImg

// 对象,数组验证
import {isObject,isArray} from '@/common/isObject.js'
Vue.prototype.$isObject = isObject
Vue.prototype.$isArray = isArray

// 极光验证
import aurora from './common/aurora.js'
Vue.prototype.$aurora = aurora

// GoEasy
import GoEasy from '@/common/goeasy-1.2.0.js'
Vue.prototype.$goEasy = GoEasy.getInstance({
	host:'hangzhou.goeasy.io',
	appkey: "BC-2b09390cf01940ffa828268ac310f5ed",
	allowNotification:true,
}); 

// 登录验证key
Vue.prototype.$signKey = '567bcc7f346c8ce22e1893cee0f43a3a'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount() 