<!-- pages/index/index.vue -->
<!-- 门店主页（对齐原型图：门店主页.png） -->
<!-- 预约到店弹窗（对齐原型图：预约.png）弹出2/3页面 -->
<!-- 确认预约（对齐原型图：确认预约.png）预约成功叠加弹窗 -->
<template>
		<view class="page-store">
		<!-- ========== 一、门店主页 ========== -->
		<!-- 导航栏（绿色背景） -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="nav-placeholder"></view>
				<text class="nav-title">物沃PET</text>
				<view class="nav-service">
					<text class="service-icon">💬</text>
				</view>
			</view>
		</view>

		<!-- 门店大图（轮播图） -->
		<view class="store-banner">
			<swiper class="banner-swiper" :autoplay="true" :interval="4000" :circular="true" indicator-dots indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image class="banner-img" :src="item.image" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 门店信息卡片 -->
		<view class="store-info-card">
			<view class="store-name-row">
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

				<!-- 预约时间 -->
				<view class="timeline-section">
					<text class="timeline-title">预约时间</text>
					<!-- 日期选择（普通横向滚动） -->
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
					<!-- 时段选择（时间轴形式） -->
					<view class="time-timeline">
						<view class="time-tl-track">
							<view
								:class="['time-tl-item', { active: selectedTime === item, disabled: item.disabled }]"
								v-for="(item, idx) in timeSlots"
								:key="idx"
								@click="!item.disabled && (selectedTime = item)"
							>
								<view class="time-tl-dot-wrap">
									<view :class="['time-tl-dot', { active: selectedTime === item, disabled: item.disabled }]"></view>
									<view class="time-tl-line" v-if="idx < timeSlots.length - 1"></view>
								</view>
								<text :class="['time-tl-text', { active: selectedTime === item, disabled: item.disabled }]">{{ item.label }}</text>
							</view>
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

				<!-- 下一步按钮 -->
				<view class="next-step-wrap" v-if="!showPaySection">
					<view class="next-step-btn" @click="goNextStep">
						<text class="next-step-text">下一步</text>
					</view>
				</view>

				<!-- 备注 -->
				<view class="remark-wrap" v-if="showPaySection">
					<input class="remark-input" v-model="remark" placeholder="请输入备注内容" maxlength="200" />
				</view>

				<!-- 底部支付栏 -->
				<view class="popup-bottom" v-if="showPaySection">
					<!-- 账户余额 -->
					<view class="pay-info-row">
						<view class="pay-info-item" @click="goWallet">
							<text class="pi-label">账户余额</text>
							<text class="pi-value">￥{{ balance }}</text>
						</view>
					</view>

					<!-- 我的卡券（可点击选择优惠券） -->
					<view class="coupon-section">
						<view class="coupon-title">我的卡券</view>
						<view class="coupon-card" @click="pickCoupon">
							<view class="coupon-left">
								<text class="coupon-label">选取优惠券</text>
							</view>
							<view class="coupon-right">
								<text class="coupon-amount" v-if="selectedCoupon">-￥{{ selectedCoupon.amount }}</text>
								<text class="coupon-amount placeholder" v-else>选择优惠券</text>
								<text class="coupon-arrow">›</text>
							</view>
						</view>
					</view>

					<!-- 微信支付 -->
					<view class="pay-method-section">
						<view class="pay-method-row">
							<view class="radio-circle active">
								<view class="radio-inner"></view>
							</view>
							<text class="pay-method-name">微信支付</text>
						</view>
					</view>

					<!-- 确认下单 -->
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

		<!-- ========== 团购核销弹窗 ========== -->
		<view class="redeem-mask" v-if="showRedeemPopup" @click="closeRedeemPopup">
			<view class="redeem-popup" @click.stop>
				<!-- 第一层：平台选择 -->
				<view v-if="!selectedPlatform">
					<view class="redeem-header">
						<text class="redeem-title">选择核销平台</text>
						<view class="redeem-close" @click="closeRedeemPopup">
							<text>✕</text>
						</view>
					</view>
					<view class="platform-grid">
						<view class="platform-item" v-for="(p, idx) in platforms" :key="idx" @click="selectPlatform(p)">
							<image class="platform-icon" :src="p.icon" mode="aspectFit" />
							<text class="platform-label">{{ p.label }}</text>
						</view>
					</view>
				</view>

				<!-- 第二层：输入核销码 -->
				<view v-else-if="!showRedeemSuccess">
					<view class="redeem-header">
						<text class="redeem-title">输入核销码</text>
						<view class="redeem-back" @click="selectedPlatform = null">
							<text class="back-arrow">‹</text>
						</view>
					</view>
					<view class="redeem-input-wrap">
						<input class="redeem-input" v-model="redeemCode" placeholder="请输入核销码" maxlength="20" />
					</view>
					<view class="redeem-confirm-btn" @click="onConfirmRedeem">
						<text class="redeem-confirm-text">确认核销</text>
					</view>
				</view>

				<!-- 第三层：核销成功 -->
				<view v-else class="redeem-success-content">
					<view class="redeem-success-icon">✓</view>
					<text class="redeem-success-title">核销成功</text>
					<view class="redeem-card">
						<text class="rc-name">{{ redeemSuccessInfo.name }}</text>
						<view class="rc-item">
							<text class="rc-label">适用于:</text>
							<text class="rc-value">{{ redeemSuccessInfo.scope }}</text>
						</view>
						<view class="rc-item">
							<text class="rc-label">金额:</text>
							<text class="rc-value">{{ redeemSuccessInfo.amount }}元</text>
						</view>
						<view class="rc-item">
							<text class="rc-label">/单次可用:</text>
							<text class="rc-value">{{ redeemSuccessInfo.singleUse }}次</text>
						</view>
						<view class="rc-item">
							<text class="rc-label">有效时间:</text>
							<text class="rc-value">{{ redeemSuccessInfo.validDays }}天</text>
						</view>
					</view>
					<view class="redeem-continue-btn" @click="onContinueOrder">
						<text class="redeem-continue-text">继续下单</text>
					</view>
				</view>
			</view>
		</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStoreDetail, getDeviceList } from '@/api/store.js'
import { createBookOrder } from '@/api/order.js'
import { getWalletInfo, getAvailableCoupons } from '@/api/pay.js'

// ==================== 状态栏 ====================
const statusBarHeight = ref(0)

// ==================== 门店信息 ====================
/** @type {Object} 门店信息 - 接口: GET /api/store/detail */
const store = ref({
	id: 1,
	name: '物沃宠物洗护中心（南山店）',
	address: '深圳市南山区科技园南区深南大道9966号',
	distance: '3.6KM',
	tags: ['有车位', '有技师', 'WIFI覆盖']
})

/** @type {Array} 轮播图 - 接口: GET /api/store/banners */
const bannerList = ref([
	{ id: 1, image: '/static/bg/bg1.jpg' },
	{ id: 2, image: '/static/bg/bg2.jpg' },
	{ id: 3, image: '/static/bg/bg1.jpg' }
])

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
const selectedService = ref(null)
const showPaySection = ref(false)
const remark = ref('')
const balance = ref(5.6)
const couponCount = ref(3)
const selectedCoupon = ref(null)
const showCouponPicker = ref(false)

// ==================== 团购核销弹窗 ====================
const showRedeemPopup = ref(false)
const selectedPlatform = ref(null)
const redeemCode = ref('')
const showRedeemSuccess = ref(false)

const platforms = [
	{ label: '抖音', icon: '/static/icon/douyin.png', value: 'douyin' },
	{ label: '美团', icon: '/static/icon/meituan.png', value: 'meituan' },
	{ label: '系统', icon: '/static/icon/xitong.png', value: 'system' }
]

// 核销成功信息
const redeemSuccessInfo = ref({
	name: '美团·次卡',
	scope: '洗宠机',
	amount: 20,
	singleUse: 3,
	validDays: 60
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
	{ label: '08:00-10:00', disabled: false },
	{ label: '10:00-12:00', disabled: false },
	{ label: '12:00-14:00', disabled: false },
	{ label: '14:00-16:00', disabled: false },
	{ label: '16:00-18:00', disabled: false },
	{ label: '18:00-20:00', disabled: true }
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
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
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
			openRedeemPopup()
			break
		case 'orders':
			uni.navigateTo({ url: '/pages/wash-order-list/wash-order-list' })
			break
		case 'recharge':
			uni.navigateTo({ url: '/pages/wallet/wallet' })
			break
		case 'share':
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
	selectedService.value = null
	showPaySection.value = false
	remark.value = ''
	showBookPopup.value = true
}

/** 点击下一步 */
const goNextStep = () => {
	if (selectedService.value === null) {
		uni.showToast({ title: '请选择服务项目', icon: 'none' })
		return
	}
	showPaySection.value = true
}

/** 关闭预约弹窗 */
const closeBookPopup = () => {
	showBookPopup.value = false
	showPaySection.value = false
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
	showSuccess.value = true
}

const onSuccessClick = () => {
	// 不做任何操作
}

const goHome = () => {
	showSuccess.value = false
	showBookPopup.value = false
	showPaySection.value = false
}

// ==================== 团购核销弹窗交互 ====================

/** 打开团购核销弹窗 */
const openRedeemPopup = () => {
	selectedPlatform.value = null
	redeemCode.value = ''
	showRedeemSuccess.value = false
	showRedeemPopup.value = true
}

/** 关闭团购核销弹窗 */
const closeRedeemPopup = () => {
	showRedeemPopup.value = false
	selectedPlatform.value = null
	redeemCode.value = ''
	showRedeemSuccess.value = false
}

/** 选择平台 */
const selectPlatform = (p) => {
	selectedPlatform.value = p.value
}

/** 确认核销 */
const onConfirmRedeem = () => {
	if (!redeemCode.value.trim()) {
		uni.showToast({ title: '请输入核销码', icon: 'none' })
		return
	}
	// TODO: 调用核销接口
	// Mock: 直接显示核销成功，同时打开预约弹窗作为背景
	showRedeemSuccess.value = true
	openBookPopup()
}

/** 继续下单 */
const onContinueOrder = () => {
	showRedeemPopup.value = false
	showRedeemSuccess.value = false
	selectedPlatform.value = null
	redeemCode.value = ''
}
</script>

<style lang="scss">
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

/* ==================== 导航栏 ==================== */
.nav-bar {
	background: $primary;
	padding: 0 32rpx 20rpx;
}

.nav-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
}

.nav-placeholder {
	width: 60rpx;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.nav-service {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}

.service-icon {
	font-size: 32rpx;
}

/* ==================== 门店大图（轮播图） ==================== */
.store-banner {
	width: 100%;
	height: 360rpx;
	overflow: hidden;
}

.banner-swiper {
	width: 100%;
	height: 100%;
}

.banner-img {
	width: 100%;
	height: 100%;
}

/* ==================== 门店信息卡片 ==================== */
.store-info-card {
	background: #fff;
	margin: 20rpx 24rpx 0;
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
}

.store-name-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.store-name {
	font-size: 32rpx;
	font-weight: 700;
	color: #222;
}

.switch-btn {
	display: flex;
	align-items: center;
	padding: 8rpx 20rpx;
	background: $primary-bg;
	border-radius: 999rpx;

	&:active {
		background: #e8f0d6;
	}
}

.switch-text {
	font-size: 24rpx;
	color: $primary-dark;
}

.switch-arrow {
	font-size: 28rpx;
	color: $primary-dark;
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

/* ==================== 快捷入口 ==================== */
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

/* ==================== 设备列表 ==================== */
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
	font-size: 24rpx;
	color: #666;
}

.price-label {
	margin-right: 8rpx;
}

.price-num {
	font-size: 28rpx;
	font-weight: 600;
	color: $primary-dark;
}

.price-unit {
	margin-left: 4rpx;
}

.device-btn {
	background: $primary;
	padding: 12rpx 32rpx;
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

/* ==================== 预约弹窗（2/3页面） ==================== */
.book-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
	display: flex;
	align-items: flex-end;
}

.book-popup {
	width: 100%;
	max-height: 85vh;
	background-color: #fff;
	border-radius: 32rpx 32rpx 0 0;
	overflow-y: auto;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx 32rpx 20rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.popup-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #222;
}

.popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-close-text {
	font-size: 32rpx;
	color: #999;
}

/* 预约时间 */
.timeline-section {
	padding: 24rpx 24rpx 0;
}

.timeline-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	display: block;
	margin-bottom: 16rpx;
}

.date-scroll-wrap {
	white-space: nowrap;
}

.date-list {
	display: flex;
	gap: 12rpx;
	padding-bottom: 16rpx;
}

.date-item {
	min-width: 100rpx;
	padding: 16rpx 12rpx;
	border-radius: 16rpx;
	background: #fafafa;
	text-align: center;
	border: 2rpx solid transparent;

	&.active {
		background: $primary-bg;
		border-color: $primary;
	}
}

.date-week {
	font-size: 22rpx;
	color: #999;
	display: block;
	margin-bottom: 6rpx;
}

.active .date-week {
	color: $primary-dark;
}

.date-day {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
	display: block;
	margin-bottom: 4rpx;
}

.active .date-day {
	color: $primary-dark;
}

.date-month {
	font-size: 20rpx;
	color: #999;
	display: block;
}

.active .date-month {
	color: $primary-dark;
}

.time-timeline {
	padding: 20rpx 0 10rpx;
}

.time-tl-track {
	display: flex;
	align-items: flex-start;
}

.time-tl-item {
	flex: 1;
	position: relative;

	&.disabled {
		opacity: 0.4;
	}
}

.time-tl-dot-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 48rpx;
	margin-bottom: 8rpx;
}

.time-tl-dot {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	background: #e0e0e0;
	border: 4rpx solid #fff;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

	&.active {
		background: $primary;
	}

	&.disabled {
		background: #e0e0e0;
	}
}

.time-tl-line {
	flex: 1;
	height: 4rpx;
	background: #e0e0e0;
	margin-left: -4rpx;

	.time-tl-item.active + .time-tl-item &,
	.time-tl-item.active & {
		background: $primary;
	}
}

.time-tl-text {
	font-size: 22rpx;
	color: #666;
	text-align: center;
	display: block;

	&.active {
		color: $primary-dark;
		font-weight: 600;
	}

	&.disabled {
		color: #ccc;
	}
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
	font-size: 28rpx;
	color: #333;
	height: 48rpx;
}

/* 下一步按钮 */
.next-step-wrap {
	margin: 20rpx 24rpx 0;
}

.next-step-btn {
	background: $primary;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;

	&:active {
		opacity: 0.85;
	}
}

.next-step-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}

/* 底部支付栏 */
.popup-bottom {
	margin: 12rpx 24rpx 0;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
}

.pay-info-row {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.pay-info-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx;
	background: $primary-bg;
	border-radius: 16rpx;
}

.pi-label {
	font-size: 22rpx;
	color: #666;
	margin-bottom: 6rpx;
}

.pi-value {
	font-size: 28rpx;
	font-weight: 700;
	color: $primary-dark;
}

/* 我的卡券 */
.coupon-section {
	margin-bottom: 20rpx;
}

.coupon-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 12rpx;
}

.coupon-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 24rpx;
	background: #fff;
	border: 2rpx solid #e8e8e8;
	border-radius: 16rpx;

	&:active {
		background: #fafafa;
	}
}

.coupon-left {
	display: flex;
	align-items: center;
}

.coupon-label {
	font-size: 28rpx;
	color: #333;
}

.coupon-right {
	display: flex;
	align-items: center;
}

.coupon-amount {
	font-size: 28rpx;
	font-weight: 700;
	color: #ff4d4f;
	margin-right: 12rpx;

	&.placeholder {
		color: #999;
		font-weight: 400;
	}
}

.coupon-arrow {
	font-size: 28rpx;
	color: #ccc;
}

.coupon-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 24rpx;
	background: #fff;
	border: 2rpx solid #e8e8e8;
	border-radius: 16rpx;

	&:active {
		background: #fafafa;
	}
}

.coupon-left {
	display: flex;
	align-items: center;
}

.coupon-label {
	font-size: 28rpx;
	color: #333;
}

.coupon-right {
	display: flex;
	align-items: center;
}

.coupon-amount {
	font-size: 28rpx;
	font-weight: 700;
	color: #ff4d4f;
	margin-right: 12rpx;

	&.placeholder {
		color: #ccc;
		font-weight: 400;
	}
}

.coupon-arrow {
	font-size: 28rpx;
	color: #ccc;
}

/* 微信支付 */
.pay-method-section {
	margin-bottom: 20rpx;
}

.pay-method-row {
	display: flex;
	align-items: center;
	padding: 16rpx 0;
}

.radio-circle {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	border: 3rpx solid #e0e0e0;
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
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.submit-btn {
	background: $primary;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;

	&:active {
		opacity: 0.85;
	}
}

.submit-btn-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}

/* ==================== 预约成功叠加弹窗 ==================== */
.success-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 200;
	display: flex;
	align-items: center;
	justify-content: center;
}

.success-popup {
	width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 48rpx 32rpx;
	text-align: center;
}

.success-icon-wrap {
	width: 160rpx;
	height: 160rpx;
	margin: 0 auto 32rpx;
}

.success-icon-img {
	width: 100%;
	height: 100%;
}

.success-title {
	font-size: 40rpx;
	font-weight: 700;
	color: #222;
	display: block;
	margin-bottom: 12rpx;
}

.success-desc {
	font-size: 26rpx;
	color: #999;
	display: block;
	margin-bottom: 40rpx;
}

.success-btn {
	background: $primary;
	padding: 24rpx 0;
	border-radius: 999rpx;

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
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 150;
	display: flex;
	align-items: center;
	justify-content: center;
}

.coupon-popup {
	width: 650rpx;
	max-height: 70vh;
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
}

.coupon-popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.coupon-popup-title {
	font-size: 32rpx;
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
	max-height: 500rpx;
}

.cp-item {
	display: flex;
	align-items: center;
	padding: 24rpx 32rpx;
	border-bottom: 1rpx solid #f5f5f5;

	&.active {
		background: $primary-bg;
	}

	&.disabled {
		opacity: 0.4;
	}
}

.cp-left {
	width: 120rpx;
	padding-right: 20rpx;
	border-right: 1rpx solid #f0f0f0;
	text-align: center;
}

.cp-sym {
	font-size: 24rpx;
	color: #ff4d4f;
}

.cp-num {
	font-size: 40rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.cp-right {
	flex: 1;
	padding-left: 20rpx;
}

.cp-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 6rpx;
}

.cp-scope {
	font-size: 22rpx;
	color: #999;
	display: block;
	margin-bottom: 4rpx;
}

.cp-expire {
	font-size: 20rpx;
	color: #ccc;
	display: block;
}

.cp-check {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background: $primary;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
}

.cp-no-use {
	padding: 20rpx 32rpx;
	text-align: center;

	&.active {
		background: $primary-bg;
	}
}

.cp-no-use-text {
	font-size: 28rpx;
	color: #666;
}

/* ==================== 团购核销弹窗 ==================== */
.redeem-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 150;
	display: flex;
	align-items: center;
	justify-content: center;
}

.redeem-popup {
	width: 650rpx;
	background: #fff;
	border-radius: 32rpx;
	overflow: hidden;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

/* 平台选择 */
.redeem-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.redeem-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #222;
}

.redeem-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #999;

	&:active {
		background: #eee;
	}
}

.redeem-back {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		background: #eee;
	}
}

.back-arrow {
	font-size: 44rpx;
	color: #666;
	font-weight: 300;
}

.platform-grid {
	display: flex;
	justify-content: space-around;
	padding: 48rpx 32rpx;
}

.platform-item {
	display: flex;
	flex-direction: column;
	align-items: center;

	&:active {
		opacity: 0.7;
	}
}

.platform-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 24rpx;
	background: #f5f5f5;
	margin-bottom: 16rpx;
}

.platform-label {
	font-size: 28rpx;
	color: #333;
}

/* 核销码输入 */
.redeem-input-wrap {
	padding: 48rpx 32rpx;
}

.redeem-input {
	width: 100%;
	height: 100rpx;
	background: #f5f5f5;
	border-radius: 20rpx;
	padding: 0 32rpx;
	font-size: 32rpx;
	color: #333;
}

.redeem-confirm-btn {
	margin: 0 32rpx 32rpx;
	background: $primary;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;

	&:active {
		opacity: 0.85;
	}
}

.redeem-confirm-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}

/* 核销成功 */
.redeem-success-content {
	padding: 48rpx 32rpx;
	text-align: center;
}

.redeem-success-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: $primary;
	color: #fff;
	font-size: 80rpx;
	font-weight: 300;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 24rpx;
}

.redeem-success-title {
	font-size: 40rpx;
	font-weight: 700;
	color: #222;
	display: block;
	margin-bottom: 40rpx;
}

.redeem-card {
	background: $primary-bg;
	border-radius: 20rpx;
	padding: 32rpx;
	margin-bottom: 40rpx;
}

.rc-name {
	font-size: 32rpx;
	font-weight: 700;
	color: $primary-dark;
	display: block;
	margin-bottom: 20rpx;
}

.rc-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.rc-label {
	font-size: 26rpx;
	color: #666;
}

.rc-value {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
}

.redeem-continue-btn {
	background: $primary;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;

	&:active {
		opacity: 0.85;
	}
}

.redeem-continue-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}
</style>
