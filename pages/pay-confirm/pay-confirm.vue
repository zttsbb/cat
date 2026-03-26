<!-- pages/pay-confirm/pay-confirm.vue -->
<!-- 扫码确认付款页 -->
<template>
	<view class="page-pay-confirm">
		<!-- 设备信息 -->
		<view class="device-info">
			<view class="info-row">
				<text class="info-label">设备名称</text>
				<text class="info-value">{{ device.name }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">设备地址</text>
				<text class="info-value">{{ device.address }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">距离</text>
				<text class="info-value">{{ device.distance }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">状态</text>
				<text class="info-value status-available">{{ device.statusText }}</text>
			</view>
		</view>

		<!-- 支付方式选择 -->
		<view class="pay-method-section">
			<view class="section-title">选择支付方式</view>
			<view
				class="pay-method-item"
				v-for="(method, index) in payMethods"
				:key="index"
				@click="selectPayMethod(index)"
			>
				<view class="method-left">
					<image v-if="method.iconImage" class="method-icon-img" :src="method.iconImage" mode="aspectFit" />
					<text v-else class="method-icon">{{ method.icon }}</text>
					<view class="method-info">
						<text class="method-name">{{ method.name }}</text>
						<text class="method-desc" v-if="method.desc">{{ method.desc }}</text>
					</view>
				</view>
				<view :class="['radio-circle', { active: selectedPayMethod === index }]">
					<view class="radio-inner" v-if="selectedPayMethod === index"></view>
				</view>
			</view>
		</view>

		<!-- 选取优惠券 -->
		<view class="coupon-section" @click="pickCoupon">
			<text class="coupon-label">选取优惠券</text>
			<view class="coupon-right">
				<text class="coupon-text" v-if="selectedCoupon">{{ selectedCoupon.name }} -￥{{ selectedCoupon.amount }}</text>
				<text class="coupon-text coupon-none" v-else>暂无可用</text>
				<text class="coupon-arrow">›</text>
			</view>
		</view>

		<!-- 备注 -->
		<view class="remark-section">
			<text class="remark-icon">💡</text>
			<text class="remark-text">本设备需预支付{{ device.prepayAmount }}元，结算订单后原路退回</text>
		</view>

		<!-- 确认按钮 -->
		<view class="confirm-btn" @click="onConfirmPay">确认核销</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getDeviceDetail } from '@/api/store.js'
import { getAvailableCoupons } from '@/api/pay.js'

const device = ref({
	name: '智能洗宠机A1',
	address: '深圳市南山区科技园南区深南大道9966号',
	status: 1,
	statusText: '可使用',
	distance: '3.6KM',
	prepayAmount: 50
})

const selectedPayMethod = ref(0)
const selectedCoupon = ref(null)

const payMethods = ref([
	{ iconImage: '/icon/qianbao.png', name: '余额支付', desc: '当前余额 ￥56.89', key: 'balance' },
	{ icon: '🎫', name: '卡券支付', desc: '可用卡券 3张', key: 'coupon' },
	{ icon: '💬', name: '微信支付', desc: '', key: 'wechat' }
])

const selectPayMethod = (index) => {
	selectedPayMethod.value = index
}

const pickCoupon = () => {
	// TODO: 跳转卡券选择
	uni.showToast({ title: '优惠券选择功能开发中', icon: 'none' })
}

const onConfirmPay = () => {
	uni.showToast({ title: '支付功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page-pay-confirm {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 24rpx;
	padding-bottom: 140rpx;
}

.device-info {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
}

.info-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.info-label {
	font-size: 28rpx;
	color: #999;
}

.info-value {
	font-size: 28rpx;
	color: #333;
}

.status-available {
	color: #07C160;
}

.pay-method-section {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.pay-method-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.method-left {
	display: flex;
	align-items: center;
}

.method-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.method-icon-img {
	width: 48rpx;
	height: 48rpx;
	margin-right: 20rpx;
	border-radius: 12rpx;
}

.method-info {
	display: flex;
	flex-direction: column;
}

.method-name {
	font-size: 28rpx;
	color: #333;
}

.method-desc {
	font-size: 22rpx;
	color: #999;
	margin-top: 4rpx;
}

.radio-circle {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 2rpx solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;

	&.active {
		border-color: #07C160;
	}
}

.radio-inner {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background-color: #07C160;
}

.coupon-section {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.coupon-label {
	font-size: 28rpx;
	color: #333;
}

.coupon-right {
	display: flex;
	align-items: center;
}

.coupon-text {
	font-size: 26rpx;
	color: #ff4d4f;
}

.coupon-none {
	color: #999;
}

.coupon-arrow {
	font-size: 36rpx;
	color: #ccc;
	margin-left: 8rpx;
}

.remark-section {
	background-color: #fff8e8;
	border-radius: 24rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 24rpx;
	display: flex;
	align-items: flex-start;
}

.remark-icon {
	font-size: 28rpx;
	margin-right: 12rpx;
}

.remark-text {
	flex: 1;
	font-size: 24rpx;
	color: #ff9500;
	line-height: 1.6;
}

.confirm-btn {
	position: fixed;
	bottom: 40rpx;
	left: 24rpx;
	right: 24rpx;
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 28rpx 0;
	border-radius: 999rpx;
}
</style>
