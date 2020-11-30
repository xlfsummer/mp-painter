<template>
	<view class="page">
		<canvas class="canvas" id="canvas" canvas-id="canvas"></canvas>

		<web-link href="https://github.com/xlfsummer/mp-painter">
			<image src="https://img.shields.io/github/stars/xlfsummer/mp-painter?style=social" style="width: 76px; height: 20px;"/>
		</web-link>

		<view> 元素 </view>
		<navigator class="link" url="/pages/text/text"><button type="default">text</button></navigator>
		<navigator class="link" url="/pages/rect/rect"><button type="default">rect / line</button></navigator>
		<navigator class="link" url="/pages/image/image"><button type="default">image</button></navigator>
		<navigator class="link" url="/pages/textBlock/textBlock"><button type="default">text-block</button></navigator>
		<navigator class="link" url="/pages/container/container"><button type="default">container</button></navigator>
		<navigator class="link" url="/pages/clip/clip"><button type="default">clip</button></navigator>
		<navigator class="link" url="/pages/transform/transform"><button type="default">transform</button></navigator>

		<view> 绘制单位 </view>
		<navigator class="link" url="/pages/unit/unit"><button type="default">unit</button></navigator>

		<view>其它示例</view>
		<navigator class="link" url="/pages/dynamicCanvasSize/dynamicCanvasSize"><button type="default">动态canvas尺寸</button></navigator>
		<navigator class="link" url="/pages/playground/playground"><button type="default">Playground</button></navigator>
		
		<web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/index/index.vue"/>
	</view>
</template>

<script>
	import Painter from "../../../../dist/lib/painter.js";

	let text = {
		position: "absolute",
		type: "text",
		fontWeight: "bold",
		fontStyle: "italic",
		fontFamily: "Times, serif",
		fontSize: 60, // = 60rpx
		align: "center",
		baseline: "middle",
		content: "mp-painter DEMO",
	};

	export default {
		data() {
			return {};
		},
		onLoad() {
			new Painter(uni.createCanvasContext("canvas")).draw({
				type: "container",
				children: [
					{
						top: 103,
						left: 358,
						color: "#eeeeee",
						...text
					}, {
						top: 100,
						left: 355,
						color: "#fc6000",
						...text
					}
				]
			});
		}
	}
</script>
