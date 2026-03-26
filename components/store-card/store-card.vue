<!-- components/store-card/store-card.vue -->
<!-- 门店卡片组件 -->
<template>
	<view class="store-card" @click="handleClick">
		<image class="store-image" :src="store.image" mode="aspectFill" />
		<view class="store-info">
			<view class="store-name ellipsis">{{ store.name }}</view>
			<view class="store-tags">
				<text v-for="(tag, index) in store.tags" :key="index" class="store-tag">{{ tag }}</text>
			</view>
			<view class="store-bottom">
				<text class="store-distance">📍 {{ store.distance }}</text>
				<text class="store-address ellipsis">{{ store.address }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
defineProps({
	store: {
		type: Object,
		default: () => ({
			id: '',
			name: '门店名称',
			image: '',
			tags: [],
			distance: '',
			address: ''
		})
	}
})

const emit = defineEmits(['click'])

const handleClick = () => {
	emit('click')
}
</script>

<style lang="scss" scoped>
.store-card {
	display: flex;
	background-color: #fff;
	border-radius: 24rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.store-image {
	width: 180rpx;
	height: 180rpx;
	border-radius: 16rpx;
	flex-shrink: 0;
	background-color: #f5f5f5;
}

.store-info {
	flex: 1;
	margin-left: 24rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.store-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.store-tags {
	display: flex;
	flex-wrap: wrap;
	margin: 8rpx 0;
}

.store-tag {
	font-size: 20rpx;
	color: #07C160;
	background-color: #e8f8ee;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	margin-right: 12rpx;
}

.store-bottom {
	display: flex;
	align-items: center;
}

.store-distance {
	font-size: 24rpx;
	color: #07C160;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.store-address {
	flex: 1;
	font-size: 22rpx;
	color: #999;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
