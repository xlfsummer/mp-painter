/**
 * 修复绘制直线的精度
 * @param x px 值
 * @param y px 值
 * @param width 线宽 px 值
 */
export function pixelFix(x: number, y: number, width: number = 1){
    return width % 2
        ? [Math.floor(x) + .5, Math.floor(y) + .5]
        : [Math.round(x), Math.round(y)]
}