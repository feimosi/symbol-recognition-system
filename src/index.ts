import { Logger } from "./utilities/logger";
import { ImageFeatures } from "./data-models/image-features";
import { Utils } from "./utilities/utils";
import { HogExtractorService } from "./services/hog-extractor-service";

async function main(): Promise<void> {
    const extractorService: HogExtractorService = new HogExtractorService();

    const paths: string[] = Utils.getFilesPaths("../../data/training/Signs/Big/");
    const images: ImageFeatures[] = await extractorService.loadAndExtractFeatures(paths);
}

main();
