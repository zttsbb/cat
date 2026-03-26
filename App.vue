<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from './store/index.js'

onLaunch(() => {
	console.log('App Launch')
	// 检查登录状态
	const userStore = useUserStore()
	userStore.checkLogin()
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})
</script>

<style lang="scss">
/* 全局样式 */
@import '@/uni.scss';

page {
	background-color: $bg-color;
	font-size: $font-size-md;
	color: $text-color;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 通用容器 */
.container {
	padding: $spacing-lg;
}

/* flex 布局 */
.flex-row {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.flex-col {
	display: flex;
	flex-direction: column;
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.flex-1 {
	flex: 1;
}

/* 文字省略 */
.ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.ellipsis-2 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

/* 安全距离 */
.safe-bottom {
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
</style>
