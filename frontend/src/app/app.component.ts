import { Subject } from 'rxjs/Subject';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { EventEmitter } from 'events';
import { ImageUploadService } from './image-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  brushSize = 30;
  result = null;
  clear$: Observable<any>;
  clearSubject$: Subject<any>;
  saveBlob$: Observable<any>;
  saveBlobSubject$: Subject<any>;
  correct$: Observable<any>;
  loadingResult = false;
  shouldBe = '';

  @ViewChild('clearButton') clearButton;
  @ViewChild('submitButton') submitButton;
  @ViewChild('correctButton') correctButton;
  @ViewChild('previewImage') previewImage;

  constructor(private imageUploadService: ImageUploadService) {}

  ngOnInit() {
    this.clearSubject$ = new Subject();
    this.clear$ = Observable.merge(
      Observable.fromEvent(this.clearButton._elementRef.nativeElement, 'click'),
      this.clearSubject$,
    );
    this.saveBlobSubject$ = new Subject();
    this.saveBlob$ = Observable.merge(
      Observable.fromEvent(this.submitButton._elementRef.nativeElement, 'click'),
      this.saveBlobSubject$,
    );
    this.correct$ = Observable.fromEvent(this.correctButton._elementRef.nativeElement, 'click');

    this.correct$.subscribe(() => {
      this.imageUploadService
        .correctResult(this.shouldBe)
        .then(response => { this.result = null; });
    });

    Observable
      .fromEvent(document, 'keypress')
      .subscribe((event: KeyboardEvent) => {
        if (event.code === 'Enter') {
          this.saveBlobSubject$.next();
        }
      });
  }

  displayPreview(dataUrl) {
    this.clearSubject$.next();
    this.previewImage.nativeElement.src = dataUrl;
  }

  submitFile(blob) {
    this.loadingResult = true;
    this.imageUploadService
      .submitImage(blob)
      .then(response => {
        this.loadingResult = false;
        this.result = response.result;
      })
      .catch(() => { this.loadingResult = false; });
  }
}
