import {
  Component,
  Input,
  Output,
  ElementRef,
  AfterViewInit,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'painting-canvas',
  templateUrl: './painting-canvas.component.html',
  styleUrls: ['./painting-canvas.component.css'],
})
export class PaintingCanvasComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public brushSize = 25;
  @Input() public width = 400;
  @Input() public height = 400;
  @Input() public padding = 160;
  @Input() public clear: Observable<boolean>;
  @Input() public saveBlob: Observable<boolean>;
  @Output() public onBlobReady = new EventEmitter<any>();
  @Output() public onDataUrlReady = new EventEmitter<any>();

  private cx: CanvasRenderingContext2D;

  ngOnInit() {
    this.clear.subscribe(() => {
      this.cx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.fillWithWhiteBg(this.cx);
    });

    this.saveBlob.subscribe(() => {
      const context = this.getImageWithPadding(this.cx);
      const offscreenCanvas = context.canvas;
      const dataUrl = offscreenCanvas.toDataURL();
      this.onDataUrlReady.emit(dataUrl);

      offscreenCanvas.toBlob((blob) => {
        this.onBlobReady.emit(blob);
      });
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['brushSize'] && changes['brushSize'].currentValue !== changes['brushSize'].previousValue) {
      if (this.cx) {
        this.cx.lineWidth = changes['brushSize'].currentValue;
      }
    }
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = this.brushSize;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.fillWithWhiteBg(this.cx);
    this.captureEvents(canvasEl);
  }

  private fillWithWhiteBg(context: CanvasRenderingContext2D) {
    context.fillStyle = 'white';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    Observable
      .fromEvent(canvasEl, 'mousedown')
      .switchMap((e) => {
        return Observable
          .fromEvent(canvasEl, 'mousemove')
          .takeUntil(Observable.fromEvent(canvasEl, 'mouseup'))
          .pairwise();
      })
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private getImageWithPadding(originalCotext): CanvasRenderingContext2D {
    const finalWidth = this.width + this.padding;
    const finalHheight = this.height + this.padding;
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = finalWidth;
    offscreenCanvas.height = finalHheight;

    const context = offscreenCanvas.getContext('2d');
    this.fillWithWhiteBg(context);

    const image = originalCotext.getImageData(0, 0, finalWidth, finalHheight);
    context.putImageData(image, this.padding / 2, this.padding / 2, 0, 0, this.width, this.height);

    return context;
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
}
