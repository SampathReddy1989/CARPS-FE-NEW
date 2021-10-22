import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ScenarioMaster } from "src/app/models/scenario-master";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ScenarioOperationsService {
  constructor(private Http: HttpClient) {}

  addScenario(data: ScenarioMaster): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/addScenarioMaster`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }

  getAllScenario(cid: number): Observable<any> {
    return this.Http.get(
      `${environment.apiUrl}/getScenarioMaster/Client/` + cid
    );
  }

  getScenarioByClient(cid: number, sid: number): Observable<any> {
    return this.Http.get(
      `${environment.apiUrl}/getScenarioMaster/Client/` +
        cid +
        `/Scenario/` +
        sid
    );
  }

  updateScenario(data: ScenarioMaster): Observable<any> {
    return this.Http.put(`${environment.apiUrl}/updateScenarioMaster`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }
}
