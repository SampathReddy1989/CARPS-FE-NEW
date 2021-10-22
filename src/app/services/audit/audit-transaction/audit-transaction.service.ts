import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuditTransactionOperations } from "src/app/models/audit-transaction-ops";

@Injectable({
  providedIn: "root",
})
export class AuditTransactionService {
  constructor(private http: HttpClient) {}

  getAllActioncodeOperation(cid: number, statusId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/getAllActioncodeOperation/Client/` +
        cid +
        `/Status/` +
        statusId
    );
  }

  getAllScenarioMaster(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/getAllScenarioMaster/` + cid
    );
  }

  getAllStatusCodeOperation(cid: number, scnId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/getAllStatusCodeOperation/Client/` +
        cid +
        `/Scenario/` +
        scnId
    );
  }

  getErrorCatagory(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/audit/getErrorCatagory/`);
  }

  getErrorSubCatagory(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/getErrorSubCatagory/` + cid + `/`
    );
  }

  saveAccount(data: AuditTransactionOperations): Observable<any> {
    return this.http.post(`${environment.apiUrl}/audit/saveAccount/`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }

  saveAccountWithError(data: AuditTransactionOperations): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/audit/saveAccountWithError/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  updateCurrentAccountByAuditor(
    data: AuditTransactionOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/audit/updateCurrentAccountByAuditor`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }
}
