import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  //bookNames$!: Observable<any>;
  bookNames$!: Observable<any>;
  books!: {
    alt: string[],
    neu: string[]
  }

constructor(private localSevice: LocalService,
            private router: Router){}

ngOnInit(): void {
  this.bookNames$ =  this.localSevice.getBooks();
}

onOpenChapter(index: number) {
  console.log("onOpenChapter number: " + index);
  //this.router.navigate(['chapter/:index']);
  this.router.navigate(['lanye','chapter', index]);
}

edit(index: number) {
  console.log("edit number: " + index);
}
playAudio(index: number) {
  console.log("play number: " + index);
}

}
