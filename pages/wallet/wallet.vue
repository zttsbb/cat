<!-- pages/wallet/wallet.vue -->
<!-- 预充值/钱包页 -->
<template>
	<view class="page-wallet">
		<!-- 余额展示 -->
		<view class="balance-card">
			<view class="balance-label">账户余额</view>
			<view class="balance-amount">￥{{ walletInfo.balance }}</view>
			<view class="balance-action" @click="viewStores">查看可用门店 →</view>
		</view>

		<!-- 快捷充值 -->
		<view class="recharge-section">
			<view class="section-title">快捷充值</view>
			<view class="recharge-scroll">
				<view class="recharge-card" v-for="(item, index) in rechargeAmounts" :key="index" @click="onRecharge(item)">
					<view class="bonus-badge">
						<image class="bonus-badge-img" src="/icon/ceng.png" mode="aspectFit" />
					</view>
					<view class="recharge-amount">￥{{ item.amount }}</view>
					<view class="recharge-bonus" v-if="item.bonus">赠￥{{ item.bonus }}</view>
				</view>
			</view>
		</view>

		<!-- 充值说明 -->
		<view class="recharge-notice">
			<view class="notice-title">充值说明</view>
			<view class="notice-item">1. 充值金额仅限该商家使用</view>
			<view class="notice-item">2. 充值金额永久有效</view>
		</view>

		<!-- 门店余额 -->
		<view class="store-balance-section">
			<view class="section-title">门店余额</view>
			<view class="store-balance-list">
				<view class="store-balance-item" v-for="(item, index) in walletInfo.storeBalances" :key="index">
					<view class="store-name ellipsis">{{ item.storeName }}</view>
					<view class="store-amount">￥{{ item.balance.toFixed(2) }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWalletInfo, getRechargeAmounts } from '@/api/pay.js'

const walletInfo = ref({
	balance: 56.89,
	storeBalances: [
		{ storeId: 1, storeName: '物沃宠物洗护中心（南山店）', balance: 30.00 },
		{ storeId: 2, storeName: '物沃宠物洗护中心（福田店）', balance: 26.89 }
	]
})

const rechargeAmounts = ref([
	{ amount: 50, label: '50元', bonus: 5 },
	{ amount: 50, label: '50元', bonus: 5 },
	{ amount: 50, label: '50元', bonus: 5 },
	{ amount: 50, label: '50元', bonus: 5 },
	{ amount: 50, label: '50元', bonus: 5 }
])

onMounted(() => {
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	// const wallet = await getWalletInfo()
	// walletInfo.value = wallet
	// const amounts = await getRechargeAmounts()
	// rechargeAmounts.value = amounts
}

const viewStores = () => {
	uni.navigateTo({ url: '/pages/store-list/store-list' })
}

const onRecharge = (item) => {
	// TODO: 调用充值接口
	uni.showToast({ title: `充值￥${item.amount}功能开发中`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page-wallet {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.balance-card {
	background: linear-gradient(135deg, #07C160, #38d976);
	margin: 24rpx;
	border-radius: 24rpx;
	padding: 48rpx 32rpx;
}

.balance-label {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 16rpx;
}

.balance-amount {
	font-size: 64rpx;
	font-weight: 700;
	color: #fff;
	margin-bottom: 16rpx;
}

.balance-action {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
}

.recharge-section {
	background-color: #fff;
	margin: 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.recharge-scroll {
	display: flex;
	overflow-x: auto;
	white-space: nowrap;
}

.recharge-card {
	min-width: 200rpx;
	height: 180rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 20rpx;
	padding: 32rpx 24rpx;
	text-align: center;
	position: relative;
	overflow: hidden;
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

.bonus-badge {
	position: absolute;
	top: 0;
	right: 0;
	width: 64rpx;
	height: 64rpx;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 64rpx 64rpx 0;
		border-color: transparent #ff6b35 transparent transparent;
		z-index: 1;
	}
}

.bonus-badge-img {
	position: absolute;
	top: 8rpx;
	right: 4rpx;
	width: 36rpx;
	height: 36rpx;
	z-index: 2;
}

.recharge-amount {
	font-size: 48rpx;
	font-weight: 700;
	color: #333;
}

.recharge-bonus {
	font-size: 24rpx;
	color: #ff6b35;
	margin-top: 8rpx;
	font-weight: 600;
}

.recharge-notice {
	background-color: #fff;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
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

.store-balance-section {
	background-color: #fff;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
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
	font-size: 32rpx;
	font-weight: 700;
	color: #ff4d4f;
}
</style>
