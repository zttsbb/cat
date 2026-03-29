<!-- pages/book-service/book-service.vue -->
<!-- 门店主页（对齐原型图：门店主页.png） -->
<!-- 预约到店弹窗（对齐原型图：预约.png）弹出2/3页面 -->
<!-- 确认预约（对齐原型图：确认预约.png）预约成功叠加弹窗 -->
<template>
	<view class="page-store">
		<!-- ========== 一、门店主页 ========== -->
		<!-- 门店大图 -->
		<view class="store-banner">
			<image class="banner-img" :src="store.banner" mode="aspectFill" />
		</view>

		<!-- 门店信息 -->
		<view class="store-info-card">
			<view class="store-top-row">
				<text class="store-name">{{ store.name }}</text>
				<view class="switch-btn" @click="goStoreList">
					<text class="switch-text">切换门店</text>
					<text class="switch-arrow">›</text>
				</view>
			</view>
			<view class="store-addr-row">
				<text class="store-addr">📍 {{ store.address }}</text>
			</view>
			<view class="store-dist-row">
				<text class="store-dist">距我 {{ store.distance }}</text>
			</view>
			<view class="store-tags">
				<view class="tag" v-for="(t, i) in store.tags" :key="i">
					<text class="tag-text">{{ t }}</text>
				</view>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entry">
			<view class="entry-item" v-for="(item, idx) in quickEntries" :key="idx" @click="onEntryClick(item)">
				<view class="entry-icon-box">
					<image v-if="item.iconImage" class="entry-icon-img" :src="item.iconImage" mode="aspectFit" />
					<text v-else class="entry-icon-text">{{ item.icon }}</text>
				</view>
				<text class="entry-label">{{ item.text }}</text>
			</view>
		</view>

		<!-- 设备列表 -->
		<view class="device-section">
			<text class="section-title">可用设备</text>
			<view class="device-list">
				<view class="device-card" v-for="(d, idx) in deviceList" :key="idx" @click="goDeviceDetail(d)">
					<view class="device-card-top">
						<text class="device-card-name">{{ d.name }}</text>
						<view :class="['device-card-status', d.status === 1 ? 'st-green' : 'st-gray']">
							{{ d.statusText }}
						</view>
					</view>
					<view class="device-card-addr">
						<text>{{ d.address }}</text>
					</view>
					<view class="device-card-bottom">
						<view class="device-price">
							<text class="price-label">每分钟</text>
							<text class="price-num">{{ d.priceRange }}</text>
							<text class="price-unit">元</text>
						</view>
						<view class="device-btn" @click.stop="onBookDevice(d)">
							<text class="device-btn-text">预约</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- ========== 二、预约到店弹窗（2/3页面） ========== -->
		<view class="book-mask" v-if="showBookPopup" @click="closeBookPopup">
			<view class="book-popup" @click.stop>
				<!-- 弹窗头部 -->
				<view class="popup-header">
					<text class="popup-title">预约到店</text>
					<view class="popup-close" @click="closeBookPopup">
						<text class="popup-close-text">✕</text>
					</view>
				</view>

				<!-- 日期选择 -->
				<scroll-view scroll-x class="date-scroll-wrap">
					<view class="date-list">
						<view
							:class="['date-item', { active: selectedDate === index }]"
							v-for="(item, index) in dateList"
							:key="index"
							@click="selectedDate = index"
						>
							<text class="date-week">{{ item.week }}</text>
							<text class="date-day">{{ item.day }}</text>
							<text class="date-month">{{ item.month }}</text>
						</view>
					</view>
				</scroll-view>

				<!-- 时段选择 -->
				<view class="time-section">
					<text class="time-section-title">选择时段</text>
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

				<!-- 底部支付栏 -->
				<view class="popup-bottom">
					<view class="pay-info-row">
						<view class="pay-info-item" @click="goWallet">
							<text class="pi-label">账户余额</text>
							<text class="pi-value">￥{{ balance }}</text>
						</view>
						<view class="pay-info-item" @click="goCouponList">
							<text class="pi-label">我的卡券</text>
							<text class="pi-value">({{ couponCount }})</text>
						</view>
					</view>
					<view class="pay-method-row">
						<view class="radio-circle active">
							<view class="radio-inner"></view>
						</view>
						<text class="pay-method-name">微信支付</text>
					</view>
					<view class="coupon-row" @click="pickCoupon">
						<text class="coupon-row-label">选取优惠券</text>
						<view class="coupon-row-right">
							<text class="coupon-row-text" v-if="selectedCoupon">-￥{{ selectedCoupon.amount }}</text>
							<text class="coupon-row-arrow">›</text>
						</view>
					</view>
					<view class="submit-btn" @click="onSubmit">
						<text class="submit-btn-text">确认下单</text>
					</view>
				</view>
			</view>
		</view>

		<!-- ========== 三、预约成功叠加弹窗（背景=预约页面） ========== -->
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
import { ref, onMounted } from 'vue'
import { getStoreDetail, getDeviceList } from '@/api/store.js'
import { createBookOrder } from '@/api/order.js'
import { getWalletInfo, getAvailableCoupons } from '@/api/pay.js'

// ==================== 门店信息 ====================
/** @type {Object} 门店信息 - 接口: GET /api/store/detail */
const store = ref({
	id: 1,
	name: '物沃宠物洗护中心（南山店）',
	banner: '/static/banner/banner1.jpg',
	address: '深圳市南山区科技园南区深南大道9966号',
	distance: '3.6KM',
	tags: ['有车位', '有技师', 'WIFI覆盖', '门店图']
})

// ==================== 快捷入口 ====================
const quickEntries = ref([
	{ iconImage: '/static/icon/qiandao.png', text: '预约到店', action: 'book' },
	{ iconImage: '/static/icon/saomahexiao.png', text: '团购核销', action: 'redeem' },
	{ iconImage: '/static/icon/qianbao.png', text: '我的订单', action: 'orders' },
	{ iconImage: '/static/icon/youhuichognzhi.png', text: '优惠充值', action: 'recharge' },
	{ iconImage: '/static/icon/fenxiang.png', text: '分享有礼', action: 'share' }
])

// ==================== 设备列表 ====================
/** @type {Array} 设备列表 - 接口: GET /api/device/list */
const deviceList = ref([
	{ id: 101, name: '智能洗宠机A1', address: '深圳市南山区科技园南区深南大道9966号', status: 1, statusText: '可使用', priceRange: '0.8-1.2', storeId: 1 },
	{ id: 102, name: '智能洗宠机A2', address: '深圳市南山区科技园南区深南大道9966号', status: 2, statusText: '使用中', priceRange: '0.8-1.2', storeId: 1 }
])

// ==================== 预约弹窗 ====================
const showBookPopup = ref(false)
const showSuccess = ref(false)
const selectedDate = ref(0)
const selectedTime = ref(null)
const selectedService = ref(0)
const remark = ref('')
const balance = ref(5.6)
const couponCount = ref(3)
const selectedCoupon = ref(null)
const showCouponPicker = ref(false)

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

// ==================== 页面生命周期 ====================
onMounted(() => {
	loadData()
})

/**
 * 加载页面数据
 * 并行: 门店详情 / 设备列表 / 钱包 / 优惠券
 */
const loadData = async () => {
	try {
		// TODO: const res = await getStoreDetail(1)
		// if (res) store.value = res
	} catch (e) {}

	try {
		// TODO: const list = await getDeviceList({ storeId: 1 })
		// if (list?.length) deviceList.value = list
	} catch (e) {}

	try {
		// TODO: const wallet = await getWalletInfo()
		// if (wallet) balance.value = wallet.balance
	} catch (e) {}

	try {
		// TODO: const coupons = await getAvailableCoupons({ type: 'book' })
		// if (coupons) { couponCount.value = coupons.length; couponList.value = coupons }
	} catch (e) {}
}

// ==================== 门店主页交互 ====================

/** 快捷入口点击 */
const onEntryClick = (item) => {
	switch (item.action) {
		case 'book':
			openBookPopup()
			break
		case 'redeem':
			// TODO: 打开团购核销弹窗
			uni.navigateTo({ url: '/pages/coupon-redeem/coupon-redeem' })
			break
		case 'orders':
			uni.switchTab({ url: '/pages/wash-order-list/wash-order-list' })
			break
		case 'recharge':
			uni.navigateTo({ url: '/pages/wallet/wallet' })
			break
		case 'share':
			// TODO: 分享有礼
			uni.showToast({ title: '分享有礼功能开发中', icon: 'none' })
			break
	}
}

/** 设备卡片点击 → 设备详情 */
const goDeviceDetail = (d) => {
	uni.navigateTo({ url: `/pages/device-detail/device-detail?deviceId=${d.id}` })
}

/** 设备卡片"预约"按钮 → 打开预约弹窗 */
const onBookDevice = (d) => {
	openBookPopup()
}

const goStoreList = () => {
	uni.navigateTo({ url: '/pages/store-list/store-list' })
}

// ==================== 预约弹窗交互 ====================

/** 打开预约弹窗 */
const openBookPopup = () => {
	selectedDate.value = 0
	selectedTime.value = null
	selectedService.value = 0
	remark.value = ''
	showBookPopup.value = true
}

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

const goWallet = () => {
	uni.navigateTo({ url: '/pages/wallet/wallet' })
}

const goCouponList = () => {
	uni.navigateTo({ url: '/pages/coupon-list/coupon-list' })
}

/**
 * 提交预约订单
 * 接口: POST /api/order/book/create
 * @param {string} date - 预约日期
 * @param {string} time - 预约时段
 * @param {string} serviceId - 服务项目ID
 * @param {string} remark - 备注
 * @param {string} payMethod - 支付方式
 * @param {string} couponId - 优惠券ID
 */
const onSubmit = () => {
	if (!selectedTime.value) {
		uni.showToast({ title: '请选择时段', icon: 'none' })
		return
	}
	const dateInfo = dateList.value[selectedDate.value]
	const service = serviceList.value[selectedService.value]

	// TODO: 调用创建预约订单接口
	// createBookOrder({
	// 	date: dateInfo.dateStr,
	// 	time: selectedTime.value.label,
	// 	serviceId: service.id,
	// 	remark: remark.value,
	// 	payMethod: 'wechat',
	// 	couponId: selectedCoupon.value?.id || ''
	// }).then(res => {
	// 	bookOrderId.value = res.orderId
	// 	showSuccess.value = true
	// })

	// Mock: 直接显示预约成功
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

/* ==================== 一、门店主页 ==================== */

/* 门店大图 */
.store-banner {
	width: 100%;
	height: 400rpx;
	overflow: hidden;
}

.banner-img {
	width: 100%;
	height: 100%;
}

/* 门店信息卡片 */
.store-info-card {
	background: #fff;
	margin: 0 24rpx;
	margin-top: -40rpx;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
	position: relative;
	z-index: 1;
}

.store-top-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.store-name {
	font-size: 34rpx;
	font-weight: 700;
	color: #222;
}

.switch-btn {
	display: flex;
	align-items: center;
	padding: 8rpx 20rpx;
	background: #f5f5f5;
	border-radius: 999rpx;

	&:active {
		background: #eee;
	}
}

.switch-text {
	font-size: 24rpx;
	color: #666;
}

.switch-arrow {
	font-size: 28rpx;
	color: #666;
	margin-left: 4rpx;
}

.store-addr-row {
	margin-bottom: 8rpx;
}

.store-addr {
	font-size: 26rpx;
	color: #666;
}

.store-dist-row {
	margin-bottom: 12rpx;
}

.store-dist {
	font-size: 24rpx;
	color: #999;
}

.store-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	padding-top: 12rpx;
	border-top: 1rpx solid #f0f0f0;
}

.tag {
	background: $primary-bg;
	border-radius: 8rpx;
	padding: 4rpx 16rpx;
}

.tag-text {
	font-size: 22rpx;
	color: $primary-dark;
}

/* 快捷入口 */
.quick-entry {
	background: #fff;
	margin: 20rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 16rpx;
	display: flex;
	justify-content: space-around;
}

.entry-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.entry-icon-box {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	background: $primary-bg;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10rpx;
}

.entry-icon-img {
	width: 48rpx;
	height: 48rpx;
}

.entry-icon-text {
	font-size: 36rpx;
}

.entry-label {
	font-size: 22rpx;
	color: #333;
}

/* 设备列表 */
.device-section {
	margin: 20rpx 24rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 16rpx;
}

.device-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.device-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;

	&:active {
		background: #fafafa;
	}
}

.device-card-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.device-card-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #222;
}

.device-card-status {
	font-size: 22rpx;
	padding: 4rpx 18rpx;
	border-radius: 20rpx;
}

.st-green {
	background: $primary-light;
	color: $primary-dark;
}

.st-gray {
	background: #f0f0f0;
	color: #999;
}

.device-card-addr {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.device-card-bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.device-price {
	display: flex;
	align-items: baseline;
}

.price-label {
	font-size: 24rpx;
	color: #666;
	margin-right: 8rpx;
}

.price-num {
	font-size: 32rpx;
	font-weight: 700;
	color: #222;
}

.price-unit {
	font-size: 22rpx;
	color: #666;
	margin-left: 4rpx;
}

.device-btn {
	background: $primary;
	padding: 12rpx 36rpx;
	border-radius: 999rpx;

	&:active {
		opacity: 0.85;
	}
}

.device-btn-text {
	font-size: 26rpx;
	font-weight: 600;
	color: #fff;
}

/* ==================== 二、预约到店弹窗（2/3页面） ==================== */
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

/* 日期选择 */
.date-scroll-wrap {
	background: #fff;
	padding: 0 32rpx 20rpx;
	white-space: nowrap;
}

.date-list {
	display: inline-flex;
	gap: 12rpx;
}

.date-item {
	width: 110rpx;
	padding: 16rpx 0;
	text-align: center;
	border-radius: 12rpx;
	border: 2rpx solid #e8e8e8;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;

	&.active {
		border-color: $primary;
		background: $primary-bg;

		.date-week { color: $primary-dark; }
		.date-day { color: $primary-dark; }
	}
}

.date-week {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 4rpx;
}

.date-day {
	font-size: 30rpx;
	font-weight: 700;
	color: #222;
	margin-bottom: 2rpx;
}

.date-month {
	font-size: 20rpx;
	color: #999;
}

/* 时段选择 */
.time-section {
	background: #fff;
	margin: 12rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 24rpx;
}

.time-section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 16rpx;
}

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

/* 底部支付栏 */
.popup-bottom {
	margin-top: auto;
	background: #fff;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	border-top: 1rpx solid #f0f0f0;
}

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

.pi-label {
	font-size: 26rpx;
	color: #666;
	margin-right: 8rpx;
}

.pi-value {
	font-size: 26rpx;
	color: #333;
	font-weight: 600;
}

.pay-method-row {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.radio-circle {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	border: 2rpx solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12rpx;

	&.active {
		border-color: $primary;
	}
}

.radio-inner {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	background: $primary;
}

.pay-method-name {
	font-size: 28rpx;
	color: #333;
}

.coupon-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 0;
	border-top: 1rpx solid #f0f0f0;
	margin-bottom: 16rpx;
}

.coupon-row-label {
	font-size: 26rpx;
	color: #333;
}

.coupon-row-right {
	display: flex;
	align-items: center;
}

.coupon-row-text {
	font-size: 26rpx;
	color: #ff4d4f;
	margin-right: 8rpx;
}

.coupon-row-arrow {
	font-size: 32rpx;
	color: #ccc;
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

/* ==================== 三、预约成功叠加弹窗 ==================== */
.success-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
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
