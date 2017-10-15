import { Image } from "image-js";
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
    async loadAndExtractFeatures(files: string[]): Promise<number[][]> {
        const tasks: Array<Promise<number[]>> = [];

        for (const fileName of files) {
            const task = new Promise<number[]>(async (resolve, reject) => {
                const image = await loadImageSync(fileName);
                resolve(extractFeature(image));
            });
            tasks.push(task);
        }

        return await Promise.all(tasks);
    }
};
