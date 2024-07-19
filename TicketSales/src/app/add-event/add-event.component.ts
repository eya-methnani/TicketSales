import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

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
  loading: boolean = false;


  selectedFile: File | null = null;

  constructor(private eventService: EventService, private sharedService: SharedService , private router: Router) {}

  ngOnInit(): void {
    this.event.email = localStorage.getItem('userEmail') || '';

    console.log(this.event.email);
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onSubmit() {
    
    if (this.selectedFile) {
      this.loading=true;
      this.eventService.uploadPhoto(this.selectedFile).subscribe(photoUrl => {
        this.event.photo = photoUrl;
        console.log(this.event.photo)
        this.createEvent();
        this.loading=false;
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
      this.router.navigate(['/home']);
      
      // Optionally reset the form or navigate to another page
    }, error => {
      console.error('Error creating event', error);
    });
  }
}
