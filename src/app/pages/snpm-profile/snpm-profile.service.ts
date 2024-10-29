import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { from, of } from 'rxjs';
import { BehaviorSubject } from "rxjs";
@Injectable()
export class SnpmProfileService {
    private messageSource = new BehaviorSubject(undefined);
    currentMessage = this.messageSource.asObservable();
    constructor(private http: HttpClient) {

    }
    getAllSNMP() {
        return this.http.get<any>(`${environment.apiUrl}/snmp_profile/all`)
    }
    createSNMP(name,snmp_config) {
        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify({
            "name": name,
            "snmp_config": snmp_config
        })
        return this.http.post<any>(environment.apiUrl + '/snmp_profile/new', body, { 'headers': headers });
    }
    editSNMP(id,data){
        const headers = { "content-type": "application/json" };
        const body = JSON.stringify(data);
        return this.http
        .put<any>(environment.apiUrl + "/snmp_profile/" + id, body, {
            headers: headers
        })
       
    }
    valueSource(item){
        this.messageSource.next(item)
    }
    deleteSNMP(id) {
        return this.http.delete<any>(`${environment.apiUrl}/snmp_profile/${id}`)
      }
}