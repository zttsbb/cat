<!-- pages/book-service/book-service.vue -->
<!-- 预约服务（对齐原型图-预约+确认预约2） -->
<template>
	<view class="page-book-service">
		<!-- 设备信息区域 -->
		<view class="device-header">
			<view class="device-top">
				<view class="device-name">{{ device.name }}</view>
				<view :class="['status-badge', device.status === 1 ? 'badge-green' : 'badge-orange']">
					{{ device.statusText }}
				</view>
			</view>
			<view class="device-detail">
				<view class="detail-item">
					<text class="detail-icon">📍</text>
					<text class="detail-text">{{ device.distance }}</text>
				</view>
				<view class="detail-item">
					<text class="detail-icon">🏠</text>
					<text class="detail-text">{{ device.address }}</text>
				</view>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entry">
			<view class="entry-item" v-for="(item, index) in quickEntries" :key="index" @click="onEntryClick(item)">
				<view class="entry-icon-wrap">
					<image v-if="item.iconImage" class="entry-icon-img" :src="item.iconImage" mode="aspectFit" />
				</view>
				<text class="entry-text">{{ item.text }}</text>
			</view>
		</view>

		<!-- 充值金额卡片 -->
		<view class="recharge-section">
			<scroll-view scroll-x class="recharge-scroll">
				<view class="recharge-list">
					<view class="recharge-card" v-for="(item, index) in rechargeAmounts" :key="index" @click="onRecharge(item)">
						<view class="recharge-amount">￥{{ item.amount }}</view>
						<view class="recharge-bonus" v-if="item.bonus">送￥{{ item.bonus }}</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 预约时间 -->
		<view class="book-title">
			<text class="book-title-text">预约时间</text>
		</view>

		<!-- 日期选择（横向滚动） -->
		<view class="date-section">
			<scroll-view scroll-x class="date-scroll">
				<view class="date-list">
					<view
						:class="['date-item', { active: selectedDate === index }]"
						v-for="(item, index) in dateList"
						:key="index"
						@click="selectDate(index)"
					>
						<!-- 时间轴圆点 -->
						<view :class="['timeline-dot', { 'dot-active': selectedDate === index }]"></view>
						<!-- 时间轴连接线 -->
						<view class="timeline-line" v-if="index < dateList.length - 1" :class="{ 'line-active': selectedDate >= index }"></view>
						<text class="date-week">{{ item.week }}</text>
						<text class="date-day">{{ item.day }}</text>
						<text class="date-month">{{ item.month }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 服务项目（2列2行网格） -->
		<view class="service-section">
			<view
				:class="['service-card', { active: selectedService === index }]"
				v-for="(item, index) in serviceList"
				:key="index"
				@click="selectService(index)"
			>
				<text class="service-name">{{ item.name }}</text>
				<text class="service-price">￥{{ item.price.toFixed(2) }}</text>
				<text class="service-desc">{{ item.desc }}</text>
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

		<!-- 底部固定栏：支付方式 + 确认下单（对齐原型图-确认预约2） -->
		<view class="bottom-bar safe-bottom">
			<!-- 账户余额 + 我的卡券 -->
			<view class="pay-info-row">
				<view class="pay-info-item" @click="goWallet">
					<text class="pay-info-label">账户余额</text>
					<text class="pay-info-value">￥{{ balance }}</text>
				</view>
				<view class="pay-info-item" @click="goCouponList">
					<text class="pay-info-label">我的卡券</text>
					<view class="pay-info-right">
						<text class="pay-info-count">({{ couponCount }})</text>
					</view>
				</view>
			</view>
			<!-- 支付方式 radio -->
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
			<!-- 选取优惠卷 -->
			<view class="coupon-pick-row" @click="pickCoupon">
				<text class="coupon-pick-label">选取优惠卷</text>
				<view class="coupon-pick-right">
					<text class="coupon-pick-text" v-if="selectedCoupon">-￥{{ selectedCoupon.amount }}</text>
					<text class="coupon-pick-arrow">›</text>
				</view>
			</view>
			<!-- 确认下单按钮 -->
			<view class="submit-btn" @click="onSubmit">
				<text class="submit-text">确认下单</text>
			</view>
		</view>

		<!-- 核销成功弹窗（对齐原型图-核销成功） -->
		<view class="redeem-success-overlay" v-if="showRedeemSuccess" @click="closeRedeemSuccess">
			<view class="redeem-success-popup" @click.stop>
				<!-- 成功图标 -->
				<view class="rs-icon-wrap">
					<image class="rs-icon-img" src="/static/icon/yuyuechenggong.png" mode="aspectFit" />
				</view>
				<text class="rs-title">核销成功</text>
				<!-- 卡券信息 -->
				<view class="rs-coupon-info">
					<view class="rs-coupon-source">
						<image v-if="redeemResult.platformIcon" class="rs-platform-icon" :src="redeemResult.platformIcon" mode="aspectFit" />
						<text class="rs-platform-name">{{ redeemResult.platformName }}</text>
					</view>
					<text class="rs-coupon-type">{{ redeemResult.couponType }}</text>
					<text class="rs-coupon-scope">{{ redeemResult.couponScope }}</text>
					<view class="rs-coupon-amount">
						<text class="rs-amount">金额{{ redeemResult.amount }}/单次</text>
					</view>
					<text class="rs-coupon-remain">可用{{ redeemResult.remain }}次</text>
					<text class="rs-coupon-expire">有效时间{{ redeemResult.expire }}</text>
				</view>
				<!-- 扫码下单按钮 -->
				<view class="rs-btn" @click="closeRedeemSuccess">
					<text class="rs-btn-text">扫码下单</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDeviceDetail, getDeviceList } from '@/api/store.js'
import { createBookOrder } from '@/api/order.js'
import { getWalletInfo, getAvailableCoupons } from '@/api/pay.js'
import { getCouponList } from '@/api/coupon.js'
import { redeemCoupon } from '@/api/coupon.js'

// 设备信息 Mock
const device = ref({
	id: 101,
	name: '智能洗宠机A1',
	address: '合肥市新站区新海大道5号...',
	status: 1,
	statusText: '可使用',
	distance: '3.6KM'
})

// 快捷入口（对齐原型图：预约服务/查看现场/预充值/团购核销/查看其它设备）
const quickEntries = ref([
	{ iconImage: '/static/icon/qiandao.png', text: '预约服务', action: 'current' },
	{ iconImage: '/static/icon/shoye.png', text: '查看现场', url: '/pages/store-detail/store-detail' },
	{ iconImage: '/static/icon/youhuichognzhi.png', text: '预充值', url: '/pages/wallet/wallet' },
	{ iconImage: '/static/icon/saomahexiao.png', text: '团购核销', action: 'redeem' },
	{ iconImage: '/static/icon/dingdanliebiao.png', text: '查看其它设备', url: '/pages/index/index' }
])

// 充值金额（对齐原型图：50元送5元 x5）
const rechargeAmounts = ref([
	{ amount: 50, bonus: 5 },
	{ amount: 50, bonus: 5 },
	{ amount: 50, bonus: 5 },
	{ amount: 50, bonus: 5 },
	{ amount: 50, bonus: 5 }
])

// 服务列表（对齐原型图：横向滚动 x4）
const serviceList = ref([
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' }
])

const selectedDate = ref(0)
const selectedService = ref(0)
const selectedTime = ref(null)
const selectedPayMethod = ref(2)
const remark = ref('')
const selectedCoupon = ref(null)

const balance = ref(5.6)
const couponCount = ref(3)

// 核销成功弹窗
const showRedeemSuccess = ref(false)
const redeemResult = ref({
	platformName: '美团',
	platformIcon: '/static/icon/meituan.png',
	couponType: '次卡',
	couponScope: '适用于:洗宠机',
	amount: 20,
	remain: 3,
	expire: '60天'
})

const payMethods = [
	{ name: '余额支付' },
	{ name: '卡券' },
	{ name: '微信支付' }
]

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

// 时段（对齐原型图：上排08:00/12:00/16:00 下排10:00/14:00）
const timeSlots = ref([
	{ label: '08:00', disabled: false },
	{ label: '12:00', disabled: false },
	{ label: '16:00', disabled: false },
	{ label: '10:00', disabled: false },
	{ label: '14:00', disabled: false }
])

onLoad((options) => {
	// TODO: 根据传入的 deviceId 加载设备信息
	// if (options.deviceId) { loadDevice(options.deviceId) }
})

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

const onEntryClick = (item) => {
	if (item.action === 'current') return
	if (item.action === 'redeem') {
		// TODO: 弹出核销弹窗，核销成功后显示核销成功弹窗
		// 模拟核销成功
		showRedeemSuccess.value = true
		return
	}
	if (item.url) {
		uni.navigateTo({ url: item.url })
	}
}

// 关闭核销成功弹窗
const closeRedeemSuccess = () => {
	showRedeemSuccess.value = false
}

const onRecharge = (item) => {
	uni.navigateTo({ url: `/pages/wallet/wallet?amount=${item.amount}` })
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
	padding-bottom: 380rpx;
}

/* 设备信息头部 */
.device-header {
	background-color: #fff;
	padding: 24rpx 32rpx;
}

.device-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.device-name {
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
}

.status-badge {
	font-size: 24rpx;
	padding: 6rpx 20rpx;
	border-radius: 999rpx;
}

.badge-green {
	background-color: #e8f8ee;
	color: #07C160;
}

.badge-orange {
	background-color: #fff3e8;
	color: #ff9500;
}

.device-detail {
	display: flex;
	flex-direction: column;
}

.detail-item {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.detail-icon {
	margin-right: 8rpx;
	font-size: 24rpx;
}

.detail-text {
	font-size: 26rpx;
	color: #666;
}

/* 快捷入口 */
.quick-entry {
	background-color: #fff;
	padding: 20rpx 24rpx 24rpx;
	display: flex;
	justify-content: space-between;
	border-top: 1rpx solid #f0f0f0;
}

.entry-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.entry-icon-wrap {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	background-color: #e8f8ee;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 8rpx;
}

.entry-icon-img {
	width: 48rpx;
	height: 48rpx;
}

.entry-text {
	font-size: 22rpx;
	color: #333;
}

/* 充值金额卡片 */
.recharge-section {
	padding: 16rpx 24rpx;
}

.recharge-scroll {
	white-space: nowrap;
}

.recharge-list {
	display: inline-flex;
	gap: 16rpx;
}

.recharge-card {
	min-width: 140rpx;
	height: 120rpx;
	border-radius: 16rpx;
	background: linear-gradient(135deg, #07C160, #38d976);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.recharge-amount {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.recharge-bonus {
	font-size: 20rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-top: 2rpx;
}

/* 预约时间标题 */
.book-title {
	padding: 16rpx 32rpx 8rpx;
}

.book-title-text {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

/* 日期选择（时间轴形式） */
.date-section {
	background-color: #fff;
	margin: 8rpx 24rpx;
	border-radius: 16rpx;
	padding: 24rpx;
}

.date-scroll {
	white-space: nowrap;
}

.date-list {
	display: inline-flex;
	gap: 0;
}

.date-item {
	width: 120rpx;
	padding: 16rpx 0;
	text-align: center;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;
	position: relative;

	&.active {
		.date-week { color: #07C160; }
		.date-day { color: #07C160; }
	}
}

/* 时间轴圆点 */
.timeline-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background-color: #ddd;
	margin-bottom: 8rpx;
	position: relative;
	z-index: 1;
}

.dot-active {
	background-color: #07C160;
}

/* 时间轴连接线 */
.timeline-line {
	position: absolute;
	top: 24rpx;
	left: calc(100% - 8rpx);
	width: calc(100% - 104rpx);
	height: 4rpx;
	background-color: #e0e0e0;
	z-index: 0;
}

.line-active {
	background-color: #07C160;
}

.date-week {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 4rpx;
}

.date-day {
	font-size: 30rpx;
	font-weight: 700;
	color: #333;
	margin-bottom: 2rpx;
}

.date-month {
	font-size: 20rpx;
	color: #999;
}

/* 服务项目（2列2行网格） */
.service-section {
	background-color: #fff;
	margin: 8rpx 24rpx;
	border-radius: 16rpx;
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

.service-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 4rpx;
}

.service-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff4d4f;
	display: block;
	margin-bottom: 4rpx;
}

.service-desc {
	font-size: 22rpx;
	color: #999;
	display: block;
}

/* 时段选择 */
.time-section {
	background-color: #fff;
	margin: 8rpx 24rpx;
	border-radius: 16rpx;
	padding: 20rpx;
}

.time-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.time-item {
	width: calc(33.33% - 8rpx);
	text-align: center;
	padding: 16rpx 0;
	border-radius: 12rpx;
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
	margin: 8rpx 24rpx;
	border-radius: 16rpx;
	padding: 20rpx;
}

.remark-input {
	width: 100%;
	font-size: 28rpx;
	color: #333;
	background-color: #f5f5f5;
	border-radius: 12rpx;
	padding: 16rpx 20rpx;
	box-sizing: border-box;
}

/* ===== 底部固定栏（确认预约2） ===== */
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

/* 账户余额 + 我的卡券 */
.pay-info-row {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
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

/* 支付方式 radio */
.pay-method-row {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.pay-method-item {
	display: flex;
	align-items: center;
	margin-right: 28rpx;
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

/* 选取优惠卷 */
.coupon-pick-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 0;
	border-top: 1rpx solid #f0f0f0;
	margin-bottom: 12rpx;
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
	font-size: 32rpx;
	color: #ccc;
}

/* 确认下单按钮 */
.submit-btn {
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 22rpx 0;
	border-radius: 999rpx;

	&:active {
		opacity: 0.9;
	}
}

.submit-text {
	font-size: 32rpx;
}

/* ===== 核销成功弹窗（背景=预约页面） ===== */
.redeem-success-overlay {
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

.redeem-success-popup {
	width: 580rpx;
	background-color: #fff;
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

.rs-icon-wrap {
	margin-bottom: 20rpx;
}

.rs-icon-img {
	width: 120rpx;
	height: 120rpx;
}

.rs-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
	margin-bottom: 32rpx;
}

/* 卡券信息 */
.rs-coupon-info {
	width: 100%;
	background-color: #fafafa;
	border-radius: 20rpx;
	padding: 28rpx;
	margin-bottom: 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.rs-coupon-source {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.rs-platform-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 8rpx;
}

.rs-platform-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.rs-coupon-type {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 6rpx;
}

.rs-coupon-scope {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.rs-coupon-amount {
	margin-bottom: 6rpx;
}

.rs-amount {
	font-size: 30rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.rs-coupon-remain {
	font-size: 24rpx;
	color: #07C160;
	margin-bottom: 6rpx;
}

.rs-coupon-expire {
	font-size: 22rpx;
	color: #999;
}

/* 扫码下单按钮 */
.rs-btn {
	width: 100%;
	background: linear-gradient(135deg, #07C160, #38d976);
	border-radius: 999rpx;
	padding: 24rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		opacity: 0.9;
	}
}

.rs-btn-text {
	font-size: 30rpx;
	font-weight: 600;
	color: #fff;
}
</style>
