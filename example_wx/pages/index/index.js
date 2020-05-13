import Painter from "mp-painter"

Page({
  data: {

  },
  onLoad() {
    let ctx = wx.createCanvasContext('canvas');
    let painter = new Painter(ctx);

    let text = {
      position: "absolute",
      type: "text",
      fontWeight: "bold",
      fontStyle: "italic",
      fontFamily: "Times, serif",
      fontSize: 60, // = 60rpx
      align: "center",
      baseline: "middle",
      content: "mp-painter DEMO",
    };

    painter.draw({
      type: "container",
      children: [
        {
          top: 103,
          left: 358,
          color: "#eeeeee",
          ...text
        }, {
          top: 100,
          left: 355,
          color: "#fc6000",
          ...text
        }
      ]
    })
  }
})
