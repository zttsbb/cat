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
			<!-- 门店标签 -->
			<view class="store-tags">
				<view class="store-tag" v-for="(tag, idx) in store.tags" :key="idx">
					<text class="tag-icon">{{ tag.icon }}</text>
					<text class="tag-text">{{ tag.text }}</text>
				</view>
			</view>
			<!-- 地址信息 -->
			<view class="store-address">
				<text class="address-text">距我 {{ store.distance }} | {{ store.address }}</text>
			</view>
		</view>

		<!-- 轮播图 -->
		<view class="swiper-section">
			<swiper class="banner-swiper" :autoplay="true" :interval="4000" :circular="true"
				:indicator-dots="true" indicator-color="rgba(255,255,255,0.5)"
				indicator-active-color="#fff" @change="onSwiperChange">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<view class="swiper-item" @click="onBannerClick(item)">
						<image class="swiper-image" :src="item.image" mode="aspectFill" />
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entry">
			<view class="entry-grid">
				<view class="entry-item" v-for="(item, index) in quickEntries" :key="index" @click="onEntryClick(item)">
					<view class="entry-icon-wrap">
						<image v-if="item.iconImage" class="entry-icon-img" :src="item.iconImage" mode="aspectFit" />
					</view>
					<text class="entry-text">{{ item.text }}</text>
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
					<!-- 设备顶部信息 -->
					<view class="device-card-top">
						<view class="device-card-name">{{ item.name }}</view>
						<view :class="['device-status', item.status === 1 ? 'status-green' : 'status-gray']">
							{{ item.statusText }}
						</view>
					</view>
					<view class="device-card-addr">
						<text class="addr-text">{{ item.address }}</text>
					</view>
					<!-- 价格信息 -->
					<view class="device-card-price">
						<text class="price-label">每分钟</text>
						<text class="price-value">{{ item.priceRange }}</text>
						<text class="price-unit">元</text>
					</view>
					<!-- 操作按钮 -->
					<view class="device-card-actions">
						<view class="device-card-btn btn-recharge" @click.stop="goRecharge(item)">
							<text class="btn-text">预充值</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 团购核销底部弹窗 -->
		<view class="redeem-overlay" v-if="showRedeemPopup" @click="closeRedeemPopup">
			<view class="redeem-popup" @click.stop>
				<view class="popup-header">
					<text class="popup-title">团购核销</text>
					<text class="popup-close" @click="closeRedeemPopup">✕</text>
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
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const statusBarHeight = ref(0)

// 门店信息 Mock
const store = ref({
	id: 1,
	name: '我是门店名称',
	address: '合肥市新海大道5号',
	distance: '1.45KM',
	tags: [
		{ icon: '🅿️', text: '有车位' },
		{ icon: '📸', text: '门店图' },
		{ icon: '✂️', text: '有技师' },
		{ icon: '📶', text: 'WIFI覆盖' }
	]
})

// 轮播图 Mock（接口返回）
const bannerList = ref([
	{ id: 1, image: '/banner/banner1.jpg', link: '', title: '轮播图1' },
	{ id: 2, image: '/banner/banner2.jpg', link: '', title: '轮播图2' },
	{ id: 3, image: '/banner/banner3.jpg', link: '', title: '轮播图3' }
])

// 快捷入口（对齐原型图：预约到店、团购核销、我的订单、优惠充值、分享有礼）
const quickEntries = ref([
	{ iconImage: '/icon/qiandao.png', text: '预约到店', url: '/pages/book-service/book-service' },
	{ iconImage: '/icon/saomahexiao.png', text: '团购核销', action: 'redeem' },
	{ iconImage: '/icon/qianbao.png', text: '我的订单', url: '/pages/wash-order-list/wash-order-list' },
	{ iconImage: '/icon/youhuichognzhi.png', text: '优惠充值', url: '/pages/wallet/wallet' },
	{ iconImage: '/icon/fenxiang.png', text: '分享有礼', action: 'share' }
])

// 设备列表 Mock
const deviceList = ref([
	{
		id: 101,
		name: '智能洗宠机A1',
		address: '合肥市新站区新海大道5号...',
		status: 1,
		statusText: '可使用',
		priceRange: '0.8-1.2',
		storeId: 1
	},
	{
		id: 102,
		name: '智能洗宠机A2',
		address: '合肥市新站区新海大道5号...',
		status: 1,
		statusText: '可使用',
		priceRange: '0.8-1.2',
		storeId: 1
	}
])

// 团购核销弹窗
const showRedeemPopup = ref(false)
const redeemCode = ref('')
const selectedPlatform = ref(null)

const platforms = [
	{ label: '抖音', icon: '/icon/douyin.png', value: 'douyin' },
	{ label: '美团', icon: '/icon/meituan.png', value: 'meituan' },
	{ label: '系统', icon: '/icon/ceng.png', value: 'system' }
]

const currentPlatformIcon = computed(() => {
	if (!selectedPlatform.value) return ''
	const p = platforms.find(item => item.value === selectedPlatform.value)
	return p ? p.icon : ''
})

const currentPlatformLabel = computed(() => {
	if (!selectedPlatform.value) return ''
	const p = platforms.find(item => item.value === selectedPlatform.value)
	return p ? p.label : ''
})

const selectPlatform = (item) => {
	selectedPlatform.value = item.value
}

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0

	// TODO: 加载门店信息和设备列表
	// getStoreDetail(storeId).then(res => { store.value = res })
	// getDeviceList({ storeId }).then(res => { deviceList.value = res })
	// getBannerList({ storeId }).then(res => { bannerList.value = res })
})

// tabBar 页面列表
const tabBarPages = [
	'pages/index/index',
	'pages/wash-order-list/wash-order-list',
	'pages/scan/scan',
	'pages/book-order-list/book-order-list',
	'pages/mine/mine'
]

// 快捷入口点击
const onEntryClick = (item) => {
	if (item.action === 'redeem') {
		showRedeemPopup.value = true
		return
	}
	if (item.action === 'share') {
		// TODO: 分享有礼逻辑
		uni.showToast({ title: '分享有礼功能开发中', icon: 'none' })
		return
	}
	if (item.url) {
		// tabBar 页面用 switchTab，普通页面用 navigateTo
		const pagePath = item.url.replace(/^\//, '')
		if (tabBarPages.includes(pagePath)) {
			uni.switchTab({ url: item.url })
		} else {
			uni.navigateTo({ url: item.url })
		}
	}
}

// 跳转设备详情
const goDeviceDetail = (item) => {
	uni.navigateTo({ url: `/pages/device-detail/device-detail?deviceId=${item.id}` })
}

// 预充值
const goRecharge = (item) => {
	uni.navigateTo({ url: `/pages/wallet/wallet?deviceId=${item.id}` })
}

// 切换门店
const goStoreList = () => {
	uni.navigateTo({ url: '/pages/store-list/store-list' })
}

// 关闭核销弹窗
const closeRedeemPopup = () => {
	showRedeemPopup.value = false
	redeemCode.value = ''
	selectedPlatform.value = null
}

// 确认核销
const onConfirmRedeem = () => {
	if (!redeemCode.value.trim()) {
		uni.showToast({ title: '请输入核销码', icon: 'none' })
		return
	}
	// TODO: 调用核销接口
	uni.showToast({ title: '核销成功', icon: 'success' })
	closeRedeemPopup()
}

// 轮播图
const onSwiperChange = (e) => {}

const onBannerClick = (item) => {
	if (item.link) {
		uni.navigateTo({ url: item.link })
	}
}
</script>

<style lang="scss" scoped>
.page-home {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 140rpx;
}

/* 导航栏 */
.nav-bar {
	background: linear-gradient(135deg, #07C160, #38d976);
	padding: 20rpx 32rpx;

	.nav-content {
		font-size: 36rpx;
		font-weight: 600;
		color: #fff;
		text-align: center;
		padding: 20rpx 0;
	}
}

/* 门店信息卡片 */
.store-info-card {
	background: #fff;
	margin: 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.store-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.store-name {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.store-switch {
	display: flex;
	align-items: center;
	padding: 8rpx 20rpx;
	background-color: #f5f5f5;
	border-radius: 999rpx;

	&:active {
		background-color: #ebebeb;
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

.store-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20rpx;
}

.store-tag {
	display: flex;
	align-items: center;
	margin-right: 20rpx;
	margin-bottom: 12rpx;
}

.tag-icon {
	font-size: 24rpx;
	margin-right: 6rpx;
}

.tag-text {
	font-size: 24rpx;
	color: #666;
}

.store-address {
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f0f0;
}

.address-text {
	font-size: 26rpx;
	color: #999;
}

/* 轮播图 */
.swiper-section {
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	overflow: hidden;
}

.banner-swiper {
	width: 100%;
	height: 300rpx;
	border-radius: 24rpx;
}

.swiper-item {
	width: 100%;
	height: 100%;
}

.swiper-image {
	width: 100%;
	height: 100%;
	border-radius: 24rpx;
}

/* 快捷入口 */
.quick-entry {
	background-color: #fff;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
	padding: 32rpx 16rpx;
}

.entry-grid {
	display: flex;
	justify-content: space-around;
}

.entry-item {
	display: flex;
	flex-direction: column;
	align-items: center;

	.entry-icon-wrap {
		width: 96rpx;
		height: 96rpx;
		border-radius: 24rpx;
		background-color: #e8f8ee;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 12rpx;
	}

	.entry-icon-img {
		width: 56rpx;
		height: 56rpx;
	}

	.entry-text {
		font-size: 24rpx;
		color: #333;
	}
}

/* 设备列表 */
.device-section {
	margin: 0 24rpx 24rpx;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.device-list {
	display: flex;
	flex-direction: column;
}

.device-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

	&:active {
		background-color: #fafafa;
	}
}

.device-card-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.device-card-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.device-status {
	font-size: 22rpx;
	padding: 4rpx 16rpx;
	border-radius: 999rpx;
}

.status-green {
	background-color: #e8f8ee;
	color: #07C160;
}

.status-gray {
	background-color: #f0f0f0;
	color: #999;
}

.device-card-addr {
	margin-bottom: 16rpx;
}

.addr-text {
	font-size: 24rpx;
	color: #999;
}

.device-card-price {
	display: flex;
	align-items: baseline;
	margin-bottom: 20rpx;
}

.price-label {
	font-size: 24rpx;
	color: #666;
	margin-right: 8rpx;
}

.price-value {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
}

.price-unit {
	font-size: 22rpx;
	color: #666;
	margin-left: 4rpx;
}

.device-card-actions {
	display: flex;
	justify-content: flex-end;
}

.device-card-btn {
	padding: 14rpx 40rpx;
	border-radius: 999rpx;
}

.btn-recharge {
	background: linear-gradient(135deg, #07C160, #38d976);

	&:active {
		opacity: 0.9;
	}
}

.btn-text {
	font-size: 26rpx;
	font-weight: 600;
	color: #fff;
}

/* 团购核销弹窗 */
.redeem-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.redeem-popup {
	width: 100%;
	background-color: #fff;
	border-radius: 32rpx 32rpx 0 0;
	padding: 40rpx 32rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	animation: slideUp 0.3s ease-out;
	box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.15);
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.popup-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.popup-close {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #999;
}

.popup-body {
	display: flex;
	flex-direction: column;
}

.popup-input-wrap {
	background-color: #f5f5f5;
	border-radius: 16rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 32rpx;
}

.popup-input {
	font-size: 30rpx;
	color: #333;
	height: 48rpx;
}

.popup-btn {
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 28rpx 0;
	border-radius: 999rpx;
	margin-bottom: 24rpx;
}

.popup-tips {
	text-align: center;
	font-size: 22rpx;
	color: #999;
}

.platform-grid {
	display: flex;
	justify-content: space-around;
	padding: 24rpx 0 40rpx;
}

.platform-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24rpx;
	border-radius: 20rpx;
	transition: background-color 0.2s;

	&:active {
		background-color: #f5f5f5;
	}
}

.platform-icon {
	width: 96rpx;
	height: 96rpx;
	margin-bottom: 12rpx;
}

.platform-name {
	font-size: 26rpx;
	color: #333;
}

.platform-selected {
	display: flex;
	align-items: center;
	padding: 20rpx 24rpx;
	background-color: #f5f5f5;
	border-radius: 16rpx;
	margin-bottom: 24rpx;
}

.platform-selected-icon {
	width: 48rpx;
	height: 48rpx;
	margin-right: 16rpx;
}

.platform-selected-name {
	flex: 1;
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.platform-change {
	font-size: 26rpx;
	color: #07C160;
}
</style>
