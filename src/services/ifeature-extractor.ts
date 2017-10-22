import { ImageFeatures } from "../data-models/image-features";
import { CoreImage } from "../data-models/core-image";

export interface IFeatureExtractor {
    extractFeatures(images: CoreImage[], featuresCount: number): Promise<ImageFeatures[]>;
}
