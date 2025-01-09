import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import { Title } from "@angular/platform-browser";
import { LineGroupService } from "@app/linegroupservice";
import { InputSwitchModule } from "primeng/inputswitch";
import { ThemeService } from "app/theme.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { threadId } from "worker_threads";
import jwt_decode from "jwt-decode";
// import { DApiUseService } from "@app/d-api-use.service";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { of, Subject } from "rxjs";
import { switchMap, catchError, takeUntil } from "rxjs/operators";

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
  statusAPI?: string;
}

export interface routeAPI {
  id?: number;
  tag?: string;
  endpoints?: string;
  methods?: string;
  status?: string;
  data?: string;
  statusAPI?: string;
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
  private unsubscribe$ = new Subject<void>();
  private abortController: AbortController | null = null;
  private abortControllers: AbortController[] = [];
  userGroup: any;
  isMobile: boolean = false;
  descriptionDialogVisible: boolean = false;
  selectedDescription: string | null = null;
  cancel$ = new Subject<void>(); // ตัวแปรนี้จะถูกใช้เพื่อยกเลิกคำร้อง API
  cancelRequests: Subject<void>[] = []; // เก็บ Subject สำหรับยกเลิกคำร้อง API

  roleType = [
    {
      id: 1,
      name: "ประชาชน",
      adminwebname: "กลุ่มเจ้าหน้าที่ทั่วไป",
      adminwebshow: 1,
      admindssshow: 1
    },
    {
      id: 2,
      name: "vip",
      adminwebname: "vip",
      adminwebshow: 0,
      admindssshow: 1
    },
    {
      id: 3,
      name: "หน่วยกู้ภัยสุวรรณภูมิ",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยสุวรรณภูมิ",
      adminwebshow: 2,
      admindssshow: 1
    },
    {
      id: 4,
      name: "หน่วยกู้ภัยบางปะกง",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยบางปะกง",
      adminwebshow: 3,
      admindssshow: 1
    },
    {
      id: 5,
      name: "หน่วยกู้ภัยคลองหลวง",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยคลองหลวง",
      adminwebshow: 4,
      admindssshow: 1
    },
    {
      id: 6,
      name: "หน่วยกู้ภัยรามอินทรา",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยรามอินทรา",
      adminwebshow: 5,
      admindssshow: 1
    },
    {
      id: 7,
      name: "ตำรวจ",
      adminwebname: "กลุ่มตำรวจทางหลวง",
      adminwebshow: 7,
      admindssshow: 1
    },
    {
      id: 8,
      name: "MA",
      adminwebname: "MA",
      adminwebshow: 0,
      admindssshow: 1
    },
    {
      id: 9,
      name: "CCB ลาดกระบัง",
      adminwebname: "CCB ลาดกระบัง",
      adminwebshow: 0,
      admindssshow: 1
    },
    {
      id: 10,
      name: "CCB พัทยา",
      adminwebname: "CCB พัทยา",
      adminwebshow: 0,
      admindssshow: 1
    },
    {
      id: 11,
      name: "หน่วยกู้ภัยแหลมฉบัง",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยแหลมฉบัง",
      adminwebshow: 6,
      admindssshow: 1
    },
    {
      id: 12,
      name: "cctv test",
      adminwebname: "cctvtest",
      adminwebshow: 8,
      admindssshow: 1
    },
    {
      id: 13,
      name: "หมวดคลองหลวง",
      adminwebname: "หมวดคลองหลวง",
      adminwebshow: 9,
      admindssshow: 1
    },
    {
      id: 14,
      name: "หมวดคันนายาว",
      adminwebname: "หมวดคันนายาว",
      adminwebshow: 10,
      admindssshow: 1
    },
    {
      id: 15,
      name: "หมวดลาดกระบัง",
      adminwebname: "หมวดลาดกระบัง",
      adminwebshow: 11,
      admindssshow: 1
    },
    {
      id: 16,
      name: "หมวดพานทอง",
      adminwebname: "หมวดพานทอง",
      adminwebshow: 12,
      admindssshow: 1
    },
    {
      id: 17,
      name: "หมวดแหลมฉบัง",
      adminwebname: "หมวดแหลมฉบัง",
      adminwebshow: 13,
      admindssshow: 1
    },
    {
      id: 18,
      name: "หมวดพัทยา",
      adminwebname: "หมวดพัทยา",
      adminwebshow: 14,
      admindssshow: 1
    },
    {
      id: 19,
      name: "มาบตาพุด",
      adminwebname: "มาบตาพุด",
      adminwebshow: 15,
      admindssshow: 1
    },
    {
      id: 25,
      name: "ตำรวจอ่อนนุช",
      adminwebname: "ตำรวจอ่อนนุช",
      adminwebshow: 16,
      admindssshow: 1
    },
    {
      id: 26,
      name: "ตำรวจเขาดิน",
      adminwebname: "ตำรวจเขาดิน",
      adminwebshow: 17,
      admindssshow: 1
    },
    {
      id: 27,
      name: "ตำรวจเขาเขียว และมาบประชัน",
      adminwebname: "ตำรวจเขาเขียว และมาบประชัน",
      adminwebshow: 18,
      admindssshow: 1
    },
    {
      id: 28,
      name: "Test",
      adminwebname: "Test",
      adminwebshow: 19,
      admindssshow: 1
    },
    {
      id: 29,
      name: "",
      adminwebname: "",
      adminwebshow: 20,
      admindssshow: 1
    }
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
  apiSubscription: any;
  filteredGroups: routeAPI[];
  apiSubscriptions: Subscription[] = [];
  userGroupCheck: any;
  searchText: any;
  today: Date = new Date(); // วันปัจจุบัน
  isReadOnly: boolean;
  isLoadingData: boolean;
  rangeDates: any;
  isActive: boolean = true;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private lineGroupService: LineGroupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    public themeService: ThemeService,
    private http: HttpClient,

    // private DApiService: DApiUseService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // ยกเลิกการเรียก API เมื่อมีการเปลี่ยนเส้นทาง
        if (this.apiSubscription) {
          this.apiSubscription.unsubscribe();
        }
      }
    });
    this.titleService.setTitle("API Library");
    this.itemsAction = [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: event => this.openEditDialog(this.selectedGroups)
      }
    ];
  }

  getUserGroup(userdata, roleType) {
    // หา roleType ที่ตรงกับ cctv_group ของ userdata
    const matchedRole = roleType.find(role => role.id === userdata.cctv_group);

    if (matchedRole) {
      const name = matchedRole.name;

      // เงื่อนไข VIP, กู้ภัย, หมวด
      if (["VIP", "กู้ภัย", "หมวด"].some(term => name.includes(term))) {
        this.userGroupCheck = "DOH";
        return;
      }

      // เงื่อนไข ตำรวจ
      if (name.includes("ตำรวจ")) {
        this.userGroupCheck = "POL";
        return;
      }
    }

    // เงื่อนไข username ที่ตรงกับรายชื่อพิเศษ
    const specialUsers = [
      "charoenwasit",
      "panuwat",
      "saengdao",
      "Palm",
      "sk",
      "minsight"
    ];

    if (specialUsers.includes(userdata.user_name)) {
      this.userGroupCheck = "develop";
      return;
    }

    // กรณีที่ไม่เข้าเงื่อนไขใด ๆ
    this.userGroupCheck = "general";
  }

  // หา roleType ที่ตรงกับ cctv_group ของ userdata

  setSelectedGroup(group: any) {
    this.selectedGroups = group;
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
    // this.selectedDuration = { value: param.duration };
    // var index = this.durationOptions.findIndex(
    //   data => data.value === param.duration.toString()
    // );
    // this.selectedDuration = this.durationOptions[index];
    this.selectedDuration = "0";
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
    this.readToken();
    this.readRoute();
    this.checkIfMobile();
    this.intervalId = setInterval(() => {
      this.readRoute();
    }, 5 * 60 * 1000);
    let userdata = jwt_decode(localStorage.getItem("token"));
    this.userGroup = this.getUserGroup(userdata, this.roleType);
    this.isLoadingalarmGroups = false;
    this.changeDetection.detectChanges();
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize.bind(this));
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.apiSubscriptions.forEach(sub => sub.unsubscribe());
    this.cancelRequests.forEach(cancel$ => cancel$.next());
    this.cancelRequests = [];
    this.isActive = false;
    window.removeEventListener("resize", this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 960;
  }

  getFilteredGroups() {
    if (!this.searchText) {
      return this.alarmGroups;
    }

    return this.alarmGroups.filter(
      group =>
        group.tag.toLowerCase().includes(this.searchText.toLowerCase()) ||
        group.endpoints.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers = [];
  }

  async tryExecute2(
    event: Event,
    param: any,
    skipDialog: boolean = false,
    index
  ): Promise<void> {
    if (this.userGroupCheck !== "develop") {
      return;
    }
    this.isLoadingalarmGroups = true;

    event?.stopPropagation();

    const cancel$ = new Subject<void>();
    this.cancelRequests.push(cancel$);
    this.cancel$ = cancel$;
    let model = {
      dataset_id: param.dataset_id,
      query_string: param.query
    };
    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/tryexecute";

    try {
      await of(null)
        .pipe(
          switchMap(() =>
            this.http
              .post<any>(apiUrl, model, {
                headers: new HttpHeaders(),
                params: new HttpParams(),
                observe: "response"
              })
              .pipe(
                takeUntil(cancel$),
                catchError(error => {
                  if (error.name === "AbortError") {
                    console.log("API request was aborted");
                  }
                  this.alarmGroups[index].statusAPI = "Error";
                  this.alarmGroups[index].data = "Error";
                  return of(error);
                })
              )
          )
        )
        .toPromise()
        .then(response => {
          const data = response.body;
          this.alarmGroups[index].statusAPI = data.status;
          this.alarmGroups[index].data = data.data.length;
        })
        .catch(error => {
          console.error(error);
          this.isLoadingalarmGroups = false;
        })
        .finally(() => {
          this.isLoadingalarmGroups = false;
        });
    } catch (error) {
      console.error(error);
      this.isLoadingalarmGroups = false;
    }
  }

  cancelRequestOnPageChange(cancel$: Subject<void>) {
    cancel$.next();
  }

  async readRoute() {
    let userdata = jwt_decode(localStorage.getItem("token"));

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/route/read_library/" +
      userdata["id"];

    try {
      const data = await this.http.get<any>(apiUrl).toPromise();
      const activeGroups = data.data.filter(element => element.active === true);

      this.alarmGroups = activeGroups;

      for (let index = 0; index < activeGroups.length; index++) {
        if (!this.isActive) {
          break;
        }

        const group = activeGroups[index];
        await this.tryExecute2(new Event("init"), group, true, index);
      }
    } catch (error) {}
  }

  async readRoute2() {
    let userdata = jwt_decode(localStorage.getItem("token"));

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/route/read_library/" +
      userdata["id"];

    return new Promise<void>((resolve, reject) => {
      this.http.get<any>(apiUrl).subscribe(
        data => {
          const activeGroups = data.data.filter(
            element => element.active === true
          );

          activeGroups.forEach((group, index) => {});
          this.alarmGroups = activeGroups;

          resolve();
        },
        error => {
          reject(error);
        }
      );
    });
  }

  async readToken() {
    this.isLoadingData = true;
    let userdata = jwt_decode(localStorage.getItem("token"));

    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/read/" +
      userdata["id"];
    this.http.get<any>(apiUrl).subscribe(
      data => {
        this.isLoadingData = false;
        this.tokenList = data.data;
      },
      error => {}
    );
  }

  async createToken() {
    const formatDate = (date: Date | null): string =>
      date
        ? `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}`
        : "";
    // ตรวจสอบว่า fromDate และ toDate มีค่าหรือไม่
    if (!this.fromDate || !this.toDate) {
      this.messageService.add({
        severity: "error",
        summary: "Invalid Date",
        detail: "กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุดให้ครบถ้วน"
      });
      return;
    }

    // ตรวจสอบว่า fromDate มากกว่า toDate หรือไม่
    if (this.fromDate > this.toDate) {
      this.messageService.add({
        severity: "error",
        summary: "Invalid Date Range",
        detail: "วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด"
      });
      return;
    }
    let userdata = jwt_decode(localStorage.getItem("token"));
    const apiUrl =
      "https://dss.motorway.go.th:4433/dxc/api/data-exchange/token/create";
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
        async data => {
          this.requestDialog = false;

          // เรียก readRoute และรอให้เสร็จ
          await this.readRoute2();

          // เรียก readToken ต่อเมื่อ readRoute เสร็จ
          await this.readToken();
        },
        error => {}
      );
  }

  apiResults: {
    name: string;
    statusAPI: string;
    dataAmount: number | null;
  }[] = [];

  filterGlobal(value: string) {
    this.filteredGroups = [...this.alarmGroups];
    const searchTerm = value.toLowerCase();
    this.filteredGroups = this.alarmGroups.filter(
      group =>
        group.tag.toLowerCase().includes(searchTerm) ||
        group.endpoints.toLowerCase().includes(searchTerm) ||
        group.data.toLowerCase().includes(searchTerm)
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
    this.requestDetails = "";
    this.selectedDuration = "0";
    this.rangeDates = undefined;
    this.api_id = param.api_id;
  }

  openEditDialog(param) {
    if (!param) {
      return;
    }

    this.requestDialog = true;
    this.toDate = undefined;
    this.rangeDates = undefined;
    // ปลดล็อค readonly
    this.isReadOnly = false;

    this.api_id = param.route_id;
    this.requestDetails = param.details;
    this.selectedDuration = "0";
    console.log("Hi");
    this.fromDate = param.from_at
      ? this.convertToDate(param.from_at)
      : undefined;
    this.toDate = param.to_at ? this.convertToDate(param.to_at) : undefined;
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768; // ตรวจสอบว่าหน้าจอกว้าง <= 768px หรือไม่
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  showDescription(description: string): void {
    this.selectedDescription = description;
    this.descriptionDialogVisible = true;
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
    this.requestDialog = false; // ปิด Dialog หลังจากบันทึก
  }
}
