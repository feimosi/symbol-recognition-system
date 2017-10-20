import { Logger } from "./../utilities/logger";
import { ImageFeatures } from "./../data-models/image-features";
import { HogParameters } from "../data-models/hog-parameters";
import { Utils } from "../utilities/utils";
import { Image } from "image-js";
import * as Hog from "hog-features";

/** Hog extractor */
export class HogExtractorService {

    /** Hog descriptor parameters */
    private hogParams: HogParameters;

    /** The constructor */
    public constructor(hogParameters?: HogParameters) {
        if (hogParameters) {
            this.hogParams = hogParameters;
        } else {
            this.hogParams = {
                bins: 6,        // bins per histogram
                blockSize: 10,   // length of block in number of cells
                blockStride: 20, // number of cells to slide block window by (block overlap)
                cellSize: 50,    // length of cell in px
                norm: "L2",      // block normalization method
            };
        }
    }

    /** Loads imate to memory and extracts features from it */
    public async loadAndExtractFeatures(files: string[]): Promise<ImageFeatures[]> {
        const imagesWithFeatures: ImageFeatures[] = [];

        for (const fileName of files) {
            const catalogName: string = Utils.getCatalogName(fileName);
            const features: number[] = this.extractFeature(await this.loadImageSync(fileName));
            const imageFeatures: ImageFeatures = new ImageFeatures(features, catalogName.charCodeAt(0), catalogName);

            imagesWithFeatures.push(imageFeatures);
            Logger.log(`${fileName} - file converted to features. ${Math.round(((files.indexOf(fileName) + 1) / files.length) * 10000) / 100}% finished`);
        }

        return imagesWithFeatures;
    }

    /** Extracts features from file with given name. */
    private extractFeature(image: Image): number[] {
        return Hog.extractHOG(image, this.hogParams);
    }

    /** Loads an image form path. */
    private async loadImageSync(fileName: string): Promise<Image> {
        return await Image.load(fileName);
    }
}
