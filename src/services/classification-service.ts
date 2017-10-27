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
            this.network = new Architect.Perceptron(200, 100, 26);
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

        images = this.orderImages(images);

        if (Utils.fileExists("../../data/temporary-network.json")) {
            this.network = Network.fromJSON(Utils.loadFromFile("../../data/temporary-network.json"));
        }

        let successCount: number = 1;
        let lastSuccessCount: number = 0;
        let record: number = 0;
        const learnRate: number = 0.1;
        // let increase: boolean = true;

        while (successCount < images.length) {
            successCount = 0;

            for (const image of images) {
                const output: number[] = this.network.activate(image.features);
                if (String.fromCharCode(65 + this.indexOfMax(output)) !== image.name) {
                    this.network.propagate(learnRate, this.labelDictionary[image.name]);
                    break;
                }
                successCount++;
            }

            Utils.saveToFile("../../data/temporary-network.json", this.network.toJSON());
            // console.log("Run " + successCount + " succeeded (learn rate " + learnRate + ")");

            // if (successCount > lastSuccessCount) {
            //     increase = !increase;
            // }
            // if (increase) {
            //     learnRate += 0.01;
            // } else {
            //     learnRate -= 0.01;
            // }

            if (record < successCount) {
                record = successCount;
                Utils.saveToFile("../../data/temporary-network-record.json", this.network.toJSON());
                console.log("Run " + successCount + " succeeded (learn rate " + learnRate + ")");
            }

            lastSuccessCount = successCount;
        }
        console.log("Neural network learning finished!");
    }

    private orderImages(images: ImageFeatures[]): ImageFeatures[] {
        const grouped: Map<string, ImageFeatures[]> = this.groupBy<string, ImageFeatures[]>((img: ImageFeatures) => img.name, images);

        const result: ImageFeatures[] = [];
        let length = Number.MAX_VALUE;

        grouped.forEach((values: ImageFeatures[], key: string, map: Map<string, ImageFeatures[]>) => {
            if (length > values.length) {
                length = values.length;
            }
        });

        for (let i = 0; i < length; i++) {
            grouped.forEach((values: ImageFeatures[], key: string, map: Map<string, ImageFeatures[]>) => {
                result.push(values[i]);
            });
        }

        return result;
    }

    private groupBy<K, V>(keyGetter, list): Map<K, V> {
        const map = new Map();

        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }
}
