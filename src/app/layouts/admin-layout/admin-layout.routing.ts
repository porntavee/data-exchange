import { Routes } from '@angular/router';
import { AlarmComponent } from '@app/pages/alarm/alarm.component';
import { DashboardComponent } from '@app/pages/dashboard/dashboard.component';
import { UserComponent } from '@app/pages/user/user.component';
import { ReportComponent } from '@app/pages/report/report.component';
import { TaskComponent } from '@app/pages/task/task.component';
import { UserZoneComponent } from '@app/pages/userzone/userzone.component';
import { ScheduleComponent } from '@app/pages/schedule/schedule.component';
import { MapsComponent } from '@app/pages/maps/maps.component';
import { NotificationsComponent } from '@app/pages/notifications/notifications.component';
import { UpgradeComponent } from '@app/pages/upgrade/upgrade.component';
import { RemoteCommandComponent } from '@app/pages/remote-command/remote-command.component';
import { TopologyComponent } from '@app/pages/topology/topology.component';
import { DeviceInformationComponent } from '@app/pages/device-information/device-information.component';
import { LineComponent } from '@app/pages/line/line.component';
import { LogComponent } from '@app/pages/log/log.component';
import { TopchartComponent } from '@app/pages/topchart/topchart.component';
import { ManagedeviceprofileComponent } from "@app/pages/managedeviceprofile/managedeviceprofile.component";
import { DeviceSearchComponent } from '@app/pages/device-search/device-search.component';
import { DailysendComponent } from '@app/pages/dailysend/dailysend.component';
import { ThroughputComponent } from '@app/pages/throughput/throughput.component';
import { ThroughputreportComponent } from '@app/pages/throughputreport/throughputreport.component';
import { ProvisioningHistoryComponent } from '@app/pages/provisioning-history/provisioning-history.component';
import { ScriptTemplateComponent } from '@app/pages/script-template/script-template.component';
import { TopologyMapComponent } from '@app/pages/topology-map/topology-map.component';
import { ManagedeviceauthenComponent } from '@app/pages/managedeviceauthen/managedeviceauthen.component';
import { ManagedeviceotherComponent } from '@app/pages/managedeviceother/managedeviceother.component';
import { SnpmProfileComponent } from '@app/pages/snpm-profile/snpm-profile.component';
import { AlarmProfileComponent } from '@app/pages/alarm-profile/alarm-profile.component';
import { AlatmhistoryComponent } from '@app/pages/alatmhistory/alatmhistory.component';
import { AlarmTrapHistoryComponent } from "@app/pages/alarm-trap-history/alarm-trap-history.component";
import { CustomerReportComponent } from '@app/pages/customer-report/customer-report.component';
import { CatidHistoryComponent } from "@app/pages/catid-history/catid-history.component";
import { DailysummaryComponent } from '@app/pages/dailysummary/dailysummary.component';
import { TrafficmonthlyComponent } from '@app/pages/trafficmonthly/trafficmonthly.component';
import { DeviceAvailabilityComponent } from '@app/pages/device-availability/device-availability.component';
import { ServicestatusComponent } from '@app/pages/servicestatus/servicestatus.component';
import { PointsInterestComponent } from '@app/pages/points-interest/points-interest.component';
import { RealtimeComponent } from '@app/pages/realtime/realtime.component';
import { StatsComponent } from '@app/pages/stats/stats.component';
import { DApiComponent } from '@app/pages/d-api/d-api.component';
import { DApiUseComponent } from '@app/pages/d-api-use/d-api-use.component';
import { DApiApproveComponent } from '@app/pages/d-api-approve/d-api-approve.component';
import { DApiLogComponent } from '@app/pages/d-api-log/d-api-log.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user',           component: UserComponent },
    { path: 'report',          component: ReportComponent },
    { path: 'task',     component: TaskComponent },
    { path: 'schedule',          component: ScheduleComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'telnet',         component: RemoteCommandComponent },
    { path: 'topology',       component: TopologyComponent },
    { path: 'device',       component: DeviceInformationComponent },
    { path: 'Dailysentalarm',       component: DailysendComponent },
    { path: 'linechatbot',       component: LineComponent },
    { path: 'log',       component: LogComponent },
    { path: 'throughput',       component: ThroughputComponent },
    { path: 'throughputreport',       component: ThroughputreportComponent },
    { path: 'devicelist',       component: DeviceSearchComponent },
    { path: 'topchart',       component: TopchartComponent },
    { path: 'alarm',       component: AlarmComponent },
    { path: 'alarmhistory',       component: AlatmhistoryComponent },
    { path: 'provisioninghistory', component: ProvisioningHistoryComponent },
    { path: 'script' , component : ScriptTemplateComponent},
    { path: 'topologymap', component: TopologyMapComponent },
    { path: 'userzone', component: UserZoneComponent },
    { path: 'managedeviceauthen', component: ManagedeviceauthenComponent },
    { path: 'managedeviceother', component: ManagedeviceotherComponent },
    { path: 'managedeviceprofile', component: ManagedeviceprofileComponent },
    { path: 'SnpmProfile', component: SnpmProfileComponent },
    { path: 'AlarmProfile', component: AlarmProfileComponent },
    { path: "alarm-trap-history", component: AlarmTrapHistoryComponent },
    { path: "customerreport", component: CustomerReportComponent },
    { path: "catidhistory", component: CatidHistoryComponent },
    { path: "trafficmonthly", component: TrafficmonthlyComponent },
    { path: "dailysummary", component: DailysummaryComponent },
    { path: "availability", component: DeviceAvailabilityComponent },
    { path: "servicestatus", component: ServicestatusComponent },
    { path: "points-interest", component: PointsInterestComponent },
    { path: "realtime", component: RealtimeComponent },
    { path: "stats", component: StatsComponent },
    { path: "d-api", component: DApiComponent },
    { path: "d-api-use", component: DApiUseComponent },
    { path: "d-api-approve", component: DApiApproveComponent },
    { path: "d-api-log", component: DApiLogComponent },
];
