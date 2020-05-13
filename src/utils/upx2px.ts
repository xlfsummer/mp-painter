import { uni } from "../utils/platform";

export let upx2px = (function(){
    if(typeof uni.upx2px == "function"){
        return uni.upx2px;
    }

    let scale = (uni.getSystemInfoSync().screenWidth ?? 375) / 750;
    return function(upx: number){
        return upx * scale
    }
})();