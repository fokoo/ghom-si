//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as jsonBook from '../../assets/bible/books.json';
import * as jsonBibleKjv from '../../assets/bible/kjv.json';
import * as jsonBibleS21 from '../../assets/bible/s21.json';
import * as jsonBibleLsg from '../../assets/bible/lsg.json';
import { environment } from "src/environments/environment";
import { Data } from "../data/books";

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  jsonMap = new Map<string, any>([
    ["BOOKS", jsonBook],
    ["S21", jsonBibleS21],
    ["LSG", jsonBibleLsg],
    ["KJV", jsonBibleKjv]
]);

// data: any = Object.entries(jsonBook);
data?: any = jsonBook;
//private URL = '../assets/bible/data.json';

  constructor(
    //private httpClient: HttpClient
    ) {}

  public getBooks(): Observable<any> {
       return of(Data.books);
  }

  public getJSON(key: string): Observable<any> {
    console.log("getJSON called with key: " + key);
    //console.log("Books data: " + this.data);
    //console.log(JSON.parse(JSON.stringify(this.jsonMap.get(key))));
      //return JSON.parse(JSON.stringify(jsonBook));
      return of(this.data);
     //return this.httpClient.get(url);
  }
}
