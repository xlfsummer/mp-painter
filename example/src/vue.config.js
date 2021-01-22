module.exports = {
    chainWebpack: config => {
        config.module.rule('images').tap(option => {

            // 使用静态图片地址，以便在 Playground 中使用
            option.limit = 80;
            option.fallback = {
                loader: 'file-loader',
                options: { name: 'static/img/[name].[ext]' }
            }
        })
    }
}