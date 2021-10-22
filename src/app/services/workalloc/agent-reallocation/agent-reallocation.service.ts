import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AgentAllocationOperations } from "src/app/models/agent-alloc-ops";

@Injectable({
  providedIn: "root",
})
export class AgentReallocationService {
  constructor(private http: HttpClient) {}

  getFileList(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Reallot/fileList/Client/` + cid
    );
  }

  getDbFilterList(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Reallot/dbfilterListLoad/Client/` + cid
    );
  }

  getAgentForClient(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Reallot/AgentForSelectedClient/Client/` + cid
    );
  }

  getSortFieldForClient(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Reallot/SortFieldForCurrentClient/Client/` + cid
    );
  }

  getAgingSummaryClient(cid: number, impid: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Reallot/agentAgingWiseSummaryInfo/Client/` +
        cid +
        `/ImpId/` +
        impid
    );
  }

  getStatusSummaryClient(cid: number, impid: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Reallot/agentStatusWiseSummaryInfo/Client/` +
        cid +
        `/ImpId/` +
        impid
    );
  }

  postAccountAllocationUser(data: AgentAllocationOperations): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/Reallot/getAccountAvailableForAllocationScreen/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  postCustomSearchDropdownList(
    data: AgentAllocationOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/Reallot/getCustomSearchDropdownValueList/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  reAssign(data: AgentAllocationOperations): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Reallot/AllotsAgent/`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }

  releaseAccountFromSelectedAgent(
    data: AgentAllocationOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/Reallot/releaseAccountFromSelectedAgent`,
      data,
      {
        headers: { accept: "*/*", "Content-Type": "application/json" },
      }
    );
  }
}
