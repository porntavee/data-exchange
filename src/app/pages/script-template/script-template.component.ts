import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { ScriptTemplateService } from "@app/pages/script-template/script-template.service";
import * as e from "cors";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { ThemeService } from "app/theme.service";
import { TieredMenuModule } from "primeng/tieredmenu";
import * as xlsx from "xlsx";
export interface Script {
  name?: string;
  script?: string;
  created_at?: string;
  modified_at?: string;
  id?: any;
  supported_models?: string;
}

interface Execute {
  IPADDRESS?: string;
  script?: string;
}

interface DeviceType {
  model: string;
  id: number;
}

@Component({
  selector: "app-script-template",
  templateUrl: "script-template.component.html",
  styleUrls: ["script-template.component.css"]
})
export class ScriptTemplateComponent implements OnInit {
  scripts: Script[] = [];
  script: Script = {};
  executes: Execute[] = [];
  execute: Execute = {};
  deviceTypes: DeviceType[] = [];
  selectedDeviceType: any;
  modelType: string;
  ipAddress: string;
  display: boolean;
  dialogHeader: string;
  submitted: boolean;
  addNewScriptDialog: boolean;
  playScriptDialog: boolean;
  showEditDialog: boolean;
  editedName: string;
  editedID: any;
  editedScript: string;
  editedSupportedModels: string;
  resultScript: string;
  newScriptName: string;
  newScriptScript: string;
  newScriptSupported: string;
  loadingScript: boolean = false;
  loadResult: boolean;
  invinvalid: string;
  invinvalid2: string;
  invinvalid3: string;
  nameInput: string;
  emptyString: string;
  data = [this.script];
  sortField: string;
  sortOrder: number;
  products1: Script[];
  actionItems: MenuItem[] | undefined;
  itemsAction: MenuItem[];
  constructor(
    private scriptTemplateService: ScriptTemplateService,
    private titleService: Title,
    private messageService: MessageService,
    private changeDetection: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    public themeService: ThemeService
  ) {
    this.titleService.setTitle("SED-Script Template");

    this.deviceTypes = [
      { model: "ISCOM-RAX711", id: 0 },
      { model: "ISCOM2608G-2GE", id: 1 },
      { model: "ISCOM2924GF-4C", id: 2 },
      { model: "ISCOM2948GF-4C", id: 3 },
      { model: "ISCOM2948G-4C", id: 4 }
    ];
    this.script.name = this.script.name;
    this.script.id = this.script.id;
    this.ipAddress = "10.208.59.5";
  }

  exportPDF() {
    // Create a new jsPDF instance
    const pdf = new jsPDF();
    var head, body;
    pdf.text("Table Title", 14, 10);
    this.scriptTemplateService.getScriptTemplate().subscribe({
      next: data => {
        this.scripts = data;
        head = Object.keys(data[0]).map(function(key) {
          return [key];
        });
        body = data.map(function(item) {
          return Object.values(item);
        });
        var columns = Object.keys(data[0]).map(function(key) {
          return { title: key, dataKey: key };
        });

        autoTable(pdf, {
          head: head,
          body: body
        });

        pdf.save("table.pdf");
      }
    });
  }

  ngOnInit(): void {
    this.themeService.currentpage("/script");
    this.resultScript = "Waiting for run script command!";
    this.scriptTemplateService.getScriptTemplate().subscribe({
      next: data => {
        this.scripts = data;
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
    this.scriptTemplateService.currentMessage.subscribe(script => {
      if (script != undefined){
        this.itemsAction = [{
          label: 'script',
          items: [
                  {
                    label: "Execute",
                    icon: "pi pi-fw pi-play",
                    command: event => {
                      this.openPlayScript(script);
                    }
                  },
                  {
                    label: "Information",
                    icon: "pi pi-fw pi-info",
                    command: event => {
                      this.showInfo(script);
                    }
                  },
                  {
                    label: "Edit",
                    icon: "pi pi-fw pi-pencil",
                    command: event => {
                      this.editDialog(script);
                    }
                  },
                  {
                    label: "Delete",
                    icon: "pi pi-fw pi-trash",
                    command: event => {
                      this.deleteScript(script);
                    }
                  },
                ]}
      ];
      }
     
    })
  }
  menuVlue(task){
    this.scriptTemplateService.valueSource(task);
  }
  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `script${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.scripts);
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

  actionItem(script: Script) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Execute",
            icon: "pi pi-fw pi-play",
            command: event => {
              this.openPlayScript(script);
            }
          },
          {
            label: "Information",
            icon: "pi pi-fw pi-info",
            command: event => {
              this.showInfo(script);
            }
          },
          {
            label: "Edit Task",
            icon: "pi pi-fw pi-pencil",
            command: event => {
              this.editDialog(script);
            }
          },
          {
            label: "Delete",
            icon: "pi pi-fw pi-trash",
            command: event => {
              this.deleteScript(script);
            }
          }
        ]
      }
    ];
  }

  sortData(event) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.products1 = [...this.products1].sort((a, b) => {
      let value1 = a[this.sortField];
      let value2 = b[this.sortField];
      let result = null;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === "string" && typeof value2 === "string")
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      return event.order * result;
    });
    this.cd.detectChanges();
  }

  refresh(): void {
    window.location.reload();
  }
  applyFilter() {}

  onChangeModel(event) {
    this.modelType = event.value.name;
    this.invinvalid2 = "";
  }

  onChangeScriptName(event) {
    this.invinvalid = "";
  }

  openAddScript() {
    this.script = {};
    this.submitted = false;
    this.addNewScriptDialog = true;
    this.dialogHeader = "Add new script";
  }

  openPlayScript(script: Script) {
    this.playScriptDialog = true;
    this.loadingScript = false;
    this.dialogHeader = "Execute script";
    this.editedScript = script.script;
  }

  onchangeNameInput(event) {
    this.newScriptName = "";
  }

  runScript(script: Script) {
    this.resultScript = "Loading Script ...";
    // document.getElementById("foo").setAttribute("class", "style1");
    this.loadingScript = true;
    this.submitted = true;
    this.loadResult = true;
    this.scriptTemplateService
      .executeScript(this.ipAddress, this.editedScript)
      .subscribe({
        next: data => {
          this.loadResult = false;
          this.loadingScript = false;
          this.resultScript = data.detail;
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Success",
          //   detail: "Script edited!"
          // });
          // this.changeDetection.detectChanges();
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
  }

  createScriptTemplate() {
    if (
      this.newScriptName != undefined &&
      this.newScriptScript != undefined &&
      this.selectedDeviceType != undefined
    ) {
      this.invinvalid = "";
      this.invinvalid2 = "";
      this.invinvalid3 = "";
      var select = this.selectedDeviceType.map(data => data["model"]);
      this.scriptTemplateService
        .createScript(
          this.newScriptName,
          this.newScriptScript,
          select.toString()
        )
        .subscribe({
          next: data => {
            this.submitted = true;
            this.addNewScriptDialog = false;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Created script template!"
            });
            this.changeDetection.detectChanges();
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
    }
    if (this.newScriptName == undefined) {
      this.invinvalid = "ng-invalid ng-dirty";
    } else {
      this.invinvalid = "";
    }
    if (this.selectedDeviceType == undefined) {
      this.invinvalid2 = "ng-invalid ng-dirty";
    } else {
      this.invinvalid2 = "";
    }
    if (this.newScriptScript == undefined) {
      this.invinvalid3 = "ng-invalid ng-dirty";
    } else {
      this.invinvalid3 = "";
    }
  }

  showInfo(script: Script) {
    this.script = script;
    this.display = true;
    this.dialogHeader = "Script Information";
  }

  hideDialog() {
    this.resultScript = "Waiting for run script command!";
    this.newScriptName = undefined;
    this.editedSupportedModels = undefined;
    this.selectedDeviceType = undefined;
    this.newScriptScript = undefined;
    this.playScriptDialog = false;
    this.showEditDialog = false;
    this.addNewScriptDialog = false;
    this.invinvalid = "";
    this.invinvalid2 = "";
    this.invinvalid3 = "";

    this.script = this.script;
  }

  editDialog(script: Script) {
    this.showEditDialog = true;
    this.script = { ...script };
    this.dialogHeader = "Edit Script";
    this.editedName = script.name;
    this.editedScript = script.script;
    this.editedID = script.id;
    this.editedSupportedModels = script.supported_models;
  }

  deleteScript(script: Script) {
    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete this script" +
        " " +
        script.name +
        " " +
        "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        // this.changeDetection.detectChanges();
        this.scriptTemplateService.deleteScript(script.id).subscribe({
          next: result => {
            this.changeDetection.reattach();
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "File Deleted",
              life: 3000
            });
            setTimeout(() => {
              this.refresh();
            }, 3000);
          },
          error: error => {
            if (error) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error! cannont delete file."
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
        // this.changeDetection.detectChanges();
      }
    });
  }

  saveEdit() {
    this.submitted = true;
    this.showEditDialog = false;
    this.scriptTemplateService
      .editScript(
        this.editedID,
        this.editedName,
        this.editedScript,
        this.editedSupportedModels
      )
      .subscribe({
        next: data => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Script edited!"
          });
          this.changeDetection.detectChanges();
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
  }
}
