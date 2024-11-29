import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import { Title } from "@angular/platform-browser";
import { LineGroupService } from "@app/linegroupservice";
import { InputSwitchModule } from "primeng/inputswitch";
import { ThemeService } from "app/theme.service";
import { HttpClient } from "@angular/common/http";
import * as Highcharts from "highcharts";
import jwt_decode from "jwt-decode";

export interface routeAPI {
  id?: number;
  tag?: string;
  endpoints?: string;
  methods?: string;
}

@Component({
  moduleId: module.id,
  styles: [
    `
      :host ::ng-deep .p-dialog .user-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `
  ],
  selector: "app-d-api-log",
  templateUrl: "./d-api-log.component.html",
  styleUrls: ["./d-api-log.component.css"]
})
export class DApiLogComponent implements OnInit {
  minutes = [
    { value: 60, name: "60 Minute" },
    { value: 120, name: "120 Minute" },
    { value: 180, name: "180 Minute" }
  ];
  selectedValue: any;
  itemsAction: MenuItem[];
  alarmGroupDialog: boolean;
  alarmGroupDialog1: boolean;
  dialogHeader: string;
  submitted: boolean;
  alarmGroups: routeAPI[];
  tokenList: any[];
  stringArray: string[];
  stringArrays: number;
  iconArrays: any;
  selectedGroups: any[];
  enabled: boolean = true;
  lineDialog: boolean;
  check: boolean;
  check1: boolean;
  invalid: string;
  actionItems: MenuItem[] | undefined;
  selectedValues: string[];
  isLoading: boolean = true;
  isLoadingalarmGroups: boolean = true;

  Highcharts5_1: typeof Highcharts = Highcharts;
  chartOptions5_1: Highcharts.Options;

  viewMode: string = "monthly"; // ค่าเริ่มต้นเป็น 'รายเดือน'
  currentMonth: number = new Date().getMonth(); // เดือนปัจจุบัน (0 = มกราคม)
  currentYear: number = new Date().getFullYear(); // ปีปัจจุบัน

  selectedMonth: string = ""; // เดือนที่เลือก
  selectedYear: string = ""; // ปีที่เลือก

  // ตัวเลือกเดือน
  months = [
    { label: "มกราคม", value: "January" },
    { label: "กุมภาพันธ์", value: "February" },
    { label: "มีนาคม", value: "March" },
    { label: "เมษายน", value: "April" },
    { label: "พฤษภาคม", value: "May" },
    { label: "มิถุนายน", value: "June" },
    { label: "กรกฎาคม", value: "July" },
    { label: "สิงหาคม", value: "August" },
    { label: "กันยายน", value: "September" },
    { label: "ตุลาคม", value: "October" },
    { label: "พฤศจิกายน", value: "November" },
    { label: "ธันวาคม", value: "December" }
  ];

  // ตัวเลือกปี
  years = [
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" }
  ];

  constructor(
    private changeDetection: ChangeDetectorRef,
    private lineGroupService: LineGroupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    public themeService: ThemeService,
    private http: HttpClient
  ) {
    this.titleService.setTitle("API Log");
  }

  ngOnInit() {
    this.readLog();

    this.isLoadingalarmGroups = false;
    this.changeDetection.detectChanges();

    this.initializeChartOptions(); // เริ่มต้นแสดงผล
  }

  readLog() {
    let userdata = jwt_decode(localStorage.getItem("token"));

    // const apiUrl = 'http://127.0.0.1:8000/log/read';
    const apiUrl =
      "https://dpub.linkflow.co.th:4433/api/data-exchange/log/read";
    this.http.get<any>(apiUrl).subscribe(
      data => {
        console.log("Received data:", data.data);

        this.tokenList = data.data;
      },
      error => {
        console.error("Error fetching polygon data:", error);
      }
    );
  }

  openDailog() {
    this.submitted = false;
    this.alarmGroupDialog = true;
    this.dialogHeader = "Chart";
    this.check = false;
    this.check1 = true;
  }

  hideDialog() {
    this.alarmGroupDialog = false;
    this.submitted = false;
  }

  initializeChartOptions(): void {
    // กำหนดค่าเริ่มต้นเป็นรายเดือน
    this.chartOptions5_1 = this.getMonthlyChartOptions(
      this.currentYear,
      this.currentMonth
    );
  }

  updateChart(): void {
    debugger;
    if (this.viewMode === "monthly" && this.selectedMonth) {
      this.chartOptions5_1 = this.getMonthlyChartOptions(
        this.currentYear,
        this.currentMonth
      );
      // this.changeDetection.detectChanges();
    } else if (this.viewMode === "yearly" && this.selectedYear) {
      this.chartOptions5_1 = this.getYearlyChartOptions(this.currentYear);
      // this.changeDetection.detectChanges();
    }
  }

  getMonthlyChartOptions(year: number, month: number): Highcharts.Options {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // จำนวนวันในเดือน
    const categories = Array.from(
      { length: daysInMonth },
      (_, i) => `วันที่ ${i + 1}`
    );

    return {
      chart: {
        type: "line",
        backgroundColor: "#1a2d45",
        height: 400
      },
      // title: { text: `สถิติรายเดือน (${year} - ${month + 1})` },
      xAxis: {
        categories,
        labels: { style: { color: "#FFFFFF" } }
      },
      yAxis: {
        title: { text: "จำนวน Session", style: { color: "#FFFFFF" } },
        labels: { style: { color: "#FFFFFF" } },
        max: 100,
        tickInterval: 20,
        min: 0
      },
      series: [
        {
          type: "line",
          name: "จำนวนครั้ง",
          data: Array.from({ length: daysInMonth }, () =>
            Math.floor(Math.random() * 100)
          ),
          color: "#FF5733"
        }
      ],
      plotOptions: {
        column: {
          pointPadding: 0,
          groupPadding: 0.1,
          borderWidth: 0,
          dataLabels: { enabled: true, style: { color: "#FFFFFF" } }
        }
      },
      legend: { itemStyle: { color: "#FFFFFF" } }
    };
  }

  getYearlyChartOptions(year: number): Highcharts.Options {
    return {
      chart: {
        type: "line",
        backgroundColor: "#1a2d45",
        height: 400
      },
      // title: { text: `สถิติรายปี (${year})` },
      xAxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        labels: { style: { color: "#FFFFFF" } }
      },
      yAxis: {
        title: { text: "จำนวน Session", style: { color: "#FFFFFF" } },
        labels: { style: { color: "#FFFFFF" } },
        max: 100,
        tickInterval: 20,
        min: 0
      },
      series: [
        // {
        //   type: "line",
        //   name: "จำนวนครั้ง",
        //   data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
        //   color: "#3498DB"
        // },
        {
          type: "line",
          name: "จำนวนครั้ง",
          data: Array.from({ length: 12 }, () =>
            Math.floor(Math.random() * 100)
          ),
          color: "#FF5733"
        }
      ],
      plotOptions: {
        column: {
          pointPadding: 0,
          groupPadding: 0.1,
          borderWidth: 0,
          dataLabels: { enabled: true, style: { color: "#FFFFFF" } }
        }
      },
      legend: { itemStyle: { color: "#FFFFFF" } }
    };
  }
}
