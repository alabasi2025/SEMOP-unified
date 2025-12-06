import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Marker[] = [];

  ngOnInit(): void {
    // Fix for default marker icons in Leaflet with Angular
    this.fixLeafletMarkerIcons();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private fixLeafletMarkerIcons(): void {
    // Fix for Leaflet marker icon paths
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  private initMap(): void {
    // Initialize map centered on Yemen (Sana'a)
    this.map = L.map('map', {
      center: [15.5527, 48.5164], // Yemen coordinates
      zoom: 7,
      zoomControl: true
    });

    // Add OpenStreetMap tile layer (offline tiles will be added later)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add sample marker
    this.addSampleMarker();

    // Add map controls
    this.addMapControls();
  }

  private addSampleMarker(): void {
    const marker = L.marker([15.5527, 48.5164])
      .addTo(this.map)
      .bindPopup('<b>صنعاء</b><br>عاصمة اليمن')
      .openPopup();
    
    this.markers.push(marker);
  }

  private addMapControls(): void {
    // Add scale control
    L.control.scale({
      imperial: false,
      metric: true
    }).addTo(this.map);

    // Add custom controls for drawing, measurements, etc. (to be implemented)
  }

  // Method to add a new marker
  addMarker(lat: number, lng: number, title: string, description: string): void {
    const marker = L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(`<b>${title}</b><br>${description}`);
    
    this.markers.push(marker);
  }

  // Method to clear all markers
  clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  // Method to fly to a specific location
  flyToLocation(lat: number, lng: number, zoom: number = 13): void {
    this.map.flyTo([lat, lng], zoom, {
      duration: 2
    });
  }
}
