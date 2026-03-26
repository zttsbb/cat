<!-- pages/book-order-list/book-order-list.vue -->
<!-- 预约订单列表 -->
<template>
	<view class="page-book-order-list">
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
					<view class="order-amount">￥{{ order.amount.toFixed(2) }}</view>
					<view class="order-pay-method">{{ order.payMethod }}</view>
				</view>
			</view>
			<view class="empty-wrap" v-if="filteredOrders.length === 0">
				<text class="empty-icon">📭</text>
				<text class="empty-text">暂无相关订单</text>
			</view>
		</view>

		<!-- 底部提示 -->
		<view class="bottom-tips safe-bottom">
			<text class="tips-text">*仅显示近3个月订单</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBookOrderList } from '@/api/order.js'

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
	const map = { 1: 'status-pending', 2: 'status-done', 3: 'status-cancel' }
	return map[status] || ''
}

const switchTab = (key) => {
	currentTab.value = key
}

onMounted(() => {
	loadOrders()
})

const loadOrders = async () => {
	// TODO: 调用实际接口
	const res = await getBookOrderList({ page: 1, pageSize: 20 })
	orderList.value = res.list || []
}

const goDetail = (id) => {
	uni.navigateTo({ url: `/pages/book-order-detail/book-order-detail?orderId=${id}` })
}
</script>

<style lang="scss" scoped>
.page-book-order-list {
	min-height: 100vh;
	background-color: #f5f5f5;
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
	padding-bottom: 100rpx;
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
	font-size: 36rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.order-pay-method {
	font-size: 24rpx;
	color: #999;
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
	font-size: 22rpx;
	color: #999;
}
</style>
