<!-- pages/index/index.vue -->
<!-- 门店首页（原型图-默认主页7） -->
<template>
	<view class="page-home">
		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">物沃PET</view>
		</view>

		<!-- 门店信息区域 -->
		<view class="store-info-card">
			<view class="store-top">
				<view class="store-name">{{ store.name }}</view>
				<view class="store-switch" @click="goStoreList">
					<text class="switch-text">切换门店</text>
					<text class="switch-arrow">›</text>
				</view>
			</view>
			<view class="store-tags">
				<view class="store-tag" v-for="(tag, idx) in store.tags" :key="idx">
					<text class="tag-icon">{{ tag.icon }}</text>
					<text class="tag-text">{{ tag.text }}</text>
				</view>
			</view>
			<view class="store-address">
				<text class="address-text">距我 {{ store.distance }} | {{ store.address }}</text>
			</view>
		</view>

		<!-- 轮播图 -->
		<view class="swiper-section">
			<swiper class="banner-swiper" :autoplay="true" :interval="4000" :circular="true"
				:indicator-dots="true" indicator-color="rgba(255,255,255,0.5)"
				indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<view class="swiper-item">
						<image class="swiper-image" :src="item.image" mode="aspectFill" />
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entry">
			<view class="entry-grid">
				<view class="entry-item" @click="openBookPopup">
					<view class="entry-icon-wrap">
						<image class="entry-icon-img" src="/static/icon/qiandao.png" mode="aspectFit" />
					</view>
					<text class="entry-text">预约到店</text>
				</view>
				<view class="entry-item" @click="onEntryClick('redeem')">
					<view class="entry-icon-wrap">
						<image class="entry-icon-img" src="/static/icon/saomahexiao.png" mode="aspectFit" />
					</view>
					<text class="entry-text">团购核销</text>
				</view>
				<view class="entry-item" @click="onEntryClick('/pages/wash-order-list/wash-order-list')">
					<view class="entry-icon-wrap">
						<image class="entry-icon-img" src="/static/icon/qianbao.png" mode="aspectFit" />
					</view>
					<text class="entry-text">我的订单</text>
				</view>
				<view class="entry-item" @click="onEntryClick('/pages/wallet/wallet')">
					<view class="entry-icon-wrap">
						<image class="entry-icon-img" src="/static/icon/youhuichognzhi.png" mode="aspectFit" />
					</view>
					<text class="entry-text">优惠充值</text>
				</view>
				<view class="entry-item" @click="onEntryClick('share')">
					<view class="entry-icon-wrap">
						<image class="entry-icon-img" src="/static/icon/fenxiang.png" mode="aspectFit" />
					</view>
					<text class="entry-text">分享有礼</text>
				</view>
			</view>
		</view>

		<!-- 设备列表 -->
		<view class="device-section">
			<view class="section-header">
				<text class="section-title">可用设备</text>
			</view>
			<view class="device-list">
				<view class="device-card" v-for="(item, index) in deviceList" :key="index" @click="goDeviceDetail(item)">
					<view class="device-card-top">
						<view class="device-card-name">{{ item.name }}</view>
						<view :class="['device-status', item.status === 1 ? 'status-green' : 'status-gray']">
							{{ item.statusText }}
						</view>
					</view>
					<view class="device-card-addr">
						<text class="addr-text">{{ item.address }}</text>
					</view>
					<view class="device-card-price">
						<text class="price-label">每分钟</text>
						<text class="price-value">{{ item.priceRange }}</text>
						<text class="price-unit">元</text>
					</view>
					<view class="device-card-actions">
						<view class="device-card-btn btn-recharge" @click.stop="goRecharge(item)">
							<text class="btn-text">预充值</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- ========== 预约服务弹窗（从底部弹出） ========== -->
		<view class="book-overlay" v-if="showBookPopup" @click="closeBookPopup">
			<view class="book-popup" @click.stop>
				<!-- 弹窗头部 -->
				<view class="book-popup-header">
					<text class="book-popup-title">预约服务</text>
					<text class="book-popup-close" @click="closeBookPopup">✕</text>
				</view>

				<!-- 步骤1：选择日期时间 -->
				<view class="popup-section" v-if="bookStep === 1">
					<text class="popup-section-title">预约时间</text>
					<!-- 日期选择 -->
					<scroll-view scroll-x class="date-scroll">
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
					<view class="time-grid">
						<view
							:class="['time-item', { active: selectedTime === item }]"
							v-for="(item, idx) in timeSlots"
							:key="idx"
							@click="selectedTime = item"
						>
							<text>{{ item.label }}</text>
						</view>
					</view>
					<!-- 备注 -->
					<input class="remark-input" v-model="remark" placeholder="请输入备注内容" maxlength="200" />
					<!-- 下一步 -->
					<view class="popup-btn" :class="{ disabled: !selectedTime }" @click="bookStep = 2">
						<text class="popup-btn-text">下一步</text>
					</view>
				</view>

				<!-- 步骤2：选择服务项目（2x2） -->
				<view class="popup-section" v-if="bookStep === 2">
					<text class="popup-section-title">选择服务项目</text>
					<view class="service-grid">
						<view
							:class="['service-card', { active: selectedService === index }]"
							v-for="(item, index) in serviceList"
							:key="index"
							@click="selectedService = index"
						>
							<text class="service-name">{{ item.name }}</text>
							<text class="service-price">￥{{ item.price.toFixed(2) }}</text>
							<text class="service-desc">{{ item.desc }}</text>
						</view>
					</view>
					<view class="popup-btn-row">
						<view class="popup-btn-back" @click="bookStep = 1">
							<text class="popup-btn-text">上一步</text>
						</view>
						<view class="popup-btn" :class="{ disabled: selectedService === null }" @click="bookStep = 3">
							<text class="popup-btn-text">确认</text>
						</view>
					</view>
				</view>

				<!-- 步骤3：选择支付方式 -->
				<view class="popup-section" v-if="bookStep === 3">
					<text class="popup-section-title">选择支付方式</text>
					<view class="pay-method-list">
						<view
							class="pay-method-item"
							:class="{ active: selectedPayMethod === 'wechat' }"
							@click="selectedPayMethod = 'wechat'"
						>
							<text class="pm-icon">🟢</text>
							<text class="pm-name">微信支付</text>
							<view class="pm-radio"><view class="pm-radio-inner" v-if="selectedPayMethod === 'wechat'"></view></view>
						</view>
						<view
							class="pay-method-item"
							:class="{ active: selectedPayMethod === 'balance' }"
							@click="selectedPayMethod = 'balance'"
						>
							<text class="pm-icon">💰</text>
							<view class="pm-info">
								<text class="pm-name">账户余额</text>
								<text class="pm-desc">￥{{ balance }}</text>
							</view>
							<view class="pm-radio"><view class="pm-radio-inner" v-if="selectedPayMethod === 'balance'"></view></view>
						</view>
						<view
							class="pay-method-item"
							:class="{ active: selectedPayMethod === 'coupon' }"
							@click="showCouponPicker = true"
						>
							<text class="pm-icon">🎫</text>
							<view class="pm-info">
								<text class="pm-name">我的卡券</text>
								<text class="pm-desc">{{ selectedCoupon ? selectedCoupon.name + ' -￥' + selectedCoupon.amount : '可用' + couponCount + '张' }}</text>
							</view>
							<view class="pm-radio"><view class="pm-radio-inner" v-if="selectedPayMethod === 'coupon'"></view></view>
						</view>
					</view>
					<view class="popup-btn-row">
						<view class="popup-btn-back" @click="bookStep = 2">
							<text class="popup-btn-text">上一步</text>
						</view>
						<view class="popup-btn" @click="onPay">
							<text class="popup-btn-text">确认下单</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 预约成功弹窗（弹在预约页上） -->
		<view class="success-overlay" v-if="showBookSuccess" @click="showBookSuccess = false">
			<view class="success-popup" @click.stop>
				<view class="success-icon-wrap">
					<image class="success-icon-img" src="/static/icon/yuyuechenggong.png" mode="aspectFit" />
				</view>
				<text class="success-title">预约成功</text>
				<text class="success-desc">您的预约已提交成功，请按时到店</text>
				<view class="success-btn" @click="closeAll">
					<text class="success-btn-text">返回首页</text>
				</view>
			</view>
		</view>

		<!-- 团购核销弹窗 -->
		<view class="redeem-overlay" v-if="showRedeemPopup" @click="showRedeemPopup = false">
			<view class="redeem-popup" @click.stop>
				<view class="popup-header">
					<text class="popup-title">团购核销</text>
					<text class="popup-close" @click="showRedeemPopup = false">✕</text>
				</view>
				<view class="platform-grid" v-if="!selectedPlatform">
					<view class="platform-item" v-for="(item, index) in platforms" :key="index" @click="selectPlatform(item)">
						<image class="platform-icon" :src="item.icon" mode="aspectFit" />
						<text class="platform-name">{{ item.label }}</text>
					</view>
				</view>
				<view class="popup-body" v-if="selectedPlatform">
					<view class="platform-selected" @click="selectedPlatform = null">
						<image class="platform-selected-icon" :src="currentPlatformIcon" mode="aspectFit" />
						<text class="platform-selected-name">{{ currentPlatformLabel }}</text>
						<text class="platform-change">切换 ›</text>
					</view>
					<view class="popup-input-wrap">
						<input class="popup-input" v-model="redeemCode" placeholder="请输入核销码" maxlength="20" type="text" />
					</view>
					<view class="popup-btn" @click="onConfirmRedeem">确认核销</view>
					<view class="popup-tips">*核销使用后结余金额不可退款</view>
				</view>
			</view>
		</view>

		<!-- 卡券选择弹窗（选我的卡券时弹出） -->
		<view class="coupon-picker-overlay" v-if="showCouponPicker" @click="showCouponPicker = false">
			<view class="coupon-picker-popup" @click.stop>
				<view class="coupon-picker-header">
					<text class="coupon-picker-title">选择卡券</text>
					<text class="coupon-picker-close" @click="showCouponPicker = false">✕</text>
				</view>
				<scroll-view scroll-y class="coupon-picker-list">
					<view
						:class="['coupon-picker-item', { active: selectedCoupon && selectedCoupon.id === item.id, expired: item.expired }]"
						v-for="(item, index) in couponList"
						:key="index"
						@click="!item.expired && onSelectCoupon(item)"
					>
						<view class="cp-left">
							<text class="cp-symbol">￥</text>
							<text class="cp-amount">{{ item.amount }}</text>
						</view>
						<view class="cp-right">
							<text class="cp-name">{{ item.name }}</text>
							<text class="cp-scope">适用于:{{ item.scope }}</text>
							<text class="cp-times">剩余:{{ item.remainTimes }}次</text>
							<text class="cp-expire">{{ item.expired ? '已到期' : '有效期:' + item.expireText }}</text>
						</view>
						<view class="cp-check" v-if="selectedCoupon && selectedCoupon.id === item.id">✓</view>
					</view>
					<!-- 不使用卡券 -->
					<view
						class="coupon-picker-item no-coupon"
						:class="{ active: !selectedCoupon }"
						@click="onSelectCoupon(null)"
					>
						<view class="cp-right" style="flex:1;display:flex;align-items:center;justify-content:center;">
							<text class="cp-name">不使用卡券</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 核销成功弹窗（叠在预约弹窗上方） -->
		<view class="rs-overlay" v-if="showRedeemSuccess" @click="showRedeemSuccess = false">
			<view class="rs-popup" @click.stop>
				<!-- 成功图标 -->
				<view class="rs-icon-wrap">
					<image class="rs-icon-img" src="/static/icon/yuyuechenggong.png" mode="aspectFit" />
				</view>
				<text class="rs-title">核销成功</text>
				<!-- 卡券信息 -->
				<view class="rs-coupon-card">
					<view class="rs-coupon-header">
						<view class="rs-coupon-source">
							<image v-if="redeemResult.platformIcon" class="rs-platform-icon" :src="redeemResult.platformIcon" mode="aspectFit" />
							<text class="rs-source-text">{{ redeemResult.platformName }}·次卡</text>
						</view>
						<view class="rs-coupon-amount">
							<text class="rs-amount-symbol">￥</text>
							<text class="rs-amount-num">{{ redeemResult.amount }}</text>
						</view>
					</view>
					<view class="rs-coupon-detail">
						<text class="rs-detail-row">适用于:{{ redeemResult.scope }}</text>
						<text class="rs-detail-row">金额:{{ redeemResult.amount }}元/单次可用:{{ redeemResult.times }}次</text>
						<text class="rs-detail-row">有效时间:{{ redeemResult.validDays }}天</text>
					</view>
				</view>
				<!-- 扫码下单按钮 -->
				<view class="rs-btn" @click="onScanOrder">
					<text class="rs-btn-text">扫码下单</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStoreDetail, getDeviceList, getBannerList } from '@/api/store.js'
import { getWalletInfo, getAvailableCoupons } from '@/api/pay.js'
import { createBookOrder } from '@/api/order.js'

const statusBarHeight = ref(0)

// 门店信息
const store = ref({
	id: 1, name: '我是门店名称', address: '合肥市新海大道5号', distance: '1.45KM',
	tags: [{ icon: '🅿️', text: '有车位' }, { icon: '📸', text: '门店图' }, { icon: '✂️', text: '有技师' }, { icon: '📶', text: 'WIFI覆盖' }]
})

const bannerList = ref([
	{ id: 1, image: '/banner/banner1.jpg', link: '', title: '轮播图1' },
	{ id: 2, image: '/banner/banner2.jpg', link: '', title: '轮播图2' },
	{ id: 3, image: '/banner/banner3.jpg', link: '', title: '轮播图3' }
])

const deviceList = ref([
	{ id: 101, name: '智能洗宠机A1', address: '合肥市新站区新海大道5号...', status: 1, statusText: '可使用', priceRange: '0.8-1.2', storeId: 1 },
	{ id: 102, name: '智能洗宠机A2', address: '合肥市新站区新海大道5号...', status: 1, statusText: '可使用', priceRange: '0.8-1.2', storeId: 1 }
])

// ===== 预约服务弹窗 =====
const showBookPopup = ref(false)
const showBookSuccess = ref(false)
const bookStep = ref(1)
const selectedDate = ref(0)
const selectedTime = ref(null)
const selectedService = ref(null)
const selectedPayMethod = ref('wechat')
const remark = ref('')
const balance = ref(5.6)
const couponCount = ref(3)
const showCouponPicker = ref(false)
const selectedCoupon = ref(null)
const couponList = ref([
	{ id: 1, name: '美团·次卡', amount: 20, scope: '洗宠机', remainTimes: 3, expireText: '60天', expired: false, platform: '美团' },
	{ id: 2, name: '洗宠优惠券', amount: 10, scope: '洗澡美容', remainTimes: 1, expireText: '30天', expired: false, platform: '系统' },
	{ id: 3, name: '系统·余额卷', amount: 30, scope: '全部服务', remainTimes: 5, expireText: '90天', expired: false, platform: '系统' },
	{ id: 4, name: '过期次卡', amount: 15, scope: '洗宠机', remainTimes: 0, expireText: '已到期', expired: true, platform: '抖音' }
])

const serviceList = ref([
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' }
])

const dateList = ref([])
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const timeSlots = ref([
	{ label: '08:00' }, { label: '10:00' }, { label: '12:00' }, { label: '14:00' }, { label: '16:00' }
])

const initDateList = () => {
	const list = []
	for (let i = 0; i < 5; i++) {
		const d = new Date(); d.setDate(d.getDate() + i)
		list.push({ week: i === 0 ? '今天' : weekDays[d.getDay()], day: String(d.getDate()).padStart(2, '0'), month: (d.getMonth() + 1) + '月', dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` })
	}
	dateList.value = list
}
initDateList()

const onSelectCoupon = (item) => {
	selectedCoupon.value = item
	selectedPayMethod.value = item ? 'coupon' : 'wechat'
	showCouponPicker.value = false
}

const openBookPopup = () => {
	bookStep.value = 1
	selectedDate.value = 0
	selectedTime.value = null
	selectedService.value = null
	selectedPayMethod.value = 'wechat'
	remark.value = ''
	showBookPopup.value = true
}

const closeBookPopup = () => { showBookPopup.value = false }

const onPay = () => {
	// TODO: 调用支付接口
	// createBookOrder({ ... }).then(res => { ... })
	showBookPopup.value = false
	showBookSuccess.value = true
}

const closeAll = () => {
	showBookSuccess.value = false
	showBookPopup.value = false
	bookStep.value = 1
}

// ===== 团购核销 =====
const showRedeemPopup = ref(false)
const showRedeemSuccess = ref(false)
const redeemCode = ref('')
const selectedPlatform = ref(null)
const redeemResult = ref({
	platformName: '',
	platformIcon: '',
	amount: 20,
	scope: '洗宠机',
	times: 3,
	validDays: 60
})
const platforms = [
	{ label: '抖音', icon: '/static/icon/douyin.png', value: 'douyin' },
	{ label: '美团', icon: '/static/icon/meituan.png', value: 'meituan' },
	{ label: '系统', icon: '/static/icon/xitong.png', value: 'system' }
]
const currentPlatformIcon = ref('')
const currentPlatformLabel = ref('')

const selectPlatform = (item) => {
	selectedPlatform.value = item.value
	currentPlatformIcon.value = item.icon
	currentPlatformLabel.value = item.label
}

const onConfirmRedeem = () => {
	if (!redeemCode.value.trim()) { uni.showToast({ title: '请输入核销码', icon: 'none' }); return }
	// TODO: 调用核销接口
	// redeemCoupon({ platform: selectedPlatform, code: redeemCode }).then(res => { ... })
	const found = platforms.find(p => p.value === selectedPlatform.value)
	redeemResult.value = {
		platformName: found ? found.label : '系统',
		platformIcon: found ? found.icon : '',
		amount: 20,
		scope: '洗宠机',
		times: 3,
		validDays: 60
	}
	// 关闭核销弹窗，打开预约弹窗（背景）+ 核销成功弹窗
	showRedeemPopup.value = false
	bookStep.value = 1
	selectedDate.value = 0
	selectedTime.value = null
	selectedService.value = null
	selectedPayMethod.value = 'wechat'
	remark.value = ''
	showBookPopup.value = true
	showRedeemSuccess.value = true
	redeemCode.value = ''
	selectedPlatform.value = null
}

const onScanOrder = () => {
	// 关闭核销成功弹窗，留在预约弹窗继续操作
	showRedeemSuccess.value = false
}

// tabBar 页面
const tabBarPages = ['pages/index/index', 'pages/wash-order-list/wash-order-list', 'pages/scan/scan', 'pages/book-order-list/book-order-list', 'pages/mine/mine']

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
	loadData()
})

const loadData = async () => {
	// TODO: 替换为实际接口调用，去掉本地 mock 兜底
	try {
		const storeRes = await getStoreDetail(1)
		if (storeRes && storeRes.id) {
			store.value = {
				id: storeRes.id,
				name: storeRes.name,
				address: storeRes.address,
				distance: storeRes.distance,
				tags: (storeRes.tags || []).map(t => ({ icon: '✂️', text: t }))
			}
		}
	} catch (e) {}

	try {
		const bannerRes = await getBannerList()
		if (Array.isArray(bannerRes) && bannerRes.length > 0) {
			bannerList.value = bannerRes
		}
	} catch (e) {}

	try {
		const deviceRes = await getDeviceList({ storeId: 1 })
		if (Array.isArray(deviceRes) && deviceRes.length > 0) {
			deviceList.value = deviceRes.map(d => ({
				id: d.id,
				name: d.name,
				address: d.address,
				status: d.status,
				statusText: d.statusText,
				priceRange: d.priceRange || d.pricePerMinute + '-' + (d.pricePerMinute * 1.5).toFixed(1),
				storeId: d.storeId
			}))
		}
	} catch (e) {}

	try {
		const walletRes = await getWalletInfo()
		if (walletRes) balance.value = walletRes.balance || 0
	} catch (e) {}

	try {
		const couponRes = await getAvailableCoupons({ type: 'book' })
		if (Array.isArray(couponRes)) {
			couponCount.value = couponRes.length
			couponList.value = couponRes.map(c => ({
				id: c.id,
				name: c.name,
				amount: c.amount,
				scope: c.type === 'wash' ? '洗宠机' : '全部服务',
				remainTimes: 1,
				expireText: c.expireDate ? Math.ceil((new Date(c.expireDate) - new Date()) / 86400000) + '天' : '30天',
				expired: false
			}))
		}
	} catch (e) {}
}

const onEntryClick = (action) => {
	if (action === 'redeem') { showRedeemPopup.value = true; return }
	if (action === 'share') { uni.showToast({ title: '分享有礼功能开发中', icon: 'none' }); return }
	const pagePath = action.replace(/^\//, '')
	if (tabBarPages.includes(pagePath)) { uni.switchTab({ url: action }) }
	else { uni.navigateTo({ url: action }) }
}

const goDeviceDetail = (item) => { uni.navigateTo({ url: `/pages/device-detail/device-detail?deviceId=${item.id}` }) }
const goRecharge = (item) => { uni.navigateTo({ url: `/pages/wallet/wallet?deviceId=${item.id}` }) }
const goStoreList = () => { uni.navigateTo({ url: '/pages/store-list/store-list' }) }
</script>

<style lang="scss" scoped>
.page-home { min-height: 100vh; background-color: #f5f5f5; padding-bottom: 40rpx; }

.nav-bar { background: linear-gradient(135deg, #07C160, #38d976); padding: 20rpx 32rpx; .nav-content { font-size: 36rpx; font-weight: 600; color: #fff; text-align: center; padding: 20rpx 0; } }

.store-info-card { background-color: #fff; margin: 24rpx; border-radius: 24rpx; padding: 32rpx; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08); }
.store-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20rpx; }
.store-name { font-size: 36rpx; font-weight: 700; color: #333; }
.store-switch { display: flex; align-items: center; padding: 8rpx 20rpx; background-color: #f5f5f5; border-radius: 999rpx; &:active { background-color: #ebebeb; } }
.switch-text { font-size: 24rpx; color: #666; }
.switch-arrow { font-size: 28rpx; color: #666; margin-left: 4rpx; }
.store-tags { display: flex; flex-wrap: wrap; margin-bottom: 20rpx; }
.store-tag { display: flex; align-items: center; margin-right: 20rpx; margin-bottom: 12rpx; }
.tag-icon { font-size: 24rpx; margin-right: 6rpx; }
.tag-text { font-size: 24rpx; color: #666; }
.store-address { padding-top: 16rpx; border-top: 1rpx solid #f0f0f0; }
.address-text { font-size: 26rpx; color: #999; }

.swiper-section { margin: 0 24rpx 24rpx; border-radius: 24rpx; overflow: hidden; }
.banner-swiper { width: 100%; height: 300rpx; border-radius: 24rpx; }
.swiper-item { width: 100%; height: 100%; }
.swiper-image { width: 100%; height: 100%; border-radius: 24rpx; }

.quick-entry { background-color: #fff; margin: 0 24rpx 24rpx; border-radius: 24rpx; padding: 32rpx 16rpx; }
.entry-grid { display: flex; justify-content: space-around; }
.entry-item { display: flex; flex-direction: column; align-items: center; .entry-icon-wrap { width: 96rpx; height: 96rpx; border-radius: 24rpx; background-color: #e8f8ee; display: flex; align-items: center; justify-content: center; margin-bottom: 12rpx; } .entry-icon-img { width: 56rpx; height: 56rpx; } .entry-text { font-size: 24rpx; color: #333; } }

.device-section { margin: 0 24rpx 24rpx; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20rpx; }
.section-title { font-size: 32rpx; font-weight: 600; color: #333; }
.device-list { display: flex; flex-direction: column; }
.device-card { background-color: #fff; border-radius: 24rpx; padding: 32rpx; margin-bottom: 20rpx; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06); &:active { background-color: #fafafa; } }
.device-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12rpx; }
.device-card-name { font-size: 32rpx; font-weight: 600; color: #333; }
.device-status { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 999rpx; }
.status-green { background-color: #e8f8ee; color: #07C160; }
.status-gray { background-color: #f0f0f0; color: #999; }
.device-card-addr { margin-bottom: 16rpx; }
.addr-text { font-size: 24rpx; color: #999; }
.device-card-price { display: flex; align-items: baseline; margin-bottom: 20rpx; }
.price-label { font-size: 24rpx; color: #666; margin-right: 8rpx; }
.price-value { font-size: 32rpx; font-weight: 700; color: #333; }
.price-unit { font-size: 22rpx; color: #666; margin-left: 4rpx; }
.device-card-actions { display: flex; justify-content: flex-end; }
.device-card-btn { padding: 14rpx 40rpx; border-radius: 999rpx; }
.btn-recharge { background: linear-gradient(135deg, #07C160, #38d976); &:active { opacity: 0.9; } }
.btn-text { font-size: 26rpx; font-weight: 600; color: #fff; }

/* ===== 预约服务底部弹窗 ===== */
.book-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: flex-end; justify-content: center; }
.book-popup { width: 100%; max-height: 80vh; background-color: #fff; border-radius: 32rpx 32rpx 0 0; padding: 0 32rpx 40rpx; padding-bottom: calc(40rpx + env(safe-area-inset-bottom)); animation: slideUp 0.3s ease-out; display: flex; flex-direction: column; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.book-popup-header { display: flex; align-items: center; justify-content: space-between; padding: 32rpx 0 20rpx; }
.book-popup-title { font-size: 36rpx; font-weight: 700; color: #333; }
.book-popup-close { width: 56rpx; height: 56rpx; border-radius: 50%; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 32rpx; color: #999; }

.popup-section { flex: 1; overflow-y: auto; }
.popup-section-title { font-size: 28rpx; font-weight: 600; color: #333; margin-bottom: 20rpx; display: block; }

/* 日期 */
.date-scroll { white-space: nowrap; margin-bottom: 20rpx; }
.date-list { display: inline-flex; gap: 12rpx; }
.date-item { width: 120rpx; padding: 16rpx 0; text-align: center; border-radius: 12rpx; border: 2rpx solid #e0e0e0; display: flex; flex-direction: column; align-items: center; flex-shrink: 0; &.active { border-color: #07C160; background-color: #e8f8ee; } }
.date-week { font-size: 22rpx; color: #999; margin-bottom: 4rpx; }
.active .date-week { color: #07C160; }
.date-day { font-size: 30rpx; font-weight: 700; color: #333; margin-bottom: 2rpx; }
.date-month { font-size: 20rpx; color: #999; }

/* 时段 */
.time-grid { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 20rpx; }
.time-item { width: calc(33.33% - 8rpx); text-align: center; padding: 16rpx 0; border-radius: 12rpx; border: 2rpx solid #e0e0e0; font-size: 28rpx; color: #333; &.active { border-color: #07C160; background-color: #e8f8ee; color: #07C160; font-weight: 600; } }

/* 备注 */
.remark-input { width: 100%; font-size: 28rpx; color: #333; background-color: #f5f5f5; border-radius: 12rpx; padding: 16rpx 20rpx; box-sizing: border-box; margin-bottom: 24rpx; }

/* 服务项目 2x2 */
.service-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-bottom: 24rpx; }
.service-card { width: calc(50% - 8rpx); padding: 24rpx; border-radius: 16rpx; border: 2rpx solid #e0e0e0; &.active { border-color: #07C160; background-color: #e8f8ee; } }
.service-name { font-size: 28rpx; font-weight: 600; color: #333; display: block; margin-bottom: 4rpx; }
.service-price { font-size: 32rpx; font-weight: 700; color: #ff4d4f; display: block; margin-bottom: 4rpx; }
.service-desc { font-size: 22rpx; color: #999; display: block; }

/* 支付方式 */
.pay-method-list { margin-bottom: 24rpx; }
.pay-method-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #f5f5f5; &:last-child { border-bottom: none; } &.active { background-color: #f8fff9; } }
.pm-icon { width: 72rpx; height: 72rpx; border-radius: 16rpx; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 36rpx; margin-right: 20rpx; }
.pm-name { font-size: 28rpx; color: #333; }
.pm-desc { font-size: 22rpx; color: #999; }
.pm-info { flex: 1; display: flex; flex-direction: column; }
.pm-radio { width: 36rpx; height: 36rpx; border-radius: 50%; border: 2rpx solid #ddd; display: flex; align-items: center; justify-content: center; margin-left: auto; .active & { border-color: #07C160; } }
.pm-radio-inner { width: 20rpx; height: 20rpx; border-radius: 50%; background-color: #07C160; }

/* 按钮 */
.popup-btn { background: linear-gradient(135deg, #07C160, #38d976); border-radius: 999rpx; padding: 24rpx 0; text-align: center; &:active { opacity: 0.9; } &.disabled { opacity: 0.5; } }
.popup-btn-text { font-size: 32rpx; font-weight: 600; color: #fff; }
.popup-btn-row { display: flex; gap: 16rpx; }
.popup-btn-back { flex: 1; background-color: #f5f5f5; border-radius: 999rpx; padding: 24rpx 0; text-align: center; }
.popup-btn-row .popup-btn { flex: 2; }
.popup-btn-back .popup-btn-text { color: #666; font-weight: 500; }

/* ===== 预约成功弹窗 ===== */
.success-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 1001; display: flex; align-items: center; justify-content: center; }
.success-popup { width: 560rpx; background-color: #fff; border-radius: 32rpx; padding: 60rpx 40rpx 40rpx; display: flex; flex-direction: column; align-items: center; animation: popIn 0.3s ease-out; }
@keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.success-icon-wrap { margin-bottom: 20rpx; }
.success-icon-img { width: 160rpx; height: 160rpx; }
.success-title { font-size: 36rpx; font-weight: 700; color: #333; margin-bottom: 12rpx; }
.success-desc { font-size: 26rpx; color: #999; margin-bottom: 32rpx; }
.success-btn { width: 100%; background: linear-gradient(135deg, #07C160, #38d976); border-radius: 999rpx; padding: 24rpx 0; text-align: center; &:active { opacity: 0.9; } }
.success-btn-text { font-size: 30rpx; font-weight: 600; color: #fff; }

/* ===== 团购核销弹窗 ===== */
.redeem-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: flex-end; justify-content: center; }
.redeem-popup { width: 100%; background-color: #fff; border-radius: 32rpx 32rpx 0 0; padding: 40rpx 32rpx; padding-bottom: calc(40rpx + env(safe-area-inset-bottom)); animation: slideUp 0.3s ease-out; box-shadow: 0 -8rpx 40rpx rgba(0,0,0,0.15); }
.popup-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40rpx; }
.popup-title { font-size: 36rpx; font-weight: 700; color: #333; }
.popup-body { display: flex; flex-direction: column; }
.popup-input-wrap { background-color: #f5f5f5; border-radius: 16rpx; padding: 24rpx 32rpx; margin-bottom: 32rpx; }
.popup-input { font-size: 30rpx; color: #333; height: 48rpx; }
.popup-tips { text-align: center; font-size: 22rpx; color: #999; }
.platform-grid { display: flex; justify-content: space-around; padding: 24rpx 0 40rpx; }
.platform-item { display: flex; flex-direction: column; align-items: center; padding: 24rpx; border-radius: 20rpx; &:active { background-color: #f5f5f5; } }
.platform-icon { width: 96rpx; height: 96rpx; margin-bottom: 12rpx; }
.platform-name { font-size: 26rpx; color: #333; }
.platform-selected { display: flex; align-items: center; padding: 20rpx 24rpx; background-color: #f5f5f5; border-radius: 16rpx; margin-bottom: 24rpx; }
.platform-selected-icon { width: 48rpx; height: 48rpx; margin-right: 16rpx; }
.platform-selected-name { flex: 1; font-size: 30rpx; font-weight: 600; color: #333; }
.platform-change { font-size: 26rpx; color: #07C160; }

/* ===== 核销成功弹窗（叠在预约弹窗上） ===== */
.rs-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.rs-popup { width: 600rpx; background-color: #fff; border-radius: 32rpx; padding: 48rpx 36rpx 36rpx; display: flex; flex-direction: column; align-items: center; animation: popIn 0.3s ease-out; }
.rs-icon-wrap { margin-bottom: 16rpx; }
.rs-icon-img { width: 120rpx; height: 120rpx; }
.rs-title { font-size: 36rpx; font-weight: 700; color: #333; margin-bottom: 24rpx; }
.rs-coupon-card { width: 100%; border-radius: 16rpx; overflow: hidden; margin-bottom: 28rpx; }
.rs-coupon-header { display: flex; align-items: center; justify-content: space-between; padding: 20rpx 24rpx; background-color: #07C160; }
.rs-coupon-source { display: flex; align-items: center; }
.rs-platform-icon { width: 36rpx; height: 36rpx; margin-right: 10rpx; }
.rs-source-text { font-size: 26rpx; color: #fff; }
.rs-coupon-amount { display: flex; align-items: baseline; }
.rs-amount-symbol { font-size: 24rpx; color: #fff; }
.rs-amount-num { font-size: 40rpx; font-weight: 700; color: #fff; }
.rs-coupon-detail { padding: 20rpx 24rpx; background-color: #f8fff9; }
.rs-detail-row { display: block; font-size: 24rpx; color: #666; line-height: 1.8; }
.rs-btn { width: 100%; background: linear-gradient(135deg, #07C160, #38d976); border-radius: 999rpx; padding: 24rpx 0; text-align: center; &:active { opacity: 0.9; } }
.rs-btn-text { font-size: 30rpx; font-weight: 600; color: #fff; }

/* ===== 卡券选择弹窗 ===== */
.coupon-picker-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 1002; display: flex; align-items: flex-end; justify-content: center; }
.coupon-picker-popup { width: 100%; max-height: 70vh; background-color: #fff; border-radius: 32rpx 32rpx 0 0; padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); animation: slideUp 0.3s ease-out; display: flex; flex-direction: column; }
.coupon-picker-header { display: flex; align-items: center; justify-content: space-between; padding: 32rpx 32rpx 16rpx; }
.coupon-picker-title { font-size: 34rpx; font-weight: 700; color: #333; }
.coupon-picker-close { width: 56rpx; height: 56rpx; border-radius: 50%; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 32rpx; color: #999; }
.coupon-picker-list { flex: 1; padding: 0 24rpx; max-height: 60vh; }
.coupon-picker-item { display: flex; align-items: center; padding: 20rpx; margin-bottom: 16rpx; border-radius: 16rpx; border: 2rpx solid #e0e0e0; background-color: #fff; position: relative; &.active { border-color: #07C160; background-color: #f8fff9; } &.expired { opacity: 0.5; border-color: #eee; } }
.cp-left { display: flex; align-items: baseline; padding-right: 20rpx; margin-right: 16rpx; border-right: 2rpx dashed #e0e0e0; min-width: 120rpx; text-align: center; justify-content: center; }
.cp-symbol { font-size: 24rpx; color: #ff4d4f; font-weight: 600; }
.cp-amount { font-size: 44rpx; color: #ff4d4f; font-weight: 700; }
.cp-right { flex: 1; display: flex; flex-direction: column; }
.cp-name { font-size: 26rpx; font-weight: 600; color: #333; margin-bottom: 4rpx; }
.cp-scope, .cp-times, .cp-expire { font-size: 22rpx; color: #999; line-height: 1.6; }
.cp-check { width: 36rpx; height: 36rpx; border-radius: 50%; background-color: #07C160; color: #fff; font-size: 22rpx; display: flex; align-items: center; justify-content: center; margin-left: 16rpx; }
.no-coupon { justify-content: center; padding: 28rpx; border-style: dashed; }
</style>
