<!-- pages/pay-confirm/pay-confirm.vue -->
<!-- 扫码确认付款页（对齐原型图：扫码确认支付款页-独立页.png） -->
<!-- 左上角1/4圆弧装饰 + 设备信息 + 支付方式选择 + 优惠券 + 底部支付栏 -->
<template>
	<view class="page-pay-confirm">
		<!-- 左上角四分之一圆弧装饰 -->
		<view class="top-arc"></view>

		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="nav-back" @click="goBack">
					<text class="back-arrow">‹</text>
				</view>
				<text class="nav-title">确认付款</text>
				<view class="nav-placeholder"></view>
			</view>
		</view>

		<!-- 设备信息 -->
		<view class="card device-card">
			<view class="device-name-row">
				<text class="device-name">{{ device.name }}</text>
				<view :class="['device-status', device.status === 1 ? 'status-green' : 'status-gray']">
					{{ device.statusText }}
				</view>
			</view>
			<view class="info-row">
				<text class="info-label">设备地址</text>
				<text class="info-value">{{ device.address }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">距离</text>
				<text class="info-value">{{ device.distance }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">服务项目</text>
				<text class="info-value highlight">{{ serviceName }}</text>
			</view>
		</view>

		<!-- 支付方式 -->
		<view class="card pay-card">
			<text class="card-title">选择支付方式</text>
			<view
				class="pay-item"
				v-for="(method, index) in payMethods"
				:key="index"
				@click="selectPayMethod(index)"
			>
				<view class="pay-item-left">
					<view class="pay-icon-box">
						<text class="pay-icon">{{ method.icon }}</text>
					</view>
					<view class="pay-item-info">
						<text class="pay-item-name">{{ method.name }}</text>
						<text class="pay-item-desc" v-if="method.desc">{{ method.desc }}</text>
					</view>
				</view>
				<view :class="['radio', { active: selectedPayMethod === index }]">
					<view class="radio-dot" v-if="selectedPayMethod === index"></view>
				</view>
			</view>
		</view>

		<!-- 选取优惠券 -->
		<view class="card coupon-card" @click="pickCoupon">
			<text class="coupon-left">选取优惠券</text>
			<view class="coupon-right">
				<text class="coupon-value" v-if="selectedCoupon">{{ selectedCoupon.name }} -￥{{ selectedCoupon.amount }}</text>
				<text class="coupon-value none" v-else>暂无可用</text>
				<text class="coupon-arrow">›</text>
			</view>
		</view>

		<!-- 温馨提示 -->
		<view class="tips-bar">
			<text class="tips-icon">💡</text>
			<text class="tips-text">本设备需预支付{{ servicePrice }}元，结算订单后原路退回</text>
		</view>

		<!-- 底部支付栏 -->
		<view class="bottom-bar">
			<view class="bar-left">
				<text class="bar-label">应付金额</text>
				<view class="bar-price">
					<text class="bar-price-sym">￥</text>
					<text class="bar-price-num">{{ actualAmount }}</text>
				</view>
			</view>
			<view class="bar-btn" @click="onConfirmPay">
				<text class="bar-btn-text">确认支付</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDeviceDetail } from '@/api/store.js'
import { getAvailableCoupons, devicePrepay } from '@/api/pay.js'

// ==================== 页面参数 ====================
/** @type {string} 设备ID */
const deviceId = ref('')
/** @type {string} 服务ID */
const serviceId = ref('')
/** @type {number} 服务价格 */
const servicePrice = ref(30)
/** @type {string} 服务名称 */
const serviceName = ref('标准洗宠')

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

// ==================== 支付方式 ====================
/** @type {number} 选中支付方式索引 */
const selectedPayMethod = ref(0)

/** @type {Array} 支付方式列表 */
const payMethods = ref([
	{ icon: '💰', name: '余额支付', desc: '当前余额 ￥56.89', key: 'balance' },
	{ icon: '🎫', name: '卡券支付', desc: '可用卡券 3张', key: 'coupon' },
	{ icon: '🟢', name: '微信支付', desc: '', key: 'wechat' }
])

// ==================== 优惠券 ====================
/** @type {Object|null} 选中的优惠券 - 接口: GET /api/pay/coupon/available */
const selectedCoupon = ref(null)

const couponDiscount = computed(() => {
	return selectedCoupon.value ? selectedCoupon.value.amount : 0
})

const actualAmount = computed(() => {
	return Math.max(0, servicePrice.value - couponDiscount.value).toFixed(2)
})

// ==================== 页面生命周期 ====================
onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0

	// 获取页面参数
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	if (currentPage) {
		const opts = currentPage.$page?.options || currentPage.options || {}
		deviceId.value = opts.deviceId || ''
		serviceId.value = opts.serviceId || ''
		if (opts.price) servicePrice.value = parseFloat(opts.price) || 30
	}

	loadData()
})

/**
 * 加载页面数据
 * 并行调用: 设备详情 / 可用优惠券
 */
const loadData = async () => {
	try {
		// TODO: 获取设备详情
		// const detail = await getDeviceDetail(deviceId.value)
		// if (detail) device.value = detail
	} catch (e) {
		console.error('加载设备信息失败:', e)
	}

	try {
		// TODO: 获取可用优惠券
		// const coupons = await getAvailableCoupons({ type: 'wash' })
		// couponList.value = coupons
	} catch (e) {
		console.error('加载优惠券失败:', e)
	}
}

// ==================== 交互方法 ====================

/** 选择支付方式 */
const selectPayMethod = (index) => {
	selectedPayMethod.value = index
}

/** 选取优惠券 */
const pickCoupon = () => {
	// TODO: 跳转优惠券选择页
	// uni.navigateTo({ url: '/pages/coupon-select/coupon-select' })
	uni.showToast({ title: '优惠券选择功能开发中', icon: 'none' })
}

/**
 * 确认支付
 * 接口: POST /api/pay/device/prepay
 * @param {string} deviceId - 设备ID
 * @param {string} payMethod - 支付方式 (balance|coupon|wechat)
 * @param {string} couponId - 优惠券ID
 * @param {string} serviceId - 服务项目ID
 */
const onConfirmPay = async () => {
	const method = payMethods.value[selectedPayMethod.value]

	// TODO: 调用预支付接口
	// const res = await devicePrepay({
	// 	deviceId: deviceId.value,
	// 	payMethod: method.key,
	// 	couponId: selectedCoupon.value?.id || '',
	// 	serviceId: serviceId.value
	// })

	// Mock: 直接跳转支付结果
	uni.showToast({ title: '支付功能开发中', icon: 'none' })
}

const goBack = () => {
	uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
/* ==================== 主题变量 ==================== */
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

/* ==================== 页面容器 ==================== */
.page-pay-confirm {
	min-height: 100vh;
	background: #f7f7f7;
	padding: 0 24rpx 180rpx;
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
	font-size: 34rpx;
	font-weight: 700;
	color: #fff;
}

.nav-placeholder {
	width: 60rpx;
}

/* ==================== 通用卡片 ==================== */
.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
	margin-top: 20rpx;
	position: relative;
	z-index: 1;
}

.card-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 20rpx;
}

/* ==================== 设备信息 ==================== */
.device-name-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
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

.info-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 14rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.info-label {
	font-size: 28rpx;
	color: #999;
}

.info-value {
	font-size: 28rpx;
	color: #333;

	&.highlight {
		color: $primary-dark;
		font-weight: 600;
	}
}

/* ==================== 支付方式 ==================== */
.pay-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 22rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.pay-item-left {
	display: flex;
	align-items: center;
}

.pay-icon-box {
	width: 72rpx;
	height: 72rpx;
	border-radius: 16rpx;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.pay-icon {
	font-size: 36rpx;
}

.pay-item-info {
	display: flex;
	flex-direction: column;
}

.pay-item-name {
	font-size: 28rpx;
	color: #222;
	font-weight: 500;
}

.pay-item-desc {
	font-size: 22rpx;
	color: #999;
	margin-top: 4rpx;
}

/* Radio 选中样式 */
.radio {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 3rpx solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	&.active {
		border-color: $primary;
	}
}

.radio-dot {
	width: 22rpx;
	height: 22rpx;
	border-radius: 50%;
	background: $primary;
}

/* ==================== 优惠券 ==================== */
.coupon-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.coupon-left {
	font-size: 28rpx;
	color: #222;
}

.coupon-right {
	display: flex;
	align-items: center;
}

.coupon-value {
	font-size: 26rpx;
	color: #ff4d4f;

	&.none {
		color: #999;
	}
}

.coupon-arrow {
	font-size: 36rpx;
	color: #ccc;
	margin-left: 8rpx;
}

/* ==================== 温馨提示 ==================== */
.tips-bar {
	display: flex;
	align-items: flex-start;
	background: #fffbe8;
	border-radius: 12rpx;
	padding: 20rpx 24rpx;
	margin-top: 20rpx;
	position: relative;
	z-index: 1;
}

.tips-icon {
	font-size: 24rpx;
	margin-right: 10rpx;
	flex-shrink: 0;
}

.tips-text {
	font-size: 24rpx;
	color: #ff9500;
	line-height: 1.6;
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

.bar-price-sym {
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
