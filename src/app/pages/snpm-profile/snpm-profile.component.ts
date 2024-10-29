import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";
import { BrowserModule, Title } from "@angular/platform-browser";
import { SnpmProfileService } from '@app/pages/snpm-profile/snpm-profile.service';
import { MessageService, ConfirmationService } from "primeng/api";
import { ThemeService } from "app/theme.service";
import * as xlsx from "xlsx";
@Component({
  selector: 'app-snpm-profile',
  templateUrl: './snpm-profile.component.html',
  styleUrls: ['./snpm-profile.component.scss']
})
export class SnpmProfileComponent implements OnInit {
  SNMPs:any[];
  selectedSNMPs:any[];
  itemsAction: MenuItem[];
  editedName:any;
  editedID:any;
  dialogHeader:string;
  showEditDialog:boolean = false;
  showAddDialog:boolean = false;
  showViewDialog:boolean = false;
  editedSNMP:any;
  disableSNMP:boolean = false;
  CreatedBy:any;
  CreatedAt:any;
  UpdatedBy:any;
  UpdatedAt:any;
  invinvalidName:any;
  invinvalidSNMP:any;
  
  constructor( public SnpmProfileService: SnpmProfileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    public themeService: ThemeService) { 
      this.titleService.setTitle("SED-Manage SNPM Profile");
    }

  ngOnInit(): void {
    this.SnpmProfileService.getAllSNMP().subscribe({
      next: data => {
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
        this.SNMPs = data.detail.data
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
    this.SnpmProfileService.currentMessage.subscribe(data => {
      if (data != undefined) {
        this.itemsAction = [
          {
            label: "SNPM",
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
              {
                label: "Delete",
                icon: "pi pi-fw pi-trash",
                command: event => {
                  this.deleteSNMP(data);
                }
              }
            ]
          }
        ];
      }
    });
  }
  ViewDialog(data: any) {
    this.showViewDialog = true;
    this.dialogHeader = "View SNMP";
    this.editedName = data.name;
    this.editedSNMP = data.oid_config;
    this.editedID = data.ref_code;
    this.CreatedBy = data.created_by;
    this.CreatedAt = data.created_at;
    this.UpdatedBy = data.updated_by;
    this.UpdatedAt = data.updated_at;
  }
  editDialog(data: any) {
    this.showEditDialog = true;
    this.dialogHeader = "Edit SNMP";
    this.editedName = data.name;
    this.editedSNMP = data.oid_config;
    this.editedID = data.ref_code;
  }
  openNew(){
    this.showAddDialog = true;
    this.dialogHeader = "Add SNMP";
    // this.editedName = data.name;
    // this.editedSNMP = data.oid_config;
    // this.editedID = data.id;
  }
  saveAdd(){
    if (this.editedName != undefined && this.editedSNMP != undefined && this.editedName != "" && this.editedSNMP != ""){
      this.SnpmProfileService.createSNMP(this.editedName,this.editedSNMP).subscribe({
        next: data => {
          this.SNMPs = data.detail.data;
          this.showAddDialog = false;
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
      if (this.editedName == undefined || this.editedName == ""){
        this.invinvalidName = "ng-invalid ng-dirty";
      }
      if (this.editedSNMP == undefined || this.editedSNMP == ""){
        this.invinvalidSNMP = "ng-invalid ng-dirty";
      }
    }

  }
  onKeyUpSNMPName(){
    this.invinvalidName = ""; 
  }
  onKeyUpSNMP(){
    this.invinvalidSNMP = "";
  }
  saveEdit(){
    if (this.editedName != undefined && this.editedSNMP != undefined && this.editedName != "" && this.editedSNMP != ""){
      var list = {
        "name":this.editedName,
        "snmp_config":this.editedSNMP
      }
      this.SnpmProfileService.editSNMP(this.editedID,list).subscribe({
        next: data => {
          this.SNMPs = data.detail.data
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
      if (this.editedName == undefined || this.editedName == ""){
        this.invinvalidName = "ng-invalid ng-dirty";
      }
      if (this.editedSNMP == undefined || this.editedSNMP == ""){
        this.invinvalidSNMP = "ng-invalid ng-dirty";
      }
    }
  }
  hideDialog(){
    this.editedName = undefined;
    this.editedSNMP = undefined;
    this.editedID = undefined;
    this.showAddDialog = false;
    this.showEditDialog = false;
    this.showViewDialog = false;
    this.invinvalidName = ""; 
    this.invinvalidSNMP = "";
  }
  deleteSNMP(data){

    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete the selected Name :" +
        " " +
        data.name +
        " " +
        "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.SnpmProfileService.deleteSNMP(data.ref_code).subscribe(datalist => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: datalist.detail.message,
            life: 3000
          });
          this.SnpmProfileService.getAllSNMP().subscribe({
            next: data => {
              this.SNMPs = data.detail.data
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
        });
        // this.changeDetection.detectChanges();
      }
    });
  }
  exportToExcel(){
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `SNMP-Profile${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.SNMPs);
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
    this.SnpmProfileService.valueSource(task);
  }
}
