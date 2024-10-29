import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { data } from 'jquery';
import { webSocketRespone } from '@app/pages/remote-command/remote-command.component';

import { from, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RemoteService {

  Command_result: webSocketRespone[];
  constructor(private http: HttpClient) {
    this.Command_result = [
      {
        "message": "Pending ...",
        "prompt_header": "Start> "
      },
      {
        "message": "Success",
        "prompt_header": "Start1> "
      },
    ]
  }

  
  loaddata() {
    return of(this.Command_result)
  }
  
}


