import { Component, OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);
import { TopchartService } from "@app/pages/topchart/topchart.service";
import { isNumeric } from "rxjs/util/isNumeric";
import { data } from "jquery";
import { Title } from "@angular/platform-browser";
import { ThemeService } from "app/theme.service";
import { MenuItem } from "primeng/api";
export interface portlink {
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
  selector: "app-topchart",
  templateUrl: "topchart.component.html",
  styleUrls: ["topchart.component.css"]
})
export class TopchartComponent implements OnInit {
  portlink: portlink[];
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
  index1: any;
  rows = 10;
  a: any;
  colortitle:string;
  menuExportchartOptions: MenuItem[];
  menuExportchartOptions1: MenuItem[];
  menuExportchartOptions2: MenuItem[];
  menuExportchartOptions3: MenuItem[];
  toggleOptions:boolean = false;
  toggleOptions1:boolean = false;
  toggleOptions2:boolean = false;
  toggleOptions3:boolean = false;
  selecteddatalist1:any[]=[];
  selecteddatalist2:any[]=[];
  selecteddatalist3:any[]=[];
  selecteddatalist4:any[]=[];
  container:any;
  container1:any;
  container2:any;
  container3:any;
  constructor(
    private TopchartService: TopchartService,
    public themeService: ThemeService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("SED-Report");
    this.themeService.currentpage("/topchart");
  
    this.themeService.currentcolorMessage.subscribe(value => {
      // console.log(value)
      if (window.location.hash == "#/topchart"){
      if (value == "saga-orange") {
        this.colortitle = "#2c2c2c"
        this.selecteddatalist1 = [];
        this.selecteddatalist2 = [];
        this.selecteddatalist3 = [];
        this.selecteddatalist4 = [];
        this.TopchartService.loadchart().subscribe(result => {
        this.portlink = result;
        this.portlink.forEach(data => this.portlink_S.push(data));
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
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
          this.container = Highcharts.chart("container", optionsstatus);
          this.handleUpdate(deviceNames, alarmCounts, strDesc);
          this.chartOptions.legend = {
            itemStyle: {
              color: this.colortitle,
          }
          }
          this.toggleOptions = true;
          this.menuExportchartOptions = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.container.exportChart({
                      type: 'image/jpeg',
                      filename: 'Today Port Link Down',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      chart: {
                        backgroundColor: "#ffffff" // Set your desired background color here
                      },
                      title:{
                        text:'Today Port Link Down',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                     
                    });
                  }
                },
                {
                  label: "Download PNG Image",
                  // icon: "pi pi-fw pi-pencil",
                  command: event => {
                    this.container.exportChart({
                      type: 'image/png',
                      filename: 'Today Port Link Down',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      title:{
                        text:'Today Port Link Down',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                    
                    });
                  }
                },
                {
                  label: "Download PDF",
                  // icon: "pi pi-fw pi-calendar",
                  command: event => {
                    this.container.exportChart({
                      type: 'application/pdf',
                      filename: 'Today Port Link Down',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      title:{
                        text:'Today Port Link Down',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                    
                    });
                  }
                }
              ]
            }
          ];
          // console.log(deviceNames,alarmCounts,strDesc)
        });
        this.TopchartService.loadchartremote().subscribe(result => {
          this.portlinkremote = result;
          this.portlinkremote.forEach(data => this.portlinkremote_S.push(data));
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
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
          this.container2 = Highcharts.chart("container2", optionsstatus);
          this.handleUpdate2(deviceNames, alarmCounts, strDesc);
          this.chartOptions2.legend = {
            itemStyle: {
              color: this.colortitle,
          }
          }
          this.toggleOptions2 = true;
          this.menuExportchartOptions2 = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.container2.exportChart({
                      type: 'image/jpeg',
                      filename: 'Today Remote Power off',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      chart: {
                        backgroundColor: "#ffffff" // Set your desired background color here
                      },
                      title:{
                        text:'Today Remote Power off',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                     
                    });
                  }
                },
                {
                  label: "Download PNG Image",
                  // icon: "pi pi-fw pi-pencil",
                  command: event => {
                    this.container2.exportChart({
                      type: 'image/png',
                      filename: 'Today Remote Power off',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      title:{
                        text:'Today Remote Power off',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                    
                    });
                  }
                },
                {
                  label: "Download PDF",
                  // icon: "pi pi-fw pi-calendar",
                  command: event => {
                    this.container2.exportChart({
                      type: 'application/pdf',
                      filename: 'Today Remote Power off',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      title:{
                        text:'Today Remote Power off',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                    
                    });
                  }
                }
              ]
            }
          ];
          // console.log(deviceNames,alarmCounts,strDesc)
        });
        this.TopchartService.loadchart24().subscribe(result => {
          this.portlink24 = result;
          this.portlink24.forEach(data => this.portlink24_S.push(data));
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
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
          this.container1 = Highcharts.chart("container1", optionsstatus);
          this.handleUpdate1(deviceNames, alarmCounts);
          this.chartOptions1.legend = {
            itemStyle: {
              color: this.colortitle,
          }
          }
          this.toggleOptions1 = true;
          this.menuExportchartOptions1 = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.container1.exportChart({
                      type: 'image/jpeg',
                      filename: 'Top Node Down',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      chart: {
                        backgroundColor: "#ffffff" // Set your desired background color here
                      },
                      title:{
                        text:'Top Node Down',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                     
                    });
                  }
                },
                {
                  label: "Download PNG Image",
                  // icon: "pi pi-fw pi-pencil",
                  command: event => {
                    this.container1.exportChart({
                      type: 'image/png',
                      filename: 'Top Node Down',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      title:{
                        text:'Top Node Down',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                    
                    });
                  }
                },
                {
                  label: "Download PDF",
                  // icon: "pi pi-fw pi-calendar",
                  command: event => {
                    this.container1.exportChart({
                      type: 'application/pdf',
                      filename: 'Top Node Down',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      title:{
                        text:'Top Node Down',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                    
                    });
                  }
                }
              ]
            }
          ];
        });
        this.TopchartService.loadchartremote24().subscribe(result => {
          this.portlinkremote24 = result;
          this.portlinkremote24.forEach(data => this.portlinkremote24_S.push(data));
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
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
          this.container3 =  Highcharts.chart("container3", optionsstatus);
          this.handleUpdate3(deviceNames, alarmCounts);
          this.chartOptions3.legend = {
            itemStyle: {
              color: this.colortitle,
          }
          }
          this.toggleOptions3 = true;
          this.menuExportchartOptions3 = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.container3.exportChart({
                      type: 'image/jpeg',
                      filename: 'Top Remote Power off',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      chart: {
                        backgroundColor: "#ffffff" // Set your desired background color here
                      },
                      title:{
                        text:'Top Remote Power off',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                     
                    });
                  }
                },
                {
                  label: "Download PNG Image",
                  // icon: "pi pi-fw pi-pencil",
                  command: event => {
                    this.container3.exportChart({
                      type: 'image/png',
                      filename: 'Top Remote Power off',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      title:{
                        text:'Top Remote Power off',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                    
                    });
                  }
                },
                {
                  label: "Download PDF",
                  // icon: "pi pi-fw pi-calendar",
                  command: event => {
                    this.container3.exportChart({
                      type: 'application/pdf',
                      filename: 'Top Remote Power off',
                      sourceWidth: 1000,
                      sourceHeight: 300,
                    }, {
                      title:{
                        text:'Top Remote Power off',
                        style:{
                          color:'#17212f'
                        }
                      },
                      legend: {
                        itemStyle: {
                          color: '#17212f',
                      }
                    }
                    
                    });
                  }
                }
              ]
            }
          ];
        });
      } else {
        this.colortitle = "#FFFFFF"
        this.selecteddatalist1 = [];
        this.selecteddatalist2 = [];
        this.selecteddatalist3 = [];
        this.selecteddatalist4 = [];
        this.TopchartService.loadchart().subscribe(result => {
          this.portlink = result;
          this.portlink.forEach(data => this.portlink_S.push(data));
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
            var optionsstatus: any = {
              chart: {
                zoomType: "x",
                backgroundColor: "transparent"
              },
              title: {
                text: undefined,
                style: {
                  color: this.colortitle
                }
              },
              legend: {
                itemStyle: {
                  color: this.colortitle
                }
              },
              exporting: {
                enabled: false
              },
              credits: {
                enabled: false
              },
              xAxis: {
                categories: this.portlinkarr,
                crosshair: true,
               
              },
              yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                gridLineWidth: 1,
                title: {
                  text: "Alarm Count"
                }
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
                footerFormat:
                  '<tr><td style="padding:0">Description: </td>' +
                  '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  type: "column",
                  name: "Alarm count",
                  data: this.alarmCounts,
                  color: "#D35400",
                 
                },
               
              ]
            };
            Highcharts.chart("container", optionsstatus);
            this.container = Highcharts.chart("container", optionsstatus);
            this.handleUpdate(deviceNames, alarmCounts, strDesc);
            this.chartOptions.legend = {
              itemStyle: {
                color: this.colortitle,
            }
            }
            this.toggleOptions = true;
            this.menuExportchartOptions = [
              {
                label: "Download",
                items: [
                  {
                    label: "Download JPEG Image",
                    // icon: "pi pi-fw pi-cog",
                    command: event => {
                      this.container.exportChart({
                        type: 'image/jpeg',
                        filename: 'Today Port Link Down',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title:{
                          text:'Today Port Link Down',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                       
                      });
                    }
                  },
                  {
                    label: "Download PNG Image",
                    // icon: "pi pi-fw pi-pencil",
                    command: event => {
                      this.container.exportChart({
                        type: 'image/png',
                        filename: 'Today Port Link Down',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        title:{
                          text:'Today Port Link Down',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                      
                      });
                    }
                  },
                  {
                    label: "Download PDF",
                    // icon: "pi pi-fw pi-calendar",
                    command: event => {
                      this.container.exportChart({
                        type: 'application/pdf',
                        filename: 'Today Port Link Down',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        title:{
                          text:'Today Port Link Down',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                      
                      });
                    }
                  }
                ]
              }
            ];
            // console.log(deviceNames,alarmCounts,strDesc)
          });
          this.TopchartService.loadchartremote().subscribe(result => {
            this.portlinkremote = result;
            this.portlinkremote.forEach(data => this.portlinkremote_S.push(data));
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
            var optionsstatus: any = {
              chart: {
                zoomType: "x",
                backgroundColor: "transparent"
              },
              title: {
                text: undefined,
                style: {
                  color: this.colortitle
                }
              },
              legend: {
                itemStyle: {
                  color: this.colortitle
                }
              },
              exporting: {
                enabled: false
              },
              credits: {
                enabled: false
              },
              xAxis: {
                categories: this.portlinkarr_hand3,
                crosshair: true,
               
              },
              yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                gridLineWidth: 1,
                title: {
                  text: "Alarm Count"
                }
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
                footerFormat:
                  '<tr><td style="padding:0">Description: </td>' +
                  '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  type: "column",
                  name: "Alarm count",
                  data: this.alarmCounts_hand3,
                  color: "#D35400",
                 
                },
               
              ]
            };
            Highcharts.chart("container2", optionsstatus);
            this.container2 = Highcharts.chart("container2", optionsstatus);
            this.handleUpdate2(deviceNames, alarmCounts, strDesc);
            this.chartOptions2.legend = {
              itemStyle: {
                color: this.colortitle,
            }
            }
            this.toggleOptions2 = true;
            this.menuExportchartOptions2 = [
              {
                label: "Download",
                items: [
                  {
                    label: "Download JPEG Image",
                    // icon: "pi pi-fw pi-cog",
                    command: event => {
                      this.container2.exportChart({
                        type: 'image/jpeg',
                        filename: 'Today Remote Power off',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title:{
                          text:'Today Remote Power off',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                       
                      });
                    }
                  },
                  {
                    label: "Download PNG Image",
                    // icon: "pi pi-fw pi-pencil",
                    command: event => {
                      this.container2.exportChart({
                        type: 'image/png',
                        filename: 'Today Remote Power off',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        title:{
                          text:'Today Remote Power off',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                      
                      });
                    }
                  },
                  {
                    label: "Download PDF",
                    // icon: "pi pi-fw pi-calendar",
                    command: event => {
                      this.container2.exportChart({
                        type: 'application/pdf',
                        filename: 'Today Remote Power off',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        title:{
                          text:'Today Remote Power off',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                      
                      });
                    }
                  }
                ]
              }
            ];
            // console.log(deviceNames,alarmCounts,strDesc)
          });
          this.TopchartService.loadchart24().subscribe(result => {
            this.portlink24 = result;

            this.portlink24.forEach(data => this.portlink24_S.push(data));
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
            var optionsstatus: any = {
              chart: {
                zoomType: "x",
                backgroundColor: "transparent"
              },
              title: {
                text: undefined,
                style: {
                  color: this.colortitle
                }
              },
              legend: {
                itemStyle: {
                  color: this.colortitle
                }
              },
              exporting: {
                enabled: false
              },
              credits: {
                enabled: false
              },
              xAxis: {
                categories: this.deviceNames,
                crosshair: true,
                
              },
              yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                gridLineWidth: 1,
                title: {
                  text: "Alarm Count"
                }
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
                footerFormat:
                  '<tr><td style="padding:0">Description: </td>' +
                  '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  type: "column",
                  name: "Alarm count",
                  data: this.alarmCounts_S,
                  // color: "#D35400",
                 
                },
               
              ]
            };
            Highcharts.chart("container1", optionsstatus);
            this.container1 = Highcharts.chart("container1", optionsstatus);
            this.handleUpdate1(deviceNames, alarmCounts);
            this.chartOptions1.legend = {
              itemStyle: {
                color: this.colortitle,
            }
            }
            this.toggleOptions1 = true;
            this.menuExportchartOptions1 = [
              {
                label: "Download",
                items: [
                  {
                    label: "Download JPEG Image",
                    // icon: "pi pi-fw pi-cog",
                    command: event => {
                      this.container1.exportChart({
                        type: 'image/jpeg',
                        filename: 'Top Node Down',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title:{
                          text:'Top Node Down',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                       
                      });
                    }
                  },
                  {
                    label: "Download PNG Image",
                    // icon: "pi pi-fw pi-pencil",
                    command: event => {
                      this.container1.exportChart({
                        type: 'image/png',
                        filename: 'Top Node Down',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        title:{
                          text:'Top Node Down',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                      
                      });
                    }
                  },
                  {
                    label: "Download PDF",
                    // icon: "pi pi-fw pi-calendar",
                    command: event => {
                      this.container1.exportChart({
                        type: 'application/pdf',
                        filename: 'Top Node Down',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        title:{
                          text:'Top Node Down',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                      
                      });
                    }
                  }
                ]
              }
            ];
          });
          this.TopchartService.loadchartremote24().subscribe(result => {
            this.portlinkremote24 = result;
            this.portlinkremote24.forEach(data => this.portlinkremote24_S.push(data));
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
            var optionsstatus: any = {
              chart: {
                zoomType: "x",
                backgroundColor: "transparent"
              },
              title: {
                text: undefined,
                style: {
                  color: this.colortitle
                }
              },
              legend: {
                itemStyle: {
                  color: this.colortitle
                }
              },
              exporting: {
                enabled: false
              },
              credits: {
                enabled: false
              },
              xAxis: {
                categories: this.deviceNames_hand4,
                crosshair: true,
                
              },
              yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                gridLineWidth: 1,
                title: {
                  text: "Alarm Count"
                }
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
                footerFormat:
                  '<tr><td style="padding:0">Description: </td>' +
                  '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  type: "column",
                  name: "Alarm count",
                  data: this.alarmCounts_hand4,
                  // color: "#D35400",
                 
                },
               
              ]
            };
            Highcharts.chart("container3", optionsstatus);
            this.container3 =  Highcharts.chart("container3", optionsstatus);
            this.handleUpdate3(deviceNames, alarmCounts);
            this.chartOptions3.legend = {
              itemStyle: {
                color: this.colortitle,
            }
            }
            this.toggleOptions3 = true;
            this.menuExportchartOptions3 = [
              {
                label: "Download",
                items: [
                  {
                    label: "Download JPEG Image",
                    // icon: "pi pi-fw pi-cog",
                    command: event => {
                      this.container3.exportChart({
                        type: 'image/jpeg',
                        filename: 'Top Remote Power off',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title:{
                          text:'Top Remote Power off',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                       
                      });
                    }
                  },
                  {
                    label: "Download PNG Image",
                    // icon: "pi pi-fw pi-pencil",
                    command: event => {
                      this.container3.exportChart({
                        type: 'image/png',
                        filename: 'Top Remote Power off',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        title:{
                          text:'Top Remote Power off',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                      
                      });
                    }
                  },
                  {
                    label: "Download PDF",
                    // icon: "pi pi-fw pi-calendar",
                    command: event => {
                      this.container3.exportChart({
                        type: 'application/pdf',
                        filename: 'Top Remote Power off',
                        sourceWidth: 1000,
                        sourceHeight: 300,
                      }, {
                        title:{
                          text:'Top Remote Power off',
                          style:{
                            color:'#17212f'
                          }
                        },
                        legend: {
                          itemStyle: {
                            color: '#17212f',
                        }
                      }
                      
                      });
                    }
                  }
                ]
              }
            ];
          });
      }
        
      }
    });
  }
  //-----------------------chart-------------------------
  isHighcharts = typeof Highcharts === "object";
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;

  chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: "transparent"
    },
    exporting: {
      showTable: false,
      tableCaption: "Data table",
      csv: {
        dateFormat: "%Y-%m-%d"
      }
    },
    title: {
      // text: "Today Port Link Down",
      text: undefined,
      style: {
        fontWeight: "bold",
        color: "#FFFFFFDE"
      }
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
          color: "#FFFFFFDE"
        }
      }
    },
    yAxis: {
      title: {
        text: "Alarm Count",
      },
      labels: {
        style: {
          color: "#FFFFFFDE"
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
      footerFormat:
        '<tr><td style="padding:0">Description: </td>' +
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
      color: "#D35400",
      label: {
        style: {
          color: "#FFFFFFDE"
        }
      }
    };
    this.chartOptions.series[0].label.style.color = "red";
    this.updateFlag = true;
  }

  //-----------------------chart24-------------------------
  isHighcharts1 = typeof Highcharts === "object";
  Highcharts1: typeof Highcharts = Highcharts;
  updateFlag1: boolean = false;
  chartOptions1: Highcharts.Options = {
    chart: {
      // backgroundColor: this.themeService.primaryColor
      backgroundColor: "transparent"
    },

    exporting: {
      enabled:false,
      showTable: false,
      tableCaption: "Data table",
      csv: {
        /* // Uncomment for custom column header formatter.
                // This function is called for each column header.
                columnHeaderFormatter: function (item, key) {
                    if (!item || item instanceof Highcharts.Axis) {
                        return item.options.title.text;
                    }
                    // Item is not axis, now we are working with series.
                    // Key is the property on the series we show in this column.
                    return {
                        topLevelColumnTitle: 'Temperature',
                        columnTitle: key === 'y' ? 'avg' : key
                    };
                },
                // */
        dateFormat: "%Y-%m-%d"
      }
    },
    title: {
      // text: "Top Node Down",
      text: undefined,
      style: {
        fontWeight: "bold"
        // color: "#FFFFFFDE"
      }
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
        '<tr><td style="padding:0">Description: </td>' +
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
      // color: '#D35400',
      // type: 'column',
      // data: yAxis
    };

    this.updateFlag1 = true;
  }
  //-----------------------chart-------------------------
  isHighcharts2 = typeof Highcharts === "object";
  Highcharts2: typeof Highcharts = Highcharts;
  updateFlag2: boolean = false;
  chartOptions2: Highcharts.Options = {
    chart: {
      backgroundColor: "transparent" // set the background color to white
    },
    exporting: {
      enabled:false,
      showTable: false,
      tableCaption: "Data table",
      csv: {
        dateFormat: "%Y-%m-%d"
      }
    },
    title: {
      // text: "Today Remote Power off",
      text: undefined,
      style: {
        fontWeight: "bold",
        color: "#FFFFFFDE"
      }
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
        '<tr><td style="padding:0">Description: </td>' +
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
    chart: {
      backgroundColor: "transparent" // set the background color to white
    },
    exporting: {
      enabled:false,
      showTable: false,
      tableCaption: "Data table",
      csv: {
        dateFormat: "%Y-%m-%d"
      }
    },
    title: {
      // text: "Top Remote Power off",
      text: undefined,
      style: {
        fontWeight: "bold",
        color: "#FFFFFFDE"
      }
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
        '<tr><td style="padding:0">Description: </td>' +
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
      this.portlink = [];
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
        }
          
        }
      });
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

      this.portlink = this.portlink_S;
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
        }
          
        }
      });
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
      const indexOfObject = this.portlink.findIndex(object => {
        return object.strDeviceName === newstr;
      });
      if (indexOfObject !== -1) {
        this.portlink.splice(indexOfObject, 1);
      }
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
        }
          
        }
      });
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
      // console.log(index)
      var alarm = this.alarmCounts1[index];
      var strDescs = this.strDesc1[index];
      this.portlinkarr.splice(index, 0, event.itemValue);
      this.alarmCounts.splice(index, 0, alarm);
      this.strDesc.splice(index, 0, strDescs);
      this.portlink.splice(indexS, 0, valueS[0]);
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container", optionsstatus);
        }
          
        }
      });
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
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
        }
          
        }
      });
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
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
        }
          
        }
      });
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
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
        }
          
        }
      });
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
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_S,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container1", optionsstatus);
        }
          
        }
      });
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
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
        }
          
        }
      });
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
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
        }
          
        }
      });
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
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
        }
          
        }
      });
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
      // console.log(index)
      var alarm = this.alarmCounts1_hand3[index];
      var strDescs = this.strDesc1_hand3[index];
      this.portlinkarr_hand3.splice(index, 0, event.itemValue);
      this.alarmCounts_hand3.splice(index, 0, alarm);
      this.strDesc_hand3.splice(index, 0, strDescs);
      this.portlinkremote.splice(indexS, 0, valueS[0]);
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.portlinkarr_hand3,
              crosshair: true,
             
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand3,
                color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container2", optionsstatus);
        }
          
        }
      });
      this.handleUpdate2(
        this.portlinkarr_hand3,
        this.alarmCounts_hand3,
        this.strDesc_hand3
      );
    }

    //   console.log(this.alarmCounts1)
  }
  onChangechart4(event) {
    // console.log(event.value.length)
    // console.log(this.portlinkarr.length)

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
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
        }
          
        }
      });
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
      //   this.portlinkremote24_S.forEach(data => {
      //     this.portlinkremote24.push(data);
      //   });
      this.portlinkremote24 = this.portlinkremote24_S;
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
        }
          
        }
      });
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

      //   console.log(indexOfObject); // 👉️ 1

      if (indexOfObject !== -1) {
        this.portlinkremote24.splice(indexOfObject, 1);
      }
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
        }
          
        }
      });
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
      // console.log(index)
      var alarm = this.alarmCounts1_hand4[index];
      this.deviceNames_hand4.splice(index, 0, event.itemValue);
      this.alarmCounts_hand4.splice(index, 0, alarm);
      this.portlinkremote24.splice(indexS, 0, valueS[0]);
      this.themeService.currentcolorMessage.subscribe(value => {
        // console.log(value)
        if (window.location.hash == "#/topchart"){
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
        } else {
          this.colortitle = "#FFFFFF"
          var optionsstatus: any = {
            chart: {
              zoomType: "x",
              backgroundColor: "transparent"
            },
            title: {
              text: undefined,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            xAxis: {
              categories: this.deviceNames_hand4,
              crosshair: true,
              
            },
            yAxis: {
              minPadding: 0.2,
              maxPadding: 0.2,
              gridLineWidth: 1,
              title: {
                text: "Alarm Count"
              }
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} ครั้ง</b></td></tr>',
              footerFormat:
                '<tr><td style="padding:0">Description: </td>' +
                '<td style="padding:0"><b>LINK-to-Witelcom</b></td></tr>',
              shared: true,
              useHTML: true
            },
            series: [
              {
                type: "column",
                name: "Alarm count",
                data: this.alarmCounts_hand4,
                // color: "#D35400",
               
              },
             
            ]
          };
          Highcharts.chart("container3", optionsstatus);
        }
          
        }
      });
      this.handleUpdate3(this.deviceNames_hand4, this.alarmCounts_hand4);
    }

    //   console.log(this.alarmCounts1)
  }
}
