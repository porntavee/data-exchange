import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
//import { JwtHelperService } from '@auth0/angular-jwt';
import { retry, catchError } from "rxjs/operators";
import { User } from "./user";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { UserAuth } from "@app/userAuth";
import { BehaviorSubject, from, Observable, throwError, of } from "rxjs";

interface oldPass {
  oldPass?: string;
}
@Injectable({
  providedIn: "root"
})
export class AuthService {
  private jwtTokenSubject: BehaviorSubject<string>;
  public jwtToken: Observable<string>;
  oldpass: oldPass;
  constructor(private router: Router, private http: HttpClient) {
    this.oldpass = {
      oldPass: "linkflow1234"
    };
  }

  public get userValue(): string {
    return this.jwtTokenSubject.value;
  }
  checkOldPass() {
    return of(this.oldpass);
  }
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    }
    return throwError({ error });
  }

  // loginWithDSS(user: string, password: string) {
  //   const headers = { "content-type": "application/x-www-form-urlencoded" };
  //   const body = `user=${encodeURIComponent(
  //     user
  //   )}&password=${encodeURIComponent(password)}`;

  //   return this.http
  //     .post<any>(
  //       `${environment.DSSURL}/login_for_dssdataentry?user=${user}&password=${password}`,
  //       {
  //         headers
  //       }
  //     )
  //     .pipe(retry(0), catchError(this.handleError));
  // }

  loginWithDSS(username: string, password: string) {
    const headers = { "content-type": "application/json" };
    const params = { user: username, password: password }; // ส่งผ่าน query string

    return this.http
      .get<any>(`${environment.DSSURL}/login_for_dssdataentry`, {
        headers: headers,
        params: params
      })
      .pipe(retry(0), catchError(this.handleError));
  }

  login(username, password) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({ username: username, password: password });
    return this.http
      .post<any>(
        `${environment.loginURL}authen/login`,
        JSON.stringify({ username: username, password: password }),
        { headers: headers }
      )
      .pipe(retry(0), catchError(this.handleError));
  }

  verifyPassword(password) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      password: password
    });
    return this.http.post<any>(
      environment.apiUrl + "/user/password_verify",
      body,
      { headers: headers }
    );
  }

  changeEmail(userID, emailchange) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({ id: userID, new_email: emailchange });
    console.log(userID, emailchange, body);
    return this.http
      .post<string>(`${environment.apiUrl}/user/change_email`, body, {
        headers: headers
      })
      .pipe(retry(2), catchError(this.handleError));
  }

  settoken(token: any) {
    localStorage.setItem("token", token);
  }

  createUser(userdata) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(userdata);
    return this.http.post<any>(environment.loginURL + "/user/register", body, {
      headers: headers
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  isLoggedIn() {
    return localStorage.getItem("token") != null;
  }

  changePassword(userID, newPassword) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({ id: userID, new_password: newPassword });
    return this.http
      .post<string>(`${environment.apiUrl}/user/change_password`, body, {
        headers: headers
      })
      .pipe(retry(2), catchError(this.handleError));
  }

  syncDevice() {
    return this.http
      .get<string>(`${environment.serviceURL}/sync_now`)
      .pipe(catchError(this.handleError));
  }

  check2FA(username, password, pin) {
    const headers = { "content-type": "application/json" };
    return this.http
      .post<string>(
        `${environment.loginURL}/authen/verify2FA`,
        JSON.stringify({ username: username, password: password, code: pin }),
        {
          headers: headers
        }
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  generateKey2FA(username, password) {
    const headers = {
      "content-type": "application/json"
    };
    return this.http
      .post<string>(
        `${environment.loginURL}/authen/generateKey`,
        JSON.stringify({ username: username, password: password }),
        {
          headers: headers
        }
      )
      .pipe(retry(2), catchError(this.handleError));
  }
  sycn_rcviewDevice() {
    return this.http
      .get<string>(`${environment.apiUrl}/device/sync_rcview`)
      .pipe(catchError(this.handleError));
  }

  submitOTP(userName, phoneNumber, refCode, joinpin) {
    // return console.log("SUBMIT OTP FROM SERVICE");
    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("temp")}`
    };
    const body = JSON.stringify({
      // { id: userID, new_password: newPassword }
      username: userName,
      phonenumber: phoneNumber,
      ref_code: refCode,
      otp: joinpin
    });
    return this.http.post<any>(
      environment.apiUrl + "/callapi/otp/validate",
      body,
      {
        headers: headers
      }
    );
  }

  requestOTP(userName, phoneNumber) {
    // return console.log("SUBMIT OTP FROM SERVICE");
    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("temp")}`
    };
    const body = JSON.stringify({
      username: userName,
      phonenumber: phoneNumber
    });
    return this.http.post<any>(
      environment.apiUrl + "/callapi/otp/request",
      body,
      {
        headers: headers
      }
    );
  }
}
