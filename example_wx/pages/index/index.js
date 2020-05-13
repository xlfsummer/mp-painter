import Painter from "mp-painter"

Page({
  data: {

  },
  onLoad() {
    let ctx = wx.createCanvasContext('canvas');
    let painter = new Painter(ctx);
    painter.draw({
      type: "rect",
      width: 700,
      height: 40,
      background: "#f44"
    })
  }
})
