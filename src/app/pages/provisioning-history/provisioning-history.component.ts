import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TaskService } from "app/task.service";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { ProvisioningHistoryService } from "./provisioning-history.service";
import { start } from "repl";
import * as FileSaver from "file-saver";
import { type } from "jquery";
// import {} "../../app/pages/device-information/device-information.component.ts"
import { DeviceInformationComponent } from "../device-information/device-information.component";
import { DeviceService } from "@app/device.service";
import { Table } from "primeng/table";
import { ThemeService } from "app/theme.service";
import * as xlsx from "xlsx";

export interface ProvisioningHistoryTable {
  id?: any;
  uplink_ip?: string;
  suggested_ip?: string;
  script?: string;
  latitude?: number;
  longitude?: number;
  mac?: string;
  model?: string;
  state?: string;
  updated_by?: string;
  username?: string;
  created_at?: string;
}
interface getconfig_table {
  filename?: string;
}

interface dateType {
  name: string;
  id: number;
}

interface dateInput {
  start_date?: string;
  end_date?: string;
}

export interface ScheduleTable {
  start_date?: string;
}
interface DeviceType {
  name: string;
  id: number;
}

interface ZTPMode {
  name: string;
}

interface edgeModel {
  model: string;
}

interface uplink {
  HOSTNAME?: string;
  IPADDRESS?: string;
  IRCNETNODEID?: number;
  ISPINGOK?: number;
  iRCNETypeID?: string;
  symbol_name3?: string;
}
interface PortType {
  interface?: string;
  decription?: string;
  id?: number;
}
@Component({
  selector: "app-provisioning-history",
  templateUrl: "./provisioning-history.component.html",
  styleUrls: ["./provisioning-history.component.scss"]
})
export class ProvisioningHistoryComponent {
  provisioningHistory: ProvisioningHistoryTable[];
  forExport: ProvisioningHistoryTable[];
  provisionTask: ProvisioningHistoryTable = {};
  provisionTaskDialog: boolean;
  provisionTaskDialogLocation: boolean;

  dialogHeader: string;
  waitingState: boolean;
  doneState: boolean;
  options: any;
  overlays: any[];
  checkmap: boolean = false;
  checkmapDialog: boolean = false;
  checkmaps: boolean = false;
  display: boolean = false;
  dateTypeModes: dateType[];
  selectedDateTypeMode: dateType;
  selectedZTPMode: any;
  ztpTypeModes: ZTPMode[];
  ztpEdgeModels: edgeModel[];
  dateParameter: dateInput;
  startValue: Date;
  endValue: Date;
  rangeDates: Date[];
  startDate: string;
  endDate: string;
  endDayWeekly: string = "";
  invalid: string;
  maps: google.maps.Map;
  provissionDialog: boolean = false;
  selectedDeviceType: any;
  uplink: uplink[];
  label: boolean = false;
  label2: boolean = false;
  selectedUplink: uplink;
  uplinkList: uplink[];
  iRCNETypeID: string;
  exceptIP: string = "";
  IP: string;
  parent_id: string;
  management_ip: string;
  script: string;
  loadingspiner: boolean = false;
  port_des1: PortType[] = [];
  port_des: any[] = [];
  port_lable: string = "";
  port_uplink: string;
  selectedPosition: any;
  latitude: any = "";
  longitude: any = "";
  markerTitle: string;
  options1: any;
  overlays1: any[];
  defualt_overlays: any = [];
  date: any;
  scheduleTask: ScheduleTable = {};
  spinner: boolean = false;
  MACremote: string = "";
  selectedDeviceTypes: DeviceType;
  deviceTypes: DeviceType[] = [];
  modelType: string;
  HOSTNAME: string;
  invinvalid: string;
  invinvalid1: string;
  invinvalid3: string;
  invinvalid2: string;
  invinvalidDate: string;
  invalidcheckmap: boolean = false;
  management_ip_ADD: number;
  inserted_id: string;
  suggested_ip: string;
  configResults: string;
  beforeLoading: boolean = true;
  afterClick: boolean = false;
  beforeLoadingPing: boolean = true;
  afterClickPing: boolean = false;
  loadspinnerPing: boolean = false;
  pingResults: boolean;
  beforePingCommand: boolean = true;
  pingcheck: boolean = false;
  number: number;
  loading: boolean = false;
  uplink_ip: string;
  command_result: string;
  command_results: string;
  displayRecovery: boolean = false;
  DeviceInformationComponent: any;
  username: string;
  password: string;
  username1: string = "raisecom";
  password1: string = "raisecom";
  getConfigDialog: boolean = false;
  iconsave: string;
  getconfig_table: getconfig_table = ({} = {});
  getconfig_tables: getconfig_table[] = [];
  IPRecovery: string;
  action_Dialog2: boolean = false;
  loadingcheck: boolean = true;
  device_ip: string;
  getverifyDialog: boolean = false;
  resultView: string;
  password_verify: string;
  checks: boolean = false;
  activeState: boolean[] = [true];
  noInfo: boolean = true;
  themeValue: string = this.themeService.theme;
  displayZTP: boolean = false;
  atOnceOption: boolean = false;
  dformat: string;
  fixIP: string;
  provisioningStateArr: any[] = [];
  selectedEdgeModels: string;
  actionItems: MenuItem[] | undefined;
  itemsAction: MenuItem[];
  constructor(
    private ChangeDetection: ChangeDetectorRef,
    private provisioningHistoryService: ProvisioningHistoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private deviceService: DeviceService,
    public themeService: ThemeService
  ) {
    this.actionItems = [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Location",
            icon: "pi pi-fw pi-map-marker",
            command: event => {
              // this.lineread(this.group)
            }
          },
          {
            label: "Information",
            icon: "pi pi-fw pi-info",
            command: event => {
              // this.editline(this.group)
            }
          },
          {
            label: "Recovery",
            icon: "pi pi-fw pi-refresh",
            command: event => {
              // this.deleteGroup(this.group)
            }
          }
        ]
      }
    ];
    // this.dateParameter.start_date = "";
    // this.dateParameter.end_date = "";
    this.titleService.setTitle("SED-Provisioning History");
    this.dateTypeModes = [
      { name: "daily", id: 0 },
      { name: "weekly", id: 1 },
      { name: "monthly", id: 2 }
    ];
    // this.ztpTypeModes = [{ name: "Custom" }, { name: "At Once" }];
  }

  ngOnInit(): void {
    this.themeService.currentpage("/provisioninghistory");
    // this.initOverlays();

    //Get data from API
    this.provisioningHistoryService.currentMessage.subscribe(provisionTask => {
      if (provisionTask != undefined) {
        this.itemsAction = [
          {
            label: "provisionTask",
            items: [
              {
                label: "Location",
                icon: "pi pi-fw pi-map-marker",
                command: event => {
                  this.provisionTaskShowLocation(provisionTask);
                }
              },
              {
                label: "Information",
                icon: "pi pi-fw pi-info",
                command: event => {
                  this.provisionTaskRead(provisionTask);
                }
              },
              {
                label: "Recovery",
                icon: "pi pi-fw pi-refresh",
                command: event => {
                  this.provisionTaskRecovery(provisionTask);
                }
              }
            ]
          }
        ];
      }
    });
    this.initOverlays();
    this.provisioningHistoryfunc();
  }
  menuVlue(task) {
    this.provisioningHistoryService.valueSource(task);
  }
  actionItem(provisionTask: ProvisioningHistoryTable) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Location",
            icon: "pi pi-fw pi-map-marker",
            command: event => {
              this.provisionTaskShowLocation(provisionTask);
            }
          },
          {
            label: "Information",
            icon: "pi pi-fw pi-info",
            command: event => {
              this.provisionTaskRead(provisionTask);
            }
          },
          {
            label: "Recovery",
            icon: "pi pi-fw pi-refresh",
            command: event => {
              this.provisionTaskRecovery(provisionTask);
            }
          }
        ]
      }
    ];
  }

  provisioningHistoryfunc() {
    this.provisioningHistoryService.getProvisioningHistory().subscribe({
      next: data => {
        this.provisioningHistory = data;
        var provisioningState = data.map(function(singleElement) {
          return singleElement.state;
        });
        let findDuplicates = arr =>
          arr.filter((item, index) => arr.indexOf(item) == index);
        var listState = [...new Set(findDuplicates(provisioningState))];
        this.provisioningStateArr.push(...listState);
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
  clear(table: Table) {
    table.clear();
  }
  onChangeDateTypeMode(event) {
    console.log("HI onChange");
    console.log(this.startDate);
    this.startDate = undefined;
    this.startValue = undefined;
  }

  onChangePort(event) {
    this.port_uplink = event.value.port;
    this.label2 = true;
    this.port_lable = event.value.description;
    this.invinvalid3 = "";
    // console.log(this.port_lable)
  }
  initOverlays() {
    if (!this.overlays1 || !this.overlays1.length) {
      this.overlays1 = this.defualt_overlays.slice();
    }

    //console.log(this.overlays)
  }
  onSelectMethod(event) {
    var dateObj = new Date(event);
    var dformat =
      dateObj.getFullYear() +
      "-" +
      ("00" + (dateObj.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + dateObj.getDate()).slice(-2) +
      " " +
      ("00" + dateObj.getHours()).slice(-2) +
      ":" +
      ("00" + dateObj.getMinutes()).slice(-2) +
      ":" +
      ("00" + dateObj.getSeconds()).slice(-2);
    this.date = dformat;
    console.log(this.date);
    this.invinvalidDate = "";
  }
  hideDialog2() {
    this.getverifyDialog = false;
    this.loadingcheck = true;
    this.loadingspiner = false;
    this.invalid = "";
  }
  reboot(getconfig_table: getconfig_table) {
    if (this.password_verify != undefined && this.password_verify != "") {
      this.getconfig_table.filename = getconfig_table.filename;
      this.invalid = "";
      // this.device_ip = "10.208.59.45";
      this.loadingcheck = false;
      this.loadingspiner = true;

      this.provisioningHistoryService
        .verifyPassword(this.password_verify)
        .subscribe({
          next: result => {
            if (result.detail == "Pass") {
              this.getverifyDialog = false;
              this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: result.detail,
                life: 3000
              });

              this.provisioningHistoryService
                .rebootpPush(
                  this.username1,
                  this.password1,
                  this.device_ip,
                  this.checks,
                  this.getconfig_table.filename
                )
                .subscribe({
                  next: result => {
                    this.action_Dialog2 = false;
                    this.loadingcheck = true;
                    this.loadingspiner = false;
                    setTimeout(() => {
                      this.messageService.add({
                        severity: "success",
                        summary: "Successful",
                        detail: "Push Successful",
                        life: 3000
                      });
                    }, 2000);
                  },
                  error: error => {
                    if (error) {
                      setTimeout(() => {
                        this.action_Dialog2 = false;
                        this.messageService.add({
                          severity: "error",
                          summary: "Error",
                          detail: error.message,
                          life: 3000
                        });
                      }, 2000);
                    }
                    if (error.status == 401) {
                      setTimeout(() => {
                        this.messageService.add({
                          severity: "error",
                          summary: "Error",
                          detail:
                            "Session expired, please logout and login again.",
                          life: 3000
                        });
                      }, 2000);
                    }
                  }
                });
            } else {
              this.getverifyDialog = true;
              this.action_Dialog2 = true;
              this.messageService.addAll([
                { severity: "error", summary: "Error", detail: result.detail },
                {
                  severity: "error",
                  summary: "Error",
                  detail: "invalid password, Please enter your password again."
                }
              ]);
            }
          },
          error: error => {
            if (error) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.message
              });
            }
            if (error.status == 401) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Session expired, please logout and login again."
              });
            }
          }
        });
    } else if (
      this.password_verify == undefined ||
      this.password_verify == ""
    ) {
      this.invalid = "ng-invalid ng-dirty";
    }
  }
  onChangeIPRecovery(event) {
    this.IPRecovery = event.value.res_id;
    this.device_ip = event.value.symbol_name3;
    // console.log(event.value)
    this.provisioningHistoryService
      .getconfigFile(this.IPRecovery)
      .subscribe(result => {
        this.getconfig_tables = result;
      });
  }
  array_data = [];
  onChangeIP(event) {
    this.label = true;
    this.label2 = false;
    this.port_lable = "";
    this.invinvalid = "";
    this.iRCNETypeID = event.value.iRCNETypeID;
    this.HOSTNAME = event.value.HOSTNAME;
    this.IP = event.value.IPADDRESS;
    this.parent_id = event.value.IRCNETNODEID;
    // console.log(this.IP);

    this.provisioningHistoryService.getSysInterface(this.IP).subscribe({
      next: result => {
        var filterPC = result.data.filter(item => !item.if_name.includes('PC'));
        filterPC.forEach(list => {
          if (!list.ifName.includes("PC")) {
            let modifiedIfName = list.ifName.replace(/([a-zA-Z])(\d)/g, '$1 $2');
            var array_data1 = {
              port: modifiedIfName,
              ifIndex: list.ifIndex
            };
    
            this.array_data.push(array_data1);
          }
          this.array_data.sort((a, b) => a.port.localeCompare(b.port, undefined, { numeric: true }));
        });
        // this.port_des1 = result.interfaces;
        // this.port_des1.forEach(port => {
        //   var portlist = result.interfaces.filter(
        //     data => data.interface == port.interface
        //   );
        //   this.port_des.push(...portlist);
        // });

        // this.port_des.forEach(port => {
        //   var str = port.interface;
        //   var re = str.replace("port ", "");
        //   port.id = Number(re);
        //   // console.log(port)
        //   var index = this.port_des1.findIndex(
        //     data => data.interface == port.interface
        //   );
        //   this.port_des1.splice(index, 1);
        // });
        // this.port_des1.push(...this.port_des);
        // this.port_des1.sort((a, b) => a.id - b.id);
        // console.log(this.port_des1);
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
    // console.log(event)
  }

  provisionTaskRead(provisionTask: ProvisioningHistoryTable) {
    this.provisionTask = provisionTask;
    this.provisionTaskDialog = true;
    this.dialogHeader = "Provision History Information";
    // console.log(typeof this.provisionTask.created_at);
  }
  Done_provisioning() {
    if (this.selectedDeviceTypes.id == 0){
      if (
        this.IP != undefined &&
        //this.exceptIP != undefined &&
        this.MACremote != undefined &&
        this.port_uplink != undefined &&
        this.latitude != undefined &&
        this.longitude != undefined &&
        this.latitude != "" &&
        this.longitude != "" &&
        this.date != undefined
      ) {
        this.invinvalid = "";
        this.invinvalid1 = "";
        this.invinvalid2 = "";
        this.invinvalid3 = "";
        this.invinvalidDate = "";
        this.spinner = true;
  
        this.generateConfig();

      } else {
        if (this.IP != undefined) {
          this.invinvalid = "";
        } else {
          this.invinvalid = "ng-invalid ng-dirty";
        }
        if (this.exceptIP != undefined) {
          this.invinvalid2 = "";
        } else {
          this.invinvalid2 = "ng-invalid ng-dirty";
        }
        // this.invinvalid = "ng-invalid ng-dirty";
        this.spinner = false;
        this.invinvalid1 = "ng-invalid ng-dirty";
        this.invinvalid3 = "ng-invalid ng-dirty";
        this.invinvalidDate = "ng-invalid ng-dirty";
        if (this.latitude != "" && this.longitude != "") {
          this.invalidcheckmap = false;
        } else {
          this.invalidcheckmap = true;
        }

        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Invalid Data !!"
        });
      }
    } else {
      if (
        this.IP != undefined &&
        //this.exceptIP != undefined &&
        this.port_uplink != undefined &&
        this.latitude != undefined &&
        this.longitude != undefined &&
        this.latitude != "" &&
        this.longitude != "" &&
        this.date != undefined
      ) {
        this.invinvalid = "";
        this.invinvalid1 = "";
        this.invinvalid2 = "";
        this.invinvalid3 = "";
        this.invinvalidDate = "";
        this.spinner = true;
  
        this.generateConfig();

      } else {
        if (this.IP != undefined) {
          this.invinvalid = "";
        } else {
          this.invinvalid = "ng-invalid ng-dirty";
        }
        if (this.exceptIP != undefined) {
          this.invinvalid2 = "";
        } else {
          this.invinvalid2 = "ng-invalid ng-dirty";
        }
        // this.invinvalid = "ng-invalid ng-dirty";
        this.spinner = false;
        this.invinvalid1 = "ng-invalid ng-dirty";
        this.invinvalid3 = "ng-invalid ng-dirty";
        if (this.date == undefined){
          this.invinvalidDate = "ng-invalid ng-dirty";
        } else {
          this.invinvalidDate = "";
        }
        
        if (this.latitude != "" && this.longitude != "") {
          this.invalidcheckmap = false;
        } else {
          this.invalidcheckmap = true;
        }

        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Invalid Data !!"
        });
      }
    }
  }
  hideDialog1() {
    this.action_Dialog2 = false;
  }
  callPush(getconfig_table: getconfig_table) {
    this.action_Dialog2 = true;
    this.dialogHeader = "Configuration history";
    // this.device_ip = "10.208.59.45";
    this.loadingspiner = false;
    this.loadingcheck = true;
    this.getconfig_table.filename = getconfig_table.filename;
    this.deviceService
      .getview(this.device_ip, this.getconfig_table.filename)
      .subscribe({
        next: result => {
          this.resultView = result;
        },
        error: error => {
          if (error) {
            this.resultView = error.message;
          }
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
  verify() {
    this.getverifyDialog = true;
    this.loadingspiner = true;
    this.loadingcheck = false;
  }
  handleMapClick(event) {
    this.selectedPosition = event.latLng;
    this.checkmapDialog = true;
    var index = this.overlays1.length - 1;
    this.latitude = this.selectedPosition.lat();
    this.longitude = this.selectedPosition.lng();
    this.invalidcheckmap = false;
    if (this.overlays1.length > 0) {
      this.overlays1.splice(index, 1);
      this.overlays1.push(
        new google.maps.Marker({
          position: {
            lat: this.selectedPosition.lat(),
            lng: this.selectedPosition.lng()
          },
          title: this.markerTitle
        })
      );
    } else if (this.overlays1.length < 1) {
      // this.overlays.splice(index,1)
      this.overlays1.push(
        new google.maps.Marker({
          position: {
            lat: this.selectedPosition.lat(),
            lng: this.selectedPosition.lng()
          },
          title: this.markerTitle
        })
      );
    }
    // this.overlays.splice(index,1)
    // this.overlays.push(new google.maps.Marker({position:{lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng()}, title:this.markerTitle}));
    this.markerTitle = null;
  }
  handleMapClick2(event) {
    this.selectedPosition = event.latLng;
    this.checkmapDialog = true;
    var index = this.overlays1.length - 1;
    this.latitude = this.selectedPosition.lat();
    this.longitude = this.selectedPosition.lng();
    this.invalidcheckmap = false;
    if (this.overlays1.length > 0) {
      this.overlays1.splice(index, 1);
      this.overlays1.push(
        new google.maps.Marker({
          position: {
            lat: this.selectedPosition.lat(),
            lng: this.selectedPosition.lng()
          },
          title: this.markerTitle
        })
      );
    } else if (this.overlays1.length < 1) {
      // this.overlays.splice(index,1)
      this.overlays1.push(
        new google.maps.Marker({
          position: {
            lat: this.selectedPosition.lat(),
            lng: this.selectedPosition.lng()
          },
          title: this.markerTitle
        })
      );
    }
    // this.overlays.splice(index,1)
    // this.overlays.push(new google.maps.Marker({position:{lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng()}, title:this.markerTitle}));
    this.markerTitle = null;
  }
  setMap(event) {
    this.maps = event.map;
    // console.log(event)
  }
  cancel() {
    this.invinvalid = "";
    this.invinvalid1 = "";
    this.invinvalid2 = "";
    this.invinvalid3 = "";
    this.invinvalidDate = "";
    this.overlays = [];
    this.selectedUplink = undefined;
    this.management_ip = "";
    this.exceptIP = "";
    this.suggested_ip = "";
    this.script = "";
    this.modelType = "";
    this.port_des1 = [];
    this.scheduleTask.start_date = "";
    this.latitude = "";
    this.longitude = "";
    this.MACremote = "";
    this.checkmapDialog = false;
    this.invalidcheckmap = false;
    this.checkmaps = false;
    this.checkmap = false;
    this.overlays1 = [];
  }
  showportgenerate:boolean = true;
  onChangeModel(event) {
    // console.log(event)
    // this.selectedDeviceTypes = event.value.name;
    if (event.value.id == 0){
      this.showportgenerate = true;
    } else {
      this.showportgenerate = false;
    }
    // console.log(this.selectedDeviceTypes)
  }
  openNewZTP() {
    this.displayZTP = true;
    this.dialogHeader = "Add new ZTP";
    this.ztpTypeModes = [{ name: "Immediately" }, { name: "Schedule" }];
    this.ztpEdgeModels = [
      { model: "711A" },
      { model: "711B" },
      { model: "711L" },
      { model: "26xx" }
    ];
    this.selectedZTPMode;
    if (this.selectedZTPMode === "Immediately") {
      this.atOnceOption = false;
    }
    console.log(this.selectedZTPMode === "Immediately");

    console.log(this.selectedZTPMode);
    this.provisioningHistoryService.getUplinkDevice().subscribe({
      next: data => {
        this.uplink = data;
        // console.log(data)
        this.uplinkList = [
          {
            IPADDRESS: data.IPADDRES,
            HOSTNAME: data.HOSTNAME,
            iRCNETypeID: data.iRCNETypeID,
            ISPINGOK: data.ISPINGOK
          }
        ];
        this.selectedUplink = this.uplinkList[0];
        console.log(this.selectedUplink);
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

  onChangeZTPMode(event) {
    console.log(this.startValue);

    let startDate = new Date(Date.parse(event));
    let dformat =
      [
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getFullYear()
      ].join("-") +
      " " +
      [
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds()
      ].join(":");
    // this.dformat = dformat;
    // console.log(dformat);
    this.selectedZTPMode.name = event.value.name;
    if (this.selectedZTPMode.name === "Immediately") {
      this.atOnceOption = false;
    }
    if (this.selectedZTPMode.name === "Schedule") {
      this.atOnceOption = true;
    }

    // console.log(this.selectedZTPMode);
    // console.log("At Once");
    // console.log(this.selectedZTPMode.name);
  }

  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `provision-history${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.provisioningHistory
    );
    const workbook: xlsx.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"]
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    this.saveExcelFile(excelBuffer, fileName);
  }

  getTimestamp() {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Month starts from 0
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  // Function to save the Excel file
  saveExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  doneZTPSchedule() {
    let month: any;
    let date: any;
    let hour: any;
    let minute: any;
    let second: any;
    let time: any;
    console.log(this.selectedEdgeModels);
    if (
      this.selectedZTPMode.name === "Schedule" &&
      this.dformat == undefined &&
      this.IP == undefined
    ) {
      this.invinvalid = "ng-invalid ng-dirty";
      this.invinvalid2 = "ng-invalid ng-dirty";
    } else {
      if (this.IP == undefined) {
        this.invinvalid = "ng-invalid ng-dirty";
        error: error => {
          this.spinner = false;
          if (error) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Create ZTP Schedule FAILED!"
            });
          }
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
        };
      } else {
        this.invinvalid = "";
      }
      if (this.dformat == undefined) {
        this.invinvalid2 = "ng-invalid ng-dirty";
        error: error => {
          this.spinner = false;
          if (error) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Create ZTP Schedule FAILED!"
            });
          }
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
        };
      } else {
        this.invinvalid2 = "";
      }
      console.log(this.IP);
      if (
        this.selectedZTPMode.name === "Schedule" &&
        this.dformat != undefined &&
        this.IP != undefined
      ) {
        var dateObj = new Date(this.startValue);
        var dformat =
          dateObj.getFullYear() +
          "-" +
          ("00" + (dateObj.getMonth() + 1)).slice(-2) +
          "-" +
          ("00" + dateObj.getDate()).slice(-2) +
          " " +
          ("00" + dateObj.getHours()).slice(-2) +
          ":" +
          ("00" + dateObj.getMinutes()).slice(-2) +
          ":" +
          ("00" + dateObj.getSeconds()).slice(-2);
        this.dformat = dformat;
        console.log(this.dformat);
        this.provisioningHistoryService
          .AddZTPSchedule(this.IP, this.dformat, this.selectedEdgeModels)
          .subscribe({
            next: result => {
              this.invinvalid = "";
              this.invinvalid2 = "";
              this.spinner = false;
              this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Create ZTP Schedule Successfully.",
                life: 3000
              });
              this.displayZTP = false;
              this.provisioningHistoryService
                .getProvisioningHistory()
                .subscribe({
                  next: data => {
                    this.provisioningHistory = data;
                    this.provisioningHistoryfunc();
                  },
                  error: error => {
                    if (error.status == 401) {
                      this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail:
                          "Session expired, please logout and login again."
                      });
                    }
                  }
                });
            }
          });
      } else if (
        this.selectedZTPMode.name === "Immediately" &&
        this.IP != undefined
      ) {
        this.provisioningHistoryService
          .AddZTPImmediately(this.IP, this.selectedEdgeModels)
          .subscribe({
            next: result => {
              this.invinvalid = "";
              this.invinvalid2 = "";
              this.spinner = false;
              this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Create ZTP Schedule Successfully.",
                life: 3000
              });
              this.displayZTP = false;
              this.provisioningHistoryService
                .getProvisioningHistory()
                .subscribe({
                  next: data => {
                    this.provisioningHistory = data;
                    this.provisioningHistoryfunc();
                  },
                  error: error => {
                    if (error.status == 401) {
                      this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail:
                          "Session expired, please logout and login again."
                      });
                      // location.reload();
                    }
                  }
                });
            }
          });
      }
      error: error => {
        if (error.status == 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please Select Start Date."
          });
          location.reload();
        }
      };
    }
  }

  openNew() {
    this.provissionDialog = true;
    this.showportgenerate = true;
    this.invinvalid = "";
    this.dialogHeader = "Provisioning Schedule";
    this.options1 = {
      center: {
        lat: 13.72672065693991,
        lng: 100.51438137260944
      },
      zoom: 12,
      disableDefaultUI: true
    };
    this.deviceTypes = [
      { name: "ISCOM2608G-2GE", id: 0 },
      { name: "ISCOM-RAX711", id: 1 },
      { name: "RAX711-L-4GC", id: 2 }
    ];
    this.selectedDeviceTypes = this.deviceTypes[0];

    this.provisioningHistoryService.getUplinkDevice().subscribe({
      next: data => {
        this.uplink = data;
        // console.log(data)
        this.uplinkList = [
          {
            IPADDRESS: data.IPADDRES,
            HOSTNAME: data.HOSTNAME,
            iRCNETypeID: data.iRCNETypeID,
            ISPINGOK: data.ISPINGOK
          }
        ];
        this.selectedUplink = this.uplinkList[0];

        // this.overlays = [
        //   new google.maps.Marker({
        //     position: { lat: data[2].latitude, lng: data[2].longitude },
        //     title: "CAT Telecom"
        //   })
        // ];
        // console.log(data);
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
  selectedPort:any;
  generateConfig() {
    console.log('hi')
    if (this.parent_id != undefined && this.IP != undefined) {
      this.invinvalid = "";
      this.invinvalid2 = "";
      this.loadingspiner = true;
      this.loading = true;
      this.spinner = true;
      this.provisioningHistoryService
        .getgenerate_config(
          this.parent_id,
          this.selectedDeviceTypes.name,
          this.IP,
          this.exceptIP
        )
        .subscribe({
          next: result => {
            this.loadingspiner = false;
            this.loading = false;
            this.spinner = false;
            this.management_ip = result.params.management_ip;
            this.script = result.script;
            var data = {
              uplink_ip: this.IP,
              uplink_port: this.selectedPort.port,
              mac: this.MACremote,
              script: "",
              model: this.selectedDeviceTypes.name,
              suggested_ip: this.management_ip,
              latitude: this.latitude,
              longitude: this.latitude,
              start_at: this.date
            }
            this.provisioningHistoryService
            .AddSchedule(
              data
            )
            .subscribe({
              next: result => {
                this.spinner = false;
                this.provissionDialog = false;
                this.messageService.add({
                  severity: "success",
                  summary: "Successful",
                  detail: "Completed",
                  life: 3000
                });
                this.provisioningHistoryService.getProvisioningHistory().subscribe({
                  next: data => {
                    this.provisioningHistory = data;
                    // this.overlays = [
                    //   new google.maps.Marker({
                    //     position: { lat: data[2].latitude, lng: data[2].longitude },
                    //     title: "CAT Telecom"
                    //   })
                    // ];
                    // console.log(data);
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
              },
              error: error => {
                if (error.status == 401) {
                  this.spinner = false;
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Session expired, please logout and login again."
                  });
                } else {
                  this.spinner = false;
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.message
                  });
                }
              }
            });
          },
          error: error => {
            if (error) {
              this.loadingspiner = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Generate FAILED!"
              });
            }
            if (error.status == 401) {
              this.loadingspiner = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Session expired, please logout and login again."
              });
            }
          }
        });
    } else {
      if (this.IP != undefined) {
        this.invinvalid = "";
      } else {
        this.invinvalid = "ng-invalid ng-dirty";
      }

      this.invinvalid2 = "ng-invalid ng-dirty";
      this.loadingspiner = false;
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select Uplink Device."
      });
    }
  }
  provisionTaskShowLocation(provisionTask: ProvisioningHistoryTable) {
    // let bounds = new google.maps.LatLngBounds();
    this.management_ip_ADD = provisionTask.id;
    this.inserted_id = provisionTask.suggested_ip;
    this.provisionTask = provisionTask;
    this.provisionTaskDialogLocation = true;
    this.dialogHeader = "Location";
    var index = this.provisioningHistory.findIndex(
      data => data.id == provisionTask.id
    );
    if (provisionTask.latitude !== null && provisionTask.longitude !== null) {
      // this.setMap();
      this.latitude = provisionTask.latitude;
      this.longitude = provisionTask.longitude;
      this.invalidcheckmap = false;
      this.options1 = {
        center: { lat: provisionTask.latitude, lng: provisionTask.longitude },
        zoom: 16,
        disableDefaultUI: true
      };
      this.checkmap = true;
      this.checkmaps = false;
      this.overlays1 = [
        new google.maps.Marker({
          position: {
            lat: this.provisionTask.latitude,
            lng: this.provisionTask.longitude
          }
        })
      ];

      var center = {
        lat: provisionTask.latitude,
        lng: provisionTask.longitude
      };

      this.maps.setCenter(center);
    } else {
      this.checkmap = false;
      this.checkmaps = true;
      this.checkmapDialog = false;
      this.invalidcheckmap = true;
      this.options1 = {
        center: {
          lat: 13.72672065693991,
          lng: 100.51438137260944
        },
        zoom: 10.2,
        disableDefaultUI: true
      };
      this.overlays1 = [];
    }
  }
  showDialog() {
    this.dialogHeader = "Export form";
    this.display = true;
  }

  // .getHistoryForExport(
  //   this.dateParameter.start_date,
  //   this.dateParameter.end_date
  // )

  Save_SNMP() {
    this.spinner = true;
    // console.log(this.management_ip_ADD)
    this.provisioningHistoryService
      .SetsnmpLocation(
        this.inserted_id,
        this.latitude,
        this.longitude,
        this.management_ip_ADD
      )
      .subscribe({
        next: result => {
          this.spinner = false;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Set SNMP Location Successfuly.",
            life: 3000
          });
          this.provisionTaskDialogLocation = false;
          this.provisioningHistoryService.getProvisioningHistory().subscribe({
            next: data => {
              this.provisioningHistory = data;
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
        },
        error: error => {
          this.spinner = false;
          if (error) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Set SNMP Location FAILED!"
            });
          }
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

  exportExcel(provisioningHistoryTable: ProvisioningHistoryTable) {
    // console.log(this.dateParameter.start_date);
    // if (
    //   this.provisioningHistoryService.getHistoryForExport(
    //     this.dateParameter.start_date,
    //     this.dateParameter.end_date
    //   )
    // )
    // console.log(this.startDate)
    if (
      this.startDate != undefined &&
      this.endDate != undefined &&
      this.startDate != "" &&
      this.endDate != ""
    ) {
      this.invalid = "";
      this.provisioningHistoryService
        .getHistoryForExport(this.startDate, this.endDate)
        .subscribe({
          next: data => {
            this.forExport = data;
            let finalData = data;
            finalData.forEach(value => {
              delete value.id;
              delete value.created_by;
            });
            // console.log(data2);
            import("xlsx").then(xlsx => {
              const worksheet = xlsx.utils.json_to_sheet(finalData);
              const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ["data"]
              };
              const excelBuffer: any = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array"
              });
              this.saveAsExcelFile(excelBuffer, "Provisioning_History");
            });
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Export Excel file successfull!",
              life: 3000
            });
            // }
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
    } else {
      if (
        this.selectedDateTypeMode.name == "daily" ||
        this.selectedDateTypeMode.name == "weekly"
      ) {
        this.invalid = "ng-invalid ng-dirty";
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please Select Start Date"
        });
      } else if (this.selectedDateTypeMode.name == "monthly") {
        this.invalid = "ng-invalid ng-dirty";

        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please Select Start Month"
        });
      }
    }
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  hideDialog() {
    this.display = false;
    this.displayZTP = false;
    this.startValue = undefined;
    this.startDate = undefined;
    this.endDayWeekly = "";
    this.IP = undefined;
    this.dformat = undefined;
    this.invinvalid = "";
    this.invinvalid1 = "";
    this.invinvalid2 = "";
    // this.invalidcheckmap = false;
    // this.checkmapDialog = false;
    console.log(this.startValue, this.startDate);
  }

  onSelectMethodForZTP(event) {
    let startDate = new Date(Date.parse(event));

    var dformat =
      startDate.getFullYear() +
      "-" +
      ("00" + (startDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + startDate.getDate()).slice(-2) +
      " " +
      ("00" + startDate.getHours()).slice(-2) +
      ":" +
      ("00" + startDate.getMinutes()).slice(-2) +
      ":" +
      ("00" + startDate.getSeconds()).slice(-2);
    this.dformat = dformat;
    if (this.dformat != undefined) {
      this.invinvalid2 = "";
    } else {
      this.invinvalid2 = "ng-invalid ng-dirty";
    }
    console.log(dformat);
  }

  onSelectMethodForDaily(event) {
    this.invalid = "";
    let startDate = new Date(Date.parse(event));
    var startYearDaily = startDate.toLocaleString("en-CA", {
      year: "numeric"
    });
    var startMonthDaily = startDate.toLocaleString("en-CA", {
      month: "2-digit"
    });
    var startDayDaily = startDate.toLocaleString("en-CA", {
      day: "2-digit"
    });
    var formattedDailyStartDate =
      startYearDaily + "-" + startMonthDaily + "-" + startDayDaily;
    let endDate = formattedDailyStartDate;
    this.startDate = formattedDailyStartDate;
    this.endDate = endDate;
    // console.log(this.startDate);
    // console.log(endDate);
  }

  onSelectMethodForWeekly(event) {
    console.log(this.startDate);
    this.invalid = "";

    let startDate = new Date(Date.parse(event));
    // startDate.setDate(startDate.getDate());
    var year = startDate.toLocaleString("en-CA", { year: "numeric" });
    var month = startDate.toLocaleString("en-CA", { month: "2-digit" });
    var day = startDate.toLocaleString("en-CA", { day: "2-digit" });
    var formattedDate = year + "-" + month + "-" + day;
    // console.log(formattedDate);
    this.startDate = formattedDate;

    //

    let endDate = new Date(Date.parse(event));
    endDate.setDate(startDate.getDate() + 7);
    var endYearWeekly = endDate.toLocaleString("en-CA", { year: "numeric" });
    var endMonthWeekly = endDate.toLocaleString("en-CA", {
      month: "2-digit"
    });
    var endDayWeekly = endDate.toLocaleString("en-CA", { day: "2-digit" });
    this.endDayWeekly =
      endDayWeekly + "." + endMonthWeekly + "." + endYearWeekly;
    var formattedWeeklyEndDate =
      endYearWeekly + "-" + endMonthWeekly + "-" + endDayWeekly;
    this.endDate = formattedWeeklyEndDate;

    // this.dateParameter.start_date = formattedDate;
    // this.dateParameter.end_date = formattedWeeklyEndDate;
    // console.log("End date" + " " + formattedWeeklyEndDate);
    // console.log("Start Date" + " " + formattedDate);
  }

  onSelectMethodForMonthly(event) {
    this.invalid = "";
    let d = new Date(Date.parse(event));
    var yearMonth = d.toLocaleString("en-CA", { year: "numeric" });
    var monthMonth = d.toLocaleString("en-CA", { month: "2-digit" });
    var dayMonth = d.toLocaleString("en-CA", { day: "2-digit" });
    var formattedMonthlyStartDate =
      yearMonth + "-" + monthMonth + "-" + dayMonth;
    // console.log(formattedMonthlyStartDate);
    var lastday = function(y, m) {
      return new Date(y, m, 0).getDate();
    };
    var lastdayDate = lastday(yearMonth, monthMonth);
    //
    var formattedDayEndDate = yearMonth + "-" + monthMonth + "-" + lastdayDate;
    this.startDate = formattedMonthlyStartDate;
    this.endDate = formattedDayEndDate;
    // console.log(formattedDayEndDate);
  }

  runningConfig() {
    console.log("Work!");
    this.beforeLoading = false;
    this.afterClick = true;
    this.loadingspiner = true;
    this.configResults = "";
    this.suggested_ip = this.provisionTask.suggested_ip;
    console.log(this.suggested_ip);
    this.provisioningHistoryService
      .getRunningConfig(this.suggested_ip)
      .subscribe({
        next: data => {
          this.afterClick = false;
          this.loadingspiner = false;
          this.configResults = data;
          console.log(this.configResults);
        },
        error: error => {
          this.loadingspiner = false;
          this.afterClick = false;
          this.beforeLoading = true;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Running config ERROR!, please try again"
          });
        }
      });
  }

  pingResult() {
    this.loadspinnerPing = true;
    this.beforeLoadingPing = false;
    this.afterClickPing = true;
    this.pingcheck = false;
    // this.pingResults = "";

    this.suggested_ip = this.provisionTask.suggested_ip;
    this.uplink_ip = this.provisionTask.uplink_ip;
    console.log(this.suggested_ip);
    this.provisioningHistoryService
      .getPing(this.suggested_ip, this.uplink_ip)
      .subscribe({
        next: data => {
          this.afterClickPing = false;
          this.beforeLoadingPing = false;
          this.loadspinnerPing = false;
          this.pingResults = data.is_success;
          this.command_results = data.command_result;
          this.pingcheck = true;
          console.log(this.pingResults);
        },
        error: error => {
          this.beforeLoadingPing = true;
          this.afterClickPing = false;
          this.loadspinnerPing = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error, please try again"
          });
        }
      });
  }

  provisionTaskRecovery(provisionTask: ProvisioningHistoryTable) {
    this.displayRecovery = true;
    this.dialogHeader = "Recovery";
    var input = "";
    this.provisioningHistoryService.getSearchDevice(input).subscribe({
      next: data => {
        this.uplink = data;
        // console.log(data)
        this.uplinkList = [
          {
            IPADDRESS: data.symbol_name3,
            HOSTNAME: data.HOSTNAME,
            iRCNETypeID: data.iRCNETypeID,
            ISPINGOK: data.ISPINGOK
          }
        ];
        this.selectedUplink = this.uplinkList[0];
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

  getConfig() {
    this.username = "raisecom";
    this.password = "raisecom";
    this.getConfigDialog = true;
    this.iconsave = "pi pi-check";
  }

  ngAfterViewInit() {}
}
