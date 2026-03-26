<!-- pages/index/index.vue -->
<!-- 默认主页（设备详情页） -->
<template>
	<view class="page-index">
		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">智能洗宠机</view>
		</view>

		<!-- 设备信息区域 -->
		<view class="device-info-card">
			<view class="device-top">
				<view class="device-name">{{ device.name }}</view>
				<view :class="['status-badge', device.status === 1 ? 'badge-green' : 'badge-orange']">
					{{ device.statusText }}
				</view>
			</view>
			<view class="device-detail">
				<view class="detail-item">
					<text class="detail-icon">📍</text>
					<text class="detail-text">{{ device.distance }}</text>
				</view>
				<view class="detail-item">
					<text class="detail-icon">🏠</text>
					<text class="detail-text">{{ device.address }}</text>
				</view>
			</view>
		</view>

		<!-- 轮播图 -->
		<view class="swiper-section">
			<swiper class="banner-swiper" :autoplay="true" :interval="4000" :circular="true"
				:indicator-dots="true" indicator-color="rgba(255,255,255,0.5)"
				indicator-active-color="#fff" @change="onSwiperChange">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<view class="swiper-item" @click="onBannerClick(item)">
						<image class="swiper-image" :src="item.image" mode="aspectFill" />
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entry">
			<view class="entry-title">快捷服务</view>
			<view class="entry-grid">
				<view class="entry-item" v-for="(item, index) in quickEntries" :key="index" @click="navigateTo(item.url)">
					<view class="entry-icon">{{ item.icon }}</view>
					<text class="entry-text">{{ item.text }}</text>
				</view>
			</view>
		</view>

		<!-- 充值快捷金额 -->
		<view class="recharge-section">
			<view class="section-title">预充值</view>
			<view class="recharge-list">
				<view class="recharge-card" v-for="(item, index) in rechargeAmounts" :key="index" @click="onRecharge(item)">
					<view class="recharge-amount">￥{{ item.amount }}</view>
					<view class="recharge-bonus" v-if="item.bonus">送￥{{ item.bonus }}</view>
					<view class="recharge-tag">充值</view>
				</view>
			</view>
		</view>

		<!-- 设备功能 -->
		<view class="features-section">
			<view class="section-title">设备功能</view>
			<view class="features-list">
				<view class="feature-item" v-for="(item, index) in device.features" :key="index">
					<text class="feature-icon">{{ ['🧴', '✨', '💧', '🔥'][index] }}</text>
					<text class="feature-text">{{ item }}</text>
				</view>
			</view>
		</view>

		<!-- 提示 -->
		<view class="tips-section">
			<text class="tips-text">* 本设备需预支付{{ device.prepayAmount }}元，结算订单后原路退回</text>
			<text class="tips-text">* 每分钟{{ device.pricePerMinute }}元，按量计费</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDeviceDetail, getRechargeAmounts } from '@/api/pay.js'
import { getDeviceDetail as fetchDeviceDetail } from '@/api/store.js'

const statusBarHeight = ref(0)

// 设备信息 Mock
const device = ref({
	id: 101,
	name: '智能洗宠机A1',
	storeName: '物沃宠物洗护中心（南山店）',
	address: '深圳市南山区科技园南区深南大道9966号',
	status: 1,
	statusText: '可使用',
	pricePerMinute: 0.8,
	distance: '3.6KM',
	prepayAmount: 50,
	features: ['香波洗护', '护毛护理', '清水冲洗', '消毒烘干']
})

// 轮播图 Mock
const bannerList = ref([
	{ id: 1, image: '/static/images/banner1.png', link: '', title: '开业优惠' },
	{ id: 2, image: '/static/images/banner2.png', link: '', title: '充100送30' },
	{ id: 3, image: '/static/images/banner3.png', link: '', title: '新用户专享' }
])

// 快捷入口
const quickEntries = ref([
	{ icon: '📅', text: '预约服务', url: '/pages/book-service/book-service' },
	{ icon: '👁', text: '查看现场', url: '/pages/store-detail/store-detail?storeId=1' },
	{ icon: '💰', text: '预充值', url: '/pages/wallet/wallet' },
	{ icon: '🎫', text: '团购核销', url: '/pages/coupon-redeem/coupon-redeem' },
	{ icon: '📱', text: '查看其它设备', url: '/pages/store-list/store-list' }
])

// 充值金额
const rechargeAmounts = ref([
	{ amount: 50, bonus: 5 },
	{ amount: 100, bonus: 15 },
	{ amount: 200, bonus: 40 },
	{ amount: 500, bonus: 120 }
])

onMounted(() => {
	// 获取状态栏高度
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0

	// TODO: 加载设备详情
	// fetchDeviceDetail(101).then(res => { device.value = res })
	// getRechargeAmounts().then(res => { rechargeAmounts.value = res })
})

// 跳转页面
const navigateTo = (url) => {
	uni.navigateTo({ url })
}

// 充值
const onRecharge = (item) => {
	uni.navigateTo({ url: `/pages/wallet/wallet?amount=${item.amount}` })
}

// 轮播图切换
const onSwiperChange = (e) => {
	// TODO: 可上报轮播图曝光
}

// 轮播图点击
const onBannerClick = (item) => {
	if (item.link) {
		uni.navigateTo({ url: item.link })
	}
}
</script>

<style lang="scss" scoped>
.page-index {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 140rpx;
}

.nav-bar {
	background: linear-gradient(135deg, #07C160, #38d976);
	padding: 20rpx 32rpx;

	.nav-content {
		font-size: 36rpx;
		font-weight: 600;
		color: #fff;
		text-align: center;
		padding: 20rpx 0;
	}
}

.device-info-card {
	background-color: #fff;
	margin: -20rpx 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.device-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.device-name {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.status-badge {
	font-size: 24rpx;
	padding: 6rpx 20rpx;
	border-radius: 999rpx;
}

.badge-green {
	background-color: #e8f8ee;
	color: #07C160;
}

.badge-orange {
	background-color: #fff3e8;
	color: #ff9500;
}

.device-detail {
	display: flex;
	flex-direction: column;
}

.detail-item {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.detail-icon {
	margin-right: 12rpx;
	font-size: 28rpx;
}

.detail-text {
	font-size: 26rpx;
	color: #666;
}

.swiper-section {
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	overflow: hidden;
}

.banner-swiper {
	width: 100%;
	height: 320rpx;
	border-radius: 24rpx;
}

.swiper-item {
	width: 100%;
	height: 100%;
}

.swiper-image {
	width: 100%;
	height: 100%;
	border-radius: 24rpx;
}

.quick-entry {
	background-color: #fff;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
}

.entry-title,
.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.entry-grid {
	display: flex;
	justify-content: space-between;
}

.entry-item {
	display: flex;
	flex-direction: column;
	align-items: center;

	.entry-icon {
		width: 96rpx;
		height: 96rpx;
		border-radius: 24rpx;
		background-color: #e8f8ee;
		display: flex;
	align-items: center;
	justify-content: center;
		font-size: 44rpx;
		margin-bottom: 12rpx;
	}

	.entry-text {
		font-size: 24rpx;
		color: #333;
	}
}

.recharge-section {
	background-color: #fff;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
}

.recharge-list {
	display: flex;
	overflow-x: auto;
	white-space: nowrap;
}

.recharge-card {
	min-width: 200rpx;
	height: 160rpx;
	border-radius: 20rpx;
	background: linear-gradient(135deg, #07C160, #38d976);
	margin-right: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	flex-shrink: 0;
}

.recharge-amount {
	font-size: 44rpx;
	font-weight: 700;
	color: #fff;
}

.recharge-bonus {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-top: 4rpx;
}

.recharge-tag {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	font-size: 20rpx;
	color: rgba(255, 255, 255, 0.8);
	background-color: rgba(255, 255, 255, 0.2);
	padding: 2rpx 12rpx;
	border-radius: 999rpx;
}

.features-section {
	background-color: #fff;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
}

.features-list {
	display: flex;
	flex-wrap: wrap;
}

.feature-item {
	width: 50%;
	display: flex;
	align-items: center;
	padding: 16rpx 0;

	.feature-icon {
		font-size: 36rpx;
		margin-right: 12rpx;
	}

	.feature-text {
		font-size: 28rpx;
		color: #333;
	}
}

.tips-section {
	margin: 0 24rpx;
	padding: 24rpx 32rpx;
}

.tips-text {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-bottom: 8rpx;
}
</style>
