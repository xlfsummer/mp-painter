<template>
    <view class="page">
        <view class="page-title h2">任意编辑配置试试，绘制后可通过 url 来分享！</view>
        
        <textarea v-model="elementOptionText" class="textarea" maxlength="-1"/> 

        <button accesskey="s" @click="update">绘制 (alt+s)</button>

        <view style="color: red">{{ errorMessage }}</view>

		<canvas canvas-id="canvas-playground" id="canvas-playground" class="canvas" 
        :style="{ width: canvasSize.width + 'rpx', height: canvasSize.height + 'rpx' }"/>

        <view style="margin: 10px auto;">layout: {{ layoutMessage }}</view>

        <button accesskey="e" @click="exportImage">导出 (alt+e)</button>

		<page-source-link />
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";

/** @typedef {import("../../../../src/lib/painter-element").BuiltInPainterElementOption} ElementOption */


const defaultElementOption = /** @type {ElementOption} */(
    { type: "container", direction: "vertical", top: 10, left: 10, children: [
        { type: "text", fontFamily: "times", content: "Hello, World!", fontStyle: "italic", color: "#456" },
        { type: "rect", top: 5, background: "#456", width: 80, height: 3 },
        { type: "image", src: "/static/demo.png", width: 100, height: 60, top: 10,
          objectFit: "cover", objectPosition: ["center", "top"]
        },
        { type: "rect", height: 10 },
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

            let path;
            let navigateMethod;

            // #ifdef H5
            path = this.$route.path;
            navigateMethod = uni.navigateTo;
            // #endif

            // #ifndef H5
            path = (pages => "/" + pages[pages.length - 1].route)(getCurrentPages());
            navigateMethod = uni.redirectTo;
            // #endif

            navigateMethod.call(null, {
                url: path
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
            this.canvasSize.height = size.height + (this.elementOption.top || 0);

            // 延迟 100ms, 确保 canvas 的高度已经改变
            await new Promise(r => setTimeout(r, 100));

            await painter.draw(this.elementOption);
        },
        exportImage(){
            /**
             * 在 uni-app:h5 中下载
             * uni app 未在 h5 中实现 saveImageToPhotosAlbum
             * @param {string} base64
             */
            const donwloadBase64 = base64 => {
                const a = document.createElement("a");
                a.href = base64;
                a.download = "mp-painter-playground-export.jpg";
                a.click();
            }

            uni.canvasToTempFilePath({
                canvasId: "canvas-playground",
                fileType: "jpg",
                width: uni.upx2px(this.canvasSize.width),
                height: uni.upx2px(this.canvasSize.height),
                success({ tempFilePath }){

                    // #ifdef H5
                    donwloadBase64(tempFilePath)
                    // #endif

                    // #ifndef H5
                    uni.saveImageToPhotosAlbum({ filePath: tempFilePath })
                    // #endif
                }
            })
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