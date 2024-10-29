import { style } from "@angular/animations";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { forkJoin } from 'rxjs';
import { NoopScrollStrategy } from "@angular/cdk/overlay";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceService, delay } from "app/device.service";
import { NavigateService } from "app/navigateservice";
import * as Highcharts from "highcharts";
import HC_stock from "highcharts/modules/stock";
import { MessageService, ConfirmationService } from "primeng/api";
import { data } from "jquery";
import { MenuItem } from "primeng/api";
import { Observable, concat } from "rxjs";
import { Checkbox } from "primeng/checkbox";
import { NgTerminal } from "ng-terminal";
import { ThemeService } from "app/theme.service";
import { Terminal } from "xterm";
import { WebsocketService } from "app/serviec/websocket.service";
import { TerminalService } from "primeng/terminal";
import * as e from "cors";
import { ContextMenu } from "primeng/contextmenu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { AppComponent } from "@app/app.component";

import {
  GridType,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface
} from "angular-gridster2";
import { Table } from "primeng/table";
interface ExtendedPlotCandlestickDataGroupingOptions
  extends Highcharts.DataGroupingOptionsObject {
  enabled: boolean;
}

HC_stock(Highcharts);
export interface Device {
  symbol_id?: number;
  symbol_name1?: string;
  symbol_name3?: string;
  res_id?: string;
}
interface DeviceType {
  name: string;
  id: number;
}

interface IP {}

interface PortType {
  interface?: string;
  decription?: string;
  id?: number;
}

interface TimeLimit {
  time: string;
  interval: number;
}

interface ZTPMode {
  name: string;
}

interface uplink {
  HOSTNAME?: string;
  IPADDRESS?: string;
  IRCNETNODEID?: number;
  ISPINGOK?: number;
  iRCNETypeID?: string;
}

export interface Alarmlist {
  iRCAlarmLogID?: number;
  iLevel?: number;
  strUptime?: string;
  strIPAddress?: string;
  strName?: string;
  strDeviceName?: string;
  iRCNETypeID?: string;
  iRCNetNodeID?: number;
}
export interface getconfig_table {
  filename?: string;
}

interface ProvisioningHistoryTable {
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

@Component({
  selector: "app-device-information",
  templateUrl: "./device-information.component.html",
  providers: [TerminalService],
  styleUrls: ["./device-information.component.scss"],
  styles: [
    `
      th {
        width: 25%;
      }
      .card-filter {
        cursor: pointer;
      }

      gridster {
        min-width: 500px !important;
        height: calc(100vh - 130px);
      }

      gridster::-webkit-scrollbar {
        width: 8px;
      }

      gridster::-webkit-scrollbar-track {
        background-color: #e4e4e4;
        border-radius: 100px;
      }

      gridster::-webkit-scrollbar-thumb {
        border-radius: 100px;
        background-image: linear-gradient(180deg, #979594e7 0%, #757474 99%);
        box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
      }

      gridster-item {
        border-radius: 15px;
      }
      tr.critical {
        background-color: #f1eeff;
        color: #717eee;
      }
      tr.major {
        background-color: #ffecee;
        color: #ff7782;
      }
      tr.minor {
        background-color: #fff3e1;
        color: #ffbb55;
      }
      tr.warning {
        background-color: #e4f5ff;
        color: #45bfff;
      }
      tr.unknown {
        background-color: #e7fcfa;
        color: #50d0bc;
      }
      tr > td.low-rated1 {
        border: 1px solid #ff5252;
        z-index: 9999;
        border-width: 2px 0 2px 2px;
      }
      tr > td.low-rated2 {
        border: 1px solid #ff5252;
        z-index: 9999;
        border-width: 2px 0 2px 0;
      }
      tr > td.low-rated3 {
        border: 1px solid #ff5252;
        z-index: 9999;
        border-width: 2px 2px 2px 0;
      }
    `
  ]
})
export class DeviceInformationComponent implements OnInit {
  @ViewChild("term2", { static: true }) child2: NgTerminal;
  scrollStrategy = new NoopScrollStrategy();
  @ViewChild("cm") cm: ContextMenu;
  @ViewChild("deviceImage") myDiv: ElementRef;
  @ViewChild("dt") table: Table;
  isZTPEnable: boolean = true;
  device_access_id: number;
  items: MenuItem[];
  device_image: string;
  device_id: string;
  device_ip: string;
  device_name: string;
  lastBackupTime: string;
  lastBackupTimeCheck: boolean = false;
  lastBackupTimeChecks: boolean = false;
  deviceL: Device = {};
  username: string;
  username1: string = "raisecom";
  password1: string = "raisecom";
  action_Dialog3: boolean = false;
  setfilenameDialog: boolean = false;
  chartDialog: boolean = false;
  filenameNew: string;
  selectedDevice: Device = {};
  password: string;
  password_verify: string;
  getConfigDialog: boolean = false;
  getverifyDialog: boolean = false;
  InfoDialog: boolean = false;
  InfoDialog2: boolean = false;
  iconsave: string;
  vlanDetail: any[];
  vlanDetailNew: any[];
  vlanDetailNewList: any[] = [];
  vlanDetailNewCompare: any[] = [];
  vlanDetail1: any = {};
  hasNoVlan: boolean = false;
  submitted: boolean;
  peakmarker: any;
  upload: boolean;
  getconfig_table: getconfig_table = ({} = {});
  getconfig_tables: getconfig_table[] = [];
  selecteddata: getconfig_table[];
  getconfig_string: string = "";
  checks: boolean = false;
  action_Dialog1: boolean = false;
  action_Dialog2: boolean = false;
  resultView: string;
  dialogHeader: string;
  fileName = "";
  selectedFile: File;
  loadingspiner: boolean = false;
  loadingspinerconfig: boolean = false;
  loadingspiner_: boolean = false;
  loadingspinerS: boolean = false;
  loadingCompleted: boolean = false;
  loadingspiner2: boolean = false;
  loadingspinerImg: boolean = false;
  loadingspinerImg2: boolean = false;
  loadingcheck: boolean = true;
  description: any = {};
  myArray: any = {};
  myArray1: any = {};
  arr = [];
  arr1 = [];
  port: string[];
  array_data = [];
  array_data1 = [];
  array_dataChart = [];
  index_dataChart: any;
  IRCNETypeID: any;
  IPaddress: any;
  deviceTypes: DeviceType[] = [];
  showProvisioning: boolean = false;
  generateDialog: boolean = false;
  Remoteprovisioningdialog: boolean = false;
  selectedDeviceType: DeviceType;
  selectedPort: any;
  modelType: string;
  underlyings: Terminal;
  input_command2: string = "";
  terminal_prompt: string = "";
  management_ip: string;
  script: string;
  MACremote: string;
  cmd_result: string;
  inserted_id: string;
  SNMPlocation: boolean = false;
  loadtrue: boolean = false;
  loadfalse: boolean = true;
  latitude: any = "";
  longitude: any = "";
  options: any;
  pingOK: boolean;
  pingfailed: boolean;
  Pinging: boolean;
  is_success: boolean;
  excluded_ips: string;
  stateResult: string;
  port_des1: PortType[] = [];
  port_des2: PortType[] = [];
  port_des: any[] = [];
  pingResults: boolean = false;
  pingcheck: boolean = true;
  pingok: boolean = false;
  port_deslist: any[] = [];
  port_drop: PortType[];
  invalid: string;
  invalidZTP: string;
  invalid2: string;
  port_uplink: string;
  port_labelChart: string;
  port_desChart: string;
  label: boolean = false;
  port_lable: string = "";
  selectedPosition: any;
  overlays: any[];
  markerTitle: string;
  checkmap: boolean = false;
  beforeSelectMap: boolean = true;
  dialogVisible: boolean;
  draggable: boolean;
  defualt_overlays: any = [];
  showrunnig: boolean = false;
  checkselectDate: boolean = false;
  resultRunning: string;
  cols: any[];
  alarm_list: any;
  checkalarm: boolean = false;
  selecteAlarm: Alarmlist;
  classLevel: string[] = ["Unknow", "Critical", "Major", "Minor", "Warning"];
  port_Chart: PortType[] = [];
  port_Charts: any[] = [];
  selectedPortChart: any;
  label_chart: any;
  indexChart: any;
  checkchart: boolean = false;
  checkchartAll: boolean = false;
  loadButtonExport: boolean = false;
  SucButtonExport: boolean = false;
  hideicon: boolean = true;
  invalidfile: String;
  images: any[];
  troubleshooting: boolean = false;
  imagestroubleshooting: any[];
  invalid_month: string;
  listdrop: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: "1024px",
      numVisible: 5
    },
    {
      breakpoint: "768px",
      numVisible: 3
    },
    {
      breakpoint: "560px",
      numVisible: 1
    }
  ];
  displayZTP: boolean = false;
  atOnceOption: boolean = false;
  dformat: string;
  selectedZTPMode: any;
  ztpTypeModes: ZTPMode[];
  uplink: string;
  uplinkList: uplink[];
  selectedUplink: uplink;
  startDate: string;
  provisionTaskDialogLocation: boolean;
  spinner: boolean;
  IP: string;
  provisioningHistory: ProvisioningHistoryTable[];
  parent_id: string;
  checkselectreport: boolean = false;
  label2: boolean;
  iRCNETypeID: string;
  HOSTNAME: string;
  fixIP: string;
  startValue: Date;
  interfaceArr: any[] = [];
  descriptionArr: any[] = [];
  modeArr: any[] = [];
  statusArr: any[] = [];
  vlanArr: any[] = [];
  crcArr: any[] = [];
  vender_nameArr: any[] = [];
  rx_powerArr: any[] = [];
  tx_powerArr: any[] = [];
  mau_typeArr: any[] = [];
  if_mtuArr: any[] = [];
  duplex_modeArr: any[] = [];
  statusAll: any;
  loadingExport: boolean = false;
  timeLimit: TimeLimit[];
  timeLimit2: TimeLimit[];
  intervaltime: number;
  selectedTime: string;
  diffInDays: any;
  diffInMs: any;
  month: string;
  showDropdownInterval: boolean = false;
  isHasPortNumber: boolean = false;
  resID: string;
  isActive: boolean = false;
  rangeYear: string;
  minDateValue: any;
  maxDateValue: any;
  datePicker: any;
  datePicker_selected: any;
  datePickerS: any;
  showpick: boolean;
  showEdit: boolean = true;
  showClear: boolean = false;
  showSave: boolean = false;
  showAdd: boolean = false;
  showDialog: boolean = false;
  showDelete: boolean = false;
  dashboard: Array<any>;
  dashboardlist: any[] = [];
  datalist: any[];
  selecteddatalist: any[] = [];
  initialGridOptions = {
    minCols: 3,
    maxCols: 12,
    minRows: 2,
    maxRows: 500,
    gridType: "verticalFixed" as GridType,
    fixedRowHeight: 220,
    margin: 16
  };
  checkchartmem: boolean = false;
  checkchartcpu: boolean = false;
  checkcharttemp: boolean = false;
  // checkchartvolt: boolean = false;
  valueCPU1min: number;
  valueCPU2min: number;
  valueCPU3min: number;
  valueCPU4min: number;
  valueCPU5min: number;
  valuevoltindex1: any;
  valuevoltindex2: any;
  valuevoltindex3: any;
  valuevoltindex4: any;
  valuevoltrefindex1: any;
  valuevoltrefindex2: any;
  valuevoltrefindex3: any;
  valuevoltrefindex4: any;
  loadcpu1min: boolean = false;
  loadcpu2min: boolean = false;
  loadcpu3min: boolean = false;
  loadcpu4min: boolean = false;
  loadcpu5min: boolean = false;
  loadvoltindex1: boolean = false;
  loadvoltindex2: boolean = false;
  loadvoltindex3: boolean = false;
  loadvoltindex4: boolean = false;
  loadTemp: boolean = false;
  loadMemory: boolean = false;
  valueTemp: string;
  array_dataAll: any[] = [];
  array_dataAllchart: any[] = [];
  listifIndex: any[] = [];
  checkallselctdate: boolean = false;
  themeValue: string = this.themeService.theme;
  gridOptions: GridsterConfig;
  changeport: boolean = false;
  portifName: string;
  disabledlist: boolean;
  isEnabled: boolean = false;
  checkgridster: boolean = false;
  array_dataMem: any[] = [];
  array_dataCPU: any[] = [];
  array_dataTemp: any[] = [];
  array_dataVolt: any[] = [];
  startTimeH: number;
  startTimeH24: number;
  startTimeM: any;
  EndTimeH: number;
  EndTimeH24: number;
  EndTimeM: any;
  showchart: boolean = false;
  stateOptions: any[];
  timeStart: string;
  timeEnd: string;
  addConfigDialog: boolean = false;
  newVlan: number;
  newNTP: string;
  VlanLengths: any[] = [];
  NTPLengths: any[] = [];
  HOSTNAMEtxt: string;
  SNMPtxt: string;
  NTPtxt: string;
  NameVlantxt: string;
  itemsAction: MenuItem[];
  itemsActiontable: MenuItem[];
  menuDownloadisActive: boolean = true;
  Sysname: any;
  disableSysname: boolean = true;
  SNMPname: any;
  SNMPVersion: any;
  disableSNMP: boolean = false;
  SNMPList: any[] = [];
  NTPname: any;
  disableNTP: boolean = false;
  NTPList: any[] = [];
  showaddConfig: boolean = false;
  differentClass: any;
  modedrop: any[] = [];
  selecteddescriptiondrop: any;
  modelDevice: any;
  constructor(
    public webSocketService: WebsocketService,
    private terminalService: TerminalService,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private changeDetection: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private titleService: Title,
    private navigator: NavigateService,
    private router: Router,
    public themeService: ThemeService
  ) {
    // this.IPaddress = "10.208.214.132";

    this.stateOptions = [
      { label: "AM", value: "AM" },
      { label: "PM", value: "PM" }
    ];
    this.device_access_id = this.route.snapshot.queryParams["ID"];
    this.IRCNETypeID = this.route.snapshot.queryParams["IRCNETypeID"];
    this.IPaddress = this.route.snapshot.queryParams["IPadress"];
    this.titleService.setTitle("SED-Device-" + this.device_access_id);
    this.deviceTypes = [
      { name: "ISCOM2608G-2GE", id: 0 },
      { name: "ISCOM-RAX711", id: 1 },
      { name: "RAX711-L-4GC", id: 2 }
    ];
    this.timeLimit = [
      { time: "1 min", interval: 1 },
      { time: "5 min", interval: 5 },
      { time: "15 min", interval: 15 },
      { time: "30 min", interval: 30 },
      { time: "1 hour", interval: 60 },
      { time: "2 hour", interval: 120 },
      { time: "4 hour", interval: 240 },
      { time: "12 hour", interval: 720 },
      { time: "24 hour", interval: 1440 }
    ];

    this.timeLimit2 = [
      { time: "1 min", interval: 1 },
      { time: "5 min", interval: 5 },
      { time: "15 min", interval: 15 },
      { time: "30 min", interval: 30 },
      { time: "1 hour", interval: 60 },
      { time: "2 hour", interval: 120 },
      { time: "4 hour", interval: 240 },
      { time: "12 hour", interval: 720 },
      { time: "24 hour", interval: 1440 }
    ];
    this.modedrop = [
      "trunk",
      "access"
      // { "trunk" },
      // { "access" },
    ];
    this.selectedDeviceType = this.deviceTypes[0];
    this.port_des1 = [
      { interface: "port 1", decription: "", id: 1 },
      { interface: "port 2", decription: "", id: 2 },
      { interface: "port 3", decription: "", id: 3 },
      { interface: "port 4", decription: "", id: 4 },
      { interface: "port 5", decription: "", id: 5 },
      { interface: "port 6", decription: "", id: 6 },
      { interface: "port 7", decription: "", id: 7 },
      { interface: "port 8", decription: "", id: 8 },
      { interface: "port 9", decription: "", id: 9 },
      { interface: "port 10", decription: "", id: 10 },
      { interface: "port 11", decription: "", id: 11 },
      { interface: "port 12", decription: "", id: 12 },
      { interface: "port 13", decription: "", id: 13 },
      { interface: "port 14", decription: "", id: 14 },
      { interface: "port 15", decription: "", id: 15 },
      { interface: "port 16", decription: "", id: 16 },
      { interface: "port 17", decription: "", id: 17 },
      { interface: "port 18", decription: "", id: 18 },
      { interface: "port 19", decription: "", id: 19 },
      { interface: "port 20", decription: "", id: 20 },
      { interface: "port 21", decription: "", id: 21 },
      { interface: "port 22", decription: "", id: 22 },
      { interface: "port 23", decription: "", id: 23 },
      { interface: "port 24", decription: "", id: 24 },
      { interface: "port 25", decription: "", id: 25 },
      { interface: "port 26", decription: "", id: 26 },
      { interface: "port 27", decription: "", id: 27 },
      { interface: "port 28", decription: "", id: 28 }
    ];
    this.port_des2 = [
      { interface: "port1", decription: "", id: 1 },
      { interface: "port2", decription: "", id: 2 },
      { interface: "port3", decription: "", id: 3 },
      { interface: "port4", decription: "", id: 4 },
      { interface: "port5", decription: "", id: 5 },
      { interface: "port6", decription: "", id: 6 },
      { interface: "port7", decription: "", id: 7 },
      { interface: "port8", decription: "", id: 8 },
      { interface: "port9", decription: "", id: 9 },
      { interface: "port10", decription: "", id: 10 },
      { interface: "port11", decription: "", id: 11 },
      { interface: "port12", decription: "", id: 12 },
      { interface: "port13", decription: "", id: 13 },
      { interface: "port14", decription: "", id: 14 },
      { interface: "port15", decription: "", id: 15 },
      { interface: "port16", decription: "", id: 16 },
      { interface: "port17", decription: "", id: 17 },
      { interface: "port18", decription: "", id: 18 },
      { interface: "port19", decription: "", id: 19 },
      { interface: "port20", decription: "", id: 20 },
      { interface: "port21", decription: "", id: 21 },
      { interface: "port22", decription: "", id: 22 },
      { interface: "port23", decription: "", id: 23 },
      { interface: "port24", decription: "", id: 24 },
      { interface: "port25", decription: "", id: 25 },
      { interface: "port26", decription: "", id: 26 },
      { interface: "port27", decription: "", id: 27 },
      { interface: "port28", decription: "", id: 28 },
      { interface: "gigaethernet 0/1", decription: "", id: 29 },
      { interface: "gigaethernet 1/1", decription: "", id: 30 },
      { interface: "gigaethernet 1/2", decription: "", id: 31 }
    ];
  }
  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {}
  changedOptions() {
    if (this.gridOptions.api && this.gridOptions.api.optionsChanged) {
      this.gridOptions.api.optionsChanged();
      // console.log("HI");
    }
  }
  onChangemodedrop($event) {}
  EditSysname() {
    this.disableSysname = false;
  }
  SaveSysname() {
    this.disableSysname = true;
    this.showaddConfig = true;
  }
  EditNTP() {
    this.disableNTP = true;
    this.NTPname = undefined;
  }
  AddNTP() {
    if (this.NTPname) {
      this.NTPList.push(this.NTPname);
      this.NTPname = null;
      this.invalidNTPname = ""; // Reset the input field
    } else {
      this.invalidNTPname = "ng-invalid ng-dirty";
    }
  }
  removeNTP(index: number) {
    this.NTPList.splice(index, 1);
  }
  SaveNTP() {
    this.disableNTP = false;
    this.showaddConfig = true;
  }
  EditSNMP() {
    this.disableSNMP = true;
    this.SNMPname = undefined;
    this.SNMPVersion = undefined;
  }
  invalidVersion: any;
  invalidSNMPname: any;
  invalidNTPname: any;
  onKeyUpSNMPname() {
    this.invalidSNMPname = "";
  }
  onKeyUpSNMPVersion() {
    this.invalidVersion = "";
  }
  onKeyNTPname() {
    this.invalidNTPname = "";
  }
  AddSNMP() {
    if (this.SNMPname && this.SNMPVersion) {
      var list = [
        {
          name: this.SNMPname,
          version: this.SNMPVersion
        }
      ];
      this.SNMPList.push(...list);
      this.SNMPname = null; // Reset the input field
      this.SNMPVersion = null;
    } else {
      if (
        this.SNMPVersion == "" ||
        this.SNMPVersion == undefined ||
        this.SNMPVersion == null
      ) {
        this.invalidVersion = "ng-invalid ng-dirty";
      }
      if (
        this.SNMPname == "" ||
        this.SNMPname == undefined ||
        this.SNMPname == null
      ) {
        this.invalidSNMPname = "ng-invalid ng-dirty";
      }
    }
  }
  removeSNMP(index: number) {
    this.SNMPList.splice(index, 1);
  }
  SaveSNMP() {
    this.disableSNMP = false;
    this.showaddConfig = true;
  }
  SNMPListAdd: any[] = [];
  NTPListAdd: any[] = [];
  interfaceAdd: any[] = [];
  indexList: any[] = [];
  async Addconfig() {
    this.indexList = [];
    this.SNMPListAdd = [];
    this.NTPListAdd = [];
    await this.SNMPList.forEach(data => {
      if (data.version == null) {
        data.version = "";
      }
      var snmp = [
        {
          value: {
            server: data.name,
            comunity: data.version
          },
          edit: true
        }
      ];
      this.SNMPListAdd.push(...snmp);
    });
    await this.NTPList.forEach(data => {
      var ntp = [
        {
          server: data,
          edit: true
        }
      ];
      this.NTPListAdd.push(...ntp);
    });
    // this.indexList.push(...this.ListNewProducts)
    for (let i = 0; i < this.ListNewProducts.length; i++) {
      var list = this.vlanDetailNew.filter(
        data =>
          data.if_index == this.ListNewProducts[i].if_index &&
          data.if_descr == this.ListNewProducts[i].if_descr &&
          data.switch_mode == this.ListNewProducts[i].switch_mode &&
          data.vlan == this.ListNewProducts[i].vlan
      );
      await this.vlanDetailNewCompare.push(...list);
      if (this.ListEditValue[i] != undefined) {
        var findIndex = this.ListNewProducts.findIndex(
          data => data.if_index == this.ListEditValue[i].if_index
        );
        if (
          this.ListNewProducts[findIndex].if_index ==
          this.ListEditValue[i].if_index
        ) {
          var listloop = {
            value: {
              interface: this.ListEditValue[i].if_name,
              description: this.ListEditValue[i].if_descr,
              switch_mode: this.ListEditValue[i].switch_mode,
              vlan: this.ListEditValue[i].vlan
            },
            edit: true
          };
          this.indexList.push(listloop);
        }
      }
    }
    var listdata = await {
      ip_address: this.IPaddress,
      configdata: {
        sysname: {
          value: this.Sysname,
          edit: true
        },
        ntp: this.NTPListAdd,
        snmp: this.SNMPListAdd,
        interface: this.indexList
      }
    };
    this.confirmationService.confirm({
      message:
        "Are you sure you want to edit" +
        " " +
        this.indexList.length +
        " interface, " +
        this.NTPListAdd.length +
        " NTP, " +
        this.SNMPListAdd.length +
        " SNMP ?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.ListNewProducts = [];
        this.vlanDetailNewCompare = [];
        this.ListNewProduct = [];
        this.ListEditValue = [];
        this.SNMPListAdd = [];
        this.NTPListAdd = [];
        this.deviceService.edit_conf(listdata).subscribe(result => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Update",
            life: 3000
          });
        });
      }
    });

    this.showaddConfig = false;
    // console.log(listdata)
  }

  vlan_id = 0;
  addVlan() {
    if (this.newVlan) {
      if (this.vlan_id == 0) {
        var listVlan = {
          id: this.vlan_id + 1,
          vlan: this.newVlan,
          name: ""
        };
        this.vlan_id = this.vlan_id + 1;
        this.VlanLengths.push(listVlan);
        this.newVlan = null; // Reset the input field
      } else {
        var listVlanS = {
          id: this.vlan_id + 1,
          vlan: this.newVlan,
          name: ""
        };
        this.vlan_id = this.vlan_id + 1;
        this.VlanLengths.push(listVlanS);
        this.newVlan = null;
      }
    }
  }
  ntp_id = 0;
  addNTP() {
    if (this.newNTP) {
      if (this.ntp_id == 0) {
        var listNTP = {
          id: this.ntp_id + 1,
          ntp: this.newNTP
        };
        this.ntp_id = this.ntp_id + 1;
        this.NTPLengths.push(listNTP);
        this.newNTP = null; // Reset the input field
        console.log(this.NTPLengths);
      } else {
        var listNTPS = {
          id: this.ntp_id + 1,
          ntp: this.newNTP
        };
        this.ntp_id = this.ntp_id + 1;
        this.NTPLengths.push(listNTPS);
        this.newNTP = null;
        console.log(this.NTPLengths);
      }
    }
  }

  onSubmitEditConfig() {
    console.log("NTP: " + this.NTPLengths);
    console.log("HOSTNAME: " + this.HOSTNAMEtxt);
    console.log("SNMP: " + this.SNMPtxt);
    console.log("VLAN: " + this.VlanLengths);
  }
  colortitle: any;
  SNMPaddList: any[] = [];
  NTPaddList: any[] = [];
  Sysnameadd: any;
  getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1);
  }
  ngOnInit(): void {
    let todays = new Date();
    let monthx = todays.getMonth() + 1;
    let yearx = todays.getFullYear();
    let hoursx = todays.getHours();
    var d = new Date(),
      months = "" + d.getMonth(),
      days = "" + d.getDate(),
      years = d.getFullYear();
    if (months.length < 2) {
      months = "0" + monthx;
    }
    if (days.length < 2) {
      days = "0" + days;
    }
    var datePicker = this.getFirstDayOfMonth(years, months);
    this.datePicker_selected = datePicker;
    var getfile = [
      { name: "BandwidthCharts", value: "BandwidthCharts", selected: false },
      { name: "Memory Utilization", value: "checkchartmem", selected: false },
      { name: "CPU Utilization", value: "checkchartcpu", selected: false },
      {
        name: "Termometer Utilization",
        value: "checkcharttemp",
        selected: false
      },
      // { name: "Volt Utilization", value: "checkchartvolt", selected: false },
      { name: "CPU load 1 min", value: "loadcpu1min", selected: false },
      { name: "CPU load 2 min", value: "loadcpu2min", selected: false },
      { name: "CPU load 3 min", value: "loadcpu3min", selected: false },
      { name: "CPU load 4 min", value: "loadcpu4min", selected: false },
      { name: "CPU load 5 min", value: "loadcpu5min", selected: false },
      { name: "Termometer Current", value: "loadTemp", selected: false },
      { name: "Memory Total", value: "loadMemory", selected: false }
      // { name: "Volt Index 1", value: "loadvoltindex1", selected: false },
      // { name: "Volt Index 2", value: "loadvoltindex2", selected: false },
      // { name: "Volt Index 3", value: "loadvoltindex3", selected: false },
      // { name: "Volt Index 4", value: "loadvoltindex4", selected: false },
    ];
    this.datalist = getfile;
    // this.selecteddatalist = this.datalist.slice(0,2)
    let today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let hours = today.getHours();
    let hours24 = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    this.startTimeH = hours ? hours : 12;
    // this.startTimeH24 = hours24;
    this.EndTimeH24 = hours24;
    this.startTimeM = minutes < 10 ? "0" + minutes : minutes;
    this.timeStart = ampm;
    this.EndTimeH = hours ? hours : 12;
    this.EndTimeM = minutes < 10 ? "0" + minutes : minutes;
    this.timeEnd = ampm;
    let prevMonth = month === 1 ? 12 : month - 1;
    let prevYear = prevMonth === 12 ? year - 1 : year;
    let nextMonth = month === 12 ? 1 : month + 1;
    let nextYear = nextMonth === 1 ? year : year;
    this.minDateValue = new Date();
    this.minDateValue.setMonth(prevMonth - 6);
    this.minDateValue.setFullYear(prevYear);
    this.maxDateValue = new Date();
    this.maxDateValue.setMonth(nextMonth - 2);
    this.maxDateValue.setFullYear(nextYear);
    this.provisioningHistoryfunc();
    this.route.queryParams.subscribe(params => {
      this.resID = params.ID;
    });
    this.cols = [
      { field: "iLevel", header: "Level" },
      { field: "iRCAlarmLogID", header: "Alarm ID" },
      { field: "strName", header: "Alarm name" },
      { field: "struptime", header: "Uptime" }
    ];
    this.deviceService.loadStattisticAlarm(this.IPaddress).subscribe(result => {
      this.alarm_list = result;
      if (this.alarm_list.length > 0) {
        this.checkalarm = true;
      } else {
        this.checkalarm = false;
      }
    });
    this.maxDate = new Date();
    this.checks = false;
    this.options = {
      center: {
        lat: 13.72672065693991,
        lng: 100.51438137260944
      },
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false
    };
    var str = "ISCOM29";
    var str2 = "RAX721";
    if (this.IRCNETypeID != undefined) {
      var split = this.IRCNETypeID.replace(str, str + " ");
      const first = split.split(" ")[0];
      var split2 = this.IRCNETypeID.replace(str2, str2 + " ");
      const first2 = split2.split(" ")[0];
      if (first == str || first2 == str2) {
        this.showProvisioning = true;
      } else {
        this.showProvisioning = false;
      }
    }
    this.initOverlays();
    // this.deviceService.getVlantable(this.device_access_id).subscribe({
    //   next: result => {
    //     this.vlanDetail = result.interfaces;
    //     if (this.vlanDetail.length != 0) {
    //       this.showpick = true;
    //     } else if (
    //       this.vlanDetail.length != 0 ||
    //       this.vlanDetail == undefined
    //     ) {
    //       this.showpick = false;
    //     }
    //     if (result.interfaces)
    //       for (let i = 0; i < this.vlanDetail.length; i++) {
    //         var re = /,/gi;

    //         this.vlanDetail[i].vlan = this.vlanDetail[i].vlan.replace(re, ", ");
    //       }

    //     // this.crcArr.push(...listcrc);
    //     this.port_des1.forEach(port => {
    //       var portlist = this.vlanDetail.filter(
    //         data => data.interface == port.interface
    //       );
    //       this.port_des.push(...portlist);
    //     });

    //     this.port_des.forEach(port => {
    //       var str = port.interface;
    //       var re = str.replace("port ", "");
    //       port.id = Number(re);
    //       var index = this.port_des1.findIndex(
    //         data => data.interface == port.interface
    //       );
    //       this.port_des1.splice(index, 1);
    //     });
    //     this.port_des1.push(...this.port_des);
    //     this.port_des1.sort((a, b) => a.id - b.id);
    //     this.vlanDetail = result.interfaces;
    //     this.vlanDetail1 = result.interfaces;
    //     // this.hasNoVlan = result == null || result === 0 || result.length === 0;

    //     var interface_ = result.interfaces.map(function(singleElement) {
    //       var str = singleElement.interface;
    //       var newstr = str.replace(/\s/g, "");
    //       var val = newstr;
    //       return val;
    //     });

    //     this.myArray = interface_;

    //     var description = result.interfaces.map(function(singleElement) {
    //       return singleElement.description;
    //     });
    //     this.description = description;

    //     let array = [];
    //     for (let i = 0; i < result.interfaces.length; i++) {
    //       this.myArray1 = {
    //         interface: this.myArray[i],
    //         description: this.description[i]
    //       };

    //       array.push(this.myArray1);
    //     }
    //     this.arr = array;
    //   },
    //   error: error => {
    //     if (this.vlanDetail == undefined) {
    //       this.showpick = false;
    //     }
    //     if (error.status == 401) {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: "Session expired, please logout and login again."
    //       });
    //     }
    //   }
    // });
    this.deviceService.getconfigFile(this.IPaddress).subscribe({
      next: result => {
        this.getconfig_tables = result;

        if (this.getconfig_tables.length > 0) {
          const findstring = result
            .filter(data => data.filename.includes(this.IPaddress.toString()))
            .pop();

          if (findstring == undefined) {
            const firstObject = result[0];
            const originalFilename = firstObject.filename;

            // Removing the ".cfg" extension
            const format = originalFilename.replace(".cfg", "");

            // Replacing underscores with spaces and formatting the time
            const newstr = format.replace("_", " ");
            const index = 13; // Index where the colon should be inserted
            const newstrs = newstr.substring(0, index) + ":" + newstr.substring(index + 1);

            this.lastBackupTime = newstrs;
            this.lastBackupTimeCheck = true;
          } else {
            const firstObject = result[0];
            const originalFilename = firstObject.filename;

            // Removing the IP address part and ".cfg" extension
            const format = originalFilename.replace(this.IPaddress + "_", "").replace(".cfg", "");

            // Replacing underscores with spaces and formatting the time
            const newstr = format.replace(/_/g, " ");
            const index = 11; // Index where the colon should be inserted
            const newstrs = newstr.substring(0, index) + ":" + newstr.substring(index + 1);

            this.lastBackupTime = newstrs;
            this.lastBackupTimeCheck = true;
          }
        } else {
          this.lastBackupTimeChecks = true;
        }
        this.changeDetection.detectChanges();
      },
      error: error => {
        if (error.status == 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        } else {
          this.lastBackupTimeChecks = true;
        }
      }
    });

    this.loadingspinerImg = false;
    this.loadingspinerImg2 = true;
    this.disabledlist = true;
    var date = new Date();
    var start = date.setDate(date.getDate() - 1);
    var end = new Date().getTime();
    this.deviceService.getDashboard().subscribe({
      next: result => {
        this.dashboard = result.widget_list;
        this.dashboardlist = result.widget_list;
        // if (this.IPaddress != undefined){
        this.showEdit = true;
        if (result.widget_list.length != 0) {
          this.checkgridster = true;
          result.widget_list.forEach(data => {
            if (data.widget.header == "BandwidthCharts") {
              this.datalist[0].selected = true;
              this.selecteddatalist.push(this.datalist[0]);
              this.getSysInterface(this.IPaddress);
            } else if (data.widget.header == "checkchartmem") {
              this.datalist[1].selected = true;
              this.selecteddatalist.push(this.datalist[1]);
              this.getRangeMemory(start, end);
            } else if (data.widget.header == "checkchartcpu") {
              this.datalist[2].selected = true;
              this.selecteddatalist.push(this.datalist[2]);
              this.getRangeCPU(start, end);
            } else if (data.widget.header == "checkcharttemp") {
              this.datalist[3].selected = true;
              this.selecteddatalist.push(this.datalist[3]);
              this.getRangeTemp(start, end);
            } else if (data.widget.header == "loadcpu1min") {
              this.datalist[4].selected = true;
              this.selecteddatalist.push(this.datalist[4]);
              this.getCPU1min(this.IPaddress, 1);
            } else if (data.widget.header == "loadcpu2min") {
              this.datalist[5].selected = true;
              this.selecteddatalist.push(this.datalist[5]);
              this.getCPU2min(this.IPaddress, 2);
            } else if (data.widget.header == "loadcpu3min") {
              this.datalist[6].selected = true;
              this.selecteddatalist.push(this.datalist[6]);
              this.getCPU3min(this.IPaddress, 3);
            } else if (data.widget.header == "loadcpu4min") {
              this.datalist[7].selected = true;
              this.selecteddatalist.push(this.datalist[7]);
              this.getCPU4min(this.IPaddress, 4);
            } else if (data.widget.header == "loadcpu5min") {
              this.datalist[8].selected = true;
              this.selecteddatalist.push(this.datalist[8]);
              this.getCPU5min(this.IPaddress, 5);
            } else if (data.widget.header == "loadTemp") {
              this.datalist[9].selected = true;
              this.selecteddatalist.push(this.datalist[9]);
              this.getTemp(this.IPaddress, start, end);
            } else if (data.widget.header == "loadMemory") {
              this.datalist[10].selected = true;
              this.selecteddatalist.push(this.datalist[10]);
              this.getMemoty(this.IPaddress);
            }
          });
        } else {
          this.loading = false;
          this.checkgridster = false;
        }
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

    this.get_sys_info();
    this.deviceService.checkZTPstatus(this.IPaddress).subscribe(result => {
      this.isZTPEnable = result;
    });
    this.deviceService.getdeviceInformation(this.IPaddress).subscribe({
      next: result => {
        this.loadingspinerImg = true;
        this.loadingspinerImg2 = false;
        this.device_id = result.data.deviceId;
        this.modelDevice = result.data.model;
        // this.IPaddress = result.data.deviceIp;

        this.device_name = result.data.deviceName;
        this.device_image = "data:image/png;base64," + result.data.base64Image;
        this.deviceService.getPings(this.IPaddress).subscribe({
          next: data => {
            this.pingcheck = false;
            if (data == true) {
              this.pingok = true;
            } else if (data == false) {
              this.pingfailed = true;
            }
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
        if (this.vlanDetail) {
          this.vlanDetail.forEach((row, index) => {
            var listcomma = result.data.crc[row.port_number];
            this.vlanDetail[index].crc = this.numberWithCommas(listcomma);
            let findDuplicates = arr =>
              arr.filter((item, index) => arr.indexOf(item) == index);
            var listcrc = [
              ...new Set(findDuplicates(this.vlanDetail[index].crc))
            ];
            // this.crcArr.push(...listcrc);
          });
        }
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
    this.themeService.currentcolorMessage.subscribe(value => {
      if (
        this.titleService.getTitle() ==
        "SED EAST-Device-" + this.device_access_id
      ) {
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c";
          if (this.dashboard != undefined) {
            this.dashboard.forEach(data => {
              if (data.widget.header == "BandwidthCharts") {
                this.datalist[0].selected = true;
                this.selecteddatalist.push(this.datalist[0]);
                this.getSysInterface(this.IPaddress);
              } else if (data.widget.header == "checkchartmem") {
                this.datalist[1].selected = true;
                this.selecteddatalist.push(this.datalist[1]);
                this.getRangeMemory(start, end);
              } else if (data.widget.header == "checkchartcpu") {
                this.datalist[2].selected = true;
                this.selecteddatalist.push(this.datalist[2]);
                this.getRangeCPU(start, end);
              } else if (data.widget.header == "checkcharttemp") {
                this.datalist[3].selected = true;
                this.selecteddatalist.push(this.datalist[3]);
                this.getRangeTemp(start, end);
              } else if (data.widget.header == "loadcpu1min") {
                this.datalist[4].selected = true;
                this.selecteddatalist.push(this.datalist[4]);
                this.getCPU1min(this.IPaddress, 1);
              } else if (data.widget.header == "loadcpu2min") {
                this.datalist[5].selected = true;
                this.selecteddatalist.push(this.datalist[5]);
                this.getCPU2min(this.IPaddress, 2);
              } else if (data.widget.header == "loadcpu3min") {
                this.datalist[6].selected = true;
                this.selecteddatalist.push(this.datalist[6]);
                this.getCPU3min(this.IPaddress, 3);
              } else if (data.widget.header == "loadcpu4min") {
                this.datalist[7].selected = true;
                this.selecteddatalist.push(this.datalist[7]);
                this.getCPU4min(this.IPaddress, 4);
              } else if (data.widget.header == "loadcpu5min") {
                this.datalist[8].selected = true;
                this.selecteddatalist.push(this.datalist[8]);
                this.getCPU5min(this.IPaddress, 5);
              } else if (data.widget.header == "loadTemp") {
                this.datalist[9].selected = true;
                this.selecteddatalist.push(this.datalist[9]);
                this.getTemp(this.IPaddress, start, end);
              } else if (data.widget.header == "loadMemory") {
                this.datalist[10].selected = true;
                this.selecteddatalist.push(this.datalist[10]);
                this.getMemoty(this.IPaddress);
              }
            });
          }
          this.checkchartAll = false;
        } else {
          this.colortitle = "#FFFFFF";
          if (this.dashboard != undefined) {
            this.dashboard.forEach(data => {
              if (data.widget.header == "BandwidthCharts") {
                this.datalist[0].selected = true;
                this.selecteddatalist.push(this.datalist[0]);
                this.getSysInterface(this.IPaddress);
              } else if (data.widget.header == "checkchartmem") {
                this.datalist[1].selected = true;
                this.selecteddatalist.push(this.datalist[1]);
                this.getRangeMemory(start, end);
              } else if (data.widget.header == "checkchartcpu") {
                this.datalist[2].selected = true;
                this.selecteddatalist.push(this.datalist[2]);
                this.getRangeCPU(start, end);
              } else if (data.widget.header == "checkcharttemp") {
                this.datalist[3].selected = true;
                this.selecteddatalist.push(this.datalist[3]);
                this.getRangeTemp(start, end);
              } else if (data.widget.header == "loadcpu1min") {
                this.datalist[4].selected = true;
                this.selecteddatalist.push(this.datalist[4]);
                this.getCPU1min(this.IPaddress, 1);
              } else if (data.widget.header == "loadcpu2min") {
                this.datalist[5].selected = true;
                this.selecteddatalist.push(this.datalist[5]);
                this.getCPU2min(this.IPaddress, 2);
              } else if (data.widget.header == "loadcpu3min") {
                this.datalist[6].selected = true;
                this.selecteddatalist.push(this.datalist[6]);
                this.getCPU3min(this.IPaddress, 3);
              } else if (data.widget.header == "loadcpu4min") {
                this.datalist[7].selected = true;
                this.selecteddatalist.push(this.datalist[7]);
                this.getCPU4min(this.IPaddress, 4);
              } else if (data.widget.header == "loadcpu5min") {
                this.datalist[8].selected = true;
                this.selecteddatalist.push(this.datalist[8]);
                this.getCPU5min(this.IPaddress, 5);
              } else if (data.widget.header == "loadTemp") {
                this.datalist[9].selected = true;
                this.selecteddatalist.push(this.datalist[9]);
                this.getTemp(this.IPaddress, start, end);
              } else if (data.widget.header == "loadMemory") {
                this.datalist[10].selected = true;
                this.selecteddatalist.push(this.datalist[10]);
                this.getMemoty(this.IPaddress);
              }
            });
          }
          this.checkchartAll = false;
        }
      }
    });
    this.gridOptions = this.initialGridOptions;
    this.dashboard = [
      {
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 0,
        widget: {
          content: {
            image: "./assets/img/all_devices.jpg",
            data: 3000
          },
          footer: "something",
          header: "BandwidthCharts",
          type: "A"
        }
      },
      {
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 2,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkchartmem",
          type: "A"
        }
      },
      {
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 4,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkchartcpu",
          type: "A"
        }
      },
      {
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 6,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkcharttemp",
          type: "A"
        }
      },
      // {
      //   cols: 12,
      //   rows: 2,
      //   x: 0,
      //   y: 8,
      //   widget: {
      //     content: {
      //       image: "./assets/img/switch_device.jpg",
      //       data: 3000
      //     },
      //     footer: "something",
      //     header: "checkchartvolt",
      //     type: "A"
      //   }
      // },
      {
        cols: 3,
        rows: 1,
        // x: 0,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu1min",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 3,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu2min",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 6,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu3min",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 9,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu4min",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 0,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu5min",
          type: "A"
        }
      },
      {
        cols: 6,
        rows: 1,
        // x: 3,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadTemp",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 9,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadMemory",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 0,
        // y: 12,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadvoltindex1",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 3,
        // y: 12,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadvoltindex2",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 6,
        // y: 12,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadvoltindex3",
          type: "A"
        }
      },
      {
        cols: 3,
        rows: 1,
        // x: 9,
        // y: 12,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadvoltindex4",
          type: "A"
        }
      }
    ];
    this.deviceService.currentMessageMenu.subscribe(getconfig_table => {
      if (getconfig_table != undefined) {
        this.itemsAction = [
          {
            label: "getconfig_table",
            items: [
              {
                label: "Info",
                icon: "pi pi-fw pi-info",
                command: event => {
                  this.callView(getconfig_table);
                }
              },
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                  this.callEdit(getconfig_table);
                }
              },
              {
                label: "Download",
                icon: "pi pi-fw pi-download",
                command: event => {
                  this.downloadResult(getconfig_table);
                }
              },
              {
                label: "Delete",
                icon: "pi pi-fw pi-trash",
                command: event => {
                  this.callDelete(getconfig_table);
                }
              },
              {
                label: "Push",
                icon: "pi pi-fw pi-download",
                command: event => {
                  this.callPush(getconfig_table);
                }
              }
            ]
          }
        ];
      }
    });
    this.deviceService.currentMessageMenutable.subscribe(getconfig_table => {
      if (getconfig_table != undefined) {
        if (this.isActive == true) {
          this.menuDownloadisActive = false;
        } else {
          this.menuDownloadisActive = true;
        }
        this.itemsActiontable = [
          {
            label: "interface_table",
            items: [
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",

                command: event => {
                  // this.table.value.unshift(new cAutBolsaAplicacion(33333));
                  this.table.initRowEdit(getconfig_table);
                  this.onRowEditInit(getconfig_table);
                  // event.originalEvent.srcElement.isContentEditable = true;
                  // console.log(event.originalEvent.srcElement)
                  // var edit = document.getElementById("editrow");
                  // edit.click()
                }
              }
              // {
              //   label: "Download",
              //   icon: "pi pi-file-pdf",
              //   disabled:this.menuDownloadisActive,
              //   command: event => {
              //     this.exportMonthlyPdfFunc(this.resID,getconfig_table.if_index);
              //   }
              // },
            ]
          }
        ];
      }
    });
  }
  get_sys_info() {
    this.Sysname = undefined;
    this.SNMPList = [];
    this.SNMPaddList = [];
    this.NTPList = [];
    this.deviceService.get_sys_info(this.IPaddress).subscribe({
      next: result => {
        this.Sysname = result.device_name;
        this.Sysnameadd = result.device_name;
        result.ntp.forEach(data => {
          this.NTPList.push(data.server);
          this.NTPaddList.push(data.server);
        });
        result.snmp.forEach(data => {
          var list = [
            {
              name: data.server,
              version: data.comunity
            }
          ];
          this.SNMPList.push(...list);
          this.SNMPaddList.push(...list);
        });
      },
      error: error => {}
    });
  }
  clonedProducts: { [s: string]: any } = {};
  oldProduct: any;
  NewProduct: any;
  styleColordes: any;
  ListNewProducts: any[] = [];
  ListNewProduct: any[] = [];
  beforeClass: any;
  afterClass: any;
  // ListoldProduct:any[]=[];
  onRowEditInit(product: any) {
    this.oldProduct = product;
    this.clonedProducts[product.id] = { ...product };
    this.oldProduct = this.clonedProducts[product.id];
  }
  ListEditValue: any[] = [];
  onRowEditSave(product: any) {
    if (this.ListNewProducts.length == 0) {
      this.ListNewProducts.push(...this.vlanDetailNew);
    }

    if (
      this.oldProduct.if_descr != product.if_descr &&
      this.oldProduct.switch_mode != product.switch_mode &&
      this.oldProduct.vlan != product.vlan
    ) {
      var index = this.ListNewProducts.findIndex(
        data => data.if_index == product.if_index
      );
      if (this.ListNewProduct.length != 0) {
        if (
          this.ListNewProduct[index].if_descr == this.oldProduct.if_descr ||
          this.ListNewProduct[index].switch_mode ==
            this.oldProduct.switch_mode ||
          this.ListNewProduct[index].vlan == this.oldProduct.vlan
        ) {
          if (product != this.vlanDetailNewList[index]) {
            this.ListNewProducts[index] = this.vlanDetailNewList[index];
            this.ListNewProduct = this.ListNewProducts;
            if (this.ListEditValue.length != 0) {
              var indexfilter = this.ListEditValue.findIndex(
                data => data.if_index == product.if_index
              );
              if (this.ListEditValue[indexfilter] != undefined) {
                if (
                  this.ListEditValue[indexfilter].if_index ==
                    this.vlanDetailNewList[index].if_index &&
                  this.ListEditValue[indexfilter].if_descr ==
                    this.vlanDetailNewList[index].if_descr &&
                  this.ListEditValue[indexfilter].switch_mode ==
                    this.vlanDetailNewList[index].switch_mode &&
                  this.ListEditValue[indexfilter].vlan ==
                    this.vlanDetailNewList[index].vlan
                ) {
                  this.ListEditValue = this.ListEditValue.filter(
                    data =>
                      data.if_index != this.vlanDetailNewList[index].if_index &&
                      data.if_descr != this.vlanDetailNewList[index].if_descr &&
                      data.switch_mode !=
                        this.vlanDetailNewList[index].switch_mode &&
                      data.vlan != this.vlanDetailNewList[index].vlan
                  );
                }
              } else {
                this.ListEditValue.push(product);
              }
            } else {
              this.ListEditValue.push(product);
            }
          } else {
            this.ListNewProducts[index] = this.oldProduct;
            this.ListNewProduct = this.ListNewProducts;
            if (this.ListEditValue.length != 0) {
              var filter = this.ListEditValue.filter(
                data => data.if_index == product.if_index
              );
              if (filter.length != 0) {
                var indexfilter = this.ListEditValue.findIndex(
                  data => data.if_index == product.if_index
                );
                this.ListEditValue[indexfilter] = product;
              } else {
                this.ListEditValue.push(product);
              }
            }
          }
          this.showaddConfig = true;
        } else {
          if (product != this.vlanDetailNewList[index]) {
            this.ListNewProducts[index] = this.vlanDetailNewList[index];
            this.ListNewProduct = this.ListNewProducts;
            this.ListEditValue = this.ListEditValue.filter(
              data => data.if_index != product.if_index
            );
          } else {
            this.ListNewProducts[index] = this.oldProduct;
            this.ListNewProduct = this.ListNewProducts;
            if (this.ListEditValue.length != 0) {
              var filter = this.ListEditValue.filter(
                data => data.if_index == product.if_index
              );
              if (filter.length != 0) {
                var indexfilter = this.ListEditValue.findIndex(
                  data => data.if_index == product.if_index
                );
                this.ListEditValue[indexfilter] = product;
              } else {
                this.ListEditValue.push(product);
              }
            } else {
              this.ListEditValue.push(product);
            }
          }
          this.showaddConfig = true;
        }
      } else {
        this.ListNewProducts[index] = this.oldProduct;
        this.ListNewProduct = this.ListNewProducts;
        this.showaddConfig = true;
        this.ListEditValue.push(product);
      }
    } else {
      if (this.oldProduct.if_descr != product.if_descr) {
        var index = this.ListNewProducts.findIndex(
          data => data.if_index == product.if_index
        );
        if (this.ListNewProduct.length != 0) {
          if (
            this.ListNewProduct[index].switch_mode ==
              this.oldProduct.switch_mode &&
            this.ListNewProduct[index].vlan == this.oldProduct.vlan
          ) {
            if (product != this.vlanDetailNewList[index]) {
              this.ListNewProducts[index] = this.vlanDetailNewList[index];
              this.ListNewProduct = this.ListNewProducts;
              if (this.ListEditValue.length != 0) {
                var indexfilter = this.ListEditValue.findIndex(
                  data => data.if_index == product.if_index
                );
                if (this.ListEditValue[indexfilter] != undefined) {
                  if (
                    this.ListEditValue[indexfilter].if_index ==
                      this.vlanDetailNewList[index].if_index &&
                    this.ListEditValue[indexfilter].if_descr ==
                      this.vlanDetailNewList[index].if_descr
                  ) {
                    this.ListEditValue = this.ListEditValue.filter(
                      data =>
                        data.if_index !=
                          this.vlanDetailNewList[index].if_index &&
                        data.if_descr != this.vlanDetailNewList[index].if_descr
                    );
                  }
                } else {
                  this.ListEditValue.push(product);
                }
              } else {
                this.ListEditValue.push(product);
              }
            } else {
              this.ListNewProducts[index] = this.oldProduct;
              this.ListNewProduct = this.ListNewProducts;
              if (this.ListEditValue.length != 0) {
                var filter = this.ListEditValue.filter(
                  data => data.if_index == product.if_index
                );
                if (filter.length != 0) {
                  var indexfilter = this.ListEditValue.findIndex(
                    data => data.if_index == product.if_index
                  );
                  this.ListEditValue[indexfilter] = product;
                } else {
                  this.ListEditValue.push(product);
                }
              } else {
                this.ListEditValue.push(product);
              }
            }

            this.showaddConfig = true;
          } else {
            if (product != this.vlanDetailNewList[index]) {
              this.ListNewProducts[index] = this.vlanDetailNewList[index];
              this.ListNewProduct = this.ListNewProducts;
            } else {
              if (product == this.ListNewProducts[index]) {
                this.ListNewProducts[index] = this.oldProduct;
                this.ListNewProduct = this.ListNewProducts;
              } else {
                this.ListNewProducts[index].if_descr = this.oldProduct.if_descr;
                this.ListNewProduct = this.ListNewProducts;
                if (this.ListEditValue.length != 0) {
                  var filter = this.ListEditValue.filter(
                    data => data.if_index == product.if_index
                  );
                  if (filter.length != 0) {
                    var indexfilter = this.ListEditValue.findIndex(
                      data => data.if_index == product.if_index
                    );
                    this.ListEditValue[indexfilter] = product;
                  } else {
                    this.ListEditValue.push(product);
                  }
                }
              }
            }

            this.showaddConfig = true;
          }
        } else {
          this.ListNewProducts[index] = this.oldProduct;
          this.ListNewProduct = this.ListNewProducts;
          this.showaddConfig = true;
          this.ListEditValue.push(product);
        }
      }
      if (this.oldProduct.switch_mode != product.switch_mode) {
        var index = this.ListNewProducts.findIndex(
          data => data.if_index == product.if_index
        );
        if (this.ListNewProduct.length != 0) {
          if (
            this.ListNewProduct[index].if_descr == this.oldProduct.if_descr &&
            this.ListNewProduct[index].vlan == this.oldProduct.vlan
          ) {
            if (product != this.vlanDetailNewList[index]) {
              this.ListNewProducts[index] = this.vlanDetailNewList[index];
              this.ListNewProduct = this.ListNewProducts;
              if (this.ListEditValue.length != 0) {
                var indexfilter = this.ListEditValue.findIndex(
                  data => data.if_index == product.if_index
                );
                if (this.ListEditValue[indexfilter] != undefined) {
                  if (
                    this.ListEditValue[indexfilter].if_index ==
                      this.vlanDetailNewList[index].if_index &&
                    this.ListEditValue[indexfilter].switch_mode ==
                      this.vlanDetailNewList[index].switch_mode
                  ) {
                    this.ListEditValue = this.ListEditValue.filter(
                      data =>
                        data.if_index !=
                          this.vlanDetailNewList[index].if_index &&
                        data.switch_mode !=
                          this.vlanDetailNewList[index].switch_mode
                    );
                  }
                } else {
                  this.ListEditValue.push(product);
                }
              } else {
                this.ListEditValue.push(product);
              }
              // this.ListEditValue = this.ListEditValue.filter(data => data.if_index != product.if_index)
            } else {
              this.ListNewProducts[index] = this.oldProduct;
              this.ListNewProduct = this.ListNewProducts;
              if (this.ListEditValue.length != 0) {
                var filter = this.ListEditValue.filter(
                  data => data.if_index == product.if_index
                );
                if (filter.length != 0) {
                  var indexfilter = this.ListEditValue.findIndex(
                    data => data.if_index == product.if_index
                  );
                  this.ListEditValue[indexfilter] = product;
                } else {
                  this.ListEditValue.push(product);
                }
              } else {
                this.ListEditValue.push(product);
              }
            }
            this.showaddConfig = true;
          } else {
            if (product != this.vlanDetailNewList[index]) {
              var indexfilter = this.ListEditValue.findIndex(
                data => data.if_index == product.if_index
              );
              this.ListNewProducts[index] = this.vlanDetailNewList[index];
              this.ListNewProduct = this.ListNewProducts;
            } else {
              if (product == this.ListNewProducts[index]) {
                this.ListNewProducts[index] = this.oldProduct;
                this.ListNewProduct = this.ListNewProducts;
              } else {
                this.ListNewProducts[
                  index
                ].switch_mode = this.oldProduct.switch_mode;
                this.ListNewProduct = this.ListNewProducts;
                if (this.ListEditValue.length != 0) {
                  var filter = this.ListEditValue.filter(
                    data => data.if_index == product.if_index
                  );
                  if (filter.length != 0) {
                    var indexfilter = this.ListEditValue.findIndex(
                      data => data.if_index == product.if_index
                    );
                    this.ListEditValue[indexfilter] = product;
                  } else {
                    this.ListEditValue.push(product);
                  }
                }
              }
            }

            this.showaddConfig = true;
          }
        } else {
          this.ListNewProducts[index] = this.oldProduct;
          this.ListNewProduct = this.ListNewProducts;
          this.showaddConfig = true;
          this.ListEditValue.push(product);
        }
      }
      if (this.oldProduct.vlan != product.vlan) {
        var index = this.ListNewProducts.findIndex(
          data => data.if_index == product.if_index
        );
        if (this.ListNewProduct.length != 0) {
          if (
            this.ListNewProduct[index].if_descr == this.oldProduct.if_descr &&
            this.ListNewProduct[index].switch_mode ==
              this.oldProduct.switch_mode
          ) {
            if (product != this.vlanDetailNewList[index]) {
              this.ListNewProducts[index] = this.vlanDetailNewList[index];
              this.ListNewProduct = this.ListNewProducts;
              if (this.ListEditValue.length != 0) {
                var indexfilter = this.ListEditValue.findIndex(
                  data => data.if_index == product.if_index
                );
                if (this.ListEditValue[indexfilter] != undefined) {
                  if (
                    this.ListEditValue[indexfilter].if_index ==
                      this.vlanDetailNewList[index].if_index &&
                    this.ListEditValue[indexfilter].vlan ==
                      this.vlanDetailNewList[index].vlan
                  ) {
                    this.ListEditValue = this.ListEditValue.filter(
                      data =>
                        data.if_index !=
                          this.vlanDetailNewList[index].if_index &&
                        data.vlan != this.vlanDetailNewList[index].vlan
                    );
                  }
                } else {
                  this.ListEditValue.push(product);
                }
              } else {
                this.ListEditValue.push(product);
              }
            } else {
              this.ListNewProducts[index] = this.oldProduct;
              this.ListNewProduct = this.ListNewProducts;
              if (this.ListEditValue.length != 0) {
                var filter = this.ListEditValue.filter(
                  data => data.if_index == product.if_index
                );
                if (filter.length != 0) {
                  var indexfilter = this.ListEditValue.findIndex(
                    data => data.if_index == product.if_index
                  );
                  this.ListEditValue[indexfilter] = product;
                } else {
                  this.ListEditValue.push(product);
                }
              } else {
                this.ListEditValue.push(product);
              }
            }
            this.showaddConfig = true;
          } else {
            if (product != this.vlanDetailNewList[index]) {
              this.ListNewProducts[index] = this.vlanDetailNewList[index];
              this.ListNewProduct = this.ListNewProducts;
            } else {
              if (product == this.ListNewProducts[index]) {
                this.ListNewProducts[index] = this.oldProduct;
                this.ListNewProduct = this.ListNewProducts;
              } else {
                this.ListNewProducts[index].vlan = this.oldProduct.vlan;
                this.ListNewProduct = this.ListNewProducts;
                if (this.ListEditValue.length != 0) {
                  var filter = this.ListEditValue.filter(
                    data => data.if_index == product.if_index
                  );
                  if (filter.length != 0) {
                    var indexfilter = this.ListEditValue.findIndex(
                      data => data.if_index == product.if_index
                    );
                    this.ListEditValue[indexfilter] = product;
                  } else {
                    this.ListEditValue.push(product);
                  }
                }
              }
            }

            this.showaddConfig = true;
          }
        } else {
          this.ListNewProducts[index] = this.oldProduct;
          this.ListNewProduct = this.ListNewProducts;
          this.showaddConfig = true;
          this.ListEditValue.push(product);
        }
      }
    }

    // if (this.ListEditValue.length == 0){
    //   if (this.SNMPaddList.length == this.SNMPList.length && this.NTPaddList.length == this.NTPList.length){
    //     for (let i = 0; i < this.SNMPaddList.length ; i++){
    //         for (let r = 0; r < this.NTPaddList.length ; r++){
    //           if (this.SNMPaddList[i].name == this.SNMPList[i].name && this.SNMPaddList[i].version == this.SNMPList[i].version){
    //             if (this.NTPaddList[r] == this.NTPList[r]){
    //               if (this.Sysname == this.Sysnameadd){
    //                 this.showaddConfig = false;
    //               }
    //             }
    //           }
    //       }
    //     }
    //   }
    // }
  }

  onRowEditCancel(product: any, index: number) {
    this.vlanDetailNew[index] = this.clonedProducts[product.id];
    delete this.clonedProducts[product.id];
  }
  menuVlue(task) {
    this.deviceService.valueSourceMenu(task);
  }
  menuVluetable(data) {
    this.deviceService.valueSourceMenutable(data);
  }
  clearDashboard() {
    var date = new Date();
    var start = date.setDate(date.getDate() - 1);
    var end = new Date().getTime();
    // console.log(start)
    // console.log(end)
    this.deviceService.getDashboard().subscribe({
      next: result => {
        this.dashboard = result.widget_list;
        this.dashboardlist = result.widget_list;
        // console.log(result.widget_list);
        if (result.widget_list.length != 0) {
          this.checkgridster = true;
          result.widget_list.forEach(data => {
            if (data.widget.header == "BandwidthCharts") {
              this.datalist[0].selected = true;
              this.selecteddatalist.push(this.datalist[0]);
              this.getSysInterface(this.IPaddress);
            } else if (data.widget.header == "checkchartmem") {
              this.datalist[1].selected = true;
              this.selecteddatalist.push(this.datalist[1]);
              this.getRangeMemory(start, end);
            } else if (data.widget.header == "checkchartcpu") {
              this.datalist[2].selected = true;
              this.selecteddatalist.push(this.datalist[2]);
              this.getRangeCPU(start, end);
            } else if (data.widget.header == "checkcharttemp") {
              this.datalist[3].selected = true;
              this.selecteddatalist.push(this.datalist[3]);
              this.getRangeTemp(start, end);
            }
            // else if (data.widget.header == "checkchartvolt") {
            //   this.datalist[4].selected = true;
            //   this.selecteddatalist.push(this.datalist[4]);
            //   this.getRangeVolt(start, end);
            // }
            else if (data.widget.header == "loadcpu1min") {
              this.datalist[4].selected = true;
              this.selecteddatalist.push(this.datalist[4]);
              this.getCPU1min(this.IPaddress, 1);
            } else if (data.widget.header == "loadcpu2min") {
              this.datalist[5].selected = true;
              this.selecteddatalist.push(this.datalist[5]);
              this.getCPU2min(this.IPaddress, 2);
            } else if (data.widget.header == "loadcpu3min") {
              this.datalist[6].selected = true;
              this.selecteddatalist.push(this.datalist[6]);
              this.getCPU3min(this.IPaddress, 3);
            } else if (data.widget.header == "loadcpu4min") {
              this.datalist[7].selected = true;
              this.selecteddatalist.push(this.datalist[7]);
              this.getCPU4min(this.IPaddress, 4);
            } else if (data.widget.header == "loadcpu5min") {
              this.datalist[8].selected = true;
              this.selecteddatalist.push(this.datalist[8]);
              this.getCPU5min(this.IPaddress, 5);
            } else if (data.widget.header == "loadTemp") {
              this.datalist[9].selected = true;
              this.selecteddatalist.push(this.datalist[9]);
              this.getTemp(this.IPaddress, start, end);
            } else if (data.widget.header == "loadMemory") {
              this.datalist[10].selected = true;
              this.selecteddatalist.push(this.datalist[10]);
              this.getMemoty(this.IPaddress);
            }
            // else if (data.widget.header == "loadvoltindex1") {
            //   this.datalist[12].selected = true;
            //   this.selecteddatalist.push(this.datalist[12]);
            //   this.getVolt1(this.IPaddress, 1);
            // } else if (data.widget.header == "loadvoltindex2") {
            //   this.datalist[13].selected = true;
            //   this.selecteddatalist.push(this.datalist[13]);
            //   this.getVolt2(this.IPaddress, 2);
            // } else if (data.widget.header == "loadvoltindex3") {
            //   this.datalist[14].selected = true;
            //   this.selecteddatalist.push(this.datalist[14]);
            //   this.getVolt3(this.IPaddress, 3);
            // } else if (data.widget.header == "loadvoltindex4") {
            //   this.datalist[15].selected = true;
            //   this.selecteddatalist.push(this.datalist[15]);
            //   this.getVolt4(this.IPaddress, 4);
            // }
          });
        } else {
          this.loading = false;
          this.checkgridster = false;
        }
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
  editBtn(event) {
    this.showClear = true;
    this.loading1 = true;
    this.showSave = true;
    this.showAdd = true;
    this.showDelete = true;
    this.showEdit = false;
    this.disabledlist = false;
    this.gridOptions = {
      ...this.initialGridOptions,
      itemChangeCallback: DeviceInformationComponent.itemChange,
      itemResizeCallback: AppComponent.itemResize,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,

      resizable: {
        enabled: false
      },
      draggable: {
        enabled: true
      }
    };
  }
  saveBtn(event) {
    this.showClear = false;
    this.showSave = false;
    this.showEdit = true;
    this.showAdd = false;
    this.showDelete = false;
    this.disabledlist = true;
    this.gridOptions = {
      itemChangeCallback: DeviceInformationComponent.itemChange,
      itemResizeCallback: AppComponent.itemResize,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,

      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false
      }
    };
    if (this.dashboard != undefined) {
      if (this.dashboard.length != 0) {
        this.deviceService
          .saveDashboard(this.dashboard)
          .subscribe(result => {});
      }
    } else {
      this.loading1 = false;
    }
  }

  onChangemultiSelect(event) {
    this.checkgridster = true;

    // console.log(event.originalEvent.srcElement.ariaChecked)
    // this.listdrop.forEach(data => {
    if (event.itemValue == undefined) {
      if (event.originalEvent.srcElement.ariaChecked == "false") {
        // console.log(event)
        for (let i = 0; i < event.value.length; i++) {
          // console.log(this.dashboard[i])

          if (event.value[i].selected == false) {
            event.value[i].selected = true;
            this.listAdddAllashboard(event.value[i]);
          } else if (event.value[i].selected == true) {
            // event.value[i].selected = true;
            if (this.dashboard[i] == undefined) {
              if (event.value[i].value == this.dashboardlist[i].widget.header) {
                this.listAdddAllashboard(event.value[i]);
              }
            }
          }
        }
      } else {
        this.dashboard = [];
      }
    } else {
      // console.log(event.itemValue)
      // console.log(event.value)
      var listfilter = event.value.filter(
        data => data.value == event.itemValue.value
      );
      // console.log(listfilter)
      if (listfilter.length != 0) {
        event.itemValue.selected = true;
        this.listAdddashboard(event.itemValue);
        // console.log("hi")
      } else {
        event.itemValue.selected = false;
        // console.log(event.itemValue)
        // console.log("hi2")
        this.listRemovedashboard(event.itemValue);
      }
      // if (event.itemValue.selected == true) {
      //   event.itemValue.selected = false;
      //   this.listRemovedashboard(event.itemValue);
      //   // console.log(event.itemValue)
      // } else if (event.itemValue.selected == false) {
      //   event.itemValue.selected = true;
      //   this.listAdddashboard(event.itemValue);
      //   console.log("hi2")
      // }
    }

    // })
  }
  listAdddashboard(list) {
    var date = new Date();
    var start = date.setDate(date.getDate() - 1);
    var end = new Date().getTime();
    // console.log(list.selected)
    if (list.value == "BandwidthCharts") {
      this.dashboard.push({
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 0,
        widget: {
          content: {
            image: "./assets/img/all_devices.jpg",
            data: 3000
          },
          footer: "something",
          header: "BandwidthCharts",
          type: "A"
        }
      });
      this.getSysInterface(this.IPaddress);
    } else if (list.value == "checkchartmem") {
      this.dashboard.push({
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 2,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkchartmem",
          type: "A"
        }
      });
      this.getRangeMemory(start, end);
    } else if (list.value == "checkchartcpu") {
      this.dashboard.push({
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 4,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkchartcpu",
          type: "A"
        }
      });
      this.getRangeCPU(start, end);
    } else if (list.value == "checkcharttemp") {
      this.dashboard.push({
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 6,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkcharttemp",
          type: "A"
        }
      });
      this.getRangeTemp(start, end);
    }
    // else if (list.value == "checkchartvolt" && list.selected == true) {
    //   this.dashboard.push({
    //     cols: 12,
    //     rows: 2,
    //     x: 0,
    //     y: 8,
    //     widget: {
    //       content: {
    //         image: "./assets/img/switch_device.jpg",
    //         data: 3000
    //       },
    //       footer: "something",
    //       header: "checkchartvolt",
    //       type: "A"
    //     }
    //   });
    //   this.getRangeVolt(start, end);
    // }
    else if (list.value == "loadcpu1min") {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 0,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu1min",
          type: "A"
        }
      });
      this.getCPU1min(this.IPaddress, 1);
    } else if (list.value == "loadcpu2min") {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 3,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu2min",
          type: "A"
        }
      });
      this.getCPU2min(this.IPaddress, 2);
    } else if (list.value == "loadcpu3min") {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 6,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu3min",
          type: "A"
        }
      });
      this.getCPU3min(this.IPaddress, 3);
    } else if (list.value == "loadcpu4min") {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 9,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu4min",
          type: "A"
        }
      });
      this.getCPU4min(this.IPaddress, 4);
    } else if (list.value == "loadcpu5min") {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 0,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu5min",
          type: "A"
        }
      });
      this.getCPU5min(this.IPaddress, 5);
    } else if (list.value == "loadTemp") {
      this.dashboard.push({
        cols: 6,
        rows: 1,
        // x: 3,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadTemp",
          type: "A"
        }
      });
      this.getTemp(this.IPaddress, start, end);
    } else if (list.value == "loadMemory") {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 9,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadMemory",
          type: "A"
        }
      });
      this.getMemoty(this.IPaddress);
    }
  }
  listAdddAllashboard(list) {
    var date = new Date();
    var start = date.setDate(date.getDate() - 1);
    var end = new Date().getTime();
    // console.log(list)
    if (list.value == "BandwidthCharts" && list.selected == true) {
      this.dashboard.push({
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 0,
        widget: {
          content: {
            image: "./assets/img/all_devices.jpg",
            data: 3000
          },
          footer: "something",
          header: "BandwidthCharts",
          type: "A"
        }
      });
      this.getSysInterface(this.IPaddress);
    } else if (list.value == "checkchartmem" && list.selected == true) {
      this.dashboard.push({
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 2,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkchartmem",
          type: "A"
        }
      });
      this.getRangeMemory(start, end);
    } else if (list.value == "checkchartcpu" && list.selected == true) {
      this.dashboard.push({
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 4,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkchartcpu",
          type: "A"
        }
      });
      this.getRangeCPU(start, end);
    } else if (list.value == "checkcharttemp" && list.selected == true) {
      this.dashboard.push({
        cols: 12,
        rows: 2,
        // x: 0,
        // y: 6,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "checkcharttemp",
          type: "A"
        }
      });
      this.getRangeTemp(start, end);
    }
    // else if (list.value == "checkchartvolt" && list.selected == true) {
    //   this.dashboard.push({
    //     cols: 12,
    //     rows: 2,
    //     // x: 0,
    //     // y: 8,
    //     widget: {
    //       content: {
    //         image: "./assets/img/switch_device.jpg",
    //         data: 3000
    //       },
    //       footer: "something",
    //       header: "checkchartvolt",
    //       type: "A"
    //     }
    //   });
    //   this.getRangeVolt(start, end);
    // }
    else if (list.value == "loadcpu1min" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 0,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu1min",
          type: "A"
        }
      });
      this.getCPU1min(this.IPaddress, 1);
    } else if (list.value == "loadcpu2min" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 3,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu2min",
          type: "A"
        }
      });
      this.getCPU2min(this.IPaddress, 2);
    } else if (list.value == "loadcpu3min" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 6,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu3min",
          type: "A"
        }
      });
      this.getCPU3min(this.IPaddress, 3);
    } else if (list.value == "loadcpu4min" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 9,
        // y: 10,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu4min",
          type: "A"
        }
      });
      this.getCPU4min(this.IPaddress, 4);
    } else if (list.value == "loadcpu5min" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 0,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadcpu5min",
          type: "A"
        }
      });
      this.getCPU5min(this.IPaddress, 5);
    } else if (list.value == "loadTemp" && list.selected == true) {
      this.dashboard.push({
        cols: 6,
        rows: 1,
        // x: 3,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadTemp",
          type: "A"
        }
      });
      this.getTemp(this.IPaddress, start, end);
    } else if (list.value == "loadMemory" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 9,
        // y: 11,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadMemory",
          type: "A"
        }
      });
      this.getMemoty(this.IPaddress);
    } else if (list.value == "loadvoltindex1" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 0,
        // y: 12,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadvoltindex1",
          type: "A"
        }
      });
      this.getVolt1(this.IPaddress, 1);
    } else if (list.value == "loadvoltindex2" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 3,
        // y: 12,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadvoltindex2",
          type: "A"
        }
      });
      this.getVolt2(this.IPaddress, 2);
    } else if (list.value == "loadvoltindex3" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 6,
        // y: 12,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadvoltindex3",
          type: "A"
        }
      });
      this.getVolt3(this.IPaddress, 3);
    } else if (list.value == "loadvoltindex4" && list.selected == true) {
      this.dashboard.push({
        cols: 3,
        rows: 1,
        // x: 9,
        // y: 12,
        widget: {
          content: {
            image: "./assets/img/switch_device.jpg",
            data: 3000
          },
          footer: "something",
          header: "loadvoltindex4",
          type: "A"
        }
      });
      this.getVolt4(this.IPaddress, 4);
    }
  }
  listRemovedashboard(list) {
    if (list.value == "BandwidthCharts" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "checkchartmem" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "checkchartcpu" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "checkcharttemp" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    }
    // else if (list.value == "checkchartvolt" && list.selected == false) {
    //   this.dashboard = this.dashboard.filter(
    //     data => data.widget.header != list.value
    //   );
    // }
    else if (list.value == "loadcpu1min" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "loadcpu2min" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "loadcpu3min" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "loadcpu4min" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "loadcpu5min" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "loadTemp" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    } else if (list.value == "loadMemory" && list.selected == false) {
      this.dashboard = this.dashboard.filter(
        data => data.widget.header != list.value
      );
    }
    // else if (list.value == "loadvoltindex1" && list.selected == false) {
    //   this.dashboard = this.dashboard.filter(
    //     data => data.widget.header != list.value
    //   );
    // } else if (list.value == "loadvoltindex2" && list.selected == false) {
    //   this.dashboard = this.dashboard.filter(
    //     data => data.widget.header != list.value
    //   );
    // } else if (list.value == "loadvoltindex3" && list.selected == false) {
    //   this.dashboard = this.dashboard.filter(
    //     data => data.widget.header != list.value
    //   );
    // } else if (list.value == "loadvoltindex4" && list.selected == false) {
    //   this.dashboard = this.dashboard.filter(
    //     data => data.widget.header != list.value
    //   );
    // }
  }
  toFindDuplicates(arry) {
    const uniqueElements = new Set(arry);
    // console.log(uniqueElements)
    // const filteredElements = arry.filter(item => {
    //     if (uniqueElements.has(item)) {
    //         console.log(item)
    //         uniqueElements.delete(item);
    //     } else {
    //         console.log(item)
    //         return item;
    //     }
    // });

    return [...new Set(uniqueElements)];
  }
  isLoading: boolean = true;
  ifIndexString: any;
  getSysInterface(ip_addr) {
    this.deviceService.getSysInterface(ip_addr).subscribe({
      next: result => {
        // this.selectChartAll(start,end,this.listifIndex)
        // this.array_data.forEach(list => {
        //   this.selectChartAll(list.ifIndex)
        //   console.log(list.ifIndex)
        // })
        // console.log(this.array_data)
        // console.log(result.data.length)
        // this.selectChartAll(list.ifIndex )
        this.isLoading = false;
        if (
          result.data == null ||
          result.data === 0 ||
          result.data.length === 0
        ) {
          this.hasNoVlan = true;
        }

        // this.hasNoVlan = result == null || result === 0 || result.length === 0;
        var filterPC = result.data.filter(item => !item.if_name.includes('PC'));
        this.vlanDetailNew = filterPC;
        this.vlanDetailNewList.push(...filterPC);
        var vlanDetailinterface = filterPC.map(function(singleElement) {
          return singleElement.if_name;
        });
        var vlanDetaildescription = filterPC.map(function(singleElement) {
          return singleElement.if_descr;
        });
        var vlanDetailmode = filterPC.map(function(singleElement) {
          return singleElement.switch_mode;
        });
        var vlanDetailvlan = filterPC.map(function(singleElement) {
          return singleElement.vlan;
        });
        var vlanDetailcrc = filterPC.map(function(singleElement) {
          return singleElement.crc_error;
        });
        var vlanDetailif_oper_status = filterPC.map(function(singleElement) {
          if (singleElement.if_oper_status == 1) {
            singleElement.if_oper_status = "Up";
          } else {
            singleElement.if_oper_status = "Down";
          }
          return singleElement.if_oper_status;
        });
        var vlanDetailvender_name = filterPC.map(function(singleElement) {
          return singleElement.vendor_name;
        });
        var vlanDetailrx_power = filterPC.map(function(singleElement) {
          return singleElement.rx_power;
        });
        var vlanDetailtx_power = filterPC.map(function(singleElement) {
          return singleElement.tx_power;
        });
        var vlanDetailmau_type = filterPC.map(function(singleElement) {
          return singleElement.mau_type;
        });
        var vlanDetailif_mtu = filterPC.map(function(singleElement) {
          return singleElement.if_mtu;
        });
        var vlanDetailduplex_mode = filterPC.map(function(singleElement) {
          return singleElement.duplex_mode;
        });

        var nulldes = vlanDetaildescription.filter(data => data != "");
        var nullmode = vlanDetailmode.filter(data => data != "");
        var nullvlan = vlanDetailvlan.filter(data => data != "");
        var nullcrc = vlanDetailcrc.filter(data => data != null);
        var nullif_oper_status = vlanDetailif_oper_status.filter(
          data => data != null
        );
        var nullvender_name = vlanDetailvender_name.filter(data => data != "");
        var nullrx_power = vlanDetailrx_power.filter(data => data != null);
        var nulltx_power = vlanDetailtx_power.filter(data => data != null);
        var nullmau_type = vlanDetailmau_type.filter(data => data != "");
        var nullif_mtu = vlanDetailif_mtu.filter(data => data != null);
        var nullduplex_mode = vlanDetailduplex_mode.filter(
          data => data != null
        );
        const duplicateElements = this.toFindDuplicates(nullmode);
        const duplicateElementsVlan = this.toFindDuplicates(nullvlan);
        const duplicateElementsCRC = this.toFindDuplicates(nullcrc);
        const duplicateElementsif_oper_status = this.toFindDuplicates(
          nullif_oper_status
        );
        const duplicateElementsvender_name = this.toFindDuplicates(
          nullvender_name
        );
        const duplicateElementsrx_power = this.toFindDuplicates(nullrx_power);
        const duplicateElementstx_power = this.toFindDuplicates(nulltx_power);
        const duplicateElementsmau_type = this.toFindDuplicates(nullmau_type);
        const duplicateElementsif_mtu = this.toFindDuplicates(nullif_mtu);
        const duplicateElementsduplex_mode = this.toFindDuplicates(
          nullduplex_mode
        );
        this.interfaceArr.push(...vlanDetailinterface);
        this.descriptionArr.push(...nulldes);
        this.modeArr.push(...duplicateElements);
        this.vlanArr.push(...duplicateElementsVlan);
        this.crcArr.push(...duplicateElementsCRC);
        this.statusArr.push(...duplicateElementsif_oper_status);
        this.vender_nameArr.push(...duplicateElementsvender_name);
        this.rx_powerArr.push(...duplicateElementsrx_power);
        this.tx_powerArr.push(...duplicateElementstx_power);
        this.mau_typeArr.push(...duplicateElementsmau_type);
        this.if_mtuArr.push(...duplicateElementsif_mtu);
        this.duplex_modeArr.push(...duplicateElementsduplex_mode);
        if (filterPC.length != 0) {
          this.array_data = [
            {
              port: "All",
              ifIndex: "0"
            }
          ];
          // console.log(filterPC)
          filterPC.forEach(list => {
            if (!list.ifName.includes("PC")) {
              let modifiedIfName = list.ifName.replace(/([a-zA-Z])(\d)/g, '$1 $2');
              var array_data = {
                port: list.ifName,
                ifIndex: list.ifIndex
              };

              this.array_data.push(array_data);
              var array_data1 = {
                port: modifiedIfName,
                ifIndex: list.ifIndex
              };
      
              this.array_data1.push(array_data1);
            }
          });
          this.array_data.sort((a, b) => a.port.localeCompare(b.port, undefined, { numeric: true }));
          this.array_data1.sort((a, b) => a.port.localeCompare(b.port, undefined, { numeric: true }));
          var ifIndexArray = filterPC.map(list => list.ifIndex);
          this.ifIndexString = ifIndexArray.join(",");

          var ifIndex = filterPC.map(function(singleElement) {
            return parseInt(singleElement.ifIndex);
          });
          this.listifIndex.push(...ifIndex);
          this.getCurrentChart();
          // console.log("hi1")
          this.showpick = true;
        } else {
          this.showpick = false;
          // console.log("hi")
          this.showchart = false;
          this.loading = false;
          this.array_data = [];
        }

        // console.log(result)
      },
      error: error => {
        if (error.status == 401) {
          this.showpick = true;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        }
      }
    });
    // this.deviceService.getSysInterface(ip_addr).subscribe({
    //   next: result => {
    //     this.vlanDetailNewList = result.data;
    //   },
    //   error: error => {
    //     if (error.status == 401) {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: "Session expired, please logout and login again."
    //       });
    //     }
    //   }
    // });
  }

  actionItem(getconfig_table: getconfig_table) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Info",
            icon: "pi pi-fw pi-info",
            command: event => {
              this.callView(getconfig_table);
            }
          }
        ]
      },
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Edit",
            icon: "pi pi-fw pi-pencil",
            command: event => {
              this.callEdit(getconfig_table);
            }
          }
        ]
      },
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Download",
            icon: "pi pi-fw pi-download",
            command: event => {
              this.downloadResult(getconfig_table);
            }
          }
        ]
      },
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Delete",
            icon: "pi pi-fw pi-trash",
            command: event => {
              this.callDelete(getconfig_table);
            }
          }
        ]
      },
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Push",
            icon: "pi pi-fw pi-download",
            command: event => {
              this.callPush(getconfig_table);
            }
          }
        ]
      }
    ];
  }
  RangeMemory: any;
  menuExportRangeMemory: MenuItem[];
  getRangeMemory(start, end) {
    // console.log(this.IPaddress)
    this.loading = true;
    this.loading1 = true;
    this.checkchartmem = true;
    // this.checkchart = true;
    // this.selectedPortChart = this.array_data[1]
    this.deviceService.getRangeMemory(this.IPaddress, start, end).subscribe({
      next: results => {
        this.checkchartmem = true;
        if (results.data == null || results.data.length == 0) {
          this.loading = false;
          this.loading1 = false;
          this.checkchartmem = false;
          this.array_dataMem = [];
        } else {
          this.array_dataMem = results.data;
          // console.log(results.data)
          this.checkchartmem = true;
          this.loading = false;
          this.menuExportRangeMemory = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.RangeMemory.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Memory Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Memory Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                },
                {
                  label: "Download PNG Image",
                  // icon: "pi pi-fw pi-pencil",
                  command: event => {
                    this.RangeMemory.exportChart(
                      {
                        type: "image/png",
                        filename: "Memory Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Memory Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                },
                {
                  label: "Download PDF",
                  // icon: "pi pi-fw pi-calendar",
                  command: event => {
                    this.RangeMemory.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Memory Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Memory Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                }
              ]
            }
          ];
          var optionsstatus: any = {
            time: {
              timezoneOffset: -7 * 60
            },
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: `Memory Utilization`,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            // subtitle: {
            //   text: `${results.data.ifDescr} `,
            //   verticalAlign: "top",
            //   widthAdjust: -300,
            //   y: 35,
            //   style: {
            //     class: "m-0",
            //     fontSize: "1.2em"
            //   }
            // },
            credits: {
              enabled: false
            },
            exporting: {
              enabled: false
            },
            xAxis: {
              type: "datetime",
              gridLineWidth: 1,
              time: {
                timezone: "Asia/Bangkok"
              }
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "MB"
              }
            },
            plotOptions: {
              time: {
                timezone: "Asia/Bangkok",
                timezoneOffset: -7 * 60
              },
              series: {
                dataGrouping: {
                  approximation: "average",
                  enabled: true,
                  forced: true,
                  units: [["minute", [1]]],

                  style: {
                    fontSize: 10
                  },

                  formatter: function() {
                    if (this.y === this.series.dataMax) {
                      var AA = this.x + 839980 * 30;

                      return (
                        Highcharts.dateFormat("%H:%M:%S", AA) +
                        "<br/>" +
                        '<span style="color:' +
                        this.series.color +
                        '; font-size: 1.5em;">' +
                        "</span> " +
                        this.series.name +
                        ": " +
                        this.y
                      );
                    }
                  }
                }
              }
            },
            series: [
              {
                type: "line",
                name: "Total",
                data: results.data.total,
                color: "#FF0000",
                lineWidth: 1,

                tooltip: {
                  headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat:
                    '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} MB</b></td></tr>',
                  footerFormat: "</table>",
                  shared: true,
                  useHTML: true
                }
              },
              {
                type: "line",
                name: "Available",
                data: results.data.available,
                color: "#0000FF",
                lineWidth: 1,

                tooltip: {
                  headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat:
                    '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} MB</b></td></tr>',
                  footerFormat: "</table>",
                  shared: true,
                  useHTML: true
                }
              },
              {
                type: "line",
                name: "Usage",
                data: results.data.usage,
                color: "#2ECC71",
                lineWidth: 1,

                tooltip: {
                  headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat:
                    '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} MB</b></td></tr>',
                  footerFormat: "</table>",
                  shared: true,
                  useHTML: true
                }
              }
            ]
          };
          Highcharts.chart("containerMemory", optionsstatus);
          this.RangeMemory = Highcharts.chart("containerMemory", optionsstatus);
        }
      },
      error: error => {
        if (error) {
          this.checkchartmem = false;
          this.loading = false;
          this.checkchart = false;
        }
      }
    });
  }
  RangeCPU: any;
  menuExportRangeCPU: MenuItem[];
  getRangeCPU(start, end) {
    // console.log(this.IPaddress)
    this.loading = true;
    this.loading1 = true;
    this.checkchartcpu = true;
    // this.checkchart = true;
    // this.selectedPortChart = this.array_data[1]
    this.deviceService.getRangeCPU(this.IPaddress, start, end).subscribe({
      next: results => {
        if (results.data == null || results.data.length == 0) {
          this.loading = false;
          this.loading1 = false;
          this.checkchartcpu = false;
          this.array_dataCPU = [];
        } else {
          // console.log(results.data)
          this.array_dataCPU = results.data;
          this.checkchartcpu = true;
          this.loading = false;
          this.menuExportRangeCPU = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.RangeCPU.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "CPU Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "CPU Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                },
                {
                  label: "Download PNG Image",
                  // icon: "pi pi-fw pi-pencil",
                  command: event => {
                    this.RangeCPU.exportChart(
                      {
                        type: "image/png",
                        filename: "CPU Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "CPU Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                },
                {
                  label: "Download PDF",
                  // icon: "pi pi-fw pi-calendar",
                  command: event => {
                    this.RangeCPU.exportChart(
                      {
                        type: "application/pdf",
                        filename: "CPU Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "CPU Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                }
              ]
            }
          ];
          var optionsstatus: any = {
            time: {
              timezoneOffset: -7 * 60
            },
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: `CPU Utilization`,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            // subtitle: {
            //   text: `${results.data.ifDescr} `,
            //   verticalAlign: "top",
            //   widthAdjust: -300,
            //   y: 35,
            //   style: {
            //     class: "m-0",
            //     fontSize: "1.2em"
            //   }
            // },
            credits: {
              enabled: false
            },
            exporting: {
              enabled: false
            },
            xAxis: {
              type: "datetime",
              gridLineWidth: 1,
              time: {
                timezone: "Asia/Bangkok"
              }
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "%"
              }
            },
            plotOptions: {
              time: {
                timezone: "Asia/Bangkok",
                timezoneOffset: -7 * 60
              },
              series: {
                dataGrouping: {
                  approximation: "average",
                  enabled: true,
                  forced: true,
                  units: [["minute", [1]]],

                  style: {
                    fontSize: 10
                  },

                  formatter: function() {
                    if (this.y === this.series.dataMax) {
                      var AA = this.x + 839980 * 30;

                      return (
                        Highcharts.dateFormat("%H:%M:%S", AA) +
                        "<br/>" +
                        '<span style="color:' +
                        this.series.color +
                        '; font-size: 1.5em;">' +
                        "</span> " +
                        this.series.name +
                        ": " +
                        this.y
                      );
                    }
                  }
                }
              }
            },
            series: [
              {
                type: "line",
                name: "Util",
                data: results.data.util,
                color: "#FF0000",
                lineWidth: 1,

                tooltip: {
                  headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat:
                    '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                  footerFormat: "</table>",
                  shared: true,
                  useHTML: true
                }
              }
            ]
          };
          Highcharts.chart("containerCPU", optionsstatus);
          this.RangeCPU = Highcharts.chart("containerCPU", optionsstatus);
        }
      },
      error: error => {
        if (error) {
          this.checkchartcpu = false;
          this.loading = false;
          this.checkchart = false;
        }
      }
    });
  }
  RangeTemp: any;
  menuExportRangeTemp: MenuItem[];
  getRangeTemp(start, end) {
    // console.log(this.IPaddress)
    this.loading = true;
    this.loading1 = true;
    this.checkcharttemp = true;
    // this.checkchart = true;
    // this.selectedPortChart = this.array_data[1]
    this.deviceService.getRangeTemp(this.IPaddress, start, end).subscribe({
      next: results => {
        if (results.data == null || results.data.length == 0) {
          this.loading = false;
          this.loading1 = false;
          this.checkcharttemp = false;
          this.array_dataTemp = [];
        } else {
          this.array_dataTemp = results.data;
          // console.log(results.data)
          this.checkcharttemp = true;
          this.loading = false;
          this.menuExportRangeTemp = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.RangeTemp.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Termometer Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Termometer Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                },
                {
                  label: "Download PNG Image",
                  // icon: "pi pi-fw pi-pencil",
                  command: event => {
                    this.RangeTemp.exportChart(
                      {
                        type: "image/png",
                        filename: "Termometer Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Termometer Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                },
                {
                  label: "Download PDF",
                  // icon: "pi pi-fw pi-calendar",
                  command: event => {
                    this.RangeTemp.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Termometer Device Name:" + this.device_name,
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Termometer Device Name:" + this.device_name,
                          style: {
                            color: "#17212f"
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: "#17212f"
                          }
                        }
                      }
                    );
                  }
                }
              ]
            }
          ];
          var optionsstatus: any = {
            time: {
              timezoneOffset: -7 * 60
            },
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: `Termometer Utilization`,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            // subtitle: {
            //   text: `${results.data.ifDescr} `,
            //   verticalAlign: "top",
            //   widthAdjust: -300,
            //   y: 35,
            //   style: {
            //     class: "m-0",
            //     fontSize: "1.2em"
            //   }
            // },
            credits: {
              enabled: false
            },
            xAxis: {
              type: "datetime",
              gridLineWidth: 1,
              time: {
                timezone: "Asia/Bangkok"
              }
            },
            exporting: {
              enabled: false
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "°C"
              }
            },
            plotOptions: {
              time: {
                timezone: "Asia/Bangkok",
                timezoneOffset: -7 * 60
              },
              series: {
                dataGrouping: {
                  approximation: "average",
                  enabled: true,
                  forced: true,
                  units: [["minute", [1]]],

                  style: {
                    fontSize: 10
                  },

                  formatter: function() {
                    if (this.y === this.series.dataMax) {
                      var AA = this.x + 839980 * 30;

                      return (
                        Highcharts.dateFormat("%H:%M:%S", AA) +
                        "<br/>" +
                        '<span style="color:' +
                        this.series.color +
                        '; font-size: 1.5em;">' +
                        "</span> " +
                        this.series.name +
                        ": " +
                        this.y
                      );
                    }
                  }
                }
              }
            },
            series: [
              {
                type: "line",
                name: "Temp",
                data: results.data.temp,
                color: "#FF0000",
                lineWidth: 1,

                tooltip: {
                  headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat:
                    '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} °C</b></td></tr>',
                  footerFormat: "</table>",
                  shared: true,
                  useHTML: true
                }
              }
            ]
          };
          Highcharts.chart("containerTemp", optionsstatus);
          this.RangeTemp = Highcharts.chart("containerTemp", optionsstatus);
        }
      },
      error: error => {
        if (error) {
          this.checkcharttemp = false;
          this.loading = false;
          this.checkchart = false;
        }
      }
    });
  }
  // getRangeVolt(start, end) {
  //   console.log(this.IPaddress)
  //   this.loading = true;
  //   this.loading1 = true;
  //   this.checkchartvolt = true;
  //   // this.checkchart = true;
  //   // this.selectedPortChart = this.array_data[1]
  //   this.deviceService.getRangeVolt(this.IPaddress, start, end).subscribe({
  //     next: results => {
  //       if (results.data == null || results.data.length == 0) {
  //         this.loading = false;
  //         this.loading1 = false;
  //         this.checkchartvolt = false;
  //         this.array_dataVolt = [];
  //       } else {
  //         this.array_dataVolt = results.data;
  //         this.checkchartvolt = true;
  //         this.loading = false;
  //         var optionsstatus: any = {
  //           time: {
  //             timezoneOffset: -7 * 60
  //           },
  //           chart: {
  //             zoomType: "x"
  //           },
  //           title: {
  //             text: `Volt Utilization`
  //           },
  //           // subtitle: {
  //           //   text: `${results.data.ifDescr} `,
  //           //   verticalAlign: "top",
  //           //   widthAdjust: -300,
  //           //   y: 35,
  //           //   style: {
  //           //     class: "m-0",
  //           //     fontSize: "1.2em"
  //           //   }
  //           // },
  //           credits: {
  //             enabled: false
  //           },
  //           xAxis: {
  //             type: "datetime",
  //             gridLineWidth: 1,
  //             time: {
  //               timezone: "Asia/Bangkok"
  //             }
  //           },
  //           yAxis: {
  //             minPadding: 0.2,
  //             maxPadding: 0.2,
  //             gridLineWidth: 1,
  //             title: {
  //               text: "mv"
  //             }
  //           },
  //           plotOptions: {
  //             time: {
  //               timezone: "Asia/Bangkok",
  //               timezoneOffset: -7 * 60
  //             },
  //             series: {
  //               dataGrouping: {
  //                 approximation: "average",
  //                 enabled: true,
  //                 forced: true,
  //                 units: [["minute", [1]]],

  //                 style: {
  //                   fontSize: 10
  //                 },

  //                 formatter: function () {
  //                   if (this.y === this.series.dataMax) {
  //                     var AA = this.x + 839980 * 30;

  //                     return (
  //                       Highcharts.dateFormat("%H:%M:%S", AA) +
  //                       "<br/>" +
  //                       '<span style="color:' +
  //                       this.series.color +
  //                       '; font-size: 1.5em;">' +
  //                       "</span> " +
  //                       this.series.name +
  //                       ": " +
  //                       this.y
  //                     );
  //                   }
  //                 }
  //               }
  //             }
  //           },
  //           series: [
  //             {
  //               type: "line",
  //               name: "Current Volt1",
  //               data: results.data.volt1.volt,
  //               color: "#FFC800",
  //               lineWidth: 1,

  //               tooltip: {
  //                 headerFormat:
  //                   '<span style="font-size:10px">{point.key}</span><table>',
  //                 pointFormat:
  //                   '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //                   '<td style="padding:0"><b>{point.y:.1f} mv</b></td></tr>',
  //                 footerFormat: "</table>",
  //                 shared: true,
  //                 useHTML: true
  //               }
  //             },
  //             {
  //               type: "line",
  //               name: "Current Volt1 ref",
  //               data: results.data.volt1.volt_ref,
  //               dashStyle: "longdash",
  //               color: "#FFC800",
  //               lineWidth: 1,

  //               tooltip: {
  //                 headerFormat:
  //                   '<span style="font-size:10px">{point.key}</span><table>',
  //                 pointFormat:
  //                   '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //                   '<td style="padding:0"><b>{point.y:.1f} mv</b></td></tr>',
  //                 footerFormat: "</table>",
  //                 shared: true,
  //                 useHTML: true
  //               }
  //             },
  //             {
  //               type: "line",
  //               name: "Current Volt2",
  //               data: results.data.volt2.volt,
  //               color: "#0000FF",
  //               dashStyle: "longdash",
  //               lineWidth: 1,

  //               tooltip: {
  //                 headerFormat:
  //                   '<span style="font-size:10px">{point.key}</span><table>',
  //                 pointFormat:
  //                   '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //                   '<td style="padding:0"><b>{point.y:.1f} mv</b></td></tr>',
  //                 footerFormat: "</table>",
  //                 shared: true,
  //                 useHTML: true
  //               }
  //             },
  //             {
  //               type: "line",
  //               name: "Current Volt2 ref",
  //               data: results.data.volt2.volt_ref,
  //               color: "#0000FF",
  //               lineWidth: 1,

  //               tooltip: {
  //                 headerFormat:
  //                   '<span style="font-size:10px">{point.key}</span><table>',
  //                 pointFormat:
  //                   '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //                   '<td style="padding:0"><b>{point.y:.1f} mv</b></td></tr>',
  //                 footerFormat: "</table>",
  //                 shared: true,
  //                 useHTML: true
  //               }
  //             },
  //             {
  //               type: "line",
  //               name: "Current Volt3",
  //               data: results.data.volt3.volt,
  //               color: "#2ECC71",
  //               lineWidth: 1,

  //               tooltip: {
  //                 headerFormat:
  //                   '<span style="font-size:10px">{point.key}</span><table>',
  //                 pointFormat:
  //                   '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //                   '<td style="padding:0"><b>{point.y:.1f} mv</b></td></tr>',
  //                 footerFormat: "</table>",
  //                 shared: true,
  //                 useHTML: true
  //               }
  //             },
  //             {
  //               type: "line",
  //               name: "Current Volt3 ref",
  //               data: results.data.volt3.volt_ref,
  //               dashStyle: "longdash",
  //               color: "#2ECC71",
  //               lineWidth: 1,

  //               tooltip: {
  //                 headerFormat:
  //                   '<span style="font-size:10px">{point.key}</span><table>',
  //                 pointFormat:
  //                   '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //                   '<td style="padding:0"><b>{point.y:.1f} mv</b></td></tr>',
  //                 footerFormat: "</table>",
  //                 shared: true,
  //                 useHTML: true
  //               }
  //             },
  //             {
  //               type: "line",
  //               name: "Current Volt4",
  //               data: results.data.volt4.volt,
  //               color: "#DC7633",
  //               lineWidth: 1,

  //               tooltip: {
  //                 headerFormat:
  //                   '<span style="font-size:10px">{point.key}</span><table>',
  //                 pointFormat:
  //                   '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //                   '<td style="padding:0"><b>{point.y:.1f} mv</b></td></tr>',
  //                 footerFormat: "</table>",
  //                 shared: true,
  //                 useHTML: true
  //               }
  //             },
  //             {
  //               type: "line",
  //               name: "Current Volt4 ref",
  //               data: results.data.volt4.volt_ref,
  //               dashStyle: "longdash",
  //               color: "#DC7633",
  //               lineWidth: 1,

  //               tooltip: {
  //                 headerFormat:
  //                   '<span style="font-size:10px">{point.key}</span><table>',
  //                 pointFormat:
  //                   '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //                   '<td style="padding:0"><b>{point.y:.1f} mv</b></td></tr>',
  //                 footerFormat: "</table>",
  //                 shared: true,
  //                 useHTML: true
  //               }
  //             }
  //           ]
  //         };
  //         Highcharts.chart("containerVolt", optionsstatus);
  //       }
  //     },
  //     error: error => {
  //       if (error) {
  //         this.loading = false;
  //         this.checkchart = false;
  //         this.checkchartvolt = false;
  //       }
  //     }
  //   });
  // }
  getCPU1min(ip_addr, load_x_min) {
    this.deviceService.getCPU(ip_addr, load_x_min).subscribe({
      next: results => {
        if (load_x_min == 1) {
          this.valueCPU1min = results.data;

          this.loadcpu1min = true;
        }
      },
      error: error => {
        if (error) {
          this.loading = false;
        }
      }
    });
  }
  getCPU2min(ip_addr, load_x_min) {
    // console.log(this.IPaddress)
    this.deviceService.getCPU(ip_addr, load_x_min).subscribe({
      next: results => {
        if (load_x_min == 2) {
          this.valueCPU2min = results.data;
          this.loadcpu2min = true;
        }
      },
      error: error => {
        if (error) {
          // this.checkchartmem = false;
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getCPU3min(ip_addr, load_x_min) {
    // console.log(this.IPaddress)
    this.deviceService.getCPU(ip_addr, load_x_min).subscribe({
      next: results => {
        if (load_x_min == 3) {
          this.valueCPU3min = results.data;
          this.loadcpu3min = true;
        }

        // console.log(results.data)
      },
      error: error => {
        if (error) {
          // this.checkchartmem = false;
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getCPU4min(ip_addr, load_x_min) {
    // console.log(this.IPaddress)
    this.deviceService.getCPU(ip_addr, load_x_min).subscribe({
      next: results => {
        if (load_x_min == 4) {
          this.valueCPU4min = results.data;
          this.loadcpu4min = true;
        }

        // console.log(results.data)
      },
      error: error => {
        if (error) {
          // this.checkchartmem = false;
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }

  getCPU5min(ip_addr, load_x_min) {
    // console.log(this.IPaddress)
    this.deviceService.getCPU(ip_addr, load_x_min).subscribe({
      next: results => {
        if (load_x_min == 5) {
          this.valueCPU5min = results.data;
          this.loadcpu5min = true;
        }

        // console.log(results.data)
      },
      error: error => {
        if (error) {
          // this.checkchartmem = false;
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getMemotyexport: any;
  menuExportMemoty: MenuItem[];
  getMemoty(ip_addr) {
    this.loadMemory = true;
    // console.log(this.IPaddress)
    this.deviceService.getMemory(ip_addr).subscribe({
      next: result => {
        if (result != null) {
          this.menuExportMemoty = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.getMemotyexport.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Memory Device Name:" + this.device_name,
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Memory Device Name:" + this.device_name
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            result.data.total / (1024 * 1024)
                          ),
                          verticalAlign: "middle",
                          widthAdjust: 300,
                          y: 40,
                          style: {
                            color: "#17212f"
                          }
                        },
                        plotOptions: {
                          pie: {
                            allowPointSelect: true,
                            cursor: "pointer",
                            size: 120,

                            dataLabels: {
                              enabled: true,
                              format:
                                '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.0f} Devices ({point.percentage:.1f} %)'
                            }
                          }
                        }
                      }
                    );
                  }
                },
                {
                  label: "Download PNG Image",
                  // icon: "pi pi-fw pi-pencil",
                  command: event => {
                    this.getMemotyexport.exportChart(
                      {
                        type: "image/png",
                        filename: "All Device",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Memory Device Name:" + this.device_name
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            result.data.total / (1024 * 1024)
                          ),
                          verticalAlign: "middle",
                          widthAdjust: 300,
                          y: 40,
                          style: {
                            color: "#17212f"
                          }
                        },
                        plotOptions: {
                          pie: {
                            allowPointSelect: true,
                            cursor: "pointer",
                            size: 120,

                            dataLabels: {
                              enabled: true,
                              format:
                                '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.0f} Devices ({point.percentage:.1f} %)'
                            }
                          }
                        }
                      }
                    );
                  }
                },
                {
                  label: "Download PDF",
                  // icon: "pi pi-fw pi-calendar",
                  command: event => {
                    this.getMemotyexport.exportChart(
                      {
                        type: "application/pdf",
                        filename: "All Device",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Memory Device Name:" + this.device_name
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            result.data.total / (1024 * 1024)
                          ),
                          verticalAlign: "middle",
                          widthAdjust: 300,
                          y: 40,
                          style: {
                            color: "#17212f"
                          }
                        },
                        plotOptions: {
                          pie: {
                            allowPointSelect: true,
                            cursor: "pointer",
                            size: 120,

                            dataLabels: {
                              enabled: true,
                              format:
                                '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.0f} Devices ({point.percentage:.1f} %)'
                            }
                          }
                        }
                      }
                    );
                  }
                }
              ]
            }
          ];
          var optionsalarmlist: any = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              backgroundColor: "transparent",
              // plotShadow: true,
              type: "pie",
              height: 120
              // marginBottom: 120
            },
            title: {
              text: null
            },
            subtitle: {
              text: this.numberWithCommas(result.data.total / (1024 * 1024)),
              // align: 'center',
              verticalAlign: "middle",
              widthAdjust: -300,
              y: 20,
              style: {
                class: "m-0",
                fontSize: "1.2em"
              }
            },
            tooltip: {
              pointFormat: "{point.y:.1f} MB",
              style: {
                fontSize: "1.4em"
              }
            },
            accessibility: {
              point: {
                valueSuffix: "%"
              }
            },
            credits: {
              enabled: false
            },
            exporting: {
              enabled: false
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: "context-menu",
                size: 110,

                dataLabels: {
                  enabled: true,
                  connectorWidth: 0,
                  distance: "-15%",
                  format:
                    '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.1f} MB '
                }
              }
            },
            series: [
              {
                colorByPoint: true,
                innerSize: "60%",
                data: [
                  {
                    name: "Available",
                    y: result.data.available / (1024 * 1024),
                    drilldown: "Available",
                    color: "#2ECC71"
                    // x: 'พอร์ต',
                  },
                  // {
                  //   name: "Available",
                  //   y: result.data.available,
                  //   drilldown: "Available",
                  //   color: "#f9ad53"
                  //   // x: 'ตัว',
                  // },
                  {
                    name: "Usage",
                    y: result.data.usage / (1024 * 1024),
                    drilldown: "Usage",
                    color: "#FFC300"
                    // x: 'ตัว',
                  }
                ]
              }
            ]
          };

          Highcharts.chart("containermemorylist", optionsalarmlist);
          this.getMemotyexport = Highcharts.chart(
            "containermemorylist",
            optionsalarmlist
          );
        } else {
          this.loadMemory = false;
        }
        // console.log(results.data)
      },
      error: error => {
        if (error) {
          // this.checkchartmem = false;
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getVolt1(ip_addr, volt_index) {
    // console.log(this.IPaddress)
    this.deviceService.getVolt(ip_addr, volt_index).subscribe(results => {
      this.loadvoltindex1 = true;
      this.valuevoltindex1 = (results.data.volt / 1000).toFixed(2);
      this.valuevoltrefindex1 = (results.data.volt_ref / 1000).toFixed(2);
    });
  }
  getVolt2(ip_addr, volt_index) {
    // console.log(this.IPaddress)
    this.deviceService.getVolt(ip_addr, volt_index).subscribe(results => {
      this.loadvoltindex2 = true;
      this.valuevoltindex2 = (results.data.volt / 1000).toFixed(2);
      this.valuevoltrefindex2 = (results.data.volt_ref / 1000).toFixed(2);
    });
  }
  getVolt3(ip_addr, volt_index) {
    // console.log(this.IPaddress)
    this.deviceService.getVolt(ip_addr, volt_index).subscribe(results => {
      this.loadvoltindex3 = true;
      this.valuevoltindex3 = (results.data.volt / 1000).toFixed(2);
      this.valuevoltrefindex3 = (results.data.volt_ref / 1000).toFixed(2);
    });
  }
  getVolt4(ip_addr, volt_index) {
    // console.log(this.IPaddress)
    this.deviceService.getVolt(ip_addr, volt_index).subscribe(results => {
      this.loadvoltindex4 = true;
      this.valuevoltindex4 = (results.data.volt / 1000).toFixed(2);
      this.valuevoltrefindex4 = (results.data.volt_ref / 1000).toFixed(2);
    });
  }
  getTemp(ip_addr, start, end) {
    // console.log(this.IPaddress)
    this.deviceService.getTemp(ip_addr).subscribe({
      next: results => {
        this.loadTemp = true;
        this.valueTemp = results.data;
        this.deviceService.getRangeTemp(this.IPaddress, start, end).subscribe({
          next: results => {
            if (results.data == null) {
              this.loading = false;
              this.loading1 = false;
              this.checkcharttemp = false;
            } else {
              // console.log(results.data)
              this.checkcharttemp = true;
              this.loading = false;
              var optionsstatus: any = {
                time: {
                  timezoneOffset: -7 * 60
                },
                chart: {
                  zoomType: "x",
                  height: 120,
                  backgroundColor: "transparent"
                  // width: 750
                },
                title: {
                  display: false,
                  text: null
                },
                exporting: {
                  enabled: false
                },
                // subtitle: {
                //   text: `${results.data.ifDescr} `,
                //   verticalAlign: "top",
                //   widthAdjust: -300,
                //   y: 35,
                //   style: {
                //     class: "m-0",
                //     fontSize: "1.2em"
                //   }
                // },
                credits: {
                  enabled: false
                },
                xAxis: {
                  type: "datetime",
                  gridLineWidth: 0,
                  labels: {
                    enabled: false
                  },
                  time: {
                    timezone: "Asia/Bangkok"
                  },
                  visible: false
                },
                yAxis: {
                  minPadding: 0.2,
                  maxPadding: 0.2,
                  gridLineWidth: 0,
                  labels: {
                    enabled: false
                  },
                  title: {
                    text: null
                  }
                },
                plotOptions: {
                  area: {
                    fillOpacity: 0.2,
                    lineWidth: 1,
                    step: "center"
                  },
                  time: {
                    timezone: "Asia/Bangkok",
                    timezoneOffset: -7 * 60
                  },
                  series: {
                    dataGrouping: {
                      approximation: "average",
                      enabled: true,
                      forced: true,
                      units: [["minute", [1]]],

                      style: {
                        fontSize: 10
                      },

                      formatter: function() {
                        if (this.y === this.series.dataMax) {
                          var AA = this.x + 839980 * 30;

                          return (
                            Highcharts.dateFormat("%H:%M:%S", AA) +
                            "<br/>" +
                            '<span style="color:' +
                            this.series.color +
                            '; font-size: 1.5em;">' +
                            "</span> " +
                            this.series.name +
                            ": " +
                            this.y
                          );
                        }
                      }
                    }
                  }
                },
                series: [
                  {
                    type: "area",
                    threshold: null,
                    name: "Temp",
                    showInLegend: false,
                    data: results.data.temp,
                    color: "#FF0000",

                    lineWidth: 1,

                    tooltip: {
                      headerFormat:
                        '<span style="font-size:10px">{point.key}</span><table>',
                      pointFormat:
                        '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} °C</b></td></tr>',
                      footerFormat: "</table>"
                      // shared: true,
                      // useHTML: true
                    }
                  }
                ]
              };
              Highcharts.chart("containerTempsystem", optionsstatus);
            }
          },
          error: error => {
            if (error) {
              this.checkcharttemp = false;
              this.loading = false;
              this.checkchart = false;
            }
          }
        });
        // console.log(results.data)
      },
      error: error => {
        if (error) {
          // this.checkchartmem = false;
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  filenameselect: any;
  filenameselectlast: any;
  datelastPicker: any;
  onChangeCalendarMonth(event) {
    var d = new Date(Date.parse(event)),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }
    var datePicker = [year, month, day].join("-") + " 00:00:00";
    this.filenameselect = [month, day].join("");

    this.datePicker = new Date(datePicker).getTime();
    const currentDate = new Date(this.datePicker);
    const lastDateOfMonth = this.getLastDateOfMonth(currentDate);
    var dlast = new Date(Date.parse(event)),
      monthlast = "" + (dlast.getMonth() + 2),
      daylast = "" + dlast.getDate(),
      yearlast = dlast.getFullYear();
    if (monthlast.length < 2) {
      monthlast = "0" + monthlast;
    }
    if (daylast.length < 2) {
      daylast = "0" + daylast;
    }
    this.filenameselectlast = [monthlast, daylast].join("");
    var datelastPicker = [yearlast, monthlast, daylast].join("-") + " 00:00:00";
    this.datelastPicker = new Date(datelastPicker).getTime();

    this.invalid_month = "";
    this.isActive = true;
  }
  getLastDateOfMonth(date: Date): Date {
    // Get the next month
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);

    // Set the day to 0, which gives the last day of the current month
    nextMonth.setDate(0);

    return nextMonth;
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  provisioningHistoryfunc() {
    this.deviceService.getProvisioningHistory().subscribe({
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
  }
  datefirstPickergetTime: any;
  datelastPickers: any;
  async exportPDFspint() {
    this.chartDialog = true;
    this.dialogHeader = "Export PDF";
    this.loadButtonExport = true;
    this.SucButtonExport = true;
    this.loadtrue = true;
    var Hoursfirst;
    var Minfirst;
    var Secfirst;
    var Hourslast;
    var Minlast;
    var Seclast;
    if (this.checkselectreport == false) {
      var date = new Date();
      var start = date.setDate(date.getDate() - 1);
      this.startreport = this.convertUnixTimeToDateFormat(start);
      var end = new Date().getTime();
      this.endreport = this.convertUnixTimeToDateFormat(end);
    } else {
      var dfirst = new Date(this.rangeDates[0]),
        monthfirst = "" + (dfirst.getMonth() + 1),
        dayfirst = "" + dfirst.getDate(),
        yearfirst = dfirst.getFullYear();
      Hoursfirst = dfirst.getHours();
      const formattedHours = Hoursfirst.toString().padStart(2, "0");
      Minfirst = dfirst.getMinutes();
      const formattedMinutes = Minfirst.toString().padStart(2, "0");
      Secfirst = dfirst.getSeconds();
      const formattedSec = Secfirst.toString().padStart(2, "0");
      if (monthfirst.length < 2) {
        monthfirst = "0" + monthfirst;
      }
      if (dayfirst.length < 2) {
        dayfirst = "0" + dayfirst;
      }
      var datefirstPicker =
        [yearfirst, monthfirst, dayfirst].join("-") +
        " " +
        [formattedHours, formattedMinutes, formattedSec].join(":");
      this.datefirstPickergetTime = new Date(datefirstPicker).getTime();
      // console.log(datefirstPicker)
      // console.log(this.datefirstPickergetTime)
      this.startreport = this.convertUnixTimeToDateFormat(
        this.datefirstPickergetTime
      );
      var dlast = new Date(this.rangeDates[1]),
        monthlast = "" + (dlast.getMonth() + 1),
        daylast = "" + dlast.getDate(),
        yearlast = dlast.getFullYear();
      Hourslast = dlast.getHours();
      const formattedHourslast = Hourslast.toString().padStart(2, "0");
      Minlast = dlast.getMinutes();
      const formattedMinlast = Minlast.toString().padStart(2, "0");
      Seclast = dlast.getSeconds();
      const formattedSeclast = Seclast.toString().padStart(2, "0");
      if (monthlast.length < 2) {
        monthlast = "0" + monthlast;
      }
      if (daylast.length < 2) {
        daylast = "0" + daylast;
      }
      var datelastPicker =
        [yearlast, monthlast, daylast].join("-") +
        " " +
        [formattedHourslast, formattedMinlast, formattedSeclast].join(":");
      this.datelastPickers = new Date(datelastPicker).getTime();
      // console.log(datelastPicker)
      // console.log(this.datelastPickers)
      this.endreport = this.convertUnixTimeToDateFormat(this.datelastPickers);
    }
    // this.deviceService
    //   .getRangeBandwidth(this.IPaddress, start, end, this.listifIndex)
    //   .subscribe({
    //     next: results => {
    //       if (results == null) {
    //         this.loading = false;
    //         this.loading1 = false;
    //       } else {
    //         this.loading = false;
    //         this.array_dataAll = [];
    //         if (results.data != undefined) {
    //           results.data.forEach(datas => {
    //             var data = [
    //               {
    //                 dataup: datas.dataup,
    //                 datadown: datas.datadown,
    //                 ifName: datas.ifName,
    //                 ifDescr: datas.ifDescr
    //               }
    //             ];
    //             this.array_dataAll.push(...data);
    //           });
    //           this.AlldataChart();
    //           this.loadtrue = true;
    //           this.loadfalse = false;
    //           if (this.loadtrue == true) {
    //             this.loadButtonExport = false;
    //             this.SucButtonExport = true;
    //           }
    //         }
    //       }
    //     },
    //     error: error => {
    //       if (error) {
    //         this.loading = false;
    //         // this.checkchart = false;
    //       }
    //     }
    //   });

    // this.checkchart = false;
    // this.checkchartAll = true;

    // this.chartupdate = true;
    // this.loading = false;
  }
  async hideDialogExport() {
    await this.getCurrentChart();
    this.dateSelectedfrom = null;
    this.dateSelectedto = null;
    this.checkchart = true;
    this.checkchartAll = false;
    this.loadtrue = false;
    this.loadfalse = true;
    this.loadButtonExport = true;
    this.SucButtonExport = false;
    this.loadingExport = false;
    this.startreport = "";
    this.endreport = "";
  }

  async printy() {
    const pdf = new jsPDF();
    const report_date = new Date();
    const formattedDate = report_date
      .toLocaleString("en-GB", this.options)
      .replace(/,/g, "");
    var head = ["Interface", "Description", "Mode", "VLAN", "CRC"];
    var headAlarm = ["Alarm ID", "Alarm Name", "Uptime", "Level"];
    var imgWidth = 20;
    var imgHeight = 10;
    var pageWidth = pdf.internal.pageSize.getWidth();
    var pageHeight = pdf.internal.pageSize.getHeight();
    var xPosition = (pageWidth - imgWidth) / 2;
    var body = [];
    var bodyAlarm = [];
    this.vlanDetailNew.forEach(element => {
      var data = [
        element.if_name,
        element.if_descr,
        element.switch_mode,
        element.vlan,
        element.crc_error
      ];
      body.push(data);
    });
    this.alarm_list.forEach(element => {
      var dataAlarm = [
        element.iRCAlarmLogID,
        element.strName,
        element.struptime,
        element.alarm_level
      ];
      bodyAlarm.push(dataAlarm);
    });
    if (this.alarm_list.length <= 0) {
      bodyAlarm.push(["No data", "No data", "No data", "No data"]);
    }
    var y = 10;
    await pdf.addImage(
      "assets/img/National_Telecom_Logo1.png",
      xPosition,
      y,
      imgWidth,
      imgHeight
    );
    y += 10;
    await pdf.setFontSize(11);
    await pdf.text(`Net node ID: ${this.device_id}`, 14, y + 10, {});
    y += 10;
    await pdf.text(`IP Address: ${this.IPaddress}`, 14, y + 10, {});
    y += 10;
    await pdf.text(`Device Name: ${this.device_name}`, 14, y + 10, {});
    y += 10;
    await pdf.text(`Last Update: ${this.lastBackupTime}`, 14, y + 10, {});
    y += 20;
    var finalY: any;
    var table = (pdf as any).autoTable(head, body, { startY: y });
    var currentY = table.lastAutoTable.finalY;
    var tableAlarm = (pdf as any).autoTable(headAlarm, bodyAlarm, {
      startY: currentY + 20
    });
    var endY = table.lastAutoTable.finalY;

    for (let i = 1; i <= this.charts.length; i++) {
      await html2canvas(document.getElementById("chart" + (i - 1))).then(
        canvas => {
          var imgData = canvas.toDataURL("image/png");
          if (endY + 70 >= 290) {
            pdf.addPage();
            endY = 30;
          }

          pdf.addImage(imgData, "PNG", 10, endY + 20, 190, 50);
          endY += 70;
          finalY = endY;
        }
      );
    }
    var page = pdf.getNumberOfPages();
    var previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 1);
    if (this.rangeDates == undefined) {
      this.rangeDates = [];

      this.rangeDates.push(new Date());
      this.rangeDates.push(previousDate);
      // console.log(this.rangeDates)
      // this.rangeDates[1] = new Date();
      // this.rangeDates[0] = previousDate;
    }
    var formattedDateSelectedFrom = this.rangeDates[0]
      .toLocaleString("en-GB", this.options)
      .replace(/,/g, "");
    var formattedDateSelectedTo = this.rangeDates[1]
      .toLocaleString("en-GB", this.options)
      .replace(/,/g, "");
    formattedDateSelectedFrom = formattedDateSelectedFrom.substring(0, 10);
    formattedDateSelectedTo = formattedDateSelectedTo.substring(0, 10);
    for (let i = 1; i <= page; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(
        `Device Report from :  ${formattedDateSelectedFrom} to : ${formattedDateSelectedTo} `,
        3,
        3,
        {
          baseline: "top"
        }
      );
      pdf.text(`Create at : ${formattedDate}`, 3, pageHeight - 5, {
        baseline: "top"
      });
      pdf.text(`Page ${i} of ${page}`, pageWidth - 20, pageHeight - 5, {
        baseline: "top"
      });
    }

    pdf.save("table.pdf");
    await this.getCurrentChart();

    this.checkchart = true;
    this.checkchartAll = false;
    this.chartDialog = false;
    this.rangeDates = [];
  }

  exportMonthlyPdfFunc(res_id, port_number) {
    if (this.datePicker != undefined) {
      // this.isActive = false;
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "File is downloading ..."
      });
      this.deviceService
        .exportMonthlyPDF(res_id, port_number, this.datePicker)
        .subscribe({
          next: data => {
            if (data != null) {
              console.log();
              const linkSource = `data:application/pdf;base64,${data.data.base64PDF}`;
              // console.log(linkSource);
              const downloadLink = document.createElement("a");
              // const fileName = "abc.pdf";
              const fileName = `${data.data.fileName}`;
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Data is emtry."
              });
            }
          }
        });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Select Month for Download PDF."
      });
      this.invalid_month = "ng-invalid ng-dirty";
    }
  }
  convertUnixTimeToDateFormat(unixTime: number): string {
    // Convert Unix time to milliseconds
    const unixTimeInMilliseconds = unixTime;

    // Create a new Date object
    const date = new Date(unixTimeInMilliseconds);

    // Get day, month, and year components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();

    // Pad single-digit day and month with leading zero if needed
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    // Create the final formatted date string
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

    return formattedDate;
  }
  startreport: any;
  endreport: any;
  exportPDF(marker: any) {
    // this.printy();
    this.SucButtonExport = false;
    this.loadingExport = true;

    if (this.checkselectreport == false) {
      var date = new Date();
      var start = date.setDate(date.getDate() - 1);
      // this.startreport = this.convertUnixTimeToDateFormat(start)
      var end = new Date().getTime();
      // this.endreport = this.convertUnixTimeToDateFormat(end)
      let userToken = localStorage.getItem("token");
      var dlast = new Date(),
        monthlast = "" + (dlast.getMonth() + 1),
        daylast = "" + dlast.getDate(),
        yearlast = dlast.getFullYear();

      var filename = date.getDate().toString();
      var filenamemonth = (date.getMonth() + 1).toString();
      if (filename.length < 2) {
        filename = "0" + filename;
      }
      if (filenamemonth.length < 2) {
        filenamemonth = "0" + filenamemonth;
      }
      if (monthlast.length < 2) {
        monthlast = "0" + monthlast;
      }
      if (daylast.length < 2) {
        daylast = "0" + daylast;
      }
      this.filenameselect = [filenamemonth, filename].join("");
      var filenameselectlast = [monthlast, daylast].join("");
      var createAt = [yearlast, monthlast, daylast].join("");
      const downloadLink: HTMLAnchorElement = document.createElement("a");
      const fileName = `${this.device_name}_dls_${this.filenameselect}-${filenameselectlast}_${createAt}.pdf`;
      // const url = `${environment.apiUrl}/customer_report/get_monthly_report?report_name=monthlysummary&ref_code=${this.selecteddata[i].ref_code}&start=${datefirstPickergetTime}&end=${datelastPickers}&file_type=pdf`;
      const url = `https://edims.cathosting.in.th/report_service/report/device_report?report_name=DeviceDailyStatus&ref_code=&start=${start}&end=${end}&file_type=pdf&user_create=test&ip_switch=${this.IPaddress}&if_index=${this.ifIndexString}`;
      // const url = `http://10.4.5.32:18866/report-api/api/report/getreport`;
      const authToken = userToken;
      const headers = new Headers({
        Authorization: `Bearer ${authToken}`
      });

      fetch(url, {
        method: "GET",
        headers: headers
        // body: body
      })
        .then(response => {
          // console.log(response);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          this.loadingExport = false;
          this.chartDialog = false;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Download PDF Successful.",
            life: 3000
          });
          // this.selecteddata = [];
        })
        .catch(error => {
          console.error("Error downloading PDF:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error
          });
          this.loadingExport = false;
          this.SucButtonExport = true;
        });
    } else {
      var dfirst = new Date(this.rangeDates[1]),
        monthfirst = "" + (dfirst.getMonth() + 1),
        dayfirst = "" + dfirst.getDate(),
        yearfirst = dfirst.getFullYear();
      if (monthfirst.length < 2) {
        monthfirst = "0" + monthfirst;
      }
      if (dayfirst.length < 2) {
        dayfirst = "0" + dayfirst;
      }
      var datefirstPicker = [monthfirst, dayfirst].join("");
      var datefirstPickergetTime = new Date(datefirstPicker).getTime();
      var dlast = new Date(this.rangeDates[0]),
        monthlast = "" + (dlast.getMonth() + 1),
        daylast = "" + dlast.getDate(),
        yearlast = dlast.getFullYear();
      if (monthlast.length < 2) {
        monthlast = "0" + monthlast;
      }
      if (daylast.length < 2) {
        daylast = "0" + daylast;
      }
      var datelastPicker = [monthlast, daylast].join("");
      var datelastPickers = new Date(datelastPicker).getTime();
      let userToken = localStorage.getItem("token");
      var dlast = new Date(),
        monthlasts = "" + (dlast.getMonth() + 1),
        daylasts = "" + dlast.getDate(),
        yearlasts = dlast.getFullYear();
      if (daylasts.length < 2) {
        daylasts = "0" + daylasts;
      }
      if (monthlasts.length < 2) {
        monthlasts = "0" + monthlasts;
      }
      var createAt = [yearlasts, monthlasts, daylasts].join("");
      const downloadLink: HTMLAnchorElement = document.createElement("a");
      const fileName = `${this.device_name}_dls_${datelastPicker}-${datefirstPicker}_${createAt}.pdf`;
      // const url = `${environment.apiUrl}/customer_report/get_monthly_report?report_name=monthlysummary&ref_code=${this.selecteddata[i].ref_code}&start=${datefirstPickergetTime}&end=${datelastPickers}&file_type=pdf`;
      const url = `https://edims.cathosting.in.th/report_service/report/device_report?report_name=DeviceDailyStatus&ref_code=&start=${this.datefirstPickergetTime}&end=${this.datelastPickers}&file_type=pdf&user_create=test&ip_switch=${this.IPaddress}&if_index=${this.ifIndexString}`;
      // const url = `http://10.4.5.32:18866/report-api/api/report/getreport`;
      const authToken = userToken;
      const headers = new Headers({
        Authorization: `Bearer ${authToken}`
      });

      fetch(url, {
        method: "GET",
        headers: headers
        // body: body
      })
        .then(response => {
          // console.log(response);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          this.loadingExport = false;
          this.chartDialog = false;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Download PDF Successful.",
            life: 3000
          });
          // this.selecteddata = [];
        })
        .catch(error => {
          console.error("Error downloading PDF:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error
          });
          this.loadingExport = false;
          this.SucButtonExport = true;
        });
    }
    // for (let i = 0; i < this.selecteddata.length; i++) {

    // }
  }

  Provisioning() {
    this.generateDialog = true;
    this.dialogHeader = "Generate Config";
    this.modelType = this.deviceTypes[0].name;
    this.management_ip = "";
    this.script = "";
    this.MACremote = "";
    this.cmd_result = "";
    this.latitude = "";
    this.longitude = "";
    this.selectedDeviceType = this.deviceTypes[0];
    this.showportgenerate = true;
   
  }
  onChangePort(event) {
    this.port_uplink = event.value.interface;
    this.label = true;
    this.port_lable = event.value.description;
    this.invinvalid_selectedPort = "";
  }

  onChangeTimeLimit(event) {
    this.intervaltime = event.value.interval;
  }

  async onChangePortChart(event) {
    var str = event.value.ifIndex;
    this.port_labelChart = str;
    this.portifName = event.value;
    this.port_desChart = event.value.description;
    this.checkchart = true;
    // console.log(event.value)
    this.statusAll = event.value.port;
    if (str == "0") {
      this.checkchartAll = true;
      this.checkchart = true;
      this.loading = true;
      this.charts = [];

      if (this.rangeDates == undefined) {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.array_dataAll = [];
        await this.selectChartAll(start, end, this.listifIndex);

        // this.array_dataAllchart = []
        // console.log("hi")
      } else {
        this.array_dataAllchart = [];
        // console.log("hi2")
        await this.selectChartAlldate(
          this.rangeDates[0].getTime(),
          this.rangeDates[1].getTime(),
          this.listifIndex
        );
      }
    } else if (str != "0") {
      if (this.rangeDates == undefined) {
        const doSomething = async () => {
          await this.selectChart(event.value);
        };
        this.checkchart = true;
        this.checkchartAll = false;
        doSomething();
      } else {
        const doSomething = async () => {
          this.changeport = true;
          await this.selectChartDate(event.value);
        };
        this.checkchart = true;
        this.checkchartAll = false;
        doSomething();
      }
    }
  }
  selectChart(value) {
    setTimeout(() => {
      var date = new Date();
      var start = date.setDate(date.getDate() - 1);
      var end = new Date().getTime();
      this.deviceService
        .getRangeBandwidth(this.IPaddress, start, end, value.ifIndex)
        .subscribe({
          next: results => {
            // console.log(results.data)
            if (results == null) {
              this.loading = false;
              this.loading1 = false;
            } else {
              this.loading = false;
              this.menuExportCurrentChart = [
                {
                  label: "Download",
                  items: [
                    {
                      label: "Download JPEG Image",
                      // icon: "pi pi-fw pi-cog",
                      command: event => {
                        this.CurrentChart.exportChart(
                          {
                            type: "image/jpeg",
                            filename:
                              "Bandwidth Device Name:" +
                              this.device_name +
                              " Port:" +
                              results.data.ifName,
                            sourceWidth: 1000,
                            sourceHeight: 300
                          },
                          {
                            chart: {
                              backgroundColor: "#ffffff" // Set your desired background color here
                            },
                            title: {
                              text:
                                "Bandwidth Device Name:" +
                                this.device_name +
                                " Port:" +
                                results.data.ifName,
                              style: {
                                color: "#17212f"
                              }
                            },
                            legend: {
                              itemStyle: {
                                color: "#17212f"
                              }
                            }
                          }
                        );
                      }
                    },
                    {
                      label: "Download PNG Image",
                      // icon: "pi pi-fw pi-pencil",
                      command: event => {
                        this.CurrentChart.exportChart(
                          {
                            type: "image/png",
                            filename:
                              "Bandwidth Device Name:" +
                              this.device_name +
                              " Port:" +
                              results.data.ifName,
                            sourceWidth: 1000,
                            sourceHeight: 300
                          },
                          {
                            title: {
                              text:
                                "Bandwidth Device Name:" +
                                this.device_name +
                                " Port:" +
                                results.data.ifName,
                              style: {
                                color: "#17212f"
                              }
                            },
                            legend: {
                              itemStyle: {
                                color: "#17212f"
                              }
                            }
                          }
                        );
                      }
                    },
                    {
                      label: "Download PDF",
                      // icon: "pi pi-fw pi-calendar",
                      command: event => {
                        this.CurrentChart.exportChart(
                          {
                            type: "application/pdf",
                            filename:
                              "Bandwidth Device Name:" +
                              this.device_name +
                              " Port:" +
                              results.data.ifName,
                            sourceWidth: 1000,
                            sourceHeight: 300
                          },
                          {
                            title: {
                              text:
                                "Bandwidth Device Name:" +
                                this.device_name +
                                " Port:" +
                                results.data.ifName,
                              style: {
                                color: "#17212f"
                              }
                            },
                            legend: {
                              itemStyle: {
                                color: "#17212f"
                              }
                            }
                          }
                        );
                      }
                    }
                  ]
                }
              ];
              var optionsstatus: any = {
                time: {
                  timezoneOffset: -7 * 60
                },
                chart: {
                  zoomType: "x",
                  backgroundColor: "transparent"
                },
                title: {
                  text: `${results.data.ifName} `,
                  style: {
                    color: this.colortitle
                  }
                },
                legend: {
                  itemStyle: {
                    color: this.colortitle
                  }
                },
                subtitle: {
                  text: `${results.data.ifDescr} `,
                  verticalAlign: "top",
                  widthAdjust: -300,
                  y: 35,
                  style: {
                    class: "m-0",
                    fontSize: "1.2em"
                  }
                },
                credits: {
                  enabled: false
                },
                exporting: {
                  enabled: false
                },
                xAxis: {
                  type: "datetime",
                  gridLineWidth: 1,
                  time: {
                    timezone: "Asia/Bangkok"
                  }
                },
                yAxis: {
                  minPadding: 0.2,
                  maxPadding: 0.2,
                  gridLineWidth: 1,
                  title: {
                    text: "Mbps"
                  }
                },
                plotOptions: {
                  time: {
                    timezone: "Asia/Bangkok",
                    timezoneOffset: -7 * 60
                  },
                  series: {
                    dataGrouping: {
                      approximation: "average",
                      enabled: true,
                      forced: true,
                      units: [["minute", [1]]],

                      style: {
                        fontSize: 10
                      },

                      formatter: function() {
                        if (this.y === this.series.dataMax) {
                          var AA = this.x + 839980 * 30;

                          return (
                            Highcharts.dateFormat("%H:%M:%S", AA) +
                            "<br/>" +
                            '<span style="color:' +
                            this.series.color +
                            '; font-size: 1.5em;">' +
                            "</span> " +
                            this.series.name +
                            ": " +
                            this.y
                          );
                        }
                      }
                    }
                  }
                },
                series: [
                  {
                    type: "line",
                    name: "Egress",
                    data: results.data.dataup,
                    color: "#FFC800",
                    lineWidth: 1,

                    tooltip: {
                      headerFormat:
                        '<span style="font-size:10px">{point.key}</span><table>',
                      pointFormat:
                        '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                      footerFormat: "</table>",
                      shared: true,
                      useHTML: true
                    }
                  },
                  {
                    type: "line",
                    name: "Ingress",
                    data: results.data.datadown,
                    color: "#0000FF",
                    lineWidth: 1,

                    tooltip: {
                      headerFormat:
                        '<span style="font-size:10px">{point.key}</span><table>',
                      pointFormat:
                        '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                      footerFormat: "</table>",
                      shared: true,
                      useHTML: true
                    }
                  }
                ]
              };
              Highcharts.chart("container", optionsstatus);
              this.CurrentChart = Highcharts.chart("container", optionsstatus);
            }
          },
          error: error => {
            if (error) {
              this.loading = false;
              this.checkchart = false;
            }
          }
        });
    }, 1000);
  }
  generateConfig() {
    if (this.generateDialog == true) {
      if (this.excluded_ips != undefined && this.excluded_ips != "") {
        this.hideicon = false;
        this.loadingspiner = true;
        this.deviceService
          .getgenerate_config(
            this.device_access_id,
            this.modelType,
            this.IPaddress,
            this.excluded_ips
          )
          .subscribe({
            next: result => {
              
              this.hideicon = true;
              this.management_ip = result.params.management_ip;
              this.script = result.script;
              this.invinvalid_selectedPort = "";
              this.invinvalid_management = "";
              this.invinvalid_MAC = "";
              this.dialogHeader = "Remote provisioning";
              this.options = {
                center: {
                  lat: 13.72672065693991,
                  lng: 100.51438137260944
                },
                zoom: 12,
                disableDefaultUI: true
              };
              this.loadingspiner_ = true;
              this.Pinging = true;
              this.pingfailed = false;
              this.pingOK = false;
              // this.generateConfig();
              this.deviceService.getPings(this.IPaddress).subscribe({
                next: result => {
                  if (result == true) {
                    this.pingOK = true;
                    this.Pinging = false;
                    this.pingfailed = false;
                    this.is_success = result;
                    this.loadingspiner_ = false;
                    setTimeout(() => {
                      this.Remoteprovisioningdialog = true;
                      this.generateDialog = false;
                      this.pingOK = false;
                      this.Pinging = false;
                      this.pingfailed = false;
                    }, 3000);
                  } else if (result == false) {
                    this.pingfailed = true;
                    this.Pinging = false;
                    this.pingOK = false;
                    this.is_success = result;
                    setTimeout(() => {
                      this.Remoteprovisioningdialog = true;
                      this.generateDialog = false;
                      this.pingOK = false;
                      this.Pinging = false;
                      this.pingfailed = false;
                      this.loadingspiner = false;
                    }, 3000);
                    setTimeout(() => {
                      this.pingFunction();
                      this.pingfailed = false;
                      this.Pinging = true;
                    }, 10000);
                  }
                  // // this.pingOK = true
                  // // this.Pinging = false
                },
                error: error => {
                  if (error) {
                    this.pingfailed = true;
                    this.Pinging = false;
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail: "Ping FAILED!"
                    });
                    setTimeout(() => {
                      this.Remoteprovisioningdialog = true;
                      this.generateDialog = false;
                      this.pingOK = false;
                      this.Pinging = false;
                      this.pingfailed = false;
                    }, 3000);
                  }
                  if (error.status == 401) {
                    this.pingfailed = true;
                    this.Pinging = false;
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
              if (error) {
                this.loadingspiner = false;
                this.hideicon = true;
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
        this.loadingspiner = true;
        this.deviceService
          .getgenerate_config(
            this.device_access_id,
            this.modelType,
            this.IPaddress
          )
          .subscribe({
            next: result => {
              this.management_ip = result.params.management_ip;
              this.script = result.script;
              this.invinvalid_selectedPort = "";
              this.invinvalid_management = "";
              this.invinvalid_MAC = "";
              this.dialogHeader = "Remote provisioning";
              this.options = {
                center: {
                  lat: 13.72672065693991,
                  lng: 100.51438137260944
                },
                zoom: 12,
                disableDefaultUI: true
              };
              this.loadingspiner_ = true;
              this.Pinging = true;
              this.pingfailed = false;
              this.pingOK = false;
              // this.generateConfig();
              this.deviceService.getPings(this.IPaddress).subscribe({
                next: result => {
                  if (result == true) {
                    this.pingOK = true;
                    this.Pinging = false;
                    this.pingfailed = false;
                    this.is_success = result;
                    this.loadingspiner_ = false;
                    setTimeout(() => {
                      this.Remoteprovisioningdialog = true;
                      this.generateDialog = false;
                      this.pingOK = false;
                      this.Pinging = false;
                      this.pingfailed = false;
                      this.loadingspiner = false;
                    }, 3000);
                  } else if (result == false) {
                    this.pingfailed = true;
                    this.Pinging = false;
                    this.pingOK = false;
                    this.is_success = result;
                    setTimeout(() => {
                      this.Remoteprovisioningdialog = true;
                      this.generateDialog = false;
                      this.pingOK = false;
                      this.Pinging = false;
                      this.pingfailed = false;
                    }, 3000);
                    setTimeout(() => {
                      this.pingFunction();
                      this.pingfailed = false;
                      this.Pinging = true;
                    }, 10000);
                  }
                  // // this.pingOK = true
                  // // this.Pinging = false
                },
                error: error => {
                  if (error) {
                    this.pingfailed = true;
                    this.Pinging = false;
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail: "Ping FAILED!"
                    });
                    setTimeout(() => {
                      this.Remoteprovisioningdialog = true;
                      this.generateDialog = false;
                      this.pingOK = false;
                      this.Pinging = false;
                      this.pingfailed = false;
                    }, 3000);
                  }
                  if (error.status == 401) {
                    this.pingfailed = true;
                    this.Pinging = false;
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
      }
    } else {
    }
  }
  donelocation() {
    console.log(this.selectedDeviceType)
    this.loadingspiner_ = true;
    if (
      (this.is_success == true &&
        this.latitude != "" &&
        this.longitude != "") ||
      (this.latitude != undefined && this.longitude != undefined)
    ) {
      var data = {
        uplink_ip:this.IPaddress,
        uplink_port:this.selectedPort ? this.selectedPort.port : "",
        mac:this.MACremote ? this.MACremote : "",
        script:this.script,
        model:this.selectedDeviceType.name,
        latitude: this.latitude,
        longitude: this.longitude,
        suggested_ip:this.management_ip
      }
      this.deviceService
        .SetsnmpLocation(data)
        .subscribe({
          next: result => {
            this.loadingspiner = false;
            this.loadingspiner_ = false;

            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Done Provisioning",
              life: 3000
            });
            this.selectedDeviceType = undefined;
            this.excluded_ips = undefined;
            this.Remoteprovisioningdialog = false;
            this.generateDialog = false;
            this.SNMPlocation = false;
            this.management_ip = "";
            this.script = "";
            this.MACremote = "";
            this.cmd_result = "";
            this.latitude = "";
            this.longitude = "";
            this.options = {
              center: {
                lat: 13.72672065693991,
                lng: 100.51438137260944
              },
              zoom: 12,
              disableDefaultUI: true
            };
            this.checkmap = false;
            this.beforeSelectMap = true;
          },
          error: error => {
            this.loadingspiner = false;
            this.loadingspiner_ = false;
            if (error) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Provisioning FAILED!"
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please waiting Ping or Enter latitude and longitude !!"
      });
    }
  }
  cancel1() {
    this.generateDialog = false;
    this.excluded_ips = "";
    // this.selectedDeviceType = undefined;
    this.excluded_ips = undefined;
    // this.Remoteprovisioningdialog = false;
    this.generateDialog = false;
    this.SNMPlocation = false;
    // this.management_ip = "";
    this.script = "";
    // this.MACremote = "";
    this.cmd_result = "";
    this.latitude = "";
    this.longitude = "";
    this.options = {
      center: {
        lat: 13.72672065693991,
        lng: 100.51438137260944
      },
      zoom: 12,
      disableDefaultUI: true
    };
    this.checkmap = false;
    this.beforeSelectMap = true;
  }
  cancel2() {
    this.excluded_ips = "";
    this.MACremote = "";
    this.port_lable = undefined;
    this.selectedPort = [];
    this.Remoteprovisioningdialog = false;
    this.loadingspinerS = false;
    this.loadingspiner2 = false;
    this.selectedDeviceType = undefined;
    this.excluded_ips = undefined;
    // this.Remoteprovisioningdialog = false;
    this.generateDialog = false;
    this.SNMPlocation = false;
    this.management_ip = "";
    this.script = "";
    this.MACremote = "";
    this.cmd_result = "";
    this.latitude = "";
    this.longitude = "";
    this.options = {
      center: {
        lat: 13.72672065693991,
        lng: 100.51438137260944
      },
      zoom: 12,
      disableDefaultUI: true
    };
    this.checkmap = false;
    this.beforeSelectMap = true;
  }
  cancel3() {
    this.excluded_ips = "";
    this.MACremote = "";
    this.port_lable = undefined;
    this.selectedPort = [];
    this.SNMPlocation = false;
    this.latitude = "";
    this.longitude = "";
    this.overlays = [];
    this.loadingspinerS = false;
    this.loadingspiner2 = false;
    this.checkmap = false;
    this.selectedDeviceType = undefined;
    this.excluded_ips = undefined;
    // this.Remoteprovisioningdialog = false;
    this.generateDialog = false;
    this.SNMPlocation = false;
    this.management_ip = "";
    this.script = "";
    this.MACremote = "";
    this.cmd_result = "";
    this.latitude = "";
    this.longitude = "";
    this.options = {
      center: {
        lat: 13.72672065693991,
        lng: 100.51438137260944
      },
      zoom: 12,
      disableDefaultUI: true
    };
    this.checkmap = false;
    this.beforeSelectMap = true;
  }
  cancel4() {
    this.loadingspinerS = false;
  }
  Info() {
    this.InfoDialog = true;
    forkJoin({
      image1: this.deviceService.getimage(),
      image2: this.deviceService.getimage2()
    }).subscribe(({ image1, image2 }) => {
      this.images = [...image1, ...image2];
    });
  }
  Info2() {
    this.InfoDialog2 = true;
    this.deviceService
      .getimage2()
      .subscribe(images => (this.imagestroubleshooting = images));
  }
  ShowrunningConfig() {
    this.loadingspinerconfig = true;
    this.showrunnig = true;
    this.dialogHeader = "Show running-config";
    this.resultRunning = "";
    this.loadingspinerS = true;
    this.deviceService.getShowrunningConfig(this.management_ip).subscribe({
      next: result => {
        this.loadingspinerconfig = false;
        this.loadingspinerS = false;
        this.resultRunning = result;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: result, life: 3000 });
      },
      error: error => {
        if (error) {
          // console.log(error.error.detail)
          this.loadingspinerS = false;
          this.resultRunning = error.error.detail;
          this.loadingspinerconfig = false;
        } else if (error.status == 401) {
          this.loadingspinerconfig = false;
          this.loadingspinerS = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        } else if (error.status == "500") {
          this.loadingspinerconfig = false;
          this.loadingspinerS = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.message
          });
        }
      }
    });
  }
  handleMapClick(event) {
    this.selectedPosition = event.latLng;
    this.checkmap = true;
    this.beforeSelectMap = false;
    var index = this.overlays.length - 1;
    this.latitude = this.selectedPosition.lat();
    this.longitude = this.selectedPosition.lng();
    if (this.overlays.length > 0) {
      this.overlays.splice(index, 1);
      this.overlays.push(
        new google.maps.Marker({
          position: {
            lat: this.selectedPosition.lat(),
            lng: this.selectedPosition.lng()
          },
          title: this.markerTitle
        })
      );
    } else if (this.overlays.length < 1) {
      // this.overlays.splice(index,1)
      this.overlays.push(
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
  initOverlays() {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = this.defualt_overlays.slice();
    }

    //console.log(this.overlays)
  }

  applyRemote() {
    if (this.Remoteprovisioningdialog == true && this.generateDialog == false) {
      // console.log(this.port_uplink)
      if (this.MACremote != "" && this.port_uplink != undefined) {
        // this.IPaddress = "10.208.59.5"
        this.loadingspiner = true;
        this.loadingspinerS = true;
        this.loadingspiner2 = false;
        this.invalid = "";
        this.deviceService
          .remote_provisioning(
            this.IPaddress,
            this.port_uplink,
            this.MACremote,
            this.script,
            this.modelType,
            this.management_ip
          )
          .subscribe({
            next: result => {
              this.cmd_result = result.cmd_result;
              this.inserted_id = result.inserted_id;

              this.deviceService
                .getRemote_device(this.IPaddress, this.MACremote)
                .subscribe({
                  next: result => {
                    // this.loadingspiner = false;
                    this.stateResult = result;
                    this.loadingspinerS = false;
                    // console.log(result)
                    this.cmd_result = "";
                    this.loadingspiner2 = true;
                    this.deviceService
                      .getremote_provisioning(this.inserted_id)
                      .subscribe({
                        next: result => {
                          this.cmd_result = result.cmd_result;
                          this.loadingspiner = false;
                          this.loadingspiner2 = false;
                          this.loadingCompleted = true;
                          this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: "Completed",
                            life: 3000
                          });
                        },
                        error: error => {
                          if (error) {
                            this.loadingspiner = false;
                            this.loadingspiner = false;
                            this.messageService.add({
                              severity: "error",
                              summary: "Error",
                              detail: "Apply FAILED!"
                            });
                          }
                          if (error.status == 401) {
                            this.loadingspiner = false;
                            this.loadingspiner = false;
                            this.messageService.add({
                              severity: "error",
                              summary: "Error",
                              detail:
                                "Session expired, please logout and login again."
                            });
                          }
                        }
                      });
                  },
                  error: error => {
                    if (error.status == "404" || error.status == "501") {
                      // setTimeout(() => {
                      this.Remote_device();

                      // }, 10000);
                      // this.loadingspiner = false;
                      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Apply FAILED!.' });
                    } else if (error.status == 401) {
                      this.loadingspiner = false;
                      this.loadingspinerS = false;

                      this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail:
                          "Session expired, please logout and login again."
                      });
                    } else if (error) {
                      this.loadingspiner = false;
                      this.loadingspinerS = false;
                      this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: "State running FAILED!"
                      });
                    }
                  }
                });
            },
            error: error => {
              if (error) {
                this.loadingspiner = false;
                this.loadingspinerS = false;
                this.loadingspiner2 = false;
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Apply FAILED!"
                });
                this.troubleshooting = true;
              }
              if (error.status == 401) {
                this.loadingspiner = false;
                this.loadingspinerS = false;
                this.loadingspiner2 = false;
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Session expired, please logout and login again."
                });
              }
            }
          });
      } else {
        this.invalid = "ng-invalid ng-dirty";
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please Enter MAC or Select Port !!"
        });
      }
    }
  }

  Remote_device() {
    // this.MACremote = '9800.744A.56A7';
    if (this.Remoteprovisioningdialog == true) {
      this.deviceService
        .getRemote_device(this.IPaddress, this.MACremote)
        .subscribe({
          next: result => {
            // this.loadingspiner = false;
            this.stateResult = result;
            this.loadingspinerS = false;
            this.cmd_result = "";
            this.loadingspiner2 = true;
            this.deviceService
              .getremote_provisioning(this.inserted_id)
              .subscribe({
                next: result => {
                  this.cmd_result = result.cmd_result;
                  this.loadingspiner = false;
                  this.loadingspiner2 = false;
                },
                error: error => {
                  if (error) {
                    this.loadingspiner = false;
                    this.loadingspiner2 = false;
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail: "Apply FAILED!"
                    });
                  }
                  if (error.status == 401) {
                    this.loadingspiner = false;
                    this.loadingspiner2 = false;
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
            if (error.status == "404" || error.status == "501") {
              // setTimeout(() => {
              this.Remote_device();

              // }, 10000);

              // this.loadingspiner = false;
              // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Apply FAILED!.' });
            } else {
              this.loadingspiner = false;
              this.loadingspiner = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "State running FAILED!"
              });
            }
            if (error.status == 401) {
              this.loadingspiner = false;
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
    }
  }
  invinvalid_selectedPort:any;
  invinvalid_MAC:any;
  invinvalid_management:any;
  Remote_provisioning() {
    if (this.selectedDeviceType.id == 0){
      if (this.management_ip !=undefined && this.management_ip != ""){
        if (this.MACremote != undefined && this.MACremote != "" && this.selectedPort != undefined && this.selectedPort != "") {
          this.invinvalid_selectedPort = "";
          this.invinvalid_management = "";
          this.invinvalid_MAC = "";
          this.dialogHeader = "Remote provisioning";
          this.options = {
            center: {
              lat: 13.72672065693991,
              lng: 100.51438137260944
            },
            zoom: 12,
            disableDefaultUI: true
          };
          this.loadingspiner_ = true;
          this.Pinging = true;
          this.pingfailed = false;
          this.pingOK = false;
          this.loadingspiner = true;
          this.generateConfig();
          this.deviceService.getPings(this.IPaddress).subscribe({
            next: result => {
              if (result == true) {
                this.pingOK = true;
                this.Pinging = false;
                this.pingfailed = false;
                this.is_success = result;
                this.loadingspiner_ = false;
                setTimeout(() => {
                  this.Remoteprovisioningdialog = true;
                  this.generateDialog = false;
                  this.pingOK = false;
                  this.Pinging = false;
                  this.pingfailed = false;
                  this.loadingspiner = false;
                }, 3000);
              } else if (result == false) {
                this.pingfailed = true;
                this.Pinging = false;
                this.pingOK = false;
                this.is_success = result;
                this.Remoteprovisioningdialog = true;
                this.generateDialog = false;
                this.loadingspiner = false;
                setTimeout(() => {
                  this.pingFunction();
                  this.pingfailed = false;
                  this.Pinging = true;
                }, 10000);
              }
              // // this.pingOK = true
              // // this.Pinging = false
            },
            error: error => {
              if (error) {
                this.pingfailed = true;
                this.Pinging = false;
                this.loadingspiner = false;
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Ping FAILED!"
                });
              }
              if (error.status == 401) {
                this.pingfailed = true;
                this.Pinging = false;
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
         
          if (this.selectedPort == undefined || this.selectedPort == ""){
            this.invinvalid_selectedPort = "ng-invalid ng-dirty"
    
          }
          if (this.MACremote == undefined || this.MACremote == ""){
            this.invinvalid_MAC = "ng-invalid ng-dirty"
          }
          if (this.management_ip == undefined || this.management_ip == ""){
            this.invinvalid_management = "ng-invalid ng-dirty"
          }
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please fill data !!"
          });
        }
      } else {
        
        if (this.MACremote != undefined && this.MACremote != "" && this.selectedPort != undefined && this.selectedPort != "") {
          this.generateConfig();
        } else {
         
          if (this.selectedPort == undefined || this.selectedPort == ""){
            this.invinvalid_selectedPort = "ng-invalid ng-dirty"
    
          }
          if (this.selectedPort == undefined || this.selectedPort == ""){
            this.invinvalid_MAC = "ng-invalid ng-dirty"
          }
          if (this.management_ip == undefined || this.management_ip == ""){
            this.invinvalid_management = "ng-invalid ng-dirty"
          }
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please fill data !!"
          });
        }
      }
      
    } else {
      if (this.management_ip !=undefined && this.management_ip != ""){
        if (this.selectedPort != undefined && this.selectedPort != "") {
          // this.Remoteprovisioningdialog = true;
          // this.generateDialog = false;
          this.invinvalid_selectedPort = "";
          this.invinvalid_management = "";
          this.invinvalid_MAC = "";
          this.dialogHeader = "Remote provisioning";
          this.options = {
            center: {
              lat: 13.72672065693991,
              lng: 100.51438137260944
            },
            zoom: 12,
            disableDefaultUI: true
          };
          this.loadingspiner_ = true;
          this.Pinging = true;
          this.pingfailed = false;
          this.pingOK = false;
          // this.generateConfig();
          this.loadingspiner = true;
          this.deviceService.getPings(this.IPaddress).subscribe({
            next: result => {
              if (result == true) {
                this.pingOK = true;
                this.Pinging = false;
                this.pingfailed = false;
                this.is_success = result;
                this.loadingspiner_ = false;
                setTimeout(() => {
                  this.Remoteprovisioningdialog = true;
                  this.generateDialog = false;
                  this.pingOK = false;
                  this.Pinging = false;
                  this.pingfailed = false;
                  this.loadingspiner = false;
                }, 3000);
              } else if (result == false) {
                this.pingfailed = true;
                this.Pinging = false;
                this.pingOK = false;
                this.is_success = result;
                this.Remoteprovisioningdialog = true;
                this.generateDialog = false;
                this.loadingspiner = false;
                setTimeout(() => {
                  this.pingFunction();
                  this.pingfailed = false;
                  this.Pinging = true;
                }, 10000);
              }
              // // this.pingOK = true
              // // this.Pinging = false
            },
            error: error => {
              if (error) {
                this.pingfailed = true;
                this.Pinging = false;
                this.loadingspiner = false;
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Ping FAILED!"
                });
              }
              if (error.status == 401) {
                this.pingfailed = true;
                this.Pinging = false;
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
            if (this.selectedPort == undefined || this.selectedPort == ""){
              this.invinvalid_MAC = "ng-invalid ng-dirty"
            }
            if (this.management_ip == undefined || this.management_ip == ""){
              this.invinvalid_management = "ng-invalid ng-dirty"
            }
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Please fill data !!"
            });
          }
      } else {
        if (this.selectedPort != undefined && this.selectedPort != "") {
        this.generateConfig();
        } else {
          if (this.selectedPort == undefined || this.selectedPort == ""){
            this.invinvalid_MAC = "ng-invalid ng-dirty"
          }
          if (this.management_ip == undefined || this.management_ip == ""){
            this.invinvalid_management = "ng-invalid ng-dirty"
          }
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please fill data !!"
          });
        }
      }
    }
   
  }
  SetSNMPlocation() {
    if (
      (this.cmd_result && this.stateResult != null) ||
      (this.cmd_result && this.stateResult != undefined)
    ) {
      this.SNMPlocation = true;
      this.Remoteprovisioningdialog = false;
      this.dialogHeader = "Set Device Location";
      this.loadingspiner_ = true;
      this.Pinging = true;
      this.pingfailed = false;
      this.pingOK = false;
      this.options = {
        center: {
          lat: 13.72672065693991,
          lng: 100.51438137260944
        },
        zoom: 12,
        disableDefaultUI: true
      };
      if (this.SNMPlocation == true && this.Remoteprovisioningdialog == false) {
        this.deviceService.getPings(this.IPaddress).subscribe({
          next: result => {
            if (result.is_success == true) {
              this.pingOK = true;
              this.Pinging = false;
              this.pingfailed = false;
              this.is_success = result.is_success;
              this.loadingspiner_ = false;
            } else if (result.is_success == false) {
              this.pingfailed = true;
              this.Pinging = false;
              this.pingOK = false;
              this.is_success = result.is_success;
              setTimeout(() => {
                this.pingFunction();
                this.pingfailed = false;
                this.Pinging = true;
              }, 10000);
            }
            // // this.pingOK = true
            // // this.Pinging = false
          },
          error: error => {
            if (error) {
              this.pingfailed = true;
              this.Pinging = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Ping FAILED!"
              });
            }
            if (error.status == 401) {
              this.pingfailed = true;
              this.Pinging = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Session expired, please logout and login again."
              });
            }
          }
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please apply or waiting state !!"
        });
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill MAC and select port !!"
      });
    }
  }
  loadingProcess:boolean = false;
  ZTP() {
    this.loadingProcess = true;
    if (this.isZTPEnable) {
      this.deviceService.disableZTP(this.IPaddress).subscribe({
        next: result =>{
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "ZTP disable success"
          })
          this.loadingProcess = false;
        },
        error: error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.detail
          });
          this.loadingProcess = false;
        }
      });
    } else {
      this.loadingProcess = false;
      this.displayZTP = true;
      this.dialogHeader = "Add new ZTP";
      this.ztpTypeModes = [{ name: "Immediately" }, { name: "Schedule" }];
      this.startDate = undefined;
      this.selectedZTPMode = this.ztpTypeModes[0];
      if (this.selectedZTPMode === "Immediately") {
        this.atOnceOption = false;
      }
    }
    // console.log(this.selectedZTPMode === "Immediately");

    // console.log(this.selectedZTPMode);
    // this.deviceService.getUplinkDevice().subscribe({
    //   next: data => {
    //     this.uplink = data;
    //     // console.log(data)
    //     this.uplinkList = [
    //       {
    //         IPADDRESS: data.IPADDRES,
    //         HOSTNAME: data.HOSTNAME,
    //         iRCNETypeID: data.iRCNETypeID,
    //         ISPINGOK: data.ISPINGOK
    //       }
    //     ];
    //     this.selectedUplink[0] = "10.208.59.5";
    //     console.log(this.selectedUplink);
    //   },
    //   error: error => {
    //     if (error.status == 401) {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: "Session expired, please logout and login again."
    //       });
    //     }
    //   }
    // });
  }

  pingFunction() {
    if (
      (this.cmd_result && this.stateResult != null) ||
      (this.SNMPlocation == true && this.Remoteprovisioningdialog == false)
    ) {
      this.deviceService.getPing(this.IPaddress, this.management_ip).subscribe({
        next: result => {
          if (result.is_success == true) {
            this.pingOK = true;
            this.Pinging = false;
            this.pingfailed = false;
            this.loadingspiner_ = false;
            this.is_success = result.is_success;
          } else if (result.is_success == false) {
            this.pingfailed = true;
            this.Pinging = false;
            this.pingOK = false;
            this.is_success = result.is_success;
            setTimeout(() => {
              this.pingFunction();
              this.pingfailed = false;
              this.Pinging = true;
            }, 10000);
          }
          // // this.pingOK = true
          // // this.Pinging = false
        },
        error: error => {
          if (error) {
            this.pingfailed = true;
            this.Pinging = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Ping FAILED!"
            });
          }
          if (error.status == 401) {
            this.pingfailed = true;
            this.Pinging = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
        }
      });
    } else {
    }
  }
  showportgenerate:boolean = true;
  onChangeModel(event) {
    this.modelType = event.value.name;
    if (event.value.id == 0){
      this.showportgenerate = true;
    } else {
      this.showportgenerate = false;
      this.MACremote = undefined;
    }
    // console.log(this.modelType)
  }
  downloadResult(getconfig_table: getconfig_table) {
    //console.log(session_id, schedule_name);
    // this.IPaddress = "10.208.59.45";
    this.getconfig_table.filename = getconfig_table.filename;
    this.deviceService
      .downloadReport(this.IPaddress, this.getconfig_table.filename)
      .subscribe(blob => {
        //console.log(blob);
        const a = document.createElement("a");
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = "Report_" + this.getconfig_table.filename + ".txt";
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }
  callUpload() {
    // this.IPaddress = "10.208.59.45";

    if (this.selectedFile != undefined) {
      this.confirmationService.confirm({
        message:
          "Are you sure you want to Upload the selected" +
          " " +
          this.fileName +
          " " +
          "?",
        header: "Confirm",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          // this.changeDetection.detectChanges();
          this.invalidfile = "";
          this.deviceService
            .uploaddata(this.IPaddress, this.selectedFile)
            .subscribe({
              next: (event: any) => {
                if (typeof event === "object") {
                  // Short link via api response
                  this.changeDetection.reattach();
                  this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "File Upload Success",
                    life: 3000
                  });
                  setTimeout(() => {
                    this.refresh();
                  }, 3000);
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
        }
      });
    } else {
      this.invalidfile = "ng-invalid ng-dirty";
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Select File !!"
      });
    }
  }
  callEdit(getconfig_table: getconfig_table) {
    this.action_Dialog3 = true;
    this.dialogHeader = "Edit Configuration history";
    // this.IPaddress = "10.208.59.45";
    this.getconfig_table.filename = getconfig_table.filename;
    this.deviceService
      .getview(this.IPaddress, this.getconfig_table.filename)
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
  saveFilename() {
    if (this.filenameNew != undefined) {
      this.invalid = "";
      this.deviceService
        .editconfigFile(this.IPaddress, this.filenameNew, this.resultView)
        .subscribe({
          next: result => {
            this.loadingcheck = true;
            this.loadingspiner = false;
            this.setfilenameDialog = false;
            this.action_Dialog3 = false;
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: result.detail,
              life: 3000
            });
          },
          error: error => {
            if (error) {
              setTimeout(() => {
                this.setfilenameDialog = false;
                this.action_Dialog3 = false;
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
                  summary: "error",
                  detail: "Session expired, please logout and login again.",
                  life: 3000
                });
              }, 2000);
            }
          }
        });
    } else {
      this.invalid = "ng-invalid ng-dirty";
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Enter New filename.",
        life: 3000
      });
    }
  }
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.loading = !this.loading;
      // console.log(this.selectedFile);
      this.fileName = this.selectedFile.name;
      this.invalidfile = "";
    }
  }
  callDelete(getconfig_table: getconfig_table) {
    // this.action_Dialog1 = true;
    // this.dialogHeader = "Configuration history";
    // this.IPaddress = "10.208.59.45";
    this.getconfig_table.filename = getconfig_table.filename;
    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete the selected" +
        " " +
        this.getconfig_table.filename +
        " " +
        "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        // this.changeDetection.detectChanges();
        this.deviceService
          .deletedata(this.IPaddress, this.getconfig_table.filename)
          .subscribe({
            next: result => {
              // this.getconfig_tables = this.getconfig_tables.filter(val => !getconfig_table.includes(val));
              this.changeDetection.reattach();
              this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "File Deleted",
                life: 3000
              });
              setTimeout(() => {
                this.refresh();
              }, 3000);
              // console.log(result)
            },
            error: error => {
              if (error) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Error! cannont delete file."
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
        // this.changeDetection.detectChanges();
      }
    });
  }
  refresh(): void {
    window.location.reload();
  }
  callView(getconfig_table: getconfig_table) {
    this.action_Dialog1 = true;
    this.dialogHeader = "Configuration history";
    // this.IPaddress = "10.208.59.45";
    this.getconfig_table.filename = getconfig_table.filename;
    this.deviceService
      .getview(this.IPaddress, this.getconfig_table.filename)
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
  callPush(getconfig_table: getconfig_table) {
    this.action_Dialog2 = true;
    this.dialogHeader = "Configuration history";
    // this.IPaddress = "10.208.59.45";
    this.loadingspiner = false;
    this.loadingcheck = true;
    this.getconfig_table.filename = getconfig_table.filename;
    this.deviceService
      .getview(this.IPaddress, this.getconfig_table.filename)
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
  // checkbox(event: Checkbox) {
  //   this.checks = event.checked;
  //   console.log(event);
  // }
  verify() {
    this.getverifyDialog = true;
    this.loadingspiner = true;
    this.loadingcheck = false;
  }
  reboot(getconfig_table: getconfig_table) {
    this.getconfig_table.filename = getconfig_table.filename;
    // this.IPaddress = "10.208.127.3";
    if (this.password_verify != undefined) {
      this.invalid = "";
      this.loadingcheck = false;
      this.loadingspiner = true;
      this.deviceService.verifyPassword(this.password_verify).subscribe({
        next: result => {
          if (result.detail == "Pass") {
            this.getverifyDialog = false;
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: result.detail,
              life: 3000
            });

            this.deviceService
              .rebootpPush(
                this.username1,
                this.password1,
                this.IPaddress,
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
    } else {
      this.invalid = "ng-invalid ng-dirty";
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Confirm Password.",
        life: 3000
      });
    }
  }
  getThoughtpuChart() {}

  getConfig() {
    this.confirmationService.confirm({
      message: "Are you sure you want to Backup Config?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deviceService.getCongigbackup(this.IPaddress).subscribe({
          next: results => {
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Backup Config Successful",
              life: 3000
            });
            this.deviceService.getconfigFile(this.IPaddress).subscribe({
              next: result => {
                this.getconfig_tables = result;
                if (this.getconfig_tables.length > 0) {
                  const findstring = result
                    .filter(data =>
                      data.filename.includes(this.IPaddress.toString())
                    )
                    .pop();
                  if (findstring == undefined) {
                    this.lastBackupTimeCheck = true;
                    var index = result.length - 1;
                    var format = result[index].filename;
                    var re = ".cfg";
                    var newstr = format.replace(re, "");
                    var renew = "_";
                    var newstrs = newstr.replace(renew, " ");
                    var index = 13;
                    newstrs =
                      newstrs.substring(0, index) +
                      ":" +
                      newstrs.substring(index + 1);
                    this.lastBackupTime = newstrs;
                  } else {
                    this.lastBackupTimeCheck = true;
                    const originalFilename = findstring.filename;
                    const format = originalFilename.replace(
                      this.IPaddress.toString() + "_",
                      ""
                    );
                    var re = ".cfg";
                    var newstr = format.replace(re, "");
                    var renew = "_";
                    var newstrs = newstr.replace(renew, " ");
                    var index = 11;
                    newstrs =
                      newstrs.substring(0, index) +
                      ":" +
                      newstrs.substring(index + 1);
                    this.lastBackupTime = newstrs;
                  }
                } else {
                  this.lastBackupTimeChecks = true;
                }
                this.changeDetection.detectChanges();
              },
              error: error => {
                if (error.status == 401) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Session expired, please logout and login again."
                  });
                } else {
                  this.lastBackupTimeChecks = true;
                }
              }
            });
          },
          error: error => {
            if (error) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.detail
              });
            }
          }
        });
      }
    });
    // this.username = "raisecom";
    // this.password = "raisecom";
    // this.getConfigDialog = true;
    // this.loadingcheck = true;
    // this.iconsave = "pi pi-check";
  }
  saveConfigEdit() {
    this.setfilenameDialog = true;
    this.loadingcheck = false;
    this.loadingspiner = true;
  }
  saveConfig() {
    this.submitted = true;
    this.iconsave = "pi pi-spin pi-spinner";
    // this.IPaddress = "10.208.59.45";
    this.loadingspiner = true;
    this.loadingcheck = false;
    this.deviceService
      .getconfigDevice(this.username, this.password, this.IPaddress)
      .subscribe({
        next: results => {
          var output = [];
          this.deviceL = results;
          this.loadingspiner = false;
          this.getConfigDialog = false;
          this.iconsave = "pi pi-check";
          window.location.reload();
        },
        error: error => {
          if (error.status == 400) {
            this.loadingspiner = true;
            setTimeout(() => {
              this.loadingcheck = true;
              this.loadingspiner = false;
            }, 2000);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.detail
            });
            this.iconsave = "pi pi-check";
            // console.log(error.error.detail)
          } else {
            this.loadingspiner = true;
            setTimeout(() => {
              this.loadingcheck = true;
              this.loadingspiner = false;
            }, 2000);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.detail
            });
          }
        }
      });
  }
  onSelectMethodForZTP(event) {
    let startDate = new Date(Date.parse(event));
    this.invalid2 = "";
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
    console.log(dformat);
  }

  onChangeIP(event) {
    this.label = true;
    this.label2 = false;
    this.port_lable = "";
    this.invalid = "";
    this.iRCNETypeID = event.value.iRCNETypeID;
    this.HOSTNAME = event.value.HOSTNAME;
    this.IP = event.value.IPADDRESS;
    this.parent_id = event.value.IRCNETNODEID;
    console.log(this.IP);
    this.port_des1 = [
      { interface: "port 1", decription: "", id: 1 },
      { interface: "port 2", decription: "", id: 2 },
      { interface: "port 3", decription: "", id: 3 },
      { interface: "port 4", decription: "", id: 4 },
      { interface: "port 5", decription: "", id: 5 },
      { interface: "port 6", decription: "", id: 6 },
      { interface: "port 7", decription: "", id: 7 },
      { interface: "port 8", decription: "", id: 8 },
      { interface: "port 9", decription: "", id: 9 },
      { interface: "port 10", decription: "", id: 10 },
      { interface: "port 11", decription: "", id: 11 },
      { interface: "port 12", decription: "", id: 12 },
      { interface: "port 13", decription: "", id: 13 },
      { interface: "port 14", decription: "", id: 14 },
      { interface: "port 15", decription: "", id: 15 },
      { interface: "port 16", decription: "", id: 16 },
      { interface: "port 17", decription: "", id: 17 },
      { interface: "port 18", decription: "", id: 18 },
      { interface: "port 19", decription: "", id: 19 },
      { interface: "port 20", decription: "", id: 20 },
      { interface: "port 21", decription: "", id: 21 },
      { interface: "port 22", decription: "", id: 22 },
      { interface: "port 23", decription: "", id: 23 },
      { interface: "port 24", decription: "", id: 24 },
      { interface: "port 25", decription: "", id: 25 },
      { interface: "port 26", decription: "", id: 26 },
      { interface: "port 27", decription: "", id: 27 },
      { interface: "port 28", decription: "", id: 28 }
    ];
    this.deviceService.getVlantable(this.parent_id).subscribe({
      next: result => {
        this.port_des1.forEach(port => {
          var portlist = result.interfaces.filter(
            data => data.interface == port.interface
          );
          this.port_des.push(...portlist);
        });

        this.port_des.forEach(port => {
          var str = port.interface;
          var re = str.replace("port ", "");
          port.id = Number(re);
          // console.log(port)
          var index = this.port_des1.findIndex(
            data => data.interface == port.interface
          );
          this.port_des1.splice(index, 1);
        });
        this.port_des1.push(...this.port_des);
        this.port_des1.sort((a, b) => a.id - b.id);
      },
      error: error => {
        if (error.status == 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        } else {
          this.lastBackupTimeChecks = true;
        }
      }
    });
    // console.log(event)
  }

  onChangeZTPMode(event) {
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
    this.selectedZTPMode.name = event.value.name;
    if (this.selectedZTPMode.name === "Immediately") {
      this.atOnceOption = false;
    }
    if (this.selectedZTPMode.name === "Schedule") {
      this.atOnceOption = true;
    }
  }

  doneZTPSchedule() {
    let month: any;
    let date: any;
    let hour: any;
    let minute: any;
    let second: any;
    let time: any;
    this.IP = this.IPaddress;
    if (this.dformat == undefined && this.selectedZTPMode.name === "Schedule") {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Select Start Date."
      });
      this.invalid2 = "ng-invalid ng-dirty";
    } else {
      this.invalid2 = "";
      if (
        this.selectedZTPMode.name === "Schedule" &&
        this.dformat != undefined &&
        this.IP != undefined
      ) {
        var dateObj = new Date();
        let year = dateObj.getFullYear();
        month = dateObj.getMonth() + 1;
        month = ("0" + month).slice(-2);
        date = dateObj.getDate();
        date = ("0" + date).slice(-2);
        hour = dateObj.getHours();
        hour = ("0" + hour).slice(-2);
        minute = dateObj.getMinutes();
        minute = ("0" + minute).slice(-2);
        second = dateObj.getSeconds();
        second = ("0" + second).slice(-2);
        time = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
        this.dformat = time;

        this.deviceService.AddZTPSchedule(this.IP, this.dformat).subscribe({
          next: result => {
            this.invalid = "";
            this.invalid2 = "";
            this.spinner = false;
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Create ZTP Schedule Successfully.",
              life: 3000
            });
            this.displayZTP = false;
            this.deviceService.getProvisioningHistory().subscribe({
              next: data => {
                this.provisioningHistory = data;
                this.provisioningHistoryfunc();
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
        });
      } else if (
        this.selectedZTPMode.name === "Immediately" &&
        this.IP != undefined
      ) {
        var dateObj = new Date();
        let year = dateObj.getFullYear();
        month = dateObj.getMonth() + 1;
        month = ("0" + month).slice(-2);
        date = dateObj.getDate();
        date = ("0" + date).slice(-2);
        hour = dateObj.getHours();
        hour = ("0" + hour).slice(-2);
        minute = dateObj.getMinutes();
        minute = ("0" + minute).slice(-2);
        second = dateObj.getSeconds();
        second = ("0" + second).slice(-2);
        time = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
        this.dformat = time;
        this.deviceService.AddZTPImmediately(this.IP, this.dformat).subscribe({
          next: result => {
            this.invalid = "";
            this.invalid2 = "";
            this.spinner = false;
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Create ZTP Schedule Successfully.",
              life: 3000
            });
            this.displayZTP = false;
            this.deviceService.getProvisioningHistory().subscribe({
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
          }
        });
      }
    }
  }

  hideDialog() {
    this.getConfigDialog = false;
    this.startDate = undefined;
    this.displayZTP = false;
    this.startDate = undefined;
    this.startValue = undefined;
    this.invalid2 = "";
    this.atOnceOption = true;
    this.IPaddress = undefined;
    
  }
  hideDialog1() {
    this.action_Dialog2 = false;
    this.action_Dialog3 = false;
    this.loadingcheck = true;
    this.loadingspiner = false;
  }
  hideDialog2() {
    this.getverifyDialog = false;
    this.setfilenameDialog = false;
    this.loadingcheck = true;
    this.loadingspiner = false;
    this.invalid = "";
  }
  CurrentChart: any;
  selectedChart: any;
  menuExportCurrentChart: MenuItem[];
  Cancelconfig() {
    this.getSysInterface(this.IPaddress);
    this.get_sys_info();
    this.disableSysname = true;
    this.disableSNMP = false;
    this.disableNTP = false;
    this.invalidVersion = "";
    this.invalidNTPname = "";
    this.invalidSNMPname = "";
    this.invalidVersion = "";
    this.showaddConfig = false;
  }
  getCurrentChart() {
    this.loadingbw = true;
    this.loading1 = true;
    this.checkchart = true;
    this.selectedPortChart = this.array_data[1];
    var date = new Date();
    var start = date.setDate(date.getDate() - 1);
    var end = new Date().getTime();
    if (this.array_data.length != 0) {
      this.deviceService
        .getRangeBandwidth(
          this.IPaddress,
          start,
          end,
          this.array_data[1].ifIndex
        )
        .subscribe({
          next: results => {
            if (results == null) {
              this.loadingbw = false;
              this.loading1 = false;
              this.checkchart = false;
            } else {
              this.loadingbw = false;
              this.checkchart = true;
              this.menuExportCurrentChart = [
                {
                  label: "Download",
                  items: [
                    {
                      label: "Download JPEG Image",
                      // icon: "pi pi-fw pi-cog",
                      command: event => {
                        this.CurrentChart.exportChart(
                          {
                            type: "image/jpeg",
                            filename:
                              "Bandwidth Device Name:" +
                              this.device_name +
                              " Port:" +
                              results.data.ifName,
                            sourceWidth: 1000,
                            sourceHeight: 300
                          },
                          {
                            chart: {
                              backgroundColor: "#ffffff" // Set your desired background color here
                            },
                            title: {
                              text:
                                "Bandwidth Device Name:" +
                                this.device_name +
                                " Port:" +
                                results.data.ifName,
                              style: {
                                color: "#17212f"
                              }
                            },
                            legend: {
                              itemStyle: {
                                color: "#17212f"
                              }
                            }
                          }
                        );
                      }
                    },
                    {
                      label: "Download PNG Image",
                      // icon: "pi pi-fw pi-pencil",
                      command: event => {
                        this.CurrentChart.exportChart(
                          {
                            type: "image/png",
                            filename:
                              "Bandwidth Device Name:" +
                              this.device_name +
                              " Port:" +
                              results.data.ifName,
                            sourceWidth: 1000,
                            sourceHeight: 300
                          },
                          {
                            title: {
                              text:
                                "Bandwidth Device Name:" +
                                this.device_name +
                                " Port:" +
                                results.data.ifName,
                              style: {
                                color: "#17212f"
                              }
                            },
                            legend: {
                              itemStyle: {
                                color: "#17212f"
                              }
                            }
                          }
                        );
                      }
                    },
                    {
                      label: "Download PDF",
                      // icon: "pi pi-fw pi-calendar",
                      command: event => {
                        this.CurrentChart.exportChart(
                          {
                            type: "application/pdf",
                            filename:
                              "Bandwidth Device Name:" +
                              this.device_name +
                              " Port:" +
                              results.data.ifName,
                            sourceWidth: 1000,
                            sourceHeight: 300
                          },
                          {
                            title: {
                              text:
                                "Bandwidth Device Name:" +
                                this.device_name +
                                " Port:" +
                                results.data.ifName,
                              style: {
                                color: "#17212f"
                              }
                            },
                            legend: {
                              itemStyle: {
                                color: "#17212f"
                              }
                            }
                          }
                        );
                      }
                    }
                  ]
                }
              ];
              var optionsstatus: any = {
                time: {
                  timezoneOffset: -7 * 60
                },
                chart: {
                  zoomType: "x",
                  backgroundColor: "transparent"
                },
                title: {
                  text: `${results.data.ifName} `,
                  style: {
                    color: this.colortitle
                  }
                },
                legend: {
                  itemStyle: {
                    color: this.colortitle
                  }
                },
                subtitle: {
                  text: `${results.data.ifDescr} `,
                  verticalAlign: "top",
                  widthAdjust: -300,
                  y: 35,
                  style: {
                    class: "m-0",
                    fontSize: "1.2em"
                  }
                },
                exporting: {
                  enabled: false
                },
                credits: {
                  enabled: false
                },
                xAxis: {
                  type: "datetime",
                  gridLineWidth: 1,
                  time: {
                    timezone: "Asia/Bangkok"
                  }
                },
                yAxis: {
                  minPadding: 0.2,
                  maxPadding: 0.2,
                  gridLineWidth: 1,
                  title: {
                    text: "Mbps"
                  }
                },
                plotOptions: {
                  time: {
                    timezone: "Asia/Bangkok",
                    timezoneOffset: -7 * 60
                  },
                  series: {
                    dataGrouping: {
                      approximation: "average",
                      enabled: true,
                      forced: true,
                      units: [["minute", [1]]],

                      style: {
                        fontSize: 10
                      },

                      formatter: function() {
                        if (this.y === this.series.dataMax) {
                          var AA = this.x + 839980 * 30;

                          return (
                            Highcharts.dateFormat("%H:%M:%S", AA) +
                            "<br/>" +
                            '<span style="color:' +
                            this.series.color +
                            '; font-size: 1.5em;">' +
                            "</span> " +
                            this.series.name +
                            ": " +
                            this.y
                          );
                        }
                      }
                    }
                  }
                },
                series: [
                  {
                    type: "line",
                    name: "Egress",
                    data: results.data.dataup,
                    color: "#FFC800",
                    lineWidth: 1,

                    tooltip: {
                      headerFormat:
                        '<span style="font-size:10px">{point.key}</span><table>',
                      pointFormat:
                        '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                      footerFormat: "</table>",
                      shared: true,
                      useHTML: true
                    }
                  },
                  {
                    type: "line",
                    name: "Ingress",
                    data: results.data.datadown,
                    color: "#0000FF",
                    lineWidth: 1,

                    tooltip: {
                      headerFormat:
                        '<span style="font-size:10px">{point.key}</span><table>',
                      pointFormat:
                        '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                      footerFormat: "</table>",
                      shared: true,
                      useHTML: true
                    }
                  }
                ]
              };
              Highcharts.chart("container", optionsstatus);
              this.CurrentChart = Highcharts.chart("container", optionsstatus);
            }
          },
          error: error => {
            if (error) {
              this.loadingbw = false;
              this.checkchart = false;
            }
          }
        });
    } else {
      this.loadingbw = false;
      this.loading1 = false;
      this.checkchart = false;
    }
  }
  AlldataChart() {
    this.array_dataAll.forEach((result, index) => {
      let chart_temp: any = {
        time: {
          timezoneOffset: -7 * 60
        },
        chart: {
          zoomType: "x",
          backgroundColor: "transparent"
        },
        title: {
          text: `${result.ifName} `
        },
        subtitle: {
          text: `${result.ifDescr} `,
          verticalAlign: "top",
          widthAdjust: -300,
          y: 35,
          style: {
            class: "m-0",
            fontSize: "1.2em"
          }
        },
        exporting: {
          enabled: false
        },
        legend: {
          itemStyle: {
            color: this.colortitle
          }
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: "datetime",
          gridLineWidth: 1,
          time: {
            timezone: "Asia/Bangkok"
          }
        },
        yAxis: {
          minPadding: 0.2,
          maxPadding: 0.2,
          gridLineWidth: 1,
          title: {
            text: "Mbps"
          }
        },
        plotOptions: {
          time: {
            timezone: "Asia/Bangkok",
            timezoneOffset: -7 * 60
          },
          series: {
            dataGrouping: {
              approximation: "average",
              enabled: true,
              forced: true,
              units: [["minute", [1]]],

              style: {
                fontSize: 10
              },
              formatter: function() {
                if (this.y === this.series.dataMax) {
                  var AA = this.x + 839980 * 30;

                  return (
                    Highcharts.dateFormat("%H:%M:%S", AA) +
                    "<br/>" +
                    '<span style="color:' +
                    this.series.color +
                    '; font-size: 1.5em;">' +
                    "</span> " +
                    this.series.name +
                    ": " +
                    this.y
                  );
                }
              }
            }
          }
        },
        series: [
          {
            type: "line",
            name: "Egress",
            data: result.dataup,
            color: "#FFC800",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          },
          {
            type: "line",
            name: "Ingress",
            data: result.datadown,
            color: "#0000FF",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          }
        ]
      };
      this.charts.push(chart_temp);
    });

    this.chartupdate = true;
    this.loading = false;
  }
  AlldataChartSelct(array_dataChart, date_from, date_to) {
    var array_dataCharts = array_dataChart.filter(data => data.port != "All");
    array_dataCharts.forEach(result => {
      let chart_temp = {
        time: {
          timezoneOffset: -7 * 60
        },
        chart: {
          zoomType: "x",
          backgroundColor: "transparent"
        },
        title: {
          text: `${result.port} `
        },
        subtitle: {
          text: `${result.description} `,
          // align: 'center',
          verticalAlign: "top",
          widthAdjust: -300,
          y: 35,
          style: {
            class: "m-0",
            fontSize: "1.2em"
          }
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: "datetime",
          gridLineWidth: 1,
          min: Date.parse(date_from),
          max: Date.parse(date_to),
          time: {
            timezone: "Asia/Bangkok"
          }
        },
        yAxis: {
          minPadding: 0.2,
          maxPadding: 0.2,
          gridLineWidth: 1,
          title: {
            text: "Mbps"
          }
        },
        plotOptions: {
          time: {
            timezone: "Asia/Bangkok",
            timezoneOffset: -7 * 60
          },
          series: {
            dataGrouping: {
              approximation: "average",
              enabled: true,
              forced: true,
              units: [["minute", [1]]],

              style: {
                fontSize: 10
              },

              formatter: function() {
                if (this.y === this.series.dataMax) {
                  var AA = this.x + 839980 * 30;

                  return (
                    Highcharts.dateFormat("%H:%M:%S", AA) +
                    "<br/>" +
                    '<span style="color:' +
                    this.series.color +
                    '; font-size: 1.5em;">' +
                    "</span> " +
                    this.series.name +
                    ": " +
                    this.y
                  );
                }
              }
            }
          }
        },
        series: [
          {
            type: "line",
            name: "Egress",
            data: result.dataup,
            color: "#FFC800",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          },
          {
            type: "line",
            name: "Ingress",
            data: result.datadown,
            color: "#0000FF",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          }
          // {
          //   marker: {
          //   enabled: true
          //   },
          //     data: result.dataup
          // }
        ]
      };
      this.charts.push(chart_temp);
      // console.log(this.charts)
    });

    this.chartupdate = true;
    this.loading = false;
  }
  ngAfterViewInit() {}

  ngAfterViewChecked() {
    if (this.chartupdate) {
      this.charts.forEach((chart, index) => {
        new Highcharts.Chart(`chart${index}`, chart);
      });
      this.chartupdate = false;
      this.loading = false;
    }
  }

  tenetToIP() {
    this.IPaddress = "10.208.59.5";
    this.router.navigate(["/telnet"], { state: { data: this.IPaddress } });
    746;
  }

  maxDate: Date;

  dateSelectedfrom: Date;
  dateSelectedto: Date;
  date_from: String;
  loading: boolean;
  loadingbw: boolean;
  loading1: boolean;
  charts: any[] = [];
  dateFrom: String;
  dateTo: String;
  chartupdate: boolean = false;
  todayStartDate: String;
  todayEndDate: String;

  getCurrentChartAll() {
    this.loading = true;
    this.loading1 = true;
    this.checkchart = true;
    this.deviceService
      .getCerrentBandwidthCharts(this.device_access_id)
      .subscribe({
        next: results => {
          if (results == null) {
            this.loading = false;
            this.loading1 = false;
          } else {
            var port = results.map(function(singleElement) {
              return singleElement.port;
            });
            this.port = port;
            let array = [];
            let array_data = [];
            let array_ret = [];
            let array_rets = [];

            for (let i = 0; i < results.length; i++) {
              if (typeof port[i] == "string") {
                var lower = port[i].toLowerCase();
                if (port[i] == lower) {
                  var arr_ = this.arr.find(c => c.interface == port[i]);
                  if (arr_ == undefined) {
                    arr_ = { interface: port[i], description: "" };
                  }
                  array.push(arr_);
                } else if (port[i] !== lower) {
                  var re = lower.split("-");
                  if (re.length <= 1) {
                    re.push(undefined);
                  }
                  const nextArr = [...re.slice(0, re.indexOf(1)), undefined];
                  var srt = nextArr.toString();
                  var ret = srt.replace(",", "");
                  array_ret.push(ret);
                  var arr_ = this.arr.find(c => c.interface == array_ret[i]);
                  if (arr_ == undefined) {
                    arr_ = { interface: array_ret[i], description: "" };
                  }
                  array.push(arr_);
                }
              } else {
                var arr_ = this.arr.find(c => c.interface == port[i]);
                if (arr_ == undefined) {
                  arr_ = { interface: port[i], description: "" };
                }
                array.push(arr_);
              }
            }
            for (let i = 0; i < array.length; i++) {
              if (typeof results[i].port == "string") {
                var lowers = results[i].port;
                var replace = results[i].port.replace(
                  lowers,
                  array[i].interface
                );

                var data = {
                  datadown: results[i].datadown,
                  dataup: results[i].dataup,
                  port: replace,
                  description: array[i].description
                };

                array_data.push(data);
                this.array_data = array_data;
              } else {
                var lowers1 = results[i].port;

                var data = {
                  datadown: results[i].datadown,
                  dataup: results[i].dataup,
                  port: lowers1,
                  description: array[i].description
                };

                array_data.push(data);
                this.array_data = array_data;
              }
            }
            this.array_data.sort((a, b) => (a.port > b.port ? 1 : -1));
            var alldata = {
              port: "All"
            };
            this.array_data.unshift(alldata);
            this.selectedPortChart = this.array_data[1];
            this.loading = false;
            var array_dataChart = this.array_data;

            setTimeout(() => {
              this.AlldatachatCurrent(array_dataChart);
            }, 1000);

            // console.log(chart_temp.title.text)

            // this.chartupdate = true;
          }
        },
        error: error => {
          if (error) {
            this.loading = false;
            this.checkchart = false;
          }
        }
      });
  }

  async resetChartToCurrent() {
    this.checkselectreport = false;
    let today = new Date();
    let hours = today.getHours();
    let hours24 = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (this.statusAll == "All") {
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Please wait for generating chart!"
      });
      this.selectedTime = undefined;
      this.dateSelectedfrom = undefined;
      this.dateSelectedto = undefined;
      this.checkchartAll = true;
      this.checkchart = true;
      this.loading = true;
      this.charts = [];
      var date = new Date();
      var start = date.setDate(date.getDate() - 1);
      var end = new Date().getTime();
      this.array_dataAll = [];
      await this.selectChartAll(start, end, this.listifIndex);
      await this.getCurrentChart();
      this.rangeDates = undefined;
      this.selectedtimeStart = undefined;
      this.selectedtimeEnd = undefined;
      this.startTimeH = hours ? hours : 12;
      this.EndTimeH24 = hours24;
      this.startTimeM = minutes < 10 ? "0" + minutes : minutes;
      this.timeStart = ampm;
      this.EndTimeH = hours ? hours : 12;
      this.EndTimeM = minutes < 10 ? "0" + minutes : minutes;
      this.timeEnd = ampm;
      // await this.getCurrentChartAll();
    } else if (this.statusAll != "All") {
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Please wait for generating chart!"
      });
      this.dateSelectedfrom = undefined;
      this.dateSelectedto = undefined;
      this.loading = true;
      this.charts = [];
      this.checkchart = false;

      if (this.array_data.length != 0) {
        if (this.port_labelChart == this.array_data[1].ifIndex) {
          await this.getCurrentChart();
          this.rangeDates = undefined;
          this.selectedtimeStart = undefined;
          this.selectedtimeEnd = undefined;
          this.startTimeH = hours ? hours : 12;
          this.EndTimeH24 = hours24;
          this.startTimeM = minutes < 10 ? "0" + minutes : minutes;
          this.timeStart = ampm;
          this.EndTimeH = hours ? hours : 12;
          this.EndTimeM = minutes < 10 ? "0" + minutes : minutes;
          this.timeEnd = ampm;
        } else {
          await this.getCurrentChartOtherPort();
          this.rangeDates = undefined;
          this.selectedtimeStart = undefined;
          this.selectedtimeEnd = undefined;
          this.startTimeH = hours ? hours : 12;
          this.EndTimeH24 = hours24;
          this.startTimeM = minutes < 10 ? "0" + minutes : minutes;
          this.timeStart = ampm;
          this.EndTimeH = hours ? hours : 12;
          this.EndTimeM = minutes < 10 ? "0" + minutes : minutes;
          this.timeEnd = ampm;
        }
      } else {
        await this.getCurrentChart();
        this.rangeDates = undefined;
        this.selectedtimeStart = undefined;
        this.selectedtimeEnd = undefined;
        this.startTimeH = hours ? hours : 12;
        this.EndTimeH24 = hours24;
        this.startTimeM = minutes < 10 ? "0" + minutes : minutes;
        this.timeStart = ampm;
        this.EndTimeH = hours ? hours : 12;
        this.EndTimeM = minutes < 10 ? "0" + minutes : minutes;
        this.timeEnd = ampm;
      }
    }
    var date = new Date();
    var start = date.setDate(date.getDate() - 1);
    var end = new Date().getTime();
    await this.getRangeMemory(start, end);
    await this.getRangeCPU(start, end);
    await this.getRangeTemp(start, end);
    // await this.getRangeVolt(start, end);
  }
  getCurrentChartOtherPort() {
    this.loadingbw = true;
    this.loading1 = true;
    this.checkchart = true;
    this.selectedPortChart = this.portifName;
    var date = new Date();
    var start = date.setDate(date.getDate() - 1);
    var end = new Date().getTime();
    this.deviceService
      .getRangeBandwidth(this.IPaddress, start, end, this.port_labelChart)
      .subscribe({
        next: results => {
          if (results == null) {
            this.loadingbw = false;
            this.loading1 = false;
          } else {
            this.loadingbw = false;
            var optionsstatus: any = {
              time: {
                timezoneOffset: -7 * 60
              },
              chart: {
                zoomType: "x",
                backgroundColor: "transparent"
              },
              title: {
                text: `${results.data.ifName} `
              },
              subtitle: {
                text: `${results.data.ifDescr} `,
                verticalAlign: "top",
                widthAdjust: -300,
                y: 35,
                style: {
                  class: "m-0",
                  fontSize: "1.2em"
                }
              },
              credits: {
                enabled: false
              },
              exporting: {
                enabled: false
              },
              xAxis: {
                type: "datetime",
                gridLineWidth: 1,
                time: {
                  timezone: "Asia/Bangkok"
                }
              },
              yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                gridLineWidth: 1,
                title: {
                  text: "Mbps"
                }
              },
              plotOptions: {
                time: {
                  timezone: "Asia/Bangkok",
                  timezoneOffset: -7 * 60
                },
                series: {
                  dataGrouping: {
                    approximation: "average",
                    enabled: true,
                    forced: true,
                    units: [["minute", [1]]],

                    style: {
                      fontSize: 10
                    },

                    formatter: function() {
                      if (this.y === this.series.dataMax) {
                        var AA = this.x + 839980 * 30;

                        return (
                          Highcharts.dateFormat("%H:%M:%S", AA) +
                          "<br/>" +
                          '<span style="color:' +
                          this.series.color +
                          '; font-size: 1.5em;">' +
                          "</span> " +
                          this.series.name +
                          ": " +
                          this.y
                        );
                      }
                    }
                  }
                }
              },
              series: [
                {
                  type: "line",
                  name: "Egress",
                  data: results.data.dataup,
                  color: "#FFC800",
                  lineWidth: 1,

                  tooltip: {
                    headerFormat:
                      '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat:
                      '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                    footerFormat: "</table>",
                    shared: true,
                    useHTML: true
                  }
                },
                {
                  type: "line",
                  name: "Ingress",
                  data: results.data.datadown,
                  color: "#0000FF",
                  lineWidth: 1,

                  tooltip: {
                    headerFormat:
                      '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat:
                      '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                    footerFormat: "</table>",
                    shared: true,
                    useHTML: true
                  }
                }
              ]
            };
            Highcharts.chart("container", optionsstatus);
          }
        },
        error: error => {
          if (error) {
            this.loadingbw = false;
            this.checkchart = false;
          }
        }
      });
  }
  selectChartAll(start, end, value) {
    this.deviceService
      .getRangeBandwidth(this.IPaddress, start, end, value)
      .subscribe({
        next: results => {
          if (results == null) {
            this.loadingbw = false;
            this.loading1 = false;
          } else {
            this.loadingbw = false;
            this.array_dataAll = [];
            if (results.data != undefined) {
              results.data.forEach(datas => {
                var data = [
                  {
                    dataup: datas.dataup,
                    datadown: datas.datadown,
                    ifName: datas.ifName,
                    ifDescr: datas.ifDescr
                  }
                ];
                this.array_dataAll.push(...data);
              });
              this.Allchart();
            }
          }
        },
        error: error => {
          if (error) {
            this.loadingbw = false;
            // this.checkchart = false;
          }
        }
      });
  }
  ExportAllchart: any[] = [];
  ExportAllchartMenu: any;
  menuExportAllchart: MenuItem[];
  showChartAlldata: boolean = false;
  Allchart() {
    this.checkchartAll = true;
    // console.log(this.array_dataAll)
    this.array_dataAll.forEach((result, index) => {
      let chart_temp: any = {
        time: {
          timezoneOffset: -7 * 60
        },
        chart: {
          zoomType: "x",
          backgroundColor: "transparent"
        },
        title: {
          text: `${result.ifName} `
        },
        subtitle: {
          text: `${result.ifDescr} `,
          verticalAlign: "top",
          widthAdjust: -300,
          y: 35,
          style: {
            class: "m-0",
            fontSize: "1.2em"
          }
        },
        exporting: {
          enabled: false
        },
        legend: {
          itemStyle: {
            color: this.colortitle
          }
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: "datetime",
          gridLineWidth: 1,
          time: {
            timezone: "Asia/Bangkok"
          }
        },
        yAxis: {
          minPadding: 0.2,
          maxPadding: 0.2,
          gridLineWidth: 1,
          title: {
            text: "Mbps"
          }
        },
        plotOptions: {
          time: {
            timezone: "Asia/Bangkok",
            timezoneOffset: -7 * 60
          },
          series: {
            dataGrouping: {
              approximation: "average",
              enabled: true,
              forced: true,
              units: [["minute", [1]]],

              style: {
                fontSize: 10
              },
              formatter: function() {
                if (this.y === this.series.dataMax) {
                  var AA = this.x + 839980 * 30;

                  return (
                    Highcharts.dateFormat("%H:%M:%S", AA) +
                    "<br/>" +
                    '<span style="color:' +
                    this.series.color +
                    '; font-size: 1.5em;">' +
                    "</span> " +
                    this.series.name +
                    ": " +
                    this.y
                  );
                }
              }
            }
          }
        },
        series: [
          {
            type: "line",
            name: "Egress",
            data: result.dataup,
            color: "#FFC800",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          },
          {
            type: "line",
            name: "Ingress",
            data: result.datadown,
            color: "#0000FF",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          }
        ]
      };
      this.charts.push(chart_temp);
    });

    this.chartupdate = true;
    this.loading = false;
  }
  AlldatachatCurrent(array_dataChart) {
    var array_dataCharts = array_dataChart.filter(data => data.port != "All");
    array_dataCharts.forEach(result => {
      let chart_temp = {
        time: {
          timezoneOffset: -7 * 60
        },
        chart: {
          zoomType: "x",
          backgroundColor: "transparent"
        },
        title: {
          text: `${result.port} `
        },
        subtitle: {
          text: `${result.description} `,
          // align: 'center',
          verticalAlign: "top",
          widthAdjust: -300,
          y: 35,
          style: {
            class: "m-0",
            fontSize: "1.2em"
          }
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: "datetime",
          gridLineWidth: 1,
          time: {
            timezone: "Asia/Bangkok"
          }
        },
        yAxis: {
          minPadding: 0.2,
          maxPadding: 0.2,
          gridLineWidth: 1,
          title: {
            text: "Mbps"
          }
        },
        plotOptions: {
          time: {
            timezone: "Asia/Bangkok",
            timezoneOffset: -7 * 60
          },
          series: {
            dataGrouping: {
              approximation: "average",
              enabled: true,
              forced: true,
              units: [["minute", [1]]],

              style: {
                fontSize: 10

                // textShadow: "1px 1px 1px red"
              },
              formatter: function() {
                if (this.y === this.series.dataMax) {
                  var AA = this.x + 839980 * 30;

                  return (
                    Highcharts.dateFormat("%H:%M:%S", AA) +
                    "<br/>" +
                    '<span style="color:' +
                    this.series.color +
                    '; font-size: 1.5em;">' +
                    "</span> " +
                    this.series.name +
                    ": " +
                    this.y
                  );
                }
              }
            }
          }
        },
        series: [
          {
            type: "line",
            name: "Egress",
            data: result.dataup,
            color: "#FFC800",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          },
          {
            type: "line",
            name: "Ingress",
            data: result.datadown,
            color: "#0000FF",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          }
        ]
      };
      this.charts.push(chart_temp);
      // console.log(this.charts)
    });

    this.chartupdate = true;
    this.loading = false;
  }

  onChangeCalendar(event) {
    if (this.rangeDates != undefined) {
      this.timeLimit = this.timeLimit2;
      this.diffInMs =
        this.rangeDates[1].getTime() - this.rangeDates[0].getTime();
      this.diffInDays = Math.ceil(this.diffInMs / 86400000);
      if (this.diffInDays <= 0) {
        var tempStartDate: any;
        tempStartDate = this.rangeDates[0];
        this.rangeDates[0] = this.rangeDates[1];
        this.rangeDates[1] = tempStartDate;
        this.diffInDays = 0 - this.diffInDays;
      }
      if (this.diffInDays > 1 && this.diffInDays <= 7) {
        this.timeLimit = this.timeLimit.filter(item => item.interval <= 60);
      } else if (this.diffInDays > 8 && this.diffInDays <= 15) {
        this.timeLimit = this.timeLimit.filter(
          item => item.interval >= 15 && item.interval <= 240
        );
      } else {
        this.timeLimit = this.timeLimit.filter(item => item.interval >= 60);
      }
    }
  }
  rangeDates: Date[];
  selectedtimeStart: any = "";
  selectedtimeEnd: any = "";
  invalidstartH: any;
  invalidstartM: any;
  invalidendH: any;
  invalidendM: any;
  disableMulti: boolean = true;
  disableMultiEnd: boolean = true;
  onChangeCalendarMuliti(event) {
    this.disableMulti = false;
    let options = [{ day: "numeric" }, { month: "short" }];
    let joined = this.join(this.rangeDates[0], options, " ");
    let timestart =
      this.startTimeH < 10 ? "0" + this.startTimeH : this.startTimeH;
    let timeMstart =
      this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;
    if (this.startTimeM.toString().length < 2) {
      this.selectedtimeStart =
        joined +
        "," +
        timestart +
        ":" +
        timeMstart +
        " " +
        this.timeStart +
        " to ";
      let today = new Date();
      let hours24 = today.getHours();
      this.startTimeH24 = hours24;
      this.rangeDates[0].setHours(this.startTimeH24);
      this.rangeDates[0].setMinutes(timeMstart);
    } else {
      this.selectedtimeStart =
        joined +
        "," +
        timestart +
        ":" +
        this.startTimeM +
        " " +
        this.timeStart +
        " to ";
      let today = new Date();
      let hours24 = today.getHours();
      this.startTimeH24 = hours24;
      this.rangeDates[0].setHours(this.startTimeH24);
      this.rangeDates[0].setMinutes(this.startTimeM);
    }
    if (this.rangeDates[1] != null) {
      this.disableMultiEnd = false;
      this.invalidmulti = "";
      let options = [{ day: "numeric" }, { month: "short" }];
      let joined = this.join(this.rangeDates[1], options, " ");
      let timesend = this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
      let timeMend = this.EndTimeM < 10 ? "0" + this.EndTimeM : this.EndTimeM;

      if (this.EndTimeM.toString().length < 2) {
        this.selectedtimeEnd =
          joined + "," + timesend + ":" + timeMend + " " + this.timeEnd;
        this.rangeDates[1].setHours(this.EndTimeH24);
        this.rangeDates[1].setMinutes(timeMend);
      } else {
        this.selectedtimeEnd =
          joined + "," + timesend + ":" + this.EndTimeM + " " + this.timeEnd;
        this.rangeDates[1].setHours(this.EndTimeH24);
        this.rangeDates[1].setMinutes(this.EndTimeM);
      }
    } else {
      this.selectedtimeEnd = "";
      this.disableMultiEnd = true;
    }

    // console.log(joined + "," + timestart + ":" + this.startTimeM + " " + this.timeStart);
  }
  onInputstartTimeH(event) {
    if (this.selectedtimeStart != "") {
      if (event.value != null) {
        this.invalidstartH = "";
        let options = [{ day: "numeric" }, { month: "short" }];
        let joined = this.join(this.rangeDates[0], options, " ");
        let timestart = event.value < 10 ? "0" + event.value : event.value;
        let timeMstart =
          this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;
        if (this.startTimeM.toString().length < 2) {
          this.selectedtimeStart =
            joined +
            "," +
            timestart +
            ":" +
            timeMstart +
            " " +
            this.timeStart +
            " to ";
          const convertTime12to24 = time12h => {
            const [time, modifier] = time12h.split(" ");

            let [hours, minutes] = time.split(":");

            if (hours === "12") {
              hours = "00";
            }

            if (modifier === "PM") {
              hours = parseInt(hours, 10) + 12;
            }

            return `${hours}`;
          };
          let time = timestart + ":" + timeMstart + " " + this.timeStart;
          let timeconvert = convertTime12to24(time);

          this.startTimeH24 = Number(timeconvert);
          this.rangeDates[0].setHours(this.startTimeH24);
        } else {
          this.selectedtimeStart =
            joined +
            "," +
            timestart +
            ":" +
            this.startTimeM +
            " " +
            this.timeStart +
            " to ";
          const convertTime12to24 = time12h => {
            const [time, modifier] = time12h.split(" ");

            let [hours, minutes] = time.split(":");

            if (hours === "12") {
              hours = "00";
            }

            if (modifier === "PM") {
              hours = parseInt(hours, 10) + 12;
            }

            return `${hours}`;
          };
          let time = timestart + ":" + this.startTimeM + " " + this.timeStart;
          let timeconvert = convertTime12to24(time);

          this.startTimeH24 = Number(timeconvert);
          this.rangeDates[0].setHours(this.startTimeH24);
        }
      } else {
        this.invalidstartH = "ng-invalid ng-dirty";
        let options = [{ day: "numeric" }, { month: "short" }];
        let joined = this.join(this.rangeDates[0], options, " ");
        let timestart = event.value;
        let timeMstart =
          this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;
        if (this.startTimeM != null) {
          if (this.startTimeM.toString().length < 2) {
            this.selectedtimeStart =
              joined +
              "," +
              timestart +
              ":" +
              timeMstart +
              " " +
              this.timeStart +
              " to ";
          } else {
            this.selectedtimeStart =
              joined +
              "," +
              timestart +
              ":" +
              this.startTimeM +
              " " +
              this.timeStart +
              " to ";
          }
        } else {
          this.selectedtimeStart =
            joined +
            "," +
            timestart +
            ":" +
            this.startTimeM +
            " " +
            this.timeStart +
            " to ";
        }
      }
    }
  }
  onBlurstartTimeH() {
    if (this.startTimeH != null) {
      this.invalidstartH = "";
      let options = [{ day: "numeric" }, { month: "short" }];
      let joined = this.join(this.rangeDates[0], options, " ");

      let timestart =
        this.startTimeH < 10 ? "0" + this.startTimeH : this.startTimeH;
      let timeMstart =
        this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;
      if (this.startTimeM.toString().length < 2) {
        this.selectedtimeStart =
          joined +
          "," +
          timestart +
          ":" +
          timeMstart +
          " " +
          this.timeStart +
          " to ";
        const convertTime12to24 = time12h => {
          const [time, modifier] = time12h.split(" ");

          let [hours, minutes] = time.split(":");

          if (hours === "12") {
            hours = "00";
          }

          if (modifier === "PM") {
            hours = parseInt(hours, 10) + 12;
          }

          return `${hours}`;
        };
        let time = timestart + ":" + timeMstart + " " + this.timeStart;
        let timeconvert = convertTime12to24(time);

        this.startTimeH24 = Number(timeconvert);
        this.rangeDates[0].setHours(this.startTimeH24);
      } else {
        this.selectedtimeStart =
          joined +
          "," +
          timestart +
          ":" +
          this.startTimeM +
          " " +
          this.timeStart +
          " to ";
        const convertTime12to24 = time12h => {
          const [time, modifier] = time12h.split(" ");

          let [hours, minutes] = time.split(":");

          if (hours === "12") {
            hours = "00";
          }

          if (modifier === "PM") {
            hours = parseInt(hours, 10) + 12;
          }

          return `${hours}`;
        };
        let time = timestart + ":" + this.startTimeM + " " + this.timeStart;
        let timeconvert = convertTime12to24(time);

        this.startTimeH24 = Number(timeconvert);
        this.rangeDates[0].setHours(this.startTimeH24);
      }
    }
  }
  onInputstartTimeM(event) {
    if (this.selectedtimeStart != "") {
      if (event.value != null) {
        this.invalidstartM = "";
        let options = [{ day: "numeric" }, { month: "short" }];
        let joined = this.join(this.rangeDates[0], options, " ");
        let timestart =
          this.startTimeH < 10 ? "0" + this.startTimeH : this.startTimeH;
        let timeMstart = event.value < 10 ? "0" + event.value : event.value;
        this.selectedtimeStart =
          joined +
          "," +
          timestart +
          ":" +
          timeMstart +
          " " +
          this.timeStart +
          " to ";
        this.rangeDates[0].setMinutes(this.startTimeM);
      } else {
        this.invalidstartM = "ng-invalid ng-dirty";
        let options = [{ day: "numeric" }, { month: "short" }];
        let joined = this.join(this.rangeDates[0], options, " ");
        if (this.startTimeH != null) {
          let timestart =
            this.startTimeH < 10 ? "0" + this.startTimeH : this.startTimeH;
          this.selectedtimeStart =
            joined +
            "," +
            timestart +
            ":" +
            event.value +
            " " +
            this.timeStart +
            " to ";
        } else {
          this.selectedtimeStart =
            joined +
            "," +
            this.startTimeH +
            ":" +
            event.value +
            " " +
            this.timeStart +
            " to ";
        }
      }
    }
  }
  onBlurstartTimeM() {
    let options = [{ day: "numeric" }, { month: "short" }];
    let joined = this.join(this.rangeDates[0], options, " ");
    if (this.startTimeH != null) {
      let timestart =
        this.startTimeH < 10 ? "0" + this.startTimeH : this.startTimeH;
      let timeMstart =
        this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;
      if (this.startTimeM != null) {
        this.selectedtimeStart =
          joined +
          "," +
          timestart +
          ":" +
          timeMstart +
          " " +
          this.timeStart +
          " to ";
        this.rangeDates[0].setMinutes(this.startTimeM);
      } else {
        this.selectedtimeStart =
          joined +
          "," +
          timestart +
          ":" +
          this.startTimeM +
          " " +
          this.timeStart +
          " to ";
        this.rangeDates[0].setMinutes(this.startTimeM);
      }
    } else {
      let timestart = this.startTimeH;
      let timeMstart =
        this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;
      if (this.startTimeM != null) {
        this.selectedtimeStart =
          joined +
          "," +
          timestart +
          ":" +
          timeMstart +
          " " +
          this.timeStart +
          " to ";
        this.rangeDates[0].setMinutes(this.startTimeM);
      } else {
        this.selectedtimeStart =
          joined +
          "," +
          timestart +
          ":" +
          this.startTimeM +
          " " +
          this.timeStart +
          " to ";
        this.rangeDates[0].setMinutes(this.startTimeM);
      }
    }
  }
  onInputEndTimeH(event) {
    if (this.selectedtimeEnd != "") {
      if (event.value != null) {
        this.invalidendH = "";
        let options = [{ day: "numeric" }, { month: "short" }];
        let joined = this.join(this.rangeDates[1], options, " ");
        let timesend = event.value < 10 ? "0" + event.value : event.value;
        let timeMend = this.EndTimeM < 10 ? "0" + this.EndTimeM : this.EndTimeM;
        if (this.EndTimeM != null) {
          if (this.EndTimeM.toString().length < 2) {
            this.selectedtimeEnd =
              joined + "," + timesend + ":" + timeMend + " " + this.timeEnd;
            const convertTime12to24 = time12h => {
              const [time, modifier] = time12h.split(" ");

              let [hours, minutes] = time.split(":");

              if (hours === "12") {
                hours = "00";
              }

              if (modifier === "PM") {
                hours = parseInt(hours, 10) + 12;
              }

              return `${hours}`;
            };
            let time = timesend + ":" + timeMend + " " + this.timeEnd;
            let timeconvert = convertTime12to24(time);
            this.EndTimeH24 = Number(timeconvert);
            this.rangeDates[1].setHours(this.EndTimeH24);
          } else {
            this.selectedtimeEnd =
              joined +
              "," +
              timesend +
              ":" +
              this.EndTimeM +
              " " +
              this.timeEnd;
            const convertTime12to24 = time12h => {
              const [time, modifier] = time12h.split(" ");

              let [hours, minutes] = time.split(":");

              if (hours === "12") {
                hours = "00";
              }

              if (modifier === "PM") {
                hours = parseInt(hours, 10) + 12;
              }

              return `${hours}`;
            };
            let time = timesend + ":" + this.EndTimeM + " " + this.timeEnd;
            let timeconvert = convertTime12to24(time);
            this.EndTimeH24 = Number(timeconvert);
            this.rangeDates[1].setHours(this.EndTimeH24);
          }
        } else {
          this.selectedtimeEnd =
            joined + "," + timesend + ":" + this.EndTimeM + " " + this.timeEnd;
          const convertTime12to24 = time12h => {
            const [time, modifier] = time12h.split(" ");

            let [hours, minutes] = time.split(":");

            if (hours === "12") {
              hours = "00";
            }

            if (modifier === "PM") {
              hours = parseInt(hours, 10) + 12;
            }

            return `${hours}`;
          };
          let time = timesend + ":" + this.EndTimeM + " " + this.timeEnd;
          let timeconvert = convertTime12to24(time);
          this.EndTimeH24 = Number(timeconvert);
          this.rangeDates[1].setHours(this.EndTimeH24);
        }
      } else {
        this.invalidendH = "ng-invalid ng-dirty";
        let options = [{ day: "numeric" }, { month: "short" }];
        let joined = this.join(this.rangeDates[1], options, " ");
        let timesend = event.value;
        let timeMend = this.EndTimeM < 10 ? "0" + this.EndTimeM : this.EndTimeM;
        if (this.EndTimeM != null) {
          if (this.EndTimeM.toString().length < 2) {
            this.selectedtimeEnd =
              joined + "," + timesend + ":" + timeMend + " " + this.timeEnd;
          } else {
            this.selectedtimeEnd =
              joined +
              "," +
              timesend +
              ":" +
              this.EndTimeM +
              " " +
              this.timeEnd;
          }
        } else {
          this.selectedtimeEnd =
            joined + "," + timesend + ":" + this.EndTimeM + " " + this.timeEnd;
        }
      }
    }
  }
  onBlurendTimeH() {
    if (this.EndTimeH != null) {
      this.invalidendH = "";
      let options = [{ day: "numeric" }, { month: "short" }];
      let joined = this.join(this.rangeDates[1], options, " ");
      let timesend = this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
      let timeMend = this.EndTimeM < 10 ? "0" + this.EndTimeM : this.EndTimeM;
      if (this.EndTimeM != null) {
        if (this.EndTimeM.toString().length < 2) {
          this.selectedtimeEnd =
            joined + "," + timesend + ":" + timeMend + " " + this.timeEnd;
          const convertTime12to24 = time12h => {
            const [time, modifier] = time12h.split(" ");

            let [hours, minutes] = time.split(":");

            if (hours === "12") {
              hours = "00";
            }

            if (modifier === "PM") {
              hours = parseInt(hours, 10) + 12;
            }

            return `${hours}`;
          };
          let time = timesend + ":" + timeMend + " " + this.timeEnd;
          let timeconvert = convertTime12to24(time);
          this.EndTimeH24 = Number(timeconvert);
          this.rangeDates[1].setHours(this.EndTimeH24);
        } else {
          this.selectedtimeEnd =
            joined + "," + timesend + ":" + this.EndTimeM + " " + this.timeEnd;
          const convertTime12to24 = time12h => {
            const [time, modifier] = time12h.split(" ");

            let [hours, minutes] = time.split(":");

            if (hours === "12") {
              hours = "00";
            }

            if (modifier === "PM") {
              hours = parseInt(hours, 10) + 12;
            }

            return `${hours}`;
          };
          let time = timesend + ":" + this.EndTimeM + " " + this.timeEnd;
          let timeconvert = convertTime12to24(time);
          this.EndTimeH24 = Number(timeconvert);
          this.rangeDates[1].setHours(this.EndTimeH24);
        }
      } else {
        this.selectedtimeEnd =
          joined + "," + timesend + ":" + this.EndTimeM + " " + this.timeEnd;
        const convertTime12to24 = time12h => {
          const [time, modifier] = time12h.split(" ");

          let [hours, minutes] = time.split(":");

          if (hours === "12") {
            hours = "00";
          }

          if (modifier === "PM") {
            hours = parseInt(hours, 10) + 12;
          }

          return `${hours}`;
        };
        let time = timesend + ":" + this.EndTimeM + " " + this.timeEnd;
        let timeconvert = convertTime12to24(time);
        this.EndTimeH24 = Number(timeconvert);
        this.rangeDates[1].setHours(this.EndTimeH24);
      }
    }
  }
  onBlurendTimeM() {
    let options = [{ day: "numeric" }, { month: "short" }];
    let joined = this.join(this.rangeDates[1], options, " ");
    if (this.EndTimeH != null) {
      let timesend = this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
      let timeMend = this.EndTimeM < 10 ? "0" + this.EndTimeM : this.EndTimeM;
      if (this.EndTimeM != null) {
        this.selectedtimeEnd =
          joined + "," + timesend + ":" + timeMend + " " + this.timeEnd;
        this.rangeDates[1].setMinutes(this.EndTimeM);
      } else {
        this.selectedtimeEnd =
          joined + "," + timesend + ":" + this.EndTimeM + " " + this.timeEnd;
        this.rangeDates[1].setMinutes(this.EndTimeM);
      }
    } else {
      let timeMend = this.EndTimeM < 10 ? "0" + this.EndTimeM : this.EndTimeM;
      if (this.EndTimeM != null) {
        this.selectedtimeEnd =
          joined + "," + this.EndTimeH + ":" + timeMend + " " + this.timeEnd;
        this.rangeDates[1].setMinutes(this.EndTimeM);
      } else {
        this.selectedtimeEnd =
          joined +
          "," +
          this.EndTimeH +
          ":" +
          this.EndTimeM +
          " " +
          this.timeEnd;
        this.rangeDates[1].setMinutes(this.EndTimeM);
      }
    }
  }
  onInputEndTimeM(event) {
    if (this.selectedtimeEnd != "") {
      if (event.value != null) {
        this.invalidendM = "";
        let options = [{ day: "numeric" }, { month: "short" }];
        let joined = this.join(this.rangeDates[1], options, " ");
        if (this.EndTimeH != null) {
          let timesend =
            this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
          let timeMend = event.value < 10 ? "0" + event.value : event.value;
          this.selectedtimeEnd =
            joined + "," + timesend + ":" + timeMend + " " + this.timeEnd;
          this.rangeDates[1].setMinutes(this.EndTimeM);
        } else {
          let timesend =
            this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
          let timeMend = event.value < 10 ? "0" + event.value : event.value;
          this.selectedtimeEnd =
            joined + "," + this.EndTimeH + ":" + timeMend + " " + this.timeEnd;
          this.rangeDates[1].setMinutes(this.EndTimeM);
        }
      } else {
        if (this.EndTimeH != null) {
          this.invalidendM = "ng-invalid ng-dirty";
          let options = [{ day: "numeric" }, { month: "short" }];
          let joined = this.join(this.rangeDates[1], options, " ");
          let timesend =
            this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
          this.selectedtimeEnd =
            joined + "," + timesend + ":" + event.value + " " + this.timeEnd;
          this.rangeDates[1].setMinutes(this.EndTimeM);
        } else {
          this.invalidendM = "ng-invalid ng-dirty";
          let options = [{ day: "numeric" }, { month: "short" }];
          let joined = this.join(this.rangeDates[1], options, " ");
          let timesend =
            this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
          this.selectedtimeEnd =
            joined +
            "," +
            this.EndTimeH +
            ":" +
            event.value +
            " " +
            this.timeEnd;
          this.rangeDates[1].setMinutes(this.EndTimeM);
        }
      }
    }
  }
  onChangeStart() {
    if (this.selectedtimeStart != "") {
      let options = [{ day: "numeric" }, { month: "short" }];
      let joined = this.join(this.rangeDates[0], options, " ");

      if (this.startTimeH != null) {
        let timestart =
          this.startTimeH < 10 ? "0" + this.startTimeH : this.startTimeH;
        let timeMstart =
          this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;
        if (this.startTimeM != null) {
          this.selectedtimeStart =
            joined +
            "," +
            timestart +
            ":" +
            timeMstart +
            " " +
            this.timeStart +
            " to ";
        } else {
          this.selectedtimeStart =
            joined +
            "," +
            timestart +
            ":" +
            this.startTimeM +
            " " +
            this.timeStart +
            " to ";
        }
      } else {
        let timeMstart =
          this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;
        if (this.startTimeM != null) {
          this.selectedtimeStart =
            joined +
            "," +
            this.startTimeH +
            ":" +
            timeMstart +
            " " +
            this.timeStart +
            " to ";
        } else {
          this.selectedtimeStart =
            joined +
            "," +
            this.startTimeH +
            ":" +
            this.startTimeM +
            " " +
            this.timeStart +
            " to ";
        }
      }
      if (this.timeStart == "AM") {
        var am = this.rangeDates[0].getHours() - 12;
        this.rangeDates[0].setHours(am);
      } else if (this.timeStart == "PM") {
        var pm = this.rangeDates[0].getHours() + 12;
        this.rangeDates[0].setHours(pm);
      }
    }
  }
  onChangeEnd() {
    if (this.selectedtimeEnd != "") {
      let options = [{ day: "numeric" }, { month: "short" }];
      let joined = this.join(this.rangeDates[1], options, " ");
      if (this.EndTimeH != null) {
        if (this.EndTimeM.toString().length < 2) {
          let timeMend =
            this.EndTimeM < 10 ? "0" + this.EndTimeM : this.EndTimeM;
          let timesend =
            this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;

          this.selectedtimeEnd =
            joined + "," + timesend + ":" + timeMend + " " + this.timeEnd;
        } else {
          let timesend =
            this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
          this.selectedtimeEnd =
            joined + "," + timesend + ":" + this.EndTimeM + " " + this.timeEnd;
        }
      } else {
        this.selectedtimeEnd =
          joined +
          "," +
          this.EndTimeH +
          ":" +
          this.EndTimeM +
          " " +
          this.timeEnd;
      }
      if (this.timeStart == "AM") {
        var am = this.rangeDates[1].getHours() - 12;
        this.rangeDates[1].setHours(am);
      } else if (this.timeStart == "PM") {
        var pm = this.rangeDates[1].getHours() + 12;
        this.rangeDates[1].setHours(pm);
      }
    }
  }

  join(date, options, separator) {
    function format(option) {
      let formatter = new Intl.DateTimeFormat("en", option);
      return formatter.format(date);
    }
    return options.map(format).join(separator);
  }
  invalidmulti: any;

  async selectChartDate($event) {
    // this.checkchart = false;
    if (this.rangeDates == undefined) {
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: `Please wait for generating chart!
        Since, you didn't selected any start date or end date. Chart will generate previous 24 hour`
      });
      await this.getCurrentChart();
    } else if (this.rangeDates[0] == undefined) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Fill Start Date before select chart!! "
      });
      this.invalidmulti = "ng-invalid ng-dirty";
    } else if (this.rangeDates[1] == undefined) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Fill End Date before select chart!!"
      });
      this.invalidmulti = "ng-invalid ng-dirty";
    }
    // else if (this.selectedTime == undefined) {
    //   this.messageService.add({
    //     severity: "warn",
    //     summary: "Warning",
    //     detail: "Please select interval of time to generate graph"
    //   });
    // }
    else {
      this.checkselectreport = true;
      this.invalidmulti = "";
      if (this.changeport == false) {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Please wait for generating chart!"
        });
        this.callselectChartDate();
      }

      if (this.statusAll == "All") {
        // this.checkchartAll = false;
        this.checkchart = true;
        this.loading = true;
        this.showDropdownInterval = true;
        // this.checkallselctdate = true;

        this.array_dataAll = [];
        this.array_dataAllchart = [];
        this.charts = [];
        this.selectChartAlldate(
          this.rangeDates[0].getTime(),
          this.rangeDates[1].getTime(),
          this.listifIndex
        );
      } else if (this.statusAll != "All") {
        this.checkchartAll = false;
        this.charts = [];
        // this.checkchart = false;
        this.loadingbw = true;

        if (this.port_labelChart == undefined) {
          // console.log("hi");
          this.port_labelChart = this.array_data[1].ifIndex;
          this.deviceService
            .getRangeBandwidth(
              this.IPaddress,
              this.rangeDates[0].getTime(),
              this.rangeDates[1].getTime(),
              this.array_data[1].ifIndex
            )
            .subscribe({
              next: results => {
                if (results == null) {
                  this.loadingbw = false;
                  this.loading1 = false;
                } else {
                  this.loadingbw = false;
                  this.checkchart = true;
                  this.menuExportCurrentChart = [
                    {
                      label: "Download",
                      items: [
                        {
                          label: "Download JPEG Image",
                          // icon: "pi pi-fw pi-cog",
                          command: event => {
                            this.selectedChart.exportChart(
                              {
                                type: "image/jpeg",
                                filename:
                                  "Bandwidth Device Name:" +
                                  this.device_name +
                                  " Port:" +
                                  results.data.ifName,
                                sourceWidth: 1000,
                                sourceHeight: 300
                              },
                              {
                                chart: {
                                  backgroundColor: "#ffffff" // Set your desired background color here
                                },
                                title: {
                                  text:
                                    "Bandwidth Device Name:" +
                                    this.IPaddress +
                                    " Port:" +
                                    results.data.ifName,
                                  style: {
                                    color: "#17212f"
                                  }
                                },
                                legend: {
                                  itemStyle: {
                                    color: "#17212f"
                                  }
                                }
                              }
                            );
                          }
                        },
                        {
                          label: "Download PNG Image",
                          // icon: "pi pi-fw pi-pencil",
                          command: event => {
                            this.selectedChart.exportChart(
                              {
                                type: "image/png",
                                filename:
                                  "Bandwidth Device Name:" +
                                  this.IPaddress +
                                  " Port:" +
                                  results.data.ifName,
                                sourceWidth: 1000,
                                sourceHeight: 300
                              },
                              {
                                title: {
                                  text:
                                    "Bandwidth Device Name:" +
                                    this.IPaddress +
                                    " Port:" +
                                    results.data.ifName,
                                  style: {
                                    color: "#17212f"
                                  }
                                },
                                legend: {
                                  itemStyle: {
                                    color: "#17212f"
                                  }
                                }
                              }
                            );
                          }
                        },
                        {
                          label: "Download PDF",
                          // icon: "pi pi-fw pi-calendar",
                          command: event => {
                            this.selectedChart.exportChart(
                              {
                                type: "application/pdf",
                                filename:
                                  "Bandwidth Device Name:" +
                                  this.IPaddress +
                                  " Port:" +
                                  results.data.ifName,
                                sourceWidth: 1000,
                                sourceHeight: 300
                              },
                              {
                                title: {
                                  text:
                                    "Bandwidth Device Name:" +
                                    this.IPaddress +
                                    " Port:" +
                                    results.data.ifName,
                                  style: {
                                    color: "#17212f"
                                  }
                                },
                                legend: {
                                  itemStyle: {
                                    color: "#17212f"
                                  }
                                }
                              }
                            );
                          }
                        }
                      ]
                    }
                  ];
                  var optionsstatus: any = {
                    time: {
                      timezoneOffset: -7 * 60
                    },
                    chart: {
                      zoomType: "x",
                      backgroundColor: "transparent"
                    },
                    title: {
                      text: `${results.data.ifName} `,
                      style: {
                        color: this.colortitle
                      }
                    },
                    legend: {
                      itemStyle: {
                        color: this.colortitle
                      }
                    },
                    subtitle: {
                      text: `${results.data.ifDescr} `,
                      verticalAlign: "top",
                      widthAdjust: -300,
                      y: 35,
                      style: {
                        class: "m-0",
                        fontSize: "1.2em"
                      }
                    },
                    credits: {
                      enabled: false
                    },
                    exporting: {
                      enabled: false
                    },
                    xAxis: {
                      type: "datetime",
                      gridLineWidth: 1,
                      time: {
                        timezone: "Asia/Bangkok"
                      }
                    },
                    yAxis: {
                      minPadding: 0.2,
                      maxPadding: 0.2,
                      gridLineWidth: 1,
                      title: {
                        text: "Mbps"
                      }
                    },
                    plotOptions: {
                      time: {
                        timezone: "Asia/Bangkok",
                        timezoneOffset: -7 * 60
                      },
                      series: {
                        dataGrouping: {
                          approximation: "average",
                          enabled: true,
                          forced: true,
                          units: [["minute", [1]]],

                          style: {
                            fontSize: 10
                          },

                          formatter: function() {
                            if (this.y === this.series.dataMax) {
                              var AA = this.x + 839980 * 30;

                              return (
                                Highcharts.dateFormat("%H:%M:%S", AA) +
                                "<br/>" +
                                '<span style="color:' +
                                this.series.color +
                                '; font-size: 1.5em;">' +
                                "</span> " +
                                this.series.name +
                                ": " +
                                this.y
                              );
                            }
                          }
                        }
                      }
                    },
                    series: [
                      {
                        type: "line",
                        name: "Egress",
                        data: results.data.dataup,
                        color: "#FFC800",
                        lineWidth: 1,

                        tooltip: {
                          headerFormat:
                            '<span style="font-size:10px">{point.key}</span><table>',
                          pointFormat:
                            '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                          footerFormat: "</table>",
                          shared: true,
                          useHTML: true
                        }
                      },
                      {
                        type: "line",
                        name: "Ingress",
                        data: results.data.datadown,
                        color: "#0000FF",
                        lineWidth: 1,

                        tooltip: {
                          headerFormat:
                            '<span style="font-size:10px">{point.key}</span><table>',
                          pointFormat:
                            '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                          footerFormat: "</table>",
                          shared: true,
                          useHTML: true
                        }
                      }
                    ]
                  };
                  Highcharts.chart("container", optionsstatus);
                  this.selectedChart = Highcharts.chart(
                    "container",
                    optionsstatus
                  );
                }
              },
              error: error => {
                if (error) {
                  this.loadingbw = false;
                  this.checkchart = false;
                }
              }
            });
        } else {
          this.port_labelChart = this.port_labelChart;
          this.deviceService
            .getRangeBandwidth(
              this.IPaddress,
              this.rangeDates[0].getTime(),
              this.rangeDates[1].getTime(),
              this.port_labelChart
            )
            .subscribe({
              next: results => {
                if (results == null) {
                  this.loadingbw = false;
                  this.loading1 = false;
                } else {
                  this.loadingbw = false;
                  this.checkchart = true;
                  this.menuExportCurrentChart = [
                    {
                      label: "Download",
                      items: [
                        {
                          label: "Download JPEG Image",
                          // icon: "pi pi-fw pi-cog",
                          command: event => {
                            this.selectedChart.exportChart(
                              {
                                type: "image/jpeg",
                                filename:
                                  "Bandwidth Device Name:" +
                                  this.device_name +
                                  " Port:" +
                                  results.data.ifName,
                                sourceWidth: 1000,
                                sourceHeight: 300
                              },
                              {
                                chart: {
                                  backgroundColor: "#ffffff" // Set your desired background color here
                                },
                                title: {
                                  text:
                                    "Bandwidth Device Name:" +
                                    this.IPaddress +
                                    " Port:" +
                                    results.data.ifName,
                                  style: {
                                    color: "#17212f"
                                  }
                                },
                                legend: {
                                  itemStyle: {
                                    color: "#17212f"
                                  }
                                }
                              }
                            );
                          }
                        },
                        {
                          label: "Download PNG Image",
                          // icon: "pi pi-fw pi-pencil",
                          command: event => {
                            this.selectedChart.exportChart(
                              {
                                type: "image/png",
                                filename:
                                  "Bandwidth Device Name:" +
                                  this.IPaddress +
                                  " Port:" +
                                  results.data.ifName,
                                sourceWidth: 1000,
                                sourceHeight: 300
                              },
                              {
                                title: {
                                  text:
                                    "Bandwidth Device Name:" +
                                    this.IPaddress +
                                    " Port:" +
                                    results.data.ifName,
                                  style: {
                                    color: "#17212f"
                                  }
                                },
                                legend: {
                                  itemStyle: {
                                    color: "#17212f"
                                  }
                                }
                              }
                            );
                          }
                        },
                        {
                          label: "Download PDF",
                          // icon: "pi pi-fw pi-calendar",
                          command: event => {
                            this.selectedChart.exportChart(
                              {
                                type: "application/pdf",
                                filename:
                                  "Bandwidth Device Name:" +
                                  this.IPaddress +
                                  " Port:" +
                                  results.data.ifName,
                                sourceWidth: 1000,
                                sourceHeight: 300
                              },
                              {
                                title: {
                                  text:
                                    "Bandwidth Device Name:" +
                                    this.IPaddress +
                                    " Port:" +
                                    results.data.ifName,
                                  style: {
                                    color: "#17212f"
                                  }
                                },
                                legend: {
                                  itemStyle: {
                                    color: "#17212f"
                                  }
                                }
                              }
                            );
                          }
                        }
                      ]
                    }
                  ];
                  var optionsstatus: any = {
                    time: {
                      timezoneOffset: -7 * 60
                    },
                    chart: {
                      zoomType: "x",
                      backgroundColor: "transparent"
                    },
                    legend: {
                      itemStyle: {
                        color: this.colortitle
                      }
                    },
                    title: {
                      text: `${results.data.ifName} `,
                      style: {
                        color: this.colortitle
                      }
                    },
                    subtitle: {
                      text: `${results.data.ifDescr} `,
                      verticalAlign: "top",
                      widthAdjust: -300,
                      y: 35,
                      style: {
                        class: "m-0",
                        fontSize: "1.2em"
                      }
                    },
                    credits: {
                      enabled: false
                    },
                    exporting: {
                      enabled: false
                    },
                    xAxis: {
                      type: "datetime",
                      gridLineWidth: 1,
                      time: {
                        timezone: "Asia/Bangkok"
                      }
                    },
                    yAxis: {
                      minPadding: 0.2,
                      maxPadding: 0.2,
                      gridLineWidth: 1,
                      title: {
                        text: "Mbps"
                      }
                    },
                    plotOptions: {
                      time: {
                        timezone: "Asia/Bangkok",
                        timezoneOffset: -7 * 60
                      },
                      series: {
                        dataGrouping: {
                          approximation: "average",
                          enabled: true,
                          forced: true,
                          units: [["minute", [1]]],

                          style: {
                            fontSize: 10
                          },

                          formatter: function() {
                            if (this.y === this.series.dataMax) {
                              var AA = this.x + 839980 * 30;

                              return (
                                Highcharts.dateFormat("%H:%M:%S", AA) +
                                "<br/>" +
                                '<span style="color:' +
                                this.series.color +
                                '; font-size: 1.5em;">' +
                                "</span> " +
                                this.series.name +
                                ": " +
                                this.y
                              );
                            }
                          }
                        }
                      }
                    },
                    series: [
                      {
                        type: "line",
                        name: "Egress",
                        data: results.data.dataup,
                        color: "#FFC800",
                        lineWidth: 1,

                        tooltip: {
                          headerFormat:
                            '<span style="font-size:10px">{point.key}</span><table>',
                          pointFormat:
                            '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                          footerFormat: "</table>",
                          shared: true,
                          useHTML: true
                        }
                      },
                      {
                        type: "line",
                        name: "Ingress",
                        data: results.data.datadown,
                        color: "#0000FF",
                        lineWidth: 1,

                        tooltip: {
                          headerFormat:
                            '<span style="font-size:10px">{point.key}</span><table>',
                          pointFormat:
                            '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
                          footerFormat: "</table>",
                          shared: true,
                          useHTML: true
                        }
                      }
                    ]
                  };
                  Highcharts.chart("container", optionsstatus);
                  this.selectedChart = Highcharts.chart(
                    "container",
                    optionsstatus
                  );
                }
              },
              error: error => {
                if (error) {
                  this.loadingbw = false;
                  this.checkchart = false;
                }
              }
            });
        }
      }
    }
  }
  async callselectChartDate() {
    if (this.rangeDates != undefined) {
      this.getRangeMemory(
        this.rangeDates[0].getTime(),
        this.rangeDates[1].getTime()
      );
      this.getRangeCPU(
        this.rangeDates[0].getTime(),
        this.rangeDates[1].getTime()
      );
      this.getRangeTemp(
        this.rangeDates[0].getTime(),
        this.rangeDates[1].getTime()
      );
    }
    // this.getRangeVolt(
    //   this.dateSelectedfrom.getTime(),
    //   this.dateSelectedto.getTime()
    // );
  }
  selectChartAlldate(start, end, value) {
    this.deviceService
      .getRangeBandwidth(this.IPaddress, start, end, value)
      .subscribe({
        next: results => {
          // console.log(results)
          if (results == null) {
            this.loadingbw = false;
            this.loading1 = false;
          } else {
            this.loadingbw = false;
            // console.log(results.data)
            this.array_dataAll = [];
            // this.array_dataAllchart = []
            results.data.forEach(list => {
              var data = [
                {
                  dataup: list.dataup,
                  datadown: list.datadown,
                  ifName: list.ifName,
                  ifDescr: list.ifDescr
                }
              ];
              this.array_dataAllchart.push(...data);
            });

            this.Allchartselectdate();
            // console.log(this.array_dataAll)
          }
        },
        error: error => {
          if (error) {
            this.loadingbw = false;
            // this.checkchart = false;
          }
        }
      });
  }
  Allchartselectdate() {
    this.checkchartAll = true;
    // console.log(this.array_dataAllchart)
    this.array_dataAllchart.forEach(result => {
      let chart_temp = {
        time: {
          timezoneOffset: -7 * 60
        },
        chart: {
          zoomType: "x",
          backgroundColor: "transparent"
        },
        title: {
          text: `${result.ifName} `
        },
        subtitle: {
          text: `${result.ifDescr} `,
          verticalAlign: "top",
          widthAdjust: -300,
          y: 35,
          style: {
            class: "m-0",
            fontSize: "1.2em"
          }
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: "datetime",
          gridLineWidth: 1,
          time: {
            timezone: "Asia/Bangkok"
          }
        },
        yAxis: {
          minPadding: 0.2,
          maxPadding: 0.2,
          gridLineWidth: 1,
          title: {
            text: "Mbps"
          }
        },
        plotOptions: {
          time: {
            timezone: "Asia/Bangkok",
            timezoneOffset: -7 * 60
          },
          series: {
            dataGrouping: {
              approximation: "average",
              enabled: true,
              forced: true,
              units: [["minute", [1]]],

              style: {
                fontSize: 10
              },
              formatter: function() {
                if (this.y === this.series.dataMax) {
                  var AA = this.x + 839980 * 30;

                  return (
                    Highcharts.dateFormat("%H:%M:%S", AA) +
                    "<br/>" +
                    '<span style="color:' +
                    this.series.color +
                    '; font-size: 1.5em;">' +
                    "</span> " +
                    this.series.name +
                    ": " +
                    this.y
                  );
                }
              }
            }
          }
        },
        series: [
          {
            type: "line",
            name: "Egress",
            data: result.dataup,
            color: "#FFC800",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          },
          {
            type: "line",
            name: "Ingress",
            data: result.datadown,
            color: "#0000FF",
            lineWidth: 1,

            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} Mbps</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          }
        ]
      };
      this.charts.push(chart_temp);
    });

    // });

    this.chartupdate = true;
    this.loading = false;
  }
  isToday(someDate) {
    const today = new Date();
    return (
      someDate.getMinutes() == today.getMinutes() &&
      someDate.getHours() == today.getHours() &&
      someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
    );
  }

  isConfigDataExist: boolean = true;
  isPerformanceDataExist: boolean = false;

  configLatencyChart: typeof Highcharts = Highcharts;
  configJitterChart: typeof Highcharts = Highcharts;
  configFLRChart: typeof Highcharts = Highcharts;
  configLatencyOptions: any = {
    chart: {
      type: "column",
      backgroundColor: "transparent"
    },
    title: {
      text: "Monthly Average Rainfall"
    },
    subtitle: {
      text: "Source: WorldClimate.com"
    },
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
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: "Rainfall (mm)"
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}:  </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: "Tokyo",
        data: [
          49.9,
          71.5,
          106.4,
          129.2,
          144.0,
          176.0,
          135.6,
          148.5,
          216.4,
          194.1,
          95.6,
          54.4
        ]
      },
      {
        name: "New York",
        data: [
          83.6,
          78.8,
          98.5,
          93.4,
          106.0,
          84.5,
          105.0,
          104.3,
          91.2,
          83.5,
          106.6,
          92.3
        ]
      },
      {
        name: "London",
        data: [
          48.9,
          38.8,
          39.3,
          41.4,
          47.0,
          48.3,
          59.0,
          59.6,
          52.4,
          65.2,
          59.3,
          51.2
        ]
      },
      {
        name: "Berlin",
        data: [
          42.4,
          33.2,
          34.5,
          39.7,
          52.6,
          75.5,
          57.4,
          60.4,
          47.6,
          39.1,
          46.8,
          51.1
        ]
      }
    ]
  };
  configJitterOptions: any;
  configFLROptions: any;

  performanceLatencyData: any;
  performanceJitterData: any;
  performanceFLRData: any;
}
