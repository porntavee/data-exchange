import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Product } from "@app/product";
import { ProductService } from "@app/productservice";
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
  datasets?: string;
  description?: string;
  endpoints?: string;
  methods?: string;
  request?: string;
  response?: string;
  query?: string;
  type?: string;
  param1?: string;
  param2?: string;
  param3?: string;
  param4?: string;
  param5?: string;
  param6?: string;
  param7?: string;
  param8?: string;
  param9?: string;
  param10?: string;
  operator1?: string;
  operator2?: string;
  operator3?: string;
  operator4?: string;
  operator5?: string;
  operator6?: string;
  operator7?: string;
  operator8?: string;
  operator9?: string;
  operator10?: string;
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
  selector: "app-d-api",
  templateUrl: "./d-api.component.html",
  styleUrls: ["./d-api.component.css"]
})
export class DApiComponent implements OnInit {
  minutes = [
    { value: 60, name: "60 Minute" },
    { value: 120, name: "120 Minute" },
    { value: 180, name: "180 Minute" }
  ];
  fieldConditions: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // [1, 2, 3, ..., 10]
  // ตัวเลือกเงื่อนไขสำหรับ Dropdown
  conditionOptions = [
    { label: '=', value: '=' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: '!=', value: '!=' }
  ];
  dataSets: any = [
    { "title": 'DSS', "value": '2' },
    { "title": 'ATMS', "value": '3' },
    { "title": 'DSS Vehicle', "value": '4' },
    { "title": 'M-INSIGHT', "value": '5' }
  ];
  selectedDataSets: any;

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

  executeDialog: boolean = false;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private lineGroupService: LineGroupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    public themeService: ThemeService,
    private http: HttpClient
  ) {
    this.titleService.setTitle("API Manager");
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
  openDailog() {
    this.symbolData = [];
    this.alarmGroup = {
      endpoints: "/endpoint-name",
      methods: '["POST","GET"]',
      request: '[{"num": (int, None), "detail": (str, None)}]',
      response: '[{"num": (int, None), "detail": (str, None)}]'
    };
    this.jsonData = [];
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
    this.selectedValues = undefined;
    this.selectedDataSets = undefined;
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
    this.readRoute();

    this.isLoadingalarmGroups = false;
    // this.changeDetection.detectChanges();

  }
  menuVlue(task) {
    this.lineGroupService.valueSource(task);
  }

  // Method ที่มีให้เลือก
  availableMethods: string[] = ['POST', 'GET', 'PUT', 'DELETE'];

  // เก็บ Method ที่ถูกเลือก
  selectedMethods: string[] = [];

  // เก็บข้อมูล Methods ที่ถูกสร้างเป็น JSON String
  methods: string = '';

  // ฟังก์ชันสำหรับเพิ่ม/ลบ Method ที่ถูกเลือก
  toggleMethodSelection(method: string): void {
    const index = this.selectedMethods.indexOf(method);
    if (index > -1) {
      // ลบออกถ้าถูกเลือกซ้ำ
      this.selectedMethods.splice(index, 1);
    } else {
      // เพิ่ม Method ที่ถูกเลือก
      this.selectedMethods.push(method);
    }

    // อัปเดตข้อมูลในรูปแบบ JSON String
    this.alarmGroup.methods = JSON.stringify(this.selectedMethods);
    console.log(this.alarmGroup.methods); // Debug ตรวจสอบค่า
  }
  reboot() {
    let model = {
    };
    const apiUrl = 'https://mpub.linkflow.co.th:4433/api/dynamic_api/reboot';
    this.http.post<any>(apiUrl, model).subscribe(
      data => {
        console.log("Received data:", data);

        // debugger
      },
      error => {
        console.error("Error fetching polygon data:", error);
      }
    );

  }
  tryExecute() {
    let model = {
      "dataset_id": this.selectedDataSets.value,
      "query_string": this.alarmGroup.query
    };

    let jsonStr = JSON.stringify(model);

    const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/tryexecute';
    this.http.post<any>(apiUrl, model).subscribe(
      data => {
        console.log("Received data:", data);
        this.jsonData = data.data;
        // debugger
      },
      error => {
        console.error("Error fetching polygon data:", error);
      }
    );

  }

  tryExecute2(event: Event, param): void {
    this.isLoadingalarmGroups = true;

    event.stopPropagation(); // หยุดการส่งต่อเหตุการณ์ไปยัง <tr>
    let model = {
      "dataset_id": param.dataset_id,
      "query_string": param.query
    };

    let jsonStr = JSON.stringify(model);

    const apiUrl = 'http://127.0.0.1:8000/tryexecute';
    // const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/tryexecute';
    this.http.post<any>(apiUrl, model).subscribe(
      data => {
        console.log("Received data:", data);
        this.jsonData = data.data;
        // debugger
        this.dialogHeader = param.tag + ' Data';
        this.isLoadingalarmGroups = false;
        this.executeDialog = true;
      },
      error => {
        this.dialogHeader = param.tag + ' can not execute. มีบางอย่างผิดพลาด';
        this.isLoadingalarmGroups = false;
        this.executeDialog = true;
        console.error("Error fetching polygon data:", error);
      }
    );

  }

  jsonData: any = [];

  // ดึง keys ของ JSON (ใช้สำหรับหัวตาราง)
  getKeys(): string[] {
    return this.jsonData.length > 0 ? Object.keys(this.jsonData[0]) : [];
  }

  createRoute() {
    // console.log(this.selectedValues)

    let model = {
      "id": 0,
      "tag": this.alarmGroup.tag,
      "methods": this.alarmGroup.methods,
      "datasets": this.selectedDataSets.value,
      "description": this.alarmGroup.description,
      "endpoints": this.alarmGroup.endpoints,
      "request": this.alarmGroup.request,
      "response": this.alarmGroup.response,
      "query": this.alarmGroup.query,
      "type": this.alarmGroup.type,
      "created_by": "string",
      "updated_by": "string",
      "active": 1,
      "param1": this.alarmGroup.param1 ?? "",
      "param2": this.alarmGroup.param2 ?? "",
      "param3": this.alarmGroup.param3 ?? "",
      "param4": this.alarmGroup.param4 ?? "",
      "param5": this.alarmGroup.param5 ?? "",
      "param6": this.alarmGroup.param6 ?? "",
      "param7": this.alarmGroup.param7 ?? "",
      "param8": this.alarmGroup.param8 ?? "",
      "param9": this.alarmGroup.param9 ?? "",
      "param10": this.alarmGroup.param10 ?? "",
      "operator1": this.alarmGroup.operator1 ?? "",
      "operator2": this.alarmGroup.operator2 ?? "",
      "operator3": this.alarmGroup.operator3 ?? "",
      "operator4": this.alarmGroup.operator4 ?? "",
      "operator5": this.alarmGroup.operator5 ?? "",
      "operator6": this.alarmGroup.operator6 ?? "",
      "operator7": this.alarmGroup.operator7 ?? "",
      "operator8": this.alarmGroup.operator8 ?? "",
      "operator9": this.alarmGroup.operator9 ?? "",
      "operator10": this.alarmGroup.operator10 ?? "",
    };

    let jsonStr = JSON.stringify(model);

    // const apiUrl = 'http://127.0.0.1:8000/route/create';
    const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/route/create';
    this.http.post<any>(apiUrl, model).subscribe(
      data => {
        console.log("Received data:", data);
        this.hideDialog();
        this.readRoute();
      },
      error => {
        console.error("Error fetching polygon data:", error);
      }
    );
  }

  readRoute() {
    // console.log(this.selectedValues)

    // const apiUrl = 'http://127.0.0.1:8000/route/read';
    const apiUrl = 'http://127.0.0.1:8000/route/read';
    // const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/route/read';
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        console.log('Received data:', data.data);
        this.alarmGroups = data.data;
      },
      (error) => {
        console.error('Error fetching polygon data:', error);
      }
    );

  }

  readRouteById(param) {

    var index = this.dataSets.findIndex(data => data.value === param.dataset_id.toString());
    this.selectedDataSets = this.dataSets[index]
    const methodsArray = JSON.parse(param.methods);

    // ตั้งค่า selectedValues ด้วยค่าที่ตรงใน availableMethods
    this.selectedValues = this.availableMethods.filter(method => methodsArray.includes(method));
    const apiUrl = 'http://127.0.0.1:8000/route/read/' + param.id;
    // const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/route/read/' + param.id;
    this.http.get<any>(apiUrl).subscribe(
      (data) => {

        console.log('Received data:', data.data);
        this.openDailog();
        this.alarmGroup = data.data;

      },
      (error) => {
        console.error('Error fetching polygon data:', error);
      }
    );

  }

  deleteRoute(routeId: number): void {
    if (confirm('Are you sure you want to delete this route?')) {

      let userdata = jwt_decode(localStorage.getItem("token"));

      // const apiUrl = 'http://127.0.0.1:8000/route/delete';
      const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/route/delete';

      this.http.post(apiUrl, { route_id: routeId, updated_by: userdata["username"] }).subscribe(
        (response: any) => {
          if (response.status === 200) {
            alert('Route deleted successfully.');
            this.hideDialog(); // ปิด Dialog
            this.readRoute(); // โหลดข้อมูลใหม่
          } else {
            alert(`Error: ${response.message}`);
          }
        },
        (error) => {
          console.error('Error deleting route:', error);
          alert('An error occurred while deleting the route.');
        }
      );
    }
  }

  editlistGroup() {
    this.submitted = true;
    // const apiUrl = 'http://127.0.0.1:8000/route/update/' + this.alarmGroup.id;
    const apiUrl = 'https://dpub.linkflow.co.th:4433/api/data-exchange/route/update/' + this.alarmGroup.id;

    let model = {
      "id": 0,
      "tag": this.alarmGroup.tag,
      "methods": this.alarmGroup.methods,
      "datasets": this.selectedDataSets.value,
      "description": this.alarmGroup.description,
      "endpoints": this.alarmGroup.endpoints,
      "request": this.alarmGroup.request,
      "response": this.alarmGroup.response,
      "query": this.alarmGroup.query,
      "type": this.alarmGroup.type,
      "created_by": "string",
      "updated_by": "string",
      "active": 1,
      "param1": this.alarmGroup.param1 ?? "",
      "param2": this.alarmGroup.param2 ?? "",
      "param3": this.alarmGroup.param3 ?? "",
      "param4": this.alarmGroup.param4 ?? "",
      "param5": this.alarmGroup.param5 ?? "",
      "param6": this.alarmGroup.param6 ?? "",
      "param7": this.alarmGroup.param7 ?? "",
      "param8": this.alarmGroup.param8 ?? "",
      "param9": this.alarmGroup.param9 ?? "",
      "param10": this.alarmGroup.param10 ?? "",
      "operator1": this.alarmGroup.operator1 ?? "",
      "operator2": this.alarmGroup.operator2 ?? "",
      "operator3": this.alarmGroup.operator3 ?? "",
      "operator4": this.alarmGroup.operator4 ?? "",
      "operator5": this.alarmGroup.operator5 ?? "",
      "operator6": this.alarmGroup.operator6 ?? "",
      "operator7": this.alarmGroup.operator7 ?? "",
      "operator8": this.alarmGroup.operator8 ?? "",
      "operator9": this.alarmGroup.operator9 ?? "",
      "operator10": this.alarmGroup.operator10 ?? "",
    };

    this.http.put<any>(`${apiUrl}`, model).subscribe(
      (response) => {
        if (response.status === 200) {

          console.log('Update successful:', response.message);

          this.hideDialog();
          this.readRoute();
        } else {

          console.warn('Update failed:', response.message);
        }
      },
      (error) => {

        console.error('Error updating route:', error);
      }
    );
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
}
