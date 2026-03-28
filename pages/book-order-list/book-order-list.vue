<!-- pages/book-order-list/book-order-list.vue -->
<!-- 预约订单列表 -->
<template>
	<view class="page-book-order-list">
		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-back" @click="goBack">
				<text class="nav-back-icon">‹</text>
			</view>
			<view class="nav-title">预约订单</view>
			<view class="nav-placeholder"></view>
		</view>

		<!-- Tab切换 -->
		<view class="tab-bar">
			<view :class="['tab-item', { active: currentTab === item.key }]" v-for="item in tabs" :key="item.key" @click="switchTab(item.key)">
				<text>{{ item.label }}</text>
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-card" v-for="order in filteredOrders" :key="order.id" @click="goDetail(order.id)">
				<view class="order-header">
					<view class="service-type">{{ order.serviceType }}</view>
					<view :class="['order-status', statusClass(order.status)]">{{ order.statusText }}</view>
				</view>
				<view class="order-desc">{{ order.description }}</view>
				<view class="order-time">📅 {{ order.bookDate }} {{ order.bookTime }}</view>
				<view class="order-footer">
					<view class="order-amount">￥{{ order.amount.toFixed(2) }} ·{{ order.payMethod }}</view>
					<!-- 待使用状态显示取消预约按钮 -->
					<view class="cancel-btn" v-if="order.status === 1" @click.stop="onCancel(order)">
						<text class="cancel-text">取消预约</text>
					</view>
				</view>
			</view>
			<view class="empty-wrap" v-if="filteredOrders.length === 0">
				<text class="empty-icon">📭</text>
				<text class="empty-text">暂无相关订单</text>
			</view>
		</view>

		<!-- 底部提示 -->
		<view class="bottom-tips safe-bottom">
			<text class="tips-text">*微信支付订单会在订单结束后12小时内原路退回</text>
			<text class="tips-text">仅显示3个月内订单</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBookOrderList, cancelBookOrder } from '@/api/order.js'

const statusBarHeight = ref(0)

const currentTab = ref('')
const orderList = ref([])

const tabs = [
	{ key: '', label: '全部' },
	{ key: '1', label: '待使用' },
	{ key: '2', label: '已完成' },
	{ key: '3', label: '已取消' }
]

const filteredOrders = computed(() => {
	if (!currentTab.value) return orderList.value
	return orderList.value.filter(o => String(o.status) === currentTab.value)
})

const statusClass = (status) => {
	const map = { 1: 'status-pending', 2: 'status-done', 3: 'status-cancel', 4: 'status-refund' }
	return map[status] || ''
}

const switchTab = (key) => {
	currentTab.value = key
}

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
	loadOrders()
})

const loadOrders = async () => {
	try {
		const res = await getBookOrderList({ page: 1, pageSize: 20 })
		orderList.value = res.list || []
	} catch (e) {
		console.error('加载预约订单失败:', e)
		orderList.value = []
	}
}

const goDetail = (id) => {
	uni.navigateTo({ url: `/pages/book-order-detail/book-order-detail?orderId=${id}` })
}

const goBack = () => {
	uni.navigateBack({ delta: 1 })
}

// 取消预约
const onCancel = (order) => {
	uni.showModal({
		title: '确认取消',
		content: '确定要取消本次预约吗？',
		success: async (res) => {
			if (res.confirm) {
				try {
					// TODO: 调用取消接口
					// const result = await cancelBookOrder(order.id)
					order.status = 3
					order.statusText = '已取消'
					uni.showToast({ title: '取消成功', icon: 'success' })
				} catch (e) {
					uni.showToast({ title: '取消失败，请重试', icon: 'none' })
				}
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.page-book-order-list {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 自定义导航栏 */
.nav-bar {
	background: linear-gradient(135deg, #07C160, #38d976);
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

.tab-bar {
	display: flex;
	background-color: #fff;
	padding: 0 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 28rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;

	&.active {
		color: #07C160;
		font-weight: 600;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 60rpx;
			height: 4rpx;
			background-color: #07C160;
			border-radius: 999rpx;
		}
	}
}

.order-list {
	padding: 24rpx;
	padding-bottom: 120rpx;
}

.order-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.order-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.service-type {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.order-status {
	font-size: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 999rpx;
}

.status-pending {
	background-color: #fff3e8;
	color: #ff9500;
}

.status-done {
	background-color: #e8f8ee;
	color: #07C160;
}

.status-cancel {
	background-color: #f5f5f5;
	color: #999;
}

.status-refund {
	background-color: #fff3e8;
	color: #ff9500;
}

.order-desc {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.order-time {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.order-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: 1rpx solid #f5f5f5;
	padding-top: 16rpx;
}

.order-amount {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

/* 取消预约按钮 */
.cancel-btn {
	padding: 8rpx 24rpx;
	border: 2rpx solid #ff4d4f;
	border-radius: 999rpx;

	&:active {
		background-color: #fff5f5;
	}
}

.cancel-text {
	font-size: 24rpx;
	color: #ff4d4f;
}

.empty-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0;
}

.empty-icon { font-size: 80rpx; margin-bottom: 24rpx; }
.empty-text { font-size: 28rpx; color: #999; }

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
