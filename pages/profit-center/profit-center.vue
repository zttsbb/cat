<!-- pages/profit-center/profit-center.vue -->
<!-- 分账中心（对齐原型图） -->
<template>
	<view class="page-profit-center">
		<!-- 设备概览卡片 -->
		<view class="device-banner" v-for="(item, index) in deviceList" :key="index">
			<view class="banner-top">
				<view class="device-name">
					<text class="device-name-text">{{ item.name }}</text>
				</view>
				<view class="order-status">
					<text class="status-text">{{ item.statusText }}</text>
				</view>
			</view>
			<view class="banner-bottom">
				<text class="amount-label">￥{{ item.revenue.toFixed(2) }}</text>
				<text class="amount-desc">·实际营收</text>
			</view>
		</view>

		<!-- 累计收益 -->
		<view class="total-section">
			<view class="total-row">
				<text class="total-label">累计赚取:</text>
				<text class="total-value">￥{{ profitInfo.totalEarnings.toFixed(2) }}</text>
			</view>
			<view class="withdraw-btn" @click="goWithdraw">
				<text class="withdraw-text">提现</text>
			</view>
		</view>

		<!-- 分账记录 -->
		<view class="record-section">
			<view class="section-title">分账记录</view>
			<view class="record-list">
				<view class="record-item" v-for="record in recordList" :key="record.id">
					<!-- 设备名 + 分账比例banner -->
					<view class="record-banner">
						<view class="banner-left">
							<text class="record-device">{{ record.deviceName }}</text>
						</view>
						<view class="banner-right">
							<view class="record-order">
								<text class="order-text">订单已完成</text>
							</view>
							<view class="record-amount">
								<text class="amount-value">￥{{ record.amount.toFixed(2) }}</text>
							</view>
							<view class="record-amount">
								<text class="amount-tag">分账到账</text>
							</view>
						</view>
					</view>
					<!-- 分账比例 -->
					<view class="record-ratio-bar">
						<text class="ratio-text">{{ record.deviceName }}({{ record.ratio }})</text>
						<view class="ratio-progress">
							<view class="ratio-fill" :style="{ width: record.ratioNum + '%' }"></view>
						</view>
						<text class="ratio-amount">￥{{ record.amount.toFixed(2) }}</text>
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
	totalEarnings: 568.56,
	availableBalance: 1680.50
})

// 设备列表（对齐原型图）
const deviceList = ref([
	{
		name: '物沃科技展厅设备',
		statusText: '订单已完成',
		revenue: 30.00,
		ratio: '10%',
		ratioNum: 10
	}
])

const recordList = ref([])

onMounted(() => {
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	// const info = await getProfitInfo()
	// if (info) profitInfo.value = info
	// const records = await getProfitRecords({ page: 1, pageSize: 20 })
	// recordList.value = records.list || []

	// Mock
	recordList.value = [
		{
			id: 1,
			deviceName: '物沃科技展厅设备',
			orderId: 'W20260326001',
			amount: 3.56,
			ratio: '10%',
			ratioNum: 10,
			date: '2026-10-02 01:38'
		},
		{
			id: 2,
			deviceName: '物沃科技展厅设备',
			orderId: 'W20260326002',
			amount: 3.56,
			ratio: '10%',
			ratioNum: 10,
			date: '2026-10-02 02:00'
		}
	]
}

const goWithdraw = () => {
	uni.navigateTo({ url: '/pages/withdraw/withdraw' })
}
</script>

<style lang="scss" scoped>
.page-profit-center {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 40rpx;
}

/* 设备banner卡片（对齐原型图） */
.device-banner {
	background: linear-gradient(135deg, #07C160, #38d976);
	margin: 24rpx 24rpx 0;
	border-radius: 24rpx;
	padding: 32rpx;
}

.banner-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.device-name-text {
	font-size: 32rpx;
	font-weight: 600;
	color: #fff;
}

.order-status {
	background-color: rgba(255, 255, 255, 0.2);
	padding: 4rpx 16rpx;
	border-radius: 999rpx;
}

.status-text {
	font-size: 22rpx;
	color: #fff;
}

.banner-bottom {
	display: flex;
	align-items: baseline;
}

.amount-label {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.amount-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

/* 累计收益 + 提现 */
.total-section {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 16rpx 24rpx 0;
	padding: 24rpx 32rpx;
	background-color: #fff;
	border-radius: 24rpx;
}

.total-row {
	display: flex;
	align-items: baseline;
}

.total-label {
	font-size: 26rpx;
	color: #666;
	margin-right: 8rpx;
}

.total-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.withdraw-btn {
	padding: 12rpx 32rpx;
	background: linear-gradient(135deg, #07C160, #38d976);
	border-radius: 999rpx;

	&:active {
		opacity: 0.9;
	}
}

.withdraw-text {
	font-size: 26rpx;
	color: #fff;
	font-weight: 600;
}

/* 分账记录 */
.record-section {
	padding: 0 24rpx;
	margin-top: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 20rpx;
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

/* 设备banner + 分账到账 */
.record-banner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.banner-left {
	display: flex;
	flex-direction: column;
}

.record-device {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.banner-right {
	display: flex;
	align-items: center;
}

.record-order {
	margin-right: 16rpx;
}

.order-text {
	font-size: 22rpx;
	color: #999;
}

.record-amount {
	margin-right: 12rpx;
}

.amount-value {
	font-size: 28rpx;
	font-weight: 700;
	color: #333;
}

.amount-tag {
	font-size: 22rpx;
	color: #07C160;
}

/* 分账比例条 */
.record-ratio-bar {
	display: flex;
	align-items: center;
}

.ratio-text {
	font-size: 24rpx;
	color: #999;
	width: 280rpx;
	flex-shrink: 0;
}

.ratio-progress {
	flex: 1;
	height: 8rpx;
	background-color: #f0f0f0;
	border-radius: 999rpx;
	overflow: hidden;
	margin: 0 16rpx;
}

.ratio-fill {
	height: 100%;
	background: linear-gradient(135deg, #07C160, #38d976);
	border-radius: 999rpx;
}

.ratio-amount {
	font-size: 24rpx;
	color: #333;
	font-weight: 600;
	width: 100rpx;
	text-align: right;
	flex-shrink: 0;
}
</style>
