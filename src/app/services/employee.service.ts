import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../employee/models/employee';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = environment.apiUrl + '/employee';

  constructor(private http: HttpClient) {}

  uploadEmployeeData(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }
}
