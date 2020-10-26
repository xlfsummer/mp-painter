export type UniPlatforms =  "mp-weixin" | "mp-alipay" | "mp-baidu" | "h5";

declare var wx: Uni

export const PLATFORM: UniPlatforms = (function(){
    // @ts-ignore
    if(typeof swan == "object")
        return "mp-baidu"
    // @ts-ignore
    if(typeof my == "object")
        return "mp-alipay"
    // @ts-ignore
    if(typeof wx == "object")
        return "mp-weixin"
    if(typeof window == "object")
        return "h5"
    return "mp-weixin"
})();

const _uni = (function(){

    if(typeof uni != "undefined")
        return uni

    if(typeof wx != "undefined")
        return wx;

    if(typeof window != "undefined")
        return {
            upx2px: (x: number) => x,
            getSystemInfoSync: () => ({ screenWidth: window.innerWidth }),
            downloadFile: (option: DownloadFileOption) => option.success?.({tempFilePath: option.url})
        };

    throw new Error("enviroment not support");
})();

export { _uni as uni };