<!-- pages/wash-order-detail/wash-order-detail.vue -->
<!-- 洗宠订单详情 -->
<template>
	<view class="page-wash-order-detail">
		<!-- 状态头部 -->
		<view class="status-header" :class="statusClass">
			<text class="status-icon">{{ statusIcon }}</text>
			<text class="status-text">{{ order.statusText }}</text>
		</view>

		<!-- 订单数据 -->
		<view class="order-info">
			<view class="section-title">订单信息</view>
			<view class="info-row">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{ order.id }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">下单时间</text>
				<text class="info-value">{{ order.createTime }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">结束时间</text>
				<text class="info-value">{{ order.endTime }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">支付流水号</text>
				<text class="info-value">{{ order.payTradeNo }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">支付金额</text>
				<text class="info-value">￥{{ order.payAmount }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">消费金额</text>
				<text class="info-value price">￥{{ order.totalAmount }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">预付退还</text>
				<text class="info-value refund">￥{{ order.prepayRefund }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">支付方式</text>
				<text class="info-value">{{ order.payMethod }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">使用方式</text>
				<text class="info-value">{{ order.useType }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">总用时</text>
				<text class="info-value">{{ order.totalDuration }}分钟</text>
			</view>
		</view>

		<!-- 使用明细 -->
		<view class="detail-section">
			<view class="section-title">使用明细</view>
			<view class="detail-header">
				<text class="col-name">项目</text>
				<text class="col-duration">时长</text>
				<text class="col-amount">费用</text>
			</view>
			<view class="detail-row" v-for="(item, index) in order.details" :key="index">
				<text class="col-name">{{ item.name }}</text>
				<text class="col-duration">{{ item.duration }}分钟</text>
				<text class="col-amount">￥{{ item.amount.toFixed(2) }}</text>
			</view>
		</view>

		<!-- 状态切换按钮 -->
		<view class="action-section" v-if="order.status === 1">
			<view class="action-btn btn-cancel" @click="onEmergencyStop">紧急终止</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getWashOrderDetail } from '@/api/order.js'

const orderId = ref('')

const order = ref({
	id: 'W20260326001',
	deviceName: '智能洗宠机A1',
	address: '深圳市南山区科技园南区深南大道9966号',
	totalAmount: 18.50,
	payAmount: 50.00,
	payMethod: '微信支付',
	payMethodType: 'wechat',
	payTradeNo: 'WX2026032614300012345',
	status: 1,
	statusText: '已完成',
	useType: '按量付费',
	totalDuration: 23,
	createTime: '2026-03-26 14:30:00',
	endTime: '2026-03-26 14:53:00',
	prepayRefund: 31.50,
	details: [
		{ name: '香波洗护', duration: 8, amount: 6.40 },
		{ name: '护毛护理', duration: 5, amount: 4.00 },
		{ name: '清水冲洗', duration: 6, amount: 4.80 },
		{ name: '消毒烘干', duration: 4, amount: 3.30 }
	]
})

const statusClass = computed(() => {
	const map = { 1: 'bg-green', 2: 'bg-orange', 3: 'bg-gray', 4: 'bg-red' }
	return map[order.value.status] || 'bg-green'
})

const statusIcon = computed(() => {
	const map = { 1: '✅', 2: '🔄', 3: '❌', 4: '🛑' }
	return map[order.value.status] || '✅'
})

onLoad((options) => {
	orderId.value = options.orderId || ''
	loadData()
})

const loadData = async () => {
	if (orderId.value) {
		// TODO: 调用实际接口
		const res = await getWashOrderDetail(orderId.value)
		if (res) order.value = res
	}
}

const onEmergencyStop = () => {
	uni.showModal({
		title: '确认终止',
		content: '紧急终止后将停止服务并结算费用',
		success: (res) => {
			if (res.confirm) {
				uni.showToast({ title: '已发送终止指令', icon: 'none' })
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.page-wash-order-detail {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 140rpx;
}

.status-header {
	display: flex;
	align-items: center;
	padding: 48rpx 32rpx;
}

.bg-green { background-color: #f5fde6; }
.bg-orange { background-color: #fff3e8; }
.bg-gray { background-color: #f5f5f5; }
.bg-red { background-color: #ffe8e8; }

.status-icon {
	font-size: 48rpx;
	margin-right: 16rpx;
}

.status-text {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.order-info,
.detail-section {
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

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.info-label {
	font-size: 26rpx;
	color: #999;
}

.info-value {
	font-size: 26rpx;
	color: #333;

	&.price { color: #ff4d4f; font-weight: 600; }
	&.refund { color: #91de00; font-weight: 600; }
}

.detail-header,
.detail-row {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child { border-bottom: none; }
}

.detail-header {
	font-size: 24rpx;
	color: #999;
	font-weight: 600;
}

.col-name { flex: 1; font-size: 26rpx; color: #333; }
.col-duration { width: 160rpx; text-align: center; font-size: 26rpx; color: #666; }
.col-amount { width: 160rpx; text-align: right; font-size: 26rpx; color: #ff4d4f; }

.action-section {
	padding: 24rpx;
}

.btn-cancel {
	background-color: #fff;
	color: #ff4d4f;
	border: 2rpx solid #ff4d4f;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;
	font-size: 28rpx;
}
</style>
