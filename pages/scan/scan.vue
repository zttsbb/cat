<!-- pages/scan/scan.vue -->
<!-- 扫一扫页面 - tabBar 中间项，进入即调起扫码 -->
<template>
	<view class="page-scan">
		<view class="scan-container">
			<view class="scan-icon">📷</view>
			<text class="scan-text">正在调起扫码...</text>
		</view>
	</view>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
	// 进入页面自动调起扫码
	setTimeout(() => {
		uni.scanCode({
			scanType: ['qrCode', 'barCode'],
			success: (res) => {
				console.log('扫码结果:', res.result)
				// TODO: 根据扫码结果处理业务逻辑
				uni.showToast({ title: '扫码结果: ' + res.result, icon: 'none' })
			},
			fail: (err) => {
				console.log('扫码取消或失败:', err)
				// 扫码取消后返回上一页
				uni.switchTab({ url: '/pages/index/index' })
			}
		})
	}, 300)
})
</script>

<style lang="scss" scoped>
.page-scan {
	min-height: 100vh;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}

.scan-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.scan-icon {
	font-size: 120rpx;
	margin-bottom: 24rpx;
}

.scan-text {
	font-size: 30rpx;
	color: #999;
}
</style>
