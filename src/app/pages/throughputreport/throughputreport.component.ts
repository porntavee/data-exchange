import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ThroughputreportService } from "@app/pages/throughputreport/throughputreport.service";
import { MessageService, ConfirmationService } from "primeng/api";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
import { error } from "console";
import * as e from "cors";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { ThemeService } from "app/theme.service";
import { MenuItem } from "primeng/api";
import * as xlsx from "xlsx";

HC_exporting(Highcharts);

interface Mode {
  name: string;
}
export interface throughputreport {
  ipaddress?: string;
  remote_ipaddress?: string;
  service_name?: string;
  vlan?: number;
  inserttime?: string;
  process_timestamp?: string;
  ref_code?: string;
}
@Component({
  selector: "app-throughputreport",
  templateUrl: "throughputreport.component.html",
  styleUrls: ["throughputreport.component.css"]
})
export class ThroughputreportComponent implements OnInit {
  Mode: Mode[] = [];
  mode: string = "configuration";
  selectedMode: Mode;
  selectedthroughputResult: throughputreport[];
  resultthroughput: throughputreport[] = [];
  selectedResultThroughput: { file_name: string };
  action_Dialog1: boolean = false;
  resultThroughputs: String;
  Highcharts: typeof Highcharts = Highcharts;
  headdialog: string;
  chartOptions: Highcharts.Options = {};
  Highcharts2: typeof Highcharts = Highcharts;
  chartOptions2: Highcharts.Options = {};
  Highcharts3: typeof Highcharts = Highcharts;
  chartOptions3: Highcharts.Options = {};
  strSteps: string[] = [];
  strStep: string;
  reportLogDialog: boolean = false;
  dialogHeader: string;
  throughputLog: string;
  pdfUrl: string;
  itemsAction: MenuItem[];
  menuLog: boolean = false;
  menuDonwload: boolean = false;
  menuDelete: boolean = false;
  scrollPosition: number;
  constructor(
    private titleService: Title,
    private ThroughputreportService: ThroughputreportService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    public themeService: ThemeService,
    private changeDetection: ChangeDetectorRef
  ) {
    this.titleService.setTitle("SED-Throughput Report");
  }

  ngOnInit(): void {
    this.Mode = [{ name: "performance" }];
    this.selectedMode = this.Mode[0];
    this.mode = this.selectedMode.name;
    this.getThroughputReportList(this.mode);
    this.fetchData();
  }

  fetchData() {
    this.ThroughputreportService.currentMessage.subscribe(resultthroughput => {
      if (resultthroughput != undefined) {
        if (
          resultthroughput.log == null ||
          resultthroughput.log == "" ||
          resultthroughput.log == undefined
        ) {
          this.menuLog = true;
        } else {
          this.menuLog = false;
        }
        this.itemsAction = [
          {
            label: "resultthroughput",
            items: [
              {
                label: "View",
                icon: "pi pi-search",
                disabled: this.menuLog,
                command: event => {
                  this.getReportLog(resultthroughput.log);
                }
              },
              {
                label: "Download",
                icon: "pi pi-file-pdf",
                disabled: this.menuDonwload,
                command: event => {
                  this.selectedResultThroughput = resultthroughput;
                  this.downloadReport(
                    resultthroughput.ref_code,
                    resultthroughput.file_name
                  );
                }
              },
              {
                label: "Delete",
                icon: "pi pi-trash",
                command: event => {
                  this.deleteRecord(resultthroughput.ref_code);
                }
              }
            ]
          }
        ];
      }
    });
  }

  deleteRecord(ref_code: throughputreport) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this item" + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.ThroughputreportService.deleteRecord(ref_code).subscribe({
          next: result => {
            this.changeDetection.reattach();
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "File Deleted",
              life: 3000
            });
            this.getThroughputReportList(this.mode);
            this.changeDetection.detectChanges();
          },
          error: error => {
            if (error) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error! cannot delete file."
              });
            }
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
    });
  }

  refresh(): void {
    window.location.reload();
  }

  menuVlue(task) {
    this.ThroughputreportService.valueSource(task);
  }
  onChangeMode(event) {
    this.mode = event.value.name;
    this.getThroughputReportList(this.mode);
  }
  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `throughput-report${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.resultthroughput
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

  getThroughputReportList(mode: string) {
    this.ThroughputreportService.throughputResultList(mode).subscribe(
      results => {
        this.resultthroughput = results;
      }
    );
  }

  getReportLog(event) {
    this.reportLogDialog = true;
    this.dialogHeader = "Test Log";
    this.throughputLog = event;
  }

  downloadReport(refCode: string, file_name: string) {
    this.http
      .get(`${environment.apiUrl}/script/rfcReport?ref_code=${refCode}`, {
        responseType: "blob"
      })
      .subscribe(
        (blob: Blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = file_name; // Set the desired filename here
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(blobUrl);
        },
        error => {}
      );
  }
}
