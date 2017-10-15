import { Utils } from "./utils";

async function main(): Promise<void> {
    const paths = Utils.getFilesPaths("../data/training/Signs/Big/");
    console.log(await Utils.readAndExtractFeatures(paths));
    console.log("end");
}

main();
