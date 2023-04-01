import { Injectable } from '@angular/core';
import { ChapterGhomala } from '../models/chapter-ghomala.model';
import { ChapterForm } from '../models/chapter-form.model';
import { Verse } from '../models/verse.model';
import {HotToastService} from "@ngneat/hot-toast";
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  aud = new Audio ();

  constructor(
    private toast: HotToastService
  ) {}

  getArrayNumber(start: number, end: number): number[] {
    console.log('getArrayNumber called with start: ' + start + ', end: ' + end);
    const diff = end - start;
    const keys = Array(Math.abs(diff) + 1).keys();
    return Array.from(keys).map(x => {
        const increment = end > start ? x : -x;
        return start + increment;
    });
  }

  isLoggedIn(): boolean {
    const user = sessionStorage.getItem('user');
    return (user !== 'null' && user === "login")  ? true : false;
  }

  playAudio(links?: string, paused?: boolean): void {
    if (paused && links){
      this.aud.src! = links;
      console.log('Playing');
      this.aud.play();
      // this.paused[id]=!this.paused[id];
    } else {
      this.aud.pause();
    }
  }

/*   private chapter () : any[] {
    const len = Math.floor(Math.random() * 150) + 1;
    let verses = [];
    const str = "Trying to make a simple button to be in an active, different style when it is clicked on. I am using HTML to lay out the button, CSS for Genèfnnrf styling, and hoping to use a bit of JavaScript to do so. bcbacbiusebustyling, and hoping to use a bit of JavaScript to do so. bcbacbiusebu";
    for (let i = 0; i < len; i++) {
      const j = Math.floor(Math.random() * str.length);
      const st = str.substring(j);
      verses.push( {ID: i, Text: st} );
    }
    return verses;
  } */

  private versesToText(chapter: ChapterGhomala): string { //todo
    const sep = "#";
    let compactText: string = sep;
    for(let i = 0; i < chapter.Verses.length; i++) {
      compactText += sep + chapter.Verses[i].ID +  " " + chapter.Verses[i].Text;
    }
    return compactText;
  }

  private versesTextToArray(text: string): any[] { //todo
    // const sep = "#";
    // let arr: string[] = text.split(sep);
    // let verses: Verse[] = [];
    // for(let i = 0; i < arr.length; i++) {
    //   if(arr[i]) //todo
    //    verses[i] =  new Verse(i+1, arr[i]);
    // }
    // return verses;
    const test = text.split("#v");
    const text1 = test.filter(x => x.length > 0 && x !== " ");
    const text2 = [];
    let verse: string[] = [];
    let i = 0;
    while (i < text1.length) {
     if (text1[i].includes("#t")) {
        text1[i] = text1[i].replace("#t", "");
        if (i === text1.length-1){
            text2.push({
              Title: text1[i].trim()
            });
            break;
        }
        verse = text1[i+1].split("#");
        text2.push({
        Title: text1[i].trim(),
        ID: verse[0].trim(),
        Text: verse[1].trim()
        });
        i +=2;
     } else {
        verse = text1[i].split("#");
        text2.push({
        ID: verse[0].trim(),
        Text: verse[1].trim()
       });
       i +=1;
     }
    }
    this.checkError(text1[i].trim());
    this.checkError(verse[0].trim());
    this.checkError(verse[1].trim());
    console.log(text2);
    return text2;
  }

  checkError(st: string): void {
     if (st.includes("#")) {
       this.toast.error( st + "contient une Erreur de syntax")
     }
  }

}
