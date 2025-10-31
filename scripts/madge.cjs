const exec = require("child_process").exec;
const path = require("path");
const fs = require("fs-extra");
const madge = require("madge");

const jsOutput = path.resolve(__dirname, "../js");
if (fs.existsSync(jsOutput)) {
    fs.removeSync(jsOutput);
}

const input = path.resolve(jsOutput, "index.js");
const output = path.resolve(__dirname, "../madge/image.svg");

const tsconfig = path.resolve(__dirname, "../tsconfig.madge.json");

exec(`npx tsc --project ${tsconfig}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);

    madge(input)
        .then((res) => {
            // res.image(output);
        })
        .then((writtenImagePath) => {
            console.log("Image written to " + writtenImagePath);
        });

    madge(input).then((res) => {
        console.log("---------------- file dependencies ----------------");
        console.log(res.obj());

        console.log("---------------- circular dependencies ----------------");

        console.log(res.circular());

        console.log("---------------- circular dependencies graph ----------------");
        console.log(res.circularGraph());

        if (fs.existsSync(jsOutput)) {
            fs.removeSync(jsOutput);

            console.log("js cache cleared");
            console.log("done");
        }
    });
});
