import { style } from "@angular/animations";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceService } from "@app/device.service";
import { NavigateService } from "@app/navigateservice";
import { ThroughputService } from "@app/throughput.service";
import * as Highcharts from "highcharts";
import HC_stock from "highcharts/modules/stock";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import { ThroughputsService } from "@app/pages/throughput/throughput.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ThemeService } from "app/theme.service";
import { AdminLayoutService } from '@app/layouts/admin-layout/admin-layout.service';
import * as xlsx from "xlsx";
export interface Device {
  IRCNETypeID?: string;
  symbol_id?: number;
  symbol_name1?: string;
  symbol_name3?: string;
  res_id?: string;
}
// export interface Devices {
//   symbol_id?: number,
//   symbol_name1?: string,
//   symbol_name3?: string,
//   res_id?: string
//   iRCNETypeID1?:string,
//   MACADDRESS?:string,
//   REMARK?:string,

// }
@Component({
  selector: "app-device-search",
  templateUrl: "device-search.component.html",
  styleUrls: ["device-search.component.css"],
  styles: [
    `
      th {
        width: 25%;
      }
    `
  ]
})
export class DeviceSearchComponent implements OnInit {
  device_throughput = ["ISCOM-RAX711", "ISCOM-RAX711B", "RAX711-C"];
  deviceList: Device[] = [];
  deviceL: Device = {};
  selectedDevice: Device = {};
  device: Device;
  device_name: string;
  searchInput: string;
  activate: boolean = false;
  activates: boolean = false;
  getConfigDialog: boolean = false;
  username: string;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  password: string;
  gfg: MenuItem[];
  items: MenuItem[];
  item: MenuItem[];
  device_resid: string;
  device_symbol_name3: string;
  submitted: boolean;
  iconsave: string;
  IRCNETypeID: string;
  device_ips: string;
  loading: boolean = true;
  loading_table: boolean = false;
  itemsAction: MenuItem[];
  constructor(
    public themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router,
    private ThroughputsService: ThroughputsService,
    private messageService: MessageService,
    private deviceService: DeviceService,
    private titleService: Title,
    private navigator: NavigateService,
    private throughputService: ThroughputService,
    private AdminLayoutService: AdminLayoutService
  ) {
    this.searchInput = this.route.snapshot.queryParams["search"];
    this.titleService.setTitle("SED-Device List");
    this.searchInput = this.route.snapshot.queryParams["is_completed_setup"];
    this.titleService.setTitle("SED-Device List");
  }

  ngOnInit(): void {
    this.themeService.currentpage("/devicelist");
    this.route.queryParams.subscribe(params => {
      if ("search" in params) {
        this.loading_table = false;
        this.deviceService.getSearchDevice(params["search"]).subscribe({
          next: result => {
            this.loading = false;
            this.loading_table = true;
            this.deviceList = result;
          },
          error: error => {
            if (error.status == 401) {
              this.loading = false;
              this.loading_table = true;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Session expired, please logout and login again."
              });
            }
          }
        });
      } else if ("is_completed_setup" in params) {
        this.loading_table = false;
        this.deviceService
          .getSearchbackupDevice(params["is_completed_setup"])
          .subscribe({
            next: result => {
              this.loading = false;
              this.loading_table = true;
              this.deviceList = result;
            },
            error: error => {
              if (error.status == 401) {
                this.loading = false;
                this.loading_table = true;
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Session expired, please logout and login again."
                });
              }
            }
          });
      } else if ("is_backed_up" in params) {
        this.loading_table = false;
        this.deviceService
          .getSearchbackupsDevice(params["is_backed_up"])
          .subscribe({
            next: result => {
              this.loading = false;
              this.loading_table = true;
              this.deviceList = result;
            },
            error: error => {
              if (error.status == 401) {
                this.loading = false;
                this.loading_table = true;
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

    this.deviceService.currentMessage.subscribe(device => {
      if (device != undefined){
        this.itemsAction = [{
          label: 'device',
          items: [
                  {
                    label: "View device",
                    icon: "pi pi-search",
                    command: event => {
                      this.viewDevice(device);
                      this.AdminLayoutService.addOrderBox("/device")
                    }
                  },
                  {
                    label: "Get config",
                    icon: "pi pi-cog",
                    command: event => {
                      this.getConfig(device);
                    }
                  },
                  {
                    label: "Download",
                    icon: "pi pi-download",
                    command: event => {
                      this.downloadResult(device);
                    }
                  }
                ]}
      ];
      }
     
    })
  }
  menuVlue(task){
    this.deviceService.valueSource(task);
  }
  actionItem(device: Device) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "View device",
            icon: "pi pi-search",
            command: event => {
              this.viewDevice(device);
            }
          },
          {
            label: "Get config",
            icon: "pi pi-cog",
            command: event => {
              this.getConfig(device);
            }
          },
          {
            label: "Download",
            icon: "pi pi-download",
            command: event => {
              this.downloadResult(device);
            }
          }
        ]
      }
    ];
  }

  selectDevice(device: Device) {
    this.selectedDevice = device;
  }
  Setthroughput(device: Device) {
    this.deviceL = device;
    this.device_symbol_name3 = this.deviceL.symbol_name3;
    this.IRCNETypeID = this.deviceL.IRCNETypeID;
    // console.log(this.device_symbol_name3)
    this.ThroughputsService.setLocalDevice(
      this.device_symbol_name3,
      this.IRCNETypeID
    );
    this.router.navigate(["/throughput"]);
    this.themeService.currentpage("/throughput");
  }
  viewDevice(deviceSymbolID: Device) {
    this.deviceL = deviceSymbolID;
    this.device_resid = this.deviceL.res_id;
    this.device_ips = this.deviceL.symbol_name3;
    this.router.navigate(["/device"], {
      queryParams: {
        ID: this.device_resid,
        IRCNETypeID: this.deviceL.IRCNETypeID,
        IPadress:this.deviceL.symbol_name3
      }
    });
    this.themeService.currentpage("/device");
    this.AdminLayoutService.addOrderBox("/device")
    // console.log(this.device_ips)
  }

  getConfig(device: Device) {
    this.deviceL = device;
    this.device_symbol_name3 = this.deviceL.symbol_name3;
    this.username = "raisecom";
    this.password = "raisecom";
    this.getConfigDialog = true;
    this.iconsave = "pi pi-check";
  }
  downloadResult(device: Device) {
    this.deviceL = device;
    this.device_name = this.deviceL.symbol_name1;
    this.device_symbol_name3 = this.deviceL.symbol_name3;
    this.deviceService
      .downloadReport(this.device_symbol_name3, this.device_name)
      .subscribe({
        next: blob => {
          const a = document.createElement("a");
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = "Report_" + this.device_name + ".txt";
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: error => {
          this.messageService.add({
            severity: "warn",
            summary: "Warning",
            detail: "No startup-config file"
          });
        }
      });
  }
  saveConfig() {
    this.submitted = true;
    this.iconsave = "pi pi-spin pi-spinner";
    this.deviceService
      .getconfigDevice(this.username, this.password, this.device_symbol_name3)
      .subscribe({
        next: results => {
          var output = [];
          this.deviceL = results;
          this.getConfigDialog = false;
          this.iconsave = "pi pi-check";
          window.location.reload();
        },
        error: error => {
          if (error.status == 400) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.detail
            });
            this.iconsave = "pi pi-check";
          }
        }
      });
  }
  hideDialog() {
    this.getConfigDialog = false;
  }
  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `device-list${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.deviceList);
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
