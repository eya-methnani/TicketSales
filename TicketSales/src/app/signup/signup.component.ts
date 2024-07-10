import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoServiceService } from '../cognito-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  familyName: string = '';
  birthdate: string = '';
  gender: string = 'option1'; // default gender
  phoneNumber: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  role:string='';
  

  constructor(private cognitoService: CognitoServiceService, private router: Router) { }

  onSignUp(form: NgForm) {
    if (form.valid) {
      this.cognitoService.signUp(this.email, this.password, this.name, this.familyName, this.birthdate,this.role)
        .then(() => {
          this.errorMessage = '';
          this.successMessage = 'Registration successful! Redirecting to confirmation page...';
          setTimeout(() => {
            this.router.navigate(['/confirm-signup']);
          }, 2000); // Redirect after 2 seconds
        })
        .catch((error) => {
          this.successMessage = '';
          this.errorMessage = error.message || 'An unknown error occurred';
        });
    }
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
