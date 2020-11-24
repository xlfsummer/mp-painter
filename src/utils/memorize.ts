export function memorize<P, T>(fn: (arg: P) => T){
    let map = new Map<P, T>();
    return function (arg: P): T {

        if(!map.has(arg))
            map.set(arg, fn(arg));
        return map.get(arg)!;
    }
}