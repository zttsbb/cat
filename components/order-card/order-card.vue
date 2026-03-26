<!-- components/order-card/order-card.vue -->
<!-- 订单卡片组件（洗宠订单） -->
<template>
	<view class="order-card" @click="handleClick">
		<view class="order-header">
			<view class="order-device ellipsis">{{ order.deviceName }}</view>
			<view :class="['order-status', statusClass]">{{ order.statusText }}</view>
		</view>
		<view class="order-address ellipsis">📍 {{ order.address }}</view>
		<view class="order-footer">
			<view class="order-amount">￥{{ order.totalAmount }}</view>
			<view class="order-pay-method">{{ order.payMethod }}</view>
		</view>
		<view class="order-time">{{ order.createTime }}</view>
	</view>
</template>

<script setup>
const props = defineProps({
	order: {
		type: Object,
		default: () => ({
			id: '',
			deviceName: '设备名称',
			address: '',
			totalAmount: 0,
			payMethod: '微信支付',
			status: 1,
			statusText: '已完成',
			createTime: ''
		})
	}
})

const emit = defineEmits(['click'])

const statusClass = {
	1: 'status-done',
	2: 'status-refund',
	3: 'status-cancel',
	4: 'status-stop'
}

const handleClick = () => {
	emit('click')
}
</script>

<style lang="scss" scoped>
.order-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.order-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.order-device {
	flex: 1;
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.order-status {
	font-size: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 999rpx;
}

.status-done {
	background-color: #e8f8ee;
	color: #07C160;
}

.status-refund {
	background-color: #fff3e8;
	color: #ff9500;
}

.status-cancel {
	background-color: #f5f5f5;
	color: #999;
}

.status-stop {
	background-color: #ffe8e8;
	color: #ff4d4f;
}

.order-address {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.order-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8rpx;
}

.order-amount {
	font-size: 36rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.order-pay-method {
	font-size: 24rpx;
	color: #666;
}

.order-time {
	font-size: 22rpx;
	color: #ccc;
	text-align: right;
}
</style>
