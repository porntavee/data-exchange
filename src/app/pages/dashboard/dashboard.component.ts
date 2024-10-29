import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener
} from "@angular/core";
import { ConfirmationService, LazyLoadEvent, MenuItem } from "primeng/api";
import { GetalarmlogServiceService } from "@app/getalarmlog-service.service";
import { Alarmcount, Alarmlist, AlarmMarker } from "@app/alarmlog";
//import { Chart } from 'angular-highcharts';
import * as Highcharts from "highcharts";
import { ContextMenu } from "primeng/contextmenu";
import { Title } from "@angular/platform-browser";
import { NavigateService } from "@app/navigateservice";
// import { randomInt } from "crypto";
import { isNumeric } from "rxjs/util/isNumeric";
// import { stringify } from "@angular/compiler/src/util";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AdminLayoutService } from "@app/layouts/admin-layout/admin-layout.service";
// import { style } from "@angular/animations";
import {
  GridType,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface
} from "angular-gridster2";
import { AppComponent } from "@app/app.component";
import { DashboardService } from "@app/dashboard.service";
import { ThemeService } from "app/theme.service";
import { ready } from "jquery";
import { Subscription } from "rxjs";

declare var google: any;
declare var markerClusterer: any;
declare var require: any;
const More = require("highcharts/highcharts-more");
More(Highcharts);

const Exporting = require("highcharts/modules/exporting");
Exporting(Highcharts);

const ExportData = require("highcharts/modules/export-data");
ExportData(Highcharts);

const Accessibility = require("highcharts/modules/accessibility");
Accessibility(Highcharts);
interface portlink {
  alarm_count?: number;
  strDeviceName?: string;
  strLocation?: string;
  strName?: string;
  strDesc?: string;
}
export interface portlinklist {
  alarm_count?: number;
  strDeviceName?: string;
  strDesc?: string;
}
interface CPUload {
  util?: number;
  load_x_min?: string;
}
export interface portlink_remote {
  alarm_count?: number;
  strDeviceName?: string;
  strIPAddress?: string;
  strLocation?: string;
  strName?: string;
  strDesc?: string;
}
export interface portlink24 {
  alarm_count?: number;
  symbol_name1?: string;
}
export interface portlink24_remote {
  alarm_count?: number;
  symbol_name1?: string;
}
@Component({
  selector: "dashboard-cmp",
  moduleId: module.id,
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.css"],
  styles: [
    `
      .card-filter {
        cursor: pointer;
      }

      gridster {
        width: 97vw;
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
        /* background-color: #1e1e1e; */
        border-radius: 16px;
      }
    `
  ]
})
export class DashboardComponent implements OnInit {
  @ViewChild("cm") cm: ContextMenu;
  @ViewChild("cm2") cm2: ContextMenu;
  innerWidth;
  showIcon: boolean = true;
  alarm_lists: Alarmlist[];
  gridOptions: GridsterConfig;
  dashboard: Array<any>;
  mockDashboard: Array<any>;
  addItemlist: any[] = [];
  contextItems: MenuItem[];
  contextItems2: MenuItem[];
  portlinks: portlink[];
  portlinkss: portlink = {};
  portlink_alarm_count: number[] = [];
  portlink_strLocation: any[] = [];
  portlink_strDesc: any[] = [];
  portlink_strDescs: any[] = [];
  alarm_count: Alarmcount = {};
  total_alarm: number = 0;
  critical_alarm: number = 0;
  major_alarm: number = 0;
  minor_alarm: number = 0;
  warning_alarm: number = 0;
  unknown_alarm: number = 0;
  Access_volumeUp: any;
  Access_volumeDown: any;
  Access_avgSpeedUp: any;
  Access_avgSpeedDown: any;
  Access_maxSpeedUp: any;
  Access_maxSpeedDown: any;
  Access_maxVolumeUp: any;
  Access_maxVolumeDown: any;
  Trunk_volumeUp: any;
  Trunk_volumeDown: any;
  Trunk_avgSpeedUp: any;
  Trunk_avgSpeedDown: any;
  Trunk_maxSpeedUp: any;
  Trunk_maxSpeedDown: any;
  Trunk_maxVolumeUp: any;
  Trunk_maxVolumeDown: any;
  alarm_list: Alarmlist[];
  selecteAlarm: Alarmlist;
  marker_device_iRCNETypeID: string;
  public gobalSearch = "";
  public backupSearch = "False";
  marker_device_id: string;
  isLevelFilter: boolean = false;
  isIpFilter: boolean = false;
  cardOpacity: number[] = [1, 1, 1, 1, 1, 1];
  levelFilter: number[] = [];
  ipFilter: string[] = [];
  online: number;
  classLevel: string[] = ["Unknow", "Critical", "Major", "Minor", "Warning"];
  isEdit: boolean = false;
  showEdit: boolean = true;
  showClear: boolean = false;
  showSave: boolean = false;
  showAdd: boolean = false;
  showDialog: boolean = false;
  showDelete: boolean = false;
  cards: any[] = [];
  cardslist: any[] = [];
  portlinkAdd: portlink[];
  portlink_S: any[] = [];
  portlink24: portlink24[];
  portlink24_S: any[] = [];
  portlinkremote24: portlink24_remote[];
  portlinkremote24_S: any[] = [];
  portlinkremote: portlink_remote[];
  portlinkremote_S: any[] = [];
  first = 0;
  portlinkarr: any[];
  portlinkarr_hand3: any[];
  portlinkarrs_hand1: any[] = [];
  portlinkarrs_hand2: any[] = [];
  portlinkarrs_hand3: any[] = [];
  portlinkarr1_hand1: any[] = [];
  portlinkarr2_hand2: any[] = [];
  portlinkarr3_hand3: any[] = [];
  portlinkarr4_hand4: any[] = [];
  alarmCounts: any[];
  alarmCounts1: any[] = [];
  alarmCounts_hand3: any[];
  alarmCounts1_hand3: any[] = [];
  alarmCounts_hand4: any[];
  alarmCounts1_hand4: any[] = [];
  alarmCounts_S: any[];
  alarmCounts_S1: any[] = [];
  strDesc: any[];
  strDesc1: any[] = [];
  strDesc_hand3: any[];
  strDesc1_hand3: any[] = [];
  deviceNames: any[];
  deviceNames1: any[] = [];
  deviceNames_hand4: any[];
  deviceNames1_hand4: any[] = [];
  array_data: any[] = [];
  index1: any;
  themeValue: string = this.themeService.theme;
  theme: string;
  rows = 10;
  a: any;
  symbolData: any = [];
  nameSearch: string;
  selectedData: any;
  selectedMemoryData: any;
  selectedDataList: any[] = [];
  selectedDataListfull: any[] = [];
  selectedDataListmini: any[] = [];
  selectedDataMemoryList: any[] = [];
  selectedDataMemoryListfull: any[] = [];
  selectedDataMemoryListmini: any[] = [];
  showBandwidthDialog: boolean = false;
  hasNoSearchResult: boolean = false;
  disablelist: boolean = false;
  selectionMode: string;
  ipSearch: string;
  listifIndex: any[] = [];
  invinvalidPort: string = "";
  selectedPortChart: any;
  listBanwidtharr: any[] = [];
  listBanwidtharr2: any[] = [];
  listBanwidthminiarr: any[] = [];
  listBanwidthminiarr2: any[] = [];
  listMemoryarr: any[] = [];
  listMemoryarr2: any[] = [];
  listMemoryminiarr: any[] = [];
  listMemoryminiarr2: any[] = [];
  listCPUarr: any[] = [];
  listCPUminiarr: any[] = [];
  listTemparr: any[] = [];
  listTempnumberarr: any[] = [];
  listTempminiarr: any[] = [];
  listVoltarr: any[] = [];
  listMemorydonutarr: any[] = [];
  listCPUload1minarr: any[] = [];
  listCPUload2minarr: any[] = [];
  listCPUload3minarr: any[] = [];
  listCPUload4minarr: any[] = [];
  listCPUload5minarr: any[] = [];
  loading: boolean = false;
  showMemoryDialog: boolean = false;
  showCPUDialog: boolean = false;
  selectedCPUData: any;
  selectedDataCPUList: any[] = [];
  selectedDataCPUListfull: any[] = [];
  selectedDataCPUListmini: any[] = [];
  showTempDialog: boolean = false;
  showTempnumberDialog: boolean = false;
  showMemorydonutDialog: boolean = false;
  selectedTempData: any;
  selectedTempnumberData: any;
  selectedDataTempList: any[] = [];
  selectedMemorydonutData: any;
  selectedDataMemorydonutList: any[] = [];
  selectedDataTempnumberList: any[] = [];
  selectedDataTempListfull: any[] = [];
  selectedDataTempListmini: any[] = [];
  showVoltDialog: boolean = false;
  showCPUloadDialog: boolean = false;
  selectedVoltData: any;
  selectedCPUloadData: any;
  selectedDataVoltList: any[] = [];
  selectedDataCPUloadList: any[] = [];
  selectedDataCPUloadList1min: any[] = [];
  selectedDataCPUloadList2min: any[] = [];
  selectedDataCPUloadList3min: any[] = [];
  selectedDataCPUloadList4min: any[] = [];
  selectedDataCPUloadList5min: any[] = [];
  sizewidgetArr: any[] = [];
  LoadminArr: any[] = [];
  mapSubscription: Subscription;
  selectsizewidget: any;
  selectLoadmin: any;
  invinvalidSize: any;
  invinvalidloadmin: any;
  initialGridOptions = {
    minCols: 3,
    maxCols: 3,
    minRows: 4,
    maxRows: 100,
    gridType: "verticalFixed" as GridType,
    fixedRowHeight: 160,
    fixedColWidth: 500,
    margin: 16
  };
  allDevicesOnline: number;
  allDevicesOnlinePersent: string;
  allDevicesOffline: number;
  allDevicesOfflinePersent: string;
  Available1: any;
  Usage1: any;
  Available2: any;
  Usage2: any;
  Available3: any;
  Usage3: any;
  Available4: any;
  Usage4: any;
  Available5: any;
  Usage5: any;
  switchDevicesOnline: number;
  switchDevicesOnlineold: number;
  switchDevicesOnlinePersent: string;
  switchDevicesOffline: number;
  switchDevicesOfflineold: number;
  switchDevicesOfflinePersent: string;
  lineGroupDisable: number;
  lineGroupEnable: number;
  lineGroupDisableold: number;
  lineGroupEnableold: number;
  lineGroupDisablePersent: string;
  lineGroupEnablePersent: string;
  nodeCompleted: number;
  nodeCompletedold: number;
  nodeCompletedPersent: string;
  nodeUncompleted: number;
  nodeUncompletedold: number;
  appComponent: any;
  Criticalonline: string;
  Majoronline: string;
  Minoronline: string;
  Warningonline: string;
  Unknowonline: string;
  Device_Name: any;
  colorExportwhite: any;
  colorExportDark: any;
  colortitle: any;
  exportcontainerAlldevices: any;
  exportcontainerSwitchdevices: any;
  exportcontainerLineGrouponline: any;
  exportcontainerNodeconfig: any;
  exportcontainerstockChart: any;
  exportcontaineralarmlist: any;
  exportcontainerTodayPortLinkDown: any;
  exportcontainerTopNodeDown: any;
  exportcontainerTodayRemotePoweroff: any;
  exportcontainerTopRemotePoweroff: any;
  exportcontainerBandwidthCharts1: any;
  exportcontainerBandwidthCharts2: any;
  exportcontainerBandwidthCharts3: any;
  exportcontainerBandwidthCharts4: any;
  exportcontainerBandwidthCharts5: any;
  exportcontainerBandwidthChartsmini1: any;
  exportcontainerBandwidthChartsmini2: any;
  exportcontainerBandwidthChartsmini3: any;
  exportcontainerBandwidthChartsmini4: any;
  exportcontainerBandwidthChartsmini5: any;
  exportcontainerMemoryCharts1: any;
  exportcontainerMemoryCharts2: any;
  exportcontainerMemoryCharts3: any;
  exportcontainerMemoryCharts4: any;
  exportcontainerMemoryCharts5: any;
  exportcontainerMemoryChartsmini1: any;
  exportcontainerMemoryChartsmini2: any;
  exportcontainerMemoryChartsmini3: any;
  exportcontainerMemoryChartsmini4: any;
  exportcontainerMemoryChartsmini5: any;
  exportcontainerCPUCharts1: any;
  exportcontainerCPUCharts2: any;
  exportcontainerCPUCharts3: any;
  exportcontainerCPUCharts4: any;
  exportcontainerCPUCharts5: any;
  exportcontainerCPUChartsmini1: any;
  exportcontainerCPUChartsmini2: any;
  exportcontainerCPUChartsmini3: any;
  exportcontainerCPUChartsmini4: any;
  exportcontainerCPUChartsmini5: any;
  exportcontainerTemperatureCharts1: any;
  exportcontainerTemperatureCharts2: any;
  exportcontainerTemperatureCharts3: any;
  exportcontainerTemperatureCharts4: any;
  exportcontainerTemperatureCharts5: any;
  exportcontainerTemperatureChartsmini1: any;
  exportcontainerTemperatureChartsmini2: any;
  exportcontainerTemperatureChartsmini3: any;
  exportcontainerTemperatureChartsmini4: any;
  exportcontainerTemperatureChartsmini5: any;
  exportcontainerMemorydonutCharts1: any;
  exportcontainerMemorydonutCharts2: any;
  exportcontainerMemorydonutCharts3: any;
  exportcontainerMemorydonutCharts4: any;
  exportcontainerMemorydonutCharts5: any;
  menuExportAlldevices: MenuItem[];
  menuExportSwitchdevices: MenuItem[];
  menuExportLineGrouponline: MenuItem[];
  menuExportNodeconfig: MenuItem[];
  menuExportstockChart: MenuItem[];
  menuExportalarmlist: MenuItem[];
  menuExportTodayPortLinkDown: MenuItem[];
  menuExportTopNodeDown: MenuItem[];
  menuExportTodayRemotePoweroff: MenuItem[];
  menuExportTopRemotePoweroff: MenuItem[];
  menuExportBandwidthCharts1: MenuItem[];
  menuExportBandwidthCharts2: MenuItem[];
  menuExportBandwidthCharts3: MenuItem[];
  menuExportBandwidthCharts4: MenuItem[];
  menuExportBandwidthCharts5: MenuItem[];
  menuExportBandwidthChartsmini1: MenuItem[];
  menuExportBandwidthChartsmini2: MenuItem[];
  menuExportBandwidthChartsmini3: MenuItem[];
  menuExportBandwidthChartsmini4: MenuItem[];
  menuExportBandwidthChartsmini5: MenuItem[];
  menuExportMemoryCharts1: MenuItem[];
  menuExportMemoryCharts2: MenuItem[];
  menuExportMemoryCharts3: MenuItem[];
  menuExportMemoryCharts4: MenuItem[];
  menuExportMemoryCharts5: MenuItem[];
  menuExportMemoryChartsmini1: MenuItem[];
  menuExportMemoryChartsmini2: MenuItem[];
  menuExportMemoryChartsmini3: MenuItem[];
  menuExportMemoryChartsmini4: MenuItem[];
  menuExportMemoryChartsmini5: MenuItem[];
  menuExportCPUCharts1: MenuItem[];
  menuExportCPUCharts2: MenuItem[];
  menuExportCPUCharts3: MenuItem[];
  menuExportCPUCharts4: MenuItem[];
  menuExportCPUCharts5: MenuItem[];
  menuExportCPUChartsmini1: MenuItem[];
  menuExportCPUChartsmini2: MenuItem[];
  menuExportCPUChartsmini3: MenuItem[];
  menuExportCPUChartsmini4: MenuItem[];
  menuExportCPUChartsmini5: MenuItem[];
  menuExportTemperatureCharts1: MenuItem[];
  menuExportTemperatureCharts2: MenuItem[];
  menuExportTemperatureCharts3: MenuItem[];
  menuExportTemperatureCharts4: MenuItem[];
  menuExportTemperatureCharts5: MenuItem[];
  menuExportTemperatureChartsmini1: MenuItem[];
  menuExportTemperatureChartsmini2: MenuItem[];
  menuExportTemperatureChartsmini3: MenuItem[];
  menuExportTemperatureChartsmini4: MenuItem[];
  menuExportTemperatureChartsmini5: MenuItem[];
  menuExportMemorydonutCharts1: MenuItem[];
  menuExportMemorydonutCharts2: MenuItem[];
  menuExportMemorydonutCharts3: MenuItem[];
  menuExportMemorydonutCharts4: MenuItem[];
  menuExportMemorydonutCharts5: MenuItem[];
  changtheme: any;
  level1: any[] = [];
  level2: any[] = [];
  level3: any[] = [];
  level4: any[] = [];
  level5: any[] = [];
  level1_S: any[];
  level2_S: any[];
  level3_S: any[];
  level4_S: any[];
  level5_S: any[];
  valueCPU1min1: CPUload;
  valueCPU1min2: CPUload;
  valueCPU1min3: CPUload;
  valueCPU1min4: CPUload;
  valueCPU1min5: CPUload;
  valueCPU2min1: CPUload;
  valueCPU2min2: CPUload;
  valueCPU2min3: CPUload;
  valueCPU2min4: CPUload;
  valueCPU2min5: CPUload;
  valueCPU3min1: CPUload;
  valueCPU3min2: CPUload;
  valueCPU3min3: CPUload;
  valueCPU3min4: CPUload;
  valueCPU3min5: CPUload;
  valueCPU4min1: CPUload;
  valueCPU4min2: CPUload;
  valueCPU4min3: CPUload;
  valueCPU4min4: CPUload;
  valueCPU4min5: CPUload;
  valueCPU5min1: CPUload;
  valueCPU5min2: CPUload;
  valueCPU5min3: CPUload;
  valueCPU5min4: CPUload;
  valueCPU5min5: CPUload;
  loadcpu1min1: boolean = false;
  loadcpu1min2: boolean = false;
  loadcpu1min3: boolean = false;
  loadcpu1min4: boolean = false;
  loadcpu1min5: boolean = false;
  loadcpu2min1: boolean = false;
  loadcpu2min2: boolean = false;
  loadcpu2min3: boolean = false;
  loadcpu2min4: boolean = false;
  loadcpu2min5: boolean = false;
  loadcpu3min1: boolean = false;
  loadcpu3min2: boolean = false;
  loadcpu3min3: boolean = false;
  loadcpu3min4: boolean = false;
  loadcpu3min5: boolean = false;
  loadcpu4min1: boolean = false;
  loadcpu4min2: boolean = false;
  loadcpu4min3: boolean = false;
  loadcpu4min4: boolean = false;
  loadcpu4min5: boolean = false;
  loadcpu5min1: boolean = false;
  loadcpu5min2: boolean = false;
  loadcpu5min3: boolean = false;
  loadcpu5min4: boolean = false;
  loadcpu5min5: boolean = false;
  checkcharttemp: boolean = false;
  loadTemp: boolean = false;
  valueTemp1: string;
  valueTemp2: string;
  valueTemp3: string;
  valueTemp4: string;
  valueTemp5: string;
  valueTemp1old: string;
  valueTemp2old: string;
  valueTemp3old: string;
  valueTemp4old: string;
  valueTemp5old: string;
  loading1: boolean = false;
  intervalfrist: boolean = false;
  allDevicesOnlineold: any;
  allDevicesOfflineold: any;
  checkload: boolean;
  checkloadenable: boolean;
  checkloadswitch: boolean;
  checkloadnode: boolean;
  total_alarmold: any;
  major_alarmold: any;
  minor_alarmold: any;
  warning_alarmold: any;
  unknown_alarmold: any;
  checkloadStattisticAlarm: boolean;
  loaddatamap: any;
  checkloadmap: boolean;
  checkloadtempsys1: boolean;
  checkloadtempsys2: boolean;
  checkloadtempsys3: boolean;
  checkloadtempsys4: boolean;
  checkloadtempsys5: boolean;
  alarmtop5: any[] = [];
  portlink: {
    alarm_count: number;
    strDeviceName: string;
    strLocation: string;
    strName: string;
    strDesc: string;
  };
  deviceStatus: {
    online: string;
    offline: string;
  };
  backupNumber: {
    count: string;
    latest: string;
  };

  bandwidthStatus: {
    avgSpeedUp: number;
    avgSpeedDown: number;
    maxSpeedUp: number;
    maxSpeedDown: number;
    volumeUp: number;
    volumeDown: number;
    maxVolumeUp: number;
    maxVolumeDown: number;
  };
  bandwidthaccessStatus: {
    avgSpeedUp: number;
    avgSpeedDown: number;
    maxSpeedUp: number;
    maxSpeedDown: number;
    volumeUp: number;
    volumeDown: number;
    maxVolumeUp: number;
    maxVolumeDown: number;
  };

  activePort: {
    port: string;
    interface: string;
  };

  lineGroup: {
    enable: number;
    disable: number;
  };

  lineMessage: {
    count: number;
    latest: string;
  };

  taskNumber: number = 0;
  vlanNumber: string = "0";

  symbol: {
    completed: string;
    uncompleted: string;
  };

  cols: any[];

  constructor(
    private alarmService: GetalarmlogServiceService,
    private router: Router,
    private messageService: MessageService,
    private titleService: Title,
    private navigator: NavigateService,
    public themeService: ThemeService,
    private dashboardService: DashboardService,
    private AdminLayoutService: AdminLayoutService,
    private confirmationService: ConfirmationService // appComponent: AppComponent
  ) {
    // this.themeValue = this.themeService.theme;
    this.titleService.setTitle("SED-Dashboard");
    this.deviceStatus = {
      online: "0",
      offline: "0"
    };

    this.backupNumber = {
      count: "0",
      latest: ""
    };

    this.bandwidthStatus = {
      avgSpeedUp: 0,
      avgSpeedDown: 0,
      maxSpeedUp: 0,
      maxSpeedDown: 0,
      volumeUp: 0,
      volumeDown: 0,
      maxVolumeUp: 0,
      maxVolumeDown: 0
    };

    this.bandwidthaccessStatus = {
      avgSpeedUp: 0,
      avgSpeedDown: 0,
      maxSpeedUp: 0,
      maxSpeedDown: 0,
      volumeUp: 0,
      volumeDown: 0,
      maxVolumeUp: 0,
      maxVolumeDown: 0
    };

    this.activePort = {
      port: "0",
      interface: "0"
    };

    this.lineGroup = {
      enable: 0,
      disable: 0
    };

    this.lineMessage = {
      count: 0,
      latest: ""
    };

    this.symbol = {
      completed: "0",
      uncompleted: "0"
    };
  }

  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {}
  async ngOnInit() {
    // Load Port link Down

    this.themeService.currentcolorMessage.subscribe(value => {
      // console.log(value)
      if (value == "saga-orange") {
        this.colorExportDark = "#2c2c2c";
        this.colortitle = "#2c2c2c";
        this.changtheme = "saga-orange";
      } else {
        this.colorExportDark = "#FFFFFF";
        this.colortitle = "#FFFFFF";
        this.changtheme = "arya-orange";
      }
      if (window.location.hash == "#/dashboard") {
        if (this.dashboard != undefined) {
          this.getDashboardFunc(this.dashboard);
        }
      }
    });

    this.dashboardService.getDashboard().subscribe(result => {
      this.dashboard = result.widget_list;
      this.getDashboardFunc(result.widget_list);
    });

    this.sizewidgetArr = [
      { size: "1X1", value: 1 },
      { size: "3X1", value: 2 }
    ];
    this.LoadminArr = [
      { name: "1 minute", value: 1 },
      { name: "2 minute", value: 2 },
      { name: "3 minute", value: 3 },
      { name: "4 minute", value: 4 },
      { name: "5 minute", value: 5 }
    ];
    this.loadchartFunc();
    // Load Remote Power off
    this.loadchartremoteFunc();
    // Load Top node down
    this.loadchart24Func();
    // Load Top remote power off
    this.loadchartremote24Func();

    this.gridOptions = this.initialGridOptions;

    this.contextItems = [
      {
        label: "View device",
        icon: "pi pi-search",
        command: event => {
          this.AdminLayoutService.sideiconClass("devicelist");
          this.AdminLayoutService.addOrderBox("/device");
          this.router.navigate(["/device"], {
            queryParams: {
              ID: this.selecteAlarm.iRCNetNodeID,
              IRCNETypeID: this.selecteAlarm.iRCNetNodeID,
              IPadress: this.selecteAlarm.strIPAddress
            }
          });

          // this.navigator.navigateToDevice(this.selecteAlarm.iRCNetNodeID);
        }
      }
    ];

    this.contextItems2 = [
      {
        label: "View device",
        icon: "pi pi-search",
        command: event => {
          this.AdminLayoutService.sideiconClass("devicelist");
          this.router.navigate(["/device"], {
            queryParams: {
              ID: this.marker_device_id,
              IRCNETypeID: this.marker_device_iRCNETypeID,
              IPadress: this.marker_ipaddress
            }
          });
        }
      }
    ];

    // console.log(this.dashboard);

    this.initOverlays();

    this.cols = [
      { field: "iLevel", header: "Level" },
      { field: "iRCAlarmLogID", header: "Alarm ID" },
      { field: "iRCNETypeID", header: "Device Type" },
      { field: "strIPAddress", header: "IP Address" },
      { field: "strName", header: "Alarm name" },
      { field: "strDeviceName", header: "NE name" },
      { field: "strUptime", header: "Uptime" }
    ];

    this.loadBackupNumberFunc();

    this.loadVlanCountFunc();

    this.loadTaskCountFunc();
    this.loadLineMessagesentFunc();

    this.alarmService.loadalram_interval = setInterval(() => {
      this.alarmService.loadStattisticAlarm().subscribe(data => {
        this.alarm_count = data.alarm_count;
        this.alarm_list = data.alarm_list;
        this.critical_alarm = this.alarm_count.critical_alarm;
        this.total_alarm = this.alarm_count.total_alarm;
        this.major_alarm = this.alarm_count.major_alarm;
        this.minor_alarm = this.alarm_count.minor_alarm;
        this.warning_alarm = this.alarm_count.warning_alarm;
        this.unknown_alarm = this.alarm_count.unknown_alarm;
        this.Criticalonline = (
          (this.alarm_count.critical_alarm / this.alarm_count.total_alarm) *
          100
        ).toFixed(1);
        this.Majoronline = (
          (this.alarm_count.major_alarm / this.alarm_count.total_alarm) *
          100
        ).toFixed(1);
        this.Minoronline = (
          (this.alarm_count.minor_alarm / this.alarm_count.total_alarm) *
          100
        ).toFixed(1);
        this.Unknowonline = (
          (this.alarm_count.unknown_alarm / this.alarm_count.total_alarm) *
          100
        ).toFixed(1);
        this.Warningonline = (
          (this.alarm_count.warning_alarm / this.alarm_count.total_alarm) *
          100
        ).toFixed(1);
      });

      this.updateAlarmList();
      this.loadchartFunc();
      // Load Remote Power off
      this.loadchartremoteFunc();
      // Load Top node down
      this.loadchart24Func();
      // Load Top remote power off
      this.loadchartremote24Func();
      this.loadBackupNumberFunc();

      this.loadVlanCountFunc();

      this.loadTaskCountFunc();
      this.loadLineMessagesentFunc();
      this.intervalfrist = true;
      this.callinterval();
    }, 60000);

    setTimeout(() => {
      this.intervalfrist = true;
      this.callinterval5min();
    }, 300000);
  }
  reloadDashboard: boolean = false;
  callinterval() {
    var filter = this.dashboard.filter(
      data =>
        data.widget.header == "All devices" ||
        data.widget.header == "Line Group online" ||
        data.widget.header == "Switch devices" ||
        data.widget.header == "Node config" ||
        data.widget.header == "alarmlist" ||
        data.widget.header == "stockChart" ||
        data.widget.header == "Back up devices" ||
        data.widget.header == "Today LINE message" ||
        data.widget.header == "Active VLAN" ||
        data.widget.header == "Active tasks" ||
        data.widget.header == "tableAlarm" ||
        data.widget.header == "gmap"
    );
    this.getDashboardFunc(filter);
  }
  callinterval5min() {
    var filter = this.dashboard.filter(
      data =>
        data.widget.header != "All devices" &&
        data.widget.header != "Line Group online" &&
        data.widget.header != "Switch devices" &&
        data.widget.header != "Node config" &&
        data.widget.header != "alarmlist" &&
        data.widget.header != "stockChart" &&
        data.widget.header != "Back up devices" &&
        data.widget.header != "Today LINE message" &&
        data.widget.header != "Active VLAN" &&
        data.widget.header != "Active tasks" &&
        data.widget.header != "tableAlarm" &&
        data.widget.header != "gmap"
    );
    this.getDashboardFunc(filter);
  }
  loadchartFunc() {
    this.alarmService.loadchart().subscribe(result => {
      var alarmCounts = result.map(function(singleElement) {
        return singleElement.alarm_count;
      });

      var deviceNames = result.map(function(singleElement) {
        var re = /<%>/gi;
        var str = singleElement.strLocation;
        var newstr = str.replace(re, "");

        var val = newstr;

        if (isNumeric(val)) {
          val = "port " + val;
        } else {
          val;
        }
        return singleElement.strDeviceName + " " + val;
      });
      var strDesc = result.map(function(singleElement) {
        return singleElement.strDesc;
      });
      this.portlinkarr = deviceNames;
      this.alarmCounts = alarmCounts;
      this.strDesc = strDesc;
      this.portlinkarr.forEach(data => {
        this.portlinkarrs_hand1.push(data);
      });
      this.alarmCounts.forEach(data => {
        this.alarmCounts1.push(data);
      });
      this.strDesc.forEach(data => {
        this.strDesc1.push(data);
      });
      this.handleUpdate(deviceNames, alarmCounts, strDesc);
    });
  }
  loadchartremoteFunc() {
    this.alarmService.loadchartremote().subscribe(result => {
      var alarmCounts = result.map(function(singleElement) {
        return singleElement.alarm_count;
      });

      var deviceNames = result.map(function(singleElement) {
        var re = /<%>/gi;
        var str = singleElement.strLocation;
        var newstr = str.replace(re, "");

        var val = newstr;

        if (isNumeric(val)) {
          val = "port " + val;
        } else {
          val;
        }
        var strIPAddress = singleElement.strIPAddress;
        return singleElement.strDeviceName + " " + val + " " + strIPAddress;
      });
      var strDesc = result.map(function(singleElement) {
        return singleElement.strDesc;
      });
      this.portlinkarr_hand3 = deviceNames;
      this.alarmCounts_hand3 = alarmCounts;
      this.strDesc_hand3 = strDesc;
      this.portlinkarr_hand3.forEach(data => {
        this.portlinkarrs_hand3.push(data);
      });
      this.alarmCounts_hand3.forEach(data => {
        this.alarmCounts1_hand3.push(data);
      });
      this.strDesc_hand3.forEach(data => {
        this.strDesc1_hand3.push(data);
      });
      this.handleUpdate2(deviceNames, alarmCounts, strDesc);
    });
  }
  loadchart24Func() {
    this.alarmService.loadchart24().subscribe(result => {
      var alarmCounts = result.map(function(singleElement) {
        return singleElement.alarm_count;
      });

      var deviceNames = result.map(function(singleElement) {
        return singleElement.symbol_name1;
      });
      this.deviceNames = deviceNames;
      this.alarmCounts_S = alarmCounts;
      this.deviceNames.forEach(data => {
        this.deviceNames1.push(data);
      });
      this.alarmCounts_S.forEach(data => {
        this.alarmCounts_S1.push(data);
      });

      this.handleUpdate1(deviceNames, alarmCounts);
    });
  }
  loadchartremote24Func() {
    this.alarmService.loadchartremote24().subscribe(result => {
      var alarmCounts = result.map(function(singleElement) {
        return singleElement.alarm_count;
      });

      var deviceNames = result.map(function(singleElement) {
        return singleElement.symbol_name1;
      });
      this.deviceNames_hand4 = deviceNames;
      this.alarmCounts_hand4 = alarmCounts;
      this.deviceNames_hand4.forEach(data => {
        this.deviceNames1_hand4.push(data);
      });
      this.alarmCounts_hand4.forEach(data => {
        this.alarmCounts1_hand4.push(data);
      });
      this.handleUpdate3(deviceNames, alarmCounts);
    });
  }
  loadBackupNumberFunc() {
    this.alarmService.loadBackupNumber().subscribe(
      result => {
        this.backupNumber.count = this.numberWithCommas(result.count);
        this.backupNumber.latest = result.latest;
      },
      error => {}
    );
  }
  loadVlanCountFunc() {
    this.alarmService.loadVlanCount().subscribe(
      result => {
        this.vlanNumber = this.numberWithCommas(result);
      },
      error => {}
    );
  }
  loadTaskCountFunc() {
    this.alarmService.loadTaskCount().subscribe(
      result => {
        this.taskNumber = this.numberWithCommas(result);
      },
      error => {}
    );
  }
  loadLineMessagesentFunc() {
    this.alarmService.loadLineMessagesent().subscribe(
      result => {
        this.lineMessage.count = this.numberWithCommas(result.count);
        this.lineMessage.latest = result.latest;
      },
      error => {}
    );
  }
  getDashboardFunc(results) {
    this.reloadDashboard = true;
    results.forEach(data => {
      if (data.widget.header == "All devices") {
        this.loadDeviceStatusNumberFunc();
      } else if (data.widget.header == "Line Group online") {
        this.loadLineGroupsStatusFunc();
      } else if (data.widget.header == "Switch devices") {
        this.loadActivePortFunc();
      } else if (data.widget.header == "Node config") {
        this.loadSymbolSettingNumberFunc();
      } else if (data.widget.header == "alarmlist") {
        this.loadStattisticAlarmFunc();
      } else if (data.widget.header == "stockChart") {
        this.count_historyFunc();
      } else if (data.widget.header == "gmap") {
        this.alarmService.loadAlarmMakers().subscribe(datas => {
          this.set_cluster(datas);
        });
      } else if (data.widget.header == "Top 5 Device Alarm") {
        this.loadTop5deviceAlarmFunc();
      } else if (data.widget.header == "Bandwidth Charts 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();

        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidth Charts 1"
        );
      } else if (data.widget.header == "Bandwidth Charts 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidth Charts 2"
        );
      } else if (data.widget.header == "Bandwidth Charts 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidth Charts 3"
        );
      } else if (data.widget.header == "Bandwidth Charts 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidth Charts 4"
        );
      } else if (data.widget.header == "Bandwidth Charts 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidth Charts 5"
        );
      } else if (data.widget.header == "Bandwidth Chartsmini 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidthmini Charts 1"
        );
      } else if (data.widget.header == "Bandwidth Chartsmini 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidthmini Charts 2"
        );
      } else if (data.widget.header == "Bandwidth Chartsmini 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidthmini Charts 3"
        );
      } else if (data.widget.header == "Bandwidth Chartsmini 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidthmini Charts 4"
        );
      } else if (data.widget.header == "Bandwidth Chartsmini 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeBandwidthFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.data,
          data.widget.content.image,
          "containerBandwidthmini Charts 5"
        );
      } else if (data.widget.header == "Memory Charts 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemory Charts 1"
        );
      } else if (data.widget.header == "Memory Charts 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemory Charts 2"
        );
      } else if (data.widget.header == "Memory Charts 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemory Charts 3"
        );
      } else if (data.widget.header == "Memory Charts 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemory Charts 4"
        );
      } else if (data.widget.header == "Memory Charts 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemory Charts 5"
        );
      } else if (data.widget.header == "Memory Chartsmini 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemorymini Charts 1"
        );
      } else if (data.widget.header == "Memory Chartsmini 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemorymini Charts 2"
        );
      } else if (data.widget.header == "Memory Chartsmini 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemorymini Charts 3"
        );
      } else if (data.widget.header == "Memory Chartsmini 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemorymini Charts 4"
        );
      } else if (data.widget.header == "Memory Chartsmini 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeMemoryFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerMemorymini Charts 5"
        );
      } else if (data.widget.header == "CPU Charts 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPU Charts 1"
        );
      } else if (data.widget.header == "CPU Charts 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPU Charts 2"
        );
      } else if (data.widget.header == "CPU Charts 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPU Charts 3"
        );
      } else if (data.widget.header == "CPU Charts 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPU Charts 4"
        );
      } else if (data.widget.header == "CPU Charts 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPU Charts 5"
        );
      } else if (data.widget.header == "CPU Chartsmini 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPUmini Charts 1"
        );
      } else if (data.widget.header == "CPU Chartsmini 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPUmini Charts 2"
        );
      } else if (data.widget.header == "CPU Chartsmini 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPUmini Charts 3"
        );
      } else if (data.widget.header == "CPU Chartsmini 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPUmini Charts 4"
        );
      } else if (data.widget.header == "CPU Chartsmini 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeCPUFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerCPUmini Charts 5"
        );
      } else if (data.widget.header == "Temperature Charts 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTemperature Charts 1"
        );
      } else if (data.widget.header == "Temperature Charts 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTemperature Charts 2"
        );
      } else if (data.widget.header == "Temperature Charts 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTemperature Charts 3"
        );
      } else if (data.widget.header == "Temperature Charts 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTemperature Charts 4"
        );
      } else if (data.widget.header == "Temperature Charts 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTemperature Charts 5"
        );
      } else if (data.widget.header == "Temperature Chartsmini 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTempmini Charts 1"
        );
      } else if (data.widget.header == "Temperature Chartsmini 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTempmini Charts 2"
        );
      } else if (data.widget.header == "Temperature Chartsmini 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTempmini Charts 3"
        );
      } else if (data.widget.header == "Temperature Chartsmini 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTempmini Charts 4"
        );
      } else if (data.widget.header == "Temperature Chartsmini 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.getRangeTempFunc(
          data.widget.footer,
          start,
          end,
          data.widget.content.image,
          "containerTempmini Charts 5"
        );
      } else if (data.widget.header == "CPUload1min Charts 1") {
        this.alarmService.getCPU(data.widget.footer, 1).subscribe({
          next: results => {
            this.valueCPU1min1 = results.data;
            this.loadcpu1min1 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload1min Charts 2") {
        this.alarmService.getCPU(data.widget.footer, 1).subscribe({
          next: results => {
            this.valueCPU1min2 = results.data;
            this.loadcpu1min2 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload1min Charts 3") {
        this.alarmService.getCPU(data.widget.footer, 1).subscribe({
          next: results => {
            this.valueCPU1min3 = results.data;
            this.loadcpu1min3 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload1min Charts 4") {
        this.alarmService.getCPU(data.widget.footer, 1).subscribe({
          next: results => {
            this.valueCPU1min4 = results.data;
            this.loadcpu1min4 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload1min Charts 5") {
        this.alarmService.getCPU(data.widget.footer, 1).subscribe({
          next: results => {
            this.valueCPU1min5 = results.data;
            this.loadcpu1min5 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload2min Charts 1") {
        this.alarmService.getCPU(data.widget.footer, 2).subscribe({
          next: results => {
            this.valueCPU2min1 = results.data;
            this.loadcpu2min1 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload2min Charts 2") {
        this.alarmService.getCPU(data.widget.footer, 2).subscribe({
          next: results => {
            this.valueCPU2min2 = results.data;
            this.loadcpu2min2 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload2min Charts 3") {
        this.alarmService.getCPU(data.widget.footer, 2).subscribe({
          next: results => {
            this.valueCPU2min3 = results.data;
            this.loadcpu2min3 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload2min Charts 4") {
        this.alarmService.getCPU(data.widget.footer, 2).subscribe({
          next: results => {
            this.valueCPU2min4 = results.data;
            this.loadcpu2min4 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload2min Charts 5") {
        this.alarmService.getCPU(data.widget.footer, 2).subscribe({
          next: results => {
            this.valueCPU2min5 = results.data;
            this.loadcpu2min5 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload3min Charts 1") {
        this.alarmService.getCPU(data.widget.footer, 3).subscribe({
          next: results => {
            this.valueCPU3min1 = results.data;
            this.loadcpu3min1 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload3min Charts 2") {
        this.alarmService.getCPU(data.widget.footer, 3).subscribe({
          next: results => {
            this.valueCPU3min2 = results.data;
            this.loadcpu3min2 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload3min Charts 3") {
        this.alarmService.getCPU(data.widget.footer, 3).subscribe({
          next: results => {
            this.valueCPU3min3 = results.data;
            this.loadcpu3min3 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload3min Charts 4") {
        this.alarmService.getCPU(data.widget.footer, 3).subscribe({
          next: results => {
            this.valueCPU3min4 = results.data;
            this.loadcpu3min4 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload3min Charts 5") {
        this.alarmService.getCPU(data.widget.footer, 3).subscribe({
          next: results => {
            this.valueCPU3min5 = results.data;
            this.loadcpu3min5 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload4min Charts 1") {
        this.alarmService.getCPU(data.widget.footer, 4).subscribe({
          next: results => {
            this.valueCPU4min1 = results.data;
            this.loadcpu4min1 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload4min Charts 2") {
        this.alarmService.getCPU(data.widget.footer, 4).subscribe({
          next: results => {
            this.valueCPU4min2 = results.data;
            this.loadcpu4min2 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload4min Charts 3") {
        this.alarmService.getCPU(data.widget.footer, 4).subscribe({
          next: results => {
            this.valueCPU4min3 = results.data;
            this.loadcpu4min3 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload4min Charts 4") {
        this.alarmService.getCPU(data.widget.footer, 4).subscribe({
          next: results => {
            this.valueCPU4min4 = results.data;
            this.loadcpu4min4 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload4min Charts 5") {
        this.alarmService.getCPU(data.widget.footer, 4).subscribe({
          next: results => {
            this.valueCPU4min5 = results.data;
            this.loadcpu4min5 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload5min Charts 1") {
        this.alarmService.getCPU(data.widget.footer, 5).subscribe({
          next: results => {
            this.valueCPU5min1 = results.data;
            this.loadcpu5min1 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload5min Charts 2") {
        this.alarmService.getCPU(data.widget.footer, 5).subscribe({
          next: results => {
            this.valueCPU5min2 = results.data;
            this.loadcpu5min2 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload5min Charts 3") {
        this.alarmService.getCPU(data.widget.footer, 5).subscribe({
          next: results => {
            this.valueCPU5min3 = results.data;
            this.loadcpu5min3 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload5min Charts 4") {
        this.alarmService.getCPU(data.widget.footer, 5).subscribe({
          next: results => {
            this.valueCPU5min4 = results.data;
            this.loadcpu5min4 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "CPUload5min Charts 5") {
        this.alarmService.getCPU(data.widget.footer, 5).subscribe({
          next: results => {
            this.valueCPU5min5 = results.data;
            this.loadcpu5min5 = true;
          },
          error: error => {
            if (error) {
              this.loading = false;
            }
          }
        });
      } else if (data.widget.header == "Tempnumber Charts 1") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();

        this.alarmService.getTemp(data.widget.footer).subscribe({
          next: results => {
            this.loadTemp = true;
            this.valueTemp1 = results.data;
            if (this.intervalfrist == false) {
              this.valueTemp1old = results.data;
              this.checkloadtempsys1 = true;
            } else {
              if (this.valueTemp1old != results.data) {
                this.checkloadtempsys1 = true;
              } else {
                this.checkloadtempsys1 = false;
              }
            }
            if (this.checkloadtempsys1 == true) {
              this.getRangeTempnumberFunc(
                data.widget.footer,
                start,
                end,
                "containerTempsystem 1"
              );
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
      } else if (data.widget.header == "Tempnumber Charts 2") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.alarmService.getTemp(data.widget.footer).subscribe({
          next: results => {
            this.loadTemp = true;
            this.valueTemp2 = results.data;
            if (this.intervalfrist == false) {
              this.valueTemp2old = results.data;
              this.checkloadtempsys2 = true;
            } else {
              if (this.valueTemp2old != results.data) {
                this.checkloadtempsys2 = true;
              } else {
                this.checkloadtempsys2 = false;
              }
            }
            if (this.checkloadtempsys2 == true) {
              this.getRangeTempnumberFunc(
                data.widget.footer,
                start,
                end,
                "containerTempsystem 2"
              );
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
      } else if (data.widget.header == "Tempnumber Charts 3") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.alarmService.getTemp(data.widget.footer).subscribe({
          next: results => {
            this.loadTemp = true;
            this.valueTemp3 = results.data;
            if (this.intervalfrist == false) {
              this.valueTemp3old = results.data;
              this.checkloadtempsys3 = true;
            } else {
              if (this.valueTemp3old != results.data) {
                this.checkloadtempsys3 = true;
              } else {
                this.checkloadtempsys3 = false;
              }
            }
            if (this.checkloadtempsys3 == true) {
              this.getRangeTempnumberFunc(
                data.widget.footer,
                start,
                end,
                "containerTempsystem 3"
              );
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
      } else if (data.widget.header == "Tempnumber Charts 4") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.alarmService.getTemp(data.widget.footer).subscribe({
          next: results => {
            this.loadTemp = true;
            this.valueTemp4 = results.data;
            if (this.intervalfrist == false) {
              this.valueTemp4old = results.data;
              this.checkloadtempsys4 = true;
            } else {
              if (this.valueTemp4old != results.data) {
                this.checkloadtempsys4 = true;
              } else {
                this.checkloadtempsys4 = false;
              }
            }
            if (this.checkloadtempsys4 == true) {
              this.getRangeTempnumberFunc(
                data.widget.footer,
                start,
                end,
                "containerTempsystem 4"
              );
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
      } else if (data.widget.header == "Tempnumber Charts 5") {
        var date = new Date();
        var start = date.setDate(date.getDate() - 1);
        var end = new Date().getTime();
        this.alarmService.getTemp(data.widget.footer).subscribe({
          next: results => {
            this.loadTemp = true;
            this.valueTemp5 = results.data;
            if (this.intervalfrist == false) {
              this.valueTemp5old = results.data;
              this.checkloadtempsys5 = true;
            } else {
              if (this.valueTemp5old != results.data) {
                this.checkloadtempsys5 = true;
              } else {
                this.checkloadtempsys5 = false;
              }
            }
            if (this.checkloadtempsys5 == true) {
              this.getRangeTempnumberFunc(
                data.widget.footer,
                start,
                end,
                "containerTempsystem 5"
              );
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
      } else if (data.widget.header == "Memorydonut Charts 1") {
        this.getMemoryMemorydonutCharts(
          data.widget.footer,
          data.widget.content.image,
          "containerMemorydonut chart 1"
        );
      } else if (data.widget.header == "Memorydonut Charts 2") {
        this.getMemoryMemorydonutCharts(
          data.widget.footer,
          data.widget.content.image,
          "containerMemorydonut chart 2"
        );
      } else if (data.widget.header == "Memorydonut Charts 3") {
        this.getMemoryMemorydonutCharts(
          data.widget.footer,
          data.widget.content.image,
          "containerMemorydonut chart 3"
        );
      } else if (data.widget.header == "Memorydonut Charts 4") {
        this.getMemoryMemorydonutCharts(
          data.widget.footer,
          data.widget.content.image,
          "containerMemorydonut chart 4"
        );
      } else if (data.widget.header == "Memorydonut Charts 5") {
        this.getMemoryMemorydonutCharts(
          data.widget.footer,
          data.widget.content.image,
          "containerMemorydonut chart 5"
        );
      } else if (data.widget.header == "TodayPortLinkDown") {
        this.alarmService.loadchart().subscribe(result => {
          var alarmCounts = result.map(function(singleElement) {
            return singleElement.alarm_count;
          });

          var deviceNames = result.map(function(singleElement) {
            var re = /<%>/gi;
            var str = singleElement.strLocation;
            var newstr = str.replace(re, "");

            var val = newstr;

            if (isNumeric(val)) {
              val = "port " + val;
            } else {
              val;
            }
            return singleElement.strDeviceName + " " + val;
          });
          var strDesc = result.map(function(singleElement) {
            return singleElement.strDesc;
          });
          //  console.log(deviceNames);

          // for (let i = 0 ; i < deviceNames.lenght ; i ++){
          //     this.portlinkarr = [{
          //         listdeviceNames:deviceNames[i],
          //         listalarmCounts:alarmCounts[i],
          //         liststrDesc:strDesc[i]
          //     }]
          // }

          this.portlinkarr = deviceNames;
          this.alarmCounts = alarmCounts;
          this.strDesc = strDesc;
          this.portlinkarr.forEach(data => {
            this.portlinkarrs_hand1.push(data);
          });
          this.alarmCounts.forEach(data => {
            this.alarmCounts1.push(data);
          });
          this.strDesc.forEach(data => {
            this.strDesc1.push(data);
          });
          this.menuExportTodayPortLinkDown = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerTodayPortLinkDown.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Today Port Link Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Today Port Link Down",
                          style: {
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
                    this.exportcontainerTodayPortLinkDown.exportChart(
                      {
                        type: "image/png",
                        filename: "Today Port Link Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Today Port Link Down",
                          style: {
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
                    this.exportcontainerTodayPortLinkDown.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Today Port Link Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Today Port Link Down",
                          style: {
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
          var optionsTodayporttlinkDownChart: any = {
            chart: {
              type: "column",
              backgroundColor: "transparent"
            },
            title: {
              text: "Today Port Link Down",
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            xAxis: {
              categories: deviceNames,
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              title: {
                text: "Alarm count",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            series: [
              {
                name: "Alarm count",
                data: alarmCounts,
                color: "#D35400"
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      align: "center",
                      verticalAlign: "bottom",
                      layout: "horizontal"
                    }
                  }
                }
              ]
            }
          };

          Highcharts.chart(
            "containerTodayporttlinkDown",
            optionsTodayporttlinkDownChart
          );
          this.exportcontainerTodayPortLinkDown = Highcharts.chart(
            "containerTodayporttlinkDown",
            optionsTodayporttlinkDownChart
          );
        });
      } else if (data.widget.header == "TopNodeDown") {
        this.alarmService.loadchart24().subscribe(result => {
          var alarmCounts = result.map(function(singleElement) {
            return singleElement.alarm_count;
          });

          var deviceNames = result.map(function(singleElement) {
            return singleElement.symbol_name1;
          });
          this.deviceNames = deviceNames;
          this.alarmCounts_S = alarmCounts;
          this.deviceNames.forEach(data => {
            this.deviceNames1.push(data);
          });
          this.alarmCounts_S.forEach(data => {
            this.alarmCounts_S1.push(data);
          });
          this.menuExportTopNodeDown = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerTopNodeDown.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Top Node Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Top Node Down",
                          style: {
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
                    this.exportcontainerTopNodeDown.exportChart(
                      {
                        type: "image/png",
                        filename: "Top Node Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Top Node Down",
                          style: {
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
                    this.exportcontainerTopNodeDown.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Top Node Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Top Node Down",
                          style: {
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
          var optionsTopporttlinkChart: any = {
            chart: {
              type: "column",
              backgroundColor: "transparent"
            },
            title: {
              text: "Top Node Down",
              style: {
                color: this.colortitle
              }
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: deviceNames,
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              title: {
                text: "Alarm count",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            exporting: {
              enabled: false
            },
            series: [
              {
                name: "Alarm count",
                data: alarmCounts
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      align: "center",
                      verticalAlign: "bottom",
                      layout: "horizontal"
                    }
                  }
                }
              ]
            }
          };

          Highcharts.chart("containerTopporttlink", optionsTopporttlinkChart);
          this.exportcontainerTopNodeDown = Highcharts.chart(
            "containerTopporttlink",
            optionsTopporttlinkChart
          );
        });
      } else if (data.widget.header == "TodayRemotePoweroff") {
        this.alarmService.loadchartremote().subscribe(result => {
          var alarmCounts = result.map(function(singleElement) {
            return singleElement.alarm_count;
          });

          var deviceNames = result.map(function(singleElement) {
            var re = /<%>/gi;
            var str = singleElement.strLocation;
            var newstr = str.replace(re, "");

            var val = newstr;

            if (isNumeric(val)) {
              val = "port " + val;
            } else {
              val;
            }
            var strIPAddress = singleElement.strIPAddress;
            return singleElement.strDeviceName + " " + val + " " + strIPAddress;
          });
          var strDesc = result.map(function(singleElement) {
            return singleElement.strDesc;
          });
          //  console.log(deviceNames);
          this.portlinkarr_hand3 = deviceNames;
          this.alarmCounts_hand3 = alarmCounts;
          this.strDesc_hand3 = strDesc;
          this.portlinkarr_hand3.forEach(data => {
            this.portlinkarrs_hand3.push(data);
          });
          this.alarmCounts_hand3.forEach(data => {
            this.alarmCounts1_hand3.push(data);
          });
          this.strDesc_hand3.forEach(data => {
            this.strDesc1_hand3.push(data);
          });
          this.menuExportTodayRemotePoweroff = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerTodayRemotePoweroff.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Today Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Today Remote Power off",
                          style: {
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
                    this.exportcontainerTodayRemotePoweroff.exportChart(
                      {
                        type: "image/png",
                        filename: "Today Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Today Remote Power off",
                          style: {
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
                    this.exportcontainerTodayRemotePoweroff.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Today Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Today Remote Power off",
                          style: {
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
          var optionsTodayRemotePoweroffChart: any = {
            chart: {
              type: "column",
              backgroundColor: "transparent"
            },
            title: {
              text: "Today Remote Power off",
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            xAxis: {
              categories: deviceNames,
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              title: {
                text: "Alarm count",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            series: [
              {
                name: "Alarm count",
                data: alarmCounts,
                color: "#D35400"
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      align: "center",
                      verticalAlign: "bottom",
                      layout: "horizontal"
                    }
                  }
                }
              ]
            }
          };

          Highcharts.chart(
            "containerTodayRemotePoweroff",
            optionsTodayRemotePoweroffChart
          );
          this.exportcontainerTodayRemotePoweroff = Highcharts.chart(
            "containerTodayRemotePoweroff",
            optionsTodayRemotePoweroffChart
          );
        });
      } else if (data.widget.header == "TopRemotePoweroff") {
        this.alarmService.loadchartremote24().subscribe(result => {
          var alarmCounts = result.map(function(singleElement) {
            return singleElement.alarm_count;
          });

          var deviceNames = result.map(function(singleElement) {
            return singleElement.symbol_name1;
          });
          this.deviceNames_hand4 = deviceNames;
          this.alarmCounts_hand4 = alarmCounts;
          this.deviceNames_hand4.forEach(data => {
            this.deviceNames1_hand4.push(data);
          });
          this.alarmCounts_hand4.forEach(data => {
            this.alarmCounts1_hand4.push(data);
          });
          this.menuExportTopRemotePoweroff = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerTopRemotePoweroff.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Top Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Top Remote Power off",
                          style: {
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
                    this.exportcontainerTopRemotePoweroff.exportChart(
                      {
                        type: "image/png",
                        filename: "Top Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Top Remote Power off",
                          style: {
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
                    this.exportcontainerTopRemotePoweroff.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Top Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Top Remote Power off",
                          style: {
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
          var optionsTopRemotePoweroffChart: any = {
            chart: {
              type: "column",
              backgroundColor: "transparent"
            },
            title: {
              text: "Top Remote Power off",
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            exporting: {
              enabled: false
            },
            xAxis: {
              categories: deviceNames,
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              title: {
                text: "Alarm count",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            credits: {
              enabled: false
            },
            series: [
              {
                name: "Alarm count",
                data: alarmCounts
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      align: "center",
                      verticalAlign: "bottom",
                      layout: "horizontal"
                    }
                  }
                }
              ]
            }
          };

          Highcharts.chart(
            "containerTopRemotePoweroff",
            optionsTopRemotePoweroffChart
          );
          this.exportcontainerTopRemotePoweroff = Highcharts.chart(
            "containerTopRemotePoweroff",
            optionsTopRemotePoweroffChart
          );
        });
      }

      // console.log(this.dashboard)
    });
  }
  showTop5device: boolean = false;
  loadTop5deviceAlarmFunc() {
    this.alarmtop5 = [];
    this.alarmService.getTop5device(60).subscribe(datalist => {
      if (datalist.data.length != 0) {
        for (let i = 0; i < 5; i++) {
          this.alarmtop5.push(datalist.data[i]);
          this.showTop5device = true;
        }
      } else {
        this.showTop5device = false;
      }
    });
  }
  loadDeviceStatusNumberFunc() {
    this.alarmService.loadDeviceStatusNumber().subscribe(
      result => {
        var data_online;
        var data_offline;
        if (this.intervalfrist == false) {
          this.allDevicesOnlineold = result.online;
          this.allDevicesOfflineold = result.offline;
          data_online = this.allDevicesOnlineold;
          data_offline = this.allDevicesOfflineold;
          this.checkload = true;
        } else {
          if (
            this.allDevicesOnlineold != result.online ||
            this.allDevicesOfflineold != result.offline
          ) {
            data_online = result.online;
            data_offline = result.offline;
            this.checkload = true;
          } else {
            this.checkload = false;
            data_online = this.allDevicesOnlineold;
            data_offline = this.allDevicesOfflineold;
          }
        }
        this.allDevicesOnline = this.numberWithCommas(result.online);
        this.allDevicesOffline = this.numberWithCommas(result.offline);
        var allonlineNoffline = result.online + result.offline;
        this.allDevicesOnlinePersent = (
          (result.online / allonlineNoffline) *
          100
        ).toFixed(1);
        this.allDevicesOfflinePersent = (
          (result.offline / allonlineNoffline) *
          100
        ).toFixed(1);
        if (this.checkload == true) {
          this.menuExportAlldevices = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerAlldevices.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "All Device",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "All Device"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_online + data_offline
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
                    this.exportcontainerAlldevices.exportChart(
                      {
                        type: "image/png",
                        filename: "All Device",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "All Device"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_online + data_offline
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
                    this.exportcontainerAlldevices.exportChart(
                      {
                        type: "application/pdf",
                        filename: "All Device",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "All Device"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_online + data_offline
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
          var optionsstatus: any = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              // plotShadow: true,
              type: "pie",
              backgroundColor: "transparent",
              height: 200 // Set the height of the chart container
            },
            title: {
              // text: "All devices",
              text: undefined,
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "grey"
              }
            },
            exporting: {
              enabled: false
            },

            subtitle: {
              text: this.numberWithCommas(data_online + data_offline),
              // align: 'center',
              verticalAlign: "middle",
              widthAdjust: 300,
              y: 20,
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "#50D0BC"
              }
            },
            tooltip: {
              pointFormat: "{point.y:.0f} Devices ({point.percentage:.1f} %)",
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
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: "pointer",
                size: 120,

                dataLabels: {
                  enabled: false,
                  format:
                    '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.0f} Devices ({point.percentage:.1f} %)'
                }
              }
            },
            series: [
              {
                name: "จำนวน",
                colorByPoint: true,
                innerSize: "70%",

                data: [
                  {
                    name: "Online",
                    y: data_online,
                    drilldown: "Online",
                    color: "#50D0BC"
                  },
                  {
                    name: "Offline",
                    y: data_offline,
                    drilldown: "Offine",
                    color: "#FF7782"
                  }
                ]
              }
            ]
          };

          Highcharts.chart("chart-container-all-devices", optionsstatus);
          this.exportcontainerAlldevices = Highcharts.chart(
            "chart-container-all-devices",
            optionsstatus
          );
        }
      },
      error => {}
    );
  }
  loadLineGroupsStatusFunc() {
    this.alarmService.loadLineGroupsStatus().subscribe(
      result => {
        var data_enable = result.enable;
        var data_disable = result.disable;
        if (this.intervalfrist == false) {
          this.lineGroupEnableold = result.enable;
          this.lineGroupDisableold = result.disable;
          this.checkloadenable = true;
        } else {
          if (
            this.lineGroupEnableold != result.enable ||
            this.lineGroupDisableold != result.disable
          ) {
            this.checkloadenable = true;
          } else {
            this.checkloadenable = false;
          }
        }
        this.lineGroupEnable = this.numberWithCommas(result.enable);
        this.lineGroupDisable = this.numberWithCommas(result.disable);
        var AllValue = result.enable + result.disable;
        this.lineGroupEnablePersent = (
          (result.enable / AllValue) *
          100
        ).toFixed(1);
        this.lineGroupDisablePersent = (
          (result.disable / AllValue) *
          100
        ).toFixed(1);
        if (this.checkloadenable == true) {
          this.menuExportLineGrouponline = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerLineGrouponline.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Line Group online",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Line Group online"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_enable + data_disable
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
                    this.exportcontainerLineGrouponline.exportChart(
                      {
                        type: "image/png",
                        filename: "Line Group online",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Line Group online"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_enable + data_disable
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
                    this.exportcontainerLineGrouponline.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Line Group online",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Line Group online"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_enable + data_disable
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
          var optionsLineGroups: any = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              type: "pie",
              backgroundColor: "transparent",
              height: 200
            },
            title: {
              // text: "Line Group online",
              text: undefined,
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "grey"
              }
            },
            exporting: {
              enabled: false
            },
            subtitle: {
              text: this.numberWithCommas(data_enable + data_disable),
              verticalAlign: "middle",
              widthAdjust: -300,
              y: 20,
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "#50D0BC"
              }
            },
            tooltip: {
              pointFormat: "{point.y:.0f} Groups ({point.percentage:.1f} %)",
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
            plotOptions: {
              pie: {
                allowPointSelect: false,
                cursor: "pointer",
                size: 120,
                dataLabels: {
                  enabled: false,
                  format:
                    ' <span style="color:{point.color}">{point.name}</b>: {point.y:.0f} Groups ({point.percentage:.1f} %)'
                }
              }
            },
            series: [
              {
                name: "จำนวน",
                colorByPoint: true,
                innerSize: "70%",
                data: [
                  {
                    name: "Enabled",
                    y: data_enable,
                    // drilldown: "Enable",
                    color: "#50D0BC"
                  },
                  {
                    name: "Disabled",
                    y: data_disable,
                    // drilldown: "Disabled",
                    color: "#FF7782"
                  }
                ]
              }
            ]
          };

          Highcharts.chart(
            "chart-container-line-group-online",
            optionsLineGroups
          );
          this.exportcontainerLineGrouponline = Highcharts.chart(
            "chart-container-line-group-online",
            optionsLineGroups
          );
        }
      },
      error => {}
    );
  }
  loadActivePortFunc() {
    this.alarmService.loadActivePort().subscribe(
      result => {
        if (this.intervalfrist == false) {
          this.switchDevicesOnlineold = result.active_port;
          this.switchDevicesOfflineold = result.active_interface;
          this.checkloadswitch = true;
        } else {
          if (
            this.switchDevicesOnlineold != result.active_port ||
            this.switchDevicesOfflineold != result.active_interface
          ) {
            this.checkloadswitch = true;
          } else {
            this.checkloadswitch = false;
          }
        }
        this.switchDevicesOnline = this.numberWithCommas(result.active_port);
        this.switchDevicesOffline = this.numberWithCommas(
          result.active_interface
        );
        var allonlineNoffline = result.active_port + result.active_interface;
        this.switchDevicesOnlinePersent = (
          (result.active_port / allonlineNoffline) *
          100
        ).toFixed(1);
        this.switchDevicesOfflinePersent = (
          (result.active_interface / allonlineNoffline) *
          100
        ).toFixed(1);
        var data_port = result.active_port;
        var data_interface = result.active_interface;
        if (this.checkloadswitch == true) {
          this.menuExportSwitchdevices = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerSwitchdevices.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Switch devices",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Switch devices"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_port + data_interface
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
                    this.exportcontainerSwitchdevices.exportChart(
                      {
                        type: "image/png",
                        filename: "Switch devices",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Switch devices"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_port + data_interface
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
                    this.exportcontainerSwitchdevices.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Switch devices",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Switch devices"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_port + data_interface
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
          var optionsactivePort: any = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              type: "pie",
              backgroundColor: "transparent",
              height: 200
            },
            title: {
              text: undefined,
              // text: "Switch devices/ Ports online",
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "grey"
              }
            },
            exporting: {
              enabled: false
            },
            subtitle: {
              text: this.numberWithCommas(data_port + data_interface),
              verticalAlign: "middle",
              y: 20,
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "#50D0BC"
              }
            },
            tooltip: {
              pointFormat:
                "{point.y:.0f} {point.x:.0f} ({point.percentage:.1f} %)",
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
            plotOptions: {
              pie: {
                allowPointSelect: false,
                cursor: "pointer",
                size: 120,
                dataLabels: {
                  enabled: false,
                  format:
                    '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.0f} {point.x:.0f} ({point.percentage:.1f} %)'
                }
              }
            },
            series: [
              {
                name: "จำนวน",
                colorByPoint: true,
                innerSize: "70%",
                data: [
                  {
                    name: "Port",
                    y: data_port,
                    x: "Ports",
                    drilldown: "Port",
                    color: "#50D0BC"
                  },
                  {
                    name: "Switch",
                    y: data_interface,
                    x: "Devices",
                    drilldown: "Switch",
                    color: "#FF7782"
                  }
                ]
              }
            ]
          };

          Highcharts.chart("chart-container-switch-devices", optionsactivePort);
          this.exportcontainerSwitchdevices = Highcharts.chart(
            "chart-container-switch-devices",
            optionsactivePort
          );
        }
      },
      error => {}
    );
  }
  loadSymbolSettingNumberFunc() {
    this.alarmService.loadSymbolSettingNumber().subscribe(
      result => {
        var data_completed = result.completed;
        var data_uncompleted = result.uncompleted;
        if (this.intervalfrist == false) {
          this.nodeCompletedold = result.completed;
          this.nodeUncompletedold = result.uncompleted;
          this.checkloadnode = true;
        } else {
          if (
            this.nodeCompletedold != result.completed ||
            this.nodeUncompletedold != result.uncompleted
          ) {
            this.checkloadnode = true;
          } else {
            this.checkloadnode = false;
          }
        }
        this.nodeCompleted = this.numberWithCommas(result.completed);
        this.nodeUncompleted = this.numberWithCommas(result.uncompleted);
        var Allvalue = result.completed + result.uncompleted;
        this.nodeCompletedPersent = (
          (result.completed / result.completed) *
          100
        ).toFixed(1);
        if (this.checkloadnode == true) {
          this.menuExportNodeconfig = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerNodeconfig.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Node config",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Node config"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_completed //+ data_uncompleted
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
                    this.exportcontainerNodeconfig.exportChart(
                      {
                        type: "image/png",
                        filename: "Node config",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Node config"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_completed //+ data_uncompleted
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
                    this.exportcontainerNodeconfig.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Node config",
                        sourceWidth: 400,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Node config"
                        },
                        subtitle: {
                          text: this.numberWithCommas(
                            data_completed //+ data_uncompleted
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
          var optionsSymbol: any = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              type: "pie",
              backgroundColor: "transparent",
              height: 200
            },
            title: {
              // text: "Node config",
              text: undefined,
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "grey"
              }
            },
            exporting: {
              enabled: false
            },
            subtitle: {
              text: this.numberWithCommas(
                data_completed //+ data_uncompleted
              ),
              // align: 'center',
              verticalAlign: "middle",
              widthAdjust: -300,
              y: 20,
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "#50D0BC"
              }
            },
            tooltip: {
              pointFormat: "{point.y:.0f} Nodes ({point.percentage:.1f} %)",
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
            plotOptions: {
              pie: {
                allowPointSelect: false,
                cursor: "pointer",
                size: 120,
                dataLabels: {
                  enabled: false,
                  format:
                    '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.0f} Nodes ({point.percentage:.1f} %)'
                }
              }
            },
            series: [
              {
                name: "จำนวน",
                colorByPoint: true,
                innerSize: "70%",
                data: [
                  {
                    name: "Completed",
                    y: data_completed,
                    drilldown: "Completed",
                    color: "#50D0BC"
                  },
                  {
                    // name: "Uncompleted",
                    // y: data_uncompleted,
                    // drilldown: "Uncomplet",
                    // color: "#f3686f"
                  }
                ]
              }
            ]
          };

          Highcharts.chart("chart-container-node-config", optionsSymbol);
          this.exportcontainerNodeconfig = Highcharts.chart(
            "chart-container-node-config",
            optionsSymbol
          );
        }
      },
      error => {}
    );
  }
  loadStattisticAlarmFunc() {
    this.alarmService.loadStattisticAlarm().subscribe(result => {
      this.alarm_count = result.alarm_count;
      this.alarm_list = result.alarm_list;
      this.critical_alarm = this.alarm_count.critical_alarm;
      this.total_alarm = this.alarm_count.total_alarm;
      this.major_alarm = this.alarm_count.major_alarm;
      this.minor_alarm = this.alarm_count.minor_alarm;
      this.warning_alarm = this.alarm_count.warning_alarm;
      this.unknown_alarm = this.alarm_count.unknown_alarm;
      if (this.intervalfrist == false) {
        this.total_alarmold = this.alarm_count.total_alarm;
        this.major_alarmold = this.alarm_count.major_alarm;
        this.minor_alarmold = this.alarm_count.minor_alarm;
        this.warning_alarmold = this.alarm_count.warning_alarm;
        this.unknown_alarmold = this.alarm_count.unknown_alarm;
        this.checkloadStattisticAlarm = true;
      } else {
        if (
          this.total_alarmold != this.alarm_count.total_alarm ||
          this.major_alarmold != this.alarm_count.major_alarm ||
          this.minor_alarmold != this.alarm_count.minor_alarm ||
          this.warning_alarmold != this.alarm_count.warning_alarm ||
          this.unknown_alarmold != this.alarm_count.unknown_alarm
        ) {
          this.checkloadStattisticAlarm = true;
        } else {
          this.checkloadStattisticAlarm = false;
        }
      }
      this.Criticalonline = (
        (this.alarm_count.critical_alarm / this.alarm_count.total_alarm) *
        100
      ).toFixed(1);
      this.Majoronline = (
        (this.alarm_count.major_alarm / this.alarm_count.total_alarm) *
        100
      ).toFixed(1);
      this.Minoronline = (
        (this.alarm_count.minor_alarm / this.alarm_count.total_alarm) *
        100
      ).toFixed(1);
      this.Unknowonline = (
        (this.alarm_count.unknown_alarm / this.alarm_count.total_alarm) *
        100
      ).toFixed(1);
      this.Warningonline = (
        (this.alarm_count.warning_alarm / this.alarm_count.total_alarm) *
        100
      ).toFixed(1);

      this.alarm_lists = result.alarm_list;
      if (this.checkloadStattisticAlarm == true) {
        this.menuExportalarmlist = [
          {
            label: "Download",
            items: [
              {
                label: "Download JPEG Image",
                // icon: "pi pi-fw pi-cog",
                command: event => {
                  this.exportcontaineralarmlist.exportChart(
                    {
                      type: "image/jpeg",
                      filename: "Alarm list",
                      sourceWidth: 400,
                      sourceHeight: 300
                    },
                    {
                      chart: {
                        backgroundColor: "#ffffff" // Set your desired background color here
                      },
                      title: {
                        text: "Alarm list"
                      },
                      subtitle: {
                        text: this.numberWithCommas(this.total_alarm),
                        verticalAlign: "middle",
                        widthAdjust: 300,
                        y: 30,
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
                  this.exportcontaineralarmlist.exportChart(
                    {
                      type: "image/png",
                      filename: "Alarm list",
                      sourceWidth: 400,
                      sourceHeight: 300
                    },
                    {
                      title: {
                        text: "Alarm list"
                      },
                      subtitle: {
                        text: this.numberWithCommas(this.total_alarm),
                        verticalAlign: "middle",
                        widthAdjust: 300,
                        y: 30,
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
                  this.exportcontaineralarmlist.exportChart(
                    {
                      type: "application/pdf",
                      filename: "Alarm list",
                      sourceWidth: 400,
                      sourceHeight: 300
                    },
                    {
                      title: {
                        text: "Alarm list"
                      },
                      subtitle: {
                        text: this.numberWithCommas(this.total_alarm),
                        verticalAlign: "middle",
                        widthAdjust: 300,
                        y: 30,
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
            type: "pie",
            backgroundColor: "transparent",
            height: 200,
            marginBottom: 50
          },
          title: {
            // text: "Alarms",
            text: undefined,
            style: {
              class: "m-0",
              fontSize: "2em",
              color: "grey"
            }
          },
          exporting: {
            enabled: false
          },
          subtitle: {
            text: this.numberWithCommas(this.total_alarm),
            align: "center",
            verticalAlign: "middle",
            widthAdjust: -300,
            y: 5,
            style: {
              class: "m-0",
              fontSize: "1.4em",
              color: "#50D0BC"
            }
          },
          tooltip: {
            pointFormat: "{point.y:.0f} ({point.percentage:.1f} %)",
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
          plotOptions: {
            pie: {
              allowPointSelect: false,
              cursor: "pointer",
              size: 160,
              dataLabels: {
                enabled: false,
                format:
                  '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.0f} ({point.percentage:.1f} %)'
              }
            }
          },
          series: [
            {
              colorByPoint: true,
              innerSize: "70%",
              data: [
                {
                  name: "Critical",
                  y: this.critical_alarm,
                  drilldown: "Critical",
                  color: "#BF73CC"
                },
                {
                  name: "Major",
                  y: this.major_alarm,
                  drilldown: "Major",
                  color: "#FF7782"
                },
                {
                  name: "Minor",
                  y: this.minor_alarm,
                  drilldown: "Minor",
                  color: "#FFBB55"
                },
                {
                  name: "Warning",
                  y: this.warning_alarm,
                  drilldown: "Warning",
                  color: "#45BFFF"
                },
                {
                  name: "Unknown",
                  y: this.unknown_alarm,
                  drilldown: "Unknown",
                  color: "#50D0BC"
                }
              ]
            }
          ]
        };

        Highcharts.chart("containeralarmlist", optionsalarmlist);
        this.exportcontaineralarmlist = Highcharts.chart(
          "containeralarmlist",
          optionsalarmlist
        );
      }
    });
  }
  level1old: any[] = [];
  level2old: any[] = [];
  level3old: any[] = [];
  level4old: any[] = [];
  level5old: any[] = [];
  checkloadcount_history: boolean;
  count_historyFunc() {
    this.alarmService.count_history().subscribe(result => {
      this.level1 = result[0].data;
      this.level2 = result[1].data;
      this.level3 = result[2].data;
      this.level4 = result[3].data;
      this.level5 = result[4].data;

      this.menuExportstockChart = [
        {
          label: "Download",
          items: [
            {
              label: "Download JPEG Image",
              // icon: "pi pi-fw pi-cog",
              command: event => {
                this.exportcontainerstockChart.exportChart(
                  {
                    type: "image/jpeg",
                    filename: "Alarm Chart",
                    sourceWidth: 1000,
                    sourceHeight: 300
                  },
                  {
                    chart: {
                      backgroundColor: "#ffffff" // Set your desired background color here
                    },
                    title: {
                      text: "Alarm Chart"
                    }
                  }
                );
              }
            },
            {
              label: "Download PNG Image",
              // icon: "pi pi-fw pi-pencil",
              command: event => {
                this.exportcontainerstockChart.exportChart(
                  {
                    type: "image/png",
                    filename: "Alarm Chart",
                    sourceWidth: 1000,
                    sourceHeight: 300
                  },
                  {
                    title: {
                      text: "Alarm Chart"
                    }
                  }
                );
              }
            },
            {
              label: "Download PDF",
              // icon: "pi pi-fw pi-calendar",
              command: event => {
                this.exportcontainerstockChart.exportChart(
                  {
                    type: "application/pdf",
                    filename: "Alarm Chart",
                    sourceWidth: 1000,
                    sourceHeight: 300
                  },
                  {
                    title: {
                      text: "Alarm Chart"
                    }
                  }
                );
              }
            }
          ]
        }
      ];
      var optionsstockChart: any = {
        chart: {
          marginTop: 24,
          height: 280,
          backgroundColor: "transparent",
          events: {
            load: function() {
              // set up the updating of the chart each second
              var series = this.series[0];
              setInterval(function() {}, 1000);
            }
          }
        },

        accessibility: {
          enabled: false
        },
        legend: {
          itemStyle: {
            color: this.colorExportDark
          }
        },
        time: {
          useUTC: true
        },
        credits: {
          enabled: false
        },
        rangeSelector: {
          buttons: [
            {
              count: 1,
              type: "minute",
              text: "1M"
            },
            {
              count: 5,
              type: "minute",
              text: "5M"
            },
            {
              type: "all",
              text: "All"
            }
          ],
          inputEnabled: false,
          selected: 0
        },

        title: {
          // text: "Alarms Statistic",
          text: undefined,
          style: {
            class: "m-0",
            fontSize: "2em",
            color: "grey"
          }
        },

        exporting: {
          enabled: false
        },
        xAxis: {
          type: "datetime",
          gridLineWidth: 1,
          time: {
            timezone: "Asia/Bangkok"
          },
          labels: {
            style: {
              color: "black"
            }
          }
        },
        yAxis: {
          title: undefined,
          labels: {
            style: {
              color: "black"
            }
          }
        },
        series: [
          {
            name: "Critical",
            data: this.level1,
            color: "#f3686f"
          },
          {
            name: "Major",
            data: this.level2,
            color: "#f9ad53"
          },
          {
            name: "Minor",
            data: this.level3,
            color: "#ebeb47"
          },
          {
            name: "Warning",
            data: this.level4,
            color: "lightskyblue"
          },
          {
            name: "Unknown",
            data: this.level5,
            color: "lightblue"
          }
        ]
      };

      Highcharts.chart("containerstockChart", optionsstockChart);
      this.exportcontainerstockChart = Highcharts.chart(
        "containerstockChart",
        optionsstockChart
      );
    });
  }
  arraysEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }
  Bandwidthold: any;
  checkloadBandwidth: boolean;

  getRangeBandwidthFunc(footer, start, end, content, image, wordtxt) {
    this.alarmService.getRangeBandwidth(footer, start, end, content).subscribe({
      next: results => {
        if (results == null) {
          this.loading = false;
          // this.loading1 = false;
          // this.checkchart = false;
        } else {
          this.loading = false;
          // this.checkchart = true;

          var optionsstatus: any = {
            time: {
              timezoneOffset: -7 * 60
            },
            chart: {
              zoomType: "x",
              height: 280,
              backgroundColor: "transparent"
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
              enabled: false,
              sourceWidth: 1000,
              sourceHeight: 280,
              buttons: {
                contextButton: {
                  menuItems: [
                    "downloadJPEG",
                    "downloadPNG",
                    "downloadPDF",
                    "downloadSVG"
                  ]
                }
              },
              chartOptions: {
                title: {
                  style: {
                    color: "#17212f"
                  }
                }
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            xAxis: {
              type: "datetime",
              gridLineWidth: 1,
              time: {
                timezone: "Asia/Bangkok"
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Mbps",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            navigation: {
              buttonOptions: {
                symbolStroke: this.colorExportDark,
                theme: {
                  fill: "transparent",
                  r: 0
                }
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
          Highcharts.chart(wordtxt, optionsstatus);
          this.menuExportBandwidthChart(
            results.data.ifName,
            image,
            wordtxt,
            optionsstatus
          );
        }
      },
      error: error => {
        if (error) {
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  menuExportBandwidthChart(ifName, image, wordtxt, optionsstatus) {
    var exportcontainerJPEG = [
      {
        type: "image/jpeg",
        filename: "Bandwidth Device Name:" + image + " Port:" + ifName,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Bandwidth Device Name:" + image + " Port:" + ifName,
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
    ];
    var exportcontainerPNG = [
      {
        type: "image/png",
        filename: "Bandwidth Device Name:" + image + " Port:" + ifName,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Bandwidth Device Name:" + image + " Port:" + ifName,
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
    ];
    var exportcontainerPDF = [
      {
        type: "application/pdf",
        filename: "Bandwidth Device Name:" + image + " Port:" + ifName,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Bandwidth Device Name:" + image + " Port:" + ifName,
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
    ];
    var menuExportBandwidthChartMain = [
      {
        label: "Download",
        items: [
          {
            label: "Download JPEG Image",
            // icon: "pi pi-fw pi-cog",
            command: event => {
              if (wordtxt == "containerBandwidth Charts 1") {
                this.exportcontainerBandwidthCharts1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerBandwidth Charts 2") {
                this.exportcontainerBandwidthCharts2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerBandwidth Charts 3") {
                this.exportcontainerBandwidthCharts3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerBandwidth Charts 4") {
                this.exportcontainerBandwidthCharts4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerBandwidth Charts 5") {
                this.exportcontainerBandwidthCharts5.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerBandwidthmini Charts 1") {
                this.exportcontainerBandwidthChartsmini1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerBandwidthmini Charts 2") {
                this.exportcontainerBandwidthChartsmini2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerBandwidthmini Charts 3") {
                this.exportcontainerBandwidthChartsmini3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerBandwidthmini Charts 4") {
                this.exportcontainerBandwidthChartsmini4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerBandwidthmini Charts 5") {
                this.exportcontainerBandwidthChartsmini5.exportChart(
                  ...exportcontainerJPEG
                );
              }
            }
          },
          {
            label: "Download PNG Image",
            // icon: "pi pi-fw pi-pencil",
            command: event => {
              if (wordtxt == "containerBandwidth Charts 1") {
                this.exportcontainerBandwidthCharts1.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerBandwidth Charts 2") {
                this.exportcontainerBandwidthCharts2.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerBandwidth Charts 3") {
                this.exportcontainerBandwidthCharts3.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerBandwidth Charts 4") {
                this.exportcontainerBandwidthCharts4.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerBandwidth Charts 5") {
                this.exportcontainerBandwidthCharts5.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerBandwidthmini Charts 1") {
                this.exportcontainerBandwidthChartsmini1.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerBandwidthmini Charts 2") {
                this.exportcontainerBandwidthChartsmini2.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerBandwidthmini Charts 3") {
                this.exportcontainerBandwidthChartsmini3.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerBandwidthmini Charts 4") {
                this.exportcontainerBandwidthChartsmini4.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerBandwidthmini Charts 5") {
                this.exportcontainerBandwidthChartsmini5.exportChart(
                  ...exportcontainerPNG
                );
              }
            }
          },
          {
            label: "Download PDF",
            // icon: "pi pi-fw pi-calendar",
            command: event => {
              if (wordtxt == "containerBandwidth Charts 1") {
                this.exportcontainerBandwidthCharts1.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerBandwidth Charts 2") {
                this.exportcontainerBandwidthCharts2.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerBandwidth Charts 3") {
                this.exportcontainerBandwidthCharts3.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerBandwidth Charts 4") {
                this.exportcontainerBandwidthCharts4.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerBandwidth Charts 5") {
                this.exportcontainerBandwidthCharts5.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerBandwidthmini Charts 1") {
                this.exportcontainerBandwidthChartsmini1.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerBandwidthmini Charts 2") {
                this.exportcontainerBandwidthChartsmini2.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerBandwidthmini Charts 3") {
                this.exportcontainerBandwidthChartsmini3.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerBandwidthmini Charts 4") {
                this.exportcontainerBandwidthChartsmini4.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerBandwidthmini Charts 5") {
                this.exportcontainerBandwidthChartsmini5.exportChart(
                  ...exportcontainerPDF
                );
              }
            }
          }
        ]
      }
    ];
    if (wordtxt == "containerBandwidth Charts 1") {
      this.menuExportBandwidthCharts1 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthCharts1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidth Charts 2") {
      this.menuExportBandwidthCharts2 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthCharts2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidth Charts 3") {
      this.menuExportBandwidthCharts3 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthCharts3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidth Charts 4") {
      this.menuExportBandwidthCharts4 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthCharts4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidth Charts 5") {
      this.menuExportBandwidthCharts5 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthCharts5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidthmini Charts 1") {
      this.menuExportBandwidthChartsmini1 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthChartsmini1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidthmini Charts 2") {
      this.menuExportBandwidthChartsmini2 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthChartsmini2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidthmini Charts 3") {
      this.menuExportBandwidthChartsmini3 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthChartsmini3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidthmini Charts 4") {
      this.menuExportBandwidthChartsmini4 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthChartsmini4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerBandwidthmini Charts 5") {
      this.menuExportBandwidthChartsmini5 = menuExportBandwidthChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerBandwidthChartsmini5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
  }
  getRangeMemoryFunc(footer, start, end, image, wordtxt) {
    this.alarmService.getRangeMemory(footer, start, end).subscribe({
      next: results => {
        if (results == null) {
          this.loading = false;
          // this.loading1 = false;
          // this.checkchart = false;
        } else {
          this.loading = false;
          // this.checkchart = true;

          var optionsstatus: any = {
            time: {
              timezoneOffset: -7 * 60
            },
            chart: {
              height: 280,
              backgroundColor: "transparent",
              zoomType: "x"
            },
            exporting: {
              enabled: false
            },
            title: {
              text: `Memory Utilization`,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
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
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "MB",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
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
                color: "#50D0BC",
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
          Highcharts.chart(wordtxt, optionsstatus);
          this.menuExportMemoryCharts(image, wordtxt, optionsstatus);
        }
      },
      error: error => {
        if (error) {
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  menuExportMemoryCharts(image, wordtxt, optionsstatus) {
    var exportcontainerJPEG = [
      {
        type: "image/jpeg",
        filename: "Memory Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Memory Device Name:" + image,
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
    ];
    var exportcontainerPNG = [
      {
        type: "image/png",
        filename: "Memory Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Memory Device Name:" + image,
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
    ];
    var exportcontainerPDF = [
      {
        type: "application/pdf",
        filename: "Memory Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Memory Device Name:" + image,
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
    ];
    var menuExportMemoryChartMain = [
      {
        label: "Download",
        items: [
          {
            label: "Download JPEG Image",
            // icon: "pi pi-fw pi-cog",
            command: event => {
              if (wordtxt == "containerMemory Charts 1") {
                this.exportcontainerMemoryCharts1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerMemory Charts 2") {
                this.exportcontainerMemoryCharts2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerMemory Charts 3") {
                this.exportcontainerMemoryCharts3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerMemory Charts 4") {
                this.exportcontainerMemoryCharts4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerMemory Charts 5") {
                this.exportcontainerMemoryCharts5.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerMemorymini Charts 1") {
                this.exportcontainerMemoryChartsmini1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerMemorymini Charts 2") {
                this.exportcontainerMemoryChartsmini2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerMemorymini Charts 3") {
                this.exportcontainerMemoryChartsmini3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerMemorymini Charts 4") {
                this.exportcontainerMemoryChartsmini4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerMemorymini Charts 5") {
                this.exportcontainerMemoryChartsmini5.exportChart(
                  ...exportcontainerJPEG
                );
              }
            }
          },
          {
            label: "Download PNG Image",
            // icon: "pi pi-fw pi-pencil",
            command: event => {
              if (wordtxt == "containerMemory Charts 1") {
                this.exportcontainerMemoryCharts1.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerMemory Charts 2") {
                this.exportcontainerMemoryCharts2.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerMemory Charts 3") {
                this.exportcontainerMemoryCharts3.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerMemory Charts 4") {
                this.exportcontainerMemoryCharts4.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerMemory Charts 5") {
                this.exportcontainerMemoryCharts5.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerMemorymini Charts 1") {
                this.exportcontainerMemoryChartsmini1.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerMemorymini Charts 2") {
                this.exportcontainerMemoryChartsmini2.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerMemorymini Charts 3") {
                this.exportcontainerMemoryChartsmini3.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerMemorymini Charts 4") {
                this.exportcontainerMemoryChartsmini4.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerMemorymini Charts 5") {
                this.exportcontainerMemoryChartsmini5.exportChart(
                  ...exportcontainerPNG
                );
              }
            }
          },
          {
            label: "Download PDF",
            // icon: "pi pi-fw pi-calendar",
            command: event => {
              if (wordtxt == "containerMemory Charts 1") {
                this.exportcontainerMemoryCharts1.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerMemory Charts 2") {
                this.exportcontainerMemoryCharts2.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerMemory Charts 3") {
                this.exportcontainerMemoryCharts3.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerMemory Charts 4") {
                this.exportcontainerMemoryCharts4.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerMemory Charts 5") {
                this.exportcontainerMemoryCharts5.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerMemorymini Charts 1") {
                this.exportcontainerMemoryChartsmini1.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerMemorymini Charts 2") {
                this.exportcontainerMemoryChartsmini2.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerMemorymini Charts 3") {
                this.exportcontainerMemoryChartsmini3.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerMemorymini Charts 4") {
                this.exportcontainerMemoryChartsmini4.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerMemorymini Charts 5") {
                this.exportcontainerMemoryChartsmini5.exportChart(
                  ...exportcontainerPDF
                );
              }
            }
          }
        ]
      }
    ];
    if (wordtxt == "containerMemory Charts 1") {
      this.menuExportBandwidthCharts1 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryCharts1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemory Charts 2") {
      this.menuExportBandwidthCharts2 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryCharts2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemory Charts 3") {
      this.menuExportBandwidthCharts3 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryCharts3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemory Charts 4") {
      this.menuExportBandwidthCharts4 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryCharts4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemory Charts 5") {
      this.menuExportBandwidthCharts5 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryCharts5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemorymini Charts 1") {
      this.menuExportBandwidthChartsmini1 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryChartsmini1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemorymini Charts 2") {
      this.menuExportBandwidthChartsmini2 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryChartsmini2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemorymini Charts 3") {
      this.menuExportBandwidthChartsmini3 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryChartsmini3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemorymini Charts 4") {
      this.menuExportBandwidthChartsmini4 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryChartsmini4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerMemorymini Charts 5") {
      this.menuExportBandwidthChartsmini5 = menuExportMemoryChartMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemoryChartsmini5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
  }
  getRangeCPUFunc(footer, start, end, image, wordtxt) {
    this.alarmService.getRangeCPU(footer, start, end).subscribe({
      next: results => {
        if (results == null) {
          this.loading = false;
          // this.loading1 = false;
          // this.checkchart = false;
        } else {
          this.loading = false;
          // this.checkchart = true;

          var optionsstatus: any = {
            time: {
              timezoneOffset: -7 * 60
            },
            chart: {
              height: 280,
              backgroundColor: "transparent",
              zoomType: "x"
            },
            exporting: {
              enabled: false
            },
            title: {
              text: `CPU Utilization`,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
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
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "%",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
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
          Highcharts.chart(wordtxt, optionsstatus);
          this.menuExportCPUCharts(image, wordtxt, optionsstatus);
        }
      },
      error: error => {
        if (error) {
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  menuExportCPUCharts(image, wordtxt, optionsstatus) {
    var exportcontainerJPEG = [
      {
        type: "image/jpeg",
        filename: "CPU Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "CPU Device Name:" + image,
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
    ];
    var exportcontainerPNG = [
      {
        type: "image/png",
        filename: "CPU Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "CPU Device Name:" + image,
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
    ];
    var exportcontainerPDF = [
      {
        type: "application/pdf",
        filename: "CPU Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "CPU Device Name:" + image,
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
    ];
    var menuExportCPUChartsMain = [
      {
        label: "Download",
        items: [
          {
            label: "Download JPEG Image",
            // icon: "pi pi-fw pi-cog",
            command: event => {
              if (wordtxt == "containerCPU Charts 1") {
                this.exportcontainerCPUCharts1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerCPU Charts 2") {
                this.exportcontainerCPUCharts2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerCPU Charts 3") {
                this.exportcontainerCPUCharts3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerCPU Charts 4") {
                this.exportcontainerCPUCharts4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerCPU Charts 5") {
                this.exportcontainerCPUCharts5.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerCPUmini Charts 1") {
                this.exportcontainerCPUChartsmini1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerCPUmini Charts 2") {
                this.exportcontainerCPUChartsmini2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerCPUmini Charts 3") {
                this.exportcontainerCPUChartsmini3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerCPUmini Charts 4") {
                this.exportcontainerCPUChartsmini4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerCPUmini Charts 5") {
                this.exportcontainerCPUChartsmini5.exportChart(
                  ...exportcontainerJPEG
                );
              }
            }
          },
          {
            label: "Download PNG Image",
            // icon: "pi pi-fw pi-pencil",
            command: event => {
              if (wordtxt == "containerCPU Charts 1") {
                this.exportcontainerCPUCharts1.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerCPU Charts 2") {
                this.exportcontainerCPUCharts2.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerCPU Charts 3") {
                this.exportcontainerCPUCharts3.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerCPU Charts 4") {
                this.exportcontainerCPUCharts4.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerCPU Charts 5") {
                this.exportcontainerCPUCharts5.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerCPUmini Charts 1") {
                this.exportcontainerCPUChartsmini1.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerCPUmini Charts 2") {
                this.exportcontainerCPUChartsmini2.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerCPUmini Charts 3") {
                this.exportcontainerCPUChartsmini3.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerCPUmini Charts 4") {
                this.exportcontainerCPUChartsmini4.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerCPUmini Charts 5") {
                this.exportcontainerCPUChartsmini5.exportChart(
                  ...exportcontainerPNG
                );
              }
            }
          },
          {
            label: "Download PDF",
            // icon: "pi pi-fw pi-calendar",
            command: event => {
              if (wordtxt == "containerCPU Charts 1") {
                this.exportcontainerCPUCharts1.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerCPU Charts 2") {
                this.exportcontainerCPUCharts2.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerCPU Charts 3") {
                this.exportcontainerCPUCharts3.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerCPU Charts 4") {
                this.exportcontainerCPUCharts4.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerCPU Charts 5") {
                this.exportcontainerCPUCharts5.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerCPUmini Charts 1") {
                this.exportcontainerCPUChartsmini1.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerCPUmini Charts 2") {
                this.exportcontainerCPUChartsmini2.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerCPUmini Charts 3") {
                this.exportcontainerCPUChartsmini3.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerCPUmini Charts 4") {
                this.exportcontainerCPUChartsmini4.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerCPUmini Charts 5") {
                this.exportcontainerCPUChartsmini5.exportChart(
                  ...exportcontainerPDF
                );
              }
            }
          }
        ]
      }
    ];
    if (wordtxt == "containerCPU Charts 1") {
      this.menuExportCPUCharts1 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUCharts1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPU Charts 2") {
      this.menuExportCPUCharts2 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUCharts2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPU Charts 3") {
      this.menuExportCPUCharts3 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUCharts3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPU Charts 4") {
      this.menuExportCPUCharts4 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUCharts4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPU Charts 5") {
      this.menuExportCPUCharts5 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUCharts5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPUmini Charts 1") {
      this.menuExportCPUChartsmini1 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUChartsmini1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPUmini Charts 2") {
      this.menuExportCPUChartsmini2 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUChartsmini2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPUmini Charts 3") {
      this.menuExportCPUChartsmini3 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUChartsmini3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPUmini Charts 4") {
      this.menuExportCPUChartsmini4 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUChartsmini4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerCPUmini Charts 5") {
      this.menuExportCPUChartsmini5 = menuExportCPUChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerCPUChartsmini5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
  }
  getRangeTempFunc(footer, start, end, image, wordtxt) {
    this.alarmService.getRangeTemp(footer, start, end).subscribe({
      next: results => {
        if (results == null) {
          this.loading = false;
          // this.loading1 = false;
          // this.checkchart = false;
        } else {
          this.loading = false;
          // this.checkchart = true;

          var optionsstatus: any = {
            time: {
              timezoneOffset: -7 * 60
            },
            chart: {
              height: 280,
              backgroundColor: "transparent",
              zoomType: "x"
            },
            exporting: {
              enabled: false
            },
            title: {
              text: `Termometer Utilization`,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
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
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "°C",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
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
          Highcharts.chart(wordtxt, optionsstatus);
          this.menuExportTemperatureCharts(image, wordtxt, optionsstatus);
        }
      },
      error: error => {
        if (error) {
          this.loading = false;
          // this.checkchart = false;
        }
      }
    });
  }
  menuExportTemperatureCharts(image, wordtxt, optionsstatus) {
    var exportcontainerJPEG = [
      {
        type: "image/jpeg",
        filename: "Temperature Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Temperature Device Name:" + image,
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
    ];
    var exportcontainerPNG = [
      {
        type: "image/png",
        filename: "Temperature Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Temperature Device Name:" + image,
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
    ];
    var exportcontainerPDF = [
      {
        type: "application/pdf",
        filename: "Temperature Device Name:" + image,
        sourceWidth: 1000,
        sourceHeight: 300
      },
      {
        title: {
          text: "Temperature Device Name:" + image,
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
    ];
    var menuExportTemperatureChartsMain = [
      {
        label: "Download",
        items: [
          {
            label: "Download JPEG Image",
            // icon: "pi pi-fw pi-cog",
            command: event => {
              if (wordtxt == "containerTemperature Charts 1") {
                this.exportcontainerTemperatureCharts1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerTemperature Charts 2") {
                this.exportcontainerTemperatureCharts2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerTemperature Charts 3") {
                this.exportcontainerTemperatureCharts3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerTemperature Charts 4") {
                this.exportcontainerTemperatureCharts4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerTemperature Charts 5") {
                this.exportcontainerTemperatureCharts5.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerTempmini Charts 1") {
                this.exportcontainerTemperatureChartsmini1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerTempmini Charts 2") {
                this.exportcontainerTemperatureChartsmini2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerTempmini Charts 3") {
                this.exportcontainerTemperatureChartsmini3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerTempmini Charts 4") {
                this.exportcontainerTemperatureChartsmini4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if ("containerTempmini Charts 5") {
                this.exportcontainerTemperatureChartsmini5.exportChart(
                  ...exportcontainerJPEG
                );
              }
            }
          },
          {
            label: "Download PNG Image",
            // icon: "pi pi-fw pi-pencil",
            command: event => {
              if (wordtxt == "containerTemperature Charts 1") {
                this.exportcontainerTemperatureCharts1.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerTemperature Charts 2") {
                this.exportcontainerTemperatureCharts2.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerTemperature Charts 3") {
                this.exportcontainerTemperatureCharts3.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerTemperature Charts 4") {
                this.exportcontainerTemperatureCharts4.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerTemperature Charts 5") {
                this.exportcontainerTemperatureCharts5.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerTempmini Charts 1") {
                this.exportcontainerTemperatureChartsmini1.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerTempmini Charts 2") {
                this.exportcontainerTemperatureChartsmini2.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerTempmini Charts 3") {
                this.exportcontainerTemperatureChartsmini3.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerTempmini Charts 4") {
                this.exportcontainerTemperatureChartsmini4.exportChart(
                  ...exportcontainerPNG
                );
              } else if ("containerTempmini Charts 5") {
                this.exportcontainerTemperatureChartsmini5.exportChart(
                  ...exportcontainerPNG
                );
              }
            }
          },
          {
            label: "Download PDF",
            // icon: "pi pi-fw pi-calendar",
            command: event => {
              if (wordtxt == "containerTemperature Charts 1") {
                this.exportcontainerTemperatureCharts1.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerTemperature Charts 2") {
                this.exportcontainerTemperatureCharts2.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerTemperature Charts 3") {
                this.exportcontainerTemperatureCharts3.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerTemperature Charts 4") {
                this.exportcontainerTemperatureCharts4.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerTemperature Charts 5") {
                this.exportcontainerTemperatureCharts5.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerTempmini Charts 1") {
                this.exportcontainerTemperatureChartsmini1.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerTempmini Charts 2") {
                this.exportcontainerTemperatureChartsmini2.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerTempmini Charts 3") {
                this.exportcontainerTemperatureChartsmini3.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerTempmini Charts 4") {
                this.exportcontainerTemperatureChartsmini4.exportChart(
                  ...exportcontainerPDF
                );
              } else if ("containerTempmini Charts 5") {
                this.exportcontainerTemperatureChartsmini5.exportChart(
                  ...exportcontainerPDF
                );
              }
            }
          }
        ]
      }
    ];
    if (wordtxt == "containerTemperature Charts 1") {
      this.menuExportTemperatureCharts1 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureCharts1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTemperature Charts 2") {
      this.menuExportTemperatureCharts2 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureCharts2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTemperature Charts 3") {
      this.menuExportTemperatureCharts3 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureCharts3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTemperature Charts 4") {
      this.menuExportTemperatureCharts4 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureCharts4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTemperature Charts 5") {
      this.menuExportTemperatureCharts5 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureCharts5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTempmini Charts 1") {
      this.menuExportTemperatureChartsmini1 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureChartsmini1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTempmini Charts 2") {
      this.menuExportTemperatureChartsmini2 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureChartsmini2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTempmini Charts 3") {
      this.menuExportTemperatureChartsmini3 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureChartsmini3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTempmini Charts 4") {
      this.menuExportTemperatureChartsmini4 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureChartsmini4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt == "containerTempmini Charts 5") {
      this.menuExportTemperatureChartsmini5 = menuExportTemperatureChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerTemperatureChartsmini5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
  }
  getRangeTempnumberFunc(footer, start, end, wordtxt) {
    this.alarmService.getRangeTemp(footer, start, end).subscribe({
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
              backgroundColor: "transparent",
              zoomType: "x",
              height: 120
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
                enabled: false,
                style: {
                  color: "black"
                }
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
          Highcharts.chart(wordtxt, optionsstatus);
        }
      },
      error: error => {
        if (error) {
          this.checkcharttemp = false;
          this.loading = false;
        }
      }
    });
  }
  menuExportMemorydonutCharts(image, wordtxt, optionsstatus) {
    var exportcontainerJPEG = [
      {
        type: "image/jpeg",
        filename: "Memory Device Name:" + image,
        sourceWidth: 400,
        sourceHeight: 300
      },
      {
        title: {
          text: "Memory Device Name:" + image,
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
    ];
    var exportcontainerPNG = [
      {
        type: "image/png",
        filename: "Memory Device Name:" + image,
        sourceWidth: 400,
        sourceHeight: 300
      },
      {
        title: {
          text: "Memory Device Name:" + image,
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
    ];
    var exportcontainerPDF = [
      {
        type: "application/pdf",
        filename: "Memory Device Name:" + image,
        sourceWidth: 400,
        sourceHeight: 300
      },
      {
        title: {
          text: "Memory Device Name:" + image,
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
    ];
    var menuExportMemorydonutChartsMain = [
      {
        label: "Download",
        items: [
          {
            label: "Download JPEG Image",
            // icon: "pi pi-fw pi-cog",
            command: event => {
              if (wordtxt == "containerMemorydonut chart 1") {
                this.exportcontainerMemorydonutCharts1.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerMemorydonut chart 2") {
                this.exportcontainerMemorydonutCharts2.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerMemorydonut chart 3") {
                this.exportcontainerMemorydonutCharts3.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerMemorydonut chart 4") {
                this.exportcontainerMemorydonutCharts4.exportChart(
                  ...exportcontainerJPEG
                );
              } else if (wordtxt == "containerMemorydonut chart 5") {
                this.exportcontainerMemorydonutCharts5.exportChart(
                  ...exportcontainerJPEG
                );
              }
            }
          },
          {
            label: "Download PNG Image",
            // icon: "pi pi-fw pi-pencil",
            command: event => {
              if (wordtxt == "containerMemorydonut chart 1") {
                this.exportcontainerMemorydonutCharts1.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerMemorydonut chart 2") {
                this.exportcontainerMemorydonutCharts2.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerMemorydonut chart 3") {
                this.exportcontainerMemorydonutCharts3.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerMemorydonut chart 4") {
                this.exportcontainerMemorydonutCharts4.exportChart(
                  ...exportcontainerPNG
                );
              } else if (wordtxt == "containerMemorydonut chart 5") {
                this.exportcontainerMemorydonutCharts5.exportChart(
                  ...exportcontainerPNG
                );
              }
            }
          },
          {
            label: "Download PDF",
            // icon: "pi pi-fw pi-calendar",
            command: event => {
              if (wordtxt == "containerMemorydonut chart 1") {
                this.exportcontainerMemorydonutCharts1.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerMemorydonut chart 2") {
                this.exportcontainerMemorydonutCharts2.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerMemorydonut chart 3") {
                this.exportcontainerMemorydonutCharts3.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerMemorydonut chart 4") {
                this.exportcontainerMemorydonutCharts4.exportChart(
                  ...exportcontainerPDF
                );
              } else if (wordtxt == "containerMemorydonut chart 5") {
                this.exportcontainerMemorydonutCharts5.exportChart(
                  ...exportcontainerPDF
                );
              }
            }
          }
        ]
      }
    ];
    if (wordtxt === "containerMemorydonut chart 1") {
      this.menuExportMemorydonutCharts1 = menuExportMemorydonutChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemorydonutCharts1 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt === "containerMemorydonut chart 2") {
      this.menuExportMemorydonutCharts2 = menuExportMemorydonutChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemorydonutCharts2 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt === "containerMemorydonut chart 3") {
      this.menuExportMemorydonutCharts3 = menuExportMemorydonutChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemorydonutCharts3 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt === "containerMemorydonut chart 4") {
      this.menuExportMemorydonutCharts4 = menuExportMemorydonutChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemorydonutCharts4 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
    if (wordtxt === "containerMemorydonut chart 5") {
      this.menuExportMemorydonutCharts5 = menuExportMemorydonutChartsMain;
      if (this.reloadDashboard == true) {
        this.exportcontainerMemorydonutCharts5 = Highcharts.chart(
          wordtxt,
          optionsstatus
        );
      }
    }
  }
  AvailableMemorydonutCharts(available, usage, wordtxt) {
    if (wordtxt === "containerMemorydonut chart 1") {
      this.Available1 = (available / (1024 * 1024)).toFixed(2);
      this.Usage1 = (usage / (1024 * 1024)).toFixed(2);
    }
    if (wordtxt === "containerMemorydonut chart 2") {
      this.Available2 = (available / (1024 * 1024)).toFixed(2);
      this.Usage2 = (usage / (1024 * 1024)).toFixed(2);
    }
    if (wordtxt === "containerMemorydonut chart 3") {
      this.Available3 = (available / (1024 * 1024)).toFixed(2);
      this.Usage3 = (usage / (1024 * 1024)).toFixed(2);
    }
    if (wordtxt === "containerMemorydonut chart 4") {
      this.Available4 = (available / (1024 * 1024)).toFixed(2);
      this.Usage4 = (usage / (1024 * 1024)).toFixed(2);
    }
    if (wordtxt === "containerMemorydonut chart 5") {
      this.Available5 = (available / (1024 * 1024)).toFixed(2);
      this.Usage5 = (usage / (1024 * 1024)).toFixed(2);
    }
  }
  getMemoryMemorydonutCharts(footer, image, wordtxt) {
    this.alarmService.getMemory(footer).subscribe({
      next: result => {
        if (result != null) {
          this.AvailableMemorydonutCharts(
            result.data.available,
            result.data.usage,
            wordtxt
          );
          var optionsalarmlist: any = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              // plotShadow: true,
              type: "pie",
              // height: 120,
              height: 200,
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              // text: "All devices",
              style: {
                class: "m-0",
                fontSize: "1.4em",
                color: "grey"
              }
            },
            subtitle: {
              text: this.numberWithCommas(result.data.total / (1024 * 1024)),
              // align: 'center',
              verticalAlign: "middle",
              widthAdjust: 300,
              y: 20,
              style: {
                class: "m-0",
                fontSize: "1.7em",
                color: "#50D0BC"
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
                cursor: "pointer",
                size: 120,

                dataLabels: {
                  enabled: false,
                  // connectorWidth: 0,
                  // distance: "-15%",
                  format:
                    '<b><span style="color:{point.color}">{point.name}</b>: {point.y:.1f} MB '
                }
              }
            },
            series: [
              {
                colorByPoint: true,
                innerSize: "70%",
                data: [
                  {
                    name: "Available",
                    y: result.data.available / (1024 * 1024),
                    drilldown: "Available",
                    color: "#50D0BC"
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
                    color: "#EFC519"
                    // x: 'ตัว',
                  }
                ]
              }
            ]
          };

          Highcharts.chart(wordtxt, optionsalarmlist);
          this.menuExportMemorydonutCharts(image, wordtxt, optionsalarmlist);
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
  searchSymbol() {
    this.selectedData = [];
    this.array_data = [];
    this.selectedPortChart = undefined;
    this.selectedCPUData = undefined;
    this.selectedData = undefined;
    this.selectedMemoryData = undefined;
    this.selectedTempData = undefined;
    this.selectedCPUloadData = undefined;
    this.selectedTempnumberData = undefined;
    this.selectedMemorydonutData = undefined;
    if (this.nameSearch) {
      this.alarmService
        .searchSymbolByName(this.nameSearch)
        .subscribe(result => {
          if (result.length != 0) {
            this.hasNoSearchResult = false;
            this.symbolData = result;
            this.selectionMode = "single";
          } else {
            this.symbolData = [
              {
                SYMBOL_NAME1: "No seacrh result."
              }
            ];
            this.selectionMode = "";
            this.hasNoSearchResult = true;
          }
        });
    } else if (this.ipSearch) {
      this.alarmService.searchSymbolByIP(this.ipSearch).subscribe(result => {
        if (result && result.length > 0) {
          // console.log("HI")
          this.hasNoSearchResult = false;
          this.symbolData = result;
          // console.log(result)
          this.selectionMode = "single";
        } else {
          // console.log("HI2")
          this.hasNoSearchResult = true;
          this.symbolData = [
            {
              SYMBOL_NAME1: "No seacrh result."
            }
          ];
          this.selectionMode = "";
        }
      });
    }
  }
  ipInput() {
    this.nameSearch = null;
  }
  nameInput() {
    this.ipSearch = null;
  }
  onRowSelect(event) {
    this.selectedPortChart = undefined;
    this.array_data = [];
    this.alarmService.getSysInterface(event.data.SYMBOL_NAME3).subscribe({
      next: result => {
        result.data.forEach(list => {
          if (list.length != 0) {
            this.disablelist = false;
          } else {
            this.disablelist = true;
          }
          var array_data = {
            port: list.ifName,
            ifIndex: list.ifIndex
          };

          this.array_data.push(array_data);
        });
        var ifIndex = result.data.map(function(singleElement) {
          return parseInt(singleElement.ifIndex);
        });
        this.listifIndex.push(...ifIndex);
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
  addItemChart() {
    if (this.selectsizewidget != undefined) {
      this.reloadDashboard = false;
      this.dashboardService
        .getdeviceInformation(this.selectedData.SYMBOL_NAME3)
        .subscribe(result => {
          this.Device_Name = result.data.deviceName;
          if (this.selectsizewidget.value == 2) {
            if (this.selectedData != undefined) {
              if (this.selectedDataListfull.length == 0) {
                if (this.listBanwidtharr.length < 1) {
                  this.listBanwidtharr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidtharr2.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidtharr2.forEach(data => {
                    // console.log(data.widget.content.data)
                    this.alarmService
                      .searchSymbolByIP(data.widget.footer)
                      .subscribe(result => {
                        // console.log(this.selectedPortChart)
                        result.forEach(datas => {
                          var list = {
                            SYMBOL_ID: datas.SYMBOL_ID,
                            SYMBOL_NAME1: datas.SYMBOL_NAME1,
                            SYMBOL_NAME3: datas.SYMBOL_NAME3,
                            port: this.selectedPortChart.port,
                            size: "3X1",
                            ifIndex: this.selectedPortChart.ifIndex
                          };
                          this.selectedDataListfull.push(list);
                          this.selectedDataList.push(list);
                        });

                        // console.log(result)
                      });
                  });
                  // console.log(this.listBanwidtharr)
                } else if (this.listBanwidtharr.length < 2) {
                  this.listBanwidtharr2 = [];
                  // console.log("hi")
                  this.listBanwidtharr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidtharr2.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  var list = {
                    SYMBOL_ID: this.selectedData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                    port: this.selectedPortChart.port,
                    size: "3X1",
                    ifIndex: this.selectedPortChart.ifIndex
                  };
                  this.selectedDataListfull.push(list);
                  this.selectedDataList.push(list);
                } else if (this.listBanwidtharr.length < 3) {
                  this.listBanwidtharr2 = [];
                  this.listBanwidtharr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidtharr2.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  var list = {
                    SYMBOL_ID: this.selectedData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                    port: this.selectedPortChart.port,
                    size: "3X1",
                    ifIndex: this.selectedPortChart.ifIndex
                  };
                  this.selectedDataListfull.push(list);
                  this.selectedDataList.push(list);
                } else if (this.listBanwidtharr.length < 4) {
                  this.listBanwidtharr2 = [];
                  this.listBanwidtharr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidtharr2.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  var list = {
                    SYMBOL_ID: this.selectedData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                    port: this.selectedPortChart.port,
                    size: "3X1",
                    ifIndex: this.selectedPortChart.ifIndex
                  };
                  this.selectedDataListfull.push(list);
                  this.selectedDataList.push(list);
                } else if (this.listBanwidtharr.length < 5) {
                  this.listBanwidtharr2 = [];
                  this.listBanwidtharr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: this.selectedData.SYMBOL_NAME3 + " 3X1",
                      header: "Bandwidth Charts 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidtharr2.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: this.selectedData.SYMBOL_NAME3 + " 3X1",
                      header: "Bandwidth Charts 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  var list = {
                    SYMBOL_ID: this.selectedData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                    port: this.selectedPortChart.port,
                    size: "3X1",
                    ifIndex: this.selectedPortChart.ifIndex
                  };
                  this.selectedDataListfull.push(list);
                  this.selectedDataList.push(list);
                } else if (this.listBanwidtharr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Bandwidth Charts Size 3X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataListfull.length < 5) {
                if (this.selectedDataListfull.length < 1) {
                  this.listBanwidtharr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidtharr2.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 3X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidtharr2.forEach(data => {
                    // console.log(data.widget.content.data)
                    this.alarmService
                      .searchSymbolByIP(data.widget.footer)
                      .subscribe(result => {
                        // console.log(this.selectedPortChart)
                        result.forEach(datas => {
                          var list = {
                            SYMBOL_ID: datas.SYMBOL_ID,
                            SYMBOL_NAME1: datas.SYMBOL_NAME1,
                            SYMBOL_NAME3: datas.SYMBOL_NAME3,
                            port: this.selectedPortChart.port,
                            size: "3X1",
                            ifIndex: this.selectedPortChart.ifIndex
                          };
                          this.selectedDataListfull.push(list);
                          this.selectedDataList.push(list);
                        });

                        // console.log("hi1")
                      });
                  });
                  // console.log(this.listBanwidtharr)
                } else if (this.selectedDataListfull.length < 2) {
                  this.listBanwidtharr2 = [];
                  var listduplicate = this.selectedDataList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedData.SYMBOL_NAME3 &&
                      data.port == this.selectedPortChart.port &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listBanwidtharr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 3X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Charts 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    this.listBanwidtharr2.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 3X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Charts 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    var list = {
                      SYMBOL_ID: this.selectedData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                      port: this.selectedPortChart.port,
                      size: "3X1",
                      ifIndex: this.selectedPortChart.ifIndex
                    };
                    this.selectedDataListfull.push(list);
                    this.selectedDataList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataListfull.length < 3) {
                  this.listBanwidtharr2 = [];
                  var listduplicate = this.selectedDataList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedData.SYMBOL_NAME3 &&
                      data.port == this.selectedPortChart.port &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listBanwidtharr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 3X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Charts 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    this.listBanwidtharr2.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 3X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Charts 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    var list = {
                      SYMBOL_ID: this.selectedData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                      port: this.selectedPortChart.port,
                      size: "3X1",
                      ifIndex: this.selectedPortChart.ifIndex
                    };
                    this.selectedDataListfull.push(list);
                    this.selectedDataList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataListfull.length < 4) {
                  this.listBanwidtharr2 = [];
                  var listduplicate = this.selectedDataList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedData.SYMBOL_NAME3 &&
                      data.port == this.selectedPortChart.port &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listBanwidtharr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 3X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Charts 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    this.listBanwidtharr2.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 3X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Charts 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    var list = {
                      SYMBOL_ID: this.selectedData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                      port: this.selectedPortChart.port,
                      size: "3X1",
                      ifIndex: this.selectedPortChart.ifIndex
                    };
                    this.selectedDataListfull.push(list);
                    this.selectedDataList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataListfull.length < 5) {
                  this.listBanwidtharr2 = [];
                  var listduplicate = this.selectedDataList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedData.SYMBOL_NAME3 &&
                      data.port == this.selectedPortChart.port &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listBanwidtharr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 3X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Charts 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    this.listBanwidtharr2.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 3X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Charts 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    var list = {
                      SYMBOL_ID: this.selectedData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                      port: this.selectedPortChart.port,
                      size: "3X1",
                      ifIndex: this.selectedPortChart.ifIndex
                    };
                    this.selectedDataListfull.push(list);
                    this.selectedDataList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataListfull.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Bandwidth Charts Size 3X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataListfull.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 Bandwidth Charts Size 3X1. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          } else if (this.selectsizewidget.value == 1) {
            if (this.selectedData != undefined) {
              if (this.selectedDataListmini.length == 0) {
                if (this.listBanwidthminiarr.length < 1) {
                  this.listBanwidthminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidthminiarr2.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidthminiarr2.forEach(data => {
                    // console.log(data.widget.content.data)
                    this.alarmService
                      .searchSymbolByIP(data.widget.footer)
                      .subscribe(result => {
                        // console.log(this.selectedPortChart)
                        result.forEach(datas => {
                          var list = {
                            SYMBOL_ID: datas.SYMBOL_ID,
                            SYMBOL_NAME1: datas.SYMBOL_NAME1,
                            SYMBOL_NAME3: datas.SYMBOL_NAME3,
                            port: this.selectedPortChart.port,
                            size: "1X1",
                            ifIndex: this.selectedPortChart.ifIndex
                          };
                          this.selectedDataListmini.push(list);
                          this.selectedDataList.push(list);
                        });

                        // console.log(result)
                      });
                  });
                  // console.log(this.listBanwidtharr)
                } else if (this.listBanwidthminiarr.length < 2) {
                  this.listBanwidthminiarr2 = [];
                  // console.log("hi")
                  this.listBanwidthminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidthminiarr2.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Charts 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  var list = {
                    SYMBOL_ID: this.selectedData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                    port: this.selectedPortChart.port,
                    size: "1X1",
                    ifIndex: this.selectedPortChart.ifIndex
                  };
                  this.selectedDataListmini.push(list);
                  this.selectedDataList.push(list);
                } else if (this.listBanwidthminiarr.length < 3) {
                  this.listBanwidthminiarr2 = [];
                  this.listBanwidthminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidthminiarr2.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  var list = {
                    SYMBOL_ID: this.selectedData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                    port: this.selectedPortChart.port,
                    size: "1X1",
                    ifIndex: this.selectedPortChart.ifIndex
                  };
                  this.selectedDataListmini.push(list);
                  this.selectedDataList.push(list);
                } else if (this.listBanwidthminiarr.length < 4) {
                  this.listBanwidthminiarr2 = [];
                  this.listBanwidthminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidthminiarr2.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  var list = {
                    SYMBOL_ID: this.selectedData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                    port: this.selectedPortChart.port,
                    size: "1X1",
                    ifIndex: this.selectedPortChart.ifIndex
                  };
                  this.selectedDataListmini.push(list);
                  this.selectedDataList.push(list);
                } else if (this.listBanwidthminiarr.length < 5) {
                  this.listBanwidthminiarr2 = [];
                  this.listBanwidthminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidthminiarr2.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  var list = {
                    SYMBOL_ID: this.selectedData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                    port: this.selectedPortChart.port,
                    size: "1X1",
                    ifIndex: this.selectedPortChart.ifIndex
                  };
                  this.selectedDataListmini.push(list);
                  this.selectedDataList.push(list);
                } else if (this.listBanwidthminiarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Bandwidth Charts Size 1X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataListmini.length < 5) {
                if (this.selectedDataListmini.length < 1) {
                  this.listBanwidthminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidthminiarr2.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type:
                        this.selectedData.SYMBOL_NAME3 +
                        " 1X1" +
                        " " +
                        this.selectedPortChart.ifIndex,
                      header: "Bandwidth Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedPortChart.ifIndex
                      },
                      footer: this.selectedData.SYMBOL_NAME3
                    }
                  });
                  this.listBanwidthminiarr2.forEach(data => {
                    // console.log(data.widget.content.data)
                    this.alarmService
                      .searchSymbolByIP(data.widget.footer)
                      .subscribe(result => {
                        // console.log(this.selectedPortChart)
                        result.forEach(datas => {
                          var list = {
                            SYMBOL_ID: datas.SYMBOL_ID,
                            SYMBOL_NAME1: datas.SYMBOL_NAME1,
                            SYMBOL_NAME3: datas.SYMBOL_NAME3,
                            port: this.selectedPortChart.port,
                            size: "1X1",
                            ifIndex: this.selectedPortChart.ifIndex
                          };
                          this.selectedDataListmini.push(list);
                          this.selectedDataList.push(list);
                        });

                        // console.log("hi1");
                      });
                  });
                  // console.log(this.listBanwidtharr)
                } else if (this.selectedDataListmini.length < 2) {
                  this.listBanwidthminiarr2 = [];
                  var listduplicate = this.selectedDataList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedData.SYMBOL_NAME3 &&
                      data.port == this.selectedPortChart.port &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listBanwidthminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 1X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Chartsmini 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    this.listBanwidthminiarr2.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 1X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Chartsmini 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    var list = {
                      SYMBOL_ID: this.selectedData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                      port: this.selectedPortChart.port,
                      size: "1X1",
                      ifIndex: this.selectedPortChart.ifIndex
                    };

                    this.selectedDataListmini.push(list);
                    this.selectedDataList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataListmini.length < 3) {
                  this.listBanwidthminiarr2 = [];
                  var listduplicate = this.selectedDataList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedData.SYMBOL_NAME3 &&
                      data.port == this.selectedPortChart.port &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listBanwidthminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 1X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Chartsmini 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    this.listBanwidthminiarr2.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 1X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Chartsmini 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    var list = {
                      SYMBOL_ID: this.selectedData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                      port: this.selectedPortChart.port,
                      size: "1X1",
                      ifIndex: this.selectedPortChart.ifIndex
                    };
                    this.selectedDataListmini.push(list);
                    this.selectedDataList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataListmini.length < 4) {
                  this.listBanwidthminiarr2 = [];
                  var listduplicate = this.selectedDataList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedData.SYMBOL_NAME3 &&
                      data.port == this.selectedPortChart.port &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listBanwidthminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 1X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Chartsmini 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    this.listBanwidthminiarr2.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 1X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Chartsmini 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    var list = {
                      SYMBOL_ID: this.selectedData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                      port: this.selectedPortChart.port,
                      size: "1X1",
                      ifIndex: this.selectedPortChart.ifIndex
                    };
                    this.selectedDataListmini.push(list);
                    this.selectedDataList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataListmini.length < 5) {
                  this.listBanwidthminiarr2 = [];
                  var listduplicate = this.selectedDataList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedData.SYMBOL_NAME3 &&
                      data.port == this.selectedPortChart.port &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listBanwidthminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 1X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Chartsmini 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    this.listBanwidthminiarr2.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type:
                          this.selectedData.SYMBOL_NAME3 +
                          " 1X1" +
                          " " +
                          this.selectedPortChart.ifIndex,
                        header: "Bandwidth Chartsmini 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedPortChart.ifIndex
                        },
                        footer: this.selectedData.SYMBOL_NAME3
                      }
                    });
                    var list = {
                      SYMBOL_ID: this.selectedData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedData.SYMBOL_NAME3,
                      port: this.selectedPortChart.port,
                      size: "1X1",
                      ifIndex: this.selectedPortChart.ifIndex
                    };
                    this.selectedDataListmini.push(list);
                    this.selectedDataList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataListmini.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Bandwidth Charts Size 1X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataListmini.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 Bandwidth Charts Size 1X1. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          }
        });
    } else {
      this.invinvalidSize = "ng-invalid ng-dirty";
    }
  }
  onChangeSize(event) {
    this.invinvalidSize = "";
  }
  onChangeloadmin(event) {
    this.invinvalidloadmin = "";
  }
  addItemMemoryChart() {
    if (this.selectsizewidget != undefined) {
      this.reloadDashboard = false;
      this.dashboardService
        .getdeviceInformation(this.selectedMemoryData.SYMBOL_NAME3)
        .subscribe(result => {
          this.Device_Name = result.data.deviceName;
          if (this.selectsizewidget.value == 2) {
            if (this.selectedMemoryData != undefined) {
              if (this.selectedDataMemoryListfull.length == 0) {
                if (this.listMemoryarr.length < 1) {
                  this.listMemoryarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Memory Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataMemoryListfull.push(list);
                  this.selectedDataMemoryList.push(list);
                } else if (this.listMemoryarr.length < 2) {
                  this.listMemoryarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Memory Charts 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  this.selectedDataMemoryListfull.push(list);
                  this.selectedDataMemoryList.push(list);
                  // console.log(list)
                } else if (this.listMemoryarr.length < 3) {
                  this.listMemoryarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Memory Charts 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  this.selectedDataMemoryListfull.push(list);
                  this.selectedDataMemoryList.push(list);
                  // console.log(list)
                  // console.log(this.listBanwidtharr)
                } else if (this.listMemoryarr.length < 4) {
                  this.listMemoryarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Memory Charts 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  this.selectedDataMemoryListfull.push(list);
                  this.selectedDataMemoryList.push(list);
                  // console.log(list)
                  // console.log(this.listBanwidtharr)
                } else if (this.listMemoryarr.length < 5) {
                  this.listMemoryarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Memory Charts 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  this.selectedDataMemoryListfull.push(list);
                  this.selectedDataMemoryList.push(list);

                  // console.log(this.listBanwidtharr)
                } else if (this.listMemoryarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Memory Charts Size 3X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataMemoryListfull.length < 5) {
                if (this.selectedDataMemoryListfull.length < 1) {
                  this.listMemoryarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Memory Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  this.selectedDataMemoryListfull.push(list);
                  this.selectedDataMemoryList.push(list);
                } else if (this.selectedDataMemoryListfull.length < 2) {
                  this.listBanwidtharr2 = [];
                  var listduplicate = this.selectedDataMemoryList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedMemoryData.SYMBOL_NAME3 &&
                        data.size == this.selectsizewidget.size
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listMemoryarr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "Memory Charts 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedMemoryData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataMemoryListfull.push(list);
                    this.selectedDataMemoryList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataMemoryListfull.length < 3) {
                  this.listBanwidtharr2 = [];
                  var listduplicate = this.selectedDataMemoryList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedMemoryData.SYMBOL_NAME3 &&
                        data.size == this.selectsizewidget.size
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listMemoryarr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "Memory Charts 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedMemoryData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataMemoryListfull.push(list);
                    this.selectedDataMemoryList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataMemoryListfull.length < 4) {
                  this.listBanwidtharr2 = [];
                  var listduplicate = this.selectedDataMemoryList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedMemoryData.SYMBOL_NAME3 &&
                        data.size == this.selectsizewidget.size
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listMemoryarr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "Memory Charts 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedMemoryData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataMemoryListfull.push(list);
                    this.selectedDataMemoryList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataMemoryListfull.length < 5) {
                  this.listBanwidtharr2 = [];
                  var listduplicate = this.selectedDataMemoryList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedMemoryData.SYMBOL_NAME3 &&
                        data.size == this.selectsizewidget.size
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listMemoryarr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "Memory Charts 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedMemoryData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedMemoryData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataMemoryListfull.push(list);
                    this.selectedDataMemoryList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataMemoryListfull.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Memoty Charts Size 3X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataMemoryListfull.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 Memory Charts Size 3X1. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          } else if (this.selectsizewidget.value == 1) {
            if (this.selectedMemoryData != undefined) {
              if (this.selectedDataMemoryListmini.length == 0) {
                if (this.listMemoryminiarr.length < 1) {
                  this.listMemoryminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Memory Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataMemoryListmini.push(list);
                  this.selectedDataMemoryList.push(list);
                } else if (this.listMemoryminiarr.length < 2) {
                  this.listMemoryminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Memory Chartsmini 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  this.selectedDataMemoryListmini.push(list);
                  this.selectedDataMemoryList.push(list);
                  // console.log(list)
                } else if (this.listMemoryminiarr.length < 3) {
                  this.listMemoryminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Memory Chartsmini 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  this.selectedDataMemoryListmini.push(list);
                  this.selectedDataMemoryList.push(list);
                  // console.log(list)
                  // console.log(this.listBanwidtharr)
                } else if (this.listMemoryminiarr.length < 4) {
                  this.listMemoryminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Memory Chartsmini 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  this.selectedDataMemoryListmini.push(list);
                  this.selectedDataMemoryList.push(list);
                  // console.log(list)
                  // console.log(this.listBanwidtharr)
                } else if (this.listMemoryminiarr.length < 5) {
                  this.listMemoryminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Memory Chartsmini 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  this.selectedDataMemoryListmini.push(list);
                  this.selectedDataMemoryList.push(list);

                  // console.log(this.listBanwidtharr)
                } else if (this.listMemoryminiarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Memory Charts Size 1X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataMemoryListmini.length < 5) {
                if (this.selectedDataMemoryListmini.length < 1) {
                  this.listMemoryminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Memory Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedMemoryData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  this.selectedDataMemoryListmini.push(list);
                  this.selectedDataMemoryList.push(list);
                } else if (this.selectedDataMemoryListmini.length < 2) {
                  this.listBanwidthminiarr2 = [];
                  var listduplicate = this.selectedDataMemoryList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedMemoryData.SYMBOL_NAME3 &&
                        data.size == this.selectsizewidget.size
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listMemoryminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "Memory Chartsmini 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedMemoryData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataMemoryListmini.push(list);
                    this.selectedDataMemoryList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataMemoryListmini.length < 3) {
                  this.listBanwidthminiarr2 = [];
                  var listduplicate = this.selectedDataMemoryList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedMemoryData.SYMBOL_NAME3 &&
                        data.size == this.selectsizewidget.size
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listMemoryminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "Memory Chartsmini 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedMemoryData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataMemoryListmini.push(list);
                    this.selectedDataMemoryList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataMemoryListmini.length < 4) {
                  this.listBanwidthminiarr2 = [];
                  var listduplicate = this.selectedDataMemoryList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedMemoryData.SYMBOL_NAME3 &&
                        data.size == this.selectsizewidget.size
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listMemoryminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "Memory Chartsmini 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedMemoryData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataMemoryListmini.push(list);
                    this.selectedDataMemoryList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataMemoryListmini.length < 5) {
                  this.listBanwidthminiarr2 = [];
                  var listduplicate = this.selectedDataMemoryList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedMemoryData.SYMBOL_NAME3 &&
                        data.size == this.selectsizewidget.size
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  // console.log(listduplicate)
                  if (listduplicate.length == 0) {
                    this.listMemoryminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "Memory Chartsmini 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedMemoryData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedMemoryData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedMemoryData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedMemoryData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedMemoryData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataMemoryListmini.push(list);
                    this.selectedDataMemoryList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataMemoryListmini.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Memoty Charts Size 1X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataMemoryListmini.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 Memory Charts Size 1X1. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          }
        });
    } else {
      this.invinvalidSize = "ng-invalid ng-dirty";
    }
  }
  addItemCPUChart() {
    // console.log(this.selectedData)
    // // this.selectedData
    if (this.selectsizewidget != undefined) {
      this.dashboardService
        .getdeviceInformation(this.selectedCPUData.SYMBOL_NAME3)
        .subscribe(result => {
          this.Device_Name = result.data.deviceName;
          if (this.selectsizewidget.value == 2) {
            if (this.selectedCPUData != undefined) {
              if (this.selectedDataCPUListfull.length == 0) {
                if (this.listCPUarr.length < 1) {
                  this.listCPUarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPU Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListfull.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUarr.length < 2) {
                  this.listCPUarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPU Charts 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListfull.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUarr.length < 3) {
                  this.listCPUarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPU Charts 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListfull.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUarr.length < 4) {
                  this.listCPUarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPU Charts 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListfull.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUarr.length < 5) {
                  this.listCPUarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPU Charts 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListfull.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU Charts Size 3X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUListfull.length < 5) {
                if (this.selectedDataCPUListfull.length < 1) {
                  this.listCPUarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPU Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  this.selectedDataCPUListfull.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.selectedDataCPUListfull.length < 2) {
                  var listduplicate = this.selectedDataCPUList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedCPUData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listCPUarr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "CPU Charts 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedCPUData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataCPUListfull.push(list);
                    this.selectedDataCPUList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataCPUListfull.length < 3) {
                  var listduplicate = this.selectedDataCPUList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedCPUData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listCPUarr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "CPU Charts 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedCPUData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataCPUListfull.push(list);
                    this.selectedDataCPUList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataCPUListfull.length < 4) {
                  var listduplicate = this.selectedDataCPUList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedCPUData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listCPUarr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "CPU Charts 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedCPUData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataCPUListfull.push(list);
                    this.selectedDataCPUList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataCPUListfull.length < 5) {
                  var listduplicate = this.selectedDataCPUList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedCPUData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listCPUarr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "CPU Charts 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedCPUData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedCPUData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataCPUListfull.push(list);
                    this.selectedDataCPUList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataCPUListfull.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU Charts Size 3X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUListfull.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 CPU Charts Size 3X1. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          } else if (this.selectsizewidget.value == 1) {
            if (this.selectedCPUData != undefined) {
              if (this.selectedDataCPUListmini.length == 0) {
                if (this.listCPUminiarr.length < 1) {
                  this.listCPUminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPU Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListmini.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUminiarr.length < 2) {
                  this.listCPUminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPU Chartsmini 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListmini.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUminiarr.length < 3) {
                  this.listCPUminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPU Chartsmini 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListmini.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUminiarr.length < 4) {
                  this.listCPUminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPU Chartsmini 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListmini.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUminiarr.length < 5) {
                  this.listCPUminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPU Chartsmini 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataCPUListmini.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.listCPUarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU Charts Size 1X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUListmini.length < 5) {
                if (this.selectedDataCPUListmini.length < 1) {
                  this.listCPUminiarr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPU Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedCPUData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  this.selectedDataCPUListmini.push(list);
                  this.selectedDataCPUList.push(list);
                } else if (this.selectedDataCPUListmini.length < 2) {
                  var listduplicate = this.selectedDataCPUList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedCPUData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listCPUminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "CPU Chartsmini 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedCPUData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataCPUListmini.push(list);
                    this.selectedDataCPUList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataCPUListmini.length < 3) {
                  var listduplicate = this.selectedDataCPUList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedCPUData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listCPUminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "CPU Chartsmini 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedCPUData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataCPUListmini.push(list);
                    this.selectedDataCPUList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataCPUListmini.length < 4) {
                  var listduplicate = this.selectedDataCPUList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedCPUData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listCPUminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "CPU Chartsmini 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedCPUData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataCPUListmini.push(list);
                    this.selectedDataCPUList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataCPUListmini.length < 5) {
                  var listduplicate = this.selectedDataCPUList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedCPUData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listCPUminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "CPU Chartsmini 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedCPUData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedCPUData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataCPUListmini.push(list);
                    this.selectedDataCPUList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataCPUListmini.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU Charts Size 1X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUListmini.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 CPU Charts Size 1X1. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          }
        });
    } else {
      this.invinvalidSize = "ng-invalid ng-dirty";
    }
  }
  addItemTempChart() {
    if (this.selectsizewidget != undefined) {
      this.dashboardService
        .getdeviceInformation(this.selectedTempData.SYMBOL_NAME3)
        .subscribe(result => {
          this.Device_Name = result.data.deviceName;
          if (this.selectsizewidget.value == 2) {
            if (this.selectedTempData != undefined) {
              if (this.selectedDataTempListfull.length == 0) {
                if (this.listTemparr.length < 1) {
                  this.listTemparr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Temperature Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListfull.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTemparr.length < 2) {
                  this.listTemparr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Temperature Charts 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataTempList.push(list);
                } else if (this.listTemparr.length < 3) {
                  this.listTemparr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Temperature Charts 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListfull.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTemparr.length < 4) {
                  this.listTemparr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Temperature Charts 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListfull.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTemparr.length < 5) {
                  this.listTemparr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Temperature Charts 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListfull.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTemparr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Termometer Charts Size 3X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataTempListfull.length < 5) {
                if (this.selectedDataTempListfull.length < 1) {
                  this.listTemparr.push({
                    cols: 3,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "Temperature Charts 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  this.selectedDataTempListfull.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.selectedDataTempListfull.length < 2) {
                  var listduplicate = this.selectedDataTempList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedTempData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listTemparr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "Temperature Charts 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedTempData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataTempListfull.push(list);
                    this.selectedDataTempList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataTempListfull.length < 3) {
                  var listduplicate = this.selectedDataTempList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedTempData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listTemparr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "Temperature Charts 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedTempData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataTempListfull.push(list);
                    this.selectedDataTempList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataTempListfull.length < 4) {
                  var listduplicate = this.selectedDataTempList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedTempData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listTemparr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "Temperature Charts 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedTempData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataTempListfull.push(list);
                    this.selectedDataTempList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataTempListfull.length < 5) {
                  var listduplicate = this.selectedDataTempList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedTempData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listTemparr.push({
                      cols: 3,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "Temperature Charts 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedTempData.SYMBOL_NAME3 + " 3X1"
                        },
                        footer: this.selectedTempData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                      size: "3X1"
                    };
                    this.selectedDataTempListfull.push(list);
                    this.selectedDataTempList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataTempListfull.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Termometer Charts Size 3X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataTempListfull.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 Termometer Charts Size 3X1. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          } else if (this.selectsizewidget.value == 1) {
            if (this.selectedTempData != undefined) {
              if (this.selectedDataTempListmini.length == 0) {
                if (this.listTempminiarr.length < 1) {
                  this.listTempminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Temperature Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListmini.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTempminiarr.length < 2) {
                  this.listTempminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Temperature Chartsmini 2",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListmini.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTempminiarr.length < 3) {
                  this.listTempminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Temperature Chartsmini 3",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListmini.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTempminiarr.length < 4) {
                  this.listTempminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Temperature Chartsmini 4",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListmini.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTempminiarr.length < 5) {
                  this.listTempminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Temperature Chartsmini 5",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // console.log(list)
                  this.selectedDataTempListmini.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.listTempminiarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Termometer Charts Size 1X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataTempListmini.length < 5) {
                if (this.selectedDataTempListmini.length < 1) {
                  this.listTempminiarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "Temperature Chartsmini 1",
                      content: {
                        image: this.Device_Name,
                        data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                      },
                      footer: this.selectedTempData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  this.selectedDataTempListmini.push(list);
                  this.selectedDataTempList.push(list);
                } else if (this.selectedDataTempListmini.length < 2) {
                  var listduplicate = this.selectedDataTempList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedTempData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listTempminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "Temperature Chartsmini 2",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedTempData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataTempListmini.push(list);
                    this.selectedDataTempList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataTempListmini.length < 3) {
                  var listduplicate = this.selectedDataTempList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedTempData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listTempminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "Temperature Chartsmini 3",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedTempData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataTempListmini.push(list);
                    this.selectedDataTempList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataTempListmini.length < 4) {
                  var listduplicate = this.selectedDataTempList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedTempData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listTempminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "Temperature Chartsmini 4",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedTempData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataTempListmini.push(list);
                    this.selectedDataTempList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataTempListmini.length < 5) {
                  var listduplicate = this.selectedDataTempList.filter(data => {
                    if (
                      data.SYMBOL_NAME3 == this.selectedTempData.SYMBOL_NAME3 &&
                      data.size == this.selectsizewidget.size
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  if (listduplicate.length == 0) {
                    this.listTempminiarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "Temperature Chartsmini 5",
                        content: {
                          image: this.Device_Name,
                          data: this.selectedTempData.SYMBOL_NAME3 + " 1X1"
                        },
                        footer: this.selectedTempData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedTempData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedTempData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedTempData.SYMBOL_NAME3,
                      size: "1X1"
                    };
                    this.selectedDataTempListmini.push(list);
                    this.selectedDataTempList.push(list);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail:
                        "Can't add IP address and port duplicate.Please try again."
                    });
                  }
                } else if (this.selectedDataTempListmini.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 Termometer Charts Size 1X1. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataTempListmini.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 Termometer Charts Size 1X1. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          }
        });
    } else {
      this.invinvalidSize = "ng-invalid ng-dirty";
    }
  }
  addItemTempnumberChart() {
    if (this.selectedTempnumberData != undefined) {
      this.dashboardService
        .getdeviceInformation(this.selectedTempnumberData.SYMBOL_NAME3)
        .subscribe(result => {
          this.Device_Name = result.data.deviceName;
          if (this.selectedDataTempnumberList.length == 0) {
            if (this.listTempnumberarr.length < 1) {
              this.listTempnumberarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Tempnumber Charts 1",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedTempnumberData.SYMBOL_NAME3
                  },
                  footer: this.selectedTempnumberData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
              };
              // console.log(list)

              this.selectedDataTempnumberList.push(list);
            } else if (this.listTempnumberarr.length < 2) {
              this.listTempnumberarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Tempnumber Charts 2",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedTempnumberData.SYMBOL_NAME3
                  },
                  footer: this.selectedTempnumberData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
              };
              // console.log(list)
              this.selectedDataTempnumberList.push(list);
            } else if (this.listTempnumberarr.length < 3) {
              this.listTempnumberarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Tempnumber Charts 3",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedTempnumberData.SYMBOL_NAME3
                  },
                  footer: this.selectedTempnumberData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
              };
              // console.log(list)

              this.selectedDataTempnumberList.push(list);
            } else if (this.listTempnumberarr.length < 4) {
              this.listTempnumberarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Tempnumber Charts 4",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedTempnumberData.SYMBOL_NAME3
                  },
                  footer: this.selectedTempnumberData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
              };
              // console.log(list)

              this.selectedDataTempnumberList.push(list);
            } else if (this.listTempnumberarr.length < 5) {
              this.listTempnumberarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Tempnumber Charts 5",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedTempnumberData.SYMBOL_NAME3
                  },
                  footer: this.selectedTempnumberData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
              };
              // console.log(list)

              this.selectedDataTempnumberList.push(list);
            } else if (this.listTempnumberarr.length == 5) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail:
                  "List Maximum 5 Termometer Charts. Please remove another chart and add widget agian."
              });
            }
          } else if (this.selectedDataTempnumberList.length < 5) {
            if (this.selectedDataTempnumberList.length < 1) {
              this.listTempnumberarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Tempnumber Charts 1",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedTempnumberData.SYMBOL_NAME3
                  },
                  footer: this.selectedTempnumberData.SYMBOL_NAME3
                }
              });

              var list = {
                SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
              };

              this.selectedDataTempnumberList.push(list);
            } else if (this.selectedDataTempnumberList.length < 2) {
              var listduplicate = this.selectedDataTempnumberList.filter(
                data => {
                  if (
                    data.SYMBOL_NAME3 ==
                    this.selectedTempnumberData.SYMBOL_NAME3
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              );
              if (listduplicate.length == 0) {
                this.listTempnumberarr.push({
                  cols: 1,
                  rows: 2,
                  widget: {
                    type: "A",
                    header: "Tempnumber Charts 2",
                    content: {
                      image: this.Device_Name,
                      data: this.selectedTempnumberData.SYMBOL_NAME3
                    },
                    footer: this.selectedTempnumberData.SYMBOL_NAME3
                  }
                });

                var list = {
                  SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                  SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                  SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
                };

                this.selectedDataTempnumberList.push(list);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "Can't add IP address and port duplicate.Please try again."
                });
              }
            } else if (this.selectedDataTempnumberList.length < 3) {
              var listduplicate = this.selectedDataTempnumberList.filter(
                data => {
                  if (
                    data.SYMBOL_NAME3 ==
                    this.selectedTempnumberData.SYMBOL_NAME3
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              );
              if (listduplicate.length == 0) {
                this.listTempnumberarr.push({
                  cols: 1,
                  rows: 2,
                  widget: {
                    type: "A",
                    header: "Tempnumber Charts 3",
                    content: {
                      image: this.Device_Name,
                      data: this.selectedTempnumberData.SYMBOL_NAME3
                    },
                    footer: this.selectedTempnumberData.SYMBOL_NAME3
                  }
                });

                var list = {
                  SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                  SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                  SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
                };

                this.selectedDataTempnumberList.push(list);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "Can't add IP address and port duplicate.Please try again."
                });
              }
            } else if (this.selectedDataTempnumberList.length < 4) {
              var listduplicate = this.selectedDataTempnumberList.filter(
                data => {
                  if (
                    data.SYMBOL_NAME3 ==
                    this.selectedTempnumberData.SYMBOL_NAME3
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              );
              if (listduplicate.length == 0) {
                this.listTempnumberarr.push({
                  cols: 1,
                  rows: 2,
                  widget: {
                    type: "A",
                    header: "Tempnumber Charts 4",
                    content: {
                      image: this.Device_Name,
                      data: this.selectedTempnumberData.SYMBOL_NAME3
                    },
                    footer: this.selectedTempnumberData.SYMBOL_NAME3
                  }
                });

                var list = {
                  SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                  SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                  SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
                };

                this.selectedDataTempnumberList.push(list);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "Can't add IP address and port duplicate.Please try again."
                });
              }
            } else if (this.selectedDataTempnumberList.length < 5) {
              var listduplicate = this.selectedDataTempList.filter(data => {
                if (
                  data.SYMBOL_NAME3 == this.selectedTempnumberData.SYMBOL_NAME3
                ) {
                  return true;
                } else {
                  return false;
                }
              });
              if (listduplicate.length == 0) {
                this.listTempnumberarr.push({
                  cols: 1,
                  rows: 2,
                  widget: {
                    type: "A",
                    header: "Tempnumber Charts 5",
                    content: {
                      image: this.Device_Name,
                      data: this.selectedTempnumberData.SYMBOL_NAME3
                    },
                    footer: this.selectedTempnumberData.SYMBOL_NAME3
                  }
                });

                var list = {
                  SYMBOL_ID: this.selectedTempnumberData.SYMBOL_ID,
                  SYMBOL_NAME1: this.selectedTempnumberData.SYMBOL_NAME1,
                  SYMBOL_NAME3: this.selectedTempnumberData.SYMBOL_NAME3
                };

                this.selectedDataTempnumberList.push(list);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "Can't add IP address and port duplicate.Please try again."
                });
              }
            } else if (this.selectedDataTempnumberList.length == 5) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail:
                  "List Maximum 5 Termometer Charts. Please remove another chart and add widget agian."
              });
            }
          } else if (this.selectedDataTempnumberList.length == 5) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail:
                "List Maximum 5 Termometer Charts. Please remove another chart and add widget agian."
            });
          }
        });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select device."
      });
    }
  }
  addItemMemorydonutChart() {
    if (this.selectedMemorydonutData != undefined) {
      this.dashboardService
        .getdeviceInformation(this.selectedMemorydonutData.SYMBOL_NAME3)
        .subscribe(result => {
          this.Device_Name = result.data.deviceName;
          if (this.selectedDataMemorydonutList.length == 0) {
            if (this.listMemorydonutarr.length < 1) {
              this.listMemorydonutarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Memorydonut Charts 1",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedMemorydonutData.SYMBOL_NAME3
                  },
                  footer: this.selectedMemorydonutData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
              };
              // console.log(list)

              this.selectedDataMemorydonutList.push(list);
            } else if (this.listMemorydonutarr.length < 2) {
              this.listMemorydonutarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Memorydonut Charts 2",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedMemorydonutData.SYMBOL_NAME3
                  },
                  footer: this.selectedMemorydonutData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
              };
              // console.log(list)
              this.selectedDataMemorydonutList.push(list);
            } else if (this.listMemorydonutarr.length < 3) {
              this.listMemorydonutarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Memorydonut Charts 3",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedMemorydonutData.SYMBOL_NAME3
                  },
                  footer: this.selectedMemorydonutData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
              };
              // console.log(list)

              this.selectedDataMemorydonutList.push(list);
            } else if (this.listMemorydonutarr.length < 4) {
              this.listMemorydonutarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Memorydonut Charts 4",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedMemorydonutData.SYMBOL_NAME3
                  },
                  footer: this.selectedMemorydonutData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
              };
              // console.log(list)

              this.selectedDataMemorydonutList.push(list);
            } else if (this.listMemorydonutarr.length < 5) {
              this.listMemorydonutarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Memorydonut Charts 5",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedMemorydonutData.SYMBOL_NAME3
                  },
                  footer: this.selectedMemorydonutData.SYMBOL_NAME3
                }
              });
              // console.log(this.selectedMemoryData)
              var list = {
                SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
              };
              // console.log(list)

              this.selectedDataMemorydonutList.push(list);
            } else if (this.listMemorydonutarr.length == 5) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail:
                  "List Maximum 5 Memory Donut Charts. Please remove another chart and add widget agian."
              });
            }
          } else if (this.selectedDataMemorydonutList.length < 5) {
            if (this.selectedDataMemorydonutList.length < 1) {
              this.listMemorydonutarr.push({
                cols: 1,
                rows: 2,
                widget: {
                  type: "A",
                  header: "Memorydonut Charts 1",
                  content: {
                    image: this.Device_Name,
                    data: this.selectedMemorydonutData.SYMBOL_NAME3
                  },
                  footer: this.selectedMemorydonutData.SYMBOL_NAME3
                }
              });

              var list = {
                SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
              };

              this.selectedDataMemorydonutList.push(list);
            } else if (this.selectedDataMemorydonutList.length < 2) {
              var listduplicate = this.selectedDataMemorydonutList.filter(
                data => {
                  if (
                    data.SYMBOL_NAME3 ==
                    this.selectedMemorydonutData.SYMBOL_NAME3
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              );
              if (listduplicate.length == 0) {
                this.listMemorydonutarr.push({
                  cols: 1,
                  rows: 2,
                  widget: {
                    type: "A",
                    header: "Memorydonut Charts 2",
                    content: {
                      image: this.Device_Name,
                      data: this.selectedMemorydonutData.SYMBOL_NAME3
                    },
                    footer: this.selectedMemorydonutData.SYMBOL_NAME3
                  }
                });

                var list = {
                  SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                  SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                  SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
                };

                this.selectedDataMemorydonutList.push(list);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "Can't add IP address and port duplicate.Please try again."
                });
              }
            } else if (this.selectedDataMemorydonutList.length < 3) {
              var listduplicate = this.selectedDataMemorydonutList.filter(
                data => {
                  if (
                    data.SYMBOL_NAME3 ==
                    this.selectedMemorydonutData.SYMBOL_NAME3
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              );
              if (listduplicate.length == 0) {
                this.listMemorydonutarr.push({
                  cols: 1,
                  rows: 2,
                  widget: {
                    type: "A",
                    header: "Memorydonut Charts 3",
                    content: {
                      image: this.Device_Name,
                      data: this.selectedMemorydonutData.SYMBOL_NAME3
                    },
                    footer: this.selectedMemorydonutData.SYMBOL_NAME3
                  }
                });

                var list = {
                  SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                  SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                  SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
                };

                this.selectedDataMemorydonutList.push(list);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "Can't add IP address and port duplicate.Please try again."
                });
              }
            } else if (this.selectedDataMemorydonutList.length < 4) {
              var listduplicate = this.selectedDataMemorydonutList.filter(
                data => {
                  if (
                    data.SYMBOL_NAME3 ==
                    this.selectedMemorydonutData.SYMBOL_NAME3
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              );
              if (listduplicate.length == 0) {
                this.listMemorydonutarr.push({
                  cols: 1,
                  rows: 2,
                  widget: {
                    type: "A",
                    header: "Memorydonut Charts 4",
                    content: {
                      image: this.Device_Name,
                      data: this.selectedMemorydonutData.SYMBOL_NAME3
                    },
                    footer: this.selectedMemorydonutData.SYMBOL_NAME3
                  }
                });

                var list = {
                  SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                  SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                  SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
                };

                this.selectedDataMemorydonutList.push(list);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "Can't add IP address and port duplicate.Please try again."
                });
              }
            } else if (this.selectedDataMemorydonutList.length < 5) {
              var listduplicate = this.selectedDataTempList.filter(data => {
                if (
                  data.SYMBOL_NAME3 == this.selectedMemorydonutData.SYMBOL_NAME3
                ) {
                  return true;
                } else {
                  return false;
                }
              });
              if (listduplicate.length == 0) {
                this.listMemorydonutarr.push({
                  cols: 1,
                  rows: 2,
                  widget: {
                    type: "A",
                    header: "Memorydonut Charts 5",
                    content: {
                      image: this.Device_Name,
                      data: this.selectedMemorydonutData.SYMBOL_NAME3
                    },
                    footer: this.selectedMemorydonutData.SYMBOL_NAME3
                  }
                });

                var list = {
                  SYMBOL_ID: this.selectedMemorydonutData.SYMBOL_ID,
                  SYMBOL_NAME1: this.selectedMemorydonutData.SYMBOL_NAME1,
                  SYMBOL_NAME3: this.selectedMemorydonutData.SYMBOL_NAME3
                };

                this.selectedDataMemorydonutList.push(list);
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "Can't add IP address and port duplicate.Please try again."
                });
              }
            } else if (this.selectedDataMemorydonutList.length == 5) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail:
                  "List Maximum 5 Memory Donut Charts. Please remove another chart and add widget agian."
              });
            }
          } else if (this.selectedDataMemorydonutList.length == 5) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail:
                "List Maximum 5 Memory Donut Charts. Please remove another chart and add widget agian."
            });
          }
        });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select device."
      });
    }
  }
  addItemLoadminChart() {
    if (this.selectLoadmin != undefined) {
      this.dashboardService
        .getdeviceInformation(this.selectedCPUloadData.SYMBOL_NAME3)
        .subscribe(result => {
          this.Device_Name = result.data.deviceName;
          if (this.selectLoadmin.value == 1) {
            if (this.selectedCPUloadData != undefined) {
              if (this.selectedDataCPUloadList.length == 0) {
                if (this.listCPUload1minarr.length < 1) {
                  this.listCPUload1minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPUload1min Charts 1",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "1 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "1 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList1min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload1minarr.length < 2) {
                  this.listCPUload1minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPUload1min Charts 2",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "1 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "1 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList1min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload1minarr.length < 3) {
                  this.listCPUload1minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPUload1min Charts 3",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "1 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "1 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList1min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload1minarr.length < 4) {
                  this.listCPUload1minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPUload1min Charts 4",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "1 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "1 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList1min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload1minarr.length < 5) {
                  this.listCPUload1minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPUload1min Charts 5",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "1 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "1 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList1min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload1minarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 1 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList1min.length < 5) {
                if (this.selectedDataCPUloadList1min.length < 1) {
                  this.listCPUload1minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "A",
                      header: "CPUload1min Charts 1",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "1 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "1 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList1min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.selectedDataCPUloadList1min.length < 2) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload1minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "CPUload1min Charts 2",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "1 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });
                    // console.log(this.selectedMemoryData)
                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "1 min"
                    };
                    // console.log(list)
                    this.selectedDataCPUloadList1min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList1min.length < 3) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload1minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "CPUload1min Charts 3",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "1 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });
                    // console.log(this.selectedMemoryData)
                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "1 min"
                    };
                    // console.log(list)
                    this.selectedDataCPUloadList1min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList1min.length < 4) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload1minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "CPUload1min Charts 4",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "1 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });
                    // console.log(this.selectedMemoryData)
                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "1 min"
                    };
                    // console.log(list)
                    this.selectedDataCPUloadList1min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList1min.length < 5) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload1minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "A",
                        header: "CPUload1min Charts 5",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "1 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });
                    // console.log(this.selectedMemoryData)
                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "1 min"
                    };
                    // console.log(list)
                    this.selectedDataCPUloadList1min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList1min.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 1 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList1min.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 CPU load Charts 1 Minutes. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          } else if (this.selectLoadmin.value == 2) {
            if (this.selectedCPUloadData != undefined) {
              if (this.selectedDataCPUloadList.length == 0) {
                if (this.listCPUload2minarr.length < 1) {
                  this.listCPUload2minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPUload2min Charts 1",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "2 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "2 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList2min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload2minarr.length < 2) {
                  this.listCPUload2minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPUload2min Charts 2",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "2 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "2 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList2min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload2minarr.length < 3) {
                  this.listCPUload2minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPUload2min Charts 3",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "2 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "2 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList2min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload2minarr.length < 4) {
                  this.listCPUload2minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPUload2min Charts 4",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "2 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "2 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList2min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload2minarr.length < 5) {
                  this.listCPUload2minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPUload2min Charts 5",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "2 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "2 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList2min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload2minarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 2 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList2min.length < 5) {
                if (this.selectedDataCPUloadList2min.length < 1) {
                  this.listCPUload2minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "B",
                      header: "CPUload2min Charts 1",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "2 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });
                  // console.log(this.selectedMemoryData)
                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "2 min"
                  };
                  // console.log(list)
                  this.selectedDataCPUloadList2min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.selectedDataCPUloadList2min.length < 2) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    var listduplicate = this.selectedDataCPUloadList.filter(
                      data => {
                        if (
                          data.SYMBOL_NAME3 ==
                            this.selectedCPUloadData.SYMBOL_NAME3 &&
                          data.load == this.selectLoadmin.name
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                    if (listduplicate.length == 0) {
                      this.listCPUload2minarr.push({
                        cols: 1,
                        rows: 2,
                        widget: {
                          type: "B",
                          header: "CPUload2min Charts 2",
                          content: {
                            image: this.Device_Name,
                            data:
                              this.selectedCPUloadData.SYMBOL_NAME3 +
                              " " +
                              "2 min"
                          },
                          footer: this.selectedCPUloadData.SYMBOL_NAME3
                        }
                      });
                      // console.log(this.selectedMemoryData)
                      var list = {
                        SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                        SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                        SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                        load: "2 min"
                      };
                      // console.log(list)
                      this.selectedDataCPUloadList2min.push(list);
                      this.selectedDataCPUloadList.push(list);
                    }
                  }
                } else if (this.selectedDataCPUloadList2min.length < 3) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload2minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "CPUload2min Charts 3",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "2 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });
                    // console.log(this.selectedMemoryData)
                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "2 min"
                    };
                    // console.log(list)
                    this.selectedDataCPUloadList2min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList2min.length < 4) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload2minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "CPUload2min Charts 4",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "2 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });
                    // console.log(this.selectedMemoryData)
                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "2 min"
                    };
                    // console.log(list)
                    this.selectedDataCPUloadList2min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList2min.length < 5) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload2minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "B",
                        header: "CPUload2min Charts 5",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "2 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });
                    // console.log(this.selectedMemoryData)
                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "2 min"
                    };
                    // console.log(list)
                    this.selectedDataCPUloadList2min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList2min.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 2 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList2min.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 CPU load Charts 2 Minutes. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          } else if (this.selectLoadmin.value == 3) {
            if (this.selectedCPUloadData != undefined) {
              if (this.selectedDataCPUloadList.length == 0) {
                if (this.listCPUload3minarr.length < 1) {
                  this.listCPUload3minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "C",
                      header: "CPUload3min Charts 1",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "3 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "3 min"
                  };

                  this.selectedDataCPUloadList3min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload3minarr.length < 2) {
                  this.listCPUload3minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "C",
                      header: "CPUload3min Charts 2",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "3 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "3 min"
                  };

                  this.selectedDataCPUloadList3min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload3minarr.length < 3) {
                  this.listCPUload3minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "C",
                      header: "CPUload3min Charts 3",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "3 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "3 min"
                  };

                  this.selectedDataCPUloadList3min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload3minarr.length < 4) {
                  this.listCPUload3minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "C",
                      header: "CPUload3min Charts 4",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "3 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "3 min"
                  };

                  this.selectedDataCPUloadList3min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload3minarr.length < 5) {
                  this.listCPUload3minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "C",
                      header: "CPUload3min Charts 5",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "3 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "3 min"
                  };

                  this.selectedDataCPUloadList3min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload3minarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 3 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList3min.length < 5) {
                if (this.selectedDataCPUloadList3min.length < 1) {
                  this.listCPUload3minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "C",
                      header: "CPUload3min Charts 1",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "3 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "3 min"
                  };

                  this.selectedDataCPUloadList3min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.selectedDataCPUloadList3min.length < 2) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    var listduplicate = this.selectedDataCPUloadList.filter(
                      data => {
                        if (
                          data.SYMBOL_NAME3 ==
                            this.selectedCPUloadData.SYMBOL_NAME3 &&
                          data.load == this.selectLoadmin.name
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                    if (listduplicate.length == 0) {
                      this.listCPUload3minarr.push({
                        cols: 1,
                        rows: 2,
                        widget: {
                          type: "C",
                          header: "CPUload3min Charts 2",
                          content: {
                            image: this.Device_Name,
                            data:
                              this.selectedCPUloadData.SYMBOL_NAME3 +
                              " " +
                              "3 min"
                          },
                          footer: this.selectedCPUloadData.SYMBOL_NAME3
                        }
                      });

                      var list = {
                        SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                        SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                        SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                        load: "3 min"
                      };

                      this.selectedDataCPUloadList3min.push(list);
                      this.selectedDataCPUloadList.push(list);
                    }
                  }
                } else if (this.selectedDataCPUloadList3min.length < 3) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload3minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "C",
                        header: "CPUload3min Charts 3",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "3 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "3 min"
                    };

                    this.selectedDataCPUloadList3min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList3min.length < 4) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload3minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "C",
                        header: "CPUload3min Charts 4",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "3 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "3 min"
                    };

                    this.selectedDataCPUloadList3min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList3min.length < 5) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload3minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "C",
                        header: "CPUload3min Charts 5",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "3 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "3 min"
                    };

                    this.selectedDataCPUloadList3min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList3min.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 3 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList3min.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 CPU load Charts 3 Minutes. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          } else if (this.selectLoadmin.value == 4) {
            if (this.selectedCPUloadData != undefined) {
              if (this.selectedDataCPUloadList.length == 0) {
                if (this.listCPUload4minarr.length < 1) {
                  this.listCPUload4minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "D",
                      header: "CPUload4min Charts 1",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "4 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "4 min"
                  };

                  this.selectedDataCPUloadList4min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload4minarr.length < 2) {
                  this.listCPUload4minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "D",
                      header: "CPUload4min Charts 2",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "4 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "4 min"
                  };

                  this.selectedDataCPUloadList4min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload4minarr.length < 3) {
                  this.listCPUload4minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "D",
                      header: "CPUload4min Charts 3",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "4 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "4 min"
                  };

                  this.selectedDataCPUloadList4min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload4minarr.length < 4) {
                  this.listCPUload4minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "D",
                      header: "CPUload4min Charts 4",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "4 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "4 min"
                  };

                  this.selectedDataCPUloadList4min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload4minarr.length < 5) {
                  this.listCPUload4minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "D",
                      header: "CPUload4min Charts 5",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "4 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "4 min"
                  };

                  this.selectedDataCPUloadList4min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload4minarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 4 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList4min.length < 5) {
                if (this.selectedDataCPUloadList4min.length < 1) {
                  this.listCPUload4minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "D",
                      header: "CPUload4min Charts 1",
                      content: {
                        image: this.Device_Name,
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "4 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "4 min"
                  };

                  this.selectedDataCPUloadList4min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.selectedDataCPUloadList4min.length < 2) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    var listduplicate = this.selectedDataCPUloadList.filter(
                      data => {
                        if (
                          data.SYMBOL_NAME3 ==
                            this.selectedCPUloadData.SYMBOL_NAME3 &&
                          data.load == this.selectLoadmin.name
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                    if (listduplicate.length == 0) {
                      this.listCPUload4minarr.push({
                        cols: 1,
                        rows: 2,
                        widget: {
                          type: "D",
                          header: "CPUload4min Charts 2",
                          content: {
                            image: this.Device_Name,
                            data:
                              this.selectedCPUloadData.SYMBOL_NAME3 +
                              " " +
                              "4 min"
                          },
                          footer: this.selectedCPUloadData.SYMBOL_NAME3
                        }
                      });

                      var list = {
                        SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                        SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                        SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                        load: "4 min"
                      };

                      this.selectedDataCPUloadList4min.push(list);
                      this.selectedDataCPUloadList.push(list);
                    }
                  }
                } else if (this.selectedDataCPUloadList4min.length < 3) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload4minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "D",
                        header: "CPUload4min Charts 3",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "4 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "4 min"
                    };

                    this.selectedDataCPUloadList4min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList4min.length < 4) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload4minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "D",
                        header: "CPUload4min Charts 4",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "4 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "4 min"
                    };

                    this.selectedDataCPUloadList4min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList4min.length < 5) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload4minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "D",
                        header: "CPUload4min Charts 5",
                        content: {
                          image: this.Device_Name,
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "4 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "4 min"
                    };

                    this.selectedDataCPUloadList4min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList4min.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 4 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList4min.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 CPU load Charts 4 Minutes. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          } else if (this.selectLoadmin.value == 5) {
            if (this.selectedCPUloadData != undefined) {
              if (this.selectedDataCPUloadList.length == 0) {
                if (this.listCPUload5minarr.length < 1) {
                  this.listCPUload5minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "E",
                      header: "CPUload5min Charts 1",
                      content: {
                        image: "./assets/img/all_devices.jpg",
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "5 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "5 min"
                  };

                  this.selectedDataCPUloadList5min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload5minarr.length < 2) {
                  this.listCPUload5minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "E",
                      header: "CPUload5min Charts 2",
                      content: {
                        image: "./assets/img/all_devices.jpg",
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "5 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "5 min"
                  };

                  this.selectedDataCPUloadList5min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload5minarr.length < 3) {
                  this.listCPUload5minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "E",
                      header: "CPUload5min Charts 3",
                      content: {
                        image: "./assets/img/all_devices.jpg",
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "5 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "5 min"
                  };

                  this.selectedDataCPUloadList5min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload5minarr.length < 4) {
                  this.listCPUload5minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "E",
                      header: "CPUload5min Charts 4",
                      content: {
                        image: "./assets/img/all_devices.jpg",
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "5 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "5 min"
                  };

                  this.selectedDataCPUloadList5min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload5minarr.length < 5) {
                  this.listCPUload5minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "E",
                      header: "CPUload5min Charts 5",
                      content: {
                        image: "./assets/img/all_devices.jpg",
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "5 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "5 min"
                  };

                  this.selectedDataCPUloadList5min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.listCPUload5minarr.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 5 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList5min.length < 5) {
                if (this.selectedDataCPUloadList5min.length < 1) {
                  this.listCPUload5minarr.push({
                    cols: 1,
                    rows: 2,
                    widget: {
                      type: "E",
                      header: "CPUload5min Charts 1",
                      content: {
                        image: "./assets/img/all_devices.jpg",
                        data:
                          this.selectedCPUloadData.SYMBOL_NAME3 + " " + "5 min"
                      },
                      footer: this.selectedCPUloadData.SYMBOL_NAME3
                    }
                  });

                  var list = {
                    SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                    SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                    SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                    load: "5 min"
                  };

                  this.selectedDataCPUloadList5min.push(list);
                  this.selectedDataCPUloadList.push(list);
                } else if (this.selectedDataCPUloadList5min.length < 2) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    var listduplicate = this.selectedDataCPUloadList.filter(
                      data => {
                        if (
                          data.SYMBOL_NAME3 ==
                            this.selectedCPUloadData.SYMBOL_NAME3 &&
                          data.load == this.selectLoadmin.name
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                    if (listduplicate.length == 0) {
                      this.listCPUload5minarr.push({
                        cols: 1,
                        rows: 2,
                        widget: {
                          type: "E",
                          header: "CPUload5min Charts 2",
                          content: {
                            image: "./assets/img/all_devices.jpg",
                            data:
                              this.selectedCPUloadData.SYMBOL_NAME3 +
                              " " +
                              "5 min"
                          },
                          footer: this.selectedCPUloadData.SYMBOL_NAME3
                        }
                      });

                      var list = {
                        SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                        SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                        SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                        load: "5 min"
                      };

                      this.selectedDataCPUloadList5min.push(list);
                      this.selectedDataCPUloadList.push(list);
                    }
                  }
                } else if (this.selectedDataCPUloadList5min.length < 3) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload5minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "E",
                        header: "CPUload5min Charts 3",
                        content: {
                          image: "./assets/img/all_devices.jpg",
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "5 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "5 min"
                    };

                    this.selectedDataCPUloadList5min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList5min.length < 4) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload5minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "E",
                        header: "CPUload5min Charts 4",
                        content: {
                          image: "./assets/img/all_devices.jpg",
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "5 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "5 min"
                    };

                    this.selectedDataCPUloadList5min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList5min.length < 5) {
                  var listduplicate = this.selectedDataCPUloadList.filter(
                    data => {
                      if (
                        data.SYMBOL_NAME3 ==
                          this.selectedCPUloadData.SYMBOL_NAME3 &&
                        data.load == this.selectLoadmin.name
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  if (listduplicate.length == 0) {
                    this.listCPUload5minarr.push({
                      cols: 1,
                      rows: 2,
                      widget: {
                        type: "E",
                        header: "CPUload5min Charts 5",
                        content: {
                          image: "./assets/img/all_devices.jpg",
                          data:
                            this.selectedCPUloadData.SYMBOL_NAME3 +
                            " " +
                            "5 min"
                        },
                        footer: this.selectedCPUloadData.SYMBOL_NAME3
                      }
                    });

                    var list = {
                      SYMBOL_ID: this.selectedCPUloadData.SYMBOL_ID,
                      SYMBOL_NAME1: this.selectedCPUloadData.SYMBOL_NAME1,
                      SYMBOL_NAME3: this.selectedCPUloadData.SYMBOL_NAME3,
                      load: "5 min"
                    };

                    this.selectedDataCPUloadList5min.push(list);
                    this.selectedDataCPUloadList.push(list);
                  }
                } else if (this.selectedDataCPUloadList5min.length == 5) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail:
                      "List Maximum 5 CPU load Charts 5 Minutes. Please remove another chart and add widget agian."
                  });
                }
              } else if (this.selectedDataCPUloadList5min.length == 5) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail:
                    "List Maximum 5 CPU load Charts 5 Minutes. Please remove another chart and add widget agian."
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select device."
              });
            }
          }
        });
    } else {
      this.invinvalidloadmin = "ng-invalid ng-dirty";
    }
  }
  onRowUnselect(event) {
    // console.log(this.selectedData.length)
    if (this.selectedData.length < 2) {
      // console.log(event)
      this.alarmService
        .getSysInterface(this.selectedData[0].SYMBOL_NAME3)
        .subscribe({
          next: result => {
            // console.log(result.data)
            result.data.forEach(list => {
              if (list.length != 0) {
                this.disablelist = false;
              } else {
                this.disablelist = true;
              }
              var array_data = {
                port: list.ifName,
                ifIndex: list.ifIndex
              };

              this.array_data.push(array_data);
            });
            var ifIndex = result.data.map(function(singleElement) {
              return parseInt(singleElement.ifIndex);
            });
            this.listifIndex.push(...ifIndex);
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
      this.disablelist = true;
    }
  }
  onChangePort(event) {
    this.invinvalidPort = "";
    // console.log(event)
  }
  addItemChartDone() {
    this.showBandwidthDialog = false;
    this.showMemoryDialog = false;
    this.showCPUDialog = false;
    this.showTempDialog = false;
    this.showCPUloadDialog = false;
    this.showTempnumberDialog = false;
    this.showMemorydonutDialog = false;
  }
  selectCard(index: number) {
    this.cards = this.cards.map((card, i) => {
      if (
        card.altText == "Bandwidth Charts" ||
        card.altText == "Memory Charts" ||
        card.altText == "CPU Charts" ||
        card.altText == "Termometer Charts" ||
        card.altText == "CPUload Charts" ||
        card.altText == "Temperature" ||
        card.altText == "All memory"
      ) {
        return {
          ...card,
          selected: i === index ? !card.selected : card.selected,
          indexlist: i,
          show: i === index ? card.show : card.show
        };
      } else {
        // this.showBandwidthDialog = false;
        return {
          ...card,
          selected: i === index ? !card.selected : card.selected,
          indexlist: i,
          show: i === index ? !card.show : card.show
        };
      }
    });
    // console.log(this.cards)
    if (
      this.cards[index].altText == "Bandwidth Charts" &&
      this.cards[index].selected == true
    ) {
      // this.selectedDataList = [];
      this.showBandwidthDialog = true;
      this.symbolData = [];
      this.selectedData = undefined;
      this.ipSearch = undefined;
      this.nameSearch = undefined;
      this.selectedPortChart = undefined;
      this.selectedData = undefined;
      this.array_data = [];
      this.selectsizewidget = undefined;
      this.invinvalidSize = "";
      if (this.selectedDataList.length == 0) {
        this.dashboard.forEach(data => {
          // console.log(data)
          if (
            data.widget.header == "Bandwidth Charts 1" ||
            data.widget.header == "Bandwidth Charts 2" ||
            data.widget.header == "Bandwidth Charts 3" ||
            data.widget.header == "Bandwidth Charts 4" ||
            data.widget.header == "Bandwidth Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  this.alarmService
                    .getSysInterface(datas.SYMBOL_NAME3)
                    .subscribe({
                      next: result => {
                        result.data.forEach(list => {
                          // console.log(datas.SYMBOL_NAME3)
                          // console.log(list.ifName)
                          // if (this.selectedDataList)
                          if (list.ifIndex == data.widget.content.data) {
                            var listdata = {
                              SYMBOL_ID: datas.SYMBOL_ID,
                              SYMBOL_NAME1: datas.SYMBOL_NAME1,
                              SYMBOL_NAME3: datas.SYMBOL_NAME3,
                              port: list.ifName,
                              size: "3X1"
                            };
                            // this.selectedDataList = [];
                            this.selectedDataList.push(listdata);
                            this.selectedDataListfull.push(listdata);
                          }
                        });
                        // console.log(this.selectedDataList)
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
                });

                // console.log(result)
              });
          } else if (
            data.widget.header == "Bandwidth Chartsmini 1" ||
            data.widget.header == "Bandwidth Chartsmini 2" ||
            data.widget.header == "Bandwidth Chartsmini 3" ||
            data.widget.header == "Bandwidth Chartsmini 4" ||
            data.widget.header == "Bandwidth Chartsmini 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  this.alarmService
                    .getSysInterface(datas.SYMBOL_NAME3)
                    .subscribe({
                      next: result => {
                        result.data.forEach(list => {
                          // console.log(datas.SYMBOL_NAME3)
                          // console.log(list.ifName)
                          // if (this.selectedDataList)
                          if (list.ifIndex == data.widget.content.data) {
                            var listdata = {
                              SYMBOL_ID: datas.SYMBOL_ID,
                              SYMBOL_NAME1: datas.SYMBOL_NAME1,
                              SYMBOL_NAME3: datas.SYMBOL_NAME3,
                              port: list.ifName,
                              size: "1X1"
                            };
                            // this.selectedDataList = [];
                            this.selectedDataList.push(listdata);
                            this.selectedDataListmini.push(listdata);
                          }
                        });
                        // console.log(this.selectedDataList)
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
                });

                // console.log(result)
              });
          }
        });
      }

      // console.log(this.dashboard)
      // console.log(this.selectedDataList)
    } else {
      this.showBandwidthDialog = false;
      // this.showMemoryDialog = false;
    }

    if (
      this.cards[index].altText == "Memory Charts" &&
      this.cards[index].selected == true
    ) {
      // this.selectedDataList = [];
      this.selectedMemoryData = undefined;
      this.showMemoryDialog = true;
      this.symbolData = [];
      this.selectedData = undefined;
      this.ipSearch = undefined;
      this.nameSearch = undefined;
      this.selectedPortChart = undefined;
      this.array_data = [];
      this.selectsizewidget = undefined;
      this.invinvalidSize = "";
      if (this.selectedDataMemoryList.length == 0) {
        this.dashboard.forEach(data => {
          if (
            data.widget.header == "Memory Charts 1" ||
            data.widget.header == "Memory Charts 2" ||
            data.widget.header == "Memory Charts 3" ||
            data.widget.header == "Memory Charts 4" ||
            data.widget.header == "Memory Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // this.selectedDataList = [];

                  this.selectedDataMemoryList.push(listdata);
                  this.selectedDataMemoryListfull.push(listdata);
                });

                // console.log(result)
              });
          } else if (
            data.widget.header == "Memory Chartsmini 1" ||
            data.widget.header == "Memory Chartsmini 2" ||
            data.widget.header == "Memory Chartsmini 3" ||
            data.widget.header == "Memory Chartsmini 4" ||
            data.widget.header == "Memory Chartsmini 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // this.selectedDataList = [];

                  this.selectedDataMemoryList.push(listdata);
                  this.selectedDataMemoryListmini.push(listdata);
                });

                // console.log(result)
              });
          }
        });
      }

      // console.log(this.dashboard)
      // console.log(this.selectedDataList)
    } else {
      // this.showBandwidthDialog = false;
      this.showMemoryDialog = false;
    }

    if (
      this.cards[index].altText == "CPU Charts" &&
      this.cards[index].selected == true
    ) {
      // this.selectedDataList = [];
      this.selectedCPUData = undefined;
      this.showCPUDialog = true;
      this.symbolData = [];
      this.selectedData = undefined;
      this.ipSearch = undefined;
      this.nameSearch = undefined;
      this.selectedPortChart = undefined;
      this.array_data = [];
      this.selectsizewidget = undefined;
      this.invinvalidSize = "";
      if (this.selectedDataCPUList.length == 0) {
        this.dashboard.forEach(data => {
          if (
            data.widget.header == "CPU Charts 1" ||
            data.widget.header == "CPU Charts 2" ||
            data.widget.header == "CPU Charts 3" ||
            data.widget.header == "CPU Charts 4" ||
            data.widget.header == "CPU Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // this.selectedDataList = [];

                  this.selectedDataCPUList.push(listdata);
                  this.selectedDataCPUListfull.push(listdata);
                });

                // console.log(result)
              });
          } else if (
            data.widget.header == "CPU Chartsmini 1" ||
            data.widget.header == "CPU Chartsmini 2" ||
            data.widget.header == "CPU Chartsmini 3" ||
            data.widget.header == "CPU Chartsmini 4" ||
            data.widget.header == "CPU Chartsmini 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // this.selectedDataList = [];

                  this.selectedDataCPUList.push(listdata);
                  this.selectedDataCPUListmini.push(listdata);
                });

                // console.log(result)
              });
          }
        });
      }

      // console.log(this.dashboard)
      // console.log(this.selectedDataList)
    } else {
      this.showCPUDialog = false;
    }

    if (
      this.cards[index].altText == "Temperature Charts" &&
      this.cards[index].selected == true
    ) {
      // this.selectedDataList = [];
      this.selectedTempData = undefined;
      this.showTempDialog = true;
      this.symbolData = [];
      this.selectedData = undefined;
      this.ipSearch = undefined;
      this.nameSearch = undefined;
      this.selectedPortChart = undefined;
      this.array_data = [];
      this.selectsizewidget = undefined;
      this.invinvalidSize = "";
      if (this.selectedDataTempList.length == 0) {
        this.dashboard.forEach(data => {
          if (
            data.widget.header == "Temperature Charts 1" ||
            data.widget.header == "Temperature Charts 2" ||
            data.widget.header == "Temperature Charts 3" ||
            data.widget.header == "Temperature Charts 4" ||
            data.widget.header == "Temperature Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    size: "3X1"
                  };
                  // this.selectedDataList = [];

                  this.selectedDataTempList.push(listdata);
                  this.selectedDataTempListfull.push(listdata);
                });

                // console.log(result)
              });
          } else if (
            data.widget.header == "Temperature Chartsmini 1" ||
            data.widget.header == "Temperature Chartsmini 2" ||
            data.widget.header == "Temperature Chartsmini 3" ||
            data.widget.header == "Temperature Chartsmini 4" ||
            data.widget.header == "Temperature Chartsmini 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    size: "1X1"
                  };
                  // this.selectedDataList = [];

                  this.selectedDataTempList.push(listdata);
                  this.selectedDataTempListmini.push(listdata);
                });

                // console.log(result)
              });
          }
        });
      }

      // console.log(this.dashboard)
      // console.log(this.selectedDataList)
    } else {
      this.showTempDialog = false;
    }

    if (
      this.cards[index].altText == "CPUload Charts" &&
      this.cards[index].selected == true
    ) {
      // this.selectedDataList = [];
      this.selectedCPUloadData = undefined;
      this.showCPUloadDialog = true;
      this.symbolData = [];
      this.selectedData = undefined;
      this.ipSearch = undefined;
      this.nameSearch = undefined;
      this.selectedPortChart = undefined;
      this.array_data = [];
      this.selectLoadmin = undefined;
      this.invinvalidloadmin = "";
      if (this.selectedDataCPUloadList.length == 0) {
        this.dashboard.forEach(data => {
          if (
            data.widget.header == "CPUload1min Charts 1" ||
            data.widget.header == "CPUload1min Charts 2" ||
            data.widget.header == "CPUload1min Charts 3" ||
            data.widget.header == "CPUload1min Charts 4" ||
            data.widget.header == "CPUload1min Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    load: "1 min"
                  };

                  this.selectedDataCPUloadList.push(listdata);
                  this.selectedDataCPUloadList1min.push(listdata);
                });
              });
          } else if (
            data.widget.header == "CPUload2min Charts 1" ||
            data.widget.header == "CPUload2min Charts 2" ||
            data.widget.header == "CPUload2min Charts 3" ||
            data.widget.header == "CPUload2min Charts 4" ||
            data.widget.header == "CPUload2min Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    load: "2 min"
                  };

                  this.selectedDataCPUloadList.push(listdata);
                  this.selectedDataCPUloadList2min.push(listdata);
                });
              });
          } else if (
            data.widget.header == "CPUload3min Charts 1" ||
            data.widget.header == "CPUload3min Charts 2" ||
            data.widget.header == "CPUload3min Charts 3" ||
            data.widget.header == "CPUload3min Charts 4" ||
            data.widget.header == "CPUload3min Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    load: "3 min"
                  };

                  this.selectedDataCPUloadList.push(listdata);
                  this.selectedDataCPUloadList3min.push(listdata);
                });
              });
          } else if (
            data.widget.header == "CPUload4min Charts 1" ||
            data.widget.header == "CPUload4min Charts 2" ||
            data.widget.header == "CPUload4min Charts 3" ||
            data.widget.header == "CPUload4min Charts 4" ||
            data.widget.header == "CPUload4min Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    load: "4 min"
                  };

                  this.selectedDataCPUloadList.push(listdata);
                  this.selectedDataCPUloadList4min.push(listdata);
                });
              });
          } else if (
            data.widget.header == "CPUload5min Charts 1" ||
            data.widget.header == "CPUload5min Charts 2" ||
            data.widget.header == "CPUload5min Charts 3" ||
            data.widget.header == "CPUload5min Charts 4" ||
            data.widget.header == "CPUload5min Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3,
                    load: "5 min"
                  };

                  this.selectedDataCPUloadList.push(listdata);
                  this.selectedDataCPUloadList5min.push(listdata);
                });
              });
          }
        });
      }
    } else {
      this.showCPUloadDialog = false;
    }
    if (
      this.cards[index].altText == "Temperature" &&
      this.cards[index].selected == true
    ) {
      // this.selectedDataList = [];
      this.selectedTempnumberData = undefined;
      this.showTempnumberDialog = true;
      this.symbolData = [];
      this.selectedData = undefined;
      this.ipSearch = undefined;
      this.nameSearch = undefined;
      this.selectedPortChart = undefined;
      this.array_data = [];

      if (this.selectedDataTempnumberList.length == 0) {
        this.dashboard.forEach(data => {
          if (
            data.widget.header == "Tempnumber Charts 1" ||
            data.widget.header == "Tempnumber Charts 2" ||
            data.widget.header == "Tempnumber Charts 3" ||
            data.widget.header == "Tempnumber Charts 4" ||
            data.widget.header == "Tempnumber Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3
                  };

                  this.selectedDataTempnumberList.push(listdata);
                });
              });
          }
        });
      }
    } else {
      this.showTempnumberDialog = false;
    }

    if (
      this.cards[index].altText == "All memory" &&
      this.cards[index].selected == true
    ) {
      // this.selectedDataList = [];
      this.selectedMemorydonutData = undefined;
      this.showMemorydonutDialog = true;
      this.symbolData = [];
      this.selectedData = undefined;
      this.ipSearch = undefined;
      this.nameSearch = undefined;
      this.selectedPortChart = undefined;
      this.array_data = [];

      if (this.selectedDataMemorydonutList.length == 0) {
        this.dashboard.forEach(data => {
          if (
            data.widget.header == "Memorydonut Charts 1" ||
            data.widget.header == "Memorydonut Charts 2" ||
            data.widget.header == "Memorydonut Charts 3" ||
            data.widget.header == "Memorydonut Charts 4" ||
            data.widget.header == "Memorydonut Charts 5"
          ) {
            this.alarmService
              .searchSymbolByIP(data.widget.footer)
              .subscribe(result => {
                // console.log(this.listBanwidtharr)
                result.forEach(datas => {
                  // console.log(datas)
                  var listdata = {
                    SYMBOL_ID: datas.SYMBOL_ID,
                    SYMBOL_NAME1: datas.SYMBOL_NAME1,
                    SYMBOL_NAME3: datas.SYMBOL_NAME3
                  };

                  this.selectedDataMemorydonutList.push(listdata);
                });
              });
          }
        });
      }
    } else {
      this.showMemorydonutDialog = false;
    }
  }
  closedialog() {
    this.showBandwidthDialog = false;
    this.showMemoryDialog = false;
    this.showCPUDialog = false;
    this.showTempDialog = false;
    this.showVoltDialog = false;
    this.showCPUloadDialog = false;
    this.showTempnumberDialog = false;
    this.showMemorydonutDialog = false;
  }
  changedOptions() {
    if (this.gridOptions.api && this.gridOptions.api.optionsChanged) {
      this.gridOptions.api.optionsChanged();
      console.log("HI");
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item): void {
    $event.preventDefault();
    $event.stopPropagation();
    // console.log(item.widget.header)
    if (
      item.widget.header == "Bandwidth Charts 1" ||
      item.widget.header == "Bandwidth Charts 2" ||
      item.widget.header == "Bandwidth Charts 3" ||
      item.widget.header == "Bandwidth Charts 4" ||
      item.widget.header == "Bandwidth Charts 5"
    ) {
      this.listBanwidtharr = this.listBanwidtharr.filter(
        data => data.widget.type != item.widget.type
      );
      this.listBanwidtharr2 = this.listBanwidtharr2.filter(
        data => data.widget.type != item.widget.type
      );
      this.selectedDataList = this.selectedDataList.filter(
        data =>
          data.SYMBOL_NAME3 + " " + data.size + " " + data.ifIndex !=
          item.widget.type
      );
      this.selectedDataListfull = this.selectedDataListfull.filter(
        data =>
          data.SYMBOL_NAME3 + " " + data.size + " " + data.ifIndex !=
          item.widget.type
      );
    } else if (
      item.widget.header == "Bandwidth Chartsmini 1" ||
      item.widget.header == "Bandwidth Chartsmini 2" ||
      item.widget.header == "Bandwidth Chartsmini 3" ||
      item.widget.header == "Bandwidth Chartsmini 4" ||
      item.widget.header == "Bandwidth Chartsmini 5"
    ) {
      this.listBanwidthminiarr = this.listBanwidthminiarr.filter(
        data => data.widget.type != item.widget.type
      );
      this.listBanwidthminiarr2 = this.listBanwidthminiarr2.filter(
        data => data.widget.type != item.widget.type
      );
      this.selectedDataList = this.selectedDataList.filter(
        data =>
          data.SYMBOL_NAME3 + " " + data.size + " " + data.ifIndex !=
          item.widget.type
      );
      this.selectedDataListmini = this.selectedDataListmini.filter(
        data =>
          data.SYMBOL_NAME3 + " " + data.size + " " + data.ifIndex !=
          item.widget.type
      );
    } else if (
      item.widget.header == "Memory Charts 1" ||
      item.widget.header == "Memory Charts 2" ||
      item.widget.header == "Memory Charts 3" ||
      item.widget.header == "Memory Charts 4" ||
      item.widget.header == "Memory Charts 5"
    ) {
      // console.log("hi")
      // console.log(this.selectedDataMemoryList)
      // console.log(item)
      this.listMemoryarr = this.listMemoryarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "A"
      );
      this.selectedDataMemoryList = this.selectedDataMemoryList.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
      this.selectedDataMemoryListfull = this.selectedDataMemoryListfull.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
      // console.log(this.selectedDataMemoryList)
    } else if (
      item.widget.header == "Memory Chartsmini 1" ||
      item.widget.header == "Memory Chartsmini 2" ||
      item.widget.header == "Memory Chartsmini 3" ||
      item.widget.header == "Memory Chartsmini 4" ||
      item.widget.header == "Memory Chartsmini 5"
    ) {
      this.listMemoryminiarr = this.listMemoryminiarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "B"
      );
      this.selectedDataMemoryList = this.selectedDataMemoryList.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
      this.selectedDataMemoryListmini = this.selectedDataMemoryListmini.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
    } else if (
      item.widget.header == "CPU Charts 1" ||
      item.widget.header == "CPU Charts 2" ||
      item.widget.header == "CPU Charts 3" ||
      item.widget.header == "CPU Charts 4" ||
      item.widget.header == "CPU Charts 5"
    ) {
      this.listCPUarr = this.listCPUarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "A"
      );
      this.selectedDataCPUList = this.selectedDataCPUList.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
      this.selectedDataCPUListfull = this.selectedDataCPUListfull.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
    } else if (
      item.widget.header == "CPU Chartsmini 1" ||
      item.widget.header == "CPU Chartsmini 2" ||
      item.widget.header == "CPU Chartsmini 3" ||
      item.widget.header == "CPU Chartsmini 4" ||
      item.widget.header == "CPU Chartsmini 5"
    ) {
      this.listCPUminiarr = this.listCPUminiarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "B"
      );
      this.selectedDataCPUList = this.selectedDataCPUList.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
      this.selectedDataCPUListmini = this.selectedDataCPUListmini.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
    } else if (
      item.widget.header == "Temperature Charts 1" ||
      item.widget.header == "Temperature Charts 2" ||
      item.widget.header == "Temperature Charts 3" ||
      item.widget.header == "Temperature Charts 4" ||
      item.widget.header == "Temperature Charts 5"
    ) {
      this.listTemparr = this.listTemparr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "A"
      );
      this.selectedDataTempList = this.selectedDataTempList.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
      this.selectedDataTempListfull = this.selectedDataTempListfull.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
    } else if (
      item.widget.header == "Temperature Chartsmini 1" ||
      item.widget.header == "Temperature Chartsmini 2" ||
      item.widget.header == "Temperature Chartsmini 3" ||
      item.widget.header == "Temperature Chartsmini 4" ||
      item.widget.header == "Temperature Chartsmini 5"
    ) {
      this.listTempminiarr = this.listTempminiarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "B"
      );
      this.selectedDataTempList = this.selectedDataTempList.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
      this.selectedDataTempListmini = this.selectedDataTempListmini.filter(
        data => data.SYMBOL_NAME3 + " " + data.size != item.widget.content.data
      );
    } else if (
      item.widget.header == "CPUload1min Charts 1" ||
      item.widget.header == "CPUload1min Charts 2" ||
      item.widget.header == "CPUload1min Charts 3" ||
      item.widget.header == "CPUload1min Charts 4" ||
      item.widget.header == "CPUload1min Charts 5"
    ) {
      this.listCPUload1minarr = this.listCPUload1minarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "A"
      );
      this.selectedDataCPUloadList = this.selectedDataCPUloadList.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
      this.selectedDataCPUloadList1min = this.selectedDataCPUloadList1min.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
    } else if (
      item.widget.header == "CPUload2min Charts 1" ||
      item.widget.header == "CPUload2min Charts 2" ||
      item.widget.header == "CPUload2min Charts 3" ||
      item.widget.header == "CPUload2min Charts 4" ||
      item.widget.header == "CPUload2min Charts 5"
    ) {
      this.listCPUload2minarr = this.listCPUload2minarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "B"
      );
      this.selectedDataCPUloadList = this.selectedDataCPUloadList.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
      this.selectedDataCPUloadList2min = this.selectedDataCPUloadList2min.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
    } else if (
      item.widget.header == "CPUload3min Charts 1" ||
      item.widget.header == "CPUload3min Charts 2" ||
      item.widget.header == "CPUload3min Charts 3" ||
      item.widget.header == "CPUload3min Charts 4" ||
      item.widget.header == "CPUload3min Charts 5"
    ) {
      this.listCPUload3minarr = this.listCPUload3minarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "C"
      );
      this.selectedDataCPUloadList = this.selectedDataCPUloadList.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
      this.selectedDataCPUloadList3min = this.selectedDataCPUloadList3min.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
    } else if (
      item.widget.header == "CPUload4min Charts 1" ||
      item.widget.header == "CPUload4min Charts 2" ||
      item.widget.header == "CPUload4min Charts 3" ||
      item.widget.header == "CPUload4min Charts 4" ||
      item.widget.header == "CPUload4min Charts 5"
    ) {
      this.listCPUload4minarr = this.listCPUload4minarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "D"
      );
      this.selectedDataCPUloadList = this.selectedDataCPUloadList.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
      this.selectedDataCPUloadList4min = this.selectedDataCPUloadList4min.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
    } else if (
      item.widget.header == "CPUload5min Charts 1" ||
      item.widget.header == "CPUload5min Charts 2" ||
      item.widget.header == "CPUload5min Charts 3" ||
      item.widget.header == "CPUload5min Charts 4" ||
      item.widget.header == "CPUload5min Charts 5"
    ) {
      this.listCPUload5minarr = this.listCPUload5minarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "E"
      );
      this.selectedDataCPUloadList = this.selectedDataCPUloadList.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
      this.selectedDataCPUloadList5min = this.selectedDataCPUloadList5min.filter(
        data => data.SYMBOL_NAME3 + " " + data.load != item.widget.content.data
      );
    } else if (
      item.widget.header == "Tempnumber Charts 1" ||
      item.widget.header == "Tempnumber Charts 2" ||
      item.widget.header == "Tempnumber Charts 3" ||
      item.widget.header == "Tempnumber Charts 4" ||
      item.widget.header == "Tempnumber Charts 5"
    ) {
      this.listTempnumberarr = this.listTempnumberarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "A"
      );
      this.selectedDataTempnumberList = this.selectedDataTempnumberList.filter(
        data => data.SYMBOL_NAME3 != item.widget.footer
      );
      this.selectedDataTempnumberList = this.selectedDataTempnumberList.filter(
        data => data.SYMBOL_NAME3 != item.widget.footer
      );
    } else if (
      item.widget.header == "Memorydonut Charts 1" ||
      item.widget.header == "Memorydonut Charts 2" ||
      item.widget.header == "Memorydonut Charts 3" ||
      item.widget.header == "Memorydonut Charts 4" ||
      item.widget.header == "Memorydonut Charts 5"
    ) {
      this.listMemorydonutarr = this.listMemorydonutarr.filter(
        data => data.footer != item.widget.footer && data.widget.type != "A"
      );
      this.selectedDataMemorydonutList = this.selectedDataMemorydonutList.filter(
        data => data.SYMBOL_NAME3 != item.widget.footer
      );
      this.selectedDataMemorydonutList = this.selectedDataMemorydonutList.filter(
        data => data.SYMBOL_NAME3 != item.widget.footer
      );
    }

    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.addItemlist = [];
    this.addItemlist.push(...this.cards);

    this.showDialog = false;
    for (let i = 0; i < this.addItemlist.length; i++) {
      if (
        this.addItemlist[i].altText == "All devices" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 2,
          widget: {
            type: "A",
            header: "All devices",
            content: { image: "./assets/img/all_devices.jpg", data: 3000 },
            footer: "something"
          }
        });
        this.loadDeviceStatusNumberFunc();
        this.showDialog = false;
      } else if (
        this.addItemlist[i].altText == "Switch devices" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 2,
          widget: {
            type: "A",
            header: "Switch devices",
            content: { image: "./assets/img/switch_device.jpg", data: 3000 },
            footer: "something"
          }
        });
        this.loadActivePortFunc();
      } else if (
        this.addItemlist[i].altText == "Node config" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 2,
          widget: {
            type: "A",
            header: "Node config",
            content: { image: "./assets/img/node_config.jpg", data: 3000 },
            footer: "something"
          }
        });
        this.loadSymbolSettingNumberFunc();
      } else if (
        this.addItemlist[i].altText == "Line Group online" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 2,
          widget: {
            type: "A",
            header: "Line Group online",
            content: { image: "./assets/img/line_group.jpg", data: 3000 },
            footer: "something"
          }
        });
        this.loadLineGroupsStatusFunc();
        this.showDialog = false;
      } else if (
        this.addItemlist[i].altText == "Back up devices" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 1,
          widget: {
            type: "B",
            header: "Back up devices",
            content: { image: "./assets/img/backup_devices.jpg", data: 3000 },
            footer: "something"
          }
        });
      } else if (
        this.addItemlist[i].altText == "Today LINE message" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 1,
          widget: {
            type: "B",
            header: "Today LINE message",
            content: {
              image: "./assets/img/today_line_message.jpg",
              data: 3000
            },
            footer: "something"
          }
        });
      } else if (
        this.addItemlist[i].altText == "Active VLAN" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 1,
          widget: {
            type: "B",
            header: "Active VLAN",
            content: { image: "./assets/img/active_vlans.jpg", data: 3000 },
            footer: "something"
          }
        });
      } else if (
        this.addItemlist[i].altText == "Active tasks" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 1,
          widget: {
            type: "B",
            header: "Active tasks",
            content: { image: "./assets/img/active_task.jpg", data: 3000 },
            footer: "something"
          }
        });
      } else if (
        this.addItemlist[i].altText == "Alarm Chart" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 3,
          rows: 2,
          widget: {
            type: "C",
            header: "stockChart",
            content: { image: "./assets/img/alarms_statistic.png", data: 3000 },
            footer: "something"
          }
        });
        this.count_historyFunc();
      } else if (
        this.addItemlist[i].altText == "Alarm List" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 3,
          rows: 2,
          widget: {
            type: "A",
            header: "alarmlist",
            content: { image: "./assets/img/alarm_chartTotal.png", data: 3000 },
            footer: "something"
          }
        });
        this.loadStattisticAlarmFunc();
      } else if (
        this.addItemlist[i].altText == "Top 5 Device Alarm" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 2,
          widget: {
            type: "A",
            header: "Top 5 Device Alarm",
            content: { image: "./assets/img/alarm_chartTotal.jpg", data: 3000 },
            footer: "something"
          }
        });
        this.loadTop5deviceAlarmFunc();
      } else if (
        this.addItemlist[i].altText == "Alarm Device" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 3,
          rows: 4,
          widget: {
            type: "E",
            header: "tableAlarm",
            content: { image: "./assets/img/table_Alarm.png", data: 3000 },
            footer: "something"
          }
        });
      } else if (
        this.addItemlist[i].altText == "Topology Maps" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 3,
          rows: 4,
          widget: {
            type: "D",
            header: "gmap",
            content: { image: "./assets/img/gmap_noti.png", data: 3000 },
            footer: "something"
          }
        });
      } else if (
        this.addItemlist[i].altText == "filterAlarm" &&
        this.addItemlist[i].selected == true
      ) {
        // this.dashboard.push({
        //   cols: 6,
        //   rows: 1,
        //   y: 11,
        //   x: 0,
        //   widget: {
        //     type: "F",
        //     header: "filterAlarm",
        //     content: { image: "./assets/img/filter_Alarm.jpg", data: 3000 },
        //     footer: "something"
        //   }
        // });
      } else if (
        this.addItemlist[i].altText == "Today Port Link Down" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 3,

          widget: {
            type: "E",
            header: "TodayPortLinkDown",
            content: {
              image: "./assets/img/Today_portlinkDown.jpg",
              data: 3000
            },
            footer: "something"
          }
        });
        this.alarmService.loadchart().subscribe(result => {
          var alarmCounts = result.map(function(singleElement) {
            return singleElement.alarm_count;
          });

          var deviceNames = result.map(function(singleElement) {
            var re = /<%>/gi;
            var str = singleElement.strLocation;
            var newstr = str.replace(re, "");

            var val = newstr;

            if (isNumeric(val)) {
              val = "port " + val;
            } else {
              val;
            }
            return singleElement.strDeviceName + " " + val;
          });
          var strDesc = result.map(function(singleElement) {
            return singleElement.strDesc;
          });
          //  console.log(deviceNames);

          // for (let i = 0 ; i < deviceNames.lenght ; i ++){
          //     this.portlinkarr = [{
          //         listdeviceNames:deviceNames[i],
          //         listalarmCounts:alarmCounts[i],
          //         liststrDesc:strDesc[i]
          //     }]
          // }

          this.portlinkarr = deviceNames;
          this.alarmCounts = alarmCounts;
          this.strDesc = strDesc;
          this.portlinkarr.forEach(data => {
            this.portlinkarrs_hand1.push(data);
          });
          this.alarmCounts.forEach(data => {
            this.alarmCounts1.push(data);
          });
          this.strDesc.forEach(data => {
            this.strDesc1.push(data);
          });
          this.menuExportTodayPortLinkDown = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerTodayPortLinkDown.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Today Port Link Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Today Port Link Down",
                          style: {
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
                    this.exportcontainerTodayPortLinkDown.exportChart(
                      {
                        type: "image/png",
                        filename: "Today Port Link Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Today Port Link Down",
                          style: {
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
                    this.exportcontainerTodayPortLinkDown.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Today Port Link Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Today Port Link Down",
                          style: {
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
          var optionsTodayporttlinkDownChart: any = {
            chart: {
              type: "column",
              backgroundColor: "transparent"
            },
            title: {
              text: "Today Port Link Down",
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            exporting: {
              enabled: false
            },
            xAxis: {
              categories: deviceNames,
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              title: {
                text: "Alarm count",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            credits: {
              enabled: false
            },
            series: [
              {
                name: "Alarm count",
                data: alarmCounts,
                color: "#D35400"
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      align: "center",
                      verticalAlign: "bottom",
                      layout: "horizontal"
                    }
                  }
                }
              ]
            }
          };

          Highcharts.chart(
            "containerTodayporttlinkDown",
            optionsTodayporttlinkDownChart
          );
          this.exportcontainerTodayPortLinkDown = Highcharts.chart(
            "containerTodayporttlinkDown",
            optionsTodayporttlinkDownChart
          );
        });
      } else if (
        this.addItemlist[i].altText == "Top Node Down" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 3,
          widget: {
            type: "E",
            header: "TopNodeDown",
            content: { image: "./assets/img/TopNodeDown.jpg", data: 3000 },
            footer: "something"
          }
        });
        this.alarmService.loadchart24().subscribe(result => {
          var alarmCounts = result.map(function(singleElement) {
            return singleElement.alarm_count;
          });

          var deviceNames = result.map(function(singleElement) {
            return singleElement.symbol_name1;
          });
          this.deviceNames = deviceNames;
          this.alarmCounts_S = alarmCounts;
          this.deviceNames.forEach(data => {
            this.deviceNames1.push(data);
          });
          this.alarmCounts_S.forEach(data => {
            this.alarmCounts_S1.push(data);
          });
          this.menuExportTopNodeDown = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerTopNodeDown.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Top Node Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Top Node Down",
                          style: {
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
                    this.exportcontainerTopNodeDown.exportChart(
                      {
                        type: "image/png",
                        filename: "Top Node Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Top Node Down",
                          style: {
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
                    this.exportcontainerTopNodeDown.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Top Node Down",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Top Node Down",
                          style: {
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
          var optionsTopporttlinkChart: any = {
            chart: {
              type: "column",
              backgroundColor: "transparent"
            },
            title: {
              text: "Top Node Down",
              style: {
                color: this.colortitle
              }
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: deviceNames,
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              title: {
                text: "Alarm count",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            exporting: {
              enabled: false
            },
            series: [
              {
                name: "Alarm count",
                data: alarmCounts
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      align: "center",
                      verticalAlign: "bottom",
                      layout: "horizontal"
                    }
                  }
                }
              ]
            }
          };

          Highcharts.chart("containerTopporttlink", optionsTopporttlinkChart);
          this.exportcontainerTopNodeDown = Highcharts.chart(
            "containerTopporttlink",
            optionsTopporttlinkChart
          );
        });
      } else if (
        this.addItemlist[i].altText == "Today Remote Poweroff" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 3,
          widget: {
            type: "E",
            header: "TodayRemotePoweroff",
            content: {
              image: "./assets/img/TodayRemotePoweroff.jpg",
              data: 3000
            },
            footer: "something"
          }
        });
        this.alarmService.loadchartremote().subscribe(result => {
          var alarmCounts = result.map(function(singleElement) {
            return singleElement.alarm_count;
          });

          var deviceNames = result.map(function(singleElement) {
            var re = /<%>/gi;
            var str = singleElement.strLocation;
            var newstr = str.replace(re, "");

            var val = newstr;

            if (isNumeric(val)) {
              val = "port " + val;
            } else {
              val;
            }
            var strIPAddress = singleElement.strIPAddress;
            return singleElement.strDeviceName + " " + val + " " + strIPAddress;
          });
          var strDesc = result.map(function(singleElement) {
            return singleElement.strDesc;
          });
          //  console.log(deviceNames);
          this.portlinkarr_hand3 = deviceNames;
          this.alarmCounts_hand3 = alarmCounts;
          this.strDesc_hand3 = strDesc;
          this.portlinkarr_hand3.forEach(data => {
            this.portlinkarrs_hand3.push(data);
          });
          this.alarmCounts_hand3.forEach(data => {
            this.alarmCounts1_hand3.push(data);
          });
          this.strDesc_hand3.forEach(data => {
            this.strDesc1_hand3.push(data);
          });
          this.menuExportTodayRemotePoweroff = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerTodayRemotePoweroff.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Today Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Today Remote Power off",
                          style: {
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
                    this.exportcontainerTodayRemotePoweroff.exportChart(
                      {
                        type: "image/png",
                        filename: "Today Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Today Remote Power off",
                          style: {
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
                    this.exportcontainerTodayRemotePoweroff.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Today Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Today Remote Power off",
                          style: {
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
          var optionsTodayRemotePoweroffChart: any = {
            chart: {
              type: "column",
              backgroundColor: "transparent"
            },
            title: {
              text: "Today Remote Power off",
              style: {
                color: this.colortitle
              }
            },

            xAxis: {
              categories: deviceNames,
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              title: {
                text: "Alarm count",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            series: [
              {
                name: "Alarm count",
                data: alarmCounts,
                color: "#D35400"
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      align: "center",
                      verticalAlign: "bottom",
                      layout: "horizontal"
                    }
                  }
                }
              ]
            }
          };

          Highcharts.chart(
            "containerTodayRemotePoweroff",
            optionsTodayRemotePoweroffChart
          );
          this.exportcontainerTodayRemotePoweroff = Highcharts.chart(
            "containerTodayRemotePoweroff",
            optionsTodayRemotePoweroffChart
          );
        });
      } else if (
        this.addItemlist[i].altText == "Top Remote Poweroff" &&
        this.addItemlist[i].selected == true
      ) {
        this.dashboard.push({
          cols: 1,
          rows: 3,
          widget: {
            type: "E",
            header: "TopRemotePoweroff",
            content: {
              image: "./assets/img/TopRemotePoweroff.jpg",
              data: 3000
            },
            footer: "something"
          }
        });
        this.alarmService.loadchartremote24().subscribe(result => {
          var alarmCounts = result.map(function(singleElement) {
            return singleElement.alarm_count;
          });

          var deviceNames = result.map(function(singleElement) {
            return singleElement.symbol_name1;
          });
          this.deviceNames_hand4 = deviceNames;
          this.alarmCounts_hand4 = alarmCounts;
          this.deviceNames_hand4.forEach(data => {
            this.deviceNames1_hand4.push(data);
          });
          this.alarmCounts_hand4.forEach(data => {
            this.alarmCounts1_hand4.push(data);
          });
          this.menuExportTopRemotePoweroff = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.exportcontainerTopRemotePoweroff.exportChart(
                      {
                        type: "image/jpeg",
                        filename: "Top Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "Top Remote Power off",
                          style: {
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
                    this.exportcontainerTopRemotePoweroff.exportChart(
                      {
                        type: "image/png",
                        filename: "Top Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Top Remote Power off",
                          style: {
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
                    this.exportcontainerTopRemotePoweroff.exportChart(
                      {
                        type: "application/pdf",
                        filename: "Top Remote Power off",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "Top Remote Power off",
                          style: {
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
          var optionsTopRemotePoweroffChart: any = {
            chart: {
              type: "column",
              backgroundColor: "transparent"
            },
            title: {
              text: "Top Remote Power off",
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colorExportDark
              }
            },
            exporting: {
              enabled: false
            },
            xAxis: {
              categories: deviceNames,
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            yAxis: {
              title: {
                text: "Alarm count",
                style: {
                  color: "black"
                }
              },
              labels: {
                style: {
                  color: "black"
                }
              }
            },
            credits: {
              enabled: false
            },
            series: [
              {
                name: "Alarm count",
                data: alarmCounts
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      align: "center",
                      verticalAlign: "bottom",
                      layout: "horizontal"
                    }
                  }
                }
              ]
            }
          };

          Highcharts.chart(
            "containerTopRemotePoweroff",
            optionsTopRemotePoweroffChart
          );
          this.exportcontainerTopRemotePoweroff = Highcharts.chart(
            "containerTopRemotePoweroff",
            optionsTopRemotePoweroffChart
          );
        });
      } else if (
        this.addItemlist[i].altText == "Bandwidth Charts" &&
        this.addItemlist[i].selected == true
      ) {
        // console.log("hi")
        if (this.listBanwidtharr.length != 0) {
          this.listBanwidtharr.forEach(list => {
            // console.log(list)
            if (list.widget.header == "Bandwidth Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Charts 1"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidth Charts 1"
                );
              }
            } else if (list.widget.header == "Bandwidth Charts 2") {
              // this.dashboard.push(list)
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Charts 2"
              );
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidth Charts 2"
                );
              }
            } else if (list.widget.header == "Bandwidth Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Charts 3"
              );
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                // console.log(list)
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidth Charts 3"
                );
              }
            } else if (list.widget.header == "Bandwidth Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Charts 4"
              );
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                // console.log(list)
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidth Charts 4"
                );
              }
            } else if (list.widget.header == "Bandwidth Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Charts 5"
              );
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                // console.log(list)
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidth Charts 5"
                );
              }
            }
          });
        }
        if (this.listBanwidthminiarr.length != 0) {
          this.listBanwidthminiarr.forEach(list => {
            // console.log(list)
            if (list.widget.header == "Bandwidth Chartsmini 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Chartsmini 1"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidthmini Charts 1"
                );
              }
            } else if (list.widget.header == "Bandwidth Chartsmini 2") {
              // this.dashboard.push(list)
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Chartsmini 2"
              );
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidthmini Charts 2"
                );
              }
            } else if (list.widget.header == "Bandwidth Chartsmini 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Chartsmini 3"
              );
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                // console.log(list)
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidthmini Charts 3"
                );
              }
            } else if (list.widget.header == "Bandwidth Chartsmini 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Chartsmini 4"
              );
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                // console.log(list)
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidthmini Charts 4"
                );
              }
            } else if (list.widget.header == "Bandwidth Chartsmini 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Bandwidth Chartsmini 5"
              );
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                // console.log(list)
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeBandwidthFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.data,
                  list.widget.content.image,
                  "containerBandwidthmini Charts 5"
                );
              }
            }
          });
        }
      } else if (
        this.addItemlist[i].altText == "Memory Charts" &&
        this.addItemlist[i].selected == true
      ) {
        // console.log("hi")
        if (this.listMemoryarr.length != 0) {
          this.listMemoryarr.forEach(list => {
            if (list.widget.header == "Memory Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Charts 1"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemory Charts 1"
                );
              }
            } else if (list.widget.header == "Memory Charts 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Charts 2"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemory Charts 2"
                );
              }
            } else if (list.widget.header == "Memory Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Charts 3"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemory Charts 3"
                );
              }
            } else if (list.widget.header == "Memory Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Charts 4"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemory Charts 4"
                );
              }
            } else if (list.widget.header == "Memory Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Charts 5"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemory Charts 5"
                );
              }
            }
          });
        }
        if (this.listMemoryminiarr.length != 0) {
          this.listMemoryminiarr.forEach(list => {
            if (list.widget.header == "Memory Chartsmini 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Chartsmini 1"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemorymini Charts 1"
                );
              }
            } else if (list.widget.header == "Memory Chartsmini 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Chartsmini 2"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemorymini Charts 2"
                );
              }
            } else if (list.widget.header == "Memory Chartsmini 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Chartsmini 3"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemorymini Charts 3"
                );
              }
            } else if (list.widget.header == "Memory Chartsmini 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Chartsmini 4"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemorymini Charts 4"
                );
              }
            } else if (list.widget.header == "Memory Chartsmini 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Memory Chartsmini 5"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeMemoryFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerMemorymini Charts 5"
                );
              }
            }
          });
        }
        // console.log(this.dashboard)
      } else if (
        this.addItemlist[i].altText == "CPU Charts" &&
        this.addItemlist[i].selected == true
      ) {
        // console.log("hi")
        if (this.listCPUarr.length != 0) {
          this.listCPUarr.forEach(list => {
            // console.log(list.widget.header)
            if (list.widget.header == "CPU Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Charts 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPU Charts 1"
                );
              }
            } else if (list.widget.header == "CPU Charts 2") {
              // console.log("hi")
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Charts 2"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPU Charts 2"
                );
              }
            } else if (list.widget.header == "CPU Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Charts 3"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPU Charts 3"
                );
              }
            } else if (list.widget.header == "CPU Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Charts 4"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPU Charts 4"
                );
              }
            } else if (list.widget.header == "CPU Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Charts 5"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPU Charts 5"
                );
              }
            }
          });
        }
        if (this.listCPUminiarr.length != 0) {
          this.listCPUminiarr.forEach(list => {
            // console.log(list.widget.header)
            if (list.widget.header == "CPU Chartsmini 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Chartsmini 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPUmini Charts 1"
                );
              }
            } else if (list.widget.header == "CPU Chartsmini 2") {
              // console.log("hi")
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Chartsmini 2"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPUmini Charts 2"
                );
              }
            } else if (list.widget.header == "CPU Chartsmini 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Chartsmini 3"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPUmini Charts 3"
                );
              }
            } else if (list.widget.header == "CPU Chartsmini 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Chartsmini 4"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPUmini Charts 4"
                );
              }
            } else if (list.widget.header == "CPU Chartsmini 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPU Chartsmini 5"
              );

              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeCPUFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerCPUmini Charts 5"
                );
              }
            }
          });
        }
        // console.log(this.dashboard)
      } else if (
        this.addItemlist[i].altText == "Temperature Charts" &&
        this.addItemlist[i].selected == true
      ) {
        // console.log("hi")
        if (this.listTemparr.length != 0) {
          this.listTemparr.forEach(list => {
            // console.log(list.widget.header)
            if (list.widget.header == "Temperature Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Charts 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTemperature Charts 1"
                );
              }
            } else if (list.widget.header == "Temperature Charts 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Charts 2"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTemperature Charts 2"
                );
              }
            } else if (list.widget.header == "Temperature Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Charts 3"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTemperature Charts 3"
                );
              }
            } else if (list.widget.header == "Temperature Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Charts 4"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTemperature Charts 4"
                );
              }
            } else if (list.widget.header == "Temperature Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Charts 5"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTemperature Charts 5"
                );
              }
            }
          });
        }

        if (this.listTempminiarr.length != 0) {
          this.listTempminiarr.forEach(list => {
            // console.log(list.widget.header)
            if (list.widget.header == "Temperature Chartsmini 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Chartsmini 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTempmini Charts 1"
                );
              }
            } else if (list.widget.header == "Temperature Chartsmini 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Chartsmini 2"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTempmini Charts 2"
                );
              }
            } else if (list.widget.header == "Temperature Chartsmini 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Chartsmini 3"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTempmini Charts 3"
                );
              }
            } else if (list.widget.header == "Temperature Chartsmini 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Chartsmini 4"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTempmini Charts 4"
                );
              }
            } else if (list.widget.header == "Temperature Chartsmini 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "Temperature Chartsmini 5"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);
                var date = new Date();
                var start = date.setDate(date.getDate() - 1);
                var end = new Date().getTime();
                this.getRangeTempFunc(
                  list.widget.footer,
                  start,
                  end,
                  list.widget.content.image,
                  "containerTempmini Charts 5"
                );
              }
            }
          });
        }
        // console.log(this.dashboard)
      } else if (
        this.addItemlist[i].altText == "CPUload Charts" &&
        this.addItemlist[i].selected == true
      ) {
        if (this.listCPUload1minarr.length != 0) {
          this.listCPUload1minarr.forEach(list => {
            if (list.widget.header == "CPUload1min Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload1min Charts 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 1).subscribe({
                  next: results => {
                    this.valueCPU1min1 = results.data;
                    // console.log(results.data)
                    // console.log(this.valueCPU1min1)
                    this.loadcpu1min1 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload1min Charts 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload1min Charts 2"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 1).subscribe({
                  next: results => {
                    this.valueCPU1min2 = results.data;
                    this.loadcpu1min2 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload1min Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload1min Charts 3"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 1).subscribe({
                  next: results => {
                    this.valueCPU1min3 = results.data;
                    this.loadcpu1min3 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload1min Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload1min Charts 4"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 1).subscribe({
                  next: results => {
                    this.valueCPU1min4 = results.data;
                    this.loadcpu1min4 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload1min Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload1min Charts 5"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 1).subscribe({
                  next: results => {
                    this.valueCPU1min5 = results.data;
                    this.loadcpu1min5 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            }
          });
        }

        if (this.listCPUload2minarr.length != 0) {
          this.listCPUload2minarr.forEach(list => {
            if (list.widget.header == "CPUload2min Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload2min Charts 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 2).subscribe({
                  next: results => {
                    this.valueCPU2min1 = results.data;
                    this.loadcpu2min1 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload2min Charts 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload2min Charts 2"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 2).subscribe({
                  next: results => {
                    this.valueCPU2min2 = results.data;
                    this.loadcpu2min2 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload2min Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload2min Charts 3"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 2).subscribe({
                  next: results => {
                    this.valueCPU2min3 = results.data;
                    this.loadcpu2min3 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload2min Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload2min Charts 4"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 2).subscribe({
                  next: results => {
                    this.valueCPU2min4 = results.data;
                    this.loadcpu2min4 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload2min Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload2min Charts 5"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 2).subscribe({
                  next: results => {
                    this.valueCPU2min5 = results.data;
                    this.loadcpu2min5 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            }
          });
        }

        if (this.listCPUload3minarr.length != 0) {
          this.listCPUload3minarr.forEach(list => {
            if (list.widget.header == "CPUload3min Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload3min Charts 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 3).subscribe({
                  next: results => {
                    this.valueCPU3min1 = results.data;
                    this.loadcpu3min1 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload3min Charts 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload3min Charts 2"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 3).subscribe({
                  next: results => {
                    this.valueCPU3min2 = results.data;
                    this.loadcpu3min2 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload3min Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload3min Charts 3"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 3).subscribe({
                  next: results => {
                    this.valueCPU3min3 = results.data;
                    this.loadcpu3min3 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload3min Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload3min Charts 4"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 3).subscribe({
                  next: results => {
                    this.valueCPU3min4 = results.data;
                    this.loadcpu3min4 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload3min Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload3min Charts 5"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 3).subscribe({
                  next: results => {
                    this.valueCPU3min5 = results.data;
                    this.loadcpu3min5 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            }
          });
        }

        if (this.listCPUload4minarr.length != 0) {
          this.listCPUload4minarr.forEach(list => {
            if (list.widget.header == "CPUload4min Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload4min Charts 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 4).subscribe({
                  next: results => {
                    this.valueCPU4min1 = results.data;
                    this.loadcpu4min1 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload4min Charts 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload4min Charts 2"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 4).subscribe({
                  next: results => {
                    this.valueCPU4min2 = results.data;
                    this.loadcpu4min2 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload4min Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload4min Charts 3"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 4).subscribe({
                  next: results => {
                    this.valueCPU4min3 = results.data;
                    this.loadcpu4min3 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload4min Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload4min Charts 4"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 4).subscribe({
                  next: results => {
                    this.valueCPU4min4 = results.data;
                    this.loadcpu4min4 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload4min Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload4min Charts 5"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 4).subscribe({
                  next: results => {
                    this.valueCPU4min5 = results.data;
                    this.loadcpu4min5 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            }
          });
        }

        if (this.listCPUload5minarr.length != 0) {
          this.listCPUload5minarr.forEach(list => {
            if (list.widget.header == "CPUload5min Charts 1") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload5min Charts 1"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 5).subscribe({
                  next: results => {
                    this.valueCPU5min1 = results.data;
                    this.loadcpu5min1 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload5min Charts 2") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload5min Charts 2"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 4).subscribe({
                  next: results => {
                    this.valueCPU5min2 = results.data;
                    this.loadcpu5min2 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload5min Charts 3") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload5min Charts 3"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 4).subscribe({
                  next: results => {
                    this.valueCPU5min3 = results.data;
                    this.loadcpu5min3 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload5min Charts 4") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload5min Charts 4"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 5).subscribe({
                  next: results => {
                    this.valueCPU5min4 = results.data;
                    this.loadcpu5min4 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            } else if (list.widget.header == "CPUload5min Charts 5") {
              var listcheck = this.dashboard.filter(
                data => data.widget.header == "CPUload5min Charts 5"
              );
              // console.log("hi")
              if (listcheck.length == 0) {
                this.dashboard.push(list);

                this.alarmService.getCPU(list.widget.footer, 5).subscribe({
                  next: results => {
                    this.valueCPU5min5 = results.data;
                    this.loadcpu5min5 = true;
                  },
                  error: error => {
                    if (error) {
                      this.loading = false;
                    }
                  }
                });
              }
            }
          });
        }
      } else if (
        this.addItemlist[i].altText == "Temperature" &&
        this.addItemlist[i].selected == true
      ) {
        this.listTempnumberarr.forEach(list => {
          // console.log(list.widget.header)
          if (list.widget.header == "Tempnumber Charts 1") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Tempnumber Charts 1"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              var date = new Date();
              var start = date.setDate(date.getDate() - 1);
              var end = new Date().getTime();
              this.alarmService.getTemp(list.widget.footer).subscribe({
                next: results => {
                  this.loadTemp = true;
                  this.valueTemp1 = results.data;
                  this.getRangeTempnumberFunc(
                    list.widget.footer,
                    start,
                    end,
                    "containerTempsystem 1"
                  );
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
          } else if (list.widget.header == "Tempnumber Charts 2") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Tempnumber Charts 2"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              var date = new Date();
              var start = date.setDate(date.getDate() - 1);
              var end = new Date().getTime();
              this.alarmService.getTemp(list.widget.footer).subscribe({
                next: results => {
                  this.loadTemp = true;
                  this.valueTemp2 = results.data;
                  this.getRangeTempnumberFunc(
                    list.widget.footer,
                    start,
                    end,
                    "containerTempsystem 2"
                  );
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
          } else if (list.widget.header == "Tempnumber Charts 3") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Tempnumber Charts 3"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              var date = new Date();
              var start = date.setDate(date.getDate() - 1);
              var end = new Date().getTime();
              this.alarmService.getTemp(list.widget.footer).subscribe({
                next: results => {
                  this.loadTemp = true;
                  this.valueTemp3 = results.data;
                  this.getRangeTempnumberFunc(
                    list.widget.footer,
                    start,
                    end,
                    "containerTempsystem 3"
                  );
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
          } else if (list.widget.header == "Tempnumber Charts 4") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Tempnumber Charts 4"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              var date = new Date();
              var start = date.setDate(date.getDate() - 1);
              var end = new Date().getTime();
              this.alarmService.getTemp(list.widget.footer).subscribe({
                next: results => {
                  this.loadTemp = true;
                  this.valueTemp4 = results.data;
                  this.getRangeTempnumberFunc(
                    list.widget.footer,
                    start,
                    end,
                    "containerTempsystem 4"
                  );
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
          } else if (list.widget.header == "Tempnumber Charts 5") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Tempnumber Charts 5"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              var date = new Date();
              var start = date.setDate(date.getDate() - 1);
              var end = new Date().getTime();
              this.alarmService.getTemp(list.widget.footer).subscribe({
                next: results => {
                  this.loadTemp = true;
                  this.valueTemp5 = results.data;
                  this.getRangeTempnumberFunc(
                    list.widget.footer,
                    start,
                    end,
                    "containerTempsystem 5"
                  );
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
          }
        });
      } else if (
        this.addItemlist[i].altText == "All memory" &&
        this.addItemlist[i].selected == true
      ) {
        this.listMemorydonutarr.forEach(list => {
          // console.log(list.widget.header)
          if (list.widget.header == "Memorydonut Charts 1") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Memorydonut Charts 1"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              this.getMemoryMemorydonutCharts(
                list.widget.footer,
                list.widget.content.image,
                "containerMemorydonut chart 1"
              );
            }
          } else if (list.widget.header == "Memorydonut Charts 2") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Memorydonut Charts 2"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              this.getMemoryMemorydonutCharts(
                list.widget.footer,
                list.widget.content.image,
                "containerMemorydonut chart 2"
              );
            }
          } else if (list.widget.header == "Memorydonut Charts 3") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Memorydonut Charts 3"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              this.getMemoryMemorydonutCharts(
                list.widget.footer,
                list.widget.content.image,
                "containerMemorydonut chart 3"
              );
            }
          } else if (list.widget.header == "Memorydonut Charts 4") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Memorydonut Charts 4"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              this.getMemoryMemorydonutCharts(
                list.widget.footer,
                list.widget.content.image,
                "containerMemorydonut chart 4"
              );
            }
          } else if (list.widget.header == "Memorydonut Charts 5") {
            var listcheck = this.dashboard.filter(
              data => data.widget.header == "Memorydonut Charts 5"
            );
            // console.log("hi")
            if (listcheck.length == 0) {
              this.dashboard.push(list);
              this.getMemoryMemorydonutCharts(
                list.widget.footer,
                list.widget.content.image,
                "containerMemorydonut chart 5"
              );
            }
          }
        });
      }
    }
  }
  // AddItem() end here

  testexport() {
    document.getElementById("export-jpeg").addEventListener("click", () => {
      this.exportcontainerBandwidthCharts1.exportChart(
        {
          type: "image/jpeg",
          filename: "my-jpg"
        },
        {
          subtitle: {
            text: ""
          }
        }
      );
    });
  }
  marker_ipaddress: string;
  onChangechart1(event) {
    if (
      event.value.length != 0 &&
      event.value.length != this.portlinkarrs_hand1.length
    ) {
      var indexs = this.portlinkarr.findIndex(data => data == event.itemValue);
      this.index1 = indexs;
      this.portlinkarr1_hand1 = [indexs];
    } else if (
      event.value.length != 0 &&
      event.value.length == this.portlinkarrs_hand1.length
    ) {
      this.portlinkarr1_hand1 = [];
      this.portlinkarr = [];
      this.alarmCounts = [];
      this.strDesc = [];
      this.portlinkAdd = [];
      this.handleUpdate(this.portlinkarr, this.alarmCounts, this.strDesc);
    } else if (
      event.value.length == 0 &&
      event.value.length == this.portlinkarr.length
    ) {
      this.portlinkarrs_hand1.forEach(data => {
        this.portlinkarr.push(data);
      });
      this.alarmCounts1.forEach(data => {
        this.alarmCounts.push(data);
      });
      this.strDesc1.forEach(data => {
        this.strDesc.push(data);
      });

      this.portlinkAdd = this.portlink_S;
      console.log(this.portlinkAdd);
      this.handleUpdate(this.portlinkarr, this.alarmCounts, this.strDesc);
    } else if (
      event.value.length == 0 &&
      event.value.length != this.portlinkarr.length
    ) {
      this.portlinkarr1_hand1 = [-1];
    }

    if (
      this.portlinkarr1_hand1[0] != -1 &&
      this.portlinkarr1_hand1.length != 0
    ) {
      var valuesArr = this.portlinkarr,
        removeValFromIndex = this.portlinkarr1_hand1;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr.splice(removeValFromIndex[i], 1);
      var valuesArr1 = this.alarmCounts,
        removeValFromIndex = this.portlinkarr1_hand1;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr1.splice(removeValFromIndex[i], 1);
      var valuesArr2 = this.strDesc,
        removeValFromIndex = this.portlinkarr1_hand1;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr2.splice(removeValFromIndex[i], 1);
      this.portlinkarr = valuesArr;
      this.alarmCounts = valuesArr1;
      this.strDesc = valuesArr2;

      var str = event.itemValue;
      const searchTerm = " port ";
      const indexOfFirst = str.indexOf(searchTerm);
      var newstr = str.slice(0, indexOfFirst);

      const indexOfObject = this.portlinkAdd.findIndex(object => {
        return object.strDeviceName === newstr;
      });

      if (indexOfObject !== -1) {
        this.portlinkAdd.splice(indexOfObject, 1);
      }

      this.handleUpdate(this.portlinkarr, this.alarmCounts, this.strDesc);
    } else if (
      this.portlinkarr1_hand1[0] == -1 &&
      this.portlinkarr1_hand1.length != 0
    ) {
      var index = this.portlinkarrs_hand1.findIndex(
        data => data == event.itemValue
      );
      var str1 = event.itemValue;
      const searchTerm1 = " port ";
      const indexOfFirst1 = str1.indexOf(searchTerm1);
      var newstr1 = str1.slice(0, indexOfFirst1);
      var indexS = this.portlink_S.findIndex(
        data => data.strDeviceName === newstr1
      );
      var valueS = this.portlink_S.filter(
        data => data.strDeviceName === newstr1
      );

      var alarm = this.alarmCounts1[index];
      var strDescs = this.strDesc1[index];
      this.portlinkarr.splice(index, 0, event.itemValue);
      this.alarmCounts.splice(index, 0, alarm);
      this.strDesc.splice(index, 0, strDescs);
      this.portlinkAdd.splice(indexS, 0, valueS[0]);
      this.handleUpdate(this.portlinkarr, this.alarmCounts, this.strDesc);
    }
  }
  onChangechart2(event) {
    if (
      event.value.length != 0 &&
      event.value.length != this.deviceNames1.length
    ) {
      var indexs = this.deviceNames.findIndex(data => data == event.itemValue);
      this.index1 = indexs;
      this.portlinkarr2_hand2 = [indexs];
    } else if (
      event.value.length != 0 &&
      event.value.length == this.deviceNames1.length
    ) {
      this.portlinkarr2_hand2 = [];
      this.deviceNames = [];
      this.alarmCounts_S = [];
      this.portlink24 = [];
      this.handleUpdate1(this.deviceNames, this.alarmCounts_S);
    } else if (
      event.value.length == 0 &&
      event.value.length == this.deviceNames.length
    ) {
      this.deviceNames1.forEach(data => {
        this.deviceNames.push(data);
      });
      this.alarmCounts_S1.forEach(data => {
        this.alarmCounts_S.push(data);
      });

      this.portlink24 = this.portlink24_S;
      this.handleUpdate1(this.deviceNames, this.alarmCounts_S);
    } else if (
      event.value.length == 0 &&
      event.value.length != this.deviceNames.length
    ) {
      this.portlinkarr2_hand2 = [-1];
    }

    if (
      this.portlinkarr2_hand2[0] != -1 &&
      this.portlinkarr2_hand2.length != 0
    ) {
      var valuesArr = this.deviceNames,
        removeValFromIndex = this.portlinkarr2_hand2;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr.splice(removeValFromIndex[i], 1);
      var valuesArr1 = this.alarmCounts_S,
        removeValFromIndex = this.portlinkarr2_hand2;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr1.splice(removeValFromIndex[i], 1);

      this.deviceNames = valuesArr;
      this.alarmCounts_S = valuesArr1;
      const indexOfObject = this.portlink24.findIndex(object => {
        return object.symbol_name1 === event.itemValue;
      });

      if (indexOfObject !== -1) {
        this.portlink24.splice(indexOfObject, 1);
      }

      this.handleUpdate1(this.deviceNames, this.alarmCounts_S);
    } else if (
      this.portlinkarr2_hand2[0] == -1 &&
      this.portlinkarr2_hand2.length != 0
    ) {
      var index = this.deviceNames1.findIndex(data => data == event.itemValue);
      var indexS = this.portlink24_S.findIndex(
        data => data.symbol_name1 == event.itemValue
      );
      var valueS = this.portlink24_S.filter(
        data => data.symbol_name1 == event.itemValue
      );

      var alarm = this.alarmCounts_S1[index];
      this.deviceNames.splice(index, 0, event.itemValue);
      this.alarmCounts_S.splice(index, 0, alarm);
      this.portlink24.splice(indexS, 0, valueS[0]);

      this.handleUpdate1(this.deviceNames, this.alarmCounts_S);
    }
  }
  onChangechart3(event) {
    if (
      event.value.length != 0 &&
      event.value.length != this.portlinkarrs_hand3.length
    ) {
      var indexs = this.portlinkarr_hand3.findIndex(
        data => data == event.itemValue
      );
      this.index1 = indexs;
      this.portlinkarr3_hand3 = [indexs];
    } else if (
      event.value.length != 0 &&
      event.value.length == this.portlinkarrs_hand3.length
    ) {
      this.portlinkarr3_hand3 = [];
      this.portlinkarr_hand3 = [];
      this.alarmCounts_hand3 = [];
      this.strDesc_hand3 = [];
      this.portlinkremote = [];
      this.handleUpdate2(
        this.portlinkarr_hand3,
        this.alarmCounts_hand3,
        this.strDesc_hand3
      );
    } else if (
      event.value.length == 0 &&
      event.value.length == this.portlinkarr_hand3.length
    ) {
      this.portlinkarrs_hand3.forEach(data => {
        this.portlinkarr_hand3.push(data);
      });
      this.alarmCounts1_hand3.forEach(data => {
        this.alarmCounts_hand3.push(data);
      });
      this.strDesc1_hand3.forEach(data => {
        this.strDesc_hand3.push(data);
      });
      this.portlinkremote = this.portlinkremote_S;
      this.handleUpdate2(
        this.portlinkarr_hand3,
        this.alarmCounts_hand3,
        this.strDesc_hand3
      );
    } else if (
      event.value.length == 0 &&
      event.value.length != this.portlinkarr_hand3.length
    ) {
      this.portlinkarr3_hand3 = [-1];
    }

    if (
      this.portlinkarr3_hand3[0] != -1 &&
      this.portlinkarr3_hand3.length != 0
    ) {
      var valuesArr = this.portlinkarr_hand3,
        removeValFromIndex = this.portlinkarr3_hand3;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr.splice(removeValFromIndex[i], 1);
      var valuesArr1 = this.alarmCounts_hand3,
        removeValFromIndex = this.portlinkarr3_hand3;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr1.splice(removeValFromIndex[i], 1);
      var valuesArr2 = this.strDesc_hand3,
        removeValFromIndex = this.portlinkarr3_hand3;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr2.splice(removeValFromIndex[i], 1);
      this.portlinkarr_hand3 = valuesArr;
      this.alarmCounts_hand3 = valuesArr1;
      this.strDesc_hand3 = valuesArr2;
      var str = event.itemValue;
      const searchTerm = "] ";
      const indexOfFirst = str.indexOf(searchTerm);
      var newstr = str.slice(indexOfFirst + 3);
      const searchTerm1 = "> ";
      const indexOfFirst1 = newstr.indexOf(searchTerm1);
      var newstr1 = newstr.slice(indexOfFirst1 + 1);
      var newstr2 = newstr1.replace(" ", "");
      //   console.log(newstr2);
      const indexOfObject = this.portlinkremote.findIndex(object => {
        return object.strIPAddress === newstr2;
      });
      if (indexOfObject !== -1) {
        this.portlinkremote.splice(indexOfObject, 1);
      }

      this.handleUpdate2(
        this.portlinkarr_hand3,
        this.alarmCounts_hand3,
        this.strDesc_hand3
      );
    } else if (
      this.portlinkarr3_hand3[0] == -1 &&
      this.portlinkarr3_hand3.length != 0
    ) {
      var index = this.portlinkarrs_hand3.findIndex(
        data => data == event.itemValue
      );
      var str_S = event.itemValue;
      const searchTerm_S = "] ";
      const indexOfFirst_S = str_S.indexOf(searchTerm_S);
      var newstr_S = str_S.slice(indexOfFirst_S + 3);
      const searchTerm1_S = "> ";
      const indexOfFirst1_S = newstr_S.indexOf(searchTerm1_S);
      var newstr1_S = newstr_S.slice(indexOfFirst1_S + 1);
      var newstr2_S = newstr1_S.replace(" ", "");
      var indexS = this.portlinkremote_S.findIndex(
        data => data.strIPAddress === newstr2_S
      );
      var valueS = this.portlinkremote_S.filter(
        data => data.strIPAddress === newstr2_S
      );
      var alarm = this.alarmCounts1_hand3[index];
      var strDescs = this.strDesc1_hand3[index];
      this.portlinkarr_hand3.splice(index, 0, event.itemValue);
      this.alarmCounts_hand3.splice(index, 0, alarm);
      this.strDesc_hand3.splice(index, 0, strDescs);
      this.portlinkremote.splice(indexS, 0, valueS[0]);
      this.handleUpdate2(
        this.portlinkarr_hand3,
        this.alarmCounts_hand3,
        this.strDesc_hand3
      );
    }
  }
  onChangechart4(event) {
    if (
      event.value.length != 0 &&
      event.value.length != this.deviceNames1_hand4.length
    ) {
      var indexs = this.deviceNames_hand4.findIndex(
        data => data == event.itemValue
      );
      this.index1 = indexs;
      this.portlinkarr4_hand4 = [indexs];
    } else if (
      event.value.length != 0 &&
      event.value.length == this.deviceNames1_hand4.length
    ) {
      this.portlinkarr4_hand4 = [];
      this.deviceNames_hand4 = [];
      this.alarmCounts_hand4 = [];
      this.portlinkremote24 = [];
      this.handleUpdate3(this.deviceNames_hand4, this.alarmCounts_hand4);
    } else if (
      event.value.length == 0 &&
      event.value.length == this.deviceNames_hand4.length
    ) {
      this.deviceNames1_hand4.forEach(data => {
        this.deviceNames_hand4.push(data);
      });
      this.alarmCounts1_hand4.forEach(data => {
        this.alarmCounts_hand4.push(data);
      });

      this.portlinkremote24 = this.portlinkremote24_S;
      this.handleUpdate3(this.deviceNames_hand4, this.alarmCounts_hand4);
    } else if (
      event.value.length == 0 &&
      event.value.length != this.deviceNames_hand4.length
    ) {
      this.portlinkarr4_hand4 = [-1];
    }

    if (
      this.portlinkarr4_hand4[0] != -1 &&
      this.portlinkarr4_hand4.length != 0
    ) {
      var valuesArr = this.deviceNames_hand4,
        removeValFromIndex = this.portlinkarr4_hand4;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr.splice(removeValFromIndex[i], 1);
      var valuesArr1 = this.alarmCounts_hand4,
        removeValFromIndex = this.portlinkarr4_hand4;
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        valuesArr1.splice(removeValFromIndex[i], 1);

      this.deviceNames_hand4 = valuesArr;
      this.alarmCounts_hand4 = valuesArr1;
      const indexOfObject = this.portlinkremote24.findIndex(object => {
        return object.symbol_name1 === event.itemValue;
      });

      if (indexOfObject !== -1) {
        this.portlinkremote24.splice(indexOfObject, 1);
      }
      this.handleUpdate3(this.deviceNames_hand4, this.alarmCounts_hand4);
    } else if (
      this.portlinkarr4_hand4[0] == -1 &&
      this.portlinkarr4_hand4.length != 0
    ) {
      var index = this.deviceNames1_hand4.findIndex(
        data => data == event.itemValue
      );
      var indexS = this.portlinkremote24_S.findIndex(
        data => data.symbol_name1 == event.itemValue
      );
      var valueS = this.portlinkremote24_S.filter(
        data => data.symbol_name1 == event.itemValue
      );
      var alarm = this.alarmCounts1_hand4[index];
      this.deviceNames_hand4.splice(index, 0, event.itemValue);
      this.alarmCounts_hand4.splice(index, 0, alarm);
      this.portlinkremote24.splice(indexS, 0, valueS[0]);
      this.handleUpdate3(this.deviceNames_hand4, this.alarmCounts_hand4);
    }
  }
  isHighcharts = typeof Highcharts === "object";
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;
  chartOptions: Highcharts.Options = {
    exporting: {
      showTable: false,
      tableCaption: "Data table",
      csv: {
        dateFormat: "%Y-%m-%d"
      }
    },
    title: {
      text: "Today Port Link Down"
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    xAxis: {
      crosshair: true,
      labels: {
        style: {
          color: "black"
        }
      }
    },
    yAxis: {
      title: {
        text: "Alarm Count",
        style: {
          color: "black"
        }
      },
      labels: {
        style: {
          color: "black"
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
      footerFormat:
        '<tr><td style="padding:0">strDesc: </td>' +
        '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
      shared: true,
      useHTML: true
    },
    series: []
  };
  handleUpdate(xAxis: any, yAxis: any, strDesc: any) {
    this.chartOptions.xAxis = {
      categories: xAxis
    };
    this.chartOptions.series[0] = {
      name: "Alarm count",
      type: "column",
      data: yAxis,
      color: "#D35400"
    };

    this.updateFlag = true;
  }

  //-----------------------chart24-------------------------
  isHighcharts1 = typeof Highcharts === "object";
  Highcharts1: typeof Highcharts = Highcharts;
  updateFlag1: boolean = false;
  chartOptions1: Highcharts.Options = {
    exporting: {
      showTable: false,
      tableCaption: "Data table",
      csv: {
        dateFormat: "%Y-%m-%d"
      }
    },
    title: {
      text: "Top Node Down"
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    xAxis: {
      crosshair: true,
      labels: {
        style: {
          color: "black"
        }
      }
    },
    yAxis: {
      title: {
        text: "Alarm Count",
        style: {
          color: "black"
        }
      },
      labels: {
        style: {
          color: "black"
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
      footerFormat:
        '<tr><td style="padding:0">strDesc: </td>' +
        '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
      shared: true,
      useHTML: true
    },
    series: []
  };
  handleUpdate1(xAxis: any, yAxis: any) {
    this.chartOptions1.xAxis = {
      categories: xAxis
    };
    this.chartOptions1.series[0] = {
      name: "Alarm count",
      type: "column",
      data: yAxis
    };

    this.updateFlag1 = true;
  }
  //-----------------------chart-------------------------
  isHighcharts2 = typeof Highcharts === "object";
  Highcharts2: typeof Highcharts = Highcharts;
  updateFlag2: boolean = false;
  chartOptions2: Highcharts.Options = {
    exporting: {
      showTable: false,
      tableCaption: "Data table",
      csv: {
        dateFormat: "%Y-%m-%d"
      }
    },
    title: {
      text: "Today Remote Power off"
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    xAxis: {
      crosshair: true,
      labels: {
        style: {
          color: "black"
        }
      }
    },
    yAxis: {
      title: {
        text: "Alarm Count",
        style: {
          color: "black"
        }
      },
      labels: {
        style: {
          color: "black"
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
      footerFormat:
        '<tr><td style="padding:0">strDesc: </td>' +
        '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
      shared: true,
      useHTML: true
    },
    series: []
  };
  handleUpdate2(xAxis: any, yAxis: any, strDesc: any) {
    this.chartOptions2.xAxis = {
      categories: xAxis
    };
    this.chartOptions2.series[0] = {
      name: "Alarm count",
      type: "column",
      data: yAxis,
      color: "#D35400"
    };

    this.updateFlag2 = true;
  }
  //-----------------------chart24-------------------------
  isHighcharts3 = typeof Highcharts === "object";
  Highcharts3: typeof Highcharts = Highcharts;
  updateFlag3: boolean = false;
  chartOptions3: Highcharts.Options = {
    exporting: {
      showTable: false,
      tableCaption: "Data table",
      csv: {
        dateFormat: "%Y-%m-%d"
      }
    },
    title: {
      text: "Top Remote Power off"
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    xAxis: {
      crosshair: true,
      labels: {
        style: {
          color: "black"
        }
      }
    },
    yAxis: {
      title: {
        text: "Alarm Count",
        style: {
          color: "black"
        }
      },
      labels: {
        style: {
          color: "black"
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
      footerFormat:
        '<tr><td style="padding:0">strDesc: </td>' +
        '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
      shared: true,
      useHTML: true
    },
    series: []
  };
  handleUpdate3(xAxis: any, yAxis: any) {
    this.chartOptions3.xAxis = {
      categories: xAxis
    };
    this.chartOptions3.series[0] = {
      name: "Alarm count",
      type: "column",
      data: yAxis
    };

    this.updateFlag3 = true;
  }
  saveBtn(event) {
    this.showClear = false;
    this.showSave = false;
    this.showEdit = true;
    this.showAdd = false;
    this.showDelete = false;
    // console.log(this.dashboard);
    this.gridOptions = {
      itemChangeCallback: DashboardComponent.itemChange,
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

    this.dashboardService.saveDashboard(this.dashboard).subscribe(result => {});
  }

  clearDashboard(event) {
    this.dashboard = [];
  }

  editBtn(event) {
    this.showClear = true;
    this.showSave = true;
    this.showAdd = true;
    this.showDelete = true;
    this.showEdit = false;

    this.gridOptions = {
      ...this.initialGridOptions,
      itemChangeCallback: DashboardComponent.itemChange,
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

  setEditMode(event) {
    this.isEdit = true;
    // console.log(this.isEdit);
  }

  addWidgetDialog() {
    this.cards = [
      {
        imageUrl: "./assets/img/All_Devices.png",
        altText: "All devices",
        label: "All devices",
        selected: false,
        show: true
      },
      {
        imageUrl: "./assets/img/Switch_Devices.png",
        altText: "Switch devices",
        label: "Switch devices1",
        selected: false,
        show: true,
        indexlist: 1
      },
      {
        imageUrl: "./assets/img/Node_Configuration.png",
        altText: "Node config",
        label: "Node config1",
        selected: false,
        show: true,
        indexlist: 2
      },
      {
        imageUrl: "./assets/img/Line_Group_Online.png",
        altText: "Line Group online",
        label: "Line Group online1",
        selected: false,
        show: true,
        indexlist: 3
      },
      {
        imageUrl: "./assets/img/Backup_devices.png",
        altText: "Back up devices",
        label: "Back up devices1",
        selected: false,
        show: true,
        indexlist: 4
      },
      {
        imageUrl: "./assets/img/line-icon.png",
        altText: "Today LINE message",
        label: "Today LINE message",
        selected: false,
        show: true,
        indexlist: 5
      },
      {
        imageUrl: "./assets/img/Active_VLAN.png",
        altText: "Active VLAN",
        label: "Active VLAN1",
        selected: false,
        show: true,
        indexlist: 6
      },
      {
        imageUrl: "./assets/img/Active_tasks.png",
        altText: "Active tasks",
        label: "Active tasks1",
        selected: false,
        show: true,
        indexlist: 7
      },
      {
        imageUrl: "./assets/img/Alarm_Statistic.png",
        altText: "Alarm Chart",
        label: "stockChart",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/Alarm_list.png",
        altText: "Alarm List",
        label: "alarmlist",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/Alarm_list.png",
        altText: "Top 5 Device Alarm",
        label: "Top 5 Device Alarm",
        selected: false,
        show: true,
        indexlist: 0
      },
      // {
      //   imageUrl: "./assets/img/filter_Alarm.png",
      //   altText: "filterAlarm",
      //   selected: false,
      //   show: true,
      //   indexlist: 0
      // },
      {
        imageUrl: "./assets/img/table_Alarm.png",
        altText: "Alarm Device",
        label: "tableAlarm",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/Today_port_link_down.png",
        altText: "Today Port Link Down",
        label: "TodayPortLinkDown",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/Top_node_down.png",
        altText: "Top Node Down",
        label: "TopNodeDown",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/Today_remote_power_off.png",
        altText: "Today Remote Poweroff",
        label: "TodayRemotePoweroff",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/Today_remote_power_off.png",
        altText: "Top Remote Poweroff",
        label: "TopRemotePoweroff",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/Google_map.png",
        altText: "Topology Maps",
        label: "gmap",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/Bandwidth.png",
        altText: "Bandwidth Charts",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/memory.png",
        altText: "Memory Charts",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/CPU.png",
        altText: "CPU Charts",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/thermometer.png",
        altText: "Temperature Charts",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/knob-chart.png",
        altText: "CPUload Charts",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/celsius.png",
        altText: "Temperature",
        selected: false,
        show: true,
        indexlist: 0
      },
      {
        imageUrl: "./assets/img/memory _donut.png",
        altText: "All memory",
        selected: false,
        show: true,
        indexlist: 0
      }

      // {
      //   imageUrl: "https://picsum.photos/200/300",
      //   altText: "Image 1",
      //   selected: false,
      //   indexlist: 0
      // },
      // {
      //   imageUrl: "https://picsum.photos/200/300",
      //   altText: "Image 1",
      //   selected: false,
      //   indexlist: 0
      // }
    ];
    // console.log(this.cards);
    this.showDialog = true;

    var list: any[] = [];
    list.push(...this.cards);

    if (this.addItemlist.length == 0) {
      for (var i = list.length - 1; i >= 0; i--) {
        for (var j = 0; j < this.dashboard.length; j++) {
          // console.log(this.dashboard[j])
          if (
            (list[i] && list[i].altText == this.dashboard[j].widget.header) ||
            (list[i] && list[i].label == this.dashboard[j].widget.header)
          ) {
            list.splice(i, 1);
          }
        }
      }
      this.cards = [];
      this.cards.push(...list);
      // console.log(this.cards)
    } else {
      for (var i = this.addItemlist.length - 1; i >= 0; i--) {
        for (var j = 0; j < this.dashboard.length; j++) {
          if (
            this.addItemlist[i] &&
            (this.addItemlist[i].altText == this.dashboard[j].widget.header ||
              this.addItemlist[i].label == this.dashboard[j].widget.header)
          ) {
            this.addItemlist.splice(i, 1);
          }
        }
        // console.log(this.cards[i].altText)
      }
      this.cards = [];
      this.cards.push(...this.addItemlist);
      this.addItemlist = [];
      for (var i = 0; i < this.cards.length; i++) {
        if (
          this.cards[i].altText == "Bandwidth Charts" &&
          this.cards[i].selected == true
        ) {
          this.cards[i].selected = false;
        }
        if (
          this.cards[i].altText == "Memory Charts" &&
          this.cards[i].selected == true
        ) {
          this.cards[i].selected = false;
        }
        if (
          this.cards[i].altText == "CPU Charts" &&
          this.cards[i].selected == true
        ) {
          this.cards[i].selected = false;
        }
        if (
          this.cards[i].altText == "Temperature Charts" &&
          this.cards[i].selected == true
        ) {
          this.cards[i].selected = false;
        }
        if (
          this.cards[i].altText == "CPUload Charts" &&
          this.cards[i].selected == true
        ) {
          this.cards[i].selected = false;
        }
        if (
          this.cards[i].altText == "Temperature" &&
          this.cards[i].selected == true
        ) {
          this.cards[i].selected = false;
        }
        if (
          this.cards[i].altText == "All memory" &&
          this.cards[i].selected == true
        ) {
          this.cards[i].selected = false;
        }
      }
    }
  }

  searchGobalData(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/devicelist"], {
      queryParams: { search: this.gobalSearch }
    });
    this.AdminLayoutService.sideiconClass("devicelist");
    this.AdminLayoutService.addOrderBox("path");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  searchbackup(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/devicelist"], {
      queryParams: { is_completed_setup: this.backupSearch }
    });
    this.AdminLayoutService.sideiconClass("devicelist");
    this.AdminLayoutService.addOrderBox("path");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  searchbackups(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/devicelist"], {
      queryParams: { is_backed_up: this.backupSearch }
    });
    this.AdminLayoutService.sideiconClass("devicelist");
    this.AdminLayoutService.addOrderBox("path");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  linegroup(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/linechatbot"]);
    this.AdminLayoutService.sideiconClass("Line Group");
    this.AdminLayoutService.addOrderBox("path");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  taskmanager(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/task"]);
    this.AdminLayoutService.sideiconClass("Task");
    this.AdminLayoutService.addOrderBox("path");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  Dailysentalarm(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/Dailysentalarm"]);
    this.AdminLayoutService.sideiconClass("devicelist");
    this.AdminLayoutService.addOrderBox("path");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateAlarmList() {
    this.alarm_list = this.alarm_lists.filter(item => {
      ////console.log(this.ipFilter.includes("10.208.74.90"));
      ////console.log(item.strIPAddress);

      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.iLevel)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
        //console.log("condition");
        return true;
      } else if (
        this.levelFilter.includes(item.iLevel) &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
        return true;
      }

      return false;
    });
  }

  ngOnDestroy(): void {
    if (this.alarmService.loadalram_interval) {
      clearInterval(this.alarmService.loadalram_interval);
    }
    // Unsubscribe to prevent memory leaks
    // this.mapSubscription.unsubscribe();
  }
  updateAlarmListOut(number) {
    // console.log("HI");
    this.levelFilter = this.levelFilter.filter(function(letter) {
      return letter !== number;
    });
    this.alarm_list = this.alarm_lists.filter(item => {
      ////console.log(this.ipFilter.includes("10.208.74.90"));
      //console.log(item.strIPAddress);

      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.iLevel)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
        //console.log("condition");
        return true;
      } else if (
        this.levelFilter.includes(item.iLevel) &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
        return true;
      }

      return false;
    });

    // console.log(this.alarm_list)

    this.alarm_list = this.alarm_lists.filter(item => {
      ////console.log(this.ipFilter.includes("10.208.74.90"));
      //console.log(item.strIPAddress);

      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.iLevel)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
        //console.log("condition");
        return true;
      } else if (
        this.levelFilter.includes(item.iLevel) &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
        return true;
      }

      return false;
    });
  }
  addLevelFilter(number: number) {
    if (this.isLevelFilter) {
      // console.log('hi')
      // console.log(this.isLevelFilter)
      if (!this.levelFilter.includes(number)) {
        this.levelFilter.push(number);
        this.cardOpacity[number] = 1;
        // console.log('hi')
        this.updateAlarmList();
      } else {
        // this.levelFilter.pop()
        if (this.levelFilter.length == 1) {
          this.clearAllFilter();
        } else {
          this.cardOpacity.filter((opacity, index) => {
            if (index == number) this.cardOpacity[index] = 0.2;
            // this.updateAlarmList();
          });

          this.updateAlarmListOut(number);
        }
      }
    } else {
      this.isLevelFilter = true;
      this.levelFilter.push(number);
      this.updateAlarmList();
      // console.log('hi')
      this.cardOpacity.filter((opacity, index) => {
        if (index != number) this.cardOpacity[index] = 0.2;
        // this.updateAlarmList();
      });
    }
  }

  clearAllFilter() {
    this.isLevelFilter = false;
    this.isIpFilter = false;
    this.levelFilter = [];
    this.ipFilter = [];
    this.cardOpacity.forEach((opacity, index) => {
      //   console.log(opacity);
      this.cardOpacity[index] = 1;
    });
    this.updateAlarmList();
  }

  map_center = {
    lat: 12.923476710250368,
    lng: 100.88244291461436
  };

  alarm_marker_show: number = 0;
  alarm_marker_should_show: number = 0;
  device: number = 0;

  unsync_device: number = 0;
  options: any;
  overlays: any[];
  alarm_marker: any[];

  map: google.maps.Map;

  markerCluster: any;

  setMap(event) {
    //console.log("map ready")
    this.map = event.map;
    let mapStyles = [];
    // console.log(this.themeValue);
    this.mapSubscription = this.themeService.getTheme().subscribe(newData => {
      this.theme = newData;
      let mapStyles = [];
      if (this.theme === "arya-orange") {
        // Define styles for arya-orange(dark)theme
        mapStyles = [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }]
          },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }]
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }]
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }]
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }]
          }
        ];
      } else if (this.theme === "saga-orange") {
        // Define styles for saga-orange theme
      }
      this.map.setOptions({
        styles: mapStyles
      });
    });
    this.markerCluster = new markerClusterer.MarkerClusterer({
      map: event.map,
      markers: this.alarm_marker
    });

    this.alarmService.loadAlarmMakers().subscribe(datas => {
      this.set_cluster(datas);
    });
    //markerCluster.clearMarkers();
  }

  initOverlays() {
    this.options = {
      center: this.map_center,
      zoom: 8,
      streetViewControl: false,
      disableDefaultUI: true
    };
  }

  handleOverlayClick(event) {
    let isMarker = event.overlay.getTitle != undefined;
    //console.log(isMarker);
    if (isMarker) {
    } else {
      //console.log(event);
    }
  }

  set_cluster(markers: any) {
    if (this.intervalfrist == false) {
      this.loaddatamap = markers;
      this.checkloadmap = true;
    } else {
      if (!this.arraysEqual(this.loaddatamap, markers)) {
        this.checkloadmap = true;
      } else {
        this.checkloadmap = false;
      }
    }
    if (this.checkloadmap == true) {
      if (markers.length > 0) {
        this.markerCluster.clearMarkers();
        let marker_show_temp = 0;
        let marker_should_show_temp = 0;
        let unsync = 0;
        let unique = [...new Set(markers.map(item => item.strIPAddress))];

        markers.forEach((marker, index) => {
          marker_should_show_temp++;
          if (!marker.SYMBOL_ID) {
            unsync++;
          } else if (marker.latitude && marker.longitude) {
            marker_show_temp++;
            this.add_marker(marker);
          }
        });
        this.alarm_marker_show = marker_show_temp;
        this.alarm_marker_should_show = marker_should_show_temp;
        this.unsync_device = unsync;
        this.device = unique.length;
      }
    }
  }

  add_marker(marker: any) {
    let icon_path = "";
    if (marker.strName == "port link down") {
      icon_path = "/alarm/portdown.png";
    } else if (marker.strName == "communication failure") {
      icon_path = "/alarm/comunicationalarm.png";
    } else if (marker.strName == "remote device power off") {
      icon_path = "/alarm/poweroff.gif";
    } else {
      if (marker.iLevel == 2) {
        icon_path = "/alarm/major.png";
      } else if (marker.iLevel == 3) {
        icon_path = "/alarm/minor.png";
      } else if (marker.iLevel == 1) {
        icon_path = "/alarm/critical.png";
      }
    }

    let marker_temp = new google.maps.Marker({
      position: { lat: marker.latitude, lng: marker.longitude },
      title: String(marker.iRCAlarmLogID),
      icon: {
        url:
          icon_path != ""
            ? this.alarmService.icon_path + icon_path
            : this.alarmService.defualt_icon_path,
        scaledSize: new google.maps.Size(30, 30) // Specify the width and height here
      },
      id: marker.SYMBOL_ID,
      data: {
        description: marker.strName,
        ip: marker.strIPAddress,
        uptime: marker.strUptime,
        level: marker.iLevel,
        device_id: marker.iRCNetNodeID
      }
    });
    let vlan_data = "";
    var status;
    if (marker.iLevel == 1) {
      status = "Critical";
    } else if (marker.iLevel == 2) {
      status = "Major";
    } else if (marker.iLevel == 3) {
      status = "Minor";
    } else if (marker.iLevel == 4) {
      status = "Warning";
    } else if (marker.iLevel == 5) {
      status = "Unknow";
    }
    vlan_data += `<tr>
          <td style="padding-right: 20px;">${status}</td>
          <td style="padding-left: 10px;">${marker.strName}</td>
          <td style="padding-left: 10px;">${marker.strUptime}</td>
      </tr>`;
    const contentString = ` <p class="m-0" style="color:black">Device Name: ${marker.strDeviceName}</p>
            <p class="m-0" style="color:black">IP: ${marker.strIPAddress}</p>
            <p class="m-0" style="color:black">Device Type: ${marker.iRCNETypeID}</p>
            <p id='clickableItem' style="color:blue"><u>Device detial</u></p>
            <table style="color:black">
                  <tr>
                    <th>Level</th>
                    <th style="padding-left: 10px;">Alarm Name</th>
                    <th style="padding-left: 10px;">Alarm time</th>
                  </tr>
                ${vlan_data}
            </table>`;

    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker_temp.addListener("click", () => {
      infowindow.open({
        anchor: marker_temp,
        //map: this.map,
        shouldFocus: false
      });
      // this.map.setZoom(12.5);
      this.map.setCenter(marker_temp.getPosition() as google.maps.LatLng);
      this.ipFilter.push(marker.strIPAddress);
      this.isIpFilter = true;
      this.updateAlarmList();
    });

    marker_temp.addListener("contextmenu", e => {
      this.marker_device_id = marker.iRCNetNodeID;
      this.marker_device_iRCNETypeID = marker.iRCNETypeID;
      this.marker_ipaddress = marker.strIPAddress;
      this.cm2.show(e.domEvent);
    });
    google.maps.event.addListener(infowindow, "domready", () => {
      //now my elements are ready for dom manipulation
      var clickableItem = document.getElementById("clickableItem");
      clickableItem.addEventListener("click", () => {
        this.AdminLayoutService.sideiconClass("devicelist");
        this.openInNewTab(
          this.router,
          "/device",
          marker.iRCNetNodeID,
          marker.iRCNETypeID,
          marker.strIPAddress
        );
      });
    });
    this.markerCluster.addMarker(marker_temp);
  }
  openInNewTab(
    router: Router,
    namedRoute,
    param1: string,
    param2: string,
    param3: string
  ) {
    let newRelativeUrl = router.createUrlTree([namedRoute], {
      queryParams: { ID: param1, IRCNETypeID: param2, IPadress: param3 }
    });
    let baseUrl = window.location.href.replace(router.url, "");

    window.open(baseUrl + newRelativeUrl, "_blank");
  }
}
