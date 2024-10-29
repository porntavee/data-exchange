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
  selector: "app-alarm",
  templateUrl: "alarm.component.html",
  styleUrls: ["alarm.component.css"],
  moduleId: module.id,
  styles: [
    `
      .card-filter {
        cursor: pointer;
      }
    `
  ]
})
export class AlarmComponent implements OnInit {
  @ViewChild("cm") cm: ContextMenu;
  @ViewChild("cm2") cm2: ContextMenu;
  @ViewChild("cm3") cm3: ContextMenu;
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
  cardOpacity: number[] = [1, 1, 1, 1, 1, 1];
  levelFilter: number[] = [];
  ipFilter: string[] = [];
  themeValue: string = this.themeService.theme;
  classLevel: string[] = ["Unknow", "Critical", "Major", "Minor", "Warning"];
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

  constructor(
    private alarmService: GetalarmlogServiceService,
    private router: Router,
    private messageService: MessageService,
    private titleService: Title,
    private navigator: NavigateService,
    public themeService: ThemeService,
    private AdminLayoutService: AdminLayoutService
  ) {
    this.titleService.setTitle("SED-Alarm Trap");
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
    // console.log(this.themeService.theme);
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
    this.themeService.currentpage("/alarm");
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
      this.alarm_lists = result.alarm_list;
    });
    this.alarmService.alarm_history().subscribe(result => {
      result.detail.data.forEach(data => {
        var list = new Date(data.update_time);
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
      this.alarm_listHistory = result.detail.data;
      this.loading = false;
    });
    this.alarmService.loadalram_interval = setInterval(() => {
      this.alarmService.loadStattisticAlarm().subscribe(result => {
        this.alarm_count = result.alarm_count;
        this.alarm_list = result.alarm_list;
        this.critical_alarm = this.alarm_count.critical_alarm;
        this.total_alarm = this.alarm_count.total_alarm;
        this.major_alarm = this.alarm_count.major_alarm;
        this.minor_alarm = this.alarm_count.minor_alarm;
        this.warning_alarm = this.alarm_count.warning_alarm;
        this.unknown_alarm = this.alarm_count.unknown_alarm;
        this.alarm_lists = result.alarm_list;
      });
      // console.log("refrsh")
      //   console.log(this.ipFilter);
      this.updateAlarmList();
      //    console.log(this.alarm_list);

      this.alarmService.loadAlarmMakers().subscribe(datas => {
        this.set_cluster(datas);
      });
    }, 60000);
  }

  menuVlue(selecteAlarm) {
    this.selecteAlarm = { ...selecteAlarm };
  }

  exportPDF() {
    // Create a new jsPDF instance
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

      console.log(autoTable);
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
    //console.log(this.gobalSearch)
    this.router.navigate(["/devicelist"], {
      queryParams: { search: this.gobalSearch }
    });
    this.themeService.currentpage("/devicelist");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  searchbackup(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/devicelist"], {
      queryParams: { is_completed_setup: this.backupSearch }
    });
    this.themeService.currentpage("/devicelist");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  searchbackups(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/devicelist"], {
      queryParams: { is_backed_up: this.backupSearch }
    });
    this.themeService.currentpage("/devicelist");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  linegroup(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/linechatbot"]);
    this.themeService.currentpage("/linechatbot");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  taskmanager(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/task"]);
    this.themeService.currentpage("/task");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  Dailysentalarm(event) {
    event.preventDefault();
    //console.log(this.gobalSearch)
    this.router.navigate(["/Dailysentalarm"]);
    this.themeService.currentpage("/Dailysentalarm");
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateAlarmList() {
    // console.log("HI");

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

    // console.log(this.alarm_list)
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
  ngOnDestroy(): void {
    if (this.alarmService.loadalram_interval) {
      clearInterval(this.alarmService.loadalram_interval);
    }
  }

  addLevelFilter(number: number) {
    // this.updateAlarmList();
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
    lat: 13.72672065693991,
    lng: 100.51438137260944
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

  setMap(event) {
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
    // console.log(mapStyles);
    this.markerCluster = new markerClusterer.MarkerClusterer({
      map: event.map,
      markers: this.alarm_marker
    });
    // console.log("Map styles set successfully");
    // console.log(this.map.setOptions);
    this.alarmService.loadAlarmMakers().subscribe(datas => {
      this.set_cluster(datas);
    });
    //markerCluster.clearMarkers();
  }

  initOverlays() {
    this.options = {
      center: this.map_center,
      zoom: 10.2,
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
        url: icon_path != "" ? this.alarmService.icon_path + icon_path : this.alarmService.defualt_icon_path,
        scaledSize: new google.maps.Size(30, 30)  // Specify the width and height here
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
