import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChapterGhomala } from '../models/chapter-ghomala.model';
import { Verse } from '../models/verse.model';
import { ApiService } from '../services/api.service';
import { LocalService } from '../services/local.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.scss']
})
export class EditionComponent implements OnInit, OnDestroy {

  OLD_BOOK_LENGTH = 39;
  BOOK_LENGTH = 66;
  FIRST_BOOK_NUMBER = 1;
  FIRST_CHAPTER_ID = 1;
  HIGHER_CHAPTER_ID = 155;
  ADD_EDIT = 5;

  mainForm!: UntypedFormGroup;
  Verses!: UntypedFormGroup;
  TextCtrl!: FormControl;
  TitleCtrl!: FormControl;
  AudioCtrl!: FormControl;

  bookNames!: any[][];
  editChapterLength!: number[];
;
  //bookNames$!: Observable<any>;
  private currentBookName!: string;
  currentChapterNumber!: number;
  //private nberChapBook!: number;
  currentBookID!: number;
  currentBibelVersion!: string;
  bookChapterName!: string;
  bookName!: string;
  chapterName!: string;
  //bibleVersions$!: Observable<any>;
  bibleVersions!: string[];
  compare!: boolean;
  chapterNumbersOfBook!: number[];
  chapterGhomala!: ChapterGhomala;
  chapterOther!: Verse[];
  direction: boolean = true;
  defaultVerse = "Aucune traduction de ce Versé disponible";
  isEditMode = true;
  translatedText!: string[];
  showKeyboard: any;
  saveChapterGhomala!: ChapterGhomala;
  versionGhomala = 1;
  paused = true;
  addVerseTitle = false;

  constructor(
    private localSevice: LocalService,
    private apiSevice: ApiService,
    //private router: Router,
    private sharedService: SharedService) { }


  ngOnInit(): void {
    this.setCurrentBookID();
    this.initTop();
    this.getCurrentChapter();
  }

  /* initValues() {
     this.setCurrentBookID();
     //this.setCurrentChapterNumber();
  } */

  initTop() {
    console.log("initTop called");
    //this.bookNames$ = this.localSevice.getBooks();
    this.localSevice.getBooksGhomala().subscribe( data =>
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
    const edit = localStorage.getItem('editMode');
    if (edit !== null && 1 === +edit) {
      //this.initLocale(JSON.parse(edit!));
      this.initLocale(true);
      this.saveChapterGhomala = this.chapterGhomala;
    } else {
      this.apiSevice.getChapterGhomalaFb(this.currentBookID, this.currentChapterNumber,this.versionGhomala).subscribe(
      data => {
        this.chapterGhomala = data ? data : new ChapterGhomala();
        this.saveChapterGhomala = this.chapterGhomala;
      }
      );
    }
    console.log('getCurrentChapter called with bookID: ' + this.currentBookID + ' and version: ' + this.currentBibelVersion);
    this.localSevice.getChapter(this.currentBookID-1, this.currentBibelVersion)
    .subscribe(
      data => {
        this.chapterOther = data[this.currentChapterNumber-1].Verses;
        console.log("this.chapterOther length called" + this.chapterOther.length);
        this.setNumberOfChaptersOfBook(data.length);
      }
    );
  }

  setNumberOfChaptersOfBook(length: number) {
      this.chapterNumbersOfBook = this.sharedService.getArrayNumber(1, length);
      this.editChapterLength = this.sharedService.getArrayNumber(-1, length + this.ADD_EDIT);
  }

  setCurrentBookID(cbn?: number) {
    if (cbn) {
      if (cbn > this.BOOK_LENGTH) {
        cbn = 1;
      }
      this.currentBookID = cbn;
      this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
      localStorage.setItem('lastBookID', cbn.toString());
      return;
    }
    const bn = localStorage.getItem('lastBookID');
    if (bn !== undefined && bn !== null && +bn >= this.FIRST_BOOK_NUMBER && +bn <= this.BOOK_LENGTH) {
      this.currentBookID = +bn;
      this.setCurrentChapterNumber();
    } else {
      this.currentBookID = this.FIRST_BOOK_NUMBER;
      this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
    }
  }

  setCurrentChapterNumber(ccn?: number) {
    if (this.currentBookID === undefined) {
      this.currentChapterNumber = this.FIRST_CHAPTER_ID;
      localStorage.setItem('lastChapNber', this.currentChapterNumber.toString());
      return;
    }
    if (ccn !== undefined && ccn !== null) {
      this.currentChapterNumber = ccn;
      localStorage.setItem('lastChapNber', ccn.toString());
      console.log("set currentChapterNumber called: " + ccn.toString());
      return;
    }
    const cn = localStorage.getItem('lastChapNber');
    if (cn !== undefined && cn !== null && +cn >= this.FIRST_CHAPTER_ID && +cn <= this.HIGHER_CHAPTER_ID) {
      this.currentChapterNumber = +cn;
      console.log("set currentChapterNumber called: " + cn);
    } else {
      this.currentChapterNumber = this.FIRST_CHAPTER_ID;
      localStorage.setItem('lastChapNber', this.currentChapterNumber.toString());
    }
  }

  setVersion(curBibelVersion?: string) {
    if(curBibelVersion){
      this.currentBibelVersion = curBibelVersion;
      this.onBookSelection(this.currentBookID, curBibelVersion);
      localStorage.setItem('lastVersion', curBibelVersion);
    } else {
      const cbv = localStorage.getItem('lastVersion');
      if (cbv && cbv !== null && this.bibleVersions.indexOf(cbv) != -1) {
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
      this.bookName = bookName.split('(').at(0) + ' ';
      this.chapterName = " Chap. " + nber;
      //this.bookChapterName = bookName.split('(').at(0) + " Chap. " + nber;
    } else if (bookName) {
      this.bookName = bookName.split('(').at(0) + ' ';
      this.chapterName = " Chap. " + this.FIRST_CHAPTER_ID;
      //this.bookChapterName = bookName.split('(').at(0) + " Chap. "  + 1;
    } else if ( this.currentBookID) {
      const j = this.currentBookID >= this.bookNames[0].length;
      const chapteNber = (nber !== undefined && nber !== null)? nber :
      (this.currentChapterNumber !== undefined && this.currentChapterNumber !== null)? this.currentChapterNumber-1: 1;
      const k = this.currentBookID - (+j*this.bookNames[0].length);
      this.bookName = this.bookNames[+j][k-1].split('(').at(0) + ' ';
      this.chapterName = " Chap. " + chapteNber;
      //this.bookChapterName = this.bookNames[+j][k-1].split('(').at(0) + " Chap. " + chapteNber;
    }  else {
      this.bookName = this.bookNames[0][0].split('(').at(0) + ' ';
      this.chapterName = " Chap. " + this.FIRST_CHAPTER_ID;
      //this.bookChapterName = this.bookNames[0][0].split('(').at(0) + " Chap. " + 1;
    }
    return this.bookChapterName;
  }

  //onBookSelection(index: number, bv?:string) {
  onBookSelection($event: any, bv?:string) {
     if (bv !== undefined && bv !== null) {
      this.currentBibelVersion = bv;
    }
    const index = $event.value;
    console.log("onBookSelection, ID: " + index);
    this.setCurrentBookID(index);
    this.setCurrentChapterNumber(1);
    if (index <= this.OLD_BOOK_LENGTH) {
      this.currentBookName = this.bookNames[0][index-1];
    } else {
      this.currentBookName = this.bookNames[+(index > this.OLD_BOOK_LENGTH)][index-1];
    }
    this.onChapterChange(1);
    this.getCurrentChapter();
      // todo) get bibel and chapter from api
  }

  onBibleVersionsSelection($event: any) {
    console.log('version set is ', $event.value)
    this.setVersion($event.value);
    this.getCurrentChapter();
     // todo) get version, bibel and chapter from api
  }

  onChapterChange(index: number) {
    console.log('onChapterChange', index);
    this.setCurrentChapterNumber(index);
    this.bookNameAndNumber(this.currentBookName, index);
    this.getCurrentChapter();
  }

  //todo
  updateTranslatedText() {
    throw new Error('Method not implemented.');
  }

  edit() {
    this.isEditMode = !this.isEditMode;
  }

  //todo
  saveChapter() {
    console.log("saveChapter() called");
    this.isEditMode = !this.isEditMode;
    // todo confimation before sent to api
    //this.chapterGhomala.BookID = this.currentBookID;
    this.chapterGhomala.ChapterID = this.currentChapterNumber;
    this.chapterGhomala.Verses = [];
    //this.chapterGhomala.BookName = "book-name"; // todo
    this.chapterGhomala.Text = "Text for Chapter"; // todo
    this.chapterGhomala.Audio = "audio"; //todo
    for(let i = 0; i < this.chapterOther.length; i++) {
      let verse = new Verse(this.chapterOther[i].ID!, this.defaultVerse);
      this.chapterGhomala.Verses[i] = { ...verse };
      //this.chapterGhomala.Verses[i] = this.chapterOther[i];
      //this.chapterGhomala.Verses[i].Text =  this.defaultVerse; // this.chapterOther[i].Text;
      //this.chapterGhomala.Verses[i].ID   =  this.chapterOther[i].ID;
    }
    let chapterGhomala = {
      DB_UID: " ",
      Verses:       { ...this.chapterGhomala.Verses },
      ChapterID:    this.currentChapterNumber,
      BookID:       this.currentBookID,
      BookName:     this.currentBookName,
      Text:         this.chapterGhomala.Text,
      Audio:        this.chapterGhomala.Audio
    };
    this.apiSevice.addChapterGhomalaFb(chapterGhomala, this.versionGhomala);
  }

  //todo
  onNewKeyboardWords(typedWords: string, i: number) {
    if(i === -1 ){
      this.chapterGhomala.Text = typedWords;
      return;
    }
    console.log("onNewWords() called");
    console.log(typedWords);
    this.chapterGhomala.Verses[i].Text = typedWords;
  }

  //todo
/*   onVerseTextChange(val: any, i: any) {
    if (!this.showKeyboard) {
      this.chapterOther[i].Text = <string> ((val as HTMLElement).innerHTML);
    }
    console.log("Changed", val)
    console.log("Changed i", i)
  } */

  compareBtn() {
    this.compare = !this.compare;
    this.getCurrentChapter();  // todo to getcurrentchapter and replace by re-init chapterGhomala,
                               //while taking the changes under consideration
  }

  //todo
  resetChapter() {
    this.isEditMode = !this.isEditMode;
    this.chapterGhomala = this.saveChapterGhomala;
  }

  initLocale (editMode: boolean): void {
    if (editMode === true) {
      this.chapterGhomala = JSON.parse(localStorage.getItem('chapterGhomala')!);
      this.isEditMode = editMode;
      localStorage.removeItem("chapterGhomala");
      localStorage.removeItem("isEditMode");
    }
  }

  //todo
  playAudio() {
    console.log('Method playAudio() not implemented yet: todo.');
    this.paused = !this.paused;
    this.sharedService.playAudio(this.chapterGhomala.Audio, this.paused);
  }

  //todo
  downloadAudio () {
    this.chapterGhomala.Audio = "audio"; //todo
    this.apiSevice.updateChapterGhomalaFb(this.chapterGhomala, this.versionGhomala);
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
    if (this.currentBookID <= this.FIRST_BOOK_NUMBER && this.currentChapterNumber == 1) {
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

  ngOnDestroy(): void {
    if (this.isEditMode) {
      localStorage.setItem('chapterGhomala', JSON.stringify(this.chapterGhomala));
      localStorage.setItem("isEditMode", Number(this.isEditMode).toString());

      localStorage.setItem('lastBookID', this.currentBookID.toString());
      localStorage.setItem('lastChapNber', this.currentChapterNumber.toString());
      localStorage.setItem('lastVersion', this.currentBibelVersion.toString());
    } else {
      localStorage.removeItem("chapterGhomala");
      localStorage.removeItem("isEditMode");
    }
  }

}
