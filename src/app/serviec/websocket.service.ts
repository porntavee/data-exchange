import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  websocket: WebSocket;
  consoleMessage: string[] = [];
  connectionStatus: Subject<boolean> = new Subject();
  consoleMessageChange: Subject<string> = new Subject();
  consoleError: Subject<boolean> = new Subject();

  constructor() { 
    // this.consoleMessageChange.subscribe((value) => {
    //     this.consoleMessage.push(value);
    //     // console.log(value)
    //   });
  }
  


  public addMessage(message:string){
    this.consoleMessageChange.next(message);
    // console.log(message)
    this.consoleMessage.push(message);
  }

  public openWebSocket(){
    let token = localStorage.getItem('token')
    this.websocket = new WebSocket(`${environment.websocketUrl}/?token=${token}`);

    this.websocket.onopen = (event) =>{
      // console.log('Open: ', event);
      this.connectionStatus.next(true);
      // console.log('Open: ', event);
    }

    this.websocket.onmessage = (event) =>{
      // //console.log(event.data);
      let responseMessage = event.data;

      // const responseMessage = JSON.parse(event.data);
      this.addMessage(event.data);
     
    }

    this.websocket.onclose = (event) =>{
      this.connectionStatus.next(false)
      
      // console.log('Close: ', event);
      this.consoleMessage = [];
      // //console.log(this.consoleMessage)
    }

    this.websocket.onerror = (event) =>{
      this.consoleError.next(false)
      // console.log('Error: ', event);
    }
  }


  public sendCommand(command: string){
    let commadPayload = {
     
        command : command
      
    }
    // console.log(commadPayload)
    let commadJsonPayload = JSON.stringify(commadPayload)
    this.websocket.send(commadJsonPayload)
  }

  public sendDeviceConnectionCommand(ipaddress: string,username: string,password:string){
    let connectionPayload = {
      
        host: ipaddress,
        username: username,
        password: password
      
    }
    
    let jsonPayload = JSON.stringify(connectionPayload)
    // console.log(connectionPayload)
    this.websocket.send(jsonPayload)
  }
  

  public closeWebSocket(){
    this.websocket.close()
  }

  public getConsoleMessage(){
    return this.consoleMessage.toString();
  }
  
  public isConnection(){
    return this.connectionStatus
  }
}
