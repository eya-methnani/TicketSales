import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { CognitoServiceService } from '../cognito-service.service';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userRole: string = '';
  userEmail: string = '';

  constructor(
    private authService: CognitoServiceService,
    private sharedService:SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sharedService.currentEmail.subscribe(email => {
      this.userEmail = email;
    });
    this.authService.userRole.subscribe(role => {
      this.userRole = role;
    });

    console.log(this.userRole)
    
  }

  logOut() {
    // Add your logout logic here
    this.router.navigate(['/login']); // Example of redirecting to login page after logout
  }
}