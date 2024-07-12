import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from "./home/home.component";
import { LoginComponent } from './login/login.component';
//import { NewPasswordRequireComponent } from './new-password-require/new-password-require.component'
import { SignupComponent } from './signup/signup.component';
import { ConfirmSignupComponent } from './confirm-signup/confirm-signup.component';
import { OrdersComponent } from './orders/orders.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'home',component: HomeComponent},
  //{ path: 'newPasswordRequire', component: NewPasswordRequireComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'confirm-signup', component: ConfirmSignupComponent },
  //{ path: '', component: LoginComponent},
  { path: '', redirectTo:'/login', pathMatch:'full' },

  { path: 'orders', component: OrdersComponent },
  { path: 'add-event', component: AddEventComponent },
  { path: 'my-events', component: MyEventsComponent },
  { path: 'my-orders', component: MyOrdersComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
