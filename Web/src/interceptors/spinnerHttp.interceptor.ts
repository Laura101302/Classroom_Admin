import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from 'src/services/spinner.service';

@Injectable()
export class SpinnerHttpInterceptor implements HttpInterceptor {
  private countRequest = 0;
  constructor(public spinnerService: SpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.countRequest) {
      setTimeout(() => {
        this.spinnerService.showSpinner();
      }, 0);
    }
    this.countRequest++;
    return next.handle(request).pipe(
      finalize(() => {
        this.countRequest--;
        if (!this.countRequest) {
          setTimeout(() => {
            this.spinnerService.hideSpinner();
          }, 250);
        }
      })
    );
  }
}
