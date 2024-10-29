import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild
} from "@angular/core";
import { NavService } from "@app/nav.serive";
import * as Highcharts from "highcharts";
import { Options } from "highcharts";
import * as d3 from "d3";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"]
})
export class StatsComponent implements OnInit {
  navId: any;
  isShowGraph: false;
  rectTop: number = 50; // เริ่มต้นตำแหน่งบน (Y) ของสี่เหลี่ยม
  rectLeft: number = 50; // เริ่มต้นตำแหน่งซ้าย (X) ของสี่เหลี่ยม
  baseColor: string = "rgba(255, 0, 0"; // สีเริ่มต้น
  baseColor2: string = "rgb(0, 255, 55";
  baseColor3: string = "rgb(238, 6, 161";
  transparency1: number = 0.1; // สี่เหลี่ยมที่ 1
  transparency2: number = 0.1; // สี่เหลี่ยมที่ 2
  transparency3: number = 0.1; // สี่เหลี่ยมที่ 3
  transparency: number = 0.1; // ค่าโปร่งใสเริ่มต้น 10%
  isVisible1: boolean = false; // สถานะสำหรับสี่เหลี่ยมที่ 1
  isVisible2: boolean = false; // สถานะสำหรับสี่เหลี่ยมที่ 2
  isVisible3: boolean = false; // สถานะสำหรับสี่เหลี่ยมที่ 3
  activeRectangle: number | null = null; // ใช้เพื่อเก็บสถานะสี่เหลี่ยมที่ทำงานอยู่
  Highcharts2: typeof Highcharts = Highcharts; // This will make Highcharts available in the template
  chartOptions2: Highcharts.Options;

  Highcharts2_1: typeof Highcharts = Highcharts;
  chartOptions2_1: Highcharts.Options;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  Highcharts5_1: typeof Highcharts = Highcharts;
  chartOptions5_1: Highcharts.Options;

  Highcharts5_2: typeof Highcharts = Highcharts;
  chartOptions5_2: Highcharts.Options;

  Highcharts5_3: typeof Highcharts = Highcharts;
  chartOptions5_3: Highcharts.Options;

  @ViewChild("graphContainer", { static: true }) graphContainer!: ElementRef;

  width = 1200;
  height = 400;

  nodes = [
    { id: 1, name: "รับแจ้ง", x: 100, y: 100, icon: "📞", gradient: "grad1" },
    { id: 2, name: "ตรวจสอบ", x: 250, y: 100, icon: "📝", gradient: "grad2" },
    { id: 3, name: "ประสานงาน", x: 400, y: 100, icon: "👥", gradient: "grad3" },
    {
      id: 4,
      name: "เข้าถึงจุด",
      x: 550,
      y: 100,
      icon: "🚶‍♂️",
      gradient: "grad4"
    },
    {
      id: 5,
      name: "อำนวยการจราจร",
      x: 700,
      y: 100,
      icon: "🚧",
      gradient: "grad5"
    },
    {
      id: 6,
      name: "นำรถเข้าไหล่ทาง",
      x: 850,
      y: 100,
      icon: "🚗",
      gradient: "grad6"
    },
    {
      id: 7,
      name: "นำรถออกจากสายทาง",
      x: 1000,
      y: 100,
      icon: "🚚",
      gradient: "grad7"
    },
    {
      id: 8,
      name: "การจราจรปกติ",
      x: 1150,
      y: 100,
      icon: "🚙",
      gradient: "grad8"
    },
    {
      id: 9,
      name: "เริ่มบันทึกอุบัติการณ์ในระบบ DSS",
      x: 400,
      y: 250,
      icon: "🗂️",
      gradient: "grad9"
    },
    {
      id: 10,
      name: "ขึ้นป้าย VMS/MS",
      x: 700,
      y: 250,
      icon: "🖥️",
      gradient: "grad10"
    }
  ];

  links = [
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 6, target: 7 },
    { source: 7, target: 8 },
    { source: 2, target: 9 },
    { source: 9, target: 10 },
    { source: 10, target: 8 }
  ];

  constructor(
    private navService: NavService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.navService.navId$.subscribe(navId => {
      this.navId = navId ?? "/stats1";
      // this.navId = '2';
      // ทำสิ่งที่ต้องการกับ navId ที่ได้รับ
      // console.log('Received navId:', this.navId);
      if (this.navId == "/stats1") {
        // this.createGraph();
      }
      if (this.navId == "/stats2") {
        this.chartOptions2_1 = {
          chart: {
            type: "bar",
            backgroundColor: "#1a2d45", // Set the background color to dark blue
            height: 400 // Set the height of the chart to 400px (you can adjust this value)
          },
          title: {
            text: ""
          },
          xAxis: [
            {
              categories: ["0-14", "15-24", "25-54", "55-64", "65+"],
              reversed: false,
              labels: {
                step: 1
              },
              linkedTo: 1
            },
            {
              opposite: true,
              reversed: false,
              categories: ["0-14", "15-24", "25-54", "55-64", "65+"],
              linkedTo: 0,
              labels: {
                step: 1
              }
            }
          ],
          yAxis: {
            title: {
              text: null
            },
            labels: {
              format: "{abs value}%"
            },
            accessibility: {
              description: "Percentage population",
              rangeDescription: "Range: 0 to 5%"
            }
          },
          series: [
            {
              type: "bar",
              name: "iOS",
              data: [-2.9, -7.5, -15.4, -12.2, -4.3],
              color: "#3498DB" // Blue color for the first series
            },
            {
              type: "bar",
              name: "Android",
              data: [2.3, 6.0, 14.6, 11.1, 3.9], // Positive for right side
              color: "#FF5733" // Red color for the second series
            }
          ],
          plotOptions: {
            series: {
              stacking: "normal"
            }
          },
          legend: {
            itemStyle: {
              color: "#FFFFFF" // Set legend item color to white
            }
          }
        };
      } else if (this.navId == "/stats3") {
        this.chartOptions = {
          chart: {
            type: "column",
            backgroundColor: "#1a2d45", // Set the background color to dark blue
            height: 400 // Set the height of the chart to 400px (you can adjust this value)
          },
          title: {
            text: ""
          },
          xAxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ],
            title: {
              text: ""
            },
            labels: {
              style: {
                color: "#FFFFFF" // Set the color of xAxis labels to white
              }
            }
          },
          yAxis: {
            title: {
              text: "ล้างทั้งหมด",
              style: {
                color: "#FFFFFF" // Set the color of yAxis title to white
              }
            },
            labels: {
              style: {
                color: "#FFFFFF" // Set the color of yAxis labels to white
              }
            },
            max: 100, // Set the maximum value for the yAxis
            tickInterval: 20, // Set tick interval to 20
            min: 0 // Ensure the minimum value is 0
          },
          series: [
            {
              type: "column",
              name: "เฉลี่ย 3 ปีล่าสุด",
              data: [85, 80, 78, 82, 85, 80, 78, 76, 82, 84, 81, 79], // Sample data for the first series
              color: "#3498DB" // Blue color for the first series
            },
            {
              type: "column",
              name: "ปี 2567",
              data: [82, 85, 80, 85, 88, 82, 83, 81, 84, 90, 87, 85], // Sample data for the second series
              color: "#FF5733" // Red color for the second series
            }
          ],
          plotOptions: {
            column: {
              pointPadding: 0,
              groupPadding: 0.1,
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                style: {
                  color: "#FFFFFF" // Set data label color to white
                }
              }
            }
          },
          legend: {
            itemStyle: {
              color: "#FFFFFF" // Set legend item color to white
            }
          }
        };
      } else if (this.navId == "/stats5") {
        this.chartOptions5_1 = {
          chart: {
            type: "line",
            backgroundColor: "#1a2d45", // Set the background color to dark blue
            height: 400 // Set the height of the chart to 400px (you can adjust this value)
          },
          title: {
            text: ""
          },
          xAxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ],
            title: {
              text: ""
            },
            labels: {
              style: {
                color: "#FFFFFF" // Set the color of xAxis labels to white
              }
            }
          },
          yAxis: {
            title: {
              text: "จำนวน Session",
              style: {
                color: "#FFFFFF" // Set the color of yAxis title to white
              }
            },
            labels: {
              style: {
                color: "#FFFFFF" // Set the color of yAxis labels to white
              }
            },
            max: 100, // Set the maximum value for the yAxis
            tickInterval: 20, // Set tick interval to 20
            min: 0 // Ensure the minimum value is 0
          },
          series: [
            {
              type: "line",
              name: "iOS",
              data: [40, 48, 78, 82, 85, 80, 78, 40, 82, 84, 81, 79], // Sample data for the first series
              color: "#3498DB" // Blue color for the first series
            },
            {
              type: "line",
              name: "Android",
              data: [44, 39, 80, 85, 88, 82, 83, 30, 84, 90, 87, 85], // Sample data for the second series
              color: "#FF5733" // Red color for the second series
            }
          ],
          plotOptions: {
            column: {
              pointPadding: 0,
              groupPadding: 0.1,
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                style: {
                  color: "#FFFFFF" // Set data label color to white
                }
              }
            }
          },
          legend: {
            itemStyle: {
              color: "#FFFFFF" // Set legend item color to white
            }
          }
        };
        this.chartOptions5_2 = {
          chart: {
            type: "line",
            backgroundColor: "#1a2d45", // Set the background color to dark blue
            height: 400 // Set the height of the chart to 400px (you can adjust this value)
          },
          title: {
            text: ""
          },
          xAxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ],
            title: {
              text: ""
            },
            labels: {
              style: {
                color: "#FFFFFF" // Set the color of xAxis labels to white
              }
            }
          },
          yAxis: {
            title: {
              text: "จำนวนผู้ใช้งาน",
              style: {
                color: "#FFFFFF" // Set the color of yAxis title to white
              }
            },
            labels: {
              style: {
                color: "#FFFFFF" // Set the color of yAxis labels to white
              }
            },
            max: 100, // Set the maximum value for the yAxis
            tickInterval: 20, // Set tick interval to 20
            min: 0 // Ensure the minimum value is 0
          },
          series: [
            {
              type: "line",
              name: "iOS",
              data: [85, 80, 78, 82, 85, 80, 78, 30, 82, 84, 81, 79], // Sample data for the first series
              color: "#3498DB" // Blue color for the first series
            },
            {
              type: "line",
              name: "Android",
              data: [82, 85, 80, 85, 88, 82, 83, 40, 84, 90, 87, 85], // Sample data for the second series
              color: "#FF5733" // Red color for the second series
            }
          ],
          plotOptions: {
            column: {
              pointPadding: 0,
              groupPadding: 0.1,
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                style: {
                  color: "#FFFFFF" // Set data label color to white
                }
              }
            }
          },
          legend: {
            itemStyle: {
              color: "#FFFFFF" // Set legend item color to white
            }
          }
        };
        this.chartOptions5_3 = {
          chart: {
            type: "line",
            backgroundColor: "#1a2d45", // Set the background color to dark blue
            height: 400 // Set the height of the chart to 400px (you can adjust this value)
          },
          title: {
            text: ""
          },
          xAxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ],
            title: {
              text: ""
            },
            labels: {
              style: {
                color: "#FFFFFF" // Set the color of xAxis labels to white
              }
            }
          },
          yAxis: {
            title: {
              text: "จำนวนดาวน์โหลด",
              style: {
                color: "#FFFFFF" // Set the color of yAxis title to white
              }
            },
            labels: {
              style: {
                color: "#FFFFFF" // Set the color of yAxis labels to white
              }
            },
            max: 100, // Set the maximum value for the yAxis
            tickInterval: 20, // Set tick interval to 20
            min: 0 // Ensure the minimum value is 0
          },
          series: [
            {
              type: "line",
              name: "iOS",
              data: [85, 80, 78, 82, 85, 80, 78, 20, 82, 84, 81, 79], // Sample data for the first series
              color: "#3498DB" // Blue color for the first series
            },
            {
              type: "line",
              name: "Android",
              data: [82, 85, 80, 85, 88, 82, 83, 40, 84, 90, 87, 85], // Sample data for the second series
              color: "#FF5733" // Red color for the second series
            }
          ],
          plotOptions: {
            column: {
              pointPadding: 0,
              groupPadding: 0.1,
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                style: {
                  color: "#FFFFFF" // Set data label color to white
                }
              }
            }
          },
          legend: {
            itemStyle: {
              color: "#FFFFFF" // Set legend item color to white
            }
          }
        };
      }
    });

    // this.loadData();
  }

  ngAfterViewInit(): void {
    this.createGraph();
  }

  createGraph(): void {
    const svg = d3
      .select(this.graphContainer?.nativeElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    // วาดลิงก์ระหว่างโหนด
    svg
      .selectAll("path")
      .data(this.links)
      .enter()
      .append("path")
      .attr("d", d => {
        const source = this.nodes[d.source - 1];
        const target = this.nodes[d.target - 1];
        if (d.source === 2 && d.target === 9) {
          return `M${source.x},${source.y} L${source.x},${source.y + 150} L${
            target.x
          },${source.y + 150} L${target.x},${target.y}`;
        } else if (d.source === 10 && d.target === 8) {
          return `M${source.x},${source.y} L${source.x},${source.y} L${target.x},${source.y} L${target.x},${target.y}`;
        } else {
          return `M${source.x},${source.y} L${target.x},${target.y}`;
        }
      })
      .attr("stroke", "#999")
      .attr("stroke-width", 3)
      .attr("fill", "none");

    // วาดโหนด
    svg
      .selectAll("circle")
      .data(this.nodes)
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 20)
      .attr("fill", d => `url(#${d.gradient})`);

    // วาดไอคอนในโหนด
    svg
      .selectAll("text.icon")
      .data(this.nodes)
      .enter()
      .append("text")
      .attr("class", "icon")
      .attr("x", d => d.x)
      .attr("y", d => d.y + 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .text(d => d.icon);

    // วาดข้อความชื่อของโหนด
    svg
      .selectAll("text.label")
      .data(this.nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => d.x)
      .attr(
        "y",
        d => d.y - (d.name === "เริ่มบันทึกอุบัติการณ์ในระบบ DSS" ? 40 : 25)
      )
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .each(function(d) {
        const textElement = d3.select(this);
        if (d.name === "เริ่มบันทึกอุบัติการณ์ในระบบ DSS") {
          ["เริ่มบันทึกอุบัติการณ์", "ในระบบ DSS"].forEach((line, index) => {
            textElement
              .append("tspan")
              .attr("x", d.x)
              .attr("dy", index === 0 ? 0 : "1.2em")
              .attr("text-anchor", "middle")
              .text(line);
          });
        } else {
          const words = d.name.split(" ");
          words.forEach((word, index) => {
            textElement
              .append("tspan")
              .attr("x", d.x)
              .attr("dy", index === 0 ? 0 : "1.2em")
              .attr("text-anchor", "middle")
              .text(word);
          });
        }
      });

    // กำหนด gradient สำหรับแต่ละโหนด
    const defs = svg.append("defs");
    this.nodes.forEach((node, index) => {
      const gradient = defs
        .append("linearGradient")
        .attr("id", node.gradient)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", `hsl(${index * 36}, 100%, 70%)`);
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", `hsl(${index * 36 + 20}, 100%, 50%)`);
    });

    // วาดกรอบครอบกลุ่มโหนด
    const padding = 10;

    this.drawRect(svg, this.nodes[2], this.nodes[3], "blue", padding);
    this.drawRect(svg, this.nodes[8], this.nodes[9], "green", padding + 50, 20);
    this.drawRect(svg, this.nodes[2], this.nodes[6], "red", 20);
  }

  drawRect(
    svg: any,
    node1: any,
    node2: any,
    color: string,
    padding = 10,
    extraTopPadding = 0
  ): void {
    const rectX = Math.min(node1.x - 30, node2.x - 30) - padding;
    const rectY =
      Math.min(node1.y - 30, node2.y - 30) - padding - extraTopPadding;
    const rectWidth =
      Math.max(node1.x + 30, node2.x + 30) - rectX + padding * 2;
    const rectHeight = 100;

    svg
      .append("rect")
      .attr("x", rectX)
      .attr("y", rectY)
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2);
  }

  toggleColor1() {
    if (this.activeRectangle === 1) {
      this.isVisible1 = !this.isVisible1; // สลับสถานะ
      this.activeRectangle = this.isVisible1 ? 1 : null; // อัปเดตสถานะ
    } else {
      this.isVisible1 = true; // ตั้งค่าสถานะให้เป็นจริง
      this.isVisible2 = false; // ตั้งค่าสถานะให้เป็นเท็จ
      this.activeRectangle = 1; // กำหนดว่าสี่เหลี่ยมที่ 1 ทำงานอยู่
    }
  }

  // ฟังก์ชันสำหรับสลับสถานะของสี่เหลี่ยมที่ 2
  toggleColor2() {
    if (this.activeRectangle === 2) {
      this.isVisible2 = !this.isVisible2; // สลับสถานะ
      this.activeRectangle = this.isVisible2 ? 2 : null; // อัปเดตสถานะ
    } else {
      this.isVisible2 = true; // ตั้งค่าสถานะให้เป็นจริง
      this.isVisible1 = false; // ตั้งค่าสถานะให้เป็นเท็จ
      this.activeRectangle = 2; // กำหนดว่าสี่เหลี่ยมที่ 2 ทำงานอยู่
    }
  }

  // ฟังก์ชันสำหรับสลับสถานะของสี่เหลี่ยมที่ 3
  toggleColor3() {
    this.isVisible3 = !this.isVisible3; // สลับสถานะ
  }

  // ฟังก์ชันสำหรับคำนวณสีพื้นหลังของแต่ละสี่เหลี่ยม
  get currentColor1() {
    return `${this.baseColor}, ${this.isVisible1 ? 0.2 : 0})`; // เปลี่ยนจากโปร่งใสเป็นทึบ
  }

  get currentColor2() {
    return `${this.baseColor2}, ${this.isVisible2 ? 0.2 : 0})`; // เปลี่ยนจากโปร่งใสเป็นทึบ
  }

  get currentColor3() {
    return `${this.baseColor3}, ${this.isVisible3 ? 0.2 : 0})`; // เปลี่ยนจากโปร่งใสเป็นทึบ
  }

  chartCallback: Highcharts.ChartCallbackFunction = chart => {
    // ตรวจสอบว่า chart ถูกสร้างแล้ว
    // console.log('Chart loaded:', chart);
    if (chart) {
      chart.reflow(); // เรียก reflow หลังจากกราฟถูกสร้างเสร็จ
    }
  };
  loadData() {
    // Simulate data retrieval
    setTimeout(() => {
      this.zone.run(() => {
        // ใช้งานภายใน Angular zone
        this.chartOptions2 = {
          chart: {
            type: "bar"
          },
          title: {
            text: "Population Distribution of Andorra by Age and Gender"
          },
          xAxis: [
            {
              categories: ["0-14", "15-24", "25-54", "55-64", "65+"],
              reversed: false,
              labels: {
                step: 1
              },
              linkedTo: 1
            },
            {
              opposite: true,
              reversed: false,
              categories: ["0-14", "15-24", "25-54", "55-64", "65+"],
              linkedTo: 0,
              labels: {
                step: 1
              }
            }
          ],
          yAxis: {
            title: {
              text: null
            },
            labels: {
              formatter: function() {
                // return Math.abs(this.value) + '%';
                return "%";
              }
            }
          },
          plotOptions: {
            series: {
              stacking: "normal"
            }
          },
          // tooltip: {
          //   formatter: function () {
          //     return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
          //       'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
          //   }
          // },
          series: [
            {
              type: "bar",
              name: "Male",
              data: [-2.9, -7.5, -15.4, -12.2, -4.3] // Negative for left side
            },
            {
              type: "bar",
              name: "Female",
              data: [2.3, 6.0, 14.6, 11.1, 3.9] // Positive for right side
            }
          ]
        };
      });
    }, 100);
  }
}
