import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  events: any[] = [];
  cart:any[]=[];
  totalPrice:number=0;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchEvents();
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







}
