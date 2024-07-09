import { Component } from '@angular/core';
import { CognitoServiceService } from "../cognito-service.service";

@Component({
  selector: 'app-home',
  //standalone: true,
  //imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private authservice: CognitoServiceService
  ) {}

  logOut() {
    this.authservice.logOut();
  }

}
