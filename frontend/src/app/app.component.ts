import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from 'events';
import { ImageUploadService } from './image-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  brushSize = 30;
  result = null;
  clear$: Observable<any>;
  saveBlob$: Observable<any>;
  correct$: Observable<any>;
  shouldBe = '';

  @ViewChild('clearButton') clearButton;
  @ViewChild('submitButton') submitButton;
  @ViewChild('correctButton') correctButton;

  constructor(private imageUploadService: ImageUploadService) {}

  ngOnInit() {
    this.clear$ = Observable.fromEvent(this.clearButton._elementRef.nativeElement, 'click');
    this.saveBlob$ = Observable.fromEvent(this.submitButton._elementRef.nativeElement, 'click');
    this.correct$ = Observable.fromEvent(this.correctButton._elementRef.nativeElement, 'click');

    this.correct$.subscribe(() => {
      this.imageUploadService
        .correctResult(this.shouldBe)
        .then(response => { this.result = null; });
    });
}

  submitFile(blob) {
    this.imageUploadService
      .submitImage(blob)
      .then(response => { this.result = response.result; });
  }
}
