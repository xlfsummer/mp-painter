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
    let canvas = ref(null)

    onMounted(() => {
      /** @type {HTMLCanvasElement} */
      let canvasEl = canvas.value;
      canvasEl.width = 800;
      canvasEl.height = 600;

      let ctx = canvasEl.getContext("2d");

      let painter = new Painter(ctx);

      // eslint-disable-next-line
      painter.draw({
        type: "container",
        children: [
          { type: "text", top: 10, content: "文字" },
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
          { type: "text", top: 10, content: "图片" },
          { type: "image", src: require("./assets/logo.png"), width: 100, height: 100 },
          { type: "rect", width: 100, height: 100, background: "blue" },
          { type: "text", top: 20, content: "Hello world" },
        ]
      });
    });

    return {
      canvas
    }
  }
}
</script>

