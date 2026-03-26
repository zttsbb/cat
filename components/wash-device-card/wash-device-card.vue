<!-- components/wash-device-card/wash-device-card.vue -->
<!-- 设备卡片组件 -->
<template>
	<view class="device-card" @click="handleClick">
		<view class="device-header">
			<view class="device-name">{{ device.name }}</view>
			<view :class="['device-status', statusClass]">{{ device.statusText }}</view>
		</view>
		<view class="device-address">
			<text class="icon">📍</text>
			<text class="address-text">{{ device.address }}</text>
		</view>
		<view class="device-footer">
			<view class="device-price">￥{{ device.pricePerMinute }}/分钟</view>
			<view class="device-distance">{{ device.distance }}</view>
			<view class="recharge-btn" v-if="showRecharge && device.status === 1" @click.stop="onRecharge">预充值</view>
		</view>
	</view>
</template>

<script setup>
defineProps({
	device: {
		type: Object,
		default: () => ({
			id: '',
			name: '智能洗宠机',
			address: '',
			status: 1,
			statusText: '可使用',
			pricePerMinute: 0.8,
			distance: ''
		})
	},
	showRecharge: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['click', 'recharge'])

const statusClass = {
	1: 'status-available',
	2: 'status-using',
	3: 'status-maintenance'
}

const handleClick = () => {
	emit('click')
}

const onRecharge = () => {
	emit('recharge')
}
</script>

<style lang="scss" scoped>
.device-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.device-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.device-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.device-status {
	font-size: 22rpx;
	padding: 4rpx 16rpx;
	border-radius: 999rpx;
}

.status-available {
	background-color: #e8f8ee;
	color: #07C160;
}

.status-using {
	background-color: #fff3e8;
	color: #ff9500;
}

.status-maintenance {
	background-color: #f5f5f5;
	color: #999;
}

.device-address {
	display: flex;
	align-items: flex-start;
	margin-bottom: 20rpx;

	.icon {
		margin-right: 8rpx;
		font-size: 24rpx;
	}

	.address-text {
		flex: 1;
		font-size: 24rpx;
		color: #999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.device-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.device-price {
	font-size: 28rpx;
	font-weight: 600;
	color: #ff4d4f;
}

.device-distance {
	font-size: 24rpx;
	color: #999;
	margin-left: auto;
	margin-right: 20rpx;
}

.recharge-btn {
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 24rpx;
	padding: 8rpx 28rpx;
	border-radius: 999rpx;
}
</style>
