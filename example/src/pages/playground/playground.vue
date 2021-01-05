<template>
    <view class="page">
        <view class="page-title h2">任意编辑配置试试，绘制后可通过 url 来分享！</view>
        
        <textarea v-model="elementOptionText" class="textarea" maxlength="-1"/> 

        <button accesskey="s" @click="update">绘制 (alt+s)</button>

        <view style="color: red">{{ errorMessage }}</view>

		<canvas canvas-id="canvas-playground" id="canvas-playground" class="canvas" 
        :style="{ width: canvasSize.width + 'rpx', height: canvasSize.height + 'rpx' }"/>

        <view>{{ layoutMessage }}</view>

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
    ]}
);

export default {
    onLoad({ d = encodeURIComponent(JSON.stringify(defaultElementOption)) } = {}){

        const elementOptionText = decodeURIComponent(d);
        try {
            this.elementOption = JSON.parse(elementOptionText);
        } catch {
            this.elementOptionText = elementOptionText;
        }

        this.draw();
    },
    data(){
        return {
            canvasSize: { width: 600, height: 0 },
            elementOptionText: "",
            errorMessage: "",
            layoutMessage: "",
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
        }
    },
    methods: {
        validJson(){
            try {
                JSON.parse(this.elementOptionText);
            } catch(e) {
                this.errorMessage = e.message;
                throw e;
            }
        },
        update(){
            this.validJson();
            
            // 移除缩进，节省空间
            const elementOptionTextWithoutIndent = JSON.stringify(this.elementOption)

            uni.navigateTo({
                url: this.$route.path 
                + "?d="
                + encodeURIComponent(elementOptionTextWithoutIndent)
            });
        },
        async draw(){
            this.validJson();

            const painter = new Painter(uni.createCanvasContext("canvas-playground"));

            const size = await painter.layout(this.elementOption);

            this.layoutMessage = `width=${size.width}, height=${size.height}`

            // 获取 painter 布局计算之后得出的高度，并更新 canvas 的高度
            this.canvasSize.height = size.height;

            // 延迟 100ms, 确保 canvas 的高度已经改变
            await new Promise(r => setTimeout(r, 100));

            await painter.draw(this.elementOption);
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