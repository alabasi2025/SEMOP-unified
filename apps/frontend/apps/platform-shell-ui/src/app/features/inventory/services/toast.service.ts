import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  success(message: string): void {
    console.log(`[SUCCESS] ${message}`);
    // TODO: Integrate with actual toast library (e.g., PrimeNG Toast)
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
    // TODO: Integrate with actual toast library
  }

  warning(message: string): void {
    console.warn(`[WARNING] ${message}`);
    // TODO: Integrate with actual toast library
  }

  info(message: string): void {
    console.info(`[INFO] ${message}`);
    // TODO: Integrate with actual toast library
  }

  showError(message: string): void {
    this.error(message);
  }

  showSuccess(message: string): void {
    this.success(message);
  }

  showWarning(message: string): void {
    this.warning(message);
  }

  showInfo(message: string): void {
    this.info(message);
  }

  show(severity: 'success' | 'error' | 'warning' | 'info', summary: string, detail?: string): void {
    const message = detail ? `${summary}: ${detail}` : summary;
    
    switch (severity) {
      case 'success':
        this.success(message);
        break;
      case 'error':
        this.error(message);
        break;
      case 'warning':
        this.warning(message);
        break;
      case 'info':
        this.info(message);
        break;
    }
  }
}
