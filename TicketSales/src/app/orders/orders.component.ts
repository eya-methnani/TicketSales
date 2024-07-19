import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  events: any[] = [];
  cart:any[]=[];
  totalPrice:number=0;
  userEmail:string='';

  constructor(private eventService: EventService, private router:Router, private sharedService :SharedService ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.userEmail = localStorage.getItem('userEmail') || '';
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe((response: any) => {
      this.events = response.Items;
    }, error => {
      console.error('Error fetching events', error);
    });
  }





  addToCart(event: any) {
    const eventInCart = this.cart.find(item => item.id === event.id);
    if (eventInCart) {
      eventInCart.quantity += 1;
    } else {
      this.cart.push({ ...event, quantity: 1 });
    }
    this.totalPrice += event.price;
    event.capacity -= 1;
  }

  removeFromCart(index: number) {
    const event = this.cart[index];
    if (event.quantity > 1) {
      event.quantity -= 1;
    } else {
      this.cart.splice(index, 1);
    }
    this.totalPrice -= event.price;
    const originalEvent = this.events.find(e => e.id === event.id);
    if (originalEvent) {
      originalEvent.capacity += 1;
    }
  }



  checkout() {
    const order = {
      email: this.userEmail,
      cart: this.cart
    };

    this.eventService.createOrder(order).subscribe(response => {
      console.log('Order created successfully', response);
      this.cart = [];
      this.totalPrice = 0;
    }, error => {
      console.error('Error creating order', error);
    });


    
    this.eventService.updateEventCapacities(this.cart).subscribe(response => {
      console.log('Event capacities updated successfully', response);
      this.router.navigate(['/my-orders'], { state: { cart: this.cart } });
    }, error => {
      console.error('Error updating event capacities', error);
    });
  }






}
