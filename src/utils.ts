import { Image, crop } from "image-js";
import * as FileSource from "fs";
import * as Hog from "hog-features";
import * as Path from "path";

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
    return Image.load(fileName).then((image): number[] => {
        const descriptor: number[] = Hog.extractHOG(image, hogParams);
        return descriptor;
    });
}

/** Constains all application utilities */
export const Utils = {

    /** Reads files form directory */
    async readAndExtractFeatures(absoluteFilesPaths: string[]): Promise<number[][]> {
        const tasks: Array<Promise<number[]>> = [];
        for (const fileName of absoluteFilesPaths) {
            tasks.push(extractFeature(fileName));
        }
        return await Promise.all(tasks);
    },

    /** Read all files recursivly form directory */
    getFilesPaths(directoryPath: string, subDirectory?: string): string[] {
        const resolvedPath: string = Path.resolve(__dirname, directoryPath, !subDirectory ? "" : subDirectory);
        let paths: string[] = new Array<string>();

        if (FileSource.statSync(resolvedPath).isDirectory()) {
            const list: string[] = FileSource.readdirSync(resolvedPath);
            for (const fileName of list) {
                paths = paths.concat(this.getFilesPaths(resolvedPath, fileName));
            }
        } else {
            paths.push(resolvedPath);
        }

        return paths;
    }
};
