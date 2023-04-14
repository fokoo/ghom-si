import { Component, OnDestroy, OnInit } from '@angular/core';
/* import {  FormControl,
          UntypedFormGroup,
          NonNullableFormBuilder } from '@angular/forms'; */
//import { ActivatedRoute } from '@angular/router';
//import { ChapterGhomala } from '../models/chapter-ghomala.model';
import { ChapterForm } from '../models/chapter-form.model';
import { Verse } from '../models/verse.model';
import { ApiService } from '../services/api.service';
import { LocalService } from '../services/local.service';
import { SharedService } from '../services/shared.service';
import {HotToastService} from "@ngneat/hot-toast";
//import { catchError, tap } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogComponent } from '../dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.scss']
})
export class EditionComponent implements OnInit, OnDestroy {

  OLD_BOOK_LENGTH = 39;
  BOOK_LENGTH = 66;
  FIRST_BOOK_NUMBER = 0;
  FIRST_CHAPTER_ID = 0;
  HIGHER_CHAPTER_ID = 150;
  ADD_EDIT = 5;

  Shift = '&#10;';
  VerseSeparation = "#v{Number}#{ Text }";
  TitleSeparation = "#t{ Text }#";

  urlAudio: string = "";
  typFile: string = "audios/";
  fileIsUploading = false;
  uploaded: boolean = false;
  audioUploaded: boolean = false;
  disabledOpenRecord = false;
  record = false;
  stopRecord = true;
  addPrononciation = false;
  deleteOrSaveRecord = true;

  private audioChunks?: any[];
  private rec?: MediaRecorder;
  private blob?: any;
  private showAudio = false;

  //mainForm!: UntypedFormGroup;
  //VersesFormArray!: UntypedFormArray;
  //VerseForm!: UntypedFormGroup;
  //VersesCompactCtrl!: FormControl;
  //IntroductionCtrl!: FormControl;
  //TitleCtrl!: FormControl;
  //AudioCtrl!: FormControl;

  VersesCompactText?: string;
  IntroductionText?: string;
  TitleText?: string;

  compactText = true;
  bookNames!: any[][];
  editChapterLength!: number[];
  //bookNames$!: Observable<any>;
  private currentBookName!: string;
  currentChapterNumber!: number;
  //private nberChapBook!: number;
  currentBookID!: number;
  currentBibelVersion!: string;
  private bookChapterName!: string;
  bookName!: string;
  chapterName!: string;
  //bibleVersions$!: Observable<any>;
  bibleVersions!: string[];
  compare: boolean = false;
  chapterNumbersOfBook!: number[];
  chapterGhomala!: ChapterForm;
  chapterOther: Verse[] = [];
  chapterNberList!: number[];
  direction: boolean = true;
  defaultVerse = "Aucune traduction de ce Versé disponible";
  isEditMode = false;
  translatedText!: string[];
  showKeyboard: any;
  saveChapterGhomala!: ChapterForm;
  VersionsGhomala! : string[];
  curGhomalaVersion! : string;
  paused = true;
  //showProgress!: boolean;
  confirmDialog!: number;

  constructor(
    //private nonNullableFormBuilder: NonNullableFormBuilder,
    private localSevice: LocalService,
    private apiSevice: ApiService,
    //private router: Router,
    private sharedService: SharedService,
    private toast: HotToastService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog) { }


  ngOnInit(): void {
    this.setCurrentBookID();
    this.initTop();
    //this.initForm();
    // todo add spinner when app start
    this.getCurrentChapter();
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
    this.localSevice.getVersionGhomala().subscribe((data) =>
    {
       this.VersionsGhomala = data;
       this.setVersionGhomala();
    }
 );
}

getCurrentChapter() {
    if (this.isEditMode) {
       this.openDialog();
    }
    this.spinner.show();
    this.apiSevice.getChapterGhomalaFb(this.currentBookID+1, this.currentChapterNumber+1, this.curGhomalaVersion).subscribe(
      data => {
        console.log('getCurrentChapter 1. check');
        console.log(data);
        //this.chapterGhomala = new ChapterForm();
        this.chapterGhomala = (data === undefined || data === null) ? new ChapterForm() : data;
        //this.saveChapterGhomala = this.chapterGhomala;
        this.initForm(this.chapterGhomala);
        this.spinner.hide();

      }
    );
    console.log('getCurrentChapter called with bookID: ' + this.currentBookID + ' and version: ' + this.currentBibelVersion);
    this.localSevice.getChapter(this.currentBibelVersion, this.currentBookID, this.currentChapterNumber)
    .subscribe(
      data => {
        if (this.currentBibelVersion === this.bibleVersions[2])
        {
            console.log("this.currentBibelVersion: " + this.currentBibelVersion);
            this.chapterOther = data;
        }
        else
        {
           this.chapterOther = data[this.currentChapterNumber].Verses;
        }
        this.localSevice.getNumberOfChapterOfBook().subscribe((data) =>
        {
           this.chapterNberList = data;
           this.setNumberOfChaptersOfBook(this.chapterNberList[this.currentBookID]);
        }
        );
      }
    );
}

  setNumberOfChaptersOfBook(len: number) {
      this.chapterNumbersOfBook = this.sharedService.getArrayNumber(1, len);
     // this.editChapterLength = this.sharedService.getArrayNumber(0, len + this.ADD_EDIT);
     this.editChapterLength = this.sharedService.getArrayNumber(0, len);
  }

  setCurrentBookID(cbn?: number) {
    if (cbn !== undefined) {
      if (cbn >= this.BOOK_LENGTH || cbn < this.FIRST_BOOK_NUMBER) {
        cbn = this.FIRST_BOOK_NUMBER;
        this.currentBookID = cbn;//(this.currentBookID === undefined)? cbn : this.currentBookID;
        this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
        localStorage.setItem('lastBookID', cbn.toString());
        console.log("set setCurrentBookID called 0: " + cbn);
        return;
      } else {
        this.currentBookID = cbn;
        this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
        localStorage.setItem('lastBookID', cbn.toString());
        console.log("set setCurrentBookID called 1: " + cbn);
        return;
      }
    }
    const bn = localStorage.getItem('lastBookID');
    if (bn !== undefined && bn !== null && +bn >= this.FIRST_BOOK_NUMBER && +bn < this.BOOK_LENGTH) {
      this.currentBookID = +bn;
      this.setCurrentChapterNumber();
    } else {
      this.currentBookID = this.FIRST_BOOK_NUMBER;
      this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
    }
  }

  setCurrentChapterNumber(ccn?: number) {
    if (this.currentBookID === undefined) {
      throw new Error("No book id choosed");
      //this.currentChapterNumber = this.FIRST_CHAPTER_ID;
      //localStorage.setItem('lastChapNber', this.currentChapterNumber.toString());
      //return;
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

  private setVersion(curBibelVersion?: string) {
    if(curBibelVersion){
      this.currentBibelVersion = curBibelVersion;
      localStorage.setItem('lastVersion', curBibelVersion);
    } else {
      const cbv = localStorage.getItem('lastVersion');
      if (cbv && cbv !== null && this.bibleVersions.indexOf(cbv) != -1) {
        this.currentBibelVersion = cbv;
      } else if(this.bibleVersions) {
        this.currentBibelVersion = this.bibleVersions[0];
      }
    }
    this.onBookSelection(this.currentBookID, this.currentBibelVersion);
  }

  private setVersionGhomala(cgv?: string) {
    if(cgv && cgv !== null){
      this.curGhomalaVersion = cgv;
      //this.onBookGhomalaSelect(this.currentBookID, cgv);
      localStorage.setItem('lastGhomalaVersion', cgv);
    } else {
      const scgv = localStorage.getItem('lastGhomalaVersion');
      if (scgv && scgv !== null && this.bibleVersions.indexOf(scgv) != -1) {
        this.curGhomalaVersion = scgv;
      } else if(this.bibleVersions) {
        this.curGhomalaVersion = this.VersionsGhomala[0];
      }
    }
  }

  onGhomalaVersionsSelection($event: any) {
    console.log('version ghomala set is ', $event.value)
    this.setVersionGhomala($event.value);
    this.getCurrentChapter();
  }

  /* private onBookGhomalaSelect($event: any, cgv: string) {
    if (cgv !== undefined && cgv !== null) {
      this.curGhomalaVersion = cgv;
    }
    const index = $event.value;
    console.log("onBookGhomalaSelection, ID: " + index);
    this.setCurrentBookID(index);
    this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
    if (index < this.OLD_BOOK_LENGTH) {
      this.currentBookName = this.bookNames[0][index];
    } else {
      this.currentBookName = this.bookNames[+(index >= this.OLD_BOOK_LENGTH)][index];
    }
    this.onChapterChange(this.FIRST_CHAPTER_ID);
    this.getCurrentChapter();
  } */

  private bookNameAndNumber(bookName?: string, nber?: number): string {
    console.log("get bookNameAndNumber called, Id: " + this.currentBookID);
    if (!this.bookNames) {
      throw new Error("No book names");
    }

    if (bookName && nber !== undefined && nber !== null)
    {
      nber += 1;
      this.bookName = bookName.split('(').at(0) + ' ';
      this.chapterName = " Chap. " + nber;
      //this.bookChapterName = bookName.split('(').at(0) + " Chap. " + nber;
    }
    else if (bookName)
    {
      this.bookName = bookName.split('(').at(0) + ' ';
      this.chapterName = " Chap. " + this.FIRST_CHAPTER_ID;
      //this.bookChapterName = bookName.split('(').at(0) + " Chap. "  + 1;
    }
    else if ( this.currentBookID)
    {
      const j = this.currentBookID >= this.bookNames[0].length;
      const chapteNber = (nber !== undefined && nber !== null)? nber+1 :
      (this.currentChapterNumber !== undefined && this.currentChapterNumber !== null)? this.currentChapterNumber-1: 1;
      const k = this.currentBookID - (+j*this.bookNames[0].length);
      console.log("j = " + j + ", k = " + k);
      this.bookName = this.bookNames[+j][k].split('(').at(0) + ' ';
      this.chapterName = " Chap. " + chapteNber;
      //this.bookChapterName = this.bookNames[+j][k-1].split('(').at(0) + " Chap. " + chapteNber;
    }
    else
    {
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
    this.setCurrentChapterNumber(this.FIRST_CHAPTER_ID);
    if (index < this.OLD_BOOK_LENGTH) {
      this.currentBookName = this.bookNames[0][index];
    } else {
      this.currentBookName = this.bookNames[+(index >= this.OLD_BOOK_LENGTH)][index];
    }
    this.onChapterChange(this.FIRST_CHAPTER_ID);
      // todo) get bibel and chapter from api
  }

  onBibleVersionsSelection($event: any) {
    console.log('version set is ', $event.value)
    this.setVersion($event.value);
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


  initForm(chapterForm?: ChapterForm) {
    console.log("initForm() called");
    if (chapterForm) {
       this.TitleText = (chapterForm.Title)?chapterForm.Title: "";
       this.IntroductionText = (chapterForm.Introduction)?chapterForm.Introduction : "" ;
       this.VersesCompactText = (chapterForm.Verses)?chapterForm.Verses:this.VerseSeparation;
    }
  }

  updateTitle(){}
  updateIntroduction(){
 /*    if (this.IntroductionText) {
      this.onNewKeyboardWords(this.IntroductionText, -1);
    } */
  }
  updateVerses(){}

  addVerse(shift: string) {
    if (this.VersesCompactText) {
      this.VersesCompactText += shift;
      this.VersesCompactText += this.VerseSeparation;
    } else {
      this.VersesCompactText = this.VerseSeparation;
    }

  }

  addTitle(shift: string) {
    this.VersesCompactText += shift;
    this.VersesCompactText += this.TitleSeparation;
  }


  //todo confirmation before saving
  private saveChapter() {
    console.log("saveChapter() called");
    const chapterForm =
    {
      Title: this.TitleText,
      Introduction: this.IntroductionText,
      Verses: this.VersesCompactText,
      BookID: this.currentBookID+1,
      ChapterID: this.currentChapterNumber+1,
      Audio: this.urlAudio
    }
    this.apiSevice.addChapterFormFb(chapterForm, this.curGhomalaVersion).pipe(
      this.toast.observe({
        success: 'Congrats! Change has been successfully saved',
        loading: 'Saving ...',
        error: ({message}) => `${message}`,
      })
    ).subscribe();
  }

  onSubmitForm(){
    //this.saveChapter();
    this.openDialog();
    this.edit();
  }

  keyboard() {
    this.showKeyboard = !this.showKeyboard;
    this.edit()
  }
  //todo
  onNewKeyboardWords(typedWords: string, i: number) {
    if(i === -1 ){
      this.IntroductionText = typedWords;
      return;
    }
    console.log("onNewWords() called");
    console.log(typedWords);
    this.VersesCompactText = typedWords;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: "Attention!",
             content: "Voulez-vous sauvegadez les changements",
             no: "NON",
             yes: "OUI"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.confirmDialog = +(result);
      if (this.confirmDialog === 1) {
         this.saveChapter();
      }
      this.edit();
    });
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
    //this.getCurrentChapter();  // todo to getcurrentchapter and replace by re-init chapterGhomala,
                               //while taking the changes under consideration
  }

  //todo
  resetChapter() {
    this.edit();
    this.getCurrentChapter();
  }

  resetPreviewWork() {
    const edit = localStorage.getItem('editMode');
    if (edit !== null && 1 === +edit)
    {
       console.log('getCurrentChapter 1. check');
           //this.initLocale(JSON.parse(edit!));
       this.initLocale(true);
    }
 }

  initLocale (editMode: boolean): void {
    console.log("initLocale(..) called!");
    if (editMode === true) {
      this.isEditMode = editMode;
      const _chapterGhomala = JSON.parse(localStorage.getItem('chapterGhomala')!);
      const _bookID = localStorage.getItem('lastBookID');
      const _chapNber = localStorage.getItem('lastChapNber');
      const _version = localStorage.getItem('lastVersion');
      if (_bookID !== undefined && _bookID !== null &&
          _chapNber !== undefined && _chapNber !== null &&
          _version !== undefined && _version !== null &&
          _chapterGhomala !== undefined && _chapterGhomala !== null) {
            this.currentBookID = +_bookID;
            this.currentChapterNumber = +_chapNber;
            this.currentBibelVersion = _version;
            this.chapterGhomala = _chapterGhomala;
            this.isEditMode = editMode;
            this.clearChapterSaved();
      } else {
        return;
      }
    }
  }

  //todo
  playAudio() {
    console.log('Method playAudio() not implemented yet: todo.');
    this.paused = !this.paused;
    this.sharedService.playAudio(this.chapterGhomala.Audio, this.paused);
  }


  next() {
    console.log('next() called, this.currentChapterNumber: ' + this.currentChapterNumber);
    console.log('next() called, this.currentBookName: ' + this.currentBookName);
    if (this.chapterNumbersOfBook.indexOf(this.currentChapterNumber+1) === -1) {
       console.log('next() called, 1. check ');
        console.log('currentChapterNumber has problem: ' + this.currentChapterNumber );
        return;
    }
    if (this.chapterNumbersOfBook.length <= this.currentChapterNumber + 1) {
      console.log('next() called, 2. check ');
      this.setCurrentBookID(this.currentBookID + 1);
      this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
      this.getCurrentChapter();
      return;
    }
    console.log('next() called, 3. check ');
    this.setCurrentChapterNumber(this.currentChapterNumber + 1);
    this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
    this.getCurrentChapter();
  }

  previous() {
    console.log('previous() called, this.currentChapterNumber: ' + this.currentChapterNumber);
    console.log('previous() called, this.currentBookName: ' + this.currentBookName);
    if (this.currentBookID < this.FIRST_BOOK_NUMBER
         || this.currentChapterNumber < this.FIRST_CHAPTER_ID) {
          console.log('currentChapterNumber has problem: ' + this.currentChapterNumber );
          return;
    }
    if (this.currentChapterNumber - 1 < this.FIRST_CHAPTER_ID) {
      this.setCurrentBookID(this.currentBookID-1);
      this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
      this.getCurrentChapter();
      return;
    }
    this.setCurrentChapterNumber(this.currentChapterNumber - 1);
    this.bookNameAndNumber(this.currentBookName, this.currentChapterNumber);
    this.getCurrentChapter();
  }

  ngOnDestroy(): void {
    if (this.isEditMode) {
      localStorage.setItem('chapterGhomala', JSON.stringify(this.chapterGhomala));
      localStorage.setItem("isEditMode", Number(this.isEditMode).toString());

      localStorage.setItem('lastBookID', this.currentBookID.toString());
      localStorage.setItem('lastChapNber', this.currentChapterNumber.toString());
      localStorage.setItem('lastVersion', this.currentBibelVersion.toString());
    }
    // else {
    //  localStorage.clear();
    //}
  }
   clearChapterSaved(): void {
    localStorage.removeItem("chapterGhomala");
    localStorage.removeItem("isEditMode");
    localStorage.removeItem('lastBookID');
    localStorage.removeItem('lastChapNber');
    localStorage.removeItem('lastVersion');
   }


     //todo
  uploadAudio (file: File) {
    this.chapterGhomala.Audio = "audio"; //todo
    //this.apiSevice.updateChapterGhomalaFb(this.chapterGhomala, this.curGhomalaVersion);
    this.fileIsUploading = true;
    this.apiSevice.uploadAudio(file, this.typFile, this.curGhomalaVersion,
      this.currentBookID, this.currentChapterNumber).then(
      (url: string) => {
        this.urlAudio = url;
        this.fileIsUploading = false;
        this.audioUploaded = true;

        //this.formData.set(this.typFile, file);
        // console.log('fileType :' + typ);
        // console.log('formData.get(typ) is ' + this.formData.get(typ));
      }
    );
  }

  detectFiles($event: any) {
    this.uploadAudio($event.target.file);
  }

  onOpenRecord(){
    this.showAudio = true;
    this.addPrononciation = !this.addPrononciation;
    if (this.addPrononciation) {
      navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
          this.handlerFunction(stream);
        });
    }
  }

  private handlerFunction(stream: MediaStream) {
    this.rec = new MediaRecorder(stream);
    this.rec.ondataavailable = e => {
      this.audioChunks?.push(e.data);
      if (this.rec?.state === 'inactive'){
        this.blob = new Blob(this.audioChunks, {type: 'audio/wav'});
        const recordedAudio = document.getElementById('recordedAudio') as HTMLAudioElement;
        if (recordedAudio !== null) {
          recordedAudio.src = URL.createObjectURL(this.blob);
          recordedAudio.controls = true;
          recordedAudio.autoplay = true;
        }
      }
    };
  }


  onRecord($event: any) {
      console.log('record was clicked');
      this.record = true;
      this.stopRecord = false;
      $event.target.style.backgroundColor = 'blue';
      this.audioChunks = [];
      this.rec?.start();
  }

  onStop($event: any) {
    console.log('stop was clicked');
    this.record = false;
    this.stopRecord = true;
    // if(this.blob) {
    this.deleteOrSaveRecord = false;
    // }
    $event.target.style.backgroundColor = 'red';
    this.rec?.stop();
  }

  onDelete() {
    console.log('delete was clicked');
    this.record = false;
    if (!this.stopRecord){
      this.stopRecord = true;
      this.rec?.stop();
    }
    this.deleteOrSaveRecord = true;
    this.audioChunks = [];
    this.blob = null;
  }

  saveRecord() {
    this.record = true;
    if (!this.stopRecord){
      this.stopRecord = true;
      this.rec?.stop();
    }
    this.disabledOpenRecord = true;
    this.deleteOrSaveRecord = true;
    console.log('save was clicked');
    this.uploadAudio(this.blob);
  }

}
