// api/user.js - 用户相关接口

/**
 * 获取用户信息
 * GET /api/user/info
 * @returns {Promise} 用户信息
 */
export const getUserInfo = () => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/user/info', method: 'GET' })

	return Promise.resolve({
		id: '100001',
		nickName: '宠物达人',
		avatarUrl: '',
		phone: '138****8888',
		balance: 865.50,
		couponCount: 3,
		isLogin: true
	})
}

/**
 * 获取用户手机号
 * POST /api/user/phone
 * @param {Object} data - { code }
 * @returns {Promise}
 */
export const getUserPhone = (data = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/user/phone', method: 'POST', data })

	return Promise.resolve({
		phone: '13888888888',
		message: '获取成功'
	})
}

/**
 * 获取协议内容
 * GET /api/user/agreement
 * @param {Object} params - { type: 'privacy'|'user' }
 * @returns {Promise} 协议内容
 */
export const getAgreement = (params = {}) => {
	// TODO: 替换为实际接口调用
	// return request({ url: '/api/user/agreement', method: 'GET', data: params })

	const agreements = {
		privacy: {
			title: '隐私协议',
			content: `<h1>物沃PET隐私协议</h1>
			<p>更新日期：2026年3月1日</p>
			<h2>一、信息收集</h2>
			<p>我们收集以下信息以便为您提供更好的服务：</p>
			<ul>
				<li>手机号码：用于登录和联系</li>
				<li>位置信息：用于查找附近门店和设备</li>
				<li>支付信息：用于完成交易</li>
			</ul>
			<h2>二、信息使用</h2>
			<p>我们使用收集的信息来：</p>
			<ul>
				<li>提供、维护和改进我们的服务</li>
				<li>处理交易和发送相关信息</li>
				<li>提供客户支持</li>
			</ul>
			<h2>三、信息保护</h2>
			<p>我们采取合理的安全措施保护您的个人信息。</p>`
		},
		user: {
			title: '用户协议',
			content: `<h1>物沃PET用户协议</h1>
			<p>更新日期：2026年3月1日</p>
			<h2>一、服务说明</h2>
			<p>物沃PET为您提供智能宠物洗护服务预约和使用功能。</p>
			<h2>二、用户注册</h2>
			<p>您需要注册并登录才能使用完整功能。</p>
			<h2>三、充值与支付</h2>
			<p>充值金额仅限在对应商家使用，充值金额永久有效。</p>
			<h2>四、免责声明</h2>
			<p>因不可抗力导致的服务中断，我们不承担责任。</p>`
		}
	}
	return Promise.resolve(agreements[params.type] || agreements.privacy)
}
