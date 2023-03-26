//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as jsonBook from '../../assets/bible/books.json';
import * as jsonBibleKjv from '../../assets/bible/kjv.json';
import * as jsonBibleS21 from '../../assets/bible/s21.json';
import * as jsonBibleLsg from '../../assets/bible/lsg.json';
import { environment } from "src/environments/environment";
import { Data } from "../data/data";
import { LSG } from "../data/lsg";
import { Verse } from '../models/verse.model';
import { S21 } from '../data/s21';
import { MARTIN } from '../data/martin';
import { SEMEUR } from '../data/semeur';
import { KGV } from '../data/kgv';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  OLD_BOOK_LENGTH = 39;

/*   jsonMap = new Map<string, any>([
    ["BOOKS", jsonBook],
    ["S21", jsonBibleS21],
    ["LSG", jsonBibleLsg],
    ["KJV", jsonBibleKjv]
]); */

// data: any = Object.entries(jsonBook);
data?: any = jsonBook;
numbersOfChapterOfBook!: number;
//private URL = '../assets/bible/data.json';

  constructor(
    //private httpClient: HttpClient
    ) {}

  public getBooks(): Observable<any> {
       console.log('getBooks called');
       return of(Data.books);
  }

  public getBooksGhomala(): Observable<any> {
    console.log('getBooks called');
    return of(Data.booksGhomala);
  }

  public getVersions(): Observable<any> {
    return of(Data.versions);
  }

  public getVersionGhomala(): Observable<any> {
    return of(Data.versionsGhomala);
  }

  public getNumberOfChapterOfBook(): Observable<number[]> {
    return of(Data.numberOfChapterOfBook);
  }

  getChapter(version: string, bookID: number, currentChapterNumber: number): Observable<any> {
    let testaments: any[] =  [];
    if (version == Data.versions[0]) {
       testaments = LSG.bible.Testaments;
    } else if (version == Data.versions[1]) {
      testaments = S21.bible.Testaments;
    } else if (version == Data.versions[2]) {
      testaments = KGV.bible;
      let chapterList : string[][] = testaments[bookID].chapters;
      console.log("kgv " + chapterList[0].length);
      let chapter: any[] = [];
      for (let i = 0; i < chapterList[currentChapterNumber].length; i++)
      {
          chapter.push( //new Verse(i+1, chapterList[currentChapterNumber]));
            { Title: '', ID:i+1, Text: chapterList[currentChapterNumber][i] } );
      }
      return of(chapter) ;
   /*  } else if (version == Data.versions[3]) {
      testaments = SEMEUR.bible;
    } else if (version == Data.versions[4]) {
      testaments = MARTIN.bible; */
    } else {
      testaments = LSG.bible.Testaments;
    }
    console.log('getChapter called with bookID: ' + bookID + ' and version: ' + version);
    let chapters: any[] = (bookID < this.OLD_BOOK_LENGTH)?
        testaments[0].Books[bookID].Chapters
     :  testaments[1].Books[bookID-this.OLD_BOOK_LENGTH].Chapters;
    return of(chapters) ;
  }

 /*  public getJSON(key: string): Observable<any> {
    console.log("getJSON called with key: " + key);
    //console.log("Books data: " + this.data);
    //console.log(JSON.parse(JSON.stringify(this.jsonMap.get(key))));
      //return JSON.parse(JSON.stringify(jsonBook));
      return of(this.data);
     //return this.httpClient.get(url);
  } */
}
