// PHASE-10: Add Organizational Structure Service
// COMPONENT: Frontend
// IMPACT: Medium

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationalStructureService {
  private apiUrl = '/api/organizational-structure';

  constructor(private http: HttpClient) {}

  // Departments
  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departments`);
  }

  getDepartmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/departments/${id}`);
  }

  createDepartment(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/departments`, data);
  }

  updateDepartment(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/departments/${id}`, data);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/departments/${id}`);
  }

  // Employees
  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees`);
  }

  getEmployeeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/${id}`);
  }

  getEmployeesByDepartment(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departments/${departmentId}/employees`);
  }

  createEmployee(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employees`, data);
  }

  updateEmployee(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/employees/${id}`, data);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/employees/${id}`);
  }

  // Positions
  getAllPositions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/positions`);
  }

  createPosition(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/positions`, data);
  }

  updatePosition(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/positions/${id}`, data);
  }

  deletePosition(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/positions/${id}`);
  }

  // Organizational Chart
  getOrganizationalChart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chart`);
  }

  // Statistics
  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
}
