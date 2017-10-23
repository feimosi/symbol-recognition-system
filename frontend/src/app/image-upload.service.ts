import { Injectable } from '@angular/core';

@Injectable()
export class ImageUploadService {
  submitImage(blob) {
    console.log('Received file: ', blob);
  }
}
