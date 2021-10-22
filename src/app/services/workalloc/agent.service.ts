import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgentAllocationOperations } from 'src/app/models/agent-alloc-ops';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(private Http: HttpClient) { }

  getFileList(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/fileList/Client/` + cid);
  }

  getDbFilterList(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/dbfilterListLoad/Client/` + cid);
  }

  getAgentForClient(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/AgentForSelectedClient/Client/` + cid);
  }

  getSortFieldForClient(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/SortFieldForCurrentClient/Client/` + cid);
  }

  getAgingSummaryClient(cid: number, impid: string): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/agentAgingWiseSummaryInfo/Client/` + cid + `/ImpId/` + impid);
  }

  getStatusSummaryClient(cid: number, impid: string): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/agentStatusWiseSummaryInfo/Client/` + cid + `/ImpId/` + impid);
  }

  postAccountAllocationUser(data: AgentAllocationOperations): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/getAccountAvailableForAllocationScreen/`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }

  postCustomSearchDropdownList(data: AgentAllocationOperations): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/getCustomSearchDropdownValueList/`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }

  postAllotsAgent(data: AgentAllocationOperations): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/AllotsAgent/`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }
}
