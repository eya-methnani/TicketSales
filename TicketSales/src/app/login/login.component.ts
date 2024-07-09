import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoServiceService } from '../cognito-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailaddress: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authservice: CognitoServiceService, private router: Router) { }

  onSignIn(form: NgForm) {
    if (form.valid) {
      this.authservice.login(this.emailaddress, this.password)
        .then(() => {
          this.errorMessage = '';
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          this.errorMessage = error.message || 'An unknown error occurred';
        });
    }
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }
}
