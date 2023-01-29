import { Component } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
// import {AuthService} from "../../services/auth/auth.service";
// import {UserService} from "../../services/user/user.service";
// import {UserModel} from "../../../auth/models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    //private translate: TranslateService,
    //private authService: AuthService,
    //public usersService: UserService,
    private router: Router) { }

user!: User;
user$!: Observable<User>; //this.usersService.currentUserProfile$;

onSignOut() {
  /* this.authService.logoutFb().subscribe(() => {
  this.router.navigate(['/']);
  });
  } */
}

onSignIn() {
  /* this.authService.logoutFb().subscribe(() => {
  this.router.navigate(['/']);
  });
  } */
}

}






