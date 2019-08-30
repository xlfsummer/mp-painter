export let platform = "mp-weixin1";

// #ifdef MP-WEIXIN
platform = "mp-weixin";
// #endif

// #ifdef MP-ALIPAY
platform = "mp-alipay";
// #endif

// #ifdef MP-BAIDU
platform = "mp-alipay";
// #endif
