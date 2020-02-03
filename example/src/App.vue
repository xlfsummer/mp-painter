<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */

	.page{
		padding: 0 15rpx;
	}
	.page-title {
		margin: 20rpx 0 40rpx;
		font-size: 40rpx;
	}
	.link {
		margin: 20rpx 0;
	}
	.h2 {
		color: #666;
		font-size: 30rpx;
	}
	.canvas {
		width: 730rpx;
		height: 200rpx;
		margin: 30rpx 0 40rpx;
		border: 1rpx solid #eee;
	}
</style>
