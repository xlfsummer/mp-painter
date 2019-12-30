功能介绍
===
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
更多示例可参考 example 夹

API
===
构造函数
---
```ts
new Painter(
    ctx: CanvasContext,
    { platform?: "mp-weixin" | "mp-alipay" | "mp-baidu"  } = {}
): Painter
```

实例方法
---
### draw
绘制时使用的方法
```ts
draw(绘制对象): Promise<{ width: number, height: number }>
```

### measureText
帮助函数，用于手动测量文本
```ts
measureText(text: string, fontSize: number): number
```

绘制对象
===
通用
---
任意一类绘制对象都支持以下属性

字段名|类型|默认值
---|---|---
type| "text" / "text-block" / "image" / "line" / "rect" / "container"|-
position|"static" / "absolute"|static
top|number|0
left|number|0

- `type` 表示要绘制的元素的类型
- `position` 定位模式
- `top`/`left` 在 'absolute' 定位模式中表示距离父级 container 或 canvas 顶/左边的距离，
在 'static' 定位模式中，表示距离前一个 'static' 元素最下/右边的距离，有关元素排列方向，请参考 container

text
---
text 用于绘制单行文本

字段名|类型|默认值|描述
---|---|---|---
content|string|""|文本内容
color|string|"#000"|文本颜色
fontSize|number|30|字号
fontWeight|"normal" / "bold"|"normal"|字重
fontFamily|string|"serial"|字体
baseline|"top" / "middle" / "bottom" / "normal"|"top"|基线
align|"left"/ "right"/ "center"|"left"|文本对齐
width|number|null|元素的宽度, 水平排布时影响后一个元素的位置，为 null 时根据文字实际占用的宽度计算

text-block
---
text-block 用于绘制文本框

text-block 除了支持 text 所有的选项字段外还支持以下字段

字段名|类型|默认值|描述
---|---|---|---
lineHeight|number|40|文本行高
lineClamp|number|0|文本显示的最大行数，0表示不限制
width|number|100|文本块换行前的最大宽度

rect
---
rect 用于绘制矩形，暂不支持投影及圆角

字段名|类型|默认值|描述
---|---|---|---
width|number|-|矩形的宽
height|number|-|矩形的高
background|string|-|填充的颜色

line
---
line 用于绘制实线及虚线

字段名|类型|默认值|描述
---|---|---|---
dx|number|0|直线在 x 方向上的跨度
dy|number|0|直线在 y 方向上的跨度
color|string|-|直线的颜色
lineWidth|number|1|直线的宽度
dashPattern|number[]|[1,0]|虚线样式

image
---
image 用于绘制图片

字段名|类型|默认值|描述
---|---|---|---
src|string|-|图片的地址，支持外链地址/本地地址/临时地址
width|number|-|图片的宽度
height|number|-|图片的高度
objectFit|"fill"/"contain"|"fill"|与 css 的 objct-fit 属性含义相同

container
---
container 用于容纳多个绘图元素，并提供 absolute 定位基准

字段名|类型|默认值|描述
---|---|---|---
direction |"vertical" / "horizontal"|"vertical"|指定内部 static 元素的排列方向
width | number / "auto" | "auto" | 容器的宽度，"auto" 表示根据内部元素尺寸决定
height | number / "auto" | "auto" | 容器的宽高度，"auto" 表示根据内部元素尺寸决定
children | 绘制对象[] | [] | 容器内部的元素
