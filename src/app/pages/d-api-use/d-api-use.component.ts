import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import { Title } from "@angular/platform-browser";
import { LineGroupService } from "@app/linegroupservice";
import { InputSwitchModule } from "primeng/inputswitch";
import { ThemeService } from "app/theme.service";
import { HttpClient } from "@angular/common/http";
import { threadId } from "worker_threads";
import jwt_decode from "jwt-decode";
import { DApiUseService } from "@app/d-api-use.service";
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
  status?: string;
  data?: string;
}

export interface routeAPI {
  id?: number;
  tag?: string;
  endpoints?: string;
  methods?: string;
  status?: string;
  data?: string;
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
  selector: "app-d-api-use",
  templateUrl: "./d-api-use.component.html",
  styleUrls: ["./d-api-use.component.css"]
})
export class DApiUseComponent implements OnInit {
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
  alarmGroup: routeAPI;
  AlarmGroup: routeAPI = {};
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

  requestDialog: boolean = false; // ควบคุมการแสดงผล Dialog
  requestDialogHeader: string = "Request Details"; // หัวข้อของ Dialog
  requestDetails: string = ""; // เก็บข้อความรายละเอียด
  // selectedDuration: string = ''; // เก็บระยะเวลาที่เลือก
  api_id: string = "";
  selectedDuration: any = {};
  fromDate: Date = new Date(); // วันที่ปัจจุบัน
  toDate: Date = new Date(new Date().setDate(new Date().getDate() + 7)); // อีก 7 วันจากวันนี้
  status: string;
  dataAmount: any;
  viewDialog: boolean;
  groupsData: any;
  intervalId: NodeJS.Timeout;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private lineGroupService: LineGroupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    public themeService: ThemeService,
    private http: HttpClient,
    private DApiService: DApiUseService
  ) {
    this.titleService.setTitle("API Library");
    this.itemsAction = [
      {
        label: "View",
        icon: "pi pi-eye",
        command: event => this.viewItem(event.item.data)
      },
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: event => this.openEditDialog(event.item.data)
      }
    ];
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

  viewItem(param) {
    this.viewDialog = true;
    this.api_id = param.route_id;
    this.requestDetails = param.details;
    this.selectedDuration = { value: param.duration };
    var index = this.durationOptions.findIndex(
      data => data.value === param.duration.toString()
    );
    this.selectedDuration = this.durationOptions[index];
    // แปลง from_at และ to_at เป็น Date
    this.fromDate = this.convertToDate(param.from_at);
    this.toDate = this.convertToDate(param.to_at);
  }

  openViewDailog() {
    this.symbolData = [];
    this.alarmGroup = {};
    this.symbolDataAdded = [];
    this.symbolString = [];
    this.nameSearch = null;
    this.ipSearch = null;
    this.submitted = false;
    this.alarmGroupDialog = true;
    this.hasNoSearchResult = false;
    this.dialogHeader = "Add new";
    this.check = false;
    this.check1 = true;
    this.emailsendline = "";
  }

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
    this.dialogHeader = "Add new";
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
    // this.alarmGroup.flag = event.checked;
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
    this.readRoute();
    this.intervalId = setInterval(() => {
      this.readRoute();
    }, 5 * 60 * 1000);

    this.readToken();
    // this.tryExecute2();
    // this.fetchAndMapData();
    this.isLoadingalarmGroups = false;
    this.changeDetection.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  tryExecute2(
    event: Event,
    param: any,
    skipDialog: boolean = false,
    index
  ): void {
    this.isLoadingalarmGroups = true;

    event?.stopPropagation(); // ป้องกันเหตุการณ์ซ้อนทับ

    let model = {
      dataset_id: param.dataset_id,
      query_string: param.query
    };

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/tryexecute";

    this.http.post<any>(apiUrl, model).subscribe(
      data => {
        // เก็บข้อมูลใน Array กรณี API สำเร็จ
        this.alarmGroups[index].status = data.status;
        this.alarmGroups[index].data = data.data.length;
      },
      error => {
        // เก็บข้อมูลใน Array กรณีเกิด Error
        this.alarmGroups[index].status = "Error";
        this.alarmGroups[index].data = "Error";
      },
      () => {
        this.isLoadingalarmGroups = false; // จบการโหลด ไม่ว่าจะ success หรือ error
      }
    );
  }

  readRoute() {
    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/route/read";

    this.http.get<any>(apiUrl).subscribe(
      data => {
        this.alarmGroups = data.data;

        // เรียก tryExecute2 สำหรับทุก group โดยไม่ต้องเปิด Dialog
        this.alarmGroups.forEach((group, index) => {
          console.log(group.endpoints, index);
          this.alarmGroups[index].endpoints = group.endpoints;
          const mockEvent = new Event("init"); // อีเวนต์จำลอง
          this.tryExecute2(mockEvent, group, true, index); // skipDialog = true
        });
      },
      error => {
        console.error("Error fetching data:", error);
      }
    );
  }

  apiResults: {
    name: string;
    status: string;
    dataAmount: number | null;
  }[] = [];

  readToken() {
    // console.log(this.selectedValues)
    let userdata = jwt_decode(localStorage.getItem("token"));

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/read/" +
      userdata["id"];
    // const apiUrl = "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/read/" + userdata["id"];
    this.http.get<any>(apiUrl).subscribe(
      data => {
        console.log("Received data:", data.data);
        // ////debugger;
        this.tokenList = data.data;
      },
      error => {
        console.error("Error fetching polygon data:", error);
      }
    );
  }

  createToken() {
    const formatDate = (date: Date | null): string =>
      date
        ? `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}`
        : "";

    // console.log({
    //   requestDetails: this.requestDetails,
    //   selectedDuration: this.selectedDuration,
    //   fromDate: formatDate(this.fromDate),
    //   toDate: formatDate(this.toDate),
    // });

    // // console.log(this.selectedValues)
    let userdata = jwt_decode(localStorage.getItem("token"));

    // ////debugger;
    // const apiUrl = "http://127.0.0.1:8000/token/create";
    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/create";
    // const apiUrl = "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/create";
    // const apiUrl = "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/create";
    ////debugger;
    this.http
      .post<any>(apiUrl, {
        user_id: userdata["id"],
        username: userdata["username"],
        route_id: this.api_id,
        details: this.requestDetails,
        duration: this.selectedDuration["value"],
        from_date: formatDate(this.fromDate),
        to_date: formatDate(this.toDate)
      })
      .subscribe(
        data => {
          console.log("Received data:", data.data);
          this.requestDialog = false;
          this.readRoute();
          this.readToken();
        },
        error => {
          console.error("Error fetching polygon data:", error);
        }
      );
  }

  menuVlue(task) {
    this.lineGroupService.valueSource(task);
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
    // this.AlarmGroup = AlarmGroup;
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
        this.alarmGroups = this.alarmGroups.filter(val => val.id !== group.id);
        this.alarmGroup = {};
        this.lineGroupService.deleteMessageGroup(group.id).subscribe(result => {
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

  // ตัวเลือกสำหรับ Dropdown
  durationOptions = [
    { label: "15 วัน", value: "15" },
    { label: "30 วัน", value: "30" },
    { label: "60 วัน", value: "60" },
    { label: "90 วัน", value: "90" },
    { label: "กำหนดวัน", value: "-1" },
    { label: "ไม่มีหมดอายุ", value: "0" }
  ];

  openRequestDialog(param) {
    //debugger
    this.requestDialog = true;
    this.api_id = param.api_id;
  }

  openEditDialog(param) {
    this.requestDialog = true;
    this.api_id = param.route_id;
    this.requestDetails = param.details;
    this.selectedDuration = { value: param.duration };
    var index = this.durationOptions.findIndex(
      data => data.value === param.duration.toString()
    );
    this.selectedDuration = this.durationOptions[index];
    // แปลง from_at และ to_at เป็น Date
    this.fromDate = this.convertToDate(param.from_at);
    this.toDate = this.convertToDate(param.to_at);
  }
  convertToDate(dateStr: string): Date | null {
    return dateStr ? new Date(dateStr) : null;
  }

  // ฟังก์ชันสำหรับปิด Dialog
  closeDialog(): void {
    this.requestDialog = false;
  }

  // ฟังก์ชันสำหรับบันทึกข้อมูล
  saveRequest(): void {
    console.log("รายละเอียด:", this.requestDetails);
    console.log("ระยะเวลาที่เลือก:", this.selectedDuration);
    this.requestDialog = false; // ปิด Dialog หลังจากบันทึก
  }
}
