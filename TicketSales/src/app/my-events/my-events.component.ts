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
  loadingDeleteId: string | null = null; // For the delete button loader
  editingEventId: string | null = null; // To track which event is being edited
  editEventForm: any = {}; // To store the form data
  loadingsave =false;


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



  editEvent(event: any) {
    this.editingEventId = event.id;
    this.editEventForm = { ...event }; // Clone the event data for the form
  }

  cancelEdit() {
    this.editingEventId = null;
    this.editEventForm = {};
  }

  updateEvent() {
    this.loadingsave=true
    this.eventService.updateEvent(this.editEventForm).subscribe(response => {
      console.log('Event updated successfully', response);
      this.fetchEvents(); // Refresh events list
      this.cancelEdit(); // Hide the form
      this.loadingsave=false;
    }, error => {
      console.error('Error updating event', error);
    });
  }


  deleteEvent(eventId: string) {
    this.loadingDeleteId = eventId;
    this.eventService.deleteEvent(eventId).subscribe(response => {
      console.log('Event deleted successfully', response);
      this.fetchEvents(); // Refresh events list
      this.loadingDeleteId = null;
    }, error => {
      console.error('Error deleting event', error);
      this.loadingDeleteId = null;
    });
  }



}