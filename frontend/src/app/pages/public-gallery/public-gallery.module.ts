import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicGalleryRoutingModule } from './public-gallery-routing.module';
import { PublicGalleryComponent } from './public-gallery.component';


@NgModule({
  declarations: [
    PublicGalleryComponent
  ],
  imports: [
    CommonModule,
    PublicGalleryRoutingModule
  ]
})
export class PublicGalleryModule { }
