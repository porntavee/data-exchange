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
import { ThrowStmt } from "@angular/compiler";

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

  selectedMonth: number | null = null; // เดือนที่เลือก
  selectedYear: number | null = null; // ปีที่เลือก

  months = [
    { label: "มกราคม", value: 1 },
    { label: "กุมภาพันธ์", value: 2 },
    { label: "มีนาคม", value: 3 },
    { label: "เมษายน", value: 4 },
    { label: "พฤษภาคม", value: 5 },
    { label: "มิถุนายน", value: 6 },
    { label: "กรกฎาคม", value: 7 },
    { label: "สิงหาคม", value: 8 },
    { label: "กันยายน", value: 9 },
    { label: "ตุลาคม", value: 10 },
    { label: "พฤศจิกายน", value: 11 },
    { label: "ธันวาคม", value: 12 }
  ];

  // ตัวเลือกปี
  years: { label: string; value: number }[] = [];

  token = "";
  logList: any = [];
  isMobile: boolean;

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
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = today.getFullYear();
    // กำหนดค่าเริ่มต้น
    this.selectedMonth = currentMonth;
    this.selectedYear = currentYear;

    // สร้างรายการปี (สมมติให้เป็นช่วง 5 ปีย้อนหลังและ 5 ปีข้างหน้า)
    const startYear = currentYear - 5;
    const endYear = currentYear + 5;
    this.years = [];
    for (let year = startYear; year <= endYear; year++) {
      this.years.push({ label: year.toString(), value: year });
    }

    this.readLog();

    this.isLoadingalarmGroups = false;
    this.changeDetection.detectChanges();
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize.bind(this));
    // this.initializeChartOptions(); // เริ่มต้นแสดงผล
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 1021;
    this.changeDetection.detectChanges(); // อัพเดตการแสดงผล
    console.log(this.isMobile);
  }

  openMenuWithItems(group: any, event: Event, menu: any) {
    this.menuVlue(group); // กำหนดค่าหรืออัปเดต itemsAction
    menu.toggle(event); // เปิดเมนู
  }

  menuVlue(group: any) {
    // อัปเดตรายการเมนู
    this.itemsAction = [
      {
        label: "View Data",
        icon: "pi pi-eye",
        command: () => this.openDailog(group)
      }
      // {
      // label: "Edit",
      // icon: "pi pi-pencil"
      // command: () => this.readRouteById(group)
      // }
    ];
  }

  readLog() {
    let userdata = jwt_decode(localStorage.getItem("token"));

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/log/read";
    // const apiUrl = 'https://dss.motorway.go.th:4433/dxc/api/data-exchange/log/read';
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

  readMonthLog() {
    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/log/month/read";
    // const apiUrl = 'https://dss.motorway.go.th:4433/dxc/api/data-exchange/log/month/read';
    this.http
      .post<any>(apiUrl, {
        month: this.selectedMonth,
        year: this.selectedYear,
        token: this.token
      })
      .subscribe(
        data => {
          console.log("Received data:", data.data);
          this.logList = data.data;
          this.chartOptions5_1 = this.getMonthlyChartOptions(this.logList);
        },
        error => {
          console.error("Error fetching polygon data:", error);
        }
      );
  }

  readYearLog() {
    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/log/year/read";
    // const apiUrl = 'https://dss.motorway.go.th:4433/dxc/api/data-exchange/log/month/read';
    this.http
      .post<any>(apiUrl, { year: this.selectedYear, token: this.token })
      .subscribe(
        data => {
          console.log("Received data:", data.data);
          this.logList = data.data;
          this.chartOptions5_1 = this.getYearlyChartOptions(this.logList);
        },
        error => {
          console.error("Error fetching polygon data:", error);
        }
      );
  }

  openDailog(param) {
    this.submitted = false;
    this.alarmGroupDialog = true;
    this.dialogHeader =
      "Log Chart of Tag: " + param.tag + " Endpoint: " + param.endpoints;
    this.check = false;
    this.check1 = true;
    this.token = param.token;

    this.readMonthLog();
  }

  hideDialog() {
    this.alarmGroupDialog = false;
    this.submitted = false;
  }

  // initializeChartOptions(): void {
  //   // กำหนดค่าเริ่มต้นเป็นรายเดือน
  //   this.chartOptions5_1 = this.getMonthlyChartOptions(this.currentYear, this.currentMonth);
  // }

  updateChart(): void {
    if (this.viewMode === "monthly") {
      // && this.selectedMonth

      this.readMonthLog();
      // this.chartOptions5_1 = this.getMonthlyChartOptions(this.currentYear, this.currentMonth);
      // this.changeDetection.detectChanges();
    } else if (this.viewMode === "yearly") {
      // && this.selectedYear

      this.readYearLog();
      // this.chartOptions5_1 = this.getYearlyChartOptions(this.currentYear);
      // this.changeDetection.detectChanges();
    }
  }

  getMonthlyChartOptions(logList): Highcharts.Options {
    // สมมติ logList มีโครงสร้าง [{ log_date: '2024-11-01', usage_count: 10 }, ...]
    const daysInMonth = new Date(
      this.selectedYear,
      this.selectedMonth,
      0
    ).getDate(); // จำนวนวันในเดือน
    const categories = Array.from(
      { length: daysInMonth },
      (_, i) => `วันที่ ${i + 1}`
    ); // วันที่ 1 ถึงวันสุดท้ายของเดือน

    // แปลง logList เป็น data array ที่สอดคล้องกับวันที่ในเดือน
    const usageData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const log = logList.find(item => new Date(item.date).getDate() === day);
      return log ? log.usage_count : 0; // ถ้าไม่มีข้อมูล ให้ใส่ค่า 0
    });

    return {
      chart: {
        type: "line",
        backgroundColor: "transparent",
        height: 400
      },
      title: {
        text: ""
      },
      xAxis: {
        categories,
        labels: {
          style: { color: "#FFFFFF", fontFamily: "Prompt" } // สีของ label แกน X
        }
      },
      yAxis: {
        title: {
          text: "จำนวน Session",
          style: { color: "#FFFFFF", fontFamily: "Prompt" } // สีของ title แกน Y
        },
        labels: {
          style: { color: "#FFFFFF", fontFamily: "Prompt" } // สีของ label แกน Y
        },
        min: 0 // ค่าเริ่มต้นของแกน Y
      },
      series: [
        {
          type: "line",
          name: "จำนวนครั้ง",
          data: usageData, // ใช้ข้อมูลจาก logList
          color: "#FF5733"
        }
      ],
      tooltip: {
        style: {
          fontFamily: "Prompt",
          fontSize: "16px"
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          groupPadding: 0.1,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            style: { color: "#FFFFFF", fontFamily: "Prompt" }
          }
        }
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false // ซ่อนการ export
      },
      legend: {
        itemStyle: { color: "#FFFFFF", fontFamily: "Prompt" }
      }
    };
  }

  getYearlyChartOptions(logList): Highcharts.Options {
    // สมมติ logList มีโครงสร้าง [{ log_month: 1, usage_count: 100 }, ...]
    const categories = [
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
    ];

    // แปลง logList เป็น data array ที่สอดคล้องกับเดือนในปี
    const usageData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const log = logList.find(item => item.month === month);
      return log ? log.usage_count : 0; // ถ้าไม่มีข้อมูล ให้ใส่ค่า 0
    });

    return {
      chart: {
        type: "line",
        backgroundColor: "transparent",
        height: 400
      },
      xAxis: {
        categories,
        labels: {
          style: { color: "#FFFFFF" } // สีของ label แกน X
        }
      },
      yAxis: {
        title: {
          text: "จำนวน Session",
          style: { color: "#FFFFFF" } // สีของ title แกน Y
        },
        labels: {
          style: { color: "#FFFFFF" } // สีของ label แกน Y
        },
        min: 0 // ค่าเริ่มต้นของแกน Y
      },
      series: [
        {
          type: "line",
          name: "จำนวนครั้ง",
          data: usageData, // ใช้ข้อมูลจาก logList
          color: "#FF5733"
        }
      ],
      plotOptions: {
        column: {
          pointPadding: 0,
          groupPadding: 0.1,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            style: { color: "#FFFFFF" }
          }
        }
      },
      legend: {
        itemStyle: { color: "#FFFFFF" }
      }
    };
  }
}
