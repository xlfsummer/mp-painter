import Painter from "mp-painter"

Page({
  data: {

  },
  onLoad() {
    let ctx = wx.createCanvasContext('canvas');
    let painter = new Painter(ctx);
    painter.draw({
      type: "container",
      children: [
        {
          top: 20,
          left: 350,
          type: "text",
          align: "center",
          position: "absolute",
          fontSize: 100,
          content: "mp-painter",
          fontWeight: "bold",
          fontStyle: "italic",
          color: "#f44"
        },
        {
          top: 30,
          left: 360,
          type: "text",
          position: "absolute",
          align: "center",
          fontSize: 100,
          content: "mp-painter",
          fontWeight: "bold",
          fontStyle: "italic"
        }
      ]
    })
  }
})
