import { Utils } from "./utils";

async function main(): Promise<void> {
    console.log(await Utils.readFiles());
    console.log("end");
}

main();
