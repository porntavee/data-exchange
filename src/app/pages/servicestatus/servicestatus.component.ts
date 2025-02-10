import {
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);
import { Title } from "@angular/platform-browser";
import { ThemeService } from "app/theme.service";
import { ServicestatusService } from "@app/pages/servicestatus/servicestatus.service";
import { MessageService } from "primeng/api";

import {
  GridType,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface
} from "angular-gridster2";

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
        min-height: 250px;
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
      @media (max-width: 1007px) {
        gridster-item {
          min-height: 220px !important;
        }
      }
      @media (max-width: 976px) {
        gridster-item {
          max-height: 220px !important;
        }
      }
    `
  ]
})
export class ServicestatusComponent implements OnInit {
  @ViewChild("cal2") calendar: any;

  RangeCPU: Highcharts.Chart;
  optionsstatusCPU: any;
  optionsstatusMemory: any;
  intervalId: NodeJS.Timeout;
  isNodata: boolean;
  lastProcessedMinute: number;
  isMobile: boolean;
  constructor(
    public themeService: ThemeService,
    private titleService: Title,
    private ServicestatusService: ServicestatusService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}
  colortitle: any;
  gridOptions: GridsterConfig;
  rangeDates: Date[];
  formattedStartDate: any;
  loading: boolean = true;
  loadingchart_cpuNone: boolean = true;
  CPUChart: any;
  products = [
    { code: "P001", name: "Apple", category: "Fruit", quantity: 30 },
    { code: "P002", name: "Banana", category: "Fruit", quantity: 50 },
    { code: "P003", name: "Carrot", category: "Vegetable", quantity: 20 },
    { code: "P004", name: "Tomato", category: "Vegetable", quantity: 40 },
    { code: "P005", name: "Milk", category: "Dairy", quantity: 15 }
  ];
  isLoading: boolean = false;
  isNoData: boolean = false;
  invalidstartH: any;
  valueDisk: any;
  selectedOption: string = "Storage"; // เริ่มต้นที่ Storage
  dashboard: any[] = [];
  horizontalOptions: any;

  tabs: {
    lineChartData: any;
    isOpen: boolean;
    header: any;
    content: string;
    storage: any;
  }[] = [];
  initialGridOptions = {
    minCols: 2,
    maxCols: 12,
    minRows: 1,
    maxRows: 2,
    gridType: "verticalFixed" as GridType,
    fixedRowHeight: 100,
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
    this.setGridOptions();
    window.addEventListener("resize", () => this.drawHeaderSparkline());
    this.ServicestatusService.getBackup().subscribe(
      data => {
        this.products = data.data; // อัปเดตข้อมูลใน products
      },
      error => {}
    );
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize.bind(this));
    this.intervalId = setInterval(() => {
      const now = new Date();
      const currentMinute = now.getMinutes();
      const lastDigit = currentMinute % 10;

      if (
        (lastDigit === 0 || lastDigit === 5) &&
        this.lastProcessedMinute !== currentMinute
      ) {
        this.loadData();
        this.lastProcessedMinute = currentMinute;
      }
    }, 1000);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    this.titleService.setTitle("Service Status");
    this.themeService.currentpage("/servicestatus");
    this.gridOptions = this.initialGridOptions;

    this.dashboard = [
      { cols: 3, rows: 2, x: 0, y: 0, header: "loadcpu" },
      { cols: 3, rows: 2, x: 3, y: 0, header: "loadmemory" },
      { cols: 2, rows: 1, x: 6, y: 0, header: "loadCPUText" },
      { cols: 2, rows: 1, x: 6, y: 1, header: "loadMemoryText" },
      { cols: 4, rows: 2, x: 8, y: 0, header: "loaddiskstatus" }
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
    this.themeService.currentcolorMessage.subscribe(value => {});
  }

  // ngAfterViewInit() {
  //   this.drawDisk();
  // }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.setGridOptions();
    this.drawDisk();
  }

  setGridOptions() {
    const screenWidth = window.innerWidth;

    // if (screenWidth < 1440) {
    //   this.gridOptions = {
    //     minCols: 12,
    //     maxCols: 12,
    //     minRows: 2,
    //     maxRows: 2,
    //     gridType: "verticalFixed" as GridType,
    //     fixedRowHeight: 100,
    //     fixedColWidth: 200,
    //     margin: 16
    //   };
    // } else {
    //   this.gridOptions = {
    //     minCols: 2,
    //     maxCols: 12,
    //     minRows: 1,
    //     maxRows: 2,
    //     gridType: "verticalFixed" as GridType,
    //     fixedRowHeight: 100, // ความสูงของแต่ละ row คงที่ที่ 300
    //     fixedColWidth: 200,
    //     margin: 16,
    //     outerMargin: true // เพิ่ม margin รอบนอก (ถ้าต้องการ)
    //   };
    //   this.dashboard = [
    //     { cols: 3, rows: 2, x: 0, y: 0, header: "loadcpu" },
    //     { cols: 3, rows: 2, x: 3, y: 0, header: "loadmemory" },
    //     { cols: 2, rows: 1, x: 6, y: 0, header: "loadCPUText" },
    //     { cols: 2, rows: 1, x: 6, y: 1, header: "loadMemoryText" },
    //     { cols: 4, rows: 2, x: 8, y: 0, header: "loaddiskstatus" }
    //   ];
    // }

    // // รีเซ็ตค่า x และ y ให้เหมาะสม
    // this.dashboard.forEach(item => {
    //   item.x = item.x < this.gridOptions.maxCols ? item.x : 0;
    //   item.y = item.y < this.gridOptions.maxRows ? item.y : 0;
    // });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.removeEventListener("resize", this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  onOptionChange(event: any) {
    this.selectedOption = event.value; // อัปเดตค่าที่เลือก
    // คุณสามารถดำเนินการอื่น ๆ ตามค่าที่เลือกได้
  }

  toggleTab(instance: number) {
    const existingIndex = this.tabs.findIndex(
      tab => tab.header.instance === instance
    );
    this.tabs[existingIndex].isOpen = !this.tabs[existingIndex].isOpen;
    // this.cdr.detectChanges();
    if (this.tabs[existingIndex].isOpen) {
      // ใช้ Promise เพื่อให้มั่นใจว่าการวาด disk จะเกิดหลังจาก view render เสร็จ
      this.drawDisk();
    }
  }

  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {}
  changedOptions() {
    if (this.gridOptions.api && this.gridOptions.api.optionsChanged) {
      this.gridOptions.api.optionsChanged();
    }
  }
  drawDisk() {
    this.cdr.detectChanges();

    this.tabs.forEach((tab, index) => {
      const container = document.getElementById(
        "disk_status_chart_" + tab.header.instance
      );
      if (container) {
        setTimeout(() => {
          const diskOptions: Highcharts.Options = {
            chart: {
              type: "bar",
              backgroundColor: "transparent"
            },
            title: {
              text: null,
              style: {
                color: this.colortitle
              }
            },
            legend: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            exporting: {
              enabled: false
            },
            xAxis: [
              {
                categories: tab.storage.map(data =>
                  data.name.length > 5
                    ? `...${data.name.slice(-7)}` // เก็บเฉพาะ 10 ตัวอักษรท้าย และเพิ่ม ...
                    : data.name
                ),
                gridLineWidth: 0,
                labels: {
                  style: {
                    fontSize: "16px"
                  }
                }
              },
              {
                linkedTo: 0,
                opposite: true,
                categories: tab.storage.map(
                  data => `${parseFloat(data.total).toFixed(2)} GB`
                ),
                gridLineWidth: 0,
                labels: {
                  style: {
                    fontSize: "16px"
                  }
                }
              }
            ],
            yAxis: {
              max: 100,
              gridLineWidth: 0,
              labels: { enabled: false },
              title: { text: "" }
            },
            plotOptions: {
              bar: {
                stacking: "percent",
                animation: false,
                pointWidth: 8, // ลดความกว้างของแท่ง
                groupPadding: 0, // ลดระยะห่างระหว่างกลุ่มแท่ง
                pointPadding: 0.005 // ลดระยะห่างระหว่างแท่งในกลุ่มเดียวกัน
              }
            },
            tooltip: {
              useHTML: true,
              formatter: function() {
                const value = this.point.y.toFixed(2);
                return `
              <span style="font-size:10px">${this.series.name}</span>
              <table>
                <tr>
                  <td style="color:${this.color};padding:0">${this.series.name}: </td>
                  <td style="padding:0"><b>${value} GB</b></td>
                </tr>
              </table>`;
              }
            },
            series: [
              {
                type: "bar",
                name: "Free",
                data: tab.storage.map(storageItem => ({
                  y:
                    parseFloat(storageItem.total) -
                    parseFloat(storageItem.used),
                  color: "#D5D8DC"
                }))
              },
              {
                type: "bar",
                name: "Usage",
                data: tab.storage.map(storageItem => ({
                  y: parseFloat(storageItem.used),
                  color:
                    (parseFloat(storageItem.used) /
                      parseFloat(storageItem.total)) *
                      100 <
                    81
                      ? "#50D0BC"
                      : (parseFloat(storageItem.used) /
                          parseFloat(storageItem.total)) *
                          100 <
                        91
                      ? "#FFBB55"
                      : "#FF7782"
                }))
              }
            ]
          };
          Highcharts.chart(
            "disk_status_chart_" + tab.header.instance,
            diskOptions
          );
        }, 0);
      }
    });
  }

  drawHeaderSparkline() {
    this.cdr.detectChanges();

    const chartWidth = window.innerWidth < 426 ? 100 : 200; // ปรับขนาดตามจอ

    this.tabs.forEach((tab, index) => {
      const sortedCpuData = [...tab.header.cpuRange].sort(
        (a, b) => a[0] - b[0]
      );
      const sortedMemoryData = [...tab.header.memoryRange].sort(
        (a, b) => a[0] - b[0]
      );

      const offset = 7 * 3600000; // GMT+7

      const last24CpuData = sortedCpuData
        .slice(-24)
        .map((point: [number, number]) => {
          return [point[0] * 1000 + offset, Math.round(point[1] * 100) / 100];
        });

      const last24MemoryData = sortedMemoryData
        .slice(-24)
        .map((point: [number, number]) => {
          return [point[0] * 1000 + offset, Math.round(point[1] * 100) / 100];
        });

      const cpuSparklineOptions: any = {
        chart: {
          zoomType: null,
          backgroundColor: "transparent",
          panning: false,
          marginLeft: 0,
          width: chartWidth, // ใช้ค่า width ที่ปรับตามขนาดจอ
          height: 40,
          spacingBottom: 0 // 🟢 เพิ่ม margin-bottom 10px
        },
        title: {
          text: ``,
          style: { color: this.colortitle },
          floating: true,
          align: "center"
        },
        legend: { enabled: false },
        credits: { enabled: false },
        exporting: { enabled: false },
        xAxis: {
          type: "datetime",
          gridLineWidth: 0,
          labels: { enabled: false },
          title: { text: null },
          tickWidth: 0
        },
        yAxis: {
          gridLineWidth: 0,
          labels: { enabled: false },
          title: { text: null },
          tickWidth: 0
        },
        plotOptions: {
          series: { marker: { enabled: false }, animation: false }
        },
        series: [
          {
            type: "line",
            name: "CPU Util",
            data: last24CpuData,
            color: "#00FFFF",
            lineWidth: 2
          }
        ]
      };

      const memorySparklineOptions: any = {
        chart: {
          zoomType: null,
          backgroundColor: "transparent",
          panning: false,
          marginLeft: 0,
          width: chartWidth, // ใช้ค่า width ที่ปรับตามขนาดจอ
          height: 40,
          spacingBottom: 0
        },
        title: {
          text: ``,
          style: { color: this.colortitle },
          floating: true,
          align: "center"
        },
        legend: { enabled: false },
        credits: { enabled: false },
        exporting: { enabled: false },
        xAxis: {
          type: "datetime",
          gridLineWidth: 0,
          labels: { enabled: false },
          title: { text: null },
          tickWidth: 0
        },
        yAxis: {
          gridLineWidth: 0,
          labels: { enabled: false },
          title: { text: null },
          tickWidth: 0
        },
        plotOptions: {
          series: { marker: { enabled: false }, animation: false }
        },
        series: [
          {
            type: "line",
            name: "Memory Util",
            data: last24MemoryData,
            color: "#FFFF00",
            lineWidth: 2
          }
        ]
      };

      const containerCPUId = `containerCPU-${tab.header.instance}`;
      const containerMemoryId = `containerMemory-${tab.header.instance}`;

      if (document.getElementById(containerCPUId)) {
        Highcharts.chart(containerCPUId, cpuSparklineOptions);
      }
      if (document.getElementById(containerMemoryId)) {
        Highcharts.chart(containerMemoryId, memorySparklineOptions);
      }
    });
  }

  loadData() {
    // สร้างตัวแปรเพื่อจับเวลา
    const loadTimeout = setTimeout(() => {
      this.isLoading = true; // แสดง spinner หากโหลดนานกว่า 1 วินาที
    }, 1000);

    // ตั้งค่าเริ่มต้นของ isNodata
    this.isNodata = false;

    // ดึงข้อมูลจากทั้ง Linux และ Windows APIs
    Promise.allSettled([
      this.ServicestatusService.getDataLinux().toPromise(),
      this.ServicestatusService.getDataWindow().toPromise()
    ])
      .then(([linuxResult, windowResult]) => {
        clearTimeout(loadTimeout); // ยกเลิก timeout เมื่อข้อมูลโหลดเสร็จ

        const tabs: any[] = []; // เก็บข้อมูลสำหรับ tabs

        // ตรวจสอบข้อมูล Linux
        if (linuxResult.status === "fulfilled" && linuxResult.value?.success) {
          const linuxData = linuxResult.value.data;
          const linuxTabs = linuxData.map(item => ({
            header: {
              instance: item.instance,
              cpuAvg: Math.max(item.cpu.avg, 0).toFixed(2),
              memoryUsed: item.memory.used.toFixed(2),
              free: item.memory.free.toFixed(2),
              cpuRange: item.cpu.avg_range,
              memoryRange: item.memory.used_range,
              storage: {
                name: "ext4",
                percentUsed: Number(
                  (item.storage.ext4.used / item.storage.ext4.total) * 100
                ).toFixed(0)
              },
              core: item.cpu.core.length,
              ram: Math.round(item.memory.total)
            },
            lineChartData: item.cpu.avg_range,
            content: `
      OS: ${item.os}
      CPU Avg: ${item.cpu.avg.toFixed(2)}
      Memory Used: ${item.memory.used.toFixed(2)}%
      Storage EXT4 Used: ${item.storage.ext4.used.toFixed(2)} GB
    `,
            storage: Object.entries(item.storage).map(([key, value]: any) => ({
              name: key,
              total: value.total,
              used: value.used,
              avg: value.avg
            })),
            isOpen: false
          }));
          tabs.push(...linuxTabs); // เพิ่มข้อมูล Linux ใน tabs
        } else if (linuxResult.status === "rejected") {
        }

        // ตรวจสอบข้อมูล Windows
        if (
          windowResult.status === "fulfilled" &&
          windowResult.value?.success
        ) {
          const windowData = windowResult.value.data;
          const windowTabs = windowData.map(item => ({
            header: {
              instance: item.instance,
              cpuAvg: Math.max(item.cpu.avg, 0).toFixed(2),
              memoryUsed: item.memory.used.toFixed(2),
              free: item.memory.free.toFixed(2),
              cpuRange: item.cpu.avg_range,
              memoryRange: item.memory.used_range,
              storage: {
                name: "C",
                percentUsed: Number(
                  (item.storage["C:"].used / item.storage["C:"].total) * 100
                ).toFixed(0)
              },
              core: item.cpu.core.length,
              ram: Math.round(item.memory.total)
            },
            content: `
          OS: ${item.os}
          CPU Avg: ${item.cpu.avg.toFixed(2)}
          Memory Used: ${item.memory.used.toFixed(2)}%
          Storage C: Used: ${item.storage["C:"].used.toFixed(2)} GB
        `,
            storage: Object.entries(item.storage).map(([key, value]: any) => ({
              name: key,
              total: value.total,
              used: value.used,
              avg: value.avg
            })),
            isOpen: false
          }));
          tabs.push(...windowTabs); // เพิ่มข้อมูล Windows ใน tabs
        } else if (windowResult.status === "rejected") {
        }

        // ตรวจสอบว่ามีข้อมูลใดถูกเพิ่มเข้ามาหรือไม่
        if (tabs.length > 0) {
          this.addOrUpdateTabs(tabs);
        } else {
          this.isNodata = true; // กำหนดว่าไม่มีข้อมูล
        }

        this.isLoading = false; // ซ่อน spinner หลังจากโหลดข้อมูลเสร็จ
      })
      .catch(error => {
        // this.isNodata = true; // กำหนดว่าไม่มีข้อมูลเมื่อเกิดข้อผิดพลาด
        this.isLoading = false; // ซ่อน spinner เมื่อเกิดข้อผิดพลาด
      });
  }

  addOrUpdateTabs(tabs) {
    tabs.forEach(newTab => {
      const existingIndex = this.tabs.findIndex(
        tab => tab.header.instance === newTab.header.instance
      );
      if (existingIndex !== -1) {
        this.tabs[existingIndex].header = {
          ...this.tabs[existingIndex].header,
          cpuAvg: newTab.header.cpuAvg,
          memoryUsed: newTab.header.memoryUsed,
          free: newTab.header.free,
          cpuRange: newTab.header.cpuRange,
          memoryRange: newTab.header.memoryRange,
          storage: { ...newTab.header.storage },
          core: newTab.header.cpu.core[1]
        };
        this.tabs[existingIndex].storage = [...newTab.storage];
      } else {
        // Add the new tab
        this.tabs.push(newTab);
        // Sort tabs by instance (ascending order)
        this.tabs.sort((a, b) =>
          a.header.instance.localeCompare(b.header.instance)
        );
      }
    });

    this.drawHeaderSparkline();

    // ใช้ Promise เพื่อให้มั่นใจว่าการวาด disk จะเกิดหลังจาก view render เสร็จ
    // this.drawDisk();
  }

  valueChart: { [key: string]: any } = {};

  getTextColor(util: number): string {
    if (util < 81) {
      return "#50D0BC"; // Set your first color for values less than 33.33
    } else if (util < 91) {
      return "#FFBB55"; // Set your second color for values between 33.33 and 66.66
    } else {
      return "#FF7782"; // Set your third color for values greater than or equal to 66.66
    }
  }
}
