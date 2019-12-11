export function promiseQueue<T>(queue: (() => Promise<T>)[]): Promise<T[]> {
    return queue.reduce(
        async (resultPromise, queueItem) => [...await resultPromise, await queueItem()], 
        Promise.resolve([]) as Promise<T[]>
    );
}
