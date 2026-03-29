<!-- pages/mine/mine.vue -->
<!-- 我的页面（对齐原型图：未登录.png / 登录成功.png） -->
<template>
	<view class="page-mine">
		<!-- ========== 顶部白色背景 ========== -->
		<view class="header-section" :style="{ paddingTop: statusBarHeight + 'px' }">
			<!-- 用户信息行 -->
			<view class="user-info" @click="isLoggedIn ? goProfile() : onLogin()">
				<view class="avatar-wrap">
					<image v-if="isLoggedIn && userInfo.avatarUrl" class="avatar-img" :src="userInfo.avatarUrl" mode="aspectFill" />
					<text v-else class="avatar-placeholder">👤</text>
				</view>
				<view class="user-text">
					<text class="user-name">{{ isLoggedIn ? (userInfo.nickName || '宠物达人') : '请登录' }}</text>
					<text class="user-desc">{{ isLoggedIn ? (userInfo.phone || '') : '登录后享受更多服务' }}</text>
				</view>
				<text class="login-arrow">›</text>
			</view>
		</view>

		<!-- ========== 余额卡券卡片（主题色，左右一分二） ========== -->
		<view class="balance-card" v-if="isLoggedIn">
			<view class="balance-left" @click="goWallet">
				<text class="balance-label">账户余额</text>
				<text class="balance-amount">￥{{ balance }}</text>
			</view>
			<view class="balance-divider"></view>
			<view class="balance-right" @click="goCouponList">
				<text class="balance-label">我的券</text>
				<text class="balance-count">({{ couponCount }})</text>
			</view>
		</view>

		<!-- ========== 菜单列表（上下排列） ========== -->
		<view class="menu-card">
			<view class="menu-item" v-for="(item, idx) in menuList" :key="idx" @click="goPage(item.url, item.isTabBar)">
				<view class="menu-icon-box">
					<image class="menu-icon-img" :src="item.iconImage" mode="aspectFit" />
				</view>
				<text class="menu-text">{{ item.text }}</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>

		<!-- ========== 退出登录 ========== -->
		<view class="logout-section" v-if="isLoggedIn">
			<view class="logout-btn" @click="onLogout">
				<text class="logout-text">退出登录</text>
			</view>
		</view>

		<!-- ========== 底部协议 ========== -->
		<view class="footer-section">
			<view class="agreement-row">
				<text class="agreement-link" @click="goAgreement('privacy')">隐私协议</text>
				<text class="agreement-divider">|</text>
				<text class="agreement-link" @click="goAgreement('user')">用户协议</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo } from '@/api/user.js'
import { getWalletInfo } from '@/api/pay.js'
import { getCouponList } from '@/api/coupon.js'

const statusBarHeight = ref(0)

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
})

// ==================== 用户状态 ====================
const isLoggedIn = ref(false)
const userInfo = ref({ nickName: '', phone: '', avatarUrl: '' })
const balance = ref('56.89')
const couponCount = ref(3)

// ==================== 菜单列表 ====================
const menuList = ref([
	{ text: '洗宠订单', iconImage: '/static/icon/dingdanliebiao.png', url: '/pages/wash-order-list/wash-order-list', isTabBar: true },
	{ text: '预约订单', iconImage: '/static/icon/riqi.png', url: '/pages/book-order-list/book-order-list', isTabBar: true },
	{ text: '我的钱包', iconImage: '/static/icon/qian.png', url: '/pages/wallet/wallet', isTabBar: false },
	{ text: '分账中心', iconImage: '/static/icon/fenxiao.png', url: '/pages/profit-center/profit-center', isTabBar: false }
])

// ==================== 交互方法 ====================

/**
 * 微信登录
 * 接口: POST /api/user/login
 */
const onLogin = async () => {
	// TODO: const { code } = await uni.login({ provider: 'weixin' })
	// const res = await login({ code })
	// isLoggedIn.value = true
	// await loadUserData()
	uni.showToast({ title: '登录功能开发中', icon: 'none' })
}

/**
 * 加载用户数据
 * 并行: 用户信息 / 钱包余额 / 卡券数量
 */
const loadUserData = async () => {
	// TODO: const info = await getUserInfo()
	// TODO: const wallet = await getWalletInfo()
	// TODO: const coupons = await getCouponList()
}

const goProfile = () => { uni.navigateTo({ url: '/pages/profile/profile' }) }
const goWallet = () => { uni.navigateTo({ url: '/pages/wallet/wallet' }) }
const goCouponList = () => { uni.navigateTo({ url: '/pages/coupon-list/coupon-list' }) }

const goPage = (url, isTabBar) => {
	if (isTabBar) { uni.switchTab({ url }) }
	else { uni.navigateTo({ url }) }
}

const onLogout = () => {
	uni.showModal({
		title: '确认退出',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				isLoggedIn.value = false
				uni.showToast({ title: '已退出登录', icon: 'success' })
			}
		}
	})
}

const goAgreement = (type) => {
	uni.navigateTo({ url: `/pages/agreement/agreement?type=${type}` })
}
</script>

<style lang="scss" scoped>
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

.page-mine {
	min-height: 100vh;
	background: #f7f7f7;
}

/* ==================== 顶部白色背景 ==================== */
.header-section {
	background: #fff;
	padding: 0 32rpx 28rpx;
}

.user-info {
	display: flex;
	align-items: center;
	padding: 32rpx 0 28rpx;
}

.avatar-wrap {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 28rpx;
	overflow: hidden;
	flex-shrink: 0;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

.avatar-placeholder {
	font-size: 56rpx;
}

.user-text {
	flex: 1;
}

.user-name {
	font-size: 38rpx;
	font-weight: 700;
	color: #222;
	display: block;
	margin-bottom: 6rpx;
}

.user-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
}

.login-arrow {
	font-size: 44rpx;
	color: #ccc;
	margin-left: 12rpx;
}

/* ==================== 余额卡券卡片（主题色，左右一分二） ==================== */
.balance-card {
	display: flex;
	background: $primary;
	margin: 24rpx;
	border-radius: 20rpx;
	overflow: hidden;
}

.balance-left {
	flex: 1;
	padding: 32rpx 28rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.balance-divider {
	width: 1rpx;
	background: rgba(255, 255, 255, 0.3);
}

.balance-right {
	flex: 1;
	padding: 32rpx 28rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.balance-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.95);
	display: block;
	margin-bottom: 8rpx;
}

.balance-amount {
	font-size: 42rpx;
	font-weight: 700;
	color: #fff;
}

.balance-count {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

/* ==================== 菜单列表（上下排列） ==================== */
.menu-card {
	background: #fff;
	margin: 0 24rpx;
	border-radius: 20rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 32rpx 28rpx;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}

	&:active {
		background: #fafafa;
	}
}

.menu-icon-box {
	width: 56rpx;
	height: 56rpx;
	margin-right: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.menu-icon-img {
	width: 44rpx;
	height: 44rpx;
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

/* ==================== 退出登录 ==================== */
.logout-section {
	padding: 24rpx 24rpx 0;
}

.logout-btn {
	background: #fff;
	text-align: center;
	padding: 28rpx 0;
	border-radius: 20rpx;
	border: 2rpx solid #ff4d4f;

	&:active { background: #fff5f5; }
}

.logout-text {
	font-size: 30rpx;
	color: #ff4d4f;
	font-weight: 500;
}

/* ==================== 底部协议 ==================== */
.footer-section {
	text-align: center;
	padding: 40rpx 32rpx;
}

.agreement-row {
	display: flex;
	align-items: center;
	justify-content: center;
}

.agreement-link {
	font-size: 24rpx;
	color: #7bc400;
}

.agreement-divider {
	margin: 0 20rpx;
	color: #ddd;
	font-size: 24rpx;
}
</style>
