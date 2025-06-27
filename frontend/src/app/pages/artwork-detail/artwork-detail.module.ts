import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtworkDetailRoutingModule } from './artwork-detail-routing.module';
import { ArtworkDetailComponent } from './artwork-detail.component';


@NgModule({
  declarations: [
    ArtworkDetailComponent
  ],
  imports: [
    CommonModule,
    ArtworkDetailRoutingModule
  ]
})
export class ArtworkDetailModule { }
