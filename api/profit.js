// api/profit.js - 分账相关接口

/**
 * 获取分账中心信息
 * GET /api/profit/info
 * @returns {Promise} 分账概览
 */
export const getProfitInfo = () => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/profit/info', method: 'GET' })

	return Promise.resolve({
		deviceCount: 3,
		totalEarnings: 2680.50,
		availableBalance: 1680.50,
		frozenBalance: 1000.00
	})
}

/**
 * 获取分账记录列表
 * GET /api/profit/records
 * @param {Object} params - { page, pageSize }
 * @returns {Promise} 分账记录
 */
export const getProfitRecords = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/profit/records', method: 'GET', data: params })

	return Promise.resolve({
		list: [
			{
				id: 'P20260326001',
				deviceName: '智能洗宠机A1',
				orderId: 'W20260326001',
				orderStatus: '已完成',
				amount: 5.55,
				ratio: '30%',
				date: '2026-03-26 15:00:00'
			},
			{
				id: 'P20260325001',
				deviceName: '智能洗宠机A2',
				orderId: 'W20260325002',
				orderStatus: '已退款',
				amount: 7.74,
				ratio: '30%',
				date: '2026-03-25 11:00:00'
			},
			{
				id: 'P20260324001',
				deviceName: '智能洗宠机A1',
				orderId: 'W20260324003',
				orderStatus: '已完成',
				amount: 9.30,
				ratio: '30%',
				date: '2026-03-24 18:30:00'
			},
			{
				id: 'P20260323001',
				deviceName: '智能洗宠机B1',
				orderId: 'W20260323004',
				orderStatus: '已完成',
				amount: 4.50,
				ratio: '30%',
				date: '2026-03-23 14:00:00'
			}
		],
		total: 4
	})
}

/**
 * 申请提现
 * POST /api/profit/withdraw
 * @param {Object} data - { amount, bankInfo }
 * @returns {Promise} 提现结果
 */
export const applyWithdraw = (data = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/profit/withdraw', method: 'POST', data })

	return Promise.resolve({
		withdrawId: 'WD20260326001',
		amount: data.amount || 500,
		fee: 2,
		actualAmount: (data.amount || 500) - 2,
		message: '提现申请已提交，预计1-3个工作日到账'
	})
}

/**
 * 获取提现记录
 * GET /api/profit/withdraw/records
 * @param {Object} params - { page, pageSize }
 * @returns {Promise} 提现记录
 */
export const getWithdrawRecords = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/profit/withdraw/records', method: 'GET', data: params })

	return Promise.resolve({
		list: [
			{
				id: 'WD20260320001',
				amount: 500,
				fee: 2,
				actualAmount: 498,
				status: 1, // 1=处理中 2=已到账 3=已驳回
				statusText: '已到账',
				applyTime: '2026-03-20 10:00:00',
				arriveTime: '2026-03-21 14:30:00'
			},
			{
				id: 'WD20260310002',
				amount: 300,
				fee: 2,
				actualAmount: 298,
				status: 2,
				statusText: '已到账',
				applyTime: '2026-03-10 09:00:00',
				arriveTime: '2026-03-11 16:00:00'
			}
		],
		total: 2
	})
}

/**
 * 获取收款信息
 * GET /api/profit/bank/info
 * @returns {Promise} 收款信息
 */
export const getBankInfo = () => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/profit/bank/info', method: 'GET' })

	return Promise.resolve({
		realName: '张三',
		phone: '13888888888',
		bankName: '中国工商银行',
		bankCardNo: '6222********1234',
		bankBranch: '深圳南山支行',
		bankCode: 'ICBC',
		idCardFront: '/static/images/id-front.png',
		idCardBack: '/static/images/id-back.png',
		bankCardFront: '/static/images/bank-card.png'
	})
}

/**
 * 保存收款信息
 * POST /api/profit/bank/save
 * @param {Object} data - 收款信息
 * @returns {Promise}
 */
export const saveBankInfo = (data = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/profit/bank/save', method: 'POST', data })

	return Promise.resolve({
		success: true,
		message: '收款信息保存成功'
	})
}
