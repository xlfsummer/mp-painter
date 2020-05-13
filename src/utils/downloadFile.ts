import { uni } from "../utils/platform"

export function downloadFileToLocal(path: string): Promise<string | undefined> {
    return new Promise((resolve, reject) =>
        uni.downloadFile({
            url: path,
            success: res => resolve(res.tempFilePath),
            fail: reject
        })
    );
}