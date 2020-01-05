<template>
	<view class="page">
		<canvas id="canvas" canvas-id="canvas"></canvas>
		<navigator class="link" url="/pages/text/text"><button type="default">text</button></navigator>
		<navigator class="link" url="/pages/rect/rect"><button type="default">rect</button></navigator>
		<navigator class="link" url="/pages/image/image"><button type="default">image</button></navigator>
		<navigator class="link" url="/pages/textBlock/textBlock"><button type="default">text-block</button></navigator>
		<navigator class="link" url="/pages/container/container"><button type="default">container</button></navigator>
	</view>
</template>

<script>
	import Painter from "../../../../dist/lib/painter";

	export default {
		data() {
			return {};
		},
		onLoad() {
			new Painter(uni.createCanvasContext("canvas")).draw({
				type: "text",
				top: 100,
				left: 300,
				color: "#fc6000",
				fontWeight: "bold",
				fontFamily: "Times",
				fontSize: 60, // = 60rpx
				align: "center",
				content: "mp-painter DEMO",
			});
		},
		onReady(){

		},
		methods: {

		}
	}
</script>
