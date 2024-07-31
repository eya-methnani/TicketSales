import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { PaymentService } from '../payment.service';
import { environment } from '../../environments/environment';
import { Router, NavigationExtras } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  stripePromise = loadStripe(environment.stripePublicKey);
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  clientSecret: string | undefined;
  totalAmount: number = 0;
  userEmail: string = '';
  cart: any[] = [];
  totalPrice: number = 0;
  loading: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private eventService: EventService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.totalPrice = navigation.extras.state['totalPrice'] || 0;
      this.userEmail = navigation.extras.state['userEmail'] || '';
      this.cart = navigation.extras.state['cart'] || [];
    }
  }

  async ngOnInit() {
    this.stripe = await this.stripePromise;
    if (this.stripe) {
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount('#card-element');
    }
  }

  async handlePayment() {
    this.loading = true;
    if (!this.stripe || !this.card) {
      console.error('Stripe has not been properly initialized.');
      this.loading = false;
      return;
    }

    this.paymentService.createPaymentIntent(this.totalPrice * 100).subscribe(async (response: any) => {
      this.clientSecret = response.client_secret;
      if (!this.clientSecret) {
        console.error('Failed to create payment intent.');
        this.loading = false;
        return;
      }

      const { error, paymentIntent } = await this.stripe!.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card!,
          billing_details: {
            name: this.userEmail,
          },
        },
      });

      if (error) {
        console.error(error.message);
        this.loading = false;
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful!');
        this.createOrderAndUpdateCapacities();
      }
    });
  }

  createOrderAndUpdateCapacities() {
    const order = {
      email: this.userEmail,
      cart: this.cart
    };

    this.eventService.createOrder(order).subscribe(response => {
      console.log('Order created successfully', response);
      this.updateEventCapacities(); // Update capacities after order creation
    }, error => {
      console.error('Error creating order', error);
      this.loading = false;
    });
  }

  updateEventCapacities() {
    this.eventService.updateEventCapacities(this.cart).subscribe(response => {
      console.log('Event capacities updated successfully', response);
      this.cart = []; // Clear cart only after capacities are updated
      this.totalPrice = 0;
      this.router.navigate(['/my-orders'], { state: { cart: this.cart } });
      this.loading = false;
    }, error => {
      console.error('Error updating event capacities', error);
      this.loading = false;
    });
  }

  cancelPayment() {
    this.loading = true;
    this.router.navigate(['/orders']); // Navigate to events page or any other desired page
    this.loading = false;
  }
}
