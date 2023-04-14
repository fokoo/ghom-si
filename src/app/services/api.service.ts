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
import { ChapterForm } from '../models/chapter-form.model';
import firebase from 'firebase/compat/app';

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

//todo delete
 getChapterGhomala(bookID: number, chapterID: number, version: number): Observable<any> {
  console.log("getChapterGhomalaFb called");
  return of(this.chapter(bookID));
}

getChapterGhomalaFb(bookID: number, chapterID: number, version: string): Observable<any> {
  console.log("getChapterGhomalaFb called");
  const DB_UID = "Book_" + bookID + "_Chapter_" + chapterID;
  const ref = doc(this.db, 'GhomSi'+version, DB_UID);
  return docData(ref) as Observable<ChapterForm>;
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

addChapterGhomalaFb(chapter: ChapterGhomala, version: string): Observable<void> {
   console.log("addChapterGhomalaFb called");
   if(!chapter === undefined || chapter === null) {
        return of(void 0);
   }
   const DB_UID = "Book_" + chapter.BookID + "_Chapter_" + chapter.ChapterID;
   //const userFormModel: UserForm = Object.assign(userForm);
   console.log("uid in ChapterGhomala: " + DB_UID);
   const ref = doc(this.db, 'GhomSi' + version, DB_UID);

   // chapter2 = chapter;
   // chapter2.DB_UID = DB_UID;
   // const ref2 = doc(this.db, 'GhomSiGhomala');
   // console.log("set ref2 next to call");
   // setDoc(ref2, { ...chapter }, { merge: true });

   console.log("set ref next to call");
   return from(setDoc(ref, { ...chapter }));
}

addChapterFormFb(chapter: ChapterForm, version: string): Observable<void> {
  console.log("addChapterFormFb called");
  if(!chapter === undefined || chapter === null) {
       return of(void 0);
  }
  const DB_UID = "Book_" + chapter.BookID + "_Chapter_" + chapter.ChapterID;
  console.log("uid in ChapterForm: " + chapter);
  console.log("uid in ChapterForm: " + DB_UID);
  const ref = doc(this.db, 'GhomSi' + version, DB_UID);

  console.log("set ref next to call");
  return from(setDoc(ref, { ...chapter }));
}

updateChapterGhomalaFb( chapter: ChapterGhomala, version: string): Observable<void> {
  console.log("updateChapterGhomalaFb called");
  if(!chapter === undefined || chapter === null) {
    return of(void 0);
}
  const ref = doc(this.db, 'GhomSi'+version, chapter.DB_UID!);
  console.log("updateChapterGhomalaFb return");
  return from(updateDoc(ref, { ...chapter }));
}

deleteUserFb(chapterDB_UID: string, version: number): Observable<void> {
   const ref = doc(this.db, 'GhomSi'+version, chapterDB_UID!);
   return from(deleteDoc(ref));
}



uploadAudio(file: File, typefile: string,  ghVersion: string,
  bookID: number, chapterID: number): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const almostUniqueFileName = ghVersion + "Book_" + bookID + "_Chapter_" + chapterID;
      const storageRef = firebase.storage().ref();
      //const upload = storageRef.child(typefile + almostUniqueFileName + file.name).put(file);
      const upload = storageRef.child(typefile + almostUniqueFileName).put(file);
      console.log(file.name);
      upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => {
          console.log('Loading…');
        },
        (error) => {
          console.log('Loading Error! : ' + error.message);
          reject();
        },
        () => {
          resolve(upload.snapshot.ref.getDownloadURL());
        }
      );
    }
  );
}
}
