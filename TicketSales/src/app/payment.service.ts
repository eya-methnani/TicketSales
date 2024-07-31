import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number) {
    return this.http.post(`${environment.apiBaseUrl}/create-payment-intent`, { amount });
  }
}
