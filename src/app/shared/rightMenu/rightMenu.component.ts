import { Component, ElementRef, OnDestroy, OnInit, ChangeDetectorRef } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { DomHandler } from "primeng/dom";
import { Subscription } from "rxjs";
import { DialogModule } from "primeng/dialog";
// import { backofficeWebsocket } from "@app/shared/rightMenu/backofficeWebsocket.service";
import { data } from "jquery";
import jwt_decode from "jwt-decode";
import * as moment from 'moment'
import { MessageService, ConfirmationService,MenuItem, PrimeNGConfig,MegaMenuItem } from "primeng/api";
import { Location } from "@angular/common";
import { ROUTES } from "@app/sidebar/sidebar.component";
import { rightMenuService } from "@app/shared/rightMenu/rightMenu.service";
import HC_stock from "highcharts/modules/stock";
import { ThemeService } from "app/theme.service";
import * as Highcharts from "highcharts";
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
// import { MenuItem, PrimeNGConfig,MegaMenuItem } from "primeng/api";
interface ExtendedPlotCandlestickDataGroupingOptions
  extends Highcharts.DataGroupingOptionsObject {
  enabled: boolean;
}

HC_stock(Highcharts);
export interface listDatamaps {
  SYMBOL_ID?: string;
  date?: string;
  msisdn?: string;
  imsi?: string;
  country_name?: string;
  network_name?: string;
  network_type?: string;
  mcc?: string;
  mnc?: string;
  lac?: string;
  ci?: string;
  location_age?: string;
  subscriber_status?: string;
  latitude?: string;
  longitude?: string;
  position?: string;
  address?: string;
  sessionId?: string;
}
@Component({
  selector: "right-menu",
  templateUrl: "rightMenu.component.html",
  styleUrls: ["rightMenu.component.scss"],

})
export class RightMenuComponent implements OnInit, OnDestroy {
  visibleSidebar2;
  active: boolean;
  listData: listDatamaps = {};
  scale: number = 14;
  scales: number[] = [12, 13, 14, 15, 16];
  zone_id:number;
  outsideClickListener: any;
  date7: Date;
  orders = [];
  dialogHeader: any;
  orderDialog: boolean = false;
  subscription: Subscription;
  showsuper: boolean = false;
  public role: any;
  dateSelected: Date;
  maxDate: Date;
  latitude: any;
  longitude: any;
  location: Location;
  dateAt: any;
  showScreen: boolean = true;
  nameSearch: string;
  ipSearch: string;
  hasNoSearchResult: boolean = false;
  symbolData: any = [];
  symbolDataAdded: any[] = [];
  symbolString: any[] = [];
  showadd: boolean = true;
  showdelete: boolean = false;
  classbutton: any;
  txtbutton: any;
  selectedData: any;
  selectedDataEdit: any;
  listhour: any[] = [];
  listminute: any[] = [];
  selectedHour: any;
  selectedHourEdit: any;
  selectedMinute: any;
  selectedMinuteEdit: any;
  isThen: any[] = [];
  selectedisThen: any;
  selectedisThenEdit: any;
  datalist: any[];
  array_data: any[] = [];
  array_dataEdit: any[] = [];
  listifIndex: any[] = [];
  disablelist: boolean = false;
  selecteddatalist: any;
  selecteddatalistEdit: any;
  selectedPortChart: any;
  selectedPortChartEdit:any;
  isthenValue: any;
  invinvalidhour: string = "";
  invinvalidminute: string = "";
  invinvalidCharttype: string = "";
  invinvalidPort: string = "";
  invinvalidselectedisThen: string = "";
  invinvalidisthenValue: string = "";
  selectionMode: string;
  dataDeviceconfig:any[] = [];
  items: MenuItem[];
  actionItems: MenuItem[] | undefined;
  listEditData:any[] = [];
  editListdataDialog: boolean = false;
  isthenValueEdit:any;
  device_ip:string;
  device_name:string;
  showpopup: boolean = true;
  invinvalidisthenValueedit:string;
  itemsAction: MenuItem[];
  items12: MenuItem[];
  showMenu: boolean = false;
  Listmenu:any;
  resultport:any;
  Priority:any[] = [];
  selectedPriority:any;
  invinvalidPriority:string;
  constructor(
    private el: ElementRef,
    // private webSocketService: backofficeWebsocket,
    private messageService: MessageService,
    location: Location,
    private rightMenuService: rightMenuService,
    private changeDetection: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    public themeService: ThemeService
  ) {
    this.location = location;
  }

  ngOnInit() {
    // this.createChartLine();
   this.Priority = [
    { level:1,value:"Critical"},
    { level:2,value:"Major"},
    { level:3,value:"Minor"},
    { level:4,value:"Warning"},
    { level:5,value:"Unknown"}
  ]
 
    // console.log("HI")
    this.primengConfig.ripple = true;
  
    if (window.screen.width > 840) { // 768px portrait
      this.showScreen = true;
    } else {
      this.showScreen = false;
    }
    let userdata = jwt_decode(localStorage.getItem("token"));
    let role = userdata["role"];
    this.role = role;
    this.zone_id = userdata["zone"]
    if (role == "super admin" || role == "admin") {
      this.showsuper = true;
    } else {
      this.showsuper = false;
    }
    this.rightMenuService.getAlarmConfig(this.zone_id).subscribe({
      next: result => {
        this.dataDeviceconfig = result.detail.data

      },
      error: error => {
        if (error.status == 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        }
        if (error.status == "400") {
          // console.log("hi")
          this.dataDeviceconfig = [{
            alarmType: "No seacrh result."
          }];
        //  this.dataDeviceconfig[0].port.port = "No seacrh result."
        }
      }
    });
   
    this.rightMenuService.currentMessage.subscribe(dataDeviceconfig => {
      if (dataDeviceconfig != undefined){
        this.showMenu = true;
        
        this.itemsAction = [{
          label: 'dataDeviceconfig',
          items: [
                  {
                    label: "View",
                    icon: "pi pi-fw pi-search",
                    command: event => {
                      this.showMenu = false;
                      this.ViewListdata(dataDeviceconfig);
                    }
                  },
                  {
                    label: "Edit",
                    icon: "pi pi-fw pi-pencil",
                    command: event => {
                      this.showMenu = false;
                      this.editListdata(dataDeviceconfig);
                    }
                  },
                  {
                    label: "Delete",
                    icon: "pi pi-trash",
                    command: event => {
                      this.showMenu = false;
                      this.deleteData(dataDeviceconfig);
                    }
                  }
                ]}
      ];
      } else {
        this.showMenu = false;
        this.itemsAction = [{
          label: 'dataDeviceconfig',
          items: [
                  {
                    label: "View",
                    icon: "pi pi-fw pi-search",
                    command: event => {
                      this.showMenu = false;
                      this.ViewListdata(dataDeviceconfig);
                    }
                  },
                  {
                    label: "Edit",
                    icon: "pi pi-fw pi-pencil",
                    command: event => {
                      // this.editListdata(dataDeviceconfig);
                    }
                  },
                  {
                    label: "Delete",
                    icon: "pi pi-trash",
                    command: event => {
                      // this.editListdata(dataDeviceconfig);
                    }
                  }
                ]}
      ];
      }
     
    })
 
    document.addEventListener('click', (event:any) => {
      if (event.target.id != "MenuItemlist" && event.target.id != "iconMenuItemlist"){
        this.showMenu = false;
      } else if (event.target.id == "MenuItemlist" && event.target.id == "iconMenuItemlist") {
        this.showMenu = true;
      }

    });
    this.maxDate = new Date();

  }
  onChangePriority(event){
    this.invinvalidPriority = ""
  }
  menuVlue(task){
    this.Listmenu = task;
    this.showMenu = true;
    this.rightMenuService.valueSource(task);
  }
  // test(){
  //   console.log("hi")
  // }
  ViewListdataDialog:boolean;
  colortitle:string;
  checkchartmem:boolean;
  loading:boolean;
  array_dataMem:any[];
  ViewListdata(data){
    this.array_dataEdit = [];
    this.disablelist = false;
    this.ViewListdataDialog = true;
    this.dialogHeader = "View Alarm Device Log"
    this.active = false;
    this.device_ip = data.ip;
    this.device_name = data.deviceName;
    this.selectedDataEdit = data;
    var index = this.datalist.findIndex(list => list.name == data.alarmType)
    this.selecteddatalistEdit = this.datalist[index]
    var indexisThen = this.isThen.findIndex(list => list.name == data.compareType)
    this.selectedisThenEdit = this.isThen[indexisThen];
    this.isthenValueEdit = data.compareValue;
    var indexHour = this.listhour.findIndex(list => list.hour == data.interval.hour)
    this.selectedHourEdit = this.listhour[indexHour];
    var indexMinute = this.listminute.findIndex(list => list.minute == data.interval.minute)
    this.selectedMinuteEdit = this.listminute[indexMinute]
    if (data.port.port == null){
      this.disablelist = true;
      var date = new Date();
      var start = date.setDate(date.getDate() - 1);
      var end = new Date().getTime();
      this.themeService.currentcolorMessage.subscribe(value => {
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c";
          if (this.selecteddatalistEdit.name == "Memory Utilization"){
            this.getRangeMemory(start,end,this.isthenValueEdit)
          }
        } else {
          this.colortitle = "#FFFFFF"; 
          if (this.selecteddatalistEdit.name == "Memory Utilization"){
            this.getRangeMemory(start,end,this.isthenValueEdit)
          }
        }
      })
      
    } else {
      this.rightMenuService.getSysInterface(data.ip).subscribe({
        next: result => {
          this.disablelist = false;
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
            this.array_dataEdit.push(array_data);
          });
          var indexport = this.array_dataEdit.findIndex(list => list.port == data.port.port)
          this.selectedPortChartEdit = this.array_dataEdit[indexport]
          var ifIndex = result.data.map(function (singleElement) {
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
    
    // setTimeout(() => {
    //   this.createChartLine()
    // }, 1000);
    
    // console.log(data)

  }
  listdataValue:any[] = []
  getRangeMemory(start,end,isthenValueEdit){
    this.listdataValue = []
    this.rightMenuService.getRangeMemory(this.device_ip, start, end).subscribe({
      next: results => {
        this.checkchartmem = true;
        if (results.data == null || results.data.length == 0) {
          this.loading = false;
          this.checkchartmem = false;
          this.array_dataMem = [];
        } else {
          this.loading = false;
          if (results.data.total.length != 0 && results.data.available.length && results.data.usage.length){
          this.array_dataMem = results.data;
          this.checkchartmem = true;
          results.data.total.forEach(data => {
            var index0 = Object.values(data)[0]
           this.listdataValue.push([index0,isthenValueEdit])
          })
          // results.data.push()
          this.createChartLine(results)
          } else {
            this.array_dataMem = []
          }
          
        }
      },
      error: error => {
        if (error) {
          this.checkchartmem = false;
          this.loading = false;
        }
      }
    });
  }
  createChartLine(results) {
    setTimeout(() => {
      Highcharts.chart('chart-line', {
        time: {
          timezoneOffset: -7 * 60
        },
        chart: {
          type: 'line',
          zoomType: "x",
          backgroundColor: "transparent"
        },
        title: {
          text: 'Memory Utilization',
          style: {
            color: this.colortitle
          }
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false,
        },
        legend: {
          itemStyle: {
            color: this.colortitle
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
        xAxis: {
          type: "datetime",
          gridLineWidth: 1,
          time: {
            timezone: "Asia/Bangkok"
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
        series: [{
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
        },
        {
          type: "area",
          name: "Alarm Value",
          data: this.listdataValue,
          color: "#FFA726",
          dashStyle: "longdash",
          lineWidth: 2,
          opacity:0.3,
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
        }],
      } as any);
    }, 100);
  

    // setInterval(() => {
    //   date.setDate(date.getDate() + 1);
    //   chart.series[0].addPoint([`${date.getDate()}/${date.getMonth() + 1}`, this.getRandomNumber(0, 1000)], true, true);
    // }, 1500);
  }
  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  editListdata(data){
    this.array_dataEdit = [];
    this.disablelist = false;
    this.editListdataDialog = true;
    this.dialogHeader = "Edit Alarm Device Log"
    this.active = false;
    this.device_ip = data.ip;
    this.device_name = data.deviceName;
    this.selectedDataEdit = data;
    var index = this.datalist.findIndex(list => list.name == data.alarmType)
    this.selecteddatalistEdit = this.datalist[index]
    if (data.port.port == null){
      this.disablelist = true;
    } else {
      this.rightMenuService.getSysInterface(data.ip).subscribe({
        next: result => {
          this.disablelist = false;
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
            this.array_dataEdit.push(array_data);
          });
          var indexport = this.array_dataEdit.findIndex(list => list.port == data.port.port)
          this.selectedPortChartEdit = this.array_dataEdit[indexport]
          var ifIndex = result.data.map(function (singleElement) {
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
    var indexisThen = this.isThen.findIndex(list => list.name == data.compareType)
    this.selectedisThenEdit = this.isThen[indexisThen];
    this.isthenValueEdit = data.compareValue;
    var indexHour = this.listhour.findIndex(list => list.hour == data.interval.hour)
    this.selectedHourEdit = this.listhour[indexHour];
    var indexMinute = this.listminute.findIndex(list => list.minute == data.interval.minute)
    this.selectedMinuteEdit = this.listminute[indexMinute]
    // console.log(this.device_ip)
    // console.log(data)

  }
  hideDialog(){
    this.editListdataDialog = false;
    this.active = true;
  }
  actionItem(provisionTask: any) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Location",
            icon: "pi pi-fw pi-map-marker",
            command: event => {
              // this.provisionTaskShowLocation(provisionTask);
            }
          },
          {
            label: "Information",
            icon: "pi pi-fw pi-info",
            command: event => {
              // this.provisionTaskRead(provisionTask);
            }
          },
          {
            label: "Recovery",
            icon: "pi pi-fw pi-refresh",
            command: event => {
              // this.provisionTaskRecovery(provisionTask);
            }
          }
        ]
      }
    ];
  }
  searchSymbol() {
    this.selectedData = [];
    if (this.nameSearch) {
      this.rightMenuService
        .searchSymbolByName(this.nameSearch)
        .subscribe(result => {
          if (result.length != 0) {
            this.hasNoSearchResult = false;
            this.symbolData = result;
            this.selectionMode = "multiple";
          } else {
            this.symbolData = [{
              SYMBOL_NAME1: "No seacrh result."
            }];
            this.selectionMode = "";
            this.hasNoSearchResult = true;
          }
        });
    } else if (this.ipSearch) {
      this.rightMenuService
        .searchSymbolByIP(this.ipSearch)
        .subscribe(result => {
          if (result && result.length > 0) {
            // console.log("HI")
            this.hasNoSearchResult = false;
            this.symbolData = result;
            // console.log(result)
            this.selectionMode = "multiple";
          } else {
            // console.log("HI2")
            this.hasNoSearchResult = true;
            this.symbolData = [{
              SYMBOL_NAME1: "No seacrh result."
            }];
            this.selectionMode = "";
            // console.log(this.symbolData)
            // this.hasNoSearchResult = true;
          }
        });
    }

  }
  deleteData(data){
    // console.log(data)
    this.active = false;
    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete this script" +
        " " +
        data.deviceName +
        " " +
        "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.rightMenuService.deleteAlarmConfig(data, this.zone_id).subscribe({
          next: result => {
           this.active = true;
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: result.detail.message,
              life: 3000
            });
            this.rightMenuService.getAlarmConfig(this.zone_id).subscribe({
              next: result => {
                this.dataDeviceconfig = result.detail.data
                
                // console.log(this.dataDeviceconfig)
              },
              error: error => {
                if (error.status == 401) {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Session expired, please logout and login again."
                  });
                }
                if (error.status == "400") {
                  // console.log("hi")
                  this.dataDeviceconfig = [{
                    alarmType: "No seacrh result."
                  }];
                //  this.dataDeviceconfig[0].port.port = "No seacrh result."
                }
              }
            });
            // console.log(result)
          },
          error: error => {
            console.log(error)
          }
        })
        // this.changeDetection.detectChanges();
       
        // this.changeDetection.detectChanges();
      }
    });
   
  }
  saveeditData(){
  
    if (this.isthenValueEdit == null || this.isthenValueEdit == "" ){
      this.invinvalidisthenValueedit = "ng-invalid ng-dirty";
    } else {
      this.invinvalidisthenValueedit = "";
      this.rightMenuService.EditAlarmConfig(this.selectedPortChartEdit, parseInt(this.selectedHourEdit.hour), parseInt(this.selectedMinuteEdit.minute), parseInt(this.isthenValueEdit), this.selectedisThenEdit.name, this.selecteddatalistEdit, this.selectedDataEdit, this.zone_id).subscribe({
        next: result => {
          // console.log(result)
          this.editListdataDialog = false;
          this.active = true;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: result.detail.message,
            life: 3000
          });
          this.rightMenuService.getAlarmConfig(this.zone_id).subscribe({
            next: result => {
              this.dataDeviceconfig = result.detail.data
              
              // console.log(this.dataDeviceconfig)
            },
            error: error => {
              if (error.status == 401) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Session expired, please logout and login again."
                });
              }
              if (error.status == "400") {
                // console.log("hi")
                this.dataDeviceconfig = [{
                  alarmType: "No seacrh result."
                }];
              //  this.dataDeviceconfig[0].port.port = "No seacrh result."
              }
            }
          });
          // console.log(result)
        },
        error: error => {
          if (error.status == "409") {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Do not add data duplicate.Please try again."
            });
          }
        }
      })
    }
  }
  SavedataThreshold() {
   
    if (this.selectedHour != undefined && this.selectedMinute != undefined && this.selectedPriority != undefined && this.selecteddatalist != undefined && this.isthenValue != undefined && this.selectedData != undefined) {
      if (this.selecteddatalist != "BandwidthCharts") {
        this.invinvalidPort = "";

      } else {
        if (this.selectedPortChart == undefined) {
          this.invinvalidPort = "ng-invalid ng-dirty";
        }
      }
      
      this.invinvalidisthenValue = "";
      this.invinvalidCharttype = "";
      this.invinvalidhour = "";
      this.invinvalidminute = "";
      this.invinvalidPriority = "";
      // console.log('hour', this.selectedHour)
      // console.log('minute', this.selectedMinute);
      // console.log('dataList', this.selecteddatalist);
      // console.log('isThen', this.isthenValue);
     
      // console.log('this.selectedPortChart', this.selectedPortChart);
      this.rightMenuService.createAlarmConfig(this.selectedPortChart, parseInt(this.selectedHour.hour), parseInt(this.selectedMinute.minute), parseInt(this.isthenValue), this.selectedisThen.name, this.selecteddatalist, this.selectedData, this.zone_id).subscribe({
        next: result => {
          this.nameSearch = undefined;
          this.ipSearch = undefined;
          this.symbolData = undefined;
          this.selectedData = undefined;
          this.selecteddatalist = undefined;
          this.selectedPortChart = undefined;
          this.isthenValue = undefined;
          this.selectedHour = undefined;
          this.selectedMinute = undefined;
          this.selectedPriority = undefined;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: result.detail.message,
            life: 3000
          });
          this.rightMenuService.getAlarmConfig(this.zone_id).subscribe({
            next: result => {
              this.dataDeviceconfig = result.detail.data
              
              // console.log(this.dataDeviceconfig)
            },
            error: error => {
              if (error.status == 401) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Session expired, please logout and login again."
                });
              }
              if (error.status == "400") {
                // console.log("hi")
                this.dataDeviceconfig = [{
                  alarmType: "No seacrh result."
                }];
              //  this.dataDeviceconfig[0].port.port = "No seacrh result."
              }
            }
          });
          // console.log(result)
        },
        error: error => {
          if (error.status == "409") {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Do not add data duplicate.Please try again."
            });
          }
          // console.log(error)
        }
      })
    } else {
      // console.log(this.selectedData)
      if (this.selectedHour == undefined) {
        this.invinvalidhour = "ng-invalid ng-dirty";
      }
      if (this.selectedPriority == undefined) {
        this.invinvalidPriority = "ng-invalid ng-dirty";
      }
      if (this.selectedMinute == undefined) {
        this.invinvalidminute = "ng-invalid ng-dirty";
      }
      if (this.selecteddatalist == undefined) {
        this.invinvalidCharttype = "ng-invalid ng-dirty";
      } else if (this.selecteddatalist.name != "BandwidthCharts") {
        this.invinvalidPort = "";
        // console.log(this.selecteddatalist)
      } else {
        // console.log(this.selectedPortChart)
        if (this.selectedPortChart == undefined) {
          this.invinvalidPort = "ng-invalid ng-dirty";
        }
      }

      if (this.isthenValue == undefined) {
        this.invinvalidisthenValue = "ng-invalid ng-dirty";
      }
      if (this.selectedData == undefined) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please Select Device again."
        });
        this.symbolData = [{
          SYMBOL_NAME1: "No seacrh result."
        }];
      }
    }
    // console.log(this.isthenValue)
  }
  onRowSelect(event) {
    // console.log(this.selectedData)

    if (this.selectedData.length < 2) {
      this.datalist[0].disabled =  false;
      if (this.selecteddatalist != undefined){
      if (this.selecteddatalist.name == "BandwidthCharts"){
      this.rightMenuService.getSysInterface(event.data.SYMBOL_NAME3).subscribe({
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
          var ifIndex = result.data.map(function (singleElement) {
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
    } else {
      this.datalist[0].disabled =  true;
      this.disablelist = true;
    }
    // console.log(this.selectedData)
    // console.log(event)
  }
  onRowUnselect(event) {
    // console.log(this.selectedData.length)
    if (this.selectedData.length < 2) {
      this.datalist[0].disabled =  false;
      if (this.selecteddatalist != undefined){
      if (this.selecteddatalist.name == "BandwidthCharts"){
        this.rightMenuService.getSysInterface(this.selectedData[0].SYMBOL_NAME3).subscribe({
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
            var ifIndex = result.data.map(function (singleElement) {
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
    } else {
      this.datalist[0].disabled =  true;
      this.disablelist = true;
    }
   
  
  }
  addSymbol(symbolData) {

    if (this.findRowBySymbolId(symbolData.SYMBOL_ID) < 0) {
      this.symbolDataAdded.push(symbolData);
      this.symbolString.push(symbolData.SYMBOL_ID);
      this.selectedData = [];
      // console.log(this.symbolDataAdded)
    }

  }
  ipInput() {
    this.nameSearch = null;
  }
  nameInput() {
    this.ipSearch = null;
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
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
  formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes())
      ].join(':')
    );
  }
  // showOrderDialog(order: any) {
  //   this.orderDialog = true;
  //   this.dialogHeader = "Order List";
  //   this.listData.msisdn = order.msisdn
  //   // console.log(order)
  //   this.active = false;
  //   this.listData.sessionId = order.sessionId
  // }

  toggleConfigurator(event: Event) {
    this.visibleSidebar2 = true
    this.active = !this.active;
    event.preventDefault();
    // this.symbolDataAdded = [];
    if (this.active) this.bindOutsideClickListener();
    else this.unbindOutsideClickListener();
  }

  hideConfigurator(event) {
    this.active = false;
    this.symbolData = [];
    this.selectedData = [];
    this.ipSearch = undefined;
    this.nameSearch = undefined;
    this.unbindOutsideClickListener();
    event.preventDefault();
  }

  changeTheme(event: Event, theme: string, dark: boolean) { }

  onRippleChange() { }
  onChangeHour(event) {
    this.invinvalidhour = "";
    // console.log(event)
  }
  onChangeMinute(event) {
    this.invinvalidminute = "";
    // console.log(event)
  }
  onChangeisThen(event) {
    // console.log(event)
  }
  onChangePort(event) {
    this.invinvalidPort = "";
    // console.log(event)
  }
  onChangemultiSelect(event) {
    // console.log(event.value.name)
    // console.log(this.selectedData)
    if (event.value.name != "BandwidthCharts") {
      // console.log("hi")
      this.disablelist = true;
      this.invinvalidPort = "";
      this.selectedPortChart = "";
      this.selectedPortChart = undefined;
    } else if (event.value.name == "BandwidthCharts" && this.selectedData.length > 1) {
      this.disablelist = true;
      this.invinvalidPort = "";
    } else {
      // console.log("hi2")
      this.disablelist = false;
    }
   
    this.invinvalidCharttype = "";
    // // this.
    // console.log(this.selectedData)
    // console.log(this.selecteddatalist)
  }
  onChangemultiSelectEdit(event) {

    if (event.value.name != "BandwidthCharts") {
      this.disablelist = true;
      this.invinvalidPort = "";
      this.selectedPortChartEdit = "";
      // console.log("hi")
    } else {
      this.disablelist = false;
      this.rightMenuService.getSysInterface(this.device_ip).subscribe({
        next: result => {
          // this.disablelist = false;
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
            this.array_dataEdit.push(array_data);
          });
          // console.log(this.array_dataEdit)
          // var indexport = this.array_dataEdit.findIndex(list => list.port == data.port.port)
          // this.selectedPortChartEdit = this.array_dataEdit[indexport]
          var ifIndex = result.data.map(function (singleElement) {
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
    this.invinvalidCharttype = "";
    // // this.
    // console.log(this.selectedData)
    // console.log(this.selecteddatalist)
  }
  bindOutsideClickListener() {
    this.invinvalidhour = "";
    this.invinvalidminute = "";
    this.invinvalidCharttype = "";
    this.invinvalidPort = "";
    this.invinvalidisthenValue = "";
    this.selectionMode = "";
    for (let i = 0; i < 25; i++) {
      var list = {
        hour: i.toString()
      }
      this.listhour.push(list)
    }
    for (let m = 0; m < 61; m++) {
      var listminute = {
        minute: m.toString()
      }
      this.listminute.push(listminute)
    }
    this.isThen = [
      { name: "Less then" },
      { name: "Equals" },
      { name: "More then" },
    ]
    this.selectedisThen = this.isThen[0]
    var getfile = [
      { name: "BandwidthCharts", value: "BandwidthCharts", selected: false },
      { name: "Memory Utilization", value: "checkchartmem", selected: false },
      { name: "CPU Utilization", value: "checkchartcpu", selected: false },
      { name: "Termometer Utilization", value: "checkcharttemp", selected: false },
      // { name: "Volt Utilization", value: "checkchartvolt", selected: false },
      { name: "CPU load 1 min", value: "loadcpu1min", selected: false },
      { name: "CPU load 2 min", value: "loadcpu2min", selected: false },
      { name: "CPU load 3 min", value: "loadcpu3min", selected: false },
      { name: "CPU load 4 min", value: "loadcpu4min", selected: false },
      { name: "CPU load 5 min", value: "loadcpu5min", selected: false },
      { name: "Termometer Current", value: "loadTemp", selected: false },
      { name: "Memory Total", value: "loadMemory", selected: false },
      // { name: "Volt Index 1", value: "loadvoltindex1", selected: false },
      // { name: "Volt Index 2", value: "loadvoltindex2", selected: false },
      // { name: "Volt Index 3", value: "loadvoltindex3", selected: false },
      // { name: "Volt Index 4", value: "loadvoltindex4", selected: false },
    ];
    this.datalist = getfile;
    // this.listminute.forEach(data => {
    //   // console.log(data.hour)
    //   if (data.minute.toString().length < 2){
    //     data.minute = "0" + data.minute
    //     // console.log(data.hour)
    //   }
    // })
    // console.log(this.listminute)
    this.rightMenuService.getAlarmConfig(this.zone_id).subscribe({
      next: result => {
        this.dataDeviceconfig = result.detail.data

        // console.log(this.dataDeviceconfig)
      },
      error: error => {
        if (error.status == 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        }
        if (error.status == "400") {
          // console.log("hi")
          this.dataDeviceconfig = [{
            alarmType: "No seacrh result."
          }];
        //  this.dataDeviceconfig[0].port.port = "No seacrh result."
        }
      }
    });
    if (!this.outsideClickListener) {
      this.outsideClickListener = event => {
        if (this.active && this.isOutsideClicked(event)) {
          this.active = false;
        }
      };
      document.addEventListener("click", this.outsideClickListener);
    }
  }
  isthenValueInput() {
    this.invinvalidisthenValue = "";
  }
  isthenValueInputEdit() {
    // console.log("hi")
    this.invinvalidisthenValueedit = "";
  }
  unbindOutsideClickListener() {
    this.symbolData = [];
    this.selectedData = [];
    this.selectedData = undefined;
    this.selectedHour = undefined;
    this.selectedMinute = undefined;
    this.invinvalidhour = "";
    this.invinvalidminute = "";
    this.invinvalidCharttype = "";
    this.invinvalidPort = "";
    this.selectedPortChart = "";
    this.invinvalidisthenValue = "";
    this.selectionMode = "";
    this.selecteddatalist = undefined;
    this.selectedPortChart = undefined
    // this.disablelist = true;
    this.array_data = [];
    this.isthenValue = undefined;
    this.ipSearch = undefined;
    this.nameSearch = undefined;
    if (this.outsideClickListener) {
      document.removeEventListener("click", this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  isOutsideClicked(event) {
    return !(
      this.el.nativeElement.isSameNode(event.target) ||
      this.el.nativeElement.contains(event.target)
    );
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + "px";
  }
  saveDialog() {
    this.maxDate = new Date();
    this.dateSelected = this.maxDate;
    let date = `${this.dateSelected.getFullYear()}-${(this.dateSelected.getMonth() + 1).toString().replace(/^(\d)$/, '0$1')}-${this.dateSelected.getDate().toString().replace(/^(\d)$/, '0$1')} ${this.dateSelected.getHours().toString().replace(/^(\d)$/, '0$1')}:${this.dateSelected.getMinutes().toString().replace(/^(\d)$/, '0$1')}:${this.dateSelected.getSeconds().toString().replace(/^(\d)$/, '0$1')}`;
    // console.log(date)
    this.listData.date = date;
    this.listData.position = this.latitude + "," + this.longitude;
    this.orderDialog = false;
    // console.log(this.listData);
    //   this.webSocketService.submitLocation(this.listData).subscribe({
    //     next: data => {
    //       this.messageService.add({
    //         severity: "success",
    //         summary: "Successful",
    //         detail: data.detail,
    //         life: 3000`
    //       });
    //     },
    //     error: error => {
    //         console.error('There was an error!', error);
    //     }
    // });
  }
  closeDialog() {
    this.orderDialog = false;
    this.listData = {};
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
