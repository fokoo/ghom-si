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

  OLD_BOOK_LENGTH = 39;
  BOOK_LENGTH = 66;
  FIRST_VERSION_NUMBER = 0;
  FIRST_BOOK_NUMBER = 0;
  FIRST_CHAPTER_ID = 0;
  HIGHER_CHAPTER_ID = 150;

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
  chapterOther: Verse[] = [];
  chapterNberList!: number[]
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
     //this.setCurrentChapterNumber();
  }

  initTop() {
    console.log("initTop called");
    //this.bookNames$ = this.localSevice.getBooks();
    this.localSevice.getBooksGhomala().subscribe(data =>
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
    this.localSevice.getNumberOfChapterOfBook().subscribe((data) =>
    {
       this.chapterNberList = data;
    }
    );
  }

  getCurrentChapter() {
    this.apiSevice.getChapterGhomalaFb(this.currentBookID+1, this.currentChapterNumber+1, this.versionGhomala).subscribe(
      data => {
        this.chapterGhomala = data;
      }
    );
    console.log('getCurrentChapter called with bookID: ' + this.currentBookID + ' and version: ' + this.currentBibelVersion);
    this.localSevice.getChapter(this.currentBibelVersion, this.currentBookID, this.currentChapterNumber)
    .subscribe(
      data =>
      {
        //console.log("this.currentBibelVersion: " + this.currentBibelVersion);
        if (this.currentBibelVersion === this.bibleVersions[2])
        {
            console.log("this.currentBibelVersion: " + this.currentBibelVersion);
            this.chapterOther = data;
        }
        else
        {
           this.chapterOther = data[this.currentChapterNumber].Verses;
        }
        this.setNumberOfChaptersOfBook(this.chapterNberList[this.currentBookID]);
      }
    );
  }

  setNumberOfChaptersOfBook(len: number) {
      this.chapterNumbersOfBook = this.sharedService.getArrayNumber(1, len);
  }

  setCurrentBookID(cbn?: number) {
    if (cbn !== undefined ) {
      if (cbn >= this.BOOK_LENGTH) {
        cbn = this.FIRST_BOOK_NUMBER;
        this.currentBookID = (this.currentBookID === undefined)? cbn : this.currentBookID;
        this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
        localStorage.setItem('lastBookID_study', cbn.toString());
        console.log("set setCurrentBookID called 0: " + cbn);
        return;
      } else {
        this.currentBookID = cbn;
        this.setCurrentChapterNumber();
        localStorage.setItem('lastBookID_study', cbn.toString());
        console.log("set setCurrentBookID called 1: " + cbn);
        return;
      }
    }
    const bn = localStorage.getItem('lastBookID_study');
    if (bn && bn !== null) {
      this.currentBookID = +bn;
      this.setCurrentChapterNumber();
      console.log("set setCurrentBookID called 2: " + bn);
    } else {
      this.currentBookID = this.FIRST_BOOK_NUMBER;
      this.setCurrentChapterNumber();
      console.log("set setCurrentBookID called 3: " + this.FIRST_BOOK_NUMBER);
    }
  }

  setCurrentChapterNumber(ccn?: number) {
    if (this.currentBookID === undefined) {
      throw new Error("No book id choosed");
      //this.currentChapterNumber = this.FIRST_CHAPTER_ID;
      //localStorage.setItem('lastChapNber_study', this.currentChapterNumber.toString());
      //console.log("set currentChapterNumber called 1: ");
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
      this.currentChapterNumber = this.FIRST_CHAPTER_ID;
      localStorage.setItem('lastChapNber_study', this.currentChapterNumber.toString());
      console.log("set currentChapterNumber called 4: ");
    }
  }

  setVersion(curBibelVersion?: string) {
    if (curBibelVersion !== undefined && curBibelVersion !== null) {
      this.currentBibelVersion = curBibelVersion;
      this.onBookSelection(this.currentBookID, curBibelVersion);
      localStorage.setItem('lastVersion_study', curBibelVersion);
    } else {
      const cbv = localStorage.getItem('lastVersion_study');
      if (cbv !== undefined && cbv !== null) {
        this.currentBibelVersion = cbv;
      } else if (this.bibleVersions) {
        this.currentBibelVersion = this.bibleVersions[this.FIRST_VERSION_NUMBER];
        localStorage.setItem('lastVersion_study', this.currentBibelVersion);
      }
    }
  }

  private bookNameAndNumber(bookName?: string, nber?: number): string {
    console.log("get bookNameAndNumber called, Id: " + this.currentBookID);
     if (!this.bookNames) {
      throw new Error("No book names");
    }
    if (nber !== undefined) {
       nber += 1;
    }
    if (bookName && nber !== undefined && nber !== null) {
      this.bookChapterName = bookName.split('(').at(0) + " " + nber;
    } else if (bookName) {
      this.bookChapterName = bookName.split('(').at(0) + " " + 1;
    } else if (this.currentBookID) {
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
    this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
    if (index < this.OLD_BOOK_LENGTH) {
      this.currentBookName = this.bookNames[0][index];
    } else {
      this.currentBookName = this.bookNames[+(index >= this.OLD_BOOK_LENGTH)][index];
    }
    this.onChapterChange(this.FIRST_CHAPTER_ID);
    //this.getCurrentChapter();
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
    if (this.currentBookID <= 0 && this.currentChapterNumber == 1) {
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
