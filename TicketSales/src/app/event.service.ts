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


  private s3Url = `${environment.apiGatewayEndpointEventCreator}/upload-photo`;

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


}
