import { Component, OnInit } from "@angular/core";
import * as xlsx from "xlsx";
import jwt_decode from "jwt-decode";
import { CustomerReportservice } from "@app/pages/customer-report/customer-report.service";
import { BrowserModule, Title } from "@angular/platform-browser";
import { ThemeService } from "app/theme.service";
import { Table } from "primeng/table";
import { MenuItem } from "primeng/api";
import { environment } from "environments/environment";
import { MessageService, ConfirmationService } from "primeng/api";
import { LazyLoadEvent } from "primeng/api";
@Component({
  selector: "app-device-availability",
  templateUrl: "./device-availability.component.html",
  styleUrls: ["./device-availability.component.scss"]
})
export class DeviceAvailabilityComponent implements OnInit {
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
  datePicker_selected: any;
  minDateValue: any;
  maxDateValue: any;
  datePickerS: any;
  datePicker: any;
  datelastPicker: any;
  invalid_month: string;
  isActive: boolean = false;
  selecteddata: any[];
  disabledexportPDF: boolean = true;
  readDialog: boolean;
  Resultview: any = {};
  filenameselect: any;
  rangeDates: Date[];
  startDate: any;
  endDate: any;
  page: any;

  total_records: any;
  loading: boolean;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  size: any = 10;
  setPageSizeOption: any;
  datemonth:Date;
  constructor(
    private CustomerReportservice: CustomerReportservice,
    private titleService: Title,
    public themeService: ThemeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.titleService.setTitle("SED-Device Avilability Summary");
  }
  getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1);
  }
  ngOnInit(): void {
    let today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    
    // Determine AM/PM
    let ampm = hours >= 12 ? "PM" : "AM";
    
    // Get first day of the current month
    let firstDayOfMonth = new Date(year, month - 1, 1);
    
    // Set startDate in the format: "yyyy-MM-01 00:00:00"
    this.startDate = `${year}-${month.toString().padStart(2, '0')}-01 00:00:00`;
    let lastDayOfMonth = new Date(year, month, 0).getDate();
    this.maxDateValue = new Date(year, month - 1, lastDayOfMonth);
    // Calculate endDate as the last day of the current month
    let endDate = new Date(year, month, 0); // Day 0 of next month gives the last day of the current month
    endDate.setHours(23, 59, 59, 999);
    this.endDate = endDate.toISOString().split("T")[0] + " " + endDate.toTimeString().split(" ")[0];
    
    // Set rangeDates as an array with start and end dates
    this.rangeDates = [firstDayOfMonth, endDate];
    
    // Set datemonth to firstDayOfMonth
    this.datemonth = firstDayOfMonth;
    this.CustomerReportservice.getNode().subscribe(data => {
      if (data.detail.data !== null) {
        // const sortedArray = data.detail.data
        //   .filter(item => item !== null)
        //   .sort((a, b) => b.update_time.localeCompare(a.update_time));
        this.datacustomlist = data.detail.data;
        // Do something with sortedAndFilteredArray
      }
    });

    this.CustomerReportservice.currentMessage.subscribe(custom => {
      if (custom != undefined) {
        this.itemsAction = [
          {
            label: "custom",
            items: [
              {
                label: "History",
                icon: "pi pi-fw pi-search",
                disabled: true,
                command: event => {
                  this.HistoryRowdata(custom);
                }
              }
              // {
              //   label: "Delete",
              //   icon: "pi pi-fw pi-trash",
              //   command: event => {
              //     this.deleteRowdata(custom);
              //   }
              // },
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
  }

  onChangeCalendarMuliti(event) {
    const inputDate = new Date(this.datemonth);
    inputDate.setDate(inputDate.getDate() + 1);
  
    // Set startDate to the day after this.datemonth
    this.startDate = inputDate.toISOString().split("T")[0] + " " + inputDate.toTimeString().split(" ")[0];
  
    // Set endDate to the last day of this.datemonth
    let endDate = new Date(this.datemonth.getFullYear(), this.datemonth.getMonth() + 1, 0); // Setting day to 0 gives the last day of the current month
    endDate.setHours(23, 59, 59, 999);
  
    this.endDate = endDate.toISOString().split("T")[0] + " " + endDate.toTimeString().split(" ")[0];
  }
  onYearChangeCalendarMuliti(event) {
    const newYear = event.year;
    const currentMonth = this.datemonth.getMonth(); // Get current month of datemonth
    this.datemonth = new Date(newYear, currentMonth, 1);
    const inputDate = new Date(this.datemonth);
    inputDate.setDate(inputDate.getDate() + 1);
  
    // Set startDate to the day after this.datemonth
    this.startDate = inputDate.toISOString().split("T")[0] + " " + inputDate.toTimeString().split(" ")[0];
  
    // Set endDate to the last day of this.datemonth
    let endDate = new Date(this.datemonth.getFullYear(), this.datemonth.getMonth() + 1, 0); // Setting day to 0 gives the last day of the current month
    endDate.setHours(23, 59, 59, 999);
  
    this.endDate = endDate.toISOString().split("T")[0] + " " + endDate.toTimeString().split(" ")[0];
  }

  onChangeCalendarMonth(event) {
    this.disabledexportPDF = false;
    var d = new Date(Date.parse(event)),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }
    var datePicker = [year, month, day].join("-") + " 00:00:00";
    this.filenameselect = [month, day].join("");
    this.datePicker = new Date(datePicker).getTime();
    const currentDate = new Date(this.datePicker);
    const lastDateOfMonth = this.getLastDateOfMonth(currentDate);
    var dlast = new Date(Date.parse(event)),
      monthlast = "" + (dlast.getMonth() + 2),
      daylast = "" + dlast.getDate(),
      yearlast = dlast.getFullYear();
    if (monthlast.length < 2) {
      monthlast = "0" + monthlast;
    }
    if (daylast.length < 2) {
      daylast = "0" + daylast;
    }
    if (monthlast == "13") {
      monthlast = "01";
      yearlast = dlast.getFullYear() + 1;
    }
    var datelastPicker = [yearlast, monthlast, daylast].join("-") + " 00:00:00";
    this.datelastPicker = new Date(datelastPicker).getTime();
    this.invalid_month = "";
    this.isActive = true;
  }
  HistoryRowdata(data) {
    // this.CustomerReportservice.get_history(data.circuit_id).subscribe(data => {
    //   this.readDialog = true;
    //   this.dialogHeader = "View Daily Summary";
    //   this.Resultview = data;
    // })
  }
  getLastDateOfMonth(date: Date): Date {
    // Get the next month
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);

    // Set the day to 0, which gives the last day of the current month
    nextMonth.setDate(0);

    return nextMonth;
  }
  editRowdata(data) {
    this.clearip = true;
    this.clearport = true;
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
            this.CustomerReportservice.getNode().subscribe(data => {
              if (data.detail.data !== null) {
                // const sortedArray = data.detail.data
                //   .filter(item => item !== null)
                //   .sort((a, b) => b.update_time.localeCompare(a.update_time));
                this.datacustomlist = data.detail.data;
                // Do something with sortedAndFilteredArray
              }
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
      this.invalidip_address = "";
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
      this.clearipAdd = false;
    }
  }
  onChangeip_addressedit(event) {
    this.reloadData = false;
    if (event.value != null) {
      this.clearip = true;
      this.invalidip_address = "";
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
      this.clearip = false;
    }
  }
  onChangePort(event) {
    this.invalidPort = "";
    this.clearportAdd = true;
    this.Discription = event.value.if_descr;
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
    this.Discription = event.value.if_descr;
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
  }
  onClearport() {
    this.clearport = false;
    this.clearportAdd = false;
    this.selectedPort = [];
    this.Discription = undefined;
    this.disabledreload = true;
    this.disabledsave = true;
  }
  Searchdata() {
    this.CustomerReportservice.getdataReload(this.cat_id).subscribe(data => {
      if (data.length != 0) {
        this.reloadData = true;
        data.forEach(value => {
          this.project_name = value.project_name;
          this.service_name = value.service;
          this.speed = value.speed;
          this.disabledsave = false;
        });
      } else {
        this.reloadData = false;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Data is Empty."
        });
      }
    });
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
          this.CustomerReportservice.getNode().subscribe(data => {
            if (data.detail.data !== null) {
              // const sortedArray = data.detail.data
              //   .filter(item => item !== null)
              //   .sort((a, b) => b.update_time.localeCompare(a.update_time));
              this.datacustomlist = data.detail.data;
              // Do something with sortedAndFilteredArray
            }
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
          this.CustomerReportservice.getNode().subscribe(data => {
            if (data.detail.data !== null) {
              // const sortedArray = data.detail.data
              //   .filter(item => item !== null)
              //   .sort((a, b) => b.update_time.localeCompare(a.update_time));
              this.datacustomlist = data.detail.data;
              // Do something with sortedAndFilteredArray
            }
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
  exportingPDF: boolean = false;
  exportState: { [key: string]: boolean } = {};
  exportPDF() {
    this.exportingPDF = true;
    var dfirst = new Date(this.startDate),
      monthfirst = "" + (dfirst.getMonth() + 1),
      dayfirst = "" + dfirst.getDate(),
      yearfirst = dfirst.getFullYear();
    if (monthfirst.length < 2) {
      monthfirst = "0" + monthfirst;
    }
    if (dayfirst.length < 2) {
      dayfirst = "0" + dayfirst;
    }
    if (monthlast == "13") {
      monthlast = "01";
      yearlast = dlast.getFullYear() + 1;
    }

    var datefirstPickergetTime = new Date(this.startDate).getTime();
    var datefirstunixTimestampInSeconds = Math.floor(
      datefirstPickergetTime / 1000
    );
    this.filenameselect = [yearfirst, monthfirst].join("");
    var dlast = new Date(this.endDate),
      monthlast = "" + (dlast.getMonth() + 2),
      daylast = "" + dlast.getDate(),
      yearlast = dlast.getFullYear();
    if (monthlast.length < 2) {
      monthlast = "0" + monthlast;
    }
    if (daylast.length < 2) {
      daylast = "0" + daylast;
    }

    var datelastPickers = new Date(this.endDate).getTime();
    var datelastPickersunixTimestampInSeconds = Math.floor(
      datelastPickers / 1000
    );
    if (this.selecteddata.length != 0) {
      this.selecteddata.forEach(selectedItem => {
        // Assuming each row has a unique identifier, replace 'id' with the actual property name
        const rowKey = selectedItem.id; // Replace 'id' with the actual property name
        this.exportState[rowKey] = true;

        // Rest of your existing code for exporting PDF
      });
      for (let i = 0; i < this.selecteddata.length; i++) {
        let userToken = localStorage.getItem("token");
        var dlast = new Date(),
          monthlast = "" + (dlast.getMonth() + 1),
          daylast = "" + dlast.getDate(),
          yearlast = dlast.getFullYear();
        var createAt = [yearlast, monthlast, daylast].join("");
        const downloadLink: HTMLAnchorElement = document.createElement("a");
        const fileName = `${this.selecteddata[i].device_name}_nml_${this.filenameselect}_${createAt}.pdf`;
        // const url = `${environment.apiUrl}/customer_report/get_monthly_report?report_name=dailytraffic&ref_code=${this.selecteddata[i].ref_code}&start=${datefirstPickergetTime}&end=${datelastPickers}&file_type=pdf`;
        const url = `https://edims.cathosting.in.th/report_service/report/device_report?report_name=networkmonthly&ref_code=&start=${datefirstunixTimestampInSeconds}&end=${datelastPickersunixTimestampInSeconds}&file_type=pdf&user_create=test&ip_switch=${this.selecteddata[i].ip_address}&step=5m`;

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
              throw new Error(`${response.statusText}`);
            }
            return response.blob();
          })
          .then(blob => {
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            const rowKey = this.selecteddata[i].id; // Assuming 'id' is a unique identifier, replace it with the actual property name
            this.exportState[rowKey] = false;
          })
          .catch(error => {
            console.error("Error downloading PDF:", error);
            const rowKey = this.selecteddata[i].id; // Assuming 'id' is a unique identifier, replace it with the actual property name
            this.exportState[rowKey] = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error
            });
          });
      }
    }
  }

  clear(table: Table) {
    table.clear();
  }

  onKeyUpcat_id(event) {
    if (
      this.selectedIP != undefined &&
      this.selectedIP != "" &&
      this.selectedIP != null &&
      this.selectedPort != "" &&
      this.selectedPort != undefined &&
      this.selectedPort != null &&
      event != "" &&
      event != undefined
    ) {
      this.disabledreload = false;
    }
    if (event == "" || event == undefined) {
      this.disabledreload = true;
      this.disabledsave = true;
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
    this.exportingPDF = true;
    var dfirst = new Date(this.startDate),
      monthfirst = "" + (dfirst.getMonth() + 1),
      dayfirst = "" + dfirst.getDate(),
      yearfirst = dfirst.getFullYear();
    if (monthfirst.length < 2) {
      monthfirst = "0" + monthfirst;
    }
    if (dayfirst.length < 2) {
      dayfirst = "0" + dayfirst;
    }
    if (monthlast == "13") {
      monthlast = "01";
      yearlast = dlast.getFullYear() + 1;
    }

    var datefirstPickergetTime = new Date(this.startDate).getTime();
    var datefirstunixTimestampInSeconds = Math.floor(
      datefirstPickergetTime / 1000
    );
    this.filenameselect = [yearfirst, monthfirst].join("");
    var dlast = new Date(this.endDate),
      monthlast = "" + (dlast.getMonth() + 2),
      daylast = "" + dlast.getDate(),
      yearlast = dlast.getFullYear();
    if (monthlast.length < 2) {
      monthlast = "0" + monthlast;
    }
    if (daylast.length < 2) {
      daylast = "0" + daylast;
    }

    var datelastPickers = new Date(this.endDate).getTime();
    var datelastPickersunixTimestampInSeconds = Math.floor(
      datelastPickers / 1000
    );
    if (this.selecteddata.length != 0) {
      this.selecteddata.forEach(selectedItem => {
        // Assuming each row has a unique identifier, replace 'id' with the actual property name
        const rowKey = selectedItem.id; // Replace 'id' with the actual property name
        this.exportState[rowKey] = true;

        // Rest of your existing code for exporting PDF
      });
      for (let i = 0; i < this.selecteddata.length; i++) {
        let userToken = localStorage.getItem("token");
        var dlast = new Date(),
          monthlast = "" + (dlast.getMonth() + 1),
          daylast = "" + dlast.getDate(),
          yearlast = dlast.getFullYear();
        var createAt = [yearlast, monthlast, daylast].join("");
        const downloadLink: HTMLAnchorElement = document.createElement("a");
        const fileName = `${this.selecteddata[i].device_name}_nml_${this.filenameselect}_${createAt}.xlsx`;
        // const url = `${environment.apiUrl}/customer_report/get_monthly_report?report_name=dailytraffic&ref_code=${this.selecteddata[i].ref_code}&start=${datefirstPickergetTime}&end=${datelastPickers}&file_type=pdf`;
        const url = `https://edims.cathosting.in.th/report_service/report/device_report?report_name=networkmonthly&ref_code=&start=${datefirstunixTimestampInSeconds}&end=${datelastPickersunixTimestampInSeconds}&file_type=xlsx&user_create=test&ip_switch=${this.selecteddata[i].ip_address}&step=5m`;

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
              throw new Error(`${response.statusText}`);
            }
            return response.blob();
          })
          .then(blob => {
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            const rowKey = this.selecteddata[i].id; // Assuming 'id' is a unique identifier, replace it with the actual property name
            this.exportState[rowKey] = false;
          })
          .catch(error => {
            console.error("Error downloading PDF:", error);
            const rowKey = this.selecteddata[i].id; // Assuming 'id' is a unique identifier, replace it with the actual property name
            this.exportState[rowKey] = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error
            });
          });
      }
    }
  }
  exportToword() {
    this.exportingPDF = true;
    var dfirst = new Date(this.startDate),
      monthfirst = "" + (dfirst.getMonth() + 1),
      dayfirst = "" + dfirst.getDate(),
      yearfirst = dfirst.getFullYear();
    if (monthfirst.length < 2) {
      monthfirst = "0" + monthfirst;
    }
    if (dayfirst.length < 2) {
      dayfirst = "0" + dayfirst;
    }
    if (monthlast == "13") {
      monthlast = "01";
      yearlast = dlast.getFullYear() + 1;
    }

    var datefirstPickergetTime = new Date(this.startDate).getTime();
    var datefirstunixTimestampInSeconds = Math.floor(
      datefirstPickergetTime / 1000
    );
    this.filenameselect = [yearfirst, monthfirst].join("");
    var dlast = new Date(this.endDate),
      monthlast = "" + (dlast.getMonth() + 2),
      daylast = "" + dlast.getDate(),
      yearlast = dlast.getFullYear();
    if (monthlast.length < 2) {
      monthlast = "0" + monthlast;
    }
    if (daylast.length < 2) {
      daylast = "0" + daylast;
    }

    var datelastPickers = new Date(this.endDate).getTime();
    var datelastPickersunixTimestampInSeconds = Math.floor(
      datelastPickers / 1000
    );
    if (this.selecteddata.length != 0) {
      this.selecteddata.forEach(selectedItem => {
        // Assuming each row has a unique identifier, replace 'id' with the actual property name
        const rowKey = selectedItem.id; // Replace 'id' with the actual property name
        this.exportState[rowKey] = true;

        // Rest of your existing code for exporting PDF
      });
      for (let i = 0; i < this.selecteddata.length; i++) {
        let userToken = localStorage.getItem("token");
        var dlast = new Date(),
          monthlast = "" + (dlast.getMonth() + 1),
          daylast = "" + dlast.getDate(),
          yearlast = dlast.getFullYear();
        var createAt = [yearlast, monthlast, daylast].join("");
        const downloadLink: HTMLAnchorElement = document.createElement("a");
        const fileName = `${this.selecteddata[i].device_name}_nml_${this.filenameselect}_${createAt}.docx`;
        // const url = `${environment.apiUrl}/customer_report/get_monthly_report?report_name=dailytraffic&ref_code=${this.selecteddata[i].ref_code}&start=${datefirstPickergetTime}&end=${datelastPickers}&file_type=pdf`;
        const url = `https://edims.cathosting.in.th/report_service/report/device_report?report_name=networkmonthly&ref_code=&start=${datefirstunixTimestampInSeconds}&end=${datelastPickersunixTimestampInSeconds}&file_type=docx&user_create=test&ip_switch=${this.selecteddata[i].ip_address}&step=5m`;

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
              throw new Error(`${response.statusText}`);
            }
            return response.blob();
          })
          .then(blob => {
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            const rowKey = this.selecteddata[i].id; // Assuming 'id' is a unique identifier, replace it with the actual property name
            this.exportState[rowKey] = false;
          })
          .catch(error => {
            console.error("Error downloading PDF:", error);
            const rowKey = this.selecteddata[i].id; // Assuming 'id' is a unique identifier, replace it with the actual property name
            this.exportState[rowKey] = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error
            });
          });
      }
    }
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
