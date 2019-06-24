export function promiseQueue<T>(queue: Array<() => Promise<T>>): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
        let i = 0;
        let l = queue.length;
        let results = [];
        if (l == 0) resolve([]);

        queue[i]().then(next).catch(reject);
        function next(ret) {
            results.push(ret);
            i++;
            i < l
                ? queue[i]().then(next)
                : resolve(results);
        }
    });
}