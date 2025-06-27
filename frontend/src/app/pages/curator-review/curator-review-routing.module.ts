import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuratorReviewComponent } from './curator-review.component';

const routes: Routes = [{ path: '', component: CuratorReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuratorReviewRoutingModule { }
