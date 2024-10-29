import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ManagedeviceauthenService } from "@app/pages/managedeviceauthen/managedeviceauthen.service";
import { MessageService, ConfirmationService } from "primeng/api";
import { ThemeService } from "app/theme.service";
import * as moment from "moment";
import { MenuItem } from "primeng/api";
import * as xlsx from "xlsx";
interface Brand {
  name: string;
}

interface DeviceProfileName {
  deviceName: string;
}
@Component({
  selector: 'app-managedeviceother',
  templateUrl: './managedeviceother.component.html',
  styleUrls: ['./managedeviceother.component.scss']
})

export class ManagedeviceotherComponent implements OnInit {
  // products: Product[];

  data: any[];
  dataprofile: any[];
  datanode: any[];
  products: any;
  displayUpdateAll: boolean = false;
  displayAdddevice: boolean = false;
  selectedIPAddress:any;
  selectedModel:any;
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
  displayUpdateDeviceProfile: boolean = false;
  invalidPassword: string = "";
  invalid: string = "";
  submitted: boolean = false;
  profileidAdd: any = {};
  passwordPattern =
    "^(?=.*[A-Z])(?=.*[!@#$%^&*+_])(?=.*[0-9])(?=.*[a-z]).{8,}$";
  isValid: boolean = false;
  scrollHeight: string = "120px";
  device_profile_nameArr: any[] = [];
  device_profile_nameArrlist: any[] = [];
  device_profile_nameArrlistDesc: any[] = [];
  selectedDevice_profile: any;
  idprofileDialog: any;
  listBrand: any[] = [];
  listbrandchange: any;
  listVlan: any[] = [];
  listvlanchange: any;
  selecteddevice_profile: any;
  snmp_profile:any;
  selectedlistBrand: any;
  selectedlistVlan: any = "68";
  itemsAction: MenuItem[];
  displayView: boolean = false;
  viewDatanode:any = {};
  editDatanode:any = {};
  snmp_profile_name: any[] = [];
  displayEdit_edims_node: boolean = false;
  deviceName:any;
  selectedlistModel:any;
  listModel: any[] = [];
  invalidip: string = "";
  ip_addresslist:any;
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
    this.listModel = [
      {id:0 , name:"CISCO SG350",value:"SG350"},
      {id:1 , name:"CISCO ME3400",value:"ME3400"},
    ]
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
    this.ManagedeviceauthenService.getNodeother().subscribe({
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
        data.detail.data.forEach(element => {
          if (element != null){
           this.listBrand.push(element)
          } 
        });
        //   console.log(data.detail.data)
        //   this.listBrand = data.detail.data;
        // }
        
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
    this.ManagedeviceauthenService.getVlan().subscribe({
      next: data => {
        // console.log(data)
        var list = data.detail.data.filter(datalist => datalist != null);
        this.listVlan = list;
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
    this.ManagedeviceauthenService.currentMessage.subscribe(rowData => {
      if (rowData != undefined) {
        if (rowData.ref_table == "edims_node"){
        this.itemsAction = [
          {
            label: "Managedeviceauthen",
            items: [
              {
                label: "View",
                icon: "pi pi-fw pi-search",
                command: event => {
                  this.showviewDialog(rowData);
                }
              },
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                    this.showEditref_tableDialog(rowData); 
                }
              },
              {
                label: "Delete",
                icon: "pi pi-fw pi-trash",
                command: event => {
                  this.deleteNode(rowData);
                }
              }
            ]
          }
        ];
      } else {
        this.itemsAction = [
          {
            label: "Managedeviceauthen",
            items: [
              {
                label: "View",
                icon: "pi pi-fw pi-search",
                command: event => {
                  this.showviewDialog(rowData);
                }
              },
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                 
                  this.showEditDialog(rowData); 
                }
              }
            ]
          }
        ];
      }
      }
    });
    this.ManagedeviceauthenService.getdropdown_list().subscribe(data => {
      this.snmp_profile_name = data.detail.snmp_list
      // console.log(this.snmp_profile)
    })

  }
  menuVlue(task) {
    this.ManagedeviceauthenService.valueSource(task);
  }
  listvalueprofile(value) {
    this.selecteddevice_profile = value;
    this.selectedDevice_profile = value.id;
    this.editDatanode.device_profile_id = value.id;
  }
  showUpdateDialog() {
    this.displayUpdateAll = true;
  }
  onSubmitAll() {
    this.ManagedeviceauthenService.editAllNodeid(
      this.listbrandchange,
      this.selectedDevice_profile,
      this.selectedlistVlan
    ).subscribe({
      next: data => {
        // console.log(data)
        this.displayUpdateAll = false;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: data.detail.message
        });
        this.datanode = data.detail.data;
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
  onSubmitAdd() {

    if (this.listbrandchange != undefined && this.selectedIPAddress != undefined && this.selectedlistModel != undefined) {
      var filter = this.datanode.filter(data => data.ip_address == this.selectedIPAddress)
      if (filter.length == 0){
        this.invalidip = "";
    this.ManagedeviceauthenService.insertdevice(
      this.deviceName,
      this.selectedIPAddress,
      this.listbrandchange,
      this.selectedlistModel.value,
      this.selecteddevice_profile.id,
      this.snmp_profile.id
    ).subscribe({
      next: data => {
        // console.log(data)
        this.displayAdddevice = false;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: data.detail.message
        });
        // this.datanode = data.detail.data;
        this.ManagedeviceauthenService.getNodeother().subscribe({
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "IP Address is Duplicate, please enter new IP Address."
      });
      this.invalidip = "ng-invalid ng-dirty"
    }

  } 
  }
  listBrandchange(value) {
    this.listbrandchange = value;
    this.selectedlistBrand = value;
    this.editDatanode.brand = value;
  }
  listvlanchanges(value) {
    this.listvlanchange = value;
    this.selectedlistVlan = value;
  }
  showAddDialog() {
    this.displayAdddevice = true;
    // this.idprofileDialog = data.id;
  }
  showviewDialog(data) {
    this.displayView = true;
    this.viewDatanode = data;
  }

  showEditref_tableDialog(data){
    this.displayEdit_edims_node = true;
    this.editDatanode = data;
    this.deviceName = data.device_name;
    this.ip_addresslist = data.ip_address;
    var filter = this.listBrand.filter(device => device != null && device == data.brand)
    this.selectedlistBrand = filter[0]
    var filters = this.device_profile_nameArrlist.filter(device => device.deviceName == data.device_profile_name)
    var filtersnmp = this.snmp_profile_name.filter(datalist => datalist.id == data.snmp_profile_id)
    this.snmp_profile = filtersnmp[0];
    this.selecteddevice_profile = filters[0] 
  }
  showEditDialog(data) {
    
    this.displayEdit = true;
    this.idprofileDialog = data.id;
    var filter = this.device_profile_nameArrlist.filter(device => device.deviceName == data.device_profile_name)
    var filtersnmp = this.snmp_profile_name.filter(datalist => datalist.id == data.snmp_profile_id)
    this.snmp_profile = filtersnmp[0];
    this.selecteddevice_profile = filter[0]
    this.selectedlistVlan = data.management_vlan
   
  }
  listvalueSNMP(value){
    this.editDatanode.snmp_profile_id = value.id;
  }
  onSubmiteditnode(data){
    if (data.ip_address != this.ip_addresslist){
    var filter = this.datanode.filter(datas => datas.ip_address == data.ip_address)
    if (filter.length == 0){
      this.invalidip = "";
    this.editDatanode.device_name = this.deviceName;
    this.editDatanode.ip_address = this.ip_addresslist;
    this.ManagedeviceauthenService.updateNodeid(data).subscribe({
      next: data => {
        // console.log(data)
        this.displayEdit_edims_node = false;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: data.detail.message
        });
        this.changeDetection.detectChanges();
        this.ManagedeviceauthenService.getNodeother().subscribe({
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
  }else {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: "IP Address is Duplicate, please enter new IP Address."
    });
    this.invalidip = "ng-invalid ng-dirty"
  }
  } else {
    this.displayEdit_edims_node = false;
  }
  }
  listModelchange(value){

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
    this.displayView = false;
    this.deviceName = undefined;
    this.snmp_profile = undefined;
    this.selectedlistModel = undefined;
    this.invalidip = "";
    this.ip_addresslist = undefined;
    // this.viewDatanode = undefined;
  }
  onIPAddress(event){
    this.invalidip = "";
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
        // console.log(this.profileid.device_profile_name)
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
    this.displayEditprofile = true;
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
          }
        }
      });
    } else {
      this.invalidPassword = "ng-invalid ng-dirty";
      this.invalid = "ng-invalid ng-dirty";
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
      this.profileidAdd.password != undefined &&
      this.profileidAdd.management_vlan != undefined
    ) {
      this.invalid = "";
      this.invalidPassword = "";
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
  onSubmitlistdeviceprofile() {
    this.ManagedeviceauthenService.editNodeid(
      this.idprofileDialog,
      this.selecteddevice_profile.id,
      this.snmp_profile.id,
    ).subscribe({
      next: data => {
        // console.log(data)
        this.displayEdit = false;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: data.detail.message
        });
        this.changeDetection.detectChanges();
        this.ManagedeviceauthenService.getNodeother().subscribe({
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
  limit = 0;
  deleteNode(data){
    this.confirmationService.confirm({
      message:
        "Are you sure you want to delete the selected Name :" +
        " " +
        data.device_name +
        " " +
        "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.ManagedeviceauthenService.removeNode(data.id).subscribe(datalist => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: datalist.detail.message,
            life: 3000
          });
          this.ManagedeviceauthenService.getNodeother().subscribe({
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
        });
        // this.changeDetection.detectChanges();
      }
    });
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
    const fileName = `manage-device-authen${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.datanode);
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
