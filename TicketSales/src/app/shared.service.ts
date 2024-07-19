import { Injectable } from '@angular/core';
import { BehaviorSubject,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private emailSource = new BehaviorSubject<string>(localStorage.getItem('userEmail') || '');
  currentEmail = this.emailSource.asObservable();

  private roleSource = new BehaviorSubject<string>(localStorage.getItem('userRole') || '');
  currentRole = this.roleSource.asObservable();


  private reloadNavbarSubject = new Subject<void>();
  reloadNavbar$ = this.reloadNavbarSubject.asObservable();


  


  constructor() {}

  changeEmail(email: string) {
    localStorage.setItem('userEmail', email);
    this.emailSource.next(email);
  }

  changeRole(role: string) {
    localStorage.setItem('userRole', role);
    this.roleSource.next(role);
  }

  

}
