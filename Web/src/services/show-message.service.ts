import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ShowMessageService {
  constructor(private messageService: MessageService) {}

  success(summary: string, message: string) {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: message,
    });
  }

  error(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
