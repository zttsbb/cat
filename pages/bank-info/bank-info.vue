<!-- pages/bank-info/bank-info.vue -->
<!-- 绑定收款信息 -->
<template>
	<view class="page-bank-info">
		<!-- 表单 -->
		<view class="form-section">
			<view class="section-title">收款信息</view>

			<view class="form-item">
				<text class="form-label">真实姓名</text>
				<input class="form-input" v-model="form.realName" placeholder="请输入真实姓名" />
			</view>

			<view class="form-item">
				<text class="form-label">手机号</text>
				<input class="form-input" v-model="form.phone" placeholder="请输入手机号" type="number" maxlength="11" />
			</view>

			<view class="form-item">
				<text class="form-label">所属银行</text>
				<input class="form-input" v-model="form.bankName" placeholder="请输入所属银行" />
			</view>

			<view class="form-item">
				<text class="form-label">银行卡号</text>
				<input class="form-input" v-model="form.bankCardNo" placeholder="请输入银行卡号" type="number" />
			</view>

			<view class="form-item">
				<text class="form-label">开户行</text>
				<input class="form-input" v-model="form.bankBranch" placeholder="请输入开户行" />
			</view>

			<view class="form-item">
				<text class="form-label">银行编号</text>
				<input class="form-input" v-model="form.bankCode" placeholder="请输入银行编号" />
			</view>
		</view>

		<!-- 证件照片 -->
		<view class="photo-section">
			<view class="section-title">证件照片</view>

			<view class="photo-item">
				<text class="photo-label">身份证正面</text>
				<view class="photo-upload" @click="uploadPhoto('idCardFront')">
					<image v-if="form.idCardFront" :src="form.idCardFront" mode="aspectFill" class="photo-preview" />
					<view v-else class="photo-placeholder">
						<text class="plus-icon">+</text>
						<text class="photo-tip">上传照片</text>
					</view>
				</view>
			</view>

			<view class="photo-item">
				<text class="photo-label">身份证反面</text>
				<view class="photo-upload" @click="uploadPhoto('idCardBack')">
					<image v-if="form.idCardBack" :src="form.idCardBack" mode="aspectFill" class="photo-preview" />
					<view v-else class="photo-placeholder">
						<text class="plus-icon">+</text>
						<text class="photo-tip">上传照片</text>
					</view>
				</view>
			</view>

			<view class="photo-item">
				<text class="photo-label">银行卡正面</text>
				<view class="photo-upload" @click="uploadPhoto('bankCardFront')">
					<image v-if="form.bankCardFront" :src="form.bankCardFront" mode="aspectFill" class="photo-preview" />
					<view v-else class="photo-placeholder">
						<text class="plus-icon">+</text>
						<text class="photo-tip">上传照片</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 确认按钮 -->
		<view class="submit-btn" @click="onSubmit">确认收款信息</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBankInfo, saveBankInfo } from '@/api/profit.js'

const form = ref({
	realName: '',
	phone: '',
	bankName: '',
	bankCardNo: '',
	bankBranch: '',
	bankCode: '',
	idCardFront: '',
	idCardBack: '',
	bankCardFront: ''
})

onMounted(() => {
	loadData()
})

const loadData = async () => {
	// TODO: 加载已保存的收款信息
	// const res = await getBankInfo()
	// if (res) form.value = { ...form.value, ...res }
}

const uploadPhoto = (field) => {
	// TODO: 调用图片上传
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			form.value[field] = res.tempFilePaths[0]
		}
	})
}

const onSubmit = async () => {
	// 表单验证
	if (!form.value.realName) {
		uni.showToast({ title: '请输入真实姓名', icon: 'none' })
		return
	}
	if (!form.value.phone || form.value.phone.length !== 11) {
		uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
		return
	}
	if (!form.value.bankCardNo) {
		uni.showToast({ title: '请输入银行卡号', icon: 'none' })
		return
	}

	// TODO: 调用保存接口
	const res = await saveBankInfo(form.value)
	if (res) {
		uni.showToast({ title: res.message, icon: 'success' })
		uni.navigateBack()
	}
}
</script>

<style lang="scss" scoped>
.page-bank-info {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 24rpx;
	padding-bottom: 140rpx;
}

.form-section,
.photo-section {
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

.form-item {
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.form-label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 12rpx;
	display: block;
}

.form-input {
	height: 72rpx;
	font-size: 28rpx;
	color: #333;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	padding: 0 20rpx;
}

.photo-item {
	margin-bottom: 32rpx;

	&:last-child {
		margin-bottom: 0;
	}
}

.photo-label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 16rpx;
	display: block;
}

.photo-upload {
	width: 100%;
	height: 240rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.photo-preview {
	width: 100%;
	height: 100%;
}

.photo-placeholder {
	width: 100%;
	height: 100%;
	background-color: #f8f8f8;
	border: 2rpx dashed #ddd;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.plus-icon {
	font-size: 56rpx;
	color: #ccc;
	margin-bottom: 8rpx;
}

.photo-tip {
	font-size: 24rpx;
	color: #999;
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
