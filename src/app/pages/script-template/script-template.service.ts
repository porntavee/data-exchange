import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Script } from "vm";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ScriptTemplateService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  constructor(private http: HttpClient) {}

  getScriptTemplate() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(environment.apiUrl + "/script/", {
      headers: headers
    });
  }
  valueSource(item){
    this.messageSource.next(item)
  }
  editScript(id, name, script, supported_models) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      name: name,
      script: script,
      supported_models: supported_models
    });
    return this.http.put<any>(`${environment.apiUrl}/script/${id}`, body, {
      headers: headers
    });
  }

  executeScript(IPADDRESS, script) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      IPADDRESS: IPADDRESS,
      script: script
    });
    return this.http.post<any>(`${environment.apiUrl}/script/run`, body, {
      headers: headers
    });
  }

  createScript(name, script, supported_models) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      name: name,
      script: script,
      supported_models: supported_models
    });
    return this.http.post<any>(`${environment.apiUrl}/script/`, body, {
      headers: headers
    });
  }

  deleteScript(id) {
    return this.http.delete<any>(`${environment.apiUrl}/script/${id}`);
  }
}
