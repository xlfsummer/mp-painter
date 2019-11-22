<template>
    <view class="page">
		<view class="page-title h2">图片</view>
		<canvas id="canvas-image"
            canvas-id="canvas-image" class="canvas" style="height: 230upx"/>
        <view class="page-title h2">图片 - 自适应(contain)</view>
		<canvas id="canvas-image-contain"
            canvas-id="canvas-image-contain" class="canvas" style="height: 430upx"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";


export default {
    data(){
        return {};
    },
    onReady(){
        new Painter(
            uni.createCanvasContext("canvas-image")
        ).draw({
            type: "container", top: 5, left: 15,
            children: [
                {type: "image", top: 10, width: 100, height: 100, src: "https://vuejs.org/images/logo.png"},
            ]
        });

        new Painter(
            uni.createCanvasContext("canvas-image-contain")
        ).draw({
            type: "container", top: 5, left: 15,
            children: [
                {type: "image", top: 10, width: 550, height: 200, src: "https://vuejs.org/images/logo.png"},
                {type: "image", top: 10, width: 550, height: 200, src: "https://vuejs.org/images/logo.png", objectFit: "contain"},
            ]
        });
    }
}
</script>

<style scoped>

</style>