// auth.js - 登录授权工具

/**
 * 微信登录
 * POST /api/user/wxLogin
 */
export const wxLogin = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: async (loginRes) => {
				// TODO: 将 loginRes.code 发送到后端换取 openid 和 token
				// const res = await request({ url: '/api/user/wxLogin', method: 'POST', data: { code: loginRes.code } })
				console.log('微信登录code:', loginRes.code)
				// Mock: 模拟登录成功
				const mockData = {
					token: 'mock_token_xxx',
					userInfo: {
						id: '100001',
						nickName: '宠物达人',
						avatarUrl: '',
						phone: '138****8888',
						balance: 865.50,
						couponCount: 3
					}
				}
				// 存储登录信息
				uni.setStorageSync('token', mockData.token)
				uni.setStorageSync('userInfo', mockData.userInfo)
				resolve(mockData)
			},
			fail: (err) => {
				uni.showToast({ title: '登录失败', icon: 'none' })
				reject(err)
			}
		})
	})
}

/**
 * 检查是否已登录
 */
export const isLoggedIn = () => {
	const token = uni.getStorageSync('token')
	return !!token
}

/**
 * 退出登录
 * POST /api/user/logout
 */
export const logout = () => {
	uni.removeStorageSync('token')
	uni.removeStorageSync('userInfo')
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
	return uni.getStorageSync('userInfo') || null
}

/**
 * 检查登录状态，未登录则跳转登录
 */
export const checkLogin = () => {
	if (!isLoggedIn()) {
		return false
	}
	return true
}

/**
 * 需要登录的操作，未登录跳转到我的页面
 */
export const requireLogin = () => {
	if (!isLoggedIn()) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		uni.switchTab({ url: '/pages/mine/mine' })
		return false
	}
	return true
}
