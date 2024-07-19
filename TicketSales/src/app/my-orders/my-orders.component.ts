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
  loading: boolean = false;
  loadingfetch: boolean = false;


  constructor(private eventService: EventService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.fetchOrders();
   
  }

  fetchOrders() {
    this.loadingfetch=true;
    this.eventService.getOrdersByEmail(this.userEmail).subscribe((response: any) => {
      this.orders = response.Items;
      this.loadingfetch=false;
    }, error => {
      console.error('Error fetching orders', error);
    });
  }


  generateTicket(order: any) {
    this.loading = true;
    this.eventService.generateTicket(order).subscribe(
      (response: any) => {
        if (response.url) {
          window.open(response.url, '_blank');
          this.loading = false;
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
