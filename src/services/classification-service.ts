import { Network, Architect } from "synaptic";
import { ImageFeatures } from "../data-models/image-features";

export class ClassificationService {

    private network: Network;
    private labelDictionary: object;

    public constructor(images: ImageFeatures[]) {
        this.network = new Architect.Perceptron(120, 200, 26);
        this.labelDictionary = {};

        this.populateDictionary();
        this.learn(images);
    }

    private populateDictionary(): void {
        const size: number = 26;

        for (let i = 0; i < size; i++) {
            const empty: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            empty[i] = 1;
            this.labelDictionary[String.fromCharCode(65 + i)] = empty;
        }
    }

    private learn(images: ImageFeatures[]): void {
        for (const image of images) {
            this.network.activate(image.features);
            this.network.propagate(0.3, this.labelDictionary[image.name]);
        }
        console.log("learning finished");
    }
}
