<template>
    <view class="page">
        <view class="page-title h2">动态获取元素尺寸</view>
        <view>
            对于复杂情况，元素的高度可能不确定，我们需要动态获取元素的尺寸，下面的 DEMO 展示了:
            <view>1. 获取元素的高度来设置 canvas 尺寸</view>
            <view>2. 为尺寸不定的元素设置背景色</view>
        </view>
        <br/>
        <textarea v-model="text" style="border: 1rpx solid #ddd" maxlength="-1"/>
        <br/>
        <button @click="updateCanvas" type="default">更新</button>

        <canvas canvas-id="canvas" id="canvas" class="canvas" :style="{
            width: `${CANVAS_WIDTH}rpx`,
            height: `${canvasHeight}rpx`
        }"/>

        <web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/dynamicCanvasSize/dynamicCanvasSize.vue"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter.js";

const LOCAL_IMAGE_RELATIVE_PATH = "../../static/demo.png";
const CANVAS_WIDTH = 500

export default {
    data(){
        return {
            text: "在这里修改文本的长度，点击更新，查看 canvas 高度变化",
            CANVAS_WIDTH,
            canvasHeight: 0,
            painterTextBackgroundOption: {},
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
                width: CANVAS_WIDTH,
                children: [
                    { // 图片元素
                        type: "image",
                        top: 20,
                        width: 100,
                        height: 100,
                        src: LOCAL_IMAGE_RELATIVE_PATH
                    },
                    // 跟随多行文本的高度变化的文本
                    this.painterTextBackgroundOption,
                    // 动态高度的多行文本
                    this.painterTextBlockOption,
                    { // 底部装饰元素
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
        },
        painterTextBlockOption(){
            return  { 
                type: "text-block",
                top: 20,
                width: CANVAS_WIDTH - 40,
                height: "auto",
                fontSize: 40,
                lineHeight: 60,
                fontStyle: "italic",
                color: "#356",
                content: this.text
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
        async updateCanvas(){
            await this.clearCanvas();

            this.painterTextBackgroundOption = await this.getPainterTextBackgroundOption();

            const painter = new Painter(uni.createCanvasContext("canvas"));

            // 获取 painter 布局计算之后得出的尺寸
            let size = await painter.layout(this.painterContent);

            // 更新 canvas 的高度
            this.canvasHeight = size.height;

            // 延迟 100ms, 确保 canvas 的高度已经改变
            await new Promise(r => setTimeout(r, 100));

            await painter.draw(this.painterContent);
        },
        async clearCanvas(){
            // 清除上一次绘制的内容
            await new Painter(uni.createCanvasContext("canvas")).draw({
                type: "rect",
                background: "#fff",
                width: CANVAS_WIDTH,
                height: this.canvasHeight
            });
        },
        /** @returns {import("../../../../dist/lib/painter-element/index").BuiltInPainterElementOption} */
        async getPainterTextBackgroundOption(){
            let textBlockSize = await new Painter(uni.createCanvasContext("canvas")).layout(
                this.painterTextBlockOption
            );
            return {
                type: "rect",
                position: "absolute",
                top: 150,
                left: 40,
                width: CANVAS_WIDTH - 100,
                height: textBlockSize.height,
                background: "#cff",
            }
        }
    }
}
</script>

<style scoped>
.canvas {
    border: 1px solid #000;
}
</style>