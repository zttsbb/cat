<!-- pages/store-list/store-list.vue -->
<!-- 门店列表（对齐原型图：门店列表.png） -->
<template>
	<view class="page-store-list">
		<!-- 顶部导航 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="nav-back" @click="goBack">
					<text class="back-arrow">‹</text>
				</view>
				<text class="nav-title">门店列表</text>
				<view class="nav-placeholder"></view>
			</view>
		</view>

		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<text class="search-placeholder">搜索门店名称</text>
			</view>
		</view>

		<!-- 门店列表 -->
		<view class="store-list">
			<view
				class="store-card"
				v-for="(store, idx) in storeList"
				:key="store.id"
				@click="goStoreDetail(store)"
			>
				<view class="store-card-img">
					<image class="store-img" :src="store.image || '/static/bg/bg1.jpg'" mode="aspectFill" />
				</view>
				<view class="store-card-info">
					<view class="store-card-top">
						<text class="store-card-name">{{ store.name }}</text>
						<text class="store-card-dist">距我 {{ store.distance }}</text>
					</view>
					<view class="store-card-addr">
						<text>{{ store.address }}</text>
					</view>
					<view class="store-card-tags">
						<text class="store-tag" v-for="(t, i) in store.tags" :key="i">{{ t }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStoreList } from '@/api/store.js'

const statusBarHeight = ref(0)

// ==================== 门店列表 ====================
/** @type {Array} 门店列表 - 接口: GET /api/store/list */
const storeList = ref([
	{
		id: 1,
		name: '物沃宠物洗护中心（南山店）',
		image: '/static/bg/bg1.jpg',
		address: '深圳市南山区科技园南区深南大道9966号',
		distance: '3.6KM',
		tags: ['有车位', '有技师', 'WIFI覆盖']
	},
	{
		id: 2,
		name: '物沃宠物洗护中心（福田店）',
		image: '/static/bg/bg2.jpg',
		address: '深圳市福田区华强北路1019号',
		distance: '5.2KM',
		tags: ['有车位', 'WIFI覆盖']
	},
	{
		id: 3,
		name: '物沃宠物洗护中心（宝安店）',
		image: '/static/bg/bg1.jpg',
		address: '深圳市宝安区新安街道前进一路168号',
		distance: '8.1KM',
		tags: ['有技师', 'WIFI覆盖']
	}
])

// ==================== 生命周期 ====================
onMounted(() => {
	const sysInfo = uni.getSystemInfoSync()
	statusBarHeight.value = sysInfo.statusBarHeight || 0
	loadData()
})

/**
 * 加载门店列表
 * 接口: GET /api/store/list
 * @param {number} longitude - 经度
 * @param {number} latitude - 纬度
 */
const loadData = async () => {
	// TODO: const res = await getStoreList({ longitude, latitude })
	// if (res?.list) storeList.value = res.list
}

// ==================== 交互 ====================

/**
 * 跳转门店主页
 * 页面: /pages/index/index (门店主页)
 */
const goStoreDetail = (store) => {
	// TODO: 保存选中门店ID
	// uni.switchTab({ url: '/pages/index/index' })
	// 或者 navigateTo 到独立门店页
	uni.switchTab({ url: '/pages/index/index' })
}

const goBack = () => {
	uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss">
$primary: #91de00;
$primary-dark: #7bc400;
$primary-light: #e8f5cc;
$primary-bg: #f5fde6;

.page-store-list {
	min-height: 100vh;
	background: #f7f7f7;
}

/* 导航栏 */
.nav-bar {
	background: $primary;
	padding: 0 32rpx 20rpx;
}

.nav-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
}

.nav-back {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-arrow {
	font-size: 44rpx;
	color: #fff;
	font-weight: 300;
	line-height: 1;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.nav-placeholder {
	width: 60rpx;
}

/* 搜索栏 */
.search-bar {
	background: #fff;
	padding: 20rpx 24rpx;
}

.search-input {
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 999rpx;
	padding: 18rpx 32rpx;
}

.search-icon {
	font-size: 28rpx;
	margin-right: 12rpx;
}

.search-placeholder {
	font-size: 28rpx;
	color: #999;
}

/* 门店列表 */
.store-list {
	padding: 20rpx 24rpx;
}

.store-card {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 20rpx;

	&:active {
		opacity: 0.9;
	}
}

.store-card-img {
	width: 100%;
	height: 320rpx;
}

.store-img {
	width: 100%;
	height: 100%;
}

.store-card-info {
	padding: 24rpx 28rpx;
}

.store-card-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8rpx;
}

.store-card-name {
	font-size: 30rpx;
	font-weight: 700;
	color: #222;
	flex: 1;
	margin-right: 16rpx;
}

.store-card-dist {
	font-size: 24rpx;
	color: #999;
	flex-shrink: 0;
}

.store-card-addr {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.store-card-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.store-tag {
	font-size: 22rpx;
	color: $primary-dark;
	background: $primary-bg;
	padding: 4rpx 16rpx;
	border-radius: 8rpx;
}
</style>
