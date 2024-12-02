import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { DividerModule } from "primeng/divider";
import { SidebarModules } from "@app/sidebar/sidebar.module";
import { FooterModule } from "@app/shared/footer/footer.module";
import { NavbarModule } from "@app/shared/navbar/navbar.module";
import { FixedPluginModule } from "@app/shared/fixedplugin/fixedplugin.module";

import { AppComponent } from "@app/app.component";
import { AppRoutes } from "@app/app.routing";
import { CommonModule } from "@angular/common";
import { AdminLayoutComponent } from "@app/layouts/admin-layout/admin-layout.component";

import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { WebsocketService } from "@app/serviec/websocket.service";
import { DailyScheduleComponent } from "@app/pages/appdition-component/daily-schedule/daily-schedule.component";
import { MonthlyScheduleComponent } from "@app/pages/appdition-component/monthly-schedule/monthly-schedule.component";
import { CrudComponent } from "@app/pages/crud/crud.component";
import { LoginComponent } from "@app/login/login.component";
import { JwtModule } from "@auth0/angular-jwt";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { AuthService } from "@app/auth.service";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { CheckboxModule } from "primeng/checkbox";
import { environment } from "environments/environment";
import { ToastModule } from "primeng/toast";
import { CardModule } from "primeng/card";
import { ZtpComponent } from "./ztp/ztp.component";
import { RightMenuComponent } from "./shared/rightMenu/rightMenu.component";
import { rightMenuService } from "@app/shared/rightMenu/rightMenu.service";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { ToolbarModule } from "primeng/toolbar";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenuModule } from "primeng/menu";
import { RippleModule } from "primeng/ripple";
import { enableRipple } from "@syncfusion/ej2-base";
// import { GridsterModule } from "angular-gridster2";
import { DropDownButtonModule } from "@syncfusion/ej2-angular-splitbuttons";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { KeyFilterModule } from "primeng/keyfilter";

import { ScrollPanelModule } from "primeng/scrollpanel";
// import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { SidebarModule } from "primeng/sidebar";
import { HighchartsChartModule } from "highcharts-angular";
import { SharedModule } from "@app/shared/shared.module";
import { ChartModule } from "primeng/chart";
import { ServiceStatusHeaderComponent } from "./service-status-header/service-status-header.component";
// import { ManagedeviceotherComponent } from './pages/managedeviceother/managedeviceother.component';

enableRipple(true);

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    CrudComponent,
    LoginComponent,
    RightMenuComponent

    // ManagedeviceotherComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true,
      relativeLinkResolution: "legacy"
    }),
    SidebarModules,
    SharedModule,
    CommonModule,
    SidebarModule,
    DropDownButtonModule,
    HighchartsChartModule,
    RippleModule,
    MenuModule,
    SplitButtonModule,
    ToolbarModule,
    ScrollPanelModule,
    DropdownModule,
    ButtonModule,
    MultiSelectModule,
    TableModule,
    InputTextModule,
    DialogModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    HttpClientModule,
    DividerModule,
    MessagesModule,
    CardModule,
    MessageModule,
    ToastModule,
    CheckboxModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    InputMaskModule,
    InputNumberModule,
    KeyFilterModule,
    // ChartModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("token");
        },
        // headerName: "jwtToken",
        allowedDomains: environment.allowedDomains
        //headerName: "WWW-Authenticate",
      }
    })
  ],
  providers: [WebsocketService, MessageService, rightMenuService],
  bootstrap: [AppComponent]
})
export class AppModule {}
