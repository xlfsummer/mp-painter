<template>
  <canvas ref="canvas" />
</template>

<script>
import { onMounted, ref } from 'vue';
import Painter from "../../dist/lib/painter";

export default {
  name: 'App',
  components: {
  },
  setup(){
    const canvas = ref(null);
    const IMAGE = { type: "image", src: require("./assets/logo.png"), width: 100, height: 100 };

    onMounted(() => {
      /** @type {HTMLCanvasElement} */
      let canvasEl = canvas.value;
      canvasEl.width = 800;
      canvasEl.height = 1000;

      let ctx = canvasEl.getContext("2d");

      let painter = new Painter(ctx);

      // eslint-disable-next-line
      painter.draw({
        type: "container",
        children: [
          { type: "text", top: 10, content: "文字 text" },
          { type: "container", top: 10, left: 10, direction: "horizontal", children: [
            { type: "text", content: "正常", fontWeight: "bold"},
            { type: "text", left: 10, content: "加粗", fontWeight: "bold" },
            { type: "text", left: 10, content: "斜体", fontStyle: "italic" },
            { type: "text", left: 10, content: "加粗斜体", fontStyle: "italic", fontWeight: "bold" },
          ]},
          { type: "container", top: 10, left: 10, direction: "horizontal", height: 40, children: [
            { type: "text", content: "字号40px", fontSize: 40},
            { type: "text", left: 10, content: "字号20px", fontSize: 20 },
            { type: "text", left: 10, content: "字号10px", fontSize: 10 },
            { type: "text", left: 10, content: "字号5px", fontSize: 5 },
          ]},
          { type: "container", top: 40, left: 10, direction: "horizontal", children: [
            { type: "line", dx: 750, color: "blue", position: "absolute" },
            { type: "text", baseline: "top", left: 10, content: "对齐-top"},
            { type: "text", baseline: "middle", left: 10, content: "对齐-middle"},
            { type: "text", baseline: "normal", left: 10, content: "对齐-normal"},
            { type: "text", baseline: "bottom", left: 10, content: "对齐-bottom"},
          ]},
          { type: "text", top: 30, content: "图片 image" },
          // 支持空的 container
          { type: "container", top: 10, left: 10, direction: "horizontal", children: [ ]},
          { type: "container", top: 10, left: 10, direction: "horizontal", children: [
            { ...IMAGE },
            { ...IMAGE, left: 10, width: 50},
            { ...IMAGE, left: 10, width: 50, objectFit: "contain"},
            { ...IMAGE, left: 10, width: 50, objectFit: "cover", objectPosition: ["left", "center"]},
            { ...IMAGE, left: 10, width: 50, objectFit: "cover"},
            { ...IMAGE, left: 10, width: 50, objectFit: "cover", objectPosition: ["right", "center"]},
          ]},
          { type: "text", top: 30, content: "矩形 rect" },
          { type: "container", top: 10, left: 10, direction: "horizontal", children: [
            { type: "rect", width: 50, height: 50, background: "#e66" },
            { type: "rect", left: 10, borderRadius: 10, width: 50, height: 50, background: "#ee6" },
            { type: "rect", left: 10, borderRadius: [10, 30, 10, 30], width: 50, height: 50, background: "#66e" },
            { type: "rect", left: 10, borderRadius: 50, width: 50, height: 50, background: "#6e6" }
          ]},
          { type: "text", top: 30, content: "文本块 text-block" },
          { type: "text-block", top: 10, fontSize: 22, lineHeight: 30, lineClamp: 3, width: 500, content: "示例文本".repeat(30)},
          { type: "text", top: 30, content: "裁剪 clip" },
          { type: "clip",
            path: { type: "rounded-rect", top: 10, left: 10, width: 100, height: 100, borderRadius: 50 },
            content: { type: "text-block", fontSize: 22, lineHeight: 30, lineClamp: 4, width: 150, content: "示例文本".repeat(30)},
          },
          { type: "text", top: 30, content: "变换 transform" },
          {
            type: "transform",
            transform: [
              { type: "translate", x: 20, y: 20 },
              { type: "rotate", rotate: 45 },
            ],
            content: { type: "rect", width: 50, height: 50, background: "#6ee" },
          }
        ]
      });
    });

    return {
      canvas
    }
  }
}
</script>

<style scoped>
canvas {
  border: 1px #ddd solid;
}
</style>
