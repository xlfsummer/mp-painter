/**
 * 创建指定时间后 resolve 的 Promise
 * @param timespan 延时时间
 */
export function delay(timespan: number): Promise<void>{
	return new Promise(resolve => setTimeout(resolve, timespan));
}
