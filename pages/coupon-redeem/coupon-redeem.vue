<!-- pages/coupon-redeem/coupon-redeem.vue -->
<!-- 团购核销 -->
<template>
	<view class="page-coupon-redeem">
		<view class="redeem-card">
			<view class="redeem-title">团购核销</view>
			<view class="redeem-desc">请输入核销码进行卡券核销</view>

			<!-- 核销码输入 -->
			<view class="code-input-wrap">
				<input
					class="code-input"
					type="text"
					v-model="redeemCode"
					placeholder="请输入核销码"
					maxlength="20"
				/>
			</view>

			<!-- 提示 -->
			<view class="redeem-tips">
				<text class="tips-icon">⚠️</text>
				<text class="tips-text">*核销使用后结余金额不可退款</text>
			</view>

			<!-- 确认按钮 -->
			<view class="confirm-btn" :class="{ disabled: !redeemCode }" @click="onRedeem">确认核销</view>
		</view>

		<!-- 常见问题 -->
		<view class="faq-section">
			<view class="faq-title">常见问题</view>
			<view class="faq-item">
				<view class="faq-q">Q: 核销码从哪里获取？</view>
				<view class="faq-a">A: 核销码在美团、抖音等平台购买团购券后会自动生成。</view>
			</view>
			<view class="faq-item">
				<view class="faq-q">Q: 核销后可以退款吗？</view>
				<view class="faq-a">A: 核销使用后结余金额不可退款，请确认后再进行核销。</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { redeemCoupon } from '@/api/coupon.js'

const redeemCode = ref('')

const onRedeem = async () => {
	if (!redeemCode.value) {
		uni.showToast({ title: '请输入核销码', icon: 'none' })
		return
	}

	// TODO: 调用实际接口
	const res = await redeemCoupon({ redeemCode: redeemCode.value })
	if (res) {
		uni.navigateTo({
			url: `/pages/redeem-success/redeem-success?couponId=${res.couponId}`
		})
	}
}
</script>

<style lang="scss" scoped>
.page-coupon-redeem {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 24rpx;
}

.redeem-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 48rpx 32rpx;
}

.redeem-title {
	font-size: 40rpx;
	font-weight: 700;
	color: #333;
	text-align: center;
	margin-bottom: 16rpx;
}

.redeem-desc {
	font-size: 26rpx;
	color: #999;
	text-align: center;
	margin-bottom: 48rpx;
}

.code-input-wrap {
	border: 2rpx solid #e0e0e0;
	border-radius: 16rpx;
	padding: 0 32rpx;
	margin-bottom: 24rpx;
	transition: all 0.3s;

	&:focus-within {
		border-color: #07C160;
	}
}

.code-input {
	height: 100rpx;
	font-size: 32rpx;
	color: #333;
}

.redeem-tips {
	display: flex;
	align-items: center;
	margin-bottom: 48rpx;

	.tips-icon {
		font-size: 28rpx;
		margin-right: 8rpx;
	}

	.tips-text {
		font-size: 22rpx;
		color: #ff9500;
	}
}

.confirm-btn {
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 28rpx 0;
	border-radius: 999rpx;

	&.disabled {
		opacity: 0.5;
	}
}

.faq-section {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-top: 24rpx;
}

.faq-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.faq-item {
	margin-bottom: 24rpx;

	&:last-child {
		margin-bottom: 0;
	}
}

.faq-q {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 8rpx;
}

.faq-a {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}
</style>
