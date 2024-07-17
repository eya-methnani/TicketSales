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

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId') || '';
    console.log(this.eventId);
    this.fetchOrdersByEventId();
  }

  fetchOrdersByEventId() {
    this.eventService.getOrdersByEventId(this.eventId).subscribe((response: any) => {
      this.orders = response.Items;
    }, error => {
      console.error('Error fetching orders by event ID', error);
    });
  }
}
