<template>
    <view class="page">
        <view class="page-title h2">字号</view>
        <canvas canvas-id="canvas-font-size" class="canvas" style="height: 200upx"/>
        <view class="page-title h2">文字颜色</view>
        <canvas canvas-id="canvas-font-color" class="canvas" style="height: 220upx"/>
        <view class="page-title h2">文字样式</view>
        <canvas canvas-id="canvas-font-style" class="canvas" style="height: 90upx"/>
    </view>
</template>

<script>
import Painter from "mp-painter";

export default {
    data(){
        return {};
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
                {type: "text", top: 10, color: "red", content: "red"},
                {type: "text", top: 10, color: "#0f0", content: "#0f0"},
                {type: "text", top: 10, color: "#0033cc", content: "#0033cc"},
                {type: "text", top: 10, color: "rgb(255, 0, 255)", content: "rgb(255, 0, 255)"},
                {type: "text", top: 10, color: "rgba(0, 0, 0, 0.5)", content: "rgba(0, 0, 0, 0.5)"}
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
                {type: "text", top: 10, content: "正常 normal"},
                {type: "text", top: 10, fontWeight: "bold", content: "加粗 bold"},
            ] 
        });
    }
}
</script>

<style scoped>

</style>