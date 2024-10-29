import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild
  , NgZone
} from "@angular/core";
import { Router } from "@angular/router";
import { AdminLayoutService } from "@app/layouts/admin-layout/admin-layout.service";
import { NavService } from "@app/nav.serive";
import { ThemeService } from "app/theme.service";
import { Location } from "@angular/common";
@Component({
  selector: "app-admin-layout",
  templateUrl: "admin-layout.component.html",
  styleUrls: ["admin-layout.component.scss"]
})
export class AdminLayoutComponent implements OnInit {
  @ViewChild("commentList") commentList: ElementRef;
  classsidebar: any;
  classMenu: any;
  classMain: any;
  location: Location;
  themeValue: string = this.themeService.theme;
  styleClassTheme: any;
  innerWidth;
  scrollDown: number;
  constructor(
    location: Location,
    private zone: NgZone,
    public themeService: ThemeService,
    private router: Router,
    private AdminLayoutService: AdminLayoutService,
    private navService: NavService
  ) {
    this.location = location;
  }
  @HostListener("window:resize", ["$event"])
  onResizemain() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 1800) {
      this.AdminLayoutService.currentsidebarMessage.subscribe(value => {
        // console.log(value)
        if (value == "sidebar") {
          this.classMenu = "sidebar-mini";
          this.classMain = "main-panelmini";
        } else if (value == "sidebar-mini") {
          this.classMenu = "sidebar";
          this.classMain = "main-panel";
        } else {
          this.classMenu = "sidebar";
          this.classMain = "main-panel";
        }
        this.classBodyX = false;
      });
    } else {
      this.AdminLayoutService.currentsidebarMessage.subscribe(value => {
        if (value == "sidebar") {
          this.classMenu = "sidebar-mini";
          this.classMain = "main-panelmini";
        } else if (value == "sidebar-mini") {
          this.classMenu = "sidebar";
          this.classMain = "main-panel";
        } else {
          this.classMenu = "sidebar-mini";
          this.classMain = "main-panelmini";
        }
        if (this.innerWidth > 1500) {
          if (this.valueClass == "/topologymap") {
            this.classBodyX = true;
          } else {
            this.classBodyX = false;
          }
        } else {
          if (this.valueClass == "/throughput") {
            this.classBodyX = true;
          }
        }
      });
    }
  }
  onResizemaini() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 1800) {
      this.AdminLayoutService.currentsidebarMessage.subscribe(value => {
        // console.log(value)
        if (value == "sidebar") {
          this.classMenu = "sidebar-mini";
          this.classMain = "main-panelmini";
        } else if (value == "sidebar-mini") {
          this.classMenu = "sidebar";
          this.classMain = "main-panel";
        } else {
          this.classMenu = "sidebar";
          this.classMain = "main-panel";
        }
      });
    } else {
      this.AdminLayoutService.currentsidebarMessage.subscribe(value => {
        // console.log(value)
        if (value == "sidebar") {
          this.classMenu = "sidebar-mini";
          this.classMain = "main-panelmini";
        } else if (value == "sidebar-mini") {
          this.classMenu = "sidebar";
          this.classMain = "main-panel";
        } else {
          this.classMenu = "sidebar-mini";
          this.classMain = "main-panelmini";
        }
      });
    }
  }
  ngOnInit() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    // console.log(titlee)
    this.navService.setNavId(titlee + '1');
    if (this.themeService.theme == "saga-orange") {
      this.styleClassTheme = "theme-saga";
    } else {
      this.styleClassTheme = "theme-arya";
    }

    if (window.innerWidth > 1800) {
      this.AdminLayoutService.currentmainpanelMessage.subscribe(data => {
        // console.log(data)
        if (data == "main-panel") {
          this.classMain = "main-panel";
        } else if (data == "main-panelmini") {
          this.classMain = "main-panelmini";
        } else {
          this.classMain = "main-panel";
        }
      });

      this.AdminLayoutService.currentsidebarMessage.subscribe(data => {
        // console.log(data)
        if (data == "sidebar") {
          this.classMenu = "sidebar";
        } else if (data == "sidebar-mini") {
          this.classMenu = "sidebar-mini";
        } else {
          this.classMenu = "sidebar";
          this.onResizemain();
          // this.onResize();
        }
      });
    } else {
      this.AdminLayoutService.currentmainpanelMessage.subscribe(data => {
        // console.log(data)
        if (data == "main-panel") {
          this.classMain = "main-panel";
        } else if (data == "main-panelmini") {
          this.classMain = "main-panelmini";
        } else {
          this.classMain = "main-panelmini";
        }
      });

      this.AdminLayoutService.currentsidebarMessage.subscribe(data => {
        // console.log(data)
        if (data == "sidebar") {
          this.classMenu = "sidebar";
        } else if (data == "sidebar-mini") {
          this.classMenu = "sidebar-mini";
        } else {
          this.classMenu = "sidebar-mini";
          this.onResizemaini();
        }
      });
    }
  }

  handleNavigationClick(navId: string): void {
    event.stopPropagation();
    // ทำสิ่งที่ต้องการที่นี่ เช่น การเปลี่ยนแปลง class หรืออัปเดตข้อมูลอื่นๆ
    console.log('Navigation clicked:', navId);
    this.navService.setNavId(this.valueClass + navId ?? '/realtime1');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.renderWidgetInsideWidgetContainer();
    }, 0);
  }
  classBodyX: boolean = false;
  valueClass: any;
  classBodyXdevice: boolean = false;
  renderWidgetInsideWidgetContainer() {
    this.AdminLayoutService.currentMessage.subscribe(value => {
      this.valueClass = value;
      const civicNumber = value
        .toString()
        .substring(0, value.toString().indexOf("?"));
      if (value == "/dashboard" || value == "/servicestatus") {
        this.classsidebar = "wrapperhidden";
        this.scrollDown = this.commentList.nativeElement.scrollTop = 0;
      } else {
        this.classsidebar = "wrapper";
        this.scrollDown = this.commentList.nativeElement.scrollTop = 0;
      }

      if (value == "/topologymap") {
        this.classBodyX = true;
      } else if (value == "/throughput") {
        this.onResizemain();
      } else {
        this.classBodyX = false;
      }

      if (civicNumber == "/device" || value == "/device") {
        this.classBodyXdevice = true;
      } else {
        this.classBodyXdevice = false;
      }
    });
  }
}
