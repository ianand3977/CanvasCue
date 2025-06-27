import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuratorReviewRoutingModule } from './curator-review-routing.module';
import { CuratorReviewComponent } from './curator-review.component';


@NgModule({
  declarations: [
    CuratorReviewComponent
  ],
  imports: [
    CommonModule,
    CuratorReviewRoutingModule
  ]
})
export class CuratorReviewModule { }
