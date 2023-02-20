import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { HotToastService } from "@ngneat/hot-toast";
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInForm!: FormGroup;
  //Message?: string;
  //errorMessage!: string;
  //loading = false;

  constructor(private formBuilder: NonNullableFormBuilder,
              private apiService: ApiService,
              private toast: HotToastService,
              private router: Router) {}

  ngOnInit() {
    this.initForm();
  }

  private email(username: string): string {
    console.log('email method called and returned: ' + username + '@ghomala.com' );
    return username + '@ghomala.com';
  }

  get username() {
    return this.signInForm.get('username');
  }

  get password() {
    return this.signInForm.get('password');
  }

  initForm() {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      password: ['', [Validators.required]]
    });
  }

 /*  onSubmit() {
    const { username, password } = this.signInForm.value;
    //this.loading = true;

    if (!this.signInForm.valid || !username || !password) {
      return;
    }

    this.apiService
      .loginFb(this.email(username), password)
      .pipe(
         this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in...',
          error: ({ message }) => `There was an error: ${message} `,
        }),
       catchError((error) => of(error))
        )
      .subscribe(() => {
        sessionStorage.setItem('user', "login");
        this.router.navigate(['traduire']);
      });
  } */
  onSubmit() {
    const { username, password } = this.signInForm.value;
    //this.loading = true;

    if (!this.signInForm.valid || !username || !password) {
      return;
    }
    //this.loading = true;
    this.apiService.loginFb(this.email(username), password).pipe(
      tap(saved => {
        //this.loading = false;
        if (saved) {
          console.log('Success method called');
          sessionStorage.setItem('user', "login");
          this.router.navigate(['traduire']);
          this.signInForm.reset();
          console.log("user saved successfully");
          this.toast.success('user saved successfully!!');
        } else {
          console.log('unSuccess method called');
          this.signInForm.reset();
          console.error('Echec de l\'enregistrement');
          this.toast.error('Echec de l\'enregistrement: '+ saved);
        }
      })
      //, catchError((error) => of(error))
    ).subscribe();
  }

  private success() {
    console.log('Success method called');
    sessionStorage.setItem('user', "login");
    this.router.navigate(['traduire']);
    this.signInForm.reset();
    console.log("user saved successfully");
    this.toast.success('user saved successfully!!');
  }

  private noSuccess(saved: any) {
    console.log('unSuccess method called');
    this.signInForm.reset();
    console.error('Echec de l\'enregistrement');
    this.toast.error('Echec de l\'enregistrement: '+ saved);
  }

}




