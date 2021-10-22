import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActionCodeOperations } from 'src/app/models/action-code-operations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionOperationsService {

  constructor(private Http: HttpClient) { }

  addActionCode(data: ActionCodeOperations): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/addActioncodeOperation`, data,
      { headers: { accept: '*/*', 'Content-Type': 'application/json' } });
  }

  getAllActionCode(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getActioncodeOperations/Client/` + cid);
  }

  getActionByScenarioAndClient(cid: number, sid: number, aid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getActioncodeOperations/Client/` + cid + `/Scenario/` + sid + `/Action/` + aid);
  }

  updateActionCodeOperation(data: ActionCodeOperations): Observable<any> {
    return this.Http.put(`${environment.apiUrl}/updateActioncodeOperation/`, data,
      { headers: { accept: '*/*', 'Content-Type': 'application/json' } });
  }
}
