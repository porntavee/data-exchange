import { Component, OnInit } from '@angular/core';
import { dailysentalarmservice } from '@app/pages/dailysend/dailysentalarm.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MenuItem } from "primeng/api";
import { ThemeService } from "app/theme.service";
export interface daily {
  message_to_line?: string;
  send_time?: string;
  group_name?: string;
  no?: number;
}
export interface send_alarm {
  items?: daily[];
  total_pages?: number,
  total_records?: number,
  page?: number,
  size?: number
}
@Component({
  selector: 'app-dailysend',
  templateUrl: 'dailysend.component.html',
  styleUrls: ['dailysend.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class DailysendComponent implements OnInit {
  dailys: daily[];
  dailyreadDialog: boolean;
  daily: daily = {};
  sentdaily: send_alarm = {};
  dialogHeader: string;
  size: any;
  page: any;
  startdate: string;
  enddate: string;
  keyword: string;
  totalRecords: any;
  loading: boolean;
  pageSize = 10;
  end: any;
  start: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  setPageSizeOption: any;
  itemsAction: MenuItem[];
  constructor(private dailysentalarmservice: dailysentalarmservice, private messageService: MessageService, public themeService: ThemeService) {
  }
  ngOnInit(): void {
    this.themeService.currentpage("/Dailysentalarm")
    this.dailysentalarmservice.getdailyDevice(this.start, this.end, this.keyword, this.page, this.size).subscribe({
      next: data => {
        // console.log(data)
        this.sentdaily = data
        this.totalRecords = this.sentdaily.total_records
        // console.log(this.sentdaily.items)
      },
      error: error => {
        if (error.status == '401') {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Session expired, please logout and login again.' });
        }
      }
    });
    this.loading = true;
    this.dailysentalarmservice.currentMessage.subscribe(daily => {
      if (daily != undefined){
        this.itemsAction = [{
          label: 'daily',
          items: [
                  {
                    label: "View",
                    icon: "pi pi-search",
                    command: event => {
                      this.dailyread(daily);
                      
                    }
                  },
                  
                ]}
      ];
      }
     
    })
  }
  menuVlue(daily){
    this.dailysentalarmservice.valueSource(daily);
  }
  onSelectMethod(event) {

    let d = new Date(Date.parse(event));
    //  var isoDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
    //  this.accessed_at = isoDate
    //  console.log(this.accessed_at)
    this.start = `${d.getFullYear()}-${(d.getMonth() + 1).toString().replace(/^(\d)$/, '0$1')}-${d.getDate().toString().replace(/^(\d)$/, '0$1')}`;
    console.log(this.start);

  }
  onSelectMethod1(event) {

    let d = new Date(Date.parse(event));
    //  var isoDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
    //  this.accessed_at = isoDate
    //  console.log(this.accessed_at)
    this.end = `${d.getFullYear()}-${(d.getMonth() + 1).toString().replace(/^(\d)$/, '0$1')}-${d.getDate().toString().replace(/^(\d)$/, '0$1')}`;
    console.log(this.end);

  }
  paginate(event: LazyLoadEvent) {

    this.loading = true;
    this.page = ((event.first) / (event.rows)) + 1;
    this.setPageSizeOption = (event.rows);
    this.size = this.setPageSizeOption;
    this.dailysentalarmservice.getdailyDevice(this.start, this.end, this.keyword, this.page, this.size).subscribe(
      data => {
        this.sentdaily = data
        this.loading = false;

      }

    );

  }
  islogLoading: boolean = false;
  searchdate(event) {


    this.islogLoading = true;

    this.dailysentalarmservice.getdailyDevice(this.start, this.end, this.keyword, this.page, this.size).subscribe(
      results => {
        var output = [];
        this.sentdaily = results
        console.log(results)
      });

    setTimeout(() => {
      this.islogLoading = false;
    }, 5000);


  }
  refresh(): void {
    window.location.reload();
  }

  dailyread(daily: daily) {
    this.daily = daily;
    this.dailyreadDialog = true;
    this.dialogHeader = "Daily sent alarm";
  }
  // const name = task.command;
  // this.stringArray = name.split( '\ ' );
  // console.log(this.stringArray);
}

