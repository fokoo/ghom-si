import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

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

   edit(bookId: number) {
    console.log("edit: " + bookId);
    localStorage.setItem('lastBookID', bookId.toString());
    this.router.navigate(['traduire']);
  }

  playAudio(bookId: number) {
    console.log("play:"  + bookId);
  }

  onBookSelection(bookId: number) {
    console.log("onBookChange number: " + bookId);
    localStorage.setItem('lastBookID_study', bookId.toString());
    this.router.navigate(['lanye']);
  }

}
