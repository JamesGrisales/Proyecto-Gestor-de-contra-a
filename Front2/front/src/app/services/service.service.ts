import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:5000/api/passwords'; // URL del backend

  constructor(private http: HttpClient) {}

  getAllPasswords(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPasswordById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createPassword(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
