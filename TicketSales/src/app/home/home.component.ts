import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoServiceService } from "../cognito-service.service";
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userEmail: string = '';
  userRole: string = '';

  constructor(
    private authService: CognitoServiceService,
    private sharedService:SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userRole = localStorage.getItem('userRole') || '';
  
  }

 

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
