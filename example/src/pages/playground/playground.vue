<template>
    <view class="page">
        <view class="page-title h2">来试试！绘制后复制 url 来分享！</view>
        <textarea v-model="elementOptionText" class="textarea" maxlength="-1"/>
        <button @click="update">绘制</button>
		<canvas canvas-id="canvas-playground" id="canvas-playground" class="canvas" 
        :style="{ width: canvasSize.width + 'rpx', height: canvasSize.height + 'rpx' }"/>
		<web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/playground/playground.vue"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";

/** @typedef {import("../../../../src/lib/painter-element").BuiltInPainterElementOption} ElementOption */


const defaultElementOption = /** @type {ElementOption} */(
    { type: "container", direction: "vertical", top: 10, children: [
        { type: "text", fontFamily: "times", content: "Hello, World!", fontStyle: "italic", color: "#456" },
        { type: "rect", top: 5, background: "#456", width: 80, height: 3 },
        { type: "rect", height: 20 },
    ] }
);

export default {
    onLoad(option){
        console.log(this.$route);
        if(option.d){
            try {
                this.elementOption = JSON.parse(decodeURIComponent(option.d));
            } catch {
                this.elementOptionText = decodeURIComponent(option.d);
            }
        } else {
            this.elementOption = defaultElementOption;
        }
        this.update();
    },
    data(){
        return {
            canvasSize: { width: 600, height: 0 },
            elementOptionText: ""
        };
    },
    computed: {
        elementOption: {
            get(){
                try {
                    return JSON.parse(this.elementOptionText);
                } catch(e) {
                    return { type: "text", fontSize: 18, content: e.message, color: "red" }
                }
            },
            set(v){
                this.elementOptionText = JSON.stringify(v, null, 2);
            }
        },
        elementOptionTextIsValid(){
            try { return JSON.parse(this.elementOptionText), true; }
            catch { return false }
        }
    },
    methods: {
        update(){
            this.updateHash();
            
            // 清除上一次绘制的内容
            new Painter(uni.createCanvasContext("canvas-playground")).draw({
                type: "rect",
                background: "#fff",
                width: this.canvasSize.width,
                height: this.canvasSize.height
            });

            new Painter(uni.createCanvasContext("canvas-playground")).draw(this.elementOption, {
                afterLayout: async size => {
                    // 获取 painter 布局计算之后得出的高度，并更新 canvas 的高度
                    this.canvasSize.height = size.height;

                    // 延迟 100ms, 确保 canvas 的高度已经改变
                    await new Promise(r => setTimeout(r, 100));
                }
            });
        },
        /** 更新 url hash, 以便分享 */
        updateHash(){

            if(window && this.elementOptionTextIsValid){

                // 移除缩进，节省空间
                const elementOptionTextWithoutIndent = JSON.stringify(this.elementOption)

                window.location.hash = this.$route.path 
                    + "?"
                    + new URLSearchParams({d: elementOptionTextWithoutIndent}).toString();
            }
        }
    }
}
</script>

<style scoped>
.textarea {
    background: #222;
    width: auto;
    height: 400px;
    padding: 10px;
    color: #eee;
    font-family: consolas;
    margin-bottom: 10px;
}
</style>