import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import { Title } from "@angular/platform-browser";
import { LineGroupService } from "@app/linegroupservice";
import { InputSwitchModule } from "primeng/inputswitch";
import { ThemeService } from "app/theme.service";
import { HttpClient } from "@angular/common/http";
import * as Highcharts from "highcharts";
export interface LineGroup {
  id?: number;
  line_group_id?: string;
  enable?: boolean;
  group_name?: string;
  group_description?: string;
  name?: string;
}

export interface alarmGroup {
  group_id?: number;
  symbol_id?: number;
  group_name?: string;
  symbol_name?: string;
  group_description?: string;
  symbol_list?: string[];
  flag?: string[];
  email?: string;
}

export interface routeAPI {
  id?: number;
  tag?: string;
  endpoints?: string;
  methods?: string;
}
export interface editlistGroup {
  symbol_id?: string[];
  group_name?: string;
  group_description?: string;
}
interface group_list {
  SYMBOL_ID?: any;
  SYMBOL_NAME1?: string;
  SYMBOL_NAME3?: string;
}
export interface editGroup {
  group_name?: string;
  group_description?: string;
  group_list?: group_list[];
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
  selector: 'app-d-api-log',
  templateUrl: './d-api-log.component.html',
  styleUrls: ['./d-api-log.component.css']
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
  editalarmGroups: alarmGroup[];
  editalarmGroup: alarmGroup = {};
  editalarmGroups1: alarmGroup = {};
  editGroup: editGroup = {};
  editGroups: editGroup = {};
  editGroup1: editGroup[];
  editGroup2: group_list[];
  alarmGroups: routeAPI[];
  alarmGroup: alarmGroup;
  AlarmGroup: alarmGroup = {};
  tokenList: any[];
  stringArray: string[];
  stringArrays: number;
  iconArrays: any;
  editlistgroup: editlistGroup;
  selectedGroups: any[];
  monitor_id: number[] = [1, 2, 3, 4];
  lineGroups: LineGroup[] = [];
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

  viewMode: string = 'monthly'; // ค่าเริ่มต้นเป็น 'รายเดือน'
  currentMonth: number = new Date().getMonth(); // เดือนปัจจุบัน (0 = มกราคม)
  currentYear: number = new Date().getFullYear(); // ปีปัจจุบัน

  selectedMonth: string = '';  // เดือนที่เลือก
  selectedYear: string = '';   // ปีที่เลือก

  // ตัวเลือกเดือน
  months = [
    { label: 'มกราคม', value: 'January' },
    { label: 'กุมภาพันธ์', value: 'February' },
    { label: 'มีนาคม', value: 'March' },
    { label: 'เมษายน', value: 'April' },
    { label: 'พฤษภาคม', value: 'May' },
    { label: 'มิถุนายน', value: 'June' },
    { label: 'กรกฎาคม', value: 'July' },
    { label: 'สิงหาคม', value: 'August' },
    { label: 'กันยายน', value: 'September' },
    { label: 'ตุลาคม', value: 'October' },
    { label: 'พฤศจิกายน', value: 'November' },
    { label: 'ธันวาคม', value: 'December' },
  ];

  // ตัวเลือกปี
  years = [
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
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
    this.titleService.setTitle("SED EAST-Line Manage");
    // this.actionItems = [
    //   {
    //     icon: "pi pi-fw pi-file",
    //     items: [
    //       {
    //         label: "View",
    //         icon: "pi pi-fw pi-info",
    //         command: event => {
    //           // this.lineread(this.group)
    //         }
    //       },
    //       {
    //         label: "Edit Task",
    //         icon: "pi pi-fw pi-pencil",
    //         command: event => {
    //           // this.editline(this.group)
    //         }
    //       },
    //       {
    //         label: "Delete",
    //         icon: "pi pi-fw pi-trash",
    //         command: event => {
    //           // this.deleteGroup(this.group)
    //         }
    //       }
    //     ]
    //   }
    // ];
  }

  readToken() {
    // console.log(this.selectedValues)

    // const apiUrl = 'http://127.0.0.1:8000/log/read';
    const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/log/read';
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        console.log('Received data:', data.data);
        
        this.tokenList = data.data;
      },
      (error) => {
        console.error('Error fetching polygon data:', error);
      }
    );

  }

  approve(param, param2) {
    const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/token/approve';
   // debugger
    this.http.post<any>(apiUrl, {
      user_id: param,
      route_id: param2
    }).subscribe(
      (data) => {
        console.log('Received data:', data.data);
        this.readToken();
      },
      (error) => {
        console.error('Error fetching polygon data:', error);
      }
    );
  }

  actionItem(AlarmGroup: alarmGroup) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "View",
            icon: "pi pi-fw pi-map-marker",
            command: event => {
              this.lineread(AlarmGroup);
            }
          },
          {
            label: "Edit Task",
            icon: "pi pi-fw pi-info",
            command: event => {
              this.editline(AlarmGroup);
            }
          },
          {
            label: "Delete",
            icon: "pi pi-fw pi-refresh",
            command: event => {
              this.deleteGroup(AlarmGroup);
            }
          }
        ]
      }
    ];
  }
  emailsendline: any;
  openDailog() {
    this.symbolData = [];
    this.alarmGroup = {};
    this.symbolDataAdded = [];
    this.symbolString = [];
    this.nameSearch = null;
    this.ipSearch = null;
    this.submitted = false;
    this.alarmGroupDialog = true;
    this.hasNoSearchResult = false;
    this.dialogHeader = "Chart";
    this.check = false;
    this.check1 = true;
    this.emailsendline = "";
  }
  editline(AlarmGroup: alarmGroup) {
    this.symbolData = [];
    this.alarmGroup = {};
    this.symbolDataAdded = [];
    this.symbolString = [];
    this.nameSearch = null;
    this.ipSearch = null;
    this.submitted = false;
    this.alarmGroupDialog = true;
    this.hasNoSearchResult = false;
    this.dialogHeader = "Edit group";
    this.editalarmGroups1 = AlarmGroup;
    this.check = true;
    this.check1 = false;
    this.selectedValues = AlarmGroup.flag;
    if (AlarmGroup.email != null || AlarmGroup.email != "") {
      this.emailsendline = AlarmGroup.email;
    }
    // console.log(AlarmGroup.flag)
    // console.log(AlarmGroup)
    this.lineGroupService
      .getGroupMessageinfo(this.editalarmGroups1.group_id)
      .subscribe({
        next: datas => {
          this.alarmGroup = datas;
          this.symbolDataAdded = datas.group_list;
        },
        error: error => {
          if (error.status == "401") {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
        }
      });
  }
  changecheck(event) {
    this.alarmGroup.flag = event.checked;
    // console.log(event);
  }
  hideDialog() {
    this.alarmGroupDialog = false;
    this.submitted = false;
  }
  hideDialog1() {
    this.alarmGroupDialog1 = false;
    this.submitted = false;
  }
  ngOnInit() {
    
    // this.alarmGroups = [{
    //   id: 1,
    //   tag: 'Trafic Daily',
    //   endpoints: '/trafic_daily',
    //   methods: 'POST'
    // },
    // {
    //   id: 2,
    //   tag: 'Trafic Monthly',
    //   endpoints: '/trafic_monthly',
    //   methods: 'POST,GET'
    // }]

    this.readToken();

    this.isLoadingalarmGroups = false;
    this.changeDetection.detectChanges();

    this.initializeChartOptions(); // เริ่มต้นแสดงผล
    // this.chartOptions5_1 = {
    //   chart: {
    //     type: "line",
    //     backgroundColor: "#1a2d45", // Set the background color to dark blue
    //     height: 400 // Set the height of the chart to 400px (you can adjust this value)
    //   },
    //   title: {
    //     text: ""
    //   },
    //   xAxis: {
    //     categories: [
    //       "Jan",
    //       "Feb",
    //       "Mar",
    //       "Apr",
    //       "May",
    //       "Jun",
    //       "Jul",
    //       "Aug",
    //       "Sep",
    //       "Oct",
    //       "Nov",
    //       "Dec"
    //     ],
    //     title: {
    //       text: ""
    //     },
    //     labels: {
    //       style: {
    //         color: "#FFFFFF" // Set the color of xAxis labels to white
    //       }
    //     }
    //   },
    //   yAxis: {
    //     title: {
    //       text: "จำนวน Session",
    //       style: {
    //         color: "#FFFFFF" // Set the color of yAxis title to white
    //       }
    //     },
    //     labels: {
    //       style: {
    //         color: "#FFFFFF" // Set the color of yAxis labels to white
    //       }
    //     },
    //     max: 100, // Set the maximum value for the yAxis
    //     tickInterval: 20, // Set tick interval to 20
    //     min: 0 // Ensure the minimum value is 0
    //   },
    //   series: [
    //     {
    //       type: "line",
    //       name: "iOS",
    //       data: [40, 48, 78, 82, 85, 80, 78, 40, 82, 84, 81, 79], // Sample data for the first series
    //       color: "#3498DB" // Blue color for the first series
    //     },
    //     {
    //       type: "line",
    //       name: "Android",
    //       data: [44, 39, 80, 85, 88, 82, 83, 30, 84, 90, 87, 85], // Sample data for the second series
    //       color: "#FF5733" // Red color for the second series
    //     }
    //   ],
    //   plotOptions: {
    //     column: {
    //       pointPadding: 0,
    //       groupPadding: 0.1,
    //       borderWidth: 0,
    //       dataLabels: {
    //         enabled: true,
    //         style: {
    //           color: "#FFFFFF" // Set data label color to white
    //         }
    //       }
    //     }
    //   },
    //   legend: {
    //     itemStyle: {
    //       color: "#FFFFFF" // Set legend item color to white
    //     }
    //   }
    // };

  }

  initializeChartOptions(): void {
    // กำหนดค่าเริ่มต้นเป็นรายเดือน
    this.chartOptions5_1 = this.getMonthlyChartOptions(this.currentYear, this.currentMonth);
  }

  updateChart(): void {

    debugger
    if (this.viewMode === 'monthly' && this.selectedMonth) {
   
      this.chartOptions5_1 = this.getMonthlyChartOptions(this.currentYear, this.currentMonth);
      // this.changeDetection.detectChanges();
    } else if (this.viewMode === 'yearly' && this.selectedYear) {
    
      this.chartOptions5_1 = this.getYearlyChartOptions(this.currentYear);
      // this.changeDetection.detectChanges();
    }
  }
  
  getMonthlyChartOptions(year: number, month: number): Highcharts.Options {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // จำนวนวันในเดือน
    const categories = Array.from({ length: daysInMonth }, (_, i) => `วันที่ ${i + 1}`);
    
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
          data: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 100)),
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
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
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
  

  menuVlue(task) {
    this.lineGroupService.valueSource(task);
  }
  createGroup() {
    // console.log(this.selectedValues)
    if (
      this.alarmGroup.group_name != undefined &&
      this.alarmGroup.group_description != undefined
    ) {
      if (this.emailsendline == null){
        this.emailsendline = "";
      }
      this.invalid = "";
      this.submitted = false;
      if (this.symbolString.length != 0) {
        this.lineGroupService
          .createMessageGroup(
            this.symbolString,
            this.alarmGroup.group_name,
            this.alarmGroup.group_description,
            this.selectedValues,
            this.emailsendline,
            60
          )
          .subscribe(result => {
            this.hideDialog();
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Create Successful",
              life: 3000
            });
            this.changeDetection.detectChanges();
            this.lineGroupService.getMessageGroup().subscribe({
              next: datas => {
                this.alarmGroups = datas;
                this.isLoadingalarmGroups = false;
                this.changeDetection.detectChanges();
              },
              error: error => {
                this.isLoadingalarmGroups = false;
                if (error.status == 401) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Session expired, please logout and login again."
                  });
                }
              }
            });
          });
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please Select SYMBOL ID	or IP Address."
        });
      }
    } else {
      this.invalid = "ng-invalid ng-dirty";
      this.submitted = true;
    }
  }
  editlistGroup() {
    this.submitted = true;
    const ids = this.symbolDataAdded.map(obj => obj.SYMBOL_ID);
    if (this.editGroup.group_name !== "") {
      if (this.emailsendline == null){
        this.emailsendline = "";
      }
      this.lineGroupService
        .editMessageGroup(
          this.editalarmGroups1.group_id,
          ids,
          this.alarmGroup.group_name,
          this.alarmGroup.group_description,
          this.selectedValues,
          this.emailsendline,
          60
        )
        .subscribe(result => {
          this.hideDialog();
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: result.message,
            life: 3000
          });
          this.lineGroupService.getMessageGroup().subscribe(datas => {
            this.alarmGroups = datas;

            this.changeDetection.detectChanges();
          });
          // this.refresh();
        });
    } else {
    }
  }
  refresh(): void {
    window.location.reload();
  }
  linegroupEnable(event, groupdata) {
    this.submitted = true;
    this.lineGroupService
      .lineGroupChangeStatus(groupdata.id, event.checked)
      .subscribe(result => {
        this.submitted = false;
        //console.log("success");
      });
  }

  symbolData: any = [];
  symbolDataAdded: any = [];
  symbolDataAdded1: group_list[];
  symbolString: any[];

  nameSearch: string;
  ipSearch: string;
  hasNoSearchResult: boolean = false;

  searchSymbol() {
    if (this.nameSearch) {
      this.lineGroupService
        .searchSymbolByName(this.nameSearch)
        .subscribe(result => {
          if (result) {
            this.hasNoSearchResult = false;
            this.symbolData = result;
          } else {
            this.hasNoSearchResult = true;
          }
        });
    } else if (this.ipSearch) {
      this.lineGroupService
        .searchSymbolByIP(this.ipSearch)
        .subscribe(result => {
          if (result && result.length > 0) {
            this.hasNoSearchResult = false;
            this.symbolData = result;
          } else {
            this.symbolData = [];
            this.hasNoSearchResult = true;
          }
        });
    }
  }

  nameInput() {
    this.ipSearch = null;
  }

  ipInput() {
    this.nameSearch = null;
  }

  lineread(AlarmGroup: alarmGroup) {
    this.AlarmGroup = AlarmGroup;
    this.lineDialog = true;
    this.selectedValues = AlarmGroup.flag;
    this.dialogHeader = "Alarm message group Manager";
    const name = AlarmGroup.symbol_name;

    this.stringArray = name.split(",");
  }
  addSymbol(symbolData) {
    if (this.findRowBySymbolId(symbolData.SYMBOL_ID) < 0) {
      this.symbolDataAdded.push(symbolData);
      this.symbolString.push(symbolData.SYMBOL_ID);
    }
  }
  addSymbol1(symbolData) {
    if (this.findRowBySymbolId1(symbolData.SYMBOL_ID) < 0) {
      this.editGroup1.push(symbolData);
      this.symbolString.push(symbolData.SYMBOL_ID);
    } else {
      this.editGroup1.push(symbolData);
      this.symbolString.push(symbolData.SYMBOL_ID);
    }
  }
  deleteSymbol(symbolData) {
    let index = this.findRowBySymbolId(symbolData.SYMBOL_ID);
    this.symbolDataAdded.splice(index, 1);
    this.symbolString.splice(index, 1);
  }
  deleteSymbol1(symbolData) {
    let index = this.findRowBySymbolId1(symbolData.SYMBOL_ID);
    this.editGroup1.splice(index, 1);
    this.symbolString.splice(index, 1);
  }
  findRowBySymbolId(id: string): number {
    let index = -1;

    for (let i = 0; i < this.symbolDataAdded.length; i++) {
      if (this.symbolDataAdded[i].SYMBOL_ID === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  findRowBySymbolId1(id: string): number {
    let index = -1;
    for (let i = 0; i < this.symbolData.length; i++) {
      if (this.symbolData[i].SYMBOL_ID === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  deleteGroup(group) {
    this.confirmationService.confirm({
      message:
        "ต้องการลบกลุ่ม " +
        group.group_name +
        " ใช่หรือไม่<br>*การลบกลุ่มนี้จะทำการยกเลิกกลุ่มไลน์ที่ลงทะเบียนไว้กับกลุ่มนี้ด้วย",
      header: "ยืนยันการลบ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.alarmGroups = this.alarmGroups.filter(
          val => val.id !== group.id
        );
        this.alarmGroup = {};
        this.lineGroupService
          .deleteMessageGroup(group.id)
          .subscribe(result => {
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: result.message,
              life: 3000
            });
            this.changeDetection.detectChanges();
          });
      }
    });
  }

}
