import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserAccessOperation } from "src/app/models/user-access-operation";
import { environment } from "src/environments/environment";
import { AccessMasterOperations } from "src/app/models/access-master-operations";

// @Injectable({
//   providedIn: 'root'
// })
// export class UserOperationService {

//   constructor(private Http: HttpClient) { }

//   addUser(data: UserAccessOperation): Observable<any> {
//     return this.Http.post(`${environment.apiUrl}/addUserAccessOperation/`, data,
//       { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
//   }

//   getAllUserCode(cid: number): Observable<any> {
//     return this.Http.get(`${environment.apiUrl}/getUserAccessOperation/Client/` + cid);
//   }

//   getUserClientCode(cid: number, uid: number): Observable<any> {
//     return this.Http.get(`${environment.apiUrl}/getUserAccessOperation/Client/` + cid + `/User/` + uid);
//   }

//   getAllClient(active: string): Observable<any> {
//     return this.Http.get(`${environment.apiUrl}/getUserAccessOperation/Client/Active/` + active);
//   }

//   updateUserAccessOperation(data: UserAccessOperation): Observable<any> {
//     return this.Http.put(`${environment.apiUrl}/updateUserAccessOperation/`, data,
//       { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
//   }
// }

@Injectable({
  providedIn: "root",
})
export class AccessMasterOperationService {
  constructor(private Http: HttpClient) {}

  addUser(data: AccessMasterOperations): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/addNewUser/`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }

  getAllActiveClient(): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getAllActiveClient/`);
  }

  getUserByClient(cid: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getUser/Client/` + cid);
  }

  disablePassword(ntlg: string): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/passwordDisable/User/` + ntlg);
  }

  updateUser(data: AccessMasterOperations): Observable<any> {
    return this.Http.put(`${environment.apiUrl}/updateUser/`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }
}
