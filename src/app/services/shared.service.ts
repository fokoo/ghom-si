import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  getArrayNumber(start: number, end: number): number[] {
    const diff = end - start;
    const keys = Array(Math.abs(diff) + 1).keys();
    return Array.from(keys).map(x => {
        const increment = end > start ? x : -x;
        return start + increment;
    });
  }
}
