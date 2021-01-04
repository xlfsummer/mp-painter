/** 移除换行符 */
export function removeLineFeed(str: string) {
    return str.replace(/[\n\r]/g, "");
}
