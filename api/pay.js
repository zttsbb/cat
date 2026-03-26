// api/pay.js - 支付相关接口

/**
 * 预充值
 * POST /api/pay/recharge
 * @param {Object} data - { amount, storeId, payMethod }
 * @returns {Promise}
 */
export const recharge = (data = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/pay/recharge', method: 'POST', data })

	return Promise.resolve({
		orderId: 'R20260326001',
		amount: data.amount || 50,
		message: '充值成功'
	})
}

/**
 * 获取钱包信息
 * GET /api/pay/wallet/info
 * @returns {Promise} 钱包信息
 */
export const getWalletInfo = () => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/pay/wallet/info', method: 'GET' })

	return Promise.resolve({
		balance: 56.89,
		storeBalances: [
			{ storeId: 1, storeName: '物沃宠物洗护中心（南山店）', balance: 30.00 },
			{ storeId: 2, storeName: '物沃宠物洗护中心（福田店）', balance: 26.89 }
		]
	})
}

/**
 * 获取充值金额列表
 * GET /api/pay/recharge/amounts
 * @returns {Promise} 充值金额选项
 */
export const getRechargeAmounts = () => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/pay/recharge/amounts', method: 'GET' })

	return Promise.resolve([
		{ amount: 50, label: '50元', bonus: 5, bonusLabel: '送5元' },
		{ amount: 100, label: '100元', bonus: 15, bonusLabel: '送15元' },
		{ amount: 200, label: '200元', bonus: 40, bonusLabel: '送40元' },
		{ amount: 500, label: '500元', bonus: 120, bonusLabel: '送120元' }
	])
}

/**
 * 设备扫码支付（预支付）
 * POST /api/pay/device/prepay
 * @param {Object} data - { deviceId, payMethod, couponId }
 * @returns {Promise} 支付信息
 */
export const devicePrepay = (data = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/pay/device/prepay', method: 'POST', data })

	return Promise.resolve({
		orderId: 'W20260327001',
		prepayAmount: 50,
		message: '预支付成功，请开始使用'
	})
}

/**
 * 获取可用优惠券列表（支付时选取）
 * GET /api/pay/coupon/available
 * @param {Object} params - { type: 'wash'|'book' }
 * @returns {Promise} 可用优惠券列表
 */
export const getAvailableCoupons = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/pay/coupon/available', method: 'GET', data: params })

	return Promise.resolve([
		{ id: 'C001', name: '洗宠优惠券', amount: 10, type: 'wash', expireDate: '2026-06-30' },
		{ id: 'C002', name: '新人专享券', amount: 5, type: 'wash', expireDate: '2026-04-30' }
	])
}
