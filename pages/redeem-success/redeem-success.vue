<!-- pages/redeem-success/redeem-success.vue -->
<!-- 核销成功 -->
<template>
	<view class="page-redeem-success">
		<!-- 成功图标 -->
		<view class="success-icon-wrap">
			<text class="success-icon">✅</text>
			<view class="success-text">核销成功</view>
		</view>

		<!-- 卡券信息 -->
		<view class="coupon-info-card">
			<view class="coupon-header">
				<view class="coupon-source">美团</view>
				<view class="coupon-type-badge">次卡</view>
			</view>
			<view class="coupon-amount">￥100</view>
			<view class="coupon-detail-list">
				<view class="detail-row">
					<text class="detail-label">适用范围</text>
					<text class="detail-value">洗宠机全部服务可用</text>
				</view>
				<view class="detail-row">
					<text class="detail-label">可用次数</text>
					<text class="detail-value">10次</text>
				</view>
				<view class="detail-row">
					<text class="detail-label">有效期至</text>
					<text class="detail-value">2026-09-26</text>
				</view>
			</view>
		</view>

		<!-- 立即预约按钮 -->
		<view class="book-btn" @click="goBook">
			<text>立即预约</text>
		</view>

		<!-- 扫码下单入口 -->
		<view class="scan-btn" @click="goScan">
			<text class="scan-icon">📷</text>
			<text>扫码下单</text>
		</view>

		<!-- 返回首页 -->
		<view class="home-btn" @click="goHome">返回首页</view>
	</view>
</template>

<script setup>
import { onLoad, onUnload } from '@dcloudio/uni-app'

let autoRedirectTimer = null

onLoad((options) => {
	// TODO: 根据couponId加载卡券详情
	// 2秒后自动跳转到预约服务页面
	autoRedirectTimer = setTimeout(() => {
		uni.navigateTo({ url: '/pages/book-service/book-service' })
	}, 2000)
})

onUnload(() => {
	if (autoRedirectTimer) {
		clearTimeout(autoRedirectTimer)
		autoRedirectTimer = null
	}
})

const goBook = () => {
	if (autoRedirectTimer) {
		clearTimeout(autoRedirectTimer)
		autoRedirectTimer = null
	}
	uni.navigateTo({ url: '/pages/book-service/book-service' })
}

const goScan = () => {
	if (autoRedirectTimer) {
		clearTimeout(autoRedirectTimer)
		autoRedirectTimer = null
	}
	uni.showToast({ title: '扫码功能开发中', icon: 'none' })
}

const goHome = () => {
	if (autoRedirectTimer) {
		clearTimeout(autoRedirectTimer)
		autoRedirectTimer = null
	}
	uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
.page-redeem-success {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 80rpx 32rpx;
}

.success-icon-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.success-icon {
	font-size: 120rpx;
	margin-bottom: 24rpx;
}

.success-text {
	font-size: 40rpx;
	font-weight: 700;
	color: #07C160;
}

.coupon-info-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 40rpx 32rpx;
	margin-bottom: 40rpx;
}

.coupon-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.coupon-source {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.coupon-type-badge {
	font-size: 22rpx;
	color: #07C160;
	background-color: #e8f8ee;
	padding: 4rpx 16rpx;
	border-radius: 999rpx;
}

.coupon-amount {
	font-size: 56rpx;
	font-weight: 700;
	color: #ff4d4f;
	text-align: center;
	margin-bottom: 32rpx;
}

.coupon-detail-list {
	border-top: 1rpx solid #f0f0f0;
	padding-top: 24rpx;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 0;
}

.detail-label {
	font-size: 26rpx;
	color: #999;
}

.detail-value {
	font-size: 26rpx;
	color: #333;
}

.book-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	padding: 28rpx 0;
	border-radius: 999rpx;
	margin-bottom: 24rpx;
}

.scan-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	color: #333;
	font-size: 32rpx;
	font-weight: 600;
	padding: 28rpx 0;
	border-radius: 999rpx;
	margin-bottom: 24rpx;
	border: 2rpx solid #07C160;

	.scan-icon {
		font-size: 36rpx;
		margin-right: 12rpx;
	}
}

.home-btn {
	text-align: center;
	font-size: 28rpx;
	color: #999;
	padding: 24rpx 0;
}
</style>
