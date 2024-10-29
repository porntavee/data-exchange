import { HttpClient, HttpErrorResponse, HttpParams,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { log_list,log_page } from '@app/pages/log/log.component';
import { data } from 'jquery';


@Injectable({
  providedIn: 'root'
})
export class LogService {
  loadalram_interval: any;
  token: string;


  constructor(private http: HttpClient) { }

 
  getSchedulelog(UserID: string, Username: string,Role: string,API: string,accessed_at: any,page: string,size: string) {
    const headers = { 'content-type': 'application/json'}  
    let params = new HttpParams();
    if(UserID && UserID!=""){
      params = params.append('user_id', UserID);
  }
  if(Username && Username!=""){
    params = params.append('username', Username);
}
if(Role && Role!=""){
  params = params.append('role', Role);
}
if(API && API!=""){
  params = params.append('api', API);
}
if(accessed_at && accessed_at!=""){
  params = params.append('accessed_at', accessed_at);
}
  if(page && page!=""){
      params = params.append('page', page);
  }
  if(size && size!=""){
    params = params.append('size', size);
}
    return this.http.get<any>(environment.apiUrl+'/system/api_log',{'headers':headers,params:params});
}

  getLogData(){
    return this.http.get<any>(`${environment.apiUrl}/system/access_log`);
  }

  getVlantable(res_id){
    return this.http.get<any>(`${environment.apiUrl}/device/vlan_by_res_id?res_id=${res_id}`);
  }
  request(res) {
    let params = new HttpParams().set("user_id", res);
    return this.http.get(`${environment.apiUrl}/system/api_log`, {params});
  
}

}
  //  .toPromise()
  //  .then(res => this.alarm_data = res)
  //  .then(data => { return data; });
  // private dataUrl = 'https://demo-live-data.highcharts.com/aapl-historical.json';

  // fetchData(): Observable<Object> {
  //   return this.http.get(this.dataUrl)
  //     .pipe(catchError(this.errorHandler));
  // }

  // fetchSqlData(min: number, max: number): Observable<Object> {
  //   return this.http.get(`${this.dataUrl}?start=${Math.round(min)}&end=${Math.round(max)}`)
  //     .pipe(catchError(this.errorHandler));
  // }

  // errorHandler(error: HttpErrorResponse) {
  //   return throwError(error.message || "server error.");
  // }

