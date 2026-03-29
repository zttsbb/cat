<!-- pages/device-detail/device-detail.vue -->
<!-- 默认主页（对齐原型图：默认主页.png） -->
<template>
	<view class="page-device">
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

		<!-- 轮播图 -->
		<view class="device-banner">
			<swiper class="banner-swiper" :autoplay="true" :interval="4000" :circular="true" indicator-dots indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image class="banner-img" :src="item.image" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 设备信息卡片 -->
		<view class="device-info-card">
			<view class="device-header">
				<text class="device-name">{{ device.name }}</text>
				<view :class="['device-status', device.status === 1 ? 'st-green' : 'st-gray']">
					{{ device.statusText }}
				</view>
			</view>
			<view class="device-row">
				<text class="device-label">每分钟</text>
				<text class="device-price">{{ device.priceRange }}元</text>
			</view>
			<view class="device-row">
				<text class="device-label">预充值</text>
				<text class="device-value">{{ device.prepayAmount }}元</text>
			</view>
			<view class="device-actions">
				<view class="action-btn action-left" @click="goLive">
					<text class="action-btn-text">查看现场</text>
				</view>
				<view class="action-btn action-right" @click="goOpen">
					<text class="action-btn-text">到店开门</text>
				</view>
			</view>
			<view class="view-more-device" @click="goMoreDevices">
				<text class="view-more-text">展开查看其他设备</text>
				<text class="view-more-arrow">›</text>
			</view>
		</view>

		<!-- 优惠充值 -->
		<view class="recharge-section">
			<view class="recharge-header">
				<image class="recharge-icon" src="/static/icon/youhuichognzhi.png" mode="aspectFit" />
				<text class="recharge-title">优惠充值</text>
			</view>
			<scroll-view scroll-x class="recharge-scroll">
				<view class="recharge-list">
					<view class="recharge-card" v-for="(item, index) in rechargeList" :key="index" @click="goRecharge(item)">
						<text class="recharge-amount">￥{{ item.amount }}</text>
						<text class="recharge-bonus" v-if="item.bonus">送￥{{ item.bonus }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 服务项目 -->
		<view class="service-section">
			<text class="section-title">服务项目</text>
			<view class="service-grid">
				<view
					:class="['service-card', { active: selectedService === index }]"
					v-for="(item, index) in serviceList"
					:key="index"
					@click="selectedService = index"
				>
					<text class="service-name">{{ item.name }}</text>
					<text class="service-price">￥{{ item.price }}</text>
					<text class="service-desc">{{ item.desc }}</text>
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
			<view class="bar-btn" @click="goPay">
				<text class="bar-btn-text">立即支付</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDeviceDetail } from '@/api/store.js'

const statusBarHeight = ref(0)

// ==================== 设备信息 ====================
const device = ref({
	id: 101,
	name: '智能洗宠机A1',
	status: 1,
	statusText: '可使用',
	priceRange: '0.8-1.2',
	prepayAmount: 50
})

// 轮播图
const bannerList = ref([
	{ id: 1, image: '/static/bg/bg1.jpg' },
	{ id: 2, image: '/static/bg/bg2.jpg' }
])

// ==================== 充值列表 ====================
const rechargeList = ref([
	{ amount: 50, bonus: 5 },
	{ amount: 100, bonus: 15 },
	{ amount: 200, bonus: 40 },
	{ amount: 500, bonus: 120 }
])

// ==================== 服务项目 ====================
const serviceList = ref([
	{ name: '标准洗宠', price: 30, desc: '30分钟·基础清洁' },
	{ name: '精致洗护', price: 50, desc: '45分钟·深层清洁+护毛' },
	{ name: '豪华洗护', price: 80, desc: '60分钟·全套护理' },
	{ name: '烘干服务', price: 20, desc: '15分钟·快速烘干' }
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

const loadData = async () => {
	// TODO: 根据deviceId加载设备详情
}

// ==================== 交互 ====================
const selectService = (index) => { selectedService.value = index }
const goPay = () => {
	const svc = serviceList.value[selectedService.value]
	uni.navigateTo({ url: `/pages/pay-confirm/pay-confirm?deviceId=${device.value.id}&serviceId=${svc.id}&price=${svc.price}` })
}
const goLive = () => {
	uni.showToast({ title: '查看现场功能开发中', icon: 'none' })
}
const goOpen = () => {
	uni.showToast({ title: '到店开门功能开发中', icon: 'none' })
}
const goMoreDevices = () => {
	uni.switchTab({ url: '/pages/index/index' })
}
const goRecharge = (item) => {
	uni.navigateTo({ url: `/pages/wallet/wallet?amount=${item.amount}` })
}
const goBack = () => {
	uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss">
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

.page-device {
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
}

.nav-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.nav-placeholder {
	width: 60rpx;
}

/* 轮播图 */
.device-banner {
	width: 100%;
	height: 360rpx;
}

.banner-swiper {
	width: 100%;
	height: 100%;
}

.banner-img {
	width: 100%;
	height: 100%;
}

/* 设备信息卡片 */
.device-info-card {
	background: #fff;
	margin: 20rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
}

.device-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.device-name {
	font-size: 34rpx;
	font-weight: 700;
	color: #222;
}

.device-status {
	font-size: 24rpx;
	padding: 6rpx 20rpx;
	border-radius: 999rpx;
}

.st-green {
	background: $primary-light;
	color: $primary-dark;
}

.st-gray {
	background: #f0f0f0;
	color: #999;
}

.device-row {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.device-label {
	font-size: 26rpx;
	color: #666;
	width: 100rpx;
}

.device-price {
	font-size: 28rpx;
	font-weight: 600;
	color: $primary-dark;
}

.device-value {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.device-actions {
	display: flex;
	gap: 16rpx;
	margin-top: 24rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;
}

.view-more-device {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;
}

.view-more-text {
	font-size: 26rpx;
	color: #999;
	margin-right: 8rpx;
}

.view-more-arrow {
	font-size: 28rpx;
	color: #999;
}

.action-btn {
	flex: 1;
	text-align: center;
	padding: 20rpx 0;
	border-radius: 999rpx;
}

.action-left {
	background: $primary-bg;

	&:active {
		background: #e8f0d6;
	}
}

.action-right {
	background: $primary;

	&:active {
		opacity: 0.85;
	}
}

.action-btn-text {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.action-right .action-btn-text {
	color: #fff;
}

/* 优惠充值 */
.recharge-section {
	margin: 20rpx 24rpx 0;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
}

.recharge-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.recharge-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 12rpx;
}

.recharge-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #222;
}

.recharge-scroll {
	white-space: nowrap;
}

.recharge-list {
	display: flex;
	gap: 12rpx;
}

.recharge-card {
	min-width: 160rpx;
	height: 120rpx;
	background: $primary;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 16rpx;
	flex-shrink: 0;

	&:active {
		opacity: 0.85;
	}
}

.recharge-amount {
	font-size: 40rpx;
	font-weight: 700;
	color: #fff;
}

.recharge-bonus {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-top: 4rpx;
}

/* 服务项目 */
.service-section {
	margin: 20rpx 24rpx 0;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
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
	border: 2rpx solid transparent;

	&.active {
		border-color: $primary;
		background: $primary-bg;
	}

	&:active {
		opacity: 0.8;
	}
}

.service-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 8rpx;
}

.service-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff4d4f;
	display: block;
	margin-bottom: 8rpx;
}

.service-desc {
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
