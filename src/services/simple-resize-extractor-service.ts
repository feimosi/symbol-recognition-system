import { CoreImage } from "./../data-models/core-image";
import * as sharp from "sharp";
import { resolve as pathResolve } from "path";
import { SharpInstance, OutputInfo, Region } from "sharp";
import { Logger } from "../utilities/logger";
import { Utils } from "../utilities/utils";
import * as Path from "path";

sharp.cache(false);

export class SimpleImageResizer {

    private readonly resizedImagesPath: string;
    private resizedWidth: number = 20;
    private resizedHeight: number = 20;

    public constructor(resizedImagesPath: string) {
        this.resizedImagesPath = resizedImagesPath;
    }

    public async loadAndResizeImages(files: string[]): Promise<CoreImage[]> {
        let result: CoreImage[] = [];

        if (Utils.fileExists(this.resizedImagesPath)) {
            result = Utils.loadFromFile(this.resizedImagesPath);
        } else {
            for (const file of files) {
                result.push(await this.loadAndResizeImage(file));
                Logger.log(`${file} - file converted to features. ${Math.round(((files.indexOf(file) + 1) / files.length) * 10000) / 100}% finished`);
            }
            Utils.saveToFile(this.resizedImagesPath, result);
        }

        return result;
    }

    public async loadAndResizeImage(file: string): Promise<CoreImage> {
        const catalogName: string = Utils.getCatalogName(file);
        const image: SharpInstance = await this.loadImage(file);
        const grid: number[][] = this.toTwoDemenstionalArray(await (await this.transformImage(image, file)).toBuffer(), this.resizedWidth, this.resizedHeight);
        const coreImage: CoreImage = new CoreImage(grid, catalogName.charCodeAt(0), catalogName);

        return coreImage;
    }

    private loadImage(file: string): Promise<SharpInstance> {
        return new Promise((resolve, reject) => {
            resolve(sharp(file));
        });
    }

    private async transformImage(image: SharpInstance, fileName: string): Promise<SharpInstance> {
        const width: number | undefined = (await image.metadata()).width;
        const height: number | undefined = (await image.metadata()).height;

        fileName = fileName.split("/").pop() || "";
        const grid: number[][] = this.toTwoDemenstionalArray(await image.raw().greyscale(true).toBuffer(), width ? width : 0, height ? height : 0);
        const coordiantes: Region = this.getCoordiatnes(grid, width ? width : 0, height ? height : 0);
        const extractedImage: SharpInstance = image.extract(coordiantes).resize(this.resizedWidth, this.resizedHeight);
        const resizedFileName: string = "data/resized/" + fileName.split("\\").reverse()[0];

        const absolutePath = pathResolve(__dirname, "..", "..", resizedFileName);
        Utils.ensureDirectoryExistence(Path.dirname(absolutePath));
        await extractedImage.toFile(absolutePath);
        return (await this.loadImage(absolutePath)).raw().greyscale(true);
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

        // keep aspect ratio
        if (height - top > width - left) {
            const difference: number = (height - top) - (width - left);
            width += Math.round(difference / 2);
            left -= Math.round(difference / 2);
        } else if (width - left > height - top) {
            const difference: number = (width - left) - (height - top);
            height += Math.round(difference / 2);
            top -= Math.round(difference / 2);
        }

        left -= Math.round((height - top) * 0.1);
        width += Math.round((height - top) * 0.1);
        top -= Math.round((height - top) * 0.1);
        height += Math.round((height - top) * 0.1);

        // remove overscale errors
        if (width > imgWidth) {
            width = imgWidth;
        }

        if (height > imgHeight) {
            height = imgHeight;
        }

        if (top < 0) {
            top = 0;
        }

        if (left < 0) {
            left = 0;
        }

        return { top, left, width: width - left, height: height - top };
    }
}
