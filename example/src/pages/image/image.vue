<template>
    <view class="page">
		<view class="page-title h2">网络图片</view>
		<canvas id="canvas-image"
            canvas-id="canvas-image" class="canvas" style="height: 230upx"/>
        <view class="page-title h2">图片 - 自适应(contain)</view>
		<canvas id="canvas-image-contain"
            canvas-id="canvas-image-contain" class="canvas" style="height: 430upx"/>

        <web-link href="https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/image/image.vue"/>
    </view>
</template>

<script>
import Painter from "../../../../dist/lib/painter";


export default {
    data(){
        return {};
    },
    onReady(){
        const LOCAL_IMAGE = "../../static/demo.png";

        new Painter(
            uni.createCanvasContext("canvas-image")
        ).draw({
            type: "image", top: 10, left: 10, width: 270, height: 66,
            // 注意，在小程序中使用远程地址需要配置文件下载域名
            src: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/uniapp4@2x.png"
        });

        new Painter(
            uni.createCanvasContext("canvas-image-contain")
        ).draw({
            type: "container", top: 5, left: 15,
            children: [
                {type: "image", top: 10, width: 550, height: 200, src: LOCAL_IMAGE},
                {type: "image", top: 10, width: 550, height: 200, src: LOCAL_IMAGE, objectFit: "contain"},
            ]
        });
    }
}
</script>

<style scoped>

</style>
