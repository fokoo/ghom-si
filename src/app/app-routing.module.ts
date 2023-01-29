import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionComponent } from './edition/edition.component';
import { ChapterComponent } from './study/chapter/chapter.component';
import { StudyComponent } from './study/study.component';

const routes: Routes = [
  { path: 'lanye', component: StudyComponent },
  { path: 'traduire', component: EditionComponent },
  // { path: '#', redirectTo: 'layne', pathMatch: 'full'},
  { path: 'lanye/chapter/:id', component: ChapterComponent},
  { path: '', component: StudyComponent },
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
