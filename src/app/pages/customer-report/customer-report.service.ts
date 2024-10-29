import {
    HttpClient,
    HttpErrorResponse,
    HttpParams
  } from "@angular/common/http";
  import { Injectable } from "@angular/core";
  import { daily } from "@app/pages/dailysend/dailysend.component";
  import { environment } from "environments/environment";
  import { Observable, throwError } from "rxjs";
  import { catchError } from "rxjs/operators";
  import { BehaviorSubject } from "rxjs";
  import { of } from "rxjs";
  
  @Injectable({
    providedIn: "root"
  })
  export class CustomerReportservice {
    datalist: any[] = [];
    private messageSource = new BehaviorSubject(undefined);
    currentMessage = this.messageSource.asObservable();
    constructor(private http: HttpClient) {
      this.datalist = [
        {
          circuit_id: "5221113321",
          project_name: "MOF",
          service_name: "C internet (On Net)",
          ip_address: "10.209.6.35",
          inf_name: "gigaethernet0/1",
          speed: "1000/500 MBPS"
        },
        {
          circuit_id: "52266663321",
          project_name: "MOF",
          service_name: "C internet (On Net)",
          ip_address: "10.209.70.15",
          inf_name: "gigaethernet1/1",
          speed: "1000/500 MBPS"
        }
      ];
    }
    deleteRowdata(data) {
      const header = { "content-type": "application/json" };
      const httpOptions = {
        headers: header,
        body: JSON.stringify(data)
      };
      return this.http.delete<any>(
        `${environment.apiUrl}/sed_catid_device/${data.ref_code}`,
        httpOptions
      );
    }
    get_report() {
      return this.http.get<any>(
        `${environment.apiUrl}/report-api/api/report/getreport4`
      );
    }
    get_history(cat_id){
      return this.http.get<any>(`${environment.apiUrl}/sed_catid_history/get_history?cat_id=${cat_id}`);
    }
    export_report() {
      const headers = { "content-type": "application/json" };
      const body = JSON.stringify({
        reportName: "DEVICEREPORTFROM",
        ipAddress: "10.209.6.26",
        if_index: [3],
        start: 1697130000000,
        end: 1697216400000
      });
      return this.http.get<any>(
        `${environment.apiUrl}/customer_report/get_monthly_report`
        // body,
        // { headers: headers }
      );
    }
    getSearchDevice(input) {
      return this.http.get<any>(
        `${environment.apiUrl}/device/search_device?searchInput=${input}`
      );
    }
    getSysInterface(ip_addr) {
      const headers = { "content-type": "application/json" };
      const body = JSON.stringify({
        ip_addr: ip_addr
    });
      return this.http.post<any>(
        `${environment.serviceURL}/getNodeInterface`,
        body,
        { headers: headers }
      );
    }
    createreportData(listData) {
      const headers = { "content-type": "application/json" };
      const body = listData;
  
      return this.http.post<any>(
        `${environment.apiUrl}/sed_catid_device/`,
        body,
        { headers: headers }
      );
    }
    updatereportData(id, listData) {
      const headers = { "content-type": "application/json" };
      const body = JSON.stringify(listData);
      return this.http.put<any>(
        `${environment.apiUrl}/sed_catid_device/${id}`,
        body,
        { headers: headers }
      );
    }
    valueSource(item) {
      this.messageSource.next(item);
    }
    getdataReload(circuit_id) {
      // var list = this.datalist.filter(data => data.ip_address == ip && data.inf_name == port && data.circuit_id == circuit_id)
  
      // return of (list)
      const headers = { "content-type": "application/json" };
      const body = JSON.stringify;
      return this.http.post<any>(
        `${environment.apiUrl}/customer_report/get_catid/${circuit_id}`,
        body,
        { headers: headers }
      );
    }
    searchValue(pages,limits,value) {
      return this.http.get<any>(`${environment.apiUrl}/sed_catid_device?page=${pages}&limit=${limits}&search=${value}`);
    }
    dataGetreport(pages,limits) {
      return this.http.get<any>(`${environment.apiUrl}/sed_catid_device?page=${pages}&limit=${limits}`);
    }
    dataGetreports() {
      return this.http.get<any>(`${environment.apiUrl}/sed_catid_device`);
    }
    dataGetreporthistory(pages,limits) {
      return this.http.get<any>(`${environment.apiUrl}/sed_catid_history?page=${pages}&limit=${limits}`);
    }
    getNode() {
      const headers = { 'accept': 'application/json' }
    //   let params = new HttpParams()
    //   if(limit && limit!=""){
    //     params = params.append('limit', limit);
    // }
      return this.http.get<any>(environment.apiUrl + '/device_management/node_list?limit=0',  {'headers':headers});
    }
  }
  