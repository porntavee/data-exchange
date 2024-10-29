import { Component, OnInit, ViewChild } from "@angular/core";
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
  selector: "app-alarmhistory",
  templateUrl: "alatmhistory.component.html",
  styleUrls: ["alatmhistory.component.scss"],
  moduleId: module.id,
  styles: [
    `
      .card-filter {
        cursor: pointer;
      }
    `
  ]
})
export class AlatmhistoryComponent implements OnInit {
  @ViewChild("cm") cm: ContextMenu;
  @ViewChild("cm2") cm2: ContextMenu;
  @ViewChild("cm3") cm3: ContextMenu;
  @ViewChild("cal2") calendar: any;
  rangeDates: Date[];
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
  alarm_lists: any[];
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
  cardOpacity: number[] = [1, 1, 1, 1, 1, 1];
  levelFilter: any[] = [];
  ipFilter: string[] = [];
  themeValue: string = this.themeService.theme;
  classLevel: string[] = ["Unknow", "Critical", "Major", "Minor", "Warning"];
  CriticalCard: any;
  WarningCard: any;
  OKCard: any;
  totalCard: any;
  isSave: boolean = false;
  visible: boolean = false;
  formattedStartDate: any;
  formattedEndDate: any;
  unixStartDate: any;
  unixEndDate: any;
  islogLoading: boolean = false;
  itemsAction: MenuItem[];
  // virtual_alarm_list: Alarmlist[];

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
  disableMulti: boolean = true;
  disableMultiEnd: boolean = true;
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
  inputIP: any = "";
  isLoading: boolean = false;
  ipAddressDropdown = [];
  constructor(
    private alarmService: GetalarmlogServiceService,
    private router: Router,
    private messageService: MessageService,
    private titleService: Title,
    private navigator: NavigateService,
    public themeService: ThemeService,
    private AdminLayoutService: AdminLayoutService
  ) {
    this.titleService.setTitle("SED -Alarm Threshold");
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
    this.themeService.currentpage("/alarm");
    this.itemsAction = [
      {
        label: "View device",
        icon: "pi pi-search",
        command: event => {
          this.router.navigate(["/device"], {
            queryParams: {
              ID: this.selecteAlarmHistory.id,
              IRCNETypeID: this.selecteAlarmHistory.model,
              IPadress: this.selecteAlarmHistory.ip_address
            }
          });
          this.themeService.currentpage("/device");
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
              ID: this.selecteAlarmHistory.id,
              IRCNETypeID: this.selecteAlarmHistory.model,
              IPadress: this.selecteAlarmHistory.ip_address
            }
          });
          this.themeService.currentpage("/device");
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
              ID: this.selecteAlarmHistory.id,
              IRCNETypeID: this.selecteAlarmHistory.model,
              IPadress: this.selecteAlarmHistory.ip_address
            }
          });
          this.themeService.currentpage("/devicelist");
          this.AdminLayoutService.sideiconClass("devicelist");
          this.AdminLayoutService.addOrderBox("/device");
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

    this.cols = [
      { field: "iLevel", header: "Level" },
      { field: "iRCAlarmLogID", header: "Alarm ID" },
      { field: "iRCNETypeID", header: "Device Type" },
      { field: "strIPAddress", header: "IP Address" },
      { field: "strName", header: "Alarm name" },
      { field: "strDeviceName", header: "NE name" },
      { field: "strUptime", header: "Uptime" }
    ];

    this.alarmService.loadStattisticAlarm().subscribe(result => {
      this.alarm_count = result.alarm_count;
      this.alarm_list = result.alarm_list;
      this.loading = false;
      this.critical_alarm = this.alarm_count.critical_alarm;
      this.total_alarm = this.alarm_count.total_alarm;
      this.major_alarm = this.alarm_count.major_alarm;
      this.minor_alarm = this.alarm_count.minor_alarm;
      this.warning_alarm = this.alarm_count.warning_alarm;
      this.unknown_alarm = this.alarm_count.unknown_alarm;
    });
    this.alarmService.alarm_history().subscribe(result => {
      result.detail.data.forEach(data => {
        var list = new Date(data.update_time);
        data.alarm_message = data.alarm_message.replace("?C", "°C");

        var dformat =
          list.getFullYear() +
          "-" +
          ("00" + (list.getMonth() + 1)).slice(-2) +
          "-" +
          ("00" + list.getDate()).slice(-2) +
          " " +
          ("00" + list.getHours()).slice(-2) +
          ":" +
          ("00" + list.getMinutes()).slice(-2) +
          ":" +
          ("00" + list.getSeconds()).slice(-2);
        data.update_time = dformat;
      });
      var currentDate = new Date();
      var currentDateformat =
        currentDate.getFullYear() +
        "-" +
        ("00" + (currentDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + currentDate.getDate()).slice(-2);
      var filterlist = result.detail.data.filter(data =>
        data.update_time.includes(currentDateformat)
      );
      this.alarm_listHistory = result.detail.data;
      this.loading = false;
      this.alarm_lists = result.detail.data;
      const arrcri = [];
      const arrwarn = [];
      const arrok = [];
      result.detail.data.forEach(list => {
        if (list.severity == "critical") {
          arrcri.push(list.severity);
        } else if (list.severity == "warning") {
          arrwarn.push(list.severity);
        } else if (list.severity == "ok") {
          arrok.push(list.severity);
        }
      });

      this.CriticalCard = this.numberWithCommas(arrcri.length);
      this.WarningCard = this.numberWithCommas(arrwarn.length);
      this.OKCard = this.numberWithCommas(arrok.length);
      this.totalCard = this.numberWithCommas(result.detail.data.length);
    });
    this.alarmService.loadalram_interval = setInterval(() => {
      this.alarmService.alarm_history().subscribe(result => {
        result.detail.data.forEach(data => {
          var list = new Date(data.update_time);
          data.alarm_message = data.alarm_message.replace("?C", "°C");
          var dformat =
            list.getFullYear() +
            "-" +
            ("00" + (list.getMonth() + 1)).slice(-2) +
            "-" +
            ("00" + list.getDate()).slice(-2) +
            " " +
            ("00" + list.getHours()).slice(-2) +
            ":" +
            ("00" + list.getMinutes()).slice(-2) +
            ":" +
            ("00" + list.getSeconds()).slice(-2);
          data.update_time = dformat;
        });
        var currentDate = new Date();
        var currentDateformat =
          currentDate.getFullYear() +
          "-" +
          ("00" + (currentDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("00" + currentDate.getDate()).slice(-2);
        var filterlist = result.detail.data.filter(data =>
          data.update_time.includes(currentDateformat)
        );
        this.alarm_listHistory = result.detail.data;
        this.loading = false;
        this.alarm_lists = result.detail.data;
        const arrcri = [];
        const arrwarn = [];
        const arrok = [];
        result.detail.data.forEach(list => {
          if (list.severity == "critical") {
            arrcri.push(list.severity);
          } else if (list.severity == "warning") {
            arrwarn.push(list.severity);
          } else if (list.severity == "ok") {
            arrok.push(list.severity);
          }
        });

        this.CriticalCard = this.numberWithCommas(arrcri.length);
        this.WarningCard = this.numberWithCommas(arrwarn.length);
        this.OKCard = this.numberWithCommas(arrok.length);
        this.totalCard = this.numberWithCommas(result.detail.data.length);
      });
      this.updateAlarmList();
    }, 60000);
  }
  showPresentData() {
    this.alarmService.alarm_history().subscribe(result => {
      result.detail.data.forEach(data => {
        var list = new Date(data.update_time);
        data.alarm_message = data.alarm_message.replace("?C", "°C");

        var dformat =
          list.getFullYear() +
          "-" +
          ("00" + (list.getMonth() + 1)).slice(-2) +
          "-" +
          ("00" + list.getDate()).slice(-2) +
          " " +
          ("00" + list.getHours()).slice(-2) +
          ":" +
          ("00" + list.getMinutes()).slice(-2) +
          ":" +
          ("00" + list.getSeconds()).slice(-2);
        data.update_time = dformat;
      });
      var currentDate = new Date();
      var currentDateformat =
        currentDate.getFullYear() +
        "-" +
        ("00" + (currentDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + currentDate.getDate()).slice(-2);
      var filterlist = result.detail.data.filter(data =>
        data.update_time.includes(currentDateformat)
      );
      this.alarm_listHistory = result.detail.data;
      this.loading = false;
      this.alarm_lists = result.detail.data;
      const arrcri = [];
      const arrwarn = [];
      const arrok = [];
      const uniqueEntries = [];
      result.detail.data.forEach(list => {
        if (list.severity == "critical") {
          arrcri.push(list.severity);
        } else if (list.severity == "warning") {
          arrwarn.push(list.severity);
        } else if (list.severity == "ok") {
          arrok.push(list.severity);
        }
        const ipAddress = list.ip_address;
        const strName = list.device_name;
        const entryExists = uniqueEntries.some(
          entry => entry.ipAddress === ipAddress && entry.strName === strName
        );
        if (!entryExists) {
          uniqueEntries.push({ ipAddress, strName });
        }
      });

      this.CriticalCard = this.numberWithCommas(arrcri.length);
      this.WarningCard = this.numberWithCommas(arrwarn.length);
      this.OKCard = this.numberWithCommas(arrok.length);
      this.totalCard = this.numberWithCommas(result.detail.data.length);
    });

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

  menuVlue(selecteAlarm) {
    this.selecteAlarmHistory = { ...selecteAlarm };
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
  onSaveCalendar() {
    this.isLoading = true;

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

        this.formattedEndDate = `${endYear}-${endMonth}-${endDay} ${timeEndH}:${timeEndM}`;
        var endlist = new Date(this.formattedEndDate);
        this.unixStartDate = Math.floor(startDate.getTime());
        this.unixEndDate = Math.floor(endlist.getTime());

        this.alarmService
          .alarm_historybetween(this.formattedStartDate, this.formattedEndDate)
          .subscribe(result => {
            this.isLoading = false;
            result.detail.data.forEach(data => {
              var list = new Date(data.update_time);
              data.alarm_message = data.alarm_message.replace("?C", "°C");

              var dformat =
                list.getFullYear() +
                "-" +
                ("00" + (list.getMonth() + 1)).slice(-2) +
                "-" +
                ("00" + list.getDate()).slice(-2) +
                " " +
                ("00" + list.getHours()).slice(-2) +
                ":" +
                ("00" + list.getMinutes()).slice(-2) +
                ":" +
                ("00" + list.getSeconds()).slice(-2);
              data.update_time = dformat;
            });
            var currentDate = new Date();
            var currentDateformat =
              currentDate.getFullYear() +
              "-" +
              ("00" + (currentDate.getMonth() + 1)).slice(-2) +
              "-" +
              ("00" + currentDate.getDate()).slice(-2);
            var filterlist = result.detail.data.filter(data =>
              data.update_time.includes(currentDateformat)
            );
            this.alarm_listHistory = result.detail.data;
            this.loading = false;
            this.alarm_lists = result.detail.data;
            const arrcri = [];
            const arrwarn = [];
            const arrok = [];
            result.detail.data.forEach(list => {
              if (list.severity == "critical") {
                arrcri.push(list.severity);
              } else if (list.severity == "warning") {
                arrwarn.push(list.severity);
              } else if (list.severity == "ok") {
                arrok.push(list.severity);
              }
            });

            this.CriticalCard = this.numberWithCommas(arrcri.length);
            this.WarningCard = this.numberWithCommas(arrwarn.length);
            this.OKCard = this.numberWithCommas(arrok.length);
            this.totalCard = this.numberWithCommas(result.detail.data.length);

            this.loading = false;
            this.startTimeH = 0;
            this.startTimeM = 0;
            this.EndTimeH = 0;
            this.EndTimeM = 0;
            this.inputIP = "";
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
  exportPDF() {
    const pdf = new jsPDF();
    var head = ["Critical", "Major", "Minor", "Warning", "Unknown", "Total"];
    var body = [["Test"]];
    var imgWidth = 20;
    var imgHeight = 10;
    var pageWidth = pdf.internal.pageSize.getWidth();
    var xPosition = (pageWidth - imgWidth) / 2;
    pdf.addImage(
      "assets/img/National_Telecom_Logo1.png",
      xPosition,
      10,
      imgWidth,
      imgHeight
    );
    pdf.save("table.pdf");
    pdf.text("Alarm Summary", 14, 50, {});
    this.alarmService.loadStattisticAlarm().subscribe(result => {
      this.critical_alarm = this.alarm_count.critical_alarm;
      this.total_alarm = this.alarm_count.total_alarm;
      this.major_alarm = this.alarm_count.major_alarm;
      this.minor_alarm = this.alarm_count.minor_alarm;
      this.warning_alarm = this.alarm_count.warning_alarm;
      this.unknown_alarm = this.alarm_count.unknown_alarm;

      autoTable(pdf, {
        head: [head],
        body: body,
        startY: 55
      });
      pdf.text("Alarm Nofications Report", 14, 80, {});
      var head2 = [
        "Alarm ID",
        "Device Type",
        "IP Address",
        "Alarm name",
        "NE name",
        "Uptime",
        "Level"
      ];
      pdf.save("table.pdf");
    });
  }

  searchGobalData(event) {
    event.preventDefault();
    this.router.navigate(["/devicelist"], {
      queryParams: { search: this.gobalSearch }
    });
    this.themeService.currentpage("/devicelist");
  }
  searchbackup(event) {
    event.preventDefault();
    this.router.navigate(["/devicelist"], {
      queryParams: { is_completed_setup: this.backupSearch }
    });
    this.themeService.currentpage("/devicelist");
  }
  searchbackups(event) {
    event.preventDefault();
    this.router.navigate(["/devicelist"], {
      queryParams: { is_backed_up: this.backupSearch }
    });
    this.themeService.currentpage("/devicelist");
  }
  linegroup(event) {
    event.preventDefault();
    this.router.navigate(["/linechatbot"]);
    this.themeService.currentpage("/linechatbot");
  }
  taskmanager(event) {
    event.preventDefault();
    this.router.navigate(["/task"]);
    this.themeService.currentpage("/task");
  }
  Dailysentalarm(event) {
    event.preventDefault();
    this.router.navigate(["/Dailysentalarm"]);
    this.themeService.currentpage("/Dailysentalarm");
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateAlarmList() {
    this.alarm_listHistory = this.alarm_lists.filter(item => {
      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.severity)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.ip_address)
      ) {
        return true;
      } else if (
        this.levelFilter.includes(item.severity) &&
        this.ipFilter.includes(item.ip_address)
      ) {
        return true;
      }

      return false;
    });

    this.alarm_listHistory = this.alarm_lists.filter(item => {
      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.severity)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.ip_address)
      ) {
        //console.log("condition");
        return true;
      } else if (
        this.levelFilter.includes(item.severity) &&
        this.ipFilter.includes(item.ip_address)
      ) {
        return true;
      }

      return false;
    });

    // console.log(this.alarm_list)
  }

  ngOnDestroy(): void {
    if (this.alarmService.loadalram_interval) {
      clearInterval(this.alarmService.loadalram_interval);
    }
  }
  updateAlarmListOut(txt) {
    this.levelFilter = this.levelFilter.filter(function(letter) {
      return letter !== txt;
    });
    this.alarm_listHistory = this.alarm_lists.filter(item => {
      ////console.log(this.ipFilter.includes("10.208.74.90"));

      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.severity)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.ip_address)
      ) {
        //console.log("condition");
        return true;
      } else if (
        this.levelFilter.includes(item.severity) &&
        this.ipFilter.includes(item.ip_address)
      ) {
        return true;
      }

      return false;
    });

    // console.log(this.alarm_list)

    this.alarm_listHistory = this.alarm_lists.filter(item => {
      ////console.log(this.ipFilter.includes("10.208.74.90"));
      //console.log(item.ip_address);

      if (!this.isIpFilter && !this.isLevelFilter) {
        return true;
      } else if (!this.isIpFilter && this.levelFilter.includes(item.severity)) {
        return true;
      } else if (
        !this.isLevelFilter &&
        this.ipFilter.includes(item.ip_address)
      ) {
        //console.log("condition");
        return true;
      } else if (
        this.levelFilter.includes(item.severity) &&
        this.ipFilter.includes(item.ip_address)
      ) {
        return true;
      }

      return false;
    });
  }
  addLevelFilter(number: number, txt) {
    // this.updateAlarmList();
    if (this.isLevelFilter) {
      // console.log(this.isLevelFilter)
      if (!this.levelFilter.includes(txt)) {
        this.levelFilter.push(txt);
        this.cardOpacity[number] = 1;

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
          this.updateAlarmListOut(txt);
        }
      }
    } else {
      this.isLevelFilter = true;
      this.levelFilter.push(txt);
      this.updateAlarmList();

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
  // loadCarsLazy(event: LazyLoadEvent) {
  //     //simulate remote connection with a timeout
  //     setTimeout(() => {
  //         //console.log(this.alarm_list)
  //         //load data of required page
  //         let loadedAlarms = this.alarm_list.slice(event.first, (event.first + event.rows));

  //         //populate page of virtual cars
  //         Array.prototype.splice.apply(this.virtual_alarm_list, [...[event.first, event.rows], ...loadedAlarms]);

  //         //trigger change detection
  //         this.virtual_alarm_list = [...this.virtual_alarm_list];
  //     }, Math.random() * 1000 + 250);
  // }

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
  handleUpdate1(xAxis: any, yAxis: any) {
    this.chartOptions1.xAxis = {
      categories: xAxis
    };
    this.chartOptions1.series[0] = {
      type: "column",
      data: yAxis
    };

    this.updateFlag1 = true;
  }

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

  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `alarm${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.alarm_lists
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
  exportToExcelHistory() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
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
}
