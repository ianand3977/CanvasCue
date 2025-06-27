import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtSubmissionComponent } from './art-submission.component';

const routes: Routes = [{ path: '', component: ArtSubmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtSubmissionRoutingModule { }
