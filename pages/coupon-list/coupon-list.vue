<!-- pages/coupon-list/coupon-list.vue -->
<!-- 我的卡券 -->
<template>
	<view class="page-coupon-list">
		<!-- Tab切换 -->
		<view class="tab-bar">
			<view :class="['tab-item', { active: currentTab === item.key }]" v-for="item in tabs" :key="item.key" @click="switchTab(item.key)">
				<text>{{ item.label }}</text>
			</view>
		</view>

		<!-- 卡券列表 -->
		<view class="coupon-list">
			<view
				v-for="(coupon, index) in filteredCoupons"
				:key="coupon.id"
				:class="['coupon-card', { 'coupon-expired': coupon.status !== 1 }]"
			>
				<!-- 卡片背景图 -->
				<image class="coupon-bg-img" :src="index % 2 === 0 ? '/static/bg/bg1.jpg' : '/static/bg/bg2.jpg'" mode="aspectFill" />
				<!-- 卡片内容 -->
				<view class="coupon-content">
					<!-- 左侧金额 -->
					<view class="coupon-left">
						<text class="coupon-symbol">￥</text>
						<text class="coupon-amount">{{ coupon.faceValue }}</text>
						<text class="coupon-per">/单次</text>
					</view>
					<!-- 分割线 -->
					<view class="coupon-divider"></view>
					<!-- 右侧信息 -->
					<view class="coupon-right">
						<view class="coupon-source-row">
							<image v-if="getSourceIcon(coupon.source)" class="source-icon" :src="getSourceIcon(coupon.source)" mode="aspectFit" />
							<text class="coupon-source">{{ coupon.source }}</text>
							<text class="coupon-type-badge">{{ coupon.type }}</text>
						</view>
						<text class="coupon-scope">{{ coupon.scope }}</text>
						<view class="coupon-meta">
							<text class="coupon-remain">可用{{ coupon.remainTimes }}次</text>
							<text class="coupon-expire">{{ coupon.expireDate }}</text>
						</view>
					</view>
				</view>
				<!-- 状态标签 -->
				<view :class="['coupon-status', coupon.status === 1 ? 'status-valid' : 'status-expired']">
					{{ coupon.statusText }}
				</view>
			</view>

			<view class="empty-wrap" v-if="filteredCoupons.length === 0">
				<text class="empty-icon">🎫</text>
				<text class="empty-text">暂无卡券</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCouponList } from '@/api/coupon.js'

const currentTab = ref('')
const couponList = ref([])

const tabs = [
	{ key: '', label: '全部' },
	{ key: '1', label: '可使用' },
	{ key: '3', label: '已过期' }
]

const filteredCoupons = computed(() => {
	if (!currentTab.value) return couponList.value
	return couponList.value.filter(c => String(c.status) === currentTab.value)
})

const switchTab = (key) => {
	currentTab.value = key
}

const getSourceIcon = (source) => {
	if (source === '抖音') return '/static/icon/douyin.png'
	if (source === '美团') return '/static/icon/meituan.png'
	if (source === '系统') return '/static/icon/xitong.png'
	return ''
}

onMounted(() => {
	loadData()
})

const loadData = async () => {
	try {
		const res = await getCouponList({ page: 1, pageSize: 20 })
		couponList.value = res.list || []
	} catch (e) {
		console.error('加载卡券失败:', e)
		couponList.value = []
	}
}
</script>

<style lang="scss" scoped>
.page-coupon-list {
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

.coupon-list {
	padding: 24rpx;
}

/* 卡券卡片 */
.coupon-card {
	position: relative;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
	height: 220rpx;

	&.coupon-expired {
		.coupon-amount {
			color: #999;
		}
		.coupon-symbol,
		.coupon-per {
			color: #bbb;
		}
		.coupon-remain {
			color: #999;
		}
	}
}

/* 背景图（用image标签替代background-image，兼容小程序） */
.coupon-bg-img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 24rpx;
	opacity: 0.85;
}

.coupon-card.coupon-expired .coupon-bg-img {
	opacity: 0.3;
}

/* 卡片内容 */
.coupon-content {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	height: 100%;
	padding: 0 32rpx;
}

/* 左侧金额 */
.coupon-left {
	display: flex;
	align-items: baseline;
	margin-right: 28rpx;
}

.coupon-symbol {
	font-size: 28rpx;
	font-weight: 600;
	color: #fff;
}

.coupon-amount {
	font-size: 64rpx;
	font-weight: 700;
	color: #fff;
	line-height: 1;
}

.coupon-per {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.85);
	margin-left: 4rpx;
}

/* 虚线分割 */
.coupon-divider {
	width: 2rpx;
	height: 100rpx;
	border-left: 2rpx dashed rgba(255, 255, 255, 0.5);
	margin-right: 28rpx;
	flex-shrink: 0;
}

/* 右侧信息 */
.coupon-right {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.coupon-source-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.source-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 8rpx;
}

.coupon-source {
	font-size: 28rpx;
	font-weight: 600;
	color: #fff;
}

.coupon-type-badge {
	font-size: 20rpx;
	color: #fff;
	background-color: rgba(255, 255, 255, 0.3);
	padding: 2rpx 12rpx;
	border-radius: 999rpx;
	margin-left: 12rpx;
}

.coupon-scope {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 12rpx;
}

.coupon-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.coupon-remain {
	font-size: 22rpx;
	color: #fff;
	font-weight: 500;
}

.coupon-expire {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.7);
}

/* 状态标签 */
.coupon-status {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	z-index: 2;
	font-size: 20rpx;
	padding: 4rpx 16rpx;
	border-radius: 999rpx;
}

.status-valid {
	background-color: rgba(255, 255, 255, 0.3);
	color: #fff;
}

.status-expired {
	background-color: rgba(0, 0, 0, 0.15);
	color: rgba(255, 255, 255, 0.6);
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
</style>
