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
	balance: 56.89
})

const rechargeAmounts = ref([
	{ amount: 50, bonus: 5 },
	{ amount: 100, bonus: 15 },
	{ amount: 200, bonus: 40 },
	{ amount: 500, bonus: 120 }
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
	// TODO: 跳转到支付页面或弹出支付方式选择
	uni.showToast({ title: `充值￥${item.amount}`, icon: 'none' })
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
</style>
