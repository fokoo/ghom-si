import { Component, OnDestroy, OnInit } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { SharedService } from '../services/shared.service';
// import {AuthService} from "../../services/auth/auth.service";
// import {UserService} from "../../services/user/user.service";
// import {UserModel} from "../../../auth/models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {


  constructor(
    //private translate: TranslateService,
    private apiService: ApiService,
    public sharedService: SharedService,
    private router: Router) { }


 isLogged = false;
//user!: User;
//user$!: Observable<User>; //this.usersService.currentUserProfile$;

ngOnInit(): void {
  this.isLogged = this.sharedService.isLoggedIn();
}

onSignOut() {
 sessionStorage.removeItem('user');
 this.apiService.logoutFb().subscribe(() => {
  this.router.navigate(['']);
  });
}

ngOnDestroy(): void {
  sessionStorage.removeItem('user');
}

}






