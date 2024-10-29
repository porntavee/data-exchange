import {
  Component,
  OnInit,
  ViewChild,
  Directive,
  ElementRef,
  HostListener
} from "@angular/core";
import { LazyLoadEvent, MenuItem } from "primeng/api";
import { GetalarmlogServiceService } from "@app/getalarmlog-service.service";
import { Alarmcount, Alarmlist, AlarmMarker } from "@app/alarmlog";
//import { Chart } from 'angular-highcharts';
import * as Highcharts from "highcharts";
import { ContextMenu } from "primeng/contextmenu";
import { Title } from "@angular/platform-browser";
import { NavigateService } from "@app/navigateservice";
import { randomInt } from "crypto";
import { isNumeric } from "rxjs/util/isNumeric";
import { stringify } from "@angular/compiler/src/util";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { ThemeService } from "app/theme.service";
import { Subscription } from "rxjs";
import * as xlsx from "xlsx";
import { AdminLayoutService } from "@app/layouts/admin-layout/admin-layout.service";
// import {MarkerClusterer }from "@googlemaps/markerclusterer"
declare var google: any;
declare var markerClusterer: any;

interface portlink {
  alarm_count?: number;
  strDeviceName?: string;
  strLocation?: string;
  strName?: string;
  strDesc?: string;
}
@Component({
  selector: "app-alarm",
  templateUrl: "alarm-trap-history.component.html",
  styleUrls: ["alarm-trap-history.component.css"],
  moduleId: module.id,
  styles: [
    `
      .card-filter {
        cursor: pointer;
      }
    `
  ]
})
export class AlarmTrapHistoryComponent implements OnInit {
  @ViewChild("cm") cm: ContextMenu;
  @ViewChild("cm2") cm2: ContextMenu;
  @ViewChild("cm3") cm3: ContextMenu;
  @ViewChild("cal2") calendar: any;
  contextItems: MenuItem[];
  contextItemsHistory: MenuItem[];
  contextItems2: MenuItem[];
  portlinks: portlink[];
  portlinkss: portlink = {};
  portlink_alarm_count: number[] = [];
  portlink_strLocation: any[] = [];
  portlink_strDesc: any[] = [];
  portlink_strDescs: any[] = [];
  alarm_count: Alarmcount = {};
  total_alarm: number;
  critical_alarm: number;
  major_alarm: number;
  minor_alarm: number;
  warning_alarm: number;
  unknown_alarm: number;
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
  alarm_listfilter: Alarmlist[];
  alarm_lists: Alarmlist[];
  selecteAlarm: Alarmlist;
  selecteAlarmHistory: any;
  alarm_listHistory: any[];
  public gobalSearch = "";
  public backupSearch = "False";
  marker_device_id: string;
  marker_ipaddress: string;
  marker_device_iRCNETypeID: string;
  isLevelFilter: boolean = false;
  isIpFilter: boolean = false;
  loading: boolean = true;
  isLoading: boolean = false;
  cardOpacity: number[] = [1, 1, 1, 1, 1, 1];
  levelFilter: number[] = [];
  ipFilter: string[] = [];
  themeValue: string = this.themeService.theme;
  classLevel: string[] = ["Unknow", "Critical", "Major", "Minor", "Warning"];
  start: any = "";
  end: any = "";
  ip: any = null;
  disableMulti: boolean = true;
  disableMultiEnd: boolean = true;
  rangeDates: Date[];
  selectedtimeStart: any = "";
  selectedtimeEnd: any = "";
  invalidstartH: any;
  invalidstartM: any;
  invalidendH: any;
  invalidendM: any;
  startTimeH: any = 0;
  startTimeH24: any;
  startTimeM: any = 0;
  EndTimeH: any = 0;
  EndTimeH24: number;
  EndTimeM: any = 0;
  timeStart: string;
  timeEnd: string;
  invalidmulti: any;
  maxDate: Date;
  inputIP: any = "";
  isSave: boolean = false;
  visible: boolean = false;
  formattedStartDate: any;
  formattedEndDate: any;
  unixStartDate: any;
  unixEndDate: any;
  islogLoading: boolean = false;
  Searchtxt: any;
  SearchtxtFrist: any;
  // virtual_alarm_list: Alarmlist[];
  itemsAction: MenuItem[];
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
  marker: any;
  ipAddressInput1: string = undefined;
  ipAddressInput2: string = undefined;
  ipAddressInput3: string = undefined;
  ipAddressInput4: string = undefined;
  ipAddress: string;
  ipAddressDropdown = [];
  deviceNameDropdown = [];
  scrollHeight: string = "130px";
  selectedipAddressDropdown: any;
  page:any;

  total_records:any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  size:any = 10;
  setPageSizeOption: any;
  constructor(
    private alarmService: GetalarmlogServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private titleService: Title,
    private navigator: NavigateService,
    public themeService: ThemeService,
    private AdminLayoutService: AdminLayoutService,
    private el: ElementRef
  ) {
    this.titleService.setTitle("SED -Alarm Trap");
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

  ngOnInit() {
    // this.getUniqueIpList(this.start, this.end, this.ip);
    // this.getUniqueIpList();
    this.themeService.currentpage("/alarm");
    this.itemsAction = [
      {
        label: "View device",
        icon: "pi pi-search",
        command: event => {
          this.router.navigate(["/device"], {
            queryParams: {
              ID: this.selecteAlarm.iRCNetNodeID,
              IRCNETypeID: this.selecteAlarm.iRCNETypeID,
              IPadress: this.selecteAlarm.strIPAddress
            }
          });
          this.themeService.currentpage("/devicelist");
          this.AdminLayoutService.sideiconClass("devicelist");
          this.AdminLayoutService.addOrderBox("/device");
        }
      }
    ];
    this.contextItems = [
      {
        label: "View device",
        icon: "pi pi-search",
        command: event => {
          this.router.navigate(["/device"], {
            queryParams: {
              ID: this.selecteAlarm.iRCNetNodeID,
              IRCNETypeID: this.selecteAlarm.iRCNETypeID,
              IPadress: this.selecteAlarm.strIPAddress
            }
          });
          this.themeService.currentpage("/devicelist");
          this.AdminLayoutService.sideiconClass("devicelist");
          this.AdminLayoutService.addOrderBox("/device");
          // this.navigator.navigateToDevice(this.selecteAlarm.iRCNetNodeID);
        }
      }
    ];
    this.contextItemsHistory = [
      {
        label: "View device",
        icon: "pi pi-search",
        command: event => {
          this.router.navigate(["/device"], {
            queryParams: {
              ID: this.selecteAlarmHistory.iRCNetNodeID,
              IRCNETypeID: this.selecteAlarmHistory.device_name,
              IPadress: this.selecteAlarmHistory.strIPAddress
            }
          });
          this.themeService.currentpage("/device");
          // this.navigator.navigateToDevice(this.selecteAlarm.iRCNetNodeID);
        }
      }
    ];
    this.contextItems2 = [
      {
        label: "View device",
        icon: "pi pi-search",

        command: event => {
          this.router.navigate(["/device"], {
            queryParams: {
              ID: this.marker_device_id,
              IRCNETypeID: this.marker_device_iRCNETypeID,
              IPadress: this.marker_ipaddress
            }
          });
          this.themeService.currentpage("/device");
        }
      }
    ];

    this.initOverlays();

    this.cols = [
      { field: "iLevel", header: "Level" },
      { field: "iRCAlarmLogID", header: "Alarm ID" },
      { field: "iRCNETypeID", header: "Device Type" },
      { field: "strIPAddress", header: "IP Address" },
      { field: "strName", header: "Alarm name" },
      { field: "strDeviceName", header: "NE name" },
      { field: "strUptime", header: "Uptime" },
      { field: "strLastTime", header: "Last Time" },
      { field: "strAckTime", header: "Ack Time" },
      { field: "strClearTime", header: "Clear Time" }
    ];

    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    // let Preday = today.getDate() - 1;
    let hour = today.getHours();
    let min = today.getMinutes();
    let findmonth = month < 10 ? "0" + month : month;
    let findday = day < 10 ? "0" + day : day;
    let findhour = hour < 10 ? "0" + hour : hour;
    let findmin = min < 10 ? "0" + min : min;
    this.maxDate = today;
    this.start = year + "-" + findmonth + "-" + findday + " 00:00";
    this.end =
      year + "-" + findmonth + "-" + findday + " " + findhour + ":" + findmin;
    const uniqueDeviceNames = [];

    // this.alarmService
    //   .getAlarmTrapHistory(this.start, this.end, this.ip)
    //   .subscribe(result => {
    //     this.alarm_list = result;
    //     this.loading = false;
    //     this.alarm_lists = result.alarm_list;
    //     const uniqueIpAddresses = [];
    //     result.forEach(data => {
    //       const ipAddress = data.strIPAddress;
    //       if (!uniqueIpAddresses.includes(ipAddress)) {
    //         uniqueIpAddresses.push(ipAddress);
    //       }
    //     });
    //     this.ipAddressDropdown = uniqueIpAddresses.map(ipAddress => ({
    //       name: ipAddress
    //     }));
    //   });
    this.alarmService.currentMessage.subscribe(data => {
      if (data != undefined) {
        this.Searchtxt = data;
        this.SearchtxtFrist = data;
      }
    });
   

 
  }
  paginate(event: LazyLoadEvent) {
    this.loading = true;
    this.page = event.first / event.rows + 1;
    this.setPageSizeOption = event.rows;
    this.size = this.setPageSizeOption;
    if ( this.formattedStartDate != undefined && this.formattedEndDate != undefined){
      this.start = this.formattedStartDate;
      this.end = this.formattedEndDate;
    }
    if (this.inputIP != undefined){
      this.ip = this.inputIP
    }
    this.alarmService
      .getAlarmTrapHistory(this.page,this.size,this.start, this.end, this.ip)
      .subscribe(result => {
        this.loading = false;

        if (this.Searchtxt != undefined) {
          this.alarm_list = result.data.filter(
            data => data.strIPAddress == this.Searchtxt
          );
        } else {
          this.alarm_list = result.data;
        }
        this.alarm_listfilter = result.data;
        this.total_records = result.pages
        const uniqueEntries = [];

        result.data.forEach(data => {
          const ipAddress = data.strIPAddress;
          const strName = data.strOrigDeviceName;
          const entryExists = uniqueEntries.some(
            entry => entry.ipAddress === ipAddress && entry.strName === strName
          );
          if (!entryExists) {
            uniqueEntries.push({ ipAddress, strName });
          }
        });

        this.ipAddressDropdown = uniqueEntries.map(entry => ({
          name: `${entry.ipAddress} | ${entry.strName}`,
          ip: entry.ipAddress
        }));
      });
      this.alarmService.loadalram_interval = setInterval(() => {
        if (this.isSave == false) {
          let today = new Date();
          let day = today.getDate();
          let month = today.getMonth() + 1;
          let year = today.getFullYear();
          let hour = today.getHours();
          let min = today.getMinutes();
          let findhour = hour < 10 ? "0" + hour : hour;
          let findmin = min < 10 ? "0" + min : min;
          let findmonth = month < 10 ? "0" + month : month;
          let findday = day < 10 ? "0" + day : day;
          this.start = year + "-" + findmonth + "-" + findday + " 00:00";
          this.end =
            year +
            "-" +
            findmonth +
            "-" +
            findday +
            " " +
            findhour +
            ":" +
            findmin;
  
          this.alarmService
            .getAlarmTrapHistory(this.page,this.size,this.start, this.end, this.ip)
            .subscribe(result => {
              this.loading = false;
      
              if (this.Searchtxt != undefined) {
                this.alarm_list = result.data.filter(
                  data => data.strIPAddress == this.Searchtxt
                );
              } else {
                this.alarm_list = result.data;
              }
              this.alarm_listfilter = result.data;
              this.total_records = result.pages
              const uniqueEntries = [];
      
              result.data.forEach(data => {
                const ipAddress = data.strIPAddress;
                const strName = data.strOrigDeviceName;
                const entryExists = uniqueEntries.some(
                  entry => entry.ipAddress === ipAddress && entry.strName === strName
                );
                if (!entryExists) {
                  uniqueEntries.push({ ipAddress, strName });
                }
              });
      
              this.ipAddressDropdown = uniqueEntries.map(entry => ({
                name: `${entry.ipAddress} | ${entry.strName}`,
                ip: entry.ipAddress
              }));
            });
        }
      }, 60000);
  }
  menuVlue(selecteAlarm) {
    this.selecteAlarm = { ...selecteAlarm };
  }

  onKeyUpIP(event) {
    this.alarm_list = this.alarm_listfilter;
  }

  getUniqueIpList() {
    const uniqueIpAddresses = [];
    this.alarmService.alarm_history().subscribe(result => {
      result.detail.data.forEach(data => {
        const ipAddress = data.ip_address;

        // Check if the ipAddress is not in the array, then add it to the array
        if (!uniqueIpAddresses.includes(ipAddress)) {
          uniqueIpAddresses.push(ipAddress);
        }
      });

      // Update the ipAddressDropdown variable
      this.ipAddressDropdown = uniqueIpAddresses.map(ipAddress => ({
        name: ipAddress
      }));
    });
  }

  getUniqueDeviceNames() {
    const uniqueDeviceNames = [];

    this.alarmService.alarm_history().subscribe(result => {
      result.detail.data.forEach(data => {
        const deviceName = data.strOrigDeviceName;

        // Check if the deviceName is not in the array, then add it to the array
        if (!uniqueDeviceNames.includes(deviceName)) {
          uniqueDeviceNames.push(deviceName);
        }
      });

      // Update the deviceNameDropdown variable
      this.deviceNameDropdown = uniqueDeviceNames.map(deviceName => ({
        name: deviceName
      }));
    });
  }

  // Call the function

  showPresentData() {
    this.loading = true;
    this.alarm_list = [];
    this.formattedStartDate = undefined;
    this.formattedEndDate = undefined;
    this.inputIP = undefined;
    this.size = 10;
    this.ip = null;
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let hour = today.getHours();
    let min = today.getMinutes();
    let findhour = hour < 10 ? "0" + hour : hour;
    let findmin = min < 10 ? "0" + min : min;
    let findmonth = month < 10 ? "0" + month : month;
    let findday = day < 10 ? "0" + day : day;
    this.start = year + "-" + findmonth + "-" + findday + " 00:00";
    this.end =
      year +
      "-" +
      findmonth +
      "-" +
      findday +
      " " +
      findhour +
      ":" +
      findmin;
    this.alarmService
      .getAlarmTrapHistory(this.page,this.size,this.start, this.end, this.ip)
      .subscribe(result => {
        this.loading = false;

        if (this.Searchtxt != undefined) {
          this.alarm_list = result.data.filter(
            data => data.strIPAddress == this.Searchtxt
          );
        } else {
          this.alarm_list = result.data;
        }
        this.alarm_listfilter = result.data;
        this.total_records = result.pages
        const uniqueEntries = [];

        result.data.forEach(data => {
          const ipAddress = data.strIPAddress;
          const strName = data.strOrigDeviceName;
          const entryExists = uniqueEntries.some(
            entry => entry.ipAddress === ipAddress && entry.strName === strName
          );
          if (!entryExists) {
            uniqueEntries.push({ ipAddress, strName });
          }
        });

        this.ipAddressDropdown = uniqueEntries.map(entry => ({
          name: `${entry.ipAddress} | ${entry.strName}`,
          ip: entry.ipAddress
        }));
      });
    // this.alarmService
    //   .getAlarmTrapHistory(this.start, this.end, this.ip)
    //   .subscribe(result => {
    //     this.alarm_list = result;
    //     const uniqueIpAddresses = [];
    //     result.forEach(data => {
    //       const ipAddress = data.strIPAddress;

    //       // Check if the ipAddress is not in the array, then add it to the array
    //       if (!uniqueIpAddresses.includes(ipAddress)) {
    //         uniqueIpAddresses.push(ipAddress);
    //       }
    //     });

    // Update the ipAddressDropdown variable
    // this.ipAddressDropdown = uniqueIpAddresses.map(ipAddress => ({
    //   name: ipAddress
    // }));
    this.rangeDates = undefined;
    this.isSave = false;
    // this.startArray = [];
    // this.endArray = [];
    const currentDate = new Date();
    this.formattedStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0
    );
    this.formattedEndDate = currentDate;
    this.unixStartDate = Math.floor(this.formattedStartDate.getTime());
    this.unixEndDate = Math.floor(this.formattedEndDate.getTime());
    // });
  }
  onKeyUp(event) {
    if (this.ip == undefined || this.ip == "") {
      this.showPresentData();
    }
  }
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
  }
  join(
    arg0: Date,
    options: (
      | { day: string; month?: undefined }
      | { month: string; day?: undefined }
    )[],
    arg2: string
  ) {
    throw new Error("Method not implemented.");
  }

  exportPDFDialog() {
    this.visible = true;
    // this.getUniqueIpList();
    this.ipAddressInput1 = undefined;
    this.ipAddressInput2 = undefined;
    this.ipAddressInput3 = undefined;
    this.ipAddressInput4 = undefined;
    if (this.formattedStartDate === undefined) {
      const currentDate = new Date();
      this.formattedStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0
      );
      this.formattedEndDate = currentDate;
      this.unixStartDate = Math.floor(this.formattedStartDate.getTime());
      this.unixEndDate = Math.floor(this.formattedEndDate.getTime());
    }
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateAlarmList() {
    this.alarm_list = this.alarm_lists.filter(item => {
      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.iLevel)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
        return true;
      } else if (
        this.levelFilter.includes(item.iLevel) &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
        return true;
      }

      return false;
    });

    this.alarm_list = this.alarm_lists.filter(item => {
      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.iLevel)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.strIPAddress)
      ) {
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
  }

  //-----------------------chart-------------------------
  isHighcharts = typeof Highcharts === "object";
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;
  chartOptions: Highcharts.Options = {
    title: {
      text: "Port Link Down"
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
      crosshair: true
    },
    yAxis: {
      title: {
        text: "Alarm Count"
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
        '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
      // footerFormat: '<tr><td style="padding:0">strDesc: </td>' +
      //     '<td style="padding:0"><b>{strDesc}</b></td></tr>',
      shared: true,
      useHTML: true
    },
    series: []
  };

  //-----------------------chart24-------------------------
  isHighcharts1 = typeof Highcharts === "object";
  Highcharts1: typeof Highcharts = Highcharts;
  updateFlag1: boolean = false;
  chartOptions1: Highcharts.Options = {
    title: {
      text: "Port Link Down ย้อนหลัง 24 ชั่วโมง แยกตามสาขา"
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
      crosshair: true
    },
    yAxis: {
      title: {
        text: "Alarm Count"
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

  //-----------------------map--------------------------

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
  mapSubscription: Subscription;
  theme: string;

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
    if (isMarker) {
    } else {
    }
  }

  exportPDF() {
    this.islogLoading = true;
    this.startArray = [];
    this.endArray = [];
    var date = new Date(this.unixStartDate);
    var lastdate = new Date(this.unixEndDate);
    var indexlist = lastdate.getDate() + 1 - date.getDate();
    var indexlistlast = lastdate.getDate() + 1 - date.getDate();
    if (indexlist != 1) {
      for (let i = 0; i < indexlist; i++) {
        let day = date.getDate() + i;
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = lastdate.getHours();
        if (i + 1 != indexlist) {
          var start = year + "-" + month + "-" + day + " 00:00";
          this.startArray.push(start);
        } else {
          if (hour != 0) {
            var start = year + "-" + month + "-" + day + " 00:00";
            this.startArray.push(start);
          }
        }
      }
      for (let i = 0; i < indexlistlast + 1; i++) {
        let day = date.getDate() + (i + 1);
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        var end = year + "-" + month + "-" + day + " 00:00";
        let hour = lastdate.getHours();

        if (i + 1 < indexlistlast) {
          var end = year + "-" + month + "-" + day + " 00:00";
          this.endArray.push(end);
        } else if (i + 1 == indexlistlast + 1) {
          if (hour != 0) {
            this.endArray.push(this.formattedEndDate);
          }
        }
      }

      for (let r = 0; r < this.startArray.length; r++) {
        var formattedStartDate = new Date(this.startArray[r]);
        var formattedEndDate = new Date(this.endArray[r]);
        var datefirstPickergetTime = formattedStartDate.getTime();
        var datelastPickers = formattedEndDate.getTime();
        let userToken = localStorage.getItem("token");
        var dlast = new Date(),
          monthlast = "" + (dlast.getMonth() + 1),
          daylast = "" + dlast.getDate(),
          yearlast = dlast.getFullYear();
        var createAt = [yearlast, monthlast, daylast].join("");
        var dfilename = new Date(datefirstPickergetTime),
          monthfilename = "" + (dfilename.getMonth() + 1),
          dayfilename = "" + dfilename.getDate();
        var filenameselect = [monthfilename, dayfilename].join("");
        var dfilenamelast = new Date(datelastPickers),
          monthfilenamelast = "" + (dfilenamelast.getMonth() + 1),
          dayfilenamelast = "" + dfilenamelast.getDate();
        var filenameselectlast = [monthfilenamelast, dayfilenamelast].join("");
        const downloadLink: HTMLAnchorElement = document.createElement("a");
        var device_name = this.alarm_list.filter(
          data => data.strIPAddress == this.selectedipAddressDropdown.ip
        );
        const fileName = `${device_name[0].strDeviceName}_dls_${filenameselect}-${filenameselectlast}_${createAt}.pdf`;
        const url = `https://east.sed.in.th/reportapi/api/pty/device_report/devicestatus?report_name=devicestatus&ref_code=&start=${datefirstPickergetTime}&end=${datelastPickers}&file_type=pdf&user_create=test&ip_switch=${this.selectedipAddressDropdown.ip}`;
        const authToken = userToken;
        const headers = new Headers({
          Authorization: `Bearer ${authToken}`
        });
        fetch(url, {
          method: "GET",
          headers: headers
        })
          .then(response => {
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
            this.islogLoading = false;
            this.visible = false;
            this.ipAddressInput1 = undefined;
            this.ipAddressInput2 = undefined;
            this.ipAddressInput3 = undefined;
            this.ipAddressInput4 = undefined;
          })
          .catch(error => {
            this.islogLoading = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error,
              life: 3000
            });
          });
      }
    } else {
      var formattedStartDate = new Date(this.formattedStartDate);
      var formattedEndDate = new Date(this.formattedEndDate);
      var datefirstPickergetTime = formattedStartDate.getTime();
      var datelastPickers = formattedEndDate.getTime();
      let userToken = localStorage.getItem("token");
      var dlast = new Date(),
        monthlast = "" + (dlast.getMonth() + 1),
        daylast = "" + dlast.getDate(),
        yearlast = dlast.getFullYear();
      var createAt = [yearlast, monthlast, daylast].join("");
      var dfilename = new Date(datefirstPickergetTime),
        monthfilename = "" + (dfilename.getMonth() + 1),
        dayfilename = "" + dfilename.getDate();
      var filenameselect = [monthfilename, dayfilename].join("");
      var dfilenamelast = new Date(datelastPickers),
        monthfilenamelast = "" + (dfilenamelast.getMonth() + 1),
        dayfilenamelast = "" + dfilenamelast.getDate();
      var filenameselectlast = [monthfilenamelast, dayfilenamelast].join("");
      const downloadLink: HTMLAnchorElement = document.createElement("a");

      var device_name = this.alarm_list.filter(
        data => data.strIPAddress == this.selectedipAddressDropdown.ip
      );
      const fileName = `${device_name[0].strDeviceName}_dls_${filenameselect}-${filenameselectlast}_${createAt}.pdf`;
      const url = `https://east.sed.in.th/reportapi/api/pty/device_report/devicestatus?report_name=devicestatus&ref_code=&start=${this.unixStartDate}&end=${this.unixEndDate}&file_type=pdf&user_create=test&ip_switch=${this.selectedipAddressDropdown.ip}`;

      const authToken = userToken;
      const headers = new Headers({
        Authorization: `Bearer ${authToken}`
      });
      fetch(url, {
        method: "GET",
        headers: headers
      })
        .then(response => {
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
          this.islogLoading = false;
          this.visible = false;
          this.ipAddressInput1 = undefined;
          this.ipAddressInput2 = undefined;
          this.ipAddressInput3 = undefined;
          this.ipAddressInput4 = undefined;
        })
        .catch(error => {
          this.islogLoading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error,
            life: 3000
          });
        });
    }
  }
  startArray: any[] = [];
  endArray: any[] = [];
  invalidipAddressInput1: string;
  invalidipAddressInput2: string;
  invalidipAddressInput3: string;
  invalidipAddressInput4: string;

  exportToPDF() {
    if (
      // this.ipAddressInput1 === undefined ||
      // this.ipAddressInput2 === undefined ||
      // this.ipAddressInput3 === undefined ||
      // this.ipAddressInput4 === undefined
      this.selectedipAddressDropdown.ip === undefined
    ) {
      if (
        this.formattedStartDate === undefined ||
        this.formattedEndDate === undefined
      ) {
        this.formattedStartDate = new Date();
        this.formattedEndDate = new Date();
      }
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill IP Address",
        life: 3000
      });
      // if (this.ipAddressInput1 === undefined || this.ipAddressInput1 === "") {
      //   this.invalidipAddressInput1 = "ng-invalid ng-dirty";
      // }
      // if (this.ipAddressInput2 === undefined || this.ipAddressInput2 === "") {
      //   this.invalidipAddressInput2 = "ng-invalid ng-dirty";
      // }
      // if (this.ipAddressInput3 === undefined || this.ipAddressInput3 === "") {
      //   this.invalidipAddressInput3 = "ng-invalid ng-dirty";
      // }
      // if (this.ipAddressInput4 === undefined || this.ipAddressInput4 === "") {
      //   this.invalidipAddressInput4 = "ng-invalid ng-dirty";
      // }
    } else {
      this.ipAddress = `${this.ipAddressInput1}.${this.ipAddressInput2}.${this.ipAddressInput3}.${this.ipAddressInput4}`;
      this.invalidipAddressInput1 = "";
      this.invalidipAddressInput2 = "";
      this.invalidipAddressInput3 = "";
      this.invalidipAddressInput4 = "";
      this.exportPDF();
    }
  }

  exportToExcel() {
    const timestamp = this.getTimestamp();
    const fileName = `alarm-trap-history${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.alarm_list);
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
  exportToExcelHistory() {
    const timestamp = this.getTimestamp();
    const fileName = `alarm-histoty${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.alarm_listHistory
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
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

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

  onCloseCalender() {
    this.startTimeH = undefined;
    this.startTimeM = undefined;
    this.EndTimeH = undefined;
    this.EndTimeM = undefined;
  }

  onCancel() {
    this.visible = false;
    this.islogLoading = false;
    this.invalidipAddressInput1 = "";
    this.invalidipAddressInput2 = "";
    this.invalidipAddressInput3 = "";
    this.invalidipAddressInput4 = "";
    this.ipAddressInput1 = undefined;
    this.ipAddressInput2 = undefined;
    this.ipAddressInput3 = undefined;
    this.ipAddressInput4 = undefined;
  }

  onSaveCalendar() {
    this.isLoading = true;
    this.loading = true;
    if (this.rangeDates !== undefined) {
      this.isSave = true;

      if (this.calendar) {
        this.calendar.overlayVisible = false;
      }

      var timestartH =
        this.startTimeH < 10 ? "0" + this.startTimeH : this.startTimeH;
      var timestartM =
        this.startTimeM < 10 ? "0" + this.startTimeM : this.startTimeM;

      if (
        this.rangeDates[0] !== undefined &&
        this.rangeDates[1] !== undefined
      ) {
        let startDate = this.rangeDates[0];
        let endDate = this.rangeDates[1];

        let startYear = startDate.getFullYear();
        let startMonth = ("0" + (startDate.getMonth() + 1)).slice(-2);
        let startDay = ("0" + startDate.getDate()).slice(-2);
        let startHours = ("0" + startDate.getHours()).slice(-2);
        let startMinutes = ("0" + startDate.getMinutes()).slice(-2);
        let startSeconds = ("0" + startDate.getSeconds()).slice(-2);

        this.formattedStartDate =
          startYear +
          "-" +
          startMonth +
          "-" +
          startDay +
          " " +
          timestartH +
          ":" +
          timestartM +
          ":00";

        var timeEndH = this.EndTimeH < 10 ? "0" + this.EndTimeH : this.EndTimeH;
        var timeEndM = this.EndTimeM < 10 ? "0" + this.EndTimeM : this.EndTimeM;

        let endYear = endDate.getFullYear();
        let endMonth = ("0" + (endDate.getMonth() + 1)).slice(-2);
        let endDay = ("0" + endDate.getDate()).slice(-2);
        let endHours = ("0" + endDate.getHours()).slice(-2);
        let endMinutes = ("0" + endDate.getMinutes()).slice(-2);
        let endSeconds = ("0" + endDate.getSeconds()).slice(-2);

        this.formattedEndDate = `${endYear}-${endMonth}-${endDay} ${timeEndH}:${timeEndM}:00`;
        var endlist = new Date(this.formattedEndDate);
        this.unixStartDate = Math.floor(startDate.getTime());
        this.unixEndDate = Math.floor(endlist.getTime());

        this.alarmService
          .getAlarmTrapHistory(
            this.page,this.size,
            this.formattedStartDate,
            this.formattedEndDate,
            this.inputIP
          )
          .subscribe(result => {
            this.loading = false;
    
            if (this.Searchtxt != undefined) {
              this.alarm_list = result.data.filter(
                data => data.strIPAddress == this.Searchtxt
              );
            } else {
              this.alarm_list = result.data;
            }
            this.alarm_listfilter = result.data;
            this.total_records = result.pages
            const uniqueEntries = [];
    
            result.data.forEach(data => {
              const ipAddress = data.strIPAddress;
              const strName = data.strOrigDeviceName;
              const entryExists = uniqueEntries.some(
                entry => entry.ipAddress === ipAddress && entry.strName === strName
              );
              if (!entryExists) {
                uniqueEntries.push({ ipAddress, strName });
              }
            });
    
            this.ipAddressDropdown = uniqueEntries.map(entry => ({
              name: `${entry.ipAddress} | ${entry.strName}`,
              ip: entry.ipAddress
            }));
          });
      } else {
        this.invalidstartH = "ng-invalid ng-dirty";
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please fill date before search",
          life: 3000
        });
      }
    }
  }
}
