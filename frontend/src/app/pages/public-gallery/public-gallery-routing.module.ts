import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicGalleryComponent } from './public-gallery.component';

const routes: Routes = [{ path: '', component: PublicGalleryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicGalleryRoutingModule { }
