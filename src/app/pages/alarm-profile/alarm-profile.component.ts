import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";
import { BrowserModule, Title } from "@angular/platform-browser";
import { AlarmProfileService } from '@app/pages/alarm-profile/alarm-profile.service';
import { MessageService, ConfirmationService } from "primeng/api";
import { ThemeService } from "app/theme.service";
import * as xlsx from "xlsx";

@Component({
  selector: 'app-alarm-profile',
  templateUrl: './alarm-profile.component.html',
  styleUrls: ['./alarm-profile.component.scss']
})
export class AlarmProfileComponent implements OnInit {
  Alarms:any[];
  selectedAlarms:any[];
  itemsAction: MenuItem[];
  dialogHeader:string;
  showEditDialog:boolean = false;
  showViewDialog:boolean = false;
  CreatedBy:any;
  CreatedAt:any;
  UpdatedBy:any;
  UpdatedAt:any;
  invinvalid_display_name:any;
  invinvalid_alarm_type:any;
  invinvalid_alarm_level:any;
  invinvalid_alarm_value:any;
  display_name:any;
  alarm_type:any;
  alarm_level:any;
  alarm_value:any;
  severitys:any;
  selectedseverity:any;
  editedID:any;
  Activestatus:any;
  constructor( public AlarmProfileService: AlarmProfileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    public themeService: ThemeService) { 
      this.titleService.setTitle("SED-Manage Alarm Threshold");
      this.severitys = [
        {"name": "warning"},
        {"name": "critical"}
      ]
    }

  ngOnInit(): void {
    this.AlarmProfileService.getAllAlarm().subscribe({
      next: data => {
        this.Alarms = data.detail.data
        data.detail.data.forEach(data => {
          var list = new Date(data.created_at)
          var dformat =
          list.getFullYear() +
        "-" +
        ("00" + (list.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + list.getDate()).slice(-2) +
        " " +
        ("00" + list.getHours()).slice(-2) +
        ":" +
        ("00" + list.getMinutes()).slice(-2) +
        ":" +
        ("00" + list.getSeconds()).slice(-2);
        data.created_at = dformat

        var listS = new Date(data.updated_at)
          var dformat =
          listS.getFullYear() +
        "-" +
        ("00" + (listS.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + listS.getDate()).slice(-2) +
        " " +
        ("00" + listS.getHours()).slice(-2) +
        ":" +
        ("00" + listS.getMinutes()).slice(-2) +
        ":" +
        ("00" + listS.getSeconds()).slice(-2);
        data.updated_at = dformat
        })
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
    this.AlarmProfileService.currentMessage.subscribe(data => {
      if (data != undefined) {
        this.itemsAction = [
          {
            label: "Alarm",
            items: [
              {
                label: "View",
                icon: "pi pi-fw pi-search",
                command: event => {
                  this.ViewDialog(data);
                }
              },
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                  this.editDialog(data);
                }
              },
              
            ]
          }
        ];
      }
    });
  }
  ViewDialog(data: any) {
    this.showViewDialog = true;
    this.dialogHeader = "View Alarm";
    this.display_name = data.display_name;
    this.alarm_type = data.alarm_type;
    this.alarm_level = data.alarm_level;
    this.alarm_value = data.alarm_value;
    this.editedID = data.ref_code;
    this.selectedseverity = data.severity
    this.CreatedBy = data.created_by;
    this.CreatedAt = data.created_at;
    this.UpdatedBy = data.updated_by;
    this.UpdatedAt = data.updated_at;
    this.Activestatus = data.active;
  }
  editDialog(data: any) {
    this.showEditDialog = true;
    this.dialogHeader = "Edit Alarm";
    this.display_name = data.display_name;
    this.alarm_type = data.alarm_type;
    this.alarm_level = data.alarm_level;
    this.alarm_value = data.alarm_value;
    this.editedID = data.ref_code;
    if (data.severity == 'warning'){
      this.selectedseverity = this.severitys[0];
    } else if (data.severity == 'critical'){
      this.selectedseverity = this.severitys[1];
    }
   
  }
  
  onChangeseverity(event){
    // this.selectedseverity = event.value.name;
  }

  saveEdit(){
    if (this.display_name != undefined && this.alarm_type != undefined && this.alarm_level != undefined && this.alarm_value != undefined 
      && this.display_name != "" && this.alarm_type != "" && this.alarm_level != "" && this.alarm_value != "" ){
      var list = {
        "severity": this.selectedseverity.name,
        "display_name":this.display_name,
        "alarm_type":this.alarm_type,
        "alarm_level":this.alarm_level,
        "alarm_value":this.alarm_value
      }
      this.AlarmProfileService.editAlarm(this.editedID,list).subscribe({
        next: data => {
          this.Alarms = data.detail.data
          this.showEditDialog = false;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: data.detail.message,
            life: 3000
          });
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
    } else {
      if (this.display_name == undefined || this.display_name == ""){
        this.invinvalid_display_name = "ng-invalid ng-dirty";
      }
      if (this.alarm_type == undefined || this.alarm_type == ""){
        this.invinvalid_alarm_type = "ng-invalid ng-dirty";
      }
      if (this.alarm_level == undefined || this.alarm_level == ""){
        this.invinvalid_alarm_level = "ng-invalid ng-dirty";
      }
      if (this.alarm_value == undefined || this.alarm_value == ""){
        this.invinvalid_alarm_value = "ng-invalid ng-dirty";
      }
    }
  }
  hideDialog(){
    this.showEditDialog = false;
    this.showViewDialog = false;
    this.display_name = undefined;
    this.alarm_type = undefined;
    this.alarm_level = undefined;
    this.alarm_value = undefined;
    this.editedID = undefined;
    // this.selectedseverity = undefined;
    this.CreatedBy = undefined;
    this.CreatedAt = undefined;
    this.UpdatedBy = undefined;
    this.UpdatedAt = undefined;
    this.Activestatus = undefined;
    this.invinvalid_display_name = "";
    this.invinvalid_alarm_type = "";
    this.invinvalid_alarm_level = "";
    this.invinvalid_alarm_value = "";
  }
  
  exportToExcel(){
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `Alarm-Profile${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.Alarms);
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
  menuVlue(task) {
    this.AlarmProfileService.valueSource(task);
  }

}
