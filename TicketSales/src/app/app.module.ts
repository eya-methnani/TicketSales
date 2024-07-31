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


import { OrdersComponent } from './orders/orders.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MyEventsComponent } from './my-events/my-events.component';  // Import HttpClientModule
import { EventService } from './event.service';
import { SharedService } from './shared.service';
import { CognitoServiceService } from './cognito-service.service';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { EventOrdersComponent } from './event-orders/event-orders.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    //NewPasswordRequireComponent,
    HomeComponent,
    SignupComponent,
    ConfirmSignupComponent,
    OrdersComponent,
    AddEventComponent,
    MyEventsComponent,
    MyOrdersComponent,
    EventOrdersComponent,
    NavbarComponent,
    PaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
    
    
  ],
  providers: [EventService, SharedService,CognitoServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
