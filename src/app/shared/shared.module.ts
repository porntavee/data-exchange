
import { CommonModule } from '@angular/common';
import { RealtimeComponent } from '@app/pages/realtime/realtime.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlarmComponent } from "@app/pages/alarm/alarm.component";
import { SplitterModule } from "primeng/splitter";
import { DashboardComponent } from "@app/pages/dashboard/dashboard.component";
import { UserComponent } from "@app/pages/user/user.component";
import { ReportComponent } from "@app/pages/report/report.component";
import { TaskComponent } from "@app/pages/task/task.component";
import { ScheduleComponent } from "@app/pages/schedule/schedule.component";
import { MapsComponent } from "@app/pages/maps/maps.component";
import { NotificationsComponent } from "@app/pages/notifications/notifications.component";
import { UpgradeComponent } from "@app/pages/upgrade/upgrade.component";
import { RemoteCommandComponent } from "@app/pages/remote-command/remote-command.component";
import { TopologyComponent } from "@app/pages/topology/topology.component";
import { ProductService } from "@app/productservice";
import { DeviceInformationComponent } from "@app/pages/device-information/device-information.component";
import { UserService } from "@app/userservice";
import { ScheduleTaskService } from "@app/pages/schedule/schedule.service";
import { TaskService } from "@app/task.service";
import { TaskReportService } from "@app/pages/report/report.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HighchartsChartModule } from "highcharts-angular";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { CalendarModule } from "primeng/calendar";
import { SliderModule } from "primeng/slider";
import { MultiSelectModule } from "primeng/multiselect";
import { ContextMenuModule } from "primeng/contextmenu";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { SelectButtonModule } from "primeng/selectbutton";
import { DropdownModule } from "primeng/dropdown";
import { ProgressBarModule } from "primeng/progressbar";
import { InputTextModule } from "primeng/inputtext";
import { FileUploadModule } from "primeng/fileupload";
import { ToolbarModule } from "primeng/toolbar";
import { RatingModule } from "primeng/rating";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputMaskModule } from "primeng/inputmask";
import { CheckboxModule } from "primeng/checkbox";
import { GMapModule } from "primeng/gmap";
import { TerminalModule } from "primeng/terminal";
import { PickListModule } from "primeng/picklist";
import { PasswordModule } from "primeng/password";
import { TreeModule } from "primeng/tree";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { NgTerminalModule } from "ng-terminal";
import { MapTopoService } from "@app/map-topology-service";
import { TopoService } from "@app/topology-service";
import { ImageModule } from "primeng/image";
import { ChipsModule } from "primeng/chips";
import { DividerModule } from "primeng/divider";
import { TimelineModule } from "primeng/timeline";
import { CardModule } from "primeng/card";
import { DailysendComponent } from "@app/pages/dailysend/dailysend.component";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { LineComponent } from "@app/pages/line/line.component";
import { UserZoneComponent } from "@app/pages/userzone/userzone.component";
import { LineGroupService } from "@app/linegroupservice";
import { NavigateService } from "@app/navigateservice";
import { InputSwitchModule } from "primeng/inputswitch";
import { LogComponent } from "@app/pages/log/log.component";
import { DeviceSearchComponent } from "@app/pages/device-search/device-search.component";
import { AccordionModule } from "primeng/accordion";
import { TopchartComponent } from "@app/pages/topchart/topchart.component";
import { ThroughputComponent } from "@app/pages/throughput/throughput.component";
import { ThroughputreportComponent } from "@app/pages/throughputreport/throughputreport.component";
import { TabViewModule } from "primeng/tabview";
import { SplitButtonModule } from "primeng/splitbutton";
import { RippleModule } from "primeng/ripple";
import { PanelModule } from "primeng/panel";
import { ProvisioningHistoryComponent } from "@app/pages/provisioning-history/provisioning-history.component";
import { ScriptTemplateComponent } from "@app/pages/script-template/script-template.component";
import { SnpmProfileService } from '@app/pages/snpm-profile/snpm-profile.service';
import { TopologyMapComponent } from "@app/pages/topology-map/topology-map.component";
import {GalleriaModule} from 'primeng/galleria';
import {KnobModule} from 'primeng/knob';
import { GridsterModule } from "angular-gridster2";
import { ManagedeviceauthenComponent } from "@app/pages/managedeviceauthen/managedeviceauthen.component";
import { ManagedeviceprofileComponent } from "@app/pages/managedeviceprofile/managedeviceprofile.component";
import { MenuModule } from 'primeng/menu';
import { RightMenuComponent } from '@app/shared/rightMenu/rightMenu.component';
import { ZtpComponent } from "@app/ztp/ztp.component";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { AppRoutes } from "@app/app.routing";
import { TieredMenuModule } from "primeng/tieredmenu";
import { SnpmProfileComponent } from '@app/pages/snpm-profile/snpm-profile.component';
import { AlarmProfileComponent } from '@app/pages/alarm-profile/alarm-profile.component';
import { AlarmProfileService } from '@app/pages/alarm-profile/alarm-profile.service';
import { ManagedeviceotherComponent } from '@app/pages/managedeviceother/managedeviceother.component';
import { AlatmhistoryComponent } from '@app/pages/alatmhistory/alatmhistory.component';
import { AlarmTrapHistoryComponent } from "@app/pages/alarm-trap-history/alarm-trap-history.component";
import { CustomerReportComponent } from "@app/pages/customer-report/customer-report.component";
import { CatidHistoryComponent } from "@app/pages/catid-history/catid-history.component";
import { TrafficmonthlyComponent } from '@app/pages/trafficmonthly/trafficmonthly.component';
import { DailysummaryComponent } from '@app/pages/dailysummary/dailysummary.component';
import { DeviceAvailabilityComponent } from '@app/pages/device-availability/device-availability.component';
import { ServicestatusComponent } from '@app/pages/servicestatus/servicestatus.component';
import { PointsInterestComponent } from "@app/pages/points-interest/points-interest.component";
import { StatsComponent } from "@app/pages/stats/stats.component";
@NgModule({
  declarations: [RealtimeComponent],
  imports: [CommonModule,
    CommonModule,
    ScrollPanelModule,
    MenuModule,
    GridsterModule,
    SplitterModule,
    KnobModule,
    RippleModule,
    PanelModule,
    NgbModule,
    GMapModule,
    GalleriaModule,
    SplitButtonModule,
    TableModule,
    DropdownModule,
    RadioButtonModule,
    CardModule,
    InputMaskModule,
    DividerModule,
    TimelineModule,
    TabViewModule,
    FormsModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    InputTextareaModule,
    ConfirmDialogModule,
    ToastModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    ProgressBarModule,
    InputTextModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    TerminalModule,
    PickListModule,
    PasswordModule,
    TreeModule,
    HighchartsChartModule,
    BreadcrumbModule,
    NgTerminalModule,
    ImageModule,
    ProgressSpinnerModule,
    ChipsModule,
    SelectButtonModule,
    InputSwitchModule,
    AccordionModule,
    GridsterModule,
    TieredMenuModule,
    MenuModule,
  ],
  exports: [RealtimeComponent] // ต้อง export เพื่อให้โมดูลอื่นสามารถใช้ได้
})
export class SharedModule {}
