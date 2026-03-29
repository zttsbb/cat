<!-- pages/index/index.vue -->
<!-- 默认主页（对齐原型图：默认主页.png） -->
<!-- 扫码后进入的设备使用页，包含设备信息、快捷入口、服务项目、底部支付栏 -->
<template>
	<view class="page-home">
		<!-- 左上角四分之一圆弧装饰 -->
		<view class="top-arc"></view>

		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="nav-back" @click="goBack">
					<text class="back-arrow">‹</text>
				</view>
				<text class="nav-title">物沃PET</text>
				<view class="nav-service" @click="onContactService">
					<text class="service-icon">💬</text>
				</view>
			</view>
		</view>

		<!-- 设备信息卡片 -->
		<view class="device-card">
			<view class="device-name-row">
				<text class="device-name">{{ device.name }}</text>
				<view :class="['device-status', device.status === 1 ? 'status-green' : 'status-gray']">
					{{ device.statusText }}
				</view>
			</view>
			<view class="device-addr-row">
				<text class="device-addr">{{ device.address }}</text>
			</view>
			<view class="device-dist-row">
				<text class="device-dist">距我 {{ device.distance }}</text>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entry">
			<view class="entry-item" @click="goBookService">
				<view class="entry-icon-box">
					<text class="entry-icon-text">📅</text>
				</view>
				<text class="entry-label">预约到店</text>
			</view>
			<view class="entry-item" @click="goRedeem">
				<view class="entry-icon-box">
					<text class="entry-icon-text">🎫</text>
				</view>
				<text class="entry-label">团购核销</text>
			</view>
			<view class="entry-item" @click="goOrderList">
				<view class="entry-icon-box">
					<text class="entry-icon-text">📋</text>
				</view>
				<text class="entry-label">我的订单</text>
			</view>
			<view class="entry-item" @click="goRecharge">
				<view class="entry-icon-box">
					<text class="entry-icon-text">💰</text>
				</view>
				<text class="entry-label">优惠充值</text>
			</view>
		</view>

		<!-- 服务项目 -->
		<view class="service-section">
			<text class="section-title">服务项目</text>
			<view class="service-grid">
				<view
					:class="['service-card', { active: selectedService === index }]"
					v-for="(item, index) in serviceList"
					:key="index"
					@click="selectService(index)"
				>
					<text class="svc-name">{{ item.name }}</text>
					<view class="svc-price-row">
						<text class="svc-price-symbol">￥</text>
						<text class="svc-price-num">{{ item.price }}</text>
					</view>
					<text class="svc-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 底部支付栏 -->
		<view class="bottom-bar">
			<view class="bar-left">
				<text class="bar-label">预估费用</text>
				<view class="bar-price">
					<text class="bar-price-symbol">￥</text>
					<text class="bar-price-num">{{ totalPrice }}</text>
				</view>
			</view>
			<view class="bar-btn" @click="goPayConfirm">
				<text class="bar-btn-text">立即支付</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onLoad } from 'vue'
import { scanQRCode } from '@/api/store.js'
import { getAvailableCoupons } from '@/api/pay.js'

// ==================== 页面参数 ====================
/** @type {number} 设备ID - 通过扫码或页面跳转传入 */
const deviceId = ref('')
/** @type {string} 扫码结果 */
const scanCode = ref('')

// ==================== 状态栏 ====================
const statusBarHeight = ref(0)

// ==================== 设备信息 ====================
/** @type {Object} 设备信息 - 接口: GET /api/device/detail */
const device = ref({
	id: 101,
	name: '智能洗宠机A1',
	address: '深圳市南山区科技园南区深南大道9966号',
	status: 1,
	statusText: '可使用',
	distance: '3.6KM'
})

// ==================== 服务项目 ====================
/** @type {Array} 服务列表 - 接口: GET /api/device/services */
const serviceList = ref([
	{ id: 1, name: '标准洗宠', price: 30, desc: '30分钟 · 基础清洁' },
	{ id: 2, name: '精致洗护', price: 50, desc: '45分钟 · 深层清洁+护毛' },
	{ id: 3, name: '豪华洗护', price: 80, desc: '60分钟 · 全套护理' },
	{ id: 4, name: '烘干服务', price: 20, desc: '15分钟 · 快速烘干' }
])

const selectedService = ref(0)
const totalPrice = computed(() => {
	return selectedService.value !== null ? serviceList.value[selectedService.value].price : 0
})

// ==================== 页面生命周期 ====================
onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
	loadDeviceData()
})

/**
 * 加载设备数据
 * 接口: GET /api/scan/parse (扫码) → GET /api/device/detail (设备详情)
 */
const loadDeviceData = async () => {
	try {
		// 如果有扫码code，先解析
		if (scanCode.value) {
			const scanRes = await scanQRCode(scanCode.value)
			if (scanRes && scanRes.deviceId) {
				deviceId.value = scanRes.deviceId
			}
		}
		// TODO: 调用设备详情接口
		// const detail = await getDeviceDetail(deviceId.value)
		// if (detail) device.value = detail
	} catch (e) {
		console.error('加载设备数据失败:', e)
	}
}

// ==================== 交互方法 ====================
const selectService = (index) => {
	selectedService.value = index
}

/**
 * 跳转确认付款页
 * 页面: /pages/pay-confirm/pay-confirm
 * 参数: { deviceId, serviceId, price }
 */
const goPayConfirm = () => {
	const svc = serviceList.value[selectedService.value]
	uni.navigateTo({
		url: `/pages/pay-confirm/pay-confirm?deviceId=${device.value.id}&serviceId=${svc.id}&price=${svc.price}`
	})
}

const goBookService = () => {
	uni.switchTab({ url: '/pages/book-order-list/book-order-list' })
}

const goRedeem = () => {
	// TODO: 跳转团购核销
	uni.navigateTo({ url: '/pages/coupon-redeem/coupon-redeem' })
}

const goOrderList = () => {
	uni.switchTab({ url: '/pages/wash-order-list/wash-order-list' })
}

const goRecharge = () => {
	uni.navigateTo({ url: '/pages/wallet/wallet' })
}

const goBack = () => {
	uni.navigateBack({ delta: 1 })
}

const onContactService = () => {
	// TODO: 接入客服系统
	uni.showToast({ title: '客服功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
/* ==================== 主题变量 ==================== */
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

/* ==================== 页面容器 ==================== */
.page-home {
	min-height: 100vh;
	background-color: #f7f7f7;
	padding-bottom: 160rpx;
	position: relative;
	overflow: hidden;
}

/* ==================== 左上角1/4圆弧装饰 ==================== */
.top-arc {
	position: absolute;
	top: -180rpx;
	left: -180rpx;
	width: 360rpx;
	height: 360rpx;
	background: $primary;
	border-radius: 50%;
	opacity: 0.12;
	z-index: 0;
}

/* ==================== 导航栏 ==================== */
.nav-bar {
	background: $primary;
	padding: 0 32rpx 20rpx;
	position: relative;
	z-index: 1;
}

.nav-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
}

.nav-back {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-arrow {
	font-size: 44rpx;
	color: #fff;
	font-weight: 300;
	line-height: 1;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.nav-service {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}

.service-icon {
	font-size: 32rpx;
}

/* ==================== 设备信息卡片 ==================== */
.device-card {
	background: #fff;
	margin: 24rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
	position: relative;
	z-index: 1;
}

.device-name-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.device-name {
	font-size: 34rpx;
	font-weight: 700;
	color: #222;
}

.device-status {
	font-size: 22rpx;
	padding: 4rpx 18rpx;
	border-radius: 20rpx;
	font-weight: 500;
}

.status-green {
	background: $primary-light;
	color: $primary-dark;
}

.status-gray {
	background: #f0f0f0;
	color: #999;
}

.device-addr-row {
	margin-bottom: 8rpx;
}

.device-addr {
	font-size: 26rpx;
	color: #666;
}

.device-dist-row {}

.device-dist {
	font-size: 24rpx;
	color: #999;
}

/* ==================== 快捷入口 ==================== */
.quick-entry {
	display: flex;
	justify-content: space-around;
	background: #fff;
	margin: 20rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 16rpx;
	position: relative;
	z-index: 1;
}

.entry-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.entry-icon-box {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	background: $primary-bg;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10rpx;
}

.entry-icon-text {
	font-size: 36rpx;
}

.entry-label {
	font-size: 24rpx;
	color: #333;
}

/* ==================== 服务项目 ==================== */
.service-section {
	background: #fff;
	margin: 20rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
	position: relative;
	z-index: 1;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 20rpx;
}

.service-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.service-card {
	width: calc(50% - 8rpx);
	background: #fafafa;
	border-radius: 16rpx;
	padding: 24rpx;
	border: 3rpx solid transparent;
	box-sizing: border-box;

	&.active {
		border-color: $primary;
		background: $primary-bg;
	}
}

.svc-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 8rpx;
}

.svc-price-row {
	display: flex;
	align-items: baseline;
	margin-bottom: 6rpx;
}

.svc-price-symbol {
	font-size: 24rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.svc-price-num {
	font-size: 36rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.svc-desc {
	font-size: 22rpx;
	color: #999;
	display: block;
}

/* ==================== 底部支付栏 ==================== */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
	padding-bottom: env(safe-area-inset-bottom);
	box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
	z-index: 100;
}

.bar-left {
	display: flex;
	flex-direction: column;
}

.bar-label {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 4rpx;
}

.bar-price {
	display: flex;
	align-items: baseline;
}

.bar-price-symbol {
	font-size: 26rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.bar-price-num {
	font-size: 44rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.bar-btn {
	background: $primary;
	padding: 22rpx 56rpx;
	border-radius: 48rpx;

	&:active {
		opacity: 0.85;
	}
}

.bar-btn-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}
</style>
