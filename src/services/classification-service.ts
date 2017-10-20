import { Network, Architect, Trainer } from "synaptic";

export class ClassificationService {
    private network: Network;

    public constructor() {
        this.network = new Architect.Perceptron(600, 200, 60, 25);
        const trainer: Trainer = new Trainer(this.network);
        // this.network.activate()
    }
}
