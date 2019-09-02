<template>
    <view class="page">
        <view class="page-title h2">矩形</view>
		<canvas canvas-id="canvas-rect" class="canvas" style="height: 230upx"/>
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
            uni.createCanvasContext("canvas-rect"),
            { upx2px: uni.upx2px }
        ).draw({
            type: "container",
            top: 5,
            left: 15,
            children: [
                {type: "rect", top: 10, width: 30, height: 30, background: "#cc0000"},
                {type: "rect", top: 10, width: 60, height: 30, background: "#cccc00"},
                {type: "rect", top: 10, width: 120, height: 30, background: "#00cc00"},
                {type: "rect", top: 10, width: 100, height: 60, background: "#00cccc"},
            ]
        });
    }
}
</script>