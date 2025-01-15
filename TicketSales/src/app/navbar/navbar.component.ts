import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { CognitoServiceService } from '../cognito-service.service';

import { createPopper } from '@popperjs/core';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userRole = '';
  userEmail = '';

  constructor(
    private authService: CognitoServiceService,
    private sharedService:SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userRole = localStorage.getItem('userRole') || '';

    console.log(`NavbarComponent - userRole: ${this.userRole}, userEmail: ${this.userEmail}`);
  }
    

    
  



  
}

  
