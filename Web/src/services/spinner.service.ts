import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  show: Subject<boolean>;

  constructor() {
    this.show = new Subject();
  }

  showSpinner() {
    this.show.next(true);
  }

  hideSpinner() {
    this.show.next(false);
  }
}
