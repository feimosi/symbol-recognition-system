/** The core image */
export class CoreImage {
    /** Original image as grid */
    public originalImage: number[][];
    /** Unique label number */
    public label: number;
    /** Unique name of file */
    public name: string;

    /** The constructor */
    public constructor(image: number[][], label: number, name: string) {
        this.originalImage = image;
        this.label = label;
        this.name = name;
    }
}
