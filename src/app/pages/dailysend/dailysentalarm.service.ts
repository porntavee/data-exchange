import { HttpClient, HttpErrorResponse ,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { daily } from '@app/pages/dailysend/dailysend.component';
import { environment } from 'environments/environment';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class dailysentalarmservice {

  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  constructor(private http: HttpClient) { }

  // getdailyDevice() {
  //   const headers = { 'content-type': 'application/json' }
  //   return this.http.get<any>(environment.apiUrl + '/line/sent_alarm', { 'headers': headers })
  //   // .toPromise()
  //   // .then(res => <daily[]>res)
  //   // .then(data => {
  //   //     return data; 
  //   // });
  // }
  valueSource(item){
    this.messageSource.next(item)
  }
  getdailyDevice(startdate: string,enddate: string, keyword: string, page: string, size: string) {
    const headers = { 'content-type': 'application/json' }
    let params = new HttpParams();
    if (startdate && startdate != "") {
      params = params.append('start_date', startdate);
    }
    if (enddate && enddate != "") {
      params = params.append('end_date', enddate);
    }
    if (keyword && keyword != "") {
      params = params.append('keyword', keyword);
    }
    if (page && page != "") {
      params = params.append('page', page);
    }
    if (size && size != "") {
      params = params.append('size', size);
    }
    return this.http.get<any>(environment.apiUrl + '/line/sent_alarm', { 'headers': headers, params: params });
  }

}
