interface MPAsyncFn {
    (options?: {
        success?: (result?: any) => void,
        fail?: () => void,
        complete?: () => void
    }): any
}

type MPAsyncFnOption<F extends MPAsyncFn> = 
    F extends (options?: infer TOpt) => any ? TOpt : {};
    
type MPAsyncFnResult<F extends MPAsyncFn> =
    MPAsyncFnOption<F> extends { success?: (result: infer TRes) => void } ? TRes : void;

export function promisify<F extends MPAsyncFn>(asyncFunc: F){
    return function(options: MPAsyncFnOption<F> = ({} as MPAsyncFnOption<F>)): Promise<MPAsyncFnResult<F>>{
        return new Promise((resolve, reject) => {
            options.success = resolve;
            options.fail = reject;
            asyncFunc(options);
        });
    }
}
