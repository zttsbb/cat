<!-- pages/store-detail/store-detail.vue -->
<!-- 门店详情/查看现场 -->
<template>
	<view class="page-store-detail">
		<!-- 轮播图 -->
		<swiper class="store-swiper" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#91de00">
			<swiper-item v-for="(img, index) in storeDetail.images" :key="index">
				<image class="swiper-image" :src="img" mode="aspectFill" />
			</swiper-item>
		</swiper>

		<!-- 门店信息 -->
		<view class="store-info">
			<view class="store-header">
				<view class="store-name">{{ storeDetail.name }}</view>
				<view class="switch-store-btn" @click="goStoreList">切换门店</view>
			</view>
			<view class="store-tags">
				<text v-for="(tag, index) in storeDetail.tags" :key="index" class="tag-item">{{ tag }}</text>
			</view>
			<view class="store-meta">
				<view class="meta-item">📍 {{ storeDetail.distance }}</view>
				<view class="meta-item">⏰ {{ storeDetail.businessHours }}</view>
				<view class="meta-item">📞 {{ storeDetail.phone }}</view>
			</view>
			<view class="store-address">🏠 {{ storeDetail.address }}</view>
			<view class="store-desc">{{ storeDetail.description }}</view>
		</view>

		<!-- 门店设备 -->
		<view class="device-section">
			<view class="section-title">门店设备（{{ deviceList.length }}）</view>
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
			<view class="tab-item" @click="goPage('/pages/book-service/book-service')">
				<text class="tab-icon">📅</text>
				<text class="tab-text">预约到店</text>
			</view>
			<view class="tab-item" @click="goPage('/pages/coupon-redeem/coupon-redeem')">
				<text class="tab-icon">🎫</text>
				<text class="tab-text">团购核销</text>
			</view>
			<view class="tab-item" @click="goPage('/pages/wash-order-list/wash-order-list')">
				<text class="tab-icon">📋</text>
				<text class="tab-text">我的订单</text>
			</view>
			<view class="tab-item" @click="goPage('/pages/wallet/wallet')">
				<text class="tab-icon">💰</text>
				<text class="tab-text">优惠充值</text>
			</view>
			<view class="tab-item" @click="sharePage">
				<text class="tab-icon">🎁</text>
				<text class="tab-text">分享有礼</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getStoreDetail, getStoreDevices } from '@/api/store.js'
import WashDeviceCard from '@/components/wash-device-card/wash-device-card.vue'

const storeId = ref(1)
const storeDetail = ref({
	id: 1,
	name: '物沃宠物洗护中心（南山店）',
	images: ['/static/images/store-1.png', '/static/images/store-2.png', '/static/images/store-3.png'],
	tags: ['有车位', '有技师', 'WIFI覆盖'],
	distance: '3.6KM',
	address: '深圳市南山区科技园南区深南大道9966号',
	businessHours: '08:00 - 22:00',
	phone: '0755-88888888',
	description: '专业宠物洗护，自助智能洗宠机，让爱宠享受SPA级体验。'
})
const deviceList = ref([])

onLoad((options) => {
	if (options.storeId) storeId.value = options.storeId
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	const res = await getStoreDetail(storeId.value)
	if (res) storeDetail.value = res

	const deviceRes = await getStoreDevices(storeId.value)
	deviceList.value = deviceRes || []
}

const goStoreList = () => {
	uni.switchTab({ url: '/pages/store-list/store-list' })
}

const goDeviceDetail = (id) => {
	uni.navigateTo({ url: `/pages/index/index?deviceId=${id}` })
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
</script>

<style lang="scss" scoped>
.page-store-detail {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 180rpx;
}

.store-swiper {
	width: 100%;
	height: 400rpx;
}

.swiper-image {
	width: 100%;
	height: 400rpx;
	background-color: #e8f8ee;
}

.store-info {
	background-color: #fff;
	padding: 32rpx;
	margin-bottom: 24rpx;
}

.store-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.store-name {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.switch-store-btn {
	font-size: 24rpx;
	color: #91de00;
	border: 1rpx solid #91de00;
	padding: 8rpx 24rpx;
	border-radius: 999rpx;
}

.store-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20rpx;
}

.tag-item {
	font-size: 22rpx;
	color: #91de00;
	background-color: #e8f8ee;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	margin-right: 16rpx;
}

.store-meta {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 12rpx;
}

.meta-item {
	font-size: 24rpx;
	color: #666;
	margin-right: 32rpx;
	margin-bottom: 8rpx;
}

.store-address {
	font-size: 26rpx;
	color: #333;
	margin-bottom: 16rpx;
}

.store-desc {
	font-size: 24rpx;
	color: #999;
	line-height: 1.6;
}

.device-section {
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

	.tab-text {
		font-size: 22rpx;
		color: #333;
	}
}
</style>
