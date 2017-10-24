import * as Hapi from "hapi";
import * as fs from "fs";

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
                fs.writeFile(`${__dirname}/../uploads/test.png`, request.payload.image, {}, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    reply({ message: "Video saved!" });
                });
            }
        });

        resolve(server);
    });
}
