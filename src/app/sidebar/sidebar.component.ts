import { Component, OnInit, HostListener } from "@angular/core";
import jwt_decode from "jwt-decode";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { data, event } from "jquery";
import { theme } from "highcharts";
import { MenuItem } from "primeng/api";
import { ThemeService } from "app/theme.service";
import { AdminLayoutService } from "@app/layouts/admin-layout/admin-layout.service";
import { NavService } from "@app/nav.serive";
export interface RouteInfo {
  path?: string;
  title: string;
  icon: string;
  icon_drop?: string;
  class: string;
  role: string[];
  children?: any[];
  hidden?: boolean;
  parent?: string;
  active?: boolean;
}

export const ROUTES: RouteInfo[] = [
  // {
  //   title: "เรียลไทม์",
  //   path: "/realtime",
  //   icon: "assets/img/m-dashboard.png",
  //   class: "",
  //   role: ["super admin"],
  //   hidden: false
  // },
  // {
  //   title: "สถิติ",
  //   path: "/stats",
  //   icon: "assets/img/m-stat.png",
  //   class: "",
  //   role: ["super admin"],
  //   hidden: false
  // },
  // {
  //   title: "จุดสนใจ",
  //   path: "/points-interest",
  //   icon: "assets/img/m-focus-area.png",
  //   class: "",
  //   role: ["super admin"],
  //   hidden: false
  // },
  {
    title: "API Manager",
    path: "/d-api",
    icon: "assets/img/m-dashboard.png",
    class: "",
    role: ["super admin"],
    hidden: false
  },
  {
    title: "API Library",
    path: "/d-api-use",
    icon: "assets/img/m-dashboard.png",
    class: "",
    role: ["super admin"],
    hidden: false
  },
  {
    title: "API Approve",
    path: "/d-api-approve",
    icon: "assets/img/m-dashboard.png",
    class: "",
    role: ["super admin"],
    hidden: false
  },
  {
    title: "USER MANAGEMENT",
    path: "/user",
    icon: "assets/img/user-icon.png",
    class: "",
    role: ["super admin"],
    hidden: false
  }

  // {
  //   title: "DASHBOARD",
  //   icon: "assets/img/Dashboard-icon.png",
  //   path: "/dashboard",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false
  // },
  // {
  //   title: "ALARM",
  //   icon: "assets/img/alarm-icon.png",
  //   icon_drop: "fa fa-caret-down",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false,
  //   children: [
  //     {
  //       path: "/alarm",
  //       title: "ALARM TRAP",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "ALARM"
  //     },
  //     {
  //       path: "/alarmhistory",
  //       title: "ALARM THRESHOLD",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "ALARM"
  //     },
  //     {
  //       path: "/alarm-trap-history",
  //       title: "ALARM TRAP HISTORY",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "ALARM"
  //     }
  //   ]
  // },
  // {
  //   title: "TASK",
  //   icon: "assets/img/Task-icon.png",
  //   icon_drop: "fa fa-caret-down",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false,
  //   children: [
  //     {
  //       path: "/task",
  //       title: "TASK MANAGEMENT",
  //       class: "",
  //       role: ["super admin", "admin"],
  //       parent: "TASK"
  //     },
  //     {
  //       path: "/schedule",
  //       title: "SCHEDULED TASKS",
  //       class: "",
  //       role: ["super admin", "admin"],
  //       parent: "TASK"
  //     },
  //     {
  //       path: "/report",
  //       title: "TASK RESULT",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "TASK"
  //     }
  //   ]
  // },
  // {
  //   title: "CUSTOMER REPORT",
  //   icon: "assets/img/Customer-icon.png",
  //   icon_drop: "fa fa-caret-down",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false,
  //   children: [
  //     {
  //       path: "/customerreport",
  //       title: "MANAGE CIRCUIT ID",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "CUSTOMER REPORT"
  //     },
  //     {
  //       path: "/catidhistory",
  //       title: "CIRCUIT ID HISTORY",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "CUSTOMER REPORT"
  //     },
  //     {
  //       path: "/dailysummary",
  //       title: "DAILY SUMMARY",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "CUSTOMER REPORT"
  //     },
  //     {
  //       path: "/trafficmonthly",
  //       title: "MONTHLY SUMMARY",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "CUSTOMER REPORT"
  //     },
  //     {
  //       path: "/availability",
  //       title: "DEVICE AVAILABILITY",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "CUSTOMER REPORT"
  //     }
  //   ]
  // },
  // {
  //   title: "TOPOLOGY",
  //   path: "/topologymap",
  //   icon: "assets/img/Topology-icon.png",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false
  // },

  // // {
  // //   title: "REMOTE",
  // //   path: "/telnet",
  // //   icon: "assets/img/Remote-icon.png",
  // //   class: "",
  // //   role: ["super admin", "admin"],
  // //   hidden: false
  // // },
  // {
  //   title: "LINE MANAGEMENT",
  //   path: "/linechatbot",
  //   icon: "assets/img/Line management-icon.png",
  //   class: "",
  //   role: ["super admin", "admin"],
  //   hidden: false
  // },
  // {
  //   title: "ACCESS LOGS",
  //   path: "/log",
  //   icon: "assets/img/access-icon.png",
  //   class: "",
  //   role: ["super admin"],
  //   hidden: false
  // },
  // {
  //   title: "SCRIPT TEMPLATE",
  //   path: "/script",
  //   icon: "assets/img/Script template-icon.png",
  //   class: "",
  //   role: ["super admin", "admin"],
  //   hidden: false
  // },
  // {
  //   title: "PROVISIONING HISTORY",
  //   path: "/provisioninghistory",
  //   icon: "assets/img/Provision history-icon.png",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false
  // },
  // {
  //   title: "THROUGHPUT",
  //   icon: "assets/img/Throughput-icon.png",
  //   icon_drop: "fa fa-caret-down",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false,
  //   children: [
  //     {
  //       path: "/throughput",
  //       title: "THROUGHPUT TEST",
  //       class: "",
  //       role: ["super admin", "admin"],
  //       parent: "THROUGHPUT"
  //     },
  //     {
  //       path: "/throughputreport",
  //       title: "THROUGHPUT REPORT",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "THROUGHPUT"
  //     }
  //     // {
  //     //   path: "/topchart",
  //     //   title: "REPORT",
  //     //   class: "",
  //     //   role: ["super admin", "admin", "monitor"],
  //     //   parent: "THROUGHPUT"
  //     // }
  //   ]
  // },
  // {
  //   title: "REPORT",
  //   path: "/topchart",
  //   icon: "assets/img/Report-icon.png",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false
  // },
  // {
  //   title: "MANAGE DEVICE",
  //   icon: "assets/img/managedevice-icon.png",
  //   icon_drop: "fa fa-caret-down",
  //   class: "",
  //   role: ["super admin", "admin", "monitor"],
  //   hidden: false,
  //   children: [
  //     {
  //       path: "/managedeviceauthen",
  //       title: "MANAGE NODE (RAISECOM)",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "MANAGE DEVICE"
  //     },
  //     {
  //       path: "/managedeviceother",
  //       title: "MANAGE NODE (OTHER)",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "MANAGE DEVICE"
  //     },
  //     {
  //       path: "/managedeviceprofile",
  //       title: "MANAGE PROFILE",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "MANAGE DEVICE"
  //     },
  //     {
  //       path: "/SnpmProfile",
  //       title: "MANAGE SNMP PROFILE",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "MANAGE DEVICE"
  //     },
  //     {
  //       path: "/AlarmProfile",
  //       title: "MANAGE ALARM THRESHOLD",
  //       class: "",
  //       role: ["super admin", "admin", "monitor"],
  //       parent: "MANAGE DEVICE"
  //     }
  //   ]
  // },
  // {
  //   title: "SERVICE STATUS",
  //   path: "/servicestatus",
  //   icon: "assets/img/service-icon.png",
  //   class: "",
  //   role: ["super admin"],
  //   hidden: false
  // }
];
@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  items: any[];
  public menuItems: any[];
  visibleSidebar1: boolean;
  dismissible: boolean;
  themeValue: string = this.themeService.theme;
  styleClassTheme: any;
  public role: any;
  Logopic: string;
  showMainmenu: boolean = false;
  showMinimenu: boolean = false;
  float: string;
  innerWidth;
  menuMini: boolean = false;
  classSubmenu: any;
  itemsDashboard: MenuItem[];
  itemsAlarm: MenuItem[];
  itemsTask: MenuItem[];
  itemsUser: MenuItem[];
  itemsTHROUGHPUT: MenuItem[];
  itemsMANAGEDEVICE: MenuItem[];
  itemsCustomer: MenuItem[];
  classLogo: string;
  constructor(
    public themeService: ThemeService,
    private router: Router,
    private AdminLayoutService: AdminLayoutService,
    private navService: NavService
  ) {}
  @HostListener("window:resize", ["$event"])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 1800) {
      this.classLogo = "logoBig";
      this.AdminLayoutService.currentsidebarminiMessage.subscribe(data => {
        if (data == "sidebar") {
          this.showMinimenu = true;
          this.showMainmenu = false;
        } else if (data == "sidebar-mini") {
          this.showMinimenu = true;
          this.showMainmenu = false;
        } else if (data == "Defult") {
          this.showMinimenu = true;
          this.showMainmenu = false;
        }
      });
    } else {
      this.classLogo = "logoMini";
      this.AdminLayoutService.currentsidebarminiSMessage.subscribe(data => {
        if (data == "sidebar") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          // console.log(data)
        } else if (data == "sidebar-mini") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          // console.log(data)
        } else if (data == "Defult") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          // console.log(data)
        }
      });
    }
  }

  submenu(value, path) {
    if (value == "เรียลไทม์") {
      this.navService.setNavId("/realtime1");
    } else if (value == "สถิติ") {
      this.navService.setNavId("/stats1");
    }
    this.menuItems.forEach(data => {
      if (data.title == value) {
        if (data.children != undefined) {
          if (data.hidden == false) {
            data.hidden = true;
            data.icon_drop = "fa fa-caret-up";
          } else {
            data.hidden = false;
            data.icon_drop = "fa fa-caret-down";
          }
        } else {
          this.linkmini(path, value, "");
        }
      } else {
        if (data.hidden == true) {
          data.hidden = false;
          data.icon_drop = "fa fa-caret-down";
        }
      }
    });
    this.menuMini = true;
  }

  linkmini(value, title, subtitle) {
    this.router.navigate([value]);
    this.AdminLayoutService.sideiconClass("Defult");
    if (title == "DASHBOARD") {
      this.AdminLayoutService.addOrderBox("/dashboard");
    } else {
      if (title == "TOPOLOGY") {
        this.AdminLayoutService.addOrderBox("/topologymap");
      } else {
        if (subtitle == "THROUGHPUT TEST") {
          this.AdminLayoutService.addOrderBox("/throughput");
        } else {
          this.AdminLayoutService.addOrderBox("path");
        }
      }
    }
    const substr = "-active.png";
    const subArr = this.menuItems.filter(str => str.icon.includes(substr));
    var listmenu = this.menuItems.filter(str => str.title == title);
    // console.log(listmenu)
    if (subArr.length != 0) {
      if (subArr[0].title == title) {
        // console.log('hi')
      } else {
        if (listmenu.length != 0) {
          listmenu[0].icon = listmenu[0].icon.replace(".png", "-active.png");
          listmenu[0].class = "ng-star-inserted active";
          // console.log('hi')
        }
        subArr[0].icon = subArr[0].icon.replace("-active.png", ".png");
        subArr[0].class = "ng-star-inserted";
        // console.log(subArr)
      }
    } else {
      if (listmenu.length != 0) {
        listmenu[0].icon = listmenu[0].icon.replace(".png", "-active.png");
        listmenu[0].class = "ng-star-inserted active";
        // console.log('hi')
      }
    }
    this.menuItems.forEach(data => {
      if (data.title == title) {
        if (data.children != undefined) {
          if (data.hidden == false) {
            // console.log('hi')
            data.hidden = true;
            data.icon_drop = "fa fa-caret-up";
          } else {
            // console.log('hi')
            data.hidden = true;
            data.icon_drop = "fa fa-caret-down";
          }
        } else {
          // this.linkmini(path,value)
        }
      } else {
        if (data.hidden == true) {
          // console.log('hi')
          data.hidden = false;
          data.icon_drop = "fa fa-caret-down";
        }
      }
    });
    if (this.themeService.theme == "saga-orange") {
      if (title == "DASHBOARD") {
        if (this.role == "super admin") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }

        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "ALARM") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsCustomer.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "TASK") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "USER MANAGEMENT") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsCustomer.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "THROUGHPUT") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "MANAGE DEVICE") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsCustomer.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "CUSTOMER REPORT") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsCustomer.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
      }
    } else {
      if (title == "DASHBOARD") {
        if (this.role == "super admin") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }

        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "ALARM") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsCustomer.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "TASK") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "USER MANAGEMENT") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsCustomer.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "THROUGHPUT") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "MANAGE DEVICE") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsCustomer.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "CUSTOMER REPORT") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsCustomer.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
      }
    }
  }

  iconmove: any;
  mouseEnter(div: string, path) {
    var classfilter = this.menuItems.filter(
      data => data.class != "ng-star-inserted active"
    );
    if (classfilter.length != 0) {
      var classicon = classfilter.filter(data => data.title == div);
      if (classicon.length != 0) {
        // console.log(classicon)
        classicon[0].icon = classicon[0].icon.replace(".png", "-active.png");
      }
    }
  }
  mouseLeave(div: string, path) {
    var classfilter = this.menuItems.filter(
      data => data.class != "ng-star-inserted active"
    );
    if (classfilter.length != 0) {
      var classicon = classfilter.filter(data => data.title == div);
      if (classicon.length != 0) {
        classicon[0].icon = classicon[0].icon.replace("-active.png", ".png");
      }
    }
  }
  ngOnInit() {
    // let userdata = jwt_decode(localStorage.getItem("token"));
    // let role = userdata["role"];
    // this.role = role;
    var items = [];
    this.menuItems = ROUTES;
    var ii = this.menuItems;
    var currentURL = this.router.url;
    var children = ROUTES.map(data => data["children"]);

    // console.log(...children)
    var arr: any[] = [];
    var list = arr.concat(...children);
    var lists = list.filter(data => data != undefined);

    // this.menuItems = this.menuItems.filter(menuItem =>
    //   menuItem.children.filter(data => {
    //     return data.role.includes(role);
    //   })
    // );
    // this.menuItems.forEach(menu => {
    //   // console.log(menu)
    //   if (menu.children != undefined) {
    //     menu.children = menu.children.filter(menuItem => {
    //       return menuItem.role.includes(role);
    //     });
    //     // console.log(menu.children)
    //   }
    // });
    this.itemsDashboard = [
      {
        label: "DASHBOARD",
        items: [
          {
            label: "DASHBOARD",
            styleClass: "",
            command: event => {
              // console.log(event)
              this.linkmini("/dashboard", "DASHBOARD", "DASHBOARD");
            }
          }
        ]
      }
    ];
    this.itemsAlarm = [
      {
        label: "ALARM",
        items: [
          {
            label: "ALARM TRAP",
            styleClass: "",
            command: event => {
              // console.log(event)
              this.linkmini("/alarm", "ALARM", "ALARM TRAP");
            }
          },
          {
            label: "ALARM THRESHOLD",
            styleClass: "",
            command: event => {
              this.linkmini("/alarmhistory", "ALARM", "ALARM THRESHOLD");
            }
          },
          {
            label: "ALARM TRAP HISTORY",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/alarm-trap-history",
                "ALARM",
                "ALARM TRAP HISTORY"
              );
            }
          }
        ]
      }
    ];
    if (this.role == "super admin" || this.role == "admin") {
      this.itemsTask = [
        {
          label: "TASK",
          items: [
            {
              label: "TASK MANAGEMENT",
              styleClass: "",
              command: event => {
                // console.log(event)
                this.linkmini("/task", "TASK", "TASK MANAGEMENT");
              }
            },
            {
              label: "SCHEDULED TASKS",
              styleClass: "",
              command: event => {
                this.linkmini("/schedule", "TASK", "SCHEDULED TASKS");
              }
            },
            {
              label: "TASK RESULT",
              styleClass: "",
              command: event => {
                this.linkmini("/report", "TASK", "TASK RESULT");
              }
            }
          ]
        }
      ];
    } else if (this.role == "monitor") {
      this.itemsTask = [
        {
          label: "TASK",
          items: [
            {
              label: "TASK RESULT",
              styleClass: "",
              command: event => {
                this.linkmini("/report", "TASK", "TASK RESULT");
              }
            }
          ]
        }
      ];
    }

    if (this.role == "super admin") {
      this.itemsUser = [
        {
          label: "USER MANAGEMENT",
          items: [
            {
              label: "USER MANAGEMENT",
              styleClass: "",
              command: event => {
                // console.log(event)
                this.linkmini("/user", "USER MANAGEMENT", "USER MANAGEMENT");
              }
            },
            {
              label: "USER ZONE MANAGEMENT",
              styleClass: "",
              command: event => {
                this.linkmini(
                  "/userzone",
                  "USER MANAGEMENT",
                  "USER ZONE MANAGEMENT"
                );
              }
            }
          ]
        }
      ];
    }
    if (this.role == "super admin" || this.role == "admin") {
      this.itemsTHROUGHPUT = [
        {
          label: "THROUGHPUT",
          items: [
            {
              label: "THROUGHPUT TEST",
              styleClass: "",
              command: event => {
                // console.log(event)
                this.linkmini("/throughput", "THROUGHPUT", "THROUGHPUT TEST");
              }
            },
            {
              label: "THROUGHPUT REPORT",
              styleClass: "",
              command: event => {
                this.linkmini(
                  "/throughputreport",
                  "THROUGHPUT",
                  "THROUGHPUT REPORT"
                );
              }
            }
          ]
        }
      ];
    } else if (this.role == "monitor") {
      this.itemsTHROUGHPUT = [
        {
          label: "THROUGHPUT",
          items: [
            {
              label: "THROUGHPUT REPORT",
              styleClass: "",
              command: event => {
                this.linkmini(
                  "/throughputreport",
                  "THROUGHPUT",
                  "THROUGHPUT REPORT"
                );
              }
            }
          ]
        }
      ];
    }
    this.itemsMANAGEDEVICE = [
      {
        label: "MANAGE DEVICE",
        items: [
          {
            label: "MANAGE NODE (RAISECOM)",
            styleClass: "",
            command: event => {
              // console.log(event)
              this.linkmini(
                "/managedeviceauthen",
                "MANAGE DEVICE",
                "MANAGE NODE (RAISECOM)"
              );
            }
          },
          {
            label: "MANAGE NODE (OTHER)",
            styleClass: "",
            command: event => {
              // console.log(event)
              this.linkmini(
                "/managedeviceother",
                "MANAGE DEVICE",
                "MANAGE NODE (OTHER)"
              );
            }
          },
          {
            label: "MANAGE PROFILE",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/managedeviceprofile",
                "MANAGE DEVICE",
                "MANAGE PROFILE"
              );
            }
          },
          {
            label: "MANAGE SNMP PROFILE",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/SnpmProfile",
                "MANAGE DEVICE",
                "MANAGE SNMP PROFILE"
              );
            }
          },
          {
            label: "MANAGE ALARM THRESHOLD",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/AlarmProfile",
                "MANAGE DEVICE",
                "MANAGE ALARM THRESHOLD"
              );
            }
          }
        ]
      }
    ];
    this.itemsCustomer = [
      {
        label: "CUSTOMER REPORT",
        items: [
          {
            label: "MANAGE CIRCUIT ID",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/customerreport",
                "CUSTOMER REPORT",
                "MANAGE CIRCUIT ID"
              );
            }
          },
          {
            label: "CIRCUIT ID HISTORY",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/catidhistory",
                "CUSTOMER REPORT",
                "CIRCUIT ID HISTORY"
              );
            }
          },

          {
            label: "DAILY SUMMARY",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/dailysummary",
                "CUSTOMER REPORT",
                "DAILY SUMMARY"
              );
            }
          },
          {
            label: "MONTHLY SUMMARY",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/trafficmonthly",
                "CUSTOMER REPORT",
                "MONTHLY SUMMARY"
              );
            }
          },
          {
            label: "DEVICE AVAILABILITY",
            styleClass: "",
            command: event => {
              this.linkmini(
                "/availability",
                "CUSTOMER REPORT",
                "DEVICE AVAILABILITY"
              );
            }
          }
        ]
      }
    ];
    var findlist = lists.filter(data => data.path == currentURL);

    if (findlist.length > 0) {
      if (ROUTES.filter(data => data.title == findlist[0].parent)) {
        var hide = ROUTES.filter(data => data.title == findlist[0].parent);
        var index = ROUTES.findIndex(data => data.title == hide[0].title);
        ROUTES[index].hidden = true;
      } else {
      }
    } else if (findlist.length == 0) {
      var currentURL = this.router.url;
      var s = this.menuItems.filter(data => data.path == currentURL);
      // console.log(s);
      if (s.length > 0) {
        var indexs = this.menuItems.findIndex(data => data.title == s[0].title);
        this.menuItems[indexs].class = "ng-star-inserted active";
      }
    }
    this.themeService.currentcolorMessage.subscribe(value => {
      if (value == "saga-orange") {
        this.styleClassTheme = "theme-saga";
        this.Logopic = "assets/img/ed_logoDark.png";
        this.classSubmenu = "sub-menuLight";
        var classicon = this.menuItems.filter(
          data => data.path == this.router.url
        );

        this.menuItems.forEach(menu => {
          if (menu.children != undefined) {
            var children = menu.children.filter(
              data => data.path == this.router.url
            );
            if (children.length != 0) {
              if (children[0].parent == menu.title) {
                if (menu.title == this.itemsDashboard[0].label) {
                  this.itemsDashboard.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activelight";
                      }
                    });
                  });
                } else if (menu.title == this.itemsAlarm[0].label) {
                  this.itemsAlarm.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activelight";
                      }
                    });
                  });
                } else if (menu.title == this.itemsTask[0].label) {
                  this.itemsTask.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activelight";
                      }
                    });
                  });
                } else if (menu.title == this.itemsUser[0].label) {
                  this.itemsUser.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activelight";
                      }
                    });
                  });
                } else if (menu.title == this.itemsTHROUGHPUT[0].label) {
                  // console.log('hi')
                  this.itemsTHROUGHPUT.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activelight";
                      }
                    });
                  });
                } else if (menu.title == this.itemsMANAGEDEVICE[0].label) {
                  // console.log(children[0].title)
                  this.itemsMANAGEDEVICE.forEach(data => {
                    data.items.forEach(value => {
                      // console.log(value)
                      if (value.label == children[0].title) {
                        value.styleClass = "activelight";
                      }
                    });
                  });
                } else if (menu.title == this.itemsCustomer[0].label) {
                  this.itemsCustomer.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activelight";
                      }
                    });
                  });
                }
              }
            }
          }
        });

        // console.log(this.themeService.theme)
      } else {
        this.styleClassTheme = "theme-arya";
        this.Logopic = "assets/img/ed_logoDark.png";
        this.classSubmenu = "sub-menuDark";

        this.menuItems.forEach(menu => {
          if (menu.children != undefined) {
            var children = menu.children.filter(
              data => data.path == this.router.url
            );
            if (children.length != 0) {
              if (children[0].parent == menu.title) {
                if (menu.title == this.itemsDashboard[0].label) {
                  this.itemsDashboard.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activeDark";
                      }
                    });
                  });
                } else if (menu.title == this.itemsAlarm[0].label) {
                  this.itemsAlarm.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activeDark";
                      }
                    });
                  });
                } else if (menu.title == this.itemsTask[0].label) {
                  this.itemsTask.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activeDark";
                      }
                    });
                  });
                } else if (menu.title == this.itemsUser[0].label) {
                  this.itemsUser.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activeDark";
                      }
                    });
                  });
                } else if (menu.title == this.itemsTHROUGHPUT[0].label) {
                  // console.log('hi')
                  this.itemsTHROUGHPUT.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activeDark";
                      }
                    });
                  });
                } else if (menu.title == this.itemsMANAGEDEVICE[0].label) {
                  this.itemsMANAGEDEVICE.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activeDark";
                      }
                    });
                  });
                } else if (menu.title == this.itemsCustomer[0].label) {
                  this.itemsCustomer.forEach(data => {
                    data.items.forEach(value => {
                      if (value.label == children[0].title) {
                        value.styleClass = "activeDark";
                      }
                    });
                  });
                }
              }
            }
          }
        });
      }
    });
    var classicon = this.menuItems.filter(data => data.path == this.router.url);
    if (classicon.length != 0) {
      classicon[0].icon = classicon[0].icon.replace(".png", "-active.png");
    } else {
      this.menuItems.forEach(menu => {
        if (menu.children != undefined) {
          var children = menu.children.filter(
            data => data.path == this.router.url
          );

          if (children.length != 0) {
            if (children[0].parent == menu.title) {
              const subArr = menu.icon.includes("-active.png");
              if (subArr != true) {
                menu.icon = menu.icon.replace(".png", "-active.png");
              }
              if (menu.hidden == true) {
                menu.icon_drop = "fa fa-caret-up";
              }
              menu.class = "ng-star-inserted active";
            }
          } else {
            // console.log(menu)
            if (menu.hidden == true) {
              menu.hidden = false;
              menu.icon_drop = "fa fa-caret-down";
            }
            menu.icon = menu.icon.replace("-active.png", ".png");
            menu.class = "ng-star-inserted";
          }
        } else {
          menu.icon = menu.icon.replace("-active.png", ".png");
          menu.class = "ng-star-inserted";
        }
      });
    }
    this.AdminLayoutService.sideiconMessage.subscribe(data => {
      if (data == "devicelist") {
        const substr = "-active.png";
        const subArr = this.menuItems.filter(str => str.icon.includes(substr));
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.menuItems.forEach(menu => {
          if (menu.hidden == true) {
            menu.hidden = false;
            menu.icon_drop = "fa fa-caret-down";
          }
        });
        // console.log(subArr)

        if (subArr.length != 0) {
          subArr[0].icon = subArr[0].icon.replace("-active.png", ".png");
          subArr[0].class = "ng-star-inserted";
        }
      } else if (data == "Line Group") {
        var subArr = this.menuItems.filter(
          data => data.title == "LINE MANAGEMENT"
        );
        const substrs = "-active.png";
        const subArrs = this.menuItems.filter(str =>
          str.icon.includes(substrs)
        );
        if (subArrs.length != 0) {
          subArrs[0].icon = subArrs[0].icon.replace("-active.png", ".png");
          subArrs[0].class = "ng-star-inserted";
        }
        subArr[0].icon = subArr[0].icon.replace(".png", "-active.png");
        subArr[0].class = "ng-star-inserted active";
      } else if (data == "Task") {
        var subArr = this.menuItems.filter(data => data.title == "TASK");
        const substrs = "-active.png";
        const subArrs = this.menuItems.filter(str =>
          str.icon.includes(substrs)
        );
        if (subArrs.length != 0) {
          subArrs[0].icon = subArrs[0].icon.replace("-active.png", ".png");
          subArrs[0].class = "ng-star-inserted";
        }
        subArr[0].icon = subArr[0].icon.replace(".png", "-active.png");
        subArr[0].class = "ng-star-inserted active";
        subArr[0].hidden = true;
        subArr[0].icon_drop = "fa fa-caret-up";
        if (this.themeService.theme == "saga-orange") {
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              if (value.label == "TASK MANAGEMENT") {
                value.styleClass = "activelight";
              } else {
                value.styleClass = "";
              }
            });
          });
        } else {
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              if (value.label == "TASK MANAGEMENT") {
                value.styleClass = "activeDark";
              } else {
                value.styleClass = "";
              }
            });
          });
        }
      } else if (data == "Alarm") {
        var subArr = this.menuItems.filter(data => data.title == "ALARM");
        const substrs = "-active.png";
        const subArrs = this.menuItems.filter(str =>
          str.icon.includes(substrs)
        );
        if (subArrs.length != 0) {
          subArrs[0].icon = subArrs[0].icon.replace("-active.png", ".png");
          subArrs[0].class = "ng-star-inserted";
        }
        subArr[0].icon = subArr[0].icon.replace(".png", "-active.png");
        subArr[0].class = "ng-star-inserted active";
        subArr[0].hidden = true;
        subArr[0].icon_drop = "fa fa-caret-up";
        if (this.themeService.theme == "saga-orange") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              if (value.label == "ALARM TRAP HISTORY") {
                value.styleClass = "activelight";
              } else {
                value.styleClass = "";
              }
            });
          });
        } else {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              if (value.label == "ALARM TRAP HISTORY") {
                value.styleClass = "activeDark";
              } else {
                value.styleClass = "";
              }
            });
          });
        }
      }
    });
    if (window.innerWidth > 1800) {
      this.AdminLayoutService.currentsidebarMessage.subscribe(data => {
        // console.log(data)
        if (data == "sidebar") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          this.onResize();
        } else if (data == "sidebar-mini") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          this.onResize();
        } else if (data == "Defult") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          this.onResize();
          // console.log(data)
        }
      });
    } else {
      this.AdminLayoutService.currentsidebarMessage.subscribe(data => {
        if (data == "sidebar") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          this.onResize();
        } else if (data == "sidebar-mini") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          this.onResize();
        } else if (data == "Defult") {
          this.showMinimenu = true;
          this.showMainmenu = false;
          this.onResize();
          // console.log(data)
        }
      });
    }
  }

  findDuplicates = arr => {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here.

    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  };

  toggleMenu(value) {}
  link1(title, subtitle, path) {
    var currentURL = this.router.url;
    var s = this.menuItems.filter(data => data.path == currentURL);
    if (s.length > 0) {
      var indexs = this.menuItems.findIndex(data => data.title == s[0].title);
      this.menuItems[indexs].class = "";
    }
    this.AdminLayoutService.sideiconClass("Defult");
    const substr = "-active.png";
    const subArr = this.menuItems.filter(str => str.icon.includes(substr));

    if (subtitle == "DASHBOARD") {
      this.AdminLayoutService.addOrderBox("/dashboard");
    } else {
      if (title == "TOPOLOGY") {
        this.AdminLayoutService.addOrderBox("/topologymap");
      } else {
        if (subtitle == "THROUGHPUT TEST") {
          this.AdminLayoutService.addOrderBox("/throughput");
        } else {
          this.AdminLayoutService.addOrderBox("path");
        }
      }
    }
    if (subArr.length != 0) {
      if (subArr[0].title == title) {
      } else {
        var listmenu = this.menuItems.filter(str => str.title == title);
        if (listmenu.length != 0) {
          if (listmenu[0].children != undefined) {
            listmenu[0].icon = listmenu[0].icon.replace(".png", "-active.png");
            listmenu[0].class = "ng-star-inserted active";
            subArr[0].icon = subArr[0].icon.replace("-active.png", ".png");
            subArr[0].class = "ng-star-inserted";
          }
        }
      }
    } else {
      var listmenu = this.menuItems.filter(str => str.title == title);
      if (listmenu.length != 0) {
        if (listmenu[0].children != undefined) {
          listmenu[0].icon = listmenu[0].icon.replace(".png", "-active.png");
          listmenu[0].class = "ng-star-inserted active";
        }
      }
    }
    if (this.themeService.theme == "saga-orange") {
      if (title == "DASHBOARD") {
        if (this.role == "super admin") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }

        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "ALARM") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "TASK") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "USER MANAGEMENT") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "THROUGHPUT") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "MANAGE DEVICE") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activelight";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
      }
    } else {
      if (title == "DASHBOARD") {
        if (this.role == "super admin") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }

        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "ALARM") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "TASK") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "USER MANAGEMENT") {
        this.itemsDashboard.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsAlarm.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTask.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            value.styleClass = "";
          });
        });
        this.itemsUser.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "THROUGHPUT") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsTHROUGHPUT.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else if (title == "MANAGE DEVICE") {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
        this.itemsMANAGEDEVICE.forEach(data => {
          data.items.forEach(value => {
            if (value.label == subtitle) {
              value.styleClass = "activeDark";
            } else {
              value.styleClass = "";
            }
          });
        });
      } else {
        if (this.role == "super admin") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (this.role == "admin" || this.role == "monitor") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        }
      }
    }
  }
  link(event, value, title) {
    if (title == "เรียลไทม์") {
      this.navService.setNavId("/realtime1");
    } else if (title == "สถิติ") {
      this.navService.setNavId("/stats1");
    }
    event.preventDefault();
    this.AdminLayoutService.sideiconClass("Defult");
    this.menuItems.forEach(data => {
      if (data.title == title) {
        if (data.children != undefined) {
          if (data.hidden == false) {
            data.hidden = true;
            data.icon_drop = "fa fa-caret-up";
          } else {
            data.hidden = false;
            data.icon_drop = "fa fa-caret-down";
          }
        }
        const substr = "-active.png";
        const subArr = this.menuItems.filter(str => str.icon.includes(substr));
        // console.log(subArr)
        if (subArr.length != 0) {
          if (subArr[0].title == title) {
          } else {
            var listmenu = this.menuItems.filter(str => str.title == title);
            if (listmenu.length != 0) {
              if (listmenu[0].children == undefined) {
                this.router.navigate([value]);
                if (title == "TOPOLOGY") {
                  this.AdminLayoutService.addOrderBox("/topologymap");
                } else if (title == "DASHBOARD") {
                  this.AdminLayoutService.addOrderBox("/dashboard");
                } else {
                  this.AdminLayoutService.addOrderBox("path");
                }
                listmenu[0].icon = listmenu[0].icon.replace(
                  ".png",
                  "-active.png"
                );
                listmenu[0].class = "ng-star-inserted active";
                subArr[0].icon = subArr[0].icon.replace("-active.png", ".png");
                subArr[0].class = "ng-star-inserted";
              }
            }
          }
        } else {
          var listmenu = this.menuItems.filter(str => str.title == title);
          if (listmenu.length != 0) {
            if (listmenu[0].children == undefined) {
              this.router.navigate([value]);
              if (title == "TOPOLOGY") {
                this.AdminLayoutService.addOrderBox("/topologymap");
              } else {
                this.AdminLayoutService.addOrderBox("path");
              }
              listmenu[0].icon = listmenu[0].icon.replace(
                ".png",
                "-active.png"
              );
              listmenu[0].class = "ng-star-inserted active";
              // subArr[0].icon = subArr[0].icon.replace("-active.png", ".png");
              // subArr[0].class = "ng-star-inserted";
            }
          }
        }
      } else {
        // console.log('hi')
        if (data.hidden == true) {
          data.hidden = false;
          data.icon_drop = "fa fa-caret-down";
        }
      }
    });
    if (value != undefined) {
      if (this.themeService.theme == "saga-orange") {
        if (title == "DASHBOARD") {
          if (this.role == "super admin") {
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        } else if (title == "ALARM") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (title == "TASK") {
          if (this.role == "super admin") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        } else if (title == "USER MANAGEMENT") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (title == "THROUGHPUT") {
          if (this.role == "super admin") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        } else if (title == "MANAGE DEVICE") {
          if (this.role == "super admin") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        } else {
          if (this.role == "super admin") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        }
      } else {
        if (title == "DASHBOARD") {
          if (this.role == "super admin") {
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        } else if (title == "ALARM") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsUser.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (title == "TASK") {
          if (this.role == "super admin") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        } else if (title == "USER MANAGEMENT") {
          this.itemsDashboard.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsAlarm.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTask.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsTHROUGHPUT.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
          this.itemsMANAGEDEVICE.forEach(data => {
            data.items.forEach(value => {
              value.styleClass = "";
            });
          });
        } else if (title == "THROUGHPUT") {
          if (this.role == "super admin") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        } else if (title == "MANAGE DEVICE") {
          if (this.role == "super admin") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        } else {
          if (this.role == "super admin") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsUser.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          } else if (this.role == "admin" || this.role == "monitor") {
            this.itemsDashboard.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsAlarm.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTask.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsTHROUGHPUT.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
            this.itemsMANAGEDEVICE.forEach(data => {
              data.items.forEach(value => {
                value.styleClass = "";
              });
            });
          }
        }
      }
    }
  }
  selectedMenu() {
    // console.log("hi")
    // this.AdminLayoutService.addOrderBox(this.router.url)
    // if (this.menuMini == true){
    //   this.AdminLayoutService.mainpanelClass("main-panelmini")
    //   this.AdminLayoutService.sidebarClass("sidebar-mini")
    //   this.menuMini = false;
    // } else {
    //   this.AdminLayoutService.mainpanelClass("main-panel")
    //   this.AdminLayoutService.sidebarClass("sidebar")
    // }
  }

  checkActiveState(givenLink) {
    // console.log("hi")
    if (this.router.url.indexOf(givenLink) === -1) {
      return false;
    } else {
      return true;
    }
  }
}
