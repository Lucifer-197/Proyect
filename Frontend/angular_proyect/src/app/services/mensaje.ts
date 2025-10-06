import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private messageSource = new BehaviorSubject<{ texto: string, tipo: 'success' | 'error' } | null>(null);
  currentMessage = this.messageSource.asObservable();

  setMessage(texto: string, tipo: 'success' | 'error' = 'success') {
    this.messageSource.next({ texto, tipo });
  }

  clearMessage() {
    this.messageSource.next(null);
  }
}
