import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotToastModule } from '@ngneat/hot-toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { MaterialModule } from './material.module';
import { NgxSpinnerModule } from "ngx-spinner";

//import {AngularFireModule} from "@angular/fire";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getStorage, provideStorage} from "@angular/fire/storage";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StudyComponent } from './study/study.component';
import { EditionComponent } from './edition/edition.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { DialogComponent } from './dialog/dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    StudyComponent,
    EditionComponent,
    HeaderComponent,
    FooterComponent,
    KeyboardComponent,
    HomeComponent,
    SigninComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    MaterialModule,
    NgxSpinnerModule,
    HotToastModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
