import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoServiceService } from '../cognito-service.service';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.css']
})
export class ConfirmSignupComponent {
  email: string = '';
  confirmationCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private cognitoService: CognitoServiceService, private router: Router) { }

  onConfirm(form: NgForm) {
    if (form.valid) {
      this.cognitoService.confirmUser(this.email, this.confirmationCode)
        .then(() => {
          this.errorMessage = '';
          this.successMessage = 'Confirmation successful! Redirecting to login page...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); // Redirect after 2 seconds
        })
        .catch((error) => {
          this.successMessage = '';
          this.errorMessage = error.message || 'An unknown error occurred';
        });
    }
  }
}
