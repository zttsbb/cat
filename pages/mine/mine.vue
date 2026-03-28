<!-- pages/mine/mine.vue -->
<!-- 我的（物沃PET） -->
<template>
	<view class="page-mine">
		<!-- 顶部区域 -->
		<view class="header-section" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="header-content">
				<!-- 未登录 -->
				<view class="user-info" v-if="!isLoggedIn">
					<view class="avatar-wrap">
						<text class="avatar-placeholder">👤</text>
					</view>
					<view class="login-area">
						<text class="login-tip">请登录</text>
						<text class="login-desc">登录后享受更多服务</text>
					</view>
				</view>
				<!-- 已登录 -->
				<view class="user-info" v-else>
					<view class="avatar-wrap">
						<image v-if="userInfo.avatarUrl" class="avatar-img" :src="userInfo.avatarUrl" mode="aspectFill" />
						<text v-else class="avatar-placeholder">{{ userInfo.nickName?.charAt(0) || '👤' }}</text>
					</view>
					<view class="login-area">
						<text class="user-name">{{ userInfo.nickName || '宠物达人' }}</text>
						<text class="user-phone">{{ userInfo.phone || '' }}</text>
					</view>
				</view>

				<!-- 余额卡券入口 -->
				<view class="balance-entry" v-if="isLoggedIn">
					<view class="entry-item" @click="goWallet">
						<text class="entry-value">￥{{ balance }}</text>
						<text class="entry-label">余额</text>
					</view>
					<view class="entry-divider"></view>
					<view class="entry-item" @click="goCouponList">
						<text class="entry-value">{{ couponCount }}张</text>
						<text class="entry-label">卡券</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 登录按钮 -->
		<view class="login-btn-section" v-if="!isLoggedIn">
			<view class="login-btn" @click="onLogin">微信登录</view>
		</view>

		<!-- 菜单列表 -->
		<view class="menu-section">
			<view class="menu-item" @click="goPage('/pages/wash-order-list/wash-order-list')">
				<text class="menu-icon">📋</text>
				<text class="menu-text">洗宠订单</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goPage('/pages/book-order-list/book-order-list')">
				<text class="menu-icon">📅</text>
				<text class="menu-text">预约订单</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goPage('/pages/profit-center/profit-center')">
				<text class="menu-icon">💰</text>
				<text class="menu-text">分账中心</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goPage('/pages/wallet/wallet')">
				<text class="menu-icon">👛</text>
				<text class="menu-text">我的钱包</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goPage('/pages/coupon-list/coupon-list')">
				<text class="menu-icon">🎫</text>
				<text class="menu-text">我的卡券</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>

		<!-- 底部信息 -->
		<view class="footer-section">
			<text class="user-id" v-if="isLoggedIn">用户ID: {{ userInfo.id }}</text>
			<view class="agreement-row">
				<text class="agreement-link" @click="goAgreement('privacy')">隐私协议</text>
				<text class="agreement-divider">|</text>
				<text class="agreement-link" @click="goAgreement('user')">用户协议</text>
			</view>
			<view class="footer-logo">
				<text class="footer-logo-text">物沃科技</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/index.js'

const userStore = useUserStore()
const statusBarHeight = ref(0)

// 初始化
const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 0

const isLoggedIn = computed(() => userStore.isLoggedInFlag)
const userInfo = computed(() => userStore.userInfo || {})
const balance = computed(() => userStore.balance)
const couponCount = computed(() => userStore.couponCount)

const onLogin = async () => {
	try {
		await userStore.login()
		uni.showToast({ title: '登录成功', icon: 'success' })
	} catch (e) {
		uni.showToast({ title: '登录失败', icon: 'none' })
	}
}

const goWallet = () => {
	uni.navigateTo({ url: '/pages/wallet/wallet' })
}

const goCouponList = () => {
	uni.navigateTo({ url: '/pages/coupon-list/coupon-list' })
}

// tabBar 页面列表
const tabBarPages = [
	'pages/index/index',
	'pages/wash-order-list/wash-order-list',
	'pages/scan/scan',
	'pages/book-order-list/book-order-list',
	'pages/mine/mine'
]

const goPage = (url) => {
	const pagePath = url.replace(/^\//, '')
	if (tabBarPages.includes(pagePath)) {
		uni.switchTab({ url })
	} else {
		uni.navigateTo({ url })
	}
}

const goAgreement = (type) => {
	uni.navigateTo({ url: `/pages/agreement/agreement?type=${type}` })
}
</script>

<style lang="scss" scoped>
.page-mine {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.header-section {
	background: linear-gradient(135deg, #07C160, #38d976);
	padding: 0 32rpx 48rpx;
}

.header-content {
	// no extra
}

.user-info {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
}

.avatar-wrap {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	overflow: hidden;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

.avatar-placeholder {
	font-size: 56rpx;
}

.login-area {
	display: flex;
	flex-direction: column;
}

.login-tip {
	font-size: 36rpx;
	font-weight: 600;
	color: #fff;
	margin-bottom: 4rpx;
}

.login-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.user-name {
	font-size: 36rpx;
	font-weight: 600;
	color: #fff;
	margin-bottom: 4rpx;
}

.user-phone {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.8);
}

.balance-entry {
	display: flex;
	background-color: rgba(255, 255, 255, 0.15);
	border-radius: 20rpx;
	padding: 24rpx 0;
	margin-top: 24rpx;
}

.entry-item {
	flex: 1;
	text-align: center;
}

.entry-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
	display: block;
}

.entry-label {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.8);
}

.entry-divider {
	width: 1rpx;
	background-color: rgba(255, 255, 255, 0.3);
}

.login-btn-section {
	padding: 32rpx;
}

.login-btn {
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;
}

.menu-section {
	background-color: #fff;
	margin: 24rpx;
	border-radius: 24rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 36rpx 32rpx;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.menu-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.menu-arrow {
	font-size: 36rpx;
	color: #ccc;
}

.footer-section {
	text-align: center;
	padding: 48rpx 32rpx;
}

.user-id {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.agreement-row {
	display: flex;
	align-items: center;
	justify-content: center;
}

.agreement-link {
	font-size: 24rpx;
	color: #07C160;
}

.agreement-divider {
	margin: 0 20rpx;
	color: #ddd;
	font-size: 24rpx;
}

.footer-logo {
	margin-top: 32rpx;
	padding: 20rpx 0;
}

.footer-logo-text {
	font-size: 26rpx;
	color: #bbb;
	letter-spacing: 4rpx;
}
</style>
