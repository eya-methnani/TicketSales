import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();

  private roleSource = new BehaviorSubject<string>('');
  currentRole = this.roleSource.asObservable();



  constructor() {}

  changeEmail(email: string) {
    this.emailSource.next(email);
  }




  changeRole(role: string) {
    this.roleSource.next(role);
  }



}
