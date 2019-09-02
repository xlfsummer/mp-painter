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
		padding: 0 15upx;
	}
	.page-title {
		margin: 20upx 0 40upx;
		font-size: 40upx;
	}
	.link {
		margin: 20upx 0;
	}
	.h2 {
		color: #666;
		font-size: 30upx;
	}
	.canvas {
		margin: 30upx 0 40upx;
		border: 1upx solid #eee;
	}
</style>
