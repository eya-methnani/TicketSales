import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  event = {
    name: '',
    description: '',
    photo: '',
    date: '',
    price: 0,
    capacity: 0,
    email: ''
  };

  selectedFile: File | null = null;

  constructor(private eventService: EventService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.currentEmail.subscribe(email => {
      this.event.email = email;
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.selectedFile) {
      this.eventService.uploadPhoto(this.selectedFile).subscribe(photoUrl => {
        this.event.photo = photoUrl;
        this.createEvent();
      }, error => {
        console.error('Error uploading photo', error);
      });
    } else {
      this.createEvent();
    }
  }

  createEvent() {
    this.eventService.createEvent(this.event).subscribe(response => {
      console.log('Event created successfully', response);
      // Optionally reset the form or navigate to another page
    }, error => {
      console.error('Error creating event', error);
    });
  }
}
