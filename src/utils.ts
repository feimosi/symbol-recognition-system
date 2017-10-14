import * as path from 'path';
import * as fs from 'fs';
import * as hog from 'hog-features';
const { Image } = require('image-js');

const DATA_PATH = '../data/training/Signs/Big/A/';

fs.readdir(path.resolve(__dirname, DATA_PATH), (err, list) => {
    for(let fileName of list) {
        extractFeature(path.resolve(__dirname, DATA_PATH, fileName));
        break;
    }
});

function extractFeature(fileName: string) {
    let data = 0;
    Image.load(fileName).then(function (image) {
        var descriptor = hog.extractHOG(image);
        console.log(descriptor);
    });
}
