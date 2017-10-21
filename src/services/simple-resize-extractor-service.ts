import * as sharp from "sharp";
import { IFeatureExtractor } from "./ifeature-extractor";
import { ImageFeatures } from "../data-models/image-features";
import { SharpInstance, OutputInfo, Region } from "sharp";
import { Logger } from "../utilities/logger";
import { Utils } from "../utilities/utils";

export class SimpleResizeExtractorService implements IFeatureExtractor {

    public async loadAndExtractFeatures(files: string[]): Promise<ImageFeatures[]> {
        const result: ImageFeatures[] = [];
        for (const file of files) {
            const catalogName: string = Utils.getCatalogName(file);

            const image: SharpInstance = await this.loadImage(file);
            const imageFeatures: ImageFeatures = new ImageFeatures(await this.extractFeatures(image), catalogName.charCodeAt(0), catalogName);

            result.push(imageFeatures);
            Logger.log(`${file} - file converted to features. ${Math.round(((files.indexOf(file) + 1) / files.length) * 10000) / 100}% finished`);
        }
        return result;
    }

    private loadImage(file: string): Promise<SharpInstance> {
        return new Promise((resolve, reject) => {
            resolve(sharp(file));
        });
    }

    private async extractFeatures(image: SharpInstance): Promise<number[]> {
        const transformedImage = await this.transformImage(image);
        return Array.from(await transformedImage.toBuffer());
    }

    private async transformImage(image: SharpInstance): Promise<SharpInstance> {
        const width: number | undefined = (await image.metadata()).width;
        const height: number | undefined = (await image.metadata()).height;
        const grid: number[][] = this.toTwoDemenstionalArray(await image.raw().greyscale(true).toBuffer(), width ? width : 0, height ? height : 0);
        const coordiantes: Region = this.getCoordiatnes(grid, width ? width : 0, height ? height : 0);
        const extractedImage: SharpInstance = image.extract(coordiantes).resize(32, 32);

        return extractedImage;
    }

    private toTwoDemenstionalArray(vector: Uint8Array, width: number, height: number): number[][] {
        const result: number[][] = [];

        for (let i = 0; i < height; i++) {
            result[i] = Array.from(vector.slice(i * width, (i * width) + width));
        }

        return result;
    }

    private getCoordiatnes(grid: number[][], imgWidth: number, imgHeight: number): Region {
        let top: number = 0;
        let left: number = 0;
        let width: number = 0;
        let height: number = 0;

        // top
        for (let i = 0; i < imgHeight; i++) {
            let checkBreak: boolean = false;
            for (let j = 0; j < imgWidth; j++) {
                if (grid[i][j] === 0) {
                    top = i;
                    checkBreak = true;
                    break;
                }
            }
            if (checkBreak) {
                break;
            }
        }

        // height
        for (let i = imgHeight - 1; i >= 0; i--) {
            let checkBreak: boolean = false;
            for (let j = imgWidth - 1; j >= 0; j--) {
                if (grid[i][j] === 0) {
                    height = i;
                    checkBreak = true;
                    break;
                }
            }
            if (checkBreak) {
                break;
            }
        }

        // left
        for (let i = 0; i < imgWidth; i++) {
            let checkBreak: boolean = false;
            for (let j = 0; j < imgHeight; j++) {
                if (grid[j][i] === 0) {
                    left = i;
                    checkBreak = true;
                    break;
                }
            }
            if (checkBreak) {
                break;
            }
        }

        // width
        for (let i = imgWidth - 1; i >= 0; i--) {
            let checkBreak: boolean = false;
            for (let j = imgHeight - 1; j >= 0; j--) {
                if (grid[j][i] === 0) {
                    width = i;
                    checkBreak = true;
                    break;
                }
            }
            if (checkBreak) {
                break;
            }
        }

        return { top, left, width: width - left, height: height - top };
    }
}
