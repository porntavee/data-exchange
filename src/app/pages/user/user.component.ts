import { Component, OnInit, Input } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { User } from "@app/user";
import { UserService } from "@app/userservice";
import { Title } from "@angular/platform-browser";
import { HttpErrorResponse } from "@angular/common/http";
import { data } from "jquery";
import { ThemeService } from "app/theme.service";
import { MenuItem } from "primeng/api";
import * as xlsx from "xlsx";

interface Zone {
  name: string;
  id: number;
}
interface role {
  name: string;
  id: number;
}

@Component({
  selector: "user-cmp",
  moduleId: module.id,
  templateUrl: "user.component.html",
  styles: [
    `
      :host ::ng-deep .p-dialog .user-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `
  ],
  styleUrls: ["user.component.scss"]
})
export class UserComponent implements OnInit {
  exportRangOption: any[];
  exportRangValue: string[];

  userDialog: boolean;
  userDialogs: boolean;
  dailog_header: string;
  submitted: boolean;
  user_password: string = "";
  users: User[] = [];

  user: User;

  selectedUsers: User[];

  zones: Zone[];

  selectedZones: Zone[];

  roles: role[] = [];
  zonelist: any[] = [];
  selectedRole: role;
  selectedZone: any;
  maxDate: Date;

  dateForm: Date;
  dateTo: Date;
  invalidFirstName: string = "";
  invalidSurname: string = "";
  invalidEmail: string = "";
  invalidUserName: string = "";
  invalidPassword: string = "";
  invalidRepeatPassword: string = "";
  invinvalid3: string;
  passwordPattern =
    "^(?=.*[A-Z])(?=.*[!@#$%^&*+_])(?=.*[0-9])(?=.*[a-z]).{8,}$";
  isValid: boolean = false;
  itemsAction: MenuItem[];
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    public themeService: ThemeService
  ) {
    this.titleService.setTitle("SED-User Manage");

    this.exportRangOption = [
      { name: "Weekly", value: "Weekly" },
      { name: "Monthly", value: "Monthly" },
      { name: "Yearly", value: "Yearly" }
    ];

    this.zones = [
      { name: "0", id: 0 },
      { name: "1", id: 1 },
      { name: "2", id: 2 }
    ];
    this.roles = [
      { name: "monitor", id: 0 },
      { name: "admin", id: 1 },
      { name: "super admin", id: 2 }
    ];
    this.selectedRole = this.roles[0];
  }

  ngOnInit() {
    this.themeService.currentpage("/user");
    this.maxDate = new Date();
    this.userService.getUser().subscribe({
      next: data => {
        console.log(data.data);
        this.users = data.data;
        console.log(this.users);
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
    this.userService.getUserZone().subscribe({
      next: datas => {
        this.zonelist = datas;
        // this.selectedZone = datas[0]
        // console.log(datas)
        // this.alarmGroups = datas;
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
    this.userService.currentMessage.subscribe(user => {
      if (user != undefined) {
        this.itemsAction = [
          {
            label: "User",
            items: [
              {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: event => {
                  this.editUser(user);
                }
              }
            ]
          }
        ];
      }
    });
  }
  menuVlue(user) {
    this.userService.valueSource(user);
  }
  checkPassword() {
    if (this.user.password.match(this.passwordPattern)) {
      this.isValid = true;
      this.invinvalid3 = "";
    } else {
      this.isValid = false;
      this.invinvalid3 = "ng-invalid ng-dirty";
    }
  }

  actionItem(user: User) {
    return [
      {
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Edit",
            icon: "pi pi-fw pi-pencil",
            command: event => {
              this.editUser(user);
            }
          }
        ]
      }
    ];
  }

  openNew() {
    this.user = {};
    // console.log(this.user);
    this.submitted = false;
    this.userDialog = true;
    this.user.password = "";
    this.isValid = false;
    this.invinvalid3 = "";
    this.dailog_header = "Add new user";
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected users?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        let user_ids: number[] = [];
        this.selectedUsers.forEach(user => {
          user_ids.push(Number(user.id));
        });

        this.users = this.users.filter(
          val => !this.selectedUsers.includes(val)
        );
        this.selectedUsers = null;
        this.userService.deleteUsers(user_ids).subscribe(
          response => {
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "user has been deleted",
              life: 3000
            });
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: "error",
              summary: "Failed",
              detail: "user has not deleted",
              life: 3000
            });
          }
        );
      }
    });
  }

  editUser(user: User) {
    let monitor = "monitor";
    let admin = "admin";
    this.user = { ...user };
    this.userDialogs = true;
    this.user.password = "";
    this.isValid = false;
    this.invinvalid3 = "";
    this.dailog_header = "Edit user";
    // console.log(user)
    var index = this.zonelist.findIndex(
      data => data.zone_name == user.zone_name
    );
    this.selectedZone = this.zonelist[index];
    // console.log(this.zonelist[index])
    if (user.role == monitor) {
      this.selectedRole = this.roles[0];
    } else if (user.role == admin) {
      this.selectedRole = this.roles[1];
    } else {
      this.selectedRole = this.roles[2];
    }
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + user.firstname + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.users = this.users.filter(val => val.id !== user.id);
        this.user = {};
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "user Deleted",
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.userDialogs = false;
    this.submitted = false;
    // this.invalidPassword = "";
    // this.invalidRepeatPassword = "";
    this.invalidFirstName = "";
    this.invalidSurname = "";
    this.invalidEmail = "";
    this.invalidUserName = "";
    this.invalidPassword = "";
    this.invalidRepeatPassword = "";
    this.user_password = "";
    this.invinvalid3 = "";
  }
  hideDialogEdit() {
    this.userDialogs = false;
    this.submitted = false;
    // this.invalidPassword = "";
    // this.invalidRepeatPassword = "";
    this.invalidFirstName = "";
    this.invalidSurname = "";
    this.invalidEmail = "";
    this.invalidUserName = "";
    this.invalidPassword = "";
    this.invalidRepeatPassword = "";
    this.user_password = "";
    this.invinvalid3 = "";
  }
  onChangeRole(event) {
    //console.log('event value :' + event.value.name);
    this.user.role = event.value.name;
  }
  onChangeZone(event) {
    this.user.zone = event.value.id;
    // var index = this.zonelist.findIndex(data => data.zone_name == event.value.zone_name)
    // var list = this.zonelist[index]
    // this.user.zone = this.zonelist[index].id;
    // console.log(list);
    // console.log(event.value);
    // this.user.role = event.value.name;
  }
  saveUser() {
    if (
      (this.user.zone != undefined &&
        this.user.firstname != undefined &&
        this.user.lastname != undefined &&
        this.user.password != undefined &&
        this.user.username != undefined &&
        this.user_password != undefined) ||
      this.user_password != ""
    ) {
      this.invalidFirstName = "";
      this.invalidSurname = "";
      this.invalidEmail = "";
      //   this.invalidUserName = "";
      this.invalidPassword = "";
      this.invalidRepeatPassword = "";

      if (this.user.password !== this.user_password) {
        this.submitted = false;
        this.messageService.add({
          severity: "error",
          summary: "Failed",
          detail: "Confirm password doesn't match, Please try again",
          life: 3000
        });
      } else {
        var filter = this.users.filter(
          data => data.username == this.user.username
        );
        if (filter.length == 0) {
          this.submitted = true;
          if (this.isValid == true) {
            if (this.user.firstname.trim()) {
              this.userService.createUser(this.user).subscribe(data => {
                this.userService.getUser().subscribe({
                  next: data => {
                    this.users = data.result;
                  },
                  error: error => {
                    if (error.status == 401) {
                      this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail:
                          "Session expired, please logout and login again."
                      });
                    }
                  }
                });
                this.messageService.add({
                  severity: "success",
                  summary: "Successful",
                  detail: "Account Successfully Created",
                  life: 3000
                });

                this.userDialog = false;
              });
            }
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Failed",
              detail: "Please Check your password !!",
              life: 3000
            });
          }
        } else {
          this.invalidUserName = "ng-invalid ng-dirty";
          this.messageService.add({
            severity: "error",
            summary: "Failed",
            detail: "Username is duplicate.Please fill new username agian.",
            life: 3000
          });
        }
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Failed",
        detail:
          "Please fill out the required fields before click on the SAVE button",
        life: 3000
      });
      this.invalidFirstName = "ng-invalid ng-dirty";
      this.invalidSurname = "ng-invalid ng-dirty";
      this.invalidEmail = "ng-invalid ng-dirty";
      this.invalidUserName = "ng-invalid ng-dirty";
      this.invalidPassword = "ng-invalid ng-dirty";
      this.invalidRepeatPassword = "ng-invalid ng-dirty";

      //   this.invalidFirstName = "ng-invalid ng-dirty";
    }
  }
  saveUserEdit() {
    if (
      this.user.firstname != undefined &&
      this.user.lastname != undefined &&
      this.user.email != undefined &&
      this.user.password != undefined &&
      this.user.username != undefined
    ) {
      this.invalidFirstName = "";
      this.invalidSurname = "";
      this.invalidEmail = "";
      //   this.invalidUserName = "";
      this.invalidPassword = "";
      this.invalidRepeatPassword = "";
      // console.log(this.user.password)
      if (this.user.password != "") {
        // console.log("hi")
        if (!this.user.password.match(this.user_password)) {
          this.submitted = false;
          this.messageService.add({
            severity: "error",
            summary: "Failed",
            detail: "Confirm password doesn't match, Please try again",
            life: 3000
          });
        } else {
          var filter = this.users.filter(
            data =>
              data.username == this.user.username && data.id == this.user.id
          );
          if (filter.length != 0) {
            this.submitted = true;
            if (this.isValid == true) {
              if (this.user.firstname.trim()) {
                if (this.user.id) {
                  this.users[this.findIndexById(this.user.id)] = this.user;
                  this.userService.editUser(this.user).subscribe(
                    response => {
                      this.userService.getUser().subscribe({
                        next: data => {
                          this.users = data.result;
                          console.log(this.users);
                        },
                        error: error => {
                          if (error.status == 401) {
                            this.messageService.add({
                              severity: "error",
                              summary: "Error",
                              detail:
                                "Session expired, please logout and login again."
                            });
                          }
                        }
                      });
                      // this.users = [...this.users];
                      this.userDialogs = false;
                      this.user = {};
                      this.messageService.add({
                        severity: "success",
                        summary: "Successful",
                        detail: "Account Successfully Created",
                        life: 3000
                      });
                    },
                    (error: HttpErrorResponse) => {
                      this.messageService.add({
                        severity: "error",
                        summary: "Failed",
                        detail: "Account Unsuccessfully Created",
                        life: 3000
                      });
                    }
                  );
                }

                this.users = [...this.users];
                this.userDialogs = false;
                this.user = {};
              }
            } else {
              this.invalidPassword = "ng-invalid ng-dirty";
              this.messageService.add({
                severity: "error",
                summary: "Failed",
                detail: "Please Check your password !!",
                life: 3000
              });
            }
          } else {
            this.invalidUserName = "ng-invalid ng-dirty";
            this.messageService.add({
              severity: "error",
              summary: "Failed",
              detail: "Username is duplicate.Please fill new username agian.",
              life: 3000
            });
          }
        }
      } else {
        if (this.user.firstname.trim()) {
          if (this.user.id) {
            var filter = this.users.filter(
              data =>
                data.username == this.user.username && data.id == this.user.id
            );
            if (filter.length != 0) {
              this.users[this.findIndexById(this.user.id)] = this.user;

              this.userService.editUser(this.user).subscribe(
                response => {
                  this.userService.getUser().subscribe({
                    next: data => {
                      this.users = data.data;
                    },
                    error: error => {
                      if (error.status == 401) {
                        this.messageService.add({
                          severity: "error",
                          summary: "Error",
                          detail:
                            "Session expired, please logout and login again."
                        });
                      }
                    }
                  });
                  // this.users = [...this.users];
                  this.userDialogs = false;
                  this.user = {};
                  this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Account Successfully Created",
                    life: 3000
                  });
                },
                (error: HttpErrorResponse) => {
                  this.messageService.add({
                    severity: "error",
                    summary: "Failed",
                    detail: "Account Unsuccessfully Created",
                    life: 3000
                  });
                }
              );
            } else {
              this.invalidUserName = "ng-invalid ng-dirty";
              this.messageService.add({
                severity: "error",
                summary: "Failed",
                detail: "Username is duplicate.Please fill new username agian.",
                life: 3000
              });
            }
          }
        }
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Failed",
        detail:
          "Please fill out the required fields before click on the SAVE button",
        life: 3000
      });
      this.invalidFirstName = "ng-invalid ng-dirty";
      this.invalidSurname = "ng-invalid ng-dirty";
      this.invalidEmail = "ng-invalid ng-dirty";
      this.invalidUserName = "ng-invalid ng-dirty";
      this.invalidPassword = "ng-invalid ng-dirty";
      this.invalidRepeatPassword = "ng-invalid ng-dirty";

      //   this.invalidFirstName = "ng-invalid ng-dirty";
    }
  }
  checkusername() {
    this.invalidUserName = "";
  }
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  sendmail(email) {
    this.userService.sendmail(email).subscribe({
      next: data => {
        //console.log(data)
      },
      error: error => {
        console.error("There was an error!", error);
      }
    });
  }

  onSelectRang(event) {
    if (event.option.value == this.exportRangValue) {
      //console.log(this.exportRangValue);
      this.exportRangValue = [];
      this.exportRangValue = null;
      //console.log(this.exportRangValue);
    }
    this.dateTo = null;
    this.dateForm = null;
    this.exportRangValue = [];
    this.exportRangValue = null;
    //console.log(event);
    //console.log(this.exportRangValue);
  }

  onInputCalendar(event) {
    // //console.log("waaaweeeee");
    //this.exportRangOption = [];
    // this.exportRangOption = [
    //     { "name": "Weekly", "value": "Weekly" },
    //     { "name": "Monthly", "value": "Monthly" },
    //     { "name": "Yearly", "value": "Yearly" }
    // ]
    //console.log(event);
    this.exportRangValue = null;
  }
  exportToExcel() {
    const timestamp = this.getTimestamp(); // Get the timestamp in the format 'yymmdd-hhmmss'
    const fileName = `user${timestamp}.xlsx`;
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.users);
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
