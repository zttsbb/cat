<!-- pages/book-service/book-service.vue -->
<!-- 预约到店弹窗（对齐原型图：预约.png）弹出2/3页面 -->
<!-- 确认预约（对齐原型图：确认预约.png）预约成功叠加弹窗 -->
<template>
	<view class="page-store">
		<!-- ========== 预约到店弹窗（2/3页面） ========== -->
		<view class="book-mask" v-if="showBookPopup" @click="closeBookPopup">
			<view class="book-popup" @click.stop>
				<!-- 弹窗头部 -->
				<view class="popup-header">
					<text class="popup-title">预约到店</text>
					<view class="popup-close" @click="closeBookPopup">
						<text class="popup-close-text">✕</text>
					</view>
				</view>

				<!-- 预约时间（时间轴形式） -->
				<view class="timeline-section">
					<text class="timeline-title">预约时间</text>
					<scroll-view scroll-x class="timeline-scroll">
						<view class="timeline-list">
							<view
								:class="['timeline-item', { active: selectedDate === index, passed: index < selectedDate }]"
								v-for="(item, index) in dateList"
								:key="index"
								@click="selectedDate = index"
							>
								<view class="tl-dot-line">
									<view :class="['tl-dot', { active: selectedDate === index, passed: index <= selectedDate }]"></view>
									<view class="tl-line" v-if="index < dateList.length - 1" :class="{ active: index < selectedDate }"></view>
								</view>
								<text class="tl-week">{{ item.week }}</text>
								<text class="tl-day">{{ item.day }}</text>
								<text class="tl-month">{{ item.month }}</text>
							</view>
						</view>
					</scroll-view>
					<!-- 时段选择 -->
					<view class="time-grid">
						<view
							:class="['time-slot', { active: selectedTime === item, disabled: item.disabled }]"
							v-for="(item, idx) in timeSlots"
							:key="idx"
							@click="!item.disabled && (selectedTime = item)"
						>
							<text class="time-slot-text">{{ item.label }}</text>
						</view>
					</view>
				</view>

				<!-- 服务项目 2x2 -->
				<view class="svc-section">
					<text class="svc-section-title">服务项目</text>
					<view class="svc-grid">
						<view
							:class="['svc-card', { active: selectedService === index }]"
							v-for="(item, index) in serviceList"
							:key="index"
							@click="selectedService = index"
						>
							<text class="svc-name">{{ item.name }}</text>
							<text class="svc-price">￥{{ item.price.toFixed(2) }}</text>
							<text class="svc-desc">{{ item.desc }}</text>
						</view>
					</view>
				</view>

				<!-- 备注 -->
				<view class="remark-wrap">
					<input class="remark-input" v-model="remark" placeholder="请输入备注内容" maxlength="200" />
				</view>

				<!-- 底部确认下单按钮 -->
				<view class="popup-bottom">
					<view class="submit-btn" @click="onSubmit">
						<text class="submit-btn-text">确认下单</text>
					</view>
				</view>
			</view>
		</view>

		<!-- ========== 预约成功叠加弹窗（背景=预约页面） ========== -->
		<view class="success-mask" v-if="showSuccess" @click="onSuccessClick">
			<view class="success-popup" @click.stop>
				<view class="success-icon-wrap">
					<image class="success-icon-img" src="/static/icon/yuyuechenggong.png" mode="aspectFit" />
				</view>
				<text class="success-title">预约成功</text>
				<text class="success-desc">您的预约已提交成功，请按时到店</text>
				<view class="success-btn" @click="goHome">
					<text class="success-btn-text">返回首页</text>
				</view>
			</view>
		</view>

		<!-- ========== 支付方式选择弹窗 ========== -->
		<view class="pay-mask" v-if="showPayPopup" @click="closePayPopup">
			<view class="pay-popup" @click.stop>
				<view class="pay-popup-header">
					<text class="pay-popup-title">选择支付方式</text>
					<view class="pay-popup-close" @click="closePayPopup">
						<text>✕</text>
					</view>
				</view>
				<view class="pay-amount">
					<text class="pay-amount-label">应付金额</text>
					<text class="pay-amount-value">￥{{ totalAmount }}</text>
				</view>
				<view class="pay-popup-body">
					<!-- 账户余额 -->
					<view class="pay-option" @click="onPaySelect('balance')">
						<view class="pay-option-icon">
							<text>💰</text>
						</view>
						<view class="pay-option-info">
							<text class="pay-option-text">账户余额</text>
							<text class="pay-option-desc">可用余额￥{{ balance }}</text>
						</view>
						<view class="pay-option-radio" :class="{ active: selectedPayMethod === 'balance' }">
							<text class="radio-dot" v-if="selectedPayMethod === 'balance'"></text>
						</view>
					</view>
					<!-- 我的卡券 -->
					<view class="pay-option" @click="pickCoupon">
						<view class="pay-option-icon">
							<text>🎫</text>
						</view>
						<view class="pay-option-info">
							<text class="pay-option-text">我的卡券</text>
							<text class="pay-option-desc" v-if="selectedCoupon">-￥{{ selectedCoupon.amount }}</text>
							<text class="pay-option-desc" v-else>选择优惠券</text>
						</view>
						<text class="pay-option-arrow">›</text>
					</view>
					<!-- 微信支付 -->
					<view class="pay-option" @click="onPaySelect('wechat')">
						<view class="pay-option-icon">
							<text>🟢</text>
						</view>
						<view class="pay-option-info">
							<text class="pay-option-text">微信支付</text>
							<text class="pay-option-desc">推荐使用</text>
						</view>
						<view class="pay-option-radio" :class="{ active: selectedPayMethod === 'wechat' }">
							<text class="radio-dot" v-if="selectedPayMethod === 'wechat'"></text>
						</view>
					</view>
				</view>
				<view class="pay-confirm-btn" @click="confirmPay">
					<text class="pay-confirm-text">确认支付</text>
				</view>
			</view>
		</view>

		<!-- ========== 优惠券选择弹窗 ========== -->
		<view class="coupon-mask" v-if="showCouponPicker" @click="showCouponPicker = false">
			<view class="coupon-popup" @click.stop>
				<view class="coupon-popup-header">
					<text class="coupon-popup-title">选择优惠券</text>
					<view class="coupon-popup-close" @click="showCouponPicker = false">
						<text>✕</text>
					</view>
				</view>
				<scroll-view scroll-y class="coupon-popup-list">
					<view
						:class="['cp-item', { active: selectedCoupon && selectedCoupon.id === c.id, disabled: c.disabled }]"
						v-for="c in couponList"
						:key="c.id"
						@click="!c.disabled && onSelectCoupon(c)"
					>
						<view class="cp-left">
							<text class="cp-sym">￥</text>
							<text class="cp-num">{{ c.amount }}</text>
						</view>
						<view class="cp-right">
							<text class="cp-name">{{ c.name }}</text>
							<text class="cp-scope">{{ c.scope }}</text>
							<text class="cp-expire">{{ c.expireText }}</text>
						</view>
						<view class="cp-check" v-if="selectedCoupon && selectedCoupon.id === c.id">✓</view>
					</view>
					<view class="cp-no-use" :class="{ active: !selectedCoupon }" @click="onSelectCoupon(null)">
						<text class="cp-no-use-text">不使用优惠券</text>
						<view class="cp-check" v-if="!selectedCoupon">✓</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createBookOrder } from '@/api/order.js'
import { getWalletInfo, getAvailableCoupons } from '@/api/pay.js'

// ==================== 预约弹窗 ====================
const showBookPopup = ref(true)
const showSuccess = ref(false)
const showPayPopup = ref(false)
const showCouponPicker = ref(false)

const selectedDate = ref(0)
const selectedTime = ref(null)
const selectedService = ref(0)
const remark = ref('')
const balance = ref(5.6)
const selectedCoupon = ref(null)
const selectedPayMethod = ref('wechat')

// 计算总金额
const totalAmount = computed(() => {
	const service = serviceList.value[selectedService.value]
	let amount = service.price
	if (selectedCoupon.value) {
		amount -= selectedCoupon.value.amount
	}
	return Math.max(0, amount).toFixed(2)
})

// 日期列表
const dateList = ref([])
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const initDateList = () => {
	const list = []
	for (let i = 0; i < 7; i++) {
		const d = new Date()
		d.setDate(d.getDate() + i)
		list.push({
			week: i === 0 ? '今天' : weekDays[d.getDay()],
			day: String(d.getDate()).padStart(2, '0'),
			month: (d.getMonth() + 1) + '月',
			dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
		})
	}
	dateList.value = list
}
initDateList()

// 时段
const timeSlots = ref([
	{ label: '08:00', disabled: false },
	{ label: '10:00', disabled: false },
	{ label: '12:00', disabled: false },
	{ label: '14:00', disabled: false },
	{ label: '16:00', disabled: false },
	{ label: '18:00', disabled: true }
])

// 服务项目
const serviceList = ref([
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' }
])

// 优惠券列表
/** @type {Array} 可用优惠券 - 接口: GET /api/pay/coupon/available */
const couponList = ref([
	{ id: 1, name: '美团·次卡', amount: 20, scope: '适用于:洗宠机', expireText: '剩余有效期3天', disabled: false },
	{ id: 2, name: '洗宠优惠券', amount: 10, scope: '适用于:洗宠机', expireText: '剩余有效期15天', disabled: false },
	{ id: 3, name: '系统·余额卷', amount: 30, scope: '适用于:洗宠机', expireText: '剩余有效期60天', disabled: false },
	{ id: 4, name: '过期次卡', amount: 15, scope: '适用于:洗宠机', expireText: '已到期', disabled: true }
])

// ==================== 预约弹窗交互 ====================

/** 关闭预约弹窗 */
const closeBookPopup = () => {
	showBookPopup.value = false
}

/** 选择优惠券 */
const pickCoupon = () => {
	showCouponPicker.value = true
}

const onSelectCoupon = (c) => {
	selectedCoupon.value = c
	showCouponPicker.value = false
}

/** 选择支付方式 */
const onPaySelect = (method) => {
	if (method === 'wechat') {
		selectedPayMethod.value = 'wechat'
	}
}

/** 关闭支付弹窗 */
const closePayPopup = () => {
	showPayPopup.value = false
}

/**
 * 提交预约订单 - 打开支付方式选择弹窗
 * 接口: POST /api/order/book/create
 */
const onSubmit = () => {
	if (!selectedTime.value) {
		uni.showToast({ title: '请选择时段', icon: 'none' })
		return
	}
	const dateInfo = dateList.value[selectedDate.value]
	const service = serviceList.value[selectedService.value]

	// 打开支付方式选择弹窗
	showPayPopup.value = true
}

/**
 * 确认支付
 * 接口: POST /api/order/book/create
 */
const confirmPay = () => {
	const dateInfo = dateList.value[selectedDate.value]
	const service = serviceList.value[selectedService.value]

	// TODO: 调用创建预约订单接口
	// createBookOrder({
	// 	date: dateInfo.dateStr,
	// 	time: selectedTime.value.label,
	// 	serviceId: service.id,
	// 	remark: remark.value,
	// 	payMethod: selectedPayMethod.value,
	// 	couponId: selectedCoupon.value?.id || ''
	// }).then(res => {
	// 	showPayPopup.value = false
	// 	showSuccess.value = true
	// })

	// Mock: 直接显示预约成功
	showPayPopup.value = false
	showSuccess.value = true
}

/** 预约成功弹窗点击背景不关闭 */
const onSuccessClick = () => {
	// 不做任何操作，必须点按钮关闭
}

/** 返回首页 */
const goHome = () => {
	showSuccess.value = false
	showBookPopup.value = false
	uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
/* ==================== 主题变量 ==================== */
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

/* ==================== 页面容器 ==================== */
.page-store {
	min-height: 100vh;
	background: #f7f7f7;
}

/* ==================== 预约到店弹窗（2/3页面） ==================== */
.book-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.book-popup {
	width: 100%;
	height: 75vh;
	background: #f7f7f7;
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease-out;
	overflow: hidden;
}

@keyframes slideUp {
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
}

/* 弹窗头部 */
.popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 32rpx 20rpx;
	background: #fff;
	border-radius: 32rpx 32rpx 0 0;
}

.popup-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #222;
}

.popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-close-text {
	font-size: 32rpx;
	color: #999;
}

/* 时间轴形式 - 预约时间 */
.timeline-section {
	background: #fff;
	margin: 12rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 24rpx;
}

.timeline-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 16rpx;
}

.timeline-scroll {
	white-space: nowrap;
	margin-bottom: 20rpx;
}

.timeline-list {
	display: inline-flex;
	gap: 0;
}

.timeline-item {
	width: 120rpx;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;

	&.active {
		.tl-week { color: $primary-dark; }
		.tl-day { color: $primary-dark; }
	}

	&.passed {
		.tl-week { color: $primary-dark; }
	}
}

.tl-dot-line {
	display: flex;
	align-items: center;
	width: 100%;
	height: 20rpx;
	margin-bottom: 8rpx;
}

.tl-dot {
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background: #ddd;
	flex-shrink: 0;
	z-index: 1;

	&.active {
		background: $primary;
		width: 22rpx;
		height: 22rpx;
		box-shadow: 0 0 0 6rpx $primary-light;
	}

	&.passed {
		background: $primary;
	}
}

.tl-line {
	flex: 1;
	height: 4rpx;
	background: #e0e0e0;
	margin: 0 -4rpx;

	&.active {
		background: $primary;
	}
}

.tl-week {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 4rpx;
}

.tl-day {
	font-size: 30rpx;
	font-weight: 700;
	color: #333;
	margin-bottom: 2rpx;
}

.tl-month {
	font-size: 20rpx;
	color: #999;
}

/* 时段网格 */
.time-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.time-slot {
	width: calc(33.33% - 8rpx);
	text-align: center;
	padding: 16rpx 0;
	border-radius: 12rpx;
	border: 2rpx solid #e8e8e8;

	&.active {
		border-color: $primary;
		background: $primary-bg;

		.time-slot-text {
			color: $primary-dark;
			font-weight: 600;
		}
	}

	&.disabled {
		border-color: #f0f0f0;
		background: #fafafa;

		.time-slot-text {
			color: #ccc;
		}
	}
}

.time-slot-text {
	font-size: 28rpx;
	color: #333;
}

/* 服务项目 2x2 */
.svc-section {
	background: #fff;
	margin: 12rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 24rpx;
}

.svc-section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 16rpx;
}

.svc-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.svc-card {
	width: calc(50% - 6rpx);
	padding: 20rpx;
	border-radius: 16rpx;
	border: 2rpx solid #e8e8e8;

	&.active {
		border-color: $primary;
		background: $primary-bg;
	}
}

.svc-name {
	font-size: 26rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 4rpx;
}

.svc-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff4d4f;
	display: block;
	margin-bottom: 4rpx;
}

.svc-desc {
	font-size: 22rpx;
	color: #999;
	display: block;
}

/* 备注 */
.remark-wrap {
	margin: 12rpx 24rpx 0;
	background: #fff;
	border-radius: 20rpx;
	padding: 20rpx 24rpx;
}

.remark-input {
	width: 100%;
	font-size: 28rpx;
	color: #333;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 16rpx 20rpx;
	box-sizing: border-box;
}

/* 底部确认下单按钮 */
.popup-bottom {
	margin-top: auto;
	background: #fff;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	border-top: 1rpx solid #f0f0f0;
}

.submit-btn {
	background: $primary;
	border-radius: 999rpx;
	padding: 24rpx 0;
	text-align: center;

	&:active {
		opacity: 0.85;
	}
}

.submit-btn-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}

/* ==================== 预约成功叠加弹窗（背景=预约页面） ==================== */
.success-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.3);
	z-index: 1001;
	display: flex;
	align-items: center;
	justify-content: center;
}

.success-popup {
	width: 560rpx;
	background: #fff;
	border-radius: 32rpx;
	padding: 60rpx 40rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: popIn 0.3s ease-out;
}

@keyframes popIn {
	from { transform: scale(0.8); opacity: 0; }
	to { transform: scale(1); opacity: 1; }
}

.success-icon-wrap {
	margin-bottom: 24rpx;
}

.success-icon-img {
	width: 140rpx;
	height: 140rpx;
}

.success-title {
	font-size: 40rpx;
	font-weight: 700;
	color: $primary-dark;
	margin-bottom: 12rpx;
}

.success-desc {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 40rpx;
}

.success-btn {
	width: 100%;
	background: $primary;
	border-radius: 999rpx;
	padding: 24rpx 0;
	text-align: center;

	&:active {
		opacity: 0.85;
	}
}

.success-btn-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}

/* ==================== 支付方式选择弹窗 ==================== */
.pay-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.pay-popup {
	width: 100%;
	background: #fff;
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease-out;
	padding-bottom: calc(env(safe-area-inset-bottom));
}

.pay-popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 32rpx 20rpx;
}

.pay-popup-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.pay-popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #999;
}

.pay-amount {
	text-align: center;
	padding: 20rpx 0 32rpx;
}

.pay-amount-label {
	font-size: 28rpx;
	color: #999;
	margin-right: 12rpx;
}

.pay-amount-value {
	font-size: 56rpx;
	font-weight: 700;
	color: #333;
}

.pay-popup-body {
	padding: 0 32rpx;
}

.pay-option {
	display: flex;
	align-items: center;
	padding: 32rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.pay-option-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 16rpx;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	font-size: 36rpx;
}

.pay-option-info {
	flex: 1;
}

.pay-option-text {
	font-size: 30rpx;
	color: #333;
	display: block;
	margin-bottom: 4rpx;
}

.pay-option-desc {
	font-size: 24rpx;
	color: #999;
}

.pay-option-arrow {
	font-size: 36rpx;
	color: #ccc;
}

.pay-option-radio {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	border: 2rpx solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;

	&.active {
		border-color: $primary;
	}
}

.radio-dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background: $primary;
}

.pay-confirm-btn {
	background: $primary;
	margin: 16rpx 32rpx 32rpx;
	border-radius: 99rpx;
	padding: 28rpx 0;
	text-align: center;

	&:active {
		opacity: 0.85;
	}
}

.pay-confirm-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}

/* ==================== 优惠券选择弹窗 ==================== */
.coupon-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1002;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.coupon-popup {
	width: 100%;
	max-height: 70vh;
	background: #fff;
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease-out;
}

.coupon-popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 32rpx 16rpx;
}

.coupon-popup-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #222;
}

.coupon-popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #999;
}

.coupon-popup-list {
	flex: 1;
	padding: 12rpx 24rpx;
	padding-bottom: env(safe-area-inset-bottom);
}

.cp-item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	margin-bottom: 16rpx;
	border-radius: 16rpx;
	border: 2rpx solid #e8e8e8;
	background: #fff;

	&.active {
		border-color: $primary;
		background: $primary-bg;
	}

	&.disabled {
		opacity: 0.5;
	}
}

.cp-left {
	display: flex;
	align-items: baseline;
	padding-right: 20rpx;
	border-right: 2rpx dashed #e0e0e0;
	margin-right: 20rpx;
	min-width: 120rpx;
	justify-content: center;
}

.cp-sym {
	font-size: 24rpx;
	color: #ff6b35;
	font-weight: 600;
}

.cp-num {
	font-size: 44rpx;
	color: #ff6b35;
	font-weight: 700;
}

.cp-right {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.cp-name {
	font-size: 26rpx;
	font-weight: 600;
	color: #222;
	margin-bottom: 4rpx;
}

.cp-scope {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 2rpx;
}

.cp-expire {
	font-size: 20rpx;
	color: #ccc;
}

.cp-check {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background: $primary;
	color: #fff;
	font-size: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 12rpx;
	flex-shrink: 0;
}

.cp-no-use {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 28rpx;
	border-radius: 16rpx;
	border: 2rpx dashed #ddd;
	margin-bottom: 16rpx;

	&.active {
		border-color: $primary;
		background: $primary-bg;
	}
}

.cp-no-use-text {
	font-size: 28rpx;
	color: #333;
}
</style>
