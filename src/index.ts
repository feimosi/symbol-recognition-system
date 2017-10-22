import { ImageFeatures } from "./data-models/image-features";
import { CoreImage } from "./data-models/core-image";
import { Logger } from "./utilities/logger";
import { Utils } from "./utilities/utils";
import { IFeatureExtractor } from "./services/ifeature-extractor";
import { SimpleImageResizer } from "./services/simple-resize-extractor-service";
import { ClassificationService } from "./services/classification-service";
import { PCAFeatureExtractor } from "./services/pca-feature-extractor";

async function main(): Promise<void> {
    const paths: string[] = Utils.getFilesPaths("../../data/training/Signs/Big/");

    const imageResizer: SimpleImageResizer = new SimpleImageResizer("../../data/resized-images.json");

    const images: CoreImage[] = await imageResizer.loadAndResizeImages(paths);
    const featureExtractor: IFeatureExtractor = new PCAFeatureExtractor("../../data/pca-data-model.json", images);
    const features: ImageFeatures[] = await featureExtractor.extractFeatures(images, 120);

    const classificator = new ClassificationService(features);
    console.log("Program successfully finished");
}

main();
