var swan: unknown;
var my: unknown;
var wx: unknown;

export type UniPlatforms =  "mp-weixin" | "mp-alipay" | "mp-baidu";

export const PLATFORM: UniPlatforms = (function(){
    if(typeof swan == "object")
        return "mp-baidu"
    if(typeof my == "object")
        return "mp-alipay"
    if(typeof wx == "object")
        return "mp-weixin"
    return "mp-weixin"
})();
