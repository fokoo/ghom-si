import { Component, OnInit } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Verse } from 'src/app/models/verse.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {

  private _chapterID!: number;
  chapterName: any;
  selectChapters: string[] = ["Genèse", "Exodes", "Nombres"];
  selectedChapter: string = "Genèse";
  chapterNumbers!: number[];
  chapter: Verse[] =
  [
    {ID: 1, Text: "Genèfnnrf bcbacbiusebu"},
    {ID: 2, Text: "Genèfnnrf bcbacbiusebu"},
    {ID: 3, Text: "Genèfnnrf bcbacbiusebu"}
  ];
  selectedVersion: any;

  compare!: boolean;
  chapterOther: Verse[] =
  [
    {ID: 1, Text: "Genèfnnrf bcbacbiusebu"},
    {ID: 2, Text: "Genèfnnrf bcbacbiusebu"},
    {ID: 3, Text: "Genèfnnrf bcbacbiusebu"}
  ];

  constructor(private sharedService: SharedService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}


  ngOnInit(): void {
     this.init();
  }

  init() {
    this.chapterNumbers = this.sharedService.getArrayNumber(1, this.chapter.length);
    this.chapterID = this.activatedRoute.snapshot.params['id'];
  }
  get chapterID(): number {
    return this._chapterID;
  }
  set chapterID(value: number) {
    this._chapterID = value;
  }
  next() {
    if (this.chapterID >= this.chapter.length) {
      return;
    }
    this.chapterID += 1;
  }
  previous() {
    if (this.chapterID <= 0) {
      return;
    }
    this.chapterID += -1;
  }

  onChapterChange(index: number) {
      console.log("onChapterChange number: " + index);
      this.router.navigate(['lanye','chapter', index]);
  }

}
