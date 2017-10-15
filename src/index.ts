import { Layer, Neuron } from "synaptic";
import { Utils } from "./utils";

const x: number = 5;
console.log("Hello TypeScript");

const neuron: Neuron = new Neuron();
const layer: Layer = new Layer(3);

Utils.readFiles();
