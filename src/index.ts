import { Utils } from "./utils";

Utils.readFiles().then((tables: number[][]) => {
    console.log(tables);
    console.log("end");
});
