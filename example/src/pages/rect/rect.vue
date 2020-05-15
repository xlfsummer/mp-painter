<template>
    <view class="page">
        <view class="page-title h2">圆角矩形</view>
		<canvas canvas-id="canvas-rect" id="canvas-rect" class="canvas" style="height: 600upx"/>
        <view class="page-title h2">直线 / 虚线 / 线宽</view>
        <canvas canvas-id="canvas-line" id="canvas-line" class="canvas" style="height: 280upx"/>
        <view class="page-title h2">圆角矩形 - 描边</view>
		<canvas canvas-id="canvas-rect-stroke" id="canvas-rect-stroke" class="canvas" style="height: 600upx"/>

		<web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/rect/rect.vue"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";

export default {
    data(){
        return {};
    },
    onReady(){
        let rect = { type: "rect", top: 10, width: 200, height: 100 };

        new Painter(uni.createCanvasContext("canvas-rect")).draw({
            type: "container",
            top: 5,
            left: 15,
            children: [
                {type: "rect", top: 10, width: 30, height: 30, background: "#cc0000"},
                {type: "rect", top: 10, width: 60, height: 30, background: "#cccc00"},
                {type: "rect", top: 10, width: 120, height: 30, background: "#00cc00"},

                {type: "rect", top: 10, width: 200, height: 100, background: "#00cccc", borderRadius: 20},
                {type: "line", top: 10, left: 300, dx: 200, dy: 200, color: "#f00", position: "absolute" },

                // test for issue #9
                {type: "rect", top: 10, width: 200, height: 100, background: {
                    type: "liner-gradient",
                    x1: 0, y1: 0, x2: 200, y2: 100,
                    colorStops: [
                        { offset: 0, color: "#44f" },
                        { offset: .5, color: "#c4f" }, 
                        { offset: 1, color: "#f4f" }
                    ]
                }, borderRadius: [1, 60, 1, 60]},
                {type: "line", top: 30, left: 300, dx: 200, dy: 200, dashPattern: [10, 10], color: "#00f", position: "absolute" },

                {type: "rect", top: 10, width: 300, height: 100, background: {
                    type: "liner-gradient",
                    // 注意这里的坐标相对于元素本身
                    x1: 0, y1: 100, x2: 300, y2: 0,
                    colorStops: [
                        { offset: 0, color: "red" },
                        { offset: .5, color: "orange" }, 
                        { offset: 1, color: "yellow" }
                    ]
                }, borderRadius: [1e3, 1e3, 0, 1e3]},
                {type: "rect", top: 10, width: 100, height: 100, background: "#cc6666", borderRadius: 50},
            ]
        });

        new Painter(uni.createCanvasContext("canvas-line")).draw({
            type: "container",
            top: 5,
            left: 15,
            children: [
                {type: "line", top: 10, left: 100, dx: 200, dy: 200, color: "#f00", position: "absolute" },
                {type: "line", top: 30, left: 300, dx: -200, dy: 150, dashPattern: [10, 10], color: "#00f", position: "absolute" },
                {type: "line", top: 40, left: 110, dx: 100, dy: 200, lineWidth: 10, color: "#f0f", position: "absolute" },
            ]
        });

        new Painter(uni.createCanvasContext("canvas-rect-stroke")).draw({
            type: "container", top: 5, left: 15,
            children: [
                { ...rect, background: "#cdf", borderWidth: 5, borderColor: "#abc" },
                { ...rect, borderWidth: 5, borderColor: "#bbc", borderStyle: "dashed" },
                { ...rect, background: "#fdc", borderWidth: 10, borderColor: "#cbc", borderStyle: "dashed" },
            ]
        });
    }
}
</script>
