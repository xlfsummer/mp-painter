mp-painter
===
![npm](https://img.shields.io/npm/v/mp-painter)
![size](https://img.shields.io/badge/bundle%20size-17.4%20kB-brightgreen)
![Test & Build](https://github.com/xlfsummer/mp-painter/actions/workflows/main.yml/badge.svg)
- 声明式地创建适用于 **Uniapp**, **原生微信小程序**, **原生H5** 的 canvas 海报
- 目前对H5、微信、支付宝、百度端做了兼容处理，其它端未测试
- 支持 text / rect / line / text-block / image 等对象绘制
- 支持基于文字宽度的多行文本换行，lineClamp 控制
- 基于 typescript 的友好代码提示
- 支持水平、垂直排列布局和绝对定位
- 会自动将支付宝的绘制尺寸放大两倍，解决其绘制模糊的问题
- 支持原生微信小程序使用，见 [wiki](https://github.com/xlfsummer/mp-painter/wiki/%E5%9C%A8%E5%8E%9F%E7%94%9F%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B8%AD%E4%BD%BF%E7%94%A8)

代码提示：  
![代码提示演示](https://raw.githubusercontent.com/wiki/xlfsummer/mp-painter/assets/IntelliSense.gif)

安装
===
```bash
npm install mp-painter --save

# 安装 beta 版
npm install mp-painter@next --save
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
    color: "#f33",
    fontSize: 60, // = 60rpx
    content: "Hello World" //绘制的文本
});
```
示例&文档
===
- 文档请查看 [wiki](https://github.com/xlfsummer/mp-painter/wiki)
- 示例请查看 [在线 DEMO](http://mp-painter.xlf-summer.cn/) 及 [DEMO 源码](https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages)  
也可通过手机扫描下方二维码进入 DEMO  
![DEMO站点二维码](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://mp-painter.xlf-summer.cn/)

- 交互式体验：将下面的代码复制到 [Playground](https://mp-painter.xlf-summer.cn/#/pages/playground/playground) , 运行并查看效果
```json
{
    "type": "text",
    "color": "#f33",
    "fontSize": 60,
    "content": "Hello World"
}
```

- 推荐通过查看在线 DEMO 站点与对应 DEMO 源码的方式理解和学习本插件

tips
===
目前，示例网址疑似被DNS污染无法访问，若要访问，请在 host 中增加记录：
```
185.199.108.153  mp-painter.xlf-summer.cn
```
