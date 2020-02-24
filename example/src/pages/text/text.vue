<template>
    <view class="page">
        <view class="page-title h2">字号 fontSize</view>
        <canvas id="canvas-font-size" canvas-id="canvas-font-size" class="canvas" style="height: 200upx"/>
        <view class="page-title h2">字体 fontFamily</view>
        <canvas id="canvas-font-family" canvas-id="canvas-font-family" class="canvas" style="height: 200upx"/>
        <view class="page-title h2">文字颜色 color</view>
        <canvas id="canvas-font-color" canvas-id="canvas-font-color" class="canvas" style="height: 220upx"/>
        <view class="page-title h2">文字字重 fontWeight</view>
        <canvas id="canvas-font-weight" canvas-id="canvas-font-weight" class="canvas" style="height: 90upx"/>
        <view class="page-title h2">文字风格 fontStyle</view>
        <canvas id="canvas-font-style" canvas-id="canvas-font-style" class="canvas" style="height: 90upx"/>
        <view class="page-title h2">文字对齐 align</view>
        <canvas id="canvas-font-align" canvas-id="canvas-font-align" class="canvas" style="height: 140upx"/>
        <view class="page-title h2">文字基线 baseline</view>
        <canvas id="canvas-font-baseline" canvas-id="canvas-font-baseline" class="canvas" style="height: 180upx"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";

export default {
    data(){
        return {};
    },
    onReady(){
        new Painter(uni.createCanvasContext("canvas-font-size")).draw({
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

        new Painter(uni.createCanvasContext("canvas-font-family")).draw({
            type: "container",
            top: 5,
            left: 15,
            children: [
                {type: "text", top: 10, fontFamily: "sans-serif", content: "sans-serif"},
                {type: "text", top: 10, fontFamily: "serif", content: "Serif"},
                {type: "text", top: 10, fontFamily: "Times", content: "Times"},
                {type: "text", top: 10, fontFamily: "monospace", content: "monospace"},
            ] 
        });

        new Painter(uni.createCanvasContext("canvas-font-color")).draw({
            type: "container",
            top: 5,
            left: 15,
            children: [
                {type: "text", top: 10, color: "red", content: "red"},
                {type: "text", top: 10, color: "#0f0", content: "#0f0"},
                {type: "text", top: 10, color: "#0033cc", content: "#0033cc"},
                {type: "text", top: 10, color: "rgb(255, 0, 255)", content: "rgb(255, 0, 255)"},
                {type: "text", top: 10, color: "rgba(0, 0, 0, 0.5)", content: "rgba(0, 0, 0, 0.5)"}
            ] 
        });

        new Painter(uni.createCanvasContext("canvas-font-weight")).draw({
            type: "container",
            top: 5,
            left: 15,
            children: [
                {type: "text", top: 10, content: "正常 normal"},
                {type: "text", top: 10, fontWeight: "bold", content: "加粗 bold"},
            ] 
        });

        new Painter(uni.createCanvasContext("canvas-font-style")).draw({
            type: "container",
            top: 5,
            left: 15,
            children: [
                {type: "text", top: 10, content: "正常 normal"},
                {type: "text", top: 10, fontStyle: "italic", content: "斜体 italic"},
            ] 
        });

        new Painter(uni.createCanvasContext("canvas-font-align")).draw({
            type: "container", top: 5, left: 15,
            children: [
                {type: "text", top: 10, left: 300, align: "left", content: "left"},
                {type: "text", top: 10, left: 300, align: "center", content: "center"},
                {type: "text", top: 10, left: 300, align: "right", content: "right"},
                {type: "line", position: "absolute", left: 300, dy: 140, dashPattern: [10, 10], color: "blue"},
            ]
        });

        new Painter(uni.createCanvasContext("canvas-font-baseline")).draw({
            type: "container", top: 5, left: 15, direction: "horizontal",
            children: [
                {type: "text", fontSize: 40, top: 50, baseline: "top", content: "top"},
                {type: "text", fontSize: 40, top: 50, baseline: "normal", content: "normal"},
                {type: "text", fontSize: 40, top: 50, baseline: "middle", content: "middle"},
                {type: "text", fontSize: 40, top: 50, baseline: "bottom", content: "bottom"},
                {type: "line", position: "absolute", top: 50, dx: 500, dashPattern: [10, 10], color: "blue"},
            ]
        })
    }
}
</script>
