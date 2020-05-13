export type UniPlatforms =  "mp-weixin" | "mp-alipay" | "mp-baidu";

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
    return "mp-weixin"
})();

const _uni = (function(){

    if(typeof uni != "undefined")
        return uni

    if(typeof wx != "undefined")
        return wx;

    throw new Error("enviroment not support");
})();

export { _uni as uni };