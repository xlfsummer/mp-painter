<template>
    <view class="page">
		<view class="page-title h2">图片地址</view>
		<canvas id="canvas-image"
            canvas-id="canvas-image" class="canvas" style="height: 880rpx"/>
        <view class="page-title h2">图片 - 自适应(objectFit)</view>
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

export default {
    data(){
        return {};
    },
    onReady(){
        const LOCAL_IMAGE_RELATIVE_PATH = "../../static/demo.png";

        const image =  {type: "image", top: 10, width: 200, height: 150, src: LOCAL_IMAGE_RELATIVE_PATH};

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

        new Painter(
            uni.createCanvasContext("canvas-image-contain")
        ).draw({
            type: "container", top: 5, left: 15,
            children: [
                {type: "text", top: 20, content: "objectFit: fill (default)" },
                {...image},

                {type: "text", top: 20, content: "objectFit: contain" },
                {...image, objectFit: "contain"},

                {type: "text", top: 20, content: "objectFit: cover" },
                {...image, objectFit: "cover"},
            ]
        });
    }
}
</script>

<style scoped>

</style>
