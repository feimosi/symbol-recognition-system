import { ImageFeatures } from "./../data-models/image-features";
import { Image } from "image-js";
import { Utils } from "../utilities/utils";
import * as Hog from "hog-features";

/** Hog descriptor parameters */
const hogParams = {
    bins: 6,        // bins per histogram
    blockSize: 10,   // length of block in number of cells
    blockStride: 20, // number of cells to slide block window by (block overlap)
    cellSize: 50,    // length of cell in px
    norm: "L2",      // block normalization method
};

/** Extracts features from file with given name. */
function extractFeature(image: Image): number[] {
    return Hog.extractHOG(image, hogParams);
}

/** Loads an image form path. */
async function loadImageSync(fileName: string): Promise<Image> {
    return await Image.load(fileName);
}

export const HogExtractorService = {

    /** Loads imate to memory and extracts features from it */
    async loadAndExtractFeatures(files: string[]): Promise<ImageFeatures[]> {
        const tasks: Array<Promise<ImageFeatures>> = [];

        for (const fileName of files) {
            const task = new Promise<ImageFeatures>(async (resolve, reject) => {
                const catalogName: string = Utils.getCatalogName(fileName);
                const features: number[] = extractFeature(await loadImageSync(fileName));
                const imageFeatures: ImageFeatures = new ImageFeatures(features, catalogName.charCodeAt(0), catalogName);
                resolve(imageFeatures);
            });
            tasks.push(task);
        }

        return await Promise.all(tasks);
    }
};
