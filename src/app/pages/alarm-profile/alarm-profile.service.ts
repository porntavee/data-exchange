import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { from, of } from 'rxjs';
import { BehaviorSubject } from "rxjs";
@Injectable()
export class AlarmProfileService {
    private messageSource = new BehaviorSubject(undefined);
    currentMessage = this.messageSource.asObservable();
    constructor(private http: HttpClient) {

    }
    getAllAlarm() {
        return this.http.get<any>(`${environment.apiUrl}/alarm_profile/all`)
    }

    editAlarm(id,data){
        const headers = { "content-type": "application/json" };
        const body = JSON.stringify(data);
        return this.http
        .put<any>(environment.apiUrl + "/alarm_profile/" + id, body, {
            headers: headers
        })
       
    }
    valueSource(item){
        this.messageSource.next(item)
    }

}