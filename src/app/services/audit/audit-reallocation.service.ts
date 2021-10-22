import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuditAllocation } from 'src/app/models/audit-allocation';

@Injectable({
  providedIn: 'root'
})
export class AuditReallocationService {
  constructor(private http: HttpClient) {}

  getFileList(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/reallot/fileList/Client/` + cid
    );
  }

  getDbFilterList(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/reallot/dbfilterListLoad/Client/` + cid
    );
  }

  getAgentForClient(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/reallot/AgentForSelectedClient/Client/` + cid
    );
  }

  getSortFieldForClient(cid: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/reallot/SortFieldForCurrentClient/Client/` + cid
    );
  }

  getAgingSummaryClient(cid: number, impid: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/reallot/agentAgingWiseSummaryInfo/Client/` +
        cid +
        `/ImpId/` +
        impid
    );
  }

  getStatusSummaryClient(cid: number, impid: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/audit/reallot/agentStatusWiseSummaryInfo/Client/` +
        cid +
        `/ImpId/` +
        impid
    );
  }

  postAccountreAllocationUser(data: AuditAllocation): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/audit/reallot/getAccountAvailableForAllocationScreen/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  postCustomSearchDropdownList(
    data: AuditAllocation
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/audit/reallot/getCustomSearchDropdownValueList/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  // reAssign(data: AuditAllocation): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/Reallot/AllotsAgent/`, data, {
  //     headers: { accept: "*/*", "Content-Type": "application/json" },
  //   });
  // }

  // reallotAccountFromSelectedAgent(
  //   data: AuditAllocation
  // ): Observable<any> {
  //   return this.http.post(
  //     `${environment.apiUrl}/audit/reallot/reallotsAccountsToSelectedAuditors/`,
  //     data,
  //     {
  //       headers: { accept: "*/*", "Content-Type": "application/json" },
  //     }
  //   );
  postreAllotsAgent(data: AuditAllocation): Observable<any> {
    return this.http.post(`${environment.apiUrl}/audit/reallot/reallotsAccountsToSelectedAuditors/`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }
  }


