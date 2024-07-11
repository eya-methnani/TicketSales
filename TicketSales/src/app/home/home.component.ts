import { Component, OnInit } from '@angular/core';
import { CognitoServiceService } from "../cognito-service.service";

@Component({
  selector: 'app-home',
  //standalone: true,
  //imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userEmail: string = '';
  userRole: string = '';


  
  constructor(
    private authservice: CognitoServiceService
  ) {}




  ngOnInit(): void {
    this.userEmail = this.authservice.username;
    this.authservice.userRole.subscribe(role => {
      this.userRole = role;
    });
  }

  logOut() {
    this.authservice.logOut();
  }

}
