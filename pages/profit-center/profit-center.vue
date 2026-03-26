<!-- pages/profit-center/profit-center.vue -->
<!-- 分账中心 -->
<template>
	<view class="page-profit-center">
		<!-- 概览卡片 -->
		<view class="overview-card">
			<view class="overview-item">
				<text class="overview-value">{{ profitInfo.deviceCount }}</text>
				<text class="overview-label">设备数量</text>
			</view>
			<view class="overview-divider"></view>
			<view class="overview-item">
				<text class="overview-value">￥{{ profitInfo.totalEarnings.toFixed(2) }}</text>
				<text class="overview-label">累计赚取</text>
			</view>
			<view class="overview-divider"></view>
			<view class="overview-item">
				<text class="overview-value">￥{{ profitInfo.availableBalance.toFixed(2) }}</text>
				<text class="overview-label">可提现</text>
			</view>
		</view>

		<!-- 提现按钮 -->
		<view class="withdraw-btn" @click="goWithdraw">提现</view>

		<!-- 分账记录 -->
		<view class="record-section">
			<view class="section-title">分账记录</view>
			<view class="record-list">
				<view class="record-item" v-for="record in recordList" :key="record.id">
					<view class="record-header">
						<text class="record-device">{{ record.deviceName }}</text>
						<text :class="['record-amount', record.orderStatus === '已完成' ? 'green' : 'orange']">
							+￥{{ record.amount.toFixed(2) }}
						</text>
					</view>
					<view class="record-footer">
						<text class="record-order">订单: {{ record.orderId }}</text>
						<text :class="['record-status', record.orderStatus === '已完成' ? 'green' : 'orange']">{{ record.orderStatus }}</text>
					</view>
					<view class="record-meta">
						<text class="record-ratio">分账比例: {{ record.ratio }}</text>
						<text class="record-date">{{ record.date }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProfitInfo, getProfitRecords } from '@/api/profit.js'

const profitInfo = ref({
	deviceCount: 3,
	totalEarnings: 2680.50,
	availableBalance: 1680.50,
	frozenBalance: 1000.00
})

const recordList = ref([])

onMounted(() => {
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	const info = await getProfitInfo()
	if (info) profitInfo.value = info

	const records = await getProfitRecords({ page: 1, pageSize: 20 })
	recordList.value = records.list || []
}

const goWithdraw = () => {
	uni.navigateTo({ url: '/pages/withdraw/withdraw' })
}
</script>

<style lang="scss" scoped>
.page-profit-center {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.overview-card {
	display: flex;
	background: linear-gradient(135deg, #07C160, #38d976);
	margin: 24rpx;
	border-radius: 24rpx;
	padding: 48rpx 24rpx;
}

.overview-item {
	flex: 1;
	text-align: center;
}

.overview-value {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
	margin-bottom: 8rpx;
}

.overview-label {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.8);
}

.overview-divider {
	width: 1rpx;
	background-color: rgba(255, 255, 255, 0.3);
}

.withdraw-btn {
	margin: 0 24rpx 24rpx;
	background-color: #fff;
	color: #07C160;
	border: 2rpx solid #07C160;
	font-size: 30rpx;
	font-weight: 600;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;
}

.record-section {
	padding: 0 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.record-list {
	margin-bottom: 24rpx;
}

.record-item {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 28rpx 32rpx;
	margin-bottom: 20rpx;
}

.record-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.record-device {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.record-amount {
	font-size: 32rpx;
	font-weight: 700;

	&.green { color: #07C160; }
	&.orange { color: #ff9500; }
}

.record-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8rpx;
}

.record-order {
	font-size: 24rpx;
	color: #999;
}

.record-status {
	font-size: 24rpx;
	padding: 2rpx 12rpx;
	border-radius: 999rpx;

	&.green { color: #07C160; background-color: #e8f8ee; }
	&.orange { color: #ff9500; background-color: #fff3e8; }
}

.record-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.record-ratio {
	font-size: 22rpx;
	color: #999;
}

.record-date {
	font-size: 22rpx;
	color: #ccc;
}
</style>
