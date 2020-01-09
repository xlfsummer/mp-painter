<template>
    <view class="page">
        <view class="page-title h2">矩形 - 圆角矩形</view>
		<canvas canvas-id="canvas-rect" id="canvas-rect" class="canvas" style="height: 600upx"/>
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
            uni.createCanvasContext("canvas-rect")
        ).draw({
            type: "container",
            top: 5,
            left: 15,
            children: [
                {type: "rect", top: 10, width: 30, height: 30, background: "#cc0000"},
                {type: "rect", top: 10, width: 60, height: 30, background: "#cccc00"},
                {type: "rect", top: 10, width: 120, height: 30, background: "#00cc00"},
                {type: "rect", top: 10, width: 200, height: 100, background: "#00cccc", borderRadius: 20},
                {type: "rect", top: 10, width: 200, height: 100, background: "#cc00cc", borderRadius: [0, 20, 40, 60]},
                {type: "rect", top: 10, width: 300, height: 100, background: "#cc6600", borderRadius: [1e3, 1e3, 0, 100]},
                {type: "rect", top: 10, width: 100, height: 100, background: "#cc6666", borderRadius: 50},
            ]
        });
    }
}
</script>