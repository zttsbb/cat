<!-- pages/withdraw/withdraw.vue -->
<!-- 提现 -->
<template>
	<view class="page-withdraw">
		<!-- 可提现余额 -->
		<view class="balance-card">
			<view class="balance-label">可提现余额</view>
			<view class="balance-amount">￥{{ availableBalance.toFixed(2) }}</view>
		</view>

		<!-- 提现金额输入 -->
		<view class="withdraw-section">
			<view class="input-wrap">
				<text class="input-prefix">￥</text>
				<input
					class="amount-input"
					type="digit"
					v-model="withdrawAmount"
					placeholder="请输入提现金额"
				/>
				<text class="input-all" @click="withdrawAll">全部提现</text>
			</view>
			<view class="fee-info">
				<text class="fee-text">*提现手续费2元/笔，节假日不可提现</text>
				<text class="fee-text" v-if="withdrawAmount">实际到账：￥{{ actualAmount.toFixed(2) }}</text>
			</view>
		</view>

		<!-- 提现按钮 -->
		<view class="submit-btn" :class="{ disabled: !canWithdraw }" @click="onWithdraw">确认提现</view>

		<!-- 绑定收款信息入口 -->
		<view class="bank-entry" @click="goBankInfo">
			<text class="entry-icon">🏦</text>
			<text class="entry-text">绑定收款信息</text>
			<text class="entry-arrow">›</text>
		</view>

		<!-- 提现记录 -->
		<view class="record-section">
			<view class="section-title">提现记录</view>
			<view class="record-list">
				<view class="record-item" v-for="record in withdrawRecords" :key="record.id">
					<view class="record-left">
						<text class="record-amount">-￥{{ record.actualAmount.toFixed(2) }}</text>
						<text class="record-fee">手续费￥{{ record.fee }}</text>
					</view>
					<view class="record-right">
						<text :class="['record-status', statusClass(record.status)]">{{ record.statusText }}</text>
						<text class="record-date">{{ record.applyTime }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProfitInfo, applyWithdraw, getWithdrawRecords } from '@/api/profit.js'

const availableBalance = ref(1680.50)
const withdrawAmount = ref('')
const withdrawRecords = ref([])

const actualAmount = computed(() => {
	const amount = parseFloat(withdrawAmount.value) || 0
	return Math.max(0, amount - 2)
})

const canWithdraw = computed(() => {
	const amount = parseFloat(withdrawAmount.value) || 0
	return amount > 0 && amount <= availableBalance.value
})

const statusClass = (status) => {
	const map = { 1: 'processing', 2: 'done', 3: 'rejected' }
	return map[status] || ''
}

const withdrawAll = () => {
	withdrawAmount.value = String(availableBalance.value)
}

onMounted(() => {
	loadData()
})

const loadData = async () => {
	// TODO: 调用实际接口
	const info = await getProfitInfo()
	if (info) availableBalance.value = info.availableBalance

	const records = await getWithdrawRecords({ page: 1, pageSize: 20 })
	withdrawRecords.value = records.list || []
}

const goBankInfo = () => {
	uni.navigateTo({ url: '/pages/bank-info/bank-info' })
}

const onWithdraw = async () => {
	if (!canWithdraw.value) {
		uni.showToast({ title: '请输入有效金额', icon: 'none' })
		return
	}
	// TODO: 调用提现接口
	const res = await applyWithdraw({ amount: parseFloat(withdrawAmount.value) })
	if (res) {
		uni.showToast({ title: res.message, icon: 'success' })
		withdrawAmount.value = ''
		loadData()
	}
}
</script>

<style lang="scss" scoped>
.page-withdraw {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 24rpx;
}

.balance-card {
	background: linear-gradient(135deg, #91de00, #a5e830);
	border-radius: 24rpx;
	padding: 40rpx 32rpx;
	margin-bottom: 24rpx;
}

.balance-label {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 12rpx;
}

.balance-amount {
	font-size: 56rpx;
	font-weight: 700;
	color: #fff;
}

.withdraw-section {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
}

.input-wrap {
	display: flex;
	align-items: center;
	border-bottom: 2rpx solid #f0f0f0;
	padding-bottom: 24rpx;
	margin-bottom: 16rpx;
}

.input-prefix {
	font-size: 48rpx;
	font-weight: 700;
	color: #333;
	margin-right: 16rpx;
}

.amount-input {
	flex: 1;
	font-size: 48rpx;
	font-weight: 700;
	color: #333;
}

.input-all {
	font-size: 26rpx;
	color: #91de00;
	padding: 8rpx 20rpx;
	border: 1rpx solid #91de00;
	border-radius: 999rpx;
}

.fee-info {
	.fee-text {
		display: block;
		font-size: 22rpx;
		color: #999;
		margin-bottom: 4rpx;
	}
}

.submit-btn {
	background: linear-gradient(135deg, #91de00, #a5e830);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	padding: 28rpx 0;
	border-radius: 999rpx;
	margin-bottom: 24rpx;

	&.disabled {
		opacity: 0.5;
	}
}

.bank-entry {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	display: flex;
	align-items: center;
}

.entry-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.entry-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.entry-arrow {
	font-size: 36rpx;
	color: #ccc;
}

.record-section {
	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 24rpx;
	}
}

.record-list {
	margin-bottom: 24rpx;
}

.record-item {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 28rpx 32rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.record-left {
	display: flex;
	flex-direction: column;
}

.record-amount {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 4rpx;
}

.record-fee {
	font-size: 22rpx;
	color: #999;
}

.record-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.record-status {
	font-size: 24rpx;
	margin-bottom: 4rpx;
	padding: 2rpx 12rpx;
	border-radius: 999rpx;

	&.processing { color: #ff9500; background-color: #fff3e8; }
	&.done { color: #91de00; background-color: #e8f8ee; }
	&.rejected { color: #ff4d4f; background-color: #ffe8e8; }
}

.record-date {
	font-size: 22rpx;
	color: #ccc;
}
</style>
