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
			<view class="section-title">订单数据</view>
			<view class="info-row">
				<text class="info-label">订单时间</text>
				<text class="info-value">{{ order.createTime }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{ order.id }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">支付流水号</text>
				<text class="info-value">{{ order.payTradeNo }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">支付金额</text>
				<text class="info-value price">￥{{ order.amount.toFixed(2) }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">支付方式</text>
				<text class="info-value">{{ order.payMethod }}</text>
			</view>
		</view>

		<!-- 状态操作按钮（对齐原型图：已完成/已退款/已取消） -->
		<view class="status-actions" v-if="order.status === 2">
			<view class="status-btn active">
				<text class="status-btn-text">已完成</text>
			</view>
			<view class="status-btn" @click="onRefund">
				<text class="status-btn-text">已退款(￥{{ order.amount.toFixed(2) }})</text>
			</view>
			<view class="status-btn" @click="onCancel">
				<text class="status-btn-text">已取消</text>
			</view>
		</view>

		<!-- 取消预约按钮 -->
		<view class="cancel-section" v-if="order.status === 1">
			<view class="cancel-btn" @click="onCancelOrder">
				<text class="cancel-btn-text">取消预约</text>
			</view>
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
	const map = { 1: 'bg-orange', 2: 'bg-green', 3: 'bg-gray', 4: 'bg-orange' }
	return map[order.value.status] || 'bg-gray'
})

const statusDesc = computed(() => {
	const map = { 1: '请按时到店享受服务', 2: '感谢您的使用', 3: '订单已取消', 4: '退款已原路返回' }
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

// 退款操作（管理员/已完成状态）
const onRefund = () => {
	uni.showModal({
		title: '确认退款',
		content: `确定要退款￥${order.value.amount.toFixed(2)}吗？退款将原路返回。`,
		success: (res) => {
			if (res.confirm) {
				// TODO: 调用退款接口
				order.value.status = 4
				order.value.statusText = '已退款'
				uni.showToast({ title: '退款成功', icon: 'success' })
			}
		}
	})
}

// 取消操作
const onCancel = () => {
	uni.showModal({
		title: '确认取消',
		content: '确定要取消此订单吗？',
		success: (res) => {
			if (res.confirm) {
				// TODO: 调用取消接口
				order.value.status = 3
				order.value.statusText = '已取消'
				uni.showToast({ title: '取消成功', icon: 'success' })
			}
		}
	})
}

// 取消预约按钮（待使用状态）
const onCancelOrder = () => {
	uni.showModal({
		title: '确认取消',
		content: '确定要取消本次预约吗？',
		success: async (res) => {
			if (res.confirm) {
				// TODO: 调用取消接口
				// const result = await cancelBookOrder(orderId.value)
				order.value.status = 3
				order.value.statusText = '已取消'
				uni.showToast({ title: '取消成功', icon: 'success' })
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
.bg-green { background-color: #f5fde6; }
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

.order-info {
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

/* 状态操作按钮 */
.status-actions {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 24rpx 24rpx;
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
}

.status-btn {
	flex: 1;
	text-align: center;
	padding: 16rpx 12rpx;
	border-radius: 999rpx;
	margin: 0 8rpx;

	&:active {
		background-color: #f5f5f5;
	}

	&.active {
		background-color: #91de00;
	}
}

.status-btn-text {
	font-size: 24rpx;
	color: #666;

	.active & {
		color: #fff;
		font-weight: 600;
	}
}

/* 取消预约 */
.cancel-section {
	padding: 24rpx;
}

.cancel-btn {
	background-color: #fff;
	border: 2rpx solid #ff4d4f;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 999rpx;

	&:active {
		background-color: #fff5f5;
	}
}

.cancel-btn-text {
	font-size: 28rpx;
	color: #ff4d4f;
}
</style>
