import { ImageFeatures } from "./data-models/image-features";
import { Utils } from "./utilities/utils";
import { HogExtractorService } from "./services/hog-extractor-service";

async function main(): Promise<void> {
    const paths: string[] = Utils.getFilesPaths("../../data/training/Signs/Big/");
    const images: ImageFeatures[] = await HogExtractorService.loadAndExtractFeatures(paths);
    console.log("end");
}

main();
