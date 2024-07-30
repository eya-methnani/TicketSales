import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,throwError} from 'rxjs';
import { environment } from '../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiGatewayEndpointEventCreator}/items`;

  private orderUrl =`${environment.apiGatewayEndpointOrderCreator}/items`;

  private s3Url = `${environment.apiGatewayEndpointEventCreator}/upload-photo`;

  private updateUrl = `${environment.apiGatewayEndpointEventCreator}/events`;


  constructor(private http: HttpClient) {}

  createEvent(event: any): Observable<any> {
    return this.http.post(this.apiUrl, event);
  }

  uploadPhoto(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const payload = {
          fileContent: base64String,
          fileName: file.name,
          contentType: file.type
        };

        this.http.post<any>(`${this.s3Url}`, payload, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }).pipe(
          map(response => response.photoUrl),
          catchError(error => {
            console.error('Error uploading photo', error);
            return throwError(error);
          })
        ).subscribe(
          (photoUrl) => {
            observer.next(photoUrl);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      };

      reader.onerror = (error) => {
        observer.error(error);
      };
    });
  }



  getEvents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error fetching events', error);
        return throwError(error);
      })
    );
  }



  updateEventCapacities(cart: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update`, cart);
  }




  createOrder(order: any): Observable<any> {
    return this.http.post<any>(this.orderUrl, order, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }


  getOrdersByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.orderUrl}?email=${email}`);
  }
  

  
  generateTicket(order: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiUrlTicket = 'https://vshyvhd7g8.execute-api.us-east-1.amazonaws.com/generate-pdf'; // Replace with your actual URL
    return this.http.post<any>(apiUrlTicket, JSON.stringify(order), { headers });
  }
  


  getEventsByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events-by-email?email=${email}`).pipe(
      catchError(error => {
        console.error('Error fetching events', error);
        return throwError(error);
      })
    );
  }




  getOrdersByEventId(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.orderUrl}/events?eventId=${eventId}`).pipe(
      catchError(error => {
        console.error('Error fetching orders by event ID', error);
        return throwError(error);
      })
    );
}


updateEvent(event: any): Observable<any> {
  return this.http.put<any>(`${this.updateUrl}`, event, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }).pipe(
    catchError(error => {
      console.error('Error updating event', error);
      return throwError(error);
    })
  );
}


deleteEvent(eventId: string): Observable<any> {
  return this.http.delete<any>(`${this.updateUrl}`, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    body: { id: eventId }
  }).pipe(
    catchError(error => {
      console.error('Error deleting event', error);
      return throwError(error);
    })
  );
}



}
