import * as FileStream from "fs";
import * as Path from "path";
import * as System from "os";

/** Constains all application utilities */
export class Utils {

    /** Number of availeable thereads */
    public avaliableCPUs: number = System.cpus().length;

    /** Read all files recursivly form directory */
    public static getFilesPaths(directoryPath: string, subDirectory?: string): string[] {
        const resolvedPath: string = Path.resolve(__dirname, directoryPath, !subDirectory ? "" : subDirectory);
        let paths: string[] = new Array<string>();
        if (FileStream.statSync(resolvedPath).isDirectory()) {
            const list: string[] = FileStream.readdirSync(resolvedPath);
            for (const fileName of list) {
                paths = paths.concat(this.getFilesPaths(resolvedPath, fileName));
            }
        } else {
            paths.push(resolvedPath);
        }

        return paths;
    }

    /** Returns the folder name of the file */
    public static getCatalogName(fileName: string): string {
        if (FileStream.statSync(fileName).isFile()) {
            const directoryArray: string[] = Path.dirname(fileName).split("\\");
            return directoryArray[directoryArray.length - 1];
        }
        return "";
    }

    /** Saves content to file */
    public static saveToFile(path: string, content: any): void {
        FileStream.writeFileSync(Path.resolve(__dirname, path), JSON.stringify(content));
        console.log("The file was saved!");
    }

    /** Loads content form file */
    public static loadFromFile(path: string): any {
        return JSON.parse(FileStream.readFileSync(Path.resolve(__dirname, path), { encoding: "utf8" }));
    }

    /** Checks if file exists */
    public static fileExists(path: string): boolean {
        return FileStream.existsSync(Path.resolve(__dirname, path));
    }
}
