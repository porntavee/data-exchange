import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RequestmanagerService {
  private cancelSubject = new Subject<void>();

  // ส่ง Event ยกเลิกคำขอ
  cancelAllRequests(): void {
    this.cancelSubject.next();
  }

  // คืนค่า Observable สำหรับการยกเลิก
  getCancelObservable() {
    return this.cancelSubject.asObservable();
  }
}
