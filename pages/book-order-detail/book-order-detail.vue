<!-- pages/book-order-detail/book-order-detail.vue -->
<!-- 预约订单详情 -->
<template>
	<view class="page-book-order-detail">
		<!-- 状态 -->
		<view class="status-section" :class="statusClass">
			<text class="status-text">{{ order.statusText }}</text>
			<text class="status-desc">{{ statusDesc }}</text>
		</view>

		<!-- 订单信息 -->
		<view class="order-info">
			<view class="section-title">订单信息</view>
			<view class="info-row">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{ order.id }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">服务项目</text>
				<text class="info-value">{{ order.serviceType }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">服务描述</text>
				<text class="info-value">{{ order.description }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">预约门店</text>
				<text class="info-value">{{ order.storeName }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">预约日期</text>
				<text class="info-value">{{ order.bookDate }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">预约时段</text>
				<text class="info-value">{{ order.bookTime }}</text>
			</view>
			<view class="info-row" v-if="order.remark">
				<text class="info-label">备注</text>
				<text class="info-value">{{ order.remark }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">下单时间</text>
				<text class="info-value">{{ order.createTime }}</text>
			</view>
		</view>

		<!-- 支付信息 -->
		<view class="pay-info">
			<view class="section-title">支付信息</view>
			<view class="info-row">
				<text class="info-label">支付金额</text>
				<text class="info-value price">￥{{ order.amount.toFixed(2) }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">支付方式</text>
				<text class="info-value">{{ order.payMethod }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">支付流水号</text>
				<text class="info-value">{{ order.payTradeNo }}</text>
			</view>
		</view>

		<!-- 取消预约按钮 -->
		<view class="cancel-section" v-if="order.status === 1">
			<view class="cancel-btn" @click="onCancel">取消预约</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getBookOrderDetail, cancelBookOrder } from '@/api/order.js'

const orderId = ref('')

const order = ref({
	id: 'B20260326001',
	serviceType: '洗澡美容',
	description: '人工洗澡+修毛',
	amount: 30.00,
	payMethod: '余额支付',
	payMethodType: 'balance',
	payTradeNo: 'BAL202603260930006789',
	status: 1,
	statusText: '待使用',
	bookDate: '2026-03-28',
	bookTime: '10:00-12:00',
	storeName: '物沃宠物洗护中心（南山店）',
	storeAddress: '深圳市南山区科技园南区深南大道9966号',
	remark: '金毛，大型犬',
	createTime: '2026-03-26 09:30:00'
})

const statusClass = computed(() => {
	const map = { 1: 'bg-orange', 2: 'bg-green', 3: 'bg-gray' }
	return map[order.value.status] || 'bg-gray'
})

const statusDesc = computed(() => {
	const map = { 1: '请按时到店享受服务', 2: '感谢您的使用', 3: '订单已取消' }
	return map[order.value.status] || ''
})

onLoad((options) => {
	orderId.value = options.orderId || ''
	loadData()
})

const loadData = async () => {
	if (orderId.value) {
		// TODO: 调用实际接口
		const res = await getBookOrderDetail(orderId.value)
		if (res) order.value = res
	}
}

const onCancel = () => {
	uni.showModal({
		title: '确认取消',
		content: '确定要取消本次预约吗？',
		success: async (res) => {
			if (res.confirm) {
				// TODO: 调用取消接口
				const result = await cancelBookOrder(orderId.value)
				if (result) {
					order.value.status = 3
					order.value.statusText = '已取消'
					uni.showToast({ title: '取消成功', icon: 'success' })
				}
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.page-book-order-detail {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 140rpx;
}

.status-section {
	padding: 48rpx 32rpx;
}

.bg-orange { background-color: #fff3e8; }
.bg-green { background-color: #e8f8ee; }
.bg-gray { background-color: #f5f5f5; }

.status-text {
	font-size: 40rpx;
	font-weight: 700;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.status-desc {
	font-size: 26rpx;
	color: #999;
}

.order-info,
.pay-info {
	background-color: #fff;
	margin: 24rpx;
	border-radius: 24rpx;
	padding: 32rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child { border-bottom: none; }
}

.info-label {
	font-size: 26rpx;
	color: #999;
}

.info-value {
	font-size: 26rpx;
	color: #333;

	&.price {
		color: #ff4d4f;
		font-weight: 600;
	}
}

.cancel-section {
	padding: 24rpx;
}

.cancel-btn {
	background-color: #fff;
	color: #ff4d4f;
	border: 2rpx solid #ff4d4f;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;
	font-size: 28rpx;
}
</style>
