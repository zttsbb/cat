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

		<!-- 底部固定：支付方式 + 确认下单 -->
		<view class="bottom-bar safe-bottom">
			<!-- 支付方式选择 -->
			<view class="pay-method-row">
				<view
					class="pay-method-item"
					v-for="(method, index) in payMethods"
					:key="index"
					@click="selectPayMethod(index)"
				>
					<view :class="['method-radio', { active: selectedPayMethod === index }]">
						<view class="method-radio-inner" v-if="selectedPayMethod === index"></view>
					</view>
					<text class="method-name">{{ method.name }}</text>
				</view>
			</view>
			<!-- 确认按钮 -->
			<view class="submit-btn" @click="onSubmit">
				<text class="submit-amount">￥{{ finalAmount }}</text>
				<text class="submit-text">确认下单</text>
			</view>
		</view>
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
	try {
		uni.showLoading({ title: '下单中...', mask: true })
		const res = await createBookOrder({
			serviceType: '洗澡美容',
			bookDate: bookDate.value,
			bookTime: bookTime.value,
			payMethod: payMethods[selectedPayMethod.value].name,
			couponId: selectedCoupon.value?.id
		})
		uni.hideLoading()
		if (res) {
			uni.redirectTo({ url: '/pages/book-success/book-success' })
		}
	} catch (e) {
		uni.hideLoading()
		console.error('下单失败:', e)
		uni.showToast({ title: '下单失败，请重试', icon: 'none' })
	}
}
</script>

<style lang="scss" scoped>
.page-book-confirm {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 24rpx;
	padding-bottom: 260rpx;
}

.book-info,
.account-info,
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

/* 底部固定支付栏 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
	padding: 20rpx 24rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	z-index: 100;
}

.pay-method-row {
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.pay-method-item {
	display: flex;
	align-items: center;
	padding: 8rpx 16rpx;
}

.method-radio {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	border: 3rpx solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12rpx;

	&.active {
		border-color: #07C160;
	}
}

.method-radio-inner {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	background-color: #07C160;
}

.method-name {
	font-size: 26rpx;
	color: #333;
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
	flex: 1;
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.submit-amount {
	font-size: 36rpx;
	font-weight: 700;
	margin-right: 12rpx;
}

.submit-text {
	font-size: 30rpx;
}
</style>
