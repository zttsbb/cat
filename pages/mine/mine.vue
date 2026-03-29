<!-- pages/mine/mine.vue -->
<!-- 我的页面（对齐原型图：未登录.png / 登录成功.png） -->
<template>
	<view class="page-mine">
		<!-- ========== 顶部区域（主题色背景） ========== -->
		<view class="header-section" :style="{ paddingTop: statusBarHeight + 'px' }">
			<!-- 未登录状态 -->
			<view class="user-info" v-if="!isLoggedIn" @click="onLogin">
				<view class="avatar-wrap">
					<text class="avatar-placeholder">👤</text>
				</view>
				<view class="user-text">
					<text class="user-name">请登录</text>
					<text class="user-desc">登录后享受更多服务</text>
				</view>
				<text class="login-arrow">›</text>
			</view>

			<!-- 已登录状态 -->
			<view class="user-info" v-else @click="goProfile">
				<view class="avatar-wrap">
					<image v-if="userInfo.avatarUrl" class="avatar-img" :src="userInfo.avatarUrl" mode="aspectFill" />
					<text v-else class="avatar-placeholder">{{ userInfo.nickName?.charAt(0) || '👤' }}</text>
				</view>
				<view class="user-text">
					<text class="user-name">{{ userInfo.nickName || '宠物达人' }}</text>
					<text class="user-desc">{{ userInfo.phone || '' }}</text>
				</view>
				<text class="login-arrow">›</text>
			</view>

			<!-- 余额 + 卡券（已登录才显示） -->
			<view class="balance-row" v-if="isLoggedIn">
				<view class="balance-item" @click="goWallet">
					<text class="balance-label">余额</text>
					<text class="balance-value">￥{{ balance }}</text>
				</view>
				<view class="balance-divider"></view>
				<view class="balance-item" @click="goCouponList">
					<text class="balance-label">我的券</text>
					<text class="balance-value">{{ couponCount }}张</text>
				</view>
			</view>
		</view>

		<!-- 菜单列表 -->
		<view class="menu-card">
			<view class="menu-item" v-for="(item, idx) in menuList" :key="idx" @click="goPage(item.url, item.isTabBar)">
				<view class="menu-icon-box">
					<image v-if="item.iconImage" class="menu-icon-img" :src="item.iconImage" mode="aspectFit" />
					<text v-else class="menu-icon-emoji">{{ item.icon }}</text>
				</view>
				<text class="menu-text">{{ item.text }}</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>

		<!-- 退出登录（已登录才显示） -->
		<view class="logout-section" v-if="isLoggedIn">
			<view class="logout-btn" @click="onLogout">
				<text class="logout-text">退出登录</text>
			</view>
		</view>

		<!-- 底部协议 -->
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
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/index.js'
import { getUserInfo } from '@/api/user.js'
import { getWalletInfo } from '@/api/pay.js'
import { getCouponList } from '@/api/coupon.js'

const statusBarHeight = ref(0)

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
})

// ==================== 用户状态 ====================
/** @type {boolean} 是否已登录 */
const isLoggedIn = computed(() => false) // TODO: 对接 userStore.isLoggedInFlag
/** @type {Object} 用户信息 - 接口: GET /api/user/info */
const userInfo = computed(() => ({ nickName: '', phone: '', avatarUrl: '' }))
/** @type {number} 余额 - 接口: GET /api/pay/wallet/info */
const balance = computed(() => '56.89')
/** @type {number} 卡券数量 - 接口: GET /api/coupon/list */
const couponCount = computed(() => 3)

// ==================== 菜单列表 ====================
/** @type {Array} 菜单配置，iconImage 从 /static/icon/ 读取 */
const menuList = ref([
	{ text: '洗宠订单', iconImage: '/static/icon/dingdanliebiao.png', url: '/pages/wash-order-list/wash-order-list', isTabBar: true },
	{ text: '预约订单', iconImage: '/static/icon/riqi.png', url: '/pages/book-order-list/book-order-list', isTabBar: true },
	{ text: '我的钱包', iconImage: '/static/icon/qian.png', icon: '💰', url: '/pages/wallet/wallet', isTabBar: false },
	{ text: '分账中心', iconImage: '/static/icon/fenxiao.png', icon: '📊', url: '/pages/profit-center/profit-center', isTabBar: false }
])

// ==================== 交互方法 ====================

/**
 * 微信登录
 * 接口: POST /api/user/login (微信code换token)
 */
const onLogin = async () => {
	// TODO: 调用登录接口
	// try {
	// 	const { code } = await uni.login({ provider: 'weixin' })
	// 	const res = await login({ code })
	// 	userStore.setToken(res.token)
	// 	await loadUserData()
	// } catch (e) {
	// 	uni.showToast({ title: '登录失败', icon: 'none' })
	// }
	uni.showToast({ title: '登录功能开发中', icon: 'none' })
}

/**
 * 加载用户数据
 * 并行: 用户信息 / 钱包 / 卡券
 */
const loadUserData = async () => {
	try {
		// TODO: const info = await getUserInfo()
		// userInfo.value = info
	} catch (e) {}
	try {
		// TODO: const wallet = await getWalletInfo()
		// balance.value = wallet.balance
	} catch (e) {}
	try {
		// TODO: const coupons = await getCouponList()
		// couponCount.value = coupons?.length || 0
	} catch (e) {}
}

/** 跳转个人信息编辑 */
const goProfile = () => {
	uni.navigateTo({ url: '/pages/profile/profile' })
}

/** 退出登录 */
const onLogout = () => {
	uni.showModal({
		title: '确认退出',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				// TODO: userStore.logout()
				uni.showToast({ title: '已退出登录', icon: 'success' })
			}
		}
	})
}

/** 余额 → 钱包页 */
const goWallet = () => {
	uni.navigateTo({ url: '/pages/wallet/wallet' })
}

/** 卡券 → 卡券列表 */
const goCouponList = () => {
	uni.navigateTo({ url: '/pages/coupon-list/coupon-list' })
}

/** 菜单跳转（区分 tabBar / navigateTo） */
const goPage = (url, isTabBar) => {
	if (isTabBar) {
		uni.switchTab({ url })
	} else {
		uni.navigateTo({ url })
	}
}

/** 协议页 */
const goAgreement = (type) => {
	uni.navigateTo({ url: `/pages/agreement/agreement?type=${type}` })
}
</script>

<style lang="scss" scoped>
/* ==================== 主题变量 ==================== */
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

/* ==================== 页面 ==================== */
.page-mine {
	min-height: 100vh;
	background: #f7f7f7;
}

/* ==================== 顶部区域 ==================== */
.header-section {
	background: $primary;
	padding: 0 32rpx 40rpx;
}

.user-info {
	display: flex;
	align-items: center;
	padding: 24rpx 0 28rpx;
}

.avatar-wrap {
	width: 110rpx;
	height: 110rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	overflow: hidden;
	flex-shrink: 0;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

.avatar-placeholder {
	font-size: 52rpx;
}

.user-text {
	flex: 1;
}

.user-name {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
	display: block;
	margin-bottom: 4rpx;
}

.user-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.login-arrow {
	font-size: 40rpx;
	color: rgba(255, 255, 255, 0.7);
	margin-left: 12rpx;
}

/* 余额 + 卡券 */
.balance-row {
	display: flex;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 16rpx;
	padding: 24rpx 0;
}

.balance-item {
	flex: 1;
	text-align: center;
}

.balance-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	display: block;
	margin-bottom: 6rpx;
}

.balance-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.balance-divider {
	width: 1rpx;
	background: rgba(255, 255, 255, 0.3);
}

/* ==================== 菜单列表 ==================== */
.menu-card {
	background: #fff;
	margin: 24rpx;
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
	width: 48rpx;
	height: 48rpx;
}

.menu-icon-emoji {
	font-size: 36rpx;
}

.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.menu-arrow {
	font-size: 36rpx;
	color: #ccc;
}

/* ==================== 退出登录 ==================== */
.logout-section {
	padding: 0 24rpx;
}

.logout-btn {
	background: #fff;
	text-align: center;
	padding: 28rpx 0;
	border-radius: 20rpx;
	border: 2rpx solid #ff4d4f;

	&:active {
		background: #fff5f5;
	}
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
	color: $primary-dark;
}

.agreement-divider {
	margin: 0 20rpx;
	color: #ddd;
	font-size: 24rpx;
}
</style>
