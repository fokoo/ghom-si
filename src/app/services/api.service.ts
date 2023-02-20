import { Injectable } from '@angular/core';
import { from, Observable, of, switchMap } from 'rxjs';
import { Data } from "../data/data";
import {
  Auth,
  signInWithEmailAndPassword,
  authState
} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  data: any[] = [];
  currentUser$ = authState(this.auth);
  //isLoggedIn: boolean = false;

  constructor( private auth: Auth ) {}


  getChapterGhomala(bookID: number, chapterID: number): Observable<any> {
    return of(this.chapter(bookID));
  }

  private chapter (bookID: number) : any[] {
    const ncb = Data.numberOfChapterOfBook;
    const len = ncb[bookID];
    let verses = [];
    const str = "Aucune traduction de ce Versé disponible";
    for (let i = 0; i < len; i++) {
      verses.push( {ID: i, Text: str} );
    }
    return verses;
  }
/*
  get currentUserProfile$(): Observable<UserModel | null> {
    return this.currentUser$.pipe(
      switchMap((user) => {
        console.log("currentUserProfile$: " + user?.uid);
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.db, 'users', user?.uid);
        return docData(ref) as Observable<UserModel>;
      })
    );
  } */

  loginFb(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logoutFb(): Observable<any> {
    return from(this.auth.signOut());
  }

}
