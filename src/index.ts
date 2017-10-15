import { Utils } from "./utils";
import { HogExtractorService } from "./services/hog-extractor-service";

async function main(): Promise<void> {
    const paths = Utils.getFilesPaths("../data/training/Signs/Big/");
    const images = await HogExtractorService.loadAndExtractFeatures(paths);
    console.log("end");
}

main();
