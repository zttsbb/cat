<!-- pages/device-detail/device-detail.vue -->
<!-- 默认主页（对齐原型图：默认主页.png） -->
<!-- 扫码后/点击设备后进入的设备使用页 -->
<template>
	<view class="page-home">
		<!-- 导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="nav-back" @click="goBack">
					<text class="back-arrow">‹</text>
				</view>
				<text class="nav-title">物沃PET</text>
				<view class="nav-placeholder"></view>
			</view>
		</view>

		<!-- 设备信息 -->
		<view class="device-card">
			<view class="device-header">
				<text class="device-name">{{ device.name }}</text>
				<view :class="['device-status', device.status === 1 ? 'st-green' : 'st-gray']">
					{{ device.statusText }}
				</view>
			</view>
			<view class="device-addr">
				<text class="addr-text">📍 {{ device.address }}</text>
			</view>
			<view class="device-dist">
				<text class="dist-text">距我 {{ device.distance }}</text>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entry">
			<view class="entry-item" @click="goBookService">
				<view class="entry-icon-box">
					<image class="entry-icon-img" src="/static/icon/qiandao.png" mode="aspectFit" />
				</view>
				<text class="entry-label">预约到店</text>
			</view>
			<view class="entry-item" @click="goRedeem">
				<view class="entry-icon-box">
					<image class="entry-icon-img" src="/static/icon/saomahexiao.png" mode="aspectFit" />
				</view>
				<text class="entry-label">团购核销</text>
			</view>
			<view class="entry-item" @click="goOrderList">
				<view class="entry-icon-box">
					<image class="entry-icon-img" src="/static/icon/dingdanliebiao.png" mode="aspectFit" />
				</view>
				<text class="entry-label">我的订单</text>
			</view>
			<view class="entry-item" @click="goRecharge">
				<view class="entry-icon-box">
					<image class="entry-icon-img" src="/static/icon/youhuichognzhi.png" mode="aspectFit" />
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
						<text class="svc-symbol">￥</text>
						<text class="svc-num">{{ item.price }}</text>
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
					<text class="bar-sym">￥</text>
					<text class="bar-num">{{ totalPrice }}</text>
				</view>
			</view>
			<view class="bar-btn" @click="goPayConfirm">
				<text class="bar-btn-text">立即支付</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDeviceDetail } from '@/api/store.js'

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

// ==================== 生命周期 ====================
onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
	loadData()
})

/**
 * 加载设备数据
 * 接口: GET /api/device/detail
 */
const loadData = async () => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	if (currentPage) {
		const opts = currentPage.$page?.options || currentPage.options || {}
		if (opts.deviceId) {
			device.value.id = opts.deviceId
		}
	}
	// TODO: const detail = await getDeviceDetail(device.value.id)
	// if (detail) device.value = detail
}

// ==================== 交互 ====================
const selectService = (index) => { selectedService.value = index }

/**
 * 跳转确认付款页
 * 接口: POST /api/pay/device/prepay
 */
const goPayConfirm = () => {
	const svc = serviceList.value[selectedService.value]
	uni.navigateTo({
		url: `/pages/pay-confirm/pay-confirm?deviceId=${device.value.id}&serviceId=${svc.id}&price=${svc.price}`
	})
}

const goBookService = () => { uni.switchTab({ url: '/pages/book-order-list/book-order-list' }) }
const goRedeem = () => { uni.navigateTo({ url: '/pages/coupon-redeem/coupon-redeem' }) }
const goOrderList = () => { uni.switchTab({ url: '/pages/wash-order-list/wash-order-list' }) }
const goRecharge = () => { uni.navigateTo({ url: '/pages/wallet/wallet' }) }
const goBack = () => { uni.navigateBack({ delta: 1 }) }
</script>

<style lang="scss" scoped>
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

.page-home {
	min-height: 100vh;
	background: #f7f7f7;
	padding-bottom: 140rpx;
}

/* 导航栏 */
.nav-bar {
	background: $primary;
	padding: 0 32rpx 20rpx;
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

.nav-placeholder {
	width: 60rpx;
}

/* 设备信息 */
.device-card {
	background: #fff;
	margin: 24rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
}

.device-header {
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

.st-green {
	background: $primary-light;
	color: $primary-dark;
}

.st-gray {
	background: #f0f0f0;
	color: #999;
}

.device-addr {
	margin-bottom: 8rpx;
}

.addr-text {
	font-size: 26rpx;
	color: #666;
}

.dist-text {
	font-size: 24rpx;
	color: #999;
}

/* 快捷入口 */
.quick-entry {
	display: flex;
	justify-content: space-around;
	background: #fff;
	margin: 20rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 16rpx;
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

.entry-icon-img {
	width: 48rpx;
	height: 48rpx;
}

.entry-label {
	font-size: 24rpx;
	color: #333;
}

/* 服务项目 */
.service-section {
	background: #fff;
	margin: 20rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
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

.svc-symbol {
	font-size: 24rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.svc-num {
	font-size: 36rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.svc-desc {
	font-size: 22rpx;
	color: #999;
	display: block;
}

/* 底部支付栏 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
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

.bar-sym {
	font-size: 26rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.bar-num {
	font-size: 44rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.bar-btn {
	background: $primary;
	padding: 22rpx 56rpx;
	border-radius: 48rpx;

	&:active { opacity: 0.85; }
}

.bar-btn-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}
</style>
