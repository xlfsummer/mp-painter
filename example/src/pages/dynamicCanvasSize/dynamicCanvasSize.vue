<template>
    <view class="page">
        <view class="page-title h2">动态长度的多行文本：</view>
        <textarea v-model="text" style="border: 1rpx solid #ddd" maxlength="-1"/>
        <br/>
        <button @click="updateCanvas" type="default">更新</button>

        <canvas canvas-id="canvas" id="canvas" class="canvas" :style="{
            width: canvasSize.width + 'rpx',
            height: canvasSize.height + 'rpx'
        }"/>

        <web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/dynamicCanvasSize/dynamicCanvasSize.vue"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter.js";
const LOCAL_IMAGE_RELATIVE_PATH = "../../static/demo.png";

export default {
    data(){
        return {
            text: "在这里修改文本的长度，点击更新，查看 canvas 高度变化",
            canvasSize: {
                width: 500,
                height: 0
            }
        };
    },
    computed: {
        /** @returns {import("../../../../dist/lib/painter-element/index").BuiltInPainterElementOption} */
        painterContent(){
            return {
                type: "container",
                direction: "vertical",
                height: "auto",
                left: 20,
                width: this.canvasSize.width,
                children: [
                    { // canvas 中的其它 painter 元素 1
                        type: "image",
                        top: 20,
                        width: 100,
                        height: 100,
                        src: LOCAL_IMAGE_RELATIVE_PATH
                    },
                    { // 动态高度的多行文本
                        type: "text-block",
                        top: 20,
                        width: this.canvasSize.width - 40,
                        height: "auto",
                        fontSize: 40,
                        lineHeight: 60,
                        fontStyle: "italic",
                        color: "#333",
                        content: this.text
                    },
                    { // canvas 中的其它 painter 元素 2
                        type: "rect",
                        top: 20,
                        width: 300,
                        height: 10,
                        background: "#456"
                    },
                    { // 底部 padding
                        type: "rect",
                        width: 0,
                        height: 20
                    }
                ]
            };
        }
    },
    onReady(){
        this.updateCanvas();
    },
    methods: {
        /** @param {{ detail: { value: string }}} param0 */
        scaleChange({ detail: { value } }){
            this.text = value;
            this.updateCanvas();
        },
        updateCanvas(){
            // 清除上一次绘制的内容
            new Painter(uni.createCanvasContext("canvas")).draw({
                type: "rect",
                background: "#fff",
                width: this.canvasSize.width,
                height: this.canvasSize.height
            });

            new Painter(uni.createCanvasContext("canvas"), {
                afterLayout: async size => {
                    // 获取 painter 布局计算之后得出的高度，并更新 canvas 的高度
                    this.canvasSize.height = size.height;
                    await this.$nextTick();
                }
            }).draw(this.painterContent);
        }
    }
}
</script>

<style scoped>
.canvas {
    border: 1px solid #000;
}
</style>