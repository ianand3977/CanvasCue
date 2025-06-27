import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ArtSubmissionRoutingModule } from './art-submission-routing.module';
import { ArtSubmissionComponent } from './art-submission.component';


@NgModule({
  declarations: [
    ArtSubmissionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ArtSubmissionRoutingModule
  ]
})
export class ArtSubmissionModule { }
