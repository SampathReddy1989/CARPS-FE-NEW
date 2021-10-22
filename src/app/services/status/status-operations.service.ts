import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StatusCodeOperations } from 'src/app/models/status-code-operations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusOperationsService {

  constructor(private Http: HttpClient) { }

  addStatusCode(data: StatusCodeOperations): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/addStatusCodeOperation`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }

  getAllStatusCode(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getStatusCodeOperation/` + cid);
  }

  getStatusByScenarioAndClient(cid: number, sid: number, stid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getStatusCodeOperation/` + cid + `/scenario/` + sid + `/status/` + stid);
  }

  updateStatusCodeOperation(data: StatusCodeOperations): Observable<any> {
    return this.Http.put(`${environment.apiUrl}/updateStatusCodeOperation/`, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }
}
