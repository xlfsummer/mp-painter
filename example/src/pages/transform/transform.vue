<template>
    <view class="page">
		<view class="page-title h2">平移</view>
		<canvas id="canvas-transform-translate" canvas-id="canvas-transform-translate"
            class="canvas" style="height: 200upx"/>
        <view class="page-title h2">旋转</view>
        <canvas id="canvas-transform-rotate" canvas-id="canvas-transform-rotate"
            class="canvas" style="height: 200upx"/>
        <view class="page-title h2">缩放</view>
        <canvas id="canvas-transform-scale" canvas-id="canvas-transform-scale"
            class="canvas" style="height: 200upx"/>
        <view class="page-title h2">组合变换</view>
        <canvas id="canvas-transform-combination" canvas-id="canvas-transform-combination"
            class="canvas" style="height: 200upx"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";

export default {
    onReady(){
        new Painter(uni.createCanvasContext("canvas-transform-translate")).draw({
            type: "container",
            children: [
                {
                    position: "absolute",
                    type: "transform",
                    transform: [
                        { type: "translate", x: 0, y: 30}
                    ],
                    content: {
                        type: "text",
                        width: 500,
                        fontSize: 30,
                        content: "translate y 30"
                    }
                },
                {
                    position: "absolute",
                    left: 300,
                    top: 30,
                    type: "text",
                    width: 500,
                    fontSize: 30,
                    content: "top 30"
                }
            ]
        });

        new Painter(uni.createCanvasContext("canvas-transform-rotate")).draw({
            type: "transform",
            transform: [{ type: "rotate", rotate: 20 }],
            content: {
                type: "text",
                fontSize: 30,
                content: "一行旋转了 20° 的文字"
            }
        });

        new Painter(uni.createCanvasContext("canvas-transform-scale")).draw({
            type: "transform",
            transform: [{ type: "scale", scaleHeight: 1, scaleWidth: 2 }],
            content: {
                type: "text",
                fontSize: 30,
                content: "宽度设置为 2 倍的文字"
            }
        })

        new Painter(uni.createCanvasContext("canvas-transform-combination")).draw({
            type: "transform",
            transform: [
                { type: "translate", x: 100, y: 30 },
                { type: "rotate", rotate: 30 },
                { type: "translate", x: -100, y: -30 },
            ],
            content: {
                type: "text",
                fontSize: 30,
                content: "通过组合达到设置旋转中心的效果"
            }
        })
    }
}
</script>
