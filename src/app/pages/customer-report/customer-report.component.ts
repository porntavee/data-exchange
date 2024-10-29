import { Component, OnInit } from "@angular/core";
import * as xlsx from "xlsx";
import jwt_decode from "jwt-decode";
import { CustomerReportservice } from "@app/pages/customer-report/customer-report.service";
import { BrowserModule, Title } from "@angular/platform-browser";
import { ThemeService } from "app/theme.service";
import { Table } from "primeng/table";
import { MenuItem } from "primeng/api";
import { LazyLoadEvent } from "primeng/api";
import { environment } from "environments/environment";
import { MessageService, ConfirmationService } from "primeng/api";
@Component({
  selector: "app-customer-report",
  templateUrl: "./customer-report.component.html",
  styleUrls: ["./customer-report.component.scss"]
})
export class CustomerReportComponent implements OnInit {
  datacustomlist: any[] = [];
  itemsAction: MenuItem[];
  cat_id: string;
  ip_addressList: any[] = [];
  PortList: any[] = [];
  addDialog: boolean;
  dialogHeader: string;
  selectedIP: any;
  selectedPort: any;
  project_name: string;
  service_name: string;
  speed: string;
  invalidid: string;
  reloadData: boolean;
  invalidip_address: string;
  invalidPort: string;
  invalidproject_name: string;
  invalidservice_name: string;
  invalidspeed: string;
  editDialog: boolean;
  clearip: boolean;
  clearport: boolean;
  clearipAdd: boolean;
  clearportAdd: boolean;
  id_editRow: string;
  Discription: string;
  disabledreload: boolean = true;
  disabledsave: boolean = true;
  invalidDiscription: string;
  readDialog: boolean;
  Resultview: any = {};
  page: any;

  total_records: any;
  loading: boolean;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  size: any = 10;
  setPageSizeOption: any;
  constructor(
    private CustomerReportservice: CustomerReportservice,
    private titleService: Title,
    public themeService: ThemeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.titleService.setTitle("SED -Manage CIRCUIT ID");
  }

  ngOnInit(): void {
    // this.CustomerReportservice.dataGetreport(this.page,this.size).subscribe(datas => {
    //   this.datacustomlist = datas.data;
    //   this.total_records = datas.total

    // });
    this.CustomerReportservice.currentMessage.subscribe(custom => {
      if (custom != undefined) {
        this.itemsAction = [
          {
            label: "custom",
            items: [
              {
                label: "View",
                icon: "pi pi-fw pi-search",
                command: event => {
                  this.viewRowdata(custom);
                }
              },
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                  this.editRowdata(custom);
                }
              },
              {
                label: "Delete",
                icon: "pi pi-fw pi-trash",
                command: event => {
                  this.deleteRowdata(custom);
                }
              }
              // {
              //   label: "Export PDF",
              //   icon: "pi pi-fw pi-calendar",
              //   command: event => {
              //     this.exportPDF(custom);
              //   }
              // }
            ]
          }
        ];
      }
    });
    this.CustomerReportservice.getSearchDevice("").subscribe({
      next: result => {
        result.forEach(element => {
          var data = {
            ip_address: element.symbol_name3
          };

          this.ip_addressList.push(data);
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
  }
  searchValue(event) {
    this.loading = true;
    this.CustomerReportservice.searchValue(
      this.page,
      this.size,
      event
    ).subscribe(datas => {
      this.datacustomlist = datas.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      this.total_records = datas.total;
      this.loading = false;
    });
  }
  paginate(event: LazyLoadEvent) {
    this.loading = true;
    this.page = event.first / event.rows + 1;
    this.setPageSizeOption = event.rows;
    this.size = this.setPageSizeOption;
    this.CustomerReportservice.dataGetreport(this.page, this.size).subscribe(
      datas => {
        this.datacustomlist = datas.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.total_records = datas.total;
        this.loading = false;
      }
    );
  }
  viewRowdata(data) {
    this.readDialog = true;
    this.dialogHeader = "View CIRCUIT ID Information";
    this.Resultview = data;
  }
  catid_edit: any;
  catid_add: any;
  editRowdata(data) {
    this.clearip = true;
    this.clearport = true;
    this.catid_edit = data.circuit_id;
    this.dialogHeader = "Edit CIRCUIT ID Information";
    this.id_editRow = data.ref_code;
    var index_ip = this.ip_addressList.findIndex(
      list => list.ip_address == data.ip_address
    );
    this.CustomerReportservice.getSysInterface(data.ip_address).subscribe({
      next: result => {
        result.data.forEach(element => {
          var list = {
            Port: element.ifName,
            if_descr: element.if_descr,
            portlist: element.ifName + " | " + element.if_descr,
            if_index: element.if_index,
            node_intf_id: element.id
          };

          this.PortList.push(list);
        });
        var index_port = this.PortList.findIndex(
          list => list.if_index == data.if_index
        );
        this.editDialog = true;
        this.Discription = this.PortList[index_port].if_descr;
        this.cat_id = data.circuit_id;
        this.selectedIP = this.ip_addressList[index_ip];
        this.selectedPort = this.PortList[index_port];
        this.reloadData = true;
        this.project_name = data.project_name;
        this.service_name = data.service_name;
        this.speed = data.speed;
        this.disabledreload = false;
        this.disabledsave = false;
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
  deleteRowdata(data) {
    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete the selected" +
        " " +
        "CIRCUIT ID: " +
        data.circuit_id +
        " " +
        "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.CustomerReportservice.deleteRowdata(data).subscribe({
          next: result => {
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "CIRCUIT ID: " + data.circuit_id + " deleted",
              life: 3000
            });
            this.CustomerReportservice.dataGetreport(
              this.page,
              this.size
            ).subscribe(data => {
              this.datacustomlist = data.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            });
          },
          error: error => {
            if (error) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail:
                  "Can't deleted CIRCUIT ID: " +
                  data.circuit_id +
                  " ," +
                  error.error.detail +
                  "."
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
  onChangeip_address(event) {
    if (event.value != null) {
      this.clearipAdd = true;
      this.selectedPort = undefined;
      this.PortList = [];
      this.Discription = undefined;
      // this.cat_id = undefined;
      // this.project_name = undefined;
      // this.service_name = undefined;
      // this.speed = undefined;
      this.disabledsave = true;
      this.invalidip_address = "";
      this.invalidid = "";
      this.CustomerReportservice.getSysInterface(
        event.value.ip_address
      ).subscribe({
        next: result => {
          result.data.forEach(element => {
            var data = {
              Port: element.ifName,
              if_descr: element.if_descr,
              portlist: element.ifName + " | " + element.if_descr,
              if_index: element.if_index,
              node_intf_id: element.id
            };

            this.PortList.push(data);
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
      this.selectedPort = undefined;
      this.PortList = [];
      this.invalidid = "";
      this.cat_id = undefined;
      this.project_name = undefined;
      this.service_name = undefined;
      this.speed = undefined;
      this.disabledsave = true;
      this.clearipAdd = false;
    }
  }
  onChangeip_addressedit(event) {
    this.reloadData = false;
    if (event.value != null) {
      this.clearip = true;
      this.invalidip_address = "";
      this.selectedPort = undefined;
      this.PortList = [];
      this.Discription = undefined;
      // this.cat_id = undefined;
      // this.project_name = undefined;
      // this.service_name = undefined;
      // this.speed = undefined;
      // this.disabledsave = true;
      this.CustomerReportservice.getSysInterface(
        event.value.ip_address
      ).subscribe({
        next: result => {
          result.data.forEach(element => {
            var data = {
              Port: element.ifName,
              if_descr: element.if_descr,
              portlist: element.ifName + " | " + element.if_descr,
              if_index: element.if_index,
              node_intf_id: element.id
            };

            this.PortList.push(data);
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
      this.selectedPort = undefined;
      this.cat_id = undefined;
      this.project_name = undefined;
      this.service_name = undefined;
      this.speed = undefined;
      this.disabledsave = true;
      this.PortList = [];
      this.clearip = false;
    }
  }
  onChangePort(event) {
    this.invalidPort = "";
    this.clearportAdd = true;
    if (event.value != null) {
      this.Discription = event.value.if_descr;
    }

    // this.cat_id = undefined;
    // this.project_name = undefined;
    // this.service_name = undefined;
    // this.speed = undefined;
    // this.disabledsave = true;
    if (
      this.selectedIP != undefined &&
      this.selectedIP != "" &&
      this.selectedIP != null &&
      this.cat_id != "" &&
      this.cat_id != undefined
    ) {
      this.disabledreload = false;
    }
  }

  onChangePortedit(event) {
    this.invalidPort = "";
    this.reloadData = false;
    this.clearport = true;
    if (event.value != null) {
      this.Discription = event.value.if_descr;
    }
    // this.cat_id = undefined;
    // this.project_name = undefined;
    // this.service_name = undefined;
    // this.speed = undefined;
    // this.disabledsave = true;
    if (
      this.selectedIP != undefined &&
      this.selectedIP != "" &&
      this.selectedIP != null &&
      this.cat_id != "" &&
      this.cat_id != undefined
    ) {
      this.disabledreload = false;
    }
  }
  onClearIP() {
    this.selectedIP = [];
    this.selectedPort = [];
    this.clearip = false;
    this.clearport = false;
    this.clearportAdd = false;
    this.Discription = undefined;
    this.disabledreload = true;
    this.disabledsave = true;
    this.cat_id = undefined;
    this.project_name = undefined;
    this.service_name = undefined;
  }
  onClearport() {
    this.clearport = false;
    this.clearportAdd = false;
    this.selectedPort = [];
    this.Discription = undefined;
    this.disabledreload = true;
    this.disabledsave = true;
    this.cat_id = undefined;
    this.project_name = undefined;
    this.service_name = undefined;
    this.speed = undefined;
  }
  Searchdata() {
    this.project_name = undefined;
    this.service_name = undefined;
    this.speed = undefined;
    if (this.cat_id != undefined) {
      this.CustomerReportservice.get_history(this.cat_id).subscribe({
        next: data => {
          this.reloadData = true;
          this.catid_add = data.circuit_id;
          this.project_name = data.project_name;
          this.service_name = data.service;
          this.speed = data.speed;
          // this.disabledsave = false;
        },
        error: error => {
          if (error) {
            this.disabledsave = true;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Data is Empty"
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
    } else {
      this.invalidid = "ng-invalid ng-dirty";
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill data."
      });
    }
  }
  Savedata() {
    if (
      this.cat_id != "" &&
      this.cat_id != undefined &&
      this.selectedIP != undefined &&
      this.selectedIP != "" &&
      this.selectedIP != null &&
      this.selectedPort != "" &&
      this.selectedPort != undefined &&
      this.selectedPort != null &&
      this.project_name != "" &&
      this.project_name != undefined &&
      this.service_name != "" &&
      this.service_name != undefined &&
      this.speed != undefined &&
      this.speed != "" &&
      this.Discription != undefined &&
      this.Discription != ""
    ) {
      let userdata = jwt_decode(localStorage.getItem("token"));
      var listData = {
        circuit_id: this.cat_id,
        project_name: this.project_name,
        service_name: this.service_name,
        if_description: this.Discription,
        speed: this.speed,
        node_intf_id: this.selectedPort.node_intf_id,
        ip_address: this.selectedIP.ip_address,
        if_index: this.selectedPort.if_index,
        if_name: this.selectedPort.Port,
        created_by: userdata["username"]
      };
      this.CustomerReportservice.createreportData(listData).subscribe({
        next: result => {
          this.hideDialog();
          this.CustomerReportservice.dataGetreport(
            this.page,
            this.size
          ).subscribe(data => {
            this.datacustomlist = data.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          });
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Customer Report Created",
            life: 3000
          });
        },
        error: error => {
          if (error) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.detail
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill data."
      });
      if (this.cat_id == "" || this.cat_id == undefined) {
        this.invalidid = "ng-invalid ng-dirty";
      }
      if (
        this.selectedIP == undefined ||
        this.selectedIP == "" ||
        this.selectedIP == null
      ) {
        this.invalidip_address = "ng-invalid ng-dirty";
      }
      if (
        this.selectedPort == "" ||
        this.selectedPort == undefined ||
        this.selectedPort == null
      ) {
        this.invalidPort = "ng-invalid ng-dirty";
      }
      if (this.project_name == "" || this.project_name == undefined) {
        this.invalidproject_name = "ng-invalid ng-dirty";
      }
      if (this.service_name == "" || this.service_name == undefined) {
        this.invalidservice_name = "ng-invalid ng-dirty";
      }
      if (this.speed == undefined || this.speed == "") {
        this.invalidspeed = "ng-invalid ng-dirty";
      }
      if (this.Discription == undefined && this.Discription == "") {
        this.invalidDiscription = "ng-invalid ng-dirty";
      }
    }
  }
  Editdata() {
    if (
      this.cat_id != "" &&
      this.cat_id != undefined &&
      this.selectedIP != undefined &&
      this.selectedIP != "" &&
      this.selectedIP != null &&
      this.selectedPort != "" &&
      this.selectedPort != undefined &&
      this.selectedPort != null &&
      this.project_name != "" &&
      this.project_name != undefined &&
      this.service_name != "" &&
      this.service_name != undefined &&
      this.speed != undefined &&
      this.speed != "" &&
      this.Discription != undefined &&
      this.Discription != ""
    ) {
      let userdata = jwt_decode(localStorage.getItem("token"));

      var listData = {
        circuit_id: this.cat_id,
        project_name: this.project_name,
        service_name: this.service_name,
        if_description: this.Discription,
        speed: this.speed,
        node_intf_id: this.selectedPort.node_intf_id,
        ip_address: this.selectedIP.ip_address,
        if_index: this.selectedPort.if_index,
        if_name: this.selectedPort.Port,
        updated_by: userdata["username"]
      };
      this.CustomerReportservice.updatereportData(
        this.id_editRow,
        listData
      ).subscribe({
        next: result => {
          this.hideDialog();
          this.CustomerReportservice.dataGetreport(
            this.page,
            this.size
          ).subscribe(data => {
            this.datacustomlist = data.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          });
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Customer Report Update",
            life: 3000
          });
        },
        error: error => {
          if (error) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.detail
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill data."
      });
      if (this.cat_id == "" || this.cat_id == undefined) {
        this.invalidid = "ng-invalid ng-dirty";
      }
      if (
        this.selectedIP == undefined ||
        this.selectedIP == "" ||
        this.selectedIP == null
      ) {
        this.invalidip_address = "ng-invalid ng-dirty";
      }
      if (
        this.selectedPort == "" ||
        this.selectedPort == undefined ||
        this.selectedPort == null
      ) {
        this.invalidPort = "ng-invalid ng-dirty";
      }
      if (this.project_name == "" || this.project_name == undefined) {
        this.invalidproject_name = "ng-invalid ng-dirty";
      }
      if (this.service_name == "" || this.service_name == undefined) {
        this.invalidservice_name = "ng-invalid ng-dirty";
      }
      if (this.speed == undefined || this.speed == "") {
        this.invalidspeed = "ng-invalid ng-dirty";
      }
      if (this.Discription == undefined && this.Discription == "") {
        this.invalidDiscription = "ng-invalid ng-dirty";
      }
    }
  }
  hideDialog() {
    this.editDialog = false;
    this.addDialog = false;
    this.cat_id = undefined;
    this.invalidid = "";
    this.invalidip_address = "";
    this.invalidPort = "";
    this.invalidproject_name = "";
    this.invalidspeed = "";
    this.selectedPort = undefined;
    this.PortList = [];
    this.selectedIP = undefined;
    this.reloadData = false;
    this.disabledreload = true;
    this.disabledsave = true;
    this.Discription = undefined;
    this.service_name = undefined;
    this.project_name = undefined;
    this.speed = undefined;
  }
  exportPDF(data) {
    let userToken = localStorage.getItem("token");
    var date = new Date();
    var start = date.setDate(date.getDate() - 1);
    var end = new Date().getTime();
    const downloadLink: HTMLAnchorElement = document.createElement("a");
    const fileName = `test.pdf`;
    const url = `${environment.apiUrl}/customer_report/get_monthly_report?ref_code=${data.ref_code}&start=${start}&end=${end}`;
    const authToken = userToken;
    const headers = new Headers({
      Authorization: `Bearer ${authToken}`
    });

    fetch(url, {
      method: "GET",
      headers: headers
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch(error => {
        console.error("Error downloading PDF:", error);
      });
  }

  clear(table: Table) {
    table.clear();
  }
  onKeyUpcat_id(event) {
    if (this.catid_add != this.cat_id) {
      this.disabledsave = true;
      this.invalidid = "";
    } else {
      this.disabledsave = false;
    }
    // if (this.cat_id != this.catid_edit){
    //   this.disabledsave = true;
    // }
    // if (event == this.cat_id){
    //   this.disabledreload = false;
    //   this.disabledsave = false;
    // }
  }
  onKeyUpcat_idEdit(event) {
    if (this.cat_id != this.catid_edit) {
      this.disabledsave = true;
    } else {
      this.disabledsave = false;
    }
    // if (event == this.cat_id){
    //   this.disabledreload = false;
    //   this.disabledsave = false;
    // }
  }
  openNew() {
    this.addDialog = true;
    this.dialogHeader = "Add CIRCUIT ID Information";
  }
  menuVlue(data) {
    this.CustomerReportservice.valueSource(data);
  }
  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `task-manage${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.datacustomlist
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
}
