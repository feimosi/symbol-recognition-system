import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSliderModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PaintingCanvasComponent } from './painting-canvas/painting-canvas.component';
import { ImageUploadService } from './image-upload.service';

@NgModule({
  declarations: [
    AppComponent,
    PaintingCanvasComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSliderModule,
  ],
  providers: [
    ImageUploadService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
