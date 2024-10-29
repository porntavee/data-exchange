import { DOCUMENT } from "@angular/common";
import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  theme = "light-theme";
  themestrlink: any;
  primaryColor: string = "#eeeeee";
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  private messagecolorSource = new BehaviorSubject(undefined);
  currentcolorMessage = this.messagecolorSource.asObservable();
  private messageSource1 = new BehaviorSubject(undefined);
  currentMessage1 = this.messageSource1.asObservable();
  private Thememessage: any;

  currentTheme: any;
  constructor(@Inject(DOCUMENT) private document: Document) {}

  private themeSubject = new BehaviorSubject<string>("light-theme");

  getTheme(): Observable<string> {
    return this.themeSubject.asObservable();
  }
  
  setTheme(theme: string): void {
    this.themeSubject.next(theme);
  }

  switchTheme(theme: string) {
    this.theme = theme;
    this.setTheme(theme);
    let themeLink = this.document.getElementById(
      "app-theme"
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + ".css";
      themeLink.type = "text/css";
    }
    switch (theme) {
      case "arya-orange":
        this.primaryColor = "red";
        break;
      case "saga-orange":
        this.primaryColor = "blue";
        break;
      default:
        this.primaryColor = "#eeeeee";
        break;
    }

    this.messagecolorSource.next(theme);
    localStorage.setItem("selectedThemeforDashboard", theme);
  }
  currentpage(page) {
    this.messageSource.next(page);
  }
  Thememessagefuc(theme) {
    this.Thememessage.next(theme);
  }
  currentThemefuc(theme) {
    this.Thememessage = new BehaviorSubject(theme);
    this.currentTheme = this.Thememessage.asObservable();
    // console.log(theme)
  }
}
