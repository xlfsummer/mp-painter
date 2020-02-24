<template>
    <view class="page">
		<view class="page-title h2">裁剪</view>
		<canvas id="canvas-clip-base" canvas-id="canvas-clip-base"
            class="canvas" style="height: 300upx"/>

        <view class="page-title h2">裁剪图片</view>
		<canvas id="canvas-clip-image" canvas-id="canvas-clip-image"
            class="canvas" style="height: 300upx"/>

        <web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/clip/clip.vue"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";

export default {
    onReady(){
        new Painter(uni.createCanvasContext("canvas-clip-base")).draw({
            type: "clip",
            path: {
                type: "rounded-rect",
                width: 500,
                height: 280,
                borderRadius: 140
            },
            content: {
                type: "text-block",
                width: 500,
                fontSize: 40,
                content: "示例文本示例文本示例文本示例文本".repeat(10)
            }
        });

        new Painter(uni.createCanvasContext("canvas-clip-image")).draw({
            type: "clip",
            path: {
                type: "rounded-rect",
                width: 200,
                height: 200,
                borderRadius: 100
            },
            content: {
                type: "image",
                width: 200,
                height: 200,
                src: "../../static/demo.png"
            }
        });
    }
}
</script>
