import { Component } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { Observable, Subscription } from "rxjs";
import { getEffectiveConstraintOfTypeParameter } from "typescript";
import { takeLast } from "rxjs-compat/operator/takeLast";
import { Calendar } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { MessageService, ConfirmationService } from "primeng/api";
import { TaskService } from "@app/task.service";
import { Table } from "primeng/table";
import { OnInit, ChangeDetectorRef } from "@angular/core";
import { ThemeService } from "app/theme.service";
import * as xlsx from "xlsx";
import { MenuItem } from "primeng/api";
export interface Task {
  id?: string;
  name?: string;
  username?: string;
  password?: string;
  device_type?: string;
  command?: string;
  task_type?: string;
  target?: string;
  parameter?: string;
  created_by?: number;
  type?: string;
}

export interface ScheduleTask {
  id?: string;
  name?: string;
  task_id?: string;
  mode?: string;
  startDate?: Calendar;
  startTime?: Calendar;
  email?: string;
  phone?: string;
}

interface DeviceType {
  name: string;
  id: number;
}

interface TaskType {
  name: string;
  id: number;
  requireCommand: boolean;
}

interface ScheduleMode {
  name: string;
  id: number;
}
interface filterlist {
  name: any;
}
@Component({
  selector: "typography-cmp",
  moduleId: module.id,
  templateUrl: "task.component.html",
  styleUrls: ["task.component.scss"],

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
export class TaskComponent {
  taskDialog: boolean;
  taskreadDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  subscription: Subscription;

  scheduleTaskDialog: boolean = false;
  task: Task = {};
  tasks: Task[] = [];
  Tasks: Task[];
  stringArray: string[];
  selectedTask: Task;
  selcetedTaskForSchedule: Task;
  selectedTasks: Task[];
  scheduleTask: ScheduleTask = {};
  activate: boolean = false;
  scheduleModes: ScheduleMode[];
  selectedScheduleMode: ScheduleMode;
  activates: boolean = false;
  deviceTypes: DeviceType[] = [];
  selectedDeviceType: DeviceType;
  takstypeArr: any[] = [];
  taksnameArr: any[] = [];
  takstargetArr: any[] = [];
  taskTypes: TaskType[] = [];
  selectedType: TaskType;
  selectedTypes: TaskType;
  requireCommand: boolean;
  invalidName: string;
  invalidtarget: string;
  invalidUser: string;
  invalidPassword: string;
  invalidscheduleTaskname: string;
  invalidscheduleTaskStartDate: string;
  invalidscheduleTaskStartTime: string;
  itemsAction: MenuItem[];
  constructor(
    private changeDetection: ChangeDetectorRef,
    private taskService: TaskService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    public themeService: ThemeService
  ) {
    this.titleService.setTitle("SED-Task manage");
    this.deviceTypes = [
      { name: "any", id: 0 },
      { name: "ISCOM2924GF-4C", id: 1 },
      { name: "ISCOM2110EA-MA", id: 2 },
      { name: "ISCOM-RAX711", id: 3 }
    ];
    this.scheduleModes = [
      { name: "one time", id: 0 },
      { name: "daily", id: 1 },
      { name: "weekly", id: 2 },
      { name: "monthly", id: 3 }
    ];
    this.taskTypes = [
      { name: "backup", id: 0, requireCommand: false },
      // { name: 'ping', id: 1, requireCommand: true },
      { name: "custom", id: 1, requireCommand: true }
    ];
    this.selectedDeviceType = this.deviceTypes[0];
    this.selectedScheduleMode = this.scheduleModes[0];
    this.selectedType = this.taskTypes[0];
    this.requireCommand = this.selectedType.requireCommand;
  }

  ngOnInit(): void {
    this.themeService.currentpage("/task");
    this.taskService.getTask().subscribe({
      next: data => {
        this.tasks = data;

        var takstype = data.map(function(singleElement) {
          return singleElement.type;
        });
        var taksname = data.map(function(singleElement) {
          return singleElement.name;
        });
        var takstarget = data.map(function(singleElement) {
          return singleElement.target;
        });
        let findDuplicates = arr =>
          arr.filter((item, index) => arr.indexOf(item) == index);

        // All duplicates
        var listtype = [...new Set(findDuplicates(takstype))];
        var listnames = [...new Set(findDuplicates(taksname))];

        var listtarget = [...new Set(findDuplicates(takstarget))];
        this.takstypeArr.push(...listtype);
        this.taksnameArr.push(...listnames);
        this.takstargetArr.push(...listtarget);

        // console.log([...new Set(findDuplicates(taketype))]);
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

    this.taskService.currentMessage.subscribe(task => {
      if (task != undefined) {
        this.itemsAction = [
          {
            label: "Task",
            items: [
              {
                label: "Manage Task",
                icon: "pi pi-fw pi-cog",
                command: event => {
                  this.taskread(task);
                }
              },
              {
                label: "Edit Task",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                  this.editTask(task);
                }
              },
              {
                label: "Scheduled Task",
                icon: "pi pi-fw pi-calendar",
                command: event => {
                  this.openScheduleTaskDialog(task);
                }
              }
            ]
          }
        ];
      }
    });
    // this.selectedType = this.taskTypes[1];
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {}
  clear(table: Table) {
    table.clear();
  }
  menuVlue(task) {
    this.taskService.valueSource(task);
  }
  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `task-manage${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.tasks);
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

  menuValue(task) {
    this.taskService.valueSource(task);
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

  actionItem(task: Task) {
    // console.log('hi')
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Manage Task",
            icon: "pi pi-fw pi-cog",
            command: event => {
              this.taskread(task);
            }
          },
          {
            label: "Edit Task",
            icon: "pi pi-fw pi-pencil",
            command: event => {
              this.editTask(task);
            }
          },
          {
            label: "Scheduled Task",
            icon: "pi pi-fw pi-calendar",
            command: event => {
              this.openScheduleTaskDialog(task);
            }
          }
        ]
      }
    ];
  }

  onChangeTaskType(event) {
    //console.log('event value :' + event.value.name);
    this.requireCommand = this.selectedType.requireCommand;
    this.task.task_type = event.value.name;
    this.task.type = event.value.name;
  }

  onChangeDeviceType(event) {
    //console.log('event value :' + event.value.name);
  }

  onChangeScheduleMode(event) {
    //console.log('event value :' + event.value.name);
  }

  openNew() {
    this.task = {};
    this.submitted = false;
    this.taskDialog = true;
    this.task.username = "raisecom";
    this.task.password = "raisecom";
    this.dialogHeader = "Create a new task";
    
   
  }

  openScheduleTaskDialog(task) {
    this.selcetedTaskForSchedule = task;
    this.scheduleTaskDialog = true;
    this.submitted = false;
    this.dialogHeader = task.name;
  }
  deleteSelectedTasks() {
    const data = this.selectedTasks;
    const result = data.reduce(function(r, e) {
      return (
        Object.keys(e).forEach(function(k) {
          if (!r[k]) r[k] = [].concat(e[k]);
          else r[k] = r[k].concat(e[k]);
        }),
        r
      );
    }, {});
    // //console.log(result)
    var obj = result;
    var list = Object.values(obj.id);
    // //console.log(list)
    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete the selected" +
        " " +
        this.selectedTasks.length +
        " " +
        "tasks?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.tasks = this.tasks.filter(
          val => !this.selectedTasks.includes(val)
        );
        this.selectedTasks = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Task Deleted",
          life: 3000
        });
        this.taskService.deleteTask(list);
        // this.changeDetection.detectChanges();
      }
    });
  }
  taskread(task: Task) {
    this.task = task;
    this.taskreadDialog = true;
    this.dialogHeader = "Manage Task";
    if (task.command !== null) {
      this.activate = true;
      this.activates = false;
    } else if (task.command == null) {
      this.activates = true;
      this.activate = false;
    }
    // const name = task.command;
    // this.stringArray = name.split( '\ ' );
    // console.log(this.stringArray);
  }
  editTask(task: Task) {
    let backup = "backup";
    this.task = { ...task };
    this.taskDialog = true;
    this.task.username = "raisecom";
    this.task.password = "raisecom";
    this.dialogHeader = "Edit task";
    
    if (task.task_type == "backup") {
      this.selectedType = this.taskTypes[0];
    } else if (task.task_type == "custom") {
      this.selectedType = this.taskTypes[1];
    }
  }

  hideDialog() {
    // console.log("HIDE" + this.task.name + this.task.command);
    // this.task.name = undefined;
    // this.task.command = undefined;
    this.selectedType = undefined;
    this.taskDialog = false;
    this.submitted = false;
    this.scheduleTaskDialog = false;
    this.invalidName = "";
    this.invalidPassword = "";
    this.invalidUser = "";
    this.invalidtarget = "";
    this.invalidscheduleTaskname = "";
    this.invalidscheduleTaskStartDate = "";
    this.invalidscheduleTaskStartTime = "";
    this.scheduleTask.startDate = undefined;
    this.scheduleTask.startTime = undefined;
    this.scheduleTask.name = undefined;
    this.scheduleTask.email = "";
    this.scheduleTask.phone = "";
  }
  onSelectstartDate(event) {
    this.invalidscheduleTaskStartDate = "";
  }
  onSelectstartTime(event) {
    this.invalidscheduleTaskStartTime = "";
  }
  saveScheduleTask() {
    if (
      this.scheduleTask.name != undefined &&
      this.scheduleTask.startDate != undefined &&
      this.scheduleTask.startTime != undefined
    ) {
      this.scheduleTask.mode = this.selectedScheduleMode.name;
      this.scheduleTask.id = this.selcetedTaskForSchedule.id;
      this.scheduleTask.task_id = this.selcetedTaskForSchedule.id;
      this.taskService.createScheduleTask(this.scheduleTask);
      this.scheduleTaskDialog = false;
      this.scheduleTask = {};
      this.selectedScheduleMode = this.scheduleModes[0];
      this.invalidscheduleTaskname = "";
      this.invalidscheduleTaskStartDate = "";
      this.invalidscheduleTaskStartTime = "";
    } else {
      if (this.scheduleTask.name == undefined) {
        this.invalidscheduleTaskname = "ng-invalid ng-dirty";
      }
      if (this.scheduleTask.startDate == undefined) {
        this.invalidscheduleTaskStartDate = "ng-invalid ng-dirty";
      }
      if (this.scheduleTask.startTime == undefined) {
        this.invalidscheduleTaskStartTime = "ng-invalid ng-dirty";
      }
    }
  }
  refresh(): void {
    window.location.reload();
  }
  saveTask() {
    // console.log(this.task.username);
    // this.task.task_type = this.selectedType.name;
    this.submitted = true;
    //console.log(this.task)
    if (
      this.task.name == undefined ||
      this.task.target == undefined ||
      this.task.username == "" ||
      this.task.password == ""
    ) {
      if (this.task.name == undefined) {
        this.invalidName = "ng-invalid ng-dirty";
      }
      if (this.task.target == undefined) {
        this.invalidtarget = "ng-invalid ng-dirty";
      }
      if (this.task.username == "") {
        this.invalidUser = "ng-invalid ng-dirty";
      }
      if (this.task.password == "") {
        this.invalidPassword = "ng-invalid ng-dirty";
      }
    } else {
      if (this.task.name != undefined) {
        this.invalidName = "";
      }
      if (this.task.target != undefined) {
        this.invalidtarget = "";
      }
      if (this.task.username != "") {
        this.invalidUser = "";
      }
      if (this.task.password != "") {
        this.invalidPassword = "";
      }
      if (this.task.id) {
        this.tasks[this.findIndexById(this.task.id)] = this.task;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "task Updated",
          life: 3000
        });
        this.taskService.editTask(this.task);
        this.changeDetection.detectChanges();
      } else {
        this.task.id = this.createId();
        this.tasks.push(this.task);
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "task Created",
          life: 3000
        });
        this.taskService.createTask(this.task);
        this.changeDetection.detectChanges();
      }
      this.taskService.getTask().subscribe(data => (this.tasks = data));
      // this.tasks = [...this.tasks];
      this.taskDialog = false;
      this.task = {};
      this.selectedDeviceType = this.deviceTypes[0];
    }
  }
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === id) {
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
