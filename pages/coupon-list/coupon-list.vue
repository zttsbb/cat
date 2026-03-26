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
			<coupon-card
				v-for="coupon in filteredCoupons"
				:key="coupon.id"
				:coupon="coupon"
			/>
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
import CouponCard from '@/components/coupon-card/coupon-card.vue'

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

onMounted(() => {
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	const res = await getCouponList({ page: 1, pageSize: 20 })
	couponList.value = res.list || []
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
