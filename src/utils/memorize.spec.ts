import { memorize } from "./memorize"
describe(memorize, () => {

    let fn: jest.Mock<any, [string]>;
    let mfn: (arg: string) => any;

    beforeEach(() => {
        fn = jest.fn();
        mfn = memorize(fn);
    })

    it("call with same param", () => {
        mfn("a");
        mfn("a");
        expect(fn).toBeCalledTimes(1);
    });

    it("call with different param", () => {
        mfn("a");
        mfn("b");
        expect(fn).toBeCalledTimes(2);
    });

    it("cache value", () => {
        fn.mockImplementation((str: string) => {
            return Symbol();
        });
        let mfn = memorize(fn);

        let symbol = mfn("a");
        expect(mfn("a")).toBe(symbol);
    });

    it("cache value map", () => {
        fn.mockImplementation((str: string) => {
            return Symbol();
        });
        let mfn = memorize(fn);

        let symbolA = mfn("a");
        let symbolB = mfn("b");
        expect(mfn("a")).toBe(symbolA);
        expect(mfn("b")).not.toBe(symbolA);
        expect(mfn("a")).not.toBe(symbolB);
    });
});