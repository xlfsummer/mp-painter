describe("Painter", () => {
    it("支持将实例保存在 uni 数据对象上", async () => {

        // mock 'uni' before import Painter
        // @ts-ignore
        global.uni = { upx2px: (x: number) => x };

        const { default: Painter } = await import("./painter");

        const painter = new Painter({} as CanvasContext);

        // 保存到 uni 对象上会调用 JSON.stringify 传递到视图层
        expect(() => JSON.stringify(painter)).not.toThrow();
    });
});