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
    this.eventService.generateTicket(order).subscribe(
      (response: any) => {
        if (response.url) {
          window.open(response.url, '_blank');
        } else {
          console.error('Error generating ticket:', response);
        }
      },
      (error) => {
        console.error('Error generating ticket:', error);
      }
    );
  }

  

}
