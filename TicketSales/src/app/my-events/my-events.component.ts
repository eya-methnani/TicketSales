import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit {
  events: any[] = [];
  userEmail: string = '';
  loadingfetch=false;

  constructor(private eventService: EventService, private sharedService: SharedService,private router :Router) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
  
    this.fetchEvents();
  
  }

  fetchEvents() {
    this.loadingfetch=true;
    this.eventService.getEventsByEmail(this.userEmail).subscribe((response: any) => {
      this.events = response.Items;
      this.loadingfetch=false;
    }, error => {
      console.error('Error fetching events', error);
    });
  }


  viewOrders(eventId: string) {
    console.log(eventId)
    this.router.navigate(['/event-orders', eventId]);
  }



}