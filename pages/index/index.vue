<!-- pages/index/index.vue -->
<!-- 默认主页（原型图-默认主页.png）扫码后进入的设备使用页 -->
<template>
	<view class="page-home">
		<!-- 顶部装饰 - 四分之一圆弧 -->
		<view class="top-arc"></view>

		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<text class="nav-title">物沃PET</text>
				<view class="nav-right" @click="goMine">
					<text class="nav-avatar-text">我的</text>
				</view>
			</view>
		</view>

		<!-- 设备信息卡片 -->
		<view class="device-card">
			<view class="device-card-top">
				<view class="device-name-row">
					<text class="device-name">{{ device.name }}</text>
					<view :class="['device-status', device.status === 1 ? 'status-green' : 'status-gray']">
						{{ device.statusText }}
					</view>
				</view>
				<view class="device-addr">
					<text class="addr-icon">📍</text>
					<text class="addr-text">{{ device.address }}</text>
				</view>
				<view class="device-distance">
					<text class="distance-text">距我 {{ device.distance }}</text>
				</view>
			</view>
		</view>

		<!-- 使用指引 -->
		<view class="guide-section">
			<view class="guide-title-row">
				<text class="guide-title">使用指引</text>
			</view>
			<view class="guide-list">
				<view class="guide-item" v-for="(item, index) in guideList" :key="index">
					<view class="guide-step">
						<text class="step-num">{{ index + 1 }}</text>
					</view>
					<view class="guide-content">
						<text class="guide-name">{{ item.name }}</text>
						<text class="guide-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务卡片 -->
		<view class="service-section">
			<view class="service-title-row">
				<text class="service-title">服务项目</text>
			</view>
			<view class="service-grid">
				<view
					:class="['service-card', { active: selectedService === index }]"
					v-for="(item, index) in serviceList"
					:key="index"
					@click="selectService(index)"
				>
					<text class="service-name">{{ item.name }}</text>
					<text class="service-price">￥{{ item.price }}</text>
					<text class="service-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 温馨提示 -->
		<view class="tips-section">
			<view class="tips-row" v-for="(tip, idx) in tipsList" :key="idx">
				<text class="tips-icon">💡</text>
				<text class="tips-text">{{ tip }}</text>
			</view>
		</view>

		<!-- 底部支付栏 -->
		<view class="bottom-bar">
			<view class="price-info">
				<text class="price-label">预估费用</text>
				<view class="price-value-row">
					<text class="price-symbol">￥</text>
					<text class="price-amount">{{ totalPrice }}</text>
				</view>
			</view>
			<view class="pay-btn" @click="goPayConfirm">
				<text class="pay-btn-text">立即支付</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const statusBarHeight = ref(0)

const device = ref({
	id: 101,
	name: '智能洗宠机A1',
	address: '深圳市南山区科技园南区深南大道9966号',
	status: 1,
	statusText: '可使用',
	distance: '3.6KM'
})

const guideList = ref([
	{ name: '扫码开启设备', desc: '使用微信扫一扫设备上的二维码' },
	{ name: '放入宠物', desc: '将宠物放入设备并关好舱门' },
	{ name: '选择服务', desc: '选择洗宠服务项目并支付' },
	{ name: '等待完成', desc: '设备自动运行，结束后取回宠物' }
])

const serviceList = ref([
	{ name: '标准洗宠', price: '30', desc: '30分钟·基础清洁' },
	{ name: '精致洗护', price: '50', desc: '45分钟·深层清洁+护毛' },
	{ name: '豪华洗护', price: '80', desc: '60分钟·全套护理' },
	{ name: '烘干服务', price: '20', desc: '15分钟·快速烘干' }
])

const selectedService = ref(0)

const totalPrice = computed(() => {
	if (selectedService.value !== null) {
		return serviceList.value[selectedService.value].price
	}
	return '0'
})

const tipsList = ref([
	'本设备需预支付费用，结算后原路退回',
	'使用过程中如遇问题请联系门店客服'
])

const selectService = (index) => {
	selectedService.value = index
}

const goPayConfirm = () => {
	uni.navigateTo({
		url: `/pages/pay-confirm/pay-confirm?deviceId=${device.value.id}&serviceIndex=${selectedService.value}`
	})
}

const goMine = () => {
	uni.switchTab({ url: '/pages/mine/mine' })
}

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
})
</script>

<style lang="scss" scoped>
/* 主题色 */
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

.page-home {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 160rpx;
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
.nav-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}
.nav-right {
	padding: 8rpx 20rpx;
	background-color: rgba(255,255,255,0.25);
	border-radius: 999rpx;
}
.nav-avatar-text {
	font-size: 26rpx;
	color: #fff;
}

/* 设备信息卡片 */
.device-card {
	background-color: #fff;
	margin: 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06);
	position: relative;
	z-index: 1;
}
.device-card-top {}
.device-name-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
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
.device-addr {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}
.addr-icon {
	font-size: 24rpx;
	margin-right: 8rpx;
}
.addr-text {
	font-size: 26rpx;
	color: #666;
}
.device-distance {
	margin-top: 4rpx;
}
.distance-text {
	font-size: 24rpx;
	color: #999;
}

/* 使用指引 */
.guide-section {
	background-color: #fff;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
	position: relative;
	z-index: 1;
}
.guide-title-row {
	margin-bottom: 24rpx;
}
.guide-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}
.guide-list {
	display: flex;
	flex-direction: column;
}
.guide-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	&:last-child { margin-bottom: 0; }
}
.guide-step {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background-color: $primary-light;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
}
.step-num {
	font-size: 28rpx;
	font-weight: 700;
	color: $primary-dark;
}
.guide-content {
	display: flex;
	flex-direction: column;
}
.guide-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 4rpx;
}
.guide-desc {
	font-size: 24rpx;
	color: #999;
}

/* 服务卡片 */
.service-section {
	background-color: #fff;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
	position: relative;
	z-index: 1;
}
.service-title-row {
	margin-bottom: 24rpx;
}
.service-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}
.service-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}
.service-card {
	width: calc(50% - 8rpx);
	padding: 28rpx 24rpx;
	border-radius: 20rpx;
	border: 2rpx solid #e8e8e8;
	box-sizing: border-box;
	transition: all 0.2s;
	&.active {
		border-color: $primary;
		background-color: $primary-bg;
	}
}
.service-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}
.service-price {
	font-size: 36rpx;
	font-weight: 700;
	color: #ff4d4f;
	display: block;
	margin-bottom: 4rpx;
}
.service-desc {
	font-size: 22rpx;
	color: #999;
	display: block;
}

/* 温馨提示 */
.tips-section {
	margin: 0 24rpx 24rpx;
	position: relative;
	z-index: 1;
}
.tips-row {
	display: flex;
	align-items: flex-start;
	margin-bottom: 12rpx;
	&:last-child { margin-bottom: 0; }
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
	&:active {
		opacity: 0.85;
	}
}
.pay-btn-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}
</style>
