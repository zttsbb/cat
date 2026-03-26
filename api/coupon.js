// api/coupon.js - 卡券相关接口

/**
 * 核销团购券
 * POST /api/coupon/redeem
 * @param {Object} data - { redeemCode }
 * @returns {Promise} 核销结果
 */
export const redeemCoupon = (data = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/coupon/redeem', method: 'POST', data })

	return Promise.resolve({
		couponId: 'CP20260326001',
		source: '美团',
		type: '次卡',
		faceValue: 100,
		totalTimes: 10,
		remainTimes: 10,
		scope: '洗宠机全部服务可用',
		expireDate: '2026-09-26',
		message: '核销成功'
	})
}

/**
 * 获取卡券列表
 * GET /api/coupon/list
 * @param {Object} params - { page, pageSize, status }
 * @returns {Promise} 卡券列表
 */
export const getCouponList = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/coupon/list', method: 'GET', data: params })

	return Promise.resolve({
		list: [
			{
				id: 'CP20260326001',
				source: '美团',
				type: '次卡',
				faceValue: 100,
				totalTimes: 10,
				remainTimes: 10,
				scope: '洗宠机全部服务可用',
				expireDate: '2026-09-26',
				status: 1, // 1=可使用 2=已到期 3=已过期
				statusText: '可使用',
				createTime: '2026-03-26 10:00:00'
			},
			{
				id: 'CP20260320002',
				source: '抖音',
				type: '次卡',
				faceValue: 50,
				totalTimes: 5,
				remainTimes: 3,
				scope: '洗澡美容专用',
				expireDate: '2026-06-20',
				status: 1,
				statusText: '可使用',
				createTime: '2026-03-20 15:30:00'
			},
			{
				id: 'CP20260310003',
				source: '系统',
				type: '次卡',
				faceValue: 30,
				totalTimes: 3,
				remainTimes: 0,
				scope: '洗宠机全部服务可用',
				expireDate: '2026-04-10',
				status: 2,
				statusText: '已到期',
				createTime: '2026-03-10 09:00:00'
			},
			{
				id: 'CP20260215004',
				source: '美团',
				type: '次卡',
				faceValue: 80,
				totalTimes: 8,
				remainTimes: 2,
				scope: '消毒烘干专用',
				expireDate: '2026-02-15',
				status: 3,
				statusText: '已过期',
				createTime: '2026-01-15 12:00:00'
			}
		],
		total: 4
	})
}
