<template>
	<view class="page">
		<canvas class="canvas" id="canvas" canvas-id="canvas"></canvas>

		<!-- #ifdef H5 -->
		<a href="https://github.com/xlfsummer/mp-painter" style="font-size: 14px; display: block;" target="_blank">
			<image src="https://img.shields.io/github/stars/xlfsummer/mp-painter?style=social" style="width: 76px; height: 20px;"/>
		</a>
		<!-- #endif H5 -->

		<navigator class="link" url="/pages/text/text"><button type="default">text</button></navigator>
		<navigator class="link" url="/pages/rect/rect"><button type="default">rect / line</button></navigator>
		<navigator class="link" url="/pages/image/image"><button type="default">image</button></navigator>
		<navigator class="link" url="/pages/textBlock/textBlock"><button type="default">text-block</button></navigator>
		<navigator class="link" url="/pages/container/container"><button type="default">container</button></navigator>
		<navigator class="link" url="/pages/clip/clip"><button type="default">clip</button></navigator>
		<navigator class="link" url="/pages/transform/transform"><button type="default">transform</button></navigator>
		
		<!-- #ifdef H5 -->
		<a href="https://github.com/xlfsummer/mp-painter/tree/master/example/src" style="font-size: 14px; display: block;" target="_blank">
			see demo source code
		</a>
		<!-- #endif H5 -->
	</view>
</template>

<script>
	import Painter from "../../../../dist/lib/painter.js";

	console.log("Painter", Painter);

	export default {
		data() {
			return {};
		},
		onLoad() {
			new Painter(uni.createCanvasContext("canvas")).draw({
				type: "container",
				children: [
					{
						position: "absolute",
						type: "text",
						top: 103,
						left: 358,
						color: "#eee",
						fontWeight: "bold",
						fontStyle: "italic",
						fontFamily: "Times",
						fontSize: 60, // = 60rpx
						align: "center",
						baseline: "middle",
						content: "mp-painter DEMO",
					}, {
						position: "absolute",
						type: "text",
						top: 100,
						left: 355,
						color: "#fc6000",
						fontWeight: "bold",
						fontStyle: "italic",
						fontFamily: "Times",
						fontSize: 60, // = 60rpx
						align: "center",
						baseline: "middle",
						content: "mp-painter DEMO",
					}
				]
			});
		},
		onReady(){

		},
		methods: {

		}
	}
</script>
