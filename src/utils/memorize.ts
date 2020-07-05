export function memorize<T>(fn: (arg: string) => T){
    let map = Object.create(null);
    return function (arg: string): T {
        if(!(arg in map))
            map[arg] = fn(arg);
        return map[arg];
    }
}