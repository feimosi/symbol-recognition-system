/** Represents image with its features */
export class ImageFeatures {
    /** Features of image e.g. array of features extracted wih HOG */
    public features: number[];
    /** Unique label number */
    public label: number;
    /** Unique name of file */
    public name: string;

    /** The constructor */
    public constructor(features: number[], label: number, name: string) {
        this.features = features;
        this.label = label;
        this.name = name;
    }
}
