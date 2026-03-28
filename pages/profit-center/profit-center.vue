<!-- pages/profit-center/profit-center.vue -->
<!-- 分账中心（对齐原型图） -->
<template>
	<view class="page-profit-center">
		<!-- 设备下拉选择 -->
		<view class="device-selector" @click="showDevicePicker = true">
			<text class="selector-label">选择设备</text>
			<view class="selector-right">
				<text class="selector-value">{{ currentDevice ? currentDevice.name : '全部设备' }}</text>
				<text class="selector-arrow" :class="{ open: showDevicePicker }">▾</text>
			</view>
		</view>

		<!-- 设备概览卡片 -->
		<view class="device-banner" v-if="currentDevice">
			<view class="banner-top">
				<view class="device-name">
					<text class="device-name-text">{{ currentDevice.name }}</text>
				</view>
				<view class="order-status">
					<text class="status-text">{{ currentDevice.statusText }}</text>
				</view>
			</view>
			<view class="banner-bottom">
				<text class="amount-label">￥{{ currentDevice.revenue.toFixed(2) }}</text>
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
				<view class="record-item" v-for="record in filteredRecords" :key="record.id">
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
				<view class="empty-tip" v-if="filteredRecords.length === 0">
					<text class="empty-text">暂无分账记录</text>
				</view>
			</view>
		</view>

		<!-- 设备选择下拉弹窗 -->
		<view class="picker-overlay" v-if="showDevicePicker" @click="showDevicePicker = false">
			<view class="picker-popup" @click.stop>
				<view class="picker-header">
					<text class="picker-title">选择设备</text>
					<text class="picker-close" @click="showDevicePicker = false">✕</text>
				</view>
				<scroll-view scroll-y class="picker-list">
					<view
						:class="['picker-item', { active: !currentDevice }]"
						@click="onPickDevice(null)"
					>
						<text class="picker-item-name">全部设备</text>
						<text class="picker-item-check" v-if="!currentDevice">✓</text>
					</view>
					<view
						:class="['picker-item', { active: currentDevice && currentDevice.id === item.id }]"
						v-for="(item, index) in deviceList"
						:key="index"
						@click="onPickDevice(item)"
					>
						<view class="picker-item-info">
							<text class="picker-item-name">{{ item.name }}</text>
							<text class="picker-item-desc">分账比例 {{ item.ratio }} · 营收 ￥{{ item.revenue.toFixed(2) }}</text>
						</view>
						<text class="picker-item-check" v-if="currentDevice && currentDevice.id === item.id">✓</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProfitInfo, getProfitRecords } from '@/api/profit.js'

const profitInfo = ref({
	totalEarnings: 568.56,
	availableBalance: 1680.50
})

const showDevicePicker = ref(false)
const currentDevice = ref(null)

// 设备列表
const deviceList = ref([
	{
		id: 1,
		name: '物沃科技展厅设备',
		statusText: '订单已完成',
		revenue: 30.00,
		ratio: '10%',
		ratioNum: 10
	},
	{
		id: 2,
		name: '智能洗宠机A1',
		statusText: '使用中',
		revenue: 158.80,
		ratio: '15%',
		ratioNum: 15
	},
	{
		id: 3,
		name: '智能洗宠机A2',
		statusText: '空闲',
		revenue: 379.76,
		ratio: '12%',
		ratioNum: 12
	}
])

const recordList = ref([])

// 按设备筛选记录
const filteredRecords = computed(() => {
	if (!currentDevice.value) return recordList.value
	return recordList.value.filter(r => r.deviceId === currentDevice.value.id)
})

const onPickDevice = (item) => {
	currentDevice.value = item
	showDevicePicker.value = false
}

onMounted(() => {
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	// const info = await getProfitInfo()
	// if (info) profitInfo.value = info
	// const records = await getProfitRecords({ page: 1, pageSize: 20 })
	// recordList.value = records.list || []

	// Mock - 多设备分账记录
	recordList.value = [
		{
			id: 1, deviceId: 1, deviceName: '物沃科技展厅设备',
			orderId: 'W20260326001', amount: 3.56, ratio: '10%', ratioNum: 10, date: '2026-10-02 01:38'
		},
		{
			id: 2, deviceId: 1, deviceName: '物沃科技展厅设备',
			orderId: 'W20260326002', amount: 3.56, ratio: '10%', ratioNum: 10, date: '2026-10-02 02:00'
		},
		{
			id: 3, deviceId: 2, deviceName: '智能洗宠机A1',
			orderId: 'W20260327001', amount: 8.52, ratio: '15%', ratioNum: 15, date: '2026-10-03 09:15'
		},
		{
			id: 4, deviceId: 2, deviceName: '智能洗宠机A1',
			orderId: 'W20260327002', amount: 12.80, ratio: '15%', ratioNum: 15, date: '2026-10-03 14:22'
		},
		{
			id: 5, deviceId: 2, deviceName: '智能洗宠机A1',
			orderId: 'W20260327003', amount: 6.40, ratio: '15%', ratioNum: 15, date: '2026-10-04 10:05'
		},
		{
			id: 6, deviceId: 3, deviceName: '智能洗宠机A2',
			orderId: 'W20260328001', amount: 5.36, ratio: '12%', ratioNum: 12, date: '2026-10-05 16:30'
		},
		{
			id: 7, deviceId: 3, deviceName: '智能洗宠机A2',
			orderId: 'W20260328002', amount: 4.56, ratio: '12%', ratioNum: 12, date: '2026-10-06 11:45'
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

/* 设备下拉选择器 */
.device-selector {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 24rpx 24rpx 0;
	padding: 24rpx 32rpx;
	background-color: #fff;
	border-radius: 24rpx;
	&:active { background-color: #fafafa; }
}
.selector-label { font-size: 28rpx; color: #999; }
.selector-right { display: flex; align-items: center; }
.selector-value { font-size: 28rpx; font-weight: 600; color: #333; margin-right: 8rpx; }
.selector-arrow { font-size: 24rpx; color: #999; transition: transform 0.3s; &.open { transform: rotate(180deg); } }

/* 设备选择弹窗 */
.picker-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: flex-end; justify-content: center; }
.picker-popup { width: 100%; max-height: 60vh; background-color: #fff; border-radius: 32rpx 32rpx 0 0; padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); animation: slideUp 0.3s ease-out; display: flex; flex-direction: column; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.picker-header { display: flex; align-items: center; justify-content: space-between; padding: 32rpx 32rpx 16rpx; }
.picker-title { font-size: 34rpx; font-weight: 700; color: #333; }
.picker-close { width: 56rpx; height: 56rpx; border-radius: 50%; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 32rpx; color: #999; }
.picker-list { flex: 1; padding: 0 24rpx; max-height: 50vh; }
.picker-item { display: flex; align-items: center; justify-content: space-between; padding: 24rpx; margin-bottom: 12rpx; border-radius: 16rpx; border: 2rpx solid #e0e0e0; &.active { border-color: #07C160; background-color: #f8fff9; } }
.picker-item-info { display: flex; flex-direction: column; }
.picker-item-name { font-size: 28rpx; font-weight: 600; color: #333; margin-bottom: 4rpx; }
.picker-item-desc { font-size: 22rpx; color: #999; }
.picker-item-check { width: 36rpx; height: 36rpx; border-radius: 50%; background-color: #07C160; color: #fff; font-size: 22rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* 空状态 */
.empty-tip { padding: 60rpx 0; text-align: center; }
.empty-text { font-size: 26rpx; color: #999; }

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
