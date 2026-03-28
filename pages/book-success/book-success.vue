<!-- pages/book-success/book-success.vue -->
<!-- 预约成功 -->
<template>
	<view class="page-book-success">
		<!-- 成功图标 -->
		<view class="success-wrap">
			<image class="success-icon-img" src="/static/icon/yuyuechenggong.png" mode="aspectFit" />
			<view class="success-title">预约成功</view>
			<view class="success-desc">您的预约已提交成功，请按时到店</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-list">
			<view class="action-item" @click="goOrderList">
				<text class="action-icon">📋</text>
				<text class="action-text">查看预约订单</text>
				<text class="action-arrow">›</text>
			</view>
			<view class="action-item" @click="goHome">
				<text class="action-icon">🏠</text>
				<text class="action-text">返回首页</text>
				<text class="action-arrow">›</text>
			</view>
			<view class="action-item" @click="shareBtn">
				<text class="action-icon">🎁</text>
				<text class="action-text">分享给好友</text>
				<text class="action-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script setup>
const goOrderList = () => {
	uni.redirectTo({ url: '/pages/book-order-list/book-order-list' })
}

const goHome = () => {
	uni.switchTab({ url: '/pages/index/index' })
}

const shareBtn = () => {
	uni.showToast({ title: '分享功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page-book-success {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 120rpx 32rpx;
}

.success-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 80rpx;
}

.success-icon-img {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 32rpx;
}

.success-title {
	font-size: 44rpx;
	font-weight: 700;
	color: #07C160;
	margin-bottom: 16rpx;
}

.success-desc {
	font-size: 28rpx;
	color: #999;
}

.action-list {
	background-color: #fff;
	border-radius: 24rpx;
	overflow: hidden;
}

.action-item {
	display: flex;
	align-items: center;
	padding: 36rpx 32rpx;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.action-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.action-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.action-arrow {
	font-size: 36rpx;
	color: #ccc;
}
</style>
