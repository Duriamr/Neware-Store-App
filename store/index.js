import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let _this = {
	$url:""
};
_this.$url = "https://shop.neware.com.cn";

const store = new Vuex.Store({
	strict: true,
	state:{
		activityList:[],
		phoneData:"",
		passData:"",
		verCode:"",
		// accessToken: "",
		Id:0,
		circle:false,
		topic:false,
		circlePage:false,
		circleDetails:false,
		evaluationlist:false,
		messageLen:0,
	},
	mutations: {
		addphone(state,value){
			state.phoneData = value
		},
		addpass(state,value){
			state.passData = value
		},
		getcode(state,value){
			state.verCode = value
		},
		// addtoken(state,value){
		// 	state.accessToken = value
		// },
		setid(state,value){
			state.Id = value
		},
		changeCircle(state,value){
			state.circle = value
		},
		changeTopic(state,value){
			state.topic = value
		},
		changeCirclePage(state,value){
			state.circlePage = value
		},
		changeCircleDetails(state,value){
			state.circleDetails = value
		},
		EvaluationList(state,value){
			state.evaluationlist = value
		},
		changeMessageLen(state,value){
			state.messageLen = value
		},
		SetCommitactivityList(state,value){
			state.activityList.push(value)
		},
	},
	actions: {
		
	}
})

export default store