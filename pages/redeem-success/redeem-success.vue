<!-- pages/redeem-success/redeem-success.vue -->
<!-- 核销成功（弹窗式，背景为预约页面） -->
<template>
	<view class="page-redeem-success">
		<!-- 背景预约页面 -->
		<view class="bg-page">
			<view class="bg-nav-bar">
				<text class="bg-nav-text">预约服务</text>
			</view>
			<view class="bg-placeholder"></view>
		</view>

		<!-- 核销成功弹窗 -->
		<view class="success-overlay">
			<view class="success-popup">
				<!-- 成功图标 -->
				<view class="success-icon-wrap">
					<view class="success-check-circle">
						<text class="success-check">✓</text>
					</view>
					<text class="success-title">核销成功</text>
				</view>

				<!-- 卡券信息 -->
				<view class="coupon-info">
					<view class="coupon-source">
						<image v-if="platformIcon" class="platform-icon" :src="platformIcon" mode="aspectFit" />
						<text class="platform-name">{{ platformName }}</text>
					</view>
					<text class="coupon-type">{{ couponType }}</text>
					<text class="coupon-scope">{{ couponScope }}</text>
					<view class="coupon-amount-row">
						<text class="coupon-amount">金额{{ couponAmount }}/单次</text>
					</view>
					<text class="coupon-remain">可用{{ couponRemain }}次</text>
					<text class="coupon-expire">有效时间{{ couponExpire }}</text>
				</view>

				<!-- 扫码下单按钮 -->
				<view class="scan-order-btn" @click="goScanOrder">
					<text class="scan-order-text">扫码下单</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const platformName = ref('美团')
const platformIcon = ref('')
const couponType = ref('次卡')
const couponScope = ref('适用于洗宠机')
const couponAmount = ref(20)
const couponRemain = ref(3)
const couponExpire = ref('60天')

onLoad((options) => {
	if (options) {
		platformName.value = options.platform || '美团'
		couponType.value = options.couponType || '次卡'
		couponAmount.value = Number(options.amount) || 20
		couponRemain.value = Number(options.remain) || 3
		couponExpire.value = options.expire || '60天'
		// 根据平台设置图标
		if (platformName.value === '抖音') {
			platformIcon.value = '/static/icon/douyin.png'
		} else if (platformName.value === '美团') {
			platformIcon.value = '/static/icon/meituan.png'
		} else {
			platformIcon.value = '/static/icon/ceng.png'
		}
	} else {
		platformIcon.value = '/static/icon/meituan.png'
	}
})

const goScanOrder = () => {
	// 跳转预约服务页面
	uni.navigateTo({ url: '/pages/book-service/book-service' })
}
</script>

<style lang="scss" scoped>
.page-redeem-success {
	min-height: 100vh;
	position: relative;
}

/* 背景预约页面（模拟） */
.bg-page {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #f5f5f5;
	z-index: 1;
}

.bg-nav-bar {
	background: linear-gradient(135deg, #07C160, #38d976);
	padding: 0 32rpx;
	padding-top: var(--status-bar-height, 44px);
	height: calc(var(--status-bar-height, 44px) + 88rpx);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding-bottom: 16rpx;
}

.bg-nav-text {
	font-size: 36rpx;
	font-weight: 600;
	color: #fff;
}

.bg-placeholder {
	flex: 1;
}

/* 核销成功弹窗 */
.success-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.success-popup {
	width: 620rpx;
	background-color: #fff;
	border-radius: 32rpx;
	padding: 60rpx 40rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: popIn 0.3s ease-out;
}

@keyframes popIn {
	from {
		transform: scale(0.8);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

/* 成功图标 */
.success-icon-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 40rpx;
}

.success-check-circle {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: #07C160;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.success-check {
	font-size: 52rpx;
	color: #fff;
	font-weight: 700;
}

.success-title {
	font-size: 38rpx;
	font-weight: 700;
	color: #333;
}

/* 卡券信息 */
.coupon-info {
	width: 100%;
	background-color: #fafafa;
	border-radius: 20rpx;
	padding: 32rpx;
	margin-bottom: 36rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.coupon-source {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.platform-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 8rpx;
}

.platform-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.coupon-type {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 8rpx;
}

.coupon-scope {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 16rpx;
}

.coupon-amount-row {
	margin-bottom: 8rpx;
}

.coupon-amount {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.coupon-remain {
	font-size: 26rpx;
	color: #07C160;
	margin-bottom: 8rpx;
}

.coupon-expire {
	font-size: 24rpx;
	color: #999;
}

/* 扫码下单按钮 */
.scan-order-btn {
	width: 100%;
	background: linear-gradient(135deg, #07C160, #38d976);
	border-radius: 999rpx;
	padding: 28rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		opacity: 0.9;
	}
}

.scan-order-text {
	font-size: 32rpx;
	font-weight: 600;
	color: #fff;
}
</style>
