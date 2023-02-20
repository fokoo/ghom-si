import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

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
}
