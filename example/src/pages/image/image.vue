<template>
    <view class="page">
		<view class="page-title h2">图片</view>
		<canvas canvas-id="canvas-image" class="canvas" style="height: 230upx"/>
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
            uni.createCanvasContext("canvas-image"),
            { upx2px: uni.upx2px }
        ).draw({
            type: "container", top: 5, left: 15,
            children: [
                {type: "image", top: 10, width: 100, height: 100, src: "https://vuejs.org/images/logo.png"},
            ]
        });
    }
}
</script>

<style scoped>

</style>