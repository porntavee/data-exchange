import { Component, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { MapTopoService } from "@app/map-topology-service";
import { NavigateService } from "@app/navigateservice";
import { MessageService, SelectItem, ConfirmationService } from "primeng/api";
import { ThroughputsService } from "@app/pages/throughput/throughput.service";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);
import { Calendar } from "primeng/calendar";
import { OnInit, ChangeDetectorRef } from "@angular/core";
import { ThemeService } from "app/theme.service";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { PrimeNGConfig } from "primeng/api";
import { TerminalService } from "primeng/terminal";
import { NgTerminal } from "ng-terminal";
import { Terminal } from "xterm";
import { Observable } from "rxjs";
import { WebsocketService } from "@app/serviec/websocket.service";
import { create } from "domain";

export interface CFM {
  vlan?: number;
  service_name?: string;
}
interface DeviceType {
  name: string;
  id: number;
}
export interface local_device {
  username?: string;
  password?: string;
  IPADDRESS?: string;
  id?: string;
  mep?: number;
  nni?: string;
  uni?: string;
  local_vlan?: number;
}
export interface ScheduleTask {
  name?: string;
  mode?: string;
  startDate?: Calendar;
  startTime?: Calendar;
  email?: string;
  phone?: string;
}
interface ScheduleMode {
  name: string;
  id: number;
}
export interface remote_device {
  username?: string;
  password?: string;
  IPADDRESS?: string;
  id?: string;
  mep?: number;
  nni?: string;
  interface?: string;
  remote_vlan?: number;
}
export interface resultCFM {
  vlan?: number;
  service_name?: string;
  local_device: local_device;
  remote_device: remote_device;
}
export interface loopback {
  vlan?: number;
  interface?: string;
  username?: string;
  password?: string;
  remote_ipaddress?: string;
  local_ipaddress?: string;
  ethertype?: string;
  mac?: string;
}

export interface createthroghtput {
  username?: string;
  password?: string;
  remote_ipaddress?: string;
  local_ipaddress?: string;
  vlan?: number;
  flow_profile?: number;
  frame_length?: number[];
  ethernetsam_service?: number;
  latency?: number;
  jitter?: number;
  frame_loss_ratio?: number;
  availability?: number;
  performance_bandwidth?: number;
  cir?: number;
  eir?: number;
  cbs?: number;
  ebs?: number;
  nni?: string;
  uni?: string;
}
interface Throughput {
  username?: string;
  password?: string;
  ipaddress?: string;
  service?: number;
  mode?: string;
  duration?: number;
}
interface Throughputs {
  username?: string;
  password?: string;
  ipaddress?: string;
  service?: number;
  mode?: string;
}
interface report {
  throughput?: number;
  result?: string;
  frame_loss_ratio?: number;
  jitter?: number;
  latency?: number;
}
interface IPADDRESS {
  IPADDRESS?: string;
  iRCNETypeID?: string;
  MACADDRESS?: string;
  IRCNETNODEID?: string;
  ref_table?: string;
}

interface schedulecreate {
  schedule?: ScheduleTask;
  begin_tp_test?: Throughput;
}
interface Mode {
  name: string;
}

export interface portlink {
  alarm_count?: number;
  strDeviceName?: string;
  strLocation?: string;
  strName?: string;
  strDesc?: string;
}

@Component({
  moduleId: module.id,
  selector: "throughput-cmp",
  templateUrl: "throughput.component.html",
  styleUrls: ["throughput.component.scss"],
  providers: [TerminalService],
  styles: [
    `
      :host ::ng-deep .p-timeline-event-content {
        flex: 0;
      }
      label {
        color: black;
        font-size: 16px;
      }
      :host ::ng-deep .p-dialog .user-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
      .p-terminal {
        font-size: 18px;
        height: 50rem;
      }
      input {
        width: 100%;
      }
      .box {
        background-color: var(--surface-e);
        text-align: center;
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-radius: 4px;
        box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
          0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
      }
      .box-stretched {
        height: 100%;
      }
      .vertical-container {
        margin: 0;
        height: 200px;
        background: var(--surface-d);
        border-radius: 4px;
      }
      .nested-grid .p-col-4 {
        padding-bottom: 1rem;
      }
    `
  ],
  animations: [
    trigger("animation", [
      state(
        "visible",
        style({
          transform: "translateX(0)",
          opacity: 1
        })
      ),
      transition("void => *", [
        style({ transform: "translateX(50%)", opacity: 0 }),
        animate("300ms ease-out")
      ]),
      transition("* => void", [
        animate(
          "250ms ease-in",
          style({
            height: 0,
            opacity: 0,
            transform: "translateX(50%)"
          })
        )
      ])
    ])
  ]
})
export class ThroughputComponent implements OnInit {
  themeValue: string = this.themeService.theme;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  Highcharts2: typeof Highcharts = Highcharts;
  chartOptions2: Highcharts.Options = {};
  Highcharts3: typeof Highcharts = Highcharts;
  chartOptions3: Highcharts.Options = {};
  cfm: CFM = {};
  remote_device: remote_device = {};
  remote_device_Object: remote_device = {};
  local_device: local_device = {};
  local_device_Object: local_device = {};
  loopback: loopback = {};
  loopback_Object: loopback = {};
  IPADDRESS_Array: IPADDRESS[];
  IPADDRESS_Array2func: IPADDRESS[];
  IPADDRES: IPADDRESS[];
  loadip_Local: boolean;
  loadip_Remote: boolean;
  load_ipLocal2func: boolean;
  load_ipsRemote2func: boolean;
  IPADDRES_RemoteArray: IPADDRESS[];
  IPADDRES_Localobject: IPADDRESS = {};
  IPADDRES_Localobject2func: IPADDRESS = {};
  IPADDRES_Remoteobject: IPADDRESS = {};
  IPADDRES_Remoteobject2func: IPADDRESS = {};
  valueTimeline: any[];
  resultCFM: resultCFM;
  resultCFM_2func: resultCFM;
  Mode: Mode[] = [];
  selectedScheduleMode: ScheduleMode;
  scheduleTask: ScheduleTask = {};
  selectedMode: Mode;
  selectedMode_2func: Mode;
  Throughput: Throughput = {};
  Throughput_2func: Throughput = {};
  Throughputs_testobject: Throughputs = {};
  resultThroughputs: string;
  resultThroughputs_2func: string;
  report: report = {};
  createthroghtput: createthroghtput = {};
  ipaddress: string;
  username: string;
  password: string;
  action_Dialog_ResultCFM: boolean;
  action_Dialog_CFMtest: boolean;
  action_Dialog_Showthroughputtestresult: boolean;
  action_Dialog_Showthroughputtestresult2func: boolean;
  action_Dialog_StartThroughputtest: boolean;
  action_Dialog_StartThroughputtest2func: boolean;
  action_Dialog_CFMtest2func: boolean;
  action_Dialog_Loopbackconfiguration: boolean;
  action_Dialog_Loopbackconfiguration2func: boolean = false;
  action_Dialog_CreateThroughputtest: boolean;
  action_Dialog_CreateThroughputtest2func: boolean = false;
  action_Dialog_ResultThroughputtest: boolean;
  dialogHeader: string;
  resultlocal: string;
  resultCFMtest_local: string;
  resultCFMtest_remote: string;
  resultCFMtest_local2func: string;
  resultCFMtest_remote2func: string;
  resultloopback: string;
  resultloopback_2func: string;
  resultcreate: string;
  resultcreate_2func: string;
  resultstart: string;
  resultstart_2func: string;
  resultremote: string;
  ip: string = "";
  iRCNETypeID: string = "";
  selectIP_remote: string;
  selectIP_remote2func: string;
  selectIP_local2func: string;
  selectedIPLocal: IPADDRESS;
  selectedIPLocal2func: IPADDRESS;
  localIPs: IPADDRESS[];
  localIPs_2func: IPADDRESS[];
  remoteIPs: IPADDRESS[];
  remoteIPs_2func: IPADDRESS[];
  clear: boolean = true;
  clear_ad: boolean = false;
  clearremote: boolean = true;
  clearremote_ad: boolean = true;
  frame_length: number = 1526;
  frameLengths = [64, 128, 256, 512, 1024, 1280, 1518, 1526];
  durationOptions = [
    { label: "5", value: 5 },
    { label: "15", value: 15 },
    { label: "30", value: 30 },
    { label: "60", value: 60 }
  ];

  // frame_length_1: number = 1526;
  // frame_length_2: number = 1526;
  // frame_length_3: number = 1526;

  latency: number = 100000;
  jitter: number = 100000;
  frame_loss_ratio: number = 100000;
  availability: number = 99000;
  performance_bandwidth: number = 10000;
  performance_bandwidth_value: number;
  cir: number = 10000;
  eir: number = 5000;
  service: number = 1;
  flow_profile: number = 1;
  ethernetsam_service: number = 1;
  frame_length_ad: number = 1526;
  frame_length_1024: number = 1024;
  frame_length_1526: number = 1526;
  frame_length_9000: number = 9000;

  latency_ad: number = 100000;
  jitter_ad: number = 100000;
  frame_loss_ratio_ad: number = 100000;
  availability_ad: number = 99000;
  performance_bandwidth_ad: number = 10000;
  cir_ad: number = 10000;
  eir_ad: number = 5000;
  service_ad: number = 1;
  flow_profile_ad: number = 1;
  ethernetsam_service_ad: number = 1;
  cbs: number = 1024;
  ebs: number = 1024;
  cbs_ad: number = 1024;
  ebs_ad: number = 1024;
  service_name: string = "SED-TS";
  service_name_ad: string = "SED-TADV";
  activate: boolean = false;
  activate_ad: boolean = false;
  activates: boolean = false;
  activates_ad: boolean = false;
  activatechart: boolean = false;
  meplocal: number;
  mepremote: number;
  meplocal_ad: number = 1;
  mepremote_ad: number = 2;
  mepremote_ad1: number = 2;
  ethertype: string = "08a0";
  ethertype_ad: string = "08a0";
  username_ad: string;
  password_ad: string;
  vlan_ad: number;
  vlan_ad1: number;
  vlan_add: number;
  nni_ad: string;
  uni_ad: string;
  interface: string;
  submitted_CFM: boolean;
  submitted_CFM2func: boolean;
  submitted_throughtputbut: boolean;
  submitteds_CFMlocalsimple: boolean;
  submitteds_CFMremotesimple: boolean;
  submitteds_loopbackbut: boolean;
  submitted_CFMlsimple: boolean;
  submitted_CFMbut: boolean;
  submitted__loopbackbut2past: boolean;
  submitted_throughtputbut2func: boolean;
  submitted_Loopbackconfiguration: boolean;
  submitted_loopbackbut2past2func: boolean;
  submitted_duration: boolean;
  submitted_duration2func: boolean;
  submitted_CFMlsimple1past: boolean;
  submitted_userpass2func: boolean;
  submitted_uplinkRemotesimple: boolean;
  submitted_macLoopbacksimple: boolean;
  submitted_macLoopbackbut: boolean;
  submitted_uplinkCFMbut: boolean;
  invalid_local_VLAN: string;
  invalid_remote_VLAN: string;
  validator_class_local_device: string;
  validator_class_local_uplink: string;
  validator_class_local_VLAN: string;
  validator_class_remote_VLAN: string;
  validator_class_remote_uplink: string;
  validator_class_local_device2func: string;
  validator_class_remote_device: string;
  validator_class_remote_device2func: string;
  invinvalid_selectedMode: string;
  invinvalid_selectedMode_2func: string;
  scheduleTaskDialog: boolean;
  scheduleTaskDialog_ad: boolean;
  scheduleModes: ScheduleMode[];
  schedulecreate: schedulecreate;
  loading_Result: boolean = true;
  loading_re: boolean = true;
  loading_Run: boolean = false;
  loading_Localdevice: boolean = true;
  loading_Remotedevice: boolean = true;
  loading_CFMtest: boolean = true;
  loading_Loopbackconfiguration: boolean = true;
  loading_CreateThroughputtest: boolean = true;
  loading_StartThroughputtest: boolean = true;
  loading_ThroughputResult: boolean = true;
  stop: string = "";
  stop1: number;
  mac: string;
  mac_ad: string;
  resultCFMerror: string;
  resultCFMrunstatus: string;
  showCFMerror: string;
  showCFMerror1: string;
  showCFMrunstatus: string;
  showCFMrunstatus1: string;
  resultLoopbackerror: string;
  createthroghtputerror: string;
  startthroghtputerror: string;
  resultLoopbackrunstatus: string;
  throughputResulterror: string;
  label: boolean = false;
  label_ad: boolean = false;
  labelremote: boolean = false;
  labelremote_ad: boolean = false;
  user_local: string = "raisecom";
  password_local: string = "raisecom";
  user_local1: string = "raisecom";
  password_local1: string = "raisecom";
  user_remote: string = "raisecom";
  password_remote: string = "raisecom";
  user_remote1: string = "raisecom";
  password_remote1: string = "raisecom";
  user_remote2: string = "raisecom";
  password_remote2: string = "raisecom";
  onlabel: string;
  duration: number = 5;
  duration_ad: number = 5;
  selectremoteIPs_ad: IPADDRESS;
  deviceTypes: DeviceType[] = [];
  selectedDeviceType: DeviceType;
  selectedDeviceTypes: string;
  cfmbutton: boolean = true;
  loopbackbutton: boolean = false;
  throughtputbutton: boolean = false;
  required: boolean = true;
  device_image_local: string;
  device_image_remote: string;
  res_ID: string;
  res_ID2: string;
  imageshow: boolean = true;
  iconshow: boolean = false;
  imageshow2: boolean = true;
  iconshow2: boolean = false;
  iconshow3: boolean = false;
  default_terminal_prompt: string = "";
  terminal_prompt: string = "";
  underlying: Terminal;
  input_command: string = "";
  default_terminal_prompt2: string = "";
  terminal_prompt2: string = "";
  underlying2: Terminal;
  input_command2: string = "";
  default_terminal_prompt3: string = "";
  terminal_prompt3: string = "";
  underlying3: Terminal;
  input_command3: string = "";
  default_terminal_prompt4: string = "";
  terminal_prompt4: string = "";
  underlying4: Terminal;
  input_command4: string = "";
  websocket_connect_status: Observable<boolean>;
  show: string = "";
  show2: string = "";
  show3: string = "";
  show4: string = "";
  messagelocal: string;
  messagelocaltp: string;
  messageremotetp: string;
  messageremote: string;
  id_ethernet: string = "";
  interface_remote: string = "";
  id_flowprofile: string = "";
  id_bandwidth: string = "";
  id_flowprofile_remote: string = "";
  id_bandwidth_remote: string = "";
  //Here is options of each uplink downlink device in dropdown
  portname_options_local_CFM: string[];
  //using both for uplink and downlink with local CFM options!
  portname_options_remote_CFM: string[];
  portname_options_remote_advanced: string[];
  portname_options_remote_CFM_advanced: string[];
  portname_options_remote_throughput_advanced: string[];
  portname_options_uplink_throughput_advanced: string[];
  portname_options_downlink_throughput_advanced: string[];
  //Here is selected portname for each uplink downlink device
  selected_portname: string;
  selected_portname_uplink_CFM_local: string;
  selected_portname_downlink_CFM_local: string;
  select_portname_uplink_CFM_local: string;
  // selected_portname_downlink_CFM_local: string;
  selected_portname_uplink_CFM_remote: string;
  selected_portname_uplink_local_advanced: string;
  selected_portname_downlink_local_advanced: string;
  selected_portname_uplink_remote_advanced: string;
  selected_portname_uplink_throughput_advanced: string;
  selected_portname_downlink_throughput_advanced: string;
  allVlan: [];
  sameVlan: [];
  options_all_VLAN: [];
  options_same_VLAN: [];
  options_local_VLAN: [];
  options_remote_VLAN: [];
  options_all_CATID: [];
  selectedCATID: string;
  selectedVLAN: string;
  selectedLocalVLAN: number;
  selectedRemoteVLAN: number;
  isShowCATID: boolean = false;
  isVLAN_disable: boolean = false;
  MEPLocalSuggested: number;
  MEPRemoteSuggested: number;
  isShowUplinkDownlink_local: boolean = false;
  isShowUplinkDownlink_remote: boolean = false;
  isShowMEP_local: boolean = false;
  isShowMEP_advanced: boolean = false;
  isShowVLAN: boolean = false;
  showterminal: boolean;
  showterminal2: boolean;
  showterminal3: boolean;
  showterminal4: boolean;
  isInputDisabled: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  newFrameLength: number;
  local_device_ad: local_device;
  remote_device_ad: remote_device;
  headertabPanel: string[] = ["Simple", "Advanced"];
  countdownState: boolean = false;
  showAlert: boolean;
  ref_table: string;
  availableChoices: SelectItem[] = [
    { label: "A1", value: "A1" },
    { label: "A2", value: "A2" },
    { label: "A3", value: "A3" },
    { label: "A4", value: "A4" }
  ];

  @ViewChild("term", { static: true }) child: NgTerminal;
  @ViewChild("term2", { static: true }) child2: NgTerminal;
  @ViewChild("term3", { static: true }) child3: NgTerminal;
  @ViewChild("term4", { static: true }) child4: NgTerminal;

  constructor(
    public webSocketService: WebsocketService,
    private terminalService: TerminalService,
    private changeDetection: ChangeDetectorRef,
    private ThroughputsService: ThroughputsService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    mapservice: MapTopoService,
    private messageService: MessageService,
    private titleService: Title,
    private navigator: NavigateService,
    private router: Router,
    public themeService: ThemeService
  ) {
    this.titleService.setTitle("SED-Throughput Test");
    this.scheduleModes = [
      { name: "one time", id: 0 },
      { name: "daily", id: 1 },
      { name: "weekly", id: 2 },
      { name: "monthly", id: 3 }
    ];
    this.deviceTypes = [
      { name: "CFM", id: 0 },
      { name: "Loopback", id: 1 },
      { name: "Throughput test", id: 2 }
    ];
    this.selectedDeviceType = this.deviceTypes[0];
    this.selectedScheduleMode = this.scheduleModes[0];
  }
  ngOnInit() {
    this.show = "hide";
    this.show2 = "hide";
    this.show3 = "hide";
    this.show4 = "hide";
    this.loadip_Local = true;
    this.loadip_Remote = true;
    this.load_ipLocal2func = true;
    this.load_ipsRemote2func = true;
    this.device_image_local = "./assets/img/device.png";
    this.device_image_remote = "./assets/img/device.png";
    this.selectedDeviceTypes = "CFM";
    this.valueTimeline = [
      { step: "CFM", date: "15/10/2020 10:30" },
      // { step: "Loopback configuration", date: "15/10/2020 14:00" },
      { step: "Throughput test", date: "15/10/2020 16:30" }
    ];
    this.ip = this.ThroughputsService.local_devices;
    this.iRCNETypeID = this.ThroughputsService.IRCNETypeID;
    if (this.ip == "" && this.iRCNETypeID == "") {
      this.clear = false;
    } else if (this.ip != "" && this.iRCNETypeID != "") {
      this.clear = true;
    }
    this.localIPs = [
      {
        IPADDRESS: this.ip,
        iRCNETypeID: this.iRCNETypeID,
        ref_table: this.ref_table
      }
    ];

    this.remoteIPs = [
      {
        IPADDRESS: this.ip,
        iRCNETypeID: this.iRCNETypeID,
        ref_table: this.ref_table
      }
    ];
    this.selectedIPLocal = this.localIPs[0];
    this.localIPs_2func = [
      {
        IPADDRESS: this.ip,
        iRCNETypeID: this.iRCNETypeID
      }
    ];
    this.remoteIPs_2func = [
      {
        IPADDRESS: this.ip,
        iRCNETypeID: this.iRCNETypeID
      }
    ];
    this.selectedIPLocal2func = this.localIPs_2func[0];
    this.selectremoteIPs_ad = this.remoteIPs_2func[0];
    this.ThroughputsService.dropdownip().subscribe({
      next: data => {
        this.IPADDRESS_Array = data;
        this.load_ipLocal2func = false;
        this.IPADDRES = data;
        this.load_ipsRemote2func = false;
        this.IPADDRESS_Array2func = data;
        this.loadip_Local = false;
        this.IPADDRES_RemoteArray = data;
        this.loadip_Remote = false;
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
    this.Mode = [{ name: "configuration" }, { name: "performance" }];
    this.selectedMode = this.Mode[1];
    this.selectedMode_2func = this.Mode[0];
    this.Throughput.mode = this.selectedMode.name;
    this.Throughput_2func.mode = this.selectedMode_2func.name;
    this.loading_Result = true;
    this.loading_Run = false;
    this.IPADDRES_Localobject.iRCNETypeID = this.iRCNETypeID;
    if (this.IPADDRES_Localobject.iRCNETypeID == "") {
      this.clear = false;
      this.label = false;
    } else if (this.IPADDRES_Localobject.iRCNETypeID != "") {
      this.clear = true;
      this.validator_class_local_device = "";
      this.label = true;
    }
  }

  toggleInputDisabled() {
    this.isInputDisabled = !this.isInputDisabled;
  }

  sendCommand(command: string) {
    this.webSocketService.sendCommand(command);
  }
  changetab(event) {
    // alert(
    //   this.selectedIPLocal.toString() + " " + this.selectIP_remote.toString()
    // );
    // this.local_device_Object.IPADDRESS = undefined;
    // this.selectIP_local2func = undefined;
    // this.selectIP_remote2func = undefined;
    //  this.selectedIPLocal = this.selectIP_remote;
    // if (this.selectedIPLocal != undefined && event.index == 1) {
    //   alert("HI");
    //   this.selectIP_local2func = this.selectedIPLocal.toString();
    // }

    if (event.index == 0) {
      this.show = "hide";
      this.show2 = "hide";
      this.show3 = "hide";
      this.show4 = "hide";
    }
    if (
      event.index == 1 &&
      this.showterminal == true &&
      this.selectedDeviceTypes == "CFM"
    ) {
      this.show = "show";
    }
    if (
      event.index == 1 &&
      this.showterminal2 == true &&
      this.selectedDeviceTypes == "CFM"
    ) {
      this.show2 = "show";
    }
    if (
      event.index == 1 &&
      this.showterminal3 == true &&
      this.selectedDeviceTypes == "Loopback"
    ) {
      this.show4 = "show";
    }
    if (
      event.index == 1 &&
      this.showterminal4 == true &&
      this.selectedDeviceTypes == "Throughput test"
    ) {
      this.show3 = "show";
    }
  }
  onChangeDeviceType(event) {
    this.selectedDeviceTypes = event.value.name;
    if (this.selectedDeviceTypes == "CFM") {
      this.cfmbutton = true;
      this.loopbackbutton = false;
      this.throughtputbutton = false;
      if (this.local_device_Object.IPADDRESS !== undefined) {
        this.showterminal = true;
        this.show = "show";
        this.child.underlying.reset();
        this.underlying = this.child.underlying;
        this.underlying.setOption("fontSize", 20);
        this.underlying.setOption("lineHeight", 2);
        this.child.write(this.messagelocal);
      } else if (this.local_device_Object.IPADDRESS == undefined) {
        this.show = "hide";
      }
      if (this.remote_device_Object.IPADDRESS !== undefined) {
        this.showterminal2 = true;
        this.show2 = "show";
        this.child2.underlying.reset();
        this.underlying2 = this.child2.underlying;
        this.underlying2.setOption("fontSize", 20);
        this.underlying2.setOption("lineHeight", 2);
        this.child2.write(this.messageremote);
      } else if (this.remote_device_Object.IPADDRESS == undefined) {
        this.show2 = "hide";
      }
      this.show3 = "hide";
      this.show4 = "hide";
    } else if (this.selectedDeviceTypes == "Loopback") {
      this.cfmbutton = false;
      this.loopbackbutton = true;
      this.throughtputbutton = false;
      this.show = "hide";
      this.show2 = "hide";
      this.show3 = "hide";
      if (this.remote_device_Object.IPADDRESS !== undefined) {
        this.showterminal3 = true;
        this.show4 = "show";
      }
      this.child.underlying.reset();
      this.child2.underlying.reset();
      this.child3.underlying.reset();
      this.child4.underlying.reset();
      this.messageremotetp = this.messageremotetp;
      this.underlying4 = this.child4.underlying;
      this.underlying4.setOption("fontSize", 20);
      this.underlying4.setOption("lineHeight", 2);
      this.child4.write(this.messageremotetp);
    } else if (this.selectedDeviceTypes == "Throughput test") {
      this.cfmbutton = false;
      this.loopbackbutton = false;
      this.throughtputbutton = true;
      this.show = "hide";
      this.show2 = "hide";
      if (this.local_device_Object.IPADDRESS !== undefined) {
        this.showterminal4 = true;
        this.show3 = "show";
      }
      this.show4 = "hide";
      this.child.underlying.reset();
      this.child2.underlying.reset();
      this.child3.underlying.reset();
      this.messagelocaltp = this.messagelocaltp;
      this.underlying3 = this.child3.underlying;
      this.underlying3.setOption("fontSize", 20);
      this.underlying3.setOption("lineHeight", 2);
      this.child3.write(this.messagelocaltp);
    }
  }
  RemoveethernetSAM(local_device: local_device) {
    local_device.IPADDRESS = this.local_device_Object.IPADDRESS;
    local_device.username = this.user_local;
    local_device.password = this.password_local;
    local_device.id = this.id_ethernet;
    this.submitted_userpass2func = true;
    this.submitteds_CFMremotesimple = true;
    this.local_device_Object = local_device;
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if (this.local_device_Object.IPADDRESS !== undefined) {
      this.ThroughputsService.RemoveethernetSAM(
        this.local_device_Object
      ).subscribe({
        next: data => {
          this.child3.write("\n \r");
          this.messagelocaltp = data;
          this.terminal_prompt3 = this.messagelocaltp;
          this.underlying3 = this.child3.underlying;
          this.underlying3.setOption("fontSize", 20);
          this.underlying3.setOption("lineHeight", 2);
          this.child3.write(this.messagelocaltp);
          this.child3.keyEventInput.subscribe(e => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode > 0) {
              this.sendCommand(this.input_command3);
              this.input_command3 = ""; // clear buffer
            } else if (ev.keyCode === 8) {
              if (
                this.child3.underlying.buffer.active.cursorX >
                this.terminal_prompt3.length
              ) {
                this.child3.write("\b \b");
                this.input_command3 = this.input_command3.slice(0, -1);
              }
            } else if (printable) {
              this.child3.write(e.key);
              this.input_command3 += e.key;
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
          if (error) {
            this.child3.write("\n \r");
            this.messagelocaltp = error.message;
            this.terminal_prompt3 = this.messagelocaltp;
            this.underlying3 = this.child3.underlying;
            this.underlying3.setOption("fontSize", 20);
            this.underlying3.setOption("lineHeight", 2);
            this.child3.write(this.messagelocaltp);
            this.child3.keyEventInput.subscribe(e => {
              const ev = e.domEvent;
              const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
              if (ev.keyCode === 13) {
                this.sendCommand(this.input_command3);
                this.input_command3 = ""; // clear buffer
              } else if (ev.keyCode === 8) {
                if (
                  this.child3.underlying.buffer.active.cursorX >
                  this.terminal_prompt3.length
                ) {
                  this.child3.write("\b \b");
                  this.input_command3 = this.input_command3.slice(0, -1);
                }
              } else if (printable) {
                this.child3.write(e.key);
                this.input_command3 += e.key;
              }
            });
          }
        }
      });
    }
  }
  Removeflowprofile(local_device: local_device) {
    local_device.IPADDRESS = this.local_device_Object.IPADDRESS;
    local_device.username = this.user_local;
    local_device.password = this.password_local;
    local_device.id = this.id_flowprofile;
    this.submitted_userpass2func = true;
    this.submitteds_CFMremotesimple = true;
    this.local_device_Object = local_device;
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if (this.local_device_Object.IPADDRESS !== undefined) {
      this.ThroughputsService.Removeflowprofile(
        this.local_device_Object
      ).subscribe({
        next: data => {
          this.child3.write("\n \r");
          this.messagelocaltp = data;
          this.terminal_prompt3 = this.messagelocaltp;
          this.underlying3 = this.child3.underlying;
          this.underlying3.setOption("fontSize", 20);
          this.underlying3.setOption("lineHeight", 2);
          this.child3.write(this.messagelocaltp);
          this.child3.keyEventInput.subscribe(e => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode > 0) {
              this.sendCommand(this.input_command3);
              this.input_command3 = ""; // clear buffer
            } else if (ev.keyCode === 8) {
              if (
                this.child3.underlying.buffer.active.cursorX >
                this.terminal_prompt3.length
              ) {
                this.child3.write("\b \b");
                this.input_command3 = this.input_command3.slice(0, -1);
              }
            } else if (printable) {
              this.child3.write(e.key);
              this.input_command3 += e.key;
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
          if (error) {
            this.child3.write("\n \r");
            this.messagelocaltp = error.message;
            this.terminal_prompt3 = this.messagelocaltp;
            this.underlying3 = this.child3.underlying;
            this.underlying3.setOption("fontSize", 20);
            this.underlying3.setOption("lineHeight", 2);
            this.child3.write(this.messagelocaltp);
            this.child3.keyEventInput.subscribe(e => {
              const ev = e.domEvent;
              const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
              if (ev.keyCode === 13) {
                this.sendCommand(this.input_command3);
                this.input_command3 = ""; // clear buffer
              } else if (ev.keyCode === 8) {
                if (
                  this.child3.underlying.buffer.active.cursorX >
                  this.terminal_prompt3.length
                ) {
                  this.child3.write("\b \b");
                  this.input_command3 = this.input_command3.slice(0, -1);
                }
              } else if (printable) {
                this.child3.write(e.key);
                this.input_command3 += e.key;
              }
            });
          }
        }
      });
    }
  }
  Removebandwidthprofile(local_device: local_device) {
    local_device.IPADDRESS = this.local_device_Object.IPADDRESS;
    local_device.username = this.user_local;
    local_device.password = this.password_local;
    local_device.id = this.id_bandwidth;
    this.submitted_userpass2func = true;
    this.submitteds_CFMremotesimple = true;
    this.local_device_Object = local_device;
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if (this.local_device_Object.IPADDRESS !== undefined) {
      this.ThroughputsService.Removebandwidthprofile(
        this.local_device_Object
      ).subscribe({
        next: data => {
          this.child3.write("\n \r");
          this.messagelocaltp = data;
          this.terminal_prompt3 = this.messagelocaltp;
          this.underlying3 = this.child3.underlying;
          this.underlying3.setOption("fontSize", 20);
          this.underlying3.setOption("lineHeight", 2);
          this.child3.write(this.messagelocaltp);
          this.child3.keyEventInput.subscribe(e => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode > 0) {
              this.sendCommand(this.input_command3);
              this.input_command3 = ""; // clear buffer
            } else if (ev.keyCode === 8) {
              if (
                this.child3.underlying.buffer.active.cursorX >
                this.terminal_prompt3.length
              ) {
                this.child3.write("\b \b");
                this.input_command3 = this.input_command3.slice(0, -1);
              }
            } else if (printable) {
              this.child3.write(e.key);
              this.input_command3 += e.key;
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
          if (error) {
            this.child3.write("\n \r");
            this.messagelocaltp = error.message;
            this.terminal_prompt3 = this.messagelocaltp;
            this.underlying3 = this.child3.underlying;
            this.underlying3.setOption("fontSize", 20);
            this.underlying3.setOption("lineHeight", 2);
            this.child3.write(this.messagelocaltp);
            this.child3.keyEventInput.subscribe(e => {
              const ev = e.domEvent;
              const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
              if (ev.keyCode === 13) {
                this.sendCommand(this.input_command3);
                this.input_command3 = ""; // clear buffer
              } else if (ev.keyCode === 8) {
                if (
                  this.child3.underlying.buffer.active.cursorX >
                  this.terminal_prompt3.length
                ) {
                  this.child3.write("\b \b");
                  this.input_command3 = this.input_command3.slice(0, -1);
                }
              } else if (printable) {
                this.child3.write(e.key);
                this.input_command3 += e.key;
              }
            });
          }
        }
      });
    }
  }
  Removeinterface_Remote(remote_device: remote_device) {
    remote_device.IPADDRESS = this.remote_device_Object.IPADDRESS;
    remote_device.username = this.user_remote2;
    remote_device.password = this.password_remote2;
    remote_device.interface = this.interface_remote;
    this.iconshow3 = true;
    this.submitted_userpass2func = true;
    this.submitteds_CFMremotesimple = true;
    this.remote_device_Object = remote_device;
    if (this.remote_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.remote_devices !== undefined &&
      this.ThroughputsService.remote_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if (this.remote_device_Object.IPADDRESS !== undefined) {
      this.ThroughputsService.RemoveInterface(
        this.remote_device_Object
      ).subscribe({
        next: data => {
          this.iconshow3 = false;
          this.child4.write("\n \r");
          this.messageremotetp = data;
          this.terminal_prompt4 = this.messageremotetp;
          this.underlying4 = this.child.underlying;
          this.underlying4.setOption("fontSize", 20);
          this.underlying4.setOption("lineHeight", 2);
          this.child4.write(this.messageremotetp);
          this.child4.keyEventInput.subscribe(e => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode > 0) {
              this.sendCommand(this.input_command4);
              this.input_command4 = ""; // clear buffer
            } else if (ev.keyCode === 8) {
              if (
                this.child4.underlying.buffer.active.cursorX >
                this.terminal_prompt4.length
              ) {
                this.child4.write("\b \b");
                this.input_command4 = this.input_command4.slice(0, -1);
              }
            } else if (printable) {
              this.child4.write(e.key);
              this.input_command4 += e.key;
            }
          });
        },
        error: error => {
          if (error.status == 401) {
            this.iconshow3 = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
          if (error) {
            this.iconshow3 = false;
            this.child3.write("\n \r");
            this.messageremotetp = error.message;
            this.terminal_prompt4 = this.messageremotetp;
            this.underlying4 = this.child4.underlying;
            this.underlying4.setOption("fontSize", 20);
            this.underlying4.setOption("lineHeight", 2);
            this.child4.write(this.messageremotetp);
            this.child4.keyEventInput.subscribe(e => {
              const ev = e.domEvent;
              const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
              if (ev.keyCode === 13) {
                this.sendCommand(this.input_command4);
                this.input_command4 = ""; // clear buffer
              } else if (ev.keyCode === 8) {
                if (
                  this.child4.underlying.buffer.active.cursorX >
                  this.terminal_prompt4.length
                ) {
                  this.child4.write("\b \b");
                  this.input_command4 = this.input_command4.slice(0, -1);
                }
              } else if (printable) {
                this.child4.write(e.key);
                this.input_command4 += e.key;
              }
            });
          }
        }
      });
    }
  }

  onChangeLocalIP(event) {
    if (event.value) {
      this.selected_portname_uplink_CFM_local = "";
      this.mac = event.value.MACADDRESS;
      this.local_device.IPADDRESS = event.value.IPADDRESS;
      this.IPADDRES_Localobject.iRCNETypeID = event.value.iRCNETypeID;
      this.IPADDRES_Localobject.ref_table = event.value.ref_table;
      this.isShowVLAN = false;
      this.options_same_VLAN = undefined;
      this.options_local_VLAN = undefined;
      this.selectedVLAN = undefined;
      this.selectedLocalVLAN = undefined;
      this.selectedRemoteVLAN = undefined;
      this.loadVlan = false;
      this.loadVlanAdvanced = false;
      this.onReadyIPAddress();

      this.ThroughputsService.setRemoteDevice().subscribe({
        next: data => {
          this.IPADDRES = data;
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
      if (this.local_device.IPADDRESS == "") {
        this.clear = false;
        this.label = false;
      } else if (this.local_device.IPADDRESS != "") {
        this.clear = true;
        this.validator_class_local_device = "";
        this.label = true;
      }
      this.ThroughputsService.getPortName(
        this.IPADDRES_Localobject.iRCNETypeID
      ).subscribe({
        next: data => {
          this.portname_options_local_CFM = data;
        }
      });
    } else {
      this.isShowUplinkDownlink_local = false;
    }
  }

  onChangePortNameCFMUplink(event) {
    if (event.value) {
      this.selected_portname_uplink_CFM_local = event.value.port_name;
      this.local_device.nni = event.value.port_name;
      this.local_device.uni = event.value.port_name;
      this.validator_class_local_uplink = "";
    } else {
      this.local_device.nni = undefined;
      this.validator_class_local_uplink = "ng-invalid ng-dirty";
    }
  }

  onChangePortNameCFMDownlink(event) {
    this.selected_portname_downlink_CFM_local = event.value.port_name;
    this.local_device.uni = event.value.port_name;
  }

  onChangePortNameRemote(event) {
    if (event.value) {
      this.selected_portname_uplink_CFM_remote = event.value.port_name;
      this.remote_device.nni = event.value.port_name;
      this.validator_class_remote_uplink = "";
    } else {
      this.remote_device.nni = undefined;
      this.validator_class_remote_uplink = "ng-invalid ng-dirty";
    }
  }

  onChangeVLANLocal(event) {
    if (event.value) {
      this.selectedLocalVLAN = event.value;
      this.validator_class_local_VLAN = "";
    } else {
      this.selectedLocalVLAN = undefined;
      this.validator_class_local_VLAN = "ng-invalid ng-dirty";
    }
  }

  onChangeVLANRemote(event) {
    if (event.value) {
      this.selectedRemoteVLAN = event.value;
      this.validator_class_remote_VLAN = "";
    } else {
      this.selectedRemoteVLAN = undefined;
      this.validator_class_remote_VLAN = "ng-invalid ng-dirty";
    }
  }

  onChangePortNameAdvancedLocalUplink(event) {
    this.selected_portname_uplink_local_advanced = event.value.port_name;
    // this.local_device_ad.nni = event.value.port_name;
  }

  onChangePortNameAdvancedLocalDownlink(event) {
    this.selected_portname_downlink_local_advanced = event.value.port_name;
  }

  onChangePortNameRemoteCFM(event) {
    this.selected_portname_uplink_remote_advanced = event.value.port_name;
  }

  onChangePortNameRemoteThroughputUplink(event) {
    this.selected_portname_uplink_throughput_advanced = event.value.port_name;
  }

  onChangePortNameRemoteThroughputDownlink(event) {
    this.selected_portname_downlink_throughput_advanced = event.value.port_name;
  }
  loadVlan: boolean = false;
  async onReadyIPAddress() {
    if (this.local_device.IPADDRESS != undefined) {
      this.isShowUplinkDownlink_local = true;
    }
    if (this.remote_device.IPADDRESS != undefined) {
      this.isShowUplinkDownlink_remote = true;
    }

    if (
      this.local_device.IPADDRESS != undefined &&
      this.remote_device.IPADDRESS != undefined
    ) {
      this.loadVlan = true;
      this.loadVlanAdvanced = true;
      this.showAlert = false;
      this.isShowVLAN = true;
      await this.ThroughputsService.getSupportedVLAN(
        this.local_device.IPADDRESS,
        this.remote_device.IPADDRESS
      ).subscribe({
        next: result => {
          this.loadVlan = false;
          this.loadVlanAdvanced = false;
          this.messageService.add({
            severity: "success",
            summary: "Complete",
            detail: "VLAN are generated!"
          });
          if (result.detail) {
            this.options_all_VLAN = result.detail.all_vlan;
            if (result.detail.local_vlan.length != 0) {
              this.options_local_VLAN = result.detail.local_vlan;
              this.options_remote_VLAN = result.detail.remote_vlan;
            } else if (result.detail.same_vlan.length == 0) {
              this.options_local_VLAN = undefined;
            }

            this.sameVlan = result.detail.same_vlan;
            this.selectedVLAN = result.detail.same_vlan[0];
            this.selectedLocalVLAN = undefined;
            this.selectedRemoteVLAN = undefined;
          } else {
            this.selectedVLAN = undefined;
            this.selectedLocalVLAN = undefined;
            this.selectedRemoteVLAN = undefined;
            this.options_all_VLAN = undefined;
            this.options_local_VLAN = undefined;
          }

          if (this.options_local_VLAN == undefined) {
            this.showAlert = true;
            this.showAlertAdvanced = true;
          } else {
            this.showAlert = false;
            this.showAlertAdvanced = false;
          }
        },
        error: error => {
          if (error) {
            this.loadVlan = false;
            this.loadVlanAdvanced = false;
            this.showAlert = true;
            this.showAlertAdvanced = true;
          }
        }
      });
      this.ThroughputsService.getSuggestedMEP(
        this.local_device.IPADDRESS,
        this.remote_device.IPADDRESS
      ).subscribe({
        next: data => {
          this.isShowMEP_local = true;
          this.MEPLocalSuggested = data.detail.local;
          this.meplocal = data.detail.local;
          this.MEPRemoteSuggested = data.detail.remote;
          this.mepremote = data.detail.remote;

          this.messageService.add({
            severity: "success",
            summary: "Complete",
            detail: "MEP are generated!"
          });
        },
        error: error => {
          if (error.status == "503") {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.detail + " Please try to connect another IP "
            });
          }
        }
      });
      this.ThroughputsService.getSupportedCATID(
        this.local_device.IPADDRESS,
        this.remote_device.IPADDRESS
      ).subscribe({
        next: result => {
          this.isShowCATID = true;
          this.options_all_CATID = result.detail.catID;
          this.selectedCATID = result.detail.catID[0];
        }
      });
    } else if (
      this.local_device_Object.IPADDRESS != undefined &&
      this.remote_device_Object.IPADDRESS != undefined
    ) {
      this.ThroughputsService.getSupportedVLAN(
        this.local_device_Object.IPADDRESS,
        this.remote_device_Object.IPADDRESS
      ).subscribe({
        next: result => {
          this.options_all_VLAN = result.detail.all_vlan;
          this.options_same_VLAN = result.detail.same_vlan;
          this.options_local_VLAN = result.detail.local_vlan;
          this.options_remote_VLAN = result.detail.remote_vlan;
          this.sameVlan = result.detail.same_vlan;
        }
      });
    }
  }
  loadVlanAdvanced: boolean = false;
  showAlertAdvanced: boolean = false;
  onReadyIPAddressAdvanced() {
    if (this.local_device_Object.IPADDRESS != undefined) {
      this.isShowUplinkDownlink_local = true;
    }
    if (this.remote_device_Object.IPADDRESS != undefined) {
      this.isShowUplinkDownlink_remote = true;
    }

    if (
      this.local_device_Object.IPADDRESS != undefined &&
      this.remote_device_Object.IPADDRESS != undefined
    ) {
      this.loadVlanAdvanced = true;
      this.loadVlan = true;
      this.showAlert = false;
      this.isShowVLAN = true;
      this.ThroughputsService.getSupportedVLAN(
        this.local_device_Object.IPADDRESS,
        this.remote_device_Object.IPADDRESS
      ).subscribe({
        next: result => {
          this.loadVlanAdvanced = false;
          this.loadVlan = false;
          this.messageService.add({
            severity: "success",
            summary: "Complete",
            detail: "VLAN are generated!"
          });
          if (result.detail) {
            this.options_all_VLAN = result.detail.all_vlan;
            if (result.detail.same_vlan.length != 0) {
              this.options_same_VLAN = result.detail.same_vlan;
              this.options_local_VLAN = result.detail.local_vlan;
              this.options_remote_VLAN = result.detail.remote_vlan;
            } else if (result.detail.same_vlan.length == 0) {
              this.options_same_VLAN = undefined;
              this.options_local_VLAN = undefined;
              this.options_remote_VLAN = undefined;
            }
            this.sameVlan = result.detail.same_vlan;
            this.selectedVLAN = result.detail.same_vlan[0];
            this.selectedLocalVLAN = undefined;
            this.selectedRemoteVLAN = undefined;
          } else {
            this.selectedVLAN = undefined;
            this.selectedLocalVLAN = undefined;
            this.selectedRemoteVLAN = undefined;
            this.options_all_VLAN = undefined;
            this.options_same_VLAN = undefined;
          }

          if (this.options_same_VLAN == undefined) {
            this.showAlert = true;
            this.showAlertAdvanced = true;
          } else {
            this.showAlert = false;
            this.showAlertAdvanced = false;
          }
        },
        error: error => {
          if (error) {
            this.loadVlan = false;
            this.loadVlanAdvanced = false;
            this.showAlert = true;
            this.showAlertAdvanced = true;
          }
        }
      });
      this.ThroughputsService.getSuggestedMEP(
        this.local_device_Object.IPADDRESS,
        this.remote_device_Object.IPADDRESS
      ).subscribe({
        next: data => {
          this.isShowMEP_local = true;
          this.MEPLocalSuggested = data.detail.local;
          this.meplocal = data.detail.local;
          this.MEPRemoteSuggested = data.detail.remote;
          this.mepremote = data.detail.local;
          this.messageService.add({
            severity: "success",
            summary: "Complete",
            detail: "MEP are generated!"
          });
        },
        error: error => {
          if (error.status == "503") {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.detail + " Please try to connect another IP "
            });
          } else {
            this.loadVlan = false;
            this.loadVlanAdvanced = false;
            this.showAlert = true;
            this.showAlertAdvanced = true;
          }
        }
      });
    } else if (
      this.local_device_Object.IPADDRESS != undefined &&
      this.remote_device_Object.IPADDRESS != undefined
    ) {
      this.ThroughputsService.getSupportedVLAN(
        this.local_device_Object.IPADDRESS,
        this.remote_device_Object.IPADDRESS
      ).subscribe({
        next: result => {
          this.options_all_VLAN = result.detail.all_vlan;
          this.options_same_VLAN = result.detail.same_vlan;
          this.options_local_VLAN = result.detail.local_vlan;
          this.options_remote_VLAN = result.detail.remote_vlan;
          this.sameVlan = result.detail.same_vlan;
        }
      });
    }
  }

  refTableMapper(key) {
    return key === "rcnetnode" ? "Nview" : key === "rcview" ? "RCview" : "";
  }

  onChangeLocalIP_ad(event) {
    this.local_device_Object.IPADDRESS = event.value.IPADDRESS;
    this.isShowVLAN = false;
    this.options_same_VLAN = undefined;
    this.options_local_VLAN = undefined;
    this.options_remote_VLAN = undefined;
    this.selectedVLAN = undefined;
    this.selectedLocalVLAN = undefined;
    this.selectedRemoteVLAN = undefined;
    this.loadVlan = false;
    this.loadVlanAdvanced = false;
    this.isShowMEP_local = false;
    this.MEPRemoteSuggested = undefined;
    this.MEPLocalSuggested = undefined;
    this.showAlertAdvanced = false;
    this.onReadyIPAddressAdvanced();
    this.IPADDRES_Localobject2func.iRCNETypeID = event.value.iRCNETypeID;
    this.IPADDRES_Localobject.iRCNETypeID = event.value.iRCNETypeID;
    this.label = true;
    this.messagelocal = "pending ...";
    this.messagelocaltp = "pending ...";
    if (this.selectedDeviceTypes == "Throughput test") {
      this.showterminal4 = true;
      this.show3 = "show";
      this.child3.underlying.reset();
      this.underlying3.setOption("fontSize", 20);
      this.underlying3.setOption("lineHeight", 2);
      this.child3.write(this.messagelocaltp);
    }
    if (this.selectedDeviceTypes == "CFM") {
      this.showterminal = true;
      this.show = "show";
      this.child.underlying.reset();
      this.terminal_prompt = this.messagelocal;
      this.underlying = this.child.underlying;
      this.underlying.setOption("fontSize", 20);
      this.underlying.setOption("lineHeight", 2);
      this.child.write(this.messagelocal);
      this.child.keyEventInput.subscribe(e => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        if (ev.keyCode > 0) {
          this.sendCommand(this.input_command);
          this.input_command = ""; // clear buffer
        } else if (ev.keyCode === 8) {
          if (
            this.child.underlying.buffer.active.cursorX >
            this.terminal_prompt.length
          ) {
            this.child.write("\b \b");
            this.input_command = this.input_command.slice(0, -1);
          }
        } else if (printable) {
          this.child.write(e.key);
          this.input_command += e.key;
        }
      });
    }
    this.res_ID = event.value.IRCNETNODEID;
    this.iconshow = true;
    this.imageshow = false;
    this.ThroughputsService.getdeviceInformation(this.res_ID).subscribe({
      next: result => {
        this.iconshow = false;
        this.imageshow = true;
        this.device_image_local =
          "data:image/png;base64," + result.data.base64Image;
      },
      error: error => {
        if (error) {
          this.iconshow = false;
          this.imageshow = true;
          this.device_image_local = "./assets/img/device.png";
        }
      }
    });
    if (this.local_device_Object.IPADDRESS !== undefined) {
      this.mac_ad = event.value.MACADDRESS;
    }
    if (this.local_device_Object.IPADDRESS == "") {
      this.clear_ad = false;
      this.label_ad = false;
    } else if (this.local_device_Object.IPADDRESS != "") {
      this.clear_ad = true;
      this.validator_class_local_device2func = "";
      this.label_ad = true;
    }
    this.ThroughputsService.getPortName(
      this.IPADDRES_Localobject2func.iRCNETypeID
    ).subscribe({
      next: data => {
        this.portname_options_local_CFM = data;
      }
    });
  }

  onClear_IPADDRESS_Array() {
    this.label = false;
    this.mac = "";
    this.isShowVLAN = false;
    this.options_same_VLAN = undefined;
    this.options_local_VLAN = undefined;
    this.options_remote_VLAN = undefined;
    this.selectedVLAN = undefined;
    this.selectedLocalVLAN = undefined;
    this.selectedRemoteVLAN = undefined;
    this.local_device.IPADDRESS = undefined;
    this.loadVlan = false;
    this.loadVlanAdvanced = false;
    this.showAlert = false;
    this.showAlertAdvanced = false;
    this.validator_class_local_uplink = "";
    this.validator_class_local_VLAN = "";
    this.onClearlabelremote();
  }
  async onClear_IPADDRESS_Array2func() {
    this.label_ad = false;
    this.mac_ad = "";
    this.device_image_local = "./assets/img/device.png";
    this.iconshow = false;
    this.imageshow = true;
    this.child.underlying.reset();
    this.child3.underlying.reset();
    this.messagelocal = "Please select IP Address Local Device ...";
    this.messagelocaltp = "Please select IP Address Local Device ...";
    await this.child.write(this.messagelocal);
    await this.child3.write(this.messagelocaltp);
    this.isShowVLAN = false;
    this.options_same_VLAN = undefined;
    this.options_local_VLAN = undefined;
    this.options_remote_VLAN = undefined;
    this.selectedVLAN = undefined;
    this.selectedLocalVLAN = undefined;
    this.selectedRemoteVLAN = undefined;
    this.remote_device.IPADDRESS = undefined;
    this.loadVlan = false;
    this.loadVlanAdvanced = false;
    this.isShowMEP_local = false;
    this.MEPRemoteSuggested = undefined;
    this.MEPLocalSuggested = undefined;
    this.showAlertAdvanced = false;
    this.local_device_Object.IPADDRESS = undefined;
  }
  onClearlabelremote() {
    this.labelremote = false;
    this.isShowVLAN = false;
    this.options_same_VLAN = undefined;
    this.options_local_VLAN = undefined;
    this.options_remote_VLAN = undefined;
    this.selectedVLAN = undefined;
    this.selectedLocalVLAN = undefined;
    this.selectedRemoteVLAN = undefined;
    this.remote_device.IPADDRESS = undefined;
    this.showAlert = false;
    this.showAlertAdvanced = false;
    this.validator_class_remote_uplink = "";
    this.validator_class_remote_VLAN = "";
    this.IPADDRES_Remoteobject.iRCNETypeID = undefined;
    this.selectIP_remote = "";
    this.isShowUplinkDownlink_remote = false;
  }
  async onClear_IPADDRES_RemoteArray() {
    this.labelremote_ad = false;
    this.device_image_remote = "./assets/img/device.png";
    this.iconshow2 = false;
    this.imageshow2 = true;
    this.child2.underlying.reset();
    this.messageremote = "Please select IP Address Remote Device ...";
    await this.child2.write(this.messageremote);
    this.isShowVLAN = false;
    this.options_same_VLAN = undefined;
    this.options_local_VLAN = undefined;
    this.options_remote_VLAN = undefined;
    this.selectedVLAN = undefined;
    this.selectedLocalVLAN = undefined;
    this.selectedRemoteVLAN = undefined;
    this.remote_device.IPADDRESS = undefined;
    this.loadVlan = false;
    this.loadVlanAdvanced = false;
    this.isShowMEP_local = false;
    this.MEPRemoteSuggested = undefined;
    this.MEPLocalSuggested = undefined;
    this.showAlertAdvanced = false;
    this.remote_device_Object.IPADDRESS = undefined;
  }

  onChangeRemoteIP(event) {
    if (event.value) {
      this.selected_portname_uplink_CFM_local = "";
      this.remote_device.IPADDRESS = event.value.IPADDRESS;
      this.IPADDRES_Remoteobject.iRCNETypeID = event.value.iRCNETypeID;
      this.IPADDRES_Remoteobject.ref_table = event.value.ref_table;
      this.IPADDRES_Remoteobject2func.iRCNETypeID = event.value.iRCNETypeID;
      this.labelremote_ad = true;
      this.isShowVLAN = false;
      this.options_same_VLAN = undefined;
      this.options_local_VLAN = undefined;
      this.options_remote_VLAN = undefined;
      this.selectedVLAN = undefined;
      this.selectedLocalVLAN = undefined;
      this.selectedRemoteVLAN = undefined;
      this.loadVlan = false;
      this.loadVlanAdvanced = false;
      if (this.remote_device.IPADDRESS == undefined) {
        this.clearremote = false;
        this.labelremote = false;
      } else if (this.remote_device.IPADDRESS != undefined) {
        this.clearremote = true;
        this.validator_class_local_VLAN = "";
        this.validator_class_remote_device = "";
        this.labelremote = true;
        this.onReadyIPAddress();
      }
      this.ThroughputsService.getPortName(
        this.IPADDRES_Remoteobject.iRCNETypeID
      ).subscribe({
        next: data => {
          this.portname_options_remote_CFM = data;
        }
      });
    } else {
      this.isShowUplinkDownlink_remote = false;
    }
  }

  onChangeRemoteIP_ad(event) {
    // this.selectIP_remote = event.value.IPADDRESS;
    this.remote_device_Object.IPADDRESS = event.value.IPADDRESS;
    this.IPADDRES_Remoteobject2func.iRCNETypeID = event.value.iRCNETypeID;
    this.IPADDRES_Remoteobject.iRCNETypeID = event.value.iRCNETypeID;
    this.labelremote = true;
    this.isShowVLAN = false;
    this.options_same_VLAN = undefined;
    this.options_local_VLAN = undefined;
    this.options_remote_VLAN = undefined;
    this.selectedVLAN = undefined;
    this.selectedLocalVLAN = undefined;
    this.selectedRemoteVLAN = undefined;
    this.remote_device.IPADDRESS = undefined;
    this.loadVlan = false;
    this.loadVlanAdvanced = false;
    this.showAlertAdvanced = false;
    this.isShowMEP_local = false;
    this.MEPRemoteSuggested = undefined;
    this.MEPLocalSuggested = undefined;
    this.showAlertAdvanced = false;
    this.onReadyIPAddressAdvanced();
    this.messageremote = "pending ...";
    this.messageremotetp = "pending ...";
    if (this.selectedDeviceTypes == "Throughput test") {
      this.show2 = "hide";
    }
    if (this.selectedDeviceTypes == "Loopback") {
      this.show2 = "hide";
      this.showterminal3 = true;
      this.show4 = "show";
      this.res_ID2 = event.value.IRCNETNODEID;
      this.child4.underlying.reset();
      this.messageremote = "pending ...";
      this.terminal_prompt4 = this.messageremote;
      this.underlying4 = this.child4.underlying;
      this.underlying4.setOption("fontSize", 20);
      this.underlying4.setOption("lineHeight", 2);
      this.child4.write(this.messageremote);
      this.child4.keyEventInput.subscribe(e => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        if (ev.keyCode > 0) {
          this.sendCommand(this.input_command4);
          this.input_command4 = ""; // clear buffer
        } else if (ev.keyCode === 8) {
          if (
            this.child4.underlying.buffer.active.cursorX >
            this.terminal_prompt4.length
          ) {
            this.child4.write("\b \b");
            this.input_command4 = this.input_command4.slice(0, -1);
          }
        } else if (printable) {
          this.child4.write(e.key);
          this.input_command4 += e.key;
        }
      });
    } else if (this.selectedDeviceTypes == "CFM") {
      this.showterminal2 = true;
      this.show2 = "show";
      this.res_ID2 = event.value.IRCNETNODEID;
      this.child2.underlying.reset();
      this.messageremote = "pending ...";
      this.terminal_prompt2 = this.messageremote;
      this.underlying2 = this.child2.underlying;
      this.underlying2.setOption("fontSize", 20);
      this.underlying2.setOption("lineHeight", 2);
      this.child2.write(this.messageremote);
      this.child2.keyEventInput.subscribe(e => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        if (ev.keyCode > 0) {
          this.sendCommand(this.input_command2);
          this.input_command2 = ""; // clear buffer
        } else if (ev.keyCode === 8) {
          if (
            this.child2.underlying.buffer.active.cursorX >
            this.terminal_prompt2.length
          ) {
            this.child2.write("\b \b");
            this.input_command2 = this.input_command2.slice(0, -1);
          }
        } else if (printable) {
          this.child2.write(e.key);
          this.input_command2 += e.key;
        }
      });
    }
    this.iconshow2 = true;
    this.imageshow2 = false;
    this.ThroughputsService.getdeviceInformation(this.res_ID2).subscribe({
      next: result => {
        this.iconshow2 = false;
        this.imageshow2 = true;
        this.device_image_remote =
          "data:image/png;base64," + result.data.base64Image;
      },
      error: error => {
        if (error) {
          this.iconshow2 = false;
          this.imageshow2 = true;
          this.device_image_remote = "./assets/img/device.png";
        }
      }
    });

    if (this.remote_device_Object.IPADDRESS == undefined) {
      this.clearremote_ad = false;
      this.labelremote_ad = false;
    } else if (this.remote_device_Object.IPADDRESS != undefined) {
      this.clearremote_ad = true;
      this.validator_class_remote_device2func = "";
      this.labelremote_ad = true;
    }
    this.ThroughputsService.getPortName(
      this.IPADDRES_Remoteobject2func.iRCNETypeID
    ).subscribe({
      next: data => {
        this.portname_options_remote_CFM = data;
      }
    });
  }
  onChangeMode(event) {
    this.Throughput.mode = event.value.name;
    if (this.Throughput.mode == "performance") {
      this.activate = true;
      this.activates = false;
      this.invinvalid_selectedMode = "";
    } else if (this.Throughput.mode == "configuration") {
      this.activates = true;
      this.activate = false;
      this.invinvalid_selectedMode = "";
    }
  }
  onChangeMode_ad(event) {
    this.Throughput_2func.mode = event.value.name;
    if (this.Throughput_2func.mode == "performance") {
      this.activate_ad = true;
      this.activates_ad = false;
      this.invinvalid_selectedMode_2func = "";
    } else if (this.Throughput_2func.mode == "configuration") {
      this.activates_ad = true;
      this.activate_ad = false;
      this.invinvalid_selectedMode_2func = "";
    }
  }
  callCFMTest(
    cfm: CFM,
    local_device: local_device,
    remote_device: remote_device
  ) {
    this.submitted_CFM = true;
    this.submitteds_CFMlocalsimple = true;
    this.submitted_CFMlsimple = true;
    this.submitted_CFMlsimple1past = true;
    this.submitted_uplinkRemotesimple = true;
    if (
      cfm.vlan !== undefined &&
      local_device.IPADDRESS !== undefined &&
      remote_device.IPADDRESS !== undefined &&
      local_device.nni !== undefined &&
      local_device.uni !== undefined &&
      remote_device.nni !== undefined
    ) {
      if (this.resultCFMtest_local != "" && this.resultCFMtest_remote != "") {
        this.resultCFMtest_local = "pending ...";
        this.resultCFMtest_remote = "pending ...";
        this.loading_Result = true;
      }
      this.cfm = cfm;
      this.cfm.service_name = this.service_name;
      this.local_device.mep = this.meplocal;
      this.remote_device.mep = this.mepremote;
      this.local_device = local_device;
      this.remote_device = remote_device;
      this.resultCFM = {
        vlan: cfm.vlan,
        service_name: cfm.service_name,
        local_device: {
          username: this.user_local1,
          password: this.password_local1,
          IPADDRESS: local_device.IPADDRESS,
          mep: local_device.mep,
          nni: local_device.nni,
          uni: local_device.uni
        },
        remote_device: {
          username: this.user_remote1,
          password: this.password_remote1,
          IPADDRESS: remote_device.IPADDRESS,
          mep: remote_device.mep,
          nni: remote_device.nni
        }
      };
      this.action_Dialog_CFMtest2func = true;
      this.dialogHeader = "CFM test";
      this.ThroughputsService.createCFM(this.resultCFM).subscribe({
        next: data => {
          this.resultCFMtest_local = data[0];
          this.resultCFMtest_remote = data[1];
          this.loading_Result = false;
        },
        error: error => {
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
          if (error) {
            this.resultCFMtest_local = error.message;
            this.resultCFMtest_remote = error.message;
            this.loading_Result = false;
          }
        }
      });
    } else if (
      (cfm.vlan == undefined,
      local_device.IPADDRESS == undefined,
      remote_device.IPADDRESS == undefined,
      local_device.nni == undefined,
      local_device.uni == undefined,
      remote_device.nni == undefined)
    ) {
      if (local_device.IPADDRESS == undefined) {
        this.validator_class_local_device = "ng-invalid ng-dirty";
        this.label = false;
      }
      if (remote_device.IPADDRESS == undefined) {
        this.validator_class_remote_device = "ng-invalid ng-dirty";
      }
      if (
        this.ThroughputsService.local_devices !== undefined &&
        this.ThroughputsService.local_devices !== ""
      ) {
        this.validator_class_local_device = "";
      }
    }
  }
  callCFMTest_ad() {
    this.submitted_CFM2func = true;
    this.submitteds_CFMremotesimple = true;
    this.submitted_CFMbut = true;
    this.submitted_userpass2func = true;
    this.submitted_uplinkCFMbut = true;
    this.required = true;
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (this.remote_device_Object.IPADDRESS == undefined) {
      this.validator_class_remote_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if (
      this.ThroughputsService.remote_devices !== undefined &&
      this.ThroughputsService.remote_devices !== ""
    ) {
      this.validator_class_remote_device2func = "";
    }
    if (
      (this.local_device_Object.IPADDRESS !== undefined,
      this.remote_device_Object.IPADDRESS !== undefined,
      this.selected_portname_downlink_local_advanced !== undefined,
      !Number.isNaN(Number(this.selectedVLAN)),
      this.remote_device_Object.IPADDRESS !== undefined,
      this.selected_portname_uplink_local_advanced !== undefined,
      this.selected_portname_uplink_remote_advanced !== undefined)
    ) {
      this.resultCFM_2func = {
        vlan: Number(this.selectedVLAN),
        service_name: this.service_name_ad,
        local_device: {
          username: this.user_local,
          password: this.password_local,
          IPADDRESS: this.local_device_Object.IPADDRESS,
          mep: this.meplocal_ad,
          nni: this.selected_portname_uplink_local_advanced
        },
        remote_device: {
          username: this.user_remote,
          password: this.password_remote,
          IPADDRESS: this.remote_device_Object.IPADDRESS,
          mep: this.mepremote_ad,
          nni: this.selected_portname_uplink_remote_advanced
        }
      };
      this.action_Dialog_CFMtest = true;
      this.dialogHeader = "CFM test";
      this.ThroughputsService.createCFM_ad(this.resultCFM_2func).subscribe({
        next: data => {
          this.resultCFMtest_local2func = data[0];
          this.resultCFMtest_remote2func = data[1];
          this.loading_Result = false;
        },
        error: error => {
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
          if (error) {
            this.resultCFMtest_local2func = error.message;
            this.resultCFMtest_remote2func = error.message;
            this.loading_Result = false;
          }
        }
      });
    } else {
    }
  }
  callCFMTestrun(
    cfm: CFM,
    local_device: local_device,
    remote_device: remote_device
  ) {
    this.submitted_CFM = true;
    this.submitteds_CFMlocalsimple = true;
    this.submitted_CFMlsimple = true;
    this.submitted_CFMlsimple1past = true;
    this.submitted_uplinkRemotesimple = true;
    let stoprun = "Stopped";
    if (
      cfm.vlan !== undefined &&
      local_device.IPADDRESS !== undefined &&
      remote_device.IPADDRESS !== undefined &&
      local_device.nni !== undefined &&
      local_device.uni !== undefined &&
      remote_device.nni !== undefined
    ) {
      this.cfm = cfm;
      this.cfm.service_name = this.service_name;
      this.local_device.mep = this.meplocal;
      this.remote_device.mep = this.mepremote;
      this.local_device = local_device;
      this.remote_device = remote_device;
      this.resultCFM = {
        vlan: cfm.vlan,
        service_name: cfm.service_name,
        local_device: {
          username: this.user_local1,
          password: this.password_local1,
          IPADDRESS: local_device.IPADDRESS,
          mep: local_device.mep,
          nni: local_device.nni,
          uni: local_device.uni
        },
        remote_device: {
          username: this.user_remote1,
          password: this.password_remote1,
          IPADDRESS: remote_device.IPADDRESS,
          mep: remote_device.mep,
          nni: remote_device.nni
        }
      };
      this.ThroughputsService.createCFM(this.resultCFM).subscribe({
        next: data => {
          this.resultCFMtest_local = data[0];
          this.resultCFMtest_remote = data[1];
          this.loading_CFMtest = false;
          setTimeout(() => {
            if (this.stop !== "true" && this.stop1 !== 1) {
              this.callThroughputTestrun();
            } else {
              this.showCFMerror = stoprun;
              this.showCFMerror1 = stoprun;
              this.resultLoopbackerror = stoprun;
              this.createthroghtputerror = stoprun;
              this.startthroghtputerror = stoprun;
              this.throughputResulterror = stoprun;
              this.loading_Localdevice = false;
              this.loading_Remotedevice = false;
              this.loading_Loopbackconfiguration = false;
              this.loading_CreateThroughputtest = false;
              this.loading_StartThroughputtest = false;
              this.loading_ThroughputResult = false;
            }
          }, 5000);
        },
        error: error => {
          if (error) {
            this.resultCFMerror = error.message;
            this.showCFMerror = stoprun;
            this.showCFMerror1 = stoprun;
            this.resultLoopbackerror = stoprun;
            this.createthroghtputerror = stoprun;
            this.startthroghtputerror = stoprun;
            this.throughputResulterror = stoprun;
            this.loading_Result = false;
            this.loading_CFMtest = false;
            this.loading_Localdevice = false;
            this.loading_Remotedevice = false;
            this.loading_Loopbackconfiguration = false;
            this.loading_CreateThroughputtest = false;
            this.loading_StartThroughputtest = false;
            this.loading_ThroughputResult = false;
          }
        }
      });
    } else if (
      (cfm.vlan == undefined,
      local_device.IPADDRESS == undefined,
      remote_device.IPADDRESS == undefined,
      local_device.nni == undefined,
      local_device.uni == undefined,
      remote_device.nni == undefined)
    ) {
      if (local_device.IPADDRESS == undefined) {
        this.validator_class_local_device = "ng-invalid ng-dirty";
      }
      if (remote_device.IPADDRESS == undefined) {
        this.validator_class_remote_device = "ng-invalid ng-dirty";
      }
      if (
        this.ThroughputsService.local_devices !== undefined &&
        this.ThroughputsService.local_devices !== ""
      ) {
        this.validator_class_local_device = "";
      }
    }
  }

  async callThroughputTest() {
    this.submitted_CFMlsimple1past = true;
    this.submitteds_CFMlocalsimple = true;
    if (this.local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (this.remote_device.IPADDRESS == undefined) {
      this.validator_class_remote_device = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    if (this.resultlocal != "" && this.resultremote != "") {
      this.resultlocal = "pending ...";
      this.resultremote = "pending ...";
      this.loading_Result = true;
      this.loading_re = true;
    }
    if (
      (this.local_device.IPADDRESS !== undefined,
      this.remote_device.IPADDRESS !== undefined)
    ) {
      this.action_Dialog_ResultCFM = true;
      this.dialogHeader = "Result CFM";
      this.ThroughputsService.ShowCFM(
        this.local_device.IPADDRESS,
        this.user_local1,
        this.password_local1
      ).subscribe({
        next: data => {
          this.resultlocal = data;
          this.loading_Result = false;
        },
        error: error => {
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
          if (error) {
            this.resultlocal = error.message;
            this.loading_Result = false;
          }
        }
      });

      await this.ThroughputsService.ShowCFM(
        this.remote_device.IPADDRESS,
        this.user_remote1,
        this.password_remote1
      ).subscribe({
        next: data => {
          this.resultremote = data;
          this.loading_re = false;
        },
        error: error => {
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
          if (error) {
            this.resultremote = error.message;
            this.loading_re = false;
          }
        }
      });
    }
    this.loading_Result = true;
  }
  callThroughputTest_adtest() {
    this.submitted_userpass2func = true;
    this.submitteds_CFMremotesimple = true;
    this.child3.underlying.reset();
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if (this.local_device_Object.IPADDRESS !== undefined) {
      this.messagelocaltp = "Running ...";
      this.child3.write(this.messagelocaltp);
      this.ThroughputsService.ShowethernetSAM(
        this.local_device_Object.IPADDRESS,
        this.user_local,
        this.password_local
      ).subscribe({
        next: data => {
          this.child3.underlying.reset();
          this.messagelocaltp = data;
          this.terminal_prompt3 = this.messagelocaltp;
          this.underlying3 = this.child3.underlying;
          this.underlying3.setOption("fontSize", 20);
          this.underlying3.setOption("lineHeight", 2);
          this.child3.write(this.messagelocaltp);
          this.child3.keyEventInput.subscribe(e => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode > 0) {
              this.sendCommand(this.input_command3);
              this.input_command3 = ""; // clear buffer
            } else if (ev.keyCode === 8) {
              if (
                this.child3.underlying.buffer.active.cursorX >
                this.terminal_prompt3.length
              ) {
                this.child3.write("\b \b");
                this.input_command3 = this.input_command3.slice(0, -1);
              }
            } else if (printable) {
              this.child3.write(e.key);
              this.input_command3 += e.key;
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
          if (error) {
            this.child3.underlying.reset();
            this.messagelocaltp = error.message;
            this.terminal_prompt3 = this.messagelocaltp;
            this.underlying3 = this.child3.underlying;
            this.underlying3.setOption("fontSize", 20);
            this.underlying3.setOption("lineHeight", 2);
            this.child3.write(this.messagelocaltp);
            this.child3.keyEventInput.subscribe(e => {
              const ev = e.domEvent;
              const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
              if (ev.keyCode === 13) {
                this.sendCommand(this.input_command3);
                this.input_command3 = ""; // clear buffer
              } else if (ev.keyCode === 8) {
                if (
                  this.child3.underlying.buffer.active.cursorX >
                  this.terminal_prompt3.length
                ) {
                  this.child3.write("\b \b");
                  this.input_command3 = this.input_command3.slice(0, -1);
                }
              } else if (printable) {
                this.child3.write(e.key);
                this.input_command3 += e.key;
              }
            });
          }
        }
      });
    }
  }
  callThroughputTest_ad() {
    this.submitted_userpass2func = true;
    this.submitteds_CFMremotesimple = true;
    this.child.underlying.reset();
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if (this.local_device_Object.IPADDRESS !== undefined) {
      this.messagelocal = "Running ...";
      this.child.write(this.messagelocal);
      this.ThroughputsService.ShowCFM(
        this.local_device_Object.IPADDRESS,
        this.user_local,
        this.password_local
      ).subscribe({
        next: data => {
          this.child.underlying.reset();
          this.messagelocal = data;
          this.terminal_prompt = this.messagelocal;
          this.underlying = this.child.underlying;
          this.underlying.setOption("fontSize", 20);
          this.underlying.setOption("lineHeight", 2);
          this.child.write(this.messagelocal);
          this.child.keyEventInput.subscribe(e => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode > 0) {
              this.sendCommand(this.input_command);
              this.input_command = ""; // clear buffer
            } else if (ev.keyCode === 8) {
              if (
                this.child.underlying.buffer.active.cursorX >
                this.terminal_prompt.length
              ) {
                this.child.write("\b \b");
                this.input_command = this.input_command.slice(0, -1);
              }
            } else if (printable) {
              this.child.write(e.key);
              this.input_command += e.key;
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
          if (error) {
            this.child.underlying.reset();
            this.messagelocal = error.message;
            this.terminal_prompt = this.messagelocal;
            this.underlying = this.child.underlying;
            this.underlying.setOption("fontSize", 20);
            this.underlying.setOption("lineHeight", 2);
            this.child.write(this.messagelocal);
            this.child.keyEventInput.subscribe(e => {
              const ev = e.domEvent;
              const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
              if (ev.keyCode === 13) {
                this.sendCommand(this.input_command);
                this.input_command = ""; // clear buffer
              } else if (ev.keyCode === 8) {
                if (
                  this.child.underlying.buffer.active.cursorX >
                  this.terminal_prompt.length
                ) {
                  this.child.write("\b \b");
                  this.input_command = this.input_command.slice(0, -1);
                }
              } else if (printable) {
                this.child.write(e.key);
                this.input_command += e.key;
              }
            });
          }
        }
      });
    }
  }
  callThroughputTest_ad2() {
    this.submitted_userpass2func = true;
    this.submitteds_CFMremotesimple = true;
    this.submitted_loopbackbut2past2func = true;
    this.child2.underlying.reset();
    if (this.remote_device_Object.IPADDRESS == undefined) {
      this.validator_class_remote_device2func = "ng-invalid ng-dirty";
    }
    if (this.remote_device_Object.IPADDRESS !== undefined) {
      this.messageremote = "Running ...";
      this.child2.write(this.messageremote);
      this.ThroughputsService.ShowCFM(
        this.remote_device_Object.IPADDRESS,
        this.user_remote,
        this.password_remote
      ).subscribe({
        next: data => {
          this.child2.underlying.reset();
          this.messageremote = data;
          this.terminal_prompt2 = this.messageremote;
          this.underlying2 = this.child2.underlying;
          this.underlying2.setOption("fontSize", 20);
          this.underlying2.setOption("lineHeight", 2);
          this.child2.write(this.messageremote);
          this.child2.keyEventInput.subscribe(e => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode > 0) {
              this.sendCommand(this.input_command2);
              this.input_command2 = ""; // clear buffer
            } else if (ev.keyCode === 8) {
              if (
                this.child2.underlying.buffer.active.cursorX >
                this.terminal_prompt2.length
              ) {
                this.child2.write("\b \b");
                this.input_command2 = this.input_command2.slice(0, -1);
              }
            } else if (printable) {
              this.child2.write(e.key);
              this.input_command2 += e.key;
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
          if (error) {
            this.child2.underlying.reset();
            this.messageremote = error.message;
            this.terminal_prompt2 = this.messageremote;
            this.underlying2 = this.child2.underlying;
            this.underlying2.setOption("fontSize", 20);
            this.underlying2.setOption("lineHeight", 2);
            this.child2.write(this.messageremote);
            this.child2.keyEventInput.subscribe(e => {
              const ev = e.domEvent;
              const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
              if (ev.keyCode > 0) {
                this.sendCommand(this.input_command2);
                this.input_command2 = ""; // clear buffer
              } else if (ev.keyCode === 8) {
                if (
                  this.child2.underlying.buffer.active.cursorX >
                  this.terminal_prompt2.length
                ) {
                  this.child2.write("\b \b");
                  this.input_command2 = this.input_command2.slice(0, -1);
                }
              } else if (printable) {
                this.child2.write(e.key);
                this.input_command2 += e.key;
              }
            });
          }
        }
      });
    }
  }
  callshowLoopback_ad2() {
    this.submitted_loopbackbut2past2func = true;
    this.submitted_userpass2func = true;
    this.submitteds_CFMremotesimple = true;
    this.child4.underlying.reset();
    if (
      this.remote_device_Object.IPADDRESS == undefined &&
      this.interface == undefined
    ) {
      this.validator_class_remote_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.remote_device_Object.IPADDRESS !== undefined &&
      this.interface !== undefined
    ) {
      this.messageremote = "Running ...";
      this.child4.write(this.messageremote);
      this.ThroughputsService.ShowLoopback(
        this.user_remote,
        this.password_remote,
        this.remote_device_Object.IPADDRESS,
        this.interface
      ).subscribe({
        next: data => {
          this.child4.underlying.reset();
          this.messageremote = data;
          this.terminal_prompt4 = this.messageremote;
          this.underlying4 = this.child4.underlying;
          this.underlying4.setOption("fontSize", 20);
          this.underlying4.setOption("lineHeight", 2);
          this.child4.write(this.messageremote);
          this.child4.keyEventInput.subscribe(e => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode > 0) {
              this.sendCommand(this.input_command4);
              this.input_command4 = ""; // clear buffer
            } else if (ev.keyCode === 8) {
              if (
                this.child4.underlying.buffer.active.cursorX >
                this.terminal_prompt4.length
              ) {
                this.child4.write("\b \b");
                this.input_command4 = this.input_command4.slice(0, -1);
              }
            } else if (printable) {
              this.child4.write(e.key);
              this.input_command4 += e.key;
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
          if (error) {
            this.child4.underlying.reset();
            this.messageremote = error.message;
            this.terminal_prompt4 = this.messageremote;
            this.underlying4 = this.child4.underlying;
            this.underlying4.setOption("fontSize", 20);
            this.underlying4.setOption("lineHeight", 2);
            this.child4.write(this.messageremote);
            this.child4.keyEventInput.subscribe(e => {
              const ev = e.domEvent;
              const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
              if (ev.keyCode > 0) {
                this.sendCommand(this.input_command4);
                this.input_command4 = ""; // clear buffer
              } else if (ev.keyCode === 8) {
                if (
                  this.child4.underlying.buffer.active.cursorX >
                  this.terminal_prompt4.length
                ) {
                  this.child4.write("\b \b");
                  this.input_command4 = this.input_command4.slice(0, -1);
                }
              } else if (printable) {
                this.child4.write(e.key);
                this.input_command4 += e.key;
              }
            });
          }
        }
      });
    }
  }
  callThroughputTestrun() {
    this.submitted_CFMlsimple1past = true;
    this.submitteds_CFMlocalsimple = true;
    let stoprun = "Stopped";
    if (this.local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (this.remote_device.IPADDRESS == undefined) {
      this.validator_class_remote_device = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    if (
      (this.local_device.IPADDRESS !== undefined,
      this.remote_device.IPADDRESS !== undefined)
    ) {
      this.ThroughputsService.ShowCFM(
        this.local_device.IPADDRESS,
        this.user_local1,
        this.password_local1
      ).subscribe({
        next: data => {
          this.resultlocal = data;
          this.loading_Localdevice = false;
          setTimeout(() => {
            if (this.stop !== "true" && this.stop1 !== 1) {
              this.callThroughputTestruns();
            } else {
              this.showCFMerror1 = stoprun;
              this.resultLoopbackerror = stoprun;
              this.createthroghtputerror = stoprun;
              this.startthroghtputerror = stoprun;
              this.throughputResulterror = stoprun;
              this.loading_Remotedevice = false;
              this.loading_Loopbackconfiguration = false;
              this.loading_CreateThroughputtest = false;
              this.loading_StartThroughputtest = false;
              this.loading_ThroughputResult = false;
            }
          }, 5000);
        },
        error: error => {
          if (error) {
            this.showCFMerror = error.message;
            this.showCFMerror1 = stoprun;
            this.resultLoopbackerror = stoprun;
            this.createthroghtputerror = stoprun;
            this.startthroghtputerror = stoprun;
            this.throughputResulterror = stoprun;
            this.loading_Localdevice = false;
            this.loading_Remotedevice = false;
            this.loading_Loopbackconfiguration = false;
            this.loading_CreateThroughputtest = false;
            this.loading_StartThroughputtest = false;
            this.loading_ThroughputResult = false;
          }
        }
      });
    }
    this.loading_Result = true;
  }

  callThroughputTestruns() {
    this.submitted_CFMlsimple1past = true;
    this.submitteds_CFMlocalsimple = true;
    let stoprun = "Stopped";
    if (this.local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (this.remote_device.IPADDRESS == undefined) {
      this.validator_class_remote_device = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    if (
      (this.local_device.IPADDRESS !== undefined,
      this.remote_device.IPADDRESS !== undefined)
    ) {
      this.ThroughputsService.ShowCFM(
        this.remote_device.IPADDRESS,
        this.user_remote1,
        this.password_remote1
      ).subscribe({
        next: data => {
          this.resultremote = data;
          this.loading_Remotedevice = false;
          setTimeout(() => {
            if (this.stop !== "true" && this.stop1 !== 1) {
              // this.callLoopbackTestrun(
              //   this.loopback,
              //   this.remote_device,
              //   this.local_device,
              //   this.loopback
              // );
            } else {
              this.resultLoopbackerror = stoprun;
              this.createthroghtputerror = stoprun;
              this.startthroghtputerror = stoprun;
              this.throughputResulterror = stoprun;
              this.loading_Loopbackconfiguration = false;
              this.loading_CreateThroughputtest = false;
              this.loading_StartThroughputtest = false;
              this.loading_ThroughputResult = false;
            }
          }, 5000);
        },
        error: error => {
          if (error) {
            this.showCFMerror1 = error.message;
            this.resultLoopbackerror = stoprun;
            this.createthroghtputerror = stoprun;
            this.startthroghtputerror = stoprun;
            this.throughputResulterror = stoprun;
            this.loading_Remotedevice = false;
            this.loading_Loopbackconfiguration = false;
            this.loading_CreateThroughputtest = false;
            this.loading_StartThroughputtest = false;
            this.loading_ThroughputResult = false;
          }
        }
      });
    }
    this.loading_Result = true;
  }

  callLoopbackTest_ad(loopback_ad: loopback) {
    this.submitteds_loopbackbut = true;
    this.submitted__loopbackbut2past = true;
    this.submitted_loopbackbut2past2func = true;
    this.submitted_userpass2func = true;
    this.submitted_macLoopbackbut = true;
    this.required = false;
    if (this.remote_device_Object.IPADDRESS == undefined) {
      this.validator_class_remote_device2func = "ng-invalid ng-dirty";
    }
    if (this.mac_ad !== "") {
      this.validator_class_local_device2func = "";
    }
    if (
      (this.interface !== undefined,
      !Number.isNaN(Number(this.selectedVLAN)),
      this.remote_device_Object.IPADDRESS !== undefined)
    ) {
      this.loopback_Object = loopback_ad;
      loopback_ad.ethertype = this.ethertype_ad;
      loopback_ad.interface = this.selected_portname_uplink_CFM_local;
      loopback_ad.local_ipaddress = this.local_device_Object.IPADDRESS;
      loopback_ad.remote_ipaddress = this.remote_device_Object.IPADDRESS;
      loopback_ad.username = this.user_remote2;
      loopback_ad.password = this.password_remote2;
      loopback_ad.vlan = Number(this.selectedVLAN);
      loopback_ad.mac = this.mac_ad;
      this.action_Dialog_Loopbackconfiguration2func = true;
      this.dialogHeader = "Loopback configuration";
      this.ThroughputsService.createLoopback(this.loopback_Object).subscribe({
        next: data => {
          this.resultloopback_2func = data;
          this.loading_Result = false;
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
    } else if (
      (this.vlan_ad == undefined,
      this.interface == undefined,
      this.remote_device_Object.IPADDRESS == undefined)
    ) {
      this.action_Dialog_Loopbackconfiguration2func = false;
    } else {
    }
    this.loading_Result = true;
  }

  stoprun() {
    this.stop = "true";
    this.stop1 = 1;
  }
  // async callLoopbackTestrun(
  //   loopback: loopback,
  //   remote_device: remote_device,
  //   local_device: local_device
  // ) {
  //   this.submitted_CFM = true;
  //   this.submitteds_CFMlocalsimple = true;
  //   this.submitted_CFMlsimple = true;
  //   this.submitted_Loopbackconfiguration = true;
  //   this.submitted_CFMlsimple1past = true;
  //   this.submitted_uplinkRemotesimple = true;
  //   let stoprun = "Stopped";
  //   if (
  //     local_device.IPADDRESS == undefined &&
  //     this.selectIP_remote == undefined
  //   ) {
  //     this.validator_class_local_device = "ng-invalid ng-dirty";
  //   }
  //   if (remote_device.IPADDRESS == undefined) {
  //     this.validator_class_remote_device = "ng-invalid ng-dirty";
  //   }
  //   if (
  //     this.ThroughputsService.local_devices !== undefined &&
  //     this.ThroughputsService.local_devices !== ""
  //   ) {
  //     this.validator_class_local_device = "";
  //   }
  //   this.loopback = loopback;
  //   loopback.ethertype = this.ethertype;
  //   loopback.interface = this.resultCFM.remote_device.nni;
  //   loopback.local_ipaddress = this.resultCFM.local_device.IPADDRESS;
  //   loopback.remote_ipaddress = this.resultCFM.remote_device.IPADDRESS;
  //   loopback.username = this.resultCFM.remote_device.username;
  //   loopback.password = this.resultCFM.remote_device.password;
  //   loopback.vlan = this.resultCFM.vlan;
  //   loopback.mac = this.mac;
  //   await this.ThroughputsService.createLoopback(this.loopback).subscribe({
  //     next: data => {
  //       this.resultloopback = data;
  //       this.loading_Loopbackconfiguration = false;
  //       setTimeout(() => {
  //         if (this.stop !== "true" && this.stop1 !== 1) {
  //           this.callcreatethroghtputTestrun(
  //             this.cfm,
  //             this.local_device,
  //             this.remote_device,
  //             this.createthroghtput
  //           );
  //         } else {
  //           this.createthroghtputerror = stoprun;
  //           this.startthroghtputerror = stoprun;
  //           this.throughputResulterror = stoprun;
  //           this.loading_CreateThroughputtest = false;
  //           this.loading_StartThroughputtest = false;
  //           this.loading_ThroughputResult = false;
  //         }
  //       }, 5000);
  //     },
  //     error: error => {
  //       if (error) {
  //         this.resultLoopbackerror = error.message;
  //         this.createthroghtputerror = stoprun;
  //         this.startthroghtputerror = stoprun;
  //         this.throughputResulterror = stoprun;
  //         this.loading_Loopbackconfiguration = false;
  //         this.loading_CreateThroughputtest = false;
  //         this.loading_StartThroughputtest = false;
  //         this.loading_ThroughputResult = false;
  //       }
  //     }
  //   });
  //   this.loading_Result = true;
  // }
  // callcreatethroghtputTest(
  //   cfm: CFM,
  //   local_device: local_device,
  //   remote_device: remote_device,
  //   createthroghtput: createthroghtput
  // ) {
  //   this.submitted_CFM = true;
  //   this.submitteds_CFMlocalsimple = true;
  //   this.submitted_CFMlsimple = true;
  //   this.submitted_CFMlsimple1past = true;
  //   this.submitted_uplinkRemotesimple = true;
  //   if (this.resultcreate != "") {
  //     this.resultcreate = "pending ...";
  //     this.loading_Result = true;
  //   }
  //   if (local_device.IPADDRESS == undefined) {
  //     this.validator_class_local_device = "ng-invalid ng-dirty";
  //   }
  //   if (remote_device.IPADDRESS == undefined) {
  //     this.validator_class_remote_device = "ng-invalid ng-dirty";
  //   }
  //   if (
  //     this.ThroughputsService.local_devices !== undefined &&
  //     this.ThroughputsService.local_devices !== ""
  //   ) {
  //     this.validator_class_local_device = "";
  //   }

  //   this.createthroghtput = createthroghtput;
  //   createthroghtput.frame_length = this.frameLengths;
  //   createthroghtput.flow_profile = this.flow_profile;
  //   createthroghtput.ethernetsam_service = this.service;
  //   // createthroghtput.frame_length = this.frame_length;
  //   createthroghtput.latency = this.latency;
  //   createthroghtput.jitter = this.jitter;
  //   createthroghtput.frame_loss_ratio = this.frame_loss_ratio;
  //   createthroghtput.availability = this.availability;
  //   createthroghtput.performance_bandwidth = Number(this.performance_bandwidth);
  //   createthroghtput.cir = this.cir;
  //   createthroghtput.eir = this.eir;
  //   createthroghtput.cbs = this.cbs;
  //   createthroghtput.ebs = this.ebs;
  //   createthroghtput.username = this.user_local1;
  //   createthroghtput.password = this.password_local1;
  //   createthroghtput.local_ipaddress = local_device.IPADDRESS;
  //   createthroghtput.remote_ipaddress = remote_device.IPADDRESS;
  //   createthroghtput.nni = local_device.nni;
  //   createthroghtput.uni = local_device.uni;
  //   createthroghtput.vlan = cfm.vlan;
  //   this.action_Dialog_CreateThroughputtest = true;
  //   this.dialogHeader = "Create Throughput test";
  //   if (
  //     (createthroghtput.local_ipaddress !== undefined,
  //     createthroghtput.remote_ipaddress !== undefined,
  //     createthroghtput.nni !== undefined,
  //     createthroghtput.uni !== undefined,
  //     createthroghtput.vlan !== undefined)
  //   ) {
  //     this.ThroughputsService.createthroghtput(this.createthroghtput).subscribe(
  //       {
  //         next: data => {
  //           this.resultcreate = data;
  //           this.loading_Result = false;
  //         },
  //         error: error => {
  //           if (error.status == 401) {
  //             this.messageService.add({
  //               severity: "error",
  //               summary: "Error",
  //               detail: "Session expired, please logout and login again."
  //             });
  //           }
  //           if (error) {
  //             this.resultcreate = error.message;
  //             this.loading_Result = false;
  //           }
  //         }
  //       }
  //     );
  //   } else if (
  //     (createthroghtput.local_ipaddress == undefined,
  //     createthroghtput.remote_ipaddress == undefined,
  //     createthroghtput.nni == undefined,
  //     createthroghtput.uni == undefined,
  //     createthroghtput.vlan == undefined)
  //   ) {
  //     this.action_Dialog_CreateThroughputtest = false;
  //   }
  //   this.loading_Result = true;
  // }

  callcreatethroghtputTest_ad(createthroghtput: createthroghtput) {
    this.submitted_throughtputbut = true;
    this.submitted_throughtputbut2func = true;
    this.submitted_userpass2func = true;
    this.required = true;
    if (this.resultcreate_2func != "") {
      this.resultcreate_2func = "pending ...";
      this.loading_Result = true;
    }
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (this.remote_device_Object.IPADDRESS == undefined) {
      this.validator_class_remote_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    this.createthroghtput = createthroghtput;
    createthroghtput.flow_profile = this.flow_profile_ad;
    createthroghtput.ethernetsam_service = this.service_ad;
    // createthroghtput.frame_length = this.frame_length_ad;
    createthroghtput.latency = this.latency_ad;
    createthroghtput.jitter = this.jitter_ad;
    createthroghtput.frame_loss_ratio = this.frame_loss_ratio_ad;
    createthroghtput.availability = this.availability_ad;
    createthroghtput.performance_bandwidth = this.performance_bandwidth_ad;
    createthroghtput.cir = this.cir_ad;
    createthroghtput.eir = this.eir_ad;
    createthroghtput.cbs = this.cbs_ad;
    createthroghtput.ebs = this.ebs_ad;
    createthroghtput.username = this.user_local;
    createthroghtput.password = this.password_local;
    createthroghtput.local_ipaddress = this.local_device_Object.IPADDRESS;
    createthroghtput.remote_ipaddress = this.remote_device_Object.IPADDRESS;
    createthroghtput.nni = this.selected_portname_uplink_throughput_advanced;
    createthroghtput.uni = this.selected_portname_downlink_throughput_advanced;
    createthroghtput.vlan = Number(this.selectedVLAN);
    if (
      this.local_device_Object.IPADDRESS !== undefined &&
      this.remote_device_Object.IPADDRESS !== undefined &&
      createthroghtput.nni !== undefined &&
      createthroghtput.uni !== undefined &&
      createthroghtput.vlan !== undefined
    ) {
      this.action_Dialog_CreateThroughputtest2func = true;
      this.dialogHeader = "Create Throughput test";
      this.ThroughputsService.createthroghtput(this.createthroghtput).subscribe(
        {
          next: data => {
            this.resultcreate_2func = data;
            this.loading_Result = false;
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
        }
      );
    }
    if (
      (this.local_device_Object.IPADDRESS == undefined,
      this.remote_device_Object.IPADDRESS == undefined,
      this.nni_ad == undefined,
      this.uni_ad == undefined,
      this.vlan_ad1 == undefined)
    ) {
    }
    this.loading_Result = true;
  }

  callcreatethroghtputTestrun(
    cfm: CFM,
    local_device: local_device,
    remote_device: remote_device,
    createthroghtput: createthroghtput
  ) {
    this.submitted_CFM = true;
    this.submitteds_CFMlocalsimple = true;
    this.submitted_CFMlsimple = true;
    this.submitted_CFMlsimple1past = true;
    this.submitted_uplinkRemotesimple = true;
    let stoprun = "Stopped";
    if (local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (remote_device.IPADDRESS == undefined) {
      this.validator_class_remote_device = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    createthroghtput.frame_length = this.frameLengths;
    this.createthroghtput = createthroghtput;
    createthroghtput.flow_profile = this.flow_profile;
    createthroghtput.ethernetsam_service = this.ethernetsam_service;
    // createthroghtput.frame_length = this.frame_length;
    createthroghtput.latency = this.latency;
    createthroghtput.jitter = this.jitter;
    createthroghtput.frame_loss_ratio = this.frame_loss_ratio;
    createthroghtput.availability = this.availability;
    createthroghtput.performance_bandwidth = this.performance_bandwidth;
    createthroghtput.cir = this.cir;
    createthroghtput.eir = this.eir;
    createthroghtput.cbs = this.cbs;
    createthroghtput.ebs = this.ebs;
    createthroghtput.username = this.user_local1;
    createthroghtput.password = this.password_local1;
    createthroghtput.local_ipaddress = local_device.IPADDRESS;
    createthroghtput.remote_ipaddress = remote_device.IPADDRESS;
    createthroghtput.nni = local_device.nni;
    createthroghtput.uni = local_device.uni;
    createthroghtput.vlan = cfm.vlan;
    this.ThroughputsService.createthroghtput(this.createthroghtput).subscribe({
      next: data => {
        this.resultcreate = data;
        this.loading_Result = false;
        this.loading_CreateThroughputtest = false;
        setTimeout(() => {
          if (this.stop !== "true" && this.stop1 !== 1) {
            this.callStartthroughputTestrun(this.local_device, this.Throughput);
          } else {
            this.startthroghtputerror = stoprun;
            this.throughputResulterror = stoprun;
            this.loading_StartThroughputtest = false;
            this.loading_ThroughputResult = false;
          }
        }, 5000);
      },
      error: error => {
        if (error) {
          this.createthroghtputerror = error.message;
          this.startthroghtputerror = stoprun;
          this.throughputResulterror = stoprun;
          this.loading_StartThroughputtest = false;
          this.loading_ThroughputResult = false;
        }
      }
    });
    this.loading_Result = true;
  }
  callStartthroughputTestrun(
    local_device: local_device,
    Throughput: Throughput
  ) {
    this.submitted_CFM = true;
    this.submitted_duration = true;
    this.submitted_CFMlsimple1past = true;
    let stoprun = "Stopped";
    if (Throughput.mode == undefined) {
      this.invinvalid_selectedMode = "ng-invalid ng-dirty";
    }
    if (local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }

    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }

    if (
      this.service !== undefined &&
      local_device.IPADDRESS !== undefined &&
      Throughput.mode !== undefined
    ) {
      this.Throughput = Throughput;
      Throughput.service = this.service;
      Throughput.username = this.user_local1;
      Throughput.password = this.password_local1;
      Throughput.ipaddress = local_device.IPADDRESS;
      Throughput.duration = this.duration;
      this.ThroughputsService.Startthroughput(this.Throughput).subscribe({
        next: data => {
          this.resultstart = data;
          this.loading_StartThroughputtest = false;
          setTimeout(() => {
            if (this.stop !== "true" && this.stop1 !== 1) {
              this.callShowthroughputTestresultrun(
                this.local_device,
                this.Throughput
              );
            } else {
              this.throughputResulterror = stoprun;
              this.loading_ThroughputResult = false;
              this.activatechart = false;
            }
          }, 5000);
        },
        error: error => {
          if (error) {
            this.startthroghtputerror = error.message;
            this.throughputResulterror = stoprun;
            this.loading_ThroughputResult = false;
          }
        }
      });
    }
    this.loading_Result = true;
  }
  hideDialog() {
    this.scheduleTaskDialog = false;
    this.submitted_CFM = false;
    this.TPRunTestDialog = false;
  }
  async callShowthroughputTestresult(
    local_device: local_device,
    Throughputs: Throughputs
  ) {
    this.submitted_CFMlsimple1past = true;
    if (Throughputs.mode == undefined) {
      this.invinvalid_selectedMode = "ng-invalid ng-dirty";
    }
    if (local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (this.remote_device.IPADDRESS == undefined) {
      this.validator_class_remote_device = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    if (this.resultThroughputs != "") {
      this.resultThroughputs = "pending ...";
      this.loading_Result = true;
    }
    if (
      this.service !== undefined &&
      local_device.IPADDRESS !== undefined &&
      Throughputs.mode !== undefined
    ) {
      this.action_Dialog_Showthroughputtestresult = true;
      this.dialogHeader = "Show throughput test result";
      this.Throughputs_testobject = Throughputs;
      Throughputs.service = this.service;
      Throughputs.username = this.user_local1;
      Throughputs.password = this.password_local1;
      Throughputs.ipaddress = local_device.IPADDRESS;
      this.ThroughputsService.loadchart(this.Throughputs_testobject).subscribe({
        next: result => {
          this.loading_Result = false;
          if (this.Throughput.mode == "configuration") {
            result.pop();
            var Latency = result.map(function(singleElement) {
              return parseInt(singleElement.latency);
            });
            var Jitter = result.map(function(singleElement) {
              return parseInt(singleElement.jitter);
            });
            var Frame_loss_ratio = result.map(function(singleElement) {
              return parseInt(singleElement.frame_loss_ratio);
            });
            var throughput = result.map(function(singleElement, index) {
              return "step " + (index + 1) + " - " + singleElement.throughput;
            });

            this.chartOptions = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Latency"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Latency (µs)"
                }
              },

              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Latency",
                  type: "column",
                  data: Latency,
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions2 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Jitter"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Jitter (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Jitter",
                  type: "column",
                  data: Jitter,
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions3 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Frame loss ratio"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Frame loss ratio (%)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (%)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Frame loss ratio",
                  type: "column",
                  data: Frame_loss_ratio,
                  color: "#D35400"
                }
              ]
            };
          } else if (this.Throughput.mode == "performance") {
            this.chartOptions = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Latency"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Latency (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Latency",
                  type: "column",
                  data: [result.FD.min, result.FD.mean, result.FD.max],
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions2 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Jitter"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Jitter (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Jitter",
                  type: "column",
                  data: [result.FDV.min, result.FDV.mean, result.FDV.max],
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions3 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Frame loss ratio"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Frame loss ratio (%)"
                }
              },
              series: [
                {
                  name: "Frame loss ratio",
                  type: "column",
                  data: [result.FLR.min, result.FLR.mean, result.FLR.max],
                  color: "#D35400"
                }
              ]
            };
          }

          setTimeout(() => {
            this.activatechart = true;
          }, 5000);
        },
        //this is show throughput test result btn
        error: error => {
          this.loading_Result = false;
          if (error.status == 425) {
            let countdown = this.duration; // 60 seconds = 1 minute

            // Display initial error message
            const errorMessage = this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: `Incorrect data for chart.`
            });

            // this.activatechart = false;
            // this.countdownState = true;
          }
        }
      });
    }
    this.loading_Result = true;
  }

  callShowthroughputTestresult_ad(Throughputs: Throughputs) {
    this.submitted_userpass2func = true;
    this.required = true;
    if (Throughputs.mode == undefined) {
      this.invinvalid_selectedMode_2func = "ng-invalid ng-dirty";
    }
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if (this.resultThroughputs_2func != "") {
      this.resultThroughputs_2func = "pending ...";
      this.loading_Result = true;
    }
    Throughputs.mode = this.Throughput_2func.mode;
    if (this.local_device_Object.IPADDRESS !== undefined) {
      this.action_Dialog_Showthroughputtestresult2func = true;
      this.dialogHeader = "Show throughput test result";
      this.Throughputs_testobject = Throughputs;
      Throughputs.service = this.service_ad;
      Throughputs.username = this.user_local;
      Throughputs.password = this.password_local;
      Throughputs.ipaddress = this.local_device_Object.IPADDRESS;
      this.ThroughputsService.loadchart(this.Throughputs_testobject).subscribe({
        next: result => {
          this.loading_Result = false;
          this.activatechart = true;
          if (this.Throughput_2func.mode == "configuration") {
            result.pop();
            var Latency = result.map(function(singleElement) {
              return parseInt(singleElement.latency);
            });
            var Jitter = result.map(function(singleElement) {
              return parseInt(singleElement.jitter);
            });
            var Frame_loss_ratio = result.map(function(singleElement) {
              return parseInt(singleElement.frame_loss_ratio);
            });
            var throughput = result.map(function(singleElement, index) {
              return "step " + (index + 1) + " - " + singleElement.throughput;
            });
            this.chartOptions = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Latency"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Latency (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Latency",
                  type: "column",
                  data: Latency,
                  color: "#D35400"
                }
              ]
            };
            this.chartOptions2 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Jitter"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Jitter (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Jitter",
                  type: "column",
                  data: Jitter,
                  color: "#D35400"
                }
              ]
            };
            this.chartOptions3 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Frame loss ratio"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Frame loss ratio (%)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (%)</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Frame loss ratio",
                  type: "column",
                  data: Frame_loss_ratio,
                  color: "#D35400"
                }
              ]
            };
          } else if (this.Throughput_2func.mode == "performance") {
            this.chartOptions = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Latency"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Latency (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',
                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Latency",
                  type: "column",
                  data: [result.FD.min, result.FD.mean, result.FD.max],
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions2 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Jitter"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Jitter (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Jitter",
                  type: "column",
                  data: [result.FDV.min, result.FDV.mean, result.FDV.max],
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions3 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Frame loss ratio"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Frame loss ratio (%)"
                }
              },
              series: [
                {
                  name: "Frame loss ratio",
                  type: "column",
                  data: [result.FLR.min, result.FLR.mean, result.FLR.max],
                  color: "#D35400"
                }
              ]
            };
          }
        },
        error: error => {
          if (error.status == "500") {
            this.loading_Result = false;
            this.activatechart = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Incorrect data for chart."
            });
          }
        }
      });
    }
    this.loading_Result = true;
  }

  async callShowthroughputTestresultrun(
    local_device: local_device,
    Throughputs: Throughputs
  ) {
    this.submitted_CFM = true;
    this.submitted_CFMlsimple1past = true;
    if (Throughputs.mode == undefined) {
      this.invinvalid_selectedMode = "ng-invalid ng-dirty";
    }
    if (local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    if (
      this.service !== undefined &&
      local_device.IPADDRESS !== undefined &&
      Throughputs.mode !== undefined
    ) {
      this.Throughputs_testobject = Throughputs;
      Throughputs.service = this.service;
      Throughputs.username = this.user_local1;
      Throughputs.password = this.password_local1;
      Throughputs.ipaddress = local_device.IPADDRESS;
      await this.ThroughputsService.loadchart(
        this.Throughputs_testobject
      ).subscribe({
        next: result => {
          this.loading_ThroughputResult = false;
          this.callShowthroughputTestresult(local_device, this.Throughput);
          if (this.Throughput.mode == "configuration") {
            var Latency = result.map(function(singleElement) {
              return parseInt(singleElement.latency);
            });
            var Jitter = result.map(function(singleElement) {
              return parseInt(singleElement.jitter);
            });
            var Frame_loss_ratio = result.map(function(singleElement) {
              return parseInt(singleElement.frame_loss_ratio);
            });
            var throughput = result.map(function(singleElement, index) {
              return "step " + (index + 1) + " - " + singleElement.throughput;
            });

            this.chartOptions = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Latency"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Latency (µs)"
                }
              },

              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Latency",
                  type: "column",
                  data: Latency,
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions2 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Jitter"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Jitter (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Jitter",
                  type: "column",
                  data: Jitter,
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions3 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Frame loss ratio"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: throughput
              },
              yAxis: {
                title: {
                  text: "Frame loss ratio (%)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (%)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Frame loss ratio",
                  type: "column",
                  data: Frame_loss_ratio,
                  color: "#D35400"
                }
              ]
            };
          } else if (this.Throughput.mode == "performance") {
            this.chartOptions = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Latency"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Latency (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Latency",
                  type: "column",
                  data: [result.FD.min, result.FD.mean, result.FD.max],
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions2 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Jitter"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Jitter (µs)"
                }
              },
              tooltip: {
                headerFormat:
                  '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                  '<tr><td style="color:{series.color};padding:0">{series.name} &nbsp;</td>' +
                  '<td style="padding:0"><b>{point.y:.0f} (µs)</b></td></tr>',

                shared: true,
                useHTML: true
              },
              series: [
                {
                  name: "Jitter",
                  type: "column",
                  data: [result.FDV.min, result.FDV.mean, result.FDV.max],
                  color: "#D35400"
                }
              ]
            };

            this.chartOptions3 = {
              exporting: {
                showTable: false,
                tableCaption: "Data table",
                csv: {
                  dateFormat: "%Y-%m-%d"
                }
              },
              title: {
                text: "Frame loss ratio"
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              xAxis: {
                crosshair: true,
                categories: ["min", "mean", "max"]
              },
              yAxis: {
                title: {
                  text: "Frame loss ratio (%)"
                }
              },
              series: [
                {
                  name: "Frame loss ratio",
                  type: "column",
                  data: [result.FLR.min, result.FLR.mean, result.FLR.max],
                  color: "#D35400"
                }
              ]
            };
          }

          setTimeout(() => {
            this.activatechart = true;
          }, 5000);
        },
        //this is run btn
        error: error => {
          this.loading_Result = false;

          if (error.status == 425) {
            let countdown = this.duration * 60; // 60 seconds = 1 minute

            // Display initial error message
            const errorMessage = this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: `Test in progress, Countdown: ${countdown} seconds`
            });

            this.activatechart = false;
            this.countdownState = true;

            const countdownInterval = setInterval(() => {
              countdown -= 5;

              if (countdown <= 0) {
                this.callShowthroughputTestresult(
                  local_device,
                  this.Throughput
                );
                // this.action_Dialog_Showthroughputtestresult = true;
                clearInterval(countdownInterval);
                // Remove the countdown message
                this.countdownState = false;
              } else {
                const errorMessage = this.messageService.add({
                  severity: "warning",
                  summary: "Error",
                  detail: `Test in progress, Countdown: ${countdown} seconds`
                });
                // Update the countdown in the existing error message
                // errorMessage. = `Incorrect data for chart. Countdown: ${countdown} seconds`;
              }
            }, 5000); // Update countdown every second
          }
          if (error.status == 500) {
            const errorMessage = this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: `Internal Server Error`
            });
          }
        }
      });
    }
    this.loading_Result = true;
  }
  cancel() {
    this.loading_Run = false;
    this.resultCFMtest_local = "";
    this.resultCFMtest_remote = "";
    this.resultlocal = "";
    this.resultremote = "";
    this.resultloopback = "";
    this.resultcreate = "";
    this.resultstart = "";
    this.resultThroughputs = "";
  }

  packData(
    cfm: CFM,
    local_device: local_device,
    remote_device: remote_device,
    loopback: loopback,
    createthroghtput: createthroghtput,
    Throughput: Throughput
  ) {
    this.cfm = cfm;
    this.cfm.service_name = this.service_name;
    this.local_device.mep = this.meplocal;
    this.remote_device.mep = this.mepremote;
    this.local_device = local_device;
    this.remote_device = remote_device;
    this.resultCFM = {
      vlan: Number(this.selectedLocalVLAN),
      service_name: cfm.service_name,
      local_device: {
        username: this.user_local1,
        password: this.password_local1,
        IPADDRESS: local_device.IPADDRESS,
        mep: local_device.mep,
        nni: local_device.nni,
        uni: local_device.uni,
        local_vlan: this.selectedLocalVLAN
      },
      remote_device: {
        username: this.user_remote1,
        password: this.password_remote1,
        IPADDRESS: remote_device.IPADDRESS,
        mep: remote_device.mep,
        nni: remote_device.nni,
        remote_vlan: this.selectedRemoteVLAN
      }
    };
    this.cfm.vlan = Number(this.selectedLocalVLAN);
    this.loopback = loopback;
    loopback.ethertype = this.ethertype;
    loopback.interface = this.resultCFM.remote_device.nni;
    loopback.local_ipaddress = this.resultCFM.local_device.IPADDRESS;
    loopback.remote_ipaddress = this.resultCFM.remote_device.IPADDRESS;
    loopback.username = this.resultCFM.remote_device.username;
    loopback.password = this.resultCFM.remote_device.password;
    loopback.vlan = this.resultCFM.vlan;
    loopback.mac = this.mac;
    this.createthroghtput = createthroghtput;
    createthroghtput.flow_profile = this.flow_profile;
    createthroghtput.ethernetsam_service = this.ethernetsam_service;
    createthroghtput.latency = this.latency;
    createthroghtput.jitter = this.jitter;
    createthroghtput.frame_loss_ratio = this.frame_loss_ratio;
    createthroghtput.availability = this.availability;
    createthroghtput.performance_bandwidth = Number(this.performance_bandwidth);
    createthroghtput.frame_length = this.frameLengths;
    createthroghtput.cir = this.cir;
    createthroghtput.eir = this.eir;
    createthroghtput.cbs = this.cbs;
    createthroghtput.ebs = this.ebs;
    createthroghtput.username = this.user_local1;
    createthroghtput.password = this.password_local1;
    createthroghtput.local_ipaddress = local_device.IPADDRESS;
    createthroghtput.remote_ipaddress = remote_device.IPADDRESS;
    createthroghtput.nni = local_device.nni;
    createthroghtput.uni = local_device.uni;
    createthroghtput.vlan = Number(this.selectedLocalVLAN);

    this.Throughput = Throughput;
    Throughput.service = this.service;
    Throughput.username = this.user_local1;
    Throughput.password = this.password_local1;
    Throughput.ipaddress = local_device.IPADDRESS;
    Throughput.duration = this.duration;

    return {
      cfmData: this.resultCFM,
      loopbackData: this.loopback,
      setThroughputData: this.createthroghtput,
      startThroughputData: this.Throughput,
      catID: this.selectedCATID
    };
  }

  getCurrentDate() {
    var runTestDate = new Date();
    var year = runTestDate.getFullYear();
    var month = runTestDate.getMonth() + 1;
    var day = runTestDate.getDate();
    var hours = runTestDate.getHours();
    var minutes = runTestDate.getMinutes();
    var seconds = runTestDate.getSeconds();
    var formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
  TPRunTestDialog: boolean;
  RunTestDialog(
    cfm: CFM,
    local_device: local_device,
    remote_device: remote_device,
    loopback: loopback,
    createthroghtput: createthroghtput,
    Throughput: Throughput
  ) {
    console.log(
      this.local_device.IPADDRESS,
      remote_device.IPADDRESS,
      local_device.nni,
      remote_device.nni,
      this.selectedLocalVLAN,
      this.selectedRemoteVLAN
    );
    if (
      this.local_device.IPADDRESS != undefined &&
      this.remote_device.IPADDRESS != undefined &&
      this.local_device.nni != undefined &&
      this.remote_device.nni != undefined &&
      this.selectedLocalVLAN != undefined &&
      this.selectedRemoteVLAN != undefined
    ) {
      this.TPRunTestDialog = true;
      this.dialogHeader = "Confirm for Run Throughtput Test";
      this.packData(
        cfm,
        local_device,
        remote_device,
        loopback,
        createthroghtput,
        Throughput
      );
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select before running"
      });
      if (!this.local_device.IPADDRESS) {
        this.validator_class_local_device = "ng-invalid ng-dirty";
      }
      if (!this.remote_device.IPADDRESS) {
        this.validator_class_remote_device = "ng-invalid ng-dirty";
      }
      if (!this.local_device.nni) {
        this.validator_class_local_uplink = "ng-invalid ng-dirty";
      }
      if (!this.remote_device.nni) {
        this.validator_class_remote_uplink = "ng-invalid ng-dirty";
      }
      if (!this.selectedLocalVLAN) {
        this.validator_class_local_VLAN = "ng-invalid ng-dirty";
      }
      if (!this.selectedRemoteVLAN) {
        this.validator_class_remote_VLAN = "ng-invalid ng-dirty";
      }
    }
  }
  callRunTest(
    cfm: CFM,
    local_device: local_device,
    remote_device: remote_device,
    loopback: loopback,
    createthroghtput: createthroghtput,
    Throughput: Throughput
  ) {
    let data = this.packData(
      cfm,
      local_device,
      remote_device,
      loopback,
      createthroghtput,
      Throughput
    );
    data = this.packData(
      cfm,
      local_device,
      remote_device,
      loopback,
      createthroghtput,
      Throughput
    );

    this.ThroughputsService.createThroughputNow(data).subscribe({
      next: data => {
        // alert(data);

        const totalMinutes =
          (Throughput.duration + 1) * createthroghtput.frame_length.length;
        if (totalMinutes >= 60) {
          const hours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;

          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Throughput is testing now. Test results will be completed in ${hours} hours ${remainingMinutes.toFixed(
              0
            )} minutes.`
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Throughput is testing now. Test results will be completed in ${totalMinutes.toFixed(
              0
            )} minutes.`
          });
        }
        this.TPRunTestDialog = false;
        // this.resultstart = data;
        // this.loading_Result = false;
      },
      error: error => {
        if (error.status == "400") {
          this.messageService.add({
            severity: "warning",
            summary: "Warning",
            detail: "Throughput is testing, please try again later"
          });
        } else if (error.status == "422") {
          this.messageService.add({
            severity: "warning",
            summary: "Warning",
            detail: "Please try again later"
          });
        }
      }
    });

    this.checkInvalid();
  }

  checkInvalid() {
    if (this.local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (this.remote_device.IPADDRESS == undefined) {
      this.validator_class_remote_device = "ng-invalid ng-dirty";
    }
    if (this.local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (this.remote_device.IPADDRESS == undefined) {
      this.validator_class_remote_device = "ng-invalid ng-dirty";
    }

    // if (
  }

  openScheduleTaskDialog(local_device: local_device, Throughput: Throughput) {
    this.submitted_CFM = true;
    this.submitted_duration = true;
    this.submitted_CFMlsimple1past = true;
    local_device.username = this.user_local1;
    local_device.password = this.password_local1;

    if (Throughput.mode == undefined) {
      this.invinvalid_selectedMode = "ng-invalid ng-dirty";
    } else {
      this.invinvalid_selectedMode = undefined;
    }
    if (local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    } else {
      this.validator_class_local_device = undefined;
    }
    if (this.selectedLocalVLAN == undefined) {
      this.validator_class_local_VLAN = "ng-invalid ng-dirty";
    } else {
      this.validator_class_local_VLAN = undefined;
    }
    if (this.selectedRemoteVLAN == undefined) {
      this.validator_class_remote_VLAN = "ng-invalid ng-dirty";
    } else {
      this.validator_class_remote_VLAN = undefined;
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    if (
      this.service !== undefined &&
      local_device.IPADDRESS !== undefined &&
      Throughput.mode !== undefined &&
      this.local_device.nni !== undefined &&
      this.remote_device.nni !== undefined
    ) {
      this.scheduleTaskDialog = true;
      this.submitted_CFM = false;
      this.dialogHeader = "Create throughput test schedule";
    } else if (
      (this.service == undefined,
      local_device.IPADDRESS == undefined,
      Throughput.mode == undefined)
    ) {
      this.scheduleTaskDialog = false;
    }
  }
  openScheduleTaskDialog_ad(
    local_device: local_device,
    Throughput: Throughput
  ) {
    this.submitted_CFM = true;
    this.submitted_duration = true;
    this.submitted_CFMlsimple1past = true;
    this.submitted_throughtputbut = true;
    local_device.username = this.user_local;
    local_device.password = this.password_local;
    if (Throughput.mode == undefined) {
      this.invinvalid_selectedMode = "ng-invalid ng-dirty";
    }
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    if (
      this.service_ad !== undefined &&
      this.local_device_Object.IPADDRESS !== undefined &&
      Throughput.mode !== undefined
    ) {
      this.scheduleTaskDialog_ad = true;
      this.submitted_CFM = false;
      this.dialogHeader = "Create throughput test schedule";
    } else if (
      (this.service_ad == undefined,
      this.local_device_Object.IPADDRESS == undefined,
      Throughput.mode == undefined)
    ) {
      this.scheduleTaskDialog_ad = false;
    }
  }
  onChangeScheduleMode(event) {
    this.scheduleTask.mode = event.value.name;
  }

  saveScheduleTask(
    local_device: local_device,
    Throughput: Throughput,
    scheduleTask,
    cfm: CFM,
    remote_device: remote_device,
    loopback: loopback,
    createthroghtput: createthroghtput
  ) {
    let data = this.packData(
      cfm,
      local_device,
      remote_device,
      loopback,
      createthroghtput,
      Throughput
    );
    data = this.packData(
      cfm,
      local_device,
      remote_device,
      loopback,
      createthroghtput,
      Throughput
    );
    const year = scheduleTask.startDate.getFullYear(); // Get last two digits of the year
    const month = (scheduleTask.startDate.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Month is 0-indexed
    const day = scheduleTask.startDate
      .getDate()
      .toString()
      .padStart(2, "0");
    const hours = scheduleTask.startDate
      .getHours()
      .toString()
      .padStart(2, "0");
    const minutes = scheduleTask.startDate
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const seconds = scheduleTask.startDate
      .getSeconds()
      .toString()
      .padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    this.ThroughputsService.createThroughputSchedule({
      datetime: scheduleTask.startDate,
      data: data
    }).subscribe({
      next: data => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Schedule is created !"
        });
        this.scheduleTaskDialog = false;
        this.scheduleTask.startDate = undefined;
        this.scheduleTask.name = "";
      },
      error: error => {
        if (error.status == 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        }
        if (error) {
        }
      }
    });
    this.changeDetection.detectChanges();
  }

  saveScheduleTask_ad(Throughput: Throughput, scheduleTask) {
    Throughput.service = this.service_ad;
    this.scheduleTask.mode = this.selectedScheduleMode.name;
    this.scheduleTaskDialog_ad = false;
    this.scheduleTask = {};
    this.selectedScheduleMode = this.scheduleModes[0];
    this.schedulecreate = {
      schedule: {
        mode: scheduleTask.mode,
        startDate: scheduleTask.startDate,
        startTime: scheduleTask.startTime,
        name: scheduleTask.name,
        email: scheduleTask.email,
        phone: scheduleTask.phone
      },
      begin_tp_test: {
        username: this.user_local,
        password: this.password_local,
        ipaddress: this.local_device_Object.IPADDRESS,
        service: this.service_ad,
        mode: Throughput.mode,
        duration: this.duration_ad
      }
    };
    this.ThroughputsService.Createthroughputtestschedule(this.schedulecreate);
    this.changeDetection.detectChanges();
  }
  callStartthroughputTest(local_device: local_device, Throughput: Throughput) {
    this.submitted_CFM = true;
    this.submitted_duration = true;
    this.submitted_CFMlsimple1past = true;
    if (Throughput.mode == undefined) {
      this.invinvalid_selectedMode = "ng-invalid ng-dirty";
    }
    if (local_device.IPADDRESS == undefined) {
      this.validator_class_local_device = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device = "";
    }
    if ((this.resultstart = "")) {
      this.resultstart = "pending ...";
      this.loading_Result = true;
    }
    if (
      this.service !== undefined &&
      local_device.IPADDRESS !== undefined &&
      Throughput.mode !== undefined
    ) {
      this.Throughput = Throughput;
      Throughput.service = this.service;
      Throughput.username = this.user_local1;
      Throughput.password = this.password_local1;
      Throughput.ipaddress = local_device.IPADDRESS;
      Throughput.duration = this.duration;
      this.action_Dialog_StartThroughputtest = true;
      this.dialogHeader = "Start Throughput test";
      this.ThroughputsService.Startthroughput(this.Throughput).subscribe({
        next: data => {
          this.resultstart = data;
          this.loading_Result = false;
        },
        error: error => {
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
          if (error) {
            this.resultstart = error.message;
            this.loading_Result = false;
          }
        }
      });
    }
    this.loading_Result = true;
  }

  addFrameLength() {
    if (this.newFrameLength) {
      this.frameLengths.push(this.newFrameLength);
      this.newFrameLength = null; // Reset the input field
    }
  }

  removeFrameLength(index: number) {
    this.frameLengths.splice(index, 1);
  }

  callStartthroughputTest_ad(Throughput: Throughput) {
    this.submitted_duration2func = true;
    this.submitted_userpass2func = true;
    this.required = true;
    Throughput.mode = this.Throughput_2func.mode;
    Throughput.duration = this.duration_ad;
    if (this.local_device_Object.IPADDRESS == undefined) {
      this.validator_class_local_device2func = "ng-invalid ng-dirty";
    }
    if (
      this.ThroughputsService.local_devices !== undefined &&
      this.ThroughputsService.local_devices !== ""
    ) {
      this.validator_class_local_device2func = "";
    }
    if ((this.resultstart_2func = "")) {
      this.resultstart_2func = "pending ...";
      this.loading_Result = true;
    }
    if (
      this.service !== undefined &&
      this.user_local !== undefined &&
      this.password_local !== undefined &&
      this.local_device_Object.IPADDRESS !== undefined
    ) {
      this.Throughput_2func = Throughput;
      Throughput.service = this.service_ad;
      Throughput.username = this.user_local;
      Throughput.password = this.password_local;
      Throughput.ipaddress = this.local_device_Object.IPADDRESS;
      Throughput.mode = this.Throughput_2func.mode;
      Throughput.duration = this.duration_ad;
      this.action_Dialog_StartThroughputtest2func = true;
      this.dialogHeader = "Start Throughput test";
      this.ThroughputsService.Startthroughput(this.Throughput_2func).subscribe({
        next: data => {
          this.resultstart_2func = data;
          this.loading_Result = false;
        },
        error: error => {
          if (error.status == 401) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Session expired, please logout and login again."
            });
          }
          if (error) {
            this.resultstart_2func = error.message;
            this.loading_Result = false;
          }
        }
      });
    }
    this.loading_Result = true;
  }
}
