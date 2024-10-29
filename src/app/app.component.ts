import { Component, Renderer2, HostBinding } from "@angular/core";
import { ThemeService } from "./theme.service";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"]
})
@HostBinding("class")
export class AppComponent {
  isLightTheme: boolean = true;
  isDarkTheme: boolean = false;
  theme = "light-theme";
  selectedTheme: string;
  showIcon: boolean = true;

  constructor(public themeService: ThemeService) {
    // Check if theme is saved in local storage, use saga-orange as default
    this.selectedTheme = localStorage.getItem("selectedTheme") || "saga-orange";
    this.themeService.switchTheme(this.selectedTheme);
    this.updateThemeStatus(this.selectedTheme);
  }

  ngOnInit() {
    this.themeService.currentThemefuc(localStorage.getItem("selectedTheme"));
    // Component initialization
  }

  changeTheme(theme: string) {
    this.themeService.switchTheme(theme);
    this.updateThemeStatus(theme);
    this.themeService.Thememessagefuc(theme);
    // Save selected theme to local storage
    localStorage.setItem("selectedTheme", theme);
    // window.location.reload();
  }

  private updateThemeStatus(theme: string) {
    this.isDarkTheme = theme === "saga-orange";
    this.isLightTheme = theme === "arya-orange";
  }

  // export class AppComponent{
  static itemChange: any;
  static itemResize: any;
}
