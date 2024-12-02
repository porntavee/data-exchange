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
  optionsstatusCPU: any;
  optionsstatusMemory: any;
  intervalId: NodeJS.Timeout;
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

  start: any = "";
  end: any = "";
  step: any = "5m";
  isSave: boolean = false;

  menuExportcpu_time: MenuItem[];
  CPUChart: any;

  isLoading: boolean = false;

  invalidstartH: any;
  valueDisk: any;

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
    minCols: 3,
    maxCols: 12,
    minRows: 2,
    maxRows: 500,
    gridType: "verticalFixed" as GridType,
    fixedRowHeight: 240,
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
    this.intervalId = setInterval(() => {
      this.loadData();
    }, 1000);
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
      { cols: 6, rows: 1, x: 0, y: 0, header: "loadcpu" },
      // { cols: 3, rows: 1, x: 3, y: 0, header: "loaddisk" },
      { cols: 6, rows: 1, x: 6, y: 0, header: "loadmemory" },
      {
        cols: 12,
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
    this.themeService.currentcolorMessage.subscribe(value => {});
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleTab(instance: number) {
    const existingIndex = this.tabs.findIndex(
      tab => tab.header.instance === instance
    );
    this.tabs[existingIndex].isOpen = !this.tabs[existingIndex].isOpen;
    this.cdr.detectChanges();
    if (this.tabs[existingIndex].isOpen) {
      this.dashboard.forEach(data => {
        if (data.header == "loadcpu") {
          this.loadData();
        } else if (data.header == "loaddisk") {
          this.loadData();
        } else if (data.header == "loadmemory") {
          this.loadData();
        } else if (data.header == "loaddiskstatus") {
          this.loadData();
        } else {
          this.isLoading = false;
        }
      });
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
              categories: tab.storage.map(data => data.name),
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
              pointWidth: 40,
              groupPadding: 0.05,
              pointPadding: 0.02
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
                y: parseFloat(storageItem.total) - parseFloat(storageItem.used),
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
      }
    });
  }

  drawHeaderSparkline() {
    this.cdr.detectChanges();
    this.tabs.forEach((tab, index) => {
      const cpuSparklineOptions: any = {
        chart: {
          zoomType: null,
          backgroundColor: "transparent",
          panning: false,
          marginLeft: 0,
          width: 200,
          height: 40
        },
        title: {
          text: ``,
          style: {
            color: this.colortitle
          },
          floating: true,
          align: "center"
        },
        legend: { enabled: false },
        credits: { enabled: false },
        exporting: { enabled: false },
        xAxis: {
          type: "category",
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
          series: {
            marker: { enabled: false }
          }
        },
        series: [
          {
            type: "line",
            name: "CPU Utilization",
            data: tab.header.cpuRange,
            color: "#4FC3F7", // สีฟ้าสำหรับ CPU
            lineWidth: 1.5,
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

      const memorySparklineOptions: any = {
        chart: {
          zoomType: null,
          backgroundColor: "transparent",
          panning: false,
          marginLeft: 0,
          width: 200,
          height: 40
        },
        title: {
          text: ``,
          style: {
            color: this.colortitle
          },
          floating: true,
          align: "center"
        },
        legend: { enabled: false },
        credits: { enabled: false },
        exporting: { enabled: false },
        xAxis: {
          type: "category",
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
          series: {
            marker: { enabled: false }
          }
        },
        series: [
          {
            type: "line",
            name: "Memory Utilization",
            data: tab.header.memoryRange,
            color: "#AB47BC", // สีม่วงสำหรับ Memory
            lineWidth: 1.5,
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

      // สำหรับ containerCPU
      const containerCPUId = `containerCPU-${tab.header.instance}`;
      const containerCPU = document.getElementById(containerCPUId);
      if (containerCPU) {
        if (!containerCPU.getAttribute("data-chart-initialized")) {
          Highcharts.chart(containerCPUId, cpuSparklineOptions);
          containerCPU.setAttribute("data-chart-initialized", "true");
        }
      } else {
      }

      // สำหรับ containerMemory
      const containerMemoryId = `containerMemory-${tab.header.instance}`;
      const containerMemory = document.getElementById(containerMemoryId);
      if (containerMemory) {
        if (!containerMemory.getAttribute("data-chart-initialized")) {
          Highcharts.chart(containerMemoryId, memorySparklineOptions);
          containerMemory.setAttribute("data-chart-initialized", "true");
        }
      } else {
      }
    });
  }

  loadData() {
    this.isLoading = false;
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
          const linuxTabs = linuxData.data.map(item => ({
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
              }
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
          this.addOrUpdateTabs(linuxTabs);
          const windowTabs = windowData.data.map(item => ({
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
              }
            },
            content: `
                OS: ${item.os}
                CPU Avg: ${item.cpu.avg.toFixed(2)}
                Memory Used: ${item.memory.used.toFixed(2)}%
                Storage C: Used: ${item.storage["C:"].used.toFixed(2)} GB
                Storage D: Used: ${item.storage["D:"].used.toFixed(2)} GB
                Storage E: Used: ${item.storage["E:"].used.toFixed(2)} GB
              `,
            storage: Object.entries(item.storage).map(([key, value]: any) => ({
              name: key,
              total: value.total,
              used: value.used,
              avg: value.avg
            })),
            isOpen: false
          }));
          this.addOrUpdateTabs(windowTabs);
          // this.tabs.push(...windowTabs);

          // Combine storage data from Linux and Windows
          const linuxStorageData = linuxData.data.map(
            instance => instance.storage.ext4
          );
          const windowStorageData = windowData.data.flatMap(instance =>
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
          // Combine CPU data from Linux and Windows
          const allCPUData = [...linuxData.data, ...windowData.data];
          // Calculate average CPU usage
          const cpuAverages = allCPUData.map(item => item.cpu.avg);
          const ramAverages = allCPUData.map(item => item.memory.free);
          const overallCPUAvg =
            cpuAverages.reduce((sum, value) => sum + value, 0) /
            cpuAverages.length;

          const linuxFilter = allCPUData.filter(item => item.os === "linux");
          const windowsFilter = allCPUData.filter(
            item => item.os === "windows"
          );
          this.isLoading = false;
        } else {
          console.error("Invalid response format:", linuxData, windowData);
          this.isLoading = false;
        }
      })
      .catch(error => {
        console.error("Error fetching CPU data:", error);
        this.isLoading = false;
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
          storage: { ...newTab.header.storage }
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
    this.drawDisk();
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
