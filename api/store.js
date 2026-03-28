// api/store.js - 门店相关接口

/**
 * 获取门店列表
 * GET /api/store/list
 * @param {Object} params - { longitude, latitude, page, pageSize }
 * @returns {Promise} 门店列表
 */
export const getStoreList = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/store/list', method: 'GET', data: params })

	// Mock 数据
	return Promise.resolve({
		list: [
			{
				id: 1,
				name: '物沃宠物洗护中心（南山店）',
				image: '/static/images/store-1.png',
				tags: ['有车位', '有技师', 'WIFI覆盖'],
				distance: '3.6KM',
				address: '深圳市南山区科技园南区深南大道9966号',
				latitude: 22.5431,
				longitude: 113.9509,
				deviceCount: 5,
				phone: '0755-88888888'
			},
			{
				id: 2,
				name: '物沃宠物洗护中心（福田店）',
				image: '/static/images/store-2.png',
				tags: ['有车位', 'WIFI覆盖'],
				distance: '5.2KM',
				address: '深圳市福田区华强北路1019号',
				latitude: 22.5461,
				longitude: 114.0846,
				deviceCount: 3,
				phone: '0755-66666666'
			},
			{
				id: 3,
				name: '物沃宠物洗护中心（宝安店）',
				image: '/static/images/store-3.png',
				tags: ['有技师', 'WIFI覆盖'],
				distance: '8.1KM',
				address: '深圳市宝安区新安街道前进一路168号',
				latitude: 22.5529,
				longitude: 113.8830,
				deviceCount: 4,
				phone: '0755-77777777'
			}
		],
		total: 3
	})
}

/**
 * 获取门店详情
 * GET /api/store/detail
 * @param {String} storeId - 门店ID
 * @returns {Promise} 门店详情
 */
export const getStoreDetail = (storeId) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/store/detail', method: 'GET', data: { storeId } })

	return Promise.resolve({
		id: storeId || 1,
		name: '物沃宠物洗护中心（南山店）',
		image: '/static/images/store-1.png',
		images: [
			'/static/images/store-1.png',
			'/static/images/store-2.png',
			'/static/images/store-3.png'
		],
		tags: ['有车位', '有技师', 'WIFI覆盖'],
		distance: '3.6KM',
		address: '深圳市南山区科技园南区深南大道9966号',
		latitude: 22.5431,
		longitude: 113.9509,
		deviceCount: 5,
		phone: '0755-88888888',
		businessHours: '08:00 - 22:00',
		description: '专业宠物洗护，自助智能洗宠机，让爱宠享受SPA级体验。'
	})
}

/**
 * 获取门店设备列表
 * GET /api/store/devices
 * @param {String} storeId - 门店ID
 * @returns {Promise} 设备列表
 */
export const getStoreDevices = (storeId) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/store/devices', method: 'GET', data: { storeId } })

	return Promise.resolve([
		{
			id: 101,
			name: '智能洗宠机A1',
			storeName: '物沃宠物洗护中心（南山店）',
			address: '深圳市南山区科技园南区深南大道9966号',
			status: 1, // 1=可用 2=使用中 3=维护中
			statusText: '可使用',
			pricePerMinute: 0.8,
			distance: '3.6KM'
		},
		{
			id: 102,
			name: '智能洗宠机A2',
			storeName: '物沃宠物洗护中心（南山店）',
			address: '深圳市南山区科技园南区深南大道9966号',
			status: 2,
			statusText: '使用中',
			pricePerMinute: 1.0,
			distance: '3.6KM'
		},
		{
			id: 103,
			name: '智能洗宠机B1',
			storeName: '物沃宠物洗护中心（南山店）',
			address: '深圳市南南区科技园南区深南大道9966号',
			status: 1,
			statusText: '可使用',
			pricePerMinute: 1.2,
			distance: '3.6KM'
		}
	])
}

/**
 * 获取设备详情
 * GET /api/device/detail
 * @param {String} deviceId - 设备ID
 * @returns {Promise} 设备详情
 */
export const getDeviceDetail = (deviceId) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/device/detail', method: 'GET', data: { deviceId } })

	return Promise.resolve({
		id: deviceId || 101,
		name: '智能洗宠机A1',
		storeName: '物沃宠物洗护中心（南山店）',
		storeId: 1,
		address: '深圳市南山区科技园南区深南大道9966号',
		status: 1,
		statusText: '可使用',
		pricePerMinute: 0.8,
		distance: '3.6KM',
		prepayAmount: 50,
		features: ['香波洗护', '护毛护理', '清水冲洗', '消毒烘干']
	})
}

/**
 * 获取附近设备
 * GET /api/device/nearby
 * @param {Object} params - { longitude, latitude }
 * @returns {Promise} 附近设备列表
 */
export const getNearbyDevices = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/device/nearby', method: 'GET', data: params })

	return Promise.resolve([
		{
			id: 101,
			name: '智能洗宠机A1',
			address: '深圳市南山区科技园南区深南大道9966号',
			status: 1,
			statusText: '可使用',
			pricePerMinute: 0.8,
			distance: '3.6KM'
		},
		{
			id: 104,
			name: '智能洗宠机C1',
			address: '深圳市福田区华强北路1019号',
			status: 1,
			statusText: '可使用',
			pricePerMinute: 1.0,
			distance: '5.2KM'
		}
	])
}

/**
 * 获取设备列表（按门店）
 * GET /api/device/list
 * @param {Object} params - { storeId, status }
 * @returns {Promise} 设备列表
 */
export const getDeviceList = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/device/list', method: 'GET', data: params })

	return Promise.resolve([
		{
			id: 101,
			name: '智能洗宠机A1',
			address: '合肥市新站区新海大道5号...',
			status: 1,
			statusText: '可使用',
			priceRange: '0.8-1.2',
			storeId: params.storeId || 1
		},
		{
			id: 102,
			name: '智能洗宠机A2',
			address: '合肥市新站区新海大道5号...',
			status: 1,
			statusText: '可使用',
			priceRange: '0.8-1.2',
			storeId: params.storeId || 1
		}
	])
}

/**
 * 获取轮播图列表
 * GET /api/store/banners
 * @param {Object} params - { storeId }
 * @returns {Promise} 轮播图列表
 */
export const getBannerList = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/store/banners', method: 'GET', data: params })

	return Promise.resolve([
		{ id: 1, image: '/banner/banner1.jpg', link: '', title: '轮播图1' },
		{ id: 2, image: '/banner/banner2.jpg', link: '', title: '轮播图2' },
		{ id: 3, image: '/banner/banner3.jpg', link: '', title: '轮播图3' }
	])
}

/**
 * 扫码获取设备/订单信息
 * GET /api/scan/parse
 * @param {String} code - 扫码结果
 * @returns {Promise} 扫码解析结果
 */
export const scanQRCode = (code) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/scan/parse', method: 'GET', data: { code } })

	return Promise.resolve({
		type: 'device',
		deviceId: 101,
		deviceName: '智能洗宠机A1',
		storeId: 1,
		storeName: '物沃宠物洗护中心（南山店）'
	})
}
