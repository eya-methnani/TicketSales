import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

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



    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(this.s3Url, formData, {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data'
      })
    });
    
  }
}
