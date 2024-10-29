import { Component, ViewChild,OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);
import { TopchartService } from "@app/pages/topchart/topchart.service";
import { isNumeric } from "rxjs/util/isNumeric";
import { data } from "jquery";
import { Title } from "@angular/platform-browser";
import { ThemeService } from "app/theme.service";
import { MenuItem } from "primeng/api";
import { ServicestatusService } from "@app/pages/servicestatus/servicestatus.service";
import { MessageService } from "primeng/api";
import {
  GridType,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface
} from "angular-gridster2";
@Component({
  selector: 'app-servicestatus',
  templateUrl: './servicestatus.component.html',
  styleUrls: ['./servicestatus.component.css'],
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

export class ServicestatusComponent implements OnInit {
  @ViewChild("cal2") calendar: any;
  constructor(
    public themeService: ThemeService,
    private titleService: Title,
    private ServicestatusService:ServicestatusService,
    private messageService:MessageService
  ) {}
  colortitle:any;
  gridOptions: GridsterConfig;
  rangeDates: Date[];
  formattedStartDate: any;
  loading: boolean = true;
  loadingchart_cpuNone: boolean = true;
  loading_cpu: boolean = true;
  loading_disk: boolean = true;
  loading_memory: boolean = true;
  loading_cpu_usage_netmon: boolean = true;
  loading_disk_usage_netmon: boolean = true;
  loading_memory_usage_netmon: boolean = true;
  loading_disk_status: boolean = true;
  loading_disk_status_netmon: boolean = true;
  start: any = "";
  end: any = "";
  step:any = "5m";
  isSave: boolean = false;
  loadingchartcpu: boolean = true;
  loadingcpu: boolean = false;
  loadingdisk: boolean = false;
  loadingmemory: boolean = false;
  loadingcpu_usage_netmon: boolean = false;
  loadingdisk_usage_netmon: boolean = false;
  loadingmemory_usage_netmon: boolean = false;
  loadingdisk_status: boolean = true;
  loadingdisk_status_netmon: boolean = true;
  menuExportcpu_time: MenuItem[];
  CPUChart:any;
  maxDate: Date;
  isLoading: boolean = false;
  startTimeH: any = 0;
  startTimeM: any = 0;
  EndTimeH: any = 0;
  EndTimeM: any = 0;
  invalidstartH: any;
  valueCPU:any;
  valueDisk:any;
  valueMemory:any;
  valueCPU_netmon:any;
  valueDisk_netmon:any;
  valueMemory_netmon:any;
  dashboard:any[] = [];
  basicDatadisk_status: any;
  horizontalOptions: any;
  initialGridOptions = {
    minCols: 3,
    maxCols: 9,
    minRows: 2,
    maxRows: 500,
    gridType: "verticalFixed" as GridType,
    fixedRowHeight: 220,
    margin: 16
  };
  rangeColors = [
    { start: 0, end: 33.33, color: 'green' },
    { start: 33.33, end: 66.66, color: 'yellow' },
    { start: 66.66, end: 100, color: 'red' }
  ];
  ngOnInit(): void {
    this.titleService.setTitle("SED-Service status");
    this.themeService.currentpage("/servicestatus");
    this.gridOptions = this.initialGridOptions;
    this.dashboard = [
      { cols: 3, rows: 1, x: 0, y: 0, header:"loadcpu"},
      { cols: 3, rows: 1, x: 3, y: 0, header:"loaddisk"},
      { cols: 3, rows: 1, x: 6, y: 0, header:"loadmemory"},
      { cols: 9, rows: 2, x: 0, y: 1, header:"loaddiskstatus"},
      { cols: 3, rows: 1, x: 0, y: 3, header:"loadcpu_usage_netmon"},
      { cols: 3, rows: 1, x: 3, y: 3, header:"loaddisk_usage_netmon"},
      { cols: 3, rows: 1, x: 6, y: 3, header:"loadmemory_usage_netmon"},
      { cols: 9, rows: 1, x: 0, y: 4, header:"loaddiskstatus_netmon"},
    ]
    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };
    this.themeService.currentcolorMessage.subscribe(value => {
      // console.log(value)
      if (window.location.hash == "#/servicestatus"){
      if (value == "saga-orange") {
        this.colortitle = "#2c2c2c"
        this.loading_cpu = true;
        this.loading_disk = true;
        this.loading_memory = true;
        this.dashboard.forEach(data =>{
          if (data.header == "loadcpu"){
            this.getcpu_usage();
          } else if (data.header == "loaddisk"){
            this.getdisk_usage();
          } else if (data.header == "loadmemory"){
            this.getmemory_usage();
          } else if (data.header == "loadcpu_usage_netmon"){
            this.getcpu_usage_netmon();
          } else if (data.header == "loaddisk_usage_netmon"){
            this.getdisk_usage_netmon();
          } else if (data.header == "loadmemory_usage_netmon"){
            this.getmemory_usage_netmon();
          } else if (data.header == "loaddiskstatus"){
            this.getdisk_status()
          } else if (data.header == "loaddiskstatus_netmon"){
            this.getdisk_status_netmon()
          }  else {
            this.loading_cpu = false;
            this.loading_disk = false;
            this.loading_memory = false;
            this.loadingcpu = false;
            this.loadingdisk = false;
            this.loadingmemory = false;
            this.loading_disk_status_netmon  = false;
          }
        })
      } else {
        this.colortitle = "#FFFFFF"
        this.loading_cpu = true;
        this.loading_disk = true;
        this.loading_memory = true;
        this.dashboard.forEach(data =>{
          if (data.header == "loadcpu"){
            this.getcpu_usage();
          } else if (data.header == "loaddisk"){
            this.getdisk_usage();
          } else if (data.header == "loadmemory"){
            this.getmemory_usage();
          } else if (data.header == "loaddiskstatus"){
            this.getdisk_status()
          } else if (data.header == "loadcpu_usage_netmon"){
            this.getcpu_usage_netmon();
          } else if (data.header == "loaddisk_usage_netmon"){
            this.getdisk_usage_netmon();
          } else if (data.header == "loadmemory_usage_netmon"){
            this.getmemory_usage_netmon();
          } else if (data.header == "loaddiskstatus_netmon"){
            this.getdisk_status_netmon()
          }  else {
            this.loading_cpu = false;
            this.loading_disk = false;
            this.loading_memory = false;
            this.loadingcpu = false;
            this.loadingdisk = false;
            this.loadingmemory = false;
            this.loading_disk_status_netmon  = false;
          }
        })
        
      }
    }
    });
    
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
  
  showPresentData() {
    this.loading = true;
    let today = new Date();
    let day = today.getDate();
    let daystart = day-1;
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    // let Preday = today.getDate() - 1;
    let hour = today.getHours();
    let min = today.getMinutes();
    let findmonth = month < 10 ? "0" + month : month;
    let findday = day < 10 ? "0" + day : day;
    let finddaystart = daystart < 10 ? "0" + daystart : daystart;
    let findhour = hour < 10 ? "0" + hour : hour;
    let findmin = min < 10 ? "0" + min : min;
    this.maxDate = today;
    var dateStringstart = year + "-" + findmonth + "-" + finddaystart  + " " + findhour + ":" + findmin;
    var dateStringend = year + "-" + findmonth + "-" + findday + " " + findhour + ":" + findmin;
    let datestart = new Date(dateStringstart);
    let dateend = new Date(dateStringend);
    this.start = datestart.getTime() / 1000;
    this.end = dateend.getTime() / 1000;
    this.getwindows_cpu_time_total(this.start, this.end, this.step)

    
    this.rangeDates = undefined;
    this.isSave = false;
    this.EndTimeH = hour;
    this.EndTimeM = min;
    this.startTimeH = hour;
    this.startTimeM = min;
   
  }
  getcpu_usage(){
    this.loading_cpu = true;
    this.ServicestatusService
      .cpu_usage().subscribe({
      next: results => {
        this.loading_cpu = false;
        this.loadingcpu = true;
        var valueCPU = results.data.result[0].value[1];
        this.valueCPU = parseFloat(valueCPU);
        if (!isNaN(this.valueCPU)) {
          this.valueCPU = parseFloat(this.valueCPU.toFixed(2));
        } 
       
      },error: error => {
        if (error) {
          this.loading_cpu = false;
          this.loadingcpu = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getdisk_usage(){
    this.loading_disk = true;
    this.ServicestatusService
      .disk_usage().subscribe({
      next: results => {
        this.loading_disk = false;
        this.loadingdisk = true;
        var valueDisk = results.data.result[0].value[1];
        this.valueDisk = parseFloat(valueDisk);
        if (!isNaN(this.valueDisk)) {
          this.valueDisk = parseFloat(this.valueDisk.toFixed(2));
        } 
       
      },error: error => {
        if (error) {
          this.loading_disk = false;
          this.loadingdisk = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getmemory_usage(){
    this.loading_memory = true;
    this.ServicestatusService
      .memory_usage().subscribe({
      next: results => {
        this.loading_memory = false;
        this.loadingmemory = true;
        var valueMemory = results.data.result[0].value[1];
        this.valueMemory = parseFloat(valueMemory);
        if (!isNaN(this.valueMemory)) {
          this.valueMemory = parseFloat(this.valueMemory.toFixed(2));
        } 
       
      },error: error => {
        if (error) {
          this.loading_memory = false;
          this.loadingmemory = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getcpu_usage_netmon(){
    this.loading_cpu_usage_netmon = true;
    this.ServicestatusService
      .cpu_usage_netmon().subscribe({
      next: results => {
        this.loading_cpu_usage_netmon = false;
        this.loadingcpu_usage_netmon = true;
        var valueCPU_netmon = results.data.result[0].value[1];
        this.valueCPU_netmon = parseFloat(valueCPU_netmon);
        if (!isNaN(this.valueCPU_netmon)) {
          this.valueCPU_netmon = parseFloat(this.valueCPU_netmon.toFixed(2));
        } 
       
      },error: error => {
        if (error) {
          this.loading_cpu_usage_netmon = false;
          this.loadingcpu_usage_netmon = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getdisk_usage_netmon(){
    this.loading_disk_usage_netmon = true;
    this.ServicestatusService
      .disk_usage_netmon().subscribe({
      next: results => {
        this.loading_disk_usage_netmon = false;
        this.loadingdisk_usage_netmon = true;
        var valueDisk_netmon = results.data.result[0].value[1];
        this.valueDisk_netmon = parseFloat(valueDisk_netmon);
        if (!isNaN(this.valueDisk_netmon)) {
          this.valueDisk_netmon = parseFloat(this.valueDisk_netmon.toFixed(2));
        } 
        
      },error: error => {
        if (error) {
          this.loading_disk_usage_netmon = false;
          this.loadingdisk_usage_netmon = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getmemory_usage_netmon(){
    this.loading_memory_usage_netmon = true;
    this.ServicestatusService
      .memory_usage_netmon().subscribe({
      next: results => {
        this.loading_memory_usage_netmon = false;
        this.loadingmemory_usage_netmon = true;
        var valueMemory_netmon = results.data.result[0].value[1];
        this.valueMemory_netmon = parseFloat(valueMemory_netmon);
        if (!isNaN(this.valueMemory_netmon)) {
          this.valueMemory_netmon = parseFloat(this.valueMemory_netmon.toFixed(2));
        } 
       
      },error: error => {
        if (error) {
          this.loading_memory_usage_netmon = false;
          this.loadingmemory_usage_netmon = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getdisk_status(){
    this.loading_disk_status = true;
    this.ServicestatusService
      .disk_status().subscribe({
      next: results => {
        this.loading_disk_status = false;
        this.loadingdisk_status = true;
        var value = results.result.map(volume => {
          var currentPercentage = parseFloat(((volume.usage / volume.total) * 100).toFixed(0));
          var remainingPercentage = 100 - currentPercentage;
          var totalGB = volume.total / (1024 ** 3)
          var usageGBcv = volume.usage / (1024 ** 3)
          var freeGBcv = volume.free / (1024 ** 3)
          return {
              usage: currentPercentage,
              remaining: parseFloat((remainingPercentage).toFixed(0)),
              total:(totalGB).toFixed(2) + " GB",
              usageGB:(usageGBcv).toFixed(2) + " GB",
              freeGB:(freeGBcv).toFixed(2) + " GB",
          };
        });
        
        var optionsstatus: any = {
          chart: {
            type: "bar",
            zoomType: "x",
            backgroundColor: "transparent"
          },
          title: {
            text: null,
            enabled: false,
            style: {
              color: this.colortitle
            }
          },
          legend: {
            enabled: false,
            itemStyle: {
              color: this.colortitle
            },
          },
         
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false,
          },
          xAxis: [{
            categories: ['C:', 'D:', 'HarddiskVolume1', 'HarddiskVolume4'],
            gridLineWidth: 0,
       
          },
          {
            linkedTo: 0, // Link the second x-axis to the first one
            opposite: true, // Position the second x-axis on the opposite side
            categories: value.map(volume => volume.total), // Labels for the second x-axis
            gridLineWidth: 0,
          }],
          yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            gridLineWidth: 0,
            title: {
              enabled: false
            },
            labels: {
              enabled: false // Set to false to hide yAxis labels
            },
            max: 100,
            opposite: true,
          },
          plotOptions: {
            bar: {
              stacking: 'normal',
            },
           
          },
          series: [
           {
            type: "bar",
            name: "Free",
            data: value.map(function (util) {
              return {
                y: util.remaining,
                freeGB: util.freeGB,
                color: '#D5D8DC',
              }
            }),
            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:#17202A ;padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.freeGB}</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          },
          {
            type: "bar",
            name: "Usage",
            data: value.map(function (util) {
              return {
                  y: util.usage,
                  usageGB: util.usageGB,
                  color: (function () {
                      if (util.usage < 81) {
                          return '#50D0BC'; // Set your first color for values less than 80
                      } else if (util.usage < 91) {
                          return '#FFBB55'; // Set your second color for values between 80 and 90
                      } else {
                          return '#FF7782'; // Set your third color for values greater than or equal to 90
                      }
                  })()
              };
           }),
          tooltip: {
            headerFormat:
              '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
              '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.usageGB}</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true
          }
          },
         
          ]
        };
        Highcharts.chart("disk_status_chart", optionsstatus);
        
        
      },error: error => {
        if (error) {
          this.loading_disk_status = false;
          this.loadingdisk_status = false;
          // this.checkchart = false;
        }
      }
    });
  }
 
  getdisk_status_netmon(){
    this.loading_disk_status_netmon = true;
    this.ServicestatusService
      .disk_status_netmon().subscribe({
      next: results => {
        this.loading_disk_status_netmon = false;
        this.loadingdisk_status_netmon = true;
        var value = results.result.map(volume => {
          var currentPercentage = parseFloat(((volume.usage / volume.total) * 100).toFixed(0));
          var remainingPercentage = 100 - currentPercentage;
          var totalGB = volume.total / (1024 ** 3)
          var usageGBcv = volume.usage / (1024 ** 3)
          var freeGBcv = volume.free / (1024 ** 3)
         // Conditional check for total and usage
         let total = totalGB > 1024 ? (totalGB / 1024).toFixed(2) + " TB" : totalGB.toFixed(2) + " GB";
         let usageGB = usageGBcv > 1024 ? (usageGBcv / 1024).toFixed(2) + " TB" : usageGBcv.toFixed(2) + " GB";
         let freeGB = freeGBcv > 1024 ? (freeGBcv / 1024).toFixed(2) + " TB" : freeGBcv.toFixed(2) + " GB";
       
       
         return {
           usage: currentPercentage,
           remaining: parseFloat(remainingPercentage.toFixed(0)),
           total: total,
           usageGB: usageGB,
           freeGB: freeGB,
         };

          
         
        });
        
        var optionsstatus: any = {
          chart: {
            type: "bar",
            zoomType: "x",
            backgroundColor: "transparent",
            height: 150
          },
          title: {
            text: null,
            enabled: false,
            style: {
              color: this.colortitle
            }
          },
          legend: {
            enabled: false,
            itemStyle: {
              color: this.colortitle
            },
          },
         
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false,
          },
          xAxis: [{
            categories: ['C:'],
            gridLineWidth: 0,
       
          },
          {
            linkedTo: 0, // Link the second x-axis to the first one
            opposite: true, // Position the second x-axis on the opposite side
            categories: value.map(volume => volume.total), // Labels for the second x-axis
            gridLineWidth: 0,
          }],
          yAxis: {
           
            gridLineWidth: 0,
            title: {
              enabled: false
            },
            labels: {
              enabled: false // Set to false to hide yAxis labels
            },
            max: 100,
            opposite: true,
          },
          plotOptions: {
            bar: {
              stacking: 'normal',
            },
           
          },
          series: [
           {
            type: "bar",
            name: "Free",
            data: value.map(function (util) {
              return {
                y: util.remaining,
                freeGB: util.freeGB,
                color: '#D5D8DC',
              }
            }),
            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><br><td style="color:#17202A ;padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.freeGB}</b></td></tr>',
              footerFormat: "</table>",
              shared: true,
              useHTML: true
            }
          },
          {
            type: "bar",
            name: "Usage",
            data: value.map(function (util) {
              return {
                  y: util.usage,
                  usageGB: util.usageGB,
                  color: (function () {
                      if (util.usage < 81) {
                          return '#50D0BC'; // Set your first color for values less than 80
                      } else if (util.usage < 91) {
                          return '#FFBB55'; // Set your second color for values between 80 and 90
                      } else {
                          return '#FF7782'; // Set your third color for values greater than or equal to 90
                      }
                  })()
              };
           }),
          tooltip: {
            headerFormat:
              '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
              '<tr><br><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.usageGB}</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true
          }
          },
         
          ]
        };
        Highcharts.chart("disk_status_netmon_chart", optionsstatus);
        
        
      },error: error => {
        if (error) {
          this.loading_disk_status_netmon = false;
          this.loadingdisk_status_netmon = false;
          // this.checkchart = false;
        }
      }
    });
  }
  getTextColor(util: number): string {
    if (util < 81) {
      return '#50D0BC'; // Set your first color for values less than 33.33
    } else if (util < 91) {
      return '#FFBB55'; // Set your second color for values between 33.33 and 66.66
    } else {
      return '#FF7782'; // Set your third color for values greater than or equal to 66.66
    }
  }
  getwindows_cpu_time_total(start,end,step){
    this.ServicestatusService
      .windows_cpu_time_total(start,end,step).subscribe({
      next: results => {
        if (results == null) {
          this.loading = false;
          this.loadingchartcpu = false;
          this.loadingchart_cpuNone = false;
          // this.loading1 = false;
          // this.checkchart = false;
        }  else {
          const updatedResultavg = results.data.result[0].values.map((item) => [Number(item[0]+ "000"), parseFloat(item[1])* 100]);
          const updatedResultmax = results.data.result[1].values.map((item) => [Number(item[0]+ "000"), parseFloat(item[1])* 100]);
          const updatedResultmin = results.data.result[2].values.map((item) => [Number(item[0]+ "000"), parseFloat(item[1])* 100]);
          this.loadingchartcpu = true;
          this.loading = false;
          this.menuExportcpu_time = [
            {
              label: "Download",
              items: [
                {
                  label: "Download JPEG Image",
                  // icon: "pi pi-fw pi-cog",
                  command: event => {
                    this.CPUChart.exportChart(
                      {
                        type: "image/jpeg",
                        filename:
                          "CPU Service Status",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text:
                          "CPU Service Status",
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
                    this.CPUChart.exportChart(
                      {
                        type: "image/png",
                        filename:
                          "CPU Service Status",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text:
                          "CPU Service Status",
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
                    this.CPUChart.exportChart(
                      {
                        type: "application/pdf",
                        filename:
                          "CPU Service Status",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text:
                          "CPU Service Status",
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
              text: `CPU time`,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              itemStyle: {
                color: this.colortitle
              }
            },
           
            credits: {
              enabled: false
            },
            exporting: {
              enabled: false,
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
              },
              max: 100
            },
            plotOptions: {
              time: {
                timezone: "Asia/Bangkok",
                timezoneOffset: -7 * 60
              },
           
            },
            series: [
              {
                type: "line",
                name: "max",
                data: updatedResultmax,
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
              },
              {
                type: "line",
                name: "min",
                data: updatedResultmin,
                color: "#0000FF",
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
              },
              {
                type: "line",
                name: "avg",
                data: updatedResultavg,
                color: "#2ECC71",
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
          Highcharts.chart("CPU", optionsstatus);
          this.CPUChart = Highcharts.chart("CPU", optionsstatus);
        }
      },
      error: error => {
        if (error) {
          this.loading = false;
          this.loadingchartcpu = false;
          this.loadingchart_cpuNone = false;
          // this.checkchart = false;
        }
      }
    });
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
        var dateStringstart = `${startYear}-${startMonth}-${startDay} ${timestartH}:${timestartM}`;
        var dateStringend = `${endYear}-${endMonth}-${endDay} ${timeEndH}:${timeEndM}`;
        let datestart = new Date(dateStringstart);
        let dateend = new Date(dateStringend);
        this.start = datestart.getTime() / 1000;
        this.end = dateend.getTime() / 1000;
        this.getwindows_cpu_time_total(this.start,this.end,"5m")
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

