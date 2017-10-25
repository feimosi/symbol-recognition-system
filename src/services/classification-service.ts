import { Utils } from "./../utilities/utils";
import { Network, Architect } from "synaptic";
import { ImageFeatures } from "../data-models/image-features";

export class ClassificationService {

    private network: Network;
    private labelDictionary: object;

    public constructor(images: ImageFeatures[], networkFilePath: string) {
        this.labelDictionary = {};
        this.populateDictionary();

        if (Utils.fileExists(networkFilePath)) {
            this.network = Network.fromJSON(Utils.loadFromFile(networkFilePath));
        } else {
            this.network = new Architect.Perceptron(26, 200, 26);
            this.learn(images);
            Utils.saveToFile(networkFilePath, this.network.toJSON());
        }
    }

    public classify(image: ImageFeatures): string {
        const output: number[] = this.network.activate(image.features);
        const indexOfMaxValue: number = this.indexOfMax(output);
        return String.fromCharCode(indexOfMaxValue + 65);
    }

    private indexOfMax(arr: number[]): number {
        if (arr.length === 0) {
            return -1;
        }

        let max = arr[0];
        let maxIndex = 0;

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }

        return maxIndex;
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
        if (Utils.fileExists("../../data/temporary-network.json")) {
            this.network = Network.fromJSON(Utils.loadFromFile("../../data/temporary-network.json"));
        }
        let successCount: number = 0;
        while (successCount < 26) {
            successCount = 0;
            for (const image of images) {
                const output: number[] = this.network.activate(image.features);
                if (String.fromCharCode(65 + this.indexOfMax(output)) !== image.name) {
                    this.network.propagate(0.3, this.labelDictionary[image.name]);
                    break;
                }
                successCount++;
            }
            Utils.saveToFile("../../data/temporary-network.json", this.network.toJSON());
        }
        console.log("Neural network learning finished!");
    }
}
