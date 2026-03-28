<!-- pages/book-service/book-service.vue -->
<!-- 预约服务（对齐原型图-预约+确认预约2） -->
<template>
	<view class="page-book-service">
		<!-- 预约时间标题 -->
		<view class="section-header">
			<text class="section-header-title">预约时间</text>
		</view>

		<!-- 日期选择 -->
		<view class="date-section">
			<scroll-view scroll-x class="date-scroll">
				<view class="date-list">
					<view
						:class="['date-item', { active: selectedDate === index }]"
						v-for="(item, index) in dateList"
						:key="index"
						@click="selectDate(index)"
					>
						<text class="date-week">{{ item.week }}</text>
						<text class="date-day">{{ item.day }}</text>
						<text class="date-month">{{ item.month }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 服务项目列表 -->
		<view class="service-section">
			<view
				:class="['service-card', { active: selectedService === index }]"
				v-for="(item, index) in serviceList"
				:key="index"
				@click="selectService(index)"
			>
				<view class="service-info">
					<text class="service-name">{{ item.name }}</text>
					<text class="service-price">￥{{ item.price.toFixed(2) }}</text>
					<text class="service-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 时段选择 -->
		<view class="time-section">
			<view class="time-grid">
				<view
					:class="['time-item', { active: selectedTime === item, disabled: item.disabled }]"
					v-for="(item, idx) in timeSlots"
					:key="idx"
					@click="selectTime(item)"
				>
					<text>{{ item.label }}</text>
				</view>
			</view>
		</view>

		<!-- 备注 -->
		<view class="remark-section">
			<input
				class="remark-input"
				v-model="remark"
				placeholder="请输入备注内容"
				maxlength="200"
			/>
		</view>

		<!-- 底部固定栏：支付方式 + 确认下单 -->
		<view class="bottom-bar safe-bottom">
			<!-- 支付信息 -->
			<view class="pay-info-row">
				<!-- 账户余额 -->
				<view class="pay-info-item" @click="goWallet">
					<text class="pay-info-label">账户余额</text>
					<text class="pay-info-value">￥{{ balance }}</text>
				</view>
				<!-- 我的卡券 -->
				<view class="pay-info-item" @click="goCouponList">
					<text class="pay-info-label">我的卡券</text>
					<view class="pay-info-right">
						<text class="pay-info-count">({{ couponCount }})</text>
					</view>
				</view>
			</view>
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
			<!-- 选取优惠券 -->
			<view class="coupon-pick-row" @click="pickCoupon">
				<text class="coupon-pick-label">选取优惠卷</text>
				<view class="coupon-pick-right">
					<text class="coupon-pick-text" v-if="selectedCoupon">-￥{{ selectedCoupon.amount }}</text>
					<image class="coupon-pick-arrow" src="/static/icon/fenxiang.png" mode="aspectFit" />
				</view>
			</view>
			<!-- 确认下单按钮 -->
			<view class="submit-btn" @click="onSubmit">
				<text class="submit-text">确认下单</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/index.js'

const userStore = useUserStore()

const selectedDate = ref(0)
const selectedService = ref(0)
const selectedTime = ref(null)
const selectedPayMethod = ref(2) // 默认微信支付
const remark = ref('')
const selectedCoupon = ref(null)

const balance = ref(5.6)
const couponCount = ref(3)

const payMethods = [
	{ name: '余额支付' },
	{ name: '卡券' },
	{ name: '微信支付' }
]

// 服务列表
const serviceList = ref([
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' }
])

// 日期列表
const dateList = ref([])
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const initDateList = () => {
	const list = []
	for (let i = 0; i < 5; i++) {
		const date = new Date()
		date.setDate(date.getDate() + i)
		list.push({
			week: i === 0 ? '今天' : weekDays[date.getDay()],
			day: String(date.getDate()).padStart(2, '0'),
			month: (date.getMonth() + 1) + '月',
			dateStr: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		})
	}
	dateList.value = list
}

initDateList()

// 时段（两行：上08:00/12:00/16:00 下10:00/14:00）
const timeSlots = ref([
	{ label: '08:00', disabled: false },
	{ label: '12:00', disabled: false },
	{ label: '16:00', disabled: false },
	{ label: '10:00', disabled: false },
	{ label: '14:00', disabled: false }
])

const selectDate = (index) => {
	selectedDate.value = index
}

const selectService = (index) => {
	selectedService.value = index
}

const selectTime = (item) => {
	if (item.disabled) {
		uni.showToast({ title: '该时段已约满', icon: 'none' })
		return
	}
	selectedTime.value = item
}

const selectPayMethod = (index) => {
	selectedPayMethod.value = index
}

const goWallet = () => {
	uni.navigateTo({ url: '/pages/wallet/wallet' })
}

const goCouponList = () => {
	uni.navigateTo({ url: '/pages/coupon-list/coupon-list' })
}

const pickCoupon = () => {
	uni.showToast({ title: '优惠券选择功能开发中', icon: 'none' })
}

const onSubmit = () => {
	if (!selectedTime.value) {
		uni.showToast({ title: '请选择时段', icon: 'none' })
		return
	}
	const dateInfo = dateList.value[selectedDate.value]
	const service = serviceList.value[selectedService.value]
	// TODO: 调用创建预约订单接口
	uni.showToast({ title: '下单成功', icon: 'success' })
	setTimeout(() => {
		uni.navigateTo({
			url: `/pages/book-success/book-success?date=${dateInfo.dateStr}&time=${selectedTime.value.label}&service=${service.name}`
		})
	}, 500)
}
</script>

<style lang="scss" scoped>
.page-book-service {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 360rpx;
}

/* 预约时间标题 */
.section-header {
	padding: 24rpx 32rpx 0;
}

.section-header-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

/* 日期选择 */
.date-section {
	background-color: #fff;
	margin: 16rpx 24rpx;
	border-radius: 24rpx;
	padding: 24rpx;
}

.date-scroll {
	white-space: nowrap;
}

.date-list {
	display: inline-flex;
	gap: 16rpx;
}

.date-item {
	width: 120rpx;
	padding: 16rpx 0;
	text-align: center;
	border-radius: 16rpx;
	border: 2rpx solid #e0e0e0;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;

	&.active {
		border-color: #07C160;
		background-color: #e8f8ee;
	}
}

.date-week {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 6rpx;
}

.active .date-week {
	color: #07C160;
}

.date-day {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
	margin-bottom: 2rpx;
}

.date-month {
	font-size: 20rpx;
	color: #999;
}

/* 服务项目 */
.service-section {
	background-color: #fff;
	margin: 0 24rpx 16rpx;
	border-radius: 24rpx;
	padding: 24rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.service-card {
	width: calc(50% - 8rpx);
	padding: 24rpx;
	border-radius: 16rpx;
	border: 2rpx solid #e0e0e0;

	&.active {
		border-color: #07C160;
		background-color: #e8f8ee;
	}
}

.service-info {
	display: flex;
	flex-direction: column;
}

.service-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 4rpx;
}

.service-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff4d4f;
	margin-bottom: 4rpx;
}

.service-desc {
	font-size: 22rpx;
	color: #999;
}

/* 时段选择 */
.time-section {
	background-color: #fff;
	margin: 0 24rpx 16rpx;
	border-radius: 24rpx;
	padding: 24rpx;
}

.time-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.time-item {
	width: calc(33.33% - 12rpx);
	text-align: center;
	padding: 20rpx 0;
	border-radius: 16rpx;
	border: 2rpx solid #e0e0e0;
	font-size: 28rpx;
	color: #333;

	&.active {
		border-color: #07C160;
		background-color: #e8f8ee;
		color: #07C160;
		font-weight: 600;
	}

	&.disabled {
		border-color: #f0f0f0;
		background-color: #f8f8f8;
		color: #ccc;
	}
}

/* 备注 */
.remark-section {
	background-color: #fff;
	margin: 0 24rpx 16rpx;
	border-radius: 24rpx;
	padding: 24rpx;
}

.remark-input {
	width: 100%;
	font-size: 28rpx;
	color: #333;
	background-color: #f5f5f5;
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
	box-sizing: border-box;
}

/* 底部固定栏 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
	padding: 20rpx 24rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	z-index: 100;
}

/* 支付信息行 */
.pay-info-row {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.pay-info-item {
	flex: 1;
	display: flex;
	align-items: center;
}

.pay-info-label {
	font-size: 26rpx;
	color: #666;
	margin-right: 8rpx;
}

.pay-info-value {
	font-size: 26rpx;
	color: #333;
	font-weight: 600;
}

.pay-info-right {
	display: flex;
	align-items: center;
}

.pay-info-count {
	font-size: 26rpx;
	color: #333;
}

/* 支付方式 */
.pay-method-row {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: 16rpx;
}

.pay-method-item {
	display: flex;
	align-items: center;
	margin-right: 32rpx;
}

.method-radio {
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	border: 2rpx solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 8rpx;

	&.active {
		border-color: #07C160;
	}
}

.method-radio-inner {
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background-color: #07C160;
}

.method-name {
	font-size: 24rpx;
	color: #333;
}

/* 选取优惠券 */
.coupon-pick-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 0;
	border-top: 1rpx solid #f0f0f0;
	margin-bottom: 16rpx;
}

.coupon-pick-label {
	font-size: 26rpx;
	color: #333;
}

.coupon-pick-right {
	display: flex;
	align-items: center;
}

.coupon-pick-text {
	font-size: 26rpx;
	color: #ff4d4f;
	margin-right: 8rpx;
}

.coupon-pick-arrow {
	width: 24rpx;
	height: 24rpx;
}

/* 确认下单按钮 */
.submit-btn {
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;

	&:active {
		opacity: 0.9;
	}
}

.submit-text {
	font-size: 32rpx;
}
</style>
