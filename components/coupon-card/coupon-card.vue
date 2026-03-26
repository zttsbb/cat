<!-- components/coupon-card/coupon-card.vue -->
<!-- 卡券卡片组件 -->
<template>
	<view :class="['coupon-card', { 'coupon-expired': coupon.status !== 1 }]">
		<view class="coupon-left">
			<view class="coupon-value">
				<text class="value-unit">￥</text>
				<text class="value-num">{{ coupon.faceValue }}</text>
			</view>
			<view class="coupon-type">{{ coupon.type }}</view>
		</view>
		<view class="coupon-divider"></view>
		<view class="coupon-right">
			<view class="coupon-source">
				<image v-if="coupon.sourceIcon" class="source-icon" :src="coupon.sourceIcon" mode="aspectFit" />
				<text>{{ coupon.source }}</text>
			</view>
			<view class="coupon-scope ellipsis">{{ coupon.scope }}</view>
			<view class="coupon-times">剩余{{ coupon.remainTimes }}/{{ coupon.totalTimes }}次</view>
			<view class="coupon-expire">有效期至 {{ coupon.expireDate }}</view>
		</view>
		<view class="coupon-status-tag">{{ coupon.statusText }}</view>
	</view>
</template>

<script setup>
defineProps({
	coupon: {
		type: Object,
		default: () => ({
			id: '',
			source: '系统',
			type: '次卡',
			faceValue: 100,
			totalTimes: 10,
			remainTimes: 10,
			scope: '全部服务可用',
			expireDate: '2026-12-31',
			status: 1,
			statusText: '可使用'
		})
	}
})
</script>

<style lang="scss" scoped>
.coupon-card {
	display: flex;
	align-items: stretch;
	background-color: #fff;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	position: relative;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.coupon-card.coupon-expired {
	opacity: 0.5;
}

.coupon-left {
	width: 200rpx;
	background: linear-gradient(135deg, #07C160, #38d976);
	padding: 32rpx 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.coupon-expired .coupon-left {
	background: linear-gradient(135deg, #999, #bbb);
}

.coupon-value {
	display: flex;
	align-items: baseline;
	color: #fff;
}

.value-unit {
	font-size: 24rpx;
}

.value-num {
	font-size: 56rpx;
	font-weight: 700;
}

.coupon-type {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-top: 4rpx;
}

.coupon-divider {
	width: 2rpx;
	background-color: #f0f0f0;
	position: relative;
	margin: 16rpx 0;

	&::before,
	&::after {
		content: '';
		position: absolute;
		left: -14rpx;
		width: 28rpx;
		height: 28rpx;
		border-radius: 50%;
		background-color: #f5f5f5;
	}

	&::before {
		top: -28rpx;
	}

	&::after {
		bottom: -28rpx;
	}
}

.coupon-right {
	flex: 1;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.coupon-source {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 8rpx;
	display: flex;
	align-items: center;
}

.source-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 8rpx;
}

.coupon-scope {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.coupon-times {
	font-size: 22rpx;
	color: #07C160;
	margin-bottom: 4rpx;
}

.coupon-expired .coupon-times {
	color: #999;
}

.coupon-expire {
	font-size: 22rpx;
	color: #999;
}

.coupon-status-tag {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	background-color: #e8f8ee;
	color: #07C160;
}

.coupon-expired .coupon-status-tag {
	background-color: #f5f5f5;
	color: #999;
}
</style>
