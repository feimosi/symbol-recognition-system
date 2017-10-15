import * as Path from "path";
import * as FileSource from "fs";
import * as Hog from "hog-features";
import { Image } from "image-js";

const DATA_PATH: string = "../data/tests/";

/** Constains all application utilities */
export module Utils {

    /** Hog descriptor parameters */
    const hogParams: object = {
        cellSize: 50,    // length of cell in px
        blockSize: 10,   // length of block in number of cells
        blockStride: 20, // number of cells to slide block window by (block overlap)
        bins: 6,        // bins per histogram
        norm: "L2"      // block normalization method
    };

    /** Reads files form directory */
    export function readFiles(): void {
        FileSource.readdir(Path.resolve(__dirname, DATA_PATH), async (err: NodeJS.ErrnoException, list: string[]) => {
            for (let fileName of list) {
                var prom: number[] = await extractFeature(Path.resolve(__dirname, DATA_PATH, fileName));
            }
        });
    }

    /** Extracts features from file with given name. */
    function extractFeature(fileName: string): Promise<number[]> {
        return Image.load(fileName).then(function (image: Image): number[] {
            var descriptor: number[] = Hog.extractHOG(image, hogParams);
            console.log(descriptor);
            return descriptor;
        });
    }
}
