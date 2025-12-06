import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sector {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  isActive: boolean;
}

export interface GeneFeature {
  id: string;
  featureType: 'UI_FIELD' | 'PAGE' | 'MENU_ITEM' | 'REPORT' | 'VALIDATION' | 'WORKFLOW';
  targetPage?: string;
  featureNameAr: string;
  featureNameEn?: string;
  description?: string;
  isRequired: boolean;
}

export interface Gene {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  category: 'ACCOUNTING' | 'INVENTORY' | 'PURCHASES' | 'SALES' | 'HR' | 'CRM';
  geneType: 'PUBLIC' | 'PRIVATE';
  sectorId?: string;
  sectorName?: string;
  features: GeneFeature[];
  isActive: boolean;
  createdAt: string;
}

export interface GeneActivation {
  id: string;
  geneId: string;
  geneName: string;
  holdingId: string;
  activatedBy: string;
  activatedAt: string;
  config?: any;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GenesService {
  private apiUrl = '/api/genes';

  constructor(private http: HttpClient) {}

  getAll(category?: string, geneType?: string): Observable<Gene[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (category) params.push(`category=${category}`);
    if (geneType) params.push(`geneType=${geneType}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Gene[]>(url);
  }

  getAvailableGenes(holdingId: string): Observable<Gene[]> {
    return this.http.get<Gene[]>(`${this.apiUrl}/available?holdingId=${holdingId}`);
  }

  getActiveGenes(holdingId: string): Observable<GeneActivation[]> {
    return this.http.get<GeneActivation[]>(`${this.apiUrl}/active?holdingId=${holdingId}`);
  }

  getAllSectors(): Observable<Sector[]> {
    return this.http.get<Sector[]>(`${this.apiUrl}/sectors`);
  }

  getById(id: string): Observable<Gene> {
    return this.http.get<Gene>(`${this.apiUrl}/${id}`);
  }

  getGeneById(id: string): Observable<Gene> {
    return this.http.get<Gene>(`${this.apiUrl}/${id}`);
  }

  create(gene: Partial<Gene>): Observable<Gene> {
    return this.http.post<Gene>(this.apiUrl, gene);
  }

  activate(geneId: string, holdingId: string, config?: any): Observable<GeneActivation> {
    return this.http.post<GeneActivation>(`${this.apiUrl}/${geneId}/activate`, {
      holdingId,
      config
    });
  }

  deactivate(geneId: string, holdingId: string): Observable<GeneActivation> {
    return this.http.post<GeneActivation>(`${this.apiUrl}/${geneId}/deactivate`, {
      holdingId
    });
  }

  update(id: string, gene: Partial<Gene>): Observable<Gene> {
    return this.http.patch<Gene>(`${this.apiUrl}/${id}`, gene);
  }

  delete(id: string): Observable<Gene> {
    return this.http.delete<Gene>(`${this.apiUrl}/${id}`);
  }
}
