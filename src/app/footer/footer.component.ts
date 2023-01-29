import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  showContact = false;
  showAbout = false;
  showLearn = false;

  constructor() {
  }

  showDiv(show: string){
    if (show === 'contact'){
      this.showContact = !this.showContact;
      this.showAbout = false;
      this.showLearn = false;
    }
    if (show === 'about'){
      this.showContact = false;
      this.showAbout = !this.showAbout;
      this.showLearn = false;
    }
    if (show === 'learn'){
      this.showContact = false;
      this.showAbout = false;
      this.showLearn = !this.showLearn;
    }
  }
}
