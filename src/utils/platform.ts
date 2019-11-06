export const PLATFORM = (function(){
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