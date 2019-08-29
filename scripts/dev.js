
let cp = require("child_process");
let { promisify } = require("util");
let fs = require("fs");

process.stdout.write(
    cp.spawnSync(
        "node", ["C:\\Program Files\\nodejs\\node_modules\\npm", "run", "build"]
).stdout);

process.stdout.write(
    cp.spawnSync(
        "node", ["C:\\Program Files\\nodejs\\node_modules\\npm", "pack"]
    ).stdout
);

let fileNameBuffer = cp.spawnSync(
    "node", ["C:\\Program Files\\nodejs\\node_modules\\npm", "pack"]
).stdout;

let fileName = Buffer.from(fileNameBuffer).toString();

// console.log(data);

// todo
// npm run build
// npm pack
// mv [package_name_version] example
// cd example
// npm install [package_name_version]
