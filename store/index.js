// store/index.js - Pinia 状态管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isLoggedIn, getUserInfo, wxLogin, logout } from '../utils/auth.js'

// 用户状态
export const useUserStore = defineStore('user', () => {
	const token = ref(uni.getStorageSync('token') || '')
	const userInfo = ref(uni.getStorageSync('userInfo') || null)

	// 是否已登录
	const isLoggedInFlag = computed(() => !!token.value)

	// 账户余额
	const balance = computed(() => userInfo.value?.balance || 0)

	// 卡券数量
	const couponCount = computed(() => userInfo.value?.couponCount || 0)

	// 检查登录状态
	const checkLogin = () => {
		if (isLoggedIn()) {
			token.value = uni.getStorageSync('token')
			userInfo.value = getUserInfo()
		}
	}

	// 微信登录
	const login = async () => {
		try {
			const res = await wxLogin()
			token.value = res.token
			userInfo.value = res.userInfo
			return res
		} catch (e) {
			console.error('登录失败:', e)
			throw e
		}
	}

	// 退出登录
	const logoutAction = () => {
		logout()
		token.value = ''
		userInfo.value = null
	}

	// 更新余额
	const updateBalance = (newBalance) => {
		if (userInfo.value) {
			userInfo.value.balance = newBalance
			uni.setStorageSync('userInfo', userInfo.value)
		}
	}

	// 更新卡券数量
	const updateCouponCount = (count) => {
		if (userInfo.value) {
			userInfo.value.couponCount = count
			uni.setStorageSync('userInfo', userInfo.value)
		}
	}

	return {
		token,
		userInfo,
		isLoggedInFlag,
		balance,
		couponCount,
		checkLogin,
		login,
		logoutAction,
		updateBalance,
		updateCouponCount
	}
})

// 设备状态
export const useDeviceStore = defineStore('device', () => {
	const currentDevice = ref(null)
	const nearbyDevices = ref([])

	const setCurrentDevice = (device) => {
		currentDevice.value = device
	}

	const setNearbyDevices = (devices) => {
		nearbyDevices.value = devices
	}

	return {
		currentDevice,
		nearbyDevices,
		setCurrentDevice,
		setNearbyDevices
	}
})
