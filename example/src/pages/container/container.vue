<template>
    <view class="page">
		<view class="page-title h2">竖直排列</view>
		<canvas id="canvas-container-vertical" canvas-id="canvas-container-vertical"
            class="canvas" style="height: 300upx"/>
        <view class="page-title h2">水平排列</view>
		<canvas id="canvas-container-horizontal" canvas-id="canvas-container-horizontal"
            class="canvas" style="height: 230upx"/>
        <view class="page-title h2">绝对定位</view>
        <canvas id="canvas-container-absolute" canvas-id="canvas-container-absolute"
            class="canvas" style="height: 120upx"/>
        <view class="page-title h2">混排</view>
        <canvas id="canvas-container-multiple-layout" canvas-id="canvas-container-multiple-layout"
            class="canvas" style="height: 430upx"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";


export default {
    data(){
        return {};
    },
    onReady(){
        let gap = { left: 10, top: 10 };

        new Painter( uni.createCanvasContext("canvas-container-vertical") ).draw({
            type: "container",
            direction: "vertical", // default
            top: 5,
            left: 15,
            children: [
                { type: "text", ...gap, content: "文本文本文本" },
                { type: "image", ...gap, width: 100, height: 100, src: require("@/static/demo.png") },
                { type: "rect", ...gap, width: 200, height: 40, background: "#3f3"}
            ]
        });

        new Painter(uni.createCanvasContext("canvas-container-horizontal")).draw({
            type: "container",
            direction: "horizontal",
            top: 5,
            left: 15,
            children: [
                { type: "text", ...gap, content: "文本文本文本" },
                { type: "image", ...gap, width: 100, height: 100, src: require("@/static/demo.png") },
                { type: "rect", ...gap, width: 200, height: 40, background: "#3f3"}
            ]
        });

        new Painter(uni.createCanvasContext("canvas-container-absolute")).draw({
            type: "container",
            direction: "vertical",
            top: 5,
            left: 15,
            children: [
                { type: "rect", left: 200, top: 40, position: "absolute", width: 200, height: 40, background: "#3f3"},
                { type: "text", left: 140, top: 30, position: "absolute", content: "文本文本文本" },
                { type: "image", width: 100, height: 100, src: require("@/static/demo.png") },
            ]
        });

        let rect = { type: "rect", width: 30, height: 30, ...gap };

        new Painter(uni.createCanvasContext("canvas-container-multiple-layout")).draw({
            type: "container",
            children: [
                { ...rect, position: "absolute", left: 600, background: "#eee"},
                { type: "text", position: "absolute", content: "A", align: "center", left: 615, top: 12, fontSize: 30 },
                { ...rect, width: 210, background: "#eee"},
                { ...rect, width: 240, background: "#eee"},
                { ...rect, width: 200, background: "#eee"},
                { ...rect, width: 170, background: "#eee"},
                { ...rect, width: 240, background: "#eee"},
                { 
                    type: "container",
                    direction: "horizontal",
                    children: [
                        { ...rect, background: "#e66"},
                        { ...rect, width: 60, background: "#eee"},
                        { ...rect, background: "#6e6"},
                        { ...rect, width: 60, background: "#eee"},
                        { ...rect, background: "#66e"},
                        { ...rect, width: 60, background: "#eee"},
                    ]
                },
                { ...rect, width: 200, background: "#eee"},
                {
                    type: "container",
                    direction: "horizontal",
                    children: [
                        { ...rect, width: 100, background: "#ee6"},
                        { ...rect, position: "absolute", left: 600, background: "#ee6"},
                        { type: "text", position: "absolute", content: "A", align: "center", left: 615, top: 12, fontSize: 30 },
                    ]
                }
            ]
        });
    }
}
</script>

<style scoped>

</style>
