import { HttpClient, HttpErrorResponse, HttpParams,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {
    BehaviorSubject,
    from,
    interval,
    Observable,
    of,
    Subject,
    Subscription
  } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AdminLayoutService {
    private messageSource = new BehaviorSubject(this.router.url);
    currentMessage = this.messageSource.asObservable();
    private sidebarSource = new BehaviorSubject("Defult");
    currentsidebarMessage = this.sidebarSource.asObservable();
    private sidebarminiSource = new BehaviorSubject("Defult");
    currentsidebarminiMessage = this.sidebarminiSource.asObservable();
    private sidebarminiSSource = new BehaviorSubject("Defult");
    currentsidebarminiSMessage = this.sidebarminiSSource.asObservable();
    private mainpanelSource = new BehaviorSubject("Defult");
    currentmainpanelMessage = this.mainpanelSource.asObservable();
    private mainpanelcloseSource = new BehaviorSubject("Defult");
    currentmainpanelcloseMessage = this.mainpanelcloseSource.asObservable();
    private mainpanelSSource = new BehaviorSubject("Defult");
    mainpanelSSourceMessage = this.mainpanelSSource.asObservable();
    private sideiconSSource = new BehaviorSubject("Defult");
    sideiconMessage = this.sideiconSSource.asObservable();
  constructor(private router: Router,private http: HttpClient) { }

  addOrderBox(item){
    this.messageSource.next(item)
    // this.orderBox.push(item)
  }

  sidebarClass(item){
    this.sidebarSource.next(item)
  }
  sideiconClass(item){
    this.sideiconSSource.next(item)
  }
  sidebarminiClass(item){
    this.sidebarminiSource.next(item)
  }
  sidebarminiSClass(item){
    this.sidebarminiSSource.next(item)
  }
  mainpanelCloseClass(item){
    this.mainpanelcloseSource.next(item)
  }
  mainpanelClass(item){
    this.mainpanelSource.next(item)
  }
  mainpanelSSourceclass(item){
    this.mainpanelSSource.next(item)
  }
}
 
