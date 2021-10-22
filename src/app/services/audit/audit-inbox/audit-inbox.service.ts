import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuditInboxOperations } from "src/app/models/audit-inbox-ops";

@Injectable({
  providedIn: "root",
})
export class AuditInboxService {
  constructor(private http: HttpClient) {}

  getAgingSummaryClient(cid: number, impid: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/inbox/agentAgingWiseSummaryInfo/Client/` +
        cid +
        `/ImpId/` +
        impid
    );
  }

  getStatusSummaryClient(cid: number, impid: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/inbox/agentStatusWiseSummaryInfo/Client/` +
        cid +
        `/ImpId/` +
        impid
    );
  }

  getDbFilterList(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/inbox/dbfilterListLoad/Client/` + cid
    );
  }

  getFileList(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/inbox/fileList/Client/` + cid
    );
  }

  getAccountAvailableForAllocationScreen(
    data: AuditInboxOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/audit/inbox/getAccountAvailableForAllocationScreen/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  getCustomSearchDropdownValueList(
    data: AuditInboxOperations
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/audit/inbox/getCustomSearchDropdownValueList/`,
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
      `${environment.apiUrl}/audit/inbox/getSelectedAccountDetails/Client/` +
        cid +
        `/User/` +
        user +
        `/RowId/` +
        rowid
    );
  }

  getSortFieldForClient(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/inbox/SortFieldForCurrentClient/Client/` +
        cid
    );
  }
}
