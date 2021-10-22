import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditAllocation } from 'src/app/models/audit-allocation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditAllocationService {
  postAllotsAgent1(agentAssignData: AuditAllocation) {
    throw new Error("Method not implemented.");
  }
  reallotAccountFromSelectedAgent(agentAssignData: AuditAllocation) {
    throw new Error("Method not implemented.");
  }
  
constructor(private Http: HttpClient) { }

  getFileList(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/audit/fileList/Client/` + cid);
  }

  getDbFilterList(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/audit/dbfilterListLoad/Client/` + cid);
  }

  getAgentForClient(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/audit/AgentForSelectedClient/Client/` + cid);
  }

  getSortFieldForClient(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/audit/SortFieldForCurrentClient/Client/` + cid);
  }

  getAgingSummaryClient(cid: number, impid: string): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/audit/agentAgingWiseSummaryInfo/Client/` + cid + `/ImpId/` + impid);
  }

  getStatusSummaryClient(cid: number, impid: string): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/audit/agentStatusWiseSummaryInfo/Client/` + cid + `/ImpId/` + impid);
  }

  postAccountAllocationUser(data: AuditAllocation): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/audit/getAccountAvailableForAllocationScreen/`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }

  postCustomSearchDropdownList(data: AuditAllocation): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/audit/getCustomSearchDropdownValueList/`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }

  postAllotsAgent(data: AuditAllocation): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/audit/allotsAccountsToSelectedAuditors/`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }
}

