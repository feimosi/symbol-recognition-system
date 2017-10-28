import * as Hapi from "hapi";
import * as fs from "fs";
import * as Path from "path";
import { CoreImage } from "../../src/data-models/core-image";
import { Utils } from "../../src/utilities/utils";
import { SimpleImageResizer } from "../../src/services/simple-resize-extractor-service";
import { PCAFeatureExtractor } from "../../src/services/pca-feature-extractor";
import { IFeatureExtractor } from "../../src//services/ifeature-extractor";
import { ImageFeatures } from "../../src/data-models/image-features";
import { ClassificationService } from "../../src/services/classification-service";

export function init(config) {
    return new Promise<any>((resolve) => {
        const port = process.env.PORT || config.port;
        const server = new Hapi.Server();

        server.connection({
            host: "localhost",
            port,
            routes: {
                cors: true
            }
        });

        server.route({
            method: "GET",
            path: "/",
            handler(request, reply) {
                reply("Hello, world!");
            }
        });

        server.route({
            method: "POST",
            path: "/submit",
            handler(request, reply) {
                fs.writeFile(`${__dirname}/../uploads/test.png`, request.payload.image, {}, async (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    const imageResizer: SimpleImageResizer = new SimpleImageResizer("");
                    const filePath = Utils.getFilesPaths("../../backend/uploads/")[1];
                    const image: CoreImage = await imageResizer.loadAndResizeImage(filePath);
                    const featureExtractor: IFeatureExtractor = new PCAFeatureExtractor("../../data/pca-data-model.json", [image]);
                    const features = await featureExtractor.extractFeaturesSingle(image, 200);
                    const classificator = new ClassificationService([features], "../../data/temporary-network-record.json");
                    const result = classificator.classify(features);

                    console.log("Recognised as: ", result);
                    reply({ message: "Video saved!", result });
                });
            }
        });

        resolve(server);
    });
}
