<!-- pages/book-confirm/book-confirm.vue -->
<!-- 确认预约 -->
<template>
	<view class="page-book-confirm">
		<!-- 预约信息 -->
		<view class="book-info">
			<view class="info-row">
				<text class="info-label">服务项目</text>
				<text class="info-value">洗澡美容</text>
			</view>
			<view class="info-row">
				<text class="info-label">服务描述</text>
				<text class="info-value">人工洗澡 + 修毛</text>
			</view>
			<view class="info-row">
				<text class="info-label">预约日期</text>
				<text class="info-value">{{ bookDate }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">预约时段</text>
				<text class="info-value">{{ bookTime }}</text>
			</view>
		</view>

		<!-- 账户信息 -->
		<view class="account-info">
			<view class="info-row">
				<text class="info-label">账户余额</text>
				<text class="info-value price">￥{{ balance }}</text>
			</view>
			<view class="info-row" @click="goCouponList">
				<text class="info-label">我的卡券</text>
				<view class="info-right">
					<text class="info-value">{{ couponCount }}张</text>
					<text class="arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 支付方式 -->
		<view class="pay-method-section">
			<view class="section-title">选择支付方式</view>
			<view
				class="pay-method-item"
				v-for="(method, index) in payMethods"
				:key="index"
				@click="selectPayMethod(index)"
			>
				<view class="method-left">
					<text class="method-icon">{{ method.icon }}</text>
					<text class="method-name">{{ method.name }}</text>
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
				<text class="coupon-text" v-if="selectedCoupon">-￥{{ selectedCoupon.amount }}</text>
				<text class="coupon-text coupon-none" v-else>不使用</text>
				<text class="coupon-arrow">›</text>
			</view>
		</view>

		<!-- 金额信息 -->
		<view class="amount-section">
			<view class="amount-row">
				<text class="amount-label">服务费用</text>
				<text class="amount-value">￥30.00</text>
			</view>
			<view class="amount-row" v-if="selectedCoupon">
				<text class="amount-label">优惠券抵扣</text>
				<text class="amount-value discount">-￥{{ selectedCoupon.amount }}</text>
			</view>
			<view class="amount-row total">
				<text class="amount-label">实付金额</text>
				<text class="amount-value total-price">￥{{ finalAmount }}</text>
			</view>
		</view>

		<!-- 确认下单 -->
		<view class="submit-btn" @click="onSubmit">确认下单</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/index.js'
import { createBookOrder } from '@/api/order.js'

const userStore = useUserStore()

const bookDate = ref('')
const bookTime = ref('')
const balance = ref(865.50)
const couponCount = ref(3)
const selectedPayMethod = ref(0)
const selectedCoupon = ref(null)

const payMethods = [
	{ icon: '💰', name: '余额支付' },
	{ icon: '🎫', name: '卡券' },
	{ icon: '💬', name: '微信支付' }
]

const finalAmount = computed(() => {
	const base = 30
	const discount = selectedCoupon.value ? selectedCoupon.value.amount : 0
	return (base - discount).toFixed(2)
})

onLoad((options) => {
	bookDate.value = options.date || ''
	bookTime.value = options.time || ''
	balance.value = userStore.balance
	couponCount.value = userStore.couponCount
})

const selectPayMethod = (index) => {
	selectedPayMethod.value = index
}

const goCouponList = () => {
	uni.navigateTo({ url: '/pages/coupon-list/coupon-list' })
}

const pickCoupon = () => {
	// TODO: 选择优惠券
	uni.showToast({ title: '优惠券选择功能开发中', icon: 'none' })
}

const onSubmit = async () => {
	// TODO: 调用创建预约接口
	const res = await createBookOrder({
		serviceType: '洗澡美容',
		bookDate: bookDate.value,
		bookTime: bookTime.value,
		payMethod: payMethods[selectedPayMethod.value].name,
		couponId: selectedCoupon.value?.id
	})
	if (res) {
		uni.redirectTo({ url: '/pages/book-success/book-success' })
	}
}
</script>

<style lang="scss" scoped>
.page-book-confirm {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 24rpx;
	padding-bottom: 140rpx;
}

.book-info,
.account-info,
.pay-method-section,
.coupon-section,
.amount-section {
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

	&.price {
		color: #ff4d4f;
		font-weight: 600;
	}
}

.info-right {
	display: flex;
	align-items: center;
}

.arrow {
	font-size: 36rpx;
	color: #ccc;
	margin-left: 8rpx;
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

.method-name {
	font-size: 28rpx;
	color: #333;
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

.amount-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 0;

	&.total {
		border-top: 1rpx solid #f0f0f0;
		margin-top: 12rpx;
		padding-top: 24rpx;
	}
}

.amount-label {
	font-size: 28rpx;
	color: #999;
}

.amount-value {
	font-size: 28rpx;
	color: #333;

	&.discount {
		color: #07C160;
	}

	&.total-price {
		font-size: 40rpx;
		font-weight: 700;
		color: #ff4d4f;
	}
}

.submit-btn {
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
