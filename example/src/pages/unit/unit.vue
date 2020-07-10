<template>
    <view class="page">
        <view class="page-title h2">以下均是 100 * 100 的矩形</view>

        <view class="page-title h2">默认 rpx</view>
		<canvas canvas-id="canvas-rpx" id="canvas-rpx" class="canvas" style="height: 300rpx"/>

        <view class="page-title h2">px</view>
        <canvas canvas-id="canvas-px" id="canvas-px" class="canvas" style="height: 300rpx"/>

        <view class="page-title h2">自定义比例</view>
        <input type="number" :value="scale" @change="scaleChange"  style="border: 1rpx solid #ddd" />
        <canvas canvas-id="canvas-custom" id="canvas-custom" class="canvas" style="height: 300rpx"/>

		<web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/unit/unit.vue"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";

/** 绘制的内容，这里是一个矩形，但实际可以是任意复杂的内容 */
const content = {type: "rect", top: 10, left: 10, width: 100, height: 100, background: "#cc0000"};

export default {
    data(){
        return {
            scale: 1
        };
    },
    onReady(){

        new Painter(uni.createCanvasContext("canvas-rpx")).draw(content);

        new Painter(uni.createCanvasContext("canvas-px"), {
            /** 这里设置在当前 Painter 中 upx(rpx) 与 px 是 1:1 的关系 */
            upx2px: x => x
        }).draw(content);

        this.updateCanvasCustom();
    },
    methods: {
        scaleChange({ detail }){
            this.scale = Number(detail.value) || 1;
            this.updateCanvasCustom();
        },
        updateCanvasCustom(){
            // 这里先用一个原比例绘制的白色矩形来清除画布、否则绘制后面的实际内容会产生重影
            new Painter(uni.createCanvasContext("canvas-custom")).draw({
                type: "rect", width: 750, height: 600, background: "#fff"
            });

            new Painter(uni.createCanvasContext("canvas-custom"), {
                upx2px: unit => unit * this.scale
            }).draw(content);
        }
    }
}
</script>