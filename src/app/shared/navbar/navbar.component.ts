import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse
} from "@angular/common/http";
import { environment } from "environments/environment";
import { ROUTES } from "@app/sidebar/sidebar.component";
import { BrowserModule, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { AuthService } from "app/auth.service";
import jwt_decode from "jwt-decode";
import { CompileShallowModuleMetadata } from "@angular/compiler";
import { MessageService, ConfirmationService } from "primeng/api";
import { error } from "protractor";
import { ThroughputService } from "@app/throughput.service";

import { ThemeService } from "app/theme.service";
import { AdminLayoutService } from "@app/layouts/admin-layout/admin-layout.service";
import { Password } from "primeng/password";
import { NavService } from "@app/nav.serive";
@Component({
  moduleId: module.id,
  selector: "navbar-cmp",
  templateUrl: "navbar.component.html",
  styleUrls: ["navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<string>();

  @ViewChild("passwordField") passwordField: Password;
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  private sidebarMenu: boolean = true;
  sycnDialog: boolean;
  throughputDialog: boolean;
  themeValue: string = this.themeService.theme;
  deviceSycnValue: string = "something";
  changePasswordDialog: boolean;
  submitted: boolean;
  oldPassword: string;
  newPassword: string;
  emailchange: string;
  emailchek: string;
  public gobalSearch = "";

  selectedLocalIP: string;
  localIP: string[];
  selectedRemoteIP: string;
  RemoteIP: string[];
  user_password: string = undefined;
  invinvalid3: string;
  userRole;
  private userID;
  private firstname;
  private lastname;
  private email;
  private created_at;
  private zone;
  private userUsername;
  spinner: boolean = false;
  checkcorrect: boolean = false;
  checkwrong: boolean = false;
  public isCollapsed = true;

  @ViewChild("navbar-cmp", { static: false }) button;
  sycnDeviceProgressBar: boolean;
  sycnDevicercviewProgressBar: boolean;
  passwordPattern =
    "^(?=.*[A-Z])(?=.*[!@#$%^&*+_])(?=.*[0-9])(?=.*[a-z]).{8,}$";
  patternNumber = /.*\d.*/;
  patternUppercase = /.*[A-Z].*/;
  patternLowerCase = /.*[a-z].*/;
  patternSpecialCase = /.*[!@#$%^&*+_].*/;
  isValid: boolean = false;
  showChangeEmail: boolean = false;
  showChangePassword: boolean = true;
  themestrlink: boolean = false;
  themestrlinkS: boolean = false;
  open: boolean = true;
  close: boolean = false;
  visibleSidebar1;
  list: any;
  styleClassTheme: any;
  HambergerIcon: boolean;
  correctedCharacters: string[] = [];
  correctedNumeric: string[] = [];
  correctedUpperCase: string[] = [];
  correctedLowerCase: string[] = [];
  correctedSpecial: string[] = [];


  listNav: any = [
    {
      'id': 1,
      'title': '-'
    }
  ];

  showbuttonSide:boolean = true;
  title:any;
  constructor(
    location: Location,
    private renderer: Renderer2,
    private element: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private throughputService: ThroughputService,
    private http: HttpClient,
    public themeService: ThemeService,
    private titleService: Title,
    private AdminLayoutService: AdminLayoutService,
    private elementRef: ElementRef,
    private navService: NavService
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    // this.sidebarVisible = false;
  }
  @HostListener("window:resize", ["$event"])
  ngOnInit() {
    if(window.innerWidth < 650){
      this.showbuttonSide = false;
    } else{
      this.showbuttonSide = true;
    }
    if (window.innerWidth > 1800) {
      this.AdminLayoutService.currentsidebarMessage.subscribe(data => {
        if (data == "Defult") {
          this.HambergerIcon = true;
        }
      });
      this.sidebarVisible = false;
    } else {
      this.sidebarVisible = true;
      this.AdminLayoutService.currentsidebarMessage.subscribe(data => {
        if (data == "Defult") {
          this.HambergerIcon = false;
        }
      });
    }
   
    this.localIP = ["192.23", "4123"];
    let userdata = jwt_decode(localStorage.getItem("token"));
    this.userRole = userdata["role"];
    // this.userID = userdata["id"];
    this.userUsername = userdata["username"];
    var children = ROUTES.map(data => data["children"]);
    var listTitle = ROUTES.filter(listTitle => listTitle);
    var listTitlefilter = listTitle.filter(data => data.children == undefined);
    var arr: any[] = [];
    var list = arr.concat(...children);
    var list2 = list.concat(...listTitlefilter);
    this.listTitles = list2.filter(data => data != undefined);
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    // this.router.events.subscribe(event => {
    //   this.sidebarClose();
    // });
    //  this.getTitle()
    this.themeService.currentcolorMessage.subscribe(value => {
      if (value == "saga-orange") {
        this.styleClassTheme =
          "navbar  navbar-expand-lg navbar-absolute fixed-top navbar-saga";
      } else {
        this.styleClassTheme =
          "navbar  navbar-expand-lg navbar-absolute fixed-top navbar-arya";
      }
    });
    const titlee = this.location.prepareExternalUrl(this.location.path());
    this.title = titlee.charAt(0) === "#" ? titlee.slice(1) : titlee;
  }
  isCurrentPage(page: string): boolean {
    return this.router.url === page;
  }
  onNavClick(navId: string){
    // ค้นหา element ที่ถูกคลิก
    
    const titlee = this.location.prepareExternalUrl(this.location.path());
    const sanitizedTitle = titlee.charAt(0) === "#" ? titlee.slice(1) : titlee;
    const element = document.querySelector(`.nav-item-${navId}`);
    if (element) {
      element.classList.add('blink-effect');
  
      // ลบ class หลังจากแสดง animation เสร็จ
      setTimeout(() => {
        element.classList.remove('blink-effect');
      }, 1000);  // 1000 milliseconds = 1 second
    }
    // ปรับปรุง navId
    this.navService.setNavId(sanitizedTitle + navId || sanitizedTitle + '1');

    // ส่งการคลิกไปยัง component อื่น
    this.navigationClick.emit(navId || sanitizedTitle + '1');

  }

  hideMeter(event: Event) {
    event.preventDefault(); // Prevent the default "Escape" key behavior
    const passwordMeter = this.elementRef.nativeElement.querySelector(
      ".p-password-meter"
    );
    if (passwordMeter) {
      passwordMeter.style.display = "none"; // Hide the password strength meter
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    
    if (titlee == '/realtime')
    {
       this.listNav = [
        {
          'id': 1,
          'title': 'สภาพการจราจร'
        },
        {
          'id': 2,
          'title': 'เปรียบเทียบ'
        },
        {
          'id': 3,
          'title': 'ที่จอดรถ'
        },
        {
          'id': 4,
          'title': 'สถานะเซ็นเซอร์'
        }
      ];
    }
    else if (titlee == '/stats')
      {
         this.listNav = [
          {
            'id': 1,
            'title': 'การจัดการอุบัติการณ์'
          },
          {
            'id': 2,
            'title': 'ความถี่การเกิดอุบัติเหตุ'
          },
          {
            'id': 3,
            'title': 'อัตรารถผ่านด่าน'
          },
          {
            'id': 4,
            'title': 'จุด Black Spot'
          },
          {
            'id': 5,
            'title': 'จำนวนผู้ใช้'
          },
          {
            'id': 6,
            'title': 'รายงาน'
          }
        ];
      }
    else
    {
      this.listNav = [
        {
          'id': 1,
          'title': ''
        },
        {
          'id': 2,
          'title': ''
        },
        {
          'id': 3,
          'title': ''
        },
        {
          'id': 4,
          'title': ''
        }
      ];
    }
    

    // for (var item = 0; item < this.listTitles.length; item++) {
    //   if (this.listTitles[item].path === titlee) {
    //     return this.listTitles[item].title;
    //   }
    // }
    titlee = titlee.split("?")[0];
    // console.log(titlee)
    // this.themeService.currentpage(titlee)
    if (titlee == "/device") return "Device view";
    else if (titlee == "/devicelist") return "Device List";
    else if (titlee == "/Dailysentalarm") return "Daily sent alarm";
    else if (titlee == "/points-interest") return "จุดสนใจ";
    else if (titlee == "/realtime") return "เรียลไทม์";
    else if (titlee == "/stats") return "สถิติ";
    return "Dashboard";
  }

  sidebarToggle() {
    if (window.innerWidth > 1800) {
      if (this.sidebarVisible === false) {
        this.sidebarCloseMain();
      } else {
        this.sidebarOpenMain();
      }
    } else {
      if (this.sidebarVisible === false) {
        this.sidebarClose();
      } else {
        this.sidebarOpen();
      }
    }
  }

  checkPassword() {
    if (this.newPassword.match(this.passwordPattern)) {
      this.isValid = true;
      this.invinvalid3 = "";
    } else {
      this.isValid = false;
      this.invinvalid3 = "ng-invalid ng-dirty";
    }
    console.log(this.newPassword);
    if (this.newPassword.length >= 8) {
      this.correctedCharacters = ["val1"];
    } else {
      this.correctedCharacters = [];
    }
    if (this.newPassword.match(this.patternNumber)) {
      this.correctedNumeric = ["val2"];
    } else {
      this.correctedNumeric = [];
    }
    if (this.newPassword.match(this.patternUppercase)) {
      this.correctedUpperCase = ["val3"];
    } else {
      this.correctedUpperCase = [];
    }
    if (this.newPassword.match(this.patternLowerCase)) {
      this.correctedLowerCase = ["val4"];
    } else {
      this.correctedLowerCase = [];
    }
    if (this.newPassword.match(this.patternSpecialCase)) {
      this.correctedSpecial = ["val5"];
    } else {
      this.correctedSpecial = [];
    }
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName("html")[0];
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );

    this.AdminLayoutService.mainpanelClass("main-panelmini");
    this.AdminLayoutService.sidebarClass("sidebar-mini");
    this.AdminLayoutService.sidebarminiClass("sidebar");
    this.AdminLayoutService.sidebarminiSClass("sidebar");
    html.classList.add("nav-open");
    // if (window.innerWidth < 991) {
    //   mainPanel.style.position = "fixed";
    // }
    this.sidebarVisible = false;
    this.HambergerIcon = true;
  }
  sidebarOpenMain() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName("html")[0];
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );

    this.AdminLayoutService.mainpanelClass("main-panelmini");
    this.AdminLayoutService.sidebarClass("sidebar-mini");
    this.AdminLayoutService.sidebarminiSClass("sidebar");
    this.AdminLayoutService.sidebarminiClass("sidebar");
    html.classList.add("nav-open");
    // if (window.innerWidth < 991) {
    //   mainPanel.style.position = "fixed";
    // }
    this.sidebarMenu = true;
    this.sidebarVisible = false;
    this.HambergerIcon = true;
    // this.sidebarVisible = true;
  }
  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panelmini")[0]
    );
    // if (window.innerWidth < 991) {
    //   setTimeout(function() {
    //     mainPanel.style.position = "";
    //   }, 500);
    // }
    this.AdminLayoutService.mainpanelClass("main-panel");
    this.AdminLayoutService.sidebarClass("sidebar");
    this.AdminLayoutService.sidebarminiClass("sidebar-mini");
    this.AdminLayoutService.sidebarminiSClass("sidebar-mini");
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = true;
    html.classList.remove("nav-open");
    this.HambergerIcon = false;
  }
  sidebarCloseMain() {
    const html = document.getElementsByTagName("html")[0];
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );
    // if (window.innerWidth < 991) {
    //   setTimeout(function() {
    //     mainPanel.style.position = "";
    //   }, 500);
    // }
    this.AdminLayoutService.mainpanelClass("main-panel");
    this.AdminLayoutService.sidebarClass("sidebar");
    this.AdminLayoutService.sidebarminiSClass("sidebar-mini");
    this.AdminLayoutService.sidebarminiClass("sidebar-mini");
    this.toggleButton.classList.remove("toggled");
    this.sidebarMenu = false;
    this.sidebarVisible = true;
    html.classList.remove("nav-open");
    this.HambergerIcon = false;
  }
  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName("nav")[0];
    if (!this.isCollapsed) {
      navbar.classList.remove("navbar-transparent");
      navbar.classList.add("bg-white");
    } else {
      navbar.classList.add("navbar-transparent");
      navbar.classList.remove("bg-white");
    }
  }

  logout() {
    this.authService.logout();
    this.AdminLayoutService.sideiconClass("logout")
    this.AdminLayoutService.mainpanelClass("Defult")
    this.AdminLayoutService.sidebarClass("Defult")
    this.AdminLayoutService.sidebarminiSClass("Defult")
    this.AdminLayoutService.sidebarminiClass("Defult")
    this.titleService.setTitle("SED");
  }

  searchGobalData(event) {
    this.AdminLayoutService.sideiconClass("devicelist");
    event.preventDefault();
    this.router.navigate(["/devicelist"], {
      queryParams: { search: this.gobalSearch }
    });
    this.themeService.currentpage("/devicelist");
    this.gobalSearch = "";
    this.AdminLayoutService.addOrderBox("path")
    if(window.innerWidth < 992){
    this.isCollapsed = !this.isCollapsed;
    }
    //select * from topo_mainview_symbol where SYMBOL_NAME1 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV' union select * from topo_mainview_symbol where SYMBOL_NAME3 like '10.218%' and RES_TYPE_NAME!='REMOTE_DEV'
  }

  hideChangePasswordDialog() {
    this.changePasswordDialog = false;
    this.submitted = false;
    this.user_password = undefined;
    this.oldPassword = undefined;
    this.newPassword = undefined;
    this.emailchange = undefined;
    this.emailchek = undefined;
    this.spinner = false;
    this.checkcorrect = false;
    this.checkwrong = false;
    this.invinvalid3 = "";
    this.isValid = false;
    this.showChangePassword = true;
    // this.isCollapsed = !this.isCollapsed;
  }

  openChangePasswordDialog() {
    this.changePasswordDialog = true;
    if(window.innerWidth < 992){
      this.isCollapsed = !this.isCollapsed;
      }
  }

  switchToChangeEmail() {
    this.showChangePassword = false;
    this.showChangeEmail = true;
    this.user_password = undefined;
    this.newPassword = undefined;
    this.oldPassword = undefined;
    let passwordLabel = document.getElementById("passwordLabel");
    let emailLabel = document.getElementById("emailLabel");
    emailLabel.style.color = "#FFD54F";
    emailLabel.style.textDecoration = "underline #FFD54F";
    // emailLabel.style.textDecorationThickness = "2px";
    emailLabel.style.textUnderlinePosition = "under";
    // passwordLabel.style.textDecoration = 'underline blue';
    passwordLabel.style.color = "";
    passwordLabel.style.textDecoration = "";
  }

  switchToChangePassword() {
    this.showChangePassword = true;
    this.showChangeEmail = false;
    this.emailchange = undefined;
    this.emailchek = undefined;
    // this.user_password = undefined;
    // this.newPassword = undefined;
    // this.oldPassword = undefined;
    let passwordLabel = document.getElementById("passwordLabel");
    let emailLabel = document.getElementById("emailLabel");
    passwordLabel.style.color = "#FFD54F";
    emailLabel.style.color = "";
    passwordLabel.style.textDecoration = "underline #FFD54F";
    passwordLabel.style.textUnderlinePosition = "under";
    emailLabel.style.textDecoration = "";
  }

  changeEmailPassword() {
    this.submitted = true;
 
    // if (
    //   this.oldPassword == undefined &&
    //   this.newPassword == undefined &&
    //   this.emailchange == undefined &&
    //   this.emailchek == undefined &&
    //   this.user_password == undefined
    // ) {
    //   this.messageService.add({
    //     severity: "error",
    //     summary: "Failed",
    //     detail: "Please, fill in the field(s) before save",
    //     life: 3000
    //   });
    //   this.messageService.add({
    //     severity: "error",
    //     summary: "Failed",
    //     detail:
    //       "Please, Input old password and new password and confirm password to change a new one",
    //     life: 3000
    //   });
    // }
    if (
      this.oldPassword != undefined &&
      this.oldPassword != "" &&
      this.emailchange == undefined &&
      this.emailchek == undefined
    ) {
      if (this.newPassword != undefined && this.user_password != undefined) {
        if (this.newPassword !== this.user_password) {
          this.messageService.add({
            severity: "error",
            summary: "Failed",
            detail: "Confirm password doesn't match, Please try again",
            life: 3000
          });
        } else {
          if (this.newPassword != undefined && this.isValid == true) {
            this.spinner = true;
            this.authService
              .verifyPassword(this.oldPassword)
              .subscribe(result => {
                if (result.detail === "Pass") {
                  this.spinner = false;
                  this.checkcorrect = true;
                  this.checkwrong = false;
                  this.confirmationService.confirm({
                    message: "Are you sure you want to change the password",
                    header: "Confirm",
                    icon: "pi pi-exclamation-triangle",
                    accept: () => {
                      this.authService
                        .changePassword(this.userID, this.newPassword)
                        .subscribe(result => {
                          this.changePasswordDialog = false;
                          this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: "The password has been changed",
                            life: 3000
                          });
                        });
                    }
                  });
                } else {
                  this.checkcorrect = false;
                  this.spinner = false;
                  this.checkwrong = true;
                  this.messageService.add({
                    severity: "error",
                    summary: "Failed",
                    detail: "Old password doesn't match, Please try again",
                    life: 3000
                  });
                }
              });
          } else if (this.newPassword != undefined && this.isValid == false) {
            this.messageService.add({
              severity: "error",
              summary: "Failed",
              detail: "Please check your password pettern again!!",
              life: 3000
            });
          }
        }
      }
    }
    // else if(this.emailchek == undefined &&
    //   this.emailchange == undefined){

    // }
    else if (
      this.oldPassword == undefined &&
      this.emailchek != undefined &&
      this.emailchange != undefined
    ) {
      if (this.emailchange !== this.emailchek) {
        this.messageService.add({
          severity: "error",
          summary: "Failed",
          detail: "Confirm Email doesn't match, Please try again",
          life: 3000
        });
      } else if (
        this.emailchange == this.emailchek &&
        this.emailchange !== "" &&
        this.emailchek !== ""
      ) {
        this.authService.changeEmail(this.userID, this.emailchange).subscribe(
          result => {
            this.changePasswordDialog = false;
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "The Email has been changed",
              life: 3000
            });
          },
          error => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error, try again!",
              life: 3000
            });
          }
        );
      }
    } else if (
      this.oldPassword == undefined &&
      this.newPassword == undefined &&
      this.emailchange == undefined
    ) {
      this.messageService.add({
        severity: "error",
        summary: "Failed",
        detail: "Please, fill the required form input",
        life: 3000
      });
    }
    // else if (this.emailchange == undefined && this.emailchek == undefined) {
    //   this.messageService.add({
    //     severity: "error",
    //     summary: "Failed",
    //     detail: "Please,",
    //     life: 3000
    //   });
    // }
    else if (
      this.newPassword != undefined &&
      this.user_password != undefined &&
      this.oldPassword == undefined
    ) {
      this.messageService.add({
        severity: "error",
        summary: "Failed",
        detail: "Please enter old password !!",
        life: 3000
      });
    }
    if (
      this.oldPassword != undefined &&
      this.newPassword != undefined &&
      this.user_password != undefined &&
      this.emailchange != undefined &&
      this.emailchek != undefined
    ) {
      if (this.newPassword !== this.user_password) {
        this.messageService.add({
          severity: "error",
          summary: "Failed",
          detail: "Confirm password doesn't match, Please try again",
          life: 3000
        });
      }
      if (this.emailchange !== this.emailchek) {
        this.messageService.add({
          severity: "error",
          summary: "Failed",
          detail: "Confirm E-mail doesn't match, Please try again",
          life: 3000
        });
      }
    }
  }

  openSyncDialog() {
    this.sycnDialog = true;
    if(window.innerWidth < 992){
      this.isCollapsed = !this.isCollapsed;
      }
  }
  hideDialogEdit(){
    // this.isCollapsed = !this.isCollapsed;
  }
  sycnDevice() {
    this.sycnDeviceProgressBar = true;
    this.authService.syncDevice().subscribe(
      result => {
        this.sycnDeviceProgressBar = false;
      },
      error => {}
    );
  }
  sycn_rcviewDevice() {
    this.sycnDevicercviewProgressBar = true;
    this.authService.sycn_rcviewDevice().subscribe(
      result => {
        this.sycnDevicercviewProgressBar = false;
      },
      error => {}
    );
  }
  openThroughputDialog() {
    if (this.throughputService.issetLocalDevice) {
      //this.selectedLocalIP = this.throughputService.getLocalDevice;
    }
    if (this.throughputService.issetRemoteDevice) {
    }
    this.throughputDialog = true;
  }

  onChangeLocalIP() {
    //TODO call api after select local ip
  }

  cfmTest() {
    //TODO call CFM
  }

  throughputTest() {
    //TODO call throughput
  }
}
