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

  public getVersions(): Observable<any> {
    return of(Data.versions);
  }

  getChapter(bookID: number, version: string): Observable<any> {
    let testaments: any[] =  [];
    if (version == "LSG") {
       testaments = LSG.bible.Testaments;
    } else if (version == "S21") {
       testaments = S21.bible.Testaments;
    } else if (version == "SEMEUR") {
       testaments = SEMEUR.bible;
    } else if (version == "MARTIN") {
       testaments = MARTIN.bible;
    } else if (version == "KGV") {
        testaments = KGV.bible;
    } else {
       testaments = LSG.bible.Testaments;
    }
    console.log('getChapter called with bookID: ' + bookID + ' and version: ' + version);
    let chapter: any[] = (bookID <= 38)?
        testaments[0].Books[bookID].Chapters
     :  testaments[1].Books[bookID-38].Chapters;
    return of(chapter) ;
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
