import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { WebsocketService } from "@app/serviec/websocket.service";
import { observable, Observable, Subject, Subscription } from "rxjs";
import { getEffectiveConstraintOfTypeParameter } from "typescript";
import { TerminalService } from "primeng/terminal";
import { takeLast } from "rxjs-compat/operator/takeLast";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService, ConfirmationService } from "primeng/api";
import { NgTerminal } from "ng-terminal";
import { NavigateService } from "app/navigateservice";
import { Terminal } from "xterm";
import { Title } from "@angular/platform-browser";
import { RemoteService } from "@app/pages/remote-command/remote-command.service";
import { data } from "jquery";
import { ThemeService } from "app/theme.service";
export interface webSocketRespone {
  message?: string;
  prompt_header?: string;
}

@Component({
  selector: "app-remote-command",
  moduleId: module.id,
  templateUrl: "remote-command.component.html",
  styles: [
    `
      :host ::ng-deep .p-dialog .user-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }

      .p-terminal {
        font-size: 18px;
        height: 20rem;
      }
    `
  ],
  styleUrls: ["remote-command.component.scss"],
  providers: [TerminalService]
})
export class RemoteCommandComponent {
  default_terminal_prompt: string = "";
  terminal_prompt: string = "";
  terminal_prompts: string = "";
  underlying: Terminal;
  input_command: string = "";
  stateController: string = "";
  websocketConnectStatus: boolean = false;
  deviceConnectStatus: boolean = false;
  // input_command_user: string = "";
  // terminal_user: string = "";
  // check: boolean = false;
  // check2: boolean = false;
  // check3: boolean = false;
  // check4: boolean = false;
  // check5: boolean = false;
  deviceIP: string = "";
  deviceUsername: string = "";
  devicePassword: string = "";
  isPasswordState: boolean = false;
  IP_address: string;
  prompt_header: string;
  //websocket_connect_status: Observable<boolean>;
  // ip: string = "";
  // username: string = "";
  // password: string = "";
  // send: string = "";
  // send2: string = "";
  // result: string = "";
  // prompt: string = "";
  // change: string = "";
  @ViewChild("term", { static: true }) child: NgTerminal;
  constructor(
    public webSocketService: WebsocketService,
    private terminalService: TerminalService,
    private RemoteService: RemoteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private titleService: Title,
    private navigator: NavigateService,
    public themeService: ThemeService
  ) {
    this.titleService.setTitle("SED-Remote");
    this.webSocketService.connectionStatus.subscribe({
      next: status => {
        // console.log(status);
        if (status) {
          // console.log("test22")
          this.websocketConnectStatus = true;
          this.child.write(
            "Please type the IP address, username and password to begin the connection.\r\n"
          );
          if (this.IP_address == undefined){
          this.terminal_prompt = "IP Address: ";
          this.stateController = "ipState";
          this.child.write(this.terminal_prompt);
          }
          else {
          this.terminal_prompt = "IP Address: " + this.IP_address;
          this.stateController = "usernameState";
          this.terminal_prompts = "Username: ";
          this.child.write(this.terminal_prompt);
          this.child.write("\n\r");
          this.child.write(this.terminal_prompts);

          }
          this.webSocketService.consoleMessageChange.subscribe(value => {
            // var listvalue = []
            this.stateController = "prompt_header";
            let Respone: webSocketRespone = JSON.parse(value);
            //TODO handle massage from server

            this.child.write(Respone.message);
            this.child.write("\n\r");
            this.child.write(Respone.prompt_header);
            this.prompt_header = Respone.prompt_header;
            // console.log(Respone.prompt_header);
          });
        } else {
          
          this.child.write(
            "Webssocket Disconnection. Please press Enter button to reconnect.\r\n"
          );
          this.webSocketService.consoleMessageChange = new Subject();
          // this.webSocketService.consoleMessageChange.subscribe(value => {
            // console.log("test1")
          //   this.stateController = "prompt_header";
          //   let Respone: webSocketRespone = JSON.parse(value);
          //   //TODO handle massage from server

          //   this.child.write(Respone.message);
          //   this.child.write("\n\r");
          //   this.child.write(Respone.prompt_header);
            
          //   // console.log(Respone.prompt_header);
          // });
          this.websocketConnectStatus = false;
          this.stateController = "reconnect";
        }
      }
    });

    // this.terminalService.commandHandler.subscribe(command => {

    //   if (command === "connect to server") {
    //     this.webSocketService.openWebSocket();
    //   }
    //   else {
    //     this.webSocketService.sendCommand(command);
    //   }
    //   //let response = (command === 'date') ? new Date().toDateString() : '2 ' + command;
    //   //this.terminalService.sendResponse(response);
    //   // this.terminal_prompt = command;
    // });

    // this.terminalService.responseHandler.subscribe(response => {
    //   //  //console.log("recive : " + response);
    //   this.terminal_prompt = response;
    // });

    // this.terminalService.responseHandler.subscribe(command => {
    //   this.webSocketService.sendCommand(command);
    //   // let response = (command === 'date') ? new Date().toDateString() : '2 ' + command;
    //   // this.terminalService.sendResponse(response);
    //   // this.terminal_prompt = command;
    // });

    //this.console_output = this.webSocketService.message;
    //console.log("service message " + this.webSocketService.message);
  }
  ngAfterViewInit() {
    this.themeService.currentpage("/telnet")
    this.IP_address = history.state.data;
    this.webSocketService.openWebSocket();
    this.underlying = this.child.underlying;
    this.underlying.setOption("fontSize", 20);

    this.child.keyEventInput.subscribe(e => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      const currsorMoveAble =
        ev.keyCode === 37 ||
        ev.keyCode === 38 ||
        ev.keyCode === 39 ||
        ev.keyCode === 40;

      if (ev.keyCode === 13) {
        if (!this.websocketConnectStatus) {
          switch (this.stateController) {
            case "reconnect":
              this.webSocketService.openWebSocket();
              break;
            default:
              this.child.write(
                "Webssocket connection failed. Please pess Enter button to reconnect."
              );
              this.stateController = "reconnect";
          }
        } else if (!this.deviceConnectStatus) {
          switch (this.stateController) {
            case "ipState":
              this.deviceIP = this.input_command;
              this.terminal_prompt = "Username: ";
              this.stateController = "usernameState";
              this.child.write("\n\r");
              this.child.write(this.terminal_prompt);
              break;
            case "usernameState":
              this.deviceUsername = this.input_command;
              this.isPasswordState = true;
              this.terminal_prompt = "Password: ";
              this.child.write("\n\r");
              this.child.write(this.terminal_prompt);
              this.stateController = "passwordState";
              break;
            case "passwordState":
              this.devicePassword = this.input_command;
              this.isPasswordState = false;
              this.terminal_prompt = "";
              if (this.IP_address == undefined) {
                this.webSocketService.sendDeviceConnectionCommand(
                  this.deviceIP,
                  this.deviceUsername,
                  this.devicePassword
                );
              } else {
                this.webSocketService.sendDeviceConnectionCommand(
                  this.IP_address,
                  this.deviceUsername,
                  this.devicePassword
                );
              }

              this.child.write("\n\r");
              this.child.write(this.terminal_prompt);
              break;
            case "prompt_header":
              // this.devicePassword = this.input_command;
              // this.isPasswordState = false;
              if (
                this.input_command == "cls" ||
                this.input_command == "clear"
              ) {
                // this.child.write("\n\r");
                this.child.underlying.reset();
                this.child.write(this.prompt_header);
              } else {
                this.webSocketService.sendCommand(this.input_command);
                this.child.write("\n\r");
              }

              break;
          }
        }

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
        this.input_command += e.key;
        if (this.isPasswordState) {
          this.child.write("*");
        } else {
          this.child.write(e.key);
        }
      }
    });

    //...
  }

 
  // connect() {
  //   this.child.write('\n \r');
  //   this.child.write('\n \r');
  //   this.child.write('------------------------------------------');
  //   this.child.write('\n \r');
  //   // this.input_command = ""
  //   if (this.input_command !== "") {
  //     this.password = this.input_command;
  //     console.log(this.password)
  //     this.child.write("connect to server");
  //     this.RemoteService.loaddata().subscribe({
  //       next: data => {
  //         this.result = data[0].result;
  //         this.prompt = data[0].prompt;
  //         if (this.input_command !== "") {
  //           this.child.write('\n \r');
  //           this.child.write(this.prompt);
  //           this.check3 = true;
  //           this.input_command = ""
  //           // this.send = this.input_command;
  //           // console.log(this.send)
  //         }
  //       },
  //       error: error => {
  //         if (error.status == '401') {
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Session expired, please logout and login again.' });
  //         }
  //       }
  //     });

  //   }
  // }
  // checkchange() {
  //   this.child.write('\n \r');
  //   // this.input_command = ""

  //   this.RemoteService.loaddata().subscribe({
  //     next: data => {
  //       this.result = data[1].result;
  //       this.prompt = data[1].prompt;
  //       this.child.write(this.result);

  //       if (this.input_command !== "") {

  //         // console.log(this.check4)
  //         // this.child.write('\n \r');
  //         // this.child.write(this.prompt);
  //         this.send = this.input_command;
  //         this.changeprompt();
  //         this.input_command = ""

  //       }

  //     },
  //     error: error => {
  //       if (error.status == '401') {
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Session expired, please logout and login again.' });
  //       }
  //     }
  //   });

  // }
  // changeprompt() {
  //   var re = /this.send/gi;
  //   var str = "cd .. ";
  //   if (str.search(re) == -1) {
  //     var ret = this.send.replace(str, '');
  //     if (this.send.length > ret.length) {
  //       this.check4 = true;
  //       this.change = ret + ">";
  //       // this.child.write('\n \r');
  //       // this.child.write(this.change);
  //       // console.log(this.check4)
  //       console.log(this.change)
  //     }
  //     else {
  //       // this.check4 = true;
  //       // console.log(this.check4)
  //       this.check4 = false;
  //       console.log(ret)
  //     }
  //     if (this.check4 == false) {
  //       this.child.write('\n \r');
  //       this.child.write(this.prompt);
  //       // console.log(this.check4)
  //     }
  //     else {
  //       this.child.write('\n \r');
  //       this.child.write(this.change + " ");
  //       this.check5 = true
  //     }

  //   } else {
  //     console.log("NO");
  //   }
  // }
  // whenchange() {
  //   this.child.write('\n \r');
  //   // this.input_command = ""
  //   if (this.input_command !== "") {
  //     this.RemoteService.loaddata().subscribe({
  //       next: data => {
  //         this.result = data[1].result;
  //         this.prompt = data[1].prompt;
  //         this.child.write(this.result);

  //         this.child.write('\n \r');
  //         this.child.write(this.change + " ");
  //         // this.check4 = true;
  //         this.send = this.input_command;
  //         this.changeprompt();
  //         this.input_command = ""
  //         // this.send = this.input_command;
  //         console.log(this.check4)

  //       },
  //       error: error => {
  //         if (error.status == '401') {
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Session expired, please logout and login again.' });
  //         }
  //       }
  //     });

  //   }
  // }
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {}
}
