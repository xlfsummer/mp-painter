<template>
	<view class="page">
		<view class="page-title h1">mp-painter 示例</view>
		<view class="page-title h2">字号</view>
		<canvas canvas-id="canvas-font-size" class="canvas" style="height: 200upx"/>
		<view class="page-title h2">文字颜色</view>
		<canvas canvas-id="canvas-font-color" class="canvas" style="height: 220upx"/>
		<view class="page-title h2">文字样式</view>
		<canvas canvas-id="canvas-font-style" class="canvas" style="height: 90upx"/>
		<view class="page-title h2">矩形</view>
		<canvas canvas-id="canvas-rect" class="canvas" style="height: 230upx"/>
		<view class="page-title h2">图片</view>
		<canvas canvas-id="canvas-image" class="canvas" style="height: 230upx"/>
	</view>
</template>

<script>
	import Painter from "mp-painter";

	export default {
		data() {
			return {};
		},
		async onLoad() {
			// await 1;
		},
		onReady(){
			new Painter(
				uni.createCanvasContext("canvas-font-size"),
				{ upx2px: uni.upx2px }
			).draw({
				type: "container",
				top: 5,
				left: 15,
				children: [
					{type: "text", top: 10, fontSize: 60, content: "60px 文字"},
					{type: "text", top: 10, fontSize: 40, content: "40px 文字"},
					{type: "text", top: 10, fontSize: 20, content: "20px 文字"},
					{type: "text", top: 10, fontSize: 10, content: "10px 文字"}
				] 
			});

			new Painter(
				uni.createCanvasContext("canvas-font-color"),
				{ upx2px: uni.upx2px }
			).draw({
				type: "container",
				top: 5,
				left: 15,
				children: [
					{type: "text", top: 10, fontSize: 30, color: "red", content: "red"},
					{type: "text", top: 10, fontSize: 30, color: "#0f0", content: "#0f0"},
					{type: "text", top: 10, fontSize: 30, color: "#0033cc", content: "#0033cc"},
					{type: "text", top: 10, fontSize: 30, color: "rgb(255, 0, 255)", content: "rgb(255, 0, 255)"},
					{type: "text", top: 10, fontSize: 30, color: "rgba(0, 0, 0, 0.5)", content: "rgba(0, 0, 0, 0.5)"}
				] 
			});

			new Painter(
				uni.createCanvasContext("canvas-font-style"),
				{ upx2px: uni.upx2px }
			).draw({
				type: "container",
				top: 5,
				left: 15,
				children: [
					{type: "text", top: 10, fontSize: 30, content: "正常 normal"},
					{type: "text", top: 10, fontSize: 30, fontWeight: "bold", content: "加粗 bold"},
				] 
			});

			new Painter(
				uni.createCanvasContext("canvas-rect"),
				{ upx2px: uni.upx2px }
			).draw({
				type: "container",
				top: 5,
				left: 15,
				children: [
					{type: "rect", top: 10, width: 30, height: 30, background: "#cc0000"},
					{type: "rect", top: 10, width: 60, height: 30, background: "#cccc00"},
					{type: "rect", top: 10, width: 120, height: 30, background: "#00cc00"},
					{type: "rect", top: 10, width: 100, height: 60, background: "#00cccc"},
				]
			});

			new Painter(
				uni.createCanvasContext("canvas-image"),
				{ upx2px: uni.upx2px }
			).draw({
				type: "container", top: 5, left: 15,
				children: [
					{type: "image", top: 10, width: 100, height: 100, src: "https://vuejs.org/images/logo.png"},
				]
			});
		},
		methods: {

		}
	}
</script>

<style>
	.page{
		padding: 0 15upx;
	}
	.h1 {
		margin: 20upx 0 40upx;
		font-size: 80upx;
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
