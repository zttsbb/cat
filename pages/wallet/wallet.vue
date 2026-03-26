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
			<view class="recharge-grid">
				<view class="recharge-card" v-for="(item, index) in rechargeAmounts" :key="index" @click="onRecharge(item)">
					<view class="recharge-amount">￥{{ item.amount }}</view>
					<view class="recharge-bonus" v-if="item.bonus">送￥{{ item.bonus }}</view>
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
	{ amount: 100, label: '100元', bonus: 15 },
	{ amount: 200, label: '200元', bonus: 40 },
	{ amount: 500, label: '500元', bonus: 120 }
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

.recharge-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.recharge-card {
	border: 2rpx solid #e0e0e0;
	border-radius: 20rpx;
	padding: 32rpx;
	text-align: center;
	position: relative;
	overflow: hidden;

	&:active {
		border-color: #07C160;
		background-color: #e8f8ee;
	}
}

.recharge-amount {
	font-size: 40rpx;
	font-weight: 700;
	color: #333;
}

.recharge-bonus {
	font-size: 24rpx;
	color: #ff4d4f;
	margin-top: 8rpx;
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
