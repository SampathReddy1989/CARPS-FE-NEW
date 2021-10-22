import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private Http: HttpClient) { }

  downloadInValidRecords(cid: number, uid: number | string): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/download/invalidRecords/User/` + uid + `/Client/` + cid,
    { headers: { 'accept': '*/*', 'Content-Type': 'application/octet-stream' } });
  }

  getInValidRecords(cid: number, uid: number | string, fname: string): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getInvalidRecords/User/` + uid + `/Client/` + cid);
  }

  getInValidRecordCount(cid: number, uid: number | string, fname: string): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getInvalidRecordCount/User/` + uid + `/Client/` + cid + `/FileName/` + fname);
  }

  postUploadFileUrl(cid: number, uid: number | string): string {
    return `${environment.apiUrl}/uploadFileValue/User/` + uid + `/Client/` + cid;
  }

  saveInventoryConfiguration(cid: number, uid: number | string, fname: string, data: any): Observable<any> {
    return this.Http.put(`${environment.apiUrl}/saveConfig/User/` + uid + `/Client/` + cid + `/FileName/` + fname, data,
      { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });
  }
}
