import { Utils } from "./../utilities/utils";
import { CoreImage } from "./../data-models/core-image";
import { IFeatureExtractor } from "./ifeature-extractor";
import { ImageFeatures } from "../data-models/image-features";
import * as PCA from "ml-pca";

export class PCAFeatureExtractor implements IFeatureExtractor {

    private readonly pcaModelPath: string;
    private readonly pca: PCA;

    public constructor(pcaModelPath: string, images: CoreImage[]) {
        if (Utils.fileExists(pcaModelPath)) {
            this.pca = PCA.load(Utils.loadFromFile(pcaModelPath));
        } else {
            const dataset: number[][] = this.transformToFeatureArray(images);
            this.pcaModelPath = pcaModelPath;
            this.pca = new PCA(dataset);
            Utils.saveToFile(pcaModelPath, this.pca.toJSON());
        }
    }

    public extractFeatures(images: CoreImage[], featuresCount: number): Promise<ImageFeatures[]> {
        return new Promise<ImageFeatures[]>((resolve, error) => {
            const result: ImageFeatures[] = [];

            for (const image of images) {
                const features: number[] = this.pca.predict([[].concat.apply([], image.originalImage)])[0].splice(0, featuresCount);
                result.push(new ImageFeatures(image.originalImage, image.label, image.name, features));
            }

            resolve(result);
        });
    }

    public extractFeaturesSingle(image: CoreImage, featuresCount: number): Promise<ImageFeatures> {
        return new Promise<ImageFeatures>((resolve, error) => {
            const features: number[] = this.pca.predict([[].concat.apply([], image.originalImage)])[0].splice(0, featuresCount);
            resolve(new ImageFeatures(image.originalImage, image.label, image.name, features));
        });
    }

    private transformToFeatureArray(images: CoreImage[]): number[][] {
        const result: number[][] = [];

        for (const image of images) {
            result.push([].concat.apply([], image.originalImage));
        }

        return result;
    }
}
