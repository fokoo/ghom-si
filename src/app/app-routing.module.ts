import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionComponent } from './edition/edition.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { StudyComponent } from './study/study.component';

const routes: Routes = [
  { path: 'lanye', component: StudyComponent },
  { path: 'traduire',  canActivate: [AuthGuard], component: EditionComponent },
  // { path: '#', redirectTo: 'layne', pathMatch: 'full'},
  { path: 'login', component: SigninComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
