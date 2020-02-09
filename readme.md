mp-painter
===
![npm](https://img.shields.io/npm/v/mp-painter)
![size](https://img.shields.io/bundlephobia/min/mp-painter)
- 声明式地创建适用于 uniapp 的 canvas 海报
- 目前对微信、支付宝、百度端做了兼容处理，其它端还未调试过
- 支持 text / rect / line / text-block / image 等对象绘制
- 支持基于文字宽度的多行文本换行，lineClamp 控制
- 基于 typescript 的友好代码提示
- 支持水平、垂直排列布局和绝对定位
- 会自动将支付宝的绘制尺寸放大两倍，解决其绘制模糊的问题

安装
===
```bash
npm install mp-painter --save
```

Hello World
===
```html
<template>
    <canvas canvas-id="canvas"></canvas>
</template>
```
```js
import Painter from "mp-painter";

// onReady 中
let painter = new Painter(uni.createCanvasContext("canvas"));
await painter.draw({
    type: "text",
    color: "#fcc",
    fontSize: 60, // = 60rpx
    content: "Hello World" //绘制的文本
});
```

> - 更多文档请查看 [wiki](https://github.com/xlfsummer/mp-painter/wiki)
> - 更多示例请查看[在线 DEMO](http://mp-painter.xlf-summer.cn/) 及[DEMO 源码](https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages)
