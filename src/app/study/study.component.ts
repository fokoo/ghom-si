import { Component, OnInit } from '@angular/core';
import { VerseGhomala } from '../models/verse-ghomala.model';
//import { Router } from '@angular/router';
//import { map, Observable, take, tap } from 'rxjs';
import { Verse } from '../models/verse.model';
import { ApiService } from '../services/api.service';
import { LocalService } from '../services/local.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {

  bookNames!: any[][];
  //bookNames$!: Observable<any>;
  private currentBookName!: string;
  currentChapterNumber!: number;
  //private nberChapBook!: number;
  currentBookID!: number;
  currentBibelVersion!: string;
  bookChapterName!: string;
  //bibleVersions$!: Observable<any>;
  bibleVersions!: string[];
  compare!: boolean;
  chapterNumbersOfBook!: number[];
  chapterGhomala!: VerseGhomala[];
  chapterOther!: Verse[];
  direction: boolean = true;
  defaultVerse = "Aucune traduction de ce Versé disponible";
  versionGhomala = 1;

  constructor(
    private localSevice: LocalService,
    private apiSevice: ApiService,
    //private router: Router,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.initValues();
    this.initTop();
    this.getCurrentChapter();
  }

  initValues() {
     this.setCurrentBookID();
     this.setCurrentChapterNumber();
  }

  initTop() {
    console.log("initTop called");
    //this.bookNames$ = this.localSevice.getBooks();
    this.localSevice.getBooks().subscribe(data =>
      {
        this.bookNames = data;
        this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
        //console.log("this.bookNames called" + data);
        //console.log("this.bookNames called" + this.bookNames);
      }
    );
     this.localSevice.getVersions().subscribe((data) =>
       {
          this.bibleVersions = data;
          this.setVersion(this.currentBibelVersion);
       }
    );
  }

  getCurrentChapter() {
    this.apiSevice.getChapterGhomala(this.currentBookID, this.currentChapterNumber, this.versionGhomala).subscribe(
      data => {
        this.chapterGhomala = data;
      }
    );
    console.log('getCurrentChapter called with bookID: ' + this.currentBookID + ' and version: ' + this.currentBibelVersion);
    this.localSevice.getChapter(this.currentBookID, this.currentBibelVersion)
    .subscribe(
      data => {
        this.chapterOther = data[this.currentChapterNumber-1].Verses;
        console.log("this.chapterOther length called" + this.chapterOther.length);
        this.setNumberOfChaptersOfBook(data);
      }
    );
  }

  setNumberOfChaptersOfBook(chapters: any[]) {
      this.chapterNumbersOfBook = this.sharedService.getArrayNumber(1, chapters.length);
  }

  setCurrentBookID(cbn?: number) {
    if (cbn) {
      if (cbn > 65) {
        cbn = 0;
      }
      this.currentBookID = cbn;
      this.setCurrentChapterNumber(1);
      localStorage.setItem('lastBookID_study', cbn.toString());
      console.log("set setCurrentBookID called 1: ");
      return;
    }
    const bn = localStorage.getItem('lastBookID_study');
    if (bn && bn !== null) {
      this.currentBookID = +bn;
      console.log("set setCurrentBookID called 2: " + bn);
    } else {
      this.currentBookID = 0;
      console.log("set setCurrentBookID called 3: ");
    }
  }

  setCurrentChapterNumber(ccn?: number) {
    if (this.currentBookID === undefined) {
      this.currentChapterNumber = 1;
      console.log("set currentChapterNumber called 1: ");
      return;
    }
    if (ccn !== undefined) {
      this.currentChapterNumber = ccn;
      localStorage.setItem('lastChapNber_study', ccn.toString());
      console.log("set currentChapterNumber called 2: " + ccn.toString());
      return;
    }
    const cn = localStorage.getItem('lastChapNber_study');
    if (cn !== undefined && cn !== null) {
      this.currentChapterNumber = +cn;
      console.log("set currentChapterNumber called 3: " + cn);
    } else {
      this.currentChapterNumber = 1;
      console.log("set currentChapterNumber called 4: ");
    }
  }

  setVersion(curBibelVersion?: string) {
    if(curBibelVersion !== undefined && curBibelVersion !== null){
      this.currentBibelVersion = curBibelVersion;
      this.onBookSelection(this.currentBookID, curBibelVersion);
      localStorage.setItem('lastVersion_study', curBibelVersion);
    } else {
      const cbv = localStorage.getItem('lastVersion_study');
      if (cbv && cbv !== null) {
        this.currentBibelVersion = cbv;
      } else if(this.bibleVersions) {
        this.currentBibelVersion = this.bibleVersions[0];
      }
    }
  }

  private bookNameAndNumber(bookName?: string, nber?: number): string {
    console.log("get bookNameAndNumber called, Id: " + this.currentBookID);
    if (!this.bookNames) {
      throw new Error("No book names");
    }
    if (bookName && nber !== undefined && nber !== null) {
      this.bookChapterName = bookName.split('(').at(0) + " " + nber;
    } else if (bookName) {
      this.bookChapterName = bookName.split('(').at(0) + " " + 1;
    } else if ( this.currentBookID) {
      const j = this.currentBookID >= this.bookNames[0].length;
      const chapteNber = (nber !== undefined && nber !== null)? nber :
      (this.currentChapterNumber !== undefined && this.currentChapterNumber !== null)? this.currentChapterNumber-1: 1;
      this.bookChapterName = this.bookNames[+j][this.currentBookID - (+j*this.bookNames[0].length)].split('(').at(0) + " " + chapteNber;
    }  else {
      this.bookChapterName = this.bookNames[0][0].split('(').at(0) + " " + 1;
    }
    return this.bookChapterName;
  }

  //onBookSelection(index: number, bv?:string) {
  onBookSelection($event: any, bv?:string) {
     if (bv) {
      this.currentBibelVersion = bv;
    }
    const index = $event.value;
    console.log("onBookSelection, ID: " + index);
    this.setCurrentBookID(index);
    this.setCurrentChapterNumber(1);
    if (index < 39) {
      this.currentBookName = this.bookNames[0][index];
    } else {
      this.currentBookName = this.bookNames[+(index > 38)][index];
    }
    this.onChapterChange(1);
    this.getCurrentChapter();
  }

  onBibleVersionsSelection($event: any) {
    console.log('version set is ', $event.value)
    this.setVersion($event.value);
    this.getCurrentChapter();
  }

  onChapterChange(index: number) {
    console.log('onChapterChange', index);
    this.setCurrentChapterNumber(index);
    this.bookNameAndNumber(this.currentBookName, index);
    this.getCurrentChapter();
  }

  next() {
    if (this.chapterNumbersOfBook.indexOf(this.currentChapterNumber) === -1) {
        return;
    }
    if (this.chapterNumbersOfBook.length < this.currentChapterNumber + 1) {
      this.setCurrentBookID(this.currentBookID+1);
      this.getCurrentChapter();
      this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
      return;
    }
    this.setCurrentChapterNumber(this.currentChapterNumber + 1);
    this.getCurrentChapter();
    this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
  }

  previous() {
    if (this.currentBookID <= 0) {
      return;
    }
    if (this.currentChapterNumber - 1 < 1) {
      this.setCurrentBookID(this.currentBookID-1);
      this.getCurrentChapter();
      this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
      return;
    }
    this.setCurrentChapterNumber(this.currentChapterNumber - 1);
    this.getCurrentChapter();
    this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
  }

}
