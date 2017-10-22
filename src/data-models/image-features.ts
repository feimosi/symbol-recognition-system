import { CoreImage } from "./core-image";

/** Represents image with its features */
export class ImageFeatures extends CoreImage {
    /** Features of image e.g. array of features extracted wih HOG */
    public features: number[];

    /** The constructor */
    public constructor(image: number[][], label: number, name: string, features?: number[]) {
        super(image, label, name);
        this.features = features ? features : [];

    }
}
