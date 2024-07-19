import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-orders',
  templateUrl: './event-orders.component.html',
  styleUrl: './event-orders.component.css'
})
export class EventOrdersComponent implements OnInit {
  orders: any[] = [];
  eventId: string = '';
  totalEarned: number = 0;
  loadingfetch: boolean = false;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId') || '';
    console.log(this.eventId);
    this.fetchOrdersByEventId();
  }

  fetchOrdersByEventId() {
    this.loadingfetch = true;
    this.eventService.getOrdersByEventId(this.eventId).subscribe((response: any) => {
      this.orders = response.Items;
      this.calculateTotalEarned();
      this.loadingfetch = false;
    }, error => {
      console.error('Error fetching orders by event ID', error);
      this.loadingfetch = false;
    });
  }


  calculateTotalEarned() {
    this.totalEarned = this.orders.reduce((total, order) => total + (order.price * order.quantity), 0);
  }


}
