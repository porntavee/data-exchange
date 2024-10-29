import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ManagedeviceauthenService } from "@app/pages/managedeviceauthen/managedeviceauthen.service";
import { MessageService, ConfirmationService } from "primeng/api";
import * as moment from "moment";
import { ThemeService } from "app/theme.service";
import { MenuItem } from "primeng/api";
import * as xlsx from "xlsx";
interface Brand {
  name: string;
}

interface DeviceProfileName {
  deviceName: string;
}

@Component({
  selector: "app-managedeviceprofile",
  templateUrl: "./managedeviceprofile.component.html",
  styleUrls: ["./managedeviceprofile.component.scss"],
  styles: [
    `
      :host ::ng-deep .p-password input {
        width: 15rem;
      }
    `
  ]
})
export class ManagedeviceprofileComponent implements OnInit {
  data: any[];
  dataprofile: any[];
  datanode: any[];
  products: any;
  displayUpdateAll: boolean = false;
  displayEdit: boolean = false;
  brands: Brand[];
  selected_brand: Brand;
  devices: DeviceProfileName[];
  selected_device: DeviceProfileName;
  displayEditprofile: boolean = false;
  displayAddprofile: boolean = false;
  //DeviceProfile
  displayAddDeviceProfile: boolean = false;
  profileid: any;
  profilelist: any;
  displayUpdateDeviceProfile: boolean = false;
  invalidPassword: string = "";
  invalid: string = "";
  submitted: boolean = false;
  profileidAdd: any = {};
  passwordPattern =
    "^(?=.*[A-Z])(?=.*[!@#$%^&*+_])(?=.*[0-9])(?=.*[a-z]).{8,}$";
  isValid: boolean = false;
  scrollHeight: string = "150px";
  device_profile_nameArr: any[] = [];
  device_profile_nameArrlist: any[] = [];
  device_profile_nameArrlistDesc: any[] = [];
  selectedDevice_profile: any;
  idprofileDialog: any;
  listBrand: any[] = [];
  listbrandchange: any;
  selecteddevice_profile: any;
  selectedlistBrand: any;
  messageduplicatename: any;
  checkduplicatename: boolean = false;
  invalidprofilename: any;
  itemsAction: MenuItem[];
  constructor(
    private titleService: Title,
    private ManagedeviceauthenService: ManagedeviceauthenService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private changeDetection: ChangeDetectorRef,
    public themeService: ThemeService
  ) {
    this.brands = [
      { name: "Brand 1" },
      { name: "Brand 2" },
      { name: "Brand 3" },
      { name: "Brand 4" },
      { name: "Brand 5" }
    ];

    this.devices = [
      { deviceName: "Device 1" },
      { deviceName: "Device 2" },
      { deviceName: "Device 3" },
      { deviceName: "Device 4" },
      { deviceName: "Device 5" }
    ];
  }

  ngOnInit(): void {
    this.titleService.setTitle("SED-Manage Device Authen");
    this.ManagedeviceauthenService.getProfile().subscribe({
      next: data => {
        this.dataprofile = data.detail.data;
        this.changeDetection.detectChanges();
        var device_profile_namelist_id = data.detail.data.map(function(
          singleElement
        ) {
          return singleElement.id;
        });
        var device_profile_namelist = data.detail.data.map(function(
          singleElement
        ) {
          return singleElement.device_profile_name;
        });
        var device_desclist = data.detail.data.map(function(singleElement) {
          return singleElement.description;
        });
        this.device_profile_nameArrlistDesc.push(...device_desclist);
        for (let i = 0; i < device_profile_namelist.length; i++) {
          var list_device_profile_nameun = [
            {
              id: device_profile_namelist_id[i],
              deviceName: device_profile_namelist[i],
              deviceDesc: this.device_profile_nameArrlistDesc[i]
            }
          ];
          this.device_profile_nameArrlist.push(...list_device_profile_nameun);
        }
        // console.log(this.device_profile_nameArrlist)
        // this.device_profile_nameArrlist.push(...list_device_profile_nameun)
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
    this.ManagedeviceauthenService.getNode().subscribe({
      next: data => {
        this.datanode = data.detail.data;
        this.changeDetection.detectChanges();
        var device_profile_name = data.detail.data.map(function(singleElement) {
          return singleElement.device_profile_name;
        });
        let findDuplicates = arr =>
          arr.filter((item, index) => arr.indexOf(item) == index);

        // All duplicates
        var list_device_profile_name = [
          ...new Set(findDuplicates(device_profile_name))
        ];
        var list_device_profile_nameun = list_device_profile_name.filter(
          data => data != null
        );
        this.device_profile_nameArr.push(...list_device_profile_nameun);
        // console.log(this.dataprofile)
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
    this.ManagedeviceauthenService.getBrand().subscribe({
      next: data => {
        this.listBrand = data.detail.data;
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
    this.ManagedeviceauthenService.currentMessageMenu.subscribe(rowData => {
      if (rowData != undefined) {
        this.itemsAction = [
          {
            label: "Managedeviceauthen",
            items: [
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                  this.showEditprofileDialog(rowData);
                }
              }
            ]
          }
        ];
      }
    });
  }
  menuVlue(task) {
    this.ManagedeviceauthenService.valueSourceMenu(task);
  }
  listvalueprofile(value) {
    this.selecteddevice_profile = value;
    this.selectedDevice_profile = value.id;
  }
  showUpdateDialog() {
    this.displayUpdateAll = true;
  }

  listBrandchange(value) {
    this.listbrandchange = value;
    this.selectedlistBrand = value;
  }
  showEditDialog(data) {
    this.displayEdit = true;
    this.idprofileDialog = data.id;
  }
  checkPassword() {
    // console.log("hi")
    if (this.profileid.password.match(this.passwordPattern)) {
      this.isValid = true;
      this.invalidPassword = "";
    } else {
      this.isValid = false;
      this.invalidPassword = "ng-invalid ng-dirty";
    }
  }
  checkPasswordADD() {
    // console.log("hi")
    if (this.profileidAdd.password.match(this.passwordPattern)) {
      this.isValid = true;
      this.invalidPassword = "";
    } else {
      this.isValid = false;
      this.invalidPassword = "ng-invalid ng-dirty";
    }
  }
  hideDialog() {
    this.isValid = false;
    this.invalidPassword = "";
    this.selecteddevice_profile = undefined;
    this.selectedlistBrand = undefined;
    this.checkduplicatename = false;
  }
  testLoginDialog() {
    this.ManagedeviceauthenService.TestLogin().subscribe({
      next: data => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: data.detail.message
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
  showEditprofileDialog(data) {
    this.invalidPassword = "";
    this.ManagedeviceauthenService.getProfileid(data.id).subscribe({
      next: data => {
        this.profileid = data.detail.data;
        this.displayEditprofile = true;
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
  savedisplayEditprofile() {
    var today = this.formatDate(new Date());
    this.profileid.update_time = today;
    // console.log(this.profileidAdd)
    this.submitted = true;
    if (
      this.profileid.device_profile_name != undefined &&
      this.profileid.description != undefined &&
      this.profileid.username != undefined &&
      this.profileid.password != undefined &&
      this.profileid.management_vlan != undefined
    ) {
      this.invalidPassword = "";
      this.invalid = "";
      this.invalidprofilename = "";
      this.ManagedeviceauthenService.editProfileid(
        this.profileid.id,
        this.profileid
      ).subscribe({
        next: data => {
          // console.log(data)
          this.displayEditprofile = false;
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: data.detail.message
          });
          this.changeDetection.detectChanges();
          this.ManagedeviceauthenService.getProfile().subscribe({
            next: data => {
              this.dataprofile = data.detail.data;
              this.changeDetection.detectChanges();
              // console.log(this.dataprofile)
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
        },
        error: error => {
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          } else if (error.status == "400") {
            // console.log(error.error.detail.message)
            this.invalidprofilename = "ng-invalid ng-dirty";
            this.messageduplicatename = error.error.detail.message;
            this.checkduplicatename = true;
          }
        }
      });
    } else {
      this.invalidPassword = "ng-invalid ng-dirty";
      this.invalid = "ng-invalid ng-dirty";
      this.invalidprofilename = "ng-invalid ng-dirty";
      this.messageService.add({
        severity: "error",
        summary: "Failed",
        detail: "Please, fill the required form input",
        life: 3000
      });
    }

    // console.log(JSON.stringify(this.profileid))
  }
  savedisplayAddprofile() {
    var today = this.formatDate(new Date());
    this.profileidAdd.update_time = today;
    // console.log(this.profileidAdd)
    this.submitted = true;
    if (
      this.profileidAdd.device_profile_name != undefined &&
      this.profileidAdd.description != undefined &&
      this.profileidAdd.username != undefined &&
      this.profileidAdd.password != undefined
    ) {
      this.invalid = "";
      this.invalidPassword = "";
      this.invalidprofilename = "";
      this.ManagedeviceauthenService.addProfileid(this.profileidAdd).subscribe({
        next: data => {
          // console.log(data)
          this.displayEditprofile = false;
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: data.detail.message
          });
          this.changeDetection.detectChanges();
          this.ManagedeviceauthenService.getProfile().subscribe({
            next: data => {
              this.dataprofile = data.detail.data;
              this.changeDetection.detectChanges();
              // console.log(this.dataprofile)
            },
            error: error => {
              if (error.status == 401) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Session expired, please logout and login again."
                });
              } else if (error.status == "400") {
                this.invalidprofilename = "ng-invalid ng-dirty";
                this.messageduplicatename = error.error.detail.message;
                this.checkduplicatename = true;
              }
            }
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
      this.invalid = "ng-invalid ng-dirty";
      this.invalidprofilename = "ng-invalid ng-dirty";
      this.invalidPassword = "ng-invalid ng-dirty";
      this.messageService.add({
        severity: "error",
        summary: "Failed",
        detail: "Please, fill the required form input",
        life: 3000
      });
    }

    // console.log(JSON.stringify(this.profileid))
  }
  // onSubmitlistdeviceprofile() {
  //   this.ManagedeviceauthenService.editNodeid(this.idprofileDialog,this.selectedDevice_profile).subscribe({
  //     next: data => {
  //       // console.log(data)
  //       this.displayEdit = false;
  //       this.messageService.add({
  //         severity: "success",
  //         summary: "Success",
  //         detail: data.detail.message
  //       });
  //       this.changeDetection.detectChanges();
  //       this.ManagedeviceauthenService.getNode().subscribe({
  //         next: data => {
  //           this.datanode = data.detail
  //           this.changeDetection.detectChanges();
  //           var device_profile_name = data.detail.map(function(singleElement) {
  //             return singleElement.device_profile_name;
  //           });
  //           let findDuplicates = arr =>
  //             arr.filter((item, index) => arr.indexOf(item) == index);

  //           // All duplicates
  //           var list_device_profile_name = [...new Set(findDuplicates(device_profile_name))];
  //           var list_device_profile_nameun = list_device_profile_name.filter(data => data != null)
  //           this.device_profile_nameArr.push(...list_device_profile_nameun)
  //           // console.log(this.dataprofile)

  //         },
  //         error: error => {
  //           if (error.status == 401) {
  //             this.messageService.add({
  //               severity: "error",
  //               summary: "Error",
  //               detail: "Session expired, please logout and login again."
  //             });
  //           }
  //         }
  //       });
  //     },
  //     error: error => {
  //       if (error.status == 401) {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: "Session expired, please logout and login again."
  //         });
  //       }
  //     }
  //   });
  // }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }
  padTo4Digits(num: number) {
    return num.toString().padStart(4, "0");
  }
  formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate())
      ].join("-") +
      "T" +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds())
      ].join(":") +
      "." +
      [this.padTo4Digits(date.getMilliseconds())]
    );
  }
  onEditProfile() {
    console.log("onEditProfile");
  }

  //DeviceProfileSection

  showUpdateProfileDialog() {
    this.displayUpdateDeviceProfile = true;
  }

  showAddProfileDiaglog() {
    this.displayAddprofile = true;
    this.isValid = false;
    this.invalidPassword = "";
    this.invalid = "";
    this.profileidAdd = {};
  }

  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `manage-device-profile${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.dataprofile
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
}
