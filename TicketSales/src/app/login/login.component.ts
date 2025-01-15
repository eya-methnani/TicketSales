import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoServiceService } from '../cognito-service.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailaddress = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private authservice: CognitoServiceService, private router: Router ) { }


  ngOnInit(): void {
    // Clear the local storage when the component initializes
    localStorage.clear();
  }

  async onSignIn(form: NgForm) {
    if (form.valid) {
      this.loading = true;
      this.authservice.login(this.emailaddress, this.password)
        .then(() => {
          // Trigger navbar reload
          this.errorMessage = '';
          this.router.navigate(['/home']);
          
        })
        .catch((error) => {
          this.errorMessage = error.message || 'An unknown error occurred';
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }
}
