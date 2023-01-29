import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Verse } from '../models/verse.model';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.scss']
})
export class EditionComponent {

  _chapterID!: number;
  selectChapters: string[] = ["Genèse", "Exodes", "Nombres"];compare: any;
  chapterGhomala: Verse[] =
   [
    {ID: 1, Text: "Genèfnnrf bcbacbiusebu"},
    {ID: 2, Text: "Genèfnnrf bcbacbiusebu"},
    {ID: 3, Text: "Genèfnnrf bcbacbiusebu"}
  ];
  selectedChapter: string = "Genèse";
  chapter: Verse[] =
  [
    {ID: 1, Text: "Genèfnnrf bcbacbiusebu"},
    {ID: 2, Text: "Genèfnnrf bcbacbiusebu"},
    {ID: 3, Text: "Genèfnnrf bcbacbiusebu"}
  ];
  selectedVersion: any;
  selectVersions: any;
  chapterNumbers!: number[];
  choosed: boolean = false;

  constructor(private sharedService: SharedService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.init();
  }

  private init() {
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
    this.chapterID = 1;
  }
  previous() {
    if (this.chapterID <= 0) {
      return;
    }
    this.chapterID = -1;
  }

  onChapterChange(index: number) {
      console.log("onChapterChange number: " + index);
      this.router.navigate(['lanye','chapter', index]);
  }

}
