<template>
    <view class="page">
        <view class="page-title h2">自动换行</view>
        <canvas canvas-id="canvas-text-block-wrap"
            id="canvas-text-block-wrap"
            class="canvas"
            style="width: 220upx; height: 250upx"/>
        <view class="page-title h2">设置行高</view>
        <canvas canvas-id="canvas-text-block-line-height"
            id="canvas-text-block-line-height"
            class="canvas"
            style="height: 500upx"/>
        <view class="page-title h2">多行截断</view>
        <canvas canvas-id="canvas-text-block-line-clamp"
            id="canvas-text-block-line-clamp"
            class="canvas"
            style="height: 400upx"/>
        <view class="page-title h2">字体设置</view>
        <canvas canvas-id="canvas-text-block-font"
            id="canvas-text-block-font"
            class="canvas"
            style="height: 250upx"/>

        <web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/textBlock/textBlock.vue"/>
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
            uni.createCanvasContext("canvas-text-block-wrap")
        ).draw({
            type: "text-block",
            top: 20,
            left: 15,
            width: 190,
            content: "设置宽度，自动换行，支持中英文混排, 不支持显示\n换行符\n，cool!"
        });

        new Painter(
            uni.createCanvasContext("canvas-text-block-line-height")
        ).draw({
            type: "container",
            top: 10,
            left: 15,
            children: [
                {
                    type: "text-block",
                    top: 30,
                    left: 15,
                    width: 540,
                    lineHeight: 20,
                    content: "行高20: 文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本",
                },
                {
                    type: "text-block",
                    top: 30,
                    left: 15,
                    width: 540,
                    lineHeight: 40,
                    content: "行高40: 文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本",
                },
                {
                    type: "text-block",
                    top: 30,
                    left: 15,
                    width: 540,
                    lineHeight: 60,
                    content: "行高60: 文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本",
                }
            ]
        });

        new Painter(
            uni.createCanvasContext("canvas-text-block-line-clamp")
        ).draw({
            type: "container",
            top: 10,
            left: 15,
            children: [
                {
                    type: "text-block",
                    top: 30,
                    left: 15,
                    width: 540,
                    lineClamp: 1,
                    content: "1行: 文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本",
                },
                {
                    type: "text-block",
                    top: 30,
                    left: 15,
                    width: 540,
                    lineClamp: 2,
                    content: "2行: 文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本",
                },
                {
                    type: "text-block",
                    top: 30,
                    left: 15,
                    width: 540,
                    lineClamp: 3,
                    content: "3行: 文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本",
                }
            ]
        });

        new Painter(
            uni.createCanvasContext("canvas-text-block-font")
        ).draw({
            type: "container",
            top: 10,
            left: 15,
            children: [
                {
                    type: "text-block",
                    top: 30,
                    left: 15,
                    width: 540,
                    fontFamily: "Times, 楷体",
                    fontSize: 40,
                    color: "#c33",
                    content: "text-block 也支持其它 text 可设置的选项，如字体、字号、颜色、加粗等",
                }
            ]
        });
    }
}
</script>

<style scoped>

</style>
