<!-- pages/agreement/agreement.vue -->
<!-- 协议页面 -->
<template>
	<view class="page-agreement">
		<view class="content-wrap">
			<rich-text :nodes="content" v-if="content"></rich-text>
			<view class="loading-wrap" v-else>
				<text class="loading-text">加载中...</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAgreement } from '@/api/user.js'

const type = ref('privacy')
const content = ref('')

onLoad((options) => {
	type.value = options.type || 'privacy'
	uni.setNavigationBarTitle({ title: type.value === 'privacy' ? '隐私协议' : '用户协议' })
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	const res = await getAgreement({ type: type.value })
	if (res) {
		content.value = res.content
	}
}
</script>

<style lang="scss" scoped>
.page-agreement {
	min-height: 100vh;
	background-color: #fff;
}

.content-wrap {
	padding: 32rpx;
	font-size: 28rpx;
	color: #333;
	line-height: 1.8;
}

.loading-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;
}

.loading-text {
	font-size: 28rpx;
	color: #999;
}
</style>
