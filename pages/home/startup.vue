<template>
    <view></view>
</template>

<script>
export default {
    data() {
        return {};
    },
    onLoad() {
        this.loadExecution();
    },
    methods: {
        loadExecution() {
			// #ifdef APP-PLUS 
            /**
             * 获取本地存储中launchFlag的值
             * 若存在，说明不是首次启动，直接进入首页；
             * 若不存在，说明是首次启动，进入引导页；
             */
            try {
                const value = uni.getStorageSync('launchFlag1');
                if (value) {
					
                    if (value == true) {
						this.$toHome()
                    } else {
                        uni.redirectTo({
                            url: '/pages/home/guide'
                        });
                    }
                } else {
                    uni.redirectTo({
                        url: '/pages/home/guide'
                    });
                }
            } catch (e) {
                // error
				console.log("error")
                uni.setStorage({
                    key: 'launchFlag1',
                    data: true,
                    success: () => {
						uni.redirectTo({
						    url: '/pages/home/guide',
						});
                    }
                });
            }
			// #endif
			// #ifndef APP-PLUS 
			this.$toHome()
			// #endif
        }
    }
};
</script>
<style></style>
