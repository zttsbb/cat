<!-- pages/book-service/book-service.vue -->
<!-- 预约服务 -->
<template>
	<view class="page-book-service">
		<!-- 套餐选择 -->
		<view class="package-section">
			<view class="section-title">选择套餐</view>
			<view class="package-card">
				<view class="package-info">
					<view class="package-name">洗澡美容</view>
					<view class="package-desc">人工洗澡 + 修毛</view>
				</view>
				<view class="package-price">￥30.00</view>
			</view>
		</view>

		<!-- 日期选择 -->
		<view class="date-section">
			<view class="section-title">选择日期</view>
			<scroll-view scroll-x class="date-scroll">
				<view class="date-list">
					<view
						:class="['date-item', { active: selectedDate === index }]"
						v-for="(item, index) in dateList"
						:key="index"
						@click="selectDate(index)"
					>
						<text class="date-week">{{ item.week }}</text>
						<text class="date-day">{{ item.day }}</text>
						<text class="date-month">{{ item.month }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 时段选择 -->
		<view class="time-section">
			<view class="section-title">选择时段</view>
			<view class="time-grid">
				<view
					:class="['time-item', { active: selectedTime === item, disabled: item === '12:00' }]"
					v-for="item in timeSlots"
					:key="item"
					@click="selectTime(item)"
				>
					<text>{{ item }}</text>
				</view>
			</view>
		</view>

		<!-- 备注 -->
		<view class="remark-section">
			<view class="section-title">备注</view>
			<textarea
				class="remark-input"
				v-model="remark"
				placeholder="请输入备注信息，如宠物品种、大小等"
				maxlength="200"
			/>
		</view>

		<!-- 确认下单 -->
		<view class="submit-btn" @click="onSubmit">确认下单</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedDate = ref(0)
const selectedTime = ref('')
const remark = ref('')

// 生成日期列表（未来7天）
const dateList = ref([])
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const initDateList = () => {
	const list = []
	for (let i = 0; i < 7; i++) {
		const date = new Date()
		date.setDate(date.getDate() + i)
		list.push({
			week: i === 0 ? '今天' : weekDays[date.getDay()],
			day: date.getDate(),
			month: (date.getMonth() + 1) + '月',
			dateStr: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		})
	}
	dateList.value = list
}

initDateList()

const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00']

const selectDate = (index) => {
	selectedDate.value = index
}

const selectTime = (time) => {
	if (time === '12:00') {
		uni.showToast({ title: '该时段已约满', icon: 'none' })
		return
	}
	selectedTime.value = time
}

const onSubmit = () => {
	if (!selectedTime.value) {
		uni.showToast({ title: '请选择时段', icon: 'none' })
		return
	}
	const dateInfo = dateList.value[selectedDate.value]
	uni.navigateTo({
		url: `/pages/book-confirm/book-confirm?date=${dateInfo.dateStr}&time=${selectedTime.value}`
	})
}
</script>

<style lang="scss" scoped>
.page-book-service {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 24rpx;
	padding-bottom: 140rpx;
}

.package-section,
.date-section,
.time-section,
.remark-section {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.package-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx;
	background-color: #e8f8ee;
	border-radius: 16rpx;
	border: 2rpx solid #07C160;
}

.package-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 8rpx;
}

.package-desc {
	font-size: 24rpx;
	color: #999;
}

.package-price {
	font-size: 40rpx;
	font-weight: 700;
	color: #ff4d4f;
}

.date-scroll {
	white-space: nowrap;
}

.date-list {
	display: inline-flex;
	gap: 20rpx;
}

.date-item {
	width: 120rpx;
	padding: 20rpx 0;
	text-align: center;
	border-radius: 16rpx;
	border: 2rpx solid #e0e0e0;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;

	&.active {
		border-color: #07C160;
		background-color: #e8f8ee;
	}
}

.date-week {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 8rpx;
}

.active .date-week {
	color: #07C160;
}

.date-day {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
	margin-bottom: 4rpx;
}

.date-month {
	font-size: 22rpx;
	color: #999;
}

.time-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.time-item {
	width: calc(33.33% - 14rpx);
	text-align: center;
	padding: 24rpx 0;
	border-radius: 16rpx;
	border: 2rpx solid #e0e0e0;
	font-size: 28rpx;
	color: #333;

	&.active {
		border-color: #07C160;
		background-color: #e8f8ee;
		color: #07C160;
	}

	&.disabled {
		border-color: #f0f0f0;
		background-color: #f8f8f8;
		color: #ccc;
	}
}

.remark-input {
	width: 100%;
	height: 160rpx;
	font-size: 28rpx;
	color: #333;
	background-color: #f5f5f5;
	border-radius: 16rpx;
	padding: 20rpx;
	box-sizing: border-box;
}

.submit-btn {
	position: fixed;
	bottom: 40rpx;
	left: 24rpx;
	right: 24rpx;
	background: linear-gradient(135deg, #07C160, #38d976);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 28rpx 0;
	border-radius: 999rpx;
}
</style>
