import { calcConcreteRect } from "./object-sizing"

describe(calcConcreteRect, () => {
    it("图片胖, contain, 缩小", () => {
        expect(calcConcreteRect(
            { objectFit: "contain"},
            { width: 200, height: 100 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 0, sw: 200, sh: 100,
            dx: 0, dy: 25, dw: 100, dh: 50
        });
    });

    it("图片胖, contain, 放大", () => {
        expect(calcConcreteRect(
            { objectFit: "contain"},
            { width: 50, height: 25 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 0, sw: 50, sh: 25,
            dx: 0, dy: 25, dw: 100, dh: 50
        });
    });

    it("图片胖, cover, 缩小", () => {
        expect(calcConcreteRect(
            { objectFit: "cover" },
            { width: 400, height: 200 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 100, sy: 0, sw: 200, sh: 200,
            dx: 0, dy: 0, dw: 100, dh: 100
        });
    });

    it("图片胖, cover, 放大", () => {
        expect(calcConcreteRect(
            { objectFit: "cover" },
            { width: 100, height: 50 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 25, sy: 0, sw: 50, sh: 50,
            dx: 0, dy: 0, dw: 100, dh: 100
        });
    });

    it("图片瘦, contain, 缩小", () => {
        expect(calcConcreteRect(
            { objectFit: "contain" },
            { width: 100, height: 200 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 0, sw: 100, sh: 200,
            dx: 25, dy: 0, dw: 50, dh: 100
        });
    });

    it("图片瘦, contain, 放大", () => {
        expect(calcConcreteRect(
            { objectFit: "contain" },
            { width: 25, height: 50 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 0, sw: 25, sh: 50,
            dx: 25, dy: 0, dw: 50, dh: 100
        });
    });

    it("图片瘦, cover, 缩小", () => {
        expect(calcConcreteRect(
            { objectFit: "cover" },
            { width: 200, height: 400 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 100, sw: 200, sh: 200,
            dx: 0, dy: 0, dw: 100, dh: 100
        });
    });

    it("图片瘦, cover, 放大", () => {
        expect(calcConcreteRect(
            { objectFit: "cover" },
            { width: 50, height: 100 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 25, sw: 50, sh: 50,
            dx: 0, dy: 0, dw: 100, dh: 100
        });
    });

    it("图框比例相同", () => {
        expect(calcConcreteRect(
            { objectFit: "cover" },
            { width: 100, height: 100 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 0, sw: 100, sh: 100,
            dx: 0, dy: 0, dw: 100, dh: 100
        });

        expect(calcConcreteRect(
            { objectFit: "contain" },
            { width: 100, height: 100 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 0, sw: 100, sh: 100,
            dx: 0, dy: 0, dw: 100, dh: 100
        });
    })

    it("图框比例相同 - 缩放", () => {
        expect(calcConcreteRect(
            { objectFit: "cover" },
            { width: 200, height: 200 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 0, sw: 200, sh: 200,
            dx: 0, dy: 0, dw: 100, dh: 100
        });

        expect(calcConcreteRect(
            { objectFit: "contain" },
            { width: 50, height: 50 },
            { width: 100, height: 100 }
        )).toEqual({
            sx: 0, sy: 0, sw: 50, sh: 50,
            dx: 0, dy: 0, dw: 100, dh: 100
        });
    })
})