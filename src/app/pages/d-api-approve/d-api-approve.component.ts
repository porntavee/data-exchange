import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import { Title } from "@angular/platform-browser";
import { LineGroupService } from "@app/linegroupservice";
import { InputSwitchModule } from "primeng/inputswitch";
import { ThemeService } from "app/theme.service";
import { HttpClient } from "@angular/common/http";
import jwt_decode from "jwt-decode";
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
  selector: "app-d-api-approve",
  templateUrl: "./d-api-approve.component.html",
  styleUrls: ["./d-api-approve.component.css"]
})
export class DApiApproveComponent implements OnInit {
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

  approveDialog: boolean = false;
  approveDialogHeader = "Approve Detail";
  requestDetails = "";
  selectedDuration: any = {};
  adminDetails = "";
  selectAdminDuration: any = {};
  user_id: any;
  route_id: any;
  fromDate: Date = new Date(); // วันที่ปัจจุบัน
  toDate: Date = new Date(new Date().setDate(new Date().getDate() + 7)); // อีก 7 วันจากวันนี้
  fromAdminDate: Date = new Date(); // วันที่ปัจจุบัน
  toAdminDate: Date = new Date(new Date().setDate(new Date().getDate() + 7)); // อีก 7 วันจากวันนี้

  // ตัวเลือกสำหรับ Dropdown
  durationOptions = [
    { label: "15 วัน", value: "15" },
    { label: "30 วัน", value: "30" },
    { label: "60 วัน", value: "60" },
    { label: "90 วัน", value: "90" },
    { label: "กำหนดวัน", value: "-1" },
    { label: "ไม่มีหมดอายุ", value: "0" }
  ];
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
    this.titleService.setTitle("API Approve");
    this.itemsAction = [
      {
        label: "เปิดใช้งาน",
        icon: "pi pi-check"
        // command: () => this.toggleStatus("เปิดใช้งาน")
      },
      {
        label: "ปิดใช้งาน",
        icon: "pi pi-times"
        // command: () => this.toggleStatus("ปิดใช้งาน")
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

  ngOnInit() {
    this.readToken();

    this.isLoadingalarmGroups = false;
    this.changeDetection.detectChanges();

    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 961;
  }

  filteredList: any[] = []; // ข้อมูลที่ผ่านการกรอง
  readToken() {
    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/read/0";

    // const apiUrl =
    //   "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/read/0";
    this.http.get<any>(apiUrl).subscribe(
      data => {
        //debugger
        this.tokenList = data.data;

        this.statusOptions = [
          { label: "ทั้งหมด", value: null },
          {
            label: `รอตรวจสอบจากเจ้าหน้าที่ (${this.getStatusCount(1)})`,
            value: 1
          },
          { label: `ตรวจสอบแล้ว (${this.getStatusCount(2)})`, value: 2 },
          { label: `ปฏิเสธ (${this.getStatusCount(-1)})`, value: -1 },
          { label: `ปิดใช้งาน (${this.getStatusCount(0)})`, value: 0 }
        ];
        // เริ่มต้น: ใช้ข้อมูลทั้งหมด
        this.filteredList = [...this.tokenList];
      },
      error => {}
    );
  }

  approve() {
    let userdata = jwt_decode(localStorage.getItem("token"));

    const formatDate = (date: Date | null): string =>
      date
        ? `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}`
        : "";

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/approve";

    debugger;
    this.http
      .post<any>(apiUrl, {
        user_id: this.user_id,
        route_id: this.route_id,
        status: 2,
        admin_id: userdata["id"],
        admin_name: userdata["username"],
        details: this.adminDetails,
        duration: this.selectAdminDuration["value"],
        from_admin_date: formatDate(this.fromAdminDate),
        to_admin_date: formatDate(this.toAdminDate)
      })
      .subscribe(
        data => {
          this.approveDialog = false;
          this.readToken();
        },
        error => {}
      );
  }

  reject() {
    let userdata = jwt_decode(localStorage.getItem("token"));
    const formatDate = (date: Date | null): string =>
      date
        ? `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}`
        : "";

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/approve";

    this.http
      .post<any>(apiUrl, {
        user_id: this.user_id,
        route_id: this.route_id,
        status: -1,
        admin_id: userdata["id"],
        admin_name: userdata["username"],
        details: this.adminDetails,
        duration: this.selectAdminDuration["value"],
        from_admin_date: formatDate(this.fromAdminDate),
        to_admin_date: formatDate(this.toAdminDate)
      })
      .subscribe(
        data => {
          this.approveDialog = false;
          this.readToken();
        },
        error => {}
      );
  }

  close() {
    let userdata = jwt_decode(localStorage.getItem("token"));
    const formatDate = (date: Date | null): string =>
      date
        ? `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}`
        : "";

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/approve";

    this.http
      .post<any>(apiUrl, {
        user_id: this.user_id,
        route_id: this.route_id,
        status: 0,
        admin_id: userdata["id"],
        admin_name: userdata["username"],
        details: this.adminDetails,
        duration: "0",
        from_admin_date: formatDate(this.fromAdminDate),
        to_admin_date: formatDate(this.toAdminDate)
      })
      .subscribe(
        data => {
          this.approveDialog = false;
          this.readToken();
        },
        error => {}
      );
  }

  prepareMenu(group: any, event: Event, menu: any) {
    // กำหนดรายการเมนูตามข้อมูลของ group
    this.itemsAction = [
      {
        label: "เปิดใช้งาน",
        icon: "pi pi-check",
        command: () => this.toggleStatus("เปิดใช้งาน", group)
      },
      {
        label: "ปิดใช้งาน",
        icon: "pi pi-times",
        command: () => this.toggleStatus("ปิดใช้งาน", group)
      }
    ];

    // เปิดเมนู
    menu.toggle(event);
  }

  toggleStatus(status: string, group: any) {
    if (status === "ตรวจสอบรายละเอียด") {
      //debugger
      // this.approve(group.user_id, group.route_id);
      this.requestDetails = group.details;
      this.user_id = group.user_id;
      this.route_id = group.route_id;
      this.selectedDuration = { value: group.duration };
      var index = this.durationOptions.findIndex(
        data => data.value === group.duration.toString()
      );
      this.selectedDuration = this.durationOptions[index];
      this.selectAdminDuration = this.durationOptions[index];
      this.fromDate = this.convertToDate(group.from_at);
      this.toDate = this.convertToDate(group.to_at);
      this.fromAdminDate = this.convertToDate(group.from_at);
      this.toAdminDate = this.convertToDate(group.to_at);
      this.approveDialog = true;
    } else if (status === "ปิดใช้งาน") {
      this.user_id = group.user_id;
      this.route_id = group.route_id;
      this.close();
    } else {
      // คุณสามารถเพิ่มฟังก์ชันสำหรับ "ปิดใช้งาน" ที่นี่
    }
  }

  convertToDate(dateStr: string): Date | null {
    return dateStr ? new Date(dateStr) : null;
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
  }
  hideDialog() {
    this.alarmGroupDialog = false;
    this.submitted = false;
  }
  hideDialog1() {
    this.alarmGroupDialog1 = false;
    this.submitted = false;
  }

  openMenuWithItems(group: any, event: Event, menu: any) {
    this.menuVlue(group); // กำหนดค่าหรืออัปเดต itemsAction
    menu.toggle(event); // เปิดเมนู
  }
  menuVlue(group: any) {
    // อัปเดตรายการเมนู
    this.itemsAction = [
      {
        label: "ตรวจสอบรายละเอียด",
        icon: "pi pi-check",
        command: () => this.toggleStatus("ตรวจสอบรายละเอียด", group)
      },
      {
        label: "ปิดใช้งาน",
        icon: "pi pi-times",
        command: () => this.toggleStatus("ปิดใช้งาน", group)
      }
    ];
  }
  createGroup() {
    if (
      this.alarmGroup.group_name != undefined &&
      this.alarmGroup.group_description != undefined
    ) {
      if (this.emailsendline == null) {
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
      if (this.emailsendline == null) {
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

  statusOptions = [
    { label: "ทั้งหมด", value: null },
    { label: `รอตรวจสอบจากเจ้าหน้าที่ (0)`, value: 1 },
    { label: `ตรวจสอบแล้ว (0)`, value: 2 },
    { label: `ปฏิเสธ (0)`, value: -1 },
    { label: `ปิดใช้งาน (0)`, value: 0 }
  ];

  selectedStatus = this.statusOptions[0]; // กำหนดค่าเริ่มต้นเป็น "ทั้งหมด"
  // selectedStatus: number | null = null; // ตัวเลือกเริ่มต้น

  // filterByStatus(status: number | null): void {
  //     if (status === null) {
  //         // กรองข้อมูลทั้งหมด
  //         this.dt.filterGlobal('', 'contains');
  //     } else {
  //         // กรองตามสถานะ
  //         this.dt.filterGlobal(String(status), 'contains', 'status');
  //     }
  // }

  // ฟังก์ชันสำหรับกรองข้อมูลตาม status
  filterByStatus(status: number): void {
    //debugger;
    if (status === null) {
      // กรองข้อมูลทั้งหมด
      this.filteredList = this.tokenList;
    } else {
      // กรองตามสถานะ
      this.filteredList = this.tokenList.filter(item => item.status === status);
    }
  }

  // ฟังก์ชันสำหรับนับจำนวนสถานะ
  getStatusCount(status: number): number {
    //debugger;
    let count = this.tokenList.filter(item => item.status === status).length;
    return count;
  }

  // ฟังก์ชันสำหรับปิด Dialog
  closeDialog(): void {
    this.approveDialog = false;
  }

  // ฟังก์ชันสำหรับบันทึกข้อมูล
  saveRequest(): void {
    this.approveDialog = false; // ปิด Dialog หลังจากบันทึก
  }
}
