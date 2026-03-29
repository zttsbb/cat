<!-- pages/profile/profile.vue -->
<!-- 个人信息编辑 -->
<template>
	<view class="page-profile">
		<!-- 头像区域 -->
		<view class="avatar-section">
			<view class="avatar-wrap" @click="chooseAvatar">
				<image v-if="form.avatarUrl" class="avatar-img" :src="form.avatarUrl" mode="aspectFill" />
				<text v-else class="avatar-placeholder">👤</text>
				<view class="avatar-edit-badge">
					<text class="badge-text">换</text>
				</view>
			</view>
			<text class="avatar-tip">点击更换头像</text>
		</view>

		<!-- 表单区域 -->
		<view class="form-section">
			<view class="form-item">
				<text class="form-label">昵称</text>
				<input class="form-input" v-model="form.nickName" placeholder="请输入昵称" maxlength="20" />
			</view>
			<view class="form-item">
				<text class="form-label">手机号</text>
				<input class="form-input" v-model="form.phone" placeholder="请输入手机号" type="number" maxlength="11" />
			</view>
		</view>

		<!-- 保存按钮 -->
		<view class="save-section">
			<view class="save-btn" @click="onSave">
				<text class="save-text">保存</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/index.js'
import { updateUserInfo, uploadAvatar } from '@/api/user.js'

const userStore = useUserStore()

const form = ref({
	avatarUrl: '',
	nickName: '',
	phone: ''
})

onLoad(() => {
	const info = userStore.userInfo || {}
	form.value = {
		avatarUrl: info.avatarUrl || '',
		nickName: info.nickName || '',
		phone: info.phone || ''
	}
})

// 选择头像
const chooseAvatar = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			form.value.avatarUrl = res.tempFilePaths[0]
		}
	})
}

// 保存
const onSave = () => {
	if (!form.value.nickName.trim()) {
		uni.showToast({ title: '请输入昵称', icon: 'none' })
		return
	}
	if (form.value.phone && !/^1\d{10}$/.test(form.value.phone)) {
		uni.showToast({ title: '手机号格式不正确', icon: 'none' })
		return
	}
	// TODO: 调用保存接口
	// updateUserInfo(form.value).then(...)
	userStore.updateUserInfo(form.value)
	uni.showToast({ title: '保存成功', icon: 'success' })
	setTimeout(() => {
		uni.navigateBack()
	}, 1000)
}
</script>

<style lang="scss" scoped>
.page-profile {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 头像 */
.avatar-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0 40rpx;
	background-color: #fff;
}

.avatar-wrap {
	position: relative;
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	overflow: hidden;
	border: 4rpx solid #91de00;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

.avatar-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 72rpx;
	background-color: #f5f5f5;
}

.avatar-edit-badge {
	position: absolute;
	bottom: 4rpx;
	right: 4rpx;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background-color: #91de00;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #fff;
}

.badge-text {
	font-size: 20rpx;
	color: #fff;
	font-weight: 600;
}

.avatar-tip {
	margin-top: 16rpx;
	font-size: 24rpx;
	color: #999;
}

/* 表单 */
.form-section {
	background-color: #fff;
	margin-top: 24rpx;
	padding: 0 32rpx;
}

.form-item {
	display: flex;
	align-items: center;
	padding: 28rpx 0;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}
}

.form-label {
	width: 140rpx;
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	flex-shrink: 0;
}

.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: right;
}

/* 保存按钮 */
.save-section {
	padding: 60rpx 32rpx;
}

.save-btn {
	background: linear-gradient(135deg, #91de00, #a5e830);
	border-radius: 999rpx;
	padding: 24rpx 0;
	text-align: center;

	&:active {
		opacity: 0.9;
	}
}

.save-text {
	font-size: 32rpx;
	font-weight: 600;
	color: #fff;
}
</style>
