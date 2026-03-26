// request.js - 请求封装
// 基于uni.request封装，支持拦截器、错误处理

const BASE_URL = 'https://api.example.com' // TODO: 替换为实际接口地址

// 请求拦截器
const requestInterceptor = (config) => {
	// 添加token
	const token = uni.getStorageSync('token')
	if (token) {
		config.header = config.header || {}
		config.header['Authorization'] = `Bearer ${token}`
	}
	return config
}

// 响应拦截器
const responseInterceptor = (response) => {
	const { statusCode, data } = response
	if (statusCode === 200) {
		if (data.code === 0 || data.code === 200) {
			return data.data
		}
		// 业务错误
		uni.showToast({
			title: data.msg || '请求失败',
			icon: 'none'
		})
		return Promise.reject(data)
	}
	// HTTP错误
	uni.showToast({
		title: `请求错误(${statusCode})`,
		icon: 'none'
	})
	return Promise.reject(response)
}

/**
 * 封装请求方法
 * @param {Object} options 请求配置
 * @param {String} options.url 请求地址
 * @param {String} options.method 请求方法 GET/POST/PUT/DELETE
 * @param {Object} options.data 请求数据
 * @param {Object} options.header 请求头
 * @param {Boolean} options.loading 是否显示loading
 * @returns {Promise}
 */
export const request = (options) => {
	// 请求拦截
	const config = requestInterceptor(options)

	if (config.loading !== false) {
		uni.showLoading({ title: '加载中...', mask: true })
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + config.url,
			method: config.method || 'GET',
			data: config.data || {},
			header: {
				'Content-Type': 'application/json',
				...config.header
			},
			success: (res) => {
				responseInterceptor(res).then(resolve).catch(reject)
			},
			fail: (err) => {
				uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
				reject(err)
			},
			complete: () => {
				if (config.loading !== false) {
					uni.hideLoading()
				}
			}
		})
	})
}

export default request
