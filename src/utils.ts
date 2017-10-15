import { Image } from "image-js";
import * as FileSource from "fs";
import * as Hog from "hog-features";
import * as Path from "path";

/** Files directory path */
const DATA_PATH: string = "../data/tests/";

/** Hog descriptor parameters */
const hogParams = {
    bins: 6,        // bins per histogram
    blockSize: 10,   // length of block in number of cells
    blockStride: 20, // number of cells to slide block window by (block overlap)
    cellSize: 50,    // length of cell in px
    norm: "L2",      // block normalization method
};

/** Extracts features from file with given name. */
function extractFeature(fileName: string): Promise<number[]> {
    return Image.load(fileName).then((image: Image): number[] => {
        const descriptor: number[] = Hog.extractHOG(image, hogParams);
        console.log(descriptor);
        return descriptor;
    });
}

/** Constains all application utilities */
export const Utils = {

    /** Reads files form directory */
    readFiles(): void {
        FileSource.readdir(Path.resolve(__dirname, DATA_PATH), async (err: NodeJS.ErrnoException, list: string[]) => {
            for (const fileName of list) {
                const prom: number[] = await extractFeature(Path.resolve(__dirname, DATA_PATH, fileName));
            }
        });
    }
};
