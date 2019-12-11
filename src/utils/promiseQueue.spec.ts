import { promiseQueue } from "./promiseQueue";
import { delay } from "./delay";

describe("promiseQueue", () => {
    it("return array", async () => {
        let result = await promiseQueue([
            async () => 1,
            async () => 2,
            async () => 3
        ]);
        expect(result).toEqual([1, 2, 3]);
    });

    it("excute one after one", async () => {
        let time = - Date.now();
        await promiseQueue([
            async () => await delay(200),
            async () => await delay(100),
            async () => await delay(300),
        ]);
        time += Date.now();
        expect(time).toBeCloseTo(600, -1);
    });

    it("excute one by one", async () => {
        let fn = jest.fn();
        await promiseQueue([
            async () => { await delay(200); fn(1) },
            async () => { await delay(100); fn(2) },
            async () => { await delay(300); fn(3) },
        ]);
        expect(fn).toHaveBeenNthCalledWith(1, 1);
        expect(fn).toHaveBeenNthCalledWith(2, 2);
        expect(fn).toHaveBeenNthCalledWith(3, 3);
    });
});