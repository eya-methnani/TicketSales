import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  userEmail: string = '';

  constructor(private eventService: EventService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.currentEmail.subscribe(email => {
      this.userEmail = email;
      this.fetchOrders();
    });
  }

  fetchOrders() {
    this.eventService.getOrdersByEmail(this.userEmail).subscribe((response: any) => {
      this.orders = response.Items;
    }, error => {
      console.error('Error fetching orders', error);
    });
  }


  generateTicket(order: any) {
    this.eventService.generateTicket({
      orderId: order.orderId,
      eventName: order.eventName,
      eventDate: order.eventDate,
      price: order.price,
      quantity: order.quantity,
      contact: order.contact
    }).subscribe((response: any) => {
      const url = response.url;
      this.openInNewTab(url);
    }, error => {
      console.error('Error generating ticket', error);
    });
  }

  openInNewTab(url: string) {
    window.open(url, '_blank');
  }

  

}
