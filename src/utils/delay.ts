/**
 * 创建指定时间后 resolve 的 Promise
 * @param timespan 延时时间
 */
export function delay(timespan: number = 0): Promise<void>{
	return new Promise(resolve => setTimeout(resolve, timespan));
}