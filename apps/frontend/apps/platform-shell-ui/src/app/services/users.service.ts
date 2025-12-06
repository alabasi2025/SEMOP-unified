/**
 * PHASE-3.1.0: Complete Frontend Fixes
 * COMPONENT: Users Service
 * IMPACT: Critical
 * 
 * Changes:
 * - Updated imports to use @semop/contracts
 * - Removed local models
 * - Fixed DTO names
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDto, CreateUserDto, UpdateUserDto } from '@semop/contracts';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.apiUrl}/${id}`);
  }

  create(user: CreateUserDto): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(this.apiUrl, user);
  }

  update(id: string, user: UpdateUserDto): Observable<UserResponseDto> {
    return this.http.patch<UserResponseDto>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
