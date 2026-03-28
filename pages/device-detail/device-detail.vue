<!-- pages/device-detail/device-detail.vue -->
<!-- 设备详情页（原型图-默认主页1） -->
<template>
	<view class="page-device-detail">
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
			<!-- 底部操作按钮 -->
			<view class="device-actions">
				<view class="action-btn action-left" @click="goStoreLive">
					<text class="action-btn-text">查看现场</text>
				</view>
				<view class="action-btn action-right" @click="goStoreOpen">
					<text class="action-btn-text">到店开门</text>
				</view>
			</view>
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
			<view class="section-title">
				<image class="section-title-icon" src="/static/icon/youhuichognzhi.png" mode="aspectFit" />
			</view>
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
				<!-- 平台选择 -->
				<view class="platform-grid" v-if="!selectedPlatform">
					<view class="platform-item" v-for="(item, index) in platforms" :key="index" @click="selectPlatform(item)">
						<image class="platform-icon" :src="item.icon" mode="aspectFit" />
						<text class="platform-name">{{ item.label }}</text>
					</view>
				</view>
				<!-- 核销码输入 -->
				<view class="popup-body" v-if="selectedPlatform">
					<view class="platform-selected" @click="selectedPlatform = null">
						<image class="platform-selected-icon" :src="currentPlatformIcon" mode="aspectFit" />
						<text class="platform-selected-name">{{ currentPlatformLabel }}</text>
						<text class="platform-change">切换 ›</text>
					</view>
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
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDeviceDetail } from '@/api/store.js'
import { recharge } from '@/api/pay.js'
import { redeemCoupon } from '@/api/coupon.js'

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

// 快捷入口
const quickEntries = ref([
	{ iconImage: '/static/icon/qiandao.png', text: '预约服务', url: '/pages/book-service/book-service' },
	{ iconImage: '/static/icon/saomahexiao.png', text: '团购核销', action: 'redeem' },
	{ iconImage: '/static/icon/youhuichognzhi.png', text: '优惠充值', url: '/pages/wallet/wallet' },
	{ iconImage: '/static/icon/qianbao.png', text: '我的订单', url: '/pages/wash-order-list/wash-order-list' },
	{ iconImage: '/static/icon/fenxiang.png', text: '分享有礼', action: 'share' }
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
const selectedPlatform = ref(null)

const platforms = [
	{ label: '抖音', icon: '/static/icon/douyin.png', value: 'douyin' },
	{ label: '美团', icon: '/static/icon/meituan.png', value: 'meituan' },
	{ label: '系统', icon: '/static/icon/xitong.png', value: 'system' }
]

const currentPlatformIcon = computed(() => {
	if (!selectedPlatform.value) return ''
	const p = platforms.find(item => item.value === selectedPlatform.value)
	return p ? p.icon : ''
})

const currentPlatformLabel = computed(() => {
	if (!selectedPlatform.value) return ''
	const p = platforms.find(item => item.value === selectedPlatform.value)
	return p ? p.label : ''
})

const selectPlatform = (item) => {
	selectedPlatform.value = item.value
}

onLoad((options) => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0

	// TODO: 根据传入的 deviceId 加载设备详情
	// const deviceId = options?.deviceId || options?.id
	// if (deviceId) {
	// 	getDeviceDetail(deviceId).then(res => { device.value = res })
	// }
})

// tabBar 页面列表
const tabBarPages = [
	'pages/index/index',
	'pages/wash-order-list/wash-order-list',
	'pages/scan/scan',
	'pages/book-order-list/book-order-list',
	'pages/mine/mine'
]

// 快捷入口点击
const onEntryClick = (item) => {
	if (item.action === 'redeem') {
		showRedeemPopup.value = true
		return
	}
	if (item.action === 'share') {
		uni.showToast({ title: '分享有礼功能开发中', icon: 'none' })
		return
	}
	if (item.url) {
		const pagePath = item.url.replace(/^\//, '')
		if (tabBarPages.includes(pagePath)) {
			uni.switchTab({ url: item.url })
		} else {
			uni.navigateTo({ url: item.url })
		}
	}
}

// 查看现场
const goStoreLive = () => {
	uni.navigateTo({ url: '/pages/store-detail/store-detail?storeId=1' })
}

// 到店开门
const goStoreOpen = () => {
	uni.showToast({ title: '开门功能开发中', icon: 'none' })
}

// 关闭核销弹窗
const closeRedeemPopup = () => {
	showRedeemPopup.value = false
	redeemCode.value = ''
	selectedPlatform.value = null
}

// 确认核销
const onConfirmRedeem = () => {
	if (!redeemCode.value.trim()) {
		uni.showToast({ title: '请输入核销码', icon: 'none' })
		return
	}
	const platform = currentPlatformLabel.value
	const code = redeemCode.value
	closeRedeemPopup()
	setTimeout(() => {
		uni.navigateTo({
			url: `/pages/redeem-success/redeem-success?platform=${platform}&code=${code}`
		})
	}, 300)
}

// 充值
const onRecharge = (item) => {
	uni.navigateTo({ url: `/pages/wallet/wallet?amount=${item.amount}` })
}
</script>

<style lang="scss" scoped>
.page-device-detail {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 40rpx;
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
	margin: 24rpx;
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

.device-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 28rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid #f0f0f0;
}

.action-btn {
	flex: 1;
	text-align: center;
	padding: 20rpx 0;
	border-radius: 999rpx;
}

.action-left {
	background-color: #f5f5f5;
	margin-right: 20rpx;

	&:active {
		background-color: #ebebeb;
	}
}

.action-right {
	background: linear-gradient(135deg, #07C160, #38d976);

	&:active {
		opacity: 0.9;
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
	display: flex;
	align-items: center;
}

.section-title-icon {
	width: 36rpx;
	height: 36rpx;
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

.platform-grid {
	display: flex;
	justify-content: space-around;
	padding: 24rpx 0 40rpx;
}

.platform-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24rpx;
	border-radius: 20rpx;
	transition: background-color 0.2s;

	&:active {
		background-color: #f5f5f5;
	}
}

.platform-icon {
	width: 96rpx;
	height: 96rpx;
	margin-bottom: 12rpx;
}

.platform-name {
	font-size: 26rpx;
	color: #333;
}

.platform-selected {
	display: flex;
	align-items: center;
	padding: 20rpx 24rpx;
	background-color: #f5f5f5;
	border-radius: 16rpx;
	margin-bottom: 24rpx;
}

.platform-selected-icon {
	width: 48rpx;
	height: 48rpx;
	margin-right: 16rpx;
}

.platform-selected-name {
	flex: 1;
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.platform-change {
	font-size: 26rpx;
	color: #07C160;
}
</style>
