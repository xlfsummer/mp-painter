<template>
    <view class="link" @click="handleClick">
        <slot />
    </view>
</template>

<script>
export default {
    props: {
        href: {
            type: String,
            required: true
        }
    },
    methods: {
        async handleClick (){
            // #ifdef H5
            window.open(this.href);
            // #endif

            // #ifndef H5
            await uni.setClipboardData({ data: this.href });
            uni.showToast({ icon: "none", title: "链接已复制, 请在浏览器中打开" });
            // #endif
        }
    }
}
</script>

<style>
.link {
    cursor: pointer;
    font-size: 14px;
    display: block;
    color: #3f51b5;
}
</style>
