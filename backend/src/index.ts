import * as serverFactory from "./server";
import config from "./config";

process.on("uncaughtException", (error: Error) => {
    console.error(`uncaughtException ${error.message}`);
});

process.on("unhandledRejection", (reason: any) => {
    console.error(`unhandledRejection ${reason}`);
});

serverFactory.init(config).then((server) => {
    server.start(() => {
        console.log("Server running at:", server.info.uri);
    });
});
