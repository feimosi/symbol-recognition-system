import { Network, Architect } from "synaptic";
import { ImageFeatures } from "../data-models/image-features";

export class ClassificationService {
    private network: Network;

    public constructor(images: ImageFeatures[]) {
        this.network = new Architect.Perceptron(120, 200, 25);
        console.log(this.network.activate(images[0].features));
        console.log(this.network.propagate(0.3, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        console.log(this.network.activate(images[0].features));
        console.log(this.network.activate(images[1].features));
    }
}
