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
  brushSize = 40;
  clear$: Observable<any>;
  saveBlob$: Observable<any>;

  @ViewChild('clearButton') clearButton;
  @ViewChild('submitButton') submitButton;

  constructor(private imageUploadService: ImageUploadService) {}

  ngOnInit() {
    this.clear$ = Observable.fromEvent(this.clearButton.nativeElement, 'click');
    this.saveBlob$ = Observable.fromEvent(this.submitButton.nativeElement, 'click');
  }

  submitFile(blob) {
    this.imageUploadService.submitImage(blob);
  }
}
