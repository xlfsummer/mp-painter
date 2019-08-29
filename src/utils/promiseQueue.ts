export function promiseQueue<T>(queue: (() => Promise<T>)[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        let i = 0;
        let l = queue.length;
        let results: T[] = [];
        if (l == 0) resolve([]);

        queue[i]().then(next).catch(reject);
        function next(ret: T) {
            results.push(ret);
            i++;
            i < l
                ? queue[i]().then(next)
                : resolve(results);
        }
    });
}