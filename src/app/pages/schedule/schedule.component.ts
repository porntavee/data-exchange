import { BrowserModule, Title } from "@angular/platform-browser";
import { Observable, Subscription } from "rxjs";
import { getEffectiveConstraintOfTypeParameter } from "typescript";
import { Schedule } from "@app/schedule_task";
import { takeLast } from "rxjs-compat/operator/takeLast";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";
import { ScheduleTaskService } from "@app/pages/schedule/schedule.service";
import { Calendar } from "primeng/calendar";
import { Component } from "@angular/core";
import { Time } from "@angular/common";
import { OnInit, ChangeDetectorRef } from "@angular/core";
import { ThemeService } from "app/theme.service";
import * as xlsx from "xlsx";

interface City {
  name: string;
  code: string;
}

interface Task {
  name: string;
}

interface ScheduleMode {
  name: string;
  id: number;
}

export interface ScheduleTask {
  id?: number;
  name?: string;
  task_id?: string;
  mode?: string;
  startDate?: Calendar;
  startTime?: Calendar;
}

export interface ScheduleTaskTable {
  id?: number;
  schedule_name?: string;
  schedule_type?: string;
  trigger?: string;
  create_time?: string;
  modify_time?: string;
  status?: string;
  start_date?: string;
  start_time?: string;
}

@Component({
  selector: "schedule-cmp",
  moduleId: module.id,
  templateUrl: "schedule.component.html",
  styleUrls: ["schedule.component.scss"],
  styles: [
    `
      :host ::ng-deep .p-dialog .user-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }

      label {
        color: black;
        font-size: 16px;
      }

      p-radiobutton {
        vertical-align: middle;
      }
    `
  ]
})
export class ScheduleComponent {
  receiver: string;
  subject: string;
  message: string;
  terminal_prompt: string = "command $";

  scheduleTaskDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  subscription: Subscription;

  selectedCities: string[] = [];

  task: Task[];

  selectedCity: City;

  selectedCategory: any = null;

  consoleM: Observable<string>;

  console_output: string;
  console_input: HTMLInputElement;

  schedule_tasks: Schedule[] = [];

  schedule_task: Schedule;

  selectedSchedule: Schedule[];

  selectedCommand: string;

  selectedScheduleMode: ScheduleMode;
  selectedScheduleMode2: string;
  scheduleModes: ScheduleMode[];
  scheduleTask: ScheduleTaskTable = {};
  scheduleTasks: ScheduleTaskTable[];
  start_date: Date;
  actionItems: MenuItem[] | undefined;
  itemsAction: MenuItem[];
  // start_time: Date;
  // startdate: Calendar;
  // starttime: Calendar;

  constructor(
    private changeDetection: ChangeDetectorRef,
    public themeService: ThemeService,
    private scheduleService: ScheduleTaskService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title
  ) {
    this.titleService.setTitle("SED-Schedule Task");
    this.scheduleModes = [
      { name: "one time", id: 0 },
      { name: "daily", id: 1 },
      { name: "weekly", id: 2 },
      { name: "monthly", id: 3 }
    ];

    this.task = [
      { name: "ping to Klongluand" },
      { name: "ping to Minburi" },
      { name: "ping check 195.72.83.22" }
    ];
    this.selectedScheduleMode = this.scheduleModes[0];
  }

  ngOnInit(): void {
    this.themeService.currentpage("/schedule");
    this.scheduleService.getScheduleTask().subscribe({
      next: data => (this.scheduleTasks = data),
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
    this.scheduleService.currentMessage.subscribe(task => {
      if (task != undefined) {
        this.itemsAction = [
          {
            label: "scheduleTask",
            items: [
              {
                label: "Edit Schedule",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                  this.editSchedule(task);
                }
              }
            ]
          }
        ];
      }
    });
  }
  menuVlue(task) {
    this.scheduleService.valueSource(task);
  }
  ngAfterViewInit() {}

  ngOnDestroy(): void {}

  actionItem(scheduleTask: ScheduleTaskTable) {
    return [
      {
        icon: "pi pi-fw pi-pencil",
        items: [
          {
            label: "Execute",
            icon: "pi pi-fw pi-play",
            command: event => {
              this.editSchedule(scheduleTask);
            }
          }
        ]
      }
    ];
  }

  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `schedule-task${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.scheduleTasks
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

  onChangeScheduleMode(event) {
    this.selectedScheduleMode.name = event.value.name;
    this.scheduleTask.schedule_type = this.selectedScheduleMode.name;
  }
  onSelectMethod(event) {
    let d = new Date(Date.parse(event));
    this.scheduleTask.start_date = `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .replace(/^(\d)$/, "0$1")}-${d
      .getDate()
      .toString()
      .replace(/^(\d)$/, "0$1")}T${d
      .getHours()
      .toString()
      .replace(/^(\d)$/, "0$1")}:${d
      .getMinutes()
      .toString()
      .replace(/^(\d)$/, "0$1")}:${d
      .getSeconds()
      .toString()
      .replace(/^(\d)$/, "0$1")}`;
    return this.scheduleTask;
  }
  onSelectMethod2(event) {
    let d = new Date(Date.parse(event));
    this.scheduleTask.start_time = `${this.scheduleTask.start_date.slice(
      0,
      10
    )}T${d
      .getHours()
      .toString()
      .replace(/^(\d)$/, "0$1")}:${d
      .getMinutes()
      .toString()
      .replace(/^(\d)$/, "0$1")}:${d
      .getSeconds()
      .toString()
      .replace(/^(\d)$/, "0$1")}`;
    return this.scheduleTask;
  }
  openNew() {
    this.schedule_task = {};
    this.submitted = false;
    this.scheduleTaskDialog = true;
    this.dialogHeader = "Add new schedule task";
  }

  deleteSelectedSchedules() {
    const data = this.selectedSchedule;
    const result = data.reduce(function(r, e) {
      return (
        Object.keys(e).forEach(function(k) {
          if (!r[k]) r[k] = [].concat(e[k]);
          else r[k] = r[k].concat(e[k]);
        }),
        r
      );
    }, {});
    var obj = result;
    var list = Object.values(obj.id);
    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete the selected" +
        " " +
        this.selectedSchedule.length +
        " " +
        " schedule_tasks?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.schedule_tasks = this.schedule_tasks.filter(
          val => !this.selectedSchedule.includes(val)
        );
        this.selectedSchedule = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "schedule_tasks Deleted",
          life: 3000
        });
        this.scheduleService.deleteScheduleTask(list);
        this.changeDetection.detectChanges();
        this.scheduleService
          .getScheduleTask()
          .subscribe(data => (this.scheduleTasks = data));
      }
    });
  }

  editSchedule(scheduleTask: ScheduleTaskTable) {
    let one_time = "one time";
    let daily = "daily";
    let weekly = "weekly";
    let monthly = "monthly";
    this.scheduleTask = { ...scheduleTask };
    this.scheduleTaskDialog = true;
    this.dialogHeader = "Edit Schedule Task";
    if (scheduleTask.schedule_type == one_time) {
      this.selectedScheduleMode = this.scheduleModes[0];
    }
    if (scheduleTask.schedule_type == daily) {
      this.selectedScheduleMode = this.scheduleModes[1];
    }
    if (scheduleTask.schedule_type == weekly) {
      this.selectedScheduleMode = this.scheduleModes[2];
    }
    if (scheduleTask.schedule_type == monthly) {
      this.selectedScheduleMode = this.scheduleModes[3];
    }
  }
  datetask() {}

  hideDialog() {
    this.scheduleTaskDialog = false;
    this.submitted = false;
  }

  saveSchedule() {
    this.submitted = true;
    this.scheduleService.editScheduleTask(this.scheduleTask).subscribe({
      next: data => {
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "ScheduleTask Updated",
          life: 3000
        });
        this.scheduleService
          .getScheduleTask()
          .subscribe(data => (this.scheduleTasks = data));
        this.changeDetection.detectChanges();
      },
      error: error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "ScheduleTask Updated Error."
        });
      }
    });
    this.scheduleTaskDialog = false;
  }
  refresh(): void {
    window.location.reload();
  }
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.schedule_tasks.length; i++) {
      if (this.schedule_tasks[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = "";
    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
