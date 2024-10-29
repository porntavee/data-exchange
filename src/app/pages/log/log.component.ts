import { Component, OnInit, Input, Output } from "@angular/core";
import { Product } from "@app/product";
import { ProductService } from "@app/productservice";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { User } from "@app/user";
import { Title } from "@angular/platform-browser";
import { LogService } from "./log.service";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from "primeng/inputtext";
import { Calendar } from "primeng/calendar";
import { FormGroup, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { combineLatest } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders
} from "@angular/common/http";
import { environment } from "environments/environment";
import { data } from "jquery";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/api";
import { ThemeService } from "app/theme.service";
// import {PageEvent} from '@angular/material/paginator';
// import { MatPaginator } from '@angular/material/paginator';

interface City {
  name: string;
  code: string;
}

interface Zone {
  name: string;
  id: number;
}
export interface log_page {
  items?: log_list[];
  total_pages?: number;
  total_records?: number;
  page?: number;
  size?: number;
}
export interface log_list {
  role?: string;
  username?: string;
  id?: string;
  accessed_at?: string;
  user_id?: string;
  api?: string;
}
@Component({
  selector: "log-cmp",
  moduleId: module.id,
  templateUrl: "log.component.html",
  styles: [
    `
      :host ::ng-deep .p-dialog .user-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `
  ],
  styleUrls: ["log.component.scss"]
})
export class LogComponent implements OnInit {
  tutorials: any;
  logs: any[];
  taskResult: log_list = {};
  log_lists: log_list[];
  log_lists1: log_list[];

  log_pages: log_page = {};
  log_pages1: log_page[];
  accessed_at: any;
  accessed_ata: Date;
  UserID: string;
  Username: string;
  Role: string;
  API: string;
  Payload: string;
  starts: any;
  size: any;

  page: any;
  subpage: number;
  pages: number;
  page1: number;
  loading: boolean;
  totalRecords: any;
  setPageSizeOption: any;

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private logService: LogService,
    public themeService: ThemeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private http: HttpClient
  ) {
    this.titleService.setTitle("SED-Log");
  }

  ngOnInit() {
    this.themeService.currentpage("/log");
    this.logService
      .getSchedulelog(
        this.UserID,
        this.Username,
        this.Role,
        this.API,
        this.accessed_at,
        this.page,
        this.size
      )
      .subscribe({
        next: data => {
          this.log_pages = data;
          this.totalRecords = this.log_pages.total_records;

          //  console.log(this.totalRecords)
        },
        error: error => {
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
        }
      });
  }

  onSelectMethod(event) {
    let d = new Date(Date.parse(event));
    //  var isoDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
    //  this.accessed_at = isoDate
    //  console.log(this.accessed_at)
    this.accessed_at = `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .replace(/^(\d)$/, "0$1")}-${d
      .getDate()
      .toString()
      .replace(/^(\d)$/, "0$1")}T${d
      .getHours()
      .toString()
      .replace(/^(\d)$/, "0$1")}:${d
      .getMinutes()
      .toString()
      .replace(/^(\d)$/, "0$1")}:${d
      .getSeconds()
      .toString()
      .replace(/^(\d)$/, "0$1")}.${d
      .getMilliseconds()
      .toString()
      .replace(/^(\d)$/, "0$1")}${d
      .getMilliseconds()
      .toString()
      .replace(/^(\d)$/, "0$1")}${d
      .getMilliseconds()
      .toString()
      .replace(/^(\d)$/, "0$1")}`;
    console.log(this.accessed_at);
  }

  assignCopy() {
    this.log_lists = Object.assign([], this.UserID);
  }

  handleClear() {
    (this.accessed_ata = null),
      (this.accessed_at = null),
      (this.UserID = null),
      (this.Username = null),
      (this.Role = null),
      (this.API = null),
      (this.Payload = null);
  }

  islogLoading: boolean = false;

  searchlog() {
    this.islogLoading = true;

    this.logService
      .getSchedulelog(
        this.UserID,
        this.Username,
        this.Role,
        this.API,
        this.accessed_at,
        this.page,
        this.size
      )
      .subscribe(results => {
        var output = [];
        this.log_pages = results;
        console.log(this.log_pages)
      });

    setTimeout(() => {
      this.islogLoading = false;
    }, 5000);
  }
  clearlog() {
    this.islogLoading = true;
    (this.accessed_at = ""),
      //   this.accessed_ata = null,
      (this.UserID = ""),
      (this.Username = ""),
      (this.Role = ""),
      (this.API = ""),
      (this.Payload = "");
    this.logService
      .getSchedulelog(
        this.UserID,
        this.Username,
        this.Role,
        this.API,
        this.accessed_at,
        this.page,
        this.size
      )
      .subscribe(results => {
        var output = [];
        this.log_pages = results;
      });
    setTimeout(() => {
      this.islogLoading = false;
    }, 5000);
  }

  paginate(event: LazyLoadEvent) {
    this.loading = true;
    this.page = event.first / event.rows + 1;
    this.setPageSizeOption = event.rows;
    this.size = this.setPageSizeOption;
    this.logService
      .getSchedulelog(
        this.UserID,
        this.Username,
        this.Role,
        this.API,
        this.accessed_at,
        this.page,
        this.size
      )
      .subscribe(data => {
        this.log_pages = data;
        this.loading = false;
      });
  }

  refresh(): void {
    window.location.reload();
  }
  applyFilter() {}
}
