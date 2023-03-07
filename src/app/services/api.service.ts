import { Injectable } from '@angular/core';
import { from, Observable, of, switchMap } from 'rxjs';
import { Data } from "../data/data";
import {
  Auth,
  signInWithEmailAndPassword,
  authState
} from "@angular/fire/auth";
import { deleteDoc, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { ChapterGhomala } from '../models/chapter-ghomala.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  data: any[] = [];
  currentUser$ = authState(this.auth);
  //isLoggedIn: boolean = false;

  constructor( private auth: Auth, private db: Firestore ) {}

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


//##################################################
// firebase Firestore api for Bibel in Ghomala
//##################################################

private chapter (bookID: number) : any[] {   // temporary until method done
  const ncb = Data.numberOfChapterOfBook;
  const len = ncb[bookID];
  let verses = [];
  const str = "Aucune traduction de ce Versé disponible";
  for (let i = 0; i < len; i++) {
    verses.push( {ID: i, Text: str} );
  }
  return verses;
}

getChapterGhomala(bookID: number, chapterID: number, version: number): Observable<any> {
  return of(this.chapter(bookID));
}

getChapterGhomalaFb(bookID: number, chapterID: number, version: number): Observable<any> {
  const DB_UID = "Book_" + bookID + "_Chapter_" + chapterID;
  const ref = doc(this.db, 'GhomSi'+version, DB_UID);
  return docData(ref) as Observable<ChapterGhomala>;
  /*
  return  this.currentUser$.pipe(
  switchMap((user) => {
  console.log("currentUserProfile$: " + user?.uid);
   if (!user?.uid) {
   return of(null);
   }
    const ref = doc(this.db, 'GhomSi', dbUID);
    return docData(ref) as Observable<ChapterGhomala>;
  })
  );
  */
}

addChapterGhomalaFb(chapter: ChapterGhomala, version: number): Observable<void> {
console.log("addChapterGhomalaFb called");
if(!chapter === undefined) {
  return of(void 0);
}
chapter.DB_UID = "Book_" + chapter.BookID + "_Chapter_" + chapter.ChapterID;
//const userFormModel: UserForm = Object.assign(userForm);
console.log("uid in ChapterGhomala: " + chapter.DB_UID);
const ref = doc(this.db, 'GhomSi'+version, chapter.DB_UID);
return from(setDoc(ref, { ...chapter }));
}

updateChapterGhomalaFb( chapter: ChapterGhomala, version: number): Observable<void> {
  console.log("addChapterGhomalaFb called");
  if(!chapter === undefined) {
    return of(void 0);
  }
  const ref = doc(this.db, 'GhomSi'+version, chapter.DB_UID!);
  return from(updateDoc(ref, { ...chapter }));
}

deleteUserFb(chapterDB_UID: string, version: number): Observable<void> {
   const ref = doc(this.db, 'GhomSi'+version, chapterDB_UID!);
   return from(deleteDoc(ref));
}

}
