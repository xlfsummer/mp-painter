
let cp = require("child_process");
let fs = require("fs");
let os = require("os");
let path = require("path");

let npm = os.platform() == "win32" ? "npm.cmd" : "npm";

// npm run build
console.time("编译 ts");
let buildResult = cp.spawnSync(npm, ["run", "build"])
// process.stdout.write(buildResult.stdout);
// process.stdout.write(buildResult.stderr);
console.timeEnd("编译 ts");

console.time("打包文件");
let packResult = cp.spawnSync(npm, ["pack"]);
let fileNameBuffer = packResult.stdout;
let fileName = Buffer.from(fileNameBuffer).toString().trim();
console.timeEnd("打包文件");

console.time("移动包文件");
fs.renameSync(fileName, "example" + path.delimiter + fileName);
console.timeEnd("移动包文件");

console.time("安装包");
let installResult = cp.spawnSync(npm, ["install", fileName], { cwd: "example" });
// process.stdout.write(installResult.stdout);
// process.stdout.write(installResult.stderr);
console.timeEnd("安装包");

console.time("删除已安装的包文件");
fs.unlinkSync("example" + path.delimiter + fileName);
console.timeEnd("删除已安装的包文件");