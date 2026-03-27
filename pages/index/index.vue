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
				<view class="entry-item" v-for="(item, index) in quickEntries" :key="index" @click="onEntryClick(item)">
					<view class="entry-icon">
						<image v-if="item.iconImage" class="entry-icon-img" :src="item.iconImage" mode="aspectFit" />
						<text v-else>{{ item.icon }}</text>
					</view>
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

		<!-- 团购核销底部弹窗 -->
		<view class="redeem-overlay" v-if="showRedeemPopup" @click="closeRedeemPopup">
			<view class="redeem-popup" @click.stop>
				<view class="popup-header">
					<text class="popup-title">团购核销</text>
					<text class="popup-close" @click="closeRedeemPopup">✕</text>
				</view>
				<view class="popup-body">
					<view class="popup-input-wrap">
						<input
							class="popup-input"
							v-model="redeemCode"
							placeholder="请输入核销码"
							maxlength="20"
							type="text"
						/>
					</view>
					<view class="popup-btn" @click="onConfirmRedeem">确认核销</view>
					<view class="popup-tips">*核销使用后结余金额不可退款</view>
				</view>
			</view>
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
	{ id: 1, image: '/banner/banner1.jpg', link: '', title: '轮播图1' },
	{ id: 2, image: '/banner/banner2.jpg', link: '', title: '轮播图2' },
	{ id: 3, image: '/banner/banner3.jpg', link: '', title: '轮播图3' },
	{ id: 4, image: '/banner/banner4.jpg', link: '', title: '轮播图4' }
])

// 快捷入口
const quickEntries = ref([
	{ iconImage: '/icon/qiandao.png', text: '预约服务', url: '/pages/book-service/book-service' },
	{ iconImage: '/icon/saomahexiao.png', text: '团购核销', action: 'redeem' },
	{ iconImage: '/icon/youhuichognzhi.png', text: '优惠充值', url: '/pages/wallet/wallet' },
	{ iconImage: '/icon/qianbao.png', text: '我的订单', url: '/pages/wash-order-list/wash-order-list' },
	{ iconImage: '/icon/fenxiang.png', text: '分享有礼', action: 'share' }
])

// 充值金额
const rechargeAmounts = ref([
	{ amount: 50, bonus: 5 },
	{ amount: 100, bonus: 15 },
	{ amount: 200, bonus: 40 },
	{ amount: 500, bonus: 120 }
])

// 团购核销弹窗
const showRedeemPopup = ref(false)
const redeemCode = ref('')

onMounted(() => {
	// 获取状态栏高度
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0

	// TODO: 加载设备详情
	// fetchDeviceDetail(101).then(res => { device.value = res })
	// getRechargeAmounts().then(res => { rechargeAmounts.value = res })
})

// 快捷入口点击
const onEntryClick = (item) => {
	if (item.action === 'redeem') {
		showRedeemPopup.value = true
		return
	}
	if (item.action === 'share') {
		// TODO: 分享有礼逻辑
		uni.showToast({ title: '分享有礼功能开发中', icon: 'none' })
		return
	}
	if (item.url) {
		uni.navigateTo({ url: item.url })
	}
}

// 跳转页面
const navigateTo = (url) => {
	uni.navigateTo({ url })
}

// 关闭核销弹窗
const closeRedeemPopup = () => {
	showRedeemPopup.value = false
	redeemCode.value = ''
}

// 确认核销
const onConfirmRedeem = () => {
	if (!redeemCode.value.trim()) {
		uni.showToast({ title: '请输入核销码', icon: 'none' })
		return
	}
	// TODO: 调用核销接口校验核销码
	// redeemCoupon({ code: redeemCode.value }).then(res => { ... })
	uni.showToast({ title: '核销成功', icon: 'success' })
	closeRedeemPopup()
	setTimeout(() => {
		uni.navigateTo({ url: '/pages/book-service/book-service' })
	}, 500)
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

	.entry-icon-img {
		width: 56rpx;
		height: 56rpx;
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

/* 团购核销底部弹窗 */
.redeem-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.redeem-popup {
	width: 100%;
	background-color: #fff;
	border-radius: 32rpx 32rpx 0 0;
	padding: 40rpx 32rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	animation: slideUp 0.3s ease-out;
	box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.15);
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.popup-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #999;
}

.popup-body {
	display: flex;
	flex-direction: column;
}

.popup-input-wrap {
	background-color: #f5f5f5;
	border-radius: 16rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 32rpx;
}

.popup-input {
	font-size: 30rpx;
	color: #333;
	height: 48rpx;
}

.popup-btn {
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 28rpx 0;
	border-radius: 999rpx;
	margin-bottom: 24rpx;
}

.popup-tips {
	text-align: center;
	font-size: 22rpx;
	color: #999;
}
</style>
