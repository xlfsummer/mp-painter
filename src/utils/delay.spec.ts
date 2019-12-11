import { delay } from "./delay";

describe("delay", () => {
    it("resolve", () => {
        expect(delay(100)).resolves.toBe(undefined);
    });

    it("resolve after time", async () => {
        let timer = -Date.now();
        await delay(1000);
        timer += Date.now()
        expect(timer).toBeCloseTo(1000, -1);
    });
});
