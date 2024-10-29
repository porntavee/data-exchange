import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Product } from "@app/product";
import { ProductService } from "@app/productservice";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { Title } from "@angular/platform-browser";
import { LineGroupService } from "@app/linegroupservice";
import { InputSwitchModule } from "primeng/inputswitch";
import { PrimeNGConfig } from "primeng/api";
import { TopoService } from "app/topology-service";
import { UserService } from "@app/userservice";
import { ThemeService } from "app/theme.service";
import { MenuItem } from "primeng/api";
import * as xlsx from "xlsx";

export interface LineGroup {
  id?: number;
  line_group_id?: string;
  enable?: boolean;
  group_name?: string;
  group_description?: string;
  name?: string;
}

export interface alarmGroup {
  group_id?: number;
  symbol_id?: number;
  group_name?: string;
  symbol_name?: string;
  group_description?: string;
  symbol_list?: string[];
}
export interface editlistGroup {
  symbol_id?: string[];
  group_name?: string;
  group_description?: string;
}
interface group_list {
  SYMBOL_ID?: any;
  SYMBOL_NAME1?: string;
  SYMBOL_NAME3?: string;
}
export interface editGroup {
  group_name?: string;
  group_description?: string;
  group_list?: group_list[];
}

@Component({
  selector: "userzone-cmp",
  moduleId: module.id,
  templateUrl: "userzone.component.html",
  styles: [
    `
      :host ::ng-deep .p-dialog .user-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `
  ],
  styleUrls: ["userzone.component.scss"]
})
export class UserZoneComponent implements OnInit {
  alarmGroupDialog: boolean;
  alarmGroupDialog1: boolean;
  dialogHeader: string;
  submitted: boolean;
  editalarmGroups: alarmGroup[];
  editalarmGroup: alarmGroup = {};
  editalarmGroups1: alarmGroup = {};
  editGroup: editGroup = {};
  editGroups: editGroup = {};
  editGroup1: editGroup[];
  editGroup2: group_list[];
  alarmGroups: any[];
  alarmGroup: any;
  AlarmGroup: alarmGroup = {};
  stringArray: string[];
  stringArrays: number;
  iconArrays: any;
  editlistgroup: editlistGroup;
  selectedGroups: any[];
  monitor_id: number[] = [1, 2, 3, 4];
  lineGroups: LineGroup[] = [];
  enabled: boolean = true;
  lineDialog: boolean;
  check: boolean;
  check1: boolean;
  invinvalid: string;
  sourceProducts: any[] = [];
  sourceProductsS: any[] = [];
  targetProducts: any[];
  targetProductsS: any[] = [];
  waitloadData: boolean = true;
  itemsAction: MenuItem[];
  constructor(
    private changeDetection: ChangeDetectorRef,
    private toposervice: TopoService,
    private userService: UserService,
    private lineGroupService: LineGroupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private carService: ProductService,
    private primengConfig: PrimeNGConfig,
    public themeService: ThemeService
  ) {
    this.titleService.setTitle("SED-User Zone Manage");
  }

  actionItem(AlarmGroup: alarmGroup) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Edit",
            icon: "pi pi-fw pi-pencil",
            command: event => {
              this.editline(AlarmGroup);
            }
          }
        ]
      }
    ];
  }

  openDailog() {
    this.symbolData = {};
    this.alarmGroup = {};
    this.symbolDataAdded = [];
    this.symbolString = [];
    this.nameSearch = null;
    this.ipSearch = null;
    this.submitted = false;
    this.alarmGroupDialog = true;
    this.hasNoSearchResult = false;
    this.dialogHeader = "Add new";
    this.check = false;
    this.check1 = true;
    this.userService.get_topo_information(0).subscribe({
      next: marker => {
        this.sourceProducts = marker.node;
        this.sourceProducts.push(...marker.rc_node);
        // console.log(this.sourceProducts)
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
    // this.carService
    //   .getProductsSmall()
    //   .then(products => (this.sourceProducts = products));
    this.targetProducts = [];
    this.primengConfig.ripple = true;
  }
  editline(AlarmGroup: any) {
    this.symbolData = {};
    this.alarmGroup = {};
    this.symbolDataAdded = [];
    this.symbolString = [];
    this.nameSearch = null;
    this.ipSearch = null;
    this.submitted = false;
    this.alarmGroupDialog = true;
    this.hasNoSearchResult = false;
    this.dialogHeader = "Edit group";
    this.editalarmGroups1 = AlarmGroup;
    this.alarmGroup = AlarmGroup;
    this.check = true;
    this.check1 = false;

    this.userService.get_topo_information(0).subscribe({
      next: marker => {
        // this.sourceProducts = marker.node
        // this.waitloadData = false;
        this.userService.getUserZoneAssign().subscribe({
          next: datas => {
            // console.log(idlist)
            if (this.targetProductsS.length == 0) {
              var idlist = datas.filter(data => data.zone_id == AlarmGroup.id);
              if (idlist.length != 0) {
                var listnode = [];
                listnode.push(...marker.node);
                listnode.push(...marker.rc_node);
                // console.log(listnode)
                for (let i = 0; i < idlist.length; i++) {
                  var targetProducts = listnode.filter(
                    data => data.SYMBOL_ID == idlist[i].symbol_id
                  );
                  this.targetProductsS.push(...targetProducts);
                }
              }
            } else {
              this.targetProductsS = [];
              var idlist = datas.filter(data => data.zone_id == AlarmGroup.id);
              if (idlist.length != 0) {
                var listnode = [];
                listnode.push(...marker.node);
                listnode.push(...marker.rc_node);
                for (let i = 0; i < idlist.length; i++) {
                  var targetProducts = listnode.filter(
                    data => data.SYMBOL_ID == idlist[i].symbol_id
                  );
                  this.targetProductsS.push(...targetProducts);
                }
              }
            }
            this.targetProducts = this.targetProductsS;

            if (this.targetProductsS.length == 0) {
              var listnode = [];
              listnode.push(...marker.node);
              listnode.push(...marker.rc_node);
              this.sourceProducts = listnode;
            } else {
              var listnode = [];
              listnode.push(...marker.node);
              listnode.push(...marker.rc_node);
              this.sourceProducts = listnode.filter(
                val => !this.targetProductsS.includes(val)
              );
            }
            // var sou = marker.node.filter(data => data => data.SYMBOL_ID)

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
  closeDialog() {
    this.alarmGroupDialog = false;
  }
  hideDialog() {
    this.alarmGroupDialog = false;
    this.submitted = false;
  }
  hideDialog1() {
    this.alarmGroupDialog1 = false;
    this.submitted = false;
  }
  ngOnInit() {
    this.userService.getUserZone().subscribe({
      next: datas => {
        this.alarmGroups = datas;
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
    this.userService.currentMessageZone.subscribe(group => {
      if (group != undefined) {
        this.itemsAction = [
          {
            label: "User",
            items: [
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                  this.editline(group);
                }
              },
              {
                label: "Delete",
                icon: "pi pi pi-trash",
                command: event => {
                  this.deleteGroup(group);
                }
              }
            ]
          }
        ];
      }
    });
  }
  menuVlue(user) {
    this.userService.valueSourceZone(user);
  }
  createGroup() {
    if (
      this.alarmGroup.zone_name != undefined &&
      this.alarmGroup.description != undefined &&
      this.targetProducts.length != 0
    ) {
      var arrZone = [];
      this.targetProducts.forEach(data => {
        arrZone.push(data.SYMBOL_ID);
      });
      var listitem = {
        zone_name: this.alarmGroup.zone_name,
        zone_description: this.alarmGroup.description,
        symbol_id: arrZone
      };
      this.userService.creteuserzone(listitem).subscribe({
        next: data => {
          this.alarmGroupDialog = false;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Userzone Successfully Created",
            life: 3000
          });
          this.userService.getUserZone().subscribe({
            next: datas => {
              this.alarmGroups = datas;
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
        },
        error: error => {
          console.error("There was an error!", error);
        }
      });
    }
  }
  editlistGroup(id: any) {
    this.submitted = true;
    var arrZone = [];
    this.targetProducts.forEach(data => {
      arrZone.push(data.SYMBOL_ID);
    });

    this.userService
      .editZone(
        id,
        arrZone,
        this.alarmGroup.zone_name,
        this.alarmGroup.description
      )
      .subscribe(result => {
        this.closeDialog();
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: result.message,
          life: 3000
        });
        this.userService.getUserZone().subscribe({
          next: datas => {
            this.alarmGroups = datas;
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
        // this.refresh();
      });
  }
  refresh(): void {
    window.location.reload();
  }

  symbolData: any = [];
  symbolDataAdded: any = [];
  symbolDataAdded1: group_list[];
  symbolString: any[];

  nameSearch: string;
  ipSearch: string;
  hasNoSearchResult: boolean = false;

  nameInput() {
    this.ipSearch = null;
  }

  ipInput() {
    this.nameSearch = null;
  }

  lineread(AlarmGroup: alarmGroup) {
    this.AlarmGroup = AlarmGroup;
    this.lineDialog = true;
    this.dialogHeader = "Alarm message group Manager";
    const name = AlarmGroup.symbol_name;
    this.stringArray = name.split(",");
  }
  addSymbol(symbolData) {
    //console.log(this.findRowBySymbolId(symbolData.SYMBOL_ID));
    if (this.findRowBySymbolId(symbolData.SYMBOL_ID) < 0) {
      this.symbolDataAdded.push(symbolData);
      this.symbolString.push(symbolData.SYMBOL_ID);
    }
    //console.log(this.symbolString)
  }
  addSymbol1(symbolData) {
    //console.log(this.findRowBySymbolId(symbolData.SYMBOL_ID));
    if (this.findRowBySymbolId1(symbolData.SYMBOL_ID) < 0) {
      this.editGroup1.push(symbolData);
      this.symbolString.push(symbolData.SYMBOL_ID);
    } else {
      this.editGroup1.push(symbolData);
      this.symbolString.push(symbolData.SYMBOL_ID);
    }
  }
  deleteSymbol(symbolData) {
    let index = this.findRowBySymbolId(symbolData.SYMBOL_ID);
    this.symbolDataAdded.splice(index, 1);
    this.symbolString.splice(index, 1);
    //console.log(this.symbolString);
  }
  deleteSymbol1(symbolData) {
    let index = this.findRowBySymbolId1(symbolData.SYMBOL_ID);
    this.editGroup1.splice(index, 1);
    this.symbolString.splice(index, 1);
  }
  findRowBySymbolId(id: string): number {
    let index = -1;

    for (let i = 0; i < this.symbolDataAdded.length; i++) {
      if (this.symbolDataAdded[i].SYMBOL_ID === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  findRowBySymbolId1(id: string): number {
    let index = -1;
    for (let i = 0; i < this.symbolData.length; i++) {
      if (this.symbolData[i].SYMBOL_ID === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  deleteGroup(group) {
    this.confirmationService.confirm({
      message: "ต้องการลบโซน " + group.zone_name + " ใช่หรือไม่",
      header: "ยืนยันการลบ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.alarmGroups = this.alarmGroups.filter(val => val.id !== group.id);
        this.alarmGroup = {};
        this.userService.deleteZone(group.id).subscribe(result => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: result.message,
            life: 3000
          });
          //console.log("success");
          this.changeDetection.detectChanges();
        });
      }
    });
  }

  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `user-zone${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.alarmGroups
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
