<!-- pages/pay-confirm/pay-confirm.vue -->
<!-- 扫码确认付款页（原型图-扫码确认支付款页-独立页.png） -->
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

		<!-- 设备信息卡片 -->
		<view class="device-card">
			<view class="device-name-row">
				<text class="device-name">{{ device.name }}</text>
				<view :class="['device-status', device.status === 1 ? 'status-green' : 'status-gray']">
					{{ device.statusText }}
				</view>
			</view>
			<view class="device-info-row">
				<text class="info-label">设备地址</text>
				<text class="info-value">{{ device.address }}</text>
			</view>
			<view class="device-info-row">
				<text class="info-label">距离</text>
				<text class="info-value">{{ device.distance }}</text>
			</view>
			<view class="device-info-row">
				<text class="info-label">服务项目</text>
				<text class="info-value service-value">{{ serviceName }}</text>
			</view>
		</view>

		<!-- 费用明细 -->
		<view class="fee-card">
			<view class="fee-title-row">
				<text class="fee-title">费用明细</text>
			</view>
			<view class="fee-row">
				<text class="fee-label">服务费用</text>
				<text class="fee-value">￥{{ servicePrice }}</text>
			</view>
			<view class="fee-row" v-if="couponDiscount > 0">
				<text class="fee-label">优惠券抵扣</text>
				<text class="fee-value discount">-￥{{ couponDiscount }}</text>
			</view>
			<view class="fee-row fee-total">
				<text class="fee-label">应付金额</text>
				<view class="fee-total-value">
					<text class="fee-symbol">￥</text>
					<text class="fee-amount">{{ totalAmount }}</text>
				</view>
			</view>
		</view>

		<!-- 支付方式选择 -->
		<view class="pay-method-card">
			<view class="pay-title-row">
				<text class="pay-title">选择支付方式</text>
			</view>
			<view
				class="pay-method-item"
				v-for="(method, index) in payMethods"
				:key="index"
				@click="selectPayMethod(index)"
			>
				<view class="method-left">
					<text class="method-icon">{{ method.icon }}</text>
					<view class="method-info">
						<text class="method-name">{{ method.name }}</text>
						<text class="method-desc" v-if="method.desc">{{ method.desc }}</text>
					</view>
				</view>
				<view :class="['radio-circle', { active: selectedPayMethod === index }]">
					<view class="radio-inner" v-if="selectedPayMethod === index"></view>
				</view>
			</view>
		</view>

		<!-- 选取优惠券 -->
		<view class="coupon-section" @click="pickCoupon">
			<text class="coupon-label">选取优惠券</text>
			<view class="coupon-right">
				<text class="coupon-text" v-if="selectedCoupon">{{ selectedCoupon.name }} -￥{{ selectedCoupon.amount }}</text>
				<text class="coupon-text coupon-none" v-else>暂无可用</text>
				<text class="coupon-arrow">›</text>
			</view>
		</view>

		<!-- 温馨提示 -->
		<view class="tips-section">
			<view class="tips-row">
				<text class="tips-icon">💡</text>
				<text class="tips-text">本设备需预支付{{ servicePrice }}元，结算订单后原路退回</text>
			</view>
		</view>

		<!-- 底部支付栏 -->
		<view class="bottom-bar">
			<view class="price-info">
				<text class="price-label">应付金额</text>
				<view class="price-value-row">
					<text class="price-symbol">￥</text>
					<text class="price-amount">{{ totalAmount }}</text>
				</view>
			</view>
			<view class="pay-btn" @click="onConfirmPay">
				<text class="pay-btn-text">确认支付</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const statusBarHeight = ref(0)

const device = ref({
	name: '智能洗宠机A1',
	address: '深圳市南山区科技园南区深南大道9966号',
	status: 1,
	statusText: '可使用',
	distance: '3.6KM'
})

const servicePrice = ref('30')
const serviceName = ref('标准洗宠')

const selectedPayMethod = ref(0)
const selectedCoupon = ref(null)
const couponDiscount = computed(() => selectedCoupon.value ? selectedCoupon.value.amount : 0)
const totalAmount = computed(() => {
	const price = parseFloat(servicePrice.value) || 0
	const discount = couponDiscount.value
	return Math.max(0, price - discount).toFixed(2)
})

const payMethods = ref([
	{ icon: '🟢', name: '微信支付', desc: '推荐使用', key: 'wechat' },
	{ icon: '💰', name: '余额支付', desc: '当前余额 ￥56.89', key: 'balance' },
	{ icon: '🎫', name: '卡券支付', desc: '可用卡券 3张', key: 'coupon' }
])

const selectPayMethod = (index) => {
	selectedPayMethod.value = index
}

const pickCoupon = () => {
	uni.showToast({ title: '优惠券选择功能开发中', icon: 'none' })
}

const onConfirmPay = () => {
	// TODO: 调用支付接口
	uni.showToast({ title: '支付功能开发中', icon: 'none' })
}

const goBack = () => {
	uni.navigateBack({ delta: 1 })
}

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0

	// 获取页面参数
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	if (currentPage) {
		const options = currentPage.$page?.options || currentPage.options || {}
		if (options.serviceIndex !== undefined) {
			const services = [
				{ name: '标准洗宠', price: '30' },
				{ name: '精致洗护', price: '50' },
				{ name: '豪华洗护', price: '80' },
				{ name: '烘干服务', price: '20' }
			]
			const idx = parseInt(options.serviceIndex)
			if (services[idx]) {
				serviceName.value = services[idx].name
				servicePrice.value = services[idx].price
			}
		}
	}
})
</script>

<style lang="scss" scoped>
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

.page-pay-confirm {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 0 24rpx 200rpx;
	position: relative;
	overflow: hidden;
}

/* 左上角四分之一圆弧装饰 */
.top-arc {
	position: absolute;
	top: -200rpx;
	left: -200rpx;
	width: 400rpx;
	height: 400rpx;
	background-color: $primary;
	border-radius: 50%;
	opacity: 0.15;
	z-index: 0;
}

/* 导航栏 */
.nav-bar {
	background: $primary;
	padding: 20rpx 32rpx 24rpx;
	position: relative;
	z-index: 1;
}
.nav-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 0;
}
.nav-back {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background-color: rgba(255,255,255,0.25);
	display: flex;
	align-items: center;
	justify-content: center;
}
.back-arrow {
	font-size: 40rpx;
	color: #fff;
	font-weight: 300;
}
.nav-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #fff;
}
.nav-placeholder {
	width: 56rpx;
}

/* 设备信息卡片 */
.device-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-top: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06);
	position: relative;
	z-index: 1;
}
.device-name-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}
.device-name {
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
}
.device-status {
	font-size: 22rpx;
	padding: 6rpx 20rpx;
	border-radius: 999rpx;
}
.status-green {
	background-color: $primary-light;
	color: $primary-dark;
}
.status-gray {
	background-color: #f0f0f0;
	color: #999;
}
.device-info-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
	&:last-child { border-bottom: none; }
}
.info-label {
	font-size: 28rpx;
	color: #999;
}
.info-value {
	font-size: 28rpx;
	color: #333;
}
.service-value {
	color: $primary-dark;
	font-weight: 600;
}

/* 费用明细 */
.fee-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	position: relative;
	z-index: 1;
}
.fee-title-row {
	margin-bottom: 20rpx;
}
.fee-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}
.fee-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 0;
}
.fee-label {
	font-size: 28rpx;
	color: #666;
}
.fee-value {
	font-size: 28rpx;
	color: #333;
}
.discount {
	color: #ff4d4f;
}
.fee-total {
	border-top: 2rpx solid #f0f0f0;
	margin-top: 12rpx;
	padding-top: 20rpx;
}
.fee-total-value {
	display: flex;
	align-items: baseline;
}
.fee-symbol {
	font-size: 28rpx;
	font-weight: 700;
	color: #ff4d4f;
}
.fee-amount {
	font-size: 40rpx;
	font-weight: 700;
	color: #ff4d4f;
}

/* 支付方式 */
.pay-method-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	position: relative;
	z-index: 1;
}
.pay-title-row {
	margin-bottom: 20rpx;
}
.pay-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}
.pay-method-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
	&:last-child { border-bottom: none; }
}
.method-left {
	display: flex;
	align-items: center;
}
.method-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 16rpx;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-right: 20rpx;
}
.method-info {
	display: flex;
	flex-direction: column;
}
.method-name {
	font-size: 28rpx;
	color: #333;
}
.method-desc {
	font-size: 22rpx;
	color: #999;
	margin-top: 4rpx;
}
.radio-circle {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 3rpx solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	&.active {
		border-color: $primary;
	}
}
.radio-inner {
	width: 22rpx;
	height: 22rpx;
	border-radius: 50%;
	background-color: $primary;
}

/* 优惠券 */
.coupon-section {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	z-index: 1;
}
.coupon-label {
	font-size: 28rpx;
	color: #333;
}
.coupon-right {
	display: flex;
	align-items: center;
}
.coupon-text {
	font-size: 26rpx;
	color: #ff4d4f;
}
.coupon-none {
	color: #999;
}
.coupon-arrow {
	font-size: 36rpx;
	color: #ccc;
	margin-left: 8rpx;
}

/* 温馨提示 */
.tips-section {
	margin-bottom: 24rpx;
	position: relative;
	z-index: 1;
}
.tips-row {
	display: flex;
	align-items: flex-start;
}
.tips-icon {
	font-size: 24rpx;
	margin-right: 8rpx;
	flex-shrink: 0;
}
.tips-text {
	font-size: 24rpx;
	color: #999;
	line-height: 1.6;
}

/* 底部支付栏 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 16rpx 32rpx;
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
	z-index: 100;
}
.price-info {
	display: flex;
	flex-direction: column;
}
.price-label {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 4rpx;
}
.price-value-row {
	display: flex;
	align-items: baseline;
}
.price-symbol {
	font-size: 28rpx;
	font-weight: 700;
	color: #ff4d4f;
}
.price-amount {
	font-size: 44rpx;
	font-weight: 700;
	color: #ff4d4f;
}
.pay-btn {
	background: $primary;
	padding: 24rpx 64rpx;
	border-radius: 999rpx;
	&:active { opacity: 0.85; }
}
.pay-btn-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}
</style>
