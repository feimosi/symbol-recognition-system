import { Injectable } from '@angular/core';

@Injectable()
export class ImageUploadService {
  submitImage(blob) {
    const formData = new FormData();
    formData.append('image', blob);

    return fetch('http://localhost:5080/submit', {
      method: 'POST',
      body: formData,
    }).then(result => result.json());
  }

  correctResult(shouldBe) {
    const formData = new FormData();
    formData.append('shouldBe', shouldBe);

    return fetch('http://localhost:5080/correct', {
      method: 'POST',
      body: formData,
    }).then(result => result.json());
  }
}
