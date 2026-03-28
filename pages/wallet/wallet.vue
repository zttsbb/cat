<!-- pages/wallet/wallet.vue -->
<!-- 预充值/钱包页（对齐原型图-门店列表11） -->
<template>
	<view class="page-wallet">
		<!-- 返回导航 + 门店信息 -->
		<view class="store-header">
			<view class="store-nav" @click="goBack">
				<text class="nav-back">‹</text>
				<text class="nav-title">返回</text>
			</view>
			<view class="store-info">
				<view class="store-name">{{ store.name }}</view>
				<view class="store-tags">
					<view class="store-tag" v-for="(tag, idx) in store.tags" :key="idx">
						<text class="tag-text">{{ tag }}</text>
					</view>
				</view>
				<view class="store-addr-row">
					<text class="store-addr">{{ store.address }}</text>
					<view class="store-switch" @click="goStoreList">
						<text class="switch-text">切换门店</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 充值金额卡片 -->
		<view class="recharge-section">
			<view class="recharge-scroll">
				<view class="recharge-card" v-for="(item, index) in rechargeAmounts" :key="index" @click="onRecharge(item)">
					<view class="recharge-amount">￥{{ item.amount }}</view>
					<view class="recharge-bonus" v-if="item.bonus">赠￥{{ item.bonus }}</view>
				</view>
			</view>
		</view>

		<!-- 余额信息 -->
		<view class="balance-section">
			<view class="balance-row">
				<text class="balance-label">我的余额</text>
				<text class="balance-value">￥{{ walletInfo.balance }}</text>
			</view>
			<view class="balance-action" @click="viewStores">
				<text class="action-text">查看可用门店></text>
			</view>
		</view>

		<!-- 充值说明 -->
		<view class="recharge-notice">
			<view class="notice-title">充值说明</view>
			<view class="notice-item">1. 充值金额仅限该商家使用，充值后不退款</view>
			<view class="notice-item">2. 充值金额永久有效</view>
		</view>

		<!-- 门店余额列表 -->
		<view class="store-balance-section">
			<view class="section-title">门店余额</view>
			<view class="store-balance-list">
				<view class="store-balance-item" v-for="(item, index) in walletInfo.storeBalances" :key="index">
					<view class="store-name ellipsis">{{ item.storeName }}</view>
					<view class="store-amount">余额￥{{ item.balance.toFixed(2) }}</view>
				</view>
			</view>
		</view>

		<!-- 支付方式底部弹窗 -->
		<view class="pay-overlay" v-if="showPayPopup" @click="closePayPopup">
			<view class="pay-popup" @click.stop>
				<view class="popup-header">
					<text class="popup-title">选择支付方式</text>
					<text class="popup-close" @click="closePayPopup">✕</text>
				</view>
				<view class="popup-amount">
					<text class="popup-amount-label">充值金额</text>
					<text class="popup-amount-value">￥{{ selectedAmount }}</text>
				</view>
				<view class="popup-body">
					<view class="pay-option" v-for="(item, index) in payMethods" :key="index" @click="onPaySelect(item)">
						<view class="pay-option-icon">
							<text v-if="item.emoji">{{ item.emoji }}</text>
							<image v-if="item.iconImage" class="pay-option-icon-img" :src="item.iconImage" mode="aspectFit" />
						</view>
						<text class="pay-option-text">{{ item.label }}</text>
						<text class="pay-option-arrow">›</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 优惠券选择底部弹窗 -->
		<view class="coupon-overlay" v-if="showCouponPopup" @click="closeCouponPopup">
			<view class="coupon-popup" @click.stop>
				<view class="coupon-popup-header">
					<text class="coupon-popup-title">选择优惠券</text>
					<text class="coupon-popup-close" @click="closeCouponPopup">✕</text>
				</view>
				<view class="coupon-popup-body">
					<view
						class="coupon-card-item"
						v-for="(coupon, index) in couponList"
						:key="index"
						@click="onCouponSelect(coupon)"
						:class="{ disabled: coupon.disabled }"
					>
						<view class="coupon-card-left">
							<text class="coupon-card-symbol">￥</text>
							<text class="coupon-card-amount">{{ coupon.amount }}</text>
						</view>
						<view class="coupon-card-divider"></view>
						<view class="coupon-card-right">
							<view class="coupon-card-info">
								<text class="coupon-card-name">{{ coupon.name }}</text>
								<text class="coupon-card-desc">{{ coupon.desc }}</text>
							</view>
							<text class="coupon-card-expire">{{ coupon.expire }}</text>
						</view>
						<view class="coupon-card-check" v-if="selectedCoupon && selectedCoupon.id === coupon.id">
							<text class="check-icon">✓</text>
						</view>
					</view>
					<!-- 不使用优惠券 -->
					<view class="coupon-no-use" @click="onCouponSelect(null)">
						<text class="no-use-text">不使用优惠券</text>
						<view class="no-use-check" v-if="!selectedCoupon">
							<text class="check-icon">✓</text>
						</view>
					</view>
					<view class="coupon-empty" v-if="couponList.length === 0">
						<text class="coupon-empty-text">暂无可用优惠券</text>
					</view>
				</view>
				<view class="coupon-confirm-btn" @click="confirmCoupon">
					确认使用
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getWalletInfo, getRechargeAmounts } from '@/api/pay.js'

// 门店信息 Mock
const store = ref({
	id: 1,
	name: '我是门店名称',
	address: '合肥市新海大道5号',
	tags: ['有车位', '有技师', 'WIFI覆盖']
})

const walletInfo = ref({
	balance: 56.89,
	storeBalances: [
		{ storeId: 1, storeName: '物沃门店', balance: 56.80 },
		{ storeId: 2, storeName: '物沃门店', balance: 56.80 }
	]
})

const rechargeAmounts = ref([
	{ amount: 50, bonus: 5 },
	{ amount: 50, bonus: 5 },
	{ amount: 50, bonus: 5 },
	{ amount: 50, bonus: 5 },
	{ amount: 50, bonus: 5 }
])

onMounted(() => {
	loadData()
})

onLoad((options) => {
	// TODO: 根据传入参数加载门店信息
	// if (options.storeId) { loadStoreDetail(options.storeId) }
})

const loadData = async () => {
	// TODO: 调用实际接口
	// const wallet = await getWalletInfo()
	// walletInfo.value = wallet
	// const amounts = await getRechargeAmounts()
	// rechargeAmounts.value = amounts
}

const goBack = () => {
	uni.navigateBack({ delta: 1 })
}

const goStoreList = () => {
	uni.navigateTo({ url: '/pages/store-list/store-list' })
}

const viewStores = () => {
	uni.navigateTo({ url: '/pages/store-list/store-list' })
}

// 支付弹窗相关
const showPayPopup = ref(false)
const showCouponPopup = ref(false)
const selectedAmount = ref(0)
const selectedCoupon = ref(null)

const payMethods = [
	{ emoji: '💰', label: '账户余额', value: 'balance' },
	{ emoji: '🎫', label: '我的卡券', value: 'coupon' },
	{ emoji: '🟢', label: '微信支付', value: 'wechat' }
]

// Mock 优惠券数据
const couponList = ref([
	{ id: 1, name: '洗宠优惠券', desc: '满50元可用', amount: 10, expire: '2026-04-30到期', disabled: false },
	{ id: 2, name: '新用户专享券', desc: '无门槛使用', amount: 5, expire: '2026-04-15到期', disabled: false },
	{ id: 3, name: '充值满减券', desc: '满100元可用', amount: 20, expire: '2026-05-01到期', disabled: true }
])

const onRecharge = (item) => {
	selectedAmount.value = item.amount
	selectedCoupon.value = null
	showPayPopup.value = true
}

const closePayPopup = () => {
	showPayPopup.value = false
}

const onPaySelect = (method) => {
	if (method.value === 'coupon') {
		showCouponPopup.value = true
		return
	}
	showPayPopup.value = false
	// TODO: 根据支付方式调用实际支付接口
	uni.showToast({ title: `使用${method.label}充值￥${selectedAmount.value}`, icon: 'none' })
}

// 优惠券选择相关
const onCouponSelect = (coupon) => {
	if (coupon && coupon.disabled) return
	selectedCoupon.value = coupon
}

const closeCouponPopup = () => {
	showCouponPopup.value = false
	selectedCoupon.value = null
}

const confirmCoupon = () => {
	showCouponPopup.value = false
	if (selectedCoupon.value) {
		uni.showToast({
			title: `使用优惠券-￥${selectedCoupon.value.amount}充值￥${selectedAmount.value}`,
			icon: 'none'
		})
	} else {
		uni.showToast({ title: '未选择优惠券', icon: 'none' })
	}
}
</script>

<style lang="scss" scoped>
.page-wallet {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 门店信息头部 */
.store-header {
	background-color: #fff;
	padding: 24rpx 32rpx;
}

.store-nav {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.nav-back {
	font-size: 48rpx;
	color: #333;
	font-weight: 300;
	margin-right: 12rpx;
}

.nav-title {
	font-size: 30rpx;
	color: #333;
}

.store-info {
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f0f0;
}

.store-name {
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
	margin-bottom: 16rpx;
}

.store-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 16rpx;
}

.store-tag {
	margin-right: 16rpx;
	margin-bottom: 8rpx;
}

.tag-text {
	font-size: 24rpx;
	color: #666;
}

.store-addr-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.store-addr {
	font-size: 26rpx;
	color: #999;
}

.store-switch {
	padding: 6rpx 20rpx;
	background-color: #f5f5f5;
	border-radius: 999rpx;

	&:active {
		background-color: #ebebeb;
	}
}

.switch-text {
	font-size: 24rpx;
	color: #666;
}

/* 充值金额卡片 */
.recharge-section {
	background-color: #fff;
	margin: 0;
	padding: 24rpx 32rpx;
	border-top: 16rpx solid #f5f5f5;
}

.recharge-scroll {
	display: flex;
	overflow-x: auto;
	white-space: nowrap;
}

.recharge-card {
	min-width: 200rpx;
	height: 160rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 20rpx;
	padding: 24rpx;
	text-align: center;
	margin-right: 20rpx;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	&:active {
		border-color: #07C160;
		background-color: #e8f8ee;
	}
}

.recharge-amount {
	font-size: 44rpx;
	font-weight: 700;
	color: #333;
}

.recharge-bonus {
	font-size: 24rpx;
	color: #ff6b35;
	margin-top: 4rpx;
	font-weight: 600;
}

/* 余额信息 */
.balance-section {
	background-color: #fff;
	margin: 0;
	padding: 24rpx 32rpx;
	border-top: 16rpx solid #f5f5f5;
}

.balance-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.balance-label {
	font-size: 28rpx;
	color: #666;
}

.balance-value {
	font-size: 48rpx;
	font-weight: 700;
	color: #333;
}

.balance-action {
	text-align: right;
}

.action-text {
	font-size: 26rpx;
	color: #07C160;
}

/* 充值说明 */
.recharge-notice {
	background-color: #fff;
	margin: 16rpx 0 0;
	padding: 24rpx 32rpx;
	border-top: 16rpx solid #f5f5f5;
}

.notice-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 16rpx;
}

.notice-item {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 8rpx;
}

/* 门店余额列表 */
.store-balance-section {
	background-color: #fff;
	margin: 0;
	padding: 24rpx 32rpx;
	border-top: 16rpx solid #f5f5f5;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 20rpx;
}

.store-balance-list {
	border-top: 1rpx solid #f0f0f0;
}

.store-balance-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.store-name {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.store-amount {
	font-size: 28rpx;
	color: #333;
}

/* 支付方式底部弹窗 */
.pay-overlay {
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

.pay-popup {
	width: 100%;
	background-color: #fff;
	border-radius: 32rpx 32rpx 0 0;
	padding: 40rpx 32rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	animation: slideUp 0.3s ease-out;
	box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.15);
}

@keyframes slideUp {
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
}

.popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
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

.popup-amount {
	display: flex;
	align-items: baseline;
	justify-content: center;
	margin-bottom: 32rpx;
}

.popup-amount-label {
	font-size: 28rpx;
	color: #999;
	margin-right: 12rpx;
}

.popup-amount-value {
	font-size: 56rpx;
	font-weight: 700;
	color: #333;
}

.popup-body {
	border-top: 1rpx solid #f0f0f0;
}

.pay-option {
	display: flex;
	align-items: center;
	padding: 32rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.pay-option-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 16rpx;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	font-size: 36rpx;
}

.pay-option-icon-img {
	width: 48rpx;
	height: 48rpx;
}

.pay-option-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.pay-option-arrow {
	font-size: 36rpx;
	color: #ccc;
}

/* 优惠券选择底部弹窗 */
.coupon-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.coupon-popup {
	width: 100%;
	max-height: 80vh;
	background-color: #f5f5f5;
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease-out;
	box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.15);
}

.coupon-popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx 32rpx 0;
}

.coupon-popup-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.coupon-popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #999;
}

.coupon-popup-body {
	flex: 1;
	overflow-y: auto;
	padding: 24rpx 24rpx 0;
}

.coupon-card-item {
	display: flex;
	align-items: center;
	background-color: #fff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	padding: 28rpx 24rpx;
	position: relative;
	overflow: hidden;

	&.disabled {
		opacity: 0.5;
	}

	&:active {
		background-color: #f9f9f9;
	}
}

.coupon-card-left {
	display: flex;
	align-items: baseline;
	padding-right: 24rpx;
	border-right: 2rpx dashed #ff6b35;
	margin-right: 24rpx;
	min-width: 140rpx;
	justify-content: center;
}

.coupon-card-symbol {
	font-size: 24rpx;
	color: #ff6b35;
	font-weight: 600;
}

.coupon-card-amount {
	font-size: 56rpx;
	font-weight: 700;
	color: #ff6b35;
}

.coupon-card-divider {
	display: none;
}

.coupon-card-right {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.coupon-card-info {
	display: flex;
	flex-direction: column;
	margin-bottom: 8rpx;
}

.coupon-card-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 4rpx;
}

.coupon-card-desc {
	font-size: 24rpx;
	color: #999;
}

.coupon-card-expire {
	font-size: 22rpx;
	color: #ccc;
}

.coupon-card-check {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background-color: #07C160;
	display: flex;
	align-items: center;
	justify-content: center;
}

.check-icon {
	font-size: 28rpx;
	color: #fff;
	font-weight: 700;
}

.coupon-no-use {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32rpx;
	background-color: #fff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;

	&:active {
		background-color: #f9f9f9;
	}
}

.no-use-text {
	font-size: 30rpx;
	color: #333;
}

.no-use-check {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background-color: #07C160;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 16rpx;
}

.coupon-empty {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0;
}

.coupon-empty-text {
	font-size: 28rpx;
	color: #999;
}

.coupon-confirm-btn {
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 28rpx 0;
	padding-bottom: calc(28rpx + env(safe-area-inset-bottom));
}
</style>
