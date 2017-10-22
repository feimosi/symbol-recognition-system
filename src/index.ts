import { Logger } from "./utilities/logger";
import { ImageFeatures } from "./data-models/image-features";
import { Utils } from "./utilities/utils";
import { IFeatureExtractor } from "./services/ifeature-extractor";
import { SimpleResizeExtractorService } from "./services/simple-resize-extractor-service";
import { ClassificationService } from "./services/classification-service";

async function main(): Promise<void> {
    const file: string = "../../data/extracted-features.json";
    const extractorService: IFeatureExtractor = new SimpleResizeExtractorService();
    let images: ImageFeatures[];

    if (Utils.fileExists(file)) {
        images = Utils.loadFromFile(file);
    } else {
        const paths: string[] = Utils.getFilesPaths("../../data/training/Signs/Big/");
        images = await extractorService.loadAndExtractFeatures(paths);
        Utils.saveToFile(file, images);
    }

    const classificator = new ClassificationService(images);
    console.log("Program successfully finished");
}

main();
