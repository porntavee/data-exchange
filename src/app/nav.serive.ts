import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private navIdSource = new BehaviorSubject<string>(null);
  navId$ = this.navIdSource.asObservable();

  setNavId(navId: string): void {
    this.navIdSource.next(navId);
  }
}
