import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
//import { NewPasswordRequireComponent } from './new-password-require/new-password-require.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmSignupComponent } from './confirm-signup/confirm-signup.component';


import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    //NewPasswordRequireComponent,
    HomeComponent,
    SignupComponent,
    ConfirmSignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
