import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
//import { JwtHelperService } from '@auth0/angular-jwt';
import { retry, catchError } from "rxjs/operators";
import { User } from "@app/user";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { UserAuth } from "@app/userAuth";
import { BehaviorSubject, from, Observable, throwError } from "rxjs";
import { ReturnStatement } from "@angular/compiler";

@Injectable({
  providedIn: "root"
})
export class ThroughputService {
  local_device: string = "";
  remote_device: string;

  constructor(private router: Router, private http: HttpClient) {}

  setLocalDevice(device: any) {
    this.local_device = device;
  }

  setRemoteDevice(device: any) {
    this.remote_device = device;
  }

  getLocalDevice() {
    return "re";
  }

  getRemoteDevice() {
    return this.remote_device;
  }

  issetLocalDevice() {
    if (typeof this.local_device != "undefined" && this.local_device) {
      return true;
    } else {
      return false;
    }
  }

  issetRemoteDevice() {
    if (typeof this.remote_device != "undefined" && this.remote_device) {
      return true;
    } else {
      return false;
    }
  }

  clearDevice() {
    this.local_device = null;
    this.remote_device = null;
  }

  testthroughput() {}

  testCFM() {}
}
