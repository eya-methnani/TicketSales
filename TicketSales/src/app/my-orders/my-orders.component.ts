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
  filteredOrders: any[] = [];
  userEmail: string = '';
  loading:any | null=null;
  loadingfetch: boolean = false;
  searchText: string = '';
  filterDate: string = '';
  sortCriteria: string = '';



  constructor(private eventService: EventService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.fetchOrders();
   
  }

  fetchOrders() {
    this.loadingfetch=true;
    this.eventService.getOrdersByEmail(this.userEmail).subscribe((response: any) => {
      this.orders = response.Items;
      this.filteredOrders=this.orders;
      this.loadingfetch=false;
      this.sortOrders(); // Ensure orders are sorted on fetch
    }, error => {
      console.error('Error fetching orders', error);
      this.loading=false;
    });
  }


  generateTicket(order: any) {
    this.loading = order;
    this.eventService.generateTicket(order).subscribe(
      (response: any) => {
        if (response.url) {
          window.open(response.url, '_blank');
          this.loading = null;
        } else {
          console.error('Error generating ticket:', response);
        }
      },
      (error) => {
        console.error('Error generating ticket:', error);
        this.loading = null;

      }
    );
  }

  resetFilters() {
    this.searchText = '';
    this.filterDate = '';
    this.filterOrders();
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      return (
        (!this.searchText || order.eventName.toLowerCase().includes(this.searchText.toLowerCase())) &&
        (!this.filterDate || order.eventDate === this.filterDate)
      );
    });
  }


  sortOrders() {
    if (this.sortCriteria === 'date') {
      this.filteredOrders.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    } else if (this.sortCriteria === 'price') {
      this.filteredOrders.sort((a, b) => a.price - b.price);
    } else if (this.sortCriteria === 'quantity') {
      this.filteredOrders.sort((a, b) => a.quantity - b.quantity);
    }
  }
  

  

}
