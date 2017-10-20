import { Logger } from "./utilities/logger";
import { ImageFeatures } from "./data-models/image-features";
import { Utils } from "./utilities/utils";
import { HogExtractorService } from "./services/hog-extractor-service";

async function main(): Promise<void> {
    const file: string = "../../data/extracted-features.json";
    const extractorService: HogExtractorService = new HogExtractorService();
    let images: ImageFeatures[];

    if (Utils.fileExists(file)) {
        images = Utils.loadFromFile(file);
    } else {
        const paths: string[] = Utils.getFilesPaths("../../data/training/Signs/Big/");
        images = await extractorService.loadAndExtractFeatures(paths);
        Utils.saveToFile(file, images);
    }

    console.log("Program successfully finished");
}

main();
