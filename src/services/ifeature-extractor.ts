import { ImageFeatures } from "../data-models/image-features";

export interface IFeatureExtractor {
    loadAndExtractFeatures(files: string[]): Promise<ImageFeatures[]>;
}
