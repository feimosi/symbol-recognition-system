import * as path from "path";

/*
 * Resolves given path relative to the project root folder
 */
export function resolvePath(...paths) {
    const a = path.resolve(__dirname, "..", "..", ...paths);
    console.log(">>>", a);
    return a;
}
