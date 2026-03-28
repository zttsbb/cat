<!-- pages/store-list/store-list.vue -->
<!-- 门店列表 -->
<template>
	<view class="page-store-list">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-header">
				<text class="search-title">切换门店</text>
			</view>
			<view class="search-input" @click="searchStore">
				<text class="search-icon">🔍</text>
				<text class="search-placeholder">搜索门店</text>
			</view>
		</view>

		<!-- 门店列表 -->
		<view class="section">
			<view class="section-title">附近门店</view>
			<store-card
				v-for="store in storeList"
				:key="store.id"
				:store="store"
				@click="goStoreDetail(store.id)"
			/>
		</view>

		<!-- 设备列表 -->
		<view class="section">
			<view class="section-title">可用设备</view>
			<wash-device-card
				v-for="device in deviceList"
				:key="device.id"
				:device="device"
				:showRecharge="true"
				@click="goDeviceDetail(device.id)"
				@recharge="goRecharge"
			/>
		</view>

		<!-- 底部Tab -->
		<view class="bottom-tab safe-bottom">
			<view class="tab-item" @click="openBookPopup">
				<text class="tab-icon">📅</text>
				<text class="tab-text">预约到店</text>
			</view>
			<view class="tab-item" @click="goPage('/pages/coupon-redeem/coupon-redeem')">
				<image class="tab-icon-img" src="/static/icon/saomahexiao.png" mode="aspectFit" />
				<text class="tab-text">团购核销</text>
			</view>
			<view class="tab-item" @click="goPage('/pages/wash-order-list/wash-order-list')">
				<image class="tab-icon-img" src="/static/icon/dingdan.png" mode="aspectFit" />
				<text class="tab-text">我的订单</text>
			</view>
			<view class="tab-item" @click="goPage('/pages/wallet/wallet')">
				<image class="tab-icon-img" src="/static/icon/youhuichognzhi.png" mode="aspectFit" />
				<text class="tab-text">优惠充值</text>
			</view>
			<view class="tab-item" @click="sharePage">
				<image class="tab-icon-img" src="/static/icon/fenxiang.png" mode="aspectFit" />
				<text class="tab-text">分享有礼</text>
			</view>
		</view>

		<!-- 预约服务弹窗 -->
		<view class="book-overlay" v-if="showBookPopup" @click="showBookPopup = false">
			<view class="book-popup" @click.stop>
				<view class="book-popup-header">
					<text class="book-popup-title">预约服务</text>
					<text class="book-popup-close" @click="showBookPopup = false">✕</text>
				</view>
				<view class="popup-section" v-if="bookStep === 1">
					<text class="popup-section-title">预约时间</text>
					<scroll-view scroll-x class="date-scroll">
						<view class="date-list">
							<view :class="['date-item', { active: selectedDate === index }]" v-for="(item, index) in dateList" :key="index" @click="selectedDate = index">
								<text class="date-week">{{ item.week }}</text>
								<text class="date-day">{{ item.day }}</text>
								<text class="date-month">{{ item.month }}</text>
							</view>
						</view>
					</scroll-view>
					<view class="time-grid">
						<view :class="['time-item', { active: selectedTime === item }]" v-for="(item, idx) in timeSlots" :key="idx" @click="selectedTime = item">
							<text>{{ item.label }}</text>
						</view>
					</view>
					<input class="remark-input" v-model="remark" placeholder="请输入备注内容" maxlength="200" />
					<view class="popup-btn" :class="{ disabled: !selectedTime }" @click="bookStep = 2">
						<text class="popup-btn-text">下一步</text>
					</view>
				</view>
				<view class="popup-section" v-if="bookStep === 2">
					<text class="popup-section-title">选择服务项目</text>
					<view class="service-grid">
						<view :class="['service-card', { active: selectedService === index }]" v-for="(item, index) in serviceList" :key="index" @click="selectedService = index">
							<text class="service-name">{{ item.name }}</text>
							<text class="service-price">￥{{ item.price.toFixed(2) }}</text>
							<text class="service-desc">{{ item.desc }}</text>
						</view>
					</view>
					<view class="popup-btn-row">
						<view class="popup-btn-back" @click="bookStep = 1"><text class="popup-btn-text">上一步</text></view>
						<view class="popup-btn" :class="{ disabled: selectedService === null }" @click="bookStep = 3"><text class="popup-btn-text">确认</text></view>
					</view>
				</view>
				<view class="popup-section" v-if="bookStep === 3">
					<text class="popup-section-title">选择支付方式</text>
					<view class="pay-method-list">
						<view class="pay-method-item" :class="{ active: selectedPayMethod === 'wechat' }" @click="selectedPayMethod = 'wechat'">
							<text class="pm-icon">🟢</text>
							<text class="pm-name">微信支付</text>
							<view class="pm-radio"><view class="pm-radio-inner" v-if="selectedPayMethod === 'wechat'"></view></view>
						</view>
						<view class="pay-method-item" :class="{ active: selectedPayMethod === 'balance' }" @click="selectedPayMethod = 'balance'">
							<text class="pm-icon">💰</text>
							<view class="pm-info"><text class="pm-name">账户余额</text><text class="pm-desc">￥{{ balance }}</text></view>
							<view class="pm-radio"><view class="pm-radio-inner" v-if="selectedPayMethod === 'balance'"></view></view>
						</view>
						<view class="pay-method-item" :class="{ active: selectedPayMethod === 'coupon' }" @click="showCouponPicker = true">
							<text class="pm-icon">🎫</text>
							<view class="pm-info"><text class="pm-name">我的卡券</text><text class="pm-desc">{{ selectedCoupon ? selectedCoupon.name + ' -￥' + selectedCoupon.amount : '可用' + couponCount + '张' }}</text></view>
							<view class="pm-radio"><view class="pm-radio-inner" v-if="selectedPayMethod === 'coupon'"></view></view>
						</view>
					</view>
					<view class="popup-btn-row">
						<view class="popup-btn-back" @click="bookStep = 2"><text class="popup-btn-text">上一步</text></view>
						<view class="popup-btn" @click="onPay"><text class="popup-btn-text">确认下单</text></view>
					</view>
				</view>
			</view>
		</view>

		<!-- 预约成功弹窗 -->
		<view class="success-overlay" v-if="showBookSuccess" @click="showBookSuccess = false">
			<view class="success-popup" @click.stop>
				<view class="success-icon-wrap"><image class="success-icon-img" src="/static/icon/yuyuechenggong.png" mode="aspectFit" /></view>
				<text class="success-title">预约成功</text>
				<text class="success-desc">您的预约已提交成功，请按时到店</text>
				<view class="success-btn" @click="closeAll"><text class="success-btn-text">返回</text></view>
			</view>
		</view>

		<!-- 卡券选择弹窗 -->
		<view class="coupon-picker-overlay" v-if="showCouponPicker" @click="showCouponPicker = false">
			<view class="coupon-picker-popup" @click.stop>
				<view class="coupon-picker-header">
					<text class="coupon-picker-title">选择卡券</text>
					<text class="coupon-picker-close" @click="showCouponPicker = false">✕</text>
				</view>
				<scroll-view scroll-y class="coupon-picker-list">
					<view :class="['coupon-picker-item', { active: selectedCoupon && selectedCoupon.id === item.id, expired: item.expired }]" v-for="(item, index) in couponList" :key="index" @click="!item.expired && onSelectCoupon(item)">
						<view class="cp-left"><text class="cp-symbol">￥</text><text class="cp-amount">{{ item.amount }}</text></view>
						<view class="cp-right"><text class="cp-name">{{ item.name }}</text><text class="cp-scope">适用于:{{ item.scope }}</text><text class="cp-times">剩余:{{ item.remainTimes }}次</text><text class="cp-expire">{{ item.expired ? '已到期' : '有效期:' + item.expireText }}</text></view>
						<view class="cp-check" v-if="selectedCoupon && selectedCoupon.id === item.id">✓</view>
					</view>
					<view class="coupon-picker-item no-coupon" :class="{ active: !selectedCoupon }" @click="onSelectCoupon(null)">
						<view class="cp-right" style="flex:1;display:flex;align-items:center;justify-content:center;"><text class="cp-name">不使用卡券</text></view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStoreList, getStoreDevices } from '@/api/store.js'
import StoreCard from '@/components/store-card/store-card.vue'
import WashDeviceCard from '@/components/wash-device-card/wash-device-card.vue'

const storeList = ref([])
const deviceList = ref([])

onMounted(() => {
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	const storeRes = await getStoreList()
	storeList.value = storeRes.list || []

	const deviceRes = await getStoreDevices(1)
	deviceList.value = deviceRes || []
}

const goStoreDetail = (id) => {
	uni.navigateTo({ url: `/pages/store-detail/store-detail?storeId=${id}` })
}

// 选择门店并返回
const selectStore = (store) => {
	// TODO: 保存选择的门店到本地/全局状态
	// uni.setStorageSync('currentStoreId', store.id)
	uni.showToast({ title: `已切换到${store.name}`, icon: 'success' })
	setTimeout(() => {
		uni.navigateBack({ delta: 1 })
	}, 800)
}

const goDeviceDetail = (id) => {
	uni.navigateTo({ url: `/pages/device-detail/device-detail?deviceId=${id}` })
}

const goRecharge = () => {
	uni.navigateTo({ url: '/pages/wallet/wallet' })
}

const goPage = (url) => {
	uni.navigateTo({ url })
}

const sharePage = () => {
	uni.showToast({ title: '分享有礼功能开发中', icon: 'none' })
}

const searchStore = () => {
	// TODO: 搜索功能
	uni.showToast({ title: '搜索功能开发中', icon: 'none' })
}

// ===== 预约弹窗 =====
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
const serviceList = ref([
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' },
	{ name: '洗澡美容', price: 30.00, desc: '人工洗澡+修毛' }
])
const couponList = ref([
	{ id: 1, name: '美团·次卡', amount: 20, scope: '洗宠机', remainTimes: 3, expireText: '60天', expired: false },
	{ id: 2, name: '洗宠优惠券', amount: 10, scope: '洗澡美容', remainTimes: 1, expireText: '30天', expired: false },
	{ id: 3, name: '系统·余额卷', amount: 30, scope: '全部服务', remainTimes: 5, expireText: '90天', expired: false },
	{ id: 4, name: '过期次卡', amount: 15, scope: '洗宠机', remainTimes: 0, expireText: '已到期', expired: true }
])
const dateList = ref([])
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const timeSlots = ref([{ label: '08:00' }, { label: '10:00' }, { label: '12:00' }, { label: '14:00' }, { label: '16:00' }])
const initDateList = () => {
	const list = []
	for (let i = 0; i < 5; i++) {
		const d = new Date(); d.setDate(d.getDate() + i)
		list.push({ week: i === 0 ? '今天' : weekDays[d.getDay()], day: String(d.getDate()).padStart(2, '0'), month: (d.getMonth() + 1) + '月' })
	}
	dateList.value = list
}
initDateList()

const openBookPopup = () => {
	bookStep.value = 1; selectedDate.value = 0; selectedTime.value = null; selectedService.value = null; selectedPayMethod.value = 'wechat'; remark.value = ''
	showBookPopup.value = true
}
const onSelectCoupon = (item) => {
	selectedCoupon.value = item; selectedPayMethod.value = item ? 'coupon' : 'wechat'; showCouponPicker.value = false
}
const onPay = () => {
	showBookPopup.value = false; showBookSuccess.value = true
}
const closeAll = () => {
	showBookSuccess.value = false; showBookPopup.value = false; bookStep.value = 1
}

// ===== 团购核销 =====
const onScanOrder = () => { showRedeemSuccess.value = false }

</script>

<style lang="scss" scoped>
.page-store-list {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 180rpx;
}

.search-bar {
	padding: 24rpx;
	background-color: #fff;
}

.search-header {
	margin-bottom: 16rpx;
}

.search-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
}

.search-input {
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	border-radius: 999rpx;
	padding: 20rpx 32rpx;

	.search-icon {
		margin-right: 12rpx;
		font-size: 28rpx;
	}

	.search-placeholder {
		font-size: 28rpx;
		color: #999;
	}
}

.section {
	padding: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.bottom-tab {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	display: flex;
	box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx 0;

	.tab-icon {
		font-size: 36rpx;
		margin-bottom: 4rpx;
	}

	.tab-icon-img {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 4rpx;
	}

	.tab-text {
		font-size: 22rpx;
		color: #333;
	}
}

/* ===== 弹窗样式（与首页一致） ===== */
.book-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: flex-end; justify-content: center; }
.book-popup { width: 100%; max-height: 80vh; background-color: #fff; border-radius: 32rpx 32rpx 0 0; padding: 0 32rpx 40rpx; padding-bottom: calc(40rpx + env(safe-area-inset-bottom)); animation: slideUp 0.3s ease-out; display: flex; flex-direction: column; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.book-popup-header { display: flex; align-items: center; justify-content: space-between; padding: 32rpx 0 20rpx; }
.book-popup-title { font-size: 36rpx; font-weight: 700; color: #333; }
.book-popup-close { width: 56rpx; height: 56rpx; border-radius: 50%; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 32rpx; color: #999; }
.popup-section { flex: 1; overflow-y: auto; }
.popup-section-title { font-size: 28rpx; font-weight: 600; color: #333; margin-bottom: 20rpx; display: block; }
.date-scroll { white-space: nowrap; margin-bottom: 20rpx; }
.date-list { display: inline-flex; gap: 12rpx; }
.date-item { width: 120rpx; padding: 16rpx 0; text-align: center; border-radius: 12rpx; border: 2rpx solid #e0e0e0; display: flex; flex-direction: column; align-items: center; flex-shrink: 0; &.active { border-color: #07C160; background-color: #e8f8ee; } }
.date-week { font-size: 22rpx; color: #999; margin-bottom: 4rpx; }
.active .date-week { color: #07C160; }
.date-day { font-size: 30rpx; font-weight: 700; color: #333; margin-bottom: 2rpx; }
.date-month { font-size: 20rpx; color: #999; }
.time-grid { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 20rpx; }
.time-item { width: calc(33.33% - 8rpx); text-align: center; padding: 16rpx 0; border-radius: 12rpx; border: 2rpx solid #e0e0e0; font-size: 28rpx; color: #333; &.active { border-color: #07C160; background-color: #e8f8ee; color: #07C160; font-weight: 600; } }
.remark-input { width: 100%; font-size: 28rpx; color: #333; background-color: #f5f5f5; border-radius: 12rpx; padding: 16rpx 20rpx; box-sizing: border-box; margin-bottom: 24rpx; }
.service-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-bottom: 24rpx; }
.service-card { width: calc(50% - 8rpx); padding: 24rpx; border-radius: 16rpx; border: 2rpx solid #e0e0e0; &.active { border-color: #07C160; background-color: #e8f8ee; } }
.service-name { font-size: 28rpx; font-weight: 600; color: #333; display: block; margin-bottom: 4rpx; }
.service-price { font-size: 32rpx; font-weight: 700; color: #ff4d4f; display: block; margin-bottom: 4rpx; }
.service-desc { font-size: 22rpx; color: #999; display: block; }
.pay-method-list { margin-bottom: 24rpx; }
.pay-method-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #f5f5f5; &:last-child { border-bottom: none; } &.active { background-color: #f8fff9; } }
.pm-icon { width: 72rpx; height: 72rpx; border-radius: 16rpx; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 36rpx; margin-right: 20rpx; }
.pm-name { font-size: 28rpx; color: #333; }
.pm-desc { font-size: 22rpx; color: #999; }
.pm-info { flex: 1; display: flex; flex-direction: column; }
.pm-radio { width: 36rpx; height: 36rpx; border-radius: 50%; border: 2rpx solid #ddd; display: flex; align-items: center; justify-content: center; margin-left: auto; .active & { border-color: #07C160; } }
.pm-radio-inner { width: 20rpx; height: 20rpx; border-radius: 50%; background-color: #07C160; }
.popup-btn { background: linear-gradient(135deg, #07C160, #38d976); border-radius: 999rpx; padding: 24rpx 0; text-align: center; &:active { opacity: 0.9; } &.disabled { opacity: 0.5; } }
.popup-btn-text { font-size: 32rpx; font-weight: 600; color: #fff; }
.popup-btn-row { display: flex; gap: 16rpx; }
.popup-btn-back { flex: 1; background-color: #f5f5f5; border-radius: 999rpx; padding: 24rpx 0; text-align: center; }
.popup-btn-back .popup-btn-text { color: #666; font-weight: 500; }
.popup-btn-row .popup-btn { flex: 2; }

/* 预约成功弹窗 */
.success-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.success-popup { width: 560rpx; background-color: #fff; border-radius: 32rpx; padding: 48rpx 36rpx 36rpx; display: flex; flex-direction: column; align-items: center; animation: popIn 0.3s ease-out; }
@keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.success-icon-wrap { margin-bottom: 16rpx; }
.success-icon-img { width: 120rpx; height: 120rpx; }
.success-title { font-size: 36rpx; font-weight: 700; color: #333; margin-bottom: 12rpx; }
.success-desc { font-size: 26rpx; color: #999; margin-bottom: 32rpx; }
.success-btn { width: 100%; background: linear-gradient(135deg, #07C160, #38d976); border-radius: 999rpx; padding: 24rpx 0; text-align: center; &:active { opacity: 0.9; } }
.success-btn-text { font-size: 30rpx; font-weight: 600; color: #fff; }

/* 卡券选择弹窗 */
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
