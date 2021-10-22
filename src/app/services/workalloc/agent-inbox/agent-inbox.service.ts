import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AgentInboxOperations } from "src/app/models/agent-inbox-ops";

@Injectable({
  providedIn: "root",
})
export class AgentInboxService {
  constructor(private http: HttpClient) {}

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
      `${environment.apiUrl}/Inbox/agentStatusWiseSummaryInfo/Client/` +
        cid +
        `/ImpId/` +
        impid
    );
  }

  getDbFilterList(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Inbox/dbfilterListLoad/Client/` + cid
    );
  }

  getFileList(cid: number, user: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Inbox/fileList/Client/` +
        cid +
        `/CurentUser/` +
        user
    );
  }

  getAccountAvailableForAllocationScreen(
    data: AgentInboxOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/Inbox/getAccountAvailableForAllocationScreen/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  getCustomSearchDropdownValueList(
    data: AgentInboxOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/Inbox/getCustomSearchDropdownValueList/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  getSelectedAccountDetails(
    cid: number,
    user: string,
    rowid: number
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Inbox/getSelectedAccountDetails/Client/` +
        cid +
        `/User/` +
        user +
        `/RowId/` +
        rowid
    );
  }

  getSortFieldForClient(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Inbox/SortFieldForCurrentClient/Client/` + cid
    );
  }
}
