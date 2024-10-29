import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TaskReportService } from "@app/pages/report/report.service";
import { MessageService, ConfirmationService } from "primeng/api";
import { ThemeService } from "app/theme.service";
import * as xlsx from "xlsx";
import { MenuItem } from "primeng/api";
export interface TaskResult {
  schedule_name?: string;
  id?: number;
  schedule_id?: number;
  run_time?: string;
  status?: string;
  session_id?: string;
  command_name?: string;
  target?: string;
}

@Component({
  selector: "report-cmp",
  moduleId: module.id,
  templateUrl: "report.component.html",
  styleUrls: ["report.component.scss"]
})
export class ReportComponent implements OnInit {
  taskResult: TaskResult = {};
  taskResults: TaskResult[] = [];
  selectedTaskResult: TaskResult = {};
  selectedtaskResult: TaskResult[];
  TaskResult: TaskResult[];
  taskResultreadDialog: boolean;
  dialogHeader: string;
  result_preview: string;
  itemsAction: MenuItem[];
  constructor(
    private taskReportService: TaskReportService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public themeService: ThemeService,
    private titleService: Title
  ) {
    this.titleService.setTitle("SED-Task Report");
  }

  ngOnInit(): void {
    this.themeService.currentpage("/report");
    this.taskReportService.getReport().subscribe({
      next: data => {
        this.taskResults = data;
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
    this.taskReportService.currentMessage.subscribe(taskResult => {
      if (taskResult != undefined) {
        this.itemsAction = [
          {
            label: "TaskResult",
            items: [
              {
                label: "View",
                icon: "pi pi-fw pi-info",
                command: event => {
                  this.taskResultread(taskResult);
                }
              },
              {
                label: "Download",
                icon: "pi pi-fw pi-download",
                command: event => {
                  this.downloadResult(
                    taskResult.session_id,
                    taskResult.schedule_name
                  );
                }
              }
            ]
          }
        ];
      }
    });
  }

  menuVlue(task) {
    this.taskReportService.valueSource(task);
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

  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `task-result${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.taskResults
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

  actionItem(taskResult: TaskResult) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "View",
            icon: "pi pi-fw pi-info",
            command: event => {
              this.taskResultread(taskResult);
            }
          },
          {
            label: "Download",
            icon: "pi pi-fw pi-download",
            command: event => {
              this.downloadResult(
                taskResult.session_id,
                taskResult.schedule_name
              );
            }
          }
        ]
      }
    ];
  }

  downloadResult(session_id, schedule_name) {
    //console.log(session_id, schedule_name);
    this.taskReportService
      .downloadReport(session_id, schedule_name)
      .subscribe(blob => {
        //console.log(blob);
        const a = document.createElement("a");
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = "Report_" + schedule_name + ".txt";
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }
  refresh(): void {
    window.location.reload();
  }
  taskResultread(taskResult: TaskResult) {
    this.result_preview = "";
    this.taskResult = taskResult;
    this.taskResultreadDialog = true;
    this.dialogHeader = "Schedule Task Results";
    this.taskReportService.getPreviewResult(taskResult.session_id).subscribe({
      next: result => {
        // console.log(result);
        this.result_preview = result.detail;
      },
      error: error => {
        if (error) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Results Error."
          });
        }
      }
    });
  }
  deleteSelectedtaskResult() {
    const data = this.selectedtaskResult;
    const result = data.reduce(function(r, e) {
      return (
        Object.keys(e).forEach(function(k) {
          if (!r[k]) r[k] = [].concat(e[k]);
          else r[k] = r[k].concat(e[k]);
        }),
        r
      );
    }, {});
    // console.log(result)
    var obj = result;
    var list = Object.values(obj.id);
    console.log(list);
    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete the selected" +
        " " +
        this.selectedtaskResult.length +
        " " +
        " taskResults?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.taskResults = this.taskResults.filter(
          val => !this.selectedtaskResult.includes(val)
        );
        this.selectedtaskResult = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "taskResults Deleted",
          life: 3000
        });
        this.taskReportService.deletetaskResult(list);
        this.taskReportService
          .getReport()
          .subscribe(data => (this.taskResults = data));
        this.refresh();
      }
    });
  }
}
