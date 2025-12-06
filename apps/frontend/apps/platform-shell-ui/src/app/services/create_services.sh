#!/bin/bash

# Function to create service
create_service() {
  NAME=$1
  ENDPOINT=$2
  
  cat > ${NAME}.service.ts << SERV
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ${NAME^}Service {
  private apiUrl = '/api/${ENDPOINT}';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(\`\${this.apiUrl}/\${id}\`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.patch<any>(\`\${this.apiUrl}/\${id}\`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(\`\${this.apiUrl}/\${id}\`);
  }
}
SERV
}

# Create all services
create_service "roles" "roles"
create_service "permissions" "permissions"
create_service "holdings" "holdings"
create_service "units" "units"
create_service "projects" "projects"
create_service "customers" "customers"
create_service "suppliers" "suppliers"
create_service "items" "items"

echo "All services created"
