<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<canvas canvas-id="canvas" />
		<view>
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	import Paint from "mp-painter";

	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		async onLoad() {
			// await 1;
		},
		onReady(){
			let ctx = uni.createCanvasContext("canvas");
			
			let painter = new Paint(ctx, {
				upx2px: uni.upx2px,
			});

			ctx.fillStyle = "red";
			ctx.fillRect(10, 10, 20, 20);

			painter.draw({
				"type": "container",
				top: 40,
				left: 40,
				children: [
					{
						"type": "text",
						content: "Hello World",
						fontSize: 60,
						fontWeight: "bold"
					},
					{
						"type": "text",
						content: "Lorem ipsum",
						fontSize: 30
					},
					{
						"type": "image",
						width: 100,
						height: 100,
						top: 20,
						src: "https://vuejs.org/images/logo.png",
					},
					{
						type: "container",
						direction: "horizontal",
						children: [
							{type: "text", content: "horizontal"},
							{type: "rect", left: 20, width: 20, height: 20, background: "red"},
							{type: "text", left: 20, content: "content"}
						]
					},
				]
			});
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
