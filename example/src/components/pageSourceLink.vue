<template>
    <web-link :href="pageSourceUrl">
        查看当前页源代码
    </web-link>
</template>

<script>
export default {
    computed: {
        /**
         * 获取当前页面文件对应在 github 上的地址，默认为 master 分支
         * 
         * @example
         * https://github.com/xlfsummer/mp-painter/tree/master/example/src/pages/text/text.vue
        */
       pageSourceUrl(){
            /** 
             * 当前页面路径
             * @type {string}
             * 
             * @example
             * "/"                   // 首页
             * "/pages/text/text"    // 文本组件
            */
            let path;

            // #ifdef H5
                path = this.$route.path
            // #endif

            // #ifdef MP
                path = "/" + getCurrentPages().find(page => page.$vm === this.$root).route
            // #endif

            if(path === "/") path = "/pages/index/index";
            
            return `https://github.com/xlfsummer/mp-painter/tree/master/example/src${path}.vue`
        }
    },
}
</script>