import { Component, ViewChild, OnInit, ChangeDetectorRef } from "@angular/core";
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
import * as $ from "jquery";

import {
  GridType,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface
} from "angular-gridster2";

declare global {
  interface JQuery {
    sparkline(): void;
  }
}
@Component({
  selector: "app-servicestatus",
  templateUrl: "./servicestatus.component.html",
  styleUrls: ["./servicestatus.component.css"],
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
  RangeCPU: Highcharts.Chart;
  optionsstatus: any;
  optionsstatusCPU: any;
  optionsstatusMemory: any;
  optionsstatus2: any;
  intervalId: NodeJS.Timeout;
  constructor(
    public themeService: ThemeService,
    private titleService: Title,
    private ServicestatusService: ServicestatusService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef
  ) {}
  colortitle: any;
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
  step: any = "5m";
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
  CPUChart: any;
  maxDate: Date;
  isLoading: boolean = false;
  loadingMessage: string = "Loading data..."; // ข้อความแสดงสถานะการโหลด
  startTimeH: any = 0;
  startTimeM: any = 0;
  EndTimeH: any = 0;
  EndTimeM: any = 0;
  invalidstartH: any;
  // valueCPU: any;
  valueCPU: { [key: string]: any[] } = {};
  valueDisk: any;
  valueMemory: { [key: string]: any[] } = {};
  valueCPU_netmon: any;
  valueDisk_netmon: any;
  valueMemory_netmon: any;
  dashboard: any[] = [];
  basicDatadisk_status: any;
  horizontalOptions: any;
  tabs: {
    isOpen: boolean;
    header: string;
    content: string;
  }[] = [];
  tabsMock = [
    { header: "Tab 1", content: "This is the content of Tab 1.", isOpen: true },
    { header: "Tab 2", content: "This is the content of Tab 2.", isOpen: true },
    { header: "Tab 3", content: "This is the content of Tab 3.", isOpen: true }
  ];
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
    { start: 0, end: 33.33, color: "green" },
    { start: 33.33, end: 66.66, color: "yellow" },
    { start: 66.66, end: 100, color: "red" }
  ];
  value = [{ label: "Space used", value: 15, color: "#34d399" }];
  basicData: any;
  basicOptions: any;
  data: any;
  options: any;
  chartData: any;
  chartOptions: any;
  ngOnInit(): void {
    this.loadData();
    // this.intervalId = setInterval(() => {
    this.refreshCharts(); // Update charts every 3 seconds
    // }, 3000);
    this.optionsstatus = {
      chart: {
        zoomType: null, // ปิดการซูม
        backgroundColor: "transparent",
        panning: false, // ปิดการลากกราฟ
        marginLeft: 0, // ปิด margin ซ้าย
        width: 200, // กำหนดความกว้างของกราฟ (600px)
        height: 40 // กำหนดความสูงของกราฟ (300px)
      },
      title: {
        text: ``,
        style: {
          color: this.colortitle
        },
        // ปิดชื่อกราฟ
        floating: true,
        align: "center"
      },
      legend: {
        enabled: false // ปิดการแสดงผล Legend
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      xAxis: {
        type: "category", // ใช้แกน X แบบค่าหมวดหมู่
        gridLineWidth: 0, // ลบเส้นกริด
        labels: {
          enabled: false // เอา Label ออก
        },
        title: {
          text: null // ลบชื่อแกน X
        },
        tickWidth: 0 // ลบ ticks ของแกน X
      },
      yAxis: {
        gridLineWidth: 0, // ลบเส้นกริดในแกน Y
        labels: {
          enabled: false // เอา Label ออก
        },
        title: {
          text: null // ลบชื่อแกน Y
        },
        tickWidth: 0 // ลบ ticks ของแกน Y
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false // ปิดจุดบนกราฟ
          }
        }
      },
      series: [
        {
          type: "line",
          name: "Util", // ชื่อของ Series จะไม่แสดงเพราะปิด Legend
          data: [
            9,
            8,
            6,
            8,
            4,
            3,
            8,
            7,
            6,
            1,
            9,
            8,
            9,
            4,
            8,
            5,
            1,
            8,
            9,
            8,
            9,
            8,
            3,
            5,
            9,
            5,
            4,
            4,
            2,
            5
          ], // ข้อมูลตัวเลข
          color: "#F2F2F2",
          lineWidth: 1,
          tooltip: {
            headerFormat:
              '<span style="font-size:10px">Data Point: {point.key}</span><table>',
            pointFormat:
              '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true
          }
        }
      ]
    };
    this.optionsstatus2 = {
      chart: {
        zoomType: null, // ปิดการซูม
        backgroundColor: "transparent",
        panning: false, // ปิดการลากกราฟ
        marginLeft: 0, // ปิด margin ซ้าย
        width: 200, // กำหนดความกว้างของกราฟ (600px)
        height: 40 // กำหนดความสูงของกราฟ (300px)
      },
      title: {
        text: ``,
        style: {
          color: this.colortitle
        },
        // ปิดชื่อกราฟ
        floating: true,
        align: "center"
      },
      legend: {
        enabled: false // ปิดการแสดงผล Legend
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      xAxis: {
        type: "category", // ใช้แกน X แบบค่าหมวดหมู่
        gridLineWidth: 0, // ลบเส้นกริด
        labels: {
          enabled: false // เอา Label ออก
        },
        title: {
          text: null // ลบชื่อแกน X
        },
        tickWidth: 0 // ลบ ticks ของแกน X
      },
      yAxis: {
        gridLineWidth: 0, // ลบเส้นกริดในแกน Y
        labels: {
          enabled: false // เอา Label ออก
        },
        title: {
          text: null // ลบชื่อแกน Y
        },
        tickWidth: 0 // ลบ ticks ของแกน Y
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false // ปิดจุดบนกราฟ
          }
        }
      },
      series: [
        {
          type: "line",
          name: "Util", // ชื่อของ Series จะไม่แสดงเพราะปิด Legend
          data: [2, 6, 2, 7, 1, 6, 3, 8, 8, 4, 3, 9, 8, 8, 7, 8, 7, 4, 1, 3],
          color: "#F2F2F2",
          lineWidth: 1,
          tooltip: {
            headerFormat:
              '<span style="font-size:10px">Data Point: {point.key}</span><table>',
            pointFormat:
              '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true
          }
        }
      ]
    };

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    this.titleService.setTitle("SED-Service status");
    this.themeService.currentpage("/servicestatus");
    this.gridOptions = this.initialGridOptions;

    this.dashboard = [
      { cols: 3, rows: 1, x: 0, y: 0, header: "loadcpu" },
      { cols: 3, rows: 1, x: 3, y: 0, header: "loaddisk" },
      { cols: 3, rows: 1, x: 6, y: 0, header: "loadmemory" },
      {
        cols: 9,
        rows: 2,
        x: 0,
        y: 1,
        header: "loaddiskstatus"
      }
    ];

    this.horizontalOptions = {
      indexAxis: "y",
      plugins: {
        legend: {
          labels: {
            color: "#495057"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#495057"
          },
          grid: {
            color: "#ebedef"
          }
        },
        y: {
          ticks: {
            color: "#495057"
          },
          grid: {
            color: "#ebedef"
          }
        }
      }
    };
    this.themeService.currentcolorMessage.subscribe(value => {
      // console.log(value)
      if (window.location.hash == "#/servicestatus") {
        if (value == "saga-orange") {
          this.colortitle = "#2c2c2c";
          this.loading_cpu = true;
          this.loading_disk = true;
          this.loading_memory = true;
          this.dashboard.forEach(data => {
            if (data.header == "loadcpu") {
              this.getcpu_usage();
            } else if (data.header == "loaddisk") {
              this.getdisk_usage();
            } else if (data.header == "loadmemory") {
              this.getcpu_usage();
            } else if (data.header == "loaddiskstatus") {
              this.getdisk_status();
            } else {
              this.loading_cpu = false;
              this.loading_disk = false;
              this.loading_memory = false;
              this.loadingcpu = false;
              this.loadingdisk = false;
              this.loadingmemory = false;
              this.loading_disk_status_netmon = false;
            }
          });
        } else {
          this.colortitle = "#FFFFFF";
          this.loading_cpu = true;
          this.loading_disk = true;
          this.loading_memory = true;
          this.dashboard.forEach(data => {
            if (data.header == "loadcpu") {
              this.getcpu_usage();
            } else if (data.header == "loaddisk") {
              this.getdisk_usage();
            } else if (data.header == "loadmemory") {
              this.getcpu_usage();
            } else if (data.header == "loaddiskstatus") {
              this.getdisk_status();
            } else {
              this.loading_cpu = false;
              this.loading_disk = false;
              this.loading_memory = false;
              this.loadingcpu = false;
              this.loadingdisk = false;
              this.loadingmemory = false;
              this.loading_disk_status_netmon = false;
            }
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval
      console.log("Interval cleared");
    } // Clear interval on component destruction
    console.log("Component destroyed, interval cleared");
  }

  refreshCharts() {
    // For each tab, call methods to update the data
    this.getcpu_usage();
    this.getdisk_usage();
    // this.getmemory_usage();
    this.loadData();
    this.cdRef.detectChanges();
  }

  toggleTab(index: number) {
    this.tabs[index].isOpen = !this.tabs[index].isOpen;
    if (this.tabs[index].isOpen) {
      this.dashboard.forEach(data => {
        if (data.header == "loadcpu") {
          this.getcpu_usage();
        } else if (data.header == "loaddisk") {
          this.getdisk_usage();
        } else if (data.header == "loadmemory") {
          this.getcpu_usage();
        } else if (data.header == "loaddiskstatus") {
          this.getdisk_status();
        } else {
          this.loading_cpu = false;
          this.loading_disk = false;
          this.loading_memory = false;
          this.loadingcpu = false;
          this.loadingdisk = false;
          this.loadingmemory = false;
          this.loading_disk_status_netmon = false;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const container = document.getElementById("containerCPU-1");
      console.log("Container DOM:", container);
      if (container) {
        Highcharts.chart("containerCPU-1", this.optionsstatus);
      } else {
        console.warn("Div with id 'containerCPU-1' not found!");
      }
    }, 0);
  }
  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.tabs.forEach((tab, index) => {
        // สำหรับ containerCPU
        const containerCPUId = `containerCPU-${index}`;
        const containerCPU = document.getElementById(containerCPUId);
        if (containerCPU) {
          if (!containerCPU.getAttribute("data-chart-initialized")) {
            Highcharts.chart(containerCPUId, this.optionsstatus);
            containerCPU.setAttribute("data-chart-initialized", "true");
          }
        } else {
          console.warn(`Container ${containerCPUId} not found`);
        }

        // สำหรับ containerMemory
        const containerMemoryId = `containerMemory-${index}`;
        const containerMemory = document.getElementById(containerMemoryId);
        if (containerMemory) {
          if (!containerMemory.getAttribute("data-chart-initialized")) {
            Highcharts.chart(containerMemoryId, this.optionsstatus2);
            containerMemory.setAttribute("data-chart-initialized", "true");
          }
        } else {
        }
      });
    }, 0);
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

  loadData() {
    // เริ่มต้นให้สถานะเป็น loading สำหรับทุก tab
    this.isLoading = true;

    // โหลดข้อมูล Linux
    this.ServicestatusService.getDataLinux().subscribe({
      next: (linuxResponse: any) => {
        if (linuxResponse.success && Array.isArray(linuxResponse.data)) {
          // แปลงข้อมูล Linux เป็น tabs
          const linuxTabs = linuxResponse.data.map(item => ({
            header: {
              instance: item.instance,
              cpuAvg: item.cpu.avg.toFixed(2),
              memoryUsed: item.memory.used.toFixed(2)
            },
            content: `
            OS: ${item.os}
            CPU Avg: ${item.cpu.avg.toFixed(2)}
            Memory Used: ${item.memory.used.toFixed(2)}%
            Storage EXT4 Used: ${item.storage.ext4.used.toFixed(2)} GB
          `,
            isOpen: false,
            isLoading: false // แท็บโหลดเสร็จแล้ว
          }));
          this.tabs.push(...linuxTabs); // เพิ่มข้อมูล Linux
          console.log("Linux Tabs:", this.tabs);
          this.checkLoadingStatus();
        } else {
          console.error("Invalid Linux response format:", linuxResponse);
        }

        // โหลดข้อมูล Windows
        this.ServicestatusService.getDataWindow().subscribe({
          next: (windowResponse: any) => {
            if (windowResponse.success && Array.isArray(windowResponse.data)) {
              // แปลงข้อมูล Windows เป็น tabs
              const windowTabs = windowResponse.data.map(item => ({
                header: {
                  instance: item.instance,
                  cpuAvg: item.cpu.avg.toFixed(2),
                  memoryUsed: item.memory.used.toFixed(2)
                },
                content: `
                OS: ${item.os}
                CPU Avg: ${item.cpu.avg.toFixed(2)}
                Memory Used: ${item.memory.used.toFixed(2)}%
                Storage C: Used: ${item.storage["C:"].used.toFixed(2)} GB
                Storage D: Used: ${item.storage["D:"].used.toFixed(2)} GB
                Storage E: Used: ${item.storage["E:"].used.toFixed(2)} GB
              `,
                isOpen: false,
                isLoading: false // แท็บโหลดเสร็จแล้ว
              }));
              this.tabs.push(...windowTabs); // เพิ่มข้อมูล Windows
              console.log("Windows Tabs:", this.tabs);
              this.checkLoadingStatus();
              this.cdRef.detectChanges(); // บังคับให้ Angular ตรวจสอบการเปลี่ยนแปลง
            } else {
              console.error("Invalid Windows response format:", windowResponse);
            }
          },
          error: error => {
            console.error("Error fetching Windows data:", error);
            this.checkLoadingStatus(); // หยุดการโหลดหากเกิดข้อผิดพลาด
          }
        });
      },
      error: error => {
        console.error("Error fetching Linux data:", error);
        this.checkLoadingStatus(); // หยุดการโหลดหากเกิดข้อผิดพลาด
      }
    });
  }

  // ฟังก์ชันตรวจสอบสถานะการโหลด
  checkLoadingStatus() {
    if (this.tabs.length > 0) {
      this.isLoading = false; // เปลี่ยนสถานะเป็นไม่โหลดแล้วเมื่อข้อมูลมี
    }
  }

  getcpu_usage() {
    this.loading_cpu = true;
    this.loadingcpu = false; // Hide chart before loading
    this.loading_memory = true;
    // Fetch data from both Linux and Windows APIs using Promise.all
    Promise.all([
      this.ServicestatusService.getDataLinux().toPromise(),
      this.ServicestatusService.getDataWindow().toPromise()
    ])
      .then(([linuxData, windowData]) => {
        if (
          linuxData.success &&
          Array.isArray(linuxData.data) &&
          windowData.success &&
          Array.isArray(windowData.data)
        ) {
          // Combine CPU data from Linux and Windows
          const allCPUData = [...linuxData.data, ...windowData.data];
          console.log(allCPUData);
          // Calculate average CPU usage
          const cpuAverages = allCPUData.map(item => item.cpu.avg);
          const ramAverages = allCPUData.map(item => item.memory.free);
          console.log(ramAverages[0]);
          const overallCPUAvg =
            cpuAverages.reduce((sum, value) => sum + value, 0) /
            cpuAverages.length;
          allCPUData.forEach((item, index) => {
            this.valueCPU[index] = item.cpu.avg.toFixed(2);
            this.valueMemory[index] = item.memory.free.toFixed(2);
            // Your code logic here, using 'item' (the current element)
          });
          const linuxFilter = allCPUData.filter(item => item.os === "linux");
          const windowsFilter = allCPUData.filter(
            item => item.os === "windows"
          );
          console.log(linuxFilter, windowsFilter);

          // this.valueCPU[] = parseFloat(overallCPUAvg.toFixed(2));
          console.log(this.valueCPU);
          this.loading_cpu = false; // Loading finished
          this.loadingcpu = true; // Show chart
          this.loading_memory = false;
          this.loadingmemory = true;
        } else {
          console.error("Invalid response format:", linuxData, windowData);
          this.loading_cpu = false;
          this.loadingcpu = false;
          this.loadingmemory = false;
        }
      })
      .catch(error => {
        console.error("Error fetching CPU data:", error);
        this.loading_cpu = false;
        this.loadingcpu = false;
      });
  }

  getdisk_usage() {
    this.loading_disk = true;
    this.ServicestatusService.getDataLinux().subscribe({
      next: linuxResults => {
        this.ServicestatusService.getDataWindow().subscribe({
          next: windowResults => {
            this.loading_disk = false;
            this.loadingdisk = true;

            // Combine storage data from Linux and Windows
            const linuxStorageData = linuxResults.data.map(
              instance => instance.storage.ext4
            );
            const windowStorageData = windowResults.data.flatMap(instance =>
              Object.values(instance.storage)
            );

            const allStorageData = [...linuxStorageData, ...windowStorageData];

            // Calculate average used storage
            const totalStorage = allStorageData.reduce(
              (acc, data) => acc + data.used,
              0
            );
            const totalInstances = allStorageData.length;

            if (totalInstances > 0) {
              this.valueDisk = totalStorage / totalInstances;
              this.valueDisk = parseFloat(this.valueDisk.toFixed(2)); // Round to two decimal places
            } else {
              this.valueDisk = 0;
            }
          },
          error: error => {
            if (error) {
              this.loading_disk = false;
              this.loadingdisk = false;
            }
          }
        });
      },
      error: error => {
        if (error) {
          this.loading_disk = false;
          this.loadingdisk = false;
        }
      }
    });
  }

  // getmemory_usage() {
  //   this.loading_memory = true;
  //   this.ServicestatusService.getDataLinux().subscribe({
  //     next: linuxResults => {
  //       this.ServicestatusService.getDataWindow().subscribe({
  //         next: windowResults => {
  //           this.loading_memory = false;
  //           this.loadingmemory = true;

  //           // Combine memory data from Linux and Windows
  //           const linuxMemoryData = linuxResults.data.map(
  //             instance => instance.memory.used
  //           );
  //           const windowMemoryData = windowResults.data.map(
  //             instance => instance.memory.used
  //           );

  //           const allMemoryData = [...linuxMemoryData, ...windowMemoryData];

  //           // Calculate the total used memory and average it
  //           const totalMemory = allMemoryData.reduce(
  //             (acc, used) => acc + used,
  //             0
  //           );
  //           const totalInstances = allMemoryData.length;

  //           if (totalInstances > 0) {
  //             this.valueMemory = totalMemory / totalInstances; // Calculate average used memory
  //             this.valueMemory = parseFloat(this.valueMemory.toFixed(2)); // Round to two decimal places
  //           } else {
  //             this.valueMemory = 0;
  //           }
  //         },
  //         error: error => {
  //           if (error) {
  //             this.loading_memory = false;
  //             this.loadingmemory = false;
  //           }
  //         }
  //       });
  //     },
  //     error: error => {
  //       if (error) {
  //         this.loading_memory = false;
  //         this.loadingmemory = false;
  //       }
  //     }
  //   });
  // }

  // getcpu_usage_netmon() {
  //   this.loading_cpu_usage_netmon = true;
  //   this.ServicestatusService.cpu_usage_netmon().subscribe({
  //     next: results => {
  //       this.loading_cpu_usage_netmon = false;
  //       this.loadingcpu_usage_netmon = true;
  //       var valueCPU_netmon = results.data.result[0].value[1];
  //       this.valueCPU_netmon = parseFloat(valueCPU_netmon);
  //       if (!isNaN(this.valueCPU_netmon)) {
  //         this.valueCPU_netmon = parseFloat(this.valueCPU_netmon.toFixed(2));
  //       }
  //     },
  //     error: error => {
  //       if (error) {
  //         this.loading_cpu_usage_netmon = false;
  //         this.loadingcpu_usage_netmon = false;
  //         // this.checkchart = false;
  //       }
  //     }
  //   });
  // }
  valueChart: { [key: string]: any } = {};
  getdisk_status() {
    this.loading_disk_status = true;
    this.ServicestatusService.getDataLinux().subscribe({
      next: resultsLinux => {
        this.ServicestatusService.getDataWindow().subscribe({
          next: resultsWindow => {
            var allResults = [...resultsLinux.data, ...resultsWindow.data];
            var AllResultsExt4 = [];
            var AllResultsTMPFS = [];
            AllResultsExt4 = allResults
              .map(item => {
                if (item.os === "linux") {
                  if (item.storage.ext4) {
                    const currentPercentageExt4 = parseFloat(
                      (
                        (item.storage.ext4.used / item.storage.ext4.total) *
                        100
                      ).toFixed(0)
                    );
                    const remainingPercentageExt4 = 100 - currentPercentageExt4;
                    const totalGBExt4 = item.storage.ext4.total / 1024 ** 3;
                    const usageGBcvExt4 = item.storage.ext4.used / 1024 ** 3;
                    const avgExt4 = (item.storage.ext4.avg / 1024) * 3;

                    return {
                      os: item.os,
                      type: "ext4",
                      usage: currentPercentageExt4,
                      remaining: parseFloat(remainingPercentageExt4.toFixed(0)),
                      total: `${totalGBExt4.toFixed(2)} GB`,
                      usageGB: `${usageGBcvExt4.toFixed(2)} GB`,
                      avg: `${avgExt4.toFixed(2)} GB`
                    };
                  }
                }
                return null; // สำหรับ item ที่ไม่ใช่ linux หรือไม่มี ext4/tmpfs
              })
              .filter(item => item !== null); // ลบค่าที่เป็น null ออกจากผลลัพธ์
            console.log(AllResultsExt4);
            AllResultsTMPFS = allResults
              .map(item => {
                if (item.os === "linux") {
                  if (item.storage.tmpfs) {
                    const currentPercentageTMPFS = parseFloat(
                      (
                        (item.storage.tmpfs.used / item.storage.tmpfs.total) *
                        100
                      ).toFixed(0)
                    );
                    const remainingPercentageTMPFS =
                      100 - currentPercentageTMPFS;
                    const totalGBTMPFS = item.storage.tmpfs.total / 1024 ** 3;
                    const usageGBcvTMPFS = item.storage.tmpfs.used / 1024 ** 3;
                    const avgTMPFS = (item.storage.tmpfs.avg / 1024) * 3;

                    return {
                      os: item.os,
                      type: "tmpfs",
                      usage: currentPercentageTMPFS,
                      remaining: parseFloat(
                        remainingPercentageTMPFS.toFixed(0)
                      ),
                      total: `${totalGBTMPFS.toFixed(2)} GB`,
                      usageGB: `${usageGBcvTMPFS.toFixed(2)} GB`,
                      avg: `${avgTMPFS.toFixed(2)} GB`
                    };
                  }
                }
                return null; // สำหรับ item ที่ไม่ใช่ linux หรือไม่มี ext4/tmpfs
              })
              .filter(item => item !== null); // ลบค่าที่เป็น null ออกจากผลลัพธ์
            console.log(AllResultsTMPFS);
            const maxLength = Math.max(
              AllResultsExt4.length,
              AllResultsTMPFS.length
            );
            const mergeResults = Array.from(
              { length: maxLength },
              (_, index) => ({
                ext4: AllResultsExt4[index] || null,
                tmpfs: AllResultsTMPFS[index] || null
              })
            );
            this.loading_disk_status = false;
            this.loadingdisk_status = true;
            if (this.loadingdisk_status) {
              mergeResults.forEach((item, index) => {
                const chartId = `disk_status_chart_${index}`;
                const container = document.getElementById(chartId);
                if (!container) {
                  return;
                }
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
                    enabled: true, // เปิด legend เพื่อบอกว่าข้อมูลมาจาก ext4 หรือ tmpfs
                    itemStyle: {
                      color: this.colortitle
                    }
                  },
                  credits: {
                    enabled: false
                  },
                  exporting: {
                    enabled: false
                  },
                  xAxis: {
                    categories: ["ext4", "tmpfs"],
                    gridLineWidth: 0
                  },
                  yAxis: {
                    minPadding: 0.2,
                    maxPadding: 0.2,
                    gridLineWidth: 0,
                    title: {
                      text: "Usage (%)"
                    },
                    labels: {
                      enabled: true // แสดง label บน yAxis
                    },
                    max: 100,
                    opposite: false
                  },
                  plotOptions: {
                    bar: {
                      stacking: "normal"
                    }
                  },
                  series: [
                    {
                      type: "bar",
                      name: "ext4", // ชื่อซีรีส์
                      data: item.ext4
                        ? [
                            {
                              y: item.ext4.usage,
                              usageGB: item.ext4.usageGB,
                              color: "#50D0BC" // สีของ ext4
                            }
                          ]
                        : [],
                      tooltip: {
                        headerFormat:
                          '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat:
                          '<tr><td style="color:#17202A ;padding:0">{series.name}: </td>' +
                          '<td style="padding:0"><b>{point.usageGB}</b></td></tr>',
                        footerFormat: "</table>",
                        shared: true,
                        useHTML: true
                      }
                    },
                    {
                      type: "bar",
                      name: "tmpfs", // ชื่อซีรีส์
                      data: item.tmpfs
                        ? [
                            {
                              y: item.tmpfs.usage,
                              usageGB: item.tmpfs.usageGB,
                              color: "#FF7782" // สีของ tmpfs
                            }
                          ]
                        : [],
                      tooltip: {
                        headerFormat:
                          '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat:
                          '<tr><td style="color:#17202A ;padding:0">{series.name}: </td>' +
                          '<td style="padding:0"><b>{point.usageGB}</b></td></tr>',
                        footerFormat: "</table>",
                        shared: true,
                        useHTML: true
                      }
                    }
                  ]
                };
                Highcharts.chart(chartId, optionsstatus); // แสดงกราฟหลายอัน
                this.valueChart[index] = Highcharts.chart(
                  chartId,
                  optionsstatus
                ); // แสดงกราฟหลายอัน
              });
            }
          },
          error: error => {
            if (error) {
              this.loading_disk_status = false;
              this.loadingdisk_status = false;
              // this.checkchart = false;
            }
          }
        });
      },
      error: error => {
        if (error) {
          this.loading_disk_status = false;
          this.loadingdisk_status = false;
          // this.checkchart = false;
        }
      }
    });
  }

  getTextColor(util: number): string {
    if (util < 81) {
      return "#50D0BC"; // Set your first color for values less than 33.33
    } else if (util < 91) {
      return "#FFBB55"; // Set your second color for values between 33.33 and 66.66
    } else {
      return "#FF7782"; // Set your third color for values greater than or equal to 66.66
    }
  }
  getwindows_cpu_time_total(start, end, step) {
    this.ServicestatusService.windows_cpu_time_total(
      start,
      end,
      step
    ).subscribe({
      next: results => {
        if (results == null) {
          this.loading = false;
          this.loadingchartcpu = false;
          this.loadingchart_cpuNone = false;
          // this.loading1 = false;
          // this.checkchart = false;
        } else {
          const updatedResultavg = results.data.result[0].values.map(item => [
            Number(item[0] + "000"),
            parseFloat(item[1]) * 100
          ]);
          const updatedResultmax = results.data.result[1].values.map(item => [
            Number(item[0] + "000"),
            parseFloat(item[1]) * 100
          ]);
          const updatedResultmin = results.data.result[2].values.map(item => [
            Number(item[0] + "000"),
            parseFloat(item[1]) * 100
          ]);
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
                        filename: "CPU Service Status",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        chart: {
                          backgroundColor: "#ffffff" // Set your desired background color here
                        },
                        title: {
                          text: "CPU Service Status",
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
                        filename: "CPU Service Status",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "CPU Service Status",
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
                        filename: "CPU Service Status",
                        sourceWidth: 1000,
                        sourceHeight: 300
                      },
                      {
                        title: {
                          text: "CPU Service Status",
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
              },
              max: 100
            },
            plotOptions: {
              time: {
                timezone: "Asia/Bangkok",
                timezoneOffset: -7 * 60
              }
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
}
