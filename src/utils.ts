import * as Path from 'path';
import * as FileSource from 'fs';
import * as Hog from 'hog-features';
import { Image } from 'image-js';

const DATA_PATH = '../data/tests/';

/** Constains all application utilities */
export module Utils {
    /** Reads files form directory */
    export async function readFiles() : Promise<void> {
        FileSource.readdir(Path.resolve(__dirname, DATA_PATH), async (err: NodeJS.ErrnoException, list: string[]) => {
            for (let fileName of list) {
                var prom = await extractFeature(Path.resolve(__dirname, DATA_PATH, fileName));
                break;
            }
        });
    }

    /** Extracts features from file with given name. */
    function extractFeature(fileName: string) : Promise<number[]> {
        return Image.load(fileName).then(function (image) {
            var descriptor = Hog.extractHOG(image);
            console.log(descriptor);
            return descriptor;
        });
    }
};
