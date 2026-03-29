<!-- pages/wallet/wallet.vue -->
<!-- 预充值/钱包页 -->
<template>
	<view class="page-wallet">
		<!-- ========== 余额卡片（主题色） ========== -->
		<view class="balance-card">
			<view class="balance-left">
				<text class="balance-label">我的余额</text>
				<text class="balance-amount">￥{{ walletInfo.balance }}</text>
			</view>
			<view class="balance-right" @click="viewStores">
				<text class="balance-btn-text">查看可用门店</text>
			</view>
		</view>

		<!-- ========== 门店信息卡片 ========== -->
		<view class="store-card">
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

		<!-- ========== 优惠充值 ========== -->
		<view class="recharge-section">
			<view class="section-header">
				<text class="section-title">优惠充值</text>
			</view>
			<view class="recharge-list">
				<view class="recharge-item" v-for="(item, index) in rechargeAmounts" :key="index" @click="onRecharge(item)">
					<view class="recharge-left">
						<text class="recharge-amount">￥{{ item.amount }}</text>
					</view>
					<view class="recharge-divider"></view>
					<view class="recharge-right">
						<view class="recharge-bonus" v-if="item.bonus">
							<image class="bonus-icon" src="/static/icon/ceng.png" mode="aspectFit" />
							<text class="bonus-text">赠￥{{ item.bonus }}</text>
						</view>
						<view class="recharge-action">
							<text class="action-arrow">›</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- ========== 底部返回按钮 ========== -->
		<view class="bottom-bar">
			<view class="back-btn" @click="goBack">
				<text class="back-btn-text">返回</text>
			</view>
		</view>

		<!-- ========== 支付方式选择弹窗 ========== -->
		<view class="pay-mask" v-if="showPayPopup" @click="closePayPopup">
			<view class="pay-popup" @click.stop>
				<view class="pay-popup-header">
					<text class="pay-popup-title">选择支付方式</text>
					<view class="pay-popup-close" @click="closePayPopup">
						<text>✕</text>
					</view>
				</view>
				<view class="pay-amount">
					<text class="pay-amount-label">充值金额</text>
					<text class="pay-amount-value">￥{{ selectedRecharge?.amount }}</text>
				</view>
				<view class="pay-popup-body">
					<!-- 账户余额 -->
					<view class="pay-option" @click="onPaySelect('balance')">
						<view class="pay-option-icon">
							<text>💰</text>
						</view>
						<view class="pay-option-info">
							<text class="pay-option-text">账户余额</text>
							<text class="pay-option-desc">可用余额￥{{ walletInfo.balance }}</text>
						</view>
						<view class="pay-option-radio" :class="{ active: selectedPayMethod === 'balance' }">
							<text class="radio-dot" v-if="selectedPayMethod === 'balance'"></text>
						</view>
					</view>
					<!-- 我的卡券 -->
					<view class="pay-option" @click="pickCoupon">
						<view class="pay-option-icon">
							<text>🎫</text>
						</view>
						<view class="pay-option-info">
							<text class="pay-option-text">我的卡券</text>
							<text class="pay-option-desc" v-if="selectedCoupon">-￥{{ selectedCoupon.amount }}</text>
							<text class="pay-option-desc" v-else>选择优惠券</text>
						</view>
						<text class="pay-option-arrow">›</text>
					</view>
					<!-- 微信支付 -->
					<view class="pay-option" @click="onPaySelect('wechat')">
						<view class="pay-option-icon">
							<text>🟢</text>
						</view>
						<view class="pay-option-info">
							<text class="pay-option-text">微信支付</text>
							<text class="pay-option-desc">推荐使用</text>
						</view>
						<view class="pay-option-radio" :class="{ active: selectedPayMethod === 'wechat' }">
							<text class="radio-dot" v-if="selectedPayMethod === 'wechat'"></text>
						</view>
					</view>
				</view>
				<view class="pay-confirm-btn" @click="confirmPay">
					<text class="pay-confirm-text">确认充值</text>
				</view>
			</view>
		</view>

		<!-- ========== 优惠券选择弹窗 ========== -->
		<view class="coupon-mask" v-if="showCouponPicker" @click="showCouponPicker = false">
			<view class="coupon-popup" @click.stop>
				<view class="coupon-popup-header">
					<text class="coupon-popup-title">选择优惠券</text>
					<view class="coupon-popup-close" @click="showCouponPicker = false">
						<text>✕</text>
					</view>
				</view>
				<scroll-view scroll-y class="coupon-popup-list">
					<view
						:class="['cp-item', { active: selectedCoupon && selectedCoupon.id === c.id, disabled: c.disabled }]"
						v-for="c in couponList"
						:key="c.id"
						@click="!c.disabled && onSelectCoupon(c)"
					>
						<view class="cp-left">
							<text class="cp-sym">￥</text>
							<text class="cp-num">{{ c.amount }}</text>
						</view>
						<view class="cp-right">
							<text class="cp-name">{{ c.name }}</text>
							<text class="cp-scope">{{ c.scope }}</text>
							<text class="cp-expire">{{ c.expireText }}</text>
						</view>
						<view class="cp-check" v-if="selectedCoupon && selectedCoupon.id === c.id">✓</view>
					</view>
					<view class="cp-no-use" :class="{ active: !selectedCoupon }" @click="onSelectCoupon(null)">
						<text class="cp-no-use-text">不使用优惠券</text>
						<view class="cp-check" v-if="!selectedCoupon">✓</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- ========== 充值成功弹窗 ========== -->
		<view class="success-mask" v-if="showSuccess" @click="onSuccessClick">
			<view class="success-popup" @click.stop>
				<view class="success-icon">✓</view>
				<text class="success-title">充值成功</text>
				<text class="success-desc">充值金额已到账</text>
				<view class="success-btn" @click="onSuccessOk">
					<text class="success-btn-text">确定</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getWalletInfo, getRechargeAmounts, getAvailableCoupons } from '@/api/pay.js'

// 门店信息 Mock
const store = ref({
	id: 1,
	name: '我是门店名称',
	address: '合肥市新海大道5号',
	tags: ['有车位', '有技师', 'WIFI覆盖']
})

const walletInfo = ref({
	balance: 56.89
})

const rechargeAmounts = ref([
	{ amount: 50, bonus: 5 },
	{ amount: 100, bonus: 15 },
	{ amount: 200, bonus: 40 },
	{ amount: 500, bonus: 120 }
])

// 支付弹窗
const showPayPopup = ref(false)
const showCouponPicker = ref(false)
const showSuccess = ref(false)
const selectedRecharge = ref(null)
const selectedPayMethod = ref('wechat')
const selectedCoupon = ref(null)

// 优惠券列表
const couponList = ref([
	{ id: 1, name: '美团·次卡', amount: 20, scope: '适用于:充值', expireText: '剩余有效期3天', disabled: false },
	{ id: 2, name: '洗宠优惠券', amount: 10, scope: '适用于:充值', expireText: '剩余有效期15天', disabled: false },
	{ id: 3, name: '系统·余额卷', amount: 30, scope: '适用于:充值', expireText: '剩余有效期60天', disabled: false }
])

onMounted(() => {
	loadData()
})

onLoad((options) => {
	// TODO: 根据传入参数加载门店信息
	// if (options.storeId) { loadStoreDetail(options.storeId) }
})

const loadData = async () => {
	try {
		const wallet = await getWalletInfo()
		if (wallet) walletInfo.value = wallet
	} catch (e) {}
	try {
		const amounts = await getRechargeAmounts()
		if (amounts) rechargeAmounts.value = amounts
	} catch (e) {}
	try {
		const coupons = await getAvailableCoupons({ type: 'recharge' })
		if (coupons) couponList.value = coupons
	} catch (e) {}
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

const onRecharge = (item) => {
	selectedRecharge.value = item
	selectedPayMethod.value = 'wechat'
	selectedCoupon.value = null
	showPayPopup.value = true
}

const closePayPopup = () => {
	showPayPopup.value = false
}

const onPaySelect = (method) => {
	if (method === 'wechat' || method === 'balance') {
		selectedPayMethod.value = method
	}
}

const pickCoupon = () => {
	showCouponPicker.value = true
}

const onSelectCoupon = (c) => {
	selectedCoupon.value = c
	showCouponPicker.value = false
}

const confirmPay = () => {
	// TODO: 调用充值接口
	// uni.showToast({ title: '充值成功', icon: 'success' })
	showPayPopup.value = false
	showSuccess.value = true
}

const onSuccessClick = () => {
	// 不做任何操作
}

const onSuccessOk = () => {
	showSuccess.value = false
	// 重新加载余额
	loadData()
}
</script>

<style lang="scss" scoped>
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

.page-wallet {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

/* ==================== 余额卡片（主题色） ==================== */
.balance-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: $primary;
	margin: 24rpx;
	padding: 40rpx 32rpx;
	border-radius: 20rpx;
}

.balance-left {
	display: flex;
	flex-direction: column;
}

.balance-label {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 12rpx;
}

.balance-amount {
	font-size: 56rpx;
	font-weight: 700;
	color: #fff;
}

.balance-right {
	padding: 16rpx 32rpx;
	background: rgba(255, 255, 255, 0.25);
	border-radius: 999rpx;

	&:active {
		background: rgba(255, 255, 255, 0.35);
	}
}

.balance-btn-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: 500;
}

/* ==================== 门店信息卡片 ==================== */
.store-card {
	background: #fff;
	margin: 0 24rpx 24rpx;
	padding: 32rpx;
	border-radius: 20rpx;
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
	margin-bottom: 20rpx;
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
	flex: 1;
	font-size: 26rpx;
	color: #999;
}

.store-switch {
	padding: 8rpx 24rpx;
	background-color: #f5f5f5;
	border-radius: 999rpx;

	&:active {
		background-color: #ebebeb;
	}
}

.switch-text {
	font-size: 26rpx;
	color: #666;
}

/* ==================== 优惠充值 ==================== */
.recharge-section {
	background: #fff;
	margin: 0 24rpx 24rpx;
	padding: 32rpx;
	border-radius: 20rpx;
}

.section-header {
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
}

.recharge-list {
	display: flex;
	flex-direction: column;
}

.recharge-item {
	display: flex;
	align-items: center;
	padding: 28rpx;
	background: $primary-bg;
	border-radius: 16rpx;
	margin-bottom: 16rpx;

	&:last-child {
		margin-bottom: 0;
	}

	&:active {
		background: $primary-light;
	}
}

.recharge-left {
	flex: 1;
}

.recharge-amount {
	font-size: 40rpx;
	font-weight: 700;
	color: $primary-dark;
}

.recharge-divider {
	width: 2rpx;
	height: 60rpx;
	background: rgba(145, 222, 0, 0.3);
	margin: 0 24rpx;
}

.recharge-right {
	display: flex;
	align-items: center;
}

.recharge-bonus {
	display: flex;
	align-items: center;
	margin-right: 16rpx;
}

.bonus-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 8rpx;
}

.bonus-text {
	font-size: 28rpx;
	color: #ff6b35;
	font-weight: 600;
}

.recharge-action {
	display: flex;
	align-items: center;
}

.action-arrow {
	font-size: 40rpx;
	color: #ccc;
}

/* ==================== 底部返回按钮 ==================== */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 16rpx 24rpx;
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	border-top: 1rpx solid #f0f0f0;
}

.back-btn {
	background: $primary;
	border-radius: 99rpx;
	padding: 24rpx 0;
	text-align: center;

	&:active {
		background: $primary-dark;
	}
}

.back-btn-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}

/* ==================== 支付方式选择弹窗 ==================== */
.pay-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.pay-popup {
	width: 100%;
	background: #fff;
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease-out;
	padding-bottom: calc(env(safe-area-inset-bottom));
}

@keyframes slideUp {
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
}

.pay-popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 32rpx 20rpx;
}

.pay-popup-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.pay-popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #999;
}

.pay-amount {
	text-align: center;
	padding: 20rpx 0 32rpx;
}

.pay-amount-label {
	font-size: 28rpx;
	color: #999;
	margin-right: 12rpx;
}

.pay-amount-value {
	font-size: 56rpx;
	font-weight: 700;
	color: #333;
}

.pay-popup-body {
	padding: 0 32rpx;
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
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	font-size: 36rpx;
}

.pay-option-info {
	flex: 1;
}

.pay-option-text {
	font-size: 30rpx;
	color: #333;
	display: block;
	margin-bottom: 4rpx;
}

.pay-option-desc {
	font-size: 24rpx;
	color: #999;
}

.pay-option-arrow {
	font-size: 36rpx;
	color: #ccc;
}

.pay-option-radio {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	border: 2rpx solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;

	&.active {
		border-color: $primary;
	}
}

.radio-dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background: $primary;
}

.pay-confirm-btn {
	background: $primary;
	margin: 16rpx 32rpx 32rpx;
	border-radius: 99rpx;
	padding: 28rpx 0;
	text-align: center;

	&:active {
		opacity: 0.85;
	}
}

.pay-confirm-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}

/* ==================== 优惠券选择弹窗 ==================== */
.coupon-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1002;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.coupon-popup {
	width: 100%;
	max-height: 70vh;
	background: #fff;
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease-out;
}

.coupon-popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 32rpx 16rpx;
}

.coupon-popup-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #222;
}

.coupon-popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #999;
}

.coupon-popup-list {
	flex: 1;
	padding: 12rpx 24rpx;
	padding-bottom: env(safe-area-inset-bottom);
}

.cp-item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	margin-bottom: 16rpx;
	border-radius: 16rpx;
	border: 2rpx solid #e8e8e8;
	background: #fff;

	&.active {
		border-color: $primary;
		background: $primary-bg;
	}

	&.disabled {
		opacity: 0.5;
	}
}

.cp-left {
	display: flex;
	align-items: baseline;
	padding-right: 20rpx;
	border-right: 2rpx dashed #e0e0e0;
	margin-right: 20rpx;
	min-width: 120rpx;
	justify-content: center;
}

.cp-sym {
	font-size: 24rpx;
	color: #ff6b35;
	font-weight: 600;
}

.cp-num {
	font-size: 44rpx;
	color: #ff6b35;
	font-weight: 700;
}

.cp-right {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.cp-name {
	font-size: 26rpx;
	font-weight: 600;
	color: #222;
	margin-bottom: 4rpx;
}

.cp-scope {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 2rpx;
}

.cp-expire {
	font-size: 20rpx;
	color: #ccc;
}

.cp-check {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background: $primary;
	color: #fff;
	font-size: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 12rpx;
	flex-shrink: 0;
}

.cp-no-use {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 28rpx;
	border-radius: 16rpx;
	border: 2rpx dashed #ddd;
	margin-bottom: 16rpx;

	&.active {
		border-color: $primary;
		background: $primary-bg;
	}
}

.cp-no-use-text {
	font-size: 28rpx;
	color: #333;
}

/* ==================== 充值成功弹窗 ==================== */
.success-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 1001;
	display: flex;
	align-items: center;
	justify-content: center;
}

.success-popup {
	width: 480rpx;
	background: #fff;
	border-radius: 32rpx;
	padding: 60rpx 40rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: popIn 0.3s ease-out;
}

@keyframes popIn {
	from { transform: scale(0.8); opacity: 0; }
	to { transform: scale(1); opacity: 1; }
}

.success-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: $primary;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 64rpx;
	color: #fff;
	font-weight: 700;
	margin-bottom: 24rpx;
}

.success-title {
	font-size: 36rpx;
	font-weight: 700;
	color: $primary-dark;
	margin-bottom: 12rpx;
}

.success-desc {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 40rpx;
}

.success-btn {
	width: 100%;
	background: $primary;
	border-radius: 99rpx;
	padding: 24rpx 0;
	text-align: center;

	&:active {
		opacity: 0.85;
	}
}

.success-btn-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 700;
}
</style>
