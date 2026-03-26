<!-- pages/store-list/store-list.vue -->
<!-- 门店列表 -->
<template>
	<view class="page-store-list">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
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
.page-store-list {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 180rpx;
}

.search-bar {
	padding: 24rpx;
	background-color: #fff;
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

	.tab-text {
		font-size: 22rpx;
		color: #333;
	}
}
</style>
