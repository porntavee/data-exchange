import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { retry, catchError } from "rxjs/operators";
import {
  ReportComponent,
  TaskResult
} from "@app/pages/report/report.component";
import { environment } from "environments/environment";
import { param } from "jquery";
import { BehaviorSubject, from, Observable, throwError, of } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { RequestmanagerService } from "@app/requestmanager.service";

@Injectable({
  providedIn: "root"
})
export class DApiUseService {
  constructor(
    private http: HttpClient,
    private requestManager: RequestmanagerService
  ) {}
  Kpimodel(param1, param2, param3) {
    const headers = new HttpHeaders({
      token: "8404302a-0acf-4bd8-a467-61cdac4710ce", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const item = {
      param1: param1,
      param2: param2,
      param3: param3
    };
    const body = JSON.stringify(item);
    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/kpi",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }

  crasch_rate(param1) {
    const headers = new HttpHeaders({
      token: "00837725-c791-4241-a1ab-e1db118e80c3", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const item = {
      param1: param1
    };
    const body = JSON.stringify(item);

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/crasch-rate",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }
  point_blackspot() {
    const headers = new HttpHeaders({
      token: "9da0ac33-040c-4444-a857-3029c93719e5", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const body = {};

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/point_blackspot",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }
  getOD() {
    // สร้าง headers โดยใช้ API Key
    const headers = new HttpHeaders({
      token: "846a6f12-71b9-431e-baf2-eea987ca660b", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const body = {};

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/o-d",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }

  cctvAllL() {
    const headers = new HttpHeaders({
      token: "2fae92c1-0344-4d1e-9dc8-f652355b936c", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const body = {};

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/cctv_all",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }
  incident_opencase() {
    const headers = new HttpHeaders({
      token: "65f2c9f1-d949-4b26-a806-325af1ea435f", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const body = {};

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/incident_open",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }
  ctmrunTime() {
    const headers = new HttpHeaders({
      token: "80842d15-0059-4754-b3ea-37eb80aaaa08", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const body = {};

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/ctm",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }
  Logmobile() {
    const headers = new HttpHeaders({
      token: "aa210db5-1f0b-4322-b4d8-5158ddb6d88e", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const body = {};

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/log_mobile",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }
  stats_accident_M7() {
    const headers = new HttpHeaders({
      token: "05b0bef4-9d63-47ff-9936-0228064ac4b6", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const body = {};

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/stats_accident_M7",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }
  stats_accident_M9() {
    const headers = new HttpHeaders({
      token: "e39fdf95-c6ce-4589-81ed-64256a6af484", // API Key
      "Content-Type": "application/json" // ระบุประเภทของข้อมูลที่ส่ง
    });

    // สร้าง Body สำหรับ POST request (ในกรณีนี้คือ {} หรือไม่มีก็ได้)
    const body = {};

    // เรียก API ด้วย method POST
    return this.http
      .post<any>(
        environment.dataExchange + "dnm/api/stats_accident_M9",
        // URL ของ API
        body, // Body ที่จะส่ง
        { headers } // ส่ง headers พร้อมกับคำขอ
      )
      .pipe(
        takeUntil(this.requestManager.getCancelObservable()) // ใช้ takeUntil เพื่อยกเลิกคำขอ
      );
  }
}
