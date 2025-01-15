import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { NavigationExtras, Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  cart:any[]=[];
  totalPrice=0;
  userEmail='';
  searchText = '';
  filterDate = '';
  sortCriteria = '';

  constructor(private eventService: EventService, private router:Router, private sharedService :SharedService ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.userEmail = localStorage.getItem('userEmail') || '';
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe((response: any) => {
      this.events = response.Items;
      this.filteredEvents = this.events;
      this.sortEvents(); // Ensure events are sorted on fetch
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
  /*  const order = {
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



    */


    const navigationExtras: NavigationExtras = {
      state: {
        totalPrice: this.totalPrice,
        userEmail: this.userEmail,
        cart: this.cart
      }
    };
    this.router.navigate(['/payment'], navigationExtras);
  
  }






  resetFilters() {
    this.searchText = '';
    this.filterDate = '';
    this.filterEvents();
  }

  filterEvents() {
    this.filteredEvents = this.events.filter(event => {
      return (
        (!this.searchText || event.name.toLowerCase().includes(this.searchText.toLowerCase())) &&
        (!this.filterDate || event.date === this.filterDate)
      );
    });
    this.sortEvents(); // Sort the filtered events
  }

  sortEvents() {
    if (this.sortCriteria === 'date') {
      this.filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (this.sortCriteria === 'price') {
      this.filteredEvents.sort((a, b) => a.price - b.price);
    } else if (this.sortCriteria === 'capacity') {
      this.filteredEvents.sort((a, b) => a.capacity - b.capacity);
    }
  }
}