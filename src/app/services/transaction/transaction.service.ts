import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AgentTransactionOperations } from "src/app/models/agent-transaction-ops";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  getAllActioncodeOperation(cid: number, statusId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/getAllActioncodeOperation/Client/` +
        cid +
        `/Status/` +
        statusId
    );
  }

  getAllScenarioMaster(cid: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/getAllScenarioMaster/` + cid);
  }

  getAllStatusCodeOperation(cid: number, scnId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/getAllStatusCodeOperation/Client/` +
        cid +
        `/Scenario/` +
        scnId
    );
  }

  saveCurrentAccountByClickingSaveButton(
    data: AgentTransactionOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/saveCurrentAccountByClickingSaveButton`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  saveCurrentAccountByClickingTempSaveButton(
    data: AgentTransactionOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/saveCurrentAccountByClickingTempSaveButton`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }
}
