import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { User } from './user';

@Injectable()
export class ScheduletaskService {

    constructor(private http: HttpClient) { }


    gettask() {
        return this.http.get<any>('assets/task.json')
        .toPromise()
        .then(res => <User[]>res.data)
        .then(data => { return data; });
    }

    getScheduletask() {
        return this.http.get<any>('assets/schedule.json')
        .toPromise()
        .then(res => <User[]>res.data)
        .then(data => { return data; });
    }

    createTask(data){
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(data);
        return this.http.post<any>(`${environment.apiUrl}/task/`,body,{'headers':headers})
        .subscribe({
            next: data => {

            },
            error: error => {
                console.error('There was an error!', error);
            }
        });
    }

    editUser(userdata){
        const headers = { 'content-type': 'application/json'}
        const body=JSON.stringify(userdata);
        return this.http.post<any>(`${environment.apiUrl}/alarm/statistics`,body,{'headers':headers})
        .subscribe({
            next: data => {
                
            },
            error: error => {
                console.error('There was an error!', error);
            }
        });
    }

    sendmail(data){
        const headers = { 'content-type': 'application/json'}
        const body=JSON.stringify(data);
        return this.http.post<any>('https://line.linkflow.co.th:8000/send_email',body,{'headers':headers})
        .subscribe({
            next: data => {

            },
            error: error => {
                console.error('There was an error!', error);
            }
        });
    }
}