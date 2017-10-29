import * as path from "path";

/*
 * Resolves given path relative to the project root folder
 */
export function resolvePath(...paths) {
    return path.resolve(__dirname, "..", "..", ...paths);
}
