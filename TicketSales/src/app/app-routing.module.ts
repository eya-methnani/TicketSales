import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from "./home/home.component";
import { LoginComponent } from './login/login.component';
//import { NewPasswordRequireComponent } from './new-password-require/new-password-require.component'
import { SignupComponent } from './signup/signup.component';
import { ConfirmSignupComponent } from './confirm-signup/confirm-signup.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'home',component: HomeComponent},
  //{ path: 'newPasswordRequire', component: NewPasswordRequireComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'confirm-signup', component: ConfirmSignupComponent },
  //{ path: '', component: LoginComponent},
  { path: '', redirectTo:'/login', pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
