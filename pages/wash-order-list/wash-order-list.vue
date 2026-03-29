<!-- pages/wash-order-list/wash-order-list.vue -->
<!-- 洗宠订单列表 -->
<template>
	<view class="page-wash-order-list">
		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-back" @click="goBack">
				<text class="nav-back-icon">‹</text>
			</view>
			<view class="nav-title">洗宠订单</view>
			<view class="nav-placeholder"></view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<order-card
				v-for="order in orderList"
				:key="order.id"
				:order="order"
				@click="goDetail(order.id)"
			/>
			<view class="empty-wrap" v-if="orderList.length === 0">
				<text class="empty-icon">📭</text>
				<text class="empty-text">暂无订单记录</text>
			</view>
		</view>

		<!-- 底部提示 -->
		<view class="bottom-tips safe-bottom">
			<text class="tips-text">*微信支付订单会在订单结束后12小时内原路退回</text>
			<text class="tips-text">*仅显示近3个月订单</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWashOrderList } from '@/api/order.js'
import OrderCard from '@/components/order-card/order-card.vue'

const statusBarHeight = ref(0)
const orderList = ref([])

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
	loadOrders()
})

const loadOrders = async () => {
	try {
		const res = await getWashOrderList({ page: 1, pageSize: 20 })
		orderList.value = res.list || []
	} catch (e) {
		console.error('加载洗宠订单失败:', e)
		orderList.value = []
	}
}

const goDetail = (id) => {
	uni.navigateTo({ url: `/pages/wash-order-detail/wash-order-detail?orderId=${id}` })
}

const goBack = () => {
	uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
.page-wash-order-list {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 自定义导航栏 */
.nav-bar {
	background: linear-gradient(135deg, #91de00, #a5e830);
	padding: 0 24rpx;
	display: flex;
	align-items: center;
}

.nav-back {
	width: 60rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.nav-back-icon {
	font-size: 48rpx;
	color: #fff;
	font-weight: 300;
}

.nav-title {
	flex: 1;
	text-align: center;
	font-size: 34rpx;
	font-weight: 600;
	color: #fff;
	padding: 16rpx 0;
}

.nav-placeholder {
	width: 60rpx;
}

.order-list {
	background-color: #f5f5f5;
	padding: 24rpx;
	padding-bottom: 120rpx;
}

.order-list {
	margin-bottom: 24rpx;
}

.empty-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 24rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.bottom-tips {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 20rpx 32rpx;
	text-align: center;
}

.tips-text {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-bottom: 4rpx;
}
</style>
