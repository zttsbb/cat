// api/order.js - 订单相关接口

/**
 * 获取洗宠订单列表
 * GET /api/order/wash/list
 * @param {Object} params - { page, pageSize }
 * @returns {Promise} 订单列表
 */
export const getWashOrderList = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/order/wash/list', method: 'GET', data: params })

	return Promise.resolve({
		list: [
			{
				id: 'W20260326001',
				deviceName: '智能洗宠机A1',
				address: '深圳市南山区科技园南区深南大道9966号',
				totalAmount: 18.50,
				payAmount: 50.00,
				payMethod: '微信支付',
				payMethodType: 'wechat',
				status: 1, // 1=已完成 2=已退款 3=已取消 4=紧急终止
				statusText: '已完成',
				useType: '按量付费',
				totalDuration: 23, // 分钟
				createTime: '2026-03-26 14:30:00',
				prepayRefund: 31.50
			},
			{
				id: 'W20260325002',
				deviceName: '智能洗宠机A2',
				address: '深圳市南山区科技园南区深南大道9966号',
				totalAmount: 25.80,
				payAmount: 50.00,
				payMethod: '余额支付',
				payMethodType: 'balance',
				status: 2,
				statusText: '已退款',
				useType: '按量付费',
				totalDuration: 32,
				createTime: '2026-03-25 10:15:00',
				prepayRefund: 50.00
			},
			{
				id: 'W20260320003',
				deviceName: '智能洗宠机B1',
				address: '深圳市南山区科技园南区深南大道9966号',
				totalAmount: 12.00,
				payAmount: 50.00,
				payMethod: '微信支付',
				payMethodType: 'wechat',
				status: 1,
				statusText: '已完成',
				useType: '按量付费',
				totalDuration: 15,
				createTime: '2026-03-20 16:45:00',
				prepayRefund: 38.00
			}
		],
		total: 3
	})
}

/**
 * 获取洗宠订单详情
 * GET /api/order/wash/detail
 * @param {String} orderId - 订单ID
 * @returns {Promise} 订单详情
 */
export const getWashOrderDetail = (orderId) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/order/wash/detail', method: 'GET', data: { orderId } })

	return Promise.resolve({
		id: orderId || 'W20260326001',
		deviceName: '智能洗宠机A1',
		address: '深圳市南山区科技园南区深南大道9966号',
		totalAmount: 18.50,
		payAmount: 50.00,
		payMethod: '微信支付',
		payMethodType: 'wechat',
		payTradeNo: 'WX2026032614300012345',
		status: 1,
		statusText: '已完成',
		useType: '按量付费',
		totalDuration: 23,
		createTime: '2026-03-26 14:30:00',
		endTime: '2026-03-26 14:53:00',
		prepayRefund: 31.50,
		// 使用明细
		details: [
			{ name: '香波洗护', duration: 8, amount: 6.40 },
			{ name: '护毛护理', duration: 5, amount: 4.00 },
			{ name: '清水冲洗', duration: 6, amount: 4.80 },
			{ name: '消毒烘干', duration: 4, amount: 3.30 }
		]
	})
}

/**
 * 获取预约订单列表
 * GET /api/order/book/list
 * @param {Object} params - { page, pageSize, status }
 * @returns {Promise} 预约订单列表
 */
export const getBookOrderList = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/order/book/list', method: 'GET', data: params })

	return Promise.resolve({
		list: [
			{
				id: 'B20260326001',
				serviceType: '洗澡美容',
				description: '人工洗澡+修毛',
				amount: 30.00,
				payMethod: '余额支付',
				payMethodType: 'balance',
				status: 1, // 1=待使用 2=已完成 3=已取消
				statusText: '待使用',
				bookDate: '2026-03-28',
				bookTime: '10:00-12:00',
				storeName: '物沃宠物洗护中心（南山店）',
				createTime: '2026-03-26 09:30:00'
			},
			{
				id: 'B20260320002',
				serviceType: '洗澡美容',
				description: '人工洗澡+修毛',
				amount: 30.00,
				payMethod: '微信支付',
				payMethodType: 'wechat',
				status: 2,
				statusText: '已完成',
				bookDate: '2026-03-22',
				bookTime: '14:00-16:00',
				storeName: '物沃宠物洗护中心（南山店）',
				createTime: '2026-03-20 11:00:00'
			},
			{
				id: 'B20260315003',
				serviceType: '洗澡美容',
				description: '人工洗澡+修毛',
				amount: 30.00,
				payMethod: '卡券支付',
				payMethodType: 'coupon',
				status: 3,
				statusText: '已取消',
				bookDate: '2026-03-18',
				bookTime: '08:00-10:00',
				storeName: '物沃宠物洗护中心（福田店）',
				createTime: '2026-03-15 16:20:00'
			}
		],
		total: 3
	})
}

/**
 * 获取预约订单详情
 * GET /api/order/book/detail
 * @param {String} orderId - 订单ID
 * @returns {Promise} 预约订单详情
 */
export const getBookOrderDetail = (orderId) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/order/book/detail', method: 'GET', data: { orderId } })

	return Promise.resolve({
		id: orderId || 'B20260326001',
		serviceType: '洗澡美容',
		description: '人工洗澡+修毛',
		amount: 30.00,
		payMethod: '余额支付',
		payMethodType: 'balance',
		payTradeNo: 'BAL202603260930006789',
		status: 1,
		statusText: '待使用',
		bookDate: '2026-03-28',
		bookTime: '10:00-12:00',
		storeName: '物沃宠物洗护中心（南山店）',
		storeAddress: '深圳市南山区科技园南区深南大道9966号',
		remark: '金毛，大型犬',
		createTime: '2026-03-26 09:30:00'
	})
}

/**
 * 取消预约订单
 * POST /api/order/book/cancel
 * @param {String} orderId - 订单ID
 * @returns {Promise}
 */
export const cancelBookOrder = (orderId) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/order/book/cancel', method: 'POST', data: { orderId } })

	return Promise.resolve({ success: true, message: '取消成功' })
}

/**
 * 创建预约订单
 * POST /api/order/book/create
 * @param {Object} data - { serviceType, bookDate, bookTime, storeId, remark, payMethod, couponId }
 * @returns {Promise} 订单信息
 */
export const createBookOrder = (data = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/order/book/create', method: 'POST', data })

	return Promise.resolve({
		orderId: 'B20260326002',
		message: '预约成功'
	})
}
