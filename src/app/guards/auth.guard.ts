import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { SharedService } from '../services/shared.service';
import { HotToastService } from "@ngneat/hot-toast";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  //auth = false;

  constructor(public sharedService: SharedService, public router: Router, private toast: HotToastService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.sharedService.isLoggedIn() !== true) {
      //window.alert('Access Denied, Login is Required to Access This Page!');
      this.toast.info('Accès refusé, connexion requise pour accéder à cette page!!');
      this.router.navigate(['login']);
    }
    return true;
  }



  /* canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => {
            if (user) {
              this.auth = true;
              resolve(true);
            } else {
              this.router.navigate(['login']);
              resolve(false);
            }
          }
        );
      }
    );
  } */

  /* getAuth(){
    return this.auth;
  } */
}
