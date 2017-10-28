import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule,
  MatToolbarModule, MatSliderModule, MatCardModule, MatInputModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { PaintingCanvasComponent } from './painting-canvas/painting-canvas.component';
import { ImageUploadService } from './image-upload.service';

@NgModule({
  declarations: [
    AppComponent,
    PaintingCanvasComponent,
  ],
  imports: [
    MatProgressSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSliderModule,
    MatCardModule,
    MatInputModule,
  ],
  providers: [
    ImageUploadService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
