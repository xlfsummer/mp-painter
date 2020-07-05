<template>
    <view class="page">
		<view class="page-title h2">图片地址</view>
		<canvas id="canvas-image"
            canvas-id="canvas-image" class="canvas" style="height: 880rpx"/>
        <view class="page-title h2">图片 - 自适应(objectFit)</view>

        <picker mode="multiSelector" 
            :value="[1,1]"
            :range="[['left', 'center', 'right'],['top', 'center', 'bottom']]"
            @change="pickerChange"
        >
            <view class="code">object-position: {{horizontalPosition}}, {{verticalPosition}}</view>
        </picker>
        <view>↑ 点击以修改, 如果在 pc 上浏览，请打开 移动端/触摸 调试模式</view>

		<canvas id="canvas-image-contain"
            canvas-id="canvas-image-contain" class="canvas" style="height: 720rpx"/>

        <web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/image/image.vue"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";

/**
 * uni-app import 图片时，
 * 如果图片尺寸较小，会自动转为 base64；
 * 如果图片尺寸较大，会自动转为绝对路径。
 * 这里示例图片的尺寸较小，会转为 base64。
 */ 
import imageBase64 from "@/static/demo.png"

const LOCAL_IMAGE_RELATIVE_PATH = "../../static/demo.png";

const image =  {type: "image", top: 10, width: 200, height: 150, src: LOCAL_IMAGE_RELATIVE_PATH};

export default {
    data(){
        return {
            horizontalPosition: "center",
            verticalPosition: "center"
        };
    },
    onReady(){
        new Painter(
            uni.createCanvasContext("canvas-image")
        ).draw({
            type: "container", top: 5, left: 15,
            children: [
                {type: "text", top: 20, content: "网络路径" },
                { ...image, 
                    // 注意，在小程序中使用远程地址需要配置文件下载域名
                    src: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/uniapp4@2x.png"
                }, 
                {type: "text", top: 20, content: "本地相对路径" },
                { ...image, src: "../../static/demo.png" }, 

                {type: "text", top: 20, content: "本地绝对路径" },
                { ...image, src: "/static/demo.png" }, 

                {type: "text", top: 20, content: "base64 (谨慎使用，小程序预览中无法显示)" },
                { ...image, src: imageBase64 }, 
            ]
        });

        this.updateSecondCanvas();
    },
    methods: {
        pickerChange({ detail }){
            this.horizontalPosition = ["left", "center", "right"][detail.value[0]];
            this.verticalPosition = ["top", "center", "bottom"][detail.value[1]];
            this.updateSecondCanvas();
        },
        updateSecondCanvas(){
            new Painter(
                uni.createCanvasContext("canvas-image-contain")
            ).draw({
                type: "container", top: 5, left: 15,
                children: [
                    { type: "rect", position: "absolute", top: 0, left: 0, height: 720, width: 720, background: "#fff" },

                    {type: "text", top: 20, content: "objectFit: fill (default)" },
                    {...image, objectPosition: [this.horizontalPosition, this.verticalPosition]},

                    {type: "text", top: 20, content: "objectFit: contain" },
                    {...image, objectFit: "contain", objectPosition: [this.horizontalPosition, this.verticalPosition]},

                    {type: "text", top: 20, content: "objectFit: cover" },
                    {...image, objectFit: "cover", objectPosition: [this.horizontalPosition, this.verticalPosition]},
                ]
            });
        }
    }
}
</script>

<style scoped>
.code {
    font-family: monospace;
    text-decoration: underline;
}
.item {
    height: 80rpx;
}
</style>
